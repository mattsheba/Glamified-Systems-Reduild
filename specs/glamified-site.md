# Spec: Glamified Systems Website & Template Engine

**Spec ID:** GS-001
**Author:** Site owner, drafted with Claude Code
**Date:** 2026-09-05
**Status:** Draft — approval required before Phase 04 implementation
**Reviewers:** Site owner
**Stack:** Astro (static output), deployed to Netlify from GitHub
**Inputs:** `design-tokens.md` (Phase 02 output), `rebuild-playbook.html` (Phases 01–06)

---

## Context

Glamified Systems sells two things to the Zambian market: its own software products
(GlamifiedHR, Glamified Fleet, Glamified Sales) and services (web and software
development, IT support, business consultancy, payroll outsourcing, graphic design). The
existing site leads with services and was flagged in a prior audit as missing privacy,
terms and refund pages.

Two decisions shape this build and make it unusual.

**The homepage leads with products, not services.** That is a positioning decision
already taken, and it changes the hero and the section order — products come before the
services list, not after it.

**The site must survive being forked twenty times.** The commercial goal is a catalogue
of industry template variants (lodges, construction, retail, and so on) sold at roughly
K1,500–K3,500. A variant must be produced by editing a config file and swapping images,
never by editing markup. If industry number four requires touching an `.astro` file, the
engine has failed and the catalogue is a copy-paste job. This constraint is the most
important requirement in this document and is why FR-1 through FR-3 are absolute.

The design system was extracted in Phase 02 from two references — probeyservices.com for
structure, proweb.co.zm for scale and the qualifying-form pattern — and reduced to
decisions in `design-tokens.md`. That file is the visual contract; this one is the
behavioural contract. Where they disagree, `design-tokens.md` wins on appearance and this
spec wins on behaviour.

Performance is a functional concern here, not a nicety. A meaningful share of Zambian
visitors arrive on mobile data, so page weight is a conversion issue. That is why NFR-1
through NFR-4 carry hard numbers rather than aspirations.

---

## Functional Requirements

### Engine — the load-bearing constraints

- FR-1: All user-visible text MUST originate from `site.config.js`. Markup files MUST NOT contain user-visible string literals. Structural strings (ARIA labels, `alt` fallbacks, form `name` attributes, skip-link text) are exempt and MUST be listed in a documented exemption block.
- FR-2: All image paths MUST originate from `site.config.js`. Markup MUST NOT hardcode a path under `/images/` or equivalent.
- FR-3: Producing a new industry variant MUST require changes to `site.config.js` and image assets only — zero `.astro`, `.css` or `.ts` edits. CI SHOULD enforce this by diffing a variant branch against base.
- FR-4: The build MUST fail with a named error when a config field required by an enabled section is missing. It MUST NOT render an empty element or the literal `undefined`.
- FR-5: Brand accent colour MUST be read from `config.brand.accent` and applied as a CSS custom property at build time.

### Structure

