# Handoff: LUMA Marketing Landing Page (warm editorial redesign)

## Overview
A ground-up redesign of LUMA's public marketing landing page (`luma-bot.com`). LUMA is an AI customer-service teammate for Shopify merchants that replies to Instagram DMs and storefront chat in **Arabic, English, and Franco Arabic (3arabi)**. This design replaces the existing dark "cosmos" space-themed landing with a **warm, editorial, magazine-style** page whose differentiator — handling **Franco Arabic** — is the hero. The page sells: never-silent customer service, three-language support, and an analytics edge.

This deploys to the **`tonyhani01/luma-landing`** repo, replacing the current `index.html`.

## About the Design Files
The files in `design_files/` are **design references created in HTML** — a working prototype showing the intended look and behavior. **They are not production code to ship directly.** They load React + Babel from a CDN and compile JSX *in the browser*, which is fine for review but **too slow for production**.

Your task: **recreate this design as a proper, precompiled static site** using the project's environment. Recommended stack: **Vite + React** (or Next.js if SSR/SEO routing is wanted), so JSX is built ahead of time. The existing `luma-landing` repo is a single static Tailwind HTML file — you can either introduce a small Vite build, or port the design to plain HTML/CSS. Either is fine; the **visual result must match the prototype pixel-for-pixel.**

The prototype is organized as: `index.html` (mounts everything) → `WarmHero.jsx` (header + hero) → `WarmSections.jsx` (statement, how-it-works, languages, pricing, footer) → `WarmAnalytics.jsx` (analytics section). `warm.css` holds all tokens + base styles. Read these for exact inline styles; this README captures the essentials.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions. Recreate pixel-perfectly. Every measurement and hex below is authoritative.

---

## Design Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F4EFE6` | Page background (warm cream) |
| `--paper-2` | `#ECE5D7` | Alternating section bg (how-it-works, pricing) |
| `--paper-3` | `#E2D9C7` | Deeper paper / empty bar tracks |
| `--paper-card` | `#FBF8F2` | Card backgrounds (hero card, analytics panels) |
| `--ink` | `#1B1A17` | Primary text (warm near-black); also footer bg |
| `--ink-2` | `#57514A` | Secondary text |
| `--ink-3` | `#8A8278` | Muted text / metadata |
| `--blue` | `#2640DE` | **Brand accent** — links, italic accents, bars, CTAs-on-dark |
| `--blue-deep` | `#1A2BA0` | Pressed/darker blue, bold inline numbers |
| `--blue-soft` | `#E4E5FB` | Soft bar fills (chart non-peak bars) |
| `--line` | `rgba(27,26,23,.16)` | Hairline rules / borders |
| `--line-2` | `rgba(27,26,23,.09)` | Fainter hairline |

> Note: the prototype's accent is tweakable; ship the default **`#2640DE`** (brand blue). There is **no** secondary/clay color — blue is the single accent.

### Typography (all Google Fonts)
| Role | Family | Weights | Notes |
|---|---|---|---|
| Display / headings / UI | **Bricolage Grotesque** | 400/500/600/700/800 | `letter-spacing: -.02em` to `-.025em` at large sizes; `line-height: ~.98–1.1` |
| Editorial body + italic accent | **Newsreader** | 300/400 + italic | Body weight **300**; the italic accent clauses use `font-style: italic; font-weight: 400` |
| Arabic | **Tajawal** | 400/500/700/800 | Used for any Arabic script, always `dir="rtl"` |
| Mono — kickers, metadata, numerals | **JetBrains Mono** | 400/500/600 | |

Font import (production: prefer self-hosting via `@fontsource` or downloaded woff2):
```
https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Space+Grotesk:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Tajawal:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap
```
(Space Grotesk is only needed if you keep the headline-font tweak; otherwise omit.)

