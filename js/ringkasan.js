/* ============================================================
   Ringkasan — program summary (internal) — PRD_MERGED §6.1
   KPIs · data-entry compliance · cross-kitchen adequacy ·
   kitchen comparison · recent activity.
   ============================================================ */
(function () {
  const P = MBG.program;
  const SEG = 'sd-akhir';

  /* compliance: locked working days out of the last N working days */
  function compliance(k) {
    if (k.status !== 'BEROPERASI') return null;
    const expected = k.menus.length + k.missingDates.length;
    const pct = Math.round(k.menus.length / expected * 100);
    return { locked: k.menus.length, expected, pct, missing: k.missingDates };
  }

  function render(el) {
    const active = MBG.activeKitchens();
    const prep = MBG.kitchens.filter(k => k.status !== 'BEROPERASI');

    /* cross-kitchen adequacy: last 10 shared operating days */
    const days = 10;
    const series = active.map((k, i) => ({
      points: Nutrition.history(k, SEG, days).map(x => x.value),
      color: ['var(--viz-1)', 'var(--viz-2)'][i % 2],
      name: k.name,
    }));
    const labels = Nutrition.history(active[0], SEG, days).map(x => x.label);

    el.innerHTML = `
      <div class="i-kpis">
        <div class="i-kpi"><div class="v">${MBG.fmt(P.pmPerDay)}</div><div class="l">Penerima manfaat / hari</div><div class="s">dari ${MBG.fmt(P.capacityTotal)} kapasitas terpasang</div></div>
        <div class="i-kpi"><div class="v">${P.operating} / ${P.totalKitchens}</div><div class="l">Dapur beroperasi</div><div class="s">${P.preparing} dalam persiapan</div></div>
        <div class="i-kpi"><div class="v">${P.schoolsServed}</div><div class="l">Sekolah terlayani</div><div class="s">dari ${P.schoolsRegistered} terdaftar</div></div>
        <div class="i-kpi"><div class="v">${MBG.fmt(P.porsiKumulatif)}</div><div class="l">Porsi kumulatif</div><div class="s">selama ${P.operatingDays} hari operasi</div></div>
      </div>

      <div class="i-card">
        <h3>${icon('check')} Kepatuhan input data</h3>
        <p class="sub">Hari kerja yang catatannya sudah dikunci, dibanding hari kerja pada periode yang sama. Akhir pekan tidak dihitung.</p>
        ${active.map(k => {
          const c = compliance(k);
          const tone = c.pct >= 95 ? 'var(--success)' : c.pct >= 80 ? 'var(--accent-orange)' : 'var(--danger)';
          return `<div class="comp-row">
            <div>
              <div class="nm">${k.name}</div>
              <div class="text-xs muted">${c.locked} dari ${c.expected} hari kerja terkunci</div>
              ${c.missing.length ? `<div class="miss">Belum terkunci: ${c.missing.map(d => MBG.fmtDate(d, 'short')).join(', ')}</div>` : ''}
            </div>
            <div class="track"><i style="width:${c.pct}%;background:${tone}"></i></div>
            <div class="pc" style="color:${tone}">${c.pct}%</div>
          </div>`;
        }).join('')}
        ${prep.map(k => `<div class="note" style="margin-top:var(--sp-4)">${icon('info')}
          <b>${k.name}</b> belum beroperasi, sehingga dikecualikan dari perhitungan kepatuhan dan penilaian gizi. Ini <b>bukan</b> indikasi kinerja buruk.</div>`).join('')}
      </div>

      <div class="i-card">
        <h3>${icon('chart')} Kecukupan gizi antar-dapur</h3>
        <p class="sub">Skor keseluruhan ${days} hari operasi terakhir, dinilai untuk segmen acuan ${Nutrition.segmentById(SEG).label} (${Nutrition.segmentById(SEG).sub}). Kontribusi tiap nutrien dibatasi 100%.</p>
        ${Charts.line(series, {
          labels, width: 900, height: 250, min: 0, max: 110,
          threshold: MBG.akg.bands.cukup, aria: 'Skor kecukupan antar dapur',
        })}
        <div class="chart-legend">
          ${series.map(s => `<span class="lg"><span class="sw" style="background:${s.color}"></span>${s.name}</span>`).join('')}
          <span class="lg muted">Garis putus-putus = ambang cukup (${MBG.akg.bands.cukup}%)</span>
        </div>
      </div>

      <div class="i-card">
        <h3>${icon('grid')} Perbandingan dapur</h3>
        <div class="dt-wrap">
          <table class="dt">
            <thead><tr>
              <th>Dapur</th><th>Status</th><th class="num">PM / hari</th><th class="num">Kapasitas</th>
              <th class="num">Pemanfaatan</th><th class="num">Sekolah</th><th class="num">Skor gizi rata-rata</th>
            </tr></thead>
            <tbody>
              ${MBG.kitchens.map(k => {
                const avg = Nutrition.averageFor(k, SEG);
                const on = k.status === 'BEROPERASI';
                return `<tr>
                  <td class="strong">${k.name}<div class="sm mono">${k.code}</div></td>
                  <td><span class="badge ${on ? 'badge-aktif' : 'badge-persiapan'} badge-plain">${on ? 'Beroperasi' : 'Persiapan'}</span></td>
                  <td class="num">${on ? MBG.fmt(k.pm) : '—'}</td>
                  <td class="num">${MBG.fmt(k.capacity)}</td>
                  <td class="num">${on ? k.utilization + '%' : '—'}</td>
                  <td class="num">${on ? k.schoolCount : '—'}</td>
                  <td class="num">${avg != null ? avg + '%' : '—'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <p class="text-xs muted" style="margin-top:var(--sp-3)">Skor rata-rata dihitung dari seluruh catatan terkunci milik dapur tersebut.</p>
      </div>

      <div class="i-card">
        <h3>${icon('history')} Aktivitas terakhir</h3>
        <div class="dt-wrap">
          <table class="dt">
            <thead><tr><th>Waktu</th><th>Pelaku</th><th>Aksi</th><th>Entitas</th><th>Dapur</th></tr></thead>
            <tbody>
              ${MBG.auditTrail.slice(0, 5).map(e => `<tr>
                <td class="sm mono">${e.time}</td>
                <td class="strong">${e.actor}<div class="sm">${e.role}</div></td>
                <td><span class="tag-s ${e.action === 'Koreksi' ? 'bg-warning' : 'bg-success'}">${e.action}</span></td>
                <td>${e.entity}<div class="sm">${e.summary}</div></td>
                <td class="sm">${e.kitchen}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <a class="btn btn-ghost btn-sm" href="audit.html" style="margin-top:var(--sp-4)">Buka jejak audit lengkap ${icon('arrowRight')}</a>
      </div>`;
  }

  Internal.mount({
    page: 'ringkasan',
    title: 'Ringkasan',
    sub: `Kondisi program per ${P.asOf} · ${P.totalKitchens} dapur di ${P.region}.`,
    render,
  });
})();
