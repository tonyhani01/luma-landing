# Archetype 1 — "ezayyy?" · Kinetic Motion Storyboard

Style ref: respond.io "Respond 3.0" reel — punchy product-UI motion (zoom-pops, typing, kinetic text).
Format: 9:16, **1080×1920**. Duration ≈ **12s (12000ms)**. Playback: **Once**.
Built entirely from native Figma layers — **no screenshots needed**.

Brand: bg paper `#F4EFE6`, ink `#1B1A17`, LUMA blue `#2640DE`, customer bubble `#E4E5FB`,
phone screen `#FBF8F2`. Fonts: Bricolage Grotesque (display/UI), Tajawal (Arabic).
Brand ease = `cubic-bezier(.2,.6,.2,1)`. "Pop" = ease-out with slight overshoot (or Spring preset).

---

## Layer list (build these STATIC first, at their resting state, THEN animate)

1. `bg` — paper rect 1080×1920 `#F4EFE6` (static, no keyframes).
2. `hook` — text "Your customers don't all type the same way." Bricolage 800, ink, centered, 3 lines, ~96px.
3. `phone` — group: rounded-rect body 620×1300 `#1B1A17` (radius 64) + screen inset `#FBF8F2` + status bar + chat header ("LUMA" + 24px logo dot).
4. `chat` — group clipped inside the phone screen, containing the 6 bubbles bottom-aligned:
   - `dm1` (Arabic, customer, right) "عندكوا المقاس ده؟" + `dm1_mask` + `dm1_cursor`
   - `reply1` (LUMA, left, blue) "آه متوفر، تحب أبعتلك المقاسات؟" + mask + cursor
   - `dm2` (English) "how much is shipping?" + mask + cursor
   - `reply2` (LUMA) "Flat 50 EGP, free over 1000 🚚" + mask + cursor
   - `dm3` (Franco) "3ayez ashoof el catalog" + mask + cursor
   - `reply3` (LUMA) "Etfadal 👇 catalog" + mask + cursor
5. `payoff` — text group "Arabic. English. Franco." (3 word-layers) + "LUMA gets all of them."
6. `endcard` — logo + wordmark "LUMA" + handle "lumabot.ai" + CTA chip "Follow →".

---

## Timeline (per-layer keyframes, times in ms)

### Scene 1 — Hook (0–2200)
| layer | property | keyframes | easing |
|---|---|---|---|
| `hook` | opacity | 0ms:0 → 300ms:1 | ease-out |
| `hook` | scale | 0ms:0.9 → 350ms:1.02 → 500ms:1.0 | overshoot |
| `hook` | scale (emphasis zoom) | 900ms:1.0 → 1150ms:1.06 → 1400ms:1.0 | ease-in-out |
| `hook` | opacity | 1800ms:1 → 2200ms:0 | ease-in |
| `hook` | scale (push back) | 1800ms:1.0 → 2200ms:1.12 | ease-in |

### Scene 2 — Phone enters (2000–2700)
| layer | property | keyframes | easing |
|---|---|---|---|
| `phone` | position Y | 2000ms:+520 → 2600ms:0 | ease-out |
| `phone` | opacity | 2000ms:0 → 2300ms:1 | ease-out |
| `phone` | scale | 2000ms:0.8 → 2500ms:1.03 → 2700ms:1.0 | overshoot |

### Scene 3 — Three DM pairs (2700–8800)
Pattern per pair: incoming bubble pops → text types → phone zooms to it → LUMA reply pops → reply types → zoom out → chat scrolls up. Each pair ≈ 2.0s.

**Pair 1 (2700–4800)**
| layer | property | keyframes | easing |
|---|---|---|---|
| `dm1` | scale | 2700:0.8 → 2900:1.0 | overshoot |
| `dm1` | opacity | 2700:0 → 2850:1 | ease-out |
| `dm1_mask` | position X (reveal L→R) | 2900:0 → 3500:+340 | linear |
| `dm1_cursor` | position X | 2900:0 → 3500:+340 | linear |
| `dm1_cursor` | opacity (blink) | 2900:1 →3050:0 →3200:1 →3350:0 →3500:1 | step |
| `phone` | scale (zoom in) | 2900:1.0 → 3200:1.22 | ease-in-out |
| `phone` | position Y (frame dm1) | 2900:0 → 3200:+90 | ease-in-out |
| `reply1` | scale | 3600:0.8 → 3800:1.0 | overshoot |
| `reply1` | opacity | 3600:0 → 3750:1 | ease-out |
| `reply1_mask` | position X | 3800:0 → 4300:+360 | linear |
| `phone` | scale (zoom out) | 4400:1.22 → 4700:1.0 | ease-in-out |
| `phone` | position Y | 4400:+90 → 4700:0 | ease-in-out |
| `chat` | position Y (scroll up) | 4600:0 → 4800:-200 | ease-out |

