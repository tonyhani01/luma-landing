// src/tokens.js
export const STAGE = { w: 1080, h: 1920 };

export const COLORS = {
  paper: '#F4EFE6',
  paperCard: '#FBF8F2',
  ink: '#1B1A17',
  blue: '#2640DE',
  blueSoft: '#E4E5FB',
  ink3: '#8A8278',
  line: 'rgba(27,26,23,0.12)',
};

// Bubble model: chat-local y top; side right=customer, left=LUMA; dir ltr/rtl.
export const BUBBLES = [
  { id: 'dm1',    side: 'right', fill: COLORS.blueSoft,  text: COLORS.ink,       font: 'Tajawal',             weight: 500, dir: 'rtl', y: 0,   copy: 'عندكوا المقاس ده؟' },
  { id: 'reply1', side: 'left',  fill: COLORS.blue,      text: COLORS.paperCard, font: 'Tajawal',             weight: 500, dir: 'rtl', y: 110, copy: 'آه متوفر، تحب أبعتلك المقاسات؟' },
  { id: 'dm2',    side: 'right', fill: COLORS.blueSoft,  text: COLORS.ink,       font: 'Bricolage Grotesque', weight: 600, dir: 'ltr', y: 270, copy: 'how much is shipping?' },
  { id: 'reply2', side: 'left',  fill: COLORS.blue,      text: COLORS.paperCard, font: 'Bricolage Grotesque', weight: 600, dir: 'ltr', y: 378, copy: 'Flat 50 EGP, free over 1000 🚚' },
  { id: 'dm3',    side: 'right', fill: COLORS.blueSoft,  text: COLORS.ink,       font: 'Bricolage Grotesque', weight: 600, dir: 'ltr', y: 486, copy: '3ayez ashoof el catalog' },
  { id: 'reply3', side: 'left',  fill: COLORS.blue,      text: COLORS.paperCard, font: 'Bricolage Grotesque', weight: 600, dir: 'ltr', y: 594, copy: 'Etfadal 👇 catalog' },
];
