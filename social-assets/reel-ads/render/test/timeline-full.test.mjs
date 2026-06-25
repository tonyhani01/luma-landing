// test/timeline-full.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

test('key moments produce expected layer states', async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(pathToFileURL(resolve('index.html')).href + '?capture=1');
  await page.evaluate(() => document.fonts.ready);

  // Helper: seek to t, then read a named layer's CSS property — no eval needed.
  const read = (t, layerName, cssProp) => page.evaluate(
    ([tt, ln, cp]) => { window.seek(tt); return getComputedStyle(window.__layers[ln])[cp]; },
    [t, layerName, cssProp]
  );

  // dm1 text fully revealed by 3500 ms (reveal=1 → inset with 0% right-clip)
  // Probe the actual string first so we can assert robustly.
  const dm1Clip = await read(3500, 'dm1_text', 'clipPath');
  // "Fully revealed" means the right-clip side is 0 (or the browser normalised to "none").
  // We assert there is NO positive percentage remaining — i.e. no "XX%" where XX > 0.
  // This handles: "inset(0 0 0 0%)", "inset(0px)", "none", "inset(0 0% 0 0)", etc.
  const hasPositivePct = /\b([1-9]\d*(\.\d+)?|0*\.\d*[1-9]\d*)%/.test(dm1Clip);
  assert.ok(
    !hasPositivePct || dm1Clip === 'none',
    `dm1_text@3500 should be fully revealed (no positive % in clipPath), got: "${dm1Clip}"`
  );

  // payoff_line visible at 9900
  const plO = parseFloat(await read(9900, 'payoff_line', 'opacity'));
  assert.ok(plO > 0.95, `payoff_line@9900 ${plO}`);

  // endcard visible at 11000, phone gone
  const endO = parseFloat(await read(11000, 'endcard', 'opacity'));
  const phO  = parseFloat(await read(11000, 'phone',   'opacity'));
  assert.ok(endO > 0.95, `endcard@11000 ${endO}`);
  assert.ok(phO  < 0.05, `phone@11000 ${phO}`);

  await browser.close();
});
