/**
 * Engine leak detector — AC-1 and AC-2.
 *
 * The whole commercial case for this codebase is that a new industry variant is
 * a config file plus images. That holds only while no user-visible copy is baked
 * into markup. This script scans every .astro template for text that a visitor
 * could read and fails if it is not either a config expression or on the
 * reviewed exemption list below.
 *
 * The exemption list is the FR-1 "documented exemption block". Adding to it is a
 * deliberate act: everything here is engine chrome that stays identical across
 * every variant. Client-specific wording never belongs on this list.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");

/** Engine chrome. Identical in every variant, never client copy. */
const EXEMPT = new Set([
  // navigation & structural affordances
  "Skip to content",
  "Read more",
  "View demo",
  "about",
  // form field labels — engine UI, not client content
  "First name",
  "Last name",
  "Email",
  "Phone number",
  "Country",
  "Message",
  "Budget",
  "Organisation type",
  "What are you looking for?",
  "Send enquiry",
  "Sending...",
  "Prefer to talk now?",
  "Message us on WhatsApp",
  // footer & contact column headings
  "Contact",
  "Legal",
  "Quick links",
  "Phone",
  "Hours",
  "Privacy policy",
  "Terms of service",
  "Refund policy",
  // legal page chrome
  "Last updated",
  "Template: not yet reviewed.",
  "This document has not been checked by a lawyer. Have it reviewed before relying on it.",
]);

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".astro")) files.push(full);
  }
})(srcDir);

const findings = [];

for (const file of files) {
  const raw = readFileSync(file, "utf8");

  // Drop frontmatter — it is code, not markup.
  const parts = raw.split(/^---$/m);
  let template = parts.length >= 3 ? parts.slice(2).join("---") : raw;

  template = template
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // JSX comments
    .replace(/\{[^{}]*\}/g, " "); // config expressions

  // FR-2: no hardcoded asset paths in markup.
  for (const match of template.matchAll(/["'](\/images\/[^"']+)["']/g)) {
    findings.push({
      file: relative(root, file),
      kind: "hardcoded image path",
      text: match[1],
    });
  }

  // Text nodes between tags.
  for (const match of template.matchAll(/>([^<>{}]+)</g)) {
    const text = match[1]
      .replace(/&[a-z]+;/gi, "") // named entities are punctuation, not copy
      .replace(/&#\d+;/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    if (!/[A-Za-z]{2}/.test(text)) continue;
    if (EXEMPT.has(text)) continue;
    findings.push({ file: relative(root, file), kind: "hardcoded copy", text });
  }
}

if (findings.length) {
  console.error(
    `\n  Engine leak — ${findings.length} piece(s) of copy are baked into markup.\n` +
      `  Every variant would inherit these. Move them to site.config.js, or add\n` +
      `  them to EXEMPT in scripts/verify-engine.mjs if they are engine chrome.\n`
  );
  for (const f of findings) {
    console.error(`  ${f.file}\n    ${f.kind}: "${f.text}"`);
  }
  console.error("");
  process.exit(1);
}

console.log(
  `  engine OK — ${files.length} templates scanned, no copy baked into markup`
);
