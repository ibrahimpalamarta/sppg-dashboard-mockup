/* ============================================================
   MBG Dashboard — Internal workspace shell (dark sidebar)
   PRD_MERGED §6

   Usage:
     Internal.mount({ page: 'ringkasan', title: '…', sub: '…' , render: fn })
   `render` is only called when the acting role may see the page;
   otherwise the "Akses ditutup" card is shown instead.
   ============================================================ */
(function () {
  const NAV = [
    { key: 'ringkasan',  href: 'ringkasan.html',  label: 'Ringkasan',   ic: 'chart' },
    { key: 'input',      href: 'input.html',      label: 'Input Data',  ic: 'upload' },
    { key: 'audit',      href: 'audit.html',      label: 'Jejak Audit', ic: 'history' },
    { key: 'biaya',      href: 'biaya.html',      label: 'Pengeluaran', ic: 'coins' },
    { key: 'arsitektur', href: 'arsitektur.html', label: 'Arsitektur',  ic: 'flow' },
    { key: 'acuan',      href: 'acuan.html',      label: 'Data Acuan',  ic: 'database' },
    { key: 'dokumen',    href: 'dokumen.html',    label: 'Dokumen',     ic: 'file' },
    { key: 'pengguna',   href: 'pengguna.html',   label: 'Pengguna',    ic: 'users' },
  ];

  const FASE2 = [
    'Distribusi per sekolah', 'Laporan keuangan', 'Formulir keamanan pangan',
    'Rantai pasok', 'Kehadiran', 'Analitik SDG',
  ];

  function sidebar(page) {
    return `
    <aside class="iside">
      <a class="iside-brand" href="index.html">
        <span class="logo">${icon('utensils')}</span>
        <span class="bt"><b>MBG Dashboard</b><span>Ruang kerja internal</span></span>
      </a>

      <div class="iside-role">
        <div class="isr-label">Masuk sebagai</div>
        ${Role.markup(true)}
      </div>

      <nav class="iside-nav" aria-label="Navigasi ruang kerja">
        <div class="isn-group">Fase 1</div>
        ${NAV.map(n => `<a href="${n.href}" data-page="${n.key}" class="${page === n.key ? 'active' : ''}">
          ${icon(n.ic)}<span>${n.label}</span>${icon('lock', 'lk')}
        </a>`).join('')}

        <div class="isn-group mt">Fase 2 — berikutnya</div>
        <div class="isn-soon">
          ${FASE2.map(f => `<span>${f}</span>`).join('')}
          <p>Menempati ruang navigasi yang sama, tanpa mengubah strukturnya.</p>
        </div>
      </nav>

      <div class="iside-foot">
        <div class="isf-scope">
          <span class="isf-k">Lingkup data</span>
          <span class="isf-v role-scope-val">—</span>
        </div>
        <a class="isf-pub" href="index.html">${icon('globe')} Lihat situs publik</a>
      </div>
    </aside>`;
  }

  function mount(opts) {
    const root = document.getElementById('workspace');
    if (!root) return;

    function paint() {
      const allowed = Role.can(opts.page);
      root.innerHTML = `
        ${sidebar(opts.page)}
        <div class="imain">
          <div class="itopbar">
            <button class="iside-toggle" aria-label="Menu">${icon('menu')}</button>
            <div class="itb-title">${opts.title}</div>
            <div class="itb-right">
              <span class="itb-asof">${icon('clock')} ${MBG.program.asOf}</span>
            </div>
          </div>
          <div class="iwrap" id="iwrap"></div>
        </div>`;

      const body = document.getElementById('iwrap');
      if (allowed) {
        body.innerHTML = `
          <div class="ipage-hd">
            <h1>${opts.title}</h1>
            ${opts.sub ? `<p>${opts.sub}</p>` : ''}
          </div>
          <div id="ibody"></div>`;
        opts.render(document.getElementById('ibody'));
      } else {
        body.innerHTML = Role.deniedCard();
        Role.bindDenied();
      }

      Role.bind();
      Role.apply();

      const tg = root.querySelector('.iside-toggle');
      if (tg) tg.addEventListener('click', () => root.querySelector('.iside').classList.toggle('open'));

      UI.observe(root);
    }

    Role.onChange(paint);
    paint();
  }

  window.Internal = { mount, NAV, FASE2 };
})();
