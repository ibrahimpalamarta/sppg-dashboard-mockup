/* ============================================================
   MBG Dashboard — Unit dashboard (5 tabs, data-driven by ?u=slug)
   ============================================================ */
(function () {
  const slug = new URLSearchParams(location.search).get('u') || 'sukun';
  const u = MBG.unitBySlug(slug) || MBG.units[0];
  const active = u.status === 'AKTIF';
  document.title = `${u.name} — Dashboard MBG`;

  Layout.render({ page: 'unit', unit: u.slug });

  /* ---------- helpers ---------- */
  const fmt = UI.fmt;
  const secHead = (ic, eyebrow, title, intro, accent) => `
    <div class="section-head">
      <div class="chip-head ${accent ? 'accent' : ''}"><span class="ic">${icon(ic)}</span><span class="eyebrow ${accent ? 'accent' : ''}">${eyebrow}</span></div>
      <h3 style="margin-top:.6rem">${title}</h3>
      ${intro ? `<p class="intro">${intro}</p>` : ''}
    </div>`;
  const block = (inner) => `<section class="block reveal">${inner}</section>`;

  /* ---------- sticky unit header ---------- */
  function unitHeader() {
    const badge = active ? 'badge-aktif' : 'badge-persiapan';
    const certs = active
      ? `<span class="cert">${icon('shield')} SLHS</span><span class="cert">${icon('check')} Halal</span><span class="cert">${icon('badge')} HACCP</span>`
      : `<span class="cert off">${icon('clock')} Sertifikasi dalam proses</span>`;
    const mitra = ['Edufarmers', 'BGN', 'WFP'].map((m, i) =>
      `<span class="logo-chip"><span class="lc-mark" style="background:${['#ED8B2C','#2F8A5B','#2F6F8A'][i]}">${m[0]}</span>${m}</span>`).join('');
    document.getElementById('unit-hd-mount').innerHTML = `
      <section class="unit-hd">
        <div class="container container-wide">
          <div class="uh-top">
            <div>
              <div class="flex items-center gap-3 wrap">
                <h1>${u.name}</h1>
                <span class="badge ${badge}">${u.status}</span>
              </div>
              <div class="uh-loc">${icon('location')} Letak Dapur — ${u.area}, ${u.province} · ${u.address}</div>
              <div class="flex gap-2 wrap" style="margin-top:.8rem">${certs}</div>
            </div>
            <div class="uh-mitra">
              <div>
                <div class="ml">Mitra Utama</div>
                <div class="flex gap-2 wrap" style="margin-top:.5rem">${mitra}</div>
              </div>
            </div>
          </div>
        </div>
      </section>`;
  }

  /* ===================== RINGKASAN ===================== */
  function tabRingkasan() {
    if (!active) return emptyState('Ringkasan operasional belum tersedia',
      'Unit ini sedang dalam tahap persiapan. Data operasional harian akan tampil setelah dapur resmi beroperasi.');

    const s = u.stats, b = u.beneficiaries;

    // sorotan operasional
    const tiles = [
      { ic: 'calendar', label: 'Beroperasi Sejak', value: '23 Feb', sub: u.monthsServing + ' bulan melayani' },
      { ic: 'users', label: 'Penerima Manfaat', value: fmt(s.pmHarian), sub: 'per hari' },
      { ic: 'clock', label: 'Jam Operasional', value: '05:30', sub: '– 14:00 WIB' },
      { ic: 'school', label: 'Melayani Sekolah', value: s.sekolah, sub: 'sekolah mitra' },
      { ic: 'cross', label: 'Posyandu / Puskesmas', value: s.posyandu, sub: 'fasilitas kesehatan' },
      { ic: 'users', label: 'Staf SPPG', value: s.staf, sub: '+ ' + s.relawan + ' relawan SPPI' },
      { ic: 'truck', label: 'Jumlah Supplier', value: s.supplier, sub: 'pemasok aktif' },
      { ic: 'box', label: 'Total Porsi', value: fmt(s.porsiKumulatif), sub: 'kumulatif', accent: true },
    ];
    const sorotan = secHead('chart', 'Sorotan Operasional', 'Ikhtisar kinerja harian') +
      `<div class="stat-grid">` + tiles.map(t => `
        <div class="stat-tile ${t.accent ? 'accent' : ''}">
          <div class="st-top"><span class="st-ic">${icon(t.ic)}</span><span class="st-label">${t.label}</span></div>
          <div class="st-value">${t.value}</div><div class="st-sub">${t.sub}</div>
        </div>`).join('') + `</div>`;

    // beneficiary overview (donut)
    const donut = Charts.donut([
      { value: b.siswa, color: '#5B3E8E' },
      { value: b.ibu, color: '#ED8B2C' },
      { value: b.balita, color: '#2F8A5B' },
    ], { centerValue: fmt(b.total), centerLabel: 'Total PM', size: 230, stroke: 30 });
    const cats = [
      { color: '#5B3E8E', name: 'Siswa', val: b.siswa, desc: b.desc.siswa },
      { color: '#ED8B2C', name: 'Ibu Hamil & Menyusui', val: b.ibu, desc: b.desc.ibu },
      { color: '#2F8A5B', name: 'Balita', val: b.balita, desc: b.desc.balita },
    ];
    const bene = secHead('pie', 'Overview Beneficiary', 'Total Penerima Manfaat') + `
      <div class="card card-pad-lg bene">
        <div class="donut-wrap">${donut}</div>
        <div>
          <div class="bene-total"><div class="bt-label">Total Penerima Manfaat</div>
            <div class="bt-val count" data-to="${b.total}">0</div></div>
          <div class="bene-cats">${cats.map(c => `
            <div class="bene-cat"><span class="bc-dot" style="background:${c.color}"></span>
              <div><div class="bc-name">${c.name} · <span class="bc-val">${fmt(c.val)}</span></div>
              <div class="bc-desc">${c.desc}</div></div></div>`).join('')}</div>
        </div>
      </div>`;

    // menu hari ini
    const menu = menuToday(u.menuToday);

    // galeri preview
    const galeri = secHead('image', 'Galeri', 'Dokumentasi dapur & distribusi') + galleryGrid(u.gallery.photos);

    // testimoni
    const testi = testimonials();

    // distribusi
    const distri = distribusi();

    // pemasok
    const pemasok = suppliers();

    // kolaborasi
    const kolab = secHead('handshake', 'Kolaborasi Terbuka', 'Berpartner dengan') +
      `<div class="focus-grid" style="grid-template-columns:repeat(3,1fr)">` + u.collaborators.map(c => `
        <div class="focus-card card-lift">
          <div class="fc-ic">${icon(c.icon)}</div>
          <h4>${c.name}</h4><p>${c.desc}</p>
          <a class="go" style="margin-top:.8rem;display:inline-flex;color:var(--brand-purple);font-weight:600;font-size:var(--fs-sm)" href="#">Lihat detail ${icon('arrowRight')}</a>
        </div>`).join('') + `</div>`;

    // kondisi dapur (cams)
    const cams = kitchenCams();

    return [sorotan, bene, menu, galeri, testi, distri, pemasok, kolab, cams].map(block).join('');
  }

  function menuToday(m) {
    const chips = [
      { ic: 'flame', v: m.nutrition.kalori, l: 'Kalori (kkal)', c: '#ED8B2C', bg: '#FCEAD6' },
      { ic: 'utensils', v: m.nutrition.protein + 'g', l: 'Protein', c: '#5B3E8E', bg: '#E9E2F4' },
      { ic: 'droplet', v: m.nutrition.lemak + 'g', l: 'Lemak', c: '#2F6F8A', bg: '#E1EFF4' },
      { ic: 'wheat', v: m.nutrition.karbo + 'g', l: 'Karbohidrat', c: '#2F8A5B', bg: '#E3F2E9' },
    ];
    return secHead('utensils', 'Menu Hari Ini', m.name, null, true) + `
      <div class="menu-today">
        <div class="menu-photo">${UI.img(m.img, m.name, 'food')}
          <span class="mp-tag badge badge-aktif badge-plain" style="background:#fff;color:var(--brand-purple)">${icon('calendar')} ${m.date}</span></div>
        <div>
          <div class="block-head" style="margin-bottom:1rem"><h3 style="font-size:var(--fs-lg)">Nutrisi per porsi</h3></div>
          <div class="nutri-chips">${chips.map(c => `
            <div class="nutri-chip"><span class="nc-ic" style="background:${c.bg};color:${c.c}">${icon(c.ic)}</span>
              <div><div class="nc-v">${c.v}</div><div class="nc-l">${c.l}</div></div></div>`).join('')}</div>
          <h3 style="font-size:var(--fs-lg);margin:1.4rem 0 .8rem">Komponen Menu</h3>
          <div class="komponen">${m.components.map(k => `
            <div class="komp"><span class="k-ic">${icon(k.icon)}</span>
              <div><div class="k-v">${k.value}</div><div class="k-l">${k.label}</div></div>
              <span class="k-g">${k.gram}g</span></div>`).join('')}</div>
        </div>
      </div>`;
  }

  function galleryGrid(photos, expanded) {
    const items = photos.map(p => ({ src: p.src, caption: p.caption }));
    window.__galItems = (window.__galItems || []).concat(items);
    const base = (window.__galItems.length - items.length);
    return `<div class="gal-grid">` + photos.map((p, i) => `
      <div class="gal-item" data-gal="${base + i}" tabindex="0" role="button" aria-label="${p.caption}">
        ${UI.img(p.src, p.caption, 'gallery')}
        <div class="gi-cap">${p.caption}</div>
      </div>`).join('') + `</div>`;
  }

  function testimonials() {
    const tags = ['Semua', 'Siswa', 'Orang Tua', 'Supplier', 'Guru', 'Pekerja SPPG', 'Pemerintah Daerah', 'Lembaga Internasional'];
    const chips = `<div class="chips" id="testi-chips" style="margin-bottom:1.2rem">` +
      tags.map((t, i) => `<button class="chip ${i === 0 ? 'active' : ''}" data-value="${t}">${t}</button>`).join('') + `</div>`;
    const cards = u.testimonials.map(t => `
      <div class="card testi-card card-lift" data-tag="${t.tag}">
        <div class="testi-q-ic">${icon('quote')}</div>
        <p class="tq">"${t.quote}"</p>
        <span class="th">${icon('sparkles')} ${t.highlight}</span>
        <div class="tp">${UI.img('assets/img/people/' + t.avatar + '.jpg', t.name, 'portrait')}
          <div><div class="tn">${t.name}</div><div class="tr">${t.role}</div></div></div>
      </div>`).join('');
    return secHead('quote', 'Testimoni', 'Suara dari penerima & mitra') + chips +
      `<div class="testi-track" id="testi-track">${cards}</div>`;
  }

  function distribusi() {
    const totalSiswa = u.schools.reduce((s, x) => s + x.siswa, 0);
    const totalGuru = u.schools.reduce((s, x) => s + x.guru, 0);
    const totalPm = u.schools.reduce((s, x) => s + x.pm, 0);
    const tiles = [
      { v: u.schools.length, l: 'Total Sekolah' },
      { v: fmt(totalSiswa), l: 'Total Siswa' },
      { v: fmt(totalGuru), l: 'Total Guru' },
      { v: fmt(totalPm), l: 'Penerima Manfaat' },
    ];
    const schoolRows = u.schools.map(x => `
      <tr><td class="cell-strong">${x.name}</td><td><span class="pill">${x.type}</span></td>
      <td class="num">${x.guru}</td><td class="num">${fmt(x.siswa)}</td><td class="num">${fmt(x.pm)}</td>
      <td class="num">${x.jarakKm} km</td><td class="num">${x.waktu} mnt</td></tr>`).join('');

    // health
    const healthTiles = [
      { v: u.health.length, l: 'Fasilitas Kesehatan' },
      { v: u.health.reduce((s, x) => s + x.ibuHamil, 0), l: 'Ibu Hamil & Menyusui' },
      { v: u.health.reduce((s, x) => s + x.balita, 0), l: 'Balita' },
      { v: u.health.reduce((s, x) => s + x.pm, 0), l: 'Penerima Manfaat' },
    ];
    const healthRows = u.health.map(x => `
      <tr><td class="cell-strong">${x.name}</td><td><span class="pill ${x.type === 'Puskesmas' ? 'pill-amber' : ''}">${x.type}</span></td>
      <td class="num">${x.ibuHamil}</td><td class="num">${x.balita}</td><td class="num">${x.pm}</td>
      <td class="num">${x.jarakKm} km</td><td class="num">${x.waktu} mnt</td></tr>`).join('');

    return secHead('school', 'Rincian Distribusi', 'Sekolah & fasilitas kesehatan') + `
      <div class="sum-tiles">${tiles.map(t => `<div class="sum-tile"><div class="sv">${t.v}</div><div class="sl">${t.l}</div></div>`).join('')}</div>
      <div class="table-wrap"><table class="data"><thead><tr>
        <th>Nama Sekolah</th><th>Tipe</th><th class="num">Guru</th><th class="num">Siswa</th><th class="num">PM</th><th class="num">Jarak</th><th class="num">Waktu Tempuh</th>
      </tr></thead><tbody>${schoolRows}</tbody></table></div>

      <div class="block-head" style="margin-top:2rem"><h3 style="font-size:var(--fs-lg)">Puskesmas & Posyandu</h3></div>
      <div class="sum-tiles">${healthTiles.map(t => `<div class="sum-tile"><div class="sv">${t.v}</div><div class="sl">${t.l}</div></div>`).join('')}</div>
      <div class="table-wrap"><table class="data"><thead><tr>
        <th>Nama Fasilitas</th><th>Tipe</th><th class="num">Ibu Hamil</th><th class="num">Balita</th><th class="num">PM</th><th class="num">Jarak</th><th class="num">Waktu Tempuh</th>
      </tr></thead><tbody>${healthRows}</tbody></table></div>`;
  }

  function suppliers() {
    const cats = ['Semua', 'Protein', 'Sayuran', 'Karbohidrat', 'Buah-buahan', 'Kacang-kacangan', 'Rempah', 'Susu', 'Lainnya'];
    const chips = `<div class="chips" id="sup-chips" style="margin-bottom:1.2rem">` +
      cats.map((c, i) => `<button class="chip ${i === 0 ? 'active' : ''}" data-value="${c}">${c}</button>`).join('') + `</div>`;
    const supN = u.suppliers.length;
    const pemN = new Set(u.suppliers.map(s => s.supplier)).size;
    const rows = u.suppliers.map(s => `
      <tr data-cat="${s.cat}"><td><div class="cell-thumb">${UI.img('assets/img/komoditas/' + s.thumb + '.jpg', s.item, 'food', '', '1/1')}
        <div><div class="cell-strong">${s.item}</div><div class="text-xs muted">${s.cat}</div></div></div></td>
        <td class="num">${fmt(s.qty)} ${s.unit}</td><td><span class="pill">${s.supplier}</span></td><td>${s.region}</td></tr>`).join('');
    return secHead('truck', 'Manajemen Pemasok & Komoditas', 'Rantai pasok bahan baku') + `
      <div class="block-head"><div class="meta">
        <div><div class="m-val">${supN}</div><div class="m-lab">Item Komoditas</div></div>
        <div><div class="m-val">${pemN}</div><div class="m-lab">Pemasok</div></div>
      </div></div>${chips}
      <div class="table-wrap"><table class="data" id="sup-table"><thead><tr>
        <th>Item</th><th class="num">Jumlah</th><th>Pemasok</th><th>Wilayah</th>
      </tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function kitchenCams() {
    return secHead('camera', 'Kondisi Dapur', 'Pemantauan area dapur (placeholder)') + `
      <div class="cam-grid">${u.gallery.cams.map(c => `
        <div class="cam">${UI.img('assets/img/cams/' + u.slug + '-' + c.tag.toLowerCase().replace(' ', '') + '.jpg', c.label, 'cam')}
          <div class="cam-bar"><span class="cam-tag">${c.tag}</span><span class="cam-live"><span class="ld"></span>PLACEHOLDER</span></div>
          <div class="cam-foot">${c.label}</div></div>`).join('')}</div>
      <div class="note" style="margin-top:1rem">${icon('info')} Panel kamera bersifat placeholder dan tidak menampilkan CCTV langsung pada purwarupa ini.</div>`;
  }

  /* ===================== PROFIL ===================== */
  function tabProfil() {
    const focusCards = [
      { ic: 'users', t: 'Mentorship', d: 'Pendampingan petani & pengelola dapur menuju praktik terbaik.' },
      { ic: 'leaf', t: 'Sustainable Agriculture', d: 'Rantai pasok komoditas lokal yang berkelanjutan.' },
      { ic: 'book', t: 'Workshops & Training', d: 'Pelatihan gizi, mutu, dan keamanan pangan.' },
      { ic: 'sparkles', t: 'Innovation Showcase', d: 'Digitalisasi operasi & pelaporan dampak.' },
    ];
    const edufarmers = secHead('building', 'Tentang Edufarmers', 'Yayasan penyelenggara') + `
      <div class="card card-pad-lg org-card">
        <div class="org-logo" style="background:linear-gradient(135deg,#ED8B2C,#F2A93B)">E</div>
        <div>
          <h3>Edufarmers International Foundation</h3>
          <p class="muted" style="margin-top:.4rem">Memberdayakan generasi muda untuk masa depan pertanian dan ketahanan pangan Indonesia.</p>
          <div class="tag-row" style="margin-top:1rem">
            <span class="pill">${icon('globe')} edufarmers.org</span>
            <span class="pill pill-green">${icon('seedling')} Pertanian</span>
            <span class="pill pill-orange">${icon('heart')} Gizi & Stunting</span>
          </div>
          <a class="btn btn-purple btn-sm" style="margin-top:1.2rem" href="#">${icon('arrowUpRight')} Kunjungi Situs</a>
        </div>
      </div>
      <div class="grid" style="grid-template-columns:1fr 1fr;margin-top:1.2rem">
        <div class="card"><span class="eyebrow">Misi</span><p style="margin-top:.5rem">Menyediakan akses gizi setara bagi anak Indonesia melalui jaringan dapur yang efisien, transparan, dan berkelanjutan.</p></div>
        <div class="card"><span class="eyebrow">Visi</span><p style="margin-top:.5rem">Generasi Indonesia yang bebas stunting dan berdaya melalui pangan bergizi dan pertanian yang sejahtera.</p></div>
      </div>
      <div class="focus-grid" style="margin-top:1.2rem">${focusCards.map(f => `
        <div class="focus-card"><div class="fc-ic">${icon(f.ic)}</div><h4>${f.t}</h4><p>${f.d}</p></div>`).join('')}</div>`;

    // mitra
    const mitra = secHead('handshake', 'Tentang Mitra', 'WFP · Muhammadiyah · BGN') + `
      <div class="grid" style="grid-template-columns:repeat(3,1fr)">
        ${[
          { n: 'World Food Programme', s: 'W', c: '#2F6F8A', d: 'Dukungan teknis gizi, standar mutu pangan, dan pemantauan dampak berbasis bukti.' },
          { n: 'Muhammadiyah', s: 'M', c: '#2F8A5B', d: 'Jejaring sekolah, relawan, dan distribusi di tingkat wilayah.' },
          { n: 'Badan Gizi Nasional', s: 'B', c: '#5B3E8E', d: 'Penyelenggara program MBG dan penyalur insentif operasional dapur.' },
        ].map(m => `
        <div class="card card-lift">
          <div class="org-logo" style="width:56px;height:56px;font-size:1.4rem;background:${m.c}">${m.s}</div>
          <h4 style="margin-top:1rem">${m.n}</h4>
          <p class="muted text-sm" style="margin-top:.5rem">${m.d}</p>
        </div>`).join('')}
      </div>`;

    // tim & organisasi
    const groups = {};
    u.team.forEach(t => { groups[t.group] = (groups[t.group] || 0) + 1; });
    const groupRow = Object.entries(groups).map(([g, n]) =>
      `<div class="sum-tile"><div class="sv">${n}</div><div class="sl">${g}</div></div>`).join('');
    const teamCards = u.team.map(t => `
      <div class="team-card ${t.spotlight ? 'spotlight' : ''}">
        ${UI.img('assets/img/people/team-' + (t.spotlight ? 'lead' : 'm') + '.jpg', t.name, 'portrait')}
        <div><div class="tc-role">${t.group}</div><div class="tc-name">${t.name}</div>
        <div class="tc-title">${t.title}</div>
        <div class="tc-contact" ${!Role.isInternal() ? '' : ''}>${t.contact}</div></div>
      </div>`).join('');
    const tim = secHead('users', 'Tim & Organisasi', 'Struktur staf unit', 'Kontak yang ditampilkan adalah kontak berbasis peran. Kontak personal hanya tersedia untuk peran internal.') + `
      <div class="sum-tiles" style="grid-template-columns:repeat(${Math.min(4, Object.keys(groups).length)},1fr)">${groupRow}</div>
      <div class="team-grid" style="margin-top:1.2rem">${teamCards}</div>`;

    if (!active) {
      return emptyState('Profil tim unit belum lengkap', 'Unit dalam tahap persiapan — profil organisasi penyelenggara tetap dapat dilihat di bawah.') +
        block(edufarmers) + block(mitra);
    }
    return [edufarmers, mitra, tim].map(block).join('');
  }

  /* ===================== MENU ===================== */
  function tabMenu() {
    if (!active) return emptyState('Menu belum tersedia', 'Riwayat menu akan tampil setelah dapur beroperasi.');
    const menu = menuToday(u.menuToday);

    // riwayat
    const hist = u.menuHist.map(m => `
      <div class="card mh-card card-lift">
        <div class="mh-img">${UI.img(m.img, m.name, 'food')}</div>
        <div class="mh-body">
          <div class="mh-date"><span class="text-xs muted num">${m.date}</span>
            <span class="mh-stars">${'★'.repeat(Math.round(m.rating))}<span style="color:var(--border)">${'★'.repeat(5 - Math.round(m.rating))}</span></span></div>
          <h4>${m.name}</h4>
          <div class="mh-nutri"><span class="mn">${m.kalori} kkal</span><span class="mn">P ${m.protein}g</span><span class="mn">L ${m.lemak}g</span><span class="mn">K ${m.karbo}g</span></div>
        </div>
      </div>`).join('');

    // nutrition trend
    const series = u.menuHist.slice().reverse();
    const kaloriLine = Charts.line([{ points: series.map(m => m.kalori), color: '#ED8B2C' }],
      { labels: series.map(m => m.date.split(' ').slice(0, 2).join(' ')), height: 200, aria: 'Tren kalori' });
    const avgProtein = Math.round(series.reduce((s, m) => s + m.protein, 0) / series.length);
    const trend = `
      <div class="card card-pad-lg" style="margin-top:1.2rem">
        <div class="block-head"><div>
          <span class="eyebrow">Pelacakan Nutrisi</span><h3 style="font-size:var(--fs-lg);margin-top:.3rem">Tren kalori per porsi</h3></div>
          <div class="meta"><div><div class="m-val">${avgProtein}g</div><div class="m-lab">Rata-rata protein</div></div></div>
        </div>${kaloriLine}</div>`;

    const riwayat = secHead('book', 'Riwayat Menu', 'Riwayat Menu & Pelacakan Nutrisi',
      'Periode: 8 hari terakhir.') + `<div class="menu-hist-grid">${hist}</div>` + trend;

    // resep
    const resep = secHead('utensils', 'Resep Unggulan', 'Resep Unggulan SPPG') + `
      <div class="recipe-track">${u.recipes.map(r => `
        <div class="card recipe-card card-lift">
          <div class="rc-img">${UI.img(r.img, r.name, 'recipe')}</div>
          <div class="rc-body">
            <h4 style="font-size:var(--fs-md)">${r.name}</h4>
            <div class="rc-chef">${icon('users')} ${r.chef}</div>
            <div class="rc-macros">
              <div class="m"><div class="mv">${r.kalori}</div><div class="ml">kkal</div></div>
              <div class="m"><div class="mv">${r.protein}g</div><div class="ml">Protein</div></div>
              <div class="m"><div class="mv">${r.lemak}g</div><div class="ml">Lemak</div></div>
              <div class="m"><div class="mv">${r.waktu}'</div><div class="ml">Masak</div></div>
            </div>
          </div>
        </div>`).join('')}</div>`;

    return [menu, riwayat, resep].map(block).join('');
  }

  /* ===================== GALERI ===================== */
  function tabGaleri() {
    if (!active) return emptyState('Galeri belum tersedia', 'Dokumentasi akan tampil setelah dapur beroperasi.') + block(kitchenCams());
    const fotoToggle = `<div class="chips" id="gal-toggle" style="margin-bottom:1.2rem">
      <button class="chip active" data-value="foto">Foto</button><button class="chip" data-value="video">Video</button></div>`;
    const galeri = secHead('image', 'Galeri', 'Dokumentasi visual unit') + fotoToggle +
      `<div id="gal-foto">${galleryGrid(u.gallery.photos)}</div>
       <div id="gal-video" hidden><div class="gal-grid" style="grid-template-columns:repeat(2,1fr)">
        ${u.gallery.videos.map(v => `<div class="gal-item" style="aspect-ratio:16/9">${UI.img(v.src, v.caption, 'gallery')}
          <div class="gi-cap">${icon('play')} ${v.caption}</div></div>`).join('')}</div></div>`;
    return [galeri, kitchenCams()].map(block).join('');
  }

  /* ===================== DAMPAK ===================== */
  function tabDampak() {
    if (!active) return emptyState('Laporan dampak belum tersedia', 'Analisis dampak disusun setelah unit beroperasi minimal satu periode.');
    const im = u.impact;
    const warn = `<div class="ilustratif">${icon('info')} Angka ilustratif</div>`;

    const header = `<div class="flex items-center gap-3 wrap" style="margin-bottom:1.5rem">
      <h2 style="font-size:var(--fs-2xl)">Laporan Dampak Berkelanjutan</h2>${warn}</div>`;

    const cba = secHead('layers', 'Analisis Dampak Sosial', 'Cost-Benefit Analysis (CBA)') + `
      <div class="cba-grid">
        <div class="card"><span class="eyebrow">Pengertian</span><p style="margin-top:.5rem">${im.cba.pengertian}</p></div>
        <div class="card"><span class="eyebrow">Manfaat</span><p style="margin-top:.5rem">${im.cba.manfaat}</p></div>
      </div>`;

    const sroi = `<div class="sroi-banner reveal" style="margin-top:2rem">
      <div class="sr-ratio">${im.sroi}</div>
      <div class="sr-label">Social Return on Investment — ${im.sroiNote}</div></div>`;

    const eco = secHead('coins', 'Model Ekonomi', 'Nilai yang dihasilkan program') + `
      <div class="eco-grid">${im.economicModel.map(e => `
        <div class="eco-card card-lift"><div class="ec-ic">${icon(e.icon)}</div>
          <div class="ec-v">${e.value}</div><div class="ec-l">${e.label}</div><div class="ec-n">${e.note}</div></div>`).join('')}</div>`;

    const sdg = secHead('globe', 'Kontribusi SDG', 'Tujuan Pembangunan Berkelanjutan') + `
      <div class="sdg-grid">${im.sdg.map(s => `
        <div class="sdg-tile" style="background:${s.color}">
          <div class="sdg-no">SDG ${s.no}</div><div class="sdg-ic">${icon(s.icon)}</div>
          <div class="sdg-stat">${s.stat}</div><div class="sdg-l">${s.label}</div></div>`).join('')}</div>`;

    const toc = secHead('arrowRight', 'Teori Perubahan', 'Activities → Output → Outcome → Impact') + `
      <div class="toc-flow">${im.theory.map((t, i) => `
        <div class="toc-step"><div class="toc-stage">${t.stage}</div><p>${t.text}</p>
          ${i < im.theory.length - 1 ? `<span class="toc-arrow">${icon('arrowRight')}</span>` : ''}</div>`).join('')}</div>`;

    const nonq = secHead('heart', 'Manfaat Non-Kuantitatif', 'Dampak yang tak ternilai angka') + `
      <div class="focus-grid" style="grid-template-columns:repeat(3,1fr)">${im.nonQuant.map(c => `
        <div class="focus-card"><h4>${c.title}</h4><p>${c.text}</p></div>`).join('')}</div>`;

    const roi = secHead('scale', 'Rincian SROI / ROI', 'Komponen biaya vs manfaat') + `
      <div class="roi-split">
        <div class="card card-pad-lg"><div class="flex items-center gap-2" style="margin-bottom:1rem"><span class="badge badge-nonaktif badge-plain" style="background:var(--danger-bg);color:var(--danger)">BIAYA</span></div>
          ${Charts.bars(im.roi.cost)}</div>
        <div class="card card-pad-lg"><div class="flex items-center gap-2" style="margin-bottom:1rem"><span class="badge badge-plain" style="background:var(--success-bg);color:var(--success)">MANFAAT</span></div>
          ${Charts.bars(im.roi.benefit, {})}</div>
      </div>`;

    const commodityRows = im.commodity.map(c =>
      `<tr><td class="cell-strong">${c.item}</td><td class="num">${c.value}</td><td class="num">${c.share}</td></tr>`).join('');
    const flow = secHead('trendUp', 'Dampak Ekonomi Program', 'Perputaran ekonomi bulanan') + `
      <div class="grid" style="grid-template-columns:0.8fr 1.2fr">
        <div class="card card-pad-lg" style="display:flex;flex-direction:column;justify-content:center">
          <span class="eyebrow">Aliran ekonomi / bulan</span>
          <div class="num" style="font-size:var(--fs-3xl);font-weight:600;color:var(--brand-purple);margin-top:.5rem">${im.monthlyFlow}</div>
          <p class="muted text-sm" style="margin-top:.5rem">Estimasi nilai komoditas yang berputar di ekonomi lokal. ${warn}</p>
        </div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Komoditas</th><th class="num">Nilai / bulan</th><th class="num">Porsi</th></tr></thead>
          <tbody>${commodityRows}</tbody></table></div>
      </div>`;

    const zs = `<div class="zs-alloc reveal" style="margin-top:2rem">
      <div class="za-v">${im.zerostunting.allocated}</div>
      <div class="za-t"><span class="eyebrow on-dark">Alokasi ZeroStunting · ${im.zerostunting.area}</span>
        <h3 style="margin-top:.3rem">Surplus MBG mendanai ZeroStunting</h3>
        <p>${im.zerostunting.note} ${warn}</p></div></div>`;

    return header + [cba].map(block).join('') + sroi + [eco, sdg, toc, nonq, roi, flow].map(block).join('') + zs;
  }

  /* ---------- empty state ---------- */
  function emptyState(title, text) {
    return `<div class="empty reveal"><div class="ei">${icon('clock')}</div>
      <h3>${title}</h3><p>${text}</p>
      <span class="badge badge-persiapan" style="margin-top:1.2rem">${u.status}</span></div>`;
  }

  /* ---------- tabs orchestration ---------- */
  const TABS = [
    { id: 'ringkasan', label: 'Ringkasan', render: tabRingkasan },
    { id: 'profil', label: 'Profil', render: tabProfil },
    { id: 'menu', label: 'Menu', render: tabMenu },
    { id: 'galeri', label: 'Galeri', render: tabGaleri },
    { id: 'dampak', label: 'Dampak', render: tabDampak },
  ];

  function buildTabs() {
    const wrap = document.getElementById('tabs');
    wrap.innerHTML = TABS.map((t, i) =>
      `<button class="tab ${i === 0 ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`).join('') +
      `<span class="tab-ind"></span>`;
    wrap.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => selectTab(btn.dataset.tab)));
    moveIndicator(wrap.querySelector('.tab.active'));
  }

  function moveIndicator(btn) {
    const ind = document.querySelector('.tab-ind');
    if (!ind || !btn) return;
    ind.style.left = btn.offsetLeft + 'px';
    ind.style.width = btn.offsetWidth + 'px';
  }

  function selectTab(id) {
    window.__galItems = [];
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
    moveIndicator(document.querySelector('.tab.active'));
    const tab = TABS.find(t => t.id === id);
    const content = document.getElementById('tab-content');
    content.innerHTML = `<div class="tab-panel">${tab.render()}</div>`;
    history.replaceState(null, '', `?u=${u.slug}#${id}`);
    afterRender();
  }

  function afterRender() {
    // gallery lightbox
    document.querySelectorAll('[data-gal]').forEach(g => {
      const open = () => UI.openLightbox(window.__galItems, parseInt(g.dataset.gal, 10));
      g.addEventListener('click', open);
      g.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
    });
    // testimonial filter
    const tc = document.getElementById('testi-chips');
    if (tc) UI.bindChips(tc, (val) => {
      document.querySelectorAll('#testi-track .testi-card').forEach(card =>
        card.style.display = (val === 'Semua' || card.dataset.tag === val) ? '' : 'none');
    });
    // supplier filter
    const sc = document.getElementById('sup-chips');
    if (sc) UI.bindChips(sc, (val) => {
      document.querySelectorAll('#sup-table tbody tr').forEach(tr =>
        tr.style.display = (val === 'Semua' || tr.dataset.cat === val) ? '' : 'none');
    });
    // gallery foto/video toggle
    const gt = document.getElementById('gal-toggle');
    if (gt) UI.bindChips(gt, (val) => {
      document.getElementById('gal-foto').hidden = val !== 'foto';
      document.getElementById('gal-video').hidden = val !== 'video';
    });
    Charts.animateBars(document.getElementById('tab-content'));
    UI.observe(document.getElementById('tab-content'));
  }

  // init
  unitHeader();
  buildTabs();
  const initial = (location.hash || '#ringkasan').slice(1);
  selectTab(TABS.find(t => t.id === initial) ? initial : 'ringkasan');
  window.addEventListener('resize', () => moveIndicator(document.querySelector('.tab.active')));
})();
