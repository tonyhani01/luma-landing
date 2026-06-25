// src/timeline.js
import { collectState } from './timeline-core.js';

// Scenes 1 & 2 (Scene 3/4/5 appended in Task 6).
export const TRACKS = [
  // Scene 1 — hook
  { layer: 'hook', prop: 'opacity', keys: [
    { t: 0, v: 0 }, { t: 300, v: 1, ease: 'ease-out' },
    { t: 1800, v: 1, ease: 'linear' }, { t: 2200, v: 0, ease: 'ease-in' } ] },
  { layer: 'hook', prop: 'scale', keys: [
    { t: 0, v: 0.9 }, { t: 350, v: 1.02, ease: 'ease-out' }, { t: 500, v: 1.0, ease: 'ease-out' },
    { t: 900, v: 1.0, ease: 'linear' }, { t: 1150, v: 1.06, ease: 'ease-in-out' }, { t: 1400, v: 1.0, ease: 'ease-in-out' },
    { t: 1800, v: 1.0, ease: 'linear' }, { t: 2200, v: 1.12, ease: 'ease-in' } ] },
  // Scene 2 — phone enters
  { layer: 'phone', prop: 'ty', keys: [ { t: 2000, v: 520 }, { t: 2600, v: 0, ease: 'ease-out' } ] },
  { layer: 'phone', prop: 'opacity', keys: [ { t: 0, v: 0 }, { t: 2000, v: 0, ease: 'linear' }, { t: 2300, v: 1, ease: 'ease-out' } ] },
  { layer: 'phone', prop: 'scale', keys: [
    { t: 2000, v: 0.8 }, { t: 2500, v: 1.03, ease: 'ease-out' }, { t: 2700, v: 1.0, ease: 'ease-out' } ] },
];

export function applyState(t, layers) {
  const state = collectState(TRACKS, t);
  for (const [name, s] of Object.entries(state)) {
    const elx = layers[name];
    if (!elx) continue;
    if ('opacity' in s) elx.style.opacity = String(s.opacity);
    if ('tx' in s || 'ty' in s || 'scale' in s) {
      const tx = s.tx || 0, ty = s.ty || 0, sc = 'scale' in s ? s.scale : 1;
      elx.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`;
    }
    if ('reveal' in s) {
      const v = s.reveal, dir = elx.dataset.dir;
      if (elx.dataset.role === 'cursor') {
        const w = parseFloat(elx.dataset.w || '0');
        elx.style.left = `${dir === 'rtl' ? (1 - v) * w : v * w}px`;
      } else {
        elx.style.clipPath = dir === 'rtl' ? `inset(0 0 0 ${(1 - v) * 100}%)` : `inset(0 ${(1 - v) * 100}% 0 0)`;
      }
    }
  }
}
