# Archetype 1 Reel Render

Code-rendered video pipeline that produces the Archetype 1 9:16 MP4
(`out/archetype-1-9x16.mp4`, 1080×1920, 30 fps, 12 s / 360 frames).
Playwright drives a headless Chromium instance against `index.html`,
captures PNG frames via `#stage`, then stitches them with ffmpeg.

## Setup

```sh
npm install
npx playwright install chromium
```

ffmpeg must be on your `PATH` (e.g. `brew install ffmpeg`).

## Commands

| Command | What it does |
|---|---|
| `npm run probe` | Renders 5 key frames into `frames/probe-*.png` (~30 s) |
| `npm run render` | Full render → `out/archetype-1-9x16.mp4` (~10 min) |

## Acceptance check

```sh
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate,nb_frames \
  -of default=noprint_wrappers=1 out/archetype-1-9x16.mp4
```

Expected output:
```
width=1080
height=1920
r_frame_rate=30/1
nb_frames=360
```

## Fonts

Brand fonts (Tajawal, Bricolage Grotesque) load from Google Fonts at
render time — an active network connection is required. The render
aborts immediately with a clear error if either font fails to load.

To make the render hermetic (CI / offline): download the `.woff2` files
and self-host them under `assets/fonts/`, then update the `@font-face`
declarations in `index.html` to use local paths instead of the Google
Fonts URL.
