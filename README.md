# MBG Dashboard — Prototipe SPPG (ZeroStunting × Edufarmers)

Prototipe **dashboard operasi & dampak** untuk jaringan dapur SPPG di bawah program
**Makan Bergizi Gratis (MBG)**. Dibangun sebagai **situs statis** (HTML + CSS + JavaScript murni) —
tanpa framework, tanpa build step — agar mudah di-*host* gratis di **GitHub Pages**.

Semua data adalah **data contoh (mock)**; angka finansial/dampak ditandai **"ilustratif"**.

## Halaman

| Berkas | Halaman | Akses |
|---|---|---|
| `index.html` | Beranda — dampak nasional + narasi MBG → ZeroStunting + 6 unit | Publik |
| `unit.html?u=<slug>` | Dashboard unit, 5 tab (Ringkasan · Profil · Menu · Galeri · Dampak) | Publik |
| `overview.html` | Monitor internal — peta + KPI agregat | Internal |
| `unggah.html` | Wizard unggah & pemrosesan formulir (4 langkah) | Internal |

Slug unit: `sukun`, `donomulyo`, `poncokusumo`, `simalungun` (AKTIF), `lawang`, `karangnongko` (PERSIAPAN).

**Pemilih peran** (kanan atas) mengganti antara *Publik* dan peran internal
(Pengawas Lapangan, MBG Program Head, Tim Finance, Pembina/CEO). Peran internal membuka halaman
Monitor & Unggah serta kolom internal. Pilihan tersimpan di `localStorage`.

## Menjalankan secara lokal

Karena ini situs statis, cukup buka `index.html` di browser. Namun beberapa browser membatasi
`fetch`/path saat memakai `file://`, jadi lebih baik lewat server statis kecil:

```bash
# Python 3
python -m http.server 5577
# lalu buka http://localhost:5577

# atau Node
npx serve .
```

## Deploy ke GitHub Pages

1. Buat repo GitHub dan push seluruh isi folder ini (pastikan `index.html` ada di root).
   ```bash
   git init
   git add .
   git commit -m "MBG dashboard prototype"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
2. Di GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   pilih branch `main` dan folder `/ (root)`. Simpan.
3. Tunggu ~1 menit; situs tayang di `https://<user>.github.io/<repo>/`.
4. (Opsional) Untuk domain `mbg.zerostunting.com`: tambahkan berkas `CNAME` berisi domain tsb.
   dan set DNS `CNAME` ke `<user>.github.io`.

> Semua path bersifat **relatif** (mis. `css/...`, `js/...`, `assets/...`) sehingga berfungsi baik
> di root domain maupun di sub-path `…github.io/<repo>/`.

## Mengganti gambar

Lihat **[IMAGES.md](IMAGES.md)** — daftar lengkap setiap gambar, nama berkas/foldernya, dan prompt
Gemini 3.1 untuk membuatnya. Situs memakai placeholder berbranding sampai berkas asli ditaruh; cukup
simpan JPG dengan nama yang sesuai, tidak perlu mengubah kode.

## Struktur

```
index.html · unit.html · overview.html · unggah.html
css/    tokens.css · base.css · components.css · pages.css
js/     data.js (semua mock data) · icons.js · ui.js · charts.js · map.js
        role.js · layout.js · beranda.js · unit.js · overview.js · unggah.js
assets/img/placeholders/   SVG placeholder berbranding (fallback otomatis)
brief.md · IMAGES.md · README.md
```

## Teknologi
Tanpa dependensi runtime. Font dari Google Fonts (Fraunces, Plus Jakarta Sans, JetBrains Mono).
Grafik (donut/garis/bar) dan peta Indonesia digambar tangan sebagai SVG. Animasi memakai
IntersectionObserver + CSS. Mendukung `prefers-reduced-motion`.

---
*Purwarupa — bukan produksi. Tanpa integrasi backend nyata. Sebagian angka ilustratif.*
