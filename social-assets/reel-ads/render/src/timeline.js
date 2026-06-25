// src/timeline.js
import { collectState } from './timeline-core.js';

// Merge all tracks that share (layer, prop) into one track per group,
// concatenating their keys arrays and sorting by t ascending.
function mergeByLayerProp(tracks) {
  const groups = new Map();
  for (const tr of tracks) {
    const key = `${tr.layer} ${tr.prop}`;
    if (!groups.has(key)) groups.set(key, { layer: tr.layer, prop: tr.prop, keys: [] });
    groups.get(key).keys.push(...tr.keys);
  }
  for (const g of groups.values()) {
    g.keys.sort((a, b) => a.t - b.t);
  }
  return Array.from(groups.values());
}

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
  { layer: 'phone', prop: 'opacity', keys: [ { t: 0, v: 0 }, { t: 2000, v: 0, ease: 'linear' }, { t: 2300, v: 1, ease: 'ease-out' } ] }, // Scene 2: fade in
  { layer: 'phone', prop: 'scale', keys: [
    { t: 2000, v: 0.8 }, { t: 2500, v: 1.03, ease: 'ease-out' }, { t: 2700, v: 1.0, ease: 'ease-out' } ] },
];

// --- Scene 3: three DM pairs ---
// reveal direction is encoded in the DOM (data-dir); here we only animate reveal 0->1.
function dmPair({ dm, reply, base }) {
  // base = pair start time; pattern identical across pairs, offset by base.
  return [
    { layer: dm, prop: 'scale',   keys: [{ t: base + 0, v: 0.8 }, { t: base + 200, v: 1.0, ease: 'ease-out' }] },
    { layer: dm, prop: 'opacity', keys: [{ t: 0, v: 1 }, { t: base + 0, v: 0, ease: 'linear' }, { t: base + 150, v: 1, ease: 'ease-out' }] },
    { layer: `${dm}_text`,   prop: 'reveal', keys: [{ t: base + 200, v: 0 }, { t: base + 800, v: 1, ease: 'linear' }] },
    { layer: `${dm}_cursor`, prop: 'reveal', keys: [{ t: base + 200, v: 0 }, { t: base + 800, v: 1, ease: 'linear' }] },
    { layer: `${dm}_cursor`, prop: 'opacity', keys: [
      { t: base + 200, v: 1 }, { t: base + 350, v: 0, ease: 'step' }, { t: base + 500, v: 1, ease: 'step' },
      { t: base + 650, v: 0, ease: 'step' }, { t: base + 800, v: 1, ease: 'step' }, { t: base + 900, v: 0, ease: 'step' } ] },
    { layer: 'phone', prop: 'scale', keys: [{ t: base + 200, v: 1.0 }, { t: base + 500, v: 1.22, ease: 'ease-in-out' }, { t: base + 1700, v: 1.22, ease: 'linear' }, { t: base + 2000, v: 1.0, ease: 'ease-in-out' }] },
    { layer: 'phone', prop: 'ty',    keys: [{ t: base + 200, v: 0 }, { t: base + 500, v: 90, ease: 'ease-in-out' }, { t: base + 1700, v: 90, ease: 'linear' }, { t: base + 2000, v: 0, ease: 'ease-in-out' }] },
    { layer: reply, prop: 'scale',   keys: [{ t: base + 900, v: 0.8 }, { t: base + 1100, v: 1.0, ease: 'ease-out' }] },
    { layer: reply, prop: 'opacity', keys: [{ t: 0, v: 1 }, { t: base + 900, v: 0, ease: 'linear' }, { t: base + 1050, v: 1, ease: 'ease-out' }] },
    { layer: `${reply}_text`,   prop: 'reveal', keys: [{ t: base + 1100, v: 0 }, { t: base + 1600, v: 1, ease: 'linear' }] },
    { layer: `${reply}_cursor`, prop: 'reveal', keys: [{ t: base + 1100, v: 0 }, { t: base + 1600, v: 1, ease: 'linear' }] },
    { layer: `${reply}_cursor`, prop: 'opacity', keys: [{ t: base + 1100, v: 1 }, { t: base + 1600, v: 1, ease: 'linear' }, { t: base + 1700, v: 0, ease: 'step' }] },
  ];
}
TRACKS.push(
  ...dmPair({ dm: 'dm1', reply: 'reply1', base: 2700 }),
  ...dmPair({ dm: 'dm2', reply: 'reply2', base: 4800 }),
  ...dmPair({ dm: 'dm3', reply: 'reply3', base: 6900 }),
  // chat scroll (cumulative)
  { layer: 'chat', prop: 'ty', keys: [
    { t: 4600, v: 0 }, { t: 4800, v: -200, ease: 'ease-out' },
    { t: 6700, v: -200, ease: 'linear' }, { t: 6900, v: -400, ease: 'ease-out' },
    { t: 8800, v: -400, ease: 'linear' }, { t: 9000, v: -600, ease: 'ease-out' } ] },
);

