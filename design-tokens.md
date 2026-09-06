# Glamified Systems — Design System v1

Phase 02 output for the Rebuild Playbook. Design decisions only: no assets, no copy,
no source code.

Read from rendered computed styles in a real browser at 1358px on two references:

| Source | Read for | Verdict |
|---|---|---|
| probeyservices.com | Structure, colour logic, section rhythm | **Over-built.** 15 sections, 80px display type, 19-step type scale. Take the ideas, not the scale. |
| proweb.co.zm | Type scale, the qualifying form | **Closer peer.** Zambian, same market, tops out at 45px. This is the right altitude. |

Both are WordPress + Elementor with no token layer — Probey ships **2,956 hand-set
font-size overrides** across two breakpoints. Playbook Phase 02 reality check applies:
do not match the stack. Rebuild in Astro or Next.

Everything below is a **decision**, with the source noted. Where the references disagreed,
the call is stated.

---

## 1. Type

### Families

Keep the *rule*, not their fonts: **one display face, one body face, hard split by job.**
Probey never sets body text in its display face and never sets a headline in its body
face — that single discipline does most of the work.

| Role | Pick | Why |
|---|---|---|
| Display | A grotesque with a real 700–800 weight | Probey uses Archivo 800; ProWeb uses Syne. Either works. |
| Body | A humanist sans, 400/600 | Probey uses Manrope; ProWeb uses DM Sans. |

Both are open-source pairings (SIL OFL) so they are legally free — but keeping Probey's
*exact* pair alongside a similar navy would make the two sites read as siblings. Pick
your own two.

### Scale — decided

Probey tops at 80px, ProWeb at 45px. **Take 56 as the cap.** 80px display type needs the
full-bleed photography and 9,000px page depth Probey has to support it; on a five-section
site it reads as shouting.

One ramp, ratio **1.25**, no detached display tier:

| Token | px | Weight | LH | Tracking | Role |
|---|---|---|---|---|---|
| `display` | 56 | 800 | 1.05 | −0.02em | Hero H1 only |
| `h1` | 44 | 800 | 1.1 | −0.02em | Section headline |
| `h2` | 32 | 700 | 1.15 | −0.01em | Sub-section |
| `h3` | 25 | 700 | 1.2 | 0 | Card title |
| `lead` | 20 | 600 | 1.4 | 0 | Intro paragraph |
| `body` | 16 | 400 | 1.5 | 0 | Default |
| `small` | 14 | 400 | 1.5 | 0 | Secondary |
| `label` | 13 | 600 | 1.0 | +0.08em | UPPERCASE — nav, eyebrows, buttons |
| `meta` | 12 | 400 | 1.5 | 0 | Fine print, legal |

### Two rules worth stealing outright

1. **Tracking inverts with size.** Probey sets 56–80px at −2px and 13–14px uppercase at
   +0.5 to +2.5px. Big and tight, small and wide. Encoded in the table above.
2. **Line-height inverts too.** 1.05 at display, 1.5 at body. No exceptions found on
   either site.

### Responsive

Probey hand-sets every size at every breakpoint. Don't. **Use `clamp()` on the ramp:**

```css
--display: clamp(2rem, 1.2rem + 3.6vw, 3.5rem);   /* 32 → 56 */
--h1:      clamp(1.75rem, 1.2rem + 2.5vw, 2.75rem); /* 28 → 44 */
--h2:      clamp(1.375rem, 1.1rem + 1.2vw, 2rem);   /* 22 → 32 */
```

Body sizes stay fixed. Only the display ramp needs to move.

---

## 2. Spacing

Probey's base unit is **5px** — 79% of its spacing values are multiples of 5, only 5% are
multiples of 8. That is a real finding about *them*, and **not one to inherit**: a 4/8
base is standard, matches Tailwind's default scale, and no one will see the difference.

**Base 8, with a 4 half-step:**

```
4 · 8 · 16 · 24 · 32 · 48 · 64 · 80 · 120
```

Worth knowing: two values carried 60% of every spacing decision Probey made (10 and 20).
Expect the same concentration here at **8 and 16** — if a third value starts appearing
everywhere, the scale is wrong.

