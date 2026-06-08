/* ============================================================
   MBG Dashboard — Shared header & footer (injected)
   Usage: Layout.render({ page: 'beranda'|'unit'|'overview'|'unggah', unit: slug })
   ============================================================ */
(function () {
  function header(page, unitSlug) {
    const units = MBG.units;
    const u = unitSlug || 'sukun';
    const link = (href, label, key, internal) => {
      const cls = [page === key ? 'active' : '', internal ? 'internal' : ''].filter(Boolean).join(' ');
      return `<a href="${href}" class="${cls}">${label}</a>`;
    };
    return `
    <header class="site-header">
      <div class="container-wide container">
        <div class="bar">
          <a class="brand" href="index.html" aria-label="ZeroStunting — MBG">
            <span class="logo">Z</span>
            <span class="bt"><b>ZeroStunting</b><span>Edufarmers · MBG</span></span>
          </a>
          <nav class="nav" aria-label="Navigasi utama">
            ${link('index.html', 'Beranda', 'beranda')}
            ${link('unit.html?u=' + u, 'Unit SPPG', 'unit')}
            ${link('overview.html', 'Monitor', 'overview', true)}
            ${link('unggah.html', 'Unggah Data', 'unggah', true)}
          </nav>
          <div class="header-right">
            <label class="upick" title="Pilih unit SPPG">
              ${icon('pin')}
              <select id="unit-jump">
                ${units.map(x => `<option value="${x.slug}" ${x.slug === u ? 'selected' : ''}>${x.name}</option>`).join('')}
              </select>
            </label>
            <div class="lang" title="Bahasa">
              <button class="on" data-lang="id">ID</button>
              <button data-lang="en" title="English (segera)">EN</button>
            </div>
            ${Role.markup()}
            <button class="menu-btn" aria-label="Menu">${icon('menu')}</button>
          </div>
        </div>
      </div>
    </header>`;
  }

  function footer() {
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="cols">
          <div class="f-brand">
            <b>ZeroStunting × MBG</b>
            <p>Jaringan dapur SPPG Edufarmers untuk program Makan Bergizi Gratis — gizi hari ini untuk generasi bebas stunting esok.</p>
            <div class="flex gap-2" style="margin-top:1rem">
              <span class="pill">${icon('shield')} SLHS</span>
              <span class="pill">${icon('check')} Halal</span>
              <span class="pill">${icon('badge')} HACCP</span>
            </div>
          </div>
          <div>
            <h5>Program</h5>
            <a href="index.html">Beranda</a>
            <a href="unit.html?u=sukun">Unit SPPG</a>
            <a href="overview.html">Monitor Internal</a>
            <a href="unggah.html">Unggah Data</a>
          </div>
          <div>
            <h5>Organisasi</h5>
            <a href="#">Tentang Edufarmers</a>
            <a href="#">Program ZeroStunting</a>
            <a href="#">Mitra & Donor</a>
            <a href="#">Laporan Dampak</a>
          </div>
          <div>
            <h5>Kontak</h5>
            <a href="#">info@edufarmers.org</a>
            <a href="#">Kota Malang, Jawa Timur</a>
            <a href="#">Simalungun, Sumatera Utara</a>
            <a href="#">mbg.zerostunting.com</a>
          </div>
        </div>
        <div class="f-bottom">
          <span>© 2026 Edufarmers International Foundation · Prototipe dashboard MBG</span>
          <span>Sebagian angka bersifat ilustratif untuk keperluan purwarupa.</span>
        </div>
      </div>
    </footer>`;
  }

  function render(opts) {
    opts = opts || {};
    const hMount = document.getElementById('header-mount');
    const fMount = document.getElementById('footer-mount');
    if (hMount) hMount.innerHTML = header(opts.page, opts.unit);
    if (fMount) fMount.innerHTML = footer();

    // wire unit jump
    const sel = document.getElementById('unit-jump');
    if (sel) sel.addEventListener('change', () => { location.href = 'unit.html?u=' + sel.value; });

    // wire lang stub
    document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.lang === 'en') { alert('Versi Bahasa Inggris segera hadir.'); return; }
      document.querySelectorAll('.lang button').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
    }));

    // mobile menu (simple)
    const mb = document.querySelector('.menu-btn');
    if (mb) mb.addEventListener('click', () => {
      const nav = document.querySelector('.nav');
      nav.style.display = nav.style.display === 'flex' ? '' : 'flex';
      nav.style.position = 'absolute'; nav.style.flexDirection = 'column';
      nav.style.top = 'var(--header-h)'; nav.style.left = '0'; nav.style.right = '0';
      nav.style.background = 'var(--brand-plum)'; nav.style.padding = '0.5rem 1rem 1rem';
    });

    Role.bind();
    Role.apply();
  }

  window.Layout = { render };
})();
