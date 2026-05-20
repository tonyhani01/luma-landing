// Renders every .html in marketing/post-templates/ to a 1080x1080 PNG.
// Run: node marketing/render.mjs
import puppeteer from 'puppeteer';
import { readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = join(here, 'post-templates');
const outDir = join(here, 'post-images');

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

const files = (await readdir(srcDir)).filter((f) => f.endsWith('.html'));
for (const f of files) {
  await page.goto(pathToFileURL(join(srcDir, f)).href, { waitUntil: 'networkidle0' });
  // Give web fonts a moment to settle
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const out = join(outDir, f.replace(/\.html$/, '.png'));
  await page.screenshot({
    path: out,
    clip: { x: 0, y: 0, width: 1080, height: 1080 },
    type: 'png',
  });
  console.log('rendered', out);
}
await browser.close();
