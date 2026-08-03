/* ============================================================
   MBG Dashboard — Nested stylized map: Indonesia → Jawa Timur → Malang Raya
   PRD_MERGED §5.2 / §5.3 · C-13: stylized, NOT geographically projected.
   Selection is bidirectional — MapView.select(slug) highlights a pin,
   and clicking a pin fires the onSelect callback.
   ============================================================ */
(function () {
  const Map = {};
  let host = null, onSelect = null, current = null;

  /* ---- level 1: Indonesia, with Jawa Timur called out ---- */
  const INDONESIA = `
    <g class="mm-land">
      <path d="M4,30 L18,26 L26,33 L20,39 L9,38 Z"/>
      <path d="M28,38 L44,34 L52,38 L48,45 L34,45 Z"/>
      <path d="M55,25 L68,22 L74,30 L66,36 L57,33 Z"/>
      <path d="M78,28 L92,26 L96,34 L86,38 L78,35 Z"/>
      <path d="M62,46 L72,44 L76,50 L68,53 Z"/>
    </g>
    <g class="mm-jatim">
      <path d="M44,41 L54,39 L58,44 L50,48 L44,46 Z"/>
    </g>`;

  /* ---- level 2: Jawa Timur, with Malang Raya called out ---- */
  const JATIM = `
    <g class="mm-land">
      <path d="M10,30 L30,22 L52,24 L72,30 L86,42 L74,58 L52,62 L30,56 L14,44 Z"/>
    </g>
    <g class="mm-malang">
      <path d="M44,40 L60,38 L66,48 L56,58 L44,54 Z"/>
    </g>`;

  /* ---- level 3: Malang Raya — the working canvas for pins ---- */
  const MALANG = `
    <g class="mm-land">
      <path d="M18,14 L54,8 L78,20 L86,46 L72,76 L44,88 L20,74 L10,44 Z"/>
    </g>
    <g class="mm-sub">
      <path d="M40,26 L62,22 L66,40 L46,46 Z"/>
      <text x="53" y="35" class="mm-lbl">Kota Malang</text>
      <text x="34" y="66" class="mm-lbl">Kabupaten Malang</text>
    </g>`;

  /* pin positions on the Malang Raya canvas (stylized, not projected) */
  const POS = {
    kedungkandang: { x: 58, y: 38 },
    singosari:     { x: 50, y: 20 },
    kepanjen:      { x: 40, y: 66 },
  };

  function pinColor(k) {
    return k.status === 'BEROPERASI' ? 'var(--success)' : 'var(--warning)';
  }

  function render(el, opts) {
    host = el;
    opts = opts || {};
    onSelect = opts.onSelect || null;

    const pins = MBG.kitchens.map(k => {
      const p = POS[k.slug] || { x: 50, y: 50 };
      return `<g class="mm-pin" data-slug="${k.slug}" transform="translate(${p.x},${p.y})" tabindex="0"
                 role="button" aria-label="${k.name}">
        <circle class="mm-halo" r="7" fill="${pinColor(k)}"/>
        <circle class="mm-dot" r="3.2" fill="${pinColor(k)}"/>
        <text class="mm-name" y="-10" text-anchor="middle">${k.name.replace('SPPG ', '')}</text>
      </g>`;
    }).join('');

    host.innerHTML = `
      <div class="mm">
        <div class="mm-crumb">
          <span class="mm-c">Indonesia</span>${icon('chevronRight')}
          <span class="mm-c">Jawa Timur</span>${icon('chevronRight')}
          <span class="mm-c on">Malang Raya</span>
        </div>
        <div class="mm-mini">
          <svg viewBox="0 0 100 60" aria-label="Indonesia">${INDONESIA}</svg>
          <svg viewBox="0 0 100 80" aria-label="Jawa Timur">${JATIM}</svg>
        </div>
        <svg class="mm-main" viewBox="0 0 100 100" role="img" aria-label="Peta dapur SPPG di Malang Raya">
          ${MALANG}${pins}
        </svg>
        <div class="mm-legend">
          <span class="mml"><i style="background:var(--success)"></i> Beroperasi</span>
          <span class="mml"><i style="background:var(--warning)"></i> Persiapan</span>
          <span class="mml muted">Peta bergaya — bukan proyeksi geografis</span>
        </div>
      </div>`;

    host.querySelectorAll('.mm-pin').forEach(g => {
      const fire = () => { select(g.dataset.slug); if (onSelect) onSelect(g.dataset.slug); };
      g.addEventListener('click', fire);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } });
    });
  }

  /* highlight a pin — called from the kitchen list ("Sorot di peta") */
  function select(slug) {
    if (!host) return;
    current = slug;
    host.querySelectorAll('.mm-pin').forEach(g => g.classList.toggle('on', g.dataset.slug === slug));
  }

  Map.render = render;
  Map.select = select;
  Map.current = () => current;
  window.MapView = Map;
})();
