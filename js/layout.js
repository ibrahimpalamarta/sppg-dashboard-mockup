/* ============================================================
   MBG Dashboard — Public site header & footer (injected)
   PRD_MERGED §5.1
   Usage: Layout.render({ page: 'beranda'|'dapur'|'menu'|'transparansi'|'tentang' })
   ============================================================ */
(function () {
  const NAV = [
    { key: 'beranda',      href: 'index.html',        label: 'Beranda' },
    { key: 'dampak',       href: 'dampak.html',       label: 'Dampak' },
    { key: 'dapur',        href: 'dapur.html',        label: 'Dapur' },
    { key: 'menu',         href: 'menu.html',         label: 'Menu & Gizi' },
    { key: 'transparansi', href: 'transparansi.html', label: 'Transparansi' },
    { key: 'tentang',      href: 'tentang.html',      label: 'Tentang' },
  ];

  function header(page) {
    return `
    <div class="mock-banner">MOCKUP — seluruh data pada halaman ini simulasi, bukan data program sungguhan</div>
    <header class="site-header">
      <div class="container container-wide">
        <div class="bar">
          <a class="brand" href="index.html" aria-label="MBG Dashboard">
            <span class="logo">${icon('utensils')}</span>
            <span class="bt"><b>MBG Dashboard</b><span>ZeroStunting · EduFarmers</span></span>
          </a>
          <nav class="nav" aria-label="Navigasi utama">
            ${NAV.map(n => `<a href="${n.href}" class="${page === n.key ? 'active' : ''}">${n.label}</a>`).join('')}
          </nav>
          <div class="header-right">
            <a class="btn btn-primary btn-sm" href="ringkasan.html">${icon('lock')} Masuk ruang internal</a>
            <button class="menu-btn" aria-label="Menu" aria-expanded="false">${icon('menu')}</button>
          </div>
        </div>
      </div>
    </header>`;
  }

  function footer() {
    return `
    <footer class="site-footer">
      <div class="container container-wide">
        <div class="cols">
          <div class="f-brand">
            <b>MBG Dashboard</b>
            <p>Lapisan transparansi dan analitik untuk jaringan dapur SPPG di bawah program Makan Bergizi Gratis. Menyajikan data yang dihasilkan proses yang sudah berjalan — bukan menggantikannya.</p>
          </div>
          <div>
            <h5>Halaman</h5>
            ${NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join('')}
          </div>
          <div>
            <h5>Keterbukaan</h5>
            <a href="transparansi.html">Pustaka dokumen</a>
            <a href="menu.html">Rincian sembilan zat gizi</a>
            <a href="tentang.html">Apa yang dilakukan platform</a>
          </div>
        </div>
        <div class="f-bottom">
          <span>EduFarmers International Foundation · ZeroStunting</span>
          <span>Mockup untuk keperluan proposal — data simulasi.</span>
        </div>
      </div>
    </footer>`;
  }

  function render(opts) {
    opts = opts || {};
    const h = document.getElementById('header-mount');
    const f = document.getElementById('footer-mount');
    if (h) h.innerHTML = header(opts.page);
    if (f) f.innerHTML = footer();

    const mb = document.querySelector('.menu-btn');
    if (mb) mb.addEventListener('click', () => {
      const nav = document.querySelector('.nav');
      const open = nav.classList.toggle('open');
      mb.setAttribute('aria-expanded', open);
    });
  }

  window.Layout = { render, NAV };
})();
