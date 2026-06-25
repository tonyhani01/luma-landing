import test from 'node:test';
import assert from 'node:assert/strict';
import { valueAt, collectState } from '../src/timeline-core.js';

const lin = [{ t: 0, v: 0 }, { t: 100, v: 10, ease: 'linear' }];

test('valueAt clamps before first key', () => {
  assert.equal(valueAt(lin, -5), 0);
});
test('valueAt clamps after last key', () => {
  assert.equal(valueAt(lin, 999), 10);
});
test('valueAt interpolates linearly mid-segment', () => {
  assert.equal(valueAt(lin, 50), 5);
});
test('valueAt handles 3-key sequences', () => {
  const k = [{ t: 0, v: 1 }, { t: 10, v: 2, ease: 'linear' }, { t: 20, v: 0, ease: 'linear' }];
  assert.equal(valueAt(k, 5), 1.5);
  assert.equal(valueAt(k, 15), 1);
});
test('collectState groups props per layer', () => {
  const tracks = [
    { layer: 'phone', prop: 'opacity', keys: [{ t: 0, v: 0 }, { t: 100, v: 1, ease: 'linear' }] },
    { layer: 'phone', prop: 'scale', keys: [{ t: 0, v: 0.8 }, { t: 100, v: 1, ease: 'linear' }] },
    { layer: 'hook', prop: 'opacity', keys: [{ t: 0, v: 1 }] },
  ];
  const s = collectState(tracks, 50);
  assert.equal(s.phone.opacity, 0.5);
  assert.ok(Math.abs(s.phone.scale - 0.9) < 1e-9);
  assert.equal(s.hook.opacity, 1);
});
