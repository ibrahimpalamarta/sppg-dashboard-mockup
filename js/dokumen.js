/* ============================================================
   Dokumen & CMS (internal) — PRD_MERGED §6.7 + §6.8
   Upload area with a visibility selector, filters, a document
   table with per-document version history and a Publik/Internal
   toggle — the control surface governing the public Transparansi
   page — plus content & announcement management (from Source B).
   ============================================================ */
(function () {
  const state = { tab: 'dok', cat: 'Semua', vis: 'Semua', q: '', vers: null, host: null };
  /* local visibility overrides — mock only, never persisted */
  const override = {};

  const visOf = (d) => override[d.id] || d.vis;

  function list() {
    return MBG.documents.filter(d => {
      const okC = state.cat === 'Semua' || d.cat === state.cat;
      const okV = state.vis === 'Semua' || visOf(d) === state.vis;
      const okQ = !state.q || d.title.toLowerCase().indexOf(state.q) !== -1;
      return okC && okV && okQ;
    });
  }

  function docsView() {
    const items = list();
    const pub = MBG.documents.filter(d => visOf(d) === 'Publik').length;
    return `
      <div class="i-card">
        <h3>${icon('upload')} Unggah dokumen</h3>
        <div class="grid" style="grid-template-columns:1fr 240px 240px;gap:var(--sp-4);align-items:end">
          <div class="drop" style="padding:var(--sp-5)">
            ${icon('upload')}<b>Letakkan berkas di sini</b>
            <span class="sm">PDF, DOCX, atau XLSX · maksimal 25 MB</span>
          </div>
          <div>
            <label class="pick-lbl">Kategori</label>
            <select class="sel">${MBG.docCategories.map(c => `<option>${c}</option>`).join('')}</select>
          </div>
          <div>
            <label class="pick-lbl">Visibilitas</label>
            <select class="sel">
              <option>Publik — tampil di halaman transparansi</option>
              <option>Internal — hanya ruang kerja</option>
            </select>
          </div>
        </div>
      </div>

      <div class="i-card">
        <div class="flex items-center justify-between wrap gap-3" style="margin-bottom:var(--sp-4)">
          <h3 style="margin:0">${icon('file')} Daftar dokumen</h3>
          <span class="fcount"><b>${pub}</b> dari ${MBG.documents.length} tampil publik</span>
        </div>

        <div class="fbar">
          <select class="sel" id="dc" style="width:auto">
            ${['Semua'].concat(MBG.docCategories).map(c => `<option ${c === state.cat ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
          <select class="sel" id="dv" style="width:auto">
            ${['Semua', 'Publik', 'Internal'].map(v => `<option ${v === state.vis ? 'selected' : ''}>${v}</option>`).join('')}
          </select>
          <div class="grow search-box">
            ${icon('search')}
            <input type="search" id="dq" placeholder="Cari nama dokumen…" value="${state.q}" aria-label="Cari dokumen">
          </div>
          <span class="fcount"><b>${items.length}</b> hasil</span>
        </div>

        <div class="dt-wrap">
          <table class="dt">
            <thead><tr>
              <th>Dokumen</th><th>Kategori</th><th>Versi</th><th>Diunggah oleh</th>
              <th>Diperbarui</th><th class="num">Ukuran</th><th>Visibilitas</th><th></th>
            </tr></thead>
            <tbody>
              ${items.length ? items.map(d => {
                const v = visOf(d);
                return `<tr>
                  <td class="strong">${d.title}<div class="sm">${d.desc}</div></td>
                  <td class="sm">${d.cat}</td>
                  <td class="sm mono">${d.version}</td>
                  <td class="sm">${d.by}</td>
                  <td class="sm mono">${MBG.fmtDate(d.updated)}</td>
                  <td class="num sm">${d.size}</td>
                  <td>
                    <button class="btn btn-ghost btn-sm js-vis" data-id="${d.id}">
                      <span class="tag-s ${v === 'Publik' ? 'bg-success' : 'bg-warning'}">${v}</span>
                    </button>
                  </td>
                  <td><button class="btn btn-ghost btn-sm js-ver" data-id="${d.id}">${icon('history')} Versi</button></td>
                </tr>
                ${state.vers === d.id ? `<tr><td colspan="8" style="background:var(--surface-2)">
                  <b class="text-sm">Riwayat versi — ${d.title}</b>
                  <div class="kv-list" style="margin-top:.5rem">
                    ${d.versions.map(x => `<div class="kv-row">
                      <span class="k mono">${x.version} · ${MBG.fmtDate(x.date)}</span>
                      <span class="v">${x.by} — ${x.note}</span>
                    </div>`).join('')}
                  </div></td></tr>` : ''}`;
              }).join('') : `<tr><td colspan="8" class="sm">Tidak ada dokumen yang cocok.</td></tr>`}
            </tbody>
          </table>
        </div>

        <div class="note" style="margin-top:var(--sp-4)">${icon('info')}
          Sakelar visibilitas di tabel ini adalah <b>satu-satunya</b> yang menentukan dokumen mana muncul di halaman Transparansi publik. Dokumen Internal tetap tercantum di sana lengkap metadatanya, tetapi tautan unduhnya ditahan.</div>
      </div>`;
  }

  function contentView() {
    return `
      <div class="i-card">
        <h3>${icon('bell')} Pengumuman</h3>
        <p class="sub">Tampil di halaman Beranda publik. Konten yang dihapus tidak lagi terlihat oleh pengguna publik; seluruh aktivitas CMS tercatat di jejak audit.</p>
        <div class="dt-wrap">
          <table class="dt">
            <thead><tr><th>Tanggal</th><th>Judul</th><th>Isi</th><th>Status</th><th></th></tr></thead>
            <tbody>
              ${MBG.announcements.map(a => `<tr>
                <td class="sm mono">${MBG.fmtDate(a.date)}</td>
                <td class="strong">${a.title}</td>
                <td class="sm">${a.body}</td>
                <td><span class="tag-s bg-success">Terbit</span></td>
                <td><div class="flex gap-2">
                  <button class="btn btn-ghost btn-sm">${icon('edit')}</button>
                  <button class="btn btn-ghost btn-sm">${icon('trash')}</button>
                </div></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="flex gap-2" style="margin-top:var(--sp-4)">
          <button class="btn btn-primary btn-sm">${icon('plus')} Pengumuman baru</button>
          <button class="btn btn-ghost btn-sm">${icon('eye')} Pratinjau sebelum terbit</button>
        </div>
      </div>

      <div class="i-card">
        <h3>${icon('image')} Galeri</h3>
        <p class="sub">Foto dokumentasi yang tampil pada profil dapur publik.</p>
        <div class="dt-wrap">
          <table class="dt">
            <thead><tr><th>Judul</th><th>Kategori</th><th>Dapur</th><th>Diunggah</th><th>Oleh</th></tr></thead>
            <tbody>
              ${MBG.activeKitchens().flatMap(k => k.gallery.map(g => `<tr>
                <td class="strong">${g.title}</td>
                <td class="sm">${g.category}</td>
                <td class="sm">${k.name}</td>
                <td class="sm mono">${MBG.fmtDate(g.uploadedAt)}</td>
                <td class="sm">${g.uploadedBy}</td>
              </tr>`)).join('')}
            </tbody>
          </table>
        </div>
        <div class="flex gap-2" style="margin-top:var(--sp-4)">
          <button class="btn btn-primary btn-sm">${icon('upload')} Unggah gambar</button>
          <span class="text-xs muted" style="align-self:center">JPG, PNG, atau MP4 · sesuai format dan batas ukuran yang disetujui.</span>
        </div>
      </div>`;
  }

  function paint() {
    const el = state.host;
    el.innerHTML = `
      <div class="chips" id="dtabs" style="margin-bottom:var(--sp-5)">
        <button class="chip ${state.tab === 'dok' ? 'active' : ''}" data-value="dok">Dokumen</button>
        <button class="chip ${state.tab === 'kon' ? 'active' : ''}" data-value="kon">Konten &amp; galeri</button>
      </div>
      <div>${state.tab === 'dok' ? docsView() : contentView()}</div>`;

    UI.bindChips(el.querySelector('#dtabs'), (v) => { state.tab = v; state.vers = null; paint(); });

    const dc = el.querySelector('#dc'), dv = el.querySelector('#dv'), dq = el.querySelector('#dq');
    if (dc) dc.addEventListener('change', (e) => { state.cat = e.target.value; paint(); });
    if (dv) dv.addEventListener('change', (e) => { state.vis = e.target.value; paint(); });
    if (dq) dq.addEventListener('input', (e) => {
      state.q = e.target.value.toLowerCase().trim();
      paint();
      const box = state.host.querySelector('#dq');
      if (box) { box.focus(); box.setSelectionRange(box.value.length, box.value.length); }
    });

    el.querySelectorAll('.js-vis').forEach(b => b.addEventListener('click', () => {
      const d = MBG.documents.find(x => x.id === b.dataset.id);
      override[d.id] = visOf(d) === 'Publik' ? 'Internal' : 'Publik';
      paint();
    }));
    el.querySelectorAll('.js-ver').forEach(b => b.addEventListener('click', () => {
      state.vers = state.vers === b.dataset.id ? null : b.dataset.id;
      paint();
    }));

    UI.observe(el);
  }

  Internal.mount({
    page: 'dokumen',
    title: 'Dokumen',
    sub: 'Kelola dokumen, konten publik, pengumuman, dan galeri. Sakelar visibilitas di sini mengatur apa yang tampil di halaman Transparansi.',
    render: (el) => { state.host = el; paint(); },
  });
})();