- FR-6: The homepage MUST render these sections in this order: hero, proof strip, products, services, process, contact. It is a summary — detail belongs on the standalone routes in FR-26.
- FR-7: Section order and inclusion MUST be driven by `config.sections[]`. Omitting a key MUST omit that section without layout breakage.
- FR-8: Each product in `config.products[]` MUST render a detail page at `/products/[slug]`.
- FR-9: Each service in `config.services[]` MUST render as a card on the services page and in the homepage services section.
- FR-29: Each service in `config.services[]` MUST render a detail page at `/services/[slug]`, carrying its description, what the engagement includes, who it is for, and links to the other services. This supersedes OS-3.
- FR-30: Primary navigation entries MAY declare a dropdown. `childrenFrom: "products" | "services"` MUST build that dropdown from the corresponding config array at build time, so adding an item cannot leave the menu stale. An explicit `children` array MAY be used instead.
- FR-31: Dropdown menus MUST open on hover and on keyboard focus, and MUST require no JavaScript. Below 767px the navigation MUST collapse into a disclosure that also requires no JavaScript.
- FR-32: Every service MUST have a unique kebab-case `slug`. The build MUST fail if one is missing, since a missing slug would silently produce a route named `undefined`.
- FR-33: A `logoMarquee` section MUST render `config.proof.logos` as a continuously scrolling strip. The track MUST be duplicated and translated by exactly -50% so the loop is seamless, and the duplicate MUST be `aria-hidden` so a screen reader does not announce every logo twice. The section MUST be omitted when the array is empty.
- FR-34: The marquee MUST pause on hover, and under `prefers-reduced-motion: reduce` it MUST stop entirely and fall back to a static wrapping row with the duplicate set hidden.
- FR-35: The header MUST compact once the page is scrolled — reduced height, smaller logo, and a hairline plus shadow separating it from content. This MUST degrade to a plain sticky header when JavaScript is unavailable.
- FR-37: An accordion FAQ section MUST render `config.faq.items` using native `<details>` elements sharing a `name`, so only one is open at a time with no JavaScript. Omitting `config.faq`, or leaving `items` empty, MUST drop the section.
- FR-38: Product imagery MUST NOT expose third-party personal or commercial data — client names, tax identification numbers, contact details, or amounts owed. Screenshots MUST use demonstration data, or be cropped so that no such data is visible.
- FR-36: Icons MUST be inline stroke-based SVG drawn with `currentColor`, selected by an `icon` key in config. Emoji MUST NOT be used. An unrecognised key MUST render nothing rather than a broken glyph.
- FR-10: Primary navigation MUST derive from `config.nav[]` and MUST NOT be hardcoded. Navigation entries MUST point at real routes, not on-page anchors.
- FR-26: The site MUST render standalone routes at `/products`, `/services`, `/about` and `/contact`, with their copy drawn from `config.pages`. Every field under `config.pages` MUST be optional, so a variant that omits one still builds.
- FR-27: The qualifying form MUST live on `/contact` rather than on the homepage, so the homepage stays a summary.
- FR-28: A section component reused across routes MUST take its heading from config, never from a literal in the page template.
- FR-11: Legal pages MUST render at `/privacy`, `/terms` and `/refund`, with client name, contact details and jurisdiction interpolated from config.

### Conversion

- FR-12: The primary call to action MUST be a WhatsApp deep link of the form `https://wa.me/<config.contact.whatsapp>`, carrying a prefilled message from `config.contact.whatsappMessage`.
- FR-13: The WhatsApp CTA MUST be reachable from every page without scrolling, via a sticky element or header placement.
- FR-14: The qualifying form MUST implement the field set and layout defined in `design-tokens.md` section 6: name, email, phone, country, organisation type, services wanted, message, budget band.
- FR-15: Organisation type MUST render as a segmented pill group backed by real `<input type="radio">` elements inside a `<fieldset>` with a `<legend>`.
- FR-16: Budget MUST be discrete bands in ZMW sourced from `config.form.budgetBands[]`, rendered as radio options. A continuous slider MUST NOT be used, because it implies a pricing precision that does not exist at these tiers.
- FR-17: Form submission MUST post to a configurable endpoint. On success it MUST show confirmation without a full page reload; on failure it MUST show a retry affordance and MUST NOT discard entered data.
- FR-18: The form MUST NOT be the loudest call to action. WhatsApp is primary; the form is the considered path for larger enquiries.

### Presentation

- FR-19: Colour tokens MUST be defined as light and dark pairs. Body text on light grounds MUST be pure black, and secondary text MUST stay near-black rather than mid-grey. (This supersedes the original rule that `ink` and `ground-inverse` share one value: that coupling made the two band modes feel like one system, but it put navy-grey text on an off-white ground, and readability wins. Dark bands keep the logo navy.)
- FR-20: Sections MUST alternate between light and inverse modes per `config.sections[].mode`, defaulting to a documented alternating pattern.
- FR-21: Display type MUST use `clamp()` across the ramp. Per-breakpoint font-size overrides MUST NOT be used. Body sizes MUST remain fixed.
- FR-22: The type ramp MUST cap at 56px and follow the 1.25 ratio steps in `design-tokens.md` section 1.
- FR-23: Layout MUST use `auto-fit` and `minmax()` card grids. A 12-column grid system MUST NOT be introduced.
- FR-24: Breakpoints MUST be 1024px and 767px only. Further breakpoints MAY be added only where a documented layout break requires one.
- FR-25: Every image element MUST carry explicit `width` and `height` attributes, and MUST use `loading="lazy"` below the fold.

