/* ============================================================
   Menu & Gizi (public) — PRD_MERGED §5.5
   Kitchen selector · locked-menu date selector · menu breakdown ·
   six-segment selector · adequacy score · nine-nutrient breakdown ·
   adequacy history · data-source note.
   Selecting a segment recomputes EVERYTHING below it.
   ============================================================ */
(function () {
  const page = document.getElementById('page');
  const publishing = MBG.activeKitchens();
  const notPublishing = MBG.kitchens.filter(k => k.status !== 'BEROPERASI');

  const state = {
    kitchen: publishing[0].slug,
    date: null,
    segment: Nutrition.DEFAULT_SEGMENT,
  };

  const kitchen = () => MBG.kitchenBySlug(state.kitchen);
  function menu() {
    const k = kitchen();
    return k.menus.find(m => m.date === state.date) || k.menus[k.menus.length - 1];
  }

  /* ---------- static shell ---------- */
  page.innerHTML = `
    <div class="container container-wide page-intro">
      <h1>Menu &amp; Gizi</h1>
      <p>Menu yang benar-benar disajikan tiap hari, dinilai terhadap Angka Kecukupan Gizi tiap kelompok penerima.</p>
    </div>

    <div class="container container-wide" style="padding-bottom:var(--sp-8)">
      <div class="pick-row">
        <div>
          <label class="pick-lbl">Dapur</label>
          <div class="chips" id="kchips"></div>
          ${notPublishing.length ? `<p class="pick-note">${notPublishing.map(k => k.name).join(', ')} masih dalam persiapan dan belum menerbitkan menu.</p>` : ''}
        </div>
        <div>
          <label class="pick-lbl" for="dsel">Tanggal menu</label>
          <select class="sel" id="dsel"></select>
          <p class="pick-note" id="dnote"></p>
        </div>
      </div>

      <div id="mbody"></div>

      <div class="src-note">
        <span class="e">Catatan sumber data</span>
        <p>Angka Kecukupan Gizi dan nilai gizi bahan pangan di sini adalah <b>simulasi</b> yang mengikuti struktur Permenkes Nomor 28 Tahun 2019 dan Tabel Komposisi Pangan Indonesia — bukan salinan tabel resminya. Pada implementasi sungguhan keduanya menjadi data acuan berversi yang dikelola lewat CMS, sehingga setiap perubahan acuan tercatat dan skor lama tetap dapat ditelusuri.</p>
      </div>
    </div>`;

  /* ---------- kitchen chips ---------- */
  document.getElementById('kchips').innerHTML = publishing.map(k =>
    `<button class="chip ${k.slug === state.kitchen ? 'active' : ''}" data-value="${k.slug}">${k.name}</button>`).join('');

  UI.bindChips(document.getElementById('kchips'), (slug) => {
    state.kitchen = slug;
    state.date = null;
    fillDates();
    paint();
  });

  /* ---------- date selector (locked menu days only) ---------- */
  function fillDates() {
    const k = kitchen();
    const sel = document.getElementById('dsel');
    const dates = k.menuDates.slice().reverse();
    state.date = state.date || dates[0];
    sel.innerHTML = dates.map(d =>
      `<option value="${d}" ${d === state.date ? 'selected' : ''}>${MBG.fmtDate(d, 'long')}</option>`).join('');
    document.getElementById('dnote').textContent =
      `Tersedia ${dates.length} hari menu yang sudah dikunci. Akhir pekan tidak muncul karena dapur libur.`;
  }
  document.getElementById('dsel').addEventListener('change', (e) => {
    state.date = e.target.value;
    paint();
  });

  /* ---------- menu breakdown by category ---------- */
  function breakdown(m) {
    const used = MBG.categories.filter(c => m.components.some(x => x.kat === c.id));
    return `<div class="card menu-card reveal">
      <div class="flex items-center justify-between wrap gap-3">
        <div>
          <h2 style="font-size:var(--fs-xl)">Menu ${MBG.fmtDate(m.date)}</h2>
          <p class="text-sm muted">${MBG.fmtDate(m.date, 'long')}</p>
        </div>
        <span class="pill">${m.components.length} komponen porsi</span>
      </div>
      <div class="menu-cats">
        ${used.map(c => `<div class="menu-cat">
          <div class="ct">${c.label}</div>
          ${m.components.filter(x => x.kat === c.id).map(x =>
            `<div class="mi"><span class="n">${x.name}</span><span class="g">${MBG.fmt(x.gram)} gram</span></div>`).join('')}
        </div>`).join('')}
      </div>
      <div class="menu-tot">
        <span>Total energi <b>${MBG.fmt(Math.round(m.total.energi))} kkal</b></span>
        <span>Total protein <b>${MBG.fmtDec(m.total.protein, 1)} g</b></span>
        <span>Berat porsi <b>${MBG.fmt(m.beratTotal)} gram</b></span>
      </div>
    </div>`;
  }

  /* ---------- six-segment selector ---------- */
  function segments(m) {
    const all = Nutrition.allSegments(m);
    return `<div class="sec-hd" style="margin-top:var(--sp-6)">
      <div class="row">
        <h2 style="font-size:var(--fs-xl)">Untuk siapa porsi ini dinilai?</h2>
        <span class="hint">Skor menu ini per kelompok — pilih untuk merincinya</span>
      </div>
    </div>
    <div class="seg-grid" id="seggrid">
      ${all.map(s => `<button class="seg ${s.id === state.segment ? 'on' : ''}" data-seg="${s.id}">
        <span><span class="sl">${s.label}</span><span class="ss">${s.sub}</span></span>
        <span class="sv"><i style="background:var(--${s.band.tone})"></i>${s.overall}%</span>
      </button>`).join('')}
    </div>`;
  }

  /* ---------- score explainer ---------- */
  function scoreCard(ev) {
    const b = MBG.akg.bands;
    return `<div class="card score-card reveal" style="margin-top:var(--sp-5)">
      <div>
        <div class="lbl">Skor kecukupan untuk ${ev.segment.label.toLowerCase()}</div>
        <div class="big">${ev.overall}<sup>%</sup></div>
        <span class="tag-s bg-${ev.band.tone}" style="margin-top:.5rem;display:inline-flex">${ev.band.label}</span>
      </div>
      <div>
        <p>Satu kali makan ditargetkan memenuhi <b>${ev.targetPct}%</b> Angka Kecukupan Gizi harian ${ev.segment.label.toLowerCase()} (${ev.segment.sub}). Skor di samping adalah rata-rata tertimbang sembilan nutrien terhadap target itu, masing-masing dibatasi 100% agar satu zat gizi berlebih <b>tidak menutupi</b> zat lain yang kurang.</p>
        <p class="amb">Ambang: cukup mulai ${b.cukup}%, perlu perhatian mulai ${b.perhatian}%.</p>
      </div>
    </div>`;
  }

  /* ---------- nine-nutrient breakdown ---------- */
  function nutrients(ev) {
    return `<div class="sec-hd" style="margin-top:var(--sp-6)">
      <div class="row">
        <h2 style="font-size:var(--fs-xl)">Rincian per nutrien</h2>
        <span class="hint">Garis gelap di ujung bar menandai target satu kali makan</span>
      </div>
    </div>
    <div class="nut">
      ${ev.rows.map(r => {
        const w = Math.min(r.pct, 140);
        const color = r.status.id === 'berlebih' ? 'var(--accent-amber)'
                    : r.status.id === 'cukup' ? 'var(--success)'
                    : r.status.id === 'perhatian' ? 'var(--accent-orange)' : 'var(--danger)';
        return `<div class="nut-row">
          <div class="nn">${r.label} <span>(${r.unit})</span></div>
          <div class="nut-track">
            <i class="nut-fill" style="--w:${w / 1.4}%;background:${color}"></i>
            <span class="nut-mark" style="left:${100 / 1.4}%"></span>
          </div>
          <div class="nut-pct" style="color:${color}">${r.pct}%</div>
          <div class="nut-abs">${MBG.fmtDec(r.actual, r.dec)} dari ${MBG.fmtDec(r.target, r.dec)} ${r.unit}</div>
          <span class="tag-s bg-${r.status.tone}">${r.status.label}</span>
        </div>`;
      }).join('')}
    </div>`;
  }

  /* ---------- adequacy history ---------- */
  function history(k, ev) {
    const h = Nutrition.history(k, state.segment, 14);
    return `<div class="card reveal" style="margin-top:var(--sp-6);padding:var(--sp-5)">
      <div class="flex items-center justify-between wrap gap-3" style="margin-bottom:var(--sp-4)">
        <div>
          <h3 style="font-size:var(--fs-lg)">Riwayat kecukupan</h3>
          <p class="text-sm muted">Skor keseluruhan untuk ${ev.segment.label.toLowerCase()} di ${k.name}. Akhir pekan tidak muncul karena dapur libur.</p>
        </div>
        <span class="pill">n = ${h.length} hari</span>
      </div>
      ${Charts.line([{ points: h.map(x => x.value), color: 'var(--brand-purple)' }], {
        labels: h.map(x => x.label), width: 900, height: 240,
        min: 0, max: 110, threshold: MBG.akg.bands.cukup,
        aria: 'Riwayat skor kecukupan gizi',
      })}
      <p class="hist-note">Garis putus-putus adalah ambang cukup (${MBG.akg.bands.cukup}%).</p>
    </div>`;
  }

  /* ---------- paint everything below the pickers ---------- */
  function paint() {
    const m = menu();
    const k = kitchen();
    const ev = Nutrition.score(m, state.segment);
    const body = document.getElementById('mbody');

    body.innerHTML = breakdown(m) + segments(m) + scoreCard(ev) + nutrients(ev) + history(k, ev);

    /* segment switch recomputes score, nutrients and history */
    body.querySelectorAll('.seg').forEach(btn =>
      btn.addEventListener('click', () => { state.segment = btn.dataset.seg; paint(); }));

    /* animate nutrient bars from their --w custom property */
    requestAnimationFrame(() => {
      body.querySelectorAll('.nut-fill').forEach((f, i) =>
        setTimeout(() => { f.style.width = f.style.getPropertyValue('--w'); }, 60 + i * 55));
    });

    UI.observe(body);
  }

  fillDates();
  paint();
  Layout.render({ page: 'menu' });
  UI.observe(page);
})();
