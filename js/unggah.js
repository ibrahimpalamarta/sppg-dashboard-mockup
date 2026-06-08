/* ============================================================
   MBG Dashboard — Upload / processing wizard (/unggah)
   4 steps · simulated parse + mapping + audit trail.
   Internal-only.
   ============================================================ */
(function () {
  Layout.render({ page: 'unggah' });
  const page = document.getElementById('page');

  const state = {
    step: 1,
    formType: 'Surat Jalan',
    unit: 'sukun',
    fileName: '',
  };

  const STEP_LABELS = ['Unggah', 'Baca & Petakan', 'Verifikasi', 'Tersimpan'];

  /* ---------- gate ---------- */
  function gate() {
    page.innerHTML = `
      <div class="gate card">
        <div class="g-ic">${icon('lock')}</div>
        <h2>Halaman internal</h2>
        <p class="muted" style="margin-top:.6rem">Unggah & pemrosesan data hanya tersedia untuk peran internal. Beralih peran (mis. <b>Pengawas Lapangan</b>) melalui pemilih peran di kanan atas.</p>
        <button class="btn btn-purple" style="margin-top:1.5rem" id="gate-switch">${icon('eye')} Beralih ke peran internal</button>
      </div>`;
    document.getElementById('gate-switch').onclick = () => Role.set('pengawas');
  }

  /* ---------- step indicator ---------- */
  function stepper() {
    return `<div class="steps">` + STEP_LABELS.map((l, i) => {
      const n = i + 1;
      const cls = state.step === n ? 'active' : (state.step > n ? 'done' : '');
      const line = i < STEP_LABELS.length - 1 ? `<span class="step-line ${state.step > n ? 'done' : ''}"></span>` : '';
      return `<div class="step ${cls}"><span class="s-num">${state.step > n ? '✓' : n}</span><span class="s-lab">${l}</span></div>${line}`;
    }).join('') + `</div>`;
  }

  /* ---------- step 1: upload ---------- */
  function step1() {
    const recent = MBG.recentUploads.map(r => `
      <tr><td class="cell-strong">${icon('sheet')} ${r.file}</td><td>${r.type}</td>
      <td class="num text-xs">${r.time}</td><td>${r.by}</td>
      <td><span class="pill ${r.status === 'Tersimpan' ? 'pill-green' : 'pill-amber'}">${r.status}</span></td></tr>`).join('');

    return `
      <div class="card card-pad-lg">
        <input type="file" id="file-input" accept=".xlsx,.csv" hidden>
        <div class="dropzone" id="dropzone" role="button" tabindex="0" aria-label="Unggah berkas">
          <div class="dz-ic">${icon('upload')}</div>
          <h3 id="dz-title">Tarik & letakkan berkas di sini</h3>
          <p id="dz-sub">atau <b style="color:var(--brand-purple)">klik untuk memilih</b> dari perangkat Anda</p>
          <div class="dz-formats">Format didukung: .xlsx · .csv</div>
        </div>
        <div class="field-row">
          <div class="field"><label>Jenis Formulir</label>
            <select id="form-type">${MBG.formTypes.map(t => `<option ${t === state.formType ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
          <div class="field"><label>Unit SPPG</label>
            <select id="unit-sel">${MBG.units.map(u => `<option value="${u.slug}" ${u.slug === state.unit ? 'selected' : ''}>${u.name}</option>`).join('')}</select></div>
        </div>
        <button class="btn btn-ghost btn-sm" id="sample-btn" style="margin-top:1rem">${icon('sheet')} Gunakan berkas contoh</button>
      </div>

      <div class="block">
        <div class="block-head"><h3 style="font-size:var(--fs-lg)">Riwayat Unggahan Terbaru</h3></div>
        <div class="table-wrap"><table class="data"><thead><tr>
          <th>Berkas</th><th>Jenis</th><th>Waktu</th><th>Oleh</th><th>Status</th>
        </tr></thead><tbody>${recent}</tbody></table></div>
      </div>

      <div class="wizard-nav">
        <span></span>
        <button class="btn btn-primary" id="next1" ${state.fileName ? '' : 'disabled style="opacity:.5;pointer-events:none"'}>
          Lanjut: Baca & Petakan ${icon('arrowRight')}</button>
      </div>`;
  }

  function bindStep1() {
    const dz = document.getElementById('dropzone');
    const input = document.getElementById('file-input');
    const setFile = (name) => {
      state.fileName = name;
      document.getElementById('dz-title').textContent = name;
      document.getElementById('dz-sub').innerHTML = `<span style="color:var(--success);font-weight:600">${'✓'} Berkas siap diproses</span>`;
      dz.querySelector('.dz-ic').innerHTML = icon('sheet');
      const nb = document.getElementById('next1');
      nb.removeAttribute('disabled'); nb.style.opacity = ''; nb.style.pointerEvents = '';
    };
    dz.onclick = () => input.click();
    dz.onkeydown = (e) => { if (e.key === 'Enter') input.click(); };
    input.onchange = () => { if (input.files[0]) setFile(input.files[0].name); };
    dz.ondragover = (e) => { e.preventDefault(); dz.classList.add('drag'); };
    dz.ondragleave = () => dz.classList.remove('drag');
    dz.ondrop = (e) => { e.preventDefault(); dz.classList.remove('drag'); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0].name); };

    document.getElementById('form-type').onchange = (e) => { state.formType = e.target.value; };
    document.getElementById('unit-sel').onchange = (e) => { state.unit = e.target.value; };
    document.getElementById('sample-btn').onclick = () => {
      const slug = state.unit;
      const base = state.formType.toLowerCase().replace(/[^a-z]+/g, '_').replace(/^_|_$/g, '');
      setFile(`${base}_${slug}_07jun.xlsx`);
    };
    document.getElementById('next1').onclick = () => go(2);
  }

  /* ---------- step 2: parse & map ---------- */
  function step2() {
    const sample = MBG.parseSamples[state.formType] || MBG.parseSamples['Surat Jalan'];
    const head = sample.columns.map(c => `<th>${c}</th>`).join('');
    const rows = sample.rows.map(r => `<tr>${r.map((c, i) => `<td class="${i > 0 && !isNaN(c) ? 'num' : ''}">${c}</td>`).join('')}</tr>`).join('');
    const mapping = sample.mapping.map(m => `
      <div class="map-pair">
        <span class="mp-col">${m.col}</span>
        <span class="mp-arrow">${icon('arrowRight')}</span>
        <span class="mp-target">${m.target}</span>
        <span class="mp-conf">${m.conf}%</span>
      </div>`).join('');

    return `
      <div class="note" style="margin-bottom:1.5rem">${icon('sparkles')} Sistem membaca <b>${state.fileName}</b> dan memetakan kolom ke komponen dashboard secara otomatis. Tinjau hasil di bawah.</div>
      <div class="parse-layout">
        <div class="card">
          <div class="flex items-center gap-2" style="margin-bottom:1rem"><span class="chip-head"><span class="ic">${icon('sheet')}</span></span>
            <div><span class="eyebrow">Tabel Terbaca</span><h3 style="font-size:var(--fs-md)">${state.formType}</h3></div></div>
          <div class="table-wrap"><table class="data" style="min-width:auto"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>
        </div>
        <div class="card">
          <div class="flex items-center gap-2" style="margin-bottom:1rem"><span class="chip-head accent"><span class="ic">${icon('layers')}</span></span>
            <div><span class="eyebrow accent">Pemetaan Kolom</span><h3 style="font-size:var(--fs-md)">Kolom → Komponen</h3></div></div>
          <div class="mapping-panel">${mapping}</div>
          <div class="note" style="margin-top:1rem">${icon('check')} Semua kolom utama terpetakan dengan keyakinan tinggi.</div>
        </div>
      </div>
      <div class="wizard-nav">
        <button class="btn btn-ghost" id="back2"><span style="transform:rotate(180deg);display:inline-flex">${icon('arrowRight')}</span> Kembali</button>
        <button class="btn btn-primary" id="next2">Lanjut: Verifikasi ${icon('arrowRight')}</button>
      </div>`;
  }

  function bindStep2() {
    document.getElementById('back2').onclick = () => go(1);
    document.getElementById('next2').onclick = () => go(3);
  }

  /* ---------- step 3: verify ---------- */
  function step3() {
    const sample = MBG.parseSamples[state.formType] || MBG.parseSamples['Surat Jalan'];
    const unit = MBG.unitBySlug(state.unit);
    const tiles = sample.tiles.map(t => `
      <div class="confirm-tile"><span class="ct-ic">${icon('check')}</span>
        <span class="ct-name">${t}</span><span class="ct-val">akan diperbarui</span></div>`).join('');
    return `
      <div class="card card-pad-lg" style="max-width:680px;margin-inline:auto">
        <div class="section-head" style="margin-bottom:1.2rem">
          <span class="eyebrow">Verifikasi</span>
          <h3 style="margin-top:.3rem">Tinjau sebelum menyimpan</h3>
          <p class="intro">Komponen dashboard berikut pada <b>${unit.name}</b> akan diperbarui dari berkas <b>${state.fileName}</b>.</p>
        </div>
        <div class="confirm-tiles">${tiles}</div>
        <div class="note" style="margin-top:1.5rem">${icon('eye')} <span><b>Tinjau sekilas:</b> pastikan jumlah & tujuan sesuai berkas asli sebelum konfirmasi. Langkah ringan ini mencegah salah baca.</span></div>
      </div>
      <div class="wizard-nav" style="max-width:680px;margin-inline:auto">
        <button class="btn btn-ghost" id="back3">Kembali</button>
        <button class="btn btn-purple" id="confirm">${icon('check')} Konfirmasi & Simpan</button>
      </div>`;
  }

  function bindStep3() {
    document.getElementById('back3').onclick = () => go(2);
    document.getElementById('confirm').onclick = () => go(4);
  }

  /* ---------- step 4: saved ---------- */
  function step4() {
    const unit = MBG.unitBySlug(state.unit);
    const now = '7 Jun 2026, 08:46:12 WIB';
    const sample = MBG.parseSamples[state.formType] || MBG.parseSamples['Surat Jalan'];
    const newPorsi = unit.status === 'AKTIF' ? unit.stats.porsiHariIni + 615 : 615;
    return `
      <div class="card card-pad-lg saved-hero" style="max-width:680px;margin-inline:auto">
        <div class="saved-check">${icon('check')}</div>
        <h2>Berkas tersimpan</h2>
        <p class="muted" style="margin-top:.5rem">Data dari <b>${state.fileName}</b> berhasil dipetakan dan disimpan permanen ke ${unit.name}.</p>

        <div class="tile-update">
          <span class="ct-ic" style="width:38px;height:38px;border-radius:11px;background:var(--brand-lilac);color:var(--brand-purple);display:grid;place-items:center">${icon('box')}</span>
          <div style="text-align:left"><div class="text-xs muted">${sample.tiles[0]}</div>
            <div class="tu-v"><span class="count" data-to="${newPorsi}">0</span></div></div>
          <span class="pill pill-green" style="margin-left:1rem">${icon('trendUp')} Diperbarui</span>
        </div>

        <div class="audit">
          <div class="block-head" style="margin-bottom:.5rem"><span class="eyebrow">Jejak Audit</span></div>
          <div class="audit-row"><span class="al">Berkas</span><span class="av">${state.fileName}</span></div>
          <div class="audit-row"><span class="al">Jenis formulir</span><span class="av" style="font-family:var(--font-ui)">${state.formType}</span></div>
          <div class="audit-row"><span class="al">Unit</span><span class="av" style="font-family:var(--font-ui)">${unit.name}</span></div>
          <div class="audit-row"><span class="al">Diunggah oleh</span><span class="av" style="font-family:var(--font-ui)">${Role.current().label}</span></div>
          <div class="audit-row"><span class="al">Waktu</span><span class="av">${now}</span></div>
          <div class="audit-row"><span class="al">Status</span><span class="av" style="color:var(--success)">Tersimpan permanen</span></div>
        </div>
      </div>
      <div class="wizard-nav" style="max-width:680px;margin-inline:auto">
        <a class="btn btn-ghost" href="unit.html?u=${state.unit}">Lihat dashboard unit ${icon('arrowRight')}</a>
        <button class="btn btn-primary" id="again">${icon('upload')} Unggah berkas lain</button>
      </div>`;
  }

  function bindStep4() {
    document.getElementById('again').onclick = () => { state.fileName = ''; go(1); };
    UI.observe(page);
  }

  /* ---------- render ---------- */
  function go(n) { state.step = n; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  function render() {
    if (!Role.isInternal()) { gate(); return; }
    const bodies = { 1: step1, 2: step2, 3: step3, 4: step4 };
    page.innerHTML = `
      <section class="page-hd">
        <div class="container container-wide">
          <span class="eyebrow on-dark">Otomasi Data</span>
          <h1>Unggah & Pemrosesan Formulir SPPG</h1>
          <p class="ph-sub">Staf cukup mengunggah formulir digital standar — sistem membaca dan memperbarui dashboard otomatis. Tanpa kerja ganda.</p>
        </div>
      </section>
      <div class="container section">
        <div class="wizard">${stepper()}${bodies[state.step]()}</div>
      </div>`;
    ({ 1: bindStep1, 2: bindStep2, 3: bindStep3, 4: bindStep4 }[state.step])();
  }

  Role.onChange(() => render());
  render();
})();
