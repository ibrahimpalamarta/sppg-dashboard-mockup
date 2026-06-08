/* ============================================================
   MBG Dashboard — Mock data (all illustrative for prototype)
   Real anchor facts kept for credibility; fabricated figures
   marked illustrative in the UI. Indonesian copy, English keys.
   ============================================================ */
(function () {
  // ---------- helpers ----------
  const food = (n) => `assets/img/menu/${n}.jpg`;
  const gal = (n) => `assets/img/gallery/${n}.jpg`;
  const por = (n) => `assets/img/people/${n}.jpg`;
  const rec = (n) => `assets/img/recipe/${n}.jpg`;

  // ---------- national / aggregate ----------
  const national = {
    totalKitchens: 6,
    active: 4,
    prep: 2,
    pmPerDay: 3992,        // ~3.992+ PM/hari (3 reporting kitchens) — real anchor
    schoolsServed: 38,
    porsiKumulatif: 412680,
    provinces: 2,
    incentivePerDay: 36,   // Rp juta/day at full operation (real anchor: Rp 36 jt/day)
    operationalRate: 13000,// Rp/pax/hari (real anchor)
    incentiveKitchen: 6,   // Rp juta/hari/kitchen (real anchor)
    zerostuntingAllocation: 248, // Rp juta dialokasikan ke ZeroStunting (illustrative)
    updatedAt: '7 Jun 2026, 08:42 WIB',
  };

  // ---------- partners (org-level) ----------
  const partners = [
    { name: 'Edufarmers', type: 'Penyelenggara', desc: 'Yayasan penyelenggara jaringan dapur SPPG dan program ZeroStunting.' },
    { name: 'Badan Gizi Nasional', short: 'BGN', type: 'Pemerintah', desc: 'Lembaga negara penyelenggara program Makan Bergizi Gratis (MBG).' },
    { name: 'World Food Programme', short: 'WFP', type: 'Lembaga Internasional', desc: 'Dukungan teknis gizi, standar mutu pangan, dan pemantauan dampak.' },
    { name: 'Muhammadiyah', type: 'Organisasi Masyarakat', desc: 'Mitra jejaring sekolah, relawan, dan distribusi di tingkat wilayah.' },
    { name: 'Japfa', type: 'Mitra Industri', desc: 'Pemasok protein hewani dan dukungan rantai pasok komoditas.' },
    { name: 'Google.org', type: 'Donor Teknologi', desc: 'Dukungan filantropi teknologi untuk digitalisasi operasi dapur.' },
  ];

  // ---------- collaboration cards (per-unit, "Berpartner dengan") ----------
  const collaborators = [
    { name: 'Lembaga Riset Pangan', icon: 'sheet', desc: 'Riset formulasi gizi & keamanan pangan lokal.' },
    { name: 'Pusat Inovasi AgriTech', icon: 'seedling', desc: 'Teknologi pertanian & efisiensi rantai pasok.' },
    { name: 'Yayasan Gizi', icon: 'heart', desc: 'Edukasi gizi keluarga & pendampingan balita.' },
    { name: 'Komunitas Petani Muda', icon: 'leaf', desc: 'Pasokan komoditas segar dari petani sekitar.' },
    { name: 'Institut Ketahanan Pangan', icon: 'shield', desc: 'Kajian ketahanan & kemandirian pangan wilayah.' },
    { name: 'Forum Rantai Pasok', icon: 'truck', desc: 'Koordinasi logistik & distribusi antar-mitra.' },
  ];

  // ---------- menu history (shared template, lightly varied per unit) ----------
  const menuLibrary = [
    { name: 'Nasi, Ayam Bumbu Kuning, Tumis Buncis, Pisang, Susu', img: 'ayam-kuning', kalori: 720, protein: 32, lemak: 18, karbo: 98, rating: 4.8 },
    { name: 'Nasi, Ikan Sei Timor, Cah Kangkung, Jeruk, Susu', img: 'ikan-sei', kalori: 690, protein: 34, lemak: 16, karbo: 92, rating: 4.7 },
    { name: 'Nasi, Telur Balado, Sayur Sop, Semangka, Susu', img: 'telur-balado', kalori: 660, protein: 28, lemak: 17, karbo: 95, rating: 4.6 },
    { name: 'Nasi, Tahu Tempe Bacem, Bayam Bening, Pepaya, Susu', img: 'tahu-tempe', kalori: 640, protein: 26, lemak: 14, karbo: 99, rating: 4.5 },
    { name: 'Nasi, Daging Semur, Tumis Labu Siam, Melon, Susu', img: 'daging-semur', kalori: 740, protein: 35, lemak: 20, karbo: 96, rating: 4.9 },
    { name: 'Nasi, Ayam Teriyaki, Capcay, Pisang, Susu', img: 'ayam-teriyaki', kalori: 710, protein: 31, lemak: 19, karbo: 97, rating: 4.7 },
    { name: 'Nasi, Ikan Tongkol Suwir, Urap Sayur, Jeruk, Susu', img: 'tongkol-suwir', kalori: 680, protein: 33, lemak: 15, karbo: 93, rating: 4.6 },
    { name: 'Nasi, Rendang Telur, Tumis Wortel, Pisang, Susu', img: 'rendang-telur', kalori: 705, protein: 29, lemak: 18, karbo: 96, rating: 4.8 },
  ];

  function menuHistory(seed, days) {
    const out = [];
    const base = new Date(2026, 5, 6); // 6 Jun 2026
    for (let i = 0; i < days; i++) {
      const m = menuLibrary[(seed + i) % menuLibrary.length];
      const d = new Date(base); d.setDate(base.getDate() - i);
      out.push({
        ...m,
        date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        img: food(m.img),
      });
    }
    return out;
  }

  const todayComponents = [
    { label: 'Karbohidrat', value: 'Nasi putih', gram: 150, icon: 'wheat' },
    { label: 'Lauk', value: 'Ayam bumbu kuning', gram: 80, icon: 'utensils' },
    { label: 'Pauk', value: 'Tahu goreng', gram: 40, icon: 'box' },
    { label: 'Sayuran', value: 'Tumis buncis', gram: 60, icon: 'leaf' },
    { label: 'Buah', value: 'Pisang ambon', gram: 100, icon: 'apple' },
    { label: 'Susu', value: 'Susu UHT', gram: 200, icon: 'milk' },
  ];

  // ---------- suppliers (per-unit template) ----------
  const supplierBase = [
    { item: 'Beras Premium', cat: 'Karbohidrat', qty: 480, unit: 'kg', supplier: 'Koperasi Tani Makmur', region: 'Malang', thumb: 'wheat' },
    { item: 'Ayam Broiler', cat: 'Protein', qty: 210, unit: 'kg', supplier: 'Japfa Comfeed', region: 'Jawa Timur', thumb: 'utensils' },
    { item: 'Telur Ayam', cat: 'Protein', qty: 1200, unit: 'butir', supplier: 'Peternakan Sumber Rejeki', region: 'Malang', thumb: 'utensils' },
    { item: 'Ikan Tongkol', cat: 'Protein', qty: 160, unit: 'kg', supplier: 'TPI Sendang Biru', region: 'Malang', thumb: 'droplet' },
    { item: 'Bayam Segar', cat: 'Sayuran', qty: 90, unit: 'kg', supplier: 'Kelompok Tani Hijau', region: 'Batu', thumb: 'leaf' },
    { item: 'Buncis', cat: 'Sayuran', qty: 75, unit: 'kg', supplier: 'Petani Mitra Poncokusumo', region: 'Malang', thumb: 'leaf' },
    { item: 'Wortel', cat: 'Sayuran', qty: 110, unit: 'kg', supplier: 'Pasar Tani Karangploso', region: 'Malang', thumb: 'leaf' },
    { item: 'Pisang Ambon', cat: 'Buah-buahan', qty: 1400, unit: 'buah', supplier: 'Gapoktan Buah Sejahtera', region: 'Malang', thumb: 'apple' },
    { item: 'Jeruk Manis', cat: 'Buah-buahan', qty: 95, unit: 'kg', supplier: 'Sentra Jeruk Dau', region: 'Malang', thumb: 'apple' },
    { item: 'Tahu', cat: 'Kacang-kacangan', qty: 70, unit: 'kg', supplier: 'UKM Tahu Sumedang', region: 'Malang', thumb: 'box' },
    { item: 'Tempe', cat: 'Kacang-kacangan', qty: 68, unit: 'kg', supplier: 'Sentra Tempe Sanan', region: 'Malang', thumb: 'box' },
    { item: 'Susu UHT', cat: 'Susu', qty: 1490, unit: 'kotak', supplier: 'Koperasi Susu SAE', region: 'Pujon', thumb: 'milk' },
    { item: 'Minyak Goreng', cat: 'Lainnya', qty: 60, unit: 'liter', supplier: 'Distributor Sembako Jaya', region: 'Malang', thumb: 'droplet' },
    { item: 'Bumbu & Rempah', cat: 'Rempah', qty: 45, unit: 'kg', supplier: 'Pasar Besar Malang', region: 'Malang', thumb: 'flame' },
  ];

  // ---------- testimonials (per-unit template) ----------
  const testimonialBase = [
    { name: 'Putri Anggraini', role: 'Siswa SDN Sukun 1', tag: 'Siswa', quote: 'Makanannya enak dan selalu ada buah. Sekarang aku jarang sakit dan lebih semangat belajar.', avatar: 'siswa-1', highlight: 'Lebih semangat belajar' },
    { name: 'Ibu Sulastri', role: 'Orang Tua Murid', tag: 'Orang Tua', quote: 'Anak saya jadi lebih lahap makan sayur. Program ini sangat membantu keluarga kami.', avatar: 'ortu-1', highlight: 'Anak lebih sehat' },
    { name: 'Bapak Hadi Santoso', role: 'Pemasok Sayur Lokal', tag: 'Supplier', quote: 'Dapur SPPG menyerap hasil panen kami secara rutin. Pendapatan kelompok tani jadi lebih stabil.', avatar: 'supplier-1', highlight: 'Pendapatan tani stabil' },
    { name: 'Ibu Retno Wulandari', role: 'Guru SDN Sukun 2', tag: 'Guru', quote: 'Konsentrasi siswa di kelas meningkat setelah program makan bergizi berjalan.', avatar: 'guru-1', highlight: 'Konsentrasi meningkat' },
    { name: 'Siti Aminah', role: 'Juru Masak SPPG', tag: 'Pekerja SPPG', quote: 'Bangga bisa memasak untuk ribuan anak setiap hari dengan standar kebersihan yang ketat.', avatar: 'pekerja-1', highlight: 'Standar higienis' },
    { name: 'Drs. Bambang Wijaya', role: 'Dinas Pendidikan Kota Malang', tag: 'Pemerintah Daerah', quote: 'Koordinasi data antar-sekolah jauh lebih rapi dan transparan dengan dashboard ini.', avatar: 'gov-1', highlight: 'Data transparan' },
    { name: 'Maria Lopez', role: 'Field Officer WFP', tag: 'Lembaga Internasional', quote: 'Standar gizi dan pencatatan di dapur ini sejalan dengan praktik terbaik internasional.', avatar: 'intl-1', highlight: 'Sesuai standar global' },
  ];

  // ---------- schools (per-unit generator) ----------
  function schools(prefix, n, basePm) {
    const types = ['SD', 'SD', 'SMP', 'TK', 'SMA', 'SMK', 'SD', 'Ponpes', 'SMP'];
    const out = [];
    for (let i = 0; i < n; i++) {
      const siswa = basePm + ((i * 37) % 120) - 40;
      out.push({
        name: `${types[i % types.length]} ${prefix} ${i + 1}`,
        type: types[i % types.length],
        guru: 8 + ((i * 3) % 14),
        siswa: siswa,
        pm: siswa,
        jarakKm: +(1.2 + ((i * 1.7) % 9)).toFixed(1),
        waktu: 6 + ((i * 4) % 22),
      });
    }
    return out;
  }

  function healthFacilities(prefix) {
    return [
      { name: `Posyandu ${prefix} Melati`, type: 'Posyandu', ibuHamil: 18, balita: 64, pm: 82, jarakKm: 2.1, waktu: 9 },
      { name: `Posyandu ${prefix} Mawar`, type: 'Posyandu', ibuHamil: 14, balita: 52, pm: 66, jarakKm: 3.4, waktu: 12 },
      { name: `Puskesmas ${prefix}`, type: 'Puskesmas', ibuHamil: 31, balita: 88, pm: 119, jarakKm: 4.8, waktu: 16 },
    ];
  }

  // ---------- team (role-based, no personal PII) ----------
  function team(area) {
    const slugArea = area.toLowerCase();
    return [
      { name: 'Kepala SPPG', group: 'Manajemen', title: `Kepala Unit SPPG ${area}`, contact: `kepala.sppg.${slugArea}@edufarmers.org`, location: area, spotlight: true },
      { name: 'Ahli Gizi', group: 'Gizi & Mutu', title: 'Nutritionist / Quality Control', contact: `gizi.${slugArea}@edufarmers.org`, location: area },
      { name: 'Koordinator Dapur', group: 'Operasional', title: 'Kitchen Coordinator', contact: `dapur.${slugArea}@edufarmers.org`, location: area },
      { name: 'Koordinator Distribusi', group: 'Operasional', title: 'Distribution Lead', contact: `distribusi.${slugArea}@edufarmers.org`, location: area },
      { name: 'Admin & Pelaporan', group: 'Administrasi', title: 'Data & Reporting Officer', contact: `admin.${slugArea}@edufarmers.org`, location: area },
      { name: 'Penanggung Jawab Higiene', group: 'Gizi & Mutu', title: 'Food Safety Officer (HACCP)', contact: `higiene.${slugArea}@edufarmers.org`, location: area },
    ];
  }

  // ---------- impact (illustrative) ----------
  function impact(area, pm) {
    return {
      sroi: '1 : 3,8',
      sroiNote: 'Setiap Rp 1 yang diinvestasikan menghasilkan estimasi Rp 3,8 nilai sosial.',
      cba: {
        pengertian: 'Analisis Biaya-Manfaat (Cost-Benefit Analysis) membandingkan total biaya program dengan nilai manfaat sosial-ekonomi yang dihasilkan bagi penerima manfaat dan masyarakat sekitar.',
        manfaat: 'Membantu pengambil keputusan menilai efisiensi dan dampak program secara objektif, serta menjadi dasar alokasi surplus operasi MBG ke program ZeroStunting.',
      },
      economicModel: [
        { label: 'Transfer Nilai ke Rumah Tangga', value: 'Rp 1,2 Miliar', icon: 'coins', note: 'Penghematan belanja pangan keluarga / tahun' },
        { label: 'Return on Investment', value: '3,8×', icon: 'trendUp', note: 'Rasio manfaat terhadap biaya' },
        { label: 'Dampak Spillover', value: 'Rp 380 Juta', icon: 'handshake', note: 'Perputaran ekonomi pemasok lokal' },
        { label: 'Peningkatan Kesehatan', value: '+16%', icon: 'heart', note: 'Estimasi penurunan prevalensi kurang gizi' },
        { label: 'Peningkatan Pendapatan', value: '+11%', icon: 'seedling', note: 'Pendapatan petani & UKM mitra' },
      ],
      sdg: [
        { no: 1, label: 'Tanpa Kemiskinan', stat: 'Rp 1,2 M transfer nilai', icon: 'coins', color: '#E5243B' },
        { no: 2, label: 'Tanpa Kelaparan', stat: `${pm.toLocaleString('id-ID')} PM/hari`, icon: 'wheat', color: '#DDA63A' },
        { no: 3, label: 'Kehidupan Sehat', stat: '+16% status gizi', icon: 'heart', color: '#4C9F38' },
        { no: 4, label: 'Pendidikan Berkualitas', stat: '9+ sekolah dilayani', icon: 'book', color: '#C5192D' },
        { no: 5, label: 'Kesetaraan Gender', stat: '62% staf perempuan', icon: 'users', color: '#FF3A21' },
        { no: 8, label: 'Pekerjaan Layak', stat: '38 lapangan kerja', icon: 'handshake', color: '#A21942' },
        { no: 12, label: 'Produksi Bertanggung Jawab', stat: '74% komoditas lokal', icon: 'leaf', color: '#BF8B2E' },
      ],
      theory: [
        { stage: 'Activities', text: 'Produksi & distribusi makan bergizi harian, pengadaan komoditas lokal.' },
        { stage: 'Output', text: `${pm.toLocaleString('id-ID')} porsi/hari, 9+ sekolah, pemasok lokal terserap.` },
        { stage: 'Outcome', text: 'Perbaikan asupan gizi, kehadiran sekolah, pendapatan petani.' },
        { stage: 'Impact', text: 'Penurunan stunting & pendanaan berkelanjutan program ZeroStunting.' },
      ],
      nonQuant: [
        { title: 'Kohesi Sosial', text: 'Gotong royong sekolah, orang tua, dan pemasok di sekitar dapur.' },
        { title: 'Kesadaran Gizi', text: 'Edukasi pola makan seimbang menyebar ke keluarga penerima.' },
        { title: 'Martabat & Kesetaraan', text: 'Akses gizi setara bagi seluruh siswa tanpa memandang latar ekonomi.' },
      ],
      roi: {
        cost: [
          { label: 'Bahan baku & komoditas', value: 62 },
          { label: 'Tenaga kerja dapur', value: 21 },
          { label: 'Logistik & distribusi', value: 10 },
          { label: 'Utilitas & operasional', value: 7 },
        ],
        benefit: [
          { label: 'Transfer nilai rumah tangga', value: 44 },
          { label: 'Nilai kesehatan & gizi', value: 28 },
          { label: 'Perputaran ekonomi lokal', value: 18 },
          { label: 'Nilai pendidikan & kehadiran', value: 10 },
        ],
      },
      monthlyFlow: 'Rp 1,49 Miliar',
      commodity: [
        { item: 'Beras', value: 'Rp 312 Juta', share: '21%' },
        { item: 'Protein hewani', value: 'Rp 468 Juta', share: '31%' },
        { item: 'Sayur & buah', value: 'Rp 358 Juta', share: '24%' },
        { item: 'Susu', value: 'Rp 268 Juta', share: '18%' },
        { item: 'Lainnya', value: 'Rp 84 Juta', share: '6%' },
      ],
      zerostunting: {
        area,
        allocated: area === 'Simalungun' ? 'Rp 58 Juta' : 'Rp 96 Juta',
        note: `Surplus operasi MBG dialokasikan untuk program ZeroStunting wilayah ${area}.`,
      },
    };
  }

  // ---------- recipes ----------
  const recipes = [
    { name: 'Ayam Bumbu Kuning Khas SPPG', chef: 'Kepala SPPG Sukun', kalori: 320, protein: 28, lemak: 12, karbo: 8, waktu: 45, img: rec('ayam-kuning') },
    { name: 'Ikan Sei Timor Panggang', chef: 'Kepala SPPG Simalungun', kalori: 290, protein: 30, lemak: 9, karbo: 6, waktu: 50, img: rec('ikan-sei') },
    { name: 'Tahu Tempe Bacem Manis', chef: 'Koordinator Dapur', kalori: 240, protein: 18, lemak: 10, karbo: 14, waktu: 35, img: rec('tahu-tempe') },
    { name: 'Urap Sayur Tujuh Warna', chef: 'Ahli Gizi SPPG', kalori: 180, protein: 7, lemak: 8, karbo: 16, waktu: 25, img: rec('urap') },
    { name: 'Semur Daging Kentang', chef: 'Kepala SPPG Donomulyo', kalori: 360, protein: 26, lemak: 16, karbo: 20, waktu: 60, img: rec('semur') },
  ];

  // ---------- gallery ----------
  function gallery(slug) {
    const cats = ['dapur', 'masak', 'kemas', 'distribusi'];
    const labels = { dapur: 'Dapur Utama', masak: 'Proses Memasak', kemas: 'Lini Pengemasan', distribusi: 'Distribusi ke Sekolah' };
    const photos = cats.map((c, i) => ({ src: gal(`${slug}-${c}`), cat: c, caption: labels[c] }));
    return {
      photos,
      videos: [{ src: gal(`${slug}-video`), caption: 'Liputan harian operasi dapur' }],
      cams: [
        { label: 'Dapur Utama', tag: 'CAM 1' },
        { label: 'Gudang Bahan', tag: 'CAM 2' },
        { label: 'Area Masak', tag: 'CAM 3' },
        { label: 'Lini Pengemasan', tag: 'CAM 4' },
      ],
    };
  }

  // ---------- unit builder ----------
  function buildUnit(cfg) {
    const active = cfg.status === 'AKTIF';
    const pm = cfg.pm || 0;
    const nSchools = cfg.schools || 9;
    return {
      slug: cfg.slug,
      name: cfg.name,
      status: cfg.status,
      area: cfg.area,
      province: cfg.province,
      address: cfg.address,
      operatingSince: active ? '23 Feb 2026' : '—',
      monthsServing: active ? 3 : 0,
      operatingHours: active ? '05:30 – 14:00 WIB' : 'Belum beroperasi',
      capacity: cfg.capacity,
      scheme: 'Rp 13.000 / pax / hari · Insentif Rp 6 jt / hari',
      mitra: ['Edufarmers', 'BGN', 'WFP'],
      certs: active
        ? { slhs: { status: true, validUntil: '12 Des 2026' }, halal: { status: true, validUntil: '30 Sep 2026' }, haccp: { status: true, validUntil: '18 Mar 2027' } }
        : { slhs: { status: false }, halal: { status: false }, haccp: { status: false } },
      stats: {
        pmHarian: pm,
        sekolah: active ? nSchools : 0,
        posyandu: active ? 3 : 0,
        staf: active ? 24 : 0,
        relawan: active ? 12 : 0,
        supplier: active ? 14 : 0,
        porsiKumulatif: active ? cfg.kumulatif : 0,
        porsiHariIni: active ? pm : 0,
      },
      beneficiaries: active ? {
        total: pm,
        siswa: Math.round(pm * 0.84),
        ibu: Math.round(pm * 0.06),
        balita: pm - Math.round(pm * 0.84) - Math.round(pm * 0.06),
        desc: {
          siswa: 'TK, SD, SMP, SMA/SMK, dan Pondok Pesantren di wilayah layanan.',
          ibu: 'Ibu hamil & menyusui terdaftar di Posyandu mitra.',
          balita: 'Balita di Posyandu untuk pencegahan stunting sejak dini.',
        },
      } : { total: 0, siswa: 0, ibu: 0, balita: 0, desc: {} },
      menuToday: active ? {
        img: food(`${cfg.slug}-today`),
        name: menuLibrary[0].name,
        date: '7 Jun 2026',
        nutrition: { kalori: 720, protein: 32, lemak: 18, karbo: 98 },
        components: todayComponents,
      } : null,
      menuHist: active ? menuHistory(cfg.seed, 8) : [],
      recipes: active ? recipes : [],
      gallery: gallery(cfg.slug),
      testimonials: active ? testimonialBase : [],
      schools: active ? schools(cfg.area, nSchools, cfg.basePm || 160) : [],
      health: active ? healthFacilities(cfg.area) : [],
      suppliers: active ? supplierBase : [],
      collaborators,
      team: active ? team(cfg.area) : [],
      impact: active ? impact(cfg.area, pm) : null,
    };
  }

  const units = [
    buildUnit({ slug: 'sukun', name: 'SPPG Sukun', area: 'Malang', province: 'Jawa Timur', status: 'AKTIF',
      address: 'Jl. S. Supriadi No. 45, Sukun, Kota Malang, Jawa Timur', capacity: '1.600 porsi/hari',
      pm: 1490, schools: 11, basePm: 165, kumulatif: 138420, seed: 0 }),
    buildUnit({ slug: 'donomulyo', name: 'SPPG Donomulyo', area: 'Malang', province: 'Jawa Timur', status: 'AKTIF',
      address: 'Jl. Raya Donomulyo No. 12, Kab. Malang, Jawa Timur', capacity: '1.400 porsi/hari',
      pm: 1212, schools: 9, basePm: 150, kumulatif: 112380, seed: 2 }),
    buildUnit({ slug: 'poncokusumo', name: 'SPPG Poncokusumo', area: 'Malang', province: 'Jawa Timur', status: 'AKTIF',
      address: 'Jl. Raya Poncokusumo No. 88, Kab. Malang, Jawa Timur', capacity: '1.300 porsi/hari',
      pm: 1290, schools: 10, basePm: 158, kumulatif: 119760, seed: 4 }),
    buildUnit({ slug: 'simalungun', name: 'SPPG Simalungun', area: 'Simalungun', province: 'Sumatera Utara', status: 'AKTIF',
      address: 'Jl. Asahan KM 4, Pematang Raya, Simalungun, Sumatera Utara', capacity: '1.200 porsi/hari',
      pm: 1000, schools: 9, basePm: 140, kumulatif: 42120, seed: 1 }),
    buildUnit({ slug: 'lawang', name: 'SPPG Lawang', area: 'Lawang', province: 'Jawa Timur', status: 'PERSIAPAN',
      address: 'Jl. Dr. Cipto No. 7, Lawang, Kab. Malang, Jawa Timur', capacity: '1.300 porsi/hari (rencana)',
      pm: 0, schools: 10, seed: 3 }),
    buildUnit({ slug: 'karangnongko', name: 'SPPG Karangnongko', area: 'Karangnongko', province: 'Jawa Timur', status: 'PERSIAPAN',
      address: 'Jl. Karangnongko Raya No. 21, Kab. Malang, Jawa Timur', capacity: '1.200 porsi/hari (rencana)',
      pm: 0, schools: 9, seed: 5 }),
  ];

  // map coordinates (normalized 0-100 on a simplified Java/Sumatra inset SVG)
  const mapCoords = {
    sukun:        { x: 63.0, y: 70.5 },
    donomulyo:    { x: 61.6, y: 73.2 },
    poncokusumo:  { x: 64.6, y: 71.4 },
    simalungun:   { x: 16.5, y: 30.5 },
    lawang:       { x: 63.4, y: 68.8 },
    karangnongko: { x: 62.2, y: 71.9 },
  };
  units.forEach(u => u.map = mapCoords[u.slug]);

  // ---------- upload page ----------
  const formTypes = [
    'Surat Jalan', 'Pengawasan Pendistribusian', 'Pemeriksaan Bahan Makanan',
    'Pemantauan Suhu Chiller/Freezer', 'Sampel Pertinggal', 'Uji Organoleptik',
    'Inventaris Ompreng', 'Persiapan Bahan Baku',
  ];

  const recentUploads = [
    { file: 'surat_jalan_07jun.xlsx', type: 'Surat Jalan', time: '7 Jun 2026, 08:21', by: 'Admin Sukun', status: 'Tersimpan' },
    { file: 'pengawasan_distribusi_07jun.csv', type: 'Pengawasan Pendistribusian', time: '7 Jun 2026, 08:05', by: 'Pengawas Lapangan', status: 'Tersimpan' },
    { file: 'suhu_chiller_06jun.xlsx', type: 'Pemantauan Suhu Chiller/Freezer', time: '6 Jun 2026, 15:40', by: 'Admin Donomulyo', status: 'Tersimpan' },
    { file: 'organoleptik_06jun.csv', type: 'Uji Organoleptik', time: '6 Jun 2026, 13:12', by: 'Ahli Gizi', status: 'Diproses' },
  ];

  // simulated parse results per form type (column -> dashboard target)
  const parseSamples = {
    'Surat Jalan': {
      columns: ['No', 'Tujuan/Sekolah', 'Jumlah Porsi', 'Jam Kirim', 'Petugas', 'Status'],
      rows: [
        ['001', 'SDN Sukun 1', '165', '06:10', 'Budi', 'Terkirim'],
        ['002', 'SDN Sukun 2', '148', '06:25', 'Budi', 'Terkirim'],
        ['003', 'SMPN Sukun 3', '210', '06:40', 'Sari', 'Terkirim'],
        ['004', 'TK Sukun 4', '92', '06:55', 'Sari', 'Terkirim'],
      ],
      mapping: [
        { col: 'Jumlah Porsi', target: 'A-12 · Total Porsi Hari Ini', conf: 99 },
        { col: 'Tujuan/Sekolah', target: 'E-05 · Distribusi per Sekolah', conf: 98 },
        { col: 'Jam Kirim', target: 'A-04 · Jam Operasional', conf: 92 },
        { col: 'Status', target: 'E-09 · Status Pengiriman', conf: 95 },
      ],
      tiles: ['Total Porsi Hari Ini', 'Distribusi per Sekolah', 'Status Pengiriman'],
    },
    'Pengawasan Pendistribusian': {
      columns: ['Sekolah', 'PM Terlayani', 'Sisa Porsi', 'Waktu Tempuh (mnt)', 'Catatan'],
      rows: [
        ['SDN Sukun 1', '165', '0', '8', 'Lancar'],
        ['SDN Sukun 2', '146', '2', '12', 'Lancar'],
        ['SMPN Sukun 3', '208', '2', '15', 'Lancar'],
      ],
      mapping: [
        { col: 'PM Terlayani', target: 'B-02 · Penerima Manfaat', conf: 99 },
        { col: 'Sekolah', target: 'E-05 · Distribusi per Sekolah', conf: 97 },
        { col: 'Waktu Tempuh (mnt)', target: 'E-07 · Waktu Tempuh', conf: 94 },
      ],
      tiles: ['Penerima Manfaat', 'Distribusi per Sekolah', 'Waktu Tempuh'],
    },
    'Pemantauan Suhu Chiller/Freezer': {
      columns: ['Unit', 'Suhu (°C)', 'Waktu Cek', 'Petugas', 'Status'],
      rows: [
        ['Chiller 1', '3.8', '05:30', 'Andi', 'Normal'],
        ['Freezer 1', '-18.2', '05:30', 'Andi', 'Normal'],
        ['Chiller 2', '4.1', '09:00', 'Andi', 'Normal'],
      ],
      mapping: [
        { col: 'Suhu (°C)', target: 'F-03 · Pemantauan Suhu', conf: 99 },
        { col: 'Status', target: 'F-04 · Status Keamanan Pangan', conf: 96 },
      ],
      tiles: ['Pemantauan Suhu', 'Status Keamanan Pangan'],
    },
    'Pemeriksaan Bahan Makanan': {
      columns: ['Komoditas', 'Jumlah', 'Satuan', 'Pemasok', 'Kondisi'],
      rows: [
        ['Beras Premium', '480', 'kg', 'Koperasi Tani Makmur', 'Baik'],
        ['Ayam Broiler', '210', 'kg', 'Japfa Comfeed', 'Baik'],
        ['Bayam Segar', '90', 'kg', 'Kelompok Tani Hijau', 'Baik'],
      ],
      mapping: [
        { col: 'Komoditas', target: 'D-01 · Manajemen Pemasok', conf: 98 },
        { col: 'Jumlah', target: 'D-02 · Jumlah Komoditas', conf: 99 },
        { col: 'Pemasok', target: 'D-03 · Pemasok Aktif', conf: 97 },
      ],
      tiles: ['Manajemen Pemasok', 'Jumlah Komoditas', 'Pemasok Aktif'],
    },
  };

  // default parse sample for any other form type
  ['Sampel Pertinggal', 'Uji Organoleptik', 'Inventaris Ompreng', 'Persiapan Bahan Baku'].forEach(t => {
    parseSamples[t] = parseSamples['Surat Jalan'];
  });

  window.MBG = {
    national, units, partners, formTypes, recentUploads, parseSamples,
    unitBySlug: (s) => units.find(u => u.slug === s),
    fmt: (n) => n.toLocaleString('id-ID'),
    placeholder: {
      food: 'assets/img/placeholders/food.svg',
      kitchen: 'assets/img/placeholders/kitchen.svg',
      gallery: 'assets/img/placeholders/gallery.svg',
      portrait: 'assets/img/placeholders/portrait.svg',
      hero: 'assets/img/placeholders/hero.svg',
      cam: 'assets/img/placeholders/cam.svg',
      recipe: 'assets/img/placeholders/recipe.svg',
    },
  };
})();
