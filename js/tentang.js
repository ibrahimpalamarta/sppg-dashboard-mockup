/* ============================================================
   Tentang (public) — PRD_MERGED §5.7
   The scoping page: what the platform does vs. what stays the
   kitchen's responsibility.
   ============================================================ */
(function () {
  const page = document.getElementById('page');

  const DOES = [
    'Membaca data yang sudah dihasilkan dapur, apa adanya.',
    'Menilai tiap porsi terhadap Angka Kecukupan Gizi per kelompok penerima.',
    'Mengunci catatan dengan waktu, penanggung jawab, sumber data, dan sidik isi.',
    'Menyajikan hasilnya secara terbuka — tanpa perlu akses khusus.',
    'Menyimpan koreksi sebagai entri baru, tanpa menghapus yang asli.',
  ];
  const DOESNT = [
    'Mengelola pembelian bahan, stok, atau jadwal memasak.',
    'Menentukan atau menyusun menu — itu tetap wewenang ahli gizi dapur.',
    'Menggantikan sistem operasional yang sudah dipakai dapur.',
    'Mengubah catatan yang sudah terkunci — termasuk oleh administrator.',
    'Memantau dapur lewat kamera atau video langsung.',
  ];

  const COMMITS = [
    { ic: 'clock',       t: 'Waktu pencatatan', d: 'Setiap catatan menyimpan waktu kunci yang tidak dapat dimundurkan.' },
    { ic: 'users',       t: 'Penanggung jawab', d: 'Nama orang yang mengunci catatan selalu tercatat.' },
    { ic: 'upload',      t: 'Sumber data', d: 'Unggahan berkas, input manual, atau sistem mitra — selalu dinyatakan.' },
    { ic: 'fingerprint', t: 'Sidik isi', d: 'Ringkasan kriptografis isi catatan. Satu angka berubah, sidik isinya ikut berubah.' },
    { ic: 'history',     t: 'Koreksi ditambahkan', d: 'Koreksi tidak menimpa. Keduanya tetap terlihat dengan sidik isinya sendiri.' },
  ];

  page.innerHTML = `
    <div class="container container-wide page-intro">
      <h1>Tentang</h1>
      <p>Siapa yang membangun dashboard ini, untuk program apa, dan — yang sama pentingnya — apa yang tidak dikerjakannya.</p>
    </div>

    <div class="container container-wide" style="padding-bottom:var(--sp-8)">
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:var(--sp-7);align-items:start">
        <div class="prose reveal">
          <h2 style="font-size:var(--fs-xl);margin-bottom:var(--sp-4)">EduFarmers &amp; ZeroStunting</h2>
          <p>EduFarmers International Foundation menjalankan misi <b>ZeroStunting</b> — menekan angka stunting lewat perbaikan gizi anak dan penguatan rantai pangan lokal. Dashboard ini adalah lapisan transparansi dari misi tersebut.</p>
          <p>Sasarannya sederhana tetapi tidak sepele: memastikan porsi yang <i>mengenyangkan</i> tidak keliru dibaca sebagai porsi yang <i>bergizi</i>. Karena itu setiap porsi dinilai per zat gizi, dan setiap kelebihan satu zat dibatasi agar tidak menutupi kekurangan zat lain.</p>
        </div>
        <div class="prose reveal" data-delay="80">
          <h2 style="font-size:var(--fs-xl);margin-bottom:var(--sp-4)">Program MBG &amp; model dapur SPPG</h2>
          <p><b>Makan Bergizi Gratis (MBG)</b> menyediakan satu kali makan bergizi setiap hari sekolah. Pelaksananya adalah <b>SPPG</b> — Satuan Pelayanan Pemenuhan Gizi — dapur yang memasak dan mendistribusikan porsi ke sekolah di wilayahnya.</p>
          <p>Setiap dapur sudah punya cara kerja, ahli gizi, dan pencatatannya sendiri. Platform ini menempel di atas proses itu, bukan menggantikannya.</p>
        </div>
      </div>

      <div class="sec-hd" style="margin-top:var(--sp-8)">
        <h2>Batas tanggung jawab</h2>
        <p>Yang dikerjakan platform, dan yang tetap menjadi wewenang dapur.</p>
      </div>
      <div class="split">
        <div class="split-card does reveal">
          <h3>${icon('check')} Yang dilakukan platform</h3>
          <ul>${DOES.map(d => `<li>${icon('check')}<span>${d}</span></li>`).join('')}</ul>
        </div>
        <div class="split-card doesnt reveal" data-delay="80">
          <h3>${icon('minus')} Yang tetap wewenang dapur</h3>
          <ul>${DOESNT.map(d => `<li>${icon('minus')}<span>${d}</span></li>`).join('')}</ul>
        </div>
      </div>

      <div class="sec-hd" style="margin-top:var(--sp-8)">
        <h2>Komitmen keterbukaan data</h2>
        <p>Lima hal yang melekat pada setiap catatan harian.</p>
      </div>
      <div class="principles" style="grid-template-columns:repeat(5,1fr)">
        ${COMMITS.map((c, i) => `<div class="principle reveal" data-delay="${i * 60}">
          ${icon(c.ic)}<h4>${c.t}</h4><p>${c.d}</p>
        </div>`).join('')}
      </div>

      <div class="card reveal" style="margin-top:var(--sp-7);padding:var(--sp-6);text-align:center">
        <h3 style="font-size:var(--fs-lg)">Periksa sendiri</h3>
        <p class="muted text-sm" style="max-width:52ch;margin:.5rem auto var(--sp-5)">Tidak perlu akses khusus untuk memeriksa klaim di halaman ini.</p>
        <div class="flex gap-2 justify-between" style="justify-content:center;flex-wrap:wrap">
          <a class="btn btn-primary btn-sm" href="menu.html">${icon('chart')} Menu &amp; gizi</a>
          <a class="btn btn-ghost btn-sm" href="dapur.html">${icon('map')} Daftar dapur</a>
          <a class="btn btn-ghost btn-sm" href="transparansi.html">${icon('file')} Pustaka dokumen</a>
        </div>
      </div>
    </div>`;

  Layout.render({ page: 'tentang' });
  UI.observe(page);
})();
