/* ============================================================
   MBG Dashboard — Inline SVG icon set (no dependency)
   Usage: icon('name')  ->  returns <svg> string
   Stroke style, 24x24 viewBox, currentColor.
   ============================================================ */
(function () {
  const P = {
    calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    school: '<path d="M22 9 12 4 2 9l10 5 10-5Z"/><path d="M6 11v5a6 3 0 0 0 12 0v-5"/>',
    cross: '<path d="M12 3v18M3 12h18"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z"/>',
    truck: '<path d="M14 17V5a1 1 0 0 0-1-1H2v13h2"/><path d="M14 8h5l3 3v6h-3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    badge: '<path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 14 3-4 4 3 5-7"/>',
    pie: '<path d="M21 12A9 9 0 1 1 12 3v9Z"/><path d="M22 12A10 10 0 0 0 12 2v10Z" opacity=".4"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-5 6-9 16-9 0 8-4 13-9 13Z"/><path d="M4 21c2-4 5-7 9-9"/>',
    utensils: '<path d="M4 3v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3M6 12v9M16 3c-2 0-3 2-3 5s1 4 3 4v9"/>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    quote: '<path d="M10 11H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2Zm0 0c0 3-1 4-3 5M20 11h-4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2Zm0 0c0 3-1 4-3 5"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
    sheet: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/>',
    sparkles: '<path d="M12 3l1.8 4.8L18 9.6l-4.2 1.8L12 16l-1.8-4.6L6 9.6l4.2-1.8Z"/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8Z"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
    chevronRight: '<path d="m9 6 6 6-6 6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    coins: '<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3M3 12v5c0 1.7 2.7 3 6 3"/><ellipse cx="15" cy="14" rx="6" ry="3"/><path d="M21 14v5c0 1.7-2.7 3-6 3"/>',
    trendUp: '<path d="m3 17 6-6 4 4 8-8"/><path d="M17 7h4v4"/>',
    handshake: '<path d="m11 17 2 2a1 1 0 0 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 0 0 3-3l-3.9-3.9a2 2 0 0 0-2.8 0l-1.6 1.6a2 2 0 0 1-2.8 0l-.6-.6a2 2 0 0 1 0-2.8l2.4-2.4A4 4 0 0 1 16 5.3"/><path d="m21 4-2.5 2.5M3 14l4.5-4.5a2 2 0 0 1 2.8 0L13 12"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
    droplet: '<path d="M12 2.7 6.5 9a7.5 7.5 0 1 0 11 0Z"/>',
    flame: '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-3-9 0 0-3 1-4 4-1-2-1-4-1-6-3 2-6 5-6 11a7 7 0 0 0 7 7Z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5Z"/>',
    apple: '<path d="M12 8c-2-3-6-3-7 0-1 4 2 12 4 12 1 0 1.5-.7 3-.7s2 .7 3 .7c2 0 5-8 4-12-1-3-5-3-7 0Z"/><path d="M12 8c0-3 1-4 3-5"/>',
    milk: '<path d="M8 2h8M8 2v3l-2 4v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9l-2-4V2"/><path d="M6 12h12"/>',
    wheat: '<path d="M12 22V8M12 8c0-2 1-3 3-3 0 2-1 3-3 3Zm0 0c0-2-1-3-3-3 0 2 1 3 3 3Zm0 5c0-2 1-3 3-3 0 2-1 3-3 3Zm0 0c0-2-1-3-3-3 0 2 1 3 3 3Z"/>',
    scale: '<path d="M12 3v18M7 21h10M6 7l-3 6a3 3 0 0 0 6 0Zm12 0-3 6a3 3 0 0 0 6 0ZM6 7h12M6 7 4 5m14 2 2-2"/>',
    shield: '<path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5Z"/><path d="m9 12 2 2 4-4"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    map: '<path d="m9 4-6 2v15l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v15M15 6v15"/>',
    play: '<path d="m6 4 14 8-14 8Z"/>',
    star: '<path d="m12 3 2.5 5.5L20 9.3l-4 3.9 1 5.8-5-2.8-5 2.8 1-5.8-4-3.9 5.5-.8Z"/>',
    seedling: '<path d="M12 21V11M12 11C12 7 9 5 4 5c0 4 3 6 8 6Zm0 0c0-3 2-5 7-5 0 3-2 5-7 5Z"/>',
    factory: '<path d="M2 21h20M4 21V9l5 3V9l5 3V9l5 3v9M9 13h.01M14 13h.01M9 17h.01M14 17h.01"/>',
    thermometer: '<path d="M14 14V5a2 2 0 1 0-4 0v9a4 4 0 1 0 4 0Z"/>',
    clipboard: '<rect x="6" y="4" width="12" height="18" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 12h6M9 16h6"/>',
    location: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    fingerprint: '<path d="M12 10a2 2 0 0 1 2 2c0 3-.5 5-1 7"/><path d="M8.5 12a3.5 3.5 0 0 1 7 0c0 4-1 6-1.5 8"/><path d="M5 12a7 7 0 0 1 14 0c0 2-.3 4-.8 6"/><path d="M5.5 17c.3-1.5.5-3 .5-5"/>',
    filter: '<path d="M3 4h18l-7 8v7l-4 2v-9Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
    arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    minus: '<path d="M5 12h14"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    flow: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6a3 3 0 0 1 3 3v6"/>',
  };

  window.icon = function (name, cls) {
    const path = P[name] || P.info;
    return `<svg class="ic-svg ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  };

  /* CSS-mask data-uri for the locked-nav glyph */
  document.documentElement.style.setProperty('--lock-ic',
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'%3E%3Crect x='4' y='11' width='16' height='10' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 8 0v4'/%3E%3C/svg%3E")`);
})();