---

## Non-Functional Requirements

- NFR-1: Lighthouse mobile Performance score MUST be at least 95, verified by a CI Lighthouse run against the built homepage.
- NFR-2: Total JavaScript shipped on the homepage MUST NOT exceed 30 KB gzipped, verified by build output inspection.
- NFR-3: Largest Contentful Paint under simulated Slow 4G MUST NOT exceed 2.5 seconds.
- NFR-4: Total homepage weight including images MUST NOT exceed 500 KB.
- NFR-5: The site MUST meet WCAG 2.2 Level AA with zero violations, verified by the `a11y-audit` skill in Phase 04.
- NFR-6: The accent colour MUST reach 4.5:1 contrast for text and 3:1 for user-interface components against both `ground` and `ground-inverse`.
- NFR-7: Every interactive element MUST be operable by keyboard and MUST show a visible focus indicator.
- NFR-8: A production build MUST complete in 60 seconds or less.
- NFR-9: The site MUST render usable content with JavaScript disabled — all sections readable, WhatsApp CTA functional.
- NFR-10: The repository MUST contain no secret, API key or endpoint credential, verified by the `env-secrets-manager` skill in Phase 04.

---

## Acceptance Criteria

### AC-1: All copy resolves to config (FR-1, FR-3)

- **Given** a clean checkout
- **When** I search `src/` for any string that appears in the rendered homepage
- **Then** every match resolves to a `config.*` reference rather than a literal, excluding the documented exemption block

### AC-2: A variant needs no code edits (FR-3)

- **Given** the base repository
- **When** I create a variant by editing only `site.config.js` and replacing files in `public/images/`
- **Then** the site builds and renders the new industry correctly, with an empty diff across all `.astro`, `.css` and `.ts` files

### AC-3: Missing config fails loudly (FR-4)

- **Given** `config.products` is present but one product is missing its `name`
- **When** I run the build
- **Then** the build fails with an error naming the offending product index and the missing field

### AC-4: Omitting a section leaves no gap (FR-7)

- **Given** `config.sections` omits the process entry
- **When** the homepage renders
- **Then** no process section appears, no empty container is emitted, and spacing between the adjacent sections matches the standard 80px rhythm

### AC-5: Products precede services (FR-6)

- **Given** a default config
- **When** the homepage renders
- **Then** sections appear in the order hero, proof strip, products, services, process, contact — with products before services

### AC-6: Product pages generate from config (FR-8)

- **Given** `config.products` contains three products
- **When** the site builds
- **Then** three pages exist under `/products/` and each is reachable from the homepage products section

### AC-7: WhatsApp is always one tap away (FR-12, FR-13)

- **Given** a viewport of 375 by 667 pixels
- **When** I load any page and do not scroll
- **Then** a WhatsApp call to action is visible, and activating it opens the configured number with the configured message prefilled

### AC-8: Organisation pills are real radios (FR-15)

- **Given** the qualifying form
- **When** I navigate it using only a keyboard
- **Then** the organisation-type group is a single tab stop, arrow keys move between options, the legend is announced by a screen reader, and the selected pill is distinguishable without relying on colour alone

### AC-9: Budget is banded, not continuous (FR-16)

- **Given** the budget control
- **When** it renders
- **Then** it presents discrete ZMW bands from config as radio options, and no range input exists anywhere in the form

### AC-10: Failed submission preserves input (FR-17)

