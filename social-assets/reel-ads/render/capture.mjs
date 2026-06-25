// capture.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, rm } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

// Always run relative to this script's directory so cwd-relative paths work
// regardless of where the caller invokes node from.
process.chdir(dirname(fileURLToPath(import.meta.url)));

const FPS = 30, DURATION_MS = 12000, W = 1080, H = 1920;
const TOTAL = Math.round((DURATION_MS / 1000) * FPS); // 360
const probe = process.argv.includes('--probe');
const pad = (n) => String(n).padStart(4, '0');

function ffmpeg() {
  return new Promise((res, rej) => {
    const args = ['-y', '-framerate', String(FPS), '-i', 'frames/%04d.png',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart',
      'out/archetype-1-9x16.mp4'];
    const p = spawn('ffmpeg', args, { stdio: 'inherit' });
    p.on('exit', (code) => (code === 0 ? res() : rej(new Error('ffmpeg exit ' + code))));
  });
}

const main = async () => {
  await rm('frames', { recursive: true, force: true });
  await mkdir('frames', { recursive: true });
  await mkdir('out', { recursive: true });
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(resolve('index.html')).href + '?capture=1');
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all(Array.from(document.images).map(img =>
    img.complete ? Promise.resolve() : new Promise(r => { img.onload = img.onerror = r; }))));

  // Abort early if brand fonts failed to download (e.g. no network / Google Fonts blocked).
  // document.fonts.ready resolves even on font-load failure, so we must check explicitly.
  const fontsOk = await page.evaluate(() =>
    document.fonts.check('30px "Tajawal"') && document.fonts.check('30px "Bricolage Grotesque"'));
  if (!fontsOk) {
    await browser.close();
    throw new Error('Brand fonts (Tajawal / Bricolage Grotesque) failed to load — aborting render (check network / Google Fonts). Consider self-hosting fonts under assets/.');
  }

  const stage = await page.$('#stage');

  if (probe) {
    for (const t of [300, 2600, 3500, 9000, 11000]) {
      await page.evaluate((tt) => window.seek(tt), t);
      await stage.screenshot({ path: `frames/probe-${pad(t)}.png` });
    }
    console.log('probe frames written to frames/probe-*.png');
    await browser.close();
    return;
  }

  for (let f = 0; f < TOTAL; f++) {
    const t = (f / FPS) * 1000;
    await page.evaluate((tt) => window.seek(tt), t);
    await stage.screenshot({ path: `frames/${pad(f)}.png` });
    if (f % 30 === 0) console.log(`frame ${f}/${TOTAL}`);
  }
  await browser.close();
  await ffmpeg();
  console.log('done -> out/archetype-1-9x16.mp4');
};
main().catch((e) => { console.error(e); process.exit(1); });
