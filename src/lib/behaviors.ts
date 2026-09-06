/**
 * All client behaviour for the site, as one inline script.
 * Kept as plain DOM code (no React state) so the exported HTML works
 * even before/without hydration — good for speed and for static hosts.
 */
export const behaviors = `
(function () {
  var d = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var qsa = function (s) { return Array.prototype.slice.call(d.querySelectorAll(s)); };

  /* ---------- reveal on scroll ---------- */
  qsa('.hero .reveal').forEach(function (el) { el.classList.add('in'); });
  var revealEls = qsa('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- language bars ---------- */
  var bars = qsa('[data-bar]');
  var fill = function (b) { b.style.width = b.getAttribute('data-bar') + '%'; };
  if ('IntersectionObserver' in window) {
    var bo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { fill(e.target); bo.unobserve(e.target); } });
    }, { threshold: 0.35 });
    bars.forEach(function (b) { bo.observe(b); });
  } else { bars.forEach(fill); }

  /* ---------- sticky nav ---------- */
  var nav = d.getElementById('nav');
  var last = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY || 0;
    if (nav) {
      nav.classList.toggle('scrolled', y > 40);
      if (y > 320 && y > last + 4) nav.classList.add('hide');
      else if (y < last - 4 || y < 200) nav.classList.remove('hide');
    }
    last = y;
  }, { passive: true });

  /* ---------- active nav link ---------- */
  var pairs = [];
  qsa('[data-navlink]').forEach(function (l) {
    var s = d.querySelector(l.getAttribute('data-navlink'));
    if (s) pairs.push([s, l]);
  });
  if ('IntersectionObserver' in window && pairs.length) {
    var ao = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        for (var i = 0; i < pairs.length; i++) {
          if (pairs[i][0] === e.target) pairs[i][1].classList.toggle('active', e.isIntersecting);
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    pairs.forEach(function (p) { ao.observe(p[0]); });
  }

  /* ---------- mobile drawer ---------- */
  var toggle = d.getElementById('navToggle');
  var drawer = d.getElementById('drawer');
  var scrim = d.getElementById('scrim');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    if (scrim) scrim.classList.toggle('open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      var o = toggle.querySelector('[data-icon="open"]');
      var c = toggle.querySelector('[data-icon="close"]');
      if (o) o.hidden = open;
      if (c) c.hidden = !open;
    }
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle) toggle.addEventListener('click', function () { setDrawer(!drawer.classList.contains('open')); });
  if (scrim) scrim.addEventListener('click', function () { setDrawer(false); });
  qsa('[data-drawer-link]').forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });

  /* ---------- typewriter ---------- */
  var tw = d.getElementById('tw');
  if (tw && !reduce) {
    var words = [];
    try { words = JSON.parse(tw.getAttribute('data-words') || '[]'); } catch (err) { words = []; }
    if (words.length > 1) {
      var wi = 0, ci = words[0].length, del = false;
      var tick = function () {
        var w = words[wi];
        if (!del) {
          ci++;
          if (ci >= w.length) { tw.textContent = w; del = true; setTimeout(tick, 1900); return; }
        } else {
          ci--;
          if (ci <= 0) { ci = 0; del = false; wi = (wi + 1) % words.length; tw.textContent = ''; setTimeout(tick, 300); return; }
        }
        tw.textContent = w.slice(0, ci);
        setTimeout(tick, del ? 26 : 52);
      };
      setTimeout(function () { del = true; tick(); }, 2400);
    }
  }

  /* ---------- cursor spotlight ---------- */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    var raf = null, mx = 50, my = 0;
    window.addEventListener('pointermove', function (e) {
      mx = (e.clientX / window.innerWidth) * 100;
      my = (e.clientY / window.innerHeight) * 100;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        d.documentElement.style.setProperty('--mx', mx + '%');
        d.documentElement.style.setProperty('--my', my + '%');
        raf = null;
      });
    }, { passive: true });
  }
})();
`;
