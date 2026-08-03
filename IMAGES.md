# Panduan Gambar — MBG Dashboard

Semua gambar di bawah **opsional**. Situs sudah tampil lengkap dengan *placeholder* berbranding
(ungu/oranye). Setiap `<img>` otomatis jatuh ke placeholder bila berkas asli belum ada
(`onerror` → SVG placeholder). Jadi Anda bisa mengganti gambar **kapan saja, satu per satu**, tanpa
menyentuh kode.

## Cara pakai

1. Buat gambar memakai *prompt* di tabel (Gemini, atau alat lain).
2. Simpan sebagai **JPG** dengan **nama & folder persis** seperti kolom "Berkas".
3. Refresh halaman — foto asli langsung menggantikan placeholder.

**Aturan umum untuk semua prompt:**

> photorealistic, documentary photography, warm natural daylight, authentic Indonesian context,
> high detail, **no text, no logos, no watermark** in the image. **Avoid identifiable real individuals.**

Format: JPG, kualitas 80–85%, sRGB. Optimalkan ukuran (< 300 KB/foto bila bisa).

> ⚠️ **Gambar bersifat ilustratif, bukan bukti.** Foto hasil AI tidak boleh disajikan sebagai
> dokumentasi lapangan sungguhan. Keterangan pada galeri sudah menyebut "foto dokumentasi ilustratif" —
> pertahankan penanda itu.

---

## Satu-satunya slot gambar aktif: galeri dapur

Rasio **4:3**, ~1000×750. Pola berkas: `assets/img/gallery/<slug>-<n>.jpg`

Hanya dapur **beroperasi** yang punya galeri. Dapur `kepanjen` (persiapan) sengaja menampilkan
*empty state*, bukan foto.

### SPPG Kedungkandang (`kedungkandang`)

| Berkas | Isi gambar | Prompt |
|---|---|---|
| `assets/img/gallery/kedungkandang-1.jpg` | Bangunan dapur | "Exterior of a clean modern Indonesian institutional kitchen building in an urban district, morning light, documentary style, 4:3" |
| `assets/img/gallery/kedungkandang-2.jpg` | Area penerimaan bahan | "Food ingredient receiving area of an Indonesian institutional kitchen, crates of fresh vegetables being weighed on a scale, 4:3" |
| `assets/img/gallery/kedungkandang-3.jpg` | Area memasak | "Large Indonesian institutional kitchen cooking area with big steel pots and stoves, staff in aprons and hairnets, 4:3" |
| `assets/img/gallery/kedungkandang-4.jpg` | Pengemasan porsi | "Meal portioning line in an Indonesian institutional kitchen, compartment trays being filled with rice and vegetables, 4:3" |
| `assets/img/gallery/kedungkandang-5.jpg` | Muat ompreng ke kendaraan | "Stacked stainless meal containers being loaded into a delivery van outside an Indonesian kitchen, 4:3" |
| `assets/img/gallery/kedungkandang-6.jpg` | Distribusi ke sekolah | "Meal trays being handed out to Indonesian elementary school students in a classroom, warm daylight, 4:3" |

### SPPG Singosari (`singosari`)

| Berkas | Isi gambar | Prompt |
|---|---|---|
| `assets/img/gallery/singosari-1.jpg` | Bangunan dapur | "Exterior of an Indonesian institutional kitchen building in a semi-rural regency setting, green surroundings, 4:3" |
| `assets/img/gallery/singosari-2.jpg` | Area penerimaan bahan | "Receiving area with sacks of rice and fresh produce being checked by kitchen staff, 4:3" |
| `assets/img/gallery/singosari-3.jpg` | Area memasak | "Indonesian institutional kitchen cooking area, steam rising from large pots, organized and hygienic, 4:3" |
| `assets/img/gallery/singosari-4.jpg` | Pengemasan porsi | "Portioning station with meal trays and a scale, gloved hands placing food, 4:3" |
| `assets/img/gallery/singosari-5.jpg` | Muat ompreng ke kendaraan | "Insulated meal containers loaded onto a small truck at dawn, 4:3" |
| `assets/img/gallery/singosari-6.jpg` | Distribusi ke sekolah | "Students receiving nutritious meal trays at a rural Indonesian school, 4:3" |

Judul/kategori tiap slot ditentukan di `galleryFor()` pada [js/data.js](js/data.js) — urutannya
sama dengan penomoran berkas di atas.

---

## Placeholder (sudah ada, tidak perlu diganti)

SVG berbranding yang otomatis dipakai saat berkas JPG belum ada:

```
assets/img/placeholders/gallery.svg     ← dipakai galeri dapur & fallback default
assets/img/placeholders/food.svg
assets/img/placeholders/kitchen.svg
assets/img/placeholders/portrait.svg
assets/img/placeholders/hero.svg
assets/img/placeholders/recipe.svg
```

---

## Catatan perubahan

Panduan ini disederhanakan pada **31 Juli 2026** mengikuti [PRD_MERGED.md](PRD_MERGED.md).
Slot gambar berikut **dihapus** karena fiturnya tidak ada di kedua PRD sumber:

| Slot lama | Alasan dihapus |
|---|---|
| `assets/img/cams/*` (16 still CCTV) | **CCTV eksplisit di luar cakupan** (PRD_MERGED C-04). Membuat gambar bergaya CCTV juga berisiko disalahartikan sebagai bukti pengawasan sungguhan. |
| `assets/img/people/*` (9 potret testimoni & tim) | Testimoni bukan bagian dari PRD mana pun (SC-03). |
| `assets/img/recipe/*` (5 foto resep) | Modul resep bertentangan dengan pernyataan bahwa platform tidak menyusun menu (SC-05). |
| `assets/img/menu/*` (12 foto menu) | Halaman Menu & Gizi kini menampilkan rincian gizi terhitung, bukan foto nampan. |
| `assets/img/hero/anak-mbg.jpg` | Beranda memakai kartu "Porsi hari ini" berbasis data, bukan foto hero. |

Berkas placeholder `cam.svg` juga dihapus bersama panel kamera dapur.

Bila salah satu slot itu dihidupkan kembali, tambahkan kembali barisnya di sini **dan** ke
`MBG.placeholder` di [js/data.js](js/data.js).