- **Given** a completed form
- **When** the endpoint returns a non-2xx status
- **Then** an error message appears, entered values remain in their fields, and a retry control is available

### AC-11: Band modes alternate and ink matches (FR-19, FR-20)

- **Given** the homepage
- **When** I sample the computed background of each section in order
- **Then** modes alternate as configured, body text on light bands computes to pure black, and secondary text measures at least 7:1 against its ground

### AC-12: Type is fluid, not stepped (FR-21, FR-22)

- **Given** the compiled stylesheet
- **When** I search for font-size declarations inside media queries
- **Then** zero matches exist for display-ramp tokens, and the display token resolves to 56px at a 1440px viewport, scaling down continuously to 320px

### AC-13: Performance budget holds (NFR-1, NFR-2, NFR-3)

- **Given** a production build
- **When** Lighthouse runs against the homepage on mobile with Slow 4G throttling
- **Then** Performance is at least 95, LCP is 2.5 seconds or less, and total JavaScript is 30 KB gzipped or less

### AC-14: Accessibility passes clean (NFR-5, NFR-7)

- **Given** a production build
- **When** the accessibility audit runs
- **Then** zero WCAG 2.2 AA violations are reported and every interactive element shows a visible focus indicator

### AC-15: Accent contrast verified before build (NFR-6)

- **Given** the configured accent colour
- **When** contrast is measured against both `ground` and `ground-inverse`
- **Then** text usage meets 4.5:1 and interface-component usage meets 3:1, or this spec is amended with an approved adjusted accent

### AC-16: Legal pages follow the brand name (FR-11)

- **Given** `config.brand.name` is changed
- **When** the legal pages render
- **Then** the new name appears throughout and no reference to any prior name remains

### AC-17: The site works without JavaScript (NFR-9)

- **Given** JavaScript is disabled in the browser
- **When** I load the homepage
- **Then** all eight sections render readable content and the WhatsApp call to action still works as a plain link

### AC-18: Navigation is config-driven (FR-10)

- **Given** I add an entry to `config.nav`
- **When** the site rebuilds
- **Then** the new link appears in the primary navigation on every page, in the configured order, with no markup change

### AC-19: The form carries every specified field (FR-14)

- **Given** the rendered qualifying form
- **When** I enumerate its controls
- **Then** first name, last name, email, phone, country, organisation type, services wanted, message and budget band are all present, each with a persistent label rather than a placeholder standing in for one

### AC-20: WhatsApp outranks the form (FR-18)

- **Given** any page of the built site
- **When** I inspect document order and page presence
- **Then** the WhatsApp call to action appears on every page and precedes the qualifying form in document order, while the form appears on the homepage only

### AC-21: Card grids reflow without a column system (FR-23)

- **Given** the compiled stylesheet
- **When** I search for grid declarations
- **Then** card grids use `auto-fit` with `minmax()`, and no 12-column utility or grid definition exists

### AC-22: Only two breakpoints exist (FR-24)

- **Given** the compiled stylesheet
- **When** I list every distinct max-width media query
- **Then** only 1024px and 767px appear, unless an additional value carries a documented justification comment

### AC-24: Standalone routes exist and are navigable (FR-26, FR-10)

- **Given** a default config
- **When** the site builds
- **Then** pages exist at `/products`, `/services`, `/about` and `/contact`, every primary navigation entry resolves to one of them, and no navigation entry is an on-page anchor

### AC-25: A variant without page copy still builds (FR-26)

- **Given** a config with no `pages` block at all
- **When** the site builds
- **Then** the build succeeds, the four standalone routes still render, and each falls back to a heading rather than emitting an empty element

### AC-26: The form lives on contact, not the homepage (FR-27, FR-18)

- **Given** the built site
- **When** I inspect the homepage and `/contact`
- **Then** the qualifying form appears on `/contact` only, and the homepage carries the WhatsApp call to action instead

### AC-27: Reused sections take headings from config (FR-28, FR-1)

