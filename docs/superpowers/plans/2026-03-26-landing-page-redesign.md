# LUMA Landing Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the LUMA landing page to add sales-driven messaging, early access signup, correct pricing, and polish (transparent logo, no jargon).

**Architecture:** Single-file static site (`index.html`) with Tailwind CSS CDN. All changes are HTML/CSS edits plus one image asset fix. No build step, no JS framework.

**Tech Stack:** HTML, Tailwind CSS (CDN), static PNG asset

**Spec:** `docs/superpowers/specs/2026-03-26-landing-page-redesign-design.md`

**Preview server:** `luma-landing` on port 3000 (already running via `.claude/launch.json`)

---

## File Structure

- **Modify:** `index.html` — all 10 content changes
- **Modify:** `logo.png` — remove opaque background, make transparent

---

### Task 1: Make Logo Transparent

**Files:**
- Modify: `logo.png`

- [ ] **Step 1: Remove opaque background from logo.png**

Use Python PIL/Pillow to remove the white and green background, keeping only the neon blue star/bolt icon with transparency. The logo has a white background and a green stripe at the top.

```bash
python3 -c "
from PIL import Image
img = Image.open('logo.png').convert('RGBA')
data = img.getdata()
new_data = []
for item in data:
    # Remove white-ish pixels (R>200, G>200, B>200) and green stripe (G>100, R<120, B<100)
    if (item[0] > 200 and item[1] > 200 and item[2] > 200):
        new_data.append((255, 255, 255, 0))
    elif (item[1] > 100 and item[0] < 120 and item[2] < 100):
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)
img.putdata(new_data)
img.save('logo.png')
"
```

If Pillow is not available, use ImageMagick:
```bash
convert logo.png -fuzz 20% -transparent white -fuzz 15% -transparent "#6B8E23" logo.png
```

- [ ] **Step 2: Verify logo transparency**

Open the preview server (port 3000) and visually check:
- Navbar logo: no white block on the glass background
- Hero badge: no white block on dark hero
- Chat mockup avatar: clean on gradient background
- Final CTA section: clean on dark hero
- Footer: clean on dark background

Take a screenshot to confirm.

- [ ] **Step 3: Commit**

```bash
git add logo.png
git commit -m "fix: remove opaque background from logo, make transparent"
```

---

### Task 2: Hero Badge + Hero Copy + Sales Messaging

**Files:**
- Modify: `index.html:147` (hero badge)
- Modify: `index.html:149-155` (hero headline + subtext)

- [ ] **Step 1: Update hero badge text**

In `index.html`, find line 147:
```html
<span class="text-sm font-medium text-glow-200">Now live on Shopify App Store</span>
```
Replace with:
```html
<span class="text-sm font-medium text-glow-200">Early Access — Limited Spots</span>
```

- [ ] **Step 2: Update hero headline**

Find lines 149-152:
```html
<h1 class="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
  Your AI teammate<br>
  <span class="text-transparent bg-clip-text bg-gradient-to-r from-glow-300 to-glow-500 text-glow">for customer DMs</span>
</h1>
```
Replace the inner text:
```html
<h1 class="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
  Your AI teammate<br>
  <span class="text-transparent bg-clip-text bg-gradient-to-r from-glow-300 to-glow-500 text-glow">for DMs that sell</span>
</h1>
```

- [ ] **Step 3: Update hero subtext**

Find lines 153-155:
```html
<p class="mt-6 text-lg sm:text-xl text-glow-200/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
  LUMA handles your Instagram DMs and Shopify chat automatically — in Arabic, English, and Franco Arabic. Instant replies, order tracking, smart escalation. You focus on growing your brand.
</p>
```
Replace with:
```html
<p class="mt-6 text-lg sm:text-xl text-glow-200/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
  LUMA turns product questions into sales and handles support automatically — in Arabic, English, and Franco Arabic. Instant replies. More conversions. Less work.
</p>
```

- [ ] **Step 4: Verify in preview**

