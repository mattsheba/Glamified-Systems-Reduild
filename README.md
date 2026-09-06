# Glamified Website Engine

One Astro codebase that produces the Glamified Systems site — and every industry
variant after it — from a single config file.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # verify + typecheck + build to dist/
npm run preview  # serve the built site
```

## The one rule

**Every user-visible string and every image path lives in `site.config.js`.**

A new industry variant is that file plus a folder of images. No `.astro`, `.css`
or `.ts` file is edited, ever. If you find yourself opening a component to change
wording, stop — add the field to config instead. That single constraint is the
difference between a website and a catalogue you can sell twenty times.

`npm run build` enforces it. `scripts/verify-engine.mjs` scans every template and
fails the build if readable copy is baked into markup.

## Making a variant

To check a variant still builds, without touching the live site:

```bash
npm run verify:variant                        # the lodge example
npm run verify:variant -- variants/other.js   # any other variant
```

This builds into a throwaway directory and restores your config afterwards.
**Do not** swap the config by hand and rebuild:

```bash
# Don't do this while anything is serving dist/
cp variants/lodge.config.js site.config.js && npm run build
```

That writes the variant into `dist/` for the length of the build, so a preview
server or an open browser tab shows a lodge site until the next real build lands.
It looks exactly like a bug and it is very confusing.

`variants/lodge.config.js` is a worked example and a live proof: it produces a
different industry, with no products section at all, a different accent and
per-night pricing, from an empty diff across every source file. It has already
caught two real bugs, so it earns its place.

To start a new variant, copy `site.config.js`, edit it, and drop the images into
`public/images/`.

## What the build checks

| Script | Enforces |
|---|---|
| `verify:config` | Required fields present, WhatsApp number well-formed, every referenced image exists on disk, accent contrast measured |
| `verify:engine` | No copy or image path baked into markup |
| `astro check` | Components match the `SiteConfig` contract in `src/types.ts` |

All three run on `npm run build`. A broken config fails loudly at build time
rather than rendering the word `undefined` to a client.

## Layout

```
site.config.js          the engine — all content
variants/               example alternate configs
specs/glamified-site.md the behavioural contract (validates 100/100)
design-tokens.md        the visual contract, extracted in Phase 02
src/
  types.ts              SiteConfig — what components type-check against
  lib/site.ts           the only typed entry point to config
  styles/tokens.css     design tokens, light/dark pairs
  layouts/Base.astro
  components/sections/  one file per section
  content/legal.ts      legal templates, parameterised by config
  pages/                index, /products/[slug], /privacy /terms /refund
scripts/                build-time verification
```

## Design system in one screen

- **Type** — one ramp, ratio 1.25, capped at 56px, fluid via `clamp()`.
  Tracking and line-height invert with size: big and tight, small and wide.
- **Spacing** — base 8. Two values (8 and 16) carry most of the layout.
- **Colour** — light/dark pairs. `--ink` and `--ground-inverse` are the same
  navy, which is what stops the alternating bands reading as two themes.
- **Sections** — alternate light/inverse band by band, driven by config order.
- **Grid** — `auto-fit` / `minmax()`. There is no 12-column system.
- **Breakpoints** — 1024 and 767. That's it.

Full reasoning, and what was deliberately *not* taken from the reference sites,
is in `design-tokens.md`.

## Routes

| Route | What it is |
|---|---|
| `/` | Homepage — a summary. Hero, proof, products, services, process, contact. |
| `/products` | All three products |
| `/products/[slug]` | One page per product, generated from config |
| `/services` | All five services |
| `/services/[slug]` | One page per service — full detail, generated from config |
| `/about` | Who we are, how we work, proof |
| `/contact` | Contact details and the qualifying form |
| `/privacy` `/terms` `/refund` | Legal, parameterised by config |

## Navigation

Nav entries can declare a dropdown with `childrenFrom: "products" | "services"`,
which builds the menu from that config array at build time. Adding a product adds
a menu entry — there is no second list to keep in step.

Menus open on hover **and** on keyboard focus, using `:focus-within`. Below 767px
they collapse into a `<details>` disclosure. All of it is CSS and HTML: the build
still emits zero JavaScript files, so the navigation works with scripting off.

## Interaction details

**Sticky header.** Compacts once scrolled — 72px to 58px, logo 32px to 26px, plus
a hairline and shadow. Driven by a passive scroll listener behind a
`requestAnimationFrame` guard, so at most one class toggle per frame. Without
JavaScript the header is still sticky, it just doesn't compact.

**Logo marquee.** `config.proof.logos` renders as a continuously scrolling strip.
The track is duplicated and translated by exactly -50%, which is what makes the
loop seamless; the second copy is `aria-hidden` so a screen reader doesn't
announce every client twice. It pauses on hover, and under
`prefers-reduced-motion` it stops and becomes a static wrapping row. An empty
`logos` array omits the section entirely.

**Icons.** Inline stroke SVG on a 24×24 grid drawn with `currentColor`, so one
icon works on both light and inverse bands. Selected by an `icon` key in config
(`services[].icon`, `process[].icon`, `pages.about.values[].icon`). No emoji, no
icon font, no external request. An unknown key renders nothing — a missing icon
should never break a variant's build. The set lives in `src/components/Icon.astro`.

## Known gaps

These are real and tracked, not oversights:

- **Product copy is real; testimonials are not.** Product descriptions come from
  each product's own documentation. The testimonial still reads `PLACEHOLDER —`,
  as do the logo and screenshots.
- **Phone number conflict.** The playbook says +260 977 669 883; the GlamifiedHR
  user instructions say +260 77 002 9596. Config carries the first. Confirm which
  is right before launch.
- **Legal pages are unreviewed templates.** They carry a visible warning banner.
  Have a lawyer check them before any client site goes live.
- **`/api/enquiry` does not exist yet.** The form posts to it and degrades
  handled by Netlify Forms: the build bot registers the form from the
  deployed HTML, so there is no function to write or maintain.
- **Accent on dark bands is derived, not chosen.** `#0F6E5C` measures 2.64:1 on
  the inverse ground, which fails WCAG, so `--accent-inverse` lightens it via
  `color-mix`. Worth a designer's eye before launch.
- **No a11y audit run yet.** Phase 04 of the playbook calls for `a11y-audit` and
  `env-secrets-manager`; neither has been run.