### Type scale (clamp = responsive)
- **Display** (hero H1, footer H1): `font-weight 800; letter-spacing -.025em; line-height .98; font-size clamp(2.8rem, 6.4vw, 5.4rem)`
- **H2** (section headings): `font-weight 700; letter-spacing -.02em; line-height 1.04; font-size clamp(2rem, 4vw, 3.1rem)`
- **Lede** (Newsreader): `font-weight 300; font-size clamp(1.15rem, 1.7vw, 1.5rem); line-height 1.5; color --ink-2`
- **Kicker** (mono): `font-size 12px; font-weight 500; letter-spacing .18em; text-transform uppercase; color --ink-3`
- **Num** (mono): `font-size 13px; letter-spacing .1em; color --blue`

### Spacing / radius / misc
- Content width: `.wrap { max-width: 1200px; margin: 0 auto; padding: 0 40px; }` (mobile `padding: 0 22px`)
- Section vertical padding: `clamp(56px, 8vw, 112px)` (varies per section, see below)
- Border radius: **2px** on buttons/inputs (sharp, editorial), **4px** on cards/panels. Not rounded.
- Hairline rules everywhere: `1px solid var(--line)`; section dividers `2px solid var(--ink)` (top of stat rows / pricing table).
- Paper grain: a subtle fixed SVG-noise overlay at `opacity .035; mix-blend-mode: multiply` (optional; see `warm.css` `body::before`).
- Easing: `cubic-bezier(.2,.6,.2,1)`.

### Buttons
- **Primary (fashion black):** `background: var(--ink); color: var(--paper); border: 1px solid var(--ink); border-radius: 2px; padding: 15px 26px; font-family: Bricolage; font-weight: 600; font-size: 16px;` Hover → `background: #000`; active → `translateY(1px)`. Arrow icon nudges `translateX(4px)` on hover.
- **Ghost:** transparent bg, `1px solid var(--ink)` border, ink text; hover inverts to ink bg + paper text.
- **On dark footer:** primary button flips to `background: var(--paper); color: var(--ink)`.
- **Link (blue):** `color: var(--blue); font-weight 600;` with an underline that appears on hover (`border-bottom: 1.5px solid` transparent → blue).
- **Field:** `background: var(--paper-card); border: 1px solid var(--line); border-radius: 2px; padding: 15px 18px;` focus → `border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-soft)`.

---

## Screens / Views
Single long-scroll page. Section order: **Header → Hero → Statement → How it works → Languages → Analytics → Pricing → Footer.**

### 1. Header (sticky)
- `position: sticky; top: 0; height: 70px; background: rgba(244,239,230,.86); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line)`.
- Left: `luma-logo.png` (30×30) + wordmark **"LUMA"** (Bricolage 800, 21px, `letter-spacing .02em`).
- Center nav (Bricolage 500, 15px, `--ink-2`, hover `--ink`): **How it works · Languages · Pricing · Security**. Hidden < 900px.
- Right: **"Sign in"** (blue link) + **"Request access"** (black button, 11px/18px padding).

