/**
 * Checks the built sitemap against the pages actually built.
 *
 * sitemap.xml.ts derives products, services and legal pages from config, so
 * those cannot drift. The five fixed routes are listed by hand, which is the
 * gap: add src/pages/pricing.astro and the page ships, builds, and is never
 * submitted to a search engine. Nothing else in the build notices, because
 * both halves are individually correct.
 *
 * Runs against dist/, so build first:
 *   npm run build && npm run verify:sitemap
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import site from "../site.config.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const errors = [];

if (!existsSync(dist)) {
  console.error("\n  No dist/. Run `npm run build` first.\n");
  process.exit(1);
}

/* ---------- what was actually built ---------- */

const routesFrom = (dir, base = "") =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return routesFrom(path, `${base}/${entry.name}`);
    return entry.name === "index.html" ? [base || "/"] : [];
  });

const built = routesFrom(dist).sort();

/* ---------- what the sitemap claims ---------- */

const sitemapPath = join(dist, "sitemap.xml");
if (!existsSync(sitemapPath)) {
  console.error("\n  dist/sitemap.xml was not generated.\n");
  process.exit(1);
}

const xml = readFileSync(sitemapPath, "utf8");
const origin = site.seo.domain.replace(/\/$/, "");
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const listed = locs.map((l) => l.replace(origin, "") || "/").sort();

/* ---------- the comparison that matters ---------- */

const missing = built.filter((r) => !listed.includes(r));
const phantom = listed.filter((r) => !built.includes(r));

missing.forEach((r) =>
  errors.push(`built but missing from sitemap: ${r}`)
);
phantom.forEach((r) =>
  errors.push(`in sitemap but no such page was built: ${r}`)
);

/* ---------- sitemap validity ---------- */

if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
  errors.push("sitemap is missing its XML declaration");
}
if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
  errors.push("sitemap is missing the sitemaps.org namespace");
}
// An unescaped & makes the document not well-formed, and a crawler rejects the
// whole file rather than the one entry.
if (/&(?!amp;|lt;|gt;|quot;|apos;|#)/.test(xml)) {
  errors.push("sitemap contains an unescaped ampersand");
}
if (new Set(locs).size !== locs.length) {
  errors.push("sitemap contains duplicate <loc> entries");
}
locs.forEach((loc) => {
  if (!loc.startsWith("https://")) {
    errors.push(`sitemap <loc> is not an absolute https URL: ${loc}`);
  }
});

/* ---------- robots ---------- */

const robotsPath = join(dist, "robots.txt");
if (!existsSync(robotsPath)) {
  errors.push("dist/robots.txt was not generated");
} else {
  const robots = readFileSync(robotsPath, "utf8");
  const expected = `${origin}/sitemap.xml`;
  if (!robots.includes(expected)) {
    errors.push(
      `robots.txt does not point at ${expected}. A sitemap nothing links to is ` +
        `a sitemap nothing reads.`
    );
  }
  if (/^\s*Disallow:\s*\/\s*$/m.test(robots)) {
    errors.push(
      "robots.txt disallows the whole site. That is almost never intended on a " +
        "site built to be found."
    );
  }
}

/* ---------- report ---------- */

console.log("");
if (errors.length) {
  errors.forEach((e) => console.error(`  error  ${e}`));
  console.error("");
  process.exit(1);
}

console.log(
  `  sitemap OK — ${listed.length} URLs, matching all ${built.length} built pages\n`
);
