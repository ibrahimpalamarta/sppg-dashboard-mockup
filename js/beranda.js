/* ============================================================
   MBG Dashboard — Beranda (home) renderer
   ============================================================ */
(function () {
  const n = MBG.national;

  Layout.render({ page: 'beranda' });

  // hero badges
  document.getElementById('hero-badges').innerHTML = [
    [icon('shield'), 'Tersertifikasi SLHS · Halal · HACCP'],
    [icon('refresh'), 'Data diperbarui harian'],
  ].map(([ic, t]) => `<span class="hb">${ic}${t}</span>`).join('');

  // impact band
  const stats = [
    { to: 6, label: 'Dapur SPPG' },
    { to: n.pmPerDay, label: 'Penerima manfaat / hari', suffix: '+' },
    { to: 9, label: 'Sekolah / unit aktif', suffix: '+' },
    { to: 2, label: 'Provinsi' },
    { to: n.porsiKumulatif, label: 'Total porsi kumulatif' },
  ];
  document.getElementById('impact-grid').innerHTML = stats.map(s => `
    <div class="impact-stat reveal">
      <div class="iv count" data-to="${s.to}" data-suffix="${s.suffix || ''}">0</div>
      <div class="il">${s.label}</div>
    </div>`).join('');

  // narrative flow
  const flow = [
    { icon: 'utensils', title: 'Dapur MBG beroperasi', text: 'Produksi makan bergizi harian dengan standar mutu & higiene.', stat: '3.992+ porsi/hari' },
    { icon: 'coins', title: 'Pendanaan & surplus', text: 'Skema Rp 13.000/pax + insentif harian menutup biaya operasi.', stat: 'Rp 36 jt/hari' },
    { icon: 'seedling', title: 'Surplus dialokasikan', text: 'Margin operasi disisihkan untuk program gizi wilayah.', stat: 'Rp 248 jt' },
    { icon: 'heart', title: 'Mendanai ZeroStunting', text: 'Intervensi penurunan stunting di Malang & Simalungun.', stat: '2 wilayah' },
  ];
  document.getElementById('flow').innerHTML = flow.map((f, i) => `
    <div class="flow-step reveal" data-delay="${i * 90}">
      <div class="fi">${icon(f.icon)}</div>
      <span class="fnum">0${i + 1}</span>
      <h4>${f.title}</h4>
      <p>${f.text}</p>
      <div class="fstat">${f.stat}</div>
      ${i < flow.length - 1 ? `<span class="flow-arrow">${icon('arrowRight')}</span>` : ''}
    </div>`).join('');

  // unit grid
  document.getElementById('unit-grid').innerHTML = MBG.units.map((u, i) => {
    const active = u.status === 'AKTIF';
    const badge = active ? 'badge-aktif' : 'badge-persiapan';
    return `
    <a href="unit.html?u=${u.slug}" class="card card-lift unit-card reveal ${active ? '' : 'prep'}" data-delay="${i * 60}">
      <div class="uc-top">
        <div class="uc-row">
          <div>
            <h3>${u.name}</h3>
            <div class="uc-area">${icon('pin')} ${u.area}, ${u.province}</div>
          </div>
          <span class="badge ${badge}">${u.status}</span>
        </div>
      </div>
      <div class="uc-stats">
        <div class="uc-stat"><div class="v">${active ? UI.fmt(u.stats.pmHarian) : '—'}</div><div class="l">PM / hari</div></div>
        <div class="uc-stat"><div class="v">${active ? u.stats.sekolah : '—'}</div><div class="l">Sekolah</div></div>
        <div class="uc-stat"><div class="v">${active ? u.stats.staf : '—'}</div><div class="l">Staf</div></div>
      </div>
      <div class="uc-foot">
        <span class="text-xs muted">${active ? 'Beroperasi sejak ' + u.operatingSince : 'Tahap persiapan'}</span>
        <span class="go">Buka dashboard ${icon('arrowRight')}</span>
      </div>
    </a>`;
  }).join('');

  // partners
  const colors = ['#5B3E8E', '#2F8A5B', '#2F6F8A', '#C7472B', '#ED8B2C', '#7C5CB8'];
  document.getElementById('partners').innerHTML = MBG.partners.map((p, i) => `
    <span class="logo-chip"><span class="lc-mark" style="background:${colors[i % colors.length]}">${(p.short || p.name)[0]}</span>${p.name}</span>`).join('');

  UI.observe();
})();
