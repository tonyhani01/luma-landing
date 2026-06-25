// test/scene.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

test('scene builds all named layers + correct colors', async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const sceneUrl = pathToFileURL(resolve('src/scene.js')).href;
  // Navigate to a file:// origin first so dynamic import of file:// URLs is allowed
  await page.goto(sceneUrl);
  const result = await page.evaluate(async (url) => {
    const { buildScene } = await import(url);
    const root = document.createElement('div');
    document.body.appendChild(root);
    const layers = buildScene(root, document);
    const names = Object.keys(layers);
    const dm1 = getComputedStyle(layers.dm1_text).direction;
    const dm2 = getComputedStyle(layers.dm2_text).direction;
    return { names, dm1, dm2, hookText: layers.hook.textContent };
  }, sceneUrl);
  await browser.close();
  for (const n of ['phone','chat','hook','payoff','payoff_w1','payoff_line','endcard','end_cta',
    'dm1','dm1_text','dm1_cursor','reply3','reply3_text','reply3_cursor']) {
    assert.ok(result.names.includes(n), `missing layer ${n}`);
  }
  assert.equal(result.dm1, 'rtl');
  assert.equal(result.dm2, 'ltr');
  assert.match(result.hookText, /type the same way/);
});