### 2. Hero
- Padding top `clamp(48px,7vw,96px)`, bottom `clamp(40px,6vw,80px)`.
- Kicker: **"AI customer service · built for Egyptian commerce"**.
- **H1 (display, max-width 1040px):** lead line in ink + an italic Newsreader accent clause in `--blue` at `0.82em`. The exact copy is **configurable** (the prototype ships a picker); use this default:
  > **"Your customer service, handled."** *"An AI teammate fluent in Arabic, English, and 3arabi."*
  (Other approved options are listed in `index.html` `HEADLINES`. Pick one; don't ship the picker.)
- Below: two-column grid (`1fr 1.05fr`, gap `clamp(32px,5vw,72px)`, collapses to 1 col < 900px):
  - **Left:** lede paragraph — *"Most chatbots break on **Franco Arabic** — Egyptian Arabic typed in Latin letters. LUMA was **built for it**, and answers in Arabic and English too — catalog-aware, confidence-scored, and never silent."* Then an email field + black **"Request access →"** button. Sub-note (mono, --ink-3): *"We personally set up every brand we onboard."* Then a 3-stat row separated by a top hairline: **< 2s** / median reply · **24/7** / every channel · **3** / languages, auto (numbers Bricolage 800 30px; labels mono 11.5px uppercase).
  - **Right:** the **enlarged DM card** (see below).

#### Hero DM card (the centerpiece)
A `--paper-card` card, `border: 1px solid var(--line); border-radius: 4px; padding: clamp(26px,3vw,40px); box-shadow: 0 18px 40px -28px rgba(27,26,23,.4)`. Contents:
- Meta row: a blue dot + kicker **"Instagram DM · 11:48 PM"** + a small **"FRANCO ARABIC"** pill (mono 10.5px, white on `--blue`, `border-radius 2px`, `white-space: nowrap`).
- **Customer message** — left border `2px solid var(--ink-3)`, padding-left 22px. Label "Customer" (kicker, --ink-2). The message is **Franco Arabic, large, in Bricolage 800**: **"bikam el hoodie el oversize? 👀"** at `clamp(1.9rem,3.4vw,2.9rem)`. Mono sub-note: *"Egyptian Arabic, typed in Latin letters. Means "how much is the oversized hoodie?""*
- **LUMA reply** — left border `2px solid var(--blue)`, padding-left 22px. Small logo (18px) + kicker **"LUMA · replied in Franco, in 1.4s"** (blue). Reply in Bricolage 600 `clamp(1.35rem,2.3vw,1.9rem)`: **"el oversized hoodie bi 750 genaih 🖤 mawgood mn S l XL — eswed w zayti. agiblak el size?"** ("750 genaih" bolded in `--blue-deep`). Then a green dot + mono **"94% confident · answered from live catalog"**.

### 3. Statement
- Padding `clamp(64px,9vw,128px) 0`, `.wrap` max-width 1000px.
- Kicker "Why it matters" + an **H2** (max-width 920px): *"A customer who waits is a customer who leaves. LUMA makes sure no one is **left on read** [italic blue] — even at 2am, even in Franco Arabic, even when your team is asleep."*

### 4. How it works
- Background `--paper-2`, top+bottom `1px solid var(--line)`. Inner padding `clamp(56px,7vw,96px)`.
- Header row: H2 **"How an AI teammate earns trust"** (max-width 520) + kicker right **"Four steps · every message"**.
- Four numbered rows, each separated by a top hairline, grid `auto 1fr` gap `clamp(24px,5vw,80px)`:
  - Mono number (01–04, blue) + an inner `1fr 1.1fr` grid: Bricolage-700 title `clamp(1.4rem,2.3vw,1.9rem)` + Newsreader-300 description (17.5px, --ink-2). Collapses to single column < 900px.
  - **01 Detects the language** — "Arabic, English, or Franco Arabic — decided per message, no language picker, no setup. LUMA replies in kind."
  - **02 Searches your live catalog** — "Syncs Shopify products every few hours, so prices, stock, and detail come straight from your real store."
  - **03 Scores its own confidence** — "Every reply carries a confidence score. Sure → it answers. Unsure → it never guesses."
  - **04 Hands off to you, gracefully** — "Low-confidence chats open a ticket, pause the bot on that thread, and ping your team — no awkward double replies."

### 5. Languages
- Padding `clamp(56px,8vw,112px) 0`. Kicker "One inbox, three languages".
- H2 (max-width 820): *"Your customers don't switch to English for you. **LUMA meets them where they type.** [italic blue]"*
- 3-column grid (collapses to 1 col < 900px), top hairline, each cell separated by right `1px solid var(--line)`:
  - Cell = number (01/02/03, --ink-3) + uppercase mono label, then the sample message at `clamp(1.6rem,2.4vw,2.1rem)` with `min-height: 2.4em`, then a mono gloss (--ink-3).
  - **01 Franco Arabic** (Bricolage 800, ltr): **"3ayez arga3 el order"** — gloss "I want to return my order".
  - **02 Arabic** (Tajawal 700, **rtl**): **"الأوردر وصل؟"** — gloss "Did my order arrive?".
  - **03 English** (Bricolage 700): **"Is this back in stock?"** — gloss "no translation needed".

### 6. Analytics ("The other edge")
- Padding `clamp(56px,8vw,112px) 0`. Header row: kicker **"The other edge · Analytics"** + right kicker **"Updated live · last 14 days"**.
- H2 (max-width 880): *"Every conversation tells you something about your store. **LUMA turns them into numbers you can act on.** [italic blue]"*
- **KPI row** (4 cols, top `2px solid var(--ink)`, each cell right-hairline): big Bricolage-800 number `clamp(2rem,3vw,2.7rem)` + Bricolage-600 15px label + mono 11.5px sub. Values: **81%** resolution rate / resolved without you · **86%** bot answer rate / handled, no escalation · **93%** CSAT / positive after a reply · **1.4s** avg. response time / bot replies, any hour. (These mirror the real dashboard KPIs: resolution rate, bot answer rate, CSAT, avg response time. Collapses to 2 cols < 900px.)
- **Message-volume chart** (card, --paper-card, 1px line, radius 4): title "Message volume" + mono "▲ 31% vs. previous 14 days". A 14-bar column chart, `height: 150px`, bars use **pixel heights** `(v/max)*120 px` (NOT %), `border-radius: 3px 3px 0 0`. Last-but-one bar highlighted `--blue`, rest `--blue-soft`. Mono day labels 1–14 under bars.
- **Two panels** (grid `1.05fr 1fr`, gap `clamp(20px,3vw,28px)`, collapse to 1 col < 900px):
  - **"Top ticket categories"** (sub "What customers ask, auto-tagged from every message"). Horizontal bars: label (Bricolage 600) + mono %; track `--paper-3` h7px radius999; fill `--blue`; a mono Franco sample under each. Rows: Order status 34% "el order feen?" · Product question 26% "3andko el size L?" · Returns & refunds 18% "3ayez arga3" · Shipping 12% "el sha7n bikam?" · Sizing 10% "da true to size?". Footer callout: a blue-outline **"TAKE NOTE"** mono tag + Newsreader-300 *"1 in 10 tickets is about sizing. A clearer size chart could quietly remove them."*
  - **"Peak hours"** (sub "When your customers actually message"). 24 thin bars (gap 3px, height 150px, px heights `(v/hMax)*118`), peak bars (`> 70% of max`) in `--blue`, rest `--paper-3`. Mono hour labels at 12a/6a/12p/6p/11p. Footer Newsreader-300 *"Your busiest hour is **9–10pm** [italic] — long after most shops reply. LUMA never clocks off."*

### 7. Pricing
- Background `--paper-2`, top `1px solid var(--line)`, inner padding `clamp(56px,7vw,96px)`.
- Header: H2 "Priced per conversation, not per seat." + right kicker "7-day free trial · billed through Shopify · cancel anytime".
- An **editorial table** (not cards): top `2px solid var(--ink)`, each row `1px solid var(--line)` bottom, grid `1.2fr 1fr 1.4fr auto` (collapses on mobile). The **Growth** row has a faint blue wash `rgba(38,64,222,.05)` and a blue-outline **"Popular"** mono tag. Rows:
  - **Free** — **$0**/mo — "20 conversations / day · Try LUMA on your store" — ghost button "Start free"
  - **Starter** — **$29**/mo — "200 conversations / day · For growing DM volume" — ghost "Request access"
  - **Growth** (Popular) — **$79**/mo — "600 conversations / day · Most active brands" — **black** button "Request access"
  - **Pro** — **$149**/mo — "1,500 conversations / day · High-volume storefronts" — ghost "Request access"
  - Plan name Bricolage 700 22px; price Bricolage 800 28px with mono "/mo"; the count number in mono inside the description.

### 8. Footer (inverted)
- Background `--ink`, text `--paper`. Padding top `clamp(64px,9vw,128px)`, bottom 56px.
- Kicker (paper @ .5 opacity) "Private beta · limited onboarding".
- **Display H1** (paper): *"Stop leaving customers **on read.** [italic, color #8FA0FF]"* at `clamp(2.4rem,5.4vw,4.4rem)`.
- Email field (translucent: `bg rgba(255,255,255,.06)`, border `rgba(244,239,230,.2)`, paper text) + **paper-colored** "Request access →" button.
- Bottom: 4-col grid (`1.6fr 1fr 1fr 1fr`, → 2 then 1 col on mobile): brand blurb + integration chips (Shopify `#95BF47`, Instagram `#E4405F`, WhatsApp `#25D366` as small rounded squares) | **Product** (How it works, Languages, Pricing, Security, Changelog) | **Company** (About, Careers, Contact) | **Legal** (Privacy, Terms, Data handling). Links Bricolage 500 14.5px at `rgba(244,239,230,.72)` → paper on hover.
- Final line (mono, paper @ .4): "© 2026 LUMA · Made for merchants who never leave a customer on read."

---

## Interactions & Behavior
- **Email fields + "Request access"**: wire to the real waitlist/lead endpoint (the prototype just preventDefaults). Show a success state on submit.
- **Hover**: nav links darken; black button → pure black; ghost button inverts; blue links underline; the CTA arrow nudges right 4px.
- **Active**: black button presses down `translateY(1px)`.
- **Anchor nav**: "How it works / Languages / Pricing / Security" should smooth-scroll to the matching sections (add `id`s).
- **Responsive**: see each section's collapse rules. Breakpoints: **900px** (hero/steps/languages/analytics → 1 col, nav hides), **560px** (footer → 1 col, hero accent line-break hidden). `.wrap` padding drops to 22px.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` → kill animation/transition durations. (Carry this over.)
- The prototype's **Tweaks panel** (headline picker, accent/paper/font controls) is a review aid — **do NOT ship it.** Pick the default headline and accent and bake them in.

## State Management
Minimal — it's a marketing page. Local state only for: email input value, form submit/success/error state. No data fetching beyond the form POST. (If you keep an interactive demo later, that'd add chat state — not in this scope.)

