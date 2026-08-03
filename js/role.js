/* ============================================================
   MBG Dashboard — Mock role state & access gating
   PRD_MERGED §3.2 six-role model + §3.3 permission matrix.

   ⚠️ MOCK ONLY — NOT SECURITY.
   PRD_MERGED §3.4: client-side hiding is convenience only. The real
   platform must re-authorize every request server-side and read the
   acting role from the database, never from a token claim.
   ============================================================ */
(function () {
  const ROLES = [
    { id: 'publik',     label: 'Publik',              sub: 'Tanpa login',           internal: false, scope: null },
    { id: 'supervisor', label: 'Supervisor Lapangan', sub: 'Satu dapur ditugaskan', internal: true,  scope: 'SPPG Kebonsari', kitchen: 'Kebonsari' },
    { id: 'data',       label: 'Data Admin',          sub: 'Seluruh dapur',         internal: true,  scope: 'Semua dapur' },
    { id: 'cms',        label: 'CMS Admin',           sub: 'Konten & dokumen',      internal: true,  scope: 'Semua dapur' },
    { id: 'internal',   label: 'Internal User',       sub: 'Hanya baca',            internal: true,  scope: 'Semua dapur' },
    { id: 'super',      label: 'Super Admin',         sub: 'Akses penuh',           internal: true,  scope: 'Semua dapur' },
  ];

  /* page → roles allowed (PRD_MERGED §3.3) */
  const ACCESS = {
    ringkasan:  ['data', 'cms', 'internal', 'super'],
    input:      ['supervisor', 'data', 'super'],
    audit:      ['supervisor', 'data', 'cms', 'internal', 'super'],
    biaya:      ['data', 'internal', 'super'],
    arsitektur: ['data', 'cms', 'internal', 'super'],
    acuan:      ['data', 'super'],
    dokumen:    ['cms', 'super'],
    pengguna:   ['super'],
  };

  /* what each role may do — shown on the "Akses ditutup" page */
  const PERMS = {
    publik:     ['Melihat seluruh halaman publik'],
    supervisor: ['Mengunggah berkas dapur yang ditugaskan', 'Meninjau hasil pembacaan', 'Mengunci catatan harian', 'Mengajukan koreksi', 'Melihat jejak audit dapurnya'],
    data:       ['Seluruh wewenang supervisor, untuk semua dapur', 'Memvalidasi & mengimpor data', 'Menyetujui koreksi', 'Mengelola tabel acuan AKG', 'Mengelola templat impor', 'Melihat pengeluaran operasional'],
    cms:        ['Mengelola konten & pengumuman publik', 'Mengelola galeri & dokumen', 'Mengatur visibilitas Publik/Internal', 'Melihat ringkasan & jejak audit'],
    internal:   ['Melihat ringkasan program', 'Melihat jejak audit', 'Melihat pengeluaran (hanya baca)', 'Mengunduh laporan'],
    super:      ['Seluruh wewenang di atas', 'Mengelola pengguna, peran, dan lingkup dapur'],
  };

  const KEY = 'mbg.role';
  const listeners = [];

  function current() {
    const id = localStorage.getItem(KEY) || 'publik';
    return ROLES.find(r => r.id === id) || ROLES[0];
  }
  function isInternal() { return current().internal; }
  function can(page) { return (ACCESS[page] || []).indexOf(current().id) !== -1; }
  function perms(id) { return PERMS[id || current().id] || []; }

  function set(id) {
    localStorage.setItem(KEY, id);
    apply();
    listeners.forEach(fn => fn(current()));
  }

  /* toggle gated elements + refresh switcher chrome */
  function apply() {
    const internal = isInternal();
    document.querySelectorAll('[data-internal]').forEach(el => { el.hidden = !internal; });
    document.querySelectorAll('[data-public-only]').forEach(el => { el.hidden = internal; });

    const lbl = document.querySelector('.role-sw .role-label');
    if (lbl) lbl.textContent = current().label;
    document.querySelectorAll('.role-scope-val').forEach(sc => { sc.textContent = current().scope || '—'; });
    document.querySelectorAll('.role-menu button[data-role]').forEach(b =>
      b.classList.toggle('sel', b.dataset.role === current().id));

    /* sidebar locks follow the permission matrix */
    document.querySelectorAll('.iside-nav a[data-page]').forEach(a => {
      a.classList.toggle('locked', !can(a.dataset.page));
    });
  }

  function markup(compact) {
    return `<div class="role-sw ${compact ? 'compact' : ''}">
      <button class="role-btn" aria-haspopup="true" aria-expanded="false">
        <span class="dot"></span><span class="role-label">${current().label}</span>${icon('chevronDown')}
      </button>
      <div class="role-menu" role="menu">
        <div class="rm-head">Masuk sebagai</div>
        ${ROLES.map(r => `<button data-role="${r.id}" role="menuitem">
          <span>${r.label}<span class="rm-sub">${r.sub}</span></span>
          ${r.internal ? icon('lock') : icon('globe')}
        </button>`).join('')}
        <div class="rm-foot">${icon('info')} Peralihan peran ini simulasi. Otorisasi sungguhan diperiksa di server pada setiap permintaan.</div>
      </div>
    </div>`;
  }

  function bind() {
    const sw = document.querySelector('.role-sw');
    if (!sw) return;
    const btn = sw.querySelector('.role-btn');
    const menu = sw.querySelector('.role-menu');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    menu.addEventListener('click', (e) => e.stopPropagation());
    menu.querySelectorAll('button[data-role]').forEach(b => {
      b.addEventListener('click', () => {
        set(b.dataset.role);
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', false);
      });
    });
    document.addEventListener('click', () => menu.classList.remove('open'));
  }

  /* the "Akses ditutup" card — names the acting role and lists its rights */
  function deniedCard() {
    const r = current();
    return `<div class="denied reveal">
      <div class="denied-ic">${icon('lock')}</div>
      <h2>Akses ditutup</h2>
      <p>Halaman ini tidak termasuk wewenang peran <b>${r.label}</b>.</p>
      <div class="denied-perms">
        <h4>Yang dapat dilakukan peran ${r.label}</h4>
        <ul>${perms().map(p => `<li>${icon('check')} ${p}</li>`).join('')}</ul>
      </div>
      <div class="denied-act">
        <button class="btn btn-primary" id="denied-switch">${icon('users')} Ganti peran</button>
        <a class="btn btn-ghost" href="index.html">Lihat situs publik</a>
      </div>
      <p class="denied-note">${icon('shield')} Menyembunyikan menu di sisi klien hanya kemudahan tampilan. Pada platform sungguhan, setiap permintaan diperiksa ulang di server dan peran dibaca dari basis data — sehingga pencabutan akses berlaku seketika, bukan saat sesi berakhir.</p>
    </div>`;
  }

  function bindDenied() {
    const b = document.getElementById('denied-switch');
    if (b) b.addEventListener('click', (e) => {
      e.stopPropagation();
      const rb = document.querySelector('.role-btn');
      if (rb) rb.click();
    });
  }

  window.Role = {
    ROLES, ACCESS, current, isInternal, can, perms, set, apply,
    markup, bind, deniedCard, bindDenied,
    onChange: (fn) => listeners.push(fn),
  };
})();
