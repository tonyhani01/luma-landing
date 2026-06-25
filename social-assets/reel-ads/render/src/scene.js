// src/scene.js
import { COLORS, BUBBLES } from './tokens.js';

function el(doc, tag, style = {}, props = {}) {
  const n = doc.createElement(tag);
  Object.assign(n.style, style);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'text') n.textContent = v; else n.setAttribute(k, v);
  }
  return n;
}
const px = (v) => `${v}px`;
const abs = (l, t, w, h) => ({ position: 'absolute', left: px(l), top: px(t),
  ...(w != null ? { width: px(w) } : {}), ...(h != null ? { height: px(h) } : {}) });

export function buildScene(root, doc) {
  const layers = {};
  Object.assign(root.style, { position: 'relative', width: '1080px', height: '1920px',
    background: COLORS.paper, overflow: 'hidden', fontFamily: '"Bricolage Grotesque", sans-serif' });

  // --- phone ---
  const phone = el(doc, 'div', { ...abs(0, 0, 1080, 1920), transformOrigin: '50% 50%' });
  layers.phone = phone; root.appendChild(phone);
  phone.appendChild(el(doc, 'div', { ...abs(230, 300, 620, 1280), background: COLORS.ink, borderRadius: '72px' }));
  const screen = el(doc, 'div', { ...abs(250, 320, 580, 1240), background: COLORS.paperCard, borderRadius: '54px', overflow: 'hidden' });
  phone.appendChild(screen);
  screen.appendChild(el(doc, 'div', { ...abs(36, 26), color: COLORS.ink, fontWeight: 500, fontSize: '26px' }, { text: '9:41' }));
  screen.appendChild(el(doc, 'div', { ...abs(36, 84, 44, 44), background: COLORS.blue, borderRadius: '50%' }));
  screen.appendChild(el(doc, 'div', { ...abs(92, 90), color: COLORS.ink, fontWeight: 700, fontSize: '32px' }, { text: 'LUMA' }));
  screen.appendChild(el(doc, 'div', { ...abs(0, 158, 580, 2), background: COLORS.line }));

  // --- chat + bubbles ---
  const chat = el(doc, 'div', { ...abs(20, 192, 540, 1000) });
  layers.chat = chat; screen.appendChild(chat);
  for (const b of BUBBLES) {
    const wrap = el(doc, 'div', { position: 'absolute', top: px(b.y), [b.side]: '0px', transformOrigin: b.side === 'right' ? '100% 50%' : '0% 50%' });
    layers[b.id] = wrap; chat.appendChild(wrap);
    const bubble = el(doc, 'div', { display: 'inline-block', maxWidth: '492px', padding: '18px 24px',
      borderRadius: '28px', background: b.fill, position: 'relative' });
    wrap.appendChild(bubble);
    const text = el(doc, 'div', { color: b.text, fontFamily: `"${b.font}", sans-serif`, fontWeight: b.weight,
      fontSize: '30px', lineHeight: '36px', whiteSpace: 'nowrap', direction: b.dir },
      { dir: b.dir, 'data-role': 'text', 'data-dir': b.dir, text: b.copy });
    text.id = `${b.id}_text`; layers[`${b.id}_text`] = text; bubble.appendChild(text);
    const cursor = el(doc, 'div', { position: 'absolute', top: '50%', width: '3px', height: '34px',
      marginTop: '-17px', background: COLORS.blue },
      { 'data-role': 'cursor', 'data-dir': b.dir });
    cursor.id = `${b.id}_cursor`; layers[`${b.id}_cursor`] = cursor; bubble.appendChild(cursor);
  }

  // --- hook ---
  const hook = el(doc, 'div', { ...abs(100, 760, 880), textAlign: 'center', color: COLORS.ink,
    fontWeight: 800, fontSize: '92px', lineHeight: '1.05', transformOrigin: '50% 50%' },
    { text: "Your customers don't all type the same way." });
  layers.hook = hook; root.appendChild(hook);

  // --- payoff ---
  const payoff = el(doc, 'div', { ...abs(0, 0, 1080, 1920), pointerEvents: 'none' });
  layers.payoff = payoff; root.appendChild(payoff);
  const row = el(doc, 'div', { position: 'absolute', top: '1180px', left: '0', width: '1080px',
    textAlign: 'center', whiteSpace: 'nowrap' });
  payoff.appendChild(row);
  ['Arabic.', 'English.', 'Franco.'].forEach((w, i) => {
    const span = el(doc, 'span', { display: 'inline-block', margin: '0 12px', color: COLORS.ink,
      fontWeight: 800, fontSize: '64px', transformOrigin: '50% 50%' }, { text: w });
    layers[`payoff_w${i + 1}`] = span; row.appendChild(span);
  });
  const pline = el(doc, 'div', { position: 'absolute', top: '1300px', left: '0', width: '1080px',
    textAlign: 'center', fontWeight: 800, fontSize: '72px', color: COLORS.ink, transformOrigin: '50% 50%' });
  pline.innerHTML = `<span style="color:${COLORS.blue}">LUMA</span> gets all of them.`;
  layers.payoff_line = pline; payoff.appendChild(pline);

  // --- endcard ---
  const endcard = el(doc, 'div', { ...abs(0, 0, 1080, 1920), textAlign: 'center' });
  layers.endcard = endcard; root.appendChild(endcard);
  endcard.appendChild(el(doc, 'div', { ...abs(508, 820, 64, 64), background: COLORS.blue, borderRadius: '50%' }));
  endcard.appendChild(el(doc, 'div', { position: 'absolute', top: '900px', left: '0', width: '1080px',
    fontWeight: 800, fontSize: '88px', color: COLORS.ink }, { text: 'LUMA' }));
  endcard.appendChild(el(doc, 'div', { position: 'absolute', top: '1018px', left: '0', width: '1080px',
    fontWeight: 500, fontSize: '30px', color: COLORS.ink3 }, { text: 'luma-bot.com' }));
  const chip = el(doc, 'div', { ...abs(360, 1090, 360, 96), background: COLORS.blue, borderRadius: '16px',
    transformOrigin: '50% 50%' });
  layers.end_cta = chip; endcard.appendChild(chip);
  chip.appendChild(el(doc, 'div', { position: 'absolute', top: '50%', left: '0', width: '360px',
    marginTop: '-22px', textAlign: 'center', fontWeight: 700, fontSize: '34px', color: COLORS.paperCard },
    { text: 'Follow →  lumabot.ai' }));

  return layers;
}
