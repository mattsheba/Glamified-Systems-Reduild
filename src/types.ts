/**
 * The config contract — specs/glamified-site.md, "API Contracts".
 *
 * This exists because of a real failure. Without it, TypeScript infers the shape
 * of the config from whichever site.config.js happens to be on disk, so a
 * variant with `products: []` infers `never[]` and every component that reads a
 * product fails to compile. Components must type-check against the *contract*,
 * not against one instance of it. That is what makes AC-2 hold.
 */

export type SectionKey =
  | "hero"
  | "proofStrip"
  | "logoMarquee"
  | "products"
  | "services"
  | "proof"
  | "process"
  | "templates"
  | "faq"
  | "form"
  | "contact";

export type BandMode = "light" | "inverse";

/**
 * Search metadata for a single page.
 *
 * Kept separate from `name`/`summary` on purpose. A product is called
 * "GlamifiedHR", but nobody searches for that — they search "payroll software
 * Zambia". The heading can carry the brand while the title tag carries the
 * term people actually type.
 */
export interface PageSeo {
  /** Title tag. Lead with the search term, brand last. Aim for 50–60 chars. */
  title?: string;
  /** Meta description, 140–160 chars. Written to earn the click, not to rank. */
  description?: string;
  /** Prior URL this page replaces, e.g. "/glamifiedhr". Emitted as a redirect. */
  previousPath?: string;
}

export interface Product {
  slug: string;
  name: string;
  summary: string;
  seo?: PageSeo;
  /** Headline shown on the product page when it should differ from `name` —
   *  a pain-led line usually converts better than a product name. */
  headline?: string;
  /** One-off price, where the product has one. Feeds SoftwareApplication JSON-LD. */
  price?: { amount: number; currency: string; note?: string };
  description: string;
  /** Short highlight list, used where space is tight. */
  features: string[];
  /**
   * Full capability breakdown for products deep enough that a flat list
   * undersells them. Rendered in place of `features` on the detail page.
   */
  groups?: Array<{ title: string; items: string[] }>;
  image: string;
  screenshots?: string[];
  /**
   * Installer for this product. The host lives once in `downloads.baseUrl`, so
   * a change of bucket or custom domain is a one-line edit rather than three.
   */
  download?: {
    /** Filename in the bucket, joined onto `downloads.baseUrl`. */
    file: string;
    version: string;
    /** Human readable: "119 MB". Not shown on the button, but kept so the
     *  download gate can report it and a future layout can use it. */
    size: string;
    platform?: string;
  };
  /**
   * User guide PDF in the same bucket. Rendered as a text link rather than a
   * button: it is a secondary action, and two buttons of equal weight make
   * neither of them the obvious one.
   */
  guide?: { file: string };
}

export interface Service {
  slug: string;
  name: string;
  summary: string;
  seo?: PageSeo;
  /** Long-form copy for the service detail page. */
  description?: string;
  /** What the engagement covers. Rendered as a flat list. */
  includes?: string[];
  /**
   * Grouped scope, for services broad enough that a flat list stops being
   * scannable. Takes precedence over `includes` when present.
   */
  groups?: Array<{ title: string; items: string[] }>;
  /** Who the service is for. */
  forWho?: string;
  /**
   * Authorities and regulators this service deals with, shown as a logo grid.
   *
   * `note` is not decorative. These are government and statutory marks, and a
   * grid of them on a commercial page can read as accreditation or partnership.
   * The note is what keeps it a statement of what you handle.
   */
  bodies?: {
    label: string;
    note?: string;
    items: Array<{ src: string; name: string }>;
  };
  icon: string;
}

/**
 * A primary-navigation entry.
 *
 * `childrenFrom` expands to a dropdown built from products[] or services[] at
 * build time. Prefer it over an explicit `children` list: it means adding a
 * product cannot leave the menu stale.
 */
export interface NavItem {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
  childrenFrom?: "products" | "services";
}

export interface Testimonial {
  quote: string;
  organisation: string;
  /** Optional. A quote can stand on the company name alone. */
  author?: string;
  role?: string;
  /** Path under /images/logos. Omit and the card falls back to the name. */
  logo?: string;
  /**
   * "none" suppresses the tile behind the logo.
   *
   * Most client marks are dark ink on transparent and need a light tile to be
   * legible on an inverse band. A mark that is light ink on its own dark ground
   * is the opposite case: a tile would show as bars either side of it.
   */
  logoTile?: "none";
}

export interface ProcessStep {
  step: string;
  title: string;
  detail: string;
  /** Icon key from src/components/Icon.astro. Unknown keys render nothing. */
  icon?: string;
}

/**
 * A ready-made industry website offered for sale.
 *
 * This is the catalogue the engine exists to produce: one codebase, a config
 * file per industry. The section stays hidden while `templates` is empty, so
 * the structure can sit here until there are real demos to link to.
 */
export interface SiteTemplate {
  slug: string;
  name: string;
  /** The trade it is built for, e.g. "Lodges", "Construction". */
  industry: string;
  summary: string;
  /** Screenshot or preview image. */
  image: string;
  /** Live demo, usually a subdomain. Omit while a template is still in build. */
  demoUrl?: string;
  price?: { amount: number; currency: string; note?: string };
}

export interface BudgetBand {
  label: string;
  value: string;
}

