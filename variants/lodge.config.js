/**
 * Example industry variant, a lodge.
 *
 * This exists to prove AC-2: a different industry is this file and a folder of
 * images, with zero changes to any .astro, .css or .ts file. To try it:
 *
 *   cp variants/lodge.config.js site.config.js && npm run build
 *
 * Note what differs from the base config beyond wording: no products section at
 * all (a lodge sells rooms, not software), a different section order, a
 * different accent, and different budget bands. The engine absorbs all of it.
 */

export default {
  brand: {
    name: "PLACEHOLDER Lodge",
    tagline: "PLACEHOLDER: Riverside lodge and conference venue.",
    accent: "#8A5A2B",
    logo: "/images/brand/logo.svg",
    favicon: "/favicon.svg",
  },

  contact: {
    phone: "+260 977 000 000",
    whatsapp: "260977000000",
    whatsappMessage: "Hello, I'd like to check availability.",
    email: "stay@placeholder-lodge.com",
    city: "Livingstone, Zambia",
    hours: "Reception open daily, 06:00–22:00 CAT",
  },

  nav: [
    { label: "Rooms", href: "/services", childrenFrom: "services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  // No products section, and proof moved up, a lodge leads with its rooms
  // and its reviews. Same engine, different shape.
  sections: [
    { key: "hero" },
    { key: "proofStrip", mode: "inverse" },
    { key: "services", heading: "PLACEHOLDER: Rooms & spaces" },
    { key: "proof", heading: "PLACEHOLDER: What guests say" },
    { key: "form", heading: "PLACEHOLDER: Check availability" },
  ],

  hero: {
    headline: "PLACEHOLDER: Stay on the river",
    standfirst: "PLACEHOLDER: Replace before launch.",
    primaryCta: { label: "Enquire on WhatsApp", type: "whatsapp" },
  },

  products: [],

  services: [
    {
      slug: "standard-room",
      name: "PLACEHOLDER: Standard room",
      summary: "PLACEHOLDER copy.",
      description: "PLACEHOLDER: longer description for the detail page.",
      includes: ["PLACEHOLDER: what's included"],
      forWho: "PLACEHOLDER: who it suits.",
      icon: "bed",
    },
    {
      slug: "family-chalet",
      name: "PLACEHOLDER: Family chalet",
      summary: "PLACEHOLDER copy.",
      description: "PLACEHOLDER: longer description for the detail page.",
      includes: ["PLACEHOLDER: what's included"],
      forWho: "PLACEHOLDER: who it suits.",
      icon: "home",
    },
    {
      slug: "conference-hall",
      name: "PLACEHOLDER: Conference hall",
      summary: "PLACEHOLDER copy.",
      description: "PLACEHOLDER: longer description for the detail page.",
      includes: ["PLACEHOLDER: what's included"],
      forWho: "PLACEHOLDER: who it suits.",
      icon: "users",
    },
  ],

  proof: {
    logos: [],
    stats: [{ value: "PLACEHOLDER", label: "Rooms" }],
    testimonials: [
      {
        quote: "PLACEHOLDER: guest review.",
        author: "PLACEHOLDER Name",
        role: "Guest",
        organisation: "PLACEHOLDER",
      },
    ],
  },

  process: [],

  form: {
    endpoint: "/api/enquiry",
    heading: "PLACEHOLDER: Check availability",
    standfirst: "PLACEHOLDER: Tell us your dates.",
    organisationTypes: ["Leisure", "Business", "Group", "Conference"],
    serviceOptions: [
      "PLACEHOLDER: Standard room",
      "PLACEHOLDER: Family chalet",
      "PLACEHOLDER: Conference hall",
    ],
    budgetBands: [
      { label: "Under K500 / night", value: "under-500" },
      { label: "K500 – K1,200 / night", value: "500-1200" },
      { label: "Over K1,200 / night", value: "over-1200" },
    ],
    successMessage: "Thank you, we'll confirm availability shortly.",
    errorMessage: "That didn't send. Please try again, or reach us on WhatsApp.",
  },

  legal: {
    jurisdiction: "Zambia",
    registeredName: "PLACEHOLDER Lodge",
    lastUpdated: "2026-09-05",
  },

  seo: {
    title: "PLACEHOLDER Lodge, Livingstone",
    description: "PLACEHOLDER: Meta description.",
    ogImage: "/images/brand/og.svg",
    domain: "https://placeholder-lodge.com",
  },
};
