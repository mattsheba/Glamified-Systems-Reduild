/**
 * The single typed entry point to config.
 *
 * Everything in src/ imports config from here, never from site.config.js
 * directly. The cast is what pins components to the SiteConfig contract instead
 * of to the literal shape of whichever variant is on disk — see src/types.ts.
 */

import raw from "../../site.config.js";
import type { SiteConfig, BandMode, Product } from "../types";

const site = raw as unknown as SiteConfig;

/** FR-12: the primary call to action, everywhere it appears. */
export function whatsappHref(): string {
  const message = site.contact.whatsappMessage
    ? `?text=${encodeURIComponent(site.contact.whatsappMessage)}`
    : "";
  return `https://wa.me/${site.contact.whatsapp}${message}`;
}

/**
 * Absolute URL of a product's installer, or null when there is nothing safe to
 * link to yet.
 *
 * Null while `downloads.baseUrl` is unset or still the placeholder, so a
 * half-configured site renders no download button rather than one that 404s.
 * Callers treat null as "fall back to the WhatsApp call to action".
 */
export function downloadHref(product: Product): string | null {
  const base = site.downloads?.baseUrl;
  if (!base || !product.download) return null;
  if (!/^https?:\/\//.test(base)) return null;
  return `${base.replace(/\/+$/, "")}/${product.download.file}`;
}

/** Same rules as downloadHref: null unless there is a real host and a file. */
export function guideHref(product: Product): string | null {
  const base = site.downloads?.baseUrl;
  if (!base || !product.guide) return null;
  if (!/^https?:\/\//.test(base)) return null;
  return `${base.replace(/\/+$/, "")}/${product.guide.file}`;
}

/** FR-8: product detail route. */
export function productHref(slug: string): string {
  return `/products/${slug}`;
}

/**
 * Minimal inline emphasis for config copy: `**bold**` and nothing else.
 *
 * Escapes first, then converts, so config stays plain text rather than becoming
 * a markup surface. Config is ours, but a field that accepts arbitrary HTML is
 * a hole waiting for someone to paste client copy into it.
 */
export function inlineBold(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

/** FR-9: service detail route. */
export function serviceHref(slug: string): string {
  return `/services/${slug}`;
}

/**
 * Primary navigation, with `childrenFrom` expanded into real dropdown entries.
 *
 * Building the menu from products[] and services[] rather than a hand-written
 * list is what stops a new product shipping without a menu entry.
 */
export function navTree(): Array<{
  label: string;
  href: string;
  children: Array<{ label: string; href: string; group?: string }>;
}> {
  return site.nav.map((item) => {
    let children: Array<{ label: string; href: string; group?: string }> =
      item.children ?? [];

    if (item.childrenFrom === "products") {
      children = site.products.map((product) => ({
        label: product.name,
        href: productHref(product.slug),
      }));
    } else if (item.childrenFrom === "services") {
      // `group` is carried through so the menu can divide the technology work
      // from the business services exactly as the services page does. A menu
      // that groups differently from the page it links to is its own small
      // confusion.
      children = site.services.map((service) => ({
        label: service.name,
        href: serviceHref(service.slug),
        group: service.group,
      }));
    }

    return { label: item.label, href: item.href, children };
  });
}

/**
 * Heading for a section, looked up from config by key.
 *
 * Standalone pages reuse section components, and a heading typed into a page
 * template would be copy baked into markup (FR-1). This keeps every heading in
 * config even when the section appears on more than one route.
 */
export function sectionHeading(key: string): string | undefined {
  return site.sections.find((section) => section.key === key)?.heading;
}

/**
 * FR-20: a section uses its configured mode, otherwise it alternates, starting
 * light. Alternation is computed across the configured order rather than the
 * canonical order, so deleting a section doesn't leave two dark bands adjacent.
 */
export function sectionModes(): BandMode[] {
  let auto: BandMode = "light";
  return site.sections.map((section) => {
    if (section.mode) {
      auto = section.mode === "light" ? "inverse" : "light";
      return section.mode;
    }
    const mode = auto;
    auto = auto === "light" ? "inverse" : "light";
    return mode;
  });
}

export type { SiteConfig, BandMode };
export default site;
