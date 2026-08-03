# MBG Dashboard — Prototipe SPPG (ZeroStunting × EduFarmers)

Prototipe **lapisan transparansi & analitik** untuk jaringan dapur SPPG di bawah program
**Makan Bergizi Gratis (MBG)**. Dibangun sebagai **situs statis** (HTML + CSS + JavaScript murni) —
tanpa framework, tanpa build step — agar mudah di-*host* gratis di **GitHub Pages**.

Seluruh data adalah **simulasi**. Spesifikasi yang dibangun ada di **[PRD_MERGED.md](PRD_MERGED.md)**.

## Halaman

### Publik (tanpa login)

| Berkas | Halaman |
|---|---|
| `index.html` | Beranda — "Porsi hari ini", metrik dampak, peta + kartu dapur, pengumuman |
| `dapur.html` | Daftar dapur — peta ↔ daftar saling menyorot, pemanfaatan kapasitas |
| `dapur-detail.html?k=<slug>` | Profil dapur — ringkasan, sertifikasi, menu terkini, galeri, jejak keterbukaan |
| `menu.html` | **Menu & Gizi** — inti analitik: 9 nutrien × 6 segmen penerima vs AKG |
| `transparansi.html` | Pustaka dokumen + prinsip keterbukaan |
| `tentang.html` | Batas tanggung jawab platform vs dapur |

Slug dapur: `kedungkandang` (KDK-01), `singosari` (SGS-02) — beroperasi; `kepanjen` (KPJ-03) — persiapan.

### Ruang kerja internal (sidebar gelap, berpagar peran)

| Berkas | Halaman | Peran yang boleh |
|---|---|---|
| `ringkasan.html` | Ringkasan program, kepatuhan input, perbandingan dapur | Data · CMS · Internal · Super |
| `input.html` | Wizard 4 langkah: Unggah → Pembacaan → Tinjau → Terkunci | Supervisor · Data · Super |
| `audit.html` | Jejak audit + sorotan koreksi *append-only* | semua peran internal |
| `biaya.html` | Pengeluaran operasional per dapur/periode | Data · Internal · Super |
| `arsitektur.html` | Arsitektur alur masuk data | Data · CMS · Internal · Super |
| `acuan.html` | Tabel acuan AKG berversi + templat & kamus data | Data · Super |
| `dokumen.html` | Dokumen, konten, pengumuman, galeri (CMS) | CMS · Super |
| `pengguna.html` | Manajemen pengguna & lingkup dapur | **Super Admin saja** |

**Pemilih peran** ada di sidebar. Enam peran: `publik`, `supervisor`, `data`, `cms`, `internal`, `super`
(PRD_MERGED §3.2). Pilihan tersimpan di `localStorage['mbg.role']`.

> ⚠️ Pemagaran peran di sini **simulasi, bukan keamanan**. Pada platform sungguhan setiap permintaan
> harus diotorisasi ulang di server dengan peran dibaca dari basis data (PRD_MERGED §3.4).

## Menjalankan secara lokal

```bash
python -m http.server 5577   # lalu buka http://localhost:5577
npx serve .                  # alternatif
```

Tidak ada build, lint, atau test tooling. Verifikasi = buka halaman dan periksa konsol browser.

## Deploy ke GitHub Pages

1. Push seluruh isi folder ini (pastikan `index.html` ada di root).
2. **Settings → Pages → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Situs tayang di `https://<user>.github.io/<repo>/`.

> Semua path bersifat **relatif** sehingga berfungsi baik di root domain maupun sub-path.

## Mengganti gambar

Lihat **[IMAGES.md](IMAGES.md)**. Situs memakai placeholder berbranding sampai berkas asli ditaruh;
cukup simpan JPG dengan nama yang sesuai — tidak perlu mengubah kode.

## Struktur

```
Publik:   index.html · dapur.html · dapur-detail.html · menu.html · transparansi.html · tentang.html
Internal: ringkasan.html · input.html · audit.html · biaya.html
          arsitektur.html · acuan.html · dokumen.html · pengguna.html

css/  tokens.css → base.css → components.css → pages.css → app.css
js/   icons.js · data.js · nutrition.js · ui.js · charts.js · map.js
      role.js · layout.js (publik) · internal.js (ruang kerja)
      beranda.js · dapur.js · dapur-detail.js · menu.js · transparansi.js · tentang.js
      ringkasan.js · input.js · audit.js · biaya.js · arsitektur.js · acuan.js · dokumen.js · pengguna.js

Dokumen: PRD_MERGED.md (spesifikasi) · GAP_ANALYSIS.md · CHANGELOG.md · IMAGES.md · CLAUDE.md
Sumber:  prd.md · prdfromzahra.pdf · brief.md · mockup/
```

## Teknologi

Tanpa dependensi runtime. Font dari Google Fonts (Fraunces, Plus Jakarta Sans, JetBrains Mono).
Grafik (donut/garis/bar) dan peta Malang Raya digambar tangan sebagai SVG. Animasi memakai
IntersectionObserver + CSS, menghormati `prefers-reduced-motion`.

Skor gizi dihitung dari tabel komposisi pangan di `js/data.js` — bukan angka yang diketik manual —
sehingga setiap perubahan komponen menu otomatis mengubah skornya.

---
*Purwarupa — bukan produksi. Tanpa integrasi backend nyata. Seluruh data simulasi.*
