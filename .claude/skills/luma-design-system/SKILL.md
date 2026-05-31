---
name: luma-design-system
description: >-
  LUMA's warm editorial marketing design system — the look & feel of the
  luma-bot.com landing site. USE THIS whenever building, editing, or extending
  any page, section, or component on the LUMA marketing site (landing page,
  legal pages, future pages like /security, /changelog, /about) so new work
  matches the existing design exactly. Covers color/type tokens, the shared
  header, button/field/kicker atoms, the editorial legal template, charts, and
  the inverted footer. Triggers: "add a section", "new page", "match the
  design", "warm theme", "paper/ink", "Franco Arabic DM card", restyle.
---

# LUMA Warm Editorial Design System

The marketing site (`luma-bot.com`) uses a **warm, editorial, magazine-style**
aesthetic: cream paper + warm near-black ink, a single grounded **brand blue**
accent, fashion-black buttons, sharp 2px/4px radii, and bilingual oversized
typography (Latin + Arabic). It is a **no-build static site** served from
GitHub Pages — plain HTML + CSS, no framework, no bundler. Keep it that way.

Differentiator the design sells: LUMA handles **Franco Arabic (3arabi)** —
Egyptian Arabic typed in Latin letters — alongside Arabic and English.

## Files (in repo root)

| File | Role |
|---|---|
| `warm.css` | **The system.** Tokens (`:root`), base styles, paper grain, shared **header** (`.hdr*`), atoms (`.wrap .kicker .num .display .h2 .lede .btn .btn-ghost .link-blue .field .accent-italic`), responsive collapses, reduced-motion. Link this on every page. |
| `legal.css` | Editorial **legal page** template (hero band, `.legal` body typography, compact inverted `.legal-foot`). Link after `warm.css`. |
| `index.html` | Landing page. Page-specific section CSS lives in its `<style>`; atoms/header come from `warm.css`. |
| `privacy-policy.html`, `terms-of-service.html` | Legal pages built on `warm.css` + `legal.css`. |
| `logo.png` | The LUMA comet/star mark. Header 30px, footer 26px, hero reply 18px. **Never redraw as SVG.** |
| `index-cosmos.html` | The retired dark "cosmos" theme. Kept for reference only. |
| `reference/handoff.md` | The original authoritative design handoff (every hex, measurement, section spec). Consult for exact values. |

## Rules (do not violate)

1. **No build step.** Static HTML/CSS only. Don't introduce Vite/React/Tailwind/a bundler.
2. **Link the system:** every new page starts with `<link rel="stylesheet" href="warm.css">` (+ `legal.css` for legal/long-form). Reuse `.wrap` for layout and the `.hdr` header markup verbatim (see any existing page).
3. **One accent.** Brand blue `--blue: #2640DE` only. There is **no** secondary/clay color on the marketing site.
4. **Sharp radii:** 2px on buttons/inputs, 4px on cards/panels. Don't round up.
5. **Body copy is Newsreader weight 300** (light, editorial). Don't bump to 400.
6. **Chart bars use pixel heights, not %** (percentage-of-auto-height parents collapse to zero).
7. **Fonts:** Bricolage Grotesque (display/UI), Newsreader (body + italic accent), Tajawal (Arabic, always `dir="rtl"`), JetBrains Mono (kickers/metadata/numerals). Loaded via Google Fonts `display=swap` in `warm.css`.
8. **Forms** post to the existing Google Form waitlist endpoint
   (`…/1FAIpQLSfzKIxaFC065noyOOX5rS2tPR-uPrxop5IYl3eT1PhRQ_b2oA/formResponse`,
   field `entry.2098781009`, `mode:'no-cors'`) with an inline success state. Reuse the
   `form.lead-form` pattern + script in `index.html`.

## Tokens (authoritative — also in `warm.css :root`)

```
--paper #F4EFE6  --paper-2 #ECE5D7  --paper-3 #E2D9C7  --paper-card #FBF8F2
--ink #1B1A17    --ink-2 #57514A    --ink-3 #8A8278
--blue #2640DE   --blue-deep #1A2BA0  --blue-soft #E4E5FB
--line rgba(27,26,23,.16)   --line-2 rgba(27,26,23,.09)
--ease cubic-bezier(.2,.6,.2,1)
```

Type scale: **Display** 800 / `-.025em` / lh .98 / `clamp(2.8rem,6.4vw,5.4rem)` ·
**H2** 700 / `-.02em` / `clamp(2rem,4vw,3.1rem)` · **Lede** Newsreader 300 /
`clamp(1.15rem,1.7vw,1.5rem)` · **Kicker** mono 12px / `.18em` / uppercase /
`--ink-3`. Breakpoints: 900px (multi-col → 1 col, nav hides), 760px (`.wrap`
padding 22px), 560px (footer → 1 col).

## Components

- **Header** — `.hdr` sticky, `rgba(244,239,230,.86)` + blur, logo + wordmark,
  center nav (How it works · Languages · Pricing · Security), Sign in (blue
  link) + Request access (black button). Markup in `warm.css`-styled `.hdr*`.
- **Buttons** — `.btn` (fashion black; on dark footer flips to paper bg),
  `.btn-ghost` (inverts on hover), `.link-blue` (underline on hover). Arrow
  icon nudges +4px on hover.
- **Hero DM card** — the centerpiece: oversized Franco Arabic customer message
  + LUMA reply with confidence score. See `index.html` `.hero-card`/`.ex-*`.
- **Editorial table** (pricing), **numbered rows** (how-it-works),
  **typographic cells** (languages, with RTL Arabic), **KPI row + bar charts**
  (analytics), **inverted footer** — all in `index.html`.
- **Legal pages** — `legal.css`: paper hero band, `.legal` body (Bricolage
  headings, Newsreader 300 body, blue list markers/links, mono code chips),
  compact `.legal-foot`. Preserve legal text verbatim when restyling.

## When adding a new page or section

1. Copy the `<head>` + `.hdr` header from an existing page.
2. Build sections inside `.wrap`; reuse atoms (`.kicker`, `.h2`, `.lede`, `.btn`).
3. New section-specific CSS → the page's `<style>` block (keep `warm.css` for shared tokens/atoms/header). If a component will be reused across pages, promote it into `warm.css`.
4. Match measurements/hexes in `reference/handoff.md`.
5. Verify with a headless screenshot before claiming done (desktop + mobile).
