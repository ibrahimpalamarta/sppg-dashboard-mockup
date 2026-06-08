/* ============================================================
   MBG Dashboard — Stylized Indonesia map with status pins
   ============================================================ */
(function () {
  const Map = {};

  // simplified stylized archipelago (not geographically exact) on a 0..100 x 0..80 canvas
  const ISLANDS = `
    <g class="map-islands" fill="var(--brand-lilac)" stroke="#D9CCEF" stroke-width="0.4">
      <!-- Sumatra -->
      <path d="M10 14 Q14 16 16 22 L22 34 Q26 42 30 48 Q31 52 28 53 Q24 50 21 44 L14 30 Q10 22 8 17 Q8 14 10 14 Z"/>
      <!-- Kalimantan -->
      <path d="M40 30 Q52 27 58 32 Q62 38 58 46 Q52 54 44 52 Q36 50 35 42 Q34 33 40 30 Z"/>
      <!-- Sulawesi -->
      <path d="M64 30 Q68 30 67 36 Q70 40 68 44 Q66 48 64 46 Q65 41 62 40 Q66 38 63 34 Q62 31 64 30 Z"/>
      <!-- Papua -->
      <path d="M80 36 Q92 34 95 40 Q96 46 90 48 Q83 50 80 45 Q78 39 80 36 Z"/>
      <!-- Java -->
      <path d="M48 66 Q58 64 70 67 Q77 68 78 71 Q76 74 70 73 Q58 71 50 72 Q46 71 48 66 Z"/>
      <!-- Bali / Nusa Tenggara -->
      <circle cx="81" cy="71" r="1.6"/><circle cx="85" cy="72" r="1.4"/><circle cx="89" cy="72.5" r="1.2"/>
      <!-- Maluku -->
      <circle cx="74" cy="44" r="1.4"/><circle cx="76" cy="50" r="1.2"/>
    </g>`;

  Map.render = function (mount) {
    const units = MBG.units;
    const pins = units.map(u => {
      const colorClass = u.status === 'AKTIF' ? 'pin-aktif' : 'pin-prep';
      return `<button class="map-pin ${colorClass}" style="left:${u.map.x}%;top:${u.map.y / 80 * 100}%"
        data-slug="${u.slug}" aria-label="${u.name}">
        <span class="mp-dot"></span><span class="mp-ring"></span>
      </button>`;
    }).join('');

    mount.innerHTML = `
      <div class="map-canvas">
        <svg viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet" class="map-svg" aria-hidden="true">
          ${ISLANDS}
          <!-- region highlight rings -->
          <circle cx="16" cy="30" r="9" class="map-region"/>
          <circle cx="63" cy="71" r="9" class="map-region"/>
          <text x="16" y="46" text-anchor="middle" class="map-region-l">Sumatera Utara</text>
          <text x="63" y="60" text-anchor="middle" class="map-region-l">Jawa Timur</text>
        </svg>
        <div class="map-pins">${pins}</div>
        <div class="map-pop" id="map-pop" hidden></div>
      </div>`;

    const pop = mount.querySelector('#map-pop');
    mount.querySelectorAll('.map-pin').forEach(pin => {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        const u = MBG.unitBySlug(pin.dataset.slug);
        showPop(pop, pin, u);
      });
      pin.addEventListener('mouseenter', () => {
        const u = MBG.unitBySlug(pin.dataset.slug);
        showPop(pop, pin, u);
      });
    });
    mount.querySelector('.map-canvas').addEventListener('mouseleave', () => { pop.hidden = true; });
  };

  function showPop(pop, pin, u) {
    const active = u.status === 'AKTIF';
    pop.innerHTML = `
      <div class="mpop-head">
        <strong>${u.name}</strong>
        <span class="badge ${active ? 'badge-aktif' : 'badge-persiapan'}">${u.status}</span>
      </div>
      <div class="mpop-loc">${icon('pin')} ${u.area}, ${u.province}</div>
      <div class="mpop-stats">
        <div><div class="v num">${active ? UI.fmt(u.stats.porsiHariIni) : '—'}</div><div class="l">Porsi hari ini</div></div>
        <div><div class="v num">${active ? UI.fmt(u.stats.pmHarian) : '—'}</div><div class="l">PM / hari</div></div>
      </div>
      <a class="btn btn-purple btn-sm btn-block" href="unit.html?u=${u.slug}">Buka dashboard ${icon('arrowRight')}</a>`;
    pop.style.left = pin.style.left;
    pop.style.top = pin.style.top;
    pop.hidden = false;
  }

  window.MapView = Map;
})();
