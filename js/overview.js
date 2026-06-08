/* ============================================================
   MBG Dashboard — Internal multi-kitchen monitor (/overview)
   Internal-only: gated for public role.
   ============================================================ */
(function () {
  Layout.render({ page: 'overview' });
  const page = document.getElementById('page');

  function gate() {
    page.innerHTML = `
      <div class="gate card">
        <div class="g-ic">${icon('lock')}</div>
        <h2>Halaman internal</h2>
        <p class="muted" style="margin-top:.6rem">Monitor multi-dapur hanya tersedia untuk peran internal. Beralih peran melalui pemilih peran di kanan atas (mis. <b>MBG Program Head</b>) untuk membuka halaman ini.</p>
        <button class="btn btn-purple" style="margin-top:1.5rem" id="gate-switch">${icon('eye')} Beralih ke peran internal</button>
      </div>`;
    document.getElementById('gate-switch').onclick = () => Role.set('program');
  }

  function render() {
    const n = MBG.national;
    const totalPorsiToday = MBG.units.filter(u => u.status === 'AKTIF').reduce((s, u) => s + u.stats.porsiHariIni, 0);

    const kpis = [
      { v: 6, l: 'Total Dapur' },
      { v: '4 / 2', l: 'Aktif / Persiapan' },
      { v: UI.fmt(n.pmPerDay) + '+', l: 'Total PM / hari', accent: true },
      { v: UI.fmt(n.porsiKumulatif), l: 'Total Porsi Kumulatif' },
      { v: n.schoolsServed, l: 'Total Sekolah' },
    ];

    const statusCards = MBG.units.map(u => {
      const active = u.status === 'AKTIF';
      return `<a class="status-card" href="unit.html?u=${u.slug}">
        <span class="sc-dot" style="background:${active ? 'var(--success)' : 'var(--warning)'}"></span>
        <div>
          <div class="sc-name">${u.name} <span class="badge ${active ? 'badge-aktif' : 'badge-persiapan'} badge-plain" style="font-size:.6rem;padding:.1rem .45rem">${u.status}</span></div>
          <div class="sc-meta">
            <span>Porsi: <span class="num">${active ? UI.fmt(u.stats.porsiHariIni) : '—'}</span></span>
            <span>PM: <span class="num">${active ? UI.fmt(u.stats.pmHarian) : '—'}</span></span>
            <span>${u.area}</span>
          </div>
        </div>
        <span class="sc-go">${icon('arrowRight')}</span>
      </a>`;
    }).join('');

    const tableRows = MBG.units.map(u => {
      const active = u.status === 'AKTIF';
      return `<tr>
        <td class="cell-strong">${u.name}</td>
        <td><span class="badge ${active ? 'badge-aktif' : 'badge-persiapan'} badge-plain" style="font-size:.6rem">${u.status}</span></td>
        <td>${u.area}, ${u.province}</td>
        <td class="num">${active ? UI.fmt(u.stats.porsiHariIni) : '—'}</td>
        <td class="num">${active ? UI.fmt(u.stats.pmHarian) : '—'}</td>
        <td class="num">${active ? u.stats.sekolah : '—'}</td>
        <td><a class="go" style="color:var(--brand-purple);font-weight:600;font-size:var(--fs-xs)" href="unit.html?u=${u.slug}">Buka ${icon('arrowRight')}</a></td>
      </tr>`;
    }).join('');

    page.innerHTML = `
      <section class="page-hd">
        <div class="container container-wide">
          <div class="ph-row">
            <div>
              <span class="eyebrow on-dark">Monitor Internal</span>
              <h1>Pemantauan Jaringan Dapur SPPG</h1>
              <p class="ph-sub">Status dan kinerja agregat seluruh unit secara nasional.</p>
            </div>
            <div class="updated">${icon('refresh')} Terakhir diperbarui: ${n.updatedAt}</div>
          </div>
        </div>
      </section>

      <div class="container container-wide section">
        <div class="kpi-row">${kpis.map(k => `
          <div class="kpi ${k.accent ? 'accent' : ''} reveal"><div class="kv">${k.v}</div><div class="kl">${k.l}</div></div>`).join('')}</div>

        <div class="monitor-grid" style="margin-top:2rem">
          <div class="card map-card reveal">
            <div class="flex items-center justify-between" style="margin-bottom:.5rem">
              <h3 style="font-size:var(--fs-lg);padding:.4rem">Sebaran Dapur</h3>
              <span class="text-xs muted" style="padding:.4rem">Jawa Timur · Sumatera Utara</span>
            </div>
            <div id="map-mount"></div>
            <div class="map-legend">
              <span class="ml"><span class="d" style="background:var(--success)"></span> Aktif (4)</span>
              <span class="ml"><span class="d" style="background:var(--warning)"></span> Persiapan (2)</span>
              <span class="ml muted">Klik atau arahkan kursor ke pin untuk detail</span>
            </div>
          </div>
          <div>
            <h3 style="font-size:var(--fs-lg);margin-bottom:1rem">Status per Dapur</h3>
            <div class="status-list">${statusCards}</div>
          </div>
        </div>

        <div class="block reveal">
          <div class="block-head"><h3 style="font-size:var(--fs-lg)">Tabel Konsolidasi</h3>
            <span class="updated" style="background:var(--brand-lilac-2);color:var(--brand-purple);border-color:var(--border-2)">${icon('refresh')} ${n.updatedAt}</span></div>
          <div class="table-wrap"><table class="data"><thead><tr>
            <th>Dapur</th><th>Status</th><th>Wilayah</th><th class="num">Porsi Hari Ini</th><th class="num">PM/hari</th><th class="num">Sekolah</th><th></th>
          </tr></thead><tbody>${tableRows}</tbody></table></div>
        </div>

        <div class="note" style="margin-top:1.5rem">${icon('info')} Data bersifat <b>upload-driven</b>: nilai diperbarui saat staf mengunggah formulir harian melalui halaman <a href="unggah.html" style="color:var(--brand-purple);font-weight:600">Unggah Data</a>, bukan secara real-time.</div>
      </div>`;

    MapView.render(document.getElementById('map-mount'));
    UI.observe(page);
  }

  function route() { if (Role.isInternal()) render(); else gate(); }
  Role.onChange(route);
  route();
})();
