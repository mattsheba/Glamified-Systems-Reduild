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
| `verify:sitemap` | Every indexable built page is in the sitemap, every sitemap URL matches that page's own canonical, and no `noindex` page is advertised |
| `verify:downloads` | The installer and user guide URLs the site offers actually resolve |

All five run on `npm run build`, in that order — the last two need `dist/`, so
they run after `astro build`. A broken config fails loudly at build time rather
than rendering the word `undefined` to a client.

`verify:downloads` reaches the network. It retries a connection failure twice
before giving up, because a slow link once reported a file as missing that was
present and serving 200. An HTTP status is trusted immediately and never
retried, so a genuine 404 still fails the build.

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
  pages/                index, features, /products/[slug], /privacy /terms /refund
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

This site runs in **single-product mode** (`productOnHome` in `site.config.js`):
it sells GlamifiedHR, so the homepage *is* the product page and the product
routes redirect to it. The routes still build, because the engine also serves
variants with several products.

| Route | What it is |
|---|---|
| `/` | Homepage — the GlamifiedHR page. Hero, proof, the product in full, four walkthrough screens, clients, services, process, FAQ, enquiry form. |
| `/features` | The whole application, screen by screen, from `products[0].walkthrough` |
| `/products` | Product listing. **Force-redirected to `/`** while `productOnHome` is set |
| `/products/[slug]` | One page per product, generated from config. **Force-redirected to `/`**, and `noindex`, while `productOnHome` is set |
| `/pricing` | What the licence costs, what it includes, the trial, and how buying works. Price is read from the product, so there is one figure on the site |
| `/paye-calculator` | PAYE, NAPSA and NHIMA on one salary, with the bands and the working shown. Renders a full worked example server-side, so it still answers with JavaScript off |
| `/guides` | The payroll guides, listed |
| `/guides/[slug]` | One long-form guide, its figures parameterised by `config.statutory` |
| `/requirements` | What it runs on, how it installs, where the data lives, and how backup and restore work |
| `/support` | How to reach a person, what support covers, licence keys and reinstalls, the user guide |
| `/releases` | Version history. The current release is derived from the download version, never typed |
| `/services` | The services hub — one service while this site sells one |
| `/services/[slug]` | One page per service — full detail, generated from config |
| `/about` | **About GlamifiedHR.** The product leads; Glamified Systems is introduced as the company that builds it |
| `/contact` | Contact details and the qualifying form |
| `/privacy` `/terms` `/refund` | Legal, parameterised by config |

Everything from `/pricing` down to `/releases` is conditional on its own config
block (`pricing`, `statutory`, `requirements`, `support`, `releases`). A variant
that carries none of them builds a site without those routes, and without the
navigation, footer and sitemap entries that point at them.

## Moving to a new domain

The site is served from **glamifiedsystems.com** until a product domain is
bought. The move is deliberately close to a one-line change:

1. Change `seo.domain` in `site.config.js`. That single value feeds the Astro
   `site` setting, every canonical, the sitemap, `robots.txt` and the
   structured data — nothing else in the repository hard-codes the site origin.
2. Decide about **`downloads.baseUrl`**. The installer and guide are served from
   `downloads.glamifiedsystems.com` (Cloudflare R2). It can stay there after the
   move, but if it does, note that the HSTS `includeSubDomains` comment in
   `public/_headers` no longer describes a subdomain of this site.
3. Set **`SITE_URL`** in the Netlify environment to the new origin, for the
   payment function's return URLs.
4. Re-verify the site in Bing and Google Search Console, and replace the two
   verification files in `public/` — `BingSiteAuth.xml` and the IndexNow key
   file — with ones issued for the new domain. The IndexNow plugin pings with
   the key named by that file, so a stale one makes every ping fail silently.
5. Add 301s from the old domain to the new one at the host, and keep them. The
   redirect rules in `public/_redirects` are all site-relative and carry over
   unchanged.

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

- **No testimonial is a GlamifiedHR quote.** The three in `proof.testimonials`
  are real, named clients in their own words, but every one is about company
  registration, monthly statutory filing or branding — engagements this site no
  longer sells. They are framed as evidence that the statutory side is handled
  rather than as product testimonials, and `using:` says what each client
  actually bought. On a single-product site they still pull towards the software
  house the rebuild removed. **Decide one of:** replace them as payroll clients
  agree to be quoted, re-head the section so it does not read as product praise,
  or drop the section and keep the client logo strip, which is factual on its
  own. Do not reword a client's quote to fit the positioning.
- **Phone number conflict.** The playbook says +260 977 669 883; the GlamifiedHR
  user instructions say +260 77 002 9596. Config carries the first. Confirm which
  is right before launch.
- **Legal pages are unreviewed templates.** They carry a visible warning banner.
  Have a lawyer check them before any client site goes live.
- **Online payment is switched off.** `payments.enabled` is `false`, so no page
  renders a buy button and `/pricing` describes the real flow instead: you ask,
  we invoice, the licence key is emailed when the payment clears. The Lenco
  function and `/payment-success` are wired and ready for the day it is turned
  on.
- **`pricing.headcount` is unset, on purpose.** The software has 50, 100 and
  unlimited-employee editions; the site quotes one price of K5,000. Until it is
  confirmed which edition that buys, `/pricing` publishes no headcount limit —
  guessing it either turns away a business that could have bought or sells one a
  licence that stops short. Set the field and the page prints it.
- **The product is at 1.3.0; the site sells 1.2.0.** That is correct rather than
  stale: `GlamifiedHR-Setup-1.3.0.zip` has never been uploaded, and
  `downloads.glamifiedsystems.com` returns 404 for it, so the site advertises
  what exists. To ship it: upload the installer and the rebuilt guide, point
  `products[0].download` and `guide` at 1.3.0, and add its entry to
  `releases.items` — its changes are listed in the config comment above that
  block.
- **Accent on dark bands is derived, not chosen.** The configured accent
  (`#006C90`) measures 2.70:1 on the inverse ground, which fails WCAG, so
  `--accent-inverse` lightens it via `color-mix`. `verify:config` prints this as
  an expected note rather than an error. Worth a designer's eye before launch.
- **No a11y audit run yet.** Phase 04 of the playbook calls for `a11y-audit` and
  `env-secrets-manager`; neither has been run.
