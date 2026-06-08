# Panduan Gambar — MBG Dashboard

Semua gambar di bawah **opsional**. Situs sudah tampil lengkap dengan *placeholder* berbranding
(ungu/oranye). Setiap `<img>` otomatis jatuh ke placeholder bila berkas asli belum ada
(`onerror` → SVG placeholder). Jadi Anda bisa mengganti gambar **kapan saja, satu per satu**, tanpa
menyentuh kode.

## Cara pakai
1. Buat gambar di **Gemini 3.1** (atau alat lain) memakai *prompt* di tabel.
2. Simpan sebagai **JPG** dengan **nama & folder persis** seperti kolom "Berkas".
3. Refresh halaman — foto asli langsung menggantikan placeholder.

**Aturan umum untuk semua prompt** (tambahkan di akhir prompt bila perlu):
> photorealistic, documentary photography, warm natural daylight, authentic Indonesian context,
> high detail, **no text, no logos, no watermark** in the image. Avoid identifiable real individuals.

Format: JPG, kualitas 80–85%, sRGB. Optimalkan ukuran (< 300 KB/foto bila bisa).

---

## 1. Hero (1 gambar) — rasio 4:3, ~1200×900

| Berkas | Isi gambar | Prompt Gemini 3.1 |
|---|---|---|
| `assets/img/hero/anak-mbg.jpg` | Anak-anak SD Indonesia tersenyum menerima nampan makan bergizi gratis di sekolah | "Indonesian elementary school children smiling while receiving free nutritious meal trays (nasi, vegetables, fruit, milk) at school, warm morning light, joyful and hopeful mood, shallow depth of field, documentary style, 4:3" |

---

## 2. Menu hari ini per dapur aktif (4 gambar) — rasio 4:3, ~1000×750

Foto nampan menu hari ini. Pola berkas: `assets/img/menu/<slug>-today.jpg`

| Berkas | Prompt Gemini 3.1 |
|---|---|
| `assets/img/menu/sukun-today.jpg` | "Top-down photo of an Indonesian school meal on a compartment tray: white rice, yellow-spiced chicken (ayam bumbu kuning), sautéed green beans, banana, and a carton of milk, fresh and appetizing, soft daylight, 4:3" |
| `assets/img/menu/donomulyo-today.jpg` | same composition, vary dish to "semur beef with potato, stir-fried chayote, melon slice, milk" |
| `assets/img/menu/poncokusumo-today.jpg` | same composition, "teriyaki chicken, mixed vegetable capcay, banana, milk" |
| `assets/img/menu/simalungun-today.jpg` | same composition, "grilled sei fish, water spinach, orange, milk" |

---

## 3. Riwayat menu (8 gambar) — rasio 16:10, ~960×600

Foto hidangan untuk kartu riwayat & resep. Pola: `assets/img/menu/<nama>.jpg`

| Berkas | Hidangan | Prompt inti |
|---|---|---|
| `assets/img/menu/ayam-kuning.jpg` | Ayam bumbu kuning | "Indonesian yellow turmeric chicken with rice and vegetables on a tray, 16:10" |
| `assets/img/menu/ikan-sei.jpg` | Ikan sei | "Indonesian smoked/grilled sei fish with rice, kangkung, fruit, 16:10" |
| `assets/img/menu/telur-balado.jpg` | Telur balado | "Indonesian egg balado (chili egg) with rice, sayur sop, watermelon, 16:10" |
| `assets/img/menu/tahu-tempe.jpg` | Tahu tempe bacem | "Indonesian sweet braised tofu and tempeh with rice, bayam, papaya, 16:10" |
| `assets/img/menu/daging-semur.jpg` | Daging semur | "Indonesian beef semur with potato, rice, labu siam, melon, 16:10" |
| `assets/img/menu/ayam-teriyaki.jpg` | Ayam teriyaki | "Teriyaki chicken with rice, capcay vegetables, banana, 16:10" |
| `assets/img/menu/tongkol-suwir.jpg` | Tongkol suwir | "Shredded tuna (tongkol) with rice, urap salad, orange, 16:10" |
| `assets/img/menu/rendang-telur.jpg` | Rendang telur | "Egg rendang with rice, sautéed carrot, banana, 16:10" |

---

## 4. Galeri per dapur aktif (16 foto + 4 video poster) — rasio 1:1 (galeri), 16:9 (video)

Pola foto: `assets/img/gallery/<slug>-<kategori>.jpg`
Kategori: `dapur` · `masak` · `kemas` · `distribusi`. Slug aktif: `sukun, donomulyo, poncokusumo, simalungun`.

| Kategori | Berkas (contoh sukun) | Prompt inti (ulang untuk tiap slug) |
|---|---|---|
| Dapur Utama | `assets/img/gallery/sukun-dapur.jpg` | "Clean modern Indonesian community kitchen (SPPG), stainless steel counters, staff in aprons and hairnets, hygienic, bright, 1:1" |
| Proses Memasak | `assets/img/gallery/sukun-masak.jpg` | "Cooks stirring large pots of rice and vegetables in an Indonesian institutional kitchen, steam, action shot, 1:1" |
| Lini Pengemasan | `assets/img/gallery/sukun-kemas.jpg` | "Staff packing meals into compartment trays on a packaging line, organized, gloves and hairnets, 1:1" |
| Distribusi | `assets/img/gallery/sukun-distribusi.jpg` | "Meal trays being delivered and handed to schoolchildren at an Indonesian primary school, 1:1" |
| Poster video | `assets/img/gallery/sukun-video.jpg` | "Wide establishing shot of the SPPG kitchen daily operation, cinematic, 16:9" |

