/* ============================================================
   Input Data — daily submission wizard (internal) — PRD_MERGED §6.2
   1 Unggah → 2 Pembacaan → 3 Tinjau → 4 Terkunci

   Processing model per PRD_MERGED C-03 (resolved to Source B):
   the file is cleaned and structured OUTSIDE the product, in the
   desktop step, then verified by a SECOND admin here before import.
   So Step 3 is a confirmation pass over already-structured rows —
   not an in-app parsing/confidence-scoring engine.
   ============================================================ */
(function () {
  const LABELS = ['Unggah', 'Pembacaan', 'Tinjau', 'Terkunci'];
  const state = { step: 1, file: null, confirmed: {}, host: null };

  const kitchen = () => {
    const r = Role.current();
    return r.kitchen ? MBG.kitchenBySlug(r.kitchen) : MBG.activeKitchens()[0];
  };

  function stepper() {
    return `<div class="steps2">${LABELS.map((l, i) => {
      const n = i + 1;
      const cls = state.step === n ? 'on' : (state.step > n ? 'done' : '');
      const line = i < LABELS.length - 1 ? `<span class="st-line ${state.step > n ? 'done' : ''}"></span>` : '';
      return `<div class="st ${cls}"><span class="n">${state.step > n ? '✓' : n}</span><span class="t">${l}</span></div>${line}`;
    }).join('')}</div>`;
  }

  function contextBar() {
    const k = kitchen();
    return `<div class="note" style="margin-bottom:var(--sp-5)">${icon('info')}
      Dapur <b>${k.name}</b> (${k.code}) · Supervisor <b>${k.pic}</b> · Tanggal <b>${MBG.fmtDate(MBG.LAST_MENU_DATE, 'long')}</b></div>`;
  }

  /* ---------- step 1 ---------- */
  function step1() {
    return `${contextBar()}
      <div class="i-card">
        <h3>${icon('upload')} Unggah berkas harian</h3>
        <p class="sub">Berkas yang diunggah adalah lembar kerja dapur yang <b>sudah dibersihkan dan distrukturkan</b> pada aplikasi desktop, lalu diperiksa satu admin. Di sini admin kedua memverifikasinya sebelum diimpor. Tidak perlu mengetik ulang ke dalam formulir.</p>
        <div class="drop" id="drop">
          ${icon('upload')}
          <b>Letakkan berkas di sini</b>
          <span class="sm">XLSX hasil pembersihan · maksimal 25 MB</span>
        </div>

        <h4 style="font-size:var(--fs-sm);margin:var(--sp-5) 0 var(--sp-3)">Berkas siap diproses</h4>
        <div class="dt-wrap">
          <table class="dt">
            <thead><tr><th>Berkas</th><th>Jenis</th><th class="num">Baris</th><th>Dibersihkan oleh</th><th>Waktu</th><th></th></tr></thead>
            <tbody>
              ${MBG.inboxFiles.map(f => `<tr>
                <td class="strong">${icon('sheet')} ${f.file}<div class="sm mono">${f.kitchen} · ${f.size}</div></td>
                <td>${f.type}</td>
                <td class="num">${f.rows}</td>
                <td>${f.cleanedBy}</td>
                <td class="sm mono">${f.cleanedAt}</td>
                <td><button class="btn btn-primary btn-sm js-pick" data-file="${f.file}">Pilih</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between wrap gap-3" style="margin-top:var(--sp-5)">
          <button class="btn btn-ghost btn-sm">${icon('download')} Unduh templat standar</button>
          <span class="text-xs muted">Format lembar kerja yang seragam adalah yang membuat pembacaan mesin dapat diandalkan dan perbandingan antar-dapur mungkin dilakukan.</span>
        </div>
      </div>`;
  }

  /* ---------- step 2 ---------- */
  function step2() {
    const f = MBG.inboxFiles.find(x => x.file === state.file) || MBG.inboxFiles[0];
    return `${contextBar()}
      <div class="i-card">
        <h3>${icon('sheet')} Pembacaan berkas</h3>
        <p class="sub">Berkas dibaca ke dalam skema baku. Kolom dipetakan, format angka Indonesia diurai, dan satuan setelah angka diabaikan.</p>
        <div class="prov" style="margin-bottom:var(--sp-5)">
          <div class="pr"><span class="k">${icon('file')} Berkas</span><span class="mono">${f.file}</span></div>
          <div class="pr"><span class="k">${icon('grid')} Baris terbaca</span><span><b>${f.rows}</b> dari ${f.rows}</span></div>
          <div class="pr"><span class="k">${icon('users')} Dibersihkan oleh</span><span>${f.cleanedBy} · ${f.cleanedAt}</span></div>
          <div class="pr"><span class="k">${icon('check')} Kolom wajib</span><span class="tone-success">Lengkap</span></div>
        </div>
        <div class="note">${icon('shield')} Berkas sudah terstruktur sejak tahap desktop, sehingga tidak ada baris yang gagal dibaca. Verifikasi manusia tetap wajib — lanjut ke tahap tinjau.</div>
      </div>`;
  }

  /* ---------- step 3: second-admin confirmation pass ---------- */
  function step3() {
    const rows = MBG.inboxPreview;
    const done = Object.keys(state.confirmed).length;
    return `${contextBar()}
      <div class="i-card">
        <h3>${icon('check')} Tinjau &amp; konfirmasi</h3>
        <p class="sub">Pemeriksaan admin kedua. Cocokkan tiap nilai dengan lembar sumber, lalu tandai sesuai. Selama masih ada baris yang belum dikonfirmasi, tombol kunci tetap nonaktif.</p>

        <div class="dt-wrap" style="border-radius:var(--r-md)">
          <div style="min-width:640px">
            ${rows.map((r, i) => `<div class="confirm-row ${state.confirmed[i] ? 'ok' : ''}" data-i="${i}">
              <div class="fld">${r.field}</div>
              <div class="val">${r.value}</div>
              <div class="rule">${r.rule}</div>
              <div>${state.confirmed[i]
                ? `<span class="tag-s bg-success">${icon('check')} Sesuai</span>`
                : `<button class="btn btn-ghost btn-sm js-ok" data-i="${i}">Tandai sesuai</button>`}</div>
            </div>`).join('')}
          </div>
        </div>

        <div class="flex items-center justify-between wrap gap-3" style="margin-top:var(--sp-5)">
          <span class="gate-note">${icon('info')} <b>${done} dari ${rows.length}</b> baris sudah dikonfirmasi</span>
          <button class="btn btn-primary js-lock" ${done < rows.length ? 'disabled' : ''}>
            ${icon('lock')} Kunci dan kirim
          </button>
        </div>
        <p class="text-xs muted" style="margin-top:var(--sp-3)">Tidak ada yang tersimpan sampai catatan dikunci.</p>
      </div>`;
  }

  /* ---------- step 4 ---------- */
  function step4() {
    const k = kitchen();
    const hash = MBG.fingerprint({ f: state.file, t: Date.now() });
    return `<div class="i-card" style="text-align:center;padding:var(--sp-7)">
        <div style="display:grid;place-items:center;width:56px;height:56px;margin:0 auto var(--sp-4);border-radius:50%;background:var(--success-bg);color:var(--success)">${icon('lock')}</div>
        <h3 style="justify-content:center">Catatan terkunci</h3>
        <p class="sub" style="max-width:52ch;margin-inline:auto">Catatan harian tersimpan dan tidak dapat diubah. Koreksi apa pun akan dicatat sebagai entri baru yang menunjuk catatan ini.</p>
        <div class="prov" style="max-width:520px;margin:var(--sp-5) auto;text-align:left">
          <div class="pr"><span class="k">${icon('clock')} Waktu kunci</span><span>${MBG.fmtDate(MBG.LAST_MENU_DATE)} 14:32 WIB</span></div>
          <div class="pr"><span class="k">${icon('users')} Dikunci oleh</span><span>${k.pic}</span></div>
          <div class="pr"><span class="k">${icon('upload')} Sumber data</span><span>Unggah berkas (XLSX)</span></div>
          <div class="pr"><span class="k">${icon('fingerprint')} Sidik isi</span><span class="hash">${hash}</span></div>
        </div>
        <div class="flex gap-2" style="justify-content:center;flex-wrap:wrap">
          <a class="btn btn-primary btn-sm" href="audit.html">${icon('history')} Lihat di jejak audit</a>
          <button class="btn btn-ghost btn-sm js-restart">${icon('refresh')} Unggah berkas lain</button>
        </div>
      </div>`;
  }

  function paint() {
    const el = state.host;
    const body = state.step === 1 ? step1() : state.step === 2 ? step2() : state.step === 3 ? step3() : step4();
    el.innerHTML = stepper() + body;

    el.querySelectorAll('.js-pick').forEach(b => b.addEventListener('click', () => {
      state.file = b.dataset.file; state.step = 2; paint();
    }));
    const drop = el.querySelector('#drop');
    if (drop) drop.addEventListener('click', () => {
      state.file = MBG.inboxFiles[0].file; state.step = 2; paint();
    });
    el.querySelectorAll('.js-ok').forEach(b => b.addEventListener('click', () => {
      state.confirmed[b.dataset.i] = true; paint();
    }));
    const lock = el.querySelector('.js-lock');
    if (lock) lock.addEventListener('click', () => { state.step = 4; paint(); });
    const restart = el.querySelector('.js-restart');
    if (restart) restart.addEventListener('click', () => {
      state.step = 1; state.confirmed = {}; state.file = null; paint();
    });

    /* step 2 has no controls of its own — offer the forward move */
    if (state.step === 2) {
      const card = el.querySelector('.i-card');
      const nav = document.createElement('div');
      nav.className = 'flex gap-2';
      nav.style.marginTop = 'var(--sp-5)';
      nav.innerHTML = `<button class="btn btn-primary btn-sm" id="s2next">Lanjut ke tinjau ${icon('arrowRight')}</button>
        <button class="btn btn-ghost btn-sm" id="s2back">${icon('arrowLeft')} Kembali</button>`;
      card.appendChild(nav);
      nav.querySelector('#s2next').addEventListener('click', () => { state.step = 3; paint(); });
      nav.querySelector('#s2back').addEventListener('click', () => { state.step = 1; paint(); });
    }

    UI.observe(el);
  }

  Internal.mount({
    page: 'input',
    title: 'Input Data',
    sub: 'Unggah lembar kerja harian yang sudah dibersihkan, verifikasi sebagai admin kedua, lalu kunci catatannya.',
    render: (el) => { state.host = el; paint(); },
  });
})();
