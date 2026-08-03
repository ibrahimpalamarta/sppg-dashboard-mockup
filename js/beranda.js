/* ============================================================
   Beranda (public home) — PRD_MERGED §5.2
   Hero + "Porsi hari ini" + impact band + map/kitchen cards
   + announcements.
   ============================================================ */
(function () {
  const page = document.getElementById('page');
  const P = MBG.program;
  const featured = MBG.activeKitchens()[0];
  const todayMenu = featured.menus[featured.menus.length - 1];
  const ev = Nutrition.score(todayMenu, 'sd-akhir');

  function porsiCard() {
    return `<div class="porsi reveal">
      <div class="porsi-hd">
        <span class="e">Porsi hari ini</span>
        <h3>${featured.name}</h3>
        <div class="d">${MBG.fmtDate(todayMenu.date, 'long')}</div>
      </div>
      <div class="porsi-items">
        ${todayMenu.components.map(c => `<div class="porsi-item">
          <div><div class="n">${c.name}</div><div class="c">${c.katLabel}</div></div>
          <div class="g">${MBG.fmt(c.gram)} gram</div>
        </div>`).join('')}
      </div>
      <div class="porsi-score">
        <div class="top">
          <div>
            <div class="lbl">Skor kecukupan gizi · ${ev.segment.label} (${ev.segment.sub})</div>
            <div class="val">${ev.overall}<span style="font-size:1rem;font-weight:500">%</span></div>
          </div>
          <span class="tag-s bg-${ev.band.tone}">${ev.band.label}</span>
        </div>
        <div class="score-bar"><i style="width:${ev.overall}%"></i></div>
      </div>
      <div class="porsi-foot">
        <div class="prov">
          <div class="pr"><span class="k">${icon('clock')} Dicatat</span><span>${todayMenu.lockedAt}</span></div>
          <div class="pr"><span class="k">${icon('users')} Penanggung jawab</span><span>${todayMenu.lockedBy}</span></div>
          <div class="pr"><span class="k">${icon('fingerprint')} Sidik isi</span><span class="hash">${todayMenu.hash.slice(0, 10)}…</span></div>
          <div class="prov-lock">${icon('lock')} Catatan terkunci — tidak dapat diubah, koreksi tercatat terpisah.</div>
        </div>
        <div class="porsi-cta">
          <a class="btn btn-primary btn-sm" href="menu.html">${icon('chart')} Rincian sembilan zat gizi</a>
          <a class="btn btn-ghost btn-sm" href="transparansi.html">${icon('history')} Buka jejak audit</a>
        </div>
      </div>
    </div>`;
  }

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
        <div><div class="n">${active ? MBG.fmt(k.pm) : '—'}</div><div class="l">Penerima / hari</div></div>
        <div><div class="n">${active ? k.schoolCount : '—'}</div><div class="l">Sekolah</div></div>
      </div>
      <div class="acts">
        <a class="btn btn-ghost btn-sm" href="dapur-detail.html?k=${k.slug}">Lihat profil dapur</a>
        <button class="btn btn-ghost btn-sm js-hl" data-slug="${k.slug}">${icon('pin')} Sorot di peta</button>
      </div>
    </div>`;
  }

  page.innerHTML = `
    <section class="b-hero">
      <div class="hero-bg" id="heroBg" aria-hidden="true">
        <video class="hero-bg-vid on" autoplay muted loop playsinline preload="auto" src="assets/video/bumper1.mp4"></video>
        <video class="hero-bg-vid" autoplay muted loop playsinline preload="auto" src="assets/video/bumper2.mp4"></video>
        <div class="hero-bg-scrim"></div>
      </div>
      <div class="container container-wide b-grid">
        <div>
          <h1>Setiap porsi tercatat, setiap angka bisa diperiksa.</h1>
          <p>Lapisan transparansi untuk jaringan dapur SPPG di bawah program Makan Bergizi Gratis. Kami membaca dan menilai data yang sudah dihasilkan dapur — bukan menggantikan cara dapur bekerja.</p>
          <div class="cta">
            <a class="btn btn-primary" href="menu.html">${icon('utensils')} Lihat menu &amp; gizi</a>
            <a class="btn btn-outline-light" href="dapur.html">${icon('map')} Jelajahi dapur</a>
          </div>
        </div>
        ${porsiCard()}
      </div>
    </section>

    <section class="section-sm" style="background:var(--bg-cream-2)">
      <div class="container container-wide">
        <div class="impact">
          <div class="it reveal"><div class="v count" data-to="${P.porsiKumulatif}">0</div><div class="l">Porsi terdistribusi</div><div class="s">kumulatif sejak dapur pertama beroperasi</div></div>
          <div class="it reveal" data-delay="70"><div class="v count" data-to="${P.pmPerDay}">0</div><div class="l">Penerima manfaat / hari</div><div class="s">dari ${MBG.fmt(P.capacityTotal)} kapasitas terpasang</div></div>
          <div class="it reveal" data-delay="140"><div class="v"><span class="count" data-to="${P.schoolsServed}">0</span> <span style="font-size:1rem;color:var(--muted)">/ ${P.schoolsRegistered}</span></div><div class="l">Sekolah terlayani</div><div class="s">dari sekolah terdaftar di wilayah</div></div>
          <div class="it reveal" data-delay="210"><div class="v count" data-to="${P.operatingDays}">0</div><div class="l">Hari operasi berturut</div><div class="s">tanpa jeda pada dapur pertama</div></div>
        </div>
        <div style="text-align:center;margin-top:var(--sp-5)">
          <a class="btn btn-ghost btn-sm" href="dampak.html">Lihat laporan dampak lengkap ${icon('arrowRight')}</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container container-wide">
        <div class="sec-hd">
          <div class="row">
            <div>
              <h2>Di mana dapurnya</h2>
              <p>${P.totalKitchens} dapur SPPG di ${P.region}. Pilih kartu untuk menyorot titiknya di peta.</p>
            </div>
            <a class="btn btn-ghost btn-sm" href="dapur.html">Daftar lengkap ${icon('arrowRight')}</a>
          </div>
        </div>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:var(--sp-5);align-items:start">
          <div class="card reveal" id="map-mount"></div>
          <div class="k-cards" id="kcards" style="grid-template-columns:1fr"></div>
        </div>
      </div>
    </section>

    <section class="section-sm" style="padding-bottom:var(--sp-8)">
      <div class="container container-wide">
        <div class="sec-hd"><h2>Pengumuman</h2></div>
        <div class="ann">
          ${MBG.announcements.map((a, i) => `<div class="ann-item reveal" data-delay="${i * 70}">
            <div class="d">${MBG.fmtDate(a.date)}</div>
            <h4>${a.title}</h4>
            <p>${a.body}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`;

  document.getElementById('kcards').innerHTML = MBG.kitchens.map(kitchenCard).join('');

  function highlight(slug) {
    document.querySelectorAll('.k-card').forEach(c => c.classList.toggle('on', c.dataset.slug === slug));
    MapView.select(slug);
  }

  MapView.render(document.getElementById('map-mount'), { onSelect: highlight });

  document.querySelectorAll('.js-hl').forEach(b => {
    b.addEventListener('click', () => {
      highlight(b.dataset.slug);
      document.getElementById('map-mount').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* hero background video: two clips crossfade so the loop point
     never shows a jump cut; disabled for prefers-reduced-motion,
     and the whole layer drops out on load failure — the existing
     gradient in .b-hero is the fallback either way. */
  (function heroVideo() {
    const bg = document.getElementById('heroBg');
    if (!bg) return;
    const vids = [...bg.querySelectorAll('.hero-bg-vid')];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bg.remove();
      return;
    }
    vids.forEach(v => v.addEventListener('error', () => bg.remove(), { once: true }));

    let i = 0;
    setInterval(() => {
      vids[i].classList.remove('on');
      i = (i + 1) % vids.length;
      vids[i].classList.add('on');
    }, 8000);
  })();

  Layout.render({ page: 'beranda' });
  UI.observe(page);
})();
