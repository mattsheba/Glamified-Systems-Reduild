// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import site from "./site.config.js";

/*
 * Variant builds resolve config through an alias instead of overwriting
 * site.config.js on disk.
 *
 * The previous approach copied the variant over the live config, built, and
 * copied the original back in a `finally`. That is safe against exceptions but
 * not against process death: a libuv abort on Windows ended the process
 * outright, `finally` never ran, and a full config file was lost.
 *
 * An alias cannot lose anything, because nothing is written. Set
 * VARIANT_CONFIG to a config path and every `import site.config.js` in the
 * build resolves there instead.
 */
const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const variant = process.env.VARIANT_CONFIG;

/*
 * A resolver plugin, not `resolve.alias`. Alias matches the import specifier as
 * written, and every importer here writes a relative path ("../../site.config.js"),
 * so an alias keyed on the absolute path silently matches nothing — which makes
 * the variant gate pass while testing the wrong config. Intercepting at
 * resolveId catches the specifier whatever its relative shape.
 */
/** @type {import("vite").Plugin | undefined} */
const variantPlugin = variant ? {
  name: "variant-config",
  // Annotated because "pre" widens to string without it, and Vite's Plugin
  // type wants the literal.
  enforce: /** @type {const} */ ("pre"),
  /** @param {string} source */
  resolveId(source) {
    if (!/(^|[\\/])site\.config\.js$/.test(source)) return null;
    return resolve(root, variant);
  },
} : undefined;

// astro.config.mjs itself is evaluated before the alias exists, so `site` here
// is always the real config. Only `site.seo.domain` is read from it, which is
// not something a variant needs to change for a build to be valid.
export default defineConfig({
  site: site.seo.domain,
  output: "static",
  build: { inlineStylesheets: "always" },
  // No JS framework integration on purpose: NFR-2 caps the homepage at 30KB
  // of JavaScript, and none of the eight sections needs a client runtime.
  vite: { plugins: variantPlugin ? [variantPlugin] : [] },
});
