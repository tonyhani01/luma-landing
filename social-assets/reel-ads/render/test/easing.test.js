import test from 'node:test';
import assert from 'node:assert/strict';
import { cubicBezier, EASES, ease } from '../src/easing.js';

test('linear is identity', () => {
  assert.equal(EASES.linear(0), 0);
  assert.equal(EASES.linear(0.5), 0.5);
  assert.equal(EASES.linear(1), 1);
});

test('cubic-bezier hits endpoints', () => {
  const f = cubicBezier(0.2, 0.6, 0.2, 1);
  assert.equal(f(0), 0);
  assert.equal(f(1), 1);
});

test('cubic-bezier is monotonic non-decreasing', () => {
  const f = EASES['ease-out'];
  let prev = -1;
  for (let x = 0; x <= 1.0001; x += 0.05) {
    const v = f(Math.min(x, 1));
    assert.ok(v >= prev - 1e-9, `non-monotonic at ${x}: ${v} < ${prev}`);
    prev = v;
  }
});

test('step holds 0 until 1', () => {
  assert.equal(EASES.step(0), 0);
  assert.equal(EASES.step(0.99), 0);
  assert.equal(EASES.step(1), 1);
});

test('ease() falls back to brand for unknown names', () => {
  assert.equal(ease('does-not-exist'), EASES.brand);
});
