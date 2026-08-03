/* ============================================================
   MBG Dashboard — Mock data layer (single source of truth)
   Scoped against PRD_MERGED.md
   - 3 SPPG kitchens, Malang Raya (PRD_MERGED §2.3, C-01)
   - 9 nutrients × 6 recipient segments vs versioned AKG (§4.3)
   - Locked records w/ fingerprint + append-only corrections (§4.1, §4.2)
   All values are SIMULATED. Structured to follow Permenkes 28/2019
   and Tabel Komposisi Pangan Indonesia — not copies of those tables.
   ============================================================ */
(function () {

  /* ============================================================
     1. NUTRIENTS (§4.3) — the nine scored nutrients
     ============================================================ */
  const nutrients = [
    { key: 'energi',   label: 'Energi',      unit: 'kkal', dec: 0 },
    { key: 'protein',  label: 'Protein',     unit: 'g',    dec: 1 },
    { key: 'lemak',    label: 'Lemak',       unit: 'g',    dec: 1 },
    { key: 'karbo',    label: 'Karbohidrat', unit: 'g',    dec: 1 },
    { key: 'serat',    label: 'Serat',       unit: 'g',    dec: 1 },
    { key: 'kalsium',  label: 'Kalsium',     unit: 'mg',   dec: 0 },
    { key: 'besi',     label: 'Zat besi',    unit: 'mg',   dec: 1 },
    { key: 'vitA',     label: 'Vitamin A',   unit: 'mcg',  dec: 0 },
    { key: 'zinc',     label: 'Zinc',        unit: 'mg',   dec: 1 },
  ];
  const NKEYS = nutrients.map(n => n.key);

  /* ============================================================
     2. AKG REFERENCE TABLE (§4.5, §6.6)
     Versioned data. Thresholds are computed from `targetPct`,
     never hard-coded — adequacy policy is changed here.
     ============================================================ */
  const akg = {
    version: 'v1.2',
    effectiveDate: '1 Juni 2026',
    source: 'Permenkes No. 28 Tahun 2019 (struktur)',
    status: 'Aktif',
    updatedAt: '28 Mei 2026, 14:20 WIB',
    updatedBy: 'Rina Kusumaningrum',
    simulated: true,
    /* daily requirement per segment + share of daily AKG one meal targets */
    segments: [
      { id: 'balita',    label: 'Balita',          sub: '1–3 tahun',   targetPct: 30,
        daily: { energi: 1350, protein: 20, lemak: 45, karbo: 215, serat: 19, kalsium: 650,  besi: 7,  vitA: 400,  zinc: 3 } },
      { id: 'sd-awal',   label: 'SD kelas awal',   sub: '4–6 tahun',   targetPct: 30,
        daily: { energi: 1400, protein: 25, lemak: 50, karbo: 220, serat: 20, kalsium: 1000, besi: 10, vitA: 450,  zinc: 5 } },
      { id: 'sd-akhir',  label: 'SD kelas akhir',  sub: '7–9 tahun',   targetPct: 30,
        daily: { energi: 1650, protein: 40, lemak: 55, karbo: 250, serat: 23, kalsium: 1000, besi: 10, vitA: 500,  zinc: 5 } },
      { id: 'smp',       label: 'SMP',             sub: '10–12 tahun', targetPct: 30,
        daily: { energi: 2000, protein: 50, lemak: 65, karbo: 300, serat: 28, kalsium: 1200, besi: 8,  vitA: 600,  zinc: 8 } },
      { id: 'ibu-hamil', label: 'Ibu hamil',       sub: 'trimester 2', targetPct: 30,
        daily: { energi: 2600, protein: 70, lemak: 75, karbo: 385, serat: 36, kalsium: 1200, besi: 18, vitA: 900,  zinc: 14 } },
      { id: 'ibu-menyusui', label: 'Ibu menyusui', sub: '0–6 bulan',   targetPct: 30,
        daily: { energi: 2600, protein: 80, lemak: 77, karbo: 385, serat: 37, kalsium: 1200, besi: 9,  vitA: 1050, zinc: 15 } },
    ],
    /* band thresholds — read by Nutrition.band() */
    bands: { cukup: 90, perhatian: 70 },
    history: [
      { version: 'v1.2', date: '1 Jun 2026',  by: 'Rina Kusumaningrum', note: 'Penyesuaian target serat & kalsium segmen SD.' },
      { version: 'v1.1', date: '3 Mar 2026',  by: 'Rina Kusumaningrum', note: 'Penambahan segmen ibu menyusui (0–6 bulan).' },
      { version: 'v1.0', date: '12 Jan 2026', by: 'Dwi Hartanto',       note: 'Tabel acuan awal, mengikuti struktur Permenkes 28/2019.' },
    ],
  };

  /* ============================================================
     3. FOOD COMPOSITION (TKPI-structured, per 100 g) — simulated
     Menu nutrition is COMPUTED from these, never hand-entered.
     ============================================================ */
  const tkpi = {
    'Nasi putih':            { kat: 'karbo',  n: { energi: 130, protein: 2.4,  lemak: 0.2,  karbo: 28.6, serat: 0.4, kalsium: 10,  besi: 0.3, vitA: 0,   zinc: 0.5 } },
    'Nasi merah':            { kat: 'karbo',  n: { energi: 122, protein: 2.6,  lemak: 0.9,  karbo: 25.6, serat: 1.8, kalsium: 12,  besi: 0.5, vitA: 0,   zinc: 0.7 } },
    'Nasi jagung':           { kat: 'karbo',  n: { energi: 126, protein: 3.1,  lemak: 1.1,  karbo: 26.2, serat: 2.1, kalsium: 14,  besi: 0.6, vitA: 30,  zinc: 0.8 } },
    'Kentang kukus':         { kat: 'karbo',  n: { energi: 87,  protein: 2.0,  lemak: 0.1,  karbo: 20.1, serat: 1.8, kalsium: 11,  besi: 0.8, vitA: 2,   zinc: 0.3 } },
    'Telur balado':          { kat: 'hewani', n: { energi: 190, protein: 12.5, lemak: 13.5, karbo: 3.0,  serat: 0.5, kalsium: 60,  besi: 2.0, vitA: 620, zinc: 1.2 } },
    'Ayam bumbu kuning':     { kat: 'hewani', n: { energi: 205, protein: 21.0, lemak: 12.0, karbo: 2.0,  serat: 0.3, kalsium: 24,  besi: 1.3, vitA: 90,  zinc: 1.8 } },
    'Ikan lele goreng':      { kat: 'hewani', n: { energi: 178, protein: 18.5, lemak: 10.5, karbo: 1.0,  serat: 0,   kalsium: 62,  besi: 1.1, vitA: 60,  zinc: 1.1 } },
    'Ikan tongkol suwir':    { kat: 'hewani', n: { energi: 168, protein: 22.0, lemak: 7.5,  karbo: 1.5,  serat: 0.2, kalsium: 45,  besi: 1.6, vitA: 40,  zinc: 1.0 } },
    'Telur dadar sayur':     { kat: 'hewani', n: { energi: 175, protein: 11.8, lemak: 12.2, karbo: 3.5,  serat: 0.7, kalsium: 68,  besi: 1.9, vitA: 540, zinc: 1.1 } },
    'Tempe orek':            { kat: 'nabati', n: { energi: 210, protein: 18.5, lemak: 10.5, karbo: 12.0, serat: 3.0, kalsium: 160, besi: 3.5, vitA: 10,  zinc: 1.6 } },
    'Tahu bacem':            { kat: 'nabati', n: { energi: 148, protein: 12.0, lemak: 8.0,  karbo: 7.5,  serat: 1.2, kalsium: 210, besi: 2.6, vitA: 5,   zinc: 1.1 } },
    'Tempe mendoan':         { kat: 'nabati', n: { energi: 224, protein: 16.0, lemak: 13.0, karbo: 13.5, serat: 2.6, kalsium: 140, besi: 3.1, vitA: 8,   zinc: 1.4 } },
    'Perkedel tahu':         { kat: 'nabati', n: { energi: 165, protein: 10.5, lemak: 9.5,  karbo: 9.0,  serat: 1.4, kalsium: 180, besi: 2.2, vitA: 20,  zinc: 1.0 } },
    'Sayur bening bayam':    { kat: 'sayur',  n: { energi: 40,  protein: 3.0,  lemak: 0.6,  karbo: 6.0,  serat: 2.5, kalsium: 120, besi: 2.8, vitA: 200, zinc: 0.5 } },
    'Tumis kangkung':        { kat: 'sayur',  n: { energi: 52,  protein: 2.6,  lemak: 2.2,  karbo: 5.4,  serat: 2.1, kalsium: 88,  besi: 2.3, vitA: 315, zinc: 0.4 } },
    'Capcay sayur':          { kat: 'sayur',  n: { energi: 58,  protein: 2.2,  lemak: 2.6,  karbo: 6.8,  serat: 2.4, kalsium: 64,  besi: 1.4, vitA: 260, zinc: 0.4 } },
    'Sop wortel buncis':     { kat: 'sayur',  n: { energi: 44,  protein: 1.8,  lemak: 1.2,  karbo: 7.2,  serat: 2.2, kalsium: 46,  besi: 0.9, vitA: 480, zinc: 0.3 } },
    'Urap sayur':            { kat: 'sayur',  n: { energi: 78,  protein: 3.4,  lemak: 4.2,  karbo: 7.0,  serat: 3.1, kalsium: 132, besi: 2.0, vitA: 230, zinc: 0.6 } },
    'Semangka':              { kat: 'buah',   n: { energi: 30,  protein: 0.6,  lemak: 0.2,  karbo: 7.6,  serat: 0.4, kalsium: 7,   besi: 0.2, vitA: 13,  zinc: 0.1 } },
    'Pisang ambon':          { kat: 'buah',   n: { energi: 92,  protein: 1.0,  lemak: 0.3,  karbo: 23.4, serat: 2.6, kalsium: 8,   besi: 0.3, vitA: 3,   zinc: 0.2 } },
    'Jeruk manis':           { kat: 'buah',   n: { energi: 47,  protein: 0.9,  lemak: 0.1,  karbo: 11.8, serat: 2.4, kalsium: 40,  besi: 0.1, vitA: 11,  zinc: 0.1 } },
    'Pepaya':                { kat: 'buah',   n: { energi: 39,  protein: 0.6,  lemak: 0.1,  karbo: 9.8,  serat: 1.8, kalsium: 24,  besi: 0.3, vitA: 55,  zinc: 0.1 } },
    'Melon':                 { kat: 'buah',   n: { energi: 34,  protein: 0.8,  lemak: 0.2,  karbo: 8.2,  serat: 0.9, kalsium: 9,   besi: 0.2, vitA: 169, zinc: 0.2 } },
    'Susu UHT':              { kat: 'susu',   n: { energi: 61,  protein: 3.2,  lemak: 3.3,  karbo: 4.8,  serat: 0,   kalsium: 120, besi: 0.1, vitA: 46,  zinc: 0.4 } },
  };

  const categories = [
    { id: 'karbo',  label: 'Sumber karbohidrat' },
    { id: 'hewani', label: 'Lauk hewani' },
    { id: 'nabati', label: 'Lauk nabati' },
    { id: 'sayur',  label: 'Sayur' },
    { id: 'buah',   label: 'Buah' },
    { id: 'susu',   label: 'Susu' },
  ];

  /* ============================================================
     4. DATE HELPERS — weekdays only (kitchens closed on weekends)
     ============================================================ */
  const DAY_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const MON_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const MON_FULL = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  function fmtDate(isoStr, style) {
    const d = new Date(isoStr + 'T00:00:00');
    if (style === 'long')  return `${DAY_ID[d.getDay()]}, ${d.getDate()} ${MON_FULL[d.getMonth()]} ${d.getFullYear()}`;
    if (style === 'short') return `${d.getDate()} ${MON_ID[d.getMonth()]}`;
    return `${d.getDate()} ${MON_ID[d.getMonth()]} ${d.getFullYear()}`;
  }
  /* N most recent weekdays ending at `endIso`, oldest first */
  function weekdaysBack(endIso, n) {
    const out = [];
    const d = new Date(endIso + 'T00:00:00');
    while (out.length < n) {
      const dow = d.getDay();
      if (dow !== 0 && dow !== 6) out.push(iso(d));
      d.setDate(d.getDate() - 1);
    }
    return out.reverse();
  }

  const LAST_MENU_DATE = '2026-07-21';
  const ASOF = '21 Juli 2026, 09:15 WIB';

  /* ============================================================
     5. DETERMINISTIC PRNG — stable mock data across reloads
     ============================================================ */
  function rng(seed) {
    let s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  /* cheap, stable content fingerprint (§4.1) — NOT cryptographic;
     stands in for the real hash a server would compute */
  function fingerprint(obj) {
    const str = JSON.stringify(obj);
    let h1 = 0x811c9dc5, h2 = 0x01000193;
    for (let i = 0; i < str.length; i++) {
      h1 ^= str.charCodeAt(i); h1 = Math.imul(h1, 16777619) >>> 0;
      h2 = (h2 + str.charCodeAt(i) * (i + 7)) >>> 0; h2 = Math.imul(h2, 2246822519) >>> 0;
    }
    return (h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0')).slice(0, 16);
  }

  /* ============================================================
     6. MENU LIBRARY — component sets; nutrition computed from TKPI
     ============================================================ */
  const menuLibrary = [
    { name: 'Nasi putih · Telur balado · Tempe orek',      items: [['Nasi putih', 150], ['Telur balado', 55], ['Tempe orek', 40], ['Sayur bening bayam', 70], ['Semangka', 100]] },
    { name: 'Nasi putih · Ayam bumbu kuning · Tahu bacem', items: [['Nasi putih', 150], ['Ayam bumbu kuning', 60], ['Tahu bacem', 50], ['Tumis kangkung', 75], ['Pisang ambon', 90]] },
    { name: 'Nasi merah · Ikan lele · Tempe mendoan',      items: [['Nasi merah', 150], ['Ikan lele goreng', 60], ['Tempe mendoan', 45], ['Sop wortel buncis', 80], ['Jeruk manis', 100]] },
    { name: 'Nasi putih · Tongkol suwir · Perkedel tahu',  items: [['Nasi putih', 155], ['Ikan tongkol suwir', 55], ['Perkedel tahu', 45], ['Capcay sayur', 80], ['Pepaya', 100], ['Susu UHT', 100]] },
    { name: 'Nasi jagung · Telur dadar · Tahu bacem',      items: [['Nasi jagung', 150], ['Telur dadar sayur', 60], ['Tahu bacem', 45], ['Urap sayur', 70], ['Melon', 100]] },
    { name: 'Nasi putih · Ayam bumbu kuning · Tempe orek', items: [['Nasi putih', 150], ['Ayam bumbu kuning', 55], ['Tempe orek', 45], ['Capcay sayur', 75], ['Pisang ambon', 85]] },
    { name: 'Kentang kukus · Ikan lele · Perkedel tahu',   items: [['Kentang kukus', 160], ['Ikan lele goreng', 65], ['Perkedel tahu', 45], ['Sop wortel buncis', 80], ['Semangka', 110]] },
    { name: 'Nasi merah · Telur balado · Tahu bacem',      items: [['Nasi merah', 150], ['Telur balado', 55], ['Tahu bacem', 50], ['Tumis kangkung', 70], ['Jeruk manis', 95], ['Susu UHT', 100]] },
  ];

  /* compute one menu's nutrition totals from its components */
  function buildMenu(kitchenCode, dateIso, libIdx, lockMeta) {
    const lib = menuLibrary[libIdx % menuLibrary.length];
    const components = lib.items.map(([name, gram]) => {
      const food = tkpi[name];
      const n = {};
      NKEYS.forEach(k => { n[k] = +(food.n[k] * gram / 100).toFixed(2); });
      return { name, gram, kat: food.kat, katLabel: (categories.find(c => c.id === food.kat) || {}).label, n };
    });
    const total = {};
    NKEYS.forEach(k => { total[k] = +components.reduce((s, c) => s + c.n[k], 0).toFixed(1); });
    const beratTotal = components.reduce((s, c) => s + c.gram, 0);

    const rec = {
      kitchenCode, date: dateIso, name: lib.name,
      components, total, beratTotal,
      lockedAt: lockMeta.at, lockedBy: lockMeta.by, source: lockMeta.source,
    };
    rec.hash = fingerprint({ k: kitchenCode, d: dateIso, c: components.map(c => [c.name, c.gram]) });
    return rec;
  }

  /* ============================================================
     7. KITCHENS (§2.3) — 3 units, Malang Raya
     ============================================================ */
  const kitchenCfg = [
    {
      slug: 'Kebonsari', code: 'KDK-01', name: 'SPPG Kebonsari', status: 'BEROPERASI',
      region: 'Kota Malang', district: 'Kebonsari', village: 'Buring', province: 'Jawa Timur',
      address: 'Jl. Ki Ageng Gribig No. 142, Kebonsari, Kota Malang, Jawa Timur 65137',
      lat: -8.0092, lng: 112.6621,
      pic: 'Siti Rahmawati', pm: 2840, capacity: 3000, schools: 12,
      since: '2026-02-16', operatingDays: 108, menuDays: 22, seed: 11, missing: [],
    },
    {
      slug: 'singosari', code: 'SGS-02', name: 'SPPG Singosari', status: 'BEROPERASI',
      region: 'Kabupaten Malang', district: 'Singosari', village: 'Losari', province: 'Jawa Timur',
      address: 'Jl. Raya Randuagung No. 27, Singosari, Kabupaten Malang, Jawa Timur 65153',
      lat: -7.8931, lng: 112.6647,
      pic: 'Bambang Priyanto', pm: 2310, capacity: 2600, schools: 13,
      since: '2026-05-11', operatingDays: 50, menuDays: 20, seed: 23,
      missing: ['2026-07-14', '2026-07-17', '2026-07-20', '2026-07-21'],
    },
    {
      slug: 'kepanjen', code: 'KPJ-03', name: 'SPPG Kepanjen', status: 'PERSIAPAN',
      region: 'Kabupaten Malang', district: 'Kepanjen', village: 'Panggungrejo', province: 'Jawa Timur',
      address: 'Jl. Panji No. 88, Kepanjen, Kabupaten Malang, Jawa Timur 65163',
      lat: -8.1310, lng: 112.5710,
      pic: 'Nurul Aisyah', pm: 0, capacity: 2500, schools: 0,
      since: null, plannedStart: '2026-09-01', operatingDays: 0, menuDays: 0, seed: 31, missing: [],
    },
  ];

  function certsFor(cfg) {
    if (cfg.status !== 'BEROPERASI') return [];
    return [
      { name: 'Laik Higiene Sanitasi Jasaboga', issuer: 'Dinas Kesehatan ' + cfg.region,
        number: `503/SLHS/${cfg.code}/2026`, validUntil: '12 Des 2026', status: 'Aktif' },
      { name: 'Sertifikat Halal', issuer: 'BPJPH',
        number: `ID31${cfg.code.replace('-', '')}0026`, validUntil: '30 Sep 2027', status: 'Aktif' },
    ];
  }

  function schoolsFor(cfg) {
    if (cfg.status !== 'BEROPERASI') return [];
    const r = rng(cfg.seed * 7);
    const types = ['SDN', 'SDN', 'SMPN', 'MI', 'TK'];
    const out = [];
    let left = cfg.pm;
    for (let i = 0; i < cfg.schools; i++) {
      const last = i === cfg.schools - 1;
      const share = last ? left : Math.round(cfg.pm / cfg.schools * (0.75 + r() * 0.5));
      left -= share;
      out.push({
        name: `${types[i % types.length]} ${cfg.district} ${String(i + 1).padStart(2, '0')}`,
        pm: Math.max(share, 40),
        distanceKm: +(1.2 + r() * 8).toFixed(1),
      });
    }
    return out;
  }

  function galleryFor(cfg) {
    if (cfg.status !== 'BEROPERASI') return [];
    const cats = [
      ['bangunan', 'Bangunan dapur'], ['bangunan', 'Area penerimaan bahan'],
      ['masak', 'Area memasak'], ['masak', 'Pengemasan porsi'],
      ['distribusi', 'Muat ompreng ke kendaraan'], ['distribusi', 'Distribusi ke sekolah'],
    ];
    return cats.map((c, i) => ({
      src: `assets/img/gallery/${cfg.slug}-${i + 1}.jpg`,
      category: c[0], title: c[1],
      caption: `${c[1]} — ${cfg.name}. Foto dokumentasi ilustratif.`,
      uploadedAt: '2026-06-18', uploadedBy: cfg.pic,
    }));
  }

  /* build menus per kitchen — a missing date means never locked, so never published */
  function menusFor(cfg) {
    if (cfg.status !== 'BEROPERASI') return [];
    const dates = weekdaysBack(LAST_MENU_DATE, cfg.menuDays + cfg.missing.length);
    const out = [];
    dates.forEach((d, i) => {
      if (cfg.missing.indexOf(d) !== -1) return;
      out.push(buildMenu(cfg.code, d, cfg.seed + i, {
        at: `${fmtDate(d)} 14:32 WIB`, by: cfg.pic, source: 'Unggah berkas (XLSX)',
      }));
    });
    return out;
  }

  const kitchens = kitchenCfg.map(cfg => {
    const active = cfg.status === 'BEROPERASI';
    const menus = menusFor(cfg);
    return {
      slug: cfg.slug, code: cfg.code, name: cfg.name, status: cfg.status,
      region: cfg.region, district: cfg.district, village: cfg.village, province: cfg.province,
      address: cfg.address, lat: cfg.lat, lng: cfg.lng, pic: cfg.pic,
      since: cfg.since, sinceLabel: active ? fmtDate(cfg.since) : null,
      plannedStart: cfg.plannedStart || null,
      plannedStartLabel: cfg.plannedStart ? fmtDate(cfg.plannedStart) : null,
      pm: cfg.pm, capacity: cfg.capacity, schoolCount: cfg.schools,
      utilization: active ? Math.round(cfg.pm / cfg.capacity * 100) : null,
      operatingDays: cfg.operatingDays,
      porsiKumulatif: cfg.operatingDays * cfg.pm,
      certs: certsFor(cfg),
      schools: schoolsFor(cfg),
      gallery: galleryFor(cfg),
      menus,
      menuDates: menus.map(m => m.date),
      missingDates: cfg.missing,
    };
  });

  const kitchenBySlug = (s) => kitchens.find(k => k.slug === s);
  const kitchenByCode = (c) => kitchens.find(k => k.code === c);
  const activeKitchens = () => kitchens.filter(k => k.status === 'BEROPERASI');

  /* ============================================================
     8. PROGRAM AGGREGATES — derived, never hand-typed
     ============================================================ */
  const program = {
    asOf: ASOF,
    asOfDate: LAST_MENU_DATE,
    totalKitchens: kitchens.length,
    operating: activeKitchens().length,
    preparing: kitchens.filter(k => k.status === 'PERSIAPAN').length,
    pmPerDay: activeKitchens().reduce((s, k) => s + k.pm, 0),
    capacityTotal: kitchens.reduce((s, k) => s + k.capacity, 0),
    schoolsServed: activeKitchens().reduce((s, k) => s + k.schoolCount, 0),
    schoolsRegistered: 34,
    porsiKumulatif: kitchens.reduce((s, k) => s + k.porsiKumulatif, 0),
    operatingDays: Math.max.apply(null, kitchens.map(k => k.operatingDays)),
    region: 'Malang Raya, Jawa Timur',
    ratePerPax: 13000,
  };

  /* ============================================================
     9. AUDIT TRAIL (§4.2, §6.3) — append-only; corrections
        reference the original entry and never overwrite it
     ============================================================ */
  const auditTrail = [];
  let auditSeq = 1;
  function pushAudit(e) {
    auditTrail.push(Object.assign({ id: 'E-' + String(auditSeq++).padStart(4, '0') }, e));
  }

  activeKitchens().forEach(k => {
    k.menus.slice(-6).forEach(m => {
      pushAudit({
        sort: m.date + ' 14:32', time: `${fmtDate(m.date)} 14:32`,
        actor: k.pic, role: 'Supervisor Lapangan',
        action: 'Kunci', entity: `Menu ${fmtDate(m.date)}`,
        summary: `${m.components.length} komponen · ${Math.round(m.total.energi)} kkal`,
        kitchen: k.name, source: 'Unggah berkas (XLSX)', hash: m.hash, ref: null,
      });
    });
  });

  /* the correction spotlight (§6.3) — original preserved, correction appended */
  const kdk = kitchenBySlug('Kebonsari');
  const origMenu = kdk.menus.find(m => m.date === '2026-07-15') || kdk.menus[0];
  const correction = {
    originalDate: origMenu.date,
    originalDateLabel: fmtDate(origMenu.date),
    originalHash: origMenu.hash,
    originalLockedAt: origMenu.lockedAt,
    originalLockedBy: origMenu.lockedBy,
    field: 'Berat porsi — Tempe orek',
    was: '40 gram',
    now: '45 gram',
    reason: 'Salah baca kolom berat pada lembar sumber; dikoreksi sesuai catatan dapur.',
    correctedAt: '16 Juli 2026 09:12 WIB',
    correctedBy: 'Siti Rahmawati',
    approvedBy: 'Rina Kusumaningrum',
  };
  correction.newHash = fingerprint({ ref: origMenu.hash, f: correction.field, v: correction.now });
  pushAudit({
    sort: '2026-07-16 09:12', time: '16 Jul 2026 09:12',
    actor: correction.correctedBy, role: 'Supervisor Lapangan',
    action: 'Koreksi', entity: `Menu ${fmtDate(origMenu.date)}`,
    summary: `${correction.field}: ${correction.was} → ${correction.now}`,
    kitchen: kdk.name, source: 'Input manual', hash: correction.newHash, ref: origMenu.hash,
  });

  [
    { sort: '2026-07-21 07:48', time: '21 Jul 2026 07:48', actor: 'Siti Rahmawati',     role: 'Supervisor Lapangan', action: 'Unggah', entity: 'menu-gizi_KDK-01_2026-07-21.xlsx',   summary: '9 baris · sudah dibersihkan', kitchen: 'SPPG Kebonsari', source: 'Unggah berkas (XLSX)' },
    { sort: '2026-07-21 08:05', time: '21 Jul 2026 08:05', actor: 'Rina Kusumaningrum', role: 'Data Admin',          action: 'Tinjau', entity: 'menu-gizi_KDK-01_2026-07-21.xlsx',   summary: '9 dari 9 baris dikonfirmasi', kitchen: 'SPPG Kebonsari', source: 'Unggah berkas (XLSX)' },
    { sort: '2026-07-20 16:20', time: '20 Jul 2026 16:20', actor: 'Dwi Hartanto',       role: 'CMS Admin',           action: 'Terbit', entity: 'SOP Penerimaan Bahan Baku v2.1',     summary: 'Visibilitas: Publik', kitchen: '—', source: 'Input manual' },
    { sort: '2026-07-18 11:02', time: '18 Jul 2026 11:02', actor: 'Rina Kusumaningrum', role: 'Data Admin',          action: 'Unggah', entity: 'pengeluaran_SGS-02_2026-07-P1.xlsx', summary: '6 kategori biaya', kitchen: 'SPPG Singosari', source: 'Unggah berkas (XLSX)' },
  ].forEach(e => pushAudit(Object.assign({ hash: fingerprint(e), ref: null }, e)));

  auditTrail.sort((a, b) => (a.sort < b.sort ? 1 : -1));
  const auditActions = ['Kunci', 'Koreksi', 'Unggah', 'Tinjau', 'Terbit'];

  /* ============================================================
     10. EXPENSES (§6.4) — internal only. Expenditure, NOT P&L.
     ============================================================ */
  const expenseCategories = [
    'Bahan pangan', 'Tenaga kerja', 'Kemasan & distribusi',
    'Energi & utilitas', 'Pemeliharaan', 'Lainnya',
  ];
  const expensePeriods = ['2026-04-P1', '2026-04-P2', '2026-05-P1', '2026-05-P2', '2026-06-P1', '2026-06-P2', '2026-07-P1'];

  function expensesFor(k) {
    if (k.status !== 'BEROPERASI') return [];
    const r = rng(k.code.charCodeAt(0) * 31 + k.pm);
    const shares = [0.58, 0.19, 0.09, 0.07, 0.04, 0.03];
    return expensePeriods.map((p, pi) => {
      const workingDays = 10;
      const base = k.pm * program.ratePerPax * workingDays * (0.93 + r() * 0.12);
      const rows = expenseCategories.map((c, i) => {
        const source = Math.round(base * shares[i] / 1000) * 1000;
        const adj = (i === 0 && pi === expensePeriods.length - 1) ? 1850000
                  : (i === 3 && pi === expensePeriods.length - 2) ? -420000 : 0;
        return {
          category: c, source, adjustment: adj, total: source + adj,
          reason: adj ? (adj > 0
            ? 'Pembelian tambahan beras akibat kenaikan jumlah penerima manfaat pada minggu kedua.'
            : 'Koreksi tagihan listrik ganda dari periode sebelumnya.') : null,
        };
      });
      const total = rows.reduce((s, x) => s + x.total, 0);
      return {
        period: p, kitchen: k.code, rows, total,
        sourceTotal: rows.reduce((s, x) => s + x.source, 0),
        adjustmentTotal: rows.reduce((s, x) => s + x.adjustment, 0),
        workingDays, pm: k.pm,
        costPerPortion: Math.round(total / (k.pm * workingDays)),
        evidenceNo: `BKT/${k.code}/${p.replace(/-/g, '')}`,
      };
    });
  }
  const expenses = {};
  kitchens.forEach(k => { expenses[k.slug] = expensesFor(k); });

  /* ============================================================
     11. DOCUMENTS (§5.6, §6.7)
     ============================================================ */
  const docCategories = ['SOP', 'Sertifikat', 'Laporan', 'Panduan', 'Kebijakan'];
  const documents = [
    { id: 'D-01', title: 'SOP Penerimaan Bahan Baku',                 cat: 'SOP',        vis: 'Publik',   version: 'v2.1', updated: '2026-07-20', size: '1,8 MB', type: 'PDF',  by: 'Dwi Hartanto',       desc: 'Prosedur pemeriksaan, penimbangan, dan pencatatan bahan baku saat diterima dapur.' },
    { id: 'D-02', title: 'SOP Pengolahan & Pengemasan Porsi',         cat: 'SOP',        vis: 'Publik',   version: 'v1.9', updated: '2026-07-02', size: '2,4 MB', type: 'PDF',  by: 'Dwi Hartanto',       desc: 'Alur memasak, kontrol suhu, pengemasan, dan pelabelan porsi harian.' },
    { id: 'D-03', title: 'SOP Distribusi ke Sekolah',                 cat: 'SOP',        vis: 'Publik',   version: 'v1.4', updated: '2026-06-11', size: '1,2 MB', type: 'PDF',  by: 'Dwi Hartanto',       desc: 'Pemuatan, rute, waktu tempuh maksimum, dan serah terima di sekolah.' },
    { id: 'D-04', title: 'Sertifikat Laik Higiene Sanitasi — KDK-01', cat: 'Sertifikat', vis: 'Publik',   version: 'v1.0', updated: '2026-01-12', size: '640 KB', type: 'PDF',  by: 'Siti Rahmawati',     desc: 'Sertifikat Laik Higiene Sanitasi Jasaboga terbitan Dinkes Kota Malang.' },
    { id: 'D-05', title: 'Sertifikat Halal — KDK-01',                 cat: 'Sertifikat', vis: 'Publik',   version: 'v1.0', updated: '2026-01-28', size: '580 KB', type: 'PDF',  by: 'Siti Rahmawati',     desc: 'Sertifikat halal terbitan BPJPH untuk dapur Kebonsari.' },
    { id: 'D-06', title: 'Laporan Bulanan Operasi — Juni 2026',       cat: 'Laporan',    vis: 'Publik',   version: 'v1.0', updated: '2026-07-05', size: '3,1 MB', type: 'PDF',  by: 'Rina Kusumaningrum', desc: 'Ringkasan porsi terdistribusi, kepatuhan input data, dan skor kecukupan gizi.' },
    { id: 'D-07', title: 'Panduan Pengisian Lembar Menu & Gizi',      cat: 'Panduan',    vis: 'Publik',   version: 'v2.0', updated: '2026-06-01', size: '900 KB', type: 'PDF',  by: 'Rina Kusumaningrum', desc: 'Cara mengisi templat menu-gizi agar terbaca mesin tanpa koreksi manual.' },
    { id: 'D-08', title: 'Kebijakan Keterbukaan Data',                cat: 'Kebijakan',  vis: 'Publik',   version: 'v1.1', updated: '2026-05-20', size: '420 KB', type: 'PDF',  by: 'Dwi Hartanto',       desc: 'Komitmen pencatatan waktu, penanggung jawab, sumber data, dan sidik isi.' },
    { id: 'D-09', title: 'Rekap Pengeluaran Operasional Q2 2026',     cat: 'Laporan',    vis: 'Internal', version: 'v1.2', updated: '2026-07-08', size: '1,6 MB', type: 'XLSX', by: 'Rina Kusumaningrum', desc: 'Rincian biaya per kategori dan per periode untuk seluruh dapur.' },
    { id: 'D-10', title: 'Daftar Kontak Penanggung Jawab Dapur',      cat: 'Kebijakan',  vis: 'Internal', version: 'v1.0', updated: '2026-04-14', size: '210 KB', type: 'DOCX', by: 'Dwi Hartanto',       desc: 'Kontak internal penanggung jawab tiap dapur. Tidak dipublikasikan.' },
  ];
  documents.forEach(d => {
    d.versions = [
      { version: d.version, date: d.updated, by: d.by, note: 'Versi berlaku.' },
      { version: 'v1.0', date: '2026-02-10', by: d.by, note: 'Unggahan awal.' },
    ].filter((v, i) => i === 0 || v.version !== d.version);
  });

  /* ============================================================
     12. USERS (§6.9) & ANNOUNCEMENTS (§5.2, C-10)
     ============================================================ */
  const users = [
    { id: 'U-01', name: 'Siti Rahmawati',     email: 'siti.rahmawati@edufarmers.org', role: 'Supervisor Lapangan', scope: 'SPPG Kebonsari', status: 'Aktif',    lastLogin: '21 Jul 2026 07:41' },
    { id: 'U-02', name: 'Bambang Priyanto',   email: 'bambang.p@edufarmers.org',      role: 'Supervisor Lapangan', scope: 'SPPG Singosari',     status: 'Aktif',    lastLogin: '20 Jul 2026 08:03' },
    { id: 'U-03', name: 'Nurul Aisyah',       email: 'nurul.aisyah@edufarmers.org',   role: 'Supervisor Lapangan', scope: 'SPPG Kepanjen',      status: 'Nonaktif', lastLogin: '02 Jul 2026 10:22' },
    { id: 'U-04', name: 'Rina Kusumaningrum', email: 'rina.k@edufarmers.org',         role: 'Data Admin',          scope: 'Semua dapur',        status: 'Aktif',    lastLogin: '21 Jul 2026 08:00' },
    { id: 'U-05', name: 'Dwi Hartanto',       email: 'dwi.hartanto@edufarmers.org',   role: 'CMS Admin',           scope: 'Semua dapur',        status: 'Aktif',    lastLogin: '20 Jul 2026 16:18' },
    { id: 'U-06', name: 'Agus Wijaya',        email: 'agus.wijaya@edufarmers.org',    role: 'Internal User',       scope: 'Semua dapur',        status: 'Aktif',    lastLogin: '19 Jul 2026 13:55' },
    { id: 'U-07', name: 'Laras Prameswari',   email: 'laras.p@edufarmers.org',        role: 'Super Admin',         scope: 'Semua dapur',        status: 'Aktif',    lastLogin: '21 Jul 2026 09:10' },
  ];

  const announcements = [
    { date: '2026-07-18', title: 'SPPG Kepanjen memasuki tahap uji coba dapur',
      body: 'Dapur ketiga di Malang Raya menyelesaikan pemasangan peralatan dan mulai uji coba produksi terbatas. Rencana operasi penuh 1 September 2026.' },
    { date: '2026-07-05', title: 'Laporan bulanan operasi Juni 2026 telah terbit',
      body: 'Ringkasan porsi terdistribusi, kepatuhan input data, dan skor kecukupan gizi per dapur kini tersedia di halaman Transparansi.' },
    { date: '2026-06-01', title: 'Tabel acuan AKG diperbarui ke versi 1.2',
      body: 'Penyesuaian target serat dan kalsium untuk segmen SD. Skor lama tetap dapat ditelusuri melalui riwayat versi.' },
  ];

  /* ============================================================
     13. INPUT DATA — pre-cleaned upload (PRD_MERGED C-03)
     Data arrives already structured & verified from the desktop
     cleaning step; the workspace performs the second-admin check.
     ============================================================ */
  const inboxFiles = [
    { file: 'menu-gizi_KDK-01_2026-07-21.xlsx',  kitchen: 'KDK-01', type: 'Menu & Gizi',  rows: 9, cleanedBy: 'Siti Rahmawati',   cleanedAt: '21 Jul 2026 07:20', size: '48 KB' },
    { file: 'menu-gizi_SGS-02_2026-07-20.xlsx',  kitchen: 'SGS-02', type: 'Menu & Gizi',  rows: 8, cleanedBy: 'Bambang Priyanto', cleanedAt: '20 Jul 2026 07:35', size: '44 KB' },
    { file: 'pengeluaran_SGS-02_2026-07-P1.xlsx', kitchen: 'SGS-02', type: 'Pengeluaran', rows: 6, cleanedBy: 'Bambang Priyanto', cleanedAt: '18 Jul 2026 10:50', size: '31 KB' },
  ];

  /* rows presented for the second-admin confirmation pass */
  const inboxPreview = [
    { field: 'tanggal',            value: '2026-07-21', rule: 'Tidak boleh melebihi hari ini' },
    { field: 'kode_dapur',         value: 'KDK-01',     rule: 'Harus cocok dengan dapur terdaftar' },
    { field: 'Nasi putih',         value: '150 gram',   rule: 'Kategori: sumber karbohidrat' },
    { field: 'Telur balado',       value: '55 gram',    rule: 'Kategori: lauk hewani' },
    { field: 'Tempe orek',         value: '40 gram',    rule: 'Kategori: lauk nabati' },
    { field: 'Sayur bening bayam', value: '70 gram',    rule: 'Kategori: sayur' },
    { field: 'Semangka',           value: '100 gram',   rule: 'Kategori: buah' },
    { field: 'segmen',             value: 'sd-awal',    rule: 'Kosakata terkendali' },
    { field: 'catatan',            value: '—',          rule: 'Opsional' },
  ];

  /* ============================================================
     14. TEMPLATE DATA DICTIONARY (§6.6)
     ============================================================ */
  const templates = [
    {
      id: 'menu-gizi', name: 'Templat Menu & Gizi', file: 'menu-gizi_v2.xlsx', version: 'v2.0', updated: '1 Jun 2026',
      columns: [
        { col: 'tanggal',     type: 'Tanggal', req: true,  example: '2026-07-21', rule: 'Format YYYY-MM-DD. Tidak boleh melebihi hari ini.' },
        { col: 'kode_dapur',  type: 'Teks',    req: true,  example: 'KDK-01',     rule: 'Harus cocok dengan dapur terdaftar — bila tidak, baris ditolak.' },
        { col: 'nama_item',   type: 'Teks',    req: true,  example: 'Nasi putih', rule: 'Nama komponen porsi.' },
        { col: 'kategori',    type: 'Teks',    req: true,  example: 'karbo',      rule: 'Kosakata terkendali: karbo, hewani, nabati, sayur, buah, susu.' },
        { col: 'berat_gram',  type: 'Angka',   req: true,  example: '150',        rule: 'Satuan setelah angka diabaikan. Format angka Indonesia didukung.' },
        { col: 'energi_kkal', type: 'Angka',   req: false, example: '195',        rule: 'Opsional — bila kosong dihitung dari tabel komposisi pangan.' },
        { col: 'protein_g',   type: 'Angka',   req: false, example: '3,6',        rule: 'Koma sebagai pemisah desimal.' },
        { col: 'lemak_g',     type: 'Angka',   req: false, example: '0,3',        rule: 'Koma sebagai pemisah desimal.' },
        { col: 'karbo_g',     type: 'Angka',   req: false, example: '42,9',       rule: 'Koma sebagai pemisah desimal.' },
        { col: 'serat_g',     type: 'Angka',   req: false, example: '0,6',        rule: 'Koma sebagai pemisah desimal.' },
        { col: 'kalsium_mg',  type: 'Angka',   req: false, example: '15',         rule: '—' },
        { col: 'besi_mg',     type: 'Angka',   req: false, example: '0,5',        rule: '—' },
        { col: 'vita_mcg',    type: 'Angka',   req: false, example: '0',          rule: '—' },
        { col: 'zinc_mg',     type: 'Angka',   req: false, example: '0,8',        rule: '—' },
        { col: 'segmen',      type: 'Teks',    req: true,  example: 'sd-awal',    rule: 'Kosakata terkendali sesuai tabel acuan AKG.' },
        { col: 'catatan',     type: 'Teks',    req: false, example: '—',          rule: 'Bebas.' },
      ],
    },
    {
      id: 'pengeluaran', name: 'Templat Pengeluaran', file: 'pengeluaran_v2.xlsx', version: 'v2.0', updated: '1 Jun 2026',
      columns: [
        { col: 'periode',        type: 'Teks',  req: true,  example: '2026-07-P1',   rule: 'Format YYYY-MM-P1 atau YYYY-MM-P2 (dua periode per bulan).' },
        { col: 'kode_dapur',     type: 'Teks',  req: true,  example: 'SGS-02',       rule: 'Harus cocok dengan dapur terdaftar.' },
        { col: 'kategori_biaya', type: 'Teks',  req: true,  example: 'Bahan pangan', rule: 'Kosakata terkendali: ' + expenseCategories.join(', ') + '.' },
        { col: 'jumlah_rupiah',  type: 'Angka', req: true,  example: 'Rp 214.500.000', rule: 'Awalan "Rp" dan pemisah ribuan diabaikan saat dibaca.' },
        { col: 'penyesuaian',    type: 'Angka', req: false, example: '1.850.000',    rule: 'Boleh negatif. Bila diisi, kolom alasan menjadi wajib.' },
        { col: 'alasan',         type: 'Teks',  req: false, example: 'Pembelian tambahan beras…', rule: 'Wajib bila penyesuaian terisi. Minimal 10 karakter, tidak boleh hanya tanda hubung.' },
        { col: 'nomor_bukti',    type: 'Teks',  req: true,  example: 'BKT/SGS-02/202607P1', rule: 'Harus unik per periode per dapur.' },
      ],
    },
  ];

  /* ============================================================
     15. INTAKE SOURCE READINESS (§6.5)
     ============================================================ */
  const intakeSources = [
    { name: 'Unggah berkas (XLSX)', phase: 'Fase 1', status: 'Tersedia',     note: 'Berkas dibersihkan di aplikasi desktop, diperiksa admin kedua, lalu diunggah.' },
    { name: 'Input manual',         phase: 'Fase 1', status: 'Tersedia',     note: 'Untuk koreksi dan catatan susulan. Selalu tercatat sebagai sumber manual.' },
    { name: 'Endpoint MCP',         phase: 'Fase 2', status: 'Direncanakan', note: 'Adapter baru menulis ke antarmuka yang sama — tanpa mengubah aplikasi berjalan.' },
    { name: 'Adapter Runchise',     phase: 'Fase 2', status: 'Direncanakan', note: 'Tarik data dari sistem operasional dapur bila tersedia.' },
  ];

  /* ============================================================
     EXPORT
     ============================================================ */
  window.MBG = {
    nutrients, NKEYS, akg, tkpi, categories,
    kitchens, kitchenBySlug, kitchenByCode, activeKitchens,
    program, auditTrail, auditActions, correction,
    expenses, expenseCategories, expensePeriods,
    documents, docCategories, users, announcements,
    inboxFiles, inboxPreview, templates, intakeSources,
    menuLibrary, fingerprint, weekdaysBack, fmtDate,
    LAST_MENU_DATE,
    fmt: (n) => Number(n).toLocaleString('id-ID'),
    fmtDec: (n, d) => Number(n).toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d }),
    rupiah: (n) => 'Rp ' + Number(n).toLocaleString('id-ID'),
    placeholder: {
      food: 'assets/img/placeholders/food.svg',
      kitchen: 'assets/img/placeholders/kitchen.svg',
      gallery: 'assets/img/placeholders/gallery.svg',
      portrait: 'assets/img/placeholders/portrait.svg',
      hero: 'assets/img/placeholders/hero.svg',
      recipe: 'assets/img/placeholders/recipe.svg',
    },
  };
})();
