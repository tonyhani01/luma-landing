# LUMA Landing Page Redesign — Design Spec

## Overview

Redesign the LUMA landing page to shift messaging from "support tool" to "sales + support tool", fix data mismatches with the backend, add an early access signup flow, and clean up technical jargon for a merchant audience.

**File:** `index.html` (single-file static site using Tailwind CSS CDN)
**Asset:** `logo.png` (needs transparency fix)

---

## Changes

### 1. Logo — Transparent Background

**Problem:** `logo.png` has a white rectangle and green stripe behind the logo icon. On dark backgrounds (hero, footer, CTA section) it renders as a visible white block.

**Fix:** Process `logo.png` to remove the opaque background, producing a transparent PNG. The existing CSS `logo-glow` filter will work correctly once the background is removed.

**Affected locations:**
- Navbar: `<img src="logo.png" ... class="w-9 h-9 object-contain logo-glow">`
- Hero badge: `<img src="logo.png" ... class="w-6 h-6 object-contain logo-glow">`
- Chat mockup avatar: `<img src="logo.png" ... class="w-full h-full object-contain">`
- Final CTA: `<img src="logo.png" ... class="w-20 h-20 object-contain logo-glow">`
- Footer: `<img src="logo.png" ... class="w-8 h-8 object-contain logo-glow">`

---

### 2. Hero Badge — "Early Access"

**Before:** `"Now live on Shopify App Store"`
**After:** `"Early Access — Limited Spots"`

**Location:** Hero section, line ~147:
```html
<span class="text-sm font-medium text-glow-200">Now live on Shopify App Store</span>
```

---

### 3. Hero Copy — Sales-Driven Messaging

**Before:**
- Headline: "Your AI teammate / for customer DMs"
- Subtext: "LUMA handles your Instagram DMs and Shopify chat automatically — in Arabic, English, and Franco Arabic. Instant replies, order tracking, smart escalation. You focus on growing your brand."

**After:**
- Headline: "Your AI teammate / for DMs that sell"
- Subtext: "LUMA turns product questions into sales and handles support automatically — in Arabic, English, and Franco Arabic. Instant replies. More conversions. Less work."

**Location:** Hero section, lines ~149-155

---

### 4. Email Signup Form — Replaces Install CTAs

**Rationale:** The product is in early access, not live on the Shopify App Store. Replace all "Install Free on Shopify" buttons with email capture forms.

**Hero CTA (lines ~157-164):** Replace the two buttons with:
- Email input field (placeholder: "your@email.com")
- Submit button: "Get Early Access →"
- Helper text below: "Free to join — we'll set you up personally"

**Navbar CTA (line ~114-117):** Replace "Get Started Free" button with "Get Early Access" linking to `#signup` (the hero form).

**Final CTA section (lines ~686-698):** Replace the heading and button:
- Heading: "Ready to turn your DMs into sales?" / "Join the early access waitlist"
- Same email input + "Join Waitlist →" button
- Remove "Stop living in your DMs. Let LUMA handle it."

**Pricing buttons:** Change all "Get Started" / "Start Free Trial" buttons to "Join Waitlist" linking to `#signup`.

**Note:** The forms are front-end only (no backend). Use `mailto:` or a simple `action` placeholder. The merchant will collect emails manually or connect a service later.

---

### 5. Pricing — Align with plans.py

**Source of truth:** `app/config/plans.py`

**Current (wrong):** 3 tiers — Free (50/day), Starter ($29, 200/day), Pro ($79, 500/day)

**Correct (4 tiers):**

| Plan | Price | Daily AI Limit | Tagline |
|------|-------|---------------|---------|
| Free | $0/month | 20 conversations/day | Perfect for testing |
| Starter (Most Popular) | $29/month | 200 conversations/day | For growing brands |
| Growth | $79/month | 600 conversations/day | For scaling stores |
| Pro | $149/month | 1,500 conversations/day | For high-volume stores |

**Layout:** Change from 3-column to 4-column grid (`md:grid-cols-2 lg:grid-cols-4`). Starter remains "Most Popular".

**Feature lists per tier:**
- **Free:** 20 AI conversations/day, Instagram + Shopify chat, Order tracking, Smart pre-filtering, Admin dashboard
- **Starter:** 200 AI conversations/day, Everything in Free, Custom auto-reply templates, Priority escalation queue, Advanced analytics
- **Growth:** 600 AI conversations/day, Everything in Starter, Live conversation updates, Priority support, Custom bot personality
- **Pro:** 1,500 AI conversations/day, Everything in Growth, Dedicated account manager, Custom integrations, SLA guarantee

---

### 6. Remove Technical Jargon

**Additional features list (lines ~342-379):**
- "WebSocket Live Updates" → "Instant Live Updates"
- "Real-time ticket push, no polling" → "See new messages the moment they arrive"
- "Multi-Tenant Architecture" → "Secure Store Isolation"
- "Full data isolation between stores" → "Your data stays private & separate"

**Pricing feature lists:**
- "Real-time WebSocket updates" (Pro tier) → "Live conversation updates"

**FAQ section:**
- In the data safety answer, replace "multi-tenant architecture with full data isolation" with "secure architecture that keeps each store's data completely separate"
- Replace "HMAC-SHA256" with "industry-standard security verification"

---

### 7. Integrations Bar — Redesigned

**Before:** Shopify, Instagram, Claude AI, Supabase (4 items)
**After:** Shopify, Instagram, WhatsApp (with "SOON" badge), Powered by Claude (4 items)

**Remove:** Claude AI entry (line ~246-248), Supabase entry (line ~249-253)

**Add WhatsApp:**
- WhatsApp SVG icon (green #25D366)
- Label: "WhatsApp"
- Badge: small green pill with "SOON" text

**Add Powered by Claude:**
- Claude/Anthropic icon (amber #D97706)
- Label: "Powered by Claude"

---

### 8. Stats Bar — Replace "$0.34" Stat

**Before:** "$0.34 — Average AI cost per client / month"
**After:** "24/7 — Always on, never sleeps"

**Location:** Stats section, 4th stat block (lines ~273-276)

---

### 9. Features Section — Sales Messaging

**Section header (lines ~286-288):**
- Before: "Everything you need to automate customer support"
- After: "Everything you need to turn DMs into sales"

**Section subtext:**
- Before: "LUMA isn't just a chatbot. It's a complete customer service platform that lives inside your Shopify admin."
- After: "Every product question is a chance to close a sale. LUMA makes sure you never miss one."

---

### 10. "Why LUMA" Section — Sales Angle

**Section header (lines ~430-433):**
- Before: "Not another generic chatbot"
- After: "Not just support — it's your best salesperson"

**Section subtext:**
- Before: "LUMA was built from the ground up for Shopify merchants who sell on Instagram."
- After: "LUMA was built for Shopify merchants who know that fast answers drive more sales."

**Add new differentiator bullet** (in the comparison list, after existing bullets):
- Title: "DMs that convert"
- Description: "Product questions answered instantly means customers buy on the spot. No more lost sales because you replied too late."

---

## Out of Scope

- Backend changes (plans.py is not modified)
- Email form backend integration (forms are UI-only for now)
- New pages or routes
- Mobile app changes
- SEO/meta tag updates beyond what naturally changes with new copy

## Testing

- Visual verification on desktop and mobile viewports
- Check logo renders correctly on all 5 locations (dark and light backgrounds)
- Verify pricing grid renders correctly at 4 columns on desktop, 2 on tablet, 1 on mobile
- Confirm all anchor links (#signup, #features, #pricing, #faq) still work
- Check email form has basic HTML validation (type="email", required)
