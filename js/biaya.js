/* ============================================================
   Pengeluaran (internal only) — PRD_MERGED §6.4
   Expenditure reporting. NOT P&L — no revenue, margin, or profit
   is computed anywhere (PRD_MERGED C-05).
   ============================================================ */
(function () {
  const state = { kitchen: MBG.activeKitchens()[0].slug, period: null, host: null };

  const periodsFor = (slug) => MBG.expenses[slug] || [];
  function record() {
    const list = periodsFor(state.kitchen);
    return list.find(x => x.period === state.period) || list[list.length - 1];
  }

  function paint() {
    const el = state.host;
    const k = MBG.kitchenBySlug(state.kitchen);
    const list = periodsFor(state.kitchen);
    const r = record();
    state.period = r.period;

    const maxTotal = Math.max.apply(null, r.rows.map(x => Math.abs(x.total)));

    el.innerHTML = `
      <div class="fbar">
        <select class="sel" id="ck" style="width:auto">
          ${MBG.activeKitchens().map(x =>
            `<option value="${x.slug}" ${x.slug === state.kitchen ? 'selected' : ''}>${x.name}</option>`).join('')}
        </select>
        <select class="sel" id="cp" style="width:auto">
          ${list.map(x => `<option value="${x.period}" ${x.period === state.period ? 'selected' : ''}>${x.period}</option>`).join('')}
        </select>
        <span class="fcount">Nomor bukti <b class="mono">${r.evidenceNo}</b></span>
      </div>

      <div class="exp-head">
        <div class="exp-tile">
          <div class="v">${MBG.rupiah(r.total)}</div>
          <div class="l">Total biaya tercatat</div>
          <div class="calc">berkas ${MBG.rupiah(r.sourceTotal)} ${r.adjustmentTotal >= 0 ? '+' : '−'} penyesuaian ${MBG.rupiah(Math.abs(r.adjustmentTotal))}</div>
        </div>
        <div class="exp-tile">
          <div class="v">${MBG.rupiah(r.costPerPortion)}</div>
          <div class="l">Biaya per porsi</div>
          <div class="calc">${MBG.fmt(r.total)} ÷ (${MBG.fmt(r.pm)} × ${r.workingDays})</div>
        </div>
        <div class="exp-tile">
          <div class="v">${r.rows.filter(x => x.adjustment).length}</div>
          <div class="l">Penyesuaian manual</div>
          <div class="calc">wajib disertai alasan ≥ 10 karakter</div>
        </div>
      </div>

      <div class="note" style="margin-bottom:var(--sp-5)">${icon('info')}
        Biaya per porsi adalah <b>batas bawah</b> — hari libur dan ketidakhadiran belum diperhitungkan, sehingga jumlah porsi sesungguhnya bisa lebih kecil dan biaya per porsi lebih tinggi.</div>

      <div class="i-card">
        <h3>${icon('coins')} Biaya per kategori</h3>
        <div class="dt-wrap">
          <table class="dt">
            <thead><tr>
              <th>Kategori</th><th class="num">Dari berkas</th><th class="num">Penyesuaian</th>
              <th class="num">Total</th><th class="num">Proporsi</th><th>Perbandingan</th>
            </tr></thead>
            <tbody>
              ${r.rows.map(x => `<tr>
                <td class="strong">${x.category}${x.reason ? `<div class="sm">${x.reason}</div>` : ''}</td>
                <td class="num">${MBG.rupiah(x.source)}</td>
                <td class="num ${x.adjustment > 0 ? 'tone-warning' : x.adjustment < 0 ? 'tone-danger' : ''}">${x.adjustment ? MBG.rupiah(x.adjustment) : '—'}</td>
                <td class="num strong">${MBG.rupiah(x.total)}</td>
                <td class="num">${Math.round(x.total / r.total * 100)}%</td>
                <td><div class="mini-track"><i style="width:${Math.abs(x.total) / maxTotal * 100}%"></i></div></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="i-card">
        <h3>${icon('trendUp')} Tren pengeluaran</h3>
        <p class="sub">Total biaya tercatat per periode untuk ${k.name}. Periode berjalan disorot.</p>
        ${Charts.line([{ points: list.map(x => Math.round(x.total / 1e6)), color: 'var(--brand-purple)' }], {
          labels: list.map(x => x.period.slice(5)), width: 900, height: 230,
          aria: 'Tren pengeluaran per periode',
        })}
        <p class="text-xs muted" style="margin-top:var(--sp-3)">Satuan sumbu: juta rupiah. Periode berjalan: <b>${r.period}</b>.</p>
      </div>

      ${r.rows.some(x => x.adjustment) ? `<div class="i-card">
        <h3>${icon('alert')} Penyesuaian manual pada periode ini</h3>
        <div class="dt-wrap">
          <table class="dt">
            <thead><tr><th>Kategori</th><th class="num">Jumlah</th><th>Alasan</th></tr></thead>
            <tbody>
              ${r.rows.filter(x => x.adjustment).map(x => `<tr>
                <td class="strong">${x.category}</td>
                <td class="num">${MBG.rupiah(x.adjustment)}</td>
                <td class="sm">${x.reason}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>` : ''}`;

    el.querySelector('#ck').addEventListener('change', (e) => {
      state.kitchen = e.target.value; state.period = null; paint();
    });
    el.querySelector('#cp').addEventListener('change', (e) => {
      state.period = e.target.value; paint();
    });

    UI.observe(el);
  }

  Internal.mount({
    page: 'biaya',
    title: 'Pengeluaran',
    sub: 'Biaya operasional per dapur dan per periode. Tidak ditampilkan di situs publik. Modul ini melaporkan pengeluaran — bukan laba-rugi.',
    render: (el) => { state.host = el; paint(); },
  });
})();
