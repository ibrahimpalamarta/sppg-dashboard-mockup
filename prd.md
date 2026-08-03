I've explored the entire mockup end to end — all public pages, the kitchen detail page, the full internal workspace (8 sub-pages), the 4-step data-input wizard, and the role-based access model (by switching through all four roles). Below is the complete PRD.

A note on one thing I noticed while exploring: every page carries a banner stating the data is simulated ("MOCKUP — seluruh data pada halaman ini simulasi"), and interactive controls like the document "Unduh dokumen"/upload buttons are non-functional placeholders. I've written the PRD as requirements for the real product the mockup represents, not as a description of the mock's stubs.

---

# Product Requirements Document — MBG ZeroStunting Dashboard

## 1. Overview

The MBG ZeroStunting Dashboard is a transparency and analytics layer built on top of Indonesia's **Makan Bergizi Gratis** (MBG / Free Nutritious Meals) program, developed for the **ZeroStunting** mission of EduFarmers International Foundation. It covers a network of **SPPG** kitchens (Satuan Pelayanan Pemenuhan Gizi — nutrition-fulfillment service units) that cook and distribute one nutritious meal per school day to children.

The product's core thesis, stated repeatedly across the site, is that the platform **reads and evaluates data that kitchens already produce — it does not replace kitchen operations**. It scores each portion against nutritional adequacy references, locks records with a timestamp, responsible person, and content fingerprint, and publishes results so anyone can inspect them without special access. Explicitly out of scope for the platform: managing procurement/stock/cooking schedules, replacing existing kitchen systems, deciding menus, or altering locked records (even by an administrator).

The pilot scope is **3 SPPG kitchens in the Malang region, East Java** (2 operating, 1 in preparation).

The product has two surfaces:
- **Public site** — open to anyone, no login: Beranda, Dapur, Menu & Gizi, Transparansi, Tentang.
- **Internal workspace** ("Ruang kerja internal") — role-gated: Ringkasan, Input Data, Jejak Audit, Pengeluaran, Arsitektur, Data Acuan, Dokumen, Pengguna.

The interface language is **Indonesian**, and all number formatting follows Indonesian conventions (period as thousands separator, comma as decimal separator).

## 2. Goals and non-goals

The primary goal is to make every distributed portion traceable and every nutritional figure independently verifiable, so that a meal which is filling but nutrient-poor is not mistaken for program success. Secondary goals are to provide operational visibility to program staff (data-entry compliance, cross-kitchen comparison, operational cost per portion) and to establish an immutable, auditable record trail.

Non-goals are anything that would force kitchens onto a new operational system: the platform deliberately does not manage ingredient purchasing, stock, or cooking schedules, does not author menus (kitchens continue to design menus with their own nutritionists), and never overwrites a locked record.

## 3. Users and roles

The internal workspace defines four roles with a clear escalation of authority, plus a data-scope constraint. The mockup demonstrates these through a role switcher, and each access-denied page enumerates the acting role's permissions.

**Supervisor Lapangan (Field Supervisor)** can upload source files, review the reading results, confirm and lock records, and submit corrections. This role is **scoped to a single assigned kitchen** — the mockup shows a field supervisor limited to SPPG Kedungkandang only. Accessible pages: Input Data and Jejak Audit.

**Administrator Data (Data Administrator)** holds all supervisor permissions plus managing the AKG reference data, managing documents & SOPs, publishing the public menu, and approving corrections, across all kitchens. Accessible pages add Ringkasan, Pengeluaran, Arsitektur, Data Acuan, and Dokumen.

**Pimpinan Program (Program Lead)** is a read-oriented leadership role (the mockup labels a program lead as "hanya baca" / read-only) with program-wide summary visibility.

**Super Admin** additionally accesses **Pengguna** (user management), which is exclusive to this role.

A critical security requirement is stated explicitly on the access-denied pages: **client-side menu hiding is only a convenience**. On the real platform, every request must be re-checked server-side and the role read from the database rather than trusted from a token claim, so that access revocation takes effect immediately rather than at session expiry. Access control and data scoping must be enforced on the server for every request.

## 4. Cross-cutting concepts