export interface PageCopy {
  heading?: string;
  standfirst?: string;
  /** Search metadata. The visible heading stays short; the title tag carries
   *  the term people actually search for. */
  seo?: PageSeo;
}

export interface AboutCopy extends PageCopy {
  /** Opening paragraphs. `**bold**` is honoured; nothing else is. */
  body?: string[];
  /**
   * Titled sub-sections below the opening, in order.
   *
   * `aside: true` moves one into the right column beside the prose instead of
   * running it on underneath. The facts and values are far shorter than the
   * body, so without this the right column ends early and leaves a tall gap.
   */
  sections?: Array<{ title: string; body: string[]; aside?: boolean }>;
  values?: Array<{ title: string; detail: string; icon?: string }>;
  /**
   * Registration and contact facts. Anyone weighing up handing you their
   * payroll or their statutory filings checks this before they call.
   */
  facts?: {
    label: string;
    items: Array<{ label: string; value: string }>;
  };
}

export interface ServicesCopy extends PageCopy {
  /** Heading above the "who this is for" card on a service detail page. */
  forWhoLabel?: string;
  /** Heading above the list of other services. */
  otherServicesLabel?: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    tagline: string;
    accent: string;
    /** Full lockup — used where there is room, e.g. the footer. */
    logo: string;
    /** Compact monogram for the header, where a stacked lockup would be
     *  too small to read. Falls back to `logo` when absent. */
    mark?: string;
    favicon: string;
  };

  contact: {
    phone: string;
    whatsapp: string;
    whatsappMessage: string;
    email: string;
    city: string;
    hours: string;
    mapUrl?: string;
  };

  nav: NavItem[];

  /** Homepage composition. Order is render order. */
  sections: Array<{
    key: SectionKey;
    mode?: BandMode;
    heading?: string;
    subheading?: string;
  }>;

  /**
   * Copy for the standalone routes. Every field is optional so a variant can
   * drop a page's content without breaking the typecheck — the route falls back
   * to its section heading. See src/lib/site.ts `page()`.
   */
  pages?: {
    products?: PageCopy;
    services?: ServicesCopy;
    about?: AboutCopy;
    contact?: PageCopy;
  };

  hero: {
    headline: string;
    standfirst: string;
    primaryCta: { label: string; type: "whatsapp" | "link"; href?: string };
    secondaryCta?: { label: string; href: string };
    image?: string;
  };

  /**
   * Where installers are served from, and the copy around the button.
   *
   * `baseUrl` is deliberately the only place the host appears. While it is
   * unset the download buttons do not render at all and the pages fall back to
   * the WhatsApp call to action, because a button that 404s is worse than no
   * button.
   */
  downloads?: {
    baseUrl: string;
    label: string;
    /** Appended after the label, e.g. "Windows 10 and 11". */
    note?: string;
    /**
     * Trial terms, shown directly under the button. This is the line that gets
     * the download clicked, so it renders above the technical warning rather
     * than below it.
     */
    trial?: string;
    /** Link text for the user guide, e.g. "User guide (PDF)". */
    guideLabel?: string;
  };

  products: Product[];
  services: Service[];

  proof: {
    /**
     * Heading for the proof section. Needed because `proof` is not listed in
     * the homepage `sections`, so the usual heading lookup finds nothing and
     * the client cards would render unlabelled.
     */
    heading?: string;
    /**
     * Client logos for the marquee. An empty array omits the section.
     * `name` becomes the alt text, so the strip is not a row of anonymous
     * images to anyone using a screen reader.
     */
    logos?: Array<{
      src: string;
      name: string;
      /** "none" for a mark that carries its own ground. See Testimonial.logoTile. */
      tile?: "none";
    }>;
    /**
     * Label reads first, value second: "Building since / 2023". Value-first
     * only works when the label is a noun describing the number, which is not
     * true of "Based in" or "Building since".
     */
    stats?: Array<{ value: string; label: string; icon?: string }>;
    /**
     * Named engagements: who works with you and what they use. A statement of
     * fact, unlike a testimonial, so it needs no quote to be credible. Publish
     * a name only where the client has agreed to be named.
     */
    clients?: Array<{ name: string; using: string[] }>;
    testimonials?: Testimonial[];
  };

  process: ProcessStep[];

  /** Industry website templates for sale. Empty omits the section. */
  templates?: SiteTemplate[];

  /** Accordion FAQ. Omitting it, or leaving `items` empty, drops the section. */
  faq?: {
    heading?: string;
    standfirst?: string;
    cta?: { label: string; type: "whatsapp" | "link"; href?: string };
    items: Array<{ q: string; a: string }>;
  };

  form: {
    endpoint: string;
    heading: string;
    standfirst?: string;
    organisationTypes: string[];
    serviceOptions: string[];
    budgetBands: BudgetBand[];
    successMessage: string;
    errorMessage: string;
  };

  legal: {
    jurisdiction: string;
    registeredName: string;
    /** Shown in the legal documents so the contracting entity is identifiable. */
    registeredOffice?: string;
    tpin?: string;
    /** Named statute the privacy policy is written against. */
    dataProtectionAct?: string;
    lastUpdated: string;
  };

  seo: {
    title: string;
    description: string;
    ogImage: string;
    domain: string;
  };
}
