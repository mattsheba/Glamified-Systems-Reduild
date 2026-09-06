/**
 * Build-time config validation.
 *
 * Implements FR-4 (fail with a named error rather than rendering `undefined`)
 * and edge cases EC-1, EC-2, EC-3, EC-6, EC-12.
 *
 * Runs before every build. A variant author who mistypes a field finds out here,
 * not from a page that silently renders the word "undefined" to a client.
 */

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import site from "../site.config.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

/* ---------- helpers ---------- */

const req = (obj, path, label) => {
  const value = path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  if (value === undefined || value === null || value === "") {
    fail(`${label} is required but missing: ${path}`);
    return false;
  }
  return true;
};

// EC-6: an image named in config that does not exist on disk.
const imageExists = (path, where) => {
  if (!path) return;
  if (/^https?:\/\//.test(path)) return; // remote, not our problem
  if (!existsSync(join(root, "public", path.replace(/^\//, "")))) {
    fail(`${where}: image not found in public/ — ${path}`);
  }
};

// WCAG relative luminance and contrast ratio, for EC-12 / NFR-6.
const luminance = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(m[1].slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [la, lb] = [luminance(a), luminance(b)];
  if (la === null || lb === null) return null;
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

/* ---------- brand ---------- */

req(site, "brand.name", "Brand");
req(site, "brand.accent", "Brand");

if (site.brand?.accent && !/^#[0-9a-f]{6}$/i.test(site.brand.accent)) {
  fail(`brand.accent must be a 6-digit hex colour, got: ${site.brand.accent}`);
}

/* ---------- contact (EC-3) ---------- */

req(site, "contact.phone", "Contact");
req(site, "contact.email", "Contact");

// FR-12 makes WhatsApp the primary CTA, so it cannot be optional or malformed.
const wa = site.contact?.whatsapp;
if (!wa) {
  fail("contact.whatsapp is required — it is the primary call to action (FR-12)");
} else if (!/^\d{10,15}$/.test(wa)) {
  fail(
    `contact.whatsapp must be 10-15 digits with no "+", spaces or dashes. Got: "${wa}"`
  );
}

/* ---------- sections (EC-1) ---------- */

/*
 * Read from the homepage REGISTRY rather than repeating it. Kept as a second
 * hand-maintained list, this drifted the moment a section component was
 * deleted: the validator still passed and the variant build died instead, in
 * the renderer, with a stack trace pointing at a compiled .mjs file.
 */
const KNOWN_SECTIONS = (() => {
  const src = readFileSync(join(root, "src/pages/index.astro"), "utf8");
  const block = src.match(/const REGISTRY = \{([\s\S]*?)\}\s*as const;/);
  if (!block) {
    fail("could not read REGISTRY from src/pages/index.astro");
    return [];
  }
  return [...block[1].matchAll(/^\s*(\w+)\s*:/gm)].map((m) => m[1]);
})();

if (!Array.isArray(site.sections) || site.sections.length === 0) {
  fail("sections is empty — a site with no sections is always a mistake (EC-1)");
} else {
  site.sections.forEach((s, i) => {
    if (!s?.key) fail(`sections[${i}] has no key`);
    else if (!KNOWN_SECTIONS.includes(s.key))
      fail(`sections[${i}] has unknown key "${s.key}"`);
  });
}

const enabled = new Set((site.sections ?? []).map((s) => s?.key));

/* ---------- per-section required fields (FR-4) ---------- */

if (enabled.has("hero")) {
  req(site, "hero.headline", "Hero");
  req(site, "hero.standfirst", "Hero");
  req(site, "hero.primaryCta.label", "Hero");
  imageExists(site.hero?.image, "hero.image");
}

if (enabled.has("products")) {
  // EC-2: an empty list is legitimate (a services-only variant) — warn, don't fail.
  if (!site.products?.length) {
    warn('sections includes "products" but products[] is empty — section will be skipped (EC-2)');
  }
  (site.products ?? []).forEach((p, i) => {
    ["slug", "name", "summary", "description", "image"].forEach((f) => {
      if (!p?.[f]) fail(`products[${i}] ("${p?.name ?? "unnamed"}") is missing required field: ${f}`);
    });
    if (p?.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug))
      fail(`products[${i}].slug must be kebab-case, got: "${p.slug}"`);
    imageExists(p?.image, `products[${i}].image`);
    (p?.screenshots ?? []).forEach((s, j) => imageExists(s, `products[${i}].screenshots[${j}]`));
  });

  const slugs = (site.products ?? []).map((p) => p?.slug).filter(Boolean);
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupes.length) fail(`duplicate product slugs: ${[...new Set(dupes)].join(", ")}`);
}

if (enabled.has("services")) {
  if (!site.services?.length) {
    warn('sections includes "services" but services[] is empty — section will be skipped');
  }
  (site.services ?? []).forEach((s, i) => {
    // slug is required: services render detail pages at /services/<slug>, and a
    // missing one silently produces a route called "undefined". The SiteConfig
    // cast in lib/site.ts cannot catch this, so it has to be caught here.
    ["slug", "name", "summary"].forEach((f) => {
      if (!s?.[f])
        fail(`services[${i}] ("${s?.name ?? "unnamed"}") is missing required field: ${f}`);
    });
    if (s?.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.slug))
      fail(`services[${i}].slug must be kebab-case, got: "${s.slug}"`);
  });

  const serviceSlugs = (site.services ?? []).map((s) => s?.slug).filter(Boolean);
  const serviceDupes = serviceSlugs.filter((s, i) => serviceSlugs.indexOf(s) !== i);
  if (serviceDupes.length)
    fail(`duplicate service slugs: ${[...new Set(serviceDupes)].join(", ")}`);
}

/* ---------- downloads ---------- */

/*
 * The button is fail-safe by design: lib/site.ts returns null unless baseUrl is
 * a real http(s) host, so an unset one renders no button rather than a broken
 * one. That makes it easy to forget, hence the warning on every build.
 */
if (site.downloads) {
  const base = site.downloads.baseUrl;
  if (!base || base === "PLACEHOLDER") {
    warn(
      "downloads.baseUrl is not set, so no download buttons will render. " +
        "Set it to the public R2 host before launch."
    );
  } else if (!/^https:\/\/[^\s/]+/.test(base)) {
    fail(`downloads.baseUrl must be an https:// host, got: "${base}"`);
  } else if (/\/$/.test(base)) {
    fail("downloads.baseUrl must not end in a slash");
  }

  if (!site.downloads.label) fail("downloads.label is required for the button");
}

(site.products ?? []).forEach((p, i) => {
  const d = p?.download;
  if (!d) return;
  ["file", "version", "size"].forEach((f) => {
    if (!d[f]) fail(`products[${i}] ("${p?.name}") download is missing: ${f}`);
  });
  // A filename with a path in it means someone put the host in the wrong field.
  if (d.file && /[\\/]/.test(d.file))
    fail(
      `products[${i}].download.file must be a bare filename, not a path: "${d.file}"`
    );
  if (d.file && !site.downloads)
    fail(`products[${i}] has a download but there is no downloads block`);
});

/* ---------- nav ---------- */

(site.nav ?? []).forEach((item, i) => {
  if (!item?.label) fail(`nav[${i}] is missing a label`);
  if (!item?.href) fail(`nav[${i}] ("${item?.label ?? "?"}") is missing an href`);
  if (item?.childrenFrom && !["products", "services"].includes(item.childrenFrom))
    fail(
      `nav[${i}].childrenFrom must be "products" or "services", got: "${item.childrenFrom}"`
    );
  // FR-10: navigation points at routes, not on-page anchors.
  if (item?.href?.includes("#"))
    warn(
      `nav[${i}] ("${item.label}") points at an anchor (${item.href}). ` +
        `Navigation should target real routes (FR-10).`
    );
});

if (enabled.has("process")) {
  (site.process ?? []).forEach((p, i) => {
    ["step", "title"].forEach((f) => {
      if (!p?.[f]) fail(`process[${i}] is missing required field: ${f}`);
    });
  });
}

if (enabled.has("form")) {
  req(site, "form.endpoint", "Form");
  req(site, "form.heading", "Form");
  if (!site.form?.organisationTypes?.length)
    fail("form.organisationTypes must have at least one option");
  if (!site.form?.budgetBands?.length)
    fail("form.budgetBands must have at least one band (FR-16)");
  const values = (site.form?.budgetBands ?? []).map((b) => b?.value);
  if (new Set(values).size !== values.length)
    fail("form.budgetBands values must be unique");
}

/* ---------- templates ---------- */

// A template card that is missing a field renders a blank on a page whose
// entire job is to sell it, so every field is required once one is listed.
(site.templates ?? []).forEach((t, i) => {
  ["slug", "name", "industry", "summary", "image"].forEach((f) => {
    if (!t?.[f])
      fail(`templates[${i}] ("${t?.name ?? "unnamed"}") is missing required field: ${f}`);
  });
  if (t?.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug))
    fail(`templates[${i}].slug must be kebab-case, got: "${t.slug}"`);
  if (t?.demoUrl && !/^https?:\/\//.test(t.demoUrl))
    fail(`templates[${i}].demoUrl must be a full URL, got: "${t.demoUrl}"`);
  imageExists(t?.image, `templates[${i}].image`);
});

const templateSlugs = (site.templates ?? []).map((t) => t?.slug).filter(Boolean);
const templateDupes = templateSlugs.filter((s, i) => templateSlugs.indexOf(s) !== i);
if (templateDupes.length)
  fail(`duplicate template slugs: ${[...new Set(templateDupes)].join(", ")}`);

// Client logos are { src, name }. The name is the alt text, so a logo without
// one is an anonymous image to anyone using a screen reader.
(site.proof?.logos ?? []).forEach((l, i) => {
  if (!l?.src) fail(`proof.logos[${i}] is missing "src"`);
  if (!l?.name) fail(`proof.logos[${i}] is missing "name", used as alt text`);
  imageExists(l?.src, `proof.logos[${i}]`);
});
imageExists(site.brand?.logo, "brand.logo");

/* ---------- accent contrast (EC-12, NFR-6) ---------- */

const GROUND = "#fafbfc";
const GROUND_INVERSE = "#1a2230";

if (site.brand?.accent && /^#[0-9a-f]{6}$/i.test(site.brand.accent)) {
  const onLight = contrast(site.brand.accent, GROUND);
  if (onLight !== null && onLight < 4.5) {
    // Loud, but not blocking — a client may accept it (EC-12).
    warn(
      `accent ${site.brand.accent} scores ${onLight.toFixed(2)}:1 on the light ground. ` +
        `WCAG AA text needs 4.5:1. Accent text on light bands will fail (NFR-6).`
    );
  }
  // The inverse accent is derived in CSS via color-mix, so we check the raw
  // accent only to explain why the derivation exists.
  const rawOnDark = contrast(site.brand.accent, GROUND_INVERSE);
  if (rawOnDark !== null && rawOnDark < 3) {
    console.log(
      `  note: raw accent is ${rawOnDark.toFixed(2)}:1 on inverse bands — ` +
        `--accent-inverse lightens it for that use. This is expected.`
    );
  }
}

/* ---------- report ---------- */

for (const w of warnings) console.warn(`  warn  ${w}`);

if (errors.length) {
  console.error(`\n  site.config.js failed validation — ${errors.length} error(s):\n`);
  for (const e of errors) console.error(`  error  ${e}`);
  console.error("");
  process.exit(1);
}

console.log(
  `  site.config.js OK — ${site.sections.length} sections, ` +
    `${site.products?.length ?? 0} products, ${site.services?.length ?? 0} services` +
    (warnings.length ? `, ${warnings.length} warning(s)` : "")
);
