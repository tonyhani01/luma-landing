(function () {
  'use strict';
  var d = document;
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  /* ---- scroll reveal: fade-rise once ---- */
  var rvs = $$('.rv');
  $$('.bento .rv').forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 70 + 'ms'; });
  if (rm || !hasIO) {
    rvs.forEach(function (el) { el.classList.add('in'); });
  } else {
    var rvIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); rvIO.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    rvs.forEach(function (el) { rvIO.observe(el); });
  }

  /* ---- the machine: DM in, order ticket out ---- */
  var machine = $('#machine');
  var mSteps = $$('.m-step', machine);
  var mTimers = [];
  var mPlayed = false;
  function mClear() { mTimers.forEach(clearTimeout); mTimers = []; }
  function mPlay(first) {
    mClear();
    mSteps.forEach(function (s) { s.classList.remove('in'); });
    void machine.offsetWidth;
    if (rm) { mSteps.forEach(function (s) { s.classList.add('in'); }); return; }
    var at = [first ? 750 : 150, first ? 1650 : 1050, first ? 2650 : 2050, first ? 3650 : 3050];
    mSteps.forEach(function (s, i) {
      mTimers.push(setTimeout(function () { s.classList.add('in'); }, at[i]));
    });
  }
  $('#mReplay').addEventListener('click', function () { mPlayed = true; mPlay(false); });
  if (rm || !hasIO) { mPlay(true); } else {
    var mIO = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !mPlayed) { mPlayed = true; mIO.disconnect(); mPlay(true); }
    }, { threshold: 0.2 });
    mIO.observe(machine);
  }

  /* ---- scenario tabs ---- */
  var tabs = $$('[role="tab"]');
  var rail = $('.tabs');
  var panels = tabs.map(function (t) { return d.getElementById(t.getAttribute('aria-controls')); });
  var cur = 0, tTimers = [], tStarted = false;
  panels.forEach(function (p, j) { p.hidden = j !== 0; });
  function tClear() { tTimers.forEach(clearTimeout); tTimers = []; }
  function later(ms, fn) { tTimers.push(setTimeout(fn, ms)); }
  function playPanel(i) {
    tClear();
    var msgs = $$('.msg', panels[i]);
    msgs.forEach(function (m) { m.classList.remove('on', 'typing'); });
    void panels[i].offsetWidth;
    if (rm) { msgs.forEach(function (m) { m.classList.add('on'); }); return; }
    var t = 250;
    msgs.forEach(function (m) {
      var typed = m.hasAttribute('data-type');
      later(t, function () { m.classList.add('on'); if (typed) m.classList.add('typing'); });
      if (typed) { t += 850; later(t, function () { m.classList.remove('typing'); }); t += 450; }
      else { t += 700; }
    });
  }
  function select(i, focus) {
    cur = i;
    tabs.forEach(function (t, j) {
      t.setAttribute('aria-selected', j === i ? 'true' : 'false');
      t.tabIndex = j === i ? 0 : -1;
    });
    panels.forEach(function (p, j) { p.hidden = j !== i; p.classList.toggle('is-active', j === i); });
    if (focus) tabs[i].focus({ preventScroll: true });
    if (rail.scrollWidth > rail.clientWidth + 2) {
      var t = tabs[i];
      var left = rail.scrollLeft + (t.getBoundingClientRect().left - rail.getBoundingClientRect().left) - (rail.clientWidth - t.offsetWidth) / 2;
      rail.scrollTo({ left: left, behavior: rm ? 'auto' : 'smooth' });
    }
    tStarted = true;
    playPanel(i);
  }
  tabs.forEach(function (t, i) { t.addEventListener('click', function () { select(i, false); }); });
  rail.addEventListener('keydown', function (e) {
    var n = tabs.length, k = e.key, i = -1;
    if (k === 'ArrowRight' || k === 'ArrowDown') i = (cur + 1) % n;
    else if (k === 'ArrowLeft' || k === 'ArrowUp') i = (cur - 1 + n) % n;
    else if (k === 'Home') i = 0;
    else if (k === 'End') i = n - 1;
    if (i < 0) return;
    e.preventDefault();
    select(i, true);
  });
  $('#tReplay').addEventListener('click', function () { playPanel(cur); });
  var chat = $('.chat');
  if (rm || !hasIO) { playPanel(0); } else {
    var cIO = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !tStarted) { tStarted = true; cIO.disconnect(); playPanel(cur); }
    }, { threshold: 0.25 });
    cIO.observe(chat);
  }

  /* ---- sticky install bar (phones; CSS hides it from 768px) ---- */
  var sticky = $('#sticky');
  var stickyLink = $('a', sticky);
  var seen = { hero: true, close: false, foot: false };
  function stickyUpdate() {
    var show = !seen.hero && !seen.close && !seen.foot;
    sticky.classList.toggle('show', show);
    sticky.inert = !show;
    sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
    stickyLink.tabIndex = show ? 0 : -1;
  }
  if (hasIO) {
    var sIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen[e.target.getAttribute('data-k')] = e.isIntersecting; });
      stickyUpdate();
    });
    [['#heroInstall', 'hero'], ['#closeBtns', 'close'], ['#foot', 'foot']].forEach(function (p) {
      var el = $(p[0]); el.setAttribute('data-k', p[1]); sIO.observe(el);
    });
  }
})();

/* Install and demo clicks: Umami + Meta Pixel, same event names as before. Links stay plain anchors. */
(function () {
  function where(a) { var h = a.closest('[data-cta-location]'); return (h && h.dataset.ctaLocation) || 'other'; }
  function track(name, data) { if (window.umami && typeof window.umami.track === 'function') window.umami.track(name, data); }

  [].forEach.call(document.querySelectorAll('a[href="https://apps.shopify.com/luma"]'), function (a) {
    a.addEventListener('click', function () {
      track('install-click', { location: where(a) });
      if (typeof fbq === 'function') fbq('trackCustom', 'InstallClick', { location: where(a) });
    });
  });

  [].forEach.call(document.querySelectorAll('a[href^="https://calendly.com/"]'), function (a) {
    a.addEventListener('click', function (e) {
      track('demo-click', { location: where(a) });
      if (typeof fbq === 'function') fbq('trackCustom', 'DemoClick', { location: where(a) });
      if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
        window.Calendly.initPopupWidget({ url: a.href });
        e.preventDefault();
      }
    });
  });

  window.addEventListener('message', function (e) {
    if (typeof e.origin === 'string' && e.origin.indexOf('calendly.com') === -1) return;
    if (e.data && e.data.event === 'calendly.event_scheduled') {
      if (typeof fbq === 'function') fbq('track', 'Schedule', { content_name: 'demo-booked' });
      track('demo-booked');
    }
  });
})();
