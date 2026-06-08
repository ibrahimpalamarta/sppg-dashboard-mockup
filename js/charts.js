/* ============================================================
   MBG Dashboard — Hand-rolled SVG charts (no dependency)
   Charts.donut / Charts.line / Charts.bar  -> return SVG string
   ============================================================ */
(function () {
  const C = {};
  const VIZ = ['#5B3E8E', '#ED8B2C', '#2F8A5B', '#7C5CB8', '#F2A93B', '#2F6F8A'];

  function polar(cx, cy, r, deg) {
    const a = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  function arc(cx, cy, r, start, end) {
    const [x1, y1] = polar(cx, cy, r, end);
    const [x2, y2] = polar(cx, cy, r, start);
    const large = end - start <= 180 ? 0 : 1;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 0 ${x2} ${y2}`;
  }

  /* ---------- Donut ---------- */
  C.donut = function (data, opts) {
    opts = opts || {};
    const size = opts.size || 220, sw = opts.stroke || 26, r = (size - sw) / 2, cx = size / 2, cy = size / 2;
    const total = data.reduce((s, d) => s + d.value, 0);
    let acc = 0;
    const segs = data.map((d, i) => {
      const start = acc / total * 360;
      acc += d.value;
      const end = acc / total * 360;
      const color = d.color || VIZ[i % VIZ.length];
      const len = end - start - (total > 0 ? 1.2 : 0); // tiny gap
      return `<path d="${arc(cx, cy, r, start, start + Math.max(0.1, len))}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"
        class="donut-seg" style="--di:${i}"/>`;
    }).join('');
    const center = opts.centerValue != null
      ? `<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-c-v">${opts.centerValue}</text>
         <text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-c-l">${opts.centerLabel || ''}</text>` : '';
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="chart-donut" role="img" aria-label="${opts.aria || 'Donut chart'}">${segs}${center}</svg>`;
  };

  /* ---------- Line + area ---------- */
  C.line = function (series, opts) {
    opts = opts || {};
    const w = opts.width || 640, h = opts.height || 220, pad = { t: 16, r: 16, b: 28, l: 40 };
    const all = series.flatMap(s => s.points);
    const max = Math.max(...all) * 1.1, min = Math.min(...all, 0);
    const n = series[0].points.length;
    const xw = w - pad.l - pad.r, yh = h - pad.t - pad.b;
    const X = i => pad.l + (i / (n - 1)) * xw;
    const Y = v => pad.t + (1 - (v - min) / (max - min)) * yh;

    // grid + y labels
    let grid = '';
    for (let g = 0; g <= 4; g++) {
      const v = min + (max - min) * g / 4;
      const y = Y(v);
      grid += `<line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="chart-axis">${Math.round(v)}</text>`;
    }
    // x labels
    let xlab = '';
    (opts.labels || []).forEach((l, i) => {
      if (n > 8 && i % 2) return;
      xlab += `<text x="${X(i)}" y="${h - 8}" text-anchor="middle" class="chart-axis">${l}</text>`;
    });

    const lines = series.map((s, si) => {
      const color = s.color || VIZ[si % VIZ.length];
      const pts = s.points.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
      const areaId = 'ga' + si + Math.floor(Math.random() * 1e4);
      const area = `${pad.l},${Y(min)} ${pts} ${w - pad.r},${Y(min)}`;
      const dots = s.points.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="3.5" fill="${color}"/>`).join('');
      return `<defs><linearGradient id="${areaId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${color}" stop-opacity=".22"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
        <polygon points="${area}" fill="url(#${areaId})"/>
        <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="chart-line"/>
        ${dots}`;
    }).join('');

    return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="${opts.aria || 'Line chart'}">${grid}${lines}${xlab}</svg>`;
  };

  /* ---------- Horizontal bar (split breakdown) ---------- */
  C.bars = function (data, opts) {
    opts = opts || {};
    const total = data.reduce((s, d) => s + d.value, 0);
    return `<div class="hbars">` + data.map((d, i) => {
      const pct = total > 0 ? (d.value / total * 100) : 0;
      const color = d.color || VIZ[i % VIZ.length];
      return `<div class="hbar-row">
        <div class="hbar-l">${d.label}</div>
        <div class="hbar-track"><div class="hbar-fill" style="width:0;--w:${pct}%;background:${color}"></div></div>
        <div class="hbar-v num">${d.display || (Math.round(pct) + '%')}</div>
      </div>`;
    }).join('') + `</div>`;
  };

  /* animate bars into view */
  C.animateBars = function (scope) {
    (scope || document).querySelectorAll('.hbar-fill').forEach((f, i) => {
      setTimeout(() => { f.style.width = f.style.getPropertyValue('--w'); }, 120 + i * 90);
    });
  };

  window.Charts = C;
})();