Check the hero section at localhost:3000 — badge says "Early Access", headline says "for DMs that sell", subtext mentions sales.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "copy: update hero to early access + sales-driven messaging"
```

---

### Task 3: Email Signup Form — Hero CTA

**Files:**
- Modify: `index.html:156-164` (hero CTA buttons)

- [ ] **Step 1: Replace hero CTA buttons with email form**

Find lines 156-164 (the two button links):
```html
<div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
  <a href="#pricing" class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl gradient-cta text-white font-heading font-semibold text-base btn-glow hover:opacity-95 transition-all duration-200 cursor-pointer">
    Install Free on Shopify
    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
  </a>
  <a href="#how-it-works" class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-glow-500/20 text-white font-heading font-semibold text-base hover:bg-white/10 hover:border-glow-500/30 transition-all duration-200 cursor-pointer">
    See How It Works
  </a>
</div>
```
Replace with:
```html
<div id="signup" class="mt-8 max-w-md mx-auto lg:mx-0">
  <form action="mailto:hello@lumabot.ai" method="POST" enctype="text/plain" class="flex flex-col sm:flex-row gap-3" onsubmit="event.preventDefault(); this.querySelector('button').textContent='Thanks! We\'ll be in touch.'; this.querySelector('button').disabled=true; this.querySelector('input').disabled=true;">
    <input type="email" name="email" required placeholder="your@email.com" class="flex-1 px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-glow-500/20 text-white placeholder-glow-200/40 font-body text-base focus:outline-none focus:border-glow-400 focus:ring-1 focus:ring-glow-400 transition-all duration-200">
    <button type="submit" class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl gradient-cta text-white font-heading font-semibold text-base btn-glow hover:opacity-95 transition-all duration-200 cursor-pointer whitespace-nowrap">
      Get Early Access
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
    </button>
  </form>
  <p class="mt-3 text-sm text-glow-200/40 text-center sm:text-left">Free to join — we'll set you up personally</p>
</div>
```

- [ ] **Step 2: Verify hero form in preview**

Check at localhost:3000:
- Email input and button render side-by-side on desktop
- Stack vertically on mobile
- Clicking submit with valid email shows "Thanks!" message
- Required validation works (empty submit shows browser error)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: replace hero CTA with early access email signup form"
```

---

### Task 4: Navbar CTA + Final CTA Section + Pricing Buttons

**Files:**
- Modify: `index.html:114-117` (navbar CTA)
- Modify: `index.html:568` (Free pricing button)
- Modify: `index.html:591` (Starter pricing button)
- Modify: `index.html:611` (Pro pricing button — will become Growth, then new Pro added)
- Modify: `index.html:690-698` (final CTA section)

- [ ] **Step 1: Update navbar CTA**

Find lines 114-117:
```html
<a href="#pricing" class="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl gradient-cta text-white text-sm font-semibold btn-glow hover:opacity-95 transition-all duration-200 cursor-pointer">
  Get Started Free
  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
</a>
```
Replace with:
```html
<a href="#signup" class="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl gradient-cta text-white text-sm font-semibold btn-glow hover:opacity-95 transition-all duration-200 cursor-pointer">
  Get Early Access
  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
</a>
```

- [ ] **Step 2: Update final CTA section**

Find lines 690-698:
```html
<h2 class="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
  Stop living in your DMs.<br>
  <span class="text-transparent bg-clip-text bg-gradient-to-r from-glow-300 to-glow-500 text-glow">Let LUMA handle it.</span>
</h2>
<p class="text-glow-200/70 text-lg max-w-xl mx-auto mb-8">Join the merchants who've reclaimed their time. Install in 5 minutes, free forever on the starter plan.</p>
<a href="#" class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl gradient-cta text-white font-heading font-semibold text-base btn-glow hover:opacity-95 transition-all duration-200 cursor-pointer">
  Install Free on Shopify
  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
</a>
```
Replace with:
```html
<h2 class="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
  Ready to turn your DMs<br>
  <span class="text-transparent bg-clip-text bg-gradient-to-r from-glow-300 to-glow-500 text-glow">into sales?</span>
</h2>
<p class="text-glow-200/70 text-lg max-w-xl mx-auto mb-8">Join the early access waitlist. We'll set you up personally.</p>
<form action="mailto:hello@lumabot.ai" method="POST" enctype="text/plain" class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onsubmit="event.preventDefault(); this.querySelector('button').textContent='Thanks! We\'ll be in touch.'; this.querySelector('button').disabled=true; this.querySelector('input').disabled=true;">
  <input type="email" name="email" required placeholder="your@email.com" class="flex-1 px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-glow-500/20 text-white placeholder-glow-200/40 font-body text-base focus:outline-none focus:border-glow-400 focus:ring-1 focus:ring-glow-400 transition-all duration-200">
  <button type="submit" class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl gradient-cta text-white font-heading font-semibold text-base btn-glow hover:opacity-95 transition-all duration-200 cursor-pointer whitespace-nowrap">
    Join Waitlist
    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
  </button>
</form>
```

