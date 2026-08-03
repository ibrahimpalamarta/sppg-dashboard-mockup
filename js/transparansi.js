/* ============================================================
   Transparansi (public) — PRD_MERGED §5.6
   Document library with category filters + name search.
   Internal documents stay listed with full metadata but their
   download link is withheld.
   ============================================================ */
(function () {
  const page = document.getElementById('page');
  const state = { cat: 'Semua', q: '' };

  const PRINCIPLES = [
    { ic: 'upload',      t: 'Data mentah bisa ditelusuri', d: 'Setiap angka dapat dirunut ke berkas sumbernya, lengkap dengan siapa yang mengunggah dan kapan.' },
    { ic: 'lock',        t: 'Catatan terkunci, koreksi ditambahkan', d: 'Catatan yang sudah dikunci tidak pernah ditimpa. Koreksi dicatat sebagai entri baru yang menunjuk aslinya.' },
    { ic: 'history',     t: 'Dokumen berversi', d: 'Setiap dokumen menyimpan riwayat versi, sehingga perubahan isi selalu dapat dibandingkan.' },
    { ic: 'fingerprint', t: 'Sumber data selalu dinyatakan', d: 'Setiap angka menyebut asalnya — unggahan berkas, input manual, atau sistem mitra. Tidak pernah disamarkan sebagai "data sistem".' },
  ];

  function card(d) {
    const pub = d.vis === 'Publik';
    return `<div class="doc reveal">
      <div class="top">
        <span class="pill">${icon('file')} ${d.cat}</span>
        <span class="tag-s ${pub ? 'bg-success' : 'bg-warning'}">${d.vis}</span>
      </div>
      <h3>${d.title}</h3>
      <p class="desc">${d.desc}</p>
      <div class="meta">
        <span>${d.version}</span>
        <span>${MBG.fmtDate(d.updated)}</span>
        <span>${d.size}</span>
        <span>${d.type}</span>
      </div>
      <div class="act">
        ${pub
          ? `<button class="btn btn-ghost btn-sm">${icon('download')} Unduh dokumen</button>`
          : `<span class="doc-withheld">${icon('lock')} Tautan unduh ditahan — hanya dapat dibuka dari ruang kerja internal oleh pengguna berwenang.</span>`}
      </div>
    </div>`;
  }

  function list() {
    return MBG.documents.filter(d => {
      const okCat = state.cat === 'Semua' || d.cat === state.cat;
      const okQ = !state.q || d.title.toLowerCase().indexOf(state.q) !== -1;
      return okCat && okQ;
    });
  }

  function paint() {
    const items = list();
    document.getElementById('dcount').innerHTML =
      `<b>${items.length}</b> dari ${MBG.documents.length} dokumen`;
    document.getElementById('dgrid').innerHTML = items.length
      ? items.map(card).join('')
      : `<p class="muted">Tidak ada dokumen yang cocok.</p>`;
    UI.observe(document.getElementById('dgrid'));
  }

  page.innerHTML = `
    <div class="container container-wide page-intro">
      <h1>Transparansi</h1>
      <p>Pustaka dokumen program — SOP, sertifikat, laporan, panduan, dan kebijakan. Dokumen bertanda Internal tetap tercantum lengkap metadatanya, tetapi tautan unduhnya ditahan.</p>
    </div>

    <div class="container container-wide" style="padding-bottom:var(--sp-8)">
      <div class="fbar">
        <div class="chips" id="cchips">
          ${['Semua'].concat(MBG.docCategories).map(c =>
            `<button class="chip ${c === 'Semua' ? 'active' : ''}" data-value="${c}">${c}</button>`).join('')}
        </div>
        <div class="grow search-box">
          ${icon('search')}
          <input type="search" id="dq" placeholder="Cari nama dokumen…" aria-label="Cari dokumen">
        </div>
        <span class="fcount" id="dcount"></span>
      </div>

      <div class="doc-grid" id="dgrid"></div>

      <div class="sec-hd" style="margin-top:var(--sp-8)">
        <h2>Prinsip keterbukaan</h2>
        <p>Empat komitmen yang menentukan cara data pada dashboard ini diperlakukan.</p>
      </div>
      <div class="principles">
        ${PRINCIPLES.map((p, i) => `<div class="principle reveal" data-delay="${i * 70}">
          ${icon(p.ic)}<h4>${p.t}</h4><p>${p.d}</p>
        </div>`).join('')}
      </div>
    </div>`;

  UI.bindChips(document.getElementById('cchips'), (v) => { state.cat = v; paint(); });
  document.getElementById('dq').addEventListener('input', (e) => {
    state.q = e.target.value.toLowerCase().trim();
    paint();
  });

  paint();
  Layout.render({ page: 'transparansi' });
  UI.observe(page);
})();
