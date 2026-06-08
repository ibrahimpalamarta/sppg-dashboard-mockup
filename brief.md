# MBG Dashboard — Build Brief

**For:** Claude Code
**Project:** SPPG Operations & Impact Dashboard — Edufarmers International Foundation, Program Makan Bergizi Gratis (MBG)
**Target domain:** `mbg.zerostunting.com`
**Deliverable:** A high-fidelity, deployable web prototype that makes the CEO and Yayasan owner say *"build this."*

---

## 0. TL;DR — what you are building

A premium, public-facing dashboard for Edufarmers' network of **6 SPPG kitchens** under the national Makan Bergizi Gratis (MBG) program, plus an internal monitoring view and a **form-upload / processing page**. It must look noticeably more polished than the reference material. Build it as a **Next.js app with seeded mock data** (no live backend integrations yet), deployable to Vercel.

The emotional goal: a leadership audience should look at this and immediately trust that the program is well-run, transparent, and impactful — and see how MBG operations fund the **ZeroStunting** mission.

---

## 1. Read these assumptions first (flip any that are wrong)

- **Prototype, not production.** All data is seeded mock data in the repo. No real Runchise, ODOO, or database integration. Architecture should make it *easy* to swap mock data for a real API later, but do not build the API.
- **Auth is mocked.** A simple role switcher gates internal pages. Production will use real RBAC/SSO — out of scope here.
- **Showcase scope.** Include the Impact/SDG page (it wows yayasan owners) but clearly label its figures as illustrative.
- **Indonesian UI, English code.** All user-facing copy is Bahasa Indonesia. Code, comments, and component names are English.
- **No real personal data.** Do not display real staff personal emails/phone numbers on public pages. Use role-based contacts (e.g. `kepala.sppg@...`) and mark personal contacts internal-only.

---

## 2. Reference assets (attached separately in Claude Code)

You will receive three sets of images. Use them with this priority:

| Reference | Role | How to use |
|---|---|---|
| **zerostunting.com full screenshot** | **Brand source of truth** | Extract the real palette, logo treatment, typographic feel, and tone. Match the brand to this. Where this brief's tokens conflict with the screenshot, the screenshot wins for hue/brand. |
| **FFI kitchen dashboard** (`/soe-unit` pages) | **Structure & layout reference** | Replicate the *information architecture and section composition* of the per-unit dashboard (tabs, stat tiles, beneficiary cards, menu card, distribution tables, supplier table, gallery, kitchen-condition cams, profile, impact). Do **not** copy its exact styling — exceed it. |
| **Vendor mockup** (simple dashboard + file-processing page) | **Feature reference to improve** | Take the *concept* of the upload/processing page and rebuild it with far better UX and polish. Treat the vendor's visual quality as the floor, not the target. |

If a reference image and this brief disagree on **layout/sections**, follow the FFI structure. On **brand/visuals**, follow zerostunting.com. On **quality bar**, exceed all of them.

---

## 3. Tech stack & setup

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS, with design tokens in `tailwind.config.ts` and CSS variables
- **UI primitives:** shadcn/ui (Radix-based) for accessible base components
- **Charts:** Recharts (donut, line, bar) — keep them clean and on-palette
- **Motion:** Framer Motion (subtle reveals, number count-up, tab transitions)
- **Map:** react-leaflet (or a lightweight static SVG map of Indonesia) for `/overview`
- **Icons:** lucide-react
- **Data:** seeded mock data as typed modules in `/lib/data/` (TypeScript), imported directly — no fetch layer, but shaped as if it came from an API
- **Deploy:** Vercel-ready (`next build` clean, no server secrets)

Folder structure:

```
/app
  /(public)/page.tsx                 → Beranda
  /unit/[slug]/page.tsx              → Unit dashboard (tabbed)
  /overview/page.tsx                 → Internal multi-kitchen monitor
  /unggah/page.tsx                   → Form upload / processing
  /admin/page.tsx                    → CMS-lite (optional, see §7.6)
  layout.tsx, globals.css
/components
  /layout (Header, Footer, RoleSwitcher, TabNav)
  /unit (StatTile, BeneficiaryCard, MenuCard, NutritionChips,
         DistributionTable, SupplierTable, GalleryGrid, Lightbox,
         TestimonialCarousel, PartnerCards, KitchenCams, CertBadges)
  /charts (BeneficiaryDonut, NutritionTrend, DistributionBar, SdgTile)
  /impact (SroiBanner, EconomicModelCards, TheoryOfChange, RoiBreakdown)
  /upload (Dropzone, FormTypeSelect, ParsePreview, MappingPanel, ConfirmStep, UploadLog)
/lib
  /data (units.ts, menus.ts, schools.ts, suppliers.ts, partners.ts,
         testimonials.ts, impact.ts, uploads.ts, national.ts)
  /types.ts
  /auth-mock.ts
```