- **Given** a section component rendered on more than one route
- **When** I inspect the page templates that use it
- **Then** the heading is passed from a config lookup rather than written as a literal, and `verify:engine` reports no baked-in copy

### AC-28: Service detail pages generate from config (FR-29)

- **Given** `config.services` contains five services
- **When** the site builds
- **Then** five pages exist under `/services/`, each carrying its description, its list of what the engagement includes, who it is for, and links to the other four

### AC-29: Dropdowns build themselves from config (FR-30)

- **Given** I add a product to `config.products`
- **When** the site rebuilds
- **Then** the new product appears in the Products dropdown on every page, with no edit to any navigation markup or second list

### AC-30: Menus work without JavaScript (FR-31, NFR-2, NFR-9)

- **Given** JavaScript is disabled
- **When** I hover a navigation entry that has a dropdown, and separately tab to it
- **Then** the dropdown opens in both cases, and below 767px the disclosure still expands — with zero JavaScript files emitted by the build

### AC-31: A missing service slug fails the build (FR-32)

- **Given** a service in config with no `slug`
- **When** I run the build
- **Then** the build fails naming that service and the missing field, rather than producing a route called `undefined`

### AC-32: The marquee loops seamlessly and announces once (FR-33)

- **Given** `config.proof.logos` contains seven logos
- **When** the homepage renders
- **Then** the track contains exactly two copies of the set, the second is `aria-hidden`, and the animation translates the track by -50% so the loop has no visible seam

### AC-33: The marquee respects reduced motion (FR-34)

- **Given** `prefers-reduced-motion: reduce` is set
- **When** the marquee renders
- **Then** no animation runs, the strip becomes a static wrapping row, and the duplicate set is hidden so no logo appears twice

### AC-34: An empty logo array omits the marquee (FR-33, FR-7)

- **Given** `config.proof.logos` is an empty array
- **When** the homepage renders
- **Then** no marquee section is emitted at all, and the sections either side keep their normal spacing

### AC-35: The header compacts on scroll (FR-35)

- **Given** the homepage at the top of the page
- **When** I scroll down past the threshold
- **Then** the header height reduces from 72px to 58px, the logo from 32px to 26px, and a hairline and shadow appear — reverting when I scroll back to the top

### AC-36: Icons are inline SVG, never emoji (FR-36)

- **Given** the built site
- **When** I inspect any card or process step carrying an icon
- **Then** it is an inline `<svg>` stroked with `currentColor`, no emoji character appears in the markup, and an unknown icon key renders nothing

### AC-37: The FAQ is a real accordion without JavaScript (FR-37)

- **Given** JavaScript is disabled
- **When** I open one FAQ question and then another
- **Then** both open and close correctly and the first closes when the second opens, because the disclosures share a `name` attribute

### AC-38: An empty FAQ drops the section (FR-37, FR-7)

- **Given** `config.faq` is absent or its `items` array is empty
- **When** the homepage renders
- **Then** no FAQ section is emitted and the surrounding sections keep their spacing

### AC-39: Screenshots expose no third-party data (FR-38)

- **Given** every product image shipped in `public/images/products/`
- **When** I inspect each one
- **Then** none shows a client name, tax identification number, contact detail or amount owed belonging to a third party

### AC-23: Images reserve their space (FR-25)

- **Given** the built homepage
- **When** I inspect every image element
- **Then** each carries explicit `width` and `height` attributes, images below the fold carry `loading="lazy"`, and Cumulative Layout Shift measures 0.1 or less

---

## Edge Cases

