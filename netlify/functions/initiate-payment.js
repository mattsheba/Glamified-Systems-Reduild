/**
 * Creates a Lenco payment and hands back a URL for the customer to pay at.
 *
 * Deliberate differences from the previous implementation, each of which was a
 * way to lose money:
 *
 *   Prices come from site.config.js, never from a table in this file. The old
 *   version hardcoded "Basic HR 1200 / HR + Payroll 2500 / Full Suite 3500",
 *   which stopped matching the products long before anyone noticed.
 *
 *   The product is looked up by slug and the amount is taken from that record.
 *   A caller cannot name its own price: anything posted as an amount is ignored.
 *
 *   It refuses to run unless payments.enabled is true in config, so the code can
 *   be reviewed and deployed before any real transaction is possible.
 *
 * Required environment variables:
 *   LENCO_SECRET_KEY   Lenco dashboard, Settings, API keys
 *   LENCO_API_URL      e.g. https://api.lenco.co/access/v2 (sandbox while testing)
 *   SITE_URL           https://glamifiedsystems.com
 */

import site from "../../site.config.js";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

/** Strip control characters and cap length. */
const clean = (value, max) => {
  if (typeof value !== "string") return "";
  let out = "";
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    out += code < 32 || code === 127 ? " " : ch;
  }
  return out.trim().slice(0, max);
};

const validEmail = (v) =>
  typeof v === "string" && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const handler = async (event) => {
  const payments = site.payments ?? {};

  // The safety catch. Nothing can be charged while this is off.
  if (!payments.enabled) {
    return json(503, { error: "Online payment is not enabled." });
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  if (!event.body || event.body.length > 20000) {
    return json(400, { error: "Invalid request" });
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 30);
  const slug = clean(body.slug, 60);

  if (!name || !email || !phone || !slug) {
    return json(400, { error: "Missing required fields: name, email, phone, slug" });
  }
  if (!validEmail(email)) {
    return json(400, { error: "Please enter a valid email address" });
  }
  if (!/^[0-9+()\-\s]{6,20}$/.test(phone)) {
    return json(400, { error: "Please enter a valid phone number" });
  }

  /*
   * The price is read from the product, not from the request. This is the whole
   * reason the endpoint takes a slug rather than an amount: a customer editing
   * the request cannot choose what to pay.
   */
  const product = (site.products ?? []).find((p) => p.slug === slug);
  if (!product) {
    return json(400, { error: "Unknown product" });
  }
  if (!product.price || typeof product.price.amount !== "number") {
    return json(400, { error: `${product.name} is not sold online` });
  }

  const amount = product.price.amount;
  const currency = product.price.currency || payments.currency || "ZMW";

  const secret = process.env.LENCO_SECRET_KEY;
  const apiUrl = process.env.LENCO_API_URL;
  const siteUrl = process.env.SITE_URL || site.seo.domain;

  if (!secret || !apiUrl) {
    // Configuration problem, not the customer's problem. Say so plainly in the
    // log and give them something they can act on.
    console.error("Lenco not configured: LENCO_SECRET_KEY or LENCO_API_URL missing");
    return json(500, { error: "Payment is temporarily unavailable. Please contact us." });
  }

  const reference = `GLAM-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  try {
    const response = await fetch(`${apiUrl.replace(/\/+$/, "")}/transactions/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        /*
         * Minor units. CONFIRM THIS AGAINST A SANDBOX PAYMENT before going live:
         * if Lenco expects kwacha rather than ngwee, this overcharges by 100x.
         * The previous implementation carried the same assumption with a comment
         * admitting it was unverified, which is not a thing to leave unverified
         * in a payment path.
         */
        amount: amount * 100,
        currency,
        reference,
        customer: { name, email, phone },
        metadata: {
          slug: product.slug,
          product: product.name,
          amountMajor: amount,
        },
        channels: payments.methods ?? ["airtel", "mtn", "card"],
        callback_url: `${siteUrl.replace(/\/+$/, "")}${payments.successPath}`,
        narration: `${product.name} licence`,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || result?.status === false) {
      console.error("Lenco initialize failed:", response.status, JSON.stringify(result));
      return json(502, { error: "Payment gateway error. Please try again." });
    }

    const paymentUrl =
      result?.data?.authorization_url ??
      result?.data?.paymentUrl ??
      result?.data?.url ??
      result?.authorization_url;

    if (!paymentUrl) {
      console.error("Lenco returned no payment URL:", JSON.stringify(result));
      return json(502, { error: "Payment gateway did not return a payment link." });
    }

    return json(200, { success: true, paymentUrl, reference, amount, currency });
  } catch (error) {
    console.error("Payment initiation threw:", error.message);
    return json(500, { error: "Failed to start payment. Please try again." });
  }
};