---

## 4. Design system

> Derive exact brand hues from the zerostunting.com screenshot. The tokens below are the **system + fallback** — align them to the screenshot's greens and accent. The point is a cohesive, premium, *Indonesian-nonprofit-meets-gov-grade* look: warm, trustworthy, data-confident.

### Palette (fallback — reconcile with screenshot)
```
--brand-forest:  #14532D   /* primary — deep emerald/forest */
--brand-deep:    #0F3D26   /* darker surfaces, footer, hero */
--brand-moss:    #4D7C4A   /* secondary green */
--brand-sage:    #86A789   /* muted green for subtle fills */
--accent-coral:  #B8412B   /* CTAs, highlights, alerts */
--accent-amber:  #C8922E   /* warm secondary accent, badges */
--bg-cream:      #F7F4ED   /* page background (warm off-white) */
--surface:       #FFFFFF   /* cards */
--ink:           #14201A   /* primary text */
--muted:         #5B6B61   /* secondary text */
--border:        #E4E9E2   /* hairlines */
--success:       #2F7A4F
--danger:        #B8412B
/* Data-viz scale */
--viz: [#166534, #0E7490, #C8922E, #B8412B, #4D7C4A]
```

### Typography
- **Display / headings:** `Fraunces` (optical serif, weights 400–600). Big, confident headlines.
- **UI / body:** `Plus Jakarta Sans` (modern, Indonesian-made — fitting for this product).
- **Numbers / data / mono labels:** `JetBrains Mono` (use tabular figures for all stats, money, counts).
- Headline scale is generous (hero 48–64px desktop). Body 15–16px. Eyebrow labels uppercase, letter-spaced, 11–12px.

### Surfaces & spacing
- Cards: `rounded-[20px]`, `--surface` fill, 1px `--border`, soft layered shadow (e.g. `0 1px 2px rgba(20,32,26,.04), 0 8px 24px rgba(20,32,26,.06)`).
- Generous whitespace; 8px spacing scale; section padding 64–96px desktop.
- Status badges: pill, color-coded (AKTIF = green, PERSIAPAN = amber, TIDAK AKTIF = muted).
- Certification badges (SLHS / Halal / HACCP): small pills with check icons.

### Motion (the "alive" layer)
- **Count-up** on all hero/stat numbers when they scroll into view.
- **Staggered fade-up reveal** for cards/sections on scroll (IntersectionObserver).
- **Smooth tab transitions** on the unit dashboard with an animated active indicator.
- **Hover micro-interactions** on cards (subtle lift + border tint).
- Durations 150–280ms, ease-out. Keep it tasteful — never bouncy or gimmicky.

---

## 5. Information architecture / routes

| Route | Page | Access | Purpose |
|---|---|---|---|
| `/` | Beranda (public) | Public | National impact, the MBG→ZeroStunting story, grid of SPPG units |
| `/unit/[slug]` | Unit dashboard | Public | Per-kitchen dashboard, tabbed: Ringkasan · Profil · Menu · Galeri · Dampak |
| `/overview` | Multi-kitchen monitor | Internal | Map + status of all 6 kitchens, aggregate KPIs |
| `/unggah` | Form upload / processing | Internal | Upload SPPG forms → parse → map → confirm (the automation story) |
| `/admin` | CMS-lite (optional) | Internal | Edit master data, manage media — only if time allows |

Global header: logo (ZeroStunting / Edufarmers), nav, unit picker, language toggle (ID/EN — ID functional, EN can be stub), and a **role switcher** (top-right) for the demo.

---

## 6. Data model & mock data

