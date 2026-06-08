/* ============================================================
   MBG Dashboard — UI helpers (vanilla)
   ============================================================ */
(function () {
  const UI = {};

  /* ---------- image with graceful placeholder fallback ---------- */
  UI.img = function (src, alt, type, cls, ratio) {
    const ph = (window.MBG && MBG.placeholder[type]) || 'assets/img/placeholders/gallery.svg';
    const r = ratio ? ` style="aspect-ratio:${ratio}"` : '';
    return `<img class="${cls || ''}" src="${src}" alt="${alt || ''}" loading="lazy" decoding="async"${r}
      onerror="this.onerror=null;this.src='${ph}';this.classList.add('is-ph')">`;
  };

  /* ---------- number formatting ---------- */
  UI.fmt = (n) => Number(n).toLocaleString('id-ID');

  /* ---------- count-up on scroll ---------- */
  function animateCount(el) {
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = parseInt(el.dataset.dur || '1100', 10);
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const val = to * ease(p);
      const shown = dec > 0 ? val.toFixed(dec) : Math.round(val);
      el.textContent = prefix + Number(shown).toLocaleString('id-ID', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- IntersectionObserver: reveals + counts ---------- */
  UI.observe = function (root) {
    const scope = root || document;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const reveals = scope.querySelectorAll('.reveal:not(.in)');
    if (reduce) {
      reveals.forEach(r => r.classList.add('in'));
      scope.querySelectorAll('.count:not(.done)').forEach(c => {
        c.classList.add('done');
        const dec = parseInt(c.dataset.decimals || '0', 10);
        c.textContent = (c.dataset.prefix || '') + Number(c.dataset.to).toLocaleString('id-ID', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (c.dataset.suffix || '');
      });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.classList.contains('reveal')) {
          const d = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('in'), d);
        }
        if (el.classList.contains('count') && !el.classList.contains('done')) {
          el.classList.add('done');
          animateCount(el);
        }
        io.unobserve(el);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(r => io.observe(r));
    scope.querySelectorAll('.count:not(.done)').forEach(c => io.observe(c));
  };

  /* ---------- staggered reveal helper (adds delays to children) ---------- */
  UI.stagger = function (container, step) {
    const s = step || 70;
    [...container.children].forEach((c, i) => {
      c.classList.add('reveal');
      c.dataset.delay = i * s;
    });
  };

  /* ---------- lightbox ---------- */
  let lbItems = [], lbIndex = 0, lbEl;
  function ensureLightbox() {
    if (lbEl) return;
    lbEl = document.createElement('div');
    lbEl.className = 'lightbox';
    lbEl.innerHTML = `
      <button class="lb-close" aria-label="Tutup">${icon('x')}</button>
      <button class="lb-nav lb-prev" aria-label="Sebelumnya">${icon('chevronRight')}</button>
      <button class="lb-nav lb-next" aria-label="Berikutnya">${icon('chevronRight')}</button>
      <figure><img alt=""><figcaption></figcaption></figure>`;
    document.body.appendChild(lbEl);
    lbEl.querySelector('.lb-prev svg').style.transform = 'rotate(180deg)';
    lbEl.querySelector('.lb-close').onclick = closeLb;
    lbEl.querySelector('.lb-prev').onclick = () => showLb(lbIndex - 1);
    lbEl.querySelector('.lb-next').onclick = () => showLb(lbIndex + 1);
    lbEl.onclick = (e) => { if (e.target === lbEl) closeLb(); };
    document.addEventListener('keydown', (e) => {
      if (!lbEl.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
      if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    });
  }
  function showLb(i) {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const it = lbItems[lbIndex];
    const img = lbEl.querySelector('img');
    img.src = it.src; img.alt = it.caption || '';
    img.onerror = () => { img.onerror = null; img.src = MBG.placeholder.gallery; };
    lbEl.querySelector('figcaption').textContent = it.caption || '';
  }
  function closeLb() { lbEl.classList.remove('open'); }
  UI.openLightbox = function (items, index) {
    ensureLightbox();
    lbItems = items; showLb(index || 0);
    lbEl.classList.add('open');
  };

  /* ---------- generic filter chips ---------- */
  UI.bindChips = function (chipWrap, onSelect) {
    chipWrap.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chipWrap.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        onSelect(chip.dataset.value);
      });
    });
  };

  window.UI = UI;
})();
