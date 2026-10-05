/* LUMA landing — motion + interactions. Progressive enhancement only:
   with JS off (or on error) every piece of content is visible and usable. */
(function () {
  try {
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var finePointer = !!(window.matchMedia && window.matchMedia('(pointer: fine)').matches);
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var hasIO = 'IntersectionObserver' in window;

    function onView(el, cb, opts) {
      if (!el) return;
      if (!hasIO) { cb(); return; }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); cb(); } });
      }, opts || { threshold: .2, rootMargin: '0px 0px -8% 0px' });
      io.observe(el);
    }

    /* ---------- Header: menu, stuck state, light mode, hide on scroll ---------- */
    var header = $('.site-header');
    var toggle = $('.nav-toggle');
    function closeNav(focus) {
      header.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
      if (focus) toggle.focus();
    }
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) header.classList.remove('is-hidden');
    });
    $$('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { closeNav(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && header.classList.contains('open')) closeNav(true); });

    /* ---------- Section tracking: clock, header tone, current nav ---------- */
    var clock = $('.clock'), clockT = $('.clock-t');
    var sections = $$('main section[data-sky]');
    var navMap = {};
    $$('.nav-links a[href^="#"]').forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
    var clockMins = 23 * 60 + 47, clockTarget = clockMins, clockRaf = 0;
    function fmt(m) {
      m = ((Math.round(m) % 1440) + 1440) % 1440;
      var h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'pm' : 'am';
      h = h % 12 || 12;
      return h + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap;
    }
    function toMins(s) { var p = s.split(':'); return (+p[0]) * 60 + (+p[1]); }
    function runClock() {
      cancelAnimationFrame(clockRaf);
      var from = clockMins, to = clockTarget;
      var diff = ((to - from) % 1440 + 1440) % 1440; // always move forward through the night
      if (diff > 720) diff = diff - 1440;              // ...unless going back is shorter
      if (reduce || Math.abs(diff) < 1) { clockMins = to; clockT.textContent = fmt(to); return; }
      var start = performance.now(), dur = 900;
      (function step(t) {
        var p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 3);
        clockMins = from + diff * e; clockT.textContent = fmt(clockMins);
        if (p < 1) clockRaf = requestAnimationFrame(step); else clockMins = to;
      })(start);
    }
    var current = null;
    function setSection(sec) {
      if (sec === current) return; current = sec;
      var sky = sec.getAttribute('data-sky');
      header.classList.toggle('is-light', sky === 'dawn' || sky === 'day');
      if (clock) {
        clock.setAttribute('data-phase', sky === 'day' || sky === 'dawn' ? 'day' : (sky === 'dusk' ? 'dusk' : 'night'));
        clockTarget = toMins(sec.getAttribute('data-clock') || '23:47'); runClock();
      }
      Object.keys(navMap).forEach(function (id) { navMap[id].classList.toggle('is-current', sec.id === id); });
    }
    if (hasIO) {
      var secIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) setSection(e.target); });
      }, { rootMargin: '-34px 0px -92% 0px' }); // a thin line just under the header
      sections.forEach(function (s) { secIO.observe(s); });
    }

    var lastY = window.scrollY, ticking = false;
    var parallax = reduce ? [] : $$('[data-parallax]');
    var drifts = reduce ? [] : $$('.lang-msg');
    var steps = $('.steps'), star = $('.closing-star');
    var vh = window.innerHeight;
    window.addEventListener('resize', function () { vh = window.innerHeight; }, { passive: true });

    function frame() {
      ticking = false;
      var y = window.scrollY;
      header.classList.toggle('is-stuck', y > 10);
      if (!header.classList.contains('open')) header.classList.toggle('is-hidden', y > lastY && y > vh * .9 && !reduce);
      lastY = y;
      if (reduce) return;
      parallax.forEach(function (img) {
        var r = img.parentNode.parentNode.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var c = (r.top + r.height / 2 - vh / 2);
        img.style.transform = 'translate3d(0,' + (c * -parseFloat(img.getAttribute('data-parallax'))).toFixed(1) + 'px,0)';
      });
      drifts.forEach(function (el, i) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2) / vh - .5; // -0.5..0.5
        el.style.setProperty('--drift', ((i % 2 ? -1 : 1) * p * 90).toFixed(1) + 'px');
      });
      if (steps) {
        var sr = steps.getBoundingClientRect();
        var sp = Math.max(0, Math.min(1, (vh * .85 - sr.top) / (sr.height + vh * .3)));
        steps.style.setProperty('--line', sp.toFixed(3));
      }
      if (star) {
        var cr = star.parentNode.getBoundingClientRect();
        if (cr.bottom > 0 && cr.top < vh) {
          var cp = 1 - (cr.top + cr.height) / (vh + cr.height);
          star.style.setProperty('--rot', (-18 + cp * 22).toFixed(2) + 'deg');
          star.style.setProperty('--sc', (.9 + cp * .2).toFixed(3));
        }
      }
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
    frame();

    /* ---------- Reveals ---------- */
    var reveals = $$('.reveal');
    if (reduce || !hasIO) reveals.forEach(function (el) { el.classList.add('is-in'); });
    else {
      var rIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rIO.unobserve(e.target); } });
      }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
      reveals.forEach(function (el) { rIO.observe(el); });
    }

    /* ---------- Hero: spotlight + phone tilt (fine pointers only) ---------- */
    var hero = $('.hero'), phone = $('.phone');
    if (finePointer && !reduce && hero) {
      var hx = 0, hy = 0, hraf = 0;
      hero.addEventListener('pointermove', function (e) {
        hx = e.clientX; hy = e.clientY;
        if (hraf) return;
        hraf = requestAnimationFrame(function () {
          hraf = 0;
          var r = hero.getBoundingClientRect();
          hero.style.setProperty('--mx', ((hx - r.left) / r.width * 100).toFixed(1) + '%');
          hero.style.setProperty('--my', ((hy - r.top) / r.height * 100).toFixed(1) + '%');
          var spot = $('.hero-spot'); if (spot) { spot.style.setProperty('--mx', ((hx - r.left) / r.width * 100).toFixed(1) + '%'); spot.style.setProperty('--my', ((hy - r.top) / r.height * 100).toFixed(1) + '%'); }
          if (phone) {
            var nx = (hx - r.left) / r.width - .5, ny = (hy - r.top) / r.height - .5;
            phone.style.setProperty('--ry', (-8 + nx * 12).toFixed(2) + 'deg');
            phone.style.setProperty('--rx', (4 - ny * 8).toFixed(2) + 'deg');
          }
        });
      });
    }

    /* ---------- Chat thread player ---------- */
    function thread(card) {
      var items = $$('[data-step]', card), timers = [], dots = [];
      var replay = $('.thread-replay', card);
      function clear() { timers.forEach(clearTimeout); timers = []; dots.forEach(function (d) { d.remove(); }); dots = []; }
      function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
      function show(el) { el.style.transition = 'opacity .45s cubic-bezier(.2,.7,.2,1), transform .55s cubic-bezier(.34,1.56,.64,1)'; el.style.opacity = '1'; el.style.transform = 'none'; }
      function complete() { clear(); items.forEach(function (el) { el.style.transition = 'none'; el.style.opacity = '1'; el.style.transform = 'none'; }); if (replay) replay.hidden = false; }
      function play() {
        if (reduce) { complete(); return; }
        clear(); if (replay) replay.hidden = true;
        items.forEach(function (el) { el.style.transition = 'none'; el.style.opacity = '0'; el.style.transform = 'translateY(10px) scale(.98)'; });
        var i = 0;
        (function next() {
          if (i >= items.length) { later(function () { if (replay) replay.hidden = false; }, 400); return; }
          var el = items[i++];
          if (el.hasAttribute('data-typing')) {
            var d = document.createElement('div');
            d.className = 'typing-indicator'; d.setAttribute('aria-hidden', 'true');
            d.innerHTML = '<span></span><span></span><span></span>';
            if (el.getAttribute('dir') === 'rtl') d.style.alignSelf = 'flex-start';
            el.parentNode.insertBefore(d, el); dots.push(d);
            later(function () { d.remove(); show(el); later(next, 320); }, 760);
          } else { later(function () { show(el); later(next, 260); }, 160); }
        })();
      }
      if (replay) replay.addEventListener('click', play);
      return { play: play, cancel: clear, complete: complete };
    }

    var heroThread = thread($('#hero-thread'));
    if (reduce) heroThread.complete(); else setTimeout(heroThread.play, 900);

    /* ---------- Scenario tabs ---------- */
    var tabs = $$('.scenario-tab');
    if (tabs.length) {
      var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
      var players = panels.map(function (p) { return thread($('.chat-card', p)); });
      var seen = false;
      function select(i, focus) {
        tabs.forEach(function (t, j) {
          var on = i === j;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
          panels[j].hidden = !on;
          if (!on) players[j].cancel();
        });
        if (focus) { tabs[i].focus({ preventScroll: true }); }
        // Horizontal rail on small screens: scroll only the rail, never the page.
        var rail = tabs[i].parentNode;
        if (rail.scrollWidth > rail.clientWidth) rail.scrollTo({ left: tabs[i].offsetLeft - 22, behavior: reduce ? 'auto' : 'smooth' });
        if (seen) players[i].play(); else players[i].complete();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i); });
        t.addEventListener('keydown', function (e) {
          var n = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
          if (e.key === 'Home') n = 0;
          if (e.key === 'End') n = tabs.length - 1;
          if (n !== null) { e.preventDefault(); select(n, true); }
        });
      });
      select(0);
      players[0].cancel();
      $$('[data-step]', panels[0]).forEach(function (el) { el.style.opacity = '0'; });
      onView($('.demo'), function () { seen = true; players[0].play(); }, { threshold: .35 });
      if (reduce) { seen = true; players[0].complete(); }
    }

    /* ---------- The light switch ---------- */
    var stage = $('.switch-stage'), sw = $('.lumaswitch'), touched = false;
    function setSwitch(on) {
      stage.setAttribute('data-luma', on ? 'on' : 'off');
      sw.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    if (sw) {
      sw.addEventListener('click', function () { touched = true; setSwitch(stage.getAttribute('data-luma') !== 'on'); });
      onView(stage, function () { setTimeout(function () { if (!touched) setSwitch(true); }, reduce ? 0 : 1400); }, { threshold: .55 });
    }

    /* ---------- Confidence gauge ---------- */
    var gauge = $('.gauge-card');
    if (gauge) {
      var gbtns = $$('.gauge-toggle button', gauge), gTouched = false, gTimer = 0;
      function setMode(m) {
        gauge.setAttribute('data-mode', m);
        gbtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-set') === m ? 'true' : 'false'); });
      }
      gbtns.forEach(function (b) { b.addEventListener('click', function () { gTouched = true; clearInterval(gTimer); setMode(b.getAttribute('data-set')); }); });
      if (!reduce) onView(gauge, function () {
        gTimer = setInterval(function () { if (gTouched) return clearInterval(gTimer); setMode(gauge.getAttribute('data-mode') === 'auto' ? 'handoff' : 'auto'); }, 3800);
      }, { threshold: .5 });
    }

    /* ---------- Human takeover: Sara types ---------- */
    var typed = $('.typed');
    if (typed) {
      var full = typed.getAttribute('data-text');
      onView($('.inbox'), function () {
        if (reduce) { typed.textContent = full; typed.classList.add('is-done'); return; }
        typed.textContent = ''; typed.classList.add('is-typing');
        var k = 0;
        setTimeout(function tick() {
          typed.textContent = full.slice(0, ++k);
          if (k < full.length) setTimeout(tick, 34 + Math.random() * 50);
          else { typed.classList.remove('is-typing'); typed.classList.add('is-done'); }
        }, 700);
      }, { threshold: .5 });
    }

    /* ---------- Proof counters ---------- */
    onView($('.proof-figures'), function () {
      if (reduce) return;
      $$('[data-count]').forEach(function (el) {
        var n = +el.getAttribute('data-count'), dec = +(el.getAttribute('data-decimals') || 0);
        var suf = el.getAttribute('data-suffix') || '', grp = el.getAttribute('data-group') === 'true';
        var f = function (v) { var s = dec ? v.toFixed(dec) : String(Math.round(v)); return (grp ? Number(s).toLocaleString('en-US') : s) + suf; };
        var t0 = performance.now(), dur = 1400;
        (function step(t) {
          var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
          el.textContent = f(n * e);
          if (p < 1) requestAnimationFrame(step); else el.textContent = f(n);
        })(t0);
      });
    }, { threshold: .4 });

    /* ---------- Magnetic primary buttons (fine pointers only) ---------- */
    if (finePointer && !reduce) {
      $$('.btn-glow, .btn-paper').forEach(function (b) {
        b.addEventListener('pointermove', function (e) {
          var r = b.getBoundingClientRect();
          b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .28).toFixed(1) + 'px)';
        });
        b.addEventListener('pointerleave', function () { b.style.transform = ''; });
      });
    }
  } catch (err) {
    document.documentElement.classList.remove('js');
    Array.prototype.slice.call(document.querySelectorAll('[data-step]')).forEach(function (s) { s.style.opacity = '1'; s.style.transform = 'none'; });
    Array.prototype.slice.call(document.querySelectorAll('.scenario-panel')).forEach(function (p) { p.hidden = false; });
    if (window.console) console.error(err);
  }
})();