### Real anchor facts (use these for credibility — they are true)
- **6 SPPG kitchens**, 4 AKTIF + 2 PERSIAPAN, across **Jawa Timur (Malang area)** and **Sumatera Utara (Simalungun)**.
- Funding model: **Rp 13.000/pax/hari** (operational, via Virtual Account per kitchen) **+ Rp 6 juta/hari/kitchen** (yayasan incentive from BGN). BGN transfers to each kitchen's VA; settlement every 2 weeks.
- Network serves **~3.992+ beneficiaries/day** (from 3 reporting kitchens); at full operation, **Rp 36 jt/day** total BGN incentive.
- Each active kitchen serves **9+ schools**.
- Operating since **23 Feb 2026** for the active kitchens.
- Beneficiary categories: **Siswa** (TK/SD/SMP/SMA/SMK/Ponpes), **Ibu Hamil & Menyusui**, **Balita**.
- Certifications tracked: **SLHS, Halal, HACCP**.
- Key partners: **Edufarmers, Badan Gizi Nasional (BGN), WFP, Muhammadiyah, Japfa, Google.org**.
- **The mission link:** MBG operating profit is allocated to fund Edufarmers' **ZeroStunting** program per operating area (Malang, Simalungun). Make this connection visible — it is the single most important narrative.

### The 6 kitchens (seed these)
| Slug | Name | Area | Province | Status |
|---|---|---|---|---|
| `sukun` | SPPG Sukun | Malang | Jawa Timur | AKTIF |
| `donomulyo` | SPPG Donomulyo | Malang | Jawa Timur | AKTIF |
| `poncokusumo` | SPPG Poncokusumo | Malang | Jawa Timur | AKTIF |
| `simalungun` | SPPG Simalungun | Simalungun | Sumatera Utara | AKTIF |
| `lawang` | SPPG Lawang | Malang | Jawa Timur | PERSIAPAN |
| `karangnongko` | SPPG Karangnongko | Malang | Jawa Timur | PERSIAPAN |

Generate plausible mock detail (per-school numbers, staff, menu history, supplier lists, testimonials) around these anchors. Mark anything fabricated as illustrative where it could be mistaken for audited fact (especially financial/impact figures).

### Core entities (TypeScript types in `/lib/types.ts`)
- **Unit**: id, slug, name, status, area, province, address, operatingSince, operatingHours, capacity, scheme, mitraUtama[], certifications {slhs, halal, haccp: {status, validUntil}}.
- **OperationalStats** (per unit): pmHarian, sekolahDilayani, posyandu, stafSPPG, relawanSPPI, supplierAktif, totalPorsiKumulatif, totalPorsiHariIni.
- **Beneficiaries**: total, siswa, ibuHamilMenyusui, balita (+ short descriptors).
- **Menu**: today {photo, name, date, nutrition {kalori, protein, lemak, karbo}, components {karbohidrat, lauk, pauk, sayuran, buah, susu}}, history[~14–30], recipes[].
- **School**: name, type, guru, siswa, pm, jarakKm, waktuTempuhMenit.
- **HealthFacility**: name, type (Posyandu/Puskesmas), ibuHamil, balita, pm, jarakKm, waktuTempuh.
- **Supplier**: item, category, jumlah, unit, supplierName, wilayah, thumbnail.
- **Gallery**: photos[] (by category), videos[], kitchenCams[4].
- **Partner**: name, type, description, logo.
- **Testimonial**: name, role, roleTag, quote, avatar, highlight.
- **OrgProfile / TeamMember**: name, role, roleGroup, title, contactRole (public), location.
- **Impact**: sroi, cba copy, economicModel[], sdgTiles[], theoryOfChange, roiBreakdown, monthlyEconomicFlow, commodityProcurement[].
- **National** (aggregate for `/`): totalKitchens, active, prep, pmPerDay, schoolsServed, porsiKumulatif, provinces, zerostuntingAllocation.
- **Upload**: id, fileName, formType, uploadedAt, uploadedBy, status, mappedComponents[].

---

## 7. Page specifications