Several concepts recur throughout and should be treated as shared platform primitives.

**Locked records and content fingerprint.** Once a daily record is locked it carries a lock timestamp (that cannot be back-dated), the name of the person who locked it, the data source, and a cryptographic **content fingerprint (sidik isi / hash)** summarizing the record's contents — if one figure changes, the fingerprint changes. Locked records are never overwritten.

**Corrections as append-only entries.** A correction never replaces the original. It is recorded as a new entry that references the original record; both remain visible with their own hashes. The mockup illustrates this with a concrete example where a portion weight on a 2026-07-15 menu was corrected the next day, preserving the original entry ("Riwayat yang bisa dihapus bukan riwayat" — history that can be deleted is not history).

**Declared data source.** Every figure records whether it came from a file upload, manual entry, or a partner system, and is never disguised as generic "system data."

**Versioned references.** Both the nutritional-adequacy reference table (AKG) and the source-file templates are managed as versioned data, not hard-coded, so any reference change is recorded and old scores remain traceable.

**Recipient segments.** Nutrition is always evaluated per recipient segment: Balita (1–3 yrs), SD kelas awal (4–6 yrs), SD kelas akhir (7–9 yrs), SMP (10–12 yrs), Ibu hamil (pregnant, by trimester), and Ibu menyusui (breastfeeding, by stage).

**Nine nutrients.** Every portion is scored on nine nutrients: Energi (kcal), Protein (g), Lemak/fat (g), Karbohidrat (g), Serat/fiber (g), Kalsium (mg), Zat besi/iron (mg), Vitamin A (mcg), and Zinc (mg).

## 5. Public site requirements

### 5.1 Global navigation and framing

A persistent header carries the MBG Dashboard brand ("ZeroStunting · EduFarmers"), the five public nav links, and a "Masuk ruang internal" entry to the internal workspace. A persistent footer restates the platform's purpose and repeats the page links, attributed to EduFarmers International Foundation · ZeroStunting.

### 5.2 Beranda (Home)

