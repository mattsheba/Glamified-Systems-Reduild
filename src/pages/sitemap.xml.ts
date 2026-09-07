/**
 * sitemap.xml, generated from config.
 *
 * Built from the same product and service arrays the pages come from, so a new
 * product cannot ship without appearing in the sitemap — the usual way pages go
 * unindexed for months.
 */

import type { APIRoute } from "astro";
import site from "../lib/site";
import { legalDocs } from "../content/legal";

export const GET: APIRoute = () => {
  const origin = site.seo.domain.replace(/\/$/, "");
  const today = new Date().toISOString().slice(0, 10);

  /*
   * The trailing slash is not cosmetic. Every page builds to <route>/index.html,
   * so the canonical the page declares — and the only form the host answers with
   * a 200 — ends in a slash; /products 301s to /products/. A sitemap listing the
   * slashless form hands the crawler a list of redirects, which Search Console
   * files under "Page with redirect" and declines to index. It cost this site
   * every URL but the homepage once already. Match the canonical exactly.
   */
  const href = (path: string) => `${origin}${path.endsWith("/") ? path : `${path}/`}`;

  // priority is a hint, not a ranking lever. Product pages carry the commercial
  // intent, so they sit just under the homepage.
  const routes: Array<{ path: string; priority: string; changefreq: string }> = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/products", priority: "0.9", changefreq: "monthly" },
    { path: "/services", priority: "0.9", changefreq: "monthly" },
    { path: "/about", priority: "0.6", changefreq: "yearly" },
    { path: "/contact", priority: "0.7", changefreq: "yearly" },
    ...site.products.map((p) => ({
      path: `/products/${p.slug}`,
      priority: "0.9",
      changefreq: "monthly",
    })),
    ...site.services.map((s) => ({
      path: `/services/${s.slug}`,
      priority: "0.8",
      changefreq: "monthly",
    })),
    ...legalDocs.map((d) => ({
      path: `/${d.slug}`,
      priority: "0.2",
      changefreq: "yearly",
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${href(r.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
