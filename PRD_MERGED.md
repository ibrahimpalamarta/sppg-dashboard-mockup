# PRD_MERGED — SPPG / MBG ZeroStunting Dashboard

**Status:** Reconciled draft · **Compiled:** 31 July 2026
**Supersedes for build purposes:** [prd.md](prd.md) and [prdfromzahra.pdf](prdfromzahra.pdf) — build against *this* document only.

---

## 0. Source reconciliation

### 0.1 The two sources

| | **Source A — `prd.md`** | **Source B — `prdfromzahra.pdf`** |
|---|---|---|
| Title | *Product Requirements Document — MBG ZeroStunting Dashboard* | *Product Requirements Document (PRD) — SPPG Dashboard, Phase 1* |
| Stated version | none | **Draft v1** |
| Stated date | none | **15 July 2026** |
| Author / origin | Reverse-engineered by walking the live mockup at `mockup.populix.app/mbg-zerostunting` | Authored by the client team (Zahra) |
| Evidence date | Mockup screenshots in [mockup/](mockup/) are captured **31 July 2026** | — |
| Completeness | Complete prose, no TODOs | Contains **`<<Complete this section>>`** (§2) and **`<<Add content here>>`** (§5.2) — self-declared incomplete |
| Character | Component-level, UI-exact, engine-detailed | Business-level, scope/KPI/NFR-oriented, thin on UI |

### 0.2 Which is authoritative — the rule used here

Neither document supersedes the other outright, and this doc does not pretend otherwise. The rule applied throughout:

> **Source B (PDF) is authoritative for business scope, role taxonomy, exclusions, KPIs, and non-functional requirements.** It is the formal, dated, client-issued document.
>
> **Source A (prd.md) is authoritative for component-level behaviour, the nutrition scoring engine, and screen composition.** It describes a mockup that *postdates* the PDF by 16 days and is corroborated by the screenshots in [mockup/](mockup/), which I verified against it (see §0.4).
>
> **Where the two make incompatible claims about the same thing, nothing is merged silently.** Every such case is logged in the **Conflict Register (§11)** with both versions stated and a recommendation. Conflicts marked **⛔ BLOCKING** need a human decision before the affected component is built.

Caveat on recency: Source A is *evidentially* more recent (its mockup was captured 31 July), but it is a description of a design artifact, not an approved requirement. A newer mockup does not automatically overrule a dated client PRD on questions of scope. That is exactly why scope conflicts below default to B and design conflicts default to A.

### 0.3 Legend

- **✅ CONFIRMED** — both documents agree; treated as settled.
- **➕ CARRIED (A)** / **➕ CARRIED (B)** — only one document specifies it; the detail is carried into the merged spec.
- **⚠️ CONFLICT** — documents disagree; see §11. Merged text states the resolution actually applied.
- **⛔ BLOCKING** — conflict that cannot be resolved without a stakeholder decision.

### 0.4 Verification note

I opened the mockup screenshots and cross-checked them against Source A's prose. The **Menu & Gizi** screen matches Source A in detail — kitchen chips (Kedungkandang / Singosari, with Kepanjen noted as not yet publishing), the 22-day locked-menu dropdown, the six recipient segments with per-segment scores, the 93% headline for *SD kelas awal*, the nine-nutrient breakdown including the **Berlebih** state, and the 14-day history chart with a 90% dashed threshold. Source A is a reliable description of the mockup. I did **not** exhaustively review all 13 screenshots; per-screen visual review is deferred to build time.

---

## 1. Product definition

**✅ CONFIRMED** — Both documents describe one product: a centralized platform for the **Makan Bergizi Gratis (MBG)** program that consolidates data from **SPPG** (*Satuan Pelayanan Pemenuhan Gizi*) kitchens, replacing per-kitchen spreadsheets, and exposes it through a **public dashboard** and a **role-gated internal workspace / backoffice**.

**✅ CONFIRMED** — Problem being solved: data lives in disconnected per-kitchen spreadsheets; no whole-program view; consolidation is manual, slow, and error-prone; poor scalability as the kitchen count grows.

**➕ CARRIED (A)** — The product's stated thesis, which shapes every screen: *the platform reads and evaluates data kitchens already produce; it does not replace kitchen operations.* Kitchens keep their own procurement, stock, cooking schedules, menu authorship, and existing systems.

**➕ CARRIED (A)** — Editorial thesis for the public surface: a meal that is filling but nutrient-poor must not read as program success. This is why per-nutrient scores are capped at 100% (§4.3).

**Language:** Indonesian throughout, `id-ID` number formatting (`.` thousands, `,` decimal). ✅ CONFIRMED (A explicit, B implied by the Indonesian domain).

---

## 2. Scope

### 2.1 In scope — Phase 1

Union of both documents' Phase-1 lists:

- Public dashboard (transparency surface, no authentication). ✅
- Internal dashboard (operational monitoring, role-gated). ✅
- Backoffice for operational data management. ✅
- Data upload → machine processing → validation → approval → import pipeline. ✅
- Authentication + role-based access control. ✅
- Centralized database covering operational, nutritional, financial, and geographic domains. ✅
- Data visualization, search, and filtering. ✅
- **CMS for public-facing content** (content, announcements, gallery, documents). ➕ CARRIED (B) — see ⚠️ C-06.
- **Nutrition adequacy scoring engine** (9 nutrients × 6 recipient segments vs AKG). ➕ CARRIED (A).
- **Immutable locked records + append-only corrections + content fingerprints.** ➕ CARRIED (A) — see ⚠️ C-07.
- **Versioned reference data (AKG) and versioned import templates.** ➕ CARRIED (A).
- **Operational expense tracking per kitchen/period.** ➕ CARRIED (A) — see ⚠️ C-05.
- **Data-intake architecture explainer page.** ➕ CARRIED (A).

### 2.2 Out of scope — Phase 1

**✅ CONFIRMED by both** (B §6.3/§15 explicit; A states the same in narrative form):

- Supply chain / inventory management
- Attendance & workforce management
- **Profit & Loss (P&L) management**
- Mobile application
- Predictive analytics / ML forecasting
- Automated notifications & workflow automation

**➕ CARRIED (B)** — additionally out of scope:

- **CCTV monitoring and live video streaming** — ⚠️ **C-04, see §11. This directly contradicts the current codebase and the build request.**
- Integration with external third-party systems (ERP, accounting, payment) — ⚠️ C-08
- Offline data entry and synchronization
- Advanced BI beyond the defined dashboard requirements

**➕ CARRIED (A)** — additionally out of scope (platform-philosophy exclusions):

