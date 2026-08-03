/* ============================================================
   Kitchen detail (public) — PRD_MERGED §5.4
   Identity · summary · certifications · recent menus ·
   documentation gallery · transparency trail.
   NOTE: no kitchen-camera panel — CCTV is out of scope (C-04).
   ============================================================ */
(function () {
  const page = document.getElementById('page');
  const slug = new URLSearchParams(location.search).get('k') || MBG.kitchens[0].slug;
  const k = MBG.kitchenBySlug(slug) || MBG.kitchens[0];
  const active = k.status === 'BEROPERASI';
  const SEG = 'sd-akhir';

  function emptyState(title, text) {
    return `<div class="card" style="text-align:center;padding:var(--sp-7)">
      <div style="display:grid;place-items:center;width:46px;height:46px;margin:0 auto var(--sp-3);border-radius:50%;background:var(--warning-bg);color:var(--warning)">${icon('clock')}</div>
      <h3 style="font-size:var(--fs-md)">${title}</h3>
      <p class="muted text-sm" style="margin-top:.4rem;max-width:44ch;margin-inline:auto">${text}</p>
    </div>`;
  }

  function certs() {
    if (!active) return emptyState('Sertifikasi belum terbit', 'Dokumen perizinan diterbitkan setelah dapur lulus verifikasi dan mulai beroperasi.');
    return `<div class="stack">${k.certs.map(c => `
      <div class="kv-list" style="padding:var(--sp-4);border:1px solid var(--border);border-radius:var(--r-md);background:var(--surface)">
        <div class="flex items-center justify-between" style="margin-bottom:.5rem">
          <b style="font-size:var(--fs-sm)">${c.name}</b>
          <span class="tag-s bg-success">${c.status}</span>
        </div>
        <div class="kv-row"><span class="k">Penerbit</span><span class="v">${c.issuer}</span></div>
        <div class="kv-row"><span class="k">Nomor</span><span class="v mono" style="font-size:var(--fs-xs)">${c.number}</span></div>
        <div class="kv-row"><span class="k">Berlaku sampai</span><span class="v">${c.validUntil}</span></div>
      </div>`).join('')}</div>`;
  }

  function recentMenus() {
    if (!active) return emptyState('Belum ada menu terkunci', 'Menu mulai diterbitkan setelah dapur beroperasi dan catatan hariannya dikunci.');
    return `<div class="mini-menu">${k.menus.slice(-4).reverse().map(m => {
      const ev = Nutrition.score(m, SEG);
      return `<div class="mmi">
        <div class="d">${MBG.fmtDate(m.date, 'long')}</div>
        <div class="chips2">${m.components.map(c => `<span>${c.name}</span>`).join('')}</div>
        <div class="ft">
          <span>${MBG.fmt(Math.round(m.total.energi))} kkal / porsi</span>
          <span class="flex items-center gap-2">
            <b class="mono">${ev.overall}%</b>
            <span class="tag-s bg-${ev.band.tone}">${ev.band.label}</span>
          </span>
        </div>
      </div>`;
    }).join('')}
    <p class="text-xs muted">Skor dinilai untuk segmen ${Nutrition.segmentById(SEG).label} (${Nutrition.segmentById(SEG).sub}).</p>
    </div>`;
  }

  function gallery() {
    if (!active) return emptyState('Dokumentasi belum tersedia', 'Foto bangunan, area masak, dan distribusi diunggah setelah dapur beroperasi.');
    return `<div class="gal-grid">
      ${k.gallery.map((g, i) => `<div class="gal-item" data-i="${i}">
        ${UI.img(g.src, g.title, 'gallery')}
        <div class="cap">${g.title}</div>
      </div>`).join('')}
      <div class="upload-slot">${icon('upload')}<b style="color:var(--ink);font-size:var(--fs-sm)">Unggah foto atau video</b>
        <span>JPG, PNG, atau MP4 — oleh supervisor dapur</span></div>
    </div>`;
  }

  function trail() {
    if (!active) return '';
    const m = k.menus[k.menus.length - 1];
    return `<div class="i-card" style="margin:0">
      <h3>${icon('fingerprint')} Jejak keterbukaan</h3>
      <p class="sub">Setiap catatan harian dikunci dengan waktu, penanggung jawab, sumber data, dan sidik isi. Bila satu angka berubah, sidik isinya ikut berubah.</p>
      <div class="prov">
        <div class="pr"><span class="k">${icon('file')} Catatan</span><span>Menu ${MBG.fmtDate(m.date)}</span></div>
        <div class="pr"><span class="k">${icon('clock')} Waktu kunci</span><span>${m.lockedAt}</span></div>
        <div class="pr"><span class="k">${icon('users')} Dicatat oleh</span><span>${m.lockedBy}</span></div>
        <div class="pr"><span class="k">${icon('upload')} Sumber data</span><span>${m.source}</span></div>
        <div class="pr"><span class="k">${icon('fingerprint')} Sidik isi</span><span class="hash">${m.hash}</span></div>
        <div class="prov-lock">${icon('lock')} Catatan tidak dapat ditimpa. Koreksi dicatat sebagai entri baru yang menunjuk catatan asli.</div>
      </div>
    </div>`;
  }

  page.innerHTML = `
    <section class="kd-hd">
      <div class="container container-wide">
        <a class="btn btn-outline-light btn-sm" href="dapur.html" style="margin-bottom:var(--sp-4)">${icon('arrowLeft')} Semua dapur</a>
        <div class="flex items-center gap-3 wrap">
          <h1>${k.name}</h1>
          <span class="code">${k.code}</span>
          <span class="badge ${active ? 'badge-aktif' : 'badge-persiapan'} badge-plain">${active ? 'Beroperasi' : 'Persiapan'}</span>
        </div>
        <p class="addr">${k.address}</p>
      </div>
    </section>

    <div class="container container-wide section">
      <div class="kd-cols">
        <div class="stack-lg">
          <div class="i-card" style="margin:0">
            <h3>${icon('chart')} Ringkasan</h3>
            <div class="impact" style="grid-template-columns:repeat(4,1fr)">
              <div class="it"><div class="v">${active ? MBG.fmt(k.pm) : '—'}</div><div class="l">Penerima / hari</div></div>
              <div class="it"><div class="v">${active ? k.schoolCount : '—'}</div><div class="l">Sekolah</div></div>
              <div class="it"><div class="v">${MBG.fmt(k.capacity)}</div><div class="l">Kapasitas / hari</div></div>
              <div class="it"><div class="v">${active ? k.utilization + '%' : '—'}</div><div class="l">Pemanfaatan</div></div>
            </div>
          </div>

          <div class="i-card" style="margin:0">
            <h3>${icon('image')} Dokumentasi</h3>
            <p class="sub">Foto bangunan, area masak, dan distribusi. Gambar bersifat ilustratif untuk purwarupa.</p>
            ${gallery()}
          </div>

          ${trail()}
        </div>

        <div class="stack-lg">
          <div class="i-card" style="margin:0">
            <h3>${icon('building')} Identitas</h3>
            <div class="kv-list">
              <div class="kv-row"><span class="k">Wilayah</span><span class="v">${k.district}, ${k.region}</span></div>
              <div class="kv-row"><span class="k">Provinsi</span><span class="v">${k.province}</span></div>
              <div class="kv-row"><span class="k">Penanggung jawab</span><span class="v">${k.pic}</span></div>
              <div class="kv-row"><span class="k">${active ? 'Beroperasi sejak' : 'Rencana mulai'}</span><span class="v">${active ? k.sinceLabel : k.plannedStartLabel}</span></div>
            </div>
          </div>

          <div class="i-card" style="margin:0">
            <h3>${icon('shield')} Sertifikasi &amp; perizinan</h3>
            ${certs()}
          </div>

          <div class="i-card" style="margin:0">
            <h3>${icon('utensils')} Menu terkini</h3>
            ${recentMenus()}
          </div>
        </div>
      </div>
    </div>`;

  /* gallery lightbox */
  if (active) {
    const items = k.gallery.map(g => ({ src: g.src, caption: g.caption }));
    document.querySelectorAll('.gal-item').forEach(el =>
      el.addEventListener('click', () => UI.openLightbox(items, parseInt(el.dataset.i, 10))));
  }

  document.title = `${k.name} — MBG Dashboard`;
  Layout.render({ page: 'dapur' });
  UI.observe(page);
})();
