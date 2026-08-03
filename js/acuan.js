/* ============================================================
   Data Acuan — reference data & templates (internal) — PRD_MERGED §6.6
   A. AKG reference table (versioned) — adequacy policy lives here,
      thresholds are computed from the target column, not hard-coded.
   B. Source-file templates + full data dictionary.
   ============================================================ */
(function () {
  const state = { tab: 'akg', host: null };

  function akgTable() {
    const a = MBG.akg;
    return `
      <div class="i-card">
        <h3>${icon('database')} Tabel acuan AKG</h3>
        <div class="prov" style="margin-bottom:var(--sp-5)">
          <div class="pr"><span class="k">${icon('badge')} Versi</span><span><b>${a.version}</b></span></div>
          <div class="pr"><span class="k">${icon('calendar')} Berlaku sejak</span><span>${a.effectiveDate}</span></div>
          <div class="pr"><span class="k">${icon('book')} Sumber</span><span>${a.source}</span></div>
          <div class="pr"><span class="k">${icon('check')} Status</span><span class="tag-s bg-success">${a.status}</span></div>
          <div class="pr"><span class="k">${icon('clock')} Diperbarui</span><span>${a.updatedAt}</span></div>
          <div class="pr"><span class="k">${icon('users')} Oleh</span><span>${a.updatedBy}</span></div>
        </div>

        <div class="dt-wrap">
          <table class="dt">
            <thead><tr>
              <th>Kelompok penerima</th>
              ${MBG.nutrients.map(n => `<th class="num">${n.label}<div class="sm">${n.unit}</div></th>`).join('')}
              <th class="num">Target / makan</th>
            </tr></thead>
            <tbody>
              ${a.segments.map(s => `<tr>
                <td class="strong">${s.label}<div class="sm">${s.sub}</div></td>
                ${MBG.NKEYS.map(k => `<td class="num">${MBG.fmt(s.daily[k])}</td>`).join('')}
                <td class="num strong">${s.targetPct}%</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>

        <div class="note" style="margin-top:var(--sp-4)">${icon('alert')}
          Nilai pada tabel ini adalah <b>simulasi</b> yang mengikuti struktur Permenkes 28/2019 — bukan salinan tabel resminya.</div>

        <div class="note" style="margin-top:var(--sp-3)">${icon('info')}
          Ambang kecukupan dihitung <b>dari kolom target</b>, bukan ditanam di kode. Artinya kebijakan kecukupan porsi diubah di halaman ini — bukan lewat rilis aplikasi. Ambang berlaku: cukup ≥ ${a.bands.cukup}%, perlu perhatian ≥ ${a.bands.perhatian}%.</div>

        <div class="flex gap-2 wrap" style="margin-top:var(--sp-5)">
          <button class="btn btn-primary btn-sm">${icon('upload')} Unggah tabel acuan baru</button>
          <button class="btn btn-ghost btn-sm">${icon('download')} Unduh versi berlaku</button>
        </div>
      </div>

      <div class="i-card">
        <h3>${icon('history')} Riwayat versi</h3>
        <div class="dt-wrap">
          <table class="dt">
            <thead><tr><th>Versi</th><th>Tanggal</th><th>Oleh</th><th>Catatan perubahan</th></tr></thead>
            <tbody>
              ${a.history.map((h, i) => `<tr>
                <td class="strong">${h.version} ${i === 0 ? '<span class="tag-s bg-success">berlaku</span>' : ''}</td>
                <td class="sm mono">${h.date}</td>
                <td class="sm">${h.by}</td>
                <td class="sm">${h.note}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <p class="text-xs muted" style="margin-top:var(--sp-3)">Skor yang dihitung dengan versi lama tetap dapat ditelusuri — versi acuan melekat pada setiap catatan.</p>
      </div>`;
  }

  function templatesView() {
    return MBG.templates.map(t => `
      <div class="i-card">
        <div class="flex items-center justify-between wrap gap-3" style="margin-bottom:var(--sp-4)">
          <h3 style="margin:0">${icon('sheet')} ${t.name}</h3>
          <div class="flex gap-2 items-center">
            <span class="pill">${t.version} · ${t.updated}</span>
            <button class="btn btn-ghost btn-sm">${icon('download')} ${t.file}</button>
          </div>
        </div>
        <div class="dt-wrap">
          <table class="dt">
            <thead><tr><th>Kolom</th><th>Tipe</th><th>Wajib</th><th>Contoh</th><th>Aturan validasi</th></tr></thead>
            <tbody>
              ${t.columns.map(c => `<tr>
                <td class="strong mono" style="font-size:var(--fs-xs)">${c.col}</td>
                <td class="sm">${c.type}</td>
                <td>${c.req ? '<span class="tag-s bg-danger">Wajib</span>' : '<span class="tag-s bg-warning">Opsional</span>'}</td>
                <td class="sm mono">${c.example}</td>
                <td class="sm">${c.rule}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`).join('');
  }

  function paint() {
    const el = state.host;
    el.innerHTML = `
      <div class="chips" id="atabs" style="margin-bottom:var(--sp-5)">
        <button class="chip ${state.tab === 'akg' ? 'active' : ''}" data-value="akg">Tabel acuan AKG</button>
        <button class="chip ${state.tab === 'tpl' ? 'active' : ''}" data-value="tpl">Templat &amp; kamus data</button>
      </div>
      <div id="abody">${state.tab === 'akg' ? akgTable() : templatesView()}</div>`;

    UI.bindChips(el.querySelector('#atabs'), (v) => { state.tab = v; paint(); });
    UI.observe(el);
  }

  Internal.mount({
    page: 'acuan',
    title: 'Data Acuan',
    sub: 'Dua hal yang menentukan apakah angka pada dashboard ini bisa dipercaya: tabel acuan gizi, dan format berkas sumber.',
    render: (el) => { state.host = el; paint(); },
  });
})();