- EC-1: `config.sections` is empty — build MUST fail with a clear error. An empty site is always a mistake.
- EC-2: `config.products` is empty while products is listed in sections — section is skipped and the build emits a warning, not an error. A services-only industry variant is legitimate.
- EC-3: WhatsApp number missing or malformed — build MUST fail. FR-12 makes it the primary CTA, so it cannot be optional. Validate as digits only, with no plus sign or spaces.
- EC-4: A product name long enough to wrap onto three lines — card grid maintains equal heights, with no overflow and no clipped descender.
- EC-5: Form endpoint unreachable through network failure rather than an HTTP error — same handling as AC-10, retaining data, offering retry, and surfacing the WhatsApp fallback.
- EC-6: An image referenced in config does not exist on disk — build MUST fail with the offending path named. Never ship a broken image.
- EC-7: Config supplies more services than the grid was designed for — grid reflows via `auto-fit` with no horizontal scroll at any breakpoint.
- EC-8: Viewport sits at exactly 767px or 1024px — the boundary resolves deterministically, with no dead zone and no double-applied rule.
- EC-9: A visitor submits the form twice in rapid succession — submit is disabled while in flight, and no duplicate request is sent.
- EC-10: `prefers-reduced-motion` is set — all scroll reveals and transitions are disabled and content is fully visible without animation.
- EC-11: A ZMW budget band label is unusually long — the radio label wraps without breaking the pill row layout.
- EC-12: A variant's configured accent fails contrast — the build emits a loud warning naming the failing pair. It does not block, since a client may accept it, but it MUST never pass silently.

---

## API Contracts

### Enquiry submission

```
POST /api/enquiry
Content-Type: application/json
```

```typescript
interface EnquiryRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  organisationType: string;    // one of config.form.organisationTypes
  services: string[];          // subset of config.form.serviceOptions
  budgetBand: string;          // one of config.form.budgetBands[].value
  message: string;
}

interface EnquirySuccess {      // HTTP 200
  ok: true;
  reference?: string;
}

interface EnquiryError {        // HTTP 4xx or 5xx
  ok: false;
  error: string;
}
```

### The config contract

`site.config.js` is the engine. This interface is the whole product.

```typescript
interface SiteConfig {
  brand: {
    name: string;              // "Glamified Systems"
    tagline: string;
    accent: string;            // hex, e.g. "#0F6E5C"
    logo: string;              // path under public/
    favicon: string;
  };

  contact: {
    phone: string;             // display form: "+260 977 669 883"
    whatsapp: string;          // digits only: "260977669883"
    whatsappMessage: string;   // prefilled deep-link text
    email: string;
    city: string;              // "Lusaka, Zambia"
    hours: string;             // "Mon-Fri, 08:00-17:00 CAT"
    mapUrl?: string;
  };

  nav: Array<{ label: string; href: string }>;

  // Order here IS render order. Omit an entry to omit the section.
  sections: Array<{
    key: "hero" | "proofStrip" | "products" | "services"
       | "proof" | "process" | "form" | "contact";
    mode?: "light" | "inverse";
    heading?: string;
    subheading?: string;
  }>;

  hero: {
    headline: string;
    standfirst: string;
    primaryCta: { label: string; type: "whatsapp" | "link"; href?: string };
    secondaryCta?: { label: string; href: string };
    image?: string;
  };

  products: Array<{
    slug: string;
    name: string;
    summary: string;
    description: string;
    features: string[];
    image: string;
    screenshots?: string[];
  }>;

  services: Array<{ name: string; summary: string; icon: string }>;

  proof: {
    logos?: string[];
    stats?: Array<{ value: string; label: string }>;
    testimonials?: Array<{
      quote: string;
      author: string;
      role: string;
      organisation: string;
      avatar?: string;
    }>;
  };

  process: Array<{ step: string; title: string; detail: string }>;

  form: {
    endpoint: string;
    heading: string;
    organisationTypes: string[];
    serviceOptions: string[];
    budgetBands: Array<{ label: string; value: string }>;
    successMessage: string;
    errorMessage: string;
  };

  legal: {
    jurisdiction: string;
    registeredName: string;
    lastUpdated: string;
  };

  seo: {
    title: string;
    description: string;
    ogImage: string;
    domain: string;
  };
}
```

---

## Data Models

### Product