### Section rhythm

| Breakpoint | Padding |
|---|---|
| Desktop | **80** top / bottom |
| Tablet ≤1024 | 56 |
| Mobile ≤767 | 40 |

Two variants: `48` compressed, and `16` for full-bleed strips like a logo marquee.

---

## 3. Colour roles

Roles, not values. Glamified's accent is `#0F6E5C` from `site.config.js`.

| Role | Job |
|---|---|
| `ground` | Off-white default page (~`#f6f6f6`) |
| `ground-inverse` | Deep navy band |
| `surface` | White cards on `ground` |
| `surface-tint` | One pale wash for section alternation |
| `ink` | Body text on light — **same navy as `ground-inverse`** |
| `ink-inverse` | White on dark |
| `ink-muted` / `ink-muted-inverse` | Secondary text, both modes |
| `accent` | `#0F6E5C` — buttons, active states, focus |
| `hairline` / `hairline-inverse` | `white @ 0.15` on dark, near-white on light |
| `link` · `success` · `warning` · `error` | Semantic, sparingly |

### The one structural finding worth keeping

Probey's text splits almost exactly 50/50 between white-on-dark (163 nodes) and
navy-on-light (158). **It is a two-mode page that alternates band by band**, and that
alternation is most of why it feels designed rather than assembled.

Two consequences:

- **Define every token as a light/dark pair from day one.** Retrofitting an inverse
  later is the expensive version of this.
- **`ink` and `ground-inverse` should be the same colour.** One navy doing both jobs is
  what stops the two modes reading as two different themes.

Note both references use an orange accent — Probey `#f8ae1f`, ProWeb `#fb9200`. A green
accent is a genuine differentiator in this market. It also will not inherit their
contrast maths: **check `#0F6E5C` against both grounds before building** (Playbook
Phase 04 runs `a11y-audit` for this).

---

## 4. Grid & container

| Property | Decision | Source |
|---|---|---|
| Container | **1200px** max, hard cap | Probey 1290, ProWeb 1140 — split it |
| Gutter | 24px per side | — |
| Full-bleed | Sections run edge-to-edge; only inner container is capped | Probey |
| Header | 72–80px | Probey 75 |

**No 12-column system.** Probey uses wrapping flex 42 times against 30 grids, and picks
column counts per section. A 12-col grid here would be inventing structure that isn't
there. Use `auto-fit` / `minmax()`:

| Pattern | Columns |
|---|---|
| Card grid | 2 desktop → 1 mobile |
| Feature tiles | 3 → 2 → 1 |
| Logo / icon strip | 5–6 → 3 |

### Breakpoints

**1024** and **767.** That's it — those two carry 4,765 of Probey's rules; everything
else in its stylesheet is plugin noise. Add `480` only if something actually breaks.

---

## 5. Sections — trimmed to 8

Probey runs 15. Per `site.config.js` you need these:

| # | Section | Notes |
|---|---|---|
| 1 | **Hero — products first** | Per your last positioning pass: GlamifiedHR, Fleet, Sales. Dark band. |
| 2 | Proof strip | Client logos or deployment count. Compact 16px band. |
| 3 | Products | The three systems, in detail |
| 4 | Services | Web/software, IT support, consultancy, payroll, graphic design |
| 5 | Proof — named | Zambian deployments, real dashboard screenshots |
| 6 | Process | How an engagement runs |
| 7 | **Qualifying form** | Section 6 below |
| 8 | Contact / footer | Lusaka · WhatsApp · hours · legal pages |

**The sequencing idea worth taking:** Probey interleaves proof between every substantive
section rather than pooling it in one testimonials block — four separate placements.
Two placements (2 and 5) is the right dose at this size.

---

## 6. The qualifying form — ProWeb pattern

The component you flagged. Worth being precise about *why* it works: it is not a contact
form, it is a **qualifying brief**. It captures organisation type, service interest and
budget before you ever reply — which is exactly what routes an enquiry to a tier.

### Structure — two columns