### 7.1 `/` — Beranda (public)
1. **Hero**: bold headline framing MBG under ZeroStunting (e.g. *"Makan bergizi hari ini, generasi bebas stunting esok"*), short subline, primary CTA ("Lihat unit SPPG") + secondary ("Tentang program"). Background uses brand greens; consider a refined photographic or subtle pattern treatment.
2. **National impact band**: 4–5 big count-up stats (6 dapur, ~3.992+ PM/hari, 9+ sekolah/unit, 2 provinsi, total porsi kumulatif).
3. **MBG → ZeroStunting narrative** *(the differentiator FFI lacks)*: a clean visual showing the flow — *Dapur MBG beroperasi → surplus/profit → mendanai program ZeroStunting per wilayah*. Use a simple 3–4 step horizontal flow with icons and one stat per step.
4. **Unit grid**: cards for all 6 kitchens (name, area, status badge, mini-stats), each linking to `/unit/[slug]`. Active kitchens visually prominent; prep ones marked.
5. **Partners strip**: logos of Edufarmers, BGN, WFP, Muhammadiyah, donors.
6. **Footer**: org info, contacts, links, social. Reuse FFI's footer structure but restyled.

### 7.2 `/unit/[slug]` — Unit dashboard (tabbed)
Sticky unit header at top of every tab: unit name + status badge, "Letak Dapur" (area, full address), and **Mitra Utama** logos (Edufarmers, BGN, WFP). Below it, a sticky **tab nav**: `Ringkasan · Profil · Menu · Galeri · Dampak`.

**Tab: Ringkasan** (default) — match FFI section-for-section, restyled:
- **Sorotan Operasional**: row of stat tiles — Beroperasi Sejak (+ "X bulan melayani"), Jumlah Penerima Manfaat, Jam Operasional, Melayani Sekolah, Posyandu/Puskesmas, Staf SPPG, Jumlah Supplier, Total Porsi, Tersertifikasi (SLHS/Halal/HACCP badges).
- **Overview Beneficiary**: large "Total Penerima Manfaat" with count-up + a **donut chart** splitting Siswa / Ibu Hamil & Menyusui / Balita, plus 3 category cards with short descriptors.
- **Menu Hari Ini**: photo (rounded), menu name, date, **Nutrisi** chips (Kalori/Protein/Lemak/Karbohidrat), and **Komponen Menu** (Karbohidrat, Lauk, Pauk, Sayuran, Buah, Susu with grams).
- **Galeri**: Foto/Video toggle, 4-up image grid with captions, click to open **lightbox**.
- **Testimoni**: filter chips (Semua / Siswa / Orang Tua / Supplier / Guru / Pekerja SPPG / Pemerintah Daerah / Lembaga Internasional) + a swipeable **carousel** of testimonial cards (avatar, name, role tag, quote, highlight line).
- **Rincian Distribusi Sekolah & Kesehatan**: 4 summary tiles (Total Sekolah, Total Siswa, Total Guru, Penerima Manfaat) + a clean **table** (Nama Sekolah, Tipe badge, Guru, Siswa, PM, Jarak, Waktu Tempuh). Add a **Puskesmas & Posyandu** subsection with its own tiles + table (as in the Gisting reference).
- **Manajemen Pemasok & Komoditas**: category filter chips (Semua/Protein/Sayuran/Karbohidrat/Buah-buahan/Kacang-kacangan/Rempah/Susu/Lainnya), counts (Item, Pemasok), + table (Item w/ thumbnail + category, Jumlah, Pemasok pill, Wilayah).
- **Kolaborasi Terbuka — "Berpartner dengan"**: grid of partner cards (Lembaga Riset Pangan, Pusat Inovasi AgriTech, Yayasan Gizi, Komunitas Petani Muda, Institut Ketahanan Pangan, Forum Rantai Pasok), each with "Lihat detail".
- **Kondisi Dapur**: 2×2 grid of **kitchen camera panels** (CAM 1–4) with clear `PLACEHOLDER` styling and labels (Dapur Utama, Gudang, Area Masak, Lini Pengemasan). Make placeholders look intentional and premium, not broken.

**Tab: Profil**
- **Tentang Edufarmers**: org card (logo, tagline, website, "Kunjungi Situs") + Misi & Visi + focus tags + a 2×2 of focus cards (Mentorship, Sustainable Agriculture, Workshops & Training, Innovation Showcase) + Pendekatan Kami + a stat row.
- **Tentang Mitra (WFP / Muhammadiyah / BGN)**: partner profile card + Mandat & Fokus + focus cards.
- **Tim & Organisasi**: summary of staff by role group, a management spotlight card, then **Tim Operasional** grid (role badge, name, title, **role-based contact only**, location). *Do not publish personal phone/email publicly.*

