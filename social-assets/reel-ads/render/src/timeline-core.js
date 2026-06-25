import { ease } from './easing.js';

export function valueAt(keys, t) {
  if (t <= keys[0].t) return keys[0].v;
  const last = keys[keys.length - 1];
  if (t >= last.t) return last.v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t >= a.t && t <= b.t) {
      const span = b.t - a.t;
      const f = span === 0 ? 1 : (t - a.t) / span;
      return a.v + (b.v - a.v) * ease(b.ease || 'brand')(f);
    }
  }
  return last.v;
}

export function collectState(tracks, t) {
  const state = {};
  for (const tr of tracks) {
    (state[tr.layer] ||= {})[tr.prop] = valueAt(tr.keys, t);
  }
  return state;
}