**Pair 2 (4800–6700)** — repeat Pair 1 pattern offset +2100ms, using `dm2`/`reply2`; chat scroll `6600:-200 → 6800:-400`.

**Pair 3 (6700–8800)** — repeat offset +4200ms, using `dm3`/`reply3`; chat scroll `8500:-400 → 8700:-600`.

### Scene 4 — Payoff (8800–10500)
| layer | property | keyframes | easing |
|---|---|---|---|
| `phone` | scale (push back) | 8800:1.0 → 9100:0.85 | ease-in-out |
| `phone` | opacity (recede) | 8800:1 → 9400:0.25 | ease-in |
| `payoff` "Arabic." | opacity+scale | 8900:0/0.8 → 9050:1/1.0 | overshoot |
| `payoff` "English." | opacity+scale | 9050:0/0.8 → 9200:1/1.0 | overshoot |
| `payoff` "Franco." | opacity+scale | 9200:0/0.8 → 9350:1/1.0 | overshoot |
| `payoff` "LUMA gets all of them." | opacity | 9500:0 → 9900:1 | ease-out |
| `payoff` (same) | scale | 9500:0.94 → 9900:1.0 | ease-out |

### Scene 5 — End card / CTA (10300–12000)
| layer | property | keyframes | easing |
|---|---|---|---|
| `phone` + `payoff` | opacity | 10300:1 → 10600:0 | ease-in |
| `endcard` logo+wordmark | opacity | 10600:0 → 11000:1 | ease-out |
| `endcard` logo+wordmark | scale | 10600:0.8 → 10950:1.03 → 11100:1.0 | overshoot |
| `endcard` "lumabot.ai" | opacity | 11000:0 → 11200:1 | ease-out |
| `endcard` "Follow →" chip | position Y | 11200:+40 → 11500:0 | ease-out |
| `endcard` "Follow →" chip | opacity | 11200:0 → 11450:1 | ease-out |
| `endcard` "Follow →" chip | scale (pulse) | 11700:1.0 → 11850:1.06 → 12000:1.0 | ease-in-out |

---

## The "typing" recipe (do this for every bubble's text)

Figma Motion keyframes position/scale/opacity — there's no one-click typewriter, so use a mask-reveal:

1. Put the text layer inside a frame with **Clip content = ON**, sized to the text.
2. Add a **cover rectangle** filled with the bubble's color, covering the text exactly.
3. Animate the cover's **X position** from covering → fully off to the right over the type duration → text reveals left-to-right. (For Arabic/RTL, reveal right→left: slide the cover to the left.)
4. Add a 3px **cursor rect** (`#2640DE`) at the reveal edge; keyframe its X to track the cover edge; add an opacity **blink** (1→0→1 every ~150ms) for realism.
5. Type duration ≈ 35–60ms per character (short text = ~500–600ms total).

---

## Build order (recommended)

1. Frame + `bg` + `phone` (static) → get the phone looking right first.
2. Add the 6 bubbles + text at rest, bottom-aligned in `chat`.
3. Add masks + cursors for the typing.
4. Switch to Motion mode; animate Scene 2 (phone in) → Scene 3 pair 1 → copy pattern to pairs 2–3.
5. Add Scene 1 hook + Scene 4 payoff + Scene 5 endcard.
6. Preview (Space), tune timing by eye, then export via MCP `export_video`.

## Copy reference (final on-screen text)
- Hook: "Your customers don't all type the same way."
- dm1 / reply1: `عندكوا المقاس ده؟` / `آه متوفر، تحب أبعتلك المقاسات؟`
- dm2 / reply2: `how much is shipping?` / `Flat 50 EGP, free over 1000 🚚`
- dm3 / reply3: `3ayez ashoof el catalog` / `Etfadal 👇 catalog`
- Payoff: "Arabic. English. Franco. — LUMA gets all of them."
- CTA: "Follow → lumabot.ai"  (confirm exact IG @handle before posting)
