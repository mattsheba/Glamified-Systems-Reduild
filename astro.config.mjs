// @ts-check
import { defineConfig } from "astro/config";
import site from "./site.config.js";

export default defineConfig({
  site: site.seo.domain,
  output: "static",
  build: { inlineStylesheets: "always" },
  // No JS framework integration on purpose: NFR-2 caps the homepage at 30KB
  // of JavaScript, and none of the eight sections needs a client runtime.
});
