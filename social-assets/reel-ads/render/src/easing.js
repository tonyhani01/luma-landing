export function cubicBezier(x1, y1, x2, y2) {
  const A = (a, b) => 1 - 3 * b + 3 * a;
  const B = (a, b) => 3 * b - 6 * a;
  const C = (a) => 3 * a;
  const calc = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const slope = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
  function tForX(x) {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const xs = calc(t, x1, x2) - x;
      if (Math.abs(xs) < 1e-6) return t;
      const d = slope(t, x1, x2);
      if (Math.abs(d) < 1e-6) break;
      t -= xs / d;
    }
    let lo = 0, hi = 1; t = x;
    for (let i = 0; i < 24; i++) {
      const xs = calc(t, x1, x2);
      if (Math.abs(xs - x) < 1e-6) break;
      if (xs < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return t;
  }
  return (x) => (x <= 0 ? 0 : x >= 1 ? 1 : calc(tForX(x), y1, y2));
}

export const EASES = {
  linear: (t) => t,
  brand: cubicBezier(0.2, 0.6, 0.2, 1),
  'ease-out': cubicBezier(0, 0, 0.58, 1),
  'ease-in': cubicBezier(0.42, 0, 1, 1),
  'ease-in-out': cubicBezier(0.42, 0, 0.58, 1),
  step: (t) => (t < 1 ? 0 : 1),
};

export function ease(name) {
  return EASES[name] || EASES.brand;
}