- Managing procurement, stock, or cooking schedules
- Authoring or deciding menus (kitchens' nutritionists own this)
- Altering a locked record — *including by an administrator*

### 2.3 Pilot footprint

⚠️ **C-01 — see §11.** Source A specifies **3 kitchens in Malang Raya, East Java** (2 operating, 1 in preparation): **SPPG Kedungkandang (KDK-01)**, **SPPG Singosari (SGS-02)**, **SPPG Kepanjen (KPJ-03, persiapan)**. Source B states no footprint. The current codebase implements a **different, non-matching set of 6 kitchens across 2 provinces**. Resolution required before any data work.

---

## 3. Users & roles

⚠️ **C-02 — BLOCKING. The two documents define entirely different role taxonomies.** Neither is a superset of the other. Full analysis in §11; the mapping below is a *proposal*, not a settled merge.

### 3.1 The two taxonomies

| Source A (mockup-derived) | Source B (client PRD) |
|---|---|
| **Supervisor Lapangan** — upload, review readings, confirm & lock, submit corrections. **Scoped to one assigned kitchen.** Pages: Input Data, Jejak Audit. | **Data Admin** — upload raw data, review AI-processed data, validate, import approved data. No stated kitchen scoping. |
| **Administrator Data** — all supervisor rights + manage AKG reference data, manage documents & SOPs, publish public menu, approve corrections. **All kitchens.** + Ringkasan, Pengeluaran, Arsitektur, Data Acuan, Dokumen. | **CMS Admin** — manage website content, announcements, gallery images, supporting documents. *(No data-pipeline rights.)* |
| **Pimpinan Program** — read-only, program-wide summary. | **Internal User** — view internal dashboards, analyze reports, monitor KPIs, download reports. |
| **Super Admin** — + **Pengguna** (user management), exclusive. | **Public User** — public dashboard only, no login. |

Structural difference worth naming: **B separates content administration from data administration** (CMS Admin ≠ Data Admin). **A fuses them** into one *Administrator Data* who both manages reference data and publishes documents. B has **no Super Admin**; A has **no dedicated CMS role**. A adds a **per-kitchen data scope** that B never mentions.

### 3.2 Proposed reconciled role model *(requires sign-off — see C-02)*

| Merged role | Absorbs | Scope | Pages |
|---|---|---|---|
| **Public User** | B: Public User; A: unauthenticated visitor | — | All public pages |
| **Supervisor Lapangan** | A: Supervisor Lapangan | **Single assigned kitchen** | Input Data, Jejak Audit |
| **Data Admin** | A: Administrator Data (data half); B: Data Admin | All kitchens | + Ringkasan, Pengeluaran, Arsitektur, Data Acuan |
| **CMS Admin** | B: CMS Admin; A: Administrator Data (publishing half) | All kitchens | Dokumen, Galeri, Konten/Pengumuman |
| **Internal User / Pimpinan Program** | A: Pimpinan Program; B: Internal User | All kitchens, **read-only** | Ringkasan, Jejak Audit, Pengeluaran (read), report download |
| **Super Admin** | A: Super Admin | All | All + **Pengguna** |

This proposal keeps B's separation of concerns (its role model is the contractual one) while retaining A's kitchen scoping and Super Admin. It produces **six** roles where each source had four.

### 3.3 Permission matrix *(merged from B §5.2, extended with A's actions)*

| Function | Supervisor | Data Admin | CMS Admin | Internal User | Super Admin | Public |
|---|---|---|---|---|---|---|
| Login | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Upload operational data | ✓ *(own kitchen)* | ✓ | — | — | ✓ | — |
| Review machine-processed data | ✓ *(own kitchen)* | ✓ | — | — | ✓ | — |
| Confirm & **lock** record | ✓ *(own kitchen)* | ✓ | — | — | ✓ | — |
| Submit correction | ✓ *(own kitchen)* | ✓ | — | — | ✓ | — |
| Approve correction | — | ✓ | — | — | ✓ | — |
| Validate & import data | — | ✓ | — | — | ✓ | — |
| Manage AKG reference data | — | ✓ | — | — | ✓ | — |
| Manage import templates | — | ✓ | — | — | ✓ | — |
| Manage website content / announcements | — | — | ✓ | — | ✓ | — |
| Manage gallery & documents | — | — | ✓ | — | ✓ | — |
| Toggle document Publik/Internal | — | — | ✓ | — | ✓ | — |
| View internal dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| View expenses (Pengeluaran) | — | ✓ | — | ✓ *(read)* | ✓ | — |
| View audit trail | ✓ *(own kitchen)* | ✓ | ✓ | ✓ | ✓ | — |
| Download reports | — | ✓ | ✓ | ✓ | ✓ | — |
| **Manage users & roles** | — | — | — | — | ✓ | — |
| View public dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 3.4 Authorization — non-negotiable

**➕ CARRIED (A), reinforced by B §11.1/§13.2.** Source A states this explicitly on its access-denied screens and it is promoted here to a hard requirement:

- Client-side menu hiding is **convenience only**, never a security boundary.
- Every request is re-authorized **server-side**.
- The acting role is read from the **database on each request**, not trusted from a token claim — so revocation takes effect immediately rather than at session expiry.
- **Data scoping** (kitchen assignment) is enforced server-side on every query.
- Sessions expire after inactivity (B §11.1); failed logins are logged (B §11.1).

---

## 4. Cross-cutting platform primitives

### 4.1 Locked records & content fingerprint ➕ CARRIED (A) · ⚠️ C-07

Once a daily record is locked it carries:
- a **lock timestamp** that cannot be back-dated,
- the **name of the person** who locked it,
- the **declared data source**,
- a cryptographic **content fingerprint** (*sidik isi* / hash) over the record's contents — change one figure and the fingerprint changes.

Locked records are **never overwritten**, by anyone, including administrators.

### 4.2 Corrections are append-only ➕ CARRIED (A) · ⚠️ C-07

A correction never replaces the original. It is a **new entry referencing the original record**; both stay visible with their own hashes. Reference example from Source A: a portion weight on the 2026-07-15 menu was corrected the following day, with the original preserved. Governing principle, quoted: *"Riwayat yang bisa dihapus bukan riwayat."*

> ⚠️ This collides with Source B §8.8 ("Delete outdated content") and §11.6 ("Deleted content shall no longer be visible to public users"). Resolution in C-07: **immutability applies to operational/nutrition/expense records; CMS content remains editable and deletable.** Confirm.

### 4.3 Nutrition scoring engine ➕ CARRIED (A)

**Six recipient segments:** Balita (1–3 yr) · SD kelas awal (4–6 yr) · SD kelas akhir (7–9 yr) · SMP (10–12 yr) · Ibu hamil (by trimester) · Ibu menyusui (by stage).

**Nine nutrients:** Energi (kkal) · Protein (g) · Lemak (g) — · Karbohidrat (g) · Serat (g) · Kalsium (mg) · Zat besi (mg) · Vitamin A (mcg) · Zinc (mg).

**Method:** one meal targets a defined share (default **30%**) of the segment's daily AKG. The score is the **weighted average of the nine nutrients against that target, each capped at 100%**, so one over-supplied nutrient cannot mask a deficient one.

**Bands:** **Cukup** ≥ 90% · **Perlu perhatian** ≥ 70% · **Kurang** < 70%. Per-nutrient status adds **Berlebih** for over-supply (>100% of target).

**Thresholds are computed from the AKG table's target column, never hard-coded** — adequacy policy is changed in Data Acuan (§6.6), not in code.

⚠️ **C-09:** Source B's nutrition data model is far thinner (Calories, Protein, Carbohydrates, Fat, Micronutrients-where-applicable) and has **no** AKG, segments, targets, or scoring. A's engine is carried forward as the superset; B's model is treated as an under-specification, not a contradiction. Confirm that the scoring engine is genuinely in Phase 1.

### 4.4 Declared data source ➕ CARRIED (A)

Every figure records its origin — file upload, manual entry, or partner system — and is **never** displayed as generic "system data."

### 4.5 Versioned references ➕ CARRIED (A)

Both the **AKG reference table** and the **import templates** are versioned data with retained history, so reference changes are recorded and historical scores stay reproducible.

### 4.6 Data processing model ⚠️ **C-03 — BLOCKING**

The two documents describe **materially different processing architectures**. See §11. Merged spec below documents both; the pipeline cannot be built until this is settled.

---

## 5. Public dashboard

**Pages:** Beranda · Dapur · Menu & Gizi · Transparansi · Tentang. ➕ CARRIED (A) — B specifies public-dashboard *content* but no page structure, so A's IA is used.

### 5.1 Global chrome ➕ CARRIED (A)

Persistent header: brand ("MBG Dashboard — ZeroStunting · EduFarmers"), five nav links, and **"Masuk ruang internal"** entry. Persistent footer restating platform purpose + page links, attributed to *EduFarmers International Foundation · ZeroStunting*.

### 5.2 Beranda ➕ CARRIED (A)

- **Hero** + **"Porsi hari ini"** card: featured kitchen, date, each menu component with category and weight in grams (e.g. *Nasi putih / Karbohidrat / 150 gram*).
- **Headline adequacy score** for a chosen segment on a progress bar, with provenance: recorded timestamp, responsible person, truncated content fingerprint, and lock notice (*"Catatan terkunci — tidak dapat diubah, koreksi tercatat terpisah"*).
- Two CTAs → Menu & Gizi (*"Rincian sembilan zat gizi"*) and Transparansi (*"Buka jejak audit"*).
- **Impact metrics band**: cumulative portions distributed, daily recipients, schools served (n of m registered), days of uninterrupted operation. *(Source A's mockup values: 421,680 / 5,150 / 25 of 34 / 108.)*
- **"Di mana dapurnya"**: nested map (Indonesia → Jawa Timur → Malang Raya) with **Beroperasi / Persiapan** legend, plus kitchen cards showing name, status badge, region, daily recipients, school count, and actions **"Lihat profil dapur"** and **"Sorot di peta"**. Preparation kitchens show "—" for recipients.
- **Announcements / public updates** ➕ CARRIED (B §9.1) — see C-10.

### 5.3 Dapur (kitchen list) ➕ CARRIED (A)

Interactive map (*"Pilih satu titik pada peta untuk menyorot dapurnya"*) + **"Daftar dapur"**. Each entry: kitchen **code** (KDK-01 / SGS-02 / KPJ-03), status and region badges, full address, responsible person, schools served, operation start date, and **capacity utilization** (e.g. 95% — 2,840 of 3,000). Map-pin selection and list highlight are **bidirectional**. Preparation kitchens show installed capacity and a start date instead of utilization.

### 5.4 Kitchen detail ➕ CARRIED (A)

Status/code header, address, identity block (region, responsible person, operating-since). Then:
- **Summary figures** — daily recipients, schools served, daily capacity, capacity utilization.
- **Certifications & licensing** — e.g. *Laik Higiene Sanitasi Jasaboga* (issuer Dinkes, number, validity, status) and *Sertifikat Halal* (BPJPH), each with an Aktif status.
- **Recent menus** — dated menus with component chips, total energy per portion, adequacy score + band for a stated segment.
- **Documentation gallery** — building / cooking-area / distribution photos, plus an **upload placeholder** (*"Unggah foto atau video — JPG, PNG, atau MP4 — oleh supervisor dapur"*).
- **Transparency trail** — record name, lock time, who entered it, digital fingerprint.

> ⚠️ **C-04:** the current codebase renders a **kitchen-camera panel** here. Source B puts CCTV explicitly out of scope. See §11.

### 5.5 Menu & Gizi — the analytical core ➕ CARRIED (A)

*Verified against [mockup/…-menu-….jpg](mockup/screencapture-mockup-populix-app-mbg-zerostunting-menu-2026-07-31-11_38_13.jpg).*

1. **Kitchen selector** — operating kitchens only; preparation kitchens noted as not yet publishing menus.
2. **Menu-date selector** — dropdown of all locked menu days (mockup: 22); weekends absent because kitchens are closed.
3. **Menu breakdown** by component category — *Sumber karbohidrat, Lauk hewani, Lauk nabati, Sayur, Buah*, optionally *Susu* — each item with weight in grams; totals for energy, protein, and portion weight.
4. **Recipient-segment selector** (*"Untuk siapa porsi ini dinilai?"*) — all six segments, each with its own score and colour-coded band. Selecting a segment **recomputes everything below it** against that segment's targets (headline score, explanatory copy, every per-nutrient target and status).
5. **Per-segment adequacy score** with the method explained inline (§4.3), including the stated bands.
6. **Rincian per nutrien** — nine bars with a target marker, % of target met, actual-vs-target figures (e.g. *Kalsium 64% · 192 dari 300 mg*), and status label incl. **Berlebih**.
7. **Riwayat kecukupan** — overall score across recent operating days (mockup: n=14), dashed line at the 90% threshold, weekends omitted.
8. **Data-source note** — AKG figures and food-composition values are simulated but structured to follow **Permenkes No. 28/2019** and the **Tabel Komposisi Pangan Indonesia**; in real deployment both are versioned reference data managed via CMS.

### 5.6 Transparansi ➕ CARRIED (A)

Public **document library** with category filters (Semua, SOP, Sertifikat, Laporan, Panduan, Kebijakan) and name search. Each card: category, **Publik/Internal** visibility tag, title, description, version, last-updated, file size, and **"Unduh dokumen"** for public items. **Internal** documents stay listed with full metadata but the download link is withheld. *(Mockup: 10 documents, 8 public.)*

Below, four **openness principles**: raw data traceable to source files with uploader and time; locked records immutable with corrections appended; documents versioned; data source always declared, never disguised as "system data."

### 5.7 Tentang ➕ CARRIED (A)

Narrative on EduFarmers International Foundation and the ZeroStunting mission; the MBG program and SPPG kitchen model; and an explicit delineation of **what the platform does** vs **what remains the kitchen's responsibility** (§1). Restates the data-openness commitments and links out to audit trail, kitchen list, and menu/nutrition views.

### 5.8 Public-dashboard requirements from Source B ➕ CARRIED (B §9.1)

Cross-check list — the merged public surface must also satisfy: general MBG program information ✓(5.7); kitchen profiles and locations ✓(5.3/5.4); daily or periodic menu information ✓(5.5); nutritional information ✓(5.5); program statistics and KPIs ✓(5.2); gallery images and supporting documents ✓(5.4/5.6); **announcements and public updates** ⚠️ C-10; search and filtering ✓(5.6); clear, responsive, user-friendly interface ✓.

---

## 6. Internal workspace / backoffice

Dark-sidebar layout, distinct from the public theme. ➕ CARRIED (A).

Sidebar groups navigation under **FASE 1** with a **FASE 2** note for future additions that will occupy the same space without restructuring navigation. A role switcher (*"Masuk sebagai"*) sits at top; a data-scope indicator (*"Lingkup data"*) and a *"Lihat situs publik"* link at bottom. Menu items outside the acting role's permission render **locked**; navigating to them yields an **"Akses ditutup"** page naming the acting role and listing its permissions.

**Pages:** Ringkasan · Input Data · Jejak Audit · Pengeluaran · Arsitektur · Data Acuan · Dokumen · Pengguna. ➕ CARRIED (A).

### 6.1 Ringkasan ➕ CARRIED (A)

Program-wide dashboard (as-of date, kitchen count) with:
- **Headline KPIs** — daily recipients and installed capacity, kitchens operating (e.g. 2/3), schools served, cumulative portions over N operating days.
- **Data-entry compliance** per kitchen — locked working days out of the last N working days, **weekends excluded** (e.g. Kedungkandang 100%, Singosari 80% with the specific missing dates named), plus an explicit note that a not-yet-operating kitchen is **excluded from compliance and scoring** and that this does not imply poor performance.
- **Cross-kitchen adequacy chart** — multi-series line over ~10 days against a stated reference segment, per-nutrient contributions capped at 100%.
- **Kitchen comparison table** — status, daily recipients, capacity, utilization, schools, average nutrition score across all locked records.
- **Recent-activity feed** — last 5 lock/correction events, linking to the full audit trail.

### 6.2 Input Data — daily submission wizard ➕ CARRIED (A) · ⚠️ C-03

Four steps: **1 Unggah → 2 Pembacaan → 3 Tinjau → 4 Terkunci**, contextualized to the acting kitchen, supervisor, and date.

**Step 1 — Unggah.** File drop zone accepting the kitchen's **existing daily spreadsheets** (no re-keying into a form), a list of the user's available files, and a **standard template download**. Copy explains that a uniform worksheet format is what makes machine reading reliable and cross-kitchen comparison possible. Uploaded files are format-validated and rejected if unsupported or corrupt (B §11.2); each upload is recorded with date, time, and user (B §11.2).

**Step 2 — Pembacaan.** The file is parsed and structured into the normalized schema; incomplete or invalid data is flagged for review (B §8.4). Reprocessing is supported (B §8.4).

**Step 3 — Tinjau.** The key validation experience. The system shows **what it read** vs **what was written**, field by field, each with a **confidence score** and status **"Terbaca jelas"** or **"Perlu diperiksa"**. Low-confidence rows carry a reason and an inline correction field. Behaviours the real system must support, per Source A's demonstrated cases:
- **OCR ambiguity** — e.g. `5O g` with a letter O misread, flagged at 62% confidence.
- **Out-of-range anomaly detection** — e.g. `1.250,5 g` flagged at 41% as implausible for a single portion (likely a whole-batch total).
- **Empty-field detection** — e.g. a blank *Susu UHT* column at 35%.

The user confirms each row (*"Tandai sesuai"* / *"Perbaiki di sini"*). A running counter (*"0 dari 9 baris sudah dikonfirmasi"*) **gates** the final action.

**Step 4 — Terkunci.** **"Kunci dan kirim"** stays **disabled until every flagged row is resolved**, with a note that **nothing is saved until locked**. On lock, the record receives its timestamp, owner, source, and content fingerprint (§4.1). Duplicate imports are prevented (B §11.4); import history is retained (B §11.4); failed imports produce an error and **preserve the original upload** for review (B §11.4).

### 6.3 Jejak Audit ➕ CARRIED (A)

Filterable log — by kitchen, by action type (**Kunci / Koreksi / Unggah / Tinjau / Terbit**), and free-text search over entity, actor, or hash — with a match count.

- **Correction spotlight** demonstrating the append-only model side by side: original record preserved with its hash and a **"Tidak berubah"** tag; correction entry with its own hash and a **"Menunjuk catatan asli"** tag.
- **Activity history table** — columns: time, actor (and role), action, entity (with a short summary such as item count and energy), kitchen, data source, fingerprint.

Extended per B §13.5 to also record: CMS content create/update/delete, user login activity, and administrative actions.

### 6.4 Pengeluaran — internal only ➕ CARRIED (A) · ⚠️ C-05

Not shown publicly. Kitchen selector + **period selector** (two periods per month, e.g. `2026-06-P2`). For the selected kitchen/period:
- **Total recorded cost**, split into **source-file amount vs. manual adjustment**.
- **Cost per portion**, with the calculation shown — `total ÷ (recipients × working days)` — and the caveat that it is a **lower bound** because holidays and absences are not yet counted.
- **Cost-by-category table** — six categories: *Bahan pangan, Tenaga kerja, Kemasan & distribusi, Energi & utilitas, Pemeliharaan, Lainnya* — each with source amount, adjustment, total, proportion, and a comparison bar.
- **Expense-trend chart** across periods, current period highlighted.
- Manual adjustments surfaced as cross-references.

> This is **expense tracking, not P&L**. Source B excludes P&L management, which this does not implement. Flagged anyway as C-05 because it is adjacent to an explicit exclusion.

### 6.5 Arsitektur ➕ CARRIED (A)

Explainer documenting the ingestion design: the application **never talks directly to any source**; all sources flow through a single **ingestion interface** (validation, local-number parsing, low-confidence flagging, provenance recording) into a single **normalized schema** (kitchens, menus, nutrition, expenses, commit trail) feeding the outputs (public site, internal dashboard, audit trail, report export).

**Source-readiness table** — Phase 1: file upload, manual input (*Tersedia*). Phase 2: MCP endpoint, Runchise adapter (*Direncanakan*) ⚠️ C-08. Emphasis: new sources are added as **adapters writing to the same interface**, not as changes to the running app; every audit entry can always name its origin.

### 6.6 Data Acuan ➕ CARRIED (A)

Two things that determine whether the numbers can be trusted.

**A. AKG reference table** — version metadata (version, effective date, source = *Permenkes 28/2019*, status, last-updated, by whom); full table of daily requirements per recipient segment across the nine nutrients, plus each segment's **per-meal target %**; a "simulated values" caveat; actions to **upload a new reference table** and view **version history**. Note that adequacy thresholds are computed from the target column rather than hard-coded — **portion-adequacy policy is changed here**.

**B. Source-file templates** — downloadable templates plus a full **data dictionary** per import.

*menu-gizi schema* — columns `tanggal`, `kode_dapur`, `nama_item`, `kategori`, `berat_gram`, the nine nutrient columns, `segmen`, `catatan`; each with type, required/optional, example, and validation rules:
- date must not be in the future;
- kitchen code must match a registered kitchen or **the row is rejected**;
- category is a controlled vocabulary;
- units after numbers are ignored;
- Indonesian number formatting is parsed.

*pengeluaran schema* — `periode` (`YYYY-MM-P1`/`P2`), `kode_dapur`, `kategori_biaya` (controlled list), `jumlah_rupiah` (`Rp` prefix and thousands separators ignored); plus a **conditional rule**: an adjustment amount makes the reason field **mandatory (min 10 characters, not merely a dash)**; and a **unique evidence number per period**.

### 6.7 Dokumen ➕ CARRIED (A) + ➕ CARRIED (B §8.8)

Internal counterpart to the public Transparansi library:
- **Upload area** — file drop, category selector, and a **visibility selector: Publik** (shown on the transparency page) **/ Internal** (workspace only).
- Search and filters by name, category, visibility.
- **Document table** with per-document **version history**, uploader, size, updated date, and a **Publik/Internal toggle**.

This is the control surface governing what appears on the public Transparansi page.

**Merged in from B §8.8 (CMS):** create / edit / delete content, upload gallery images, upload supporting documents, **preview before publishing**, publish approved content.

### 6.8 CMS — content & announcements ➕ CARRIED (B) · ⚠️ C-06

Source B specifies a CMS module that Source A does not surface as its own page. Merged requirement:

- Manage **website content** and **announcements** displayed on the public dashboard.
- Manage **gallery images** (Image ID, title, description, upload date, uploaded by, category — B §10.6).
- Manage **supporting documents** (§6.7).
- **Preview** changes before publishing (B §7.2).
- Published content appears on the public dashboard immediately, or per a configured publishing schedule (B §11.6).
- Deleted content is no longer visible to public users (B §11.6) — ⚠️ reconcile with §4.2, see C-07.
- Only authorized CMS Administrators may create, edit, or publish (B §11.6).
- All CMS activity is recorded for audit (B §11.6).
- Gallery and document uploads must comply with approved formats and size limits (B §11.6).

### 6.9 Pengguna — Super Admin only ➕ CARRIED (A) + ➕ CARRIED (B §10.8)

Manage users, roles, and **kitchen-scope assignments**. Source A gates this behind Super Admin but shows no detailed screens; Source B supplies the data model: **User ID, Full Name, Email Address, User Role, Account Status (Active/Inactive), Last Login**.

Detailed screens to be specified during design. ⚠️ C-11.

---

## 7. Data model

Merged from B §10 (domains and data points) and A (nutrition/audit depth). B's model is the skeleton; A supplies the fields B lacks.

### 7.1 Kitchen (SPPG)
`Kitchen ID` · `Code` (KDK-01 …) ➕A · `Name` · `Status` (Beroperasi / Persiapan) ➕A · `Address` ➕A · `Responsible person` ➕A · `Operating since` ➕A · `Installed capacity` ➕A · `Daily recipients` ➕A · `Schools served` ➕A · Geographic FK.

> ⚠️ **C-12:** Source B §10.4 "Kitchen Information" is **mis-pasted** — its data points duplicate §10.2 Transactions (Transaction ID, Transaction Date, Number of Meals, Operational Status, Remarks). Treated here as a defect in B; A's kitchen fields are used.

### 7.2 Geographic ➕ CARRIED (B §10.5)
`Province` · `City/Regency` · `District` · `Village` · `Latitude` · `Longitude`.

> Note: A's map is a **nested stylized map** (Indonesia → Jawa Timur → Malang Raya), not a coordinate-projected geographic map. Lat/long is still captured per B; whether the UI projects it is a design decision. ⚠️ C-13.

### 7.3 Menu ➕ CARRIED (B §10.1), extended by A
`Menu ID` · `Menu Date` · `Kitchen ID` · `Food Items` (list) · `Portion Size`.
Extended: per-item `kategori` (controlled vocabulary), per-item `berat_gram`, menu totals (energy, protein, portion weight), `locked_at`, `locked_by`, `source`, `content_hash`.
⚠️ **C-14:** B has `Meal Type` (Breakfast, Lunch, Snack); A models **one meal per school day**. See §11.

### 7.4 Nutrition ➕ CARRIED (B §10.3), superseded in depth by A
B: `Nutrition ID` · `Menu ID` · `Calories` · `Protein` · `Carbohydrates` · `Fat` · `Micronutrients`.
**Merged (A governs):** the **nine nutrients** per §4.3, evaluated per **recipient segment**, against a **versioned AKG table** with per-segment per-meal target %, producing per-nutrient % (capped 100%) + status, and an overall score + band.

### 7.5 Transactions / distribution ➕ CARRIED (B §10.2)
`Transaction ID` · `Transaction Date` · `Kitchen ID` · `Number of Meals` · `Operational Status` (Completed / Pending / Cancelled) · `Remarks`.

### 7.6 Expenses ➕ CARRIED (A)
`periode` (`YYYY-MM-P1|P2`) · `kode_dapur` · `kategori_biaya` (six-value controlled list) · `jumlah_rupiah` · `adjustment_amount` · `adjustment_reason` (mandatory ≥10 chars when adjustment present) · `evidence_number` (unique per period).

### 7.7 Gallery ➕ CARRIED (B §10.6)
`Image ID` · `Image Title` · `Description` · `Upload Date` · `Uploaded By` · `Category`.

### 7.8 Documents ➕ CARRIED (B §10.7), extended by A
`Document ID` · `Document Title` · `Category` · `Upload Date` · `Uploaded By` · `File Type`.
Extended: `version`, `version_history`, `visibility` (Publik/Internal), `file_size`, `description`, `last_updated`.

### 7.9 Users ➕ CARRIED (B §10.8), extended by A
`User ID` · `Full Name` · `Email Address` · `User Role` · `Account Status` · `Last Login`.
Extended: `assigned_kitchen` (data scope).

### 7.10 Commit / audit trail ➕ CARRIED (A)
`entry_id` · `timestamp` · `actor` + `role` · `action` (Kunci/Koreksi/Unggah/Tinjau/Terbit) · `entity` + summary · `kitchen` · `data_source` · `content_hash` · `references_entry_id` (for corrections).

### 7.11 Reference data ➕ CARRIED (A)
AKG table versions (`version`, `effective_date`, `source`, `status`, `updated_at`, `updated_by`, per-segment × per-nutrient daily requirement, per-segment per-meal target %) and import-template versions.

---

## 8. Business rules

Merged; source noted per group.

**Authentication (B §11.1)** ✅ — only registered users access Backoffice/Internal; valid credentials required; role-limited access; sessions expire on inactivity; failed logins logged.

**Upload (B §11.2 + A)** ✅ — only authorized roles upload; files must follow the approved template; completeness verified before processing; unsupported/corrupt files rejected; every upload recorded with date, time, user. ➕A: uploads are scoped to the user's assigned kitchen.

**Validation (B §11.3 + A)** ✅ — machine-processed data reviewed before publication; mandatory fields complete before approval; invalid/incomplete records flagged; data editable **during validation**; only validated records proceed to import. ➕A: per-field confidence scores; the lock action is gated until all flagged rows are resolved; nothing persists until locked.

**Import (B §11.4)** ✅ — only approved data imported; duplicates rejected; import history retained; imported data updates dashboards; failed imports error and preserve the original upload.

**Immutability (A)** ➕ ⚠️C-07 — locked operational records are never overwritten; corrections are append-only entries referencing the original; content hashes computed and verifiable.

**Dashboard visibility (B §11.5)** ✅ — public users see only information designated for public release; internal data restricted to authorized users; dashboards show the most recently approved data; role-limited views; unapproved or draft content **never** appears publicly.

**CMS (B §11.6)** ➕ — see §6.8.

**Nutrition scoring (A)** ➕ — see §4.3.

---

## 9. Non-functional requirements

Merged from B §13, with A's additions.

**Performance (B)** — dashboard pages load < 3 s under normal conditions; multiple concurrent users without significant degradation; large datasets processed efficiently; dashboard queries optimized.

**Security (B + A)** — authentication required for Backoffice/Internal; **RBAC enforced server-side on every request with the role read from the database** (A, §3.4); credentials and sensitive data encrypted; operational data protected from unauthorized access; security events logged; public users cannot reach restricted information.

**Availability (B)** — available during operational hours with minimal downtime; graceful failure recovery; data integrity preserved through interruptions; scheduled maintenance with minimal impact; backup and recovery supported.

**Accessibility (B)** — modern browsers; **responsive across desktop, tablet, mobile**; clear consistent navigation; easy-to-understand presentation; usable across technical skill levels.

**Auditability (B + A)** — record all uploads and imports; audit trail for data modifications; log CMS create/update/delete; record logins and admin actions; historical review available to administrators. ➕A: verifiable content fingerprints and append-only correction chains.

**Localization (A)** — Indonesian interface throughout; `id-ID` number and date parsing/formatting; tolerate unit suffixes after numbers.

**Extensibility (A)** — adapter-based intake so future sources integrate without application changes.

**Theming (A)** — light public theme, dark internal-workspace theme.

**Upload constraints (A)** — documents PDF/DOCX/XLSX up to 25 MB; gallery media JPG/PNG/MP4.

---

## 10. Success metrics ➕ CARRIED (B §12)

Source A defines no KPIs. B's are adopted wholesale.

**Business** — SPPG coverage > 90% · Data reporting compliance > 95% · Dashboard adoption > 90% · Public information availability 100%.

**Product** — Successful file upload rate > 98% · AI processing success rate > 95% · Data validation accuracy > 98% · Dashboard availability > 99% · Average dashboard response time < 3 s.

**Operational** — Data processing time (upload → publication) < 30 min · Import success rate > 98% · Data error rate < 2% · Dashboard refresh: real-time or scheduled · Average data validation time: continuous improvement.

> Note: B's "Data Validation Accuracy" reuses the description text of "AI Processing Success Rate" ("Percentage of uploaded files successfully processed"). Presumed copy-paste defect in B; the intended meaning is presumably the share of validated records requiring no post-import correction. ⚠️ minor, C-15.

---

## 11. Conflict register

Every place the two documents disagree. **Nothing here has been silently merged.**

---

### ⚠️ C-01 — Kitchen network footprint
| | |
|---|---|
| **Source A** | 3 kitchens, Malang Raya, East Java: Kedungkandang (KDK-01), Singosari (SGS-02), Kepanjen (KPJ-03, persiapan). 2 operating, 1 preparing. Corroborated by all mockups. |
| **Source B** | Silent — describes "a growing network of SPPG kitchens across Indonesia" with no pilot footprint. |
| **Current codebase** | **Neither.** 6 kitchens across 2 provinces: Sukun, Donomulyo, Poncokusumo, Simalungun (aktif), Lawang, Karangnongko (persiapan). |
| **Assessment** | Not a document-vs-document conflict — a **document-vs-code** conflict. A is specific and evidence-backed; B does not contradict it. |
| **Recommendation** | **Adopt Source A's 3-kitchen Malang footprint** and migrate the codebase's data layer. The existing 6-unit set matches no PRD and appears to predate both. |
| **Severity** | High — touches every screen and all mock data. |

---

### ⛔ C-02 — Role taxonomy — **BLOCKING**
| | |
|---|---|
| **Source A** | Supervisor Lapangan · Administrator Data · Pimpinan Program · Super Admin. Kitchen-scoped supervisors. Data + publishing rights fused in one admin role. |
| **Source B** | Data Admin · CMS Admin · Internal User · Public User. Content admin separated from data admin. No Super Admin. No kitchen scoping. |
| **Current codebase** | **A third, different set:** publik · pengawas · program · finance · ceo. Matches neither. |
| **Assessment** | Genuinely incompatible. B splits a concern A fuses; A adds a scope dimension and a tier B lacks. Cannot be merged without a decision about whether content administration is its own job function. |
| **Recommendation** | The six-role model proposed in §3.2 — it preserves B's separation of duties (contractual) plus A's kitchen scoping and Super Admin tier. **Needs explicit sign-off**; it changes the permission matrix, the access-denied screens, and the Pengguna module. |
| **Severity** | **Blocking** — no role-gated surface can be built correctly until this is settled. |

---

### ⛔ C-03 — Data processing architecture — **BLOCKING**
| | |
|---|---|
| **Source B (§1, §8.4)** | *"Data is cleaned by **Claude in a desktop app** before it ever reaches the website. That keeps the cost of AI out of the product. One admin cleans the file, a second admin checks it by hand, and only then does it get uploaded."* → AI runs **outside** the product; the web app receives already-structured, already-verified data. Explicitly a cost decision. |
| **Source A (§6.2, §6.5)** | Parsing happens **inside** the platform: an in-app ingestion interface performs validation, local-number parsing, OCR-ambiguity detection, out-of-range anomaly detection, empty-field detection, and per-field **confidence scoring**, surfaced in the Step-3 review UI. |
| **Assessment** | Directly contradictory and **architecturally decisive**. B's model implies the Step-3 confidence-score experience is largely unnecessary (data arrives clean); A's model makes it the centrepiece of the internal workspace. B also frames it as a **cost** constraint, which A never addresses. B is the more recent *formal* statement (15 July) but A's mockup (31 July) still shows the in-app flow — so it is unclear whether the desktop-app decision was superseded, or whether the mockup simply predates its adoption. |
| **Recommendation** | **Do not build either pipeline until resolved.** A viable hybrid: keep A's Step-3 review UI as the **two-admin manual verification checkpoint** B requires, but drive it from deterministic rule-based validation rather than in-app AI — which satisfies B's cost constraint while preserving A's UX. **Confirm with the client before building.** |
| **Severity** | **Blocking** — determines whether Input Data is a review tool or a processing engine. |

---

### ⛔ C-04 — CCTV / kitchen cameras — **BLOCKING**
| | |
|---|---|
| **Source B (§6.3, §15)** | **"CCTV monitoring and live video integration"** — explicitly listed **out of scope**, twice. |
| **Source A** | Silent — never mentions cameras. Its kitchen-detail page has a photo/video documentation gallery only. |
| **Current codebase** | [js/unit.js:244](js/unit.js#L244) implements `kitchenCams()`; [CLAUDE.md](CLAUDE.md) mandates *"Kitchen-camera panels must stay visibly labeled placeholders and must never be presented as live CCTV."* |
| **The build request** | Asks for AI-generated imagery for *"anything presented as real kitchen documentation (photos, **CCTV feeds**, staff/site evidence)."* |
| **Assessment** | The build request asks for a feature **Source B explicitly excludes**, which **neither PRD** contains, and which exists in the codebase as scope creep. Generating realistic AI imagery for it would additionally manufacture something that looks like real kitchen surveillance evidence — the exact presentation CLAUDE.md forbids. |
| **Recommendation** | **Drop the kitchen-camera panel** (see also §12, SC-02). If a visual placeholder for kitchen documentation is wanted, use the **documentation gallery** from A §5.4 — clearly labelled illustrative photos, not a camera feed. I have not generated CCTV imagery. |
| **Severity** | **Blocking** — needs an explicit decision; I will not build it against an explicit exclusion without one. |

---

### ⚠️ C-05 — Expenses vs. P&L
| | |
|---|---|
| **Source A (§6.4)** | Full **Pengeluaran** module: total cost, source-vs-adjustment split, cost per portion, six-category breakdown, period trend. |
| **Source B (§6.3, §15)** | **"Financial Profit & Loss (P&L) management"** out of scope. §8.7/§9.2 *do* require the internal dashboard to *"display financial and expenditure information."* |
| **Assessment** | **Not actually contradictory.** Expense tracking ≠ P&L management. B excludes P&L but affirmatively requires expenditure display. A's module satisfies B §8.7. |
| **Recommendation** | **Build Pengeluaran as specified in A.** Keep it strictly expenditure reporting — no revenue, margin, or profit calculation — so it stays clear of B's exclusion. Note the existing codebase separately defers finance as *"Segera — Fase berikutnya"* ([CLAUDE.md](CLAUDE.md)), which contradicts A; A wins. |
| **Severity** | Low — flagged for visibility, resolution is clear. |

---

### ⚠️ C-06 — CMS module presence
| | |
|---|---|
| **Source B** | A **first-class CMS module** is core Phase-1 scope (§6.1, §6.2, §8.8, §9.3, §11.6) covering website content, announcements, gallery images, and documents, with preview-before-publish and a dedicated **CMS Admin** role. |
| **Source A** | No CMS page. Only **Dokumen** (document management with a Publik/Internal toggle). No content editing, no announcements, no gallery management. |
| **Assessment** | B has substantial detail A lacks entirely. Carried forward per the merge rule. A's *Dokumen* is a **subset** of B's CMS. |
| **Recommendation** | **Build B's CMS** (§6.8), with A's Dokumen as its document sub-module. This adds a page A's IA does not have — confirm the internal sidebar may grow. |
| **Severity** | Medium — adds a workspace page and a role. |

---

### ⚠️ C-07 — Immutability vs. deletability
| | |
|---|---|
| **Source A (§4.1, §4.2)** | Locked records **never** overwritten, by anyone including admins. Corrections **append-only**. *"Riwayat yang bisa dihapus bukan riwayat."* |
| **Source B (§8.8, §11.6)** | *"Delete outdated content."* · *"Deleted content shall no longer be visible to public users."* B §13.5 requires an audit trail but never immutability or hashing. |
| **Assessment** | Contradictory **only if** both statements address the same objects. They likely do not: A's immutability is about **operational/nutrition/expense records**; B's deletion is about **CMS content**. |
| **Recommendation** | **Scope the two rules explicitly:** immutability + fingerprints + append-only corrections apply to **operational data records**; create/edit/delete applies to **CMS content** (with all CMS mutations logged per B §11.6). Write this boundary into the spec so it is not re-litigated. **Confirm the reading is correct.** |
| **Severity** | Medium — misreading it would compromise the platform's core integrity claim. |

---

### ⚠️ C-08 — Third-party integrations
| | |
|---|---|
| **Source A (§6.5)** | Phase 2 plans an **MCP endpoint** adapter and a **Runchise** operational-system adapter, shown as *Direncanakan* in the source-readiness table. |
| **Source B (§6.3, §15)** | *"Integration with external third-party systems (e.g., ERP, accounting, payment systems)"* — out of scope. |
| **Assessment** | Reconcilable on timing: A places these in **Phase 2**, B excludes them from **Phase 1**. Consistent. But A **displays** them in a Phase-1 UI surface (the Arsitektur readiness table). |
| **Recommendation** | Build the Arsitektur page including the Phase-2 rows, clearly marked *Direncanakan*. Implement **no** actual adapter in Phase 1. |
| **Severity** | Low. |

---

### ⚠️ C-09 — Nutrition model depth
| | |
|---|---|
| **Source A** | 9 nutrients × 6 segments, versioned AKG, per-meal target %, capped weighted scoring, four status bands. The analytical core of the product. |
| **Source B (§10.3)** | Calories, Protein, Carbohydrates, Fat, "Micronutrients (where applicable)". No segments, no AKG, no targets, no scoring. |
| **Assessment** | Under-specification in B rather than contradiction — but the gap is large enough to matter for effort estimation. B's Phase-1 scope never mentions a scoring engine. |
| **Recommendation** | **Adopt A's engine** (§4.3) as the superset. **Confirm** the scoring engine is genuinely Phase-1 committed and not a mockup aspiration, because it is a substantial build. |
| **Severity** | Medium — significant effort implication. |

---

### ⚠️ C-10 — Announcements
| | |
|---|---|
| **Source B (§8.6, §9.1, §5.1)** | Public dashboard displays **announcements and public updates**; CMS Admin manages them. |
| **Source A** | No announcements anywhere. |
| **Recommendation** | Carry B's requirement forward (§5.2, §6.8). Needs a placement decision — recommend a Beranda section plus CMS management. |
| **Severity** | Low. |

---

### ⚠️ C-11 — Pengguna screens undefined
| | |
|---|---|
| **Source A** | Gates the page behind Super Admin but **shows no screens** — explicitly says they should be specified during design. |
| **Source B** | Supplies the **user data model** (§10.8) but no screens. |
| **Recommendation** | Design from B's data model + A's scope requirement (`assigned_kitchen`). Screens to be specified. |
| **Severity** | Low — a known design gap, not a conflict. |

---

### ⚠️ C-12 — Defect in Source B §10.4
Source B's **"Kitchen Information"** data-point table is **mis-pasted** — it duplicates §10.2 Transactions verbatim (Transaction ID, Transaction Date, Kitchen ID, Number of Meals, Operational Status, Remarks). B carries no actual kitchen master-data fields.
**Recommendation:** treat as a documentation defect; use A's kitchen fields (§7.1). **Worth reporting back to the PRD author.**

---

### ⚠️ C-13 — Map representation
Source B §10.5 captures **Latitude/Longitude**. Source A's map is a **stylized, non-geographic nested map** (Indonesia → Jawa Timur → Malang Raya); the existing codebase likewise ships a stylized non-geographic SVG ([js/map.js](js/map.js)).
**Recommendation:** capture lat/long per B (it is cheap and future-proof); keep A's stylized map for Phase 1 UI. Confirm whether a true geographic map is expected.
**Severity:** Low.

---

### ⚠️ C-14 — Meal type
Source B §10.1 has **`Meal Type` (Breakfast, Lunch, Snack, etc.)**. Source A models exactly **one meal per school day** throughout — the entire scoring model ("one meal targets 30% of daily AKG") depends on it.
**Recommendation:** keep `Meal Type` as a field for future-proofing, defaulted to a single daily meal in Phase 1. **Confirm** multi-meal-per-day is not a Phase-1 requirement — if it is, the scoring model in §4.3 needs rework.
**Severity:** Medium if unconfirmed.

---

### ⚠️ C-15 — Defect in Source B §12.2
"Data Validation Accuracy" reuses the description of "AI Processing Success Rate" (*"Percentage of uploaded files successfully processed"*). Presumed copy-paste error. **Recommendation:** redefine as the share of imported records requiring no subsequent correction. Report back to the PRD author.

---

### Blocking summary

| ID | Issue | Why blocking |
|---|---|---|
| **C-02** | Role taxonomy | No role-gated surface can be built correctly |
| **C-03** | Processing architecture | Determines what Input Data fundamentally *is* |
| **C-04** | CCTV / kitchen cameras | Build request asks for an explicitly excluded feature |

---

## 12. Scope-creep register — in the codebase, in neither PRD

Flagged per the audit brief. Detail and recommendations in [GAP_ANALYSIS.md](GAP_ANALYSIS.md).

| ID | Item | Location | In PRD? |
|---|---|---|---|
| SC-01 | **ZeroStunting surplus-funding narrative** ("Dari dapur MBG menuju ZeroStunting" flow, surplus allocation figures) | [index.html](index.html), [js/beranda.js](js/beranda.js) | Neither |
| SC-02 | **Kitchen camera panels** | [js/unit.js:244](js/unit.js#L244) | Neither — B **excludes** (C-04) |
| SC-03 | **Testimonials** | [js/unit.js:168](js/unit.js#L168) | Neither |
| SC-04 | **Supplier management panel** | [js/unit.js:224](js/unit.js#L224) | Neither — adjacent to B's supply-chain exclusion |
| SC-05 | **Recipes module** | [js/data.js](js/data.js) `recipes` | Neither |
| SC-06 | **Health-facility / Posyandu records** | [js/data.js:133](js/data.js#L133) | Neither |
| SC-07 | **Language switcher (ID/EN)** | [js/layout.js](js/layout.js) | Neither — both specify Indonesian only |
| SC-08 | **Partners/donors band** | [index.html](index.html) | Neither |
| SC-09 | **Chiller/freezer temperature & food-safety forms** | [js/data.js](js/data.js) `parseSamples` | A lists food-safety forms as **Phase 2**; present as Phase 1 |
| SC-10 | **Non-PRD role set** (pengawas/program/finance/ceo) | [js/role.js](js/role.js) | Neither (C-02) |
| SC-11 | **6-kitchen / 2-province footprint** | [js/data.js](js/data.js) | Neither (C-01) |

---

## 13. Roadmap — Phase 2

**➕ CARRIED (A)** — signalled in the internal sidebar, to be added without restructuring navigation: per-school distribution tracking · financial reports · food-safety forms · supply-chain data · attendance · SDG analytics · MCP endpoint adapter · Runchise adapter.

**➕ CARRIED (B §15)** — deferred to future phases: supply chain & inventory · CCTV & live video · attendance & workforce · P&L · third-party integrations · mobile app · predictive analytics/ML · automated notifications & workflow approvals · offline entry & sync · advanced BI.

**Overlap** confirming both: supply chain, attendance, financial depth.

---

## 14. Open questions for the client

1. **C-02** — Is content administration a separate job function (B's CMS Admin) or fused with data administration (A's Administrator Data)? Is the six-role model in §3.2 acceptable?
2. **C-03** — Is the Claude-desktop-app pre-cleaning decision still current as of 31 July, or did the mockup's in-app pipeline supersede it? Does the two-admin manual verification checkpoint remain required?
3. **C-04** — Confirm kitchen cameras / CCTV are dropped.
4. **C-01** — Confirm the 3-kitchen Malang pilot footprint, and confirm the existing 6-unit data set is to be replaced.
5. **C-09** — Is the nine-nutrient × six-segment scoring engine committed for Phase 1?
6. **C-14** — Is one meal per school day correct for Phase 1, or is multi-meal-type required?
7. **C-07** — Confirm immutability applies to operational records and editability applies to CMS content.
8. **C-13** — Stylized map or true geographic map?
9. Source B §2 (`<<Complete this section>>`) and §5.2 (`<<Add content here>>`) are unfinished — is content pending?
10. **C-12 / C-15** — Two apparent copy-paste defects in Source B; please confirm the intended content.