- [ ] **Step 3: Update all pricing buttons to "Join Waitlist"**

Find each pricing button and replace with a link to `#signup`:

Line 568 (Free):
```html
<a href="#signup" class="block w-full py-3 rounded-xl border-2 border-gray-200 text-center font-heading font-semibold text-sm text-cosmos-900 hover:border-glow-400 hover:bg-glow-50 transition-all duration-200 cursor-pointer">Join Waitlist</a>
```

Line 591 (Starter):
```html
<a href="#signup" class="block w-full py-3 rounded-xl gradient-cta text-center font-heading font-semibold text-sm text-white btn-glow hover:opacity-95 transition-all duration-200 cursor-pointer">Join Waitlist</a>
```

Line 611 (current Pro, will become Growth after Task 5):
```html
<a href="#signup" class="block w-full py-3 rounded-xl border-2 border-gray-200 text-center font-heading font-semibold text-sm text-cosmos-900 hover:border-glow-400 hover:bg-glow-50 transition-all duration-200 cursor-pointer">Join Waitlist</a>
```

- [ ] **Step 4: Verify all CTAs in preview**

Check at localhost:3000:
- Navbar button says "Get Early Access" and scrolls to hero form
- Final CTA section has email form with "Join Waitlist"
- All 3 pricing buttons say "Join Waitlist" and scroll to hero form
- All anchor links (#signup) work

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: update all CTAs to early access signup flow"
```

---

### Task 5: Pricing — 4 Tiers from plans.py

**Files:**
- Modify: `index.html:546-547` (pricing header text)
- Modify: `index.html:550-613` (pricing grid — replace entire 3-column grid with 4-column)

- [ ] **Step 1: Update pricing header text**

Find line 547:
```html
<p class="mt-4 text-lg text-gray-500">No credit card required. Try LUMA with 50 AI conversations per day, upgrade when your store grows.</p>
```
Replace with:
```html
<p class="mt-4 text-lg text-gray-500">No credit card required. Start with 20 AI conversations per day, upgrade when your store grows.</p>
```

- [ ] **Step 2: Replace pricing grid with 4 tiers**

Find the entire grid from line 550 (`<div class="grid md:grid-cols-3`) through line 613 (closing `</div>` of grid). Replace with:

```html
<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
  <!-- Free -->
  <div class="glass-card rounded-2xl p-7 flex flex-col fade-in">
    <div class="mb-5">
      <h3 class="font-heading font-semibold text-lg text-cosmos-900">Free</h3>
      <p class="text-gray-500 text-sm mt-1">Perfect for testing</p>
    </div>
    <div class="mb-5">
      <span class="font-heading font-extrabold text-3xl text-cosmos-900">$0</span>
      <span class="text-gray-500 text-sm">/month</span>
    </div>
    <ul class="space-y-2.5 mb-7 flex-1">
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>20 AI conversations / day</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Instagram + Shopify chat</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Order tracking</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Smart pre-filtering</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Admin dashboard</li>
    </ul>
    <a href="#signup" class="block w-full py-3 rounded-xl border-2 border-gray-200 text-center font-heading font-semibold text-sm text-cosmos-900 hover:border-glow-400 hover:bg-glow-50 transition-all duration-200 cursor-pointer">Join Waitlist</a>
  </div>

  <!-- Starter (Popular) -->
  <div class="glass-card rounded-2xl p-7 flex flex-col pricing-popular relative fade-in">
    <div class="absolute -top-3.5 left-1/2 -translate-x-1/2">
      <span class="px-4 py-1 rounded-full gradient-cta text-white text-xs font-semibold btn-glow">Most Popular</span>
    </div>
    <div class="mb-5">
      <h3 class="font-heading font-semibold text-lg text-cosmos-900">Starter</h3>
      <p class="text-gray-500 text-sm mt-1">For growing brands</p>
    </div>
    <div class="mb-5">
      <span class="font-heading font-extrabold text-3xl text-cosmos-900">$29</span>
      <span class="text-gray-500 text-sm">/month</span>
    </div>
    <ul class="space-y-2.5 mb-7 flex-1">
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg><strong>200</strong>&nbsp;AI conversations / day</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Everything in Free</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Custom auto-reply templates</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Priority escalation queue</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Advanced analytics</li>
    </ul>
    <a href="#signup" class="block w-full py-3 rounded-xl gradient-cta text-center font-heading font-semibold text-sm text-white btn-glow hover:opacity-95 transition-all duration-200 cursor-pointer">Join Waitlist</a>
  </div>

  <!-- Growth -->
  <div class="glass-card rounded-2xl p-7 flex flex-col fade-in">
    <div class="mb-5">
      <h3 class="font-heading font-semibold text-lg text-cosmos-900">Growth</h3>
      <p class="text-gray-500 text-sm mt-1">For scaling stores</p>
    </div>
    <div class="mb-5">
      <span class="font-heading font-extrabold text-3xl text-cosmos-900">$79</span>
      <span class="text-gray-500 text-sm">/month</span>
    </div>
    <ul class="space-y-2.5 mb-7 flex-1">
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg><strong>600</strong>&nbsp;AI conversations / day</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Everything in Starter</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Live conversation updates</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Priority support</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Custom bot personality</li>
    </ul>
    <a href="#signup" class="block w-full py-3 rounded-xl border-2 border-gray-200 text-center font-heading font-semibold text-sm text-cosmos-900 hover:border-glow-400 hover:bg-glow-50 transition-all duration-200 cursor-pointer">Join Waitlist</a>
  </div>

  <!-- Pro -->
  <div class="glass-card rounded-2xl p-7 flex flex-col fade-in">
    <div class="mb-5">
      <h3 class="font-heading font-semibold text-lg text-cosmos-900">Pro</h3>
      <p class="text-gray-500 text-sm mt-1">For high-volume stores</p>
    </div>
    <div class="mb-5">
      <span class="font-heading font-extrabold text-3xl text-cosmos-900">$149</span>
      <span class="text-gray-500 text-sm">/month</span>
    </div>
    <ul class="space-y-2.5 mb-7 flex-1">
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg><strong>1,500</strong>&nbsp;AI conversations / day</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Everything in Growth</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Dedicated account manager</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Custom integrations</li>
      <li class="flex items-center gap-2.5 text-sm text-gray-600"><svg class="w-4 h-4 text-glow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>SLA guarantee</li>
    </ul>
    <a href="#signup" class="block w-full py-3 rounded-xl border-2 border-gray-200 text-center font-heading font-semibold text-sm text-cosmos-900 hover:border-glow-400 hover:bg-glow-50 transition-all duration-200 cursor-pointer">Join Waitlist</a>
  </div>
</div>
```

- [ ] **Step 3: Verify pricing in preview**

Check at localhost:3000:
- 4 pricing cards visible on desktop (4 columns)
- 2 columns on tablet, 1 on mobile
- Starter has "Most Popular" badge
- Correct prices: $0, $29, $79, $149
- Correct limits: 20, 200, 600, 1500
- All buttons say "Join Waitlist"

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "fix: align pricing with plans.py — 4 tiers, correct limits"
```

---

### Task 6: Remove Technical Jargon

**Files:**
- Modify: `index.html:357` ("WebSocket Live Updates")
- Modify: `index.html:358` (WebSocket description)
- Modify: `index.html:375` ("Multi-Tenant Architecture")
- Modify: `index.html:376` (Multi-Tenant description)
- Modify: `index.html:663` (FAQ data safety answer)

- [ ] **Step 1: Update "WebSocket Live Updates" feature**

Find line 357:
```html
<p class="font-semibold text-sm text-cosmos-900">WebSocket Live Updates</p>
```
Replace with:
```html
<p class="font-semibold text-sm text-cosmos-900">Instant Live Updates</p>
```

Find line 358:
```html
<p class="text-xs text-gray-500 mt-0.5">Real-time ticket push, no polling</p>
```
Replace with:
```html
<p class="text-xs text-gray-500 mt-0.5">See new messages the moment they arrive</p>
```

- [ ] **Step 2: Update "Multi-Tenant Architecture" feature**

Find line 375:
```html
<p class="font-semibold text-sm text-cosmos-900">Multi-Tenant Architecture</p>
```
Replace with:
```html
<p class="font-semibold text-sm text-cosmos-900">Secure Store Isolation</p>
```

Find line 376:
```html
<p class="text-xs text-gray-500 mt-0.5">Full data isolation between stores</p>
```
Replace with:
```html
<p class="text-xs text-gray-500 mt-0.5">Your data stays private & separate</p>
```

- [ ] **Step 3: Update FAQ data safety answer**

Find line 663:
```html
<div class="px-6 pb-5 text-sm text-gray-500 leading-relaxed">Absolutely. LUMA uses multi-tenant architecture with full data isolation — your store's data is completely separated. We verify webhook signatures (HMAC-SHA256), enforce Shopify's GDPR compliance, and all API communications use HTTPS.</div>
```
Replace with:
```html
<div class="px-6 pb-5 text-sm text-gray-500 leading-relaxed">Absolutely. LUMA uses a secure architecture that keeps each store's data completely separate. We verify webhook signatures with industry-standard security verification, enforce Shopify's GDPR compliance, and all API communications use HTTPS.</div>
```

- [ ] **Step 4: Verify in preview**

Check at localhost:3000:
- Features section shows "Instant Live Updates" and "Secure Store Isolation"
- FAQ data safety answer has no technical terms
- Pricing Growth tier shows "Live conversation updates" (from Task 5)

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "copy: replace technical jargon with merchant-friendly language"
```

---

### Task 7: Integrations Bar — WhatsApp + Powered by Claude

**Files:**
- Modify: `index.html:245-253` (replace Claude AI + Supabase entries)

- [ ] **Step 1: Replace Claude AI and Supabase with WhatsApp + Powered by Claude**

Find lines 245-253 (the Claude AI and Supabase entries):
```html
<div class="flex items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity duration-200">
  <svg class="w-7 h-7" viewBox="0 0 24 24" fill="#D97706"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  <span class="font-heading font-semibold text-gray-700 text-lg">Claude AI</span>
</div>
<div class="flex items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity duration-200">
  <svg class="w-7 h-7" viewBox="0 0 24 24" fill="#3ECF8E"><path d="M13.5 21.168c-.511.63-1.527.283-1.538-.526L11.6 12h8.4c1.3 0 2.06 1.488 1.29 2.531L13.5 21.168zM10.5 2.832c.511-.63 1.527-.283 1.538.526L12.4 12H4c-1.3 0-2.06-1.488-1.29-2.531L10.5 2.832z"/></svg>
  <span class="font-heading font-semibold text-gray-700 text-lg">Supabase</span>
</div>
```
Replace with:
```html
<div class="flex items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity duration-200">
  <svg class="w-7 h-7" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  <span class="font-heading font-semibold text-gray-700 text-lg">WhatsApp</span>
  <span class="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wide">Soon</span>
</div>
<div class="flex items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity duration-200">
  <svg class="w-7 h-7" viewBox="0 0 24 24" fill="#D97706"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  <span class="font-heading font-semibold text-gray-700 text-lg">Powered by Claude</span>
</div>
```

- [ ] **Step 2: Verify in preview**

Check at localhost:3000:
- Integrations bar shows: Shopify, Instagram, WhatsApp (with green "SOON" badge), Powered by Claude
- No more Supabase
- WhatsApp icon is green, Claude icon is amber

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add WhatsApp (coming soon) + Powered by Claude to integrations"
```

---

### Task 8: Stats Bar — Replace "$0.34" Stat

**Files:**
- Modify: `index.html:274-275`

- [ ] **Step 1: Replace the cost stat with 24/7 availability**

Find lines 274-275:
```html
<p class="font-heading font-extrabold text-4xl sm:text-5xl text-cosmos-800">$0.34</p>
<p class="mt-2 text-sm text-gray-500 font-medium">Average AI cost<br>per client / month</p>
```
Replace with:
```html
<p class="font-heading font-extrabold text-4xl sm:text-5xl text-cosmos-800">24/7</p>
<p class="mt-2 text-sm text-gray-500 font-medium">Always on<br>never sleeps</p>
```

- [ ] **Step 2: Verify in preview**

Check stats bar at localhost:3000 shows: 80%, <2s, 3, 24/7

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "copy: replace cost-per-message stat with 24/7 availability"
```

---

### Task 9: Features + Why LUMA — Sales Messaging

**Files:**
- Modify: `index.html:286` (features heading)
- Modify: `index.html:287` (features subtext)
- Modify: `index.html:431` (differentiators heading)
- Modify: `index.html:432` (differentiators subtext)
- Modify: `index.html:484` (add new differentiator bullet after last one)

- [ ] **Step 1: Update features section header**

Find line 286:
```html
<h2 class="font-heading font-bold text-3xl sm:text-4xl text-cosmos-900 leading-tight">Everything you need to automate customer support</h2>
```
Replace with:
```html
<h2 class="font-heading font-bold text-3xl sm:text-4xl text-cosmos-900 leading-tight">Everything you need to turn DMs into sales</h2>
```

Find line 287:
```html
<p class="mt-4 text-lg text-gray-500">LUMA isn't just a chatbot. It's a complete customer service platform that lives inside your Shopify admin.</p>
```
Replace with:
```html
<p class="mt-4 text-lg text-gray-500">Every product question is a chance to close a sale. LUMA makes sure you never miss one.</p>
```

- [ ] **Step 2: Update "Why LUMA" section header**

Find line 431:
```html
<h2 class="font-heading font-bold text-3xl sm:text-4xl text-cosmos-900 leading-tight">Not another generic chatbot</h2>
```
Replace with:
```html
<h2 class="font-heading font-bold text-3xl sm:text-4xl text-cosmos-900 leading-tight">Not just support — it's your best salesperson</h2>
```

Find line 432:
```html
<p class="mt-4 text-lg text-gray-500">LUMA was built from the ground up for Shopify merchants who sell on Instagram.</p>
```
Replace with:
```html
<p class="mt-4 text-lg text-gray-500">LUMA was built for Shopify merchants who know that fast answers drive more sales.</p>
```

- [ ] **Step 3: Add "DMs that convert" differentiator bullet**

After line 484 (closing `</div>` of the last differentiator bullet "Escalation is a feature"), insert:
```html
<div class="flex items-start gap-3">
  <div class="w-6 h-6 rounded-full bg-glow-50 flex items-center justify-center flex-shrink-0 mt-0.5">
    <svg class="w-3.5 h-3.5 text-glow-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
  </div>
  <div>
    <p class="font-semibold text-sm text-cosmos-900">DMs that convert</p>
    <p class="text-xs text-gray-500">Product questions answered instantly means customers buy on the spot. No more lost sales because you replied too late.</p>
  </div>
</div>
```

- [ ] **Step 4: Verify in preview**

Check at localhost:3000:
- Features section heading: "Everything you need to turn DMs into sales"
- Why LUMA heading: "Not just support — it's your best salesperson"
- New "DMs that convert" bullet appears in the comparison list

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "copy: add sales-driven messaging to features and differentiators"
```

---

### Task 10: Final Visual Verification

- [ ] **Step 1: Full-page desktop screenshot**

Take a screenshot of the full page at localhost:3000 and verify all 10 changes are applied:
1. Logo is transparent (no white block)
2. Hero badge says "Early Access — Limited Spots"
3. Hero headline says "for DMs that sell"
4. Hero has email signup form
5. Pricing has 4 tiers with correct numbers
6. No technical jargon in features or FAQ
7. Integrations bar shows WhatsApp (Soon) + Powered by Claude
8. Stats show 24/7 instead of $0.34
9. Features heading mentions sales
10. Why LUMA has sales angle + "DMs that convert" bullet

- [ ] **Step 2: Mobile viewport check**

Resize to mobile viewport and verify:
- Email form stacks vertically
- Pricing cards stack to single column
- Logo still looks clean
- All text is readable

- [ ] **Step 3: Test anchor links**

Click each nav link (#features, #how-it-works, #pricing, #faq) and the #signup links to verify smooth scrolling works.