## Assets
- `luma-logo.png` — the LUMA comet/star mark (included in `design_files/`). Used in header (30px) and footer (26px) and the hero reply label (18px). **Do not redraw as SVG.**
- Integration logos are rendered as simple brand-colored rounded squares in the prototype; swap for real SVG logos if available (Shopify/Instagram/WhatsApp).
- Icons (arrow, etc.) are inline SVGs in the JSX — reuse or substitute with your icon lib (Lucide/Heroicons match the 1.5–2px rounded-stroke style).

## Files (in `design_files/`)
- `index.html` — mounts the page; contains the `HEADLINES` options, default tweak values, and the App composition order.
- `WarmHero.jsx` — `Header`, `Hero`, `Exchange` (the DM card). Exact inline styles live here.
- `WarmSections.jsx` — `Statement`, `HowItWorks`, `Languages`, `Pricing`, `Footer`.
- `WarmAnalytics.jsx` — the analytics section (KPIs, charts, panels).
- `warm.css` — all tokens + base styles + atoms (`.wrap`, `.kicker`, `.display`, `.h2`, `.lede`, `.btn`, `.field`, paper grain, reduced-motion).
- `colors_and_type.css` — the broader design-system tokens (for reference; the landing only needs the warm subset in `warm.css`).

## Implementation notes / gotchas
- **Precompile the JSX** — do not ship in-browser Babel. Vite + React is the path of least resistance; plain HTML/CSS is also fine since there's little interactivity.
- The bar charts must use **pixel heights**, not percentage heights (percentage-of-auto-height parents collapse to zero — this bit the prototype).
- Sharp **2px/4px radii** are intentional (editorial/fashion feel) — don't round them up.
- Body copy is **Newsreader weight 300** — it's meant to look light and editorial; don't bump it to 400.
- Keep the single **blue** accent — there is no secondary color.
- This is a **public marketing page** → self-host fonts (or `font-display: swap`), add proper `<title>`/meta/OG tags (there's an `og-image.png` in the design-system `assets/`), and ensure it's SSR/static for SEO.