| Field | Type | Constraints |
|---|---|---|
| `slug` | string | Required. Kebab-case, unique, URL-safe. |
| `name` | string | Required. 1–60 characters. |
| `summary` | string | Required. 1–160 characters, the card layout budget. |
| `description` | string | Required. |
| `features` | string[] | Required. Between 1 and 8 items. |
| `image` | string | Required. Must exist under `public/`. |
| `screenshots` | string[] | Optional. |

### Service

| Field | Type | Constraints |
|---|---|---|
| `name` | string | Required. 1–48 characters. |
| `summary` | string | Required. 1–140 characters. |
| `icon` | string | Required. Icon key or path. |

### BudgetBand

| Field | Type | Constraints |
|---|---|---|
| `label` | string | Required. Display text in ZMW. |
| `value` | string | Required. Unique, submitted verbatim. |

### Contact

| Field | Type | Constraints |
|---|---|---|
| `whatsapp` | string | Required. Digits only, 10–15 characters, no plus sign or separators. |
| `phone` | string | Required. Display form, free text. |
| `email` | string | Required. Valid email address. |
| `hours` | string | Required. |

### Derived values

| Value | Derivation |
|---|---|
| Product route | `/products/` plus the product slug |
| WhatsApp href | `https://wa.me/` plus `contact.whatsapp`, with the encoded message appended |
| Section mode | `sections[i].mode` when set, otherwise alternating from light at index 0 |
| CSS accent token | `--accent` set from `brand.accent` at build time |

---

## Out of Scope

- OS-1: CMS or admin interface — the config file is the interface. A CMS reintroduces the per-client hosting cost the engine exists to avoid. Revisit only if a client demands self-service editing.
- OS-2: Blog or articles section — both references have one and neither is load-bearing for conversion. It adds a content model and an ongoing writing obligation.
- OS-3: ~~Service detail pages~~ — **reversed.** This was excluded on the grounds that five *thin* pages would dilute search visibility. With full detail written for each service (description, what the engagement includes, who it is for), the pages are no longer thin, and each targets a distinct search intent — "payroll outsourcing Lusaka" is not the same query as "IT support Zambia". Now specified in FR-29.
- OS-4: E-commerce or online payment — enquiries convert over WhatsApp. No cart, no checkout.
- OS-5: Multi-language support — English is the business language for this market segment. The config structure does not preclude adding it later.
- OS-6: The twenty industry variants themselves — this spec covers the engine and variant one. The catalogue is Phase 06 work.
- OS-7: Analytics and tracking — deferred to a separate decision, because it carries a consent-banner obligation that would otherwise land in this build unplanned.
- OS-8: A viewer-facing dark mode toggle — tokens are light and dark pairs because sections alternate, not because the visitor picks a theme.
- OS-9: Animation beyond scroll reveal — the motion budget stays minimal for NFR-1 and EC-10.

---

## Open Assumptions

Decided rather than confirmed. Each is cheap to change now and expensive after Phase 04.

| # | Assumption | If wrong |
|---|---|---|
| A-1 | ~~Multi-page~~ — **confirmed and built.** Homepage summary plus `/products`, `/services`, `/about`, `/contact`, product detail pages and three legal pages. Eleven routes. | Resolved. |
| A-2 | Budget bands are placeholders, derived from the K1,500 and K3,500 tiers named in the playbook. | Config edit only. |
| A-3 | Testimonial content is still placeholder. Product copy is now real, taken from each product's own documentation. | No structural impact. |
| A-4 | The form posts to a Netlify Function; the exact endpoint is still to be chosen. | Changes the FR-17 implementation, not its contract. |
| A-5 | ~~Three products~~ — **confirmed.** GlamifiedHR, GlamifiedSales, GlamifiedFleet. Other systems in the parent folder (Fees, Hospitality, GS-Loans, Educellency) are deliberately not on the site. | Config edit only. |
| A-6 | Contact email is `info.glamifiedsystems@gmail.com`, taken from the GlamifiedHR user instructions. **The phone number conflicts:** the playbook says +260 977 669 883, the GlamifiedHR instructions say +260 77 002 9596. The playbook number is in config. | Config edit only — but confirm which is right. |
