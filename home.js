/* LUMA swiss-v3. Only job: scenario tabs. Without JS every scenario is shown. */
(function () {
  var tabs = [].slice.call(document.querySelectorAll('[role="tab"]'));
  var panels = [].slice.call(document.querySelectorAll('[role="tabpanel"]'));

  function activate(name, focus) {
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus({ preventScroll: true });
    });
    panels.forEach(function (p) {
      var on = p.dataset.panel === name;
      p.classList.remove('is-active', 'replay');
      if (!on) return;
      void p.offsetWidth; // restart the CSS stagger on every click
      p.classList.add('is-active', 'replay');
    });
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { activate(t.dataset.tab, false); });
    t.addEventListener('keydown', function (e) {
      var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      activate(tabs[(i + step + tabs.length) % tabs.length].dataset.tab, true);
    });
  });
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