```
LEFT                          RIGHT
First Name  |  Last Name      Message (textarea, ~200px)
Email                         Budget (range slider)
Phone       |  Country        [ Get Started ]
Organization Type  ← pills
Services  ← checkboxes
```

Collapses to one column at 767.

### Fields

| Field | Control | Notes |
|---|---|---|
| First / Last name | text, 2-col | |
| Email | email | |
| Phone / Country | tel + text, 2-col | Default country to Zambia |
| **Organization type** | radio group as **segmented pills** | NGO/NFP · Enterprise · SME · Startup · Other |
| **Services wanted** | checkbox list | Map to your five service lines |
| Message | textarea | |
| **Budget** | range slider | See warning below |

### Control spec

Radius is a uniform **5px** on every control — inputs, pills, submit. That consistency is
half of why it reads as tidy. Round to **8px** to match the spacing base.

| Control | Height | Type | Padding | Fill | Border |
|---|---|---|---|---|---|
| Input / textarea | 36 | 13 / 400 | 7 × 15 | white | 1px dark |
| Pill — unselected | 30 | 12 / 400 | 8 × 15 | transparent | 1px dark |
| Pill — selected | 30 | 12 / 400 | 8 × 15 | **accent** | 1px accent |
| Submit | 40 | 13 / 400 | 10 × 22 | **accent** | none |
| Label | — | 16 / 400 | — | — | — |

Bump input and submit type to 16px on mobile — anything under 16 triggers zoom-on-focus
in iOS Safari.

### Two changes for your market

1. **The budget slider is $100k–$200k.** That is enterprise USD and wrong for you by
   two orders of magnitude. Band it in **ZMW against your actual tiers** — and prefer
   discrete bands over a slider, since a slider implies a precision you don't price at.
2. **This form is not the primary CTA.** Per Playbook Phase 05 and your `zambia-local`
   skill, a WhatsApp deep link is how enquiries actually arrive. Run the form as the
   considered path for larger enquiries; keep WhatsApp as the loud one.

Accessibility, since these are the three things this pattern usually gets wrong:
segmented pills need real `<input type="radio">` under them with a `<fieldset>` and
`<legend>` (ProWeb does this correctly — keep it); the slider needs a live text readout
of its value; every field needs a persistent `<label>`, not a placeholder standing in
for one.

---

## 7. Radius & elevation

**Radius: `8 · 16 · pill · 50%`.** Probey runs 10/20/30/50/50% — one step more than it
needs. Four values covers everything.

**Shadow — one blur value, 10px, exactly as Probey does it:**

| Token | Value |
|---|---|
| `shadow-sm` | `rgba(0,0,0,0.06) 0 0 10px` |
| `shadow` | `rgba(0,0,0,0.28) 0 0 10px` |
| `shadow-glow` | `rgba(255,255,255,0.19) 0 5px 10px` |

`shadow-glow` is how cards lift off a dark band without a border. Cheap, and it does a
lot of work in the two-mode layout.

---

## What not to take

Per Playbook Phase 01:

- **Neither orange accent.** `#f8ae1f` and `#fb9200` are those companies' signatures.
  Use `#0F6E5C`.
- **Not Probey's exact font pair** alongside a similar navy — keep the two-family
  *rule*, pick your own faces.
- **Not ProWeb's field labels or service wording** — the form *structure* is a common
  pattern and yours to use; their specific copy is not. Write your five service lines
  in your own words.
- No assets, no copy, no markup from either site is in this file.

## Carry into Phase 03

1. One type ramp, **ratio 1.25, capped at 56** — not Probey's 80.
2. Spacing base **8** — not Probey's 5.
3. Section rhythm **80 / 56 / 40**.
4. Container **1200 / 24px gutter**.
5. Colour tokens as **light/dark pairs**; `ink` and `ground-inverse` the same navy.
6. Breakpoints **1024 / 767**. Fluid `clamp()` display type, fixed body.
7. `auto-fit` card grids, no 12-column system.
8. **8 sections**, proof interleaved at 2 and 5.
9. **Qualifying form** with ZMW budget bands, WhatsApp as the primary CTA.