// --- Scene 4: payoff ---
TRACKS.push(
  { layer: 'phone', prop: 'scale',   keys: [{ t: 8800, v: 1.0 }, { t: 9100, v: 0.85, ease: 'ease-in-out' }, { t: 10300, v: 0.85, ease: 'linear' }, { t: 10600, v: 0.85, ease: 'linear' }] },
  { layer: 'phone', prop: 'opacity', keys: [{ t: 8800, v: 1 }, { t: 9400, v: 0.25, ease: 'ease-in' }, { t: 10300, v: 0.25, ease: 'linear' }, { t: 10600, v: 0, ease: 'ease-in' }] }, // Scene 4: fade out
  ...['payoff_w1', 'payoff_w2', 'payoff_w3'].flatMap((w, i) => {
    const t0 = 8900 + i * 150;
    return [
      { layer: w, prop: 'opacity', keys: [{ t: 0, v: 0 }, { t: t0, v: 0, ease: 'linear' }, { t: t0 + 150, v: 1, ease: 'ease-out' }, { t: 10300, v: 1, ease: 'linear' }, { t: 10500, v: 0, ease: 'ease-in' }] },
      { layer: w, prop: 'scale',   keys: [{ t: t0, v: 0.8 }, { t: t0 + 150, v: 1.0, ease: 'ease-out' }] },
    ];
  }),
  { layer: 'payoff_line', prop: 'opacity', keys: [{ t: 0, v: 0 }, { t: 9500, v: 0, ease: 'linear' }, { t: 9900, v: 1, ease: 'ease-out' }, { t: 10300, v: 1, ease: 'linear' }, { t: 10500, v: 0, ease: 'ease-in' }] },
  { layer: 'payoff_line', prop: 'scale',   keys: [{ t: 9500, v: 0.94 }, { t: 9900, v: 1.0, ease: 'ease-out' }] },
);

// --- Scene 5: endcard ---
TRACKS.push(
  { layer: 'endcard', prop: 'opacity', keys: [{ t: 0, v: 0 }, { t: 10600, v: 0, ease: 'linear' }, { t: 11000, v: 1, ease: 'ease-out' }] },
  { layer: 'endcard', prop: 'scale',   keys: [{ t: 10600, v: 0.8 }, { t: 10950, v: 1.03, ease: 'ease-out' }, { t: 11100, v: 1.0, ease: 'ease-out' }] },
  { layer: 'end_cta', prop: 'ty',      keys: [{ t: 11200, v: 40 }, { t: 11500, v: 0, ease: 'ease-out' }] },
  { layer: 'end_cta', prop: 'opacity', keys: [{ t: 0, v: 0 }, { t: 11200, v: 0, ease: 'linear' }, { t: 11450, v: 1, ease: 'ease-out' }] },
  { layer: 'end_cta', prop: 'scale',   keys: [{ t: 11700, v: 1.0 }, { t: 11850, v: 1.06, ease: 'ease-in-out' }, { t: 12000, v: 1.0, ease: 'ease-in-out' }] },
);

export const MERGED = mergeByLayerProp(TRACKS);

export function applyState(t, layers) {
  const state = collectState(MERGED, t);
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
