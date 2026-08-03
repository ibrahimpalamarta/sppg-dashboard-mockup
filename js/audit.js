/* ============================================================
   Jejak Audit (internal) — PRD_MERGED §6.3
   Correction spotlight (append-only) + filterable activity history.
   ============================================================ */
(function () {
  const state = { kitchen: 'Semua', action: 'Semua', q: '', host: null };

  function spotlight() {
    const c = MBG.correction;
    return `<div class="i-card">
      <h3>${icon('history')} Sorotan koreksi</h3>
      <p class="sub">Koreksi tidak pernah menimpa catatan asli. Keduanya tetap terlihat, masing-masing dengan sidik isinya sendiri. <i>Riwayat yang bisa dihapus bukan riwayat.</i></p>
      <div class="corr">
        <div class="corr-side orig">
          <div class="flex items-center justify-between" style="margin-bottom:.6rem">
            <h4>Catatan asli</h4>
            <span class="tag-s bg-success">Tidak berubah</span>
          </div>
          <div class="kv-list">
            <div class="kv-row"><span class="k">Entitas</span><span class="v">Menu ${c.originalDateLabel}</span></div>
            <div class="kv-row"><span class="k">Dikunci</span><span class="v">${c.originalLockedAt}</span></div>
            <div class="kv-row"><span class="k">Oleh</span><span class="v">${c.originalLockedBy}</span></div>
            <div class="kv-row"><span class="k">${c.field}</span><span class="v">${c.was}</span></div>
          </div>
          <div style="margin-top:.6rem"><span class="hash">${c.originalHash}</span></div>
        </div>

        <div class="corr-arrow">${icon('arrowRight')}</div>

        <div class="corr-side new">
          <div class="flex items-center justify-between" style="margin-bottom:.6rem">
            <h4>Entri koreksi</h4>
            <span class="tag-s bg-warning">Menunjuk catatan asli</span>
          </div>
          <div class="kv-list">
            <div class="kv-row"><span class="k">Dikoreksi</span><span class="v">${c.correctedAt}</span></div>
            <div class="kv-row"><span class="k">Oleh</span><span class="v">${c.correctedBy}</span></div>
            <div class="kv-row"><span class="k">Disetujui</span><span class="v">${c.approvedBy}</span></div>
            <div class="kv-row"><span class="k">${c.field}</span><span class="v">${c.now}</span></div>
          </div>
          <div style="margin-top:.6rem"><span class="hash">${c.newHash}</span></div>
          <p class="text-xs muted" style="margin-top:.6rem">Alasan: ${c.reason}</p>
        </div>
      </div>
    </div>`;
  }

  function rows() {
    return MBG.auditTrail.filter(e => {
      const okK = state.kitchen === 'Semua' || e.kitchen === state.kitchen;
      const okA = state.action === 'Semua' || e.action === state.action;
      const okQ = !state.q ||
        (e.entity + ' ' + e.actor + ' ' + e.hash).toLowerCase().indexOf(state.q) !== -1;
      return okK && okA && okQ;
    });
  }

  function paintTable() {
    const list = rows();
    document.getElementById('acount').innerHTML = `<b>${list.length}</b> dari ${MBG.auditTrail.length} entri`;
    document.getElementById('atbody').innerHTML = list.length ? list.map(e => `<tr>
      <td class="sm mono">${e.time}</td>
      <td class="strong">${e.actor}<div class="sm">${e.role}</div></td>
      <td><span class="tag-s ${e.action === 'Koreksi' ? 'bg-warning' : 'bg-success'}">${e.action}</span></td>
      <td>${e.entity}<div class="sm">${e.summary}</div></td>
      <td class="sm">${e.kitchen}</td>
      <td class="sm">${e.source}</td>
      <td><span class="hash">${e.hash.slice(0, 10)}…</span>${e.ref ? `<div class="sm" style="margin-top:.2rem">→ ${e.ref.slice(0, 10)}…</div>` : ''}</td>
    </tr>`).join('') : `<tr><td colspan="7" class="sm">Tidak ada entri yang cocok.</td></tr>`;
  }

  function render(el) {
    state.host = el;
    const kitchens = ['Semua'].concat(MBG.kitchens.map(k => k.name));

    el.innerHTML = spotlight() + `
      <div class="i-card">
        <h3>${icon('grid')} Riwayat aktivitas</h3>
        <div class="fbar">
          <select class="sel" id="fk" style="width:auto">
            ${kitchens.map(k => `<option>${k}</option>`).join('')}
          </select>
          <select class="sel" id="fa" style="width:auto">
            ${['Semua'].concat(MBG.auditActions).map(a => `<option>${a}</option>`).join('')}
          </select>
          <div class="grow search-box">
            ${icon('search')}
            <input type="search" id="fq" placeholder="Cari entitas, pelaku, atau sidik isi…" aria-label="Cari jejak audit">
          </div>
          <span class="fcount" id="acount"></span>
        </div>
        <div class="dt-wrap">
          <table class="dt">
            <thead><tr>
              <th>Waktu</th><th>Pelaku</th><th>Aksi</th><th>Entitas</th><th>Dapur</th><th>Sumber data</th><th>Sidik isi</th>
            </tr></thead>
            <tbody id="atbody"></tbody>
          </table>
        </div>
      </div>`;

    el.querySelector('#fk').addEventListener('change', (e) => { state.kitchen = e.target.value; paintTable(); });
    el.querySelector('#fa').addEventListener('change', (e) => { state.action = e.target.value; paintTable(); });
    el.querySelector('#fq').addEventListener('input', (e) => {
      state.q = e.target.value.toLowerCase().trim(); paintTable();
    });

    paintTable();
  }

  Internal.mount({
    page: 'audit',
    title: 'Jejak Audit',
    sub: 'Setiap penguncian, koreksi, unggahan, tinjauan, dan penerbitan — dengan pelaku, sumber data, dan sidik isinya.',
    render,
  });
})();
