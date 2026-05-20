/**
 * LUMA waitlist welcome email automation.
 *
 * Setup (one time, ~5 minutes):
 *   1. Open the Google Form linked to the waitlist
 *      (the one whose response endpoint is in index.html).
 *   2. Click the three-dot menu → "Script editor" — or open the linked
 *      Responses Sheet → Extensions → Apps Script.
 *   3. Replace the default Code.gs contents with this entire file.
 *   4. Edit the CONFIG values below (FROM_NAME, REPLY_TO, EMAIL_COLUMN_HEADER).
 *   5. Run installTrigger() once from the editor.
 *      Approve the auth prompts (Gmail send + Form/Sheet read).
 *   6. Submit a test form entry — you should receive the welcome email.
 *
 * Quota: free Gmail = 100 sends/day; Google Workspace = 1500/day.
 * If you outgrow that, swap MailApp.sendEmail for a Resend/Postmark API call.
 */

const CONFIG = {
  FROM_NAME: 'LUMA',
  REPLY_TO: 'hello@luma-bot.com',
  EMAIL_COLUMN_HEADER: 'Email address',
  SUBJECT: "You're on the LUMA waitlist",
  BRAND_URL: 'https://luma-bot.com',
};

/**
 * Trigger entry point. Bound to the form's onFormSubmit event.
 * `e.namedValues` is the row keyed by column header.
 */
function onFormSubmit(e) {
  const email = extractEmail(e);
  if (!email) {
    console.warn('No email found on submission', JSON.stringify(e.namedValues));
    return;
  }

  MailApp.sendEmail({
    to: email,
    subject: CONFIG.SUBJECT,
    name: CONFIG.FROM_NAME,
    replyTo: CONFIG.REPLY_TO,
    htmlBody: renderHtml(),
    body: renderPlainText(),
  });
}

function extractEmail(e) {
  if (!e || !e.namedValues) return null;
  const direct = e.namedValues[CONFIG.EMAIL_COLUMN_HEADER];
  if (direct && direct[0]) return String(direct[0]).trim();
  for (const key of Object.keys(e.namedValues)) {
    const v = e.namedValues[key] && e.namedValues[key][0];
    if (v && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return String(v).trim();
  }
  return null;
}

function renderHtml() {
  return [
    '<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0a0a2e;line-height:1.55;">',
    '  <div style="background:linear-gradient(135deg,#05021a 0%,#0a0a2e 50%,#1a1a6e 100%);border-radius:16px;padding:36px 28px;color:#fff;text-align:center;">',
    '    <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#7aa8ff;margin-bottom:14px;">LUMA</div>',
    '    <h1 style="font-size:26px;margin:0 0 10px;font-weight:700;">You\'re on the list.</h1>',
    '    <p style="margin:0;color:#b3ccff;font-size:15px;">An AI teammate behind every DM is on its way.</p>',
    '  </div>',
    '  <p style="margin-top:28px;font-size:16px;">Hey,</p>',
    '  <p style="font-size:16px;">Thanks for joining the LUMA waitlist. We\'re personally onboarding the next batch of Shopify merchants — small group, lots of hand-holding, so we can get the bot answering DMs the way <em>you</em> would.</p>',
    '  <p style="font-size:16px;"><strong>What happens next:</strong></p>',
    '  <ul style="font-size:16px;padding-left:20px;">',
    '    <li style="margin-bottom:8px;">We\'ll reach out within 2 business days to schedule a 20-minute setup call.</li>',
    '    <li style="margin-bottom:8px;">On the call we\'ll connect your Shopify store and Instagram, sync your catalog, and tune LUMA to your brand voice (Arabic, English, or Franco Arabic — your call).</li>',
    '    <li>You\'ll be live the same week.</li>',
    '  </ul>',
    '  <p style="font-size:16px;">If there\'s anything you\'d like us to know up front — store size, daily DM volume, languages your customers use — just reply to this email.</p>',
    '  <p style="font-size:16px;margin-top:24px;">— The LUMA team</p>',
    '  <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">',
    '  <p style="font-size:12px;color:#64748b;text-align:center;">',
    '    <a href="' + CONFIG.BRAND_URL + '" style="color:#3355ee;text-decoration:none;">luma-bot.com</a> · AI customer service for Shopify',
    '  </p>',
    '</div>',
  ].join('\n');
}

function renderPlainText() {
  return [
    "You're on the LUMA waitlist.",
    '',
    "Thanks for joining. We're personally onboarding the next batch of Shopify merchants and we'll reach out within 2 business days to schedule a 20-minute setup call.",
    '',
    "On the call we'll connect your Shopify store and Instagram, sync your catalog, and tune LUMA to your brand voice (Arabic, English, or Franco Arabic).",
    '',
    "If there's anything you'd like us to know up front, just reply to this email.",
    '',
    '— The LUMA team',
    CONFIG.BRAND_URL,
  ].join('\n');
}

/**
 * Run this ONCE from the Apps Script editor to install the trigger.
 * Removes any existing onFormSubmit triggers first so it's idempotent.
 */
function installTrigger() {
  const form = FormApp.getActiveForm();
  if (!form) {
    throw new Error('Open this script from the Google Form (or set the form ID manually) before running installTrigger.');
  }
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'onFormSubmit')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('onFormSubmit').forForm(form).onFormSubmit().create();
  console.log('Trigger installed for form: ' + form.getTitle());
}

/**
 * Optional: paste your own email here and run sendTestEmail() once
 * to preview the template without submitting the form.
 */
function sendTestEmail() {
  const TO = 'tonyhani01@gmail.com';
  MailApp.sendEmail({
    to: TO,
    subject: '[TEST] ' + CONFIG.SUBJECT,
    name: CONFIG.FROM_NAME,
    replyTo: CONFIG.REPLY_TO,
    htmlBody: renderHtml(),
    body: renderPlainText(),
  });
}