**Tab: Menu**
- Menu Hari Ini (reuse).
- **Riwayat Menu & Pelacakan Nutrisi**: period filter (e.g. "30 hari terakhir"), grid of menu-history cards (photo, date, rating stars, components, nutrition chips). Add a **nutrition trend line chart** (avg kalori/protein over time).
- **Resep Unggulan SPPG**: carousel of recipe cards (photo, name, Kepala SPPG, energi/protein/lemak/karbo, waktu memasak).

**Tab: Dampak** *(showcase — label figures "ilustratif")*
- Header "Laporan Dampak Berkelanjutan".
- **Analisis Dampak Sosial (CBA)** explainer (Pengertian / Manfaat).
- **SROI banner** (e.g. Rasio 1:3,8) — bold, confident.
- **Model Ekonomi cards** (Transfer Nilai ke Rumah Tangga, ROI, Dampak Spillover, Peningkatan Kesehatan, Peningkatan Pendapatan).
- **SDG tiles**: Tanpa Kemiskinan, Tanpa Kelaparan, Kehidupan Sehat, Pendidikan Berkualitas, Kesetaraan Gender, Pekerjaan Layak, Produksi Bertanggung Jawab — each with an icon + one stat.
- **Teori Perubahan**: Activities → Output → Outcome → Impact flow.
- **Manfaat Non-Kuantitatif** cards.
- **SROI / ROI breakdown** (cost components vs benefit components) using a clean bar or split layout.
- **Dampak Ekonomi Program**: monthly economic-flow figure + commodity procurement summary table.

