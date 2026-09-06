/**
 * Lenco payment webhook. Confirms a payment cleared and emails the order to us.
 *
 * This is Option B: it notifies, it does not deliver. No licence key is issued
 * here. Keys are generated locally with each product's keygen/issue.mjs and sent
 * by a human, which means there is no key pool to run dry and no automated path
 * that can hand out a key for a payment that later reverses.
 *
 * Deliberate differences from the previous implementation:
 *
 *   No amount floor. The old version skipped anything under K2,900, written when
 *   the only product cost K3,000. GlamifiedSales is K1,800, so that rule would
 *   have taken the money and silently dropped the order. The amount is instead
 *   checked against the specific product that was bought.
 *
 *   Signature verification is mandatory. The old version only verified when both
 *   a secret and a header were present, so a request with no signature header
 *   was accepted. That is the whole attack: anyone who knew the URL could post a
 *   fake success.
 *
 * Required environment variables:
 *   LENCO_WEBHOOK_SECRET   shared secret from the Lenco dashboard
 *   SMTP_HOST/PORT/USER/PASS, FROM_EMAIL, ADMIN_EMAIL
 */

import crypto from "node:crypto";
import nodemailer from "nodemailer";

import site from "../../site.config.js";

const ok = (body = { received: true }) => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const secret = process.env.LENCO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("LENCO_WEBHOOK_SECRET is not set; refusing to trust this request");
    return { statusCode: 500, body: JSON.stringify({ error: "Not configured" }) };
  }

  const signature =
    event.headers["x-lenco-signature"] || event.headers["x-webhook-signature"];

  if (!signature) {
    // Refused rather than accepted. An unsigned request is exactly what a forged
    // "payment succeeded" looks like.
    console.warn("Webhook rejected: no signature header");
    return { statusCode: 401, body: JSON.stringify({ error: "Missing signature" }) };
  }

  const expected = crypto.createHmac("sha256", secret).update(event.body || "").digest("hex");
  const candidates = [expected, `sha256=${expected}`];
  const matches = candidates.some((c) => {
    // Constant-time compare, and only when lengths match: timingSafeEqual throws
    // on differing lengths, which would itself leak information.
    if (c.length !== signature.length) return false;
    return crypto.timingSafeEqual(Buffer.from(c), Buffer.from(signature));
  });

  if (!matches) {
    console.warn("Webhook rejected: signature mismatch");
    return { statusCode: 401, body: JSON.stringify({ error: "Invalid signature" }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const eventType = String(payload.event || payload.type || "");
  if (!/success|completed|paid/i.test(eventType)) {
    // Acknowledged so Lenco stops retrying, but nothing to do.
    return ok();
  }

  const txn = payload.data || payload.transaction || payload;
  const reference = txn.reference || txn.transactionReference || txn.id || "";
  const meta = txn.metadata || {};
  const slug = meta.slug || "";

  const customer = txn.customer || txn.customerData || {};
  const email = String(customer.email || txn.email || "").toLowerCase();
  const name = customer.name || txn.customerName || txn.name || "";
  const phone = customer.phone || txn.phone || "";

  if (!reference || !email) {
    console.error("Webhook missing reference or email:", { reference, email });
    return ok();
  }

  const product = (site.products ?? []).find((p) => p.slug === slug);

  /*
   * Amount check against the product that was actually bought, rather than one
   * floor for everything. Reported in minor units by Lenco, so compare in the
   * same units the request was created in.
   */
  const reported = Number(txn.amount ?? txn.transactionAmount ?? 0);
  const expectedMinor = product?.price ? product.price.amount * 100 : null;
  const underpaid = expectedMinor !== null && reported > 0 && reported < expectedMinor;

  const lines = [
    `Payment received${underpaid ? " — AMOUNT LOOKS SHORT, CHECK BEFORE ISSUING" : ""}`,
    "",
    `Product   : ${product ? product.name : slug || "unknown"}`,
    `Expected  : ${product?.price ? `${product.price.currency} ${product.price.amount}` : "unknown"}`,
    `Reported  : ${reported ? `${reported / 100} (minor units: ${reported})` : "not reported"}`,
    `Reference : ${reference}`,
    "",
    `Name      : ${name}`,
    `Email     : ${email}`,
    `Phone     : ${phone}`,
    "",
    product
      ? `Next: issue a key with ${product.name}'s keygen and email it to ${email}.`
      : `Next: could not match a product for slug "${slug}". Check before issuing anything.`,
  ];

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"${site.brand.name}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `Payment: ${product ? product.name : slug} — ${reference}`,
      text: lines.join("\n"),
    });
  } catch (error) {
    /*
     * Return 200 anyway. Lenco retries on a non-2xx, and a retry cannot fix a
     * broken mailbox: it would just repeat forever. The payment is real either
     * way, so the log is the record to reconcile from.
     */
    console.error("PAYMENT RECEIVED BUT EMAIL FAILED", {
      reference,
      email,
      product: product?.name ?? slug,
      error: error.message,
    });
  }

  return ok();
};
