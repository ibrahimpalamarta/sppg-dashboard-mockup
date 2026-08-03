/* ============================================================
   Arsitektur — data-intake architecture (internal) — PRD_MERGED §6.5
   The app never talks to a source directly; every source flows
   through one ingestion interface into one normalized schema.
   ============================================================ */
(function () {
  const OUTPUTS = ['Situs publik', 'Dashboard internal', 'Jejak audit', 'Ekspor laporan'];
  const SCHEMA = ['dapur', 'menu', 'gizi', 'pengeluaran', 'jejak commit'];

  function render(el) {
    el.innerHTML = `
      <div class="i-card">
        <h3>${icon('flow')} Alur masuk data</h3>
        <p class="sub">Aplikasi tidak pernah berbicara langsung dengan sumber mana pun. Semua sumber melewati satu antarmuka masuk, lalu menulis ke satu skema baku.</p>

        <div class="arch">
          <div class="arch-row">
            ${MBG.intakeSources.map(s => `<div class="arch-node">
              ${s.name}<span class="s">${s.phase} · ${s.status}</span>
            </div>`).join('')}
          </div>
          <div class="arch-down">${icon('arrowRight')}</div>
          <div class="arch-node iface">
            Antarmuka masuk (ingestion interface)
            <span class="s">validasi · urai angka lokal · penandaan keyakinan rendah · pencatatan asal data</span>
          </div>
          <div class="arch-down">${icon('arrowRight')}</div>
          <div class="arch-node schema">
            Skema baku
            <span class="s">${SCHEMA.join(' · ')}</span>
          </div>
          <div class="arch-down">${icon('arrowRight')}</div>
          <div class="arch-row">
            ${OUTPUTS.map(o => `<div class="arch-node">${o}</div>`).join('')}
          </div>
        </div>
      </div>

      <div class="i-card">
        <h3>${icon('layers')} Kesiapan sumber data</h3>
        <div class="dt-wrap">
          <table class="dt">
            <thead><tr><th>Sumber</th><th>Fase</th><th>Status</th><th>Catatan</th></tr></thead>
            <tbody>
              ${MBG.intakeSources.map(s => `<tr>
                <td class="strong">${s.name}</td>
                <td>${s.phase}</td>
                <td><span class="tag-s ${s.status === 'Tersedia' ? 'bg-success' : 'bg-warning'}">${s.status}</span></td>
                <td class="sm">${s.note}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="note" style="margin-top:var(--sp-4)">${icon('info')}
          Sumber baru ditambahkan sebagai <b>adapter</b> yang menulis ke antarmuka yang sama — bukan sebagai perubahan pada aplikasi yang sedang berjalan. Karena itu setiap entri audit selalu dapat menyebut asalnya.</div>
      </div>

      <div class="i-card">
        <h3>${icon('shield')} Yang dijamin lapisan ini</h3>
        <div class="principles" style="grid-template-columns:repeat(2,1fr)">
          <div class="principle">${icon('check')}<h4>Satu pintu masuk</h4><p>Tidak ada jalur tulis lain ke basis data. Semua data melewati validasi yang sama.</p></div>
          <div class="principle">${icon('scale')}<h4>Format angka Indonesia</h4><p>Titik ribuan dan koma desimal diurai benar; satuan setelah angka diabaikan.</p></div>
          <div class="principle">${icon('fingerprint')}<h4>Asal data melekat</h4><p>Setiap baris membawa jenis sumber, pelaku, dan waktu — tidak pernah menjadi "data sistem".</p></div>
          <div class="principle">${icon('lock')}<h4>Kunci sekali</h4><p>Setelah dikunci, catatan tidak dapat ditimpa. Koreksi menjadi entri baru.</p></div>
        </div>
      </div>`;
  }

  Internal.mount({
    page: 'arsitektur',
    title: 'Arsitektur',
    sub: 'Bagaimana data masuk ke platform, dan mengapa menambah sumber baru tidak berarti mengubah aplikasi.',
    render,
  });
})();
