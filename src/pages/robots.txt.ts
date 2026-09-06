/**
 * robots.txt, generated from config.
 *
 * An endpoint rather than a file in public/ because the sitemap URL contains
 * the domain. As a static file, every industry variant would ship pointing at
 * glamifiedsystems.com — a silent engine leak (FR-3).
 */

import type { APIRoute } from "astro";
import site from "../lib/site";

export const GET: APIRoute = () => {
  const origin = site.seo.domain.replace(/\/$/, "");

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
};