The home page leads with a hero and a **"Porsi hari ini" (Today's portion)** card showing the featured kitchen, date, and each menu component with its category and weight in grams (e.g., Nasi putih / Karbohidrat / 150 gram). It displays a headline **nutritional-adequacy score** for a chosen segment (SD kelas akhir, showing 90 · "Cukup") on a progress bar, plus the record's provenance: recorded timestamp, responsible person, and truncated content fingerprint, with a lock notice ("Catatan terkunci — tidak dapat diubah, koreksi tercatat terpisah"). Two CTAs route to Menu & Gizi ("Rincian sembilan zat gizi") and Transparansi ("Buka jejak audit").

Below, an **impact metrics** band shows cumulative portions distributed (421,680), daily recipients (5,150), schools served (25 of 34 registered), and days of uninterrupted operation (108).

A **"Di mana dapurnya" (Where the kitchens are)** section presents a nested map (Indonesia → Jawa Timur → Malang Raya) with legend (Beroperasi/Operating vs Persiapan/Preparation) and a set of kitchen cards. Each card shows kitchen name, status badge, region, daily recipients, and school count, with actions **"Lihat profil dapur"** (to the kitchen detail page) and **"Sorot di peta"** (highlight the corresponding pin on the map). Kitchens in preparation show "—" for recipients.

### 5.3 Dapur (Kitchens list)

This page presents the kitchen network with an interactive map ("Pilih satu titik pada peta untuk menyorot dapurnya") and a **"Daftar dapur"** list. Each kitchen entry shows a code (e.g., KDK-01, SGS-02, KPJ-03), status and region badges, full address, responsible person, schools served, operation start date, and **capacity utilization** (e.g., 95% — 2,840 daily recipients of 3,000 capacity). Selecting a map pin highlights the corresponding kitchen and vice versa. Each entry links to the kitchen's full profile. Kitchens in preparation display installed capacity and a start date instead of utilization.

### 5.4 Kitchen detail (Dapur profile)

Reached from the list, each kitchen profile shows a status/code header, address, and identity block (region, responsible person, operating-since date). It provides **summary figures** (daily recipients, schools served, daily capacity, capacity utilization); a **certifications & licensing** section listing documents such as Laik Higiene Sanitasi Jasaboga (issuer Dinkes, number, validity, status) and Sertifikat Halal (BPJPH), each with an Aktif status; a **recent menus** panel showing several dated menus, each with its component chips, total energy per portion, and adequacy score with band label (for a stated segment, e.g., SD kelas akhir 7–9 yrs); a **documentation gallery** with slots for building/cooking-area/distribution photos and an **upload placeholder** ("Unggah foto atau video — JPG, PNG, atau MP4 — oleh supervisor dapur"); and a **transparency trail** block reiterating that each record is timestamped and immutable, showing the record name, lock time, who entered it, and digital fingerprint.

### 5.5 Menu & Gizi (Menu & Nutrition) — the analytical core

This is the most feature-rich public page. It provides:

A **kitchen selector** (operating kitchens only; kitchens in preparation are noted as not yet publishing menus) and a **menu-date selector** (a dropdown of all locked menu days — the mockup lists 22 days, and notes weekends are absent because kitchens are closed).

A **menu breakdown** for the selected day organized by component category (Sumber karbohidrat, Lauk hewani, Lauk nabati, Sayur, Buah, and optionally Susu), each item with weight in grams, plus totals for energy, protein, and portion weight.

A **recipient-segment selector** ("Untuk siapa porsi ini dinilai?") showing all six segments each with an adequacy score and a color-coded band. Selecting a segment recomputes everything below it against that segment's targets. The mockup confirms this is fully dynamic — switching from SD kelas awal to Ibu hamil changed the headline score, the explanatory copy, and every per-nutrient target and status.

A **per-segment adequacy score** with explanation of the scoring method: one meal is targeted to meet a defined share (e.g., 30%) of the segment's daily adequacy; the score is a weighted average of the nine nutrients against that target, **each capped at 100%** so one over-supplied nutrient cannot mask a deficient one. Bands: **Cukup (adequate) from 90%, Perlu perhatian (needs attention) from 70%, Kurang (insufficient) below 70%**.

A **per-nutrient breakdown ("Rincian per nutrien")** for the nine nutrients, each showing a bar with a target marker, the percentage of target met, the actual-vs-target figures (e.g., Kalsium 64% · 192 of 300 mg), and a status label (Cukup / Perlu perhatian / Kurang / **Berlebih** for over-supplied).

An **adequacy history chart ("Riwayat kecukupan")** plotting the overall score across recent operating days (mockup: n=14) with a dashed line at the 90% adequacy threshold and weekends omitted.

A **data-source note** clarifying that AKG figures and food-composition values are simulated and structured to follow **Permenkes No. 28/2019** and the **Tabel Komposisi Pangan Indonesia**, and that in real deployment both are versioned reference data managed via CMS so every reference change is recorded and old scores remain traceable.

### 5.6 Transparansi (Transparency)

A public **document library** with category filters (Semua, SOP, Sertifikat, Laporan, Panduan, Kebijakan) and a name search. Each document card shows category, a **Publik/Internal** visibility tag, title, description, version, last-updated date, and file size, with an "Unduh dokumen" action for public items. Documents marked **Internal** remain listed with full metadata but their download link is withheld (openable only from the internal workspace by authorized users). The mockup lists 10 documents, 8 public/downloadable. Below the library, four **openness principles** are stated: raw data is traceable to source files with uploader and time; locked records are immutable and corrections append; documents are versioned; and data source is always declared, never disguised as "system data."

### 5.7 Tentang (About)

A narrative page describing EduFarmers International Foundation and the ZeroStunting mission, explaining the MBG program and the SPPG kitchen model, and — importantly for scoping — explicitly delineating **what the platform does** (read kitchen-produced data as-is, score each portion per segment, lock records with time/owner/fingerprint, present results openly) versus **what remains the kitchen's responsibility** (procurement, stock, cooking schedules, menu decisions, and existing operational systems — which the platform will not replace or modify). It restates the data-openness commitments (timestamp, responsible person, data source, content fingerprint, append-only corrections) and links out to the audit trail, kitchen list, and menu/nutrition views.

## 6. Internal workspace requirements

The internal workspace uses a distinct dark-sidebar layout. The sidebar organizes navigation under **FASE 1** (the pages below) with a **FASE 2** note indicating future additions (per-school distribution, financial reports, food-safety forms, supply chain, attendance, SDG analytics) that will occupy the same space without changing the navigation structure. A role switcher ("Masuk sebagai") sits at the top; a data-scope indicator ("Lingkup data") and a "Lihat situs publik" link sit at the bottom. Menu items outside the acting role's permission are shown locked; navigating to them yields an "Akses ditutup" page that names the acting role and lists its permissions.

### 6.1 Ringkasan (Program summary)

A program-wide dashboard (as-of date, kitchen count) with headline KPIs (daily recipients and installed capacity, kitchens operating e.g. 2/3, schools served, cumulative portions over N operating days). It shows a **data-entry compliance** panel per kitchen (locked working days out of the last N working days, weekends excluded; e.g., Kedungkandang 100%, Singosari 80% with specific missing dates), with an explicit note that a not-yet-operating kitchen is excluded from compliance and scoring and this does not imply poor performance. It includes a **cross-kitchen adequacy chart** (multi-series line over ~10 days against a stated reference segment, per-nutrient contributions capped at 100%), a **kitchen comparison table** (status, daily recipients, capacity, utilization, schools, average nutrition score from all locked records), and a **recent-activity feed** (last 5 lock/correction events) linking to the full audit trail.

### 6.2 Input Data — daily submission wizard

A four-step wizard: **1 Unggah (Upload) → 2 Pembacaan (Reading) → 3 Tinjau (Review) → 4 Terkunci (Locked)**, contextualized to the acting kitchen, supervisor, and date.

Step 1 offers a file drop zone (accepting the kitchen's existing daily spreadsheets — no re-keying into a form), a list of the user's available files, and a **standard template download**, with copy explaining a uniform worksheet format is what makes machine reading reliable and cross-kitchen comparison possible.

Step 3 is the key validation experience. The system shows what it **read** from the file versus what was **written**, field by field, each with a **confidence score** and a status of "Terbaca jelas" (read clearly) or "Perlu diperiksa" (needs checking). Low-confidence rows are flagged with a reason and an inline correction field. The mockup demonstrates several validation behaviors the real system must support: OCR ambiguity (e.g., "5O g" with a letter O misread as 5, at 62% confidence), **out-of-range anomaly detection** (e.g., 1,250.5 g flagged at 41% as implausible for a single portion — likely a whole-batch total), and **empty-field detection** (a blank Susu UHT column at 35%). The user confirms each row ("Tandai sesuai" / "Perbaiki di sini"), and a running counter ("0 dari 9 baris sudah dikonfirmasi") gates the final **"Kunci dan kirim" (Lock and submit)** action, which stays disabled until all flagged rows are resolved — with a note that nothing is saved until locked.

### 6.3 Jejak Audit (Audit trail)

A filterable log (by kitchen, by action type — Kunci/Koreksi/Unggah/Tinjau/Terbit — and free-text search over entity, actor, or hash) with a match count. It features a **correction spotlight** demonstrating the append-only model side by side (original record preserved with its hash and "Tidak berubah" tag; correction entry with its own hash and "Menunjuk catatan asli" tag), and a full **activity history table** with columns: time, actor (and role), action, entity (with a short summary such as item count and energy), kitchen, data source, and fingerprint.

### 6.4 Pengeluaran (Operational expenses) — internal only

Marked internal (not shown publicly). Provides a kitchen selector and a **period selector** (two periods per month, e.g., "2026-06-P2"). For the selected kitchen/period it shows total recorded cost with a breakdown of **source-file amount vs. manual adjustment**, a **cost-per-portion** figure with its calculation shown (total ÷ (recipients × working days)) and a caveat that it is a lower bound because holidays/absences are not yet counted, a **cost-by-category table** (six categories: Bahan pangan, Tenaga kerja, Kemasan & distribusi, Energi & utilitas, Pemeliharaan, Lainnya — each with source amount, adjustment, total, proportion, and a comparison bar), and an **expense-trend chart** across periods with the current period highlighted. Manual adjustments elsewhere are surfaced as cross-references.

### 6.5 Arsitektur (Data-intake architecture)

An explainer page documenting the ingestion design: the application never talks directly to any source; all sources flow through a single **ingestion interface** (validation, local-number parsing, low-confidence flagging, provenance recording) into a single **normalized schema** (kitchens, menus, nutrition, expenses, commit trail) feeding the outputs (public site, internal dashboard, audit trail, report export). A **source-readiness table** lists Phase 1 sources (file upload, manual input — Tersedia/available) and Phase 2 sources (MCP endpoint, Runchise adapter — Direncanakan/planned), emphasizing that new sources are added as adapters writing to the same interface, not as changes to the running app, and that every audit entry can always name its origin.

### 6.6 Data Acuan (Reference data & templates)

Manages the two things that determine whether the dashboard's numbers can be trusted. First, the **AKG (nutritional adequacy) reference table**: version metadata (version, effective date, source = Permenkes 28/2019, status, last-updated, by whom), a full table of daily requirements per recipient segment across the nine nutrients plus each segment's per-meal target %, a "simulated values" caveat, and actions to **upload a new reference table** and view **version history** — with a note that adequacy thresholds are computed from the target column rather than hard-coded, so portion-adequacy policy is changed here. Second, the **source-file templates**: downloadable templates and a full **data dictionary** for each import. The menu-gizi schema specifies columns (tanggal, kode_dapur, nama_item, kategori, berat_gram, the nine nutrient columns, segmen, catatan) with type, required/optional, example, and validation rules (e.g., date must not be in the future; kitchen code must match a registered kitchen or the row is rejected; category is a controlled vocabulary; units after numbers are ignored; Indonesian number formatting). The pengeluaran schema specifies periode (YYYY-MM-P1/P2), kode_dapur, kategori_biaya (controlled list), jumlah_rupiah (Rp prefix and thousands separators ignored), and a conditional rule where an adjustment amount makes the reason field mandatory (min 10 characters, not merely a dash), plus a unique evidence number per period.

### 6.7 Dokumen (Document management) — Administrator/Super Admin

The internal counterpart to the public Transparency library. Provides an upload area (file drop, category selector, and a **visibility selector: Publik — shown on the transparency page / Internal — workspace only**), search and filters (by name, category, visibility), and a document table with per-document **version history**, uploader, size, updated date, and a **Publik/Internal visibility toggle** per document. This is the control surface that governs which documents appear on the public Transparansi page.

### 6.8 Pengguna (User management) — Super Admin only

Accessible only to Super Admin (locked for all other roles). Intended for managing users, their roles, and kitchen-scope assignments. (The mockup gates this behind Super Admin; detailed screens are not shown in the mockup and should be specified during design.)

## 7. Non-functional and platform requirements

Server-side authorization is mandatory: roles must be read from the database and re-verified on every request, with immediate effect on revocation; client-side hiding is convenience only. Data integrity requires that locked records be immutable, that corrections be append-only with references to originals, and that content hashes be computed and verifiable. Provenance must be captured on every record (source type, actor, timestamp). All reference data and templates must be versioned with retained history so historical scores remain reproducible. The system must correctly parse Indonesian number and date formats and tolerate unit suffixes. The intake layer must be adapter-based so future sources (MCP endpoint, Runchise) integrate without application changes. The interface is Indonesian-language throughout. The design is a responsive web application with a light public theme and a dark internal-workspace theme. Uploads should be constrained by type and size (e.g., documents PDF/DOCX/XLSX up to 25 MB; gallery media JPG/PNG/MP4).

## 8. Roadmap (Phase 2 signals from the mockup)

The mockup explicitly signals Phase 2 scope to be added within the existing internal navigation without restructuring it: per-school distribution tracking, financial reports, food-safety forms, supply-chain data, attendance, and SDG analytics — plus the two planned intake adapters (MCP endpoint and Runchise operational-system pull).

---

If it would help, I can turn any single section (for example, the Menu & Gizi scoring engine or the Input Data validation rules) into a more detailed spec with acceptance criteria, or produce a sitemap/route table and a role-permission matrix as standalone appendices.