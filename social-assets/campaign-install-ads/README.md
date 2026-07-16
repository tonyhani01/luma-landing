# LUMA cold-traffic install ads

## Upload copy

| Ad | Primary text | Meta headline | CTA | Main variable |
|---|---|---|---|---|
| 01 Product Editorial | Your customers are already asking about size, stock and delivery. LUMA answers from your real Shopify store—and helps them keep buying. | Turn product questions into orders | Learn More | Product-first editorial image |
| 02 Merchant in Motion | Keep packing orders. LUMA can handle the repetitive Instagram and storefront questions in Arabic, English and Franco. | Your AI sales + support teammate | Learn More | Human presence / native feel |
| 03 Sales + Support | From product questions to order issues, LUMA answers with store context and hands off when your team is needed. | Sales and support, around the clock | Learn More | Breadth: sales plus support |

## Measurement and controlled test

Outcome chain: `Outbound click → Landing-page view → Shopify install click → Completed install`.

Only the creative differs across the initial three-ad test; audience, budget, optimization event, destination, and primary CTA remain fixed.

## Final exports

| Filename | Concept |
|---|---|
| `luma-install-ad-01-product-editorial.png` | Product Editorial |
| `luma-install-ad-02-merchant-motion.png` | Merchant in Motion |
| `luma-install-ad-03-sales-support.png` | Sales + Support |

Export the three 1080×1350 PNGs from `social-assets/campaign-02/tools` with:

```bash
node export-stills.mjs ../../campaign-install-ads/index.html ad=1..3 ../../campaign-install-ads/exports/luma-install-ad
mv ../../campaign-install-ads/exports/luma-install-ad-01.png ../../campaign-install-ads/exports/luma-install-ad-01-product-editorial.png
mv ../../campaign-install-ads/exports/luma-install-ad-02.png ../../campaign-install-ads/exports/luma-install-ad-02-merchant-motion.png
mv ../../campaign-install-ads/exports/luma-install-ad-03.png ../../campaign-install-ads/exports/luma-install-ad-03-sales-support.png
```

The exporter always creates the numbered intermediate names (`luma-install-ad-01.png` through `-03.png`); the three `mv` commands are required to produce the exact final filenames listed above.

## Local fonts

Exports are hermetic: `campaign.css` loads the required IBM Plex WOFF2 files from `fonts/` and makes no Google Fonts request. The files are unmodified copies from IBM's official `IBM/plex` distribution:

- IBM Plex Sans 400/500/600/700: `https://raw.githubusercontent.com/IBM/plex/master/packages/plex-sans/fonts/complete/woff2/`
- IBM Plex Sans Arabic 400/500/700: `https://raw.githubusercontent.com/IBM/plex/master/packages/plex-sans-arabic/fonts/complete/woff2/`
- IBM Plex Mono 400/500: `https://raw.githubusercontent.com/IBM/plex/master/packages/plex-mono/fonts/complete/woff2/`
- License source: `https://raw.githubusercontent.com/IBM/plex/master/LICENSE.txt`

IBM Plex is Copyright © 2017 IBM Corp. and distributed under the SIL Open Font License 1.1. The complete license is vendored at `fonts/OFL-1.1.txt`.

## Source generation prompts

### Variant A — Product Editorial

```text
Use case: ads-marketing
Asset type: photographic source layer for a 4:5 Instagram feed ad
Primary request: Create an art-directed fashion product photograph for a B2B ad aimed at independent Shopify fashion merchants in Egypt and the Middle East.
Scene/backdrop: A real packing table in a small contemporary fashion studio, with a black heavyweight cotton T-shirt, folded tissue paper, a kraft mailer, a handwritten size sticker with no legible words, and a metal clothing rack falling softly out of frame.
Subject: The black T-shirt and tactile fabric are the focal point; no model and no visible brand names.
Style/medium: Candid editorial product photography, documentary realism, 35mm lens character, restrained grain, practical window light, slightly imperfect folds and surface wear.
Composition/framing: Portrait 4:5. Tight asymmetric crop. Product occupies the lower-left and center. Preserve calm cream-toned negative space in the upper-right for headline and interface overlays.
Lighting/mood: Late-afternoon natural side light, realistic shadows, warm-neutral color grade, not cinematic teal-orange.
Color palette: Warm cream, black cotton, kraft brown, small restrained cobalt-blue object as a subtle LUMA accent.
Constraints: No readable text, no logos, no UI, no phone, no floating objects, no surreal garment geometry.
Avoid: glossy commercial CGI, perfectly centered flat lay, synthetic fabric, excessive blur, impossible seams, fake labels, gradients, watermark.
```

### Variant B — Merchant in Motion

```text
Use case: ads-marketing
Asset type: photographic source layer for a 4:5 Instagram feed ad
Primary request: Create a believable candid photograph of a small fashion-store merchant packing an online order while customer messages continue arriving.
Scene/backdrop: Independent clothing studio in Cairo or a similar Middle Eastern city; ordinary packing bench, folded garments, shipping labels turned away or illegible, tape dispenser, open kraft box, clothing rack behind.
Subject: One merchant shown from shoulder to hands, naturally packing a black T-shirt into tissue paper. Face may be partly out of frame; hands and garment must be anatomically correct.
Style/medium: Native Instagram documentary photography, natural skin and fabric texture, practical environment, subtle camera grain, not a posed stock photo.
Composition/framing: Portrait 4:5. Merchant occupies the right half. Preserve darker, uncluttered negative space on the left for headline and two compact message overlays.
Lighting/mood: Mixed window and warm workshop light, believable exposure, slight motion in the tissue paper but sharp hands.
Color palette: Warm cream, black, cardboard brown, neutral skin tones, one small cobalt-blue object.
Constraints: No readable text, no logos, no UI, no phone screen, no direct-to-camera pose.
Avoid: influencer glamour, plastic skin, extra fingers, fake lettering, luxury showroom, sterile studio, cinematic fog, watermark.
```

### Variant C — Sales + Support

```text
Use case: ads-marketing
Asset type: photographic texture layer for a 4:5 Instagram feed ad
Primary request: Create an editorial overhead photograph that can unify a two-panel sales-and-support advertisement for a Shopify customer-service product.
Scene/backdrop: Worktable with black cotton garment on one side and a partially packed return parcel on the other; receipt paper is present but blank and unreadable; blue packing tape creates a visual line between the two moments.
Subject: Fabric, return parcel, tissue paper, blank tag, and tape; no people.
Style/medium: Human art-directed editorial still life, tactile and imperfect, real materials, subtle film grain.
Composition/framing: Portrait 4:5 overhead view. A strong diagonal or taped seam divides left and right without perfect symmetry. Keep central and upper areas legible for two deterministic message panels.
Lighting/mood: Soft daylight with realistic edge shadows and visible paper/fabric texture.
Color palette: LUMA warm paper, ink black, kraft brown, cobalt-blue tape.
Constraints: No readable text, no logos, no UI, no device, no floating objects.
Avoid: sterile flat lay, perfect symmetry, glossy 3D render, fake writing, impossible fabric, decorative clutter, watermark.
```

## Shopify attribution and usage

The official Shopify bag comes from `https://www.shopify.com/brand-assets` and must not be distorted, recolored, rotated, or combined into a new mark.