> Ulangi keempat kategori untuk `donomulyo`, `poncokusumo`, `simalungun` (ganti prefiks slug).
> Total: 16 foto galeri + 4 poster video.

---

## 5. Kamera dapur / "CAM" (16 still, opsional) — rasio 16:9, ~800×450

Panel kamera. Pola: `assets/img/cams/<slug>-<cam>.jpg` dengan `cam` = `cam1..cam4`
(`cam1`=Dapur Utama, `cam2`=Gudang, `cam3`=Area Masak, `cam4`=Lini Pengemasan).

| Berkas (contoh) | Prompt |
|---|---|
| `assets/img/cams/sukun-cam1.jpg` | "Wide CCTV-style overhead view of a clean Indonesian institutional kitchen main area, slightly desaturated, security-camera angle, 16:9" |
| `assets/img/cams/sukun-cam2.jpg` | "CCTV view of a dry-storage room with food supply shelves, 16:9" |
| `assets/img/cams/sukun-cam3.jpg` | "CCTV view of a cooking area with large pots and stoves, 16:9" |
| `assets/img/cams/sukun-cam4.jpg` | "CCTV view of a meal packaging line, 16:9" |

> Opsional — panel ini sudah punya placeholder "SINYAL KAMERA" yang sengaja terlihat sebagai
> placeholder (bukan CCTV asli). Isi hanya bila ingin tampilan lebih hidup. Ulangi untuk tiap slug aktif.

---

## 6. Avatar testimoni (7 potret) — rasio 1:1, ~400×400

Pola: `assets/img/people/<id>.jpg`

| Berkas | Subjek | Prompt |
|---|---|---|
| `assets/img/people/siswa-1.jpg` | Siswa SD | "Portrait of a cheerful Indonesian elementary school student in uniform, plain background, 1:1, fictional person" |
| `assets/img/people/ortu-1.jpg` | Orang tua | "Portrait of an Indonesian mother, warm smile, plain background, 1:1, fictional person" |
| `assets/img/people/supplier-1.jpg` | Pemasok/petani | "Portrait of an Indonesian male farmer/supplier, friendly, plain background, 1:1, fictional person" |
| `assets/img/people/guru-1.jpg` | Guru | "Portrait of an Indonesian female schoolteacher, professional, plain background, 1:1, fictional person" |
| `assets/img/people/pekerja-1.jpg` | Juru masak SPPG | "Portrait of an Indonesian female kitchen worker with hairnet and apron, plain background, 1:1, fictional person" |
| `assets/img/people/gov-1.jpg` | Pejabat daerah | "Portrait of an Indonesian male local-government official in batik shirt, plain background, 1:1, fictional person" |
| `assets/img/people/intl-1.jpg` | Petugas WFP | "Portrait of an international female aid worker (WFP-style), neutral background, 1:1, fictional person" |

---

## 7. Avatar tim (2 potret) — rasio 1:1, ~400×400

| Berkas | Subjek | Prompt |
|---|---|---|
| `assets/img/people/team-lead.jpg` | Kepala SPPG (spotlight) | "Professional portrait of an Indonesian operations manager, confident, plain neutral background, 1:1, fictional person" |
| `assets/img/people/team-m.jpg` | Anggota tim generik | "Neutral professional portrait of an Indonesian staff member, plain background, 1:1, fictional person" |

> Dipakai berulang untuk seluruh kartu tim. Boleh dibuat beberapa variasi bila diinginkan
> (mis. `team-m.jpg` diganti sesuai kebutuhan).

---

## 8. Resep unggulan (5 foto) — rasio 3:2, ~600×400

Pola: `assets/img/recipe/<nama>.jpg`

| Berkas | Prompt |
|---|---|
| `assets/img/recipe/ayam-kuning.jpg` | "Plated Indonesian yellow turmeric chicken dish, appetizing, top-down, 3:2" |
| `assets/img/recipe/ikan-sei.jpg` | "Plated grilled sei fish dish, 3:2" |
| `assets/img/recipe/tahu-tempe.jpg` | "Plated sweet braised tofu & tempeh, 3:2" |
| `assets/img/recipe/urap.jpg` | "Plated urap (Indonesian spiced vegetable salad with coconut), colorful, 3:2" |
| `assets/img/recipe/semur.jpg` | "Plated beef semur with potato, 3:2" |

---

## 9. Thumbnail komoditas (opsional, 8 foto) — rasio 1:1, ~120×120

Thumbnail kecil di tabel pemasok. Pola: `assets/img/komoditas/<nama>.jpg`
(`wheat, utensils, droplet, leaf, apple, box, milk, flame`). Bisa diabaikan — fallback ke
placeholder makanan. Bila ingin: foto closeup komoditas (beras, daging, ikan, sayur, buah, tahu,
susu, rempah) dengan latar polos, 1:1.

---

## Ringkasan jumlah
- **Wajib untuk efek maksimal:** Hero (1), Menu hari ini (4), Galeri (16), Avatar (9).
- **Pelengkap:** Riwayat menu (8), Resep (5), Kamera (16), Komoditas (8).
- **Total bila lengkap:** ~67 gambar. Tidak ada yang menghentikan situs bila kosong.

## Catatan integritas data
- Jangan menaruh **logo organisasi asli** sebagai gambar yang dibuat AI — di situs, logo mitra
  (Edufarmers, BGN, WFP, dll.) sudah berupa *wordmark* placeholder. Ganti dengan logo resmi hanya
  bila Anda memiliki hak pakainya.
- Hindari menampilkan wajah orang asli yang dapat dikenali untuk avatar; gunakan orang fiktif/ilustratif.
- Foto kamera dapur ditandai **PLACEHOLDER** dan tidak boleh dipromosikan sebagai CCTV langsung.
