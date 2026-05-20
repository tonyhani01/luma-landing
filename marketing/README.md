# LUMA marketing assets

## Contents

- `content-calendar.md` — 4-week Instagram launch plan with captions, hashtags, posting cadence, and CTAs.
- `post-templates/` — HTML source for each post graphic. Edit text here, re-render to PNG.
- `post-images/` — Rendered 1080×1080 PNGs ready to upload to Instagram.
- `render.mjs` — Headless Chrome script that turns every template into a PNG.

## Re-rendering after edits

```bash
npm i --no-save puppeteer
node marketing/render.mjs
```

Outputs land in `marketing/post-images/`, one PNG per template.

## Why HTML templates (not Figma / Canva)

- Edits are diffable. Brand voice changes = one PR.
- Anyone on the team can regenerate the whole set with one command.
- The templates already pull the landing-page color palette and gradients, so feed and site stay visually consistent.

## Adding a new post

1. Copy any file in `post-templates/` and rename it `NN-slug.html`.
2. Edit the copy. The shared `_base.css` provides eyebrow, h1, lead, thread bubbles, stat blocks, and footer styles.
3. `node marketing/render.mjs`.
4. Drop the caption into `content-calendar.md` next to its post number.
