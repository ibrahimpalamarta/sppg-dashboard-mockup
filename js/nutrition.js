/* ============================================================
   MBG Dashboard — Nutrition adequacy scoring engine
   PRD_MERGED §4.3

   One meal targets a defined share (targetPct) of the segment's
   daily AKG. The overall score is the mean of the nine per-nutrient
   percentages, EACH CAPPED AT 100% — so one over-supplied nutrient
   can never mask a deficient one.

   Bands and targets are read from MBG.akg, never hard-coded:
   adequacy policy is changed in Data Acuan, not in this file.
   ============================================================ */
(function () {

  const segments = () => MBG.akg.segments;
  const segmentById = (id) => segments().find(s => s.id === id) || segments()[1];

  /* per-meal target for one segment × one nutrient */
  function target(segment, key) {
    return segment.daily[key] * segment.targetPct / 100;
  }

  /* full per-meal target vector for a segment */
  function targets(segment) {
    const t = {};
    MBG.NKEYS.forEach(k => { t[k] = target(segment, k); });
    return t;
  }

  /* band for an overall score (or a capped per-nutrient percentage) */
  function band(pct) {
    const b = MBG.akg.bands;
    if (pct >= b.cukup) return { id: 'cukup', label: 'Cukup', tone: 'success' };
    if (pct >= b.perhatian) return { id: 'perhatian', label: 'Perlu perhatian', tone: 'warning' };
    return { id: 'kurang', label: 'Kurang', tone: 'danger' };
  }

  /* per-nutrient status — adds the Berlebih state for over-supply */
  function nutrientStatus(pct) {
    if (pct > 100) return { id: 'berlebih', label: 'Berlebih', tone: 'warning' };
    return band(pct);
  }

  /* ------------------------------------------------------------
     score(menu, segmentId) → full evaluation of one portion
     ------------------------------------------------------------ */
  function score(menu, segmentId) {
    const seg = segmentById(segmentId);
    const rows = MBG.nutrients.map(n => {
      const tgt = target(seg, n.key);
      const actual = menu.total[n.key] || 0;
      const raw = tgt > 0 ? (actual / tgt) * 100 : 0;
      const capped = Math.min(raw, 100);
      return {
        key: n.key, label: n.label, unit: n.unit, dec: n.dec,
        actual, target: tgt,
        pct: Math.round(raw),
        capped,
        status: nutrientStatus(Math.round(raw)),
      };
    });
    const overall = Math.round(rows.reduce((s, r) => s + r.capped, 0) / rows.length);
    return {
      segment: seg, rows, overall, band: band(overall),
      targetPct: seg.targetPct,
    };
  }

  /* overall score only — used for lists, charts, comparisons */
  function overallFor(menu, segmentId) {
    return score(menu, segmentId).overall;
  }

  /* scores for every segment — powers the segment selector */
  function allSegments(menu) {
    return segments().map(s => {
      const r = score(menu, s.id);
      return { id: s.id, label: s.label, sub: s.sub, overall: r.overall, band: r.band };
    });
  }

  /* adequacy history across a kitchen's locked menus */
  function history(kitchen, segmentId, n) {
    const menus = kitchen.menus.slice(-(n || 14));
    return menus.map(m => ({
      date: m.date,
      label: MBG.fmtDate(m.date, 'short'),
      value: overallFor(m, segmentId),
    }));
  }

  /* average score across every locked record of a kitchen */
  function averageFor(kitchen, segmentId) {
    if (!kitchen.menus.length) return null;
    const sum = kitchen.menus.reduce((s, m) => s + overallFor(m, segmentId), 0);
    return Math.round(sum / kitchen.menus.length);
  }

  window.Nutrition = {
    segments, segmentById, target, targets, band, nutrientStatus,
    score, overallFor, allSegments, history, averageFor,
    DEFAULT_SEGMENT: 'sd-awal',
  };
})();