### 7.3 `/overview` — Internal multi-kitchen monitor
- Aggregate KPI row (count-up): Total Dapur, Aktif/Persiapan, Total PM/hari, Total Porsi Kumulatif, Total Sekolah.
- **Map** of Indonesia (focus Jawa Timur + Sumatera Utara) with 6 pins colored by status; clicking a pin → unit summary popover → link to `/unit/[slug]`.
- Status cards per kitchen (name, status, today's porsi, PM, last-updated timestamp).
- A consolidated table of all kitchens with quick stats and a "Buka dashboard" link.
- Include a visible **"Terakhir diperbarui"** timestamp pattern — important because data is upload-driven, not real-time.

### 7.4 `/unggah` — Form upload / processing *(the star — beat the vendor mockup)*
Concept: SPPG staff already fill standard digital forms; this page reads and maps them automatically. Make the flow feel effortless and trustworthy. Use a stepped wizard:

1. **Step 1 — Unggah**: large drag-and-drop dropzone (accept `.xlsx`/`.csv`), a **form-type selector** (Surat Jalan, Pengawasan Pendistribusian, Pemeriksaan Bahan Makanan, Pemantauan Suhu Chiller/Freezer, Sampel Pertinggal, Uji Organoleptik, Inventaris Ompreng, Persiapan Bahan Baku, …), and a unit selector. Show a **recent uploads log** (file, type, time, status, who).
2. **Step 2 — Baca & Petakan**: show the **parsed table** from the file alongside a **mapping panel** that pairs each detected column to a dashboard component (e.g. *"Jumlah Porsi → A-12 Total Porsi Hari Ini"*, *"Tujuan/Sekolah → E-05 Distribusi per Sekolah"*). Use predefined sample parse results — no real parser needed; simulate convincingly per form type.
3. **Step 3 — Verifikasi**: a concise summary of exactly which dashboard tiles will update, with a confirm button. Include a "Tinjau sekilas" note (cheap safeguard against misreads).
4. **Step 4 — Tersimpan**: success state showing an **audit-trail entry** (timestamp, user, file stored permanently). Bonus wow: a small animated preview of the relevant dashboard tile updating with the new value.

Design this page to look like a flagship feature, not a utility. It is the proof that "no extra work for staff" is real.

### 7.5 Auth / role switching (mock)
- A `RoleSwitcher` in the header cycling: **Publik · Pengawas Lapangan · MBG Program Head · Tim Finance · Pembina/CEO**.
- Public role: sees `/` and `/unit/[slug]` (operational + impact, no internal-only contact/finance detail).
- Internal roles: unlock `/overview`, `/unggah`, and any internal-only fields (e.g. personal staff contacts, future finance tiles shown as "Segera — Fase 2").
- Persist selection in a cookie/localStorage for the demo. Add a tiny banner when viewing as an internal role.

### 7.6 `/admin` — CMS-lite (optional, build only if time remains)
Simple forms to edit unit master data and upload gallery media, writing to in-memory/mock state. Skip if it risks the polish of the core pages.

---

## 8. Shared components (build once, reuse)
`StatTile`, `CountUp`, `StatusBadge`, `CertBadge`, `BeneficiaryDonut`, `NutritionChips`, `MenuCard`, `DistributionTable`, `SupplierTable` (with category filter), `GalleryGrid` + `Lightbox`, `TestimonialCarousel` (with filter chips), `PartnerCard`, `KitchenCamPanel`, `TabNav` (animated indicator), `SectionHeader` (eyebrow + title + optional intro), `SdgTile`, `SroiBanner`, `TheoryOfChangeFlow`, `RoleSwitcher`, `Dropzone`, `ParsePreview`, `MappingPanel`, `UploadLog`, `MapPanel`.

---

## 9. The "wow" bar (non-negotiable polish)
- Count-up stats, staggered scroll reveals, animated tab transitions, hover lifts.
- Perfect alignment and consistent spacing; nothing cramped, nothing touching edges.
- Tabular mono figures for every number, money, and metric.
- Consistent image aspect ratios, rounded corners, soft shadows.
- Looks excellent **full-screen on a projector** (the CEO meeting) **and** on a phone.
- Empty/placeholder states (e.g. kitchen cams, prep kitchens) look *designed*, never broken.
- A cohesive brand: same greens, accent, and type everywhere; no stray default-blue or stock-Tailwind look.

---

## 10. Content & data-integrity rules
- Use the real anchor facts (§6) for credibility.
- Label illustrative figures — especially on the Dampak page and any financial number — with a subtle "ilustratif" / "contoh" marker so nothing reads as audited fact.
- Kitchen-camera images: tasteful placeholders clearly marked, **not** passed off as live CCTV.
- No real personal contact data on public pages.
- Keep the tone factual and confident; avoid hype copy.

---

## 11. Non-functional requirements
- **Responsive:** mobile-first, 320px → 1440px+. Tables become horizontally scrollable or stack gracefully on mobile.
- **Performance:** public pages target < 3s on 4G; optimize images (next/image), lazy-load below-the-fold and gallery.
- **Accessibility:** WCAG 2.1 AA — color contrast, keyboard navigation, focus states, alt text, semantic headings.
- **Browser:** modern evergreen browsers.
- **No browser storage abuse:** only the mock role/locale preference in localStorage.

---

## 12. Suggested build order
1. Scaffold Next.js + Tailwind + design tokens + fonts + base layout (header/footer/role switcher).
2. Build the shared component library against mock data.
3. `/unit/[slug]` **Ringkasan** tab first (it's the heaviest and sets the visual bar), then Profil, Menu, Galeri, Dampak.
4. `/` Beranda (reuses unit cards + new national/narrative sections).
5. `/overview` (map + aggregates).
6. `/unggah` (the flagship feature — give it real polish).
7. Responsive pass + motion pass + accessibility pass.
8. Deploy to Vercel.

---

## 13. Definition of done
- [ ] All routes in §5 build and render with seeded mock data; no console errors.
- [ ] Unit dashboard has all 5 tabs, each matching the FFI section composition, restyled to exceed it.
- [ ] Beranda includes the MBG→ZeroStunting narrative section.
- [ ] `/unggah` runs the full 4-step flow with a convincing simulated parse + mapping + audit entry.
- [ ] Role switcher gates internal pages and internal-only fields.
- [ ] Brand matches the zerostunting.com screenshot (palette/type/tone).
- [ ] Fully responsive; passes a basic a11y check; clean `next build`.
- [ ] Looks impressive on a projector and on mobile.

---

## 14. Explicitly out of scope (do not build)
- Real Runchise / ODOO / database integration or any live API.
- Real authentication / SSO / RBAC enforcement (mock only).
- Finance/P&L module (Category D), full supply-chain, full food-safety module — represent these as "Segera — Fase berikutnya" placeholders only.
- Actual file parsing engine — simulate it.

---

*Brief prepared for the MBG Dashboard prototype. Hand this to Claude Code together with the zerostunting.com, FFI dashboard, and vendor-mockup reference images. When brief and screenshot disagree on brand, the screenshot wins; on layout, FFI wins; on quality, exceed both.*
