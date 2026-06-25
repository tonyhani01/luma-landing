// test/seek.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

test('seek drives hook + phone opacity per Scene 1/2', async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(pathToFileURL(resolve('index.html')).href + '?capture=1');
  await page.evaluate(() => document.fonts.ready);
  const t0 = await page.evaluate(() => { window.seek(0); return parseFloat(getComputedStyle(window.__layers.hook).opacity); });
  const t300 = await page.evaluate(() => { window.seek(300); return parseFloat(getComputedStyle(window.__layers.hook).opacity); });
  const phone0 = await page.evaluate(() => { window.seek(2000); return parseFloat(getComputedStyle(window.__layers.phone).opacity); });
  const phone2300 = await page.evaluate(() => { window.seek(2300); return parseFloat(getComputedStyle(window.__layers.phone).opacity); });
  await browser.close();
  assert.ok(t0 < 0.05, `hook@0 should be ~0, got ${t0}`);
  assert.ok(t300 > 0.95, `hook@300 should be ~1, got ${t300}`);
  assert.ok(phone0 < 0.05, `phone@2000 should be ~0, got ${phone0}`);
  assert.ok(phone2300 > 0.95, `phone@2300 should be ~1, got ${phone2300}`);
});
