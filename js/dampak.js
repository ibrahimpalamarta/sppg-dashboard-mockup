/* ============================================================
   Dampak (public) — the full impact story
   Restores the "Impact" narrative from the original prototype
   (overview.html / early beranda.js), rebuilt on today's data
   model (3-kitchen Malang Raya footprint, C-01) and styling.
   Every figure is derived from MBG.program / MBG.kitchens —
   never hand-typed — so it can never drift from Beranda,
   Dapur, or Menu & Gizi. The old "surplus/margin" funding
   narrative is replaced with an operational-integrity chain,
   since expenditure figures stay non-P&L (C-05): no revenue,
   margin, or profit anywhere on this page.
   ============================================================ */
(function () {
  const page = document.getElementById('page');
  const P = MBG.program;
  const activeK = MBG.activeKitchens();
  const featured = activeK[0];
  const seg = Nutrition.segmentById(Nutrition.DEFAULT_SEGMENT);

  const avgOverall = Math.round(
    activeK.reduce((s, k) => s + Nutrition.averageFor(k, seg.id), 0) / activeK.length
  );

  const stats = [
    { to: P.operating, label: `Dapur beroperasi dari ${P.totalKitchens}` },
    { to: P.pmPerDay, label: 'Penerima manfaat / hari', suffix: '+' },
    { to: P.schoolsServed, label: 'Sekolah terlayani' },
    { to: P.porsiKumulatif, label: 'Total porsi kumulatif' },
    { to: P.operatingDays, label: 'Hari operasi berturut' },
  ];

  const flow = [
    { ic: 'utensils', title: 'Dapur SPPG memasak',
      text: 'Produksi porsi harian dengan standar mutu, higiene, dan sertifikasi resmi di tiap dapur.',
      stat: `${MBG.fmt(P.pmPerDay)}+ porsi/hari` },
    { ic: 'chart', title: 'Tiap porsi dinilai gizinya',
      text: 'Skor kecukupan dihitung per zat gizi terhadap AKG — tiap zat dibatasi maksimum 100% agar kelebihan tak menutupi kekurangan.',
      stat: `${avgOverall}% skor rata-rata` },
    { ic: 'truck', title: 'Didistribusikan ke sekolah',
      text: 'Porsi diantar setiap hari sekolah ke seluruh sekolah terdaftar di wilayah operasi dapur.',
      stat: `${P.schoolsServed} sekolah` },
    { ic: 'fingerprint', title: 'Tercatat dan bisa diperiksa',
      text: 'Setiap catatan menyimpan waktu, penanggung jawab, dan sidik isi — koreksi ditambahkan, tak pernah menimpa yang asli.',
      stat: `${MBG.auditTrail.length} entri jejak audit` },
  ];

  const partners = [
    { name: 'Edufarmers', short: 'EF', color: 'var(--viz-1)' },
    { name: 'Badan Gizi Nasional', short: 'BGN', color: 'var(--viz-2)' },
    { name: 'World Food Programme', short: 'WFP', color: 'var(--viz-3)' },
    { name: 'Muhammadiyah', short: 'MU', color: 'var(--viz-4)' },
    { name: 'Japfa', short: 'JP', color: 'var(--viz-5)' },
    { name: 'Google.org', short: 'G', color: 'var(--viz-6)' },
  ];

  function kitchenCard(k) {
    const active = k.status === 'BEROPERASI';
    return `<div class="k-card reveal" data-slug="${k.slug}">
      <div class="top">
        <div>
          <h3>${k.name}</h3>
          <div class="code">${k.code}</div>
        </div>
        <span class="badge ${active ? 'badge-aktif' : 'badge-persiapan'} badge-plain">${active ? 'Beroperasi' : 'Persiapan'}</span>
      </div>
      <div class="reg">${icon('pin')} ${k.region}</div>
      <div class="nums">
        <div><div class="n">${active ? MBG.fmt(k.porsiKumulatif) : '—'}</div><div class="l">Porsi kumulatif</div></div>
        <div><div class="n">${active ? k.operatingDays : '—'}</div><div class="l">Hari operasi</div></div>
      </div>
      ${active ? `
        <div class="util">
          <div class="lbl"><span>Pemanfaatan kapasitas</span><b class="mono">${k.utilization}%</b></div>
          <div class="track"><i style="width:${k.utilization}%"></i></div>
        </div>` : `
        <div class="util">
          <div class="lbl"><span>Kapasitas terpasang</span><b class="mono">${MBG.fmt(k.capacity)}</b></div>
          <div class="lbl" style="margin-top:.35rem"><span>Rencana mulai ${k.plannedStartLabel}</span></div>
        </div>`}
      <div class="acts">
        <a class="btn btn-ghost btn-sm" href="dapur-detail.html?k=${k.slug}">Profil dapur</a>
      </div>
    </div>`;
  }

  function scoreRow(k) {
    const s = Nutrition.averageFor(k, seg.id);
    const b = Nutrition.band(s);
    return `<div class="reveal" style="margin-bottom:var(--sp-4)">
      <div class="flex items-center justify-between" style="margin-bottom:.35rem">
        <span style="font-weight:600;font-size:var(--fs-sm)">${k.name}</span>
        <span class="tag-s bg-${b.tone}">${s}% · ${b.label}</span>
      </div>
      <div class="score-bar"><i style="width:${s}%"></i></div>
    </div>`;
  }

  function trendChart() {
    const h = Nutrition.history(featured, seg.id, 14);
    return Charts.line([{ points: h.map(x => x.value), color: 'var(--brand-purple)' }], {
      labels: h.map(x => x.label), width: 900, height: 240,
      min: 0, max: 110, threshold: MBG.akg.bands.cukup,
      aria: 'Tren skor kecukupan gizi 14 hari terakhir',
    });
  }

  page.innerHTML = `
    <div class="container container-wide page-intro">
      <h1>Dampak</h1>
      <p>Angka operasional dan gizi dari jaringan dapur SPPG ${P.region} — dihitung dari catatan terkunci yang sama dengan yang tampil di Menu &amp; Gizi dan Transparansi, bukan laporan yang disusun terpisah. Per ${P.asOf}.</p>
    </div>

    <section class="impact-band section-sm">
      <div class="container container-wide">
        <div class="impact-grid">
          ${stats.map(s => `<div class="impact-stat reveal">
            <div class="iv count" data-to="${s.to}" data-suffix="${s.suffix || ''}">0</div>
            <div class="il">${s.label}</div>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container container-wide">
        <div class="narrative reveal">
          <div class="nhead">
            <span class="eyebrow on-dark">Bagaimana dampak ini terbentuk</span>
            <h2>Dari dapur ke bukti yang bisa diperiksa</h2>
            <p>Empat langkah yang sama untuk setiap porsi, di setiap dapur — bukan ringkasan dampak yang disusun terpisah dari operasional harian.</p>
          </div>
          <div class="flow">
            ${flow.map((f, i) => `<div class="flow-step reveal" data-delay="${i * 90}">
              <div class="fi">${icon(f.ic)}</div>
              <span class="fnum">0${i + 1}</span>
              <h4>${f.title}</h4>
              <p>${f.text}</p>
              <div class="fstat">${f.stat}</div>
              ${i < flow.length - 1 ? `<span class="flow-arrow">${icon('arrowRight')}</span>` : ''}
            </div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container container-wide">
        <div class="sec-hd">
          <div class="row">
            <div>
              <h2>Dampak per dapur</h2>
              <p>Tiga dapur SPPG di ${P.region}. Dapur dalam tahap persiapan belum menerbitkan menu, sehingga belum punya skor.</p>
            </div>
            <a class="btn btn-ghost btn-sm" href="dapur.html">Profil lengkap ${icon('arrowRight')}</a>
          </div>
        </div>
        <div class="k-cards">${MBG.kitchens.map(kitchenCard).join('')}</div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container container-wide">
        <div class="sec-hd">
          <h2>Dampak gizi</h2>
          <p>Skor kecukupan gizi rata-rata per dapur untuk segmen ${seg.label.toLowerCase()} (${seg.sub}), dan tren 14 hari terakhir di ${featured.name}.</p>
        </div>
        <div class="grid" style="grid-template-columns:0.85fr 1.15fr;gap:var(--sp-5);align-items:start">
          <div class="card reveal" style="padding:var(--sp-5)">
            <h3 style="font-size:var(--fs-md);margin-bottom:var(--sp-4)">Rata-rata per dapur</h3>
            ${activeK.map(scoreRow).join('')}
            <a class="btn btn-ghost btn-sm" href="menu.html" style="margin-top:.5rem">${icon('chart')} Rincian sembilan zat gizi</a>
          </div>
          <div class="card reveal" data-delay="80" style="padding:var(--sp-5)">
            <div class="flex items-center justify-between wrap gap-3" style="margin-bottom:var(--sp-4)">
              <h3 style="font-size:var(--fs-md)">Tren 14 hari terakhir</h3>
              <span class="pill">n = ${Nutrition.history(featured, seg.id, 14).length} hari</span>
            </div>
            ${trendChart()}
          </div>
        </div>
      </div>
    </section>

    <section class="section-sm" style="padding-bottom:var(--sp-8)">
      <div class="container container-wide">
        <p class="text-center eyebrow muted" style="margin-bottom:1.5rem">Mitra program</p>
        <div class="partners">
          ${partners.map(p => `<span class="logo-chip"><span class="lc-mark" style="background:${p.color}">${p.short[0]}</span>${p.name}</span>`).join('')}
        </div>
      </div>
    </section>

    <div class="container container-wide" style="padding-bottom:var(--sp-8)">
      <div class="card reveal" style="padding:var(--sp-6);text-align:center">
        <h3 style="font-size:var(--fs-lg)">Periksa sendiri</h3>
        <p class="muted text-sm" style="max-width:52ch;margin:.5rem auto var(--sp-5)">Tidak ada angka pada halaman ini yang tak bisa ditelusuri ke catatan sumbernya.</p>
        <div class="flex gap-2 justify-between" style="justify-content:center;flex-wrap:wrap">
          <a class="btn btn-primary btn-sm" href="menu.html">${icon('chart')} Menu &amp; gizi</a>
          <a class="btn btn-ghost btn-sm" href="dapur.html">${icon('map')} Daftar dapur</a>
          <a class="btn btn-ghost btn-sm" href="transparansi.html">${icon('file')} Pustaka dokumen</a>
        </div>
      </div>
    </div>`;

  Layout.render({ page: 'dampak' });
  UI.observe(page);
})();
