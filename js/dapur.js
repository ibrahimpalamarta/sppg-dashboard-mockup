/* ============================================================
   Dapur — kitchen list (public) — PRD_MERGED §5.3
   Map ↔ list selection is bidirectional.
   ============================================================ */
(function () {
  const page = document.getElementById('page');

  function row(k) {
    const active = k.status === 'BEROPERASI';
    return `<div class="k-row reveal" data-slug="${k.slug}">
      <div>
        <div class="hd">
          <h3 style="font-size:var(--fs-md)">${k.name}</h3>
          <span class="hash">${k.code}</span>
          <span class="badge ${active ? 'badge-aktif' : 'badge-persiapan'} badge-plain">${active ? 'Beroperasi' : 'Persiapan'}</span>
          <span class="pill">${icon('pin')} ${k.region}</span>
        </div>
        <p class="addr">${k.address}</p>
        <div class="meta">
          <div><span class="k">Penanggung jawab</span><span class="v">${k.pic}</span></div>
          <div><span class="k">Sekolah terlayani</span><span class="v">${active ? k.schoolCount : '—'}</span></div>
          <div><span class="k">${active ? 'Beroperasi sejak' : 'Rencana mulai'}</span><span class="v">${active ? k.sinceLabel : k.plannedStartLabel}</span></div>
        </div>
      </div>
      <div class="side">
        ${active ? `
          <div class="util">
            <div class="lbl"><span>Pemanfaatan kapasitas</span><b class="mono">${k.utilization}%</b></div>
            <div class="track"><i style="width:${k.utilization}%"></i></div>
            <div class="lbl" style="margin-top:.35rem"><span>${MBG.fmt(k.pm)} dari ${MBG.fmt(k.capacity)} kapasitas</span></div>
          </div>`
        : `<div class="util">
            <div class="lbl"><span>Kapasitas terpasang</span><b class="mono">${MBG.fmt(k.capacity)}</b></div>
            <div class="lbl" style="margin-top:.35rem"><span>Belum menerbitkan menu</span></div>
          </div>`}
        <div class="flex gap-2 wrap">
          <a class="btn btn-primary btn-sm" href="dapur-detail.html?k=${k.slug}">Profil lengkap</a>
          <button class="btn btn-ghost btn-sm js-hl" data-slug="${k.slug}">${icon('pin')} Sorot</button>
        </div>
      </div>
    </div>`;
  }

  page.innerHTML = `
    <div class="container container-wide page-intro">
      <h1>Dapur</h1>
      <p>Jaringan dapur SPPG di ${MBG.program.region}. Pilih satu titik pada peta untuk menyorot dapurnya, atau sebaliknya.</p>
    </div>

    <div class="container container-wide" style="padding-bottom:var(--sp-8)">
      <div class="grid" style="grid-template-columns:400px 1fr;gap:var(--sp-5);align-items:start">
        <div class="card reveal" id="map-mount" style="position:sticky;top:var(--sp-4)"></div>
        <div>
          <div class="sec-hd"><h2 style="font-size:var(--fs-xl)">Daftar dapur</h2></div>
          <div class="k-list" id="klist"></div>
        </div>
      </div>
    </div>`;

  document.getElementById('klist').innerHTML = MBG.kitchens.map(row).join('');

  function highlight(slug) {
    document.querySelectorAll('.k-row').forEach(r => r.classList.toggle('on', r.dataset.slug === slug));
    MapView.select(slug);
  }

  MapView.render(document.getElementById('map-mount'), { onSelect: highlight });

  document.querySelectorAll('.js-hl').forEach(b =>
    b.addEventListener('click', () => highlight(b.dataset.slug)));

  Layout.render({ page: 'dapur' });
  UI.observe(page);
})();
