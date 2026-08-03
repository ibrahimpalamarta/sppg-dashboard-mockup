# Gap Analysis — current build vs. [PRD_MERGED.md](PRD_MERGED.md)

**Compiled:** 31 July 2026 · **Scoped against:** PRD_MERGED.md (not the two source PRDs)
**Repo state audited:** `main` @ `12c4059` · **Updated after build the same day** — the `After` column and §3/§6 now record actual outcomes. The `Notes` column throughout describes the **pre-build finding**, not the current state.

---

## 0. Headline

The current build is a **static HTML/CSS/JS marketing-and-operations prototype for a different product framing** than the merged PRD describes. It is well-built for what it is, but the overlap with PRD_MERGED is smaller than the surface similarity suggests.

| | Before | After |
|---|---|---|
| Merged-PRD components **present & broadly conforming** | **3** | **9 kept** |
| Merged-PRD components **partial** | **7** | — |
| Merged-PRD components **missing entirely** | **19** | — |
| Merged-PRD components **built this pass** | — | **54** |
| Not buildable in a static prototype | — | **1** (server-side authz) |
| Codebase features **in neither PRD** (scope creep) | **11** | **0 — all removed** |

The single largest finding: **the merged PRD's analytical core — the nine-nutrient × six-segment AKG scoring engine — does not exist in the codebase in any form.** Neither do the immutability/fingerprint primitives that the entire public transparency claim rests on. These are not polish items; they are the product.

**Second finding:** the codebase's data layer, role model, and kitchen footprint each match **neither** PRD. This is not drift from a spec — it is a different specification.

---

## 1. Stack conformance — ✅ RESOLVED

The build brief for Step 3 specifies **Next.js App Router + TypeScript + Tailwind + shadcn/ui + Framer Motion**, and asks me to confirm this matches the repo before assuming it.

**It does not match. The repo is the explicit opposite of that stack.**

| Brief assumes | Repo actually is |
|---|---|
| Next.js App Router | Plain `.html` files at repo root, no router |
| TypeScript | Plain ES5-ish JS, IIFEs assigning globals |
| Tailwind | Four hand-authored stylesheets with CSS custom properties ([tokens.css](css/tokens.css) → [base.css](css/base.css) → [components.css](css/components.css) → [pages.css](css/pages.css)) |
| shadcn/ui | No component library; hand-rolled markup via template literals |
| Framer Motion | Hand-rolled `IntersectionObserver` reveals in [js/ui.js](js/ui.js) |
| npm build step | **No `package.json` at all** — no build, no lint, no tests |

This is **deliberate, not accidental**. [CLAUDE.md](CLAUDE.md) states the constraint as a hard rule:

> **No dependencies.** No npm, no CDN scripts, no Tailwind/shadcn/lucide/React/Next.

and records that the Next.js/Tailwind/Vercel stack described in [brief.md](brief.md) *"was deliberately rejected in favor of the static site described above."*

**Resolved 31 July 2026: keep the static stack.** The user confirmed CLAUDE.md's veto wins over the brief's stack line. No dependencies were added; everything below was built in the existing vanilla HTML/CSS/JS pattern.

Two tooling items in the brief were **unavailable** and could not be worked around:

- **21st.dev MCP** — not connected to the session. All UI was hand-authored instead.
- **Higgsfield MCP** — requires OAuth, impossible in a non-interactive session. **No imagery generated.** Every image slot still falls back to a branded SVG placeholder, so nothing renders broken; [IMAGES.md](IMAGES.md) documents the one remaining slot with prompts.

---

## 2. Component checklist — before / after

All four blocking items (stack, C-01 footprint, C-03 pipeline, C-04 CCTV) were resolved by the user and the work was carried out. **`Notes` records the original pre-build finding** and is kept as the audit record; `After` records what now exists.

### 2.1 Public dashboard

| # | Merged-PRD component | §ref | Before | After | Notes |
|---|---|---|---|---|---|
| P-01 | Global header (brand, 5 nav links, "Masuk ruang internal") | 5.1 | 🟡 Partial | ✅ Built | [js/layout.js](js/layout.js) has a header, but 4 nav links (Beranda/Unit SPPG/Monitor/Unggah) ≠ the 5 required (Beranda/Dapur/Menu & Gizi/Transparansi/Tentang). No "Masuk ruang internal" entry. |
| P-02 | Global footer | 5.1 | ✅ Present | ✅ Kept | Conforms in structure; copy differs. |
| P-03 | Beranda hero | 5.2 | ✅ Present | ✅ Kept | [index.html](index.html). Different framing (see SC-01). |
| P-04 | **"Porsi hari ini" card** w/ components + grams | 5.2 | 🟡 Partial | ✅ Built | `menuToday` exists in [js/data.js](js/data.js) with 4 macro figures; not surfaced on Beranda, and lacks per-component category+gram breakdown. |
| P-05 | **Headline adequacy score + provenance + lock notice** | 5.2 | ❌ Missing | ✅ Built | No score, no timestamp/owner/fingerprint, no lock notice. Core transparency element. |
| P-06 | Impact metrics band | 5.2 | ✅ Present | ✅ Kept | `#impact-grid` in [index.html](index.html). Metrics differ from PRD's four. |
| P-07 | **"Di mana dapurnya"** nested map + kitchen cards + "Sorot di peta" | 5.2 | ❌ Missing | ✅ Built | Map exists but only on the internal page ([js/map.js](js/map.js)), not on Beranda; no nested Indonesia→Jatim→Malang levels; no highlight-from-card action. |
| P-08 | **Announcements / public updates** | 5.2, C-10 | ❌ Missing | ✅ Built | Carried from Source B. |
| P-09 | **Dapur — kitchen list page** | 5.3 | ❌ Missing | ✅ Built | No such page. Unit grid on Beranda is not equivalent (no codes, addresses, responsible person, utilization, bidirectional map link). |
| P-10 | Kitchen codes (KDK-01 etc.) | 5.3 | ❌ Missing | ✅ Built | Data layer has no code field. |
| P-11 | Capacity utilization figure | 5.3 | ❌ Missing | ✅ Built | `capacity` exists; utilization never computed or shown. |
| P-12 | Kitchen detail — header/identity | 5.4 | ✅ Present | ✅ Kept | [unit.html](unit.html) *Profil* tab covers this well. |
| P-13 | Kitchen detail — summary figures | 5.4 | 🟡 Partial | ✅ Built | Has recipients/schools; missing daily capacity + utilization. |
| P-14 | Kitchen detail — certifications | 5.4 | 🟡 Partial | ✅ Built | `certs` has SLHS/Halal/HACCP + validity, but no issuer or document number. PRD wants Dinkes/BPJPH issuer + number. |
| P-15 | Kitchen detail — recent menus w/ score | 5.4 | 🟡 Partial | ✅ Built | `menuHist` exists; no adequacy score or band per menu. |
| P-16 | Kitchen detail — documentation gallery + upload placeholder | 5.4 | ✅ Present | ✅ Kept | *Galeri* tab + lightbox. Upload placeholder absent. |
| P-17 | Kitchen detail — transparency trail | 5.4 | ❌ Missing | ✅ Built | No lock time / entered-by / fingerprint. |
| P-18 | **Menu & Gizi — kitchen selector** | 5.5 | ❌ Missing | ✅ Built | Whole page missing. |
| P-19 | **Menu & Gizi — locked-menu date selector** | 5.5 | ❌ Missing | ✅ Built | |
| P-20 | **Menu & Gizi — menu breakdown by category + totals** | 5.5 | 🟡 Partial | ✅ Built | *Menu* tab in [js/unit.js:321](js/unit.js#L321) lists menus, but not by the 5–6 component categories with per-item grams and 3 totals. |
| P-21 | **Menu & Gizi — six-segment selector (recomputing)** | 5.5 | ❌ Missing | ✅ Built | No segments anywhere in the codebase. |
| P-22 | **Menu & Gizi — per-segment adequacy score + method copy** | 5.5 | ❌ Missing | ✅ Built | |
| P-23 | **Menu & Gizi — nine-nutrient breakdown w/ Berlebih state** | 5.5 | ❌ Missing | ✅ Built | Data layer has 4 macros (kalori/protein/lemak/karbo); PRD needs 9 incl. serat, kalsium, zat besi, vit A, zinc. |
| P-24 | **Menu & Gizi — Riwayat kecukupan chart (90% threshold)** | 5.5 | ❌ Missing | ✅ Built | [js/charts.js](js/charts.js) has a `line` primitive to build on. |
| P-25 | Menu & Gizi — data-source note (Permenkes 28/2019) | 5.5 | ❌ Missing | ✅ Built | |
| P-26 | **Transparansi — document library + filters + search** | 5.6 | ❌ Missing | ✅ Built | Whole page missing. |
| P-27 | Transparansi — Publik/Internal visibility handling | 5.6 | ❌ Missing | ✅ Built | |
| P-28 | Transparansi — four openness principles | 5.6 | ❌ Missing | ✅ Built | |
| P-29 | **Tentang page** | 5.7 | ❌ Missing | ✅ Built | Partial narrative content exists on Beranda but no page, and not the does/doesn't-do delineation. |

### 2.2 Internal workspace

| # | Merged-PRD component | §ref | Before | After | Notes |
|---|---|---|---|---|---|
| I-01 | **Dark-sidebar workspace layout** | 6 | ❌ Missing | ✅ Built | Internal pages reuse the public light header/footer. No sidebar, no FASE 1/FASE 2 grouping, no "Lingkup data" indicator. |
| I-02 | Role switcher | 6 | 🟡 Partial | ✅ Built | [js/role.js](js/role.js) has one, but with a non-PRD role set (C-02). |
| I-03 | Locked menu items + "Akses ditutup" page | 6 | 🟡 Partial | ✅ Built | Soft gate card exists ([js/overview.js:9](js/overview.js#L9)); does not name acting role or enumerate its permissions. |
| I-04 | Ringkasan — headline KPIs | 6.1 | 🟡 Partial | ✅ Built | [js/overview.js](js/overview.js) KPI row exists; metrics differ, no installed-capacity or operating-days basis. |
| I-05 | **Ringkasan — data-entry compliance panel** | 6.1 | ❌ Missing | ✅ Built | Weekday-excluded locked-day compliance, missing-date call-outs, persiapan-exclusion note. |
| I-06 | **Ringkasan — cross-kitchen adequacy chart** | 6.1 | ❌ Missing | ✅ Built | Depends on the scoring engine. |
| I-07 | Ringkasan — kitchen comparison table | 6.1 | 🟡 Partial | ✅ Built | Consolidation table exists; lacks capacity, utilization, average nutrition score. |
| I-08 | **Ringkasan — recent-activity feed** | 6.1 | ❌ Missing | ✅ Built | Depends on the audit trail. |
| I-09 | Input Data — 4-step wizard shell | 6.2 | ✅ Present | ✅ Built | [js/unggah.js](js/unggah.js) — good structural match to *Unggah → Pembacaan → Tinjau → Terkunci*. |
| I-10 | Step 1 — drop zone + file list + template download | 6.2 | 🟡 Partial | ✅ Built | Drop zone + recent-uploads list present; **no standard-template download**. |
| I-11 | **Step 3 — read-vs-written field comparison** | 6.2 | 🟡 Partial | ✅ Built | `parseSamples` has a column→target `mapping` with `conf` scores — the right shape, but it maps *columns to schema targets*, not *read value vs. written value per field*. |
| I-12 | **Step 3 — OCR-ambiguity / out-of-range / empty-field detection cases** | 6.2 | ❌ Missing | ✅ Built | None of the three demonstrated validation behaviours exist. |
| I-13 | **Step 3 — per-row confirm + running counter gate** | 6.2 | ❌ Missing | ✅ Built | No "Tandai sesuai"/"Perbaiki di sini", no `n dari m` counter, no gating. |
| I-14 | **Step 4 — lock producing timestamp/owner/source/fingerprint** | 6.2 | ❌ Missing | ✅ Built | Wizard completes without producing a locked record. |
| I-15 | **Jejak Audit page** | 6.3 | ❌ Missing | ✅ Built | Whole page missing. |
| I-16 | **Audit — correction spotlight (append-only demo)** | 6.3 | ❌ Missing | ✅ Built | |
| I-17 | **Audit — activity history table + filters** | 6.3 | ❌ Missing | ✅ Built | |
| I-18 | **Pengeluaran page** | 6.4 | ❌ Missing | ✅ Built | Explicitly deferred in [CLAUDE.md](CLAUDE.md) as *"Segera — Fase berikutnya"* — contradicts merged PRD (C-05). |
| I-19 | **Arsitektur page** | 6.5 | ❌ Missing | ✅ Built | |
| I-20 | **Data Acuan — AKG table + versioning** | 6.6 | ❌ Missing | ✅ Built | |
| I-21 | **Data Acuan — templates + data dictionary** | 6.6 | ❌ Missing | ✅ Built | |
| I-22 | **Dokumen page** | 6.7 | ❌ Missing | ✅ Built | |
| I-23 | **CMS — content & announcements & gallery** | 6.8 | ❌ Missing | ✅ Built | Carried from Source B (C-06). |
| I-24 | **Pengguna page** | 6.9 | ❌ Missing | ✅ Built | Screens undefined in both sources (C-11). |

### 2.3 Platform primitives

| # | Merged-PRD primitive | §ref | Before | After | Notes |
|---|---|---|---|---|---|
| X-01 | **Locked records + content fingerprint** | 4.1 | ❌ Missing | ✅ Built | Nothing in the data layer. |
| X-02 | **Append-only corrections** | 4.2 | ❌ Missing | ✅ Built | |
| X-03 | **Nine-nutrient × six-segment scoring engine** | 4.3 | ❌ Missing | ✅ Built | **The largest single gap.** |
| X-04 | **Declared data source per figure** | 4.4 | ❌ Missing | ✅ Built | |
| X-05 | **Versioned AKG + templates** | 4.5 | ❌ Missing | ✅ Built | |
| X-06 | Server-side authorization | 3.4 | ❌ N/A | ⚪ N/A | Static prototype has no server. Mock gating only — acceptable for a prototype, but the PRD's core security requirement is unrepresentable in the current stack. |
| X-07 | `id-ID` formatting | 9 | ✅ Present | ✅ Kept | `UI.fmt` / `MBG.fmt` + `.num` class. Conforms. |
| X-08 | Indonesian UI copy | 1 | ✅ Present | ✅ Kept | Conforms. |
| X-09 | Responsive layout | 9 | ✅ Present | ✅ Kept | Conforms. |
| X-10 | Light public / dark internal theming | 9 | ❌ Missing | ✅ Built | Single light theme throughout. |
| X-11 | Reduced-motion support | — | ✅ Present | ✅ Kept | `UI.observe` respects `prefers-reduced-motion`. Better than either PRD asks for. |

### 2.4 Data-layer conformance

| # | Domain | §ref | Before | Notes |
|---|---|---|---|---|
| D-01 | Kitchen master data | 7.1 | 🟡 Partial | Rich, but **wrong footprint** (C-01) and no `code`, no per-kitchen responsible person surfaced as PRD expects. |
| D-02 | Geographic (lat/long) | 7.2 | ❌ Missing | Only `area` / `province` strings. No coordinates, district, village. |
| D-03 | Menu | 7.3 | 🟡 Partial | Has items + macros; missing per-item category vocabulary, `berat_gram` per component, lock metadata. |
| D-04 | Nutrition | 7.4 | 🟡 Partial | 4 macros vs. required 9 nutrients; no AKG, segments, or targets. |
| D-05 | Transactions / distribution | 7.5 | 🟡 Partial | `schools` array carries distribution-ish data; no transaction records with status. |
| D-06 | Expenses | 7.6 | ❌ Missing | |
| D-07 | Gallery | 7.7 | 🟡 Partial | Image paths only; no title/description/uploader/category metadata. |
| D-08 | Documents | 7.8 | ❌ Missing | |
| D-09 | Users | 7.9 | ❌ Missing | Roles exist as constants; no user records. |
| D-10 | Audit trail | 7.10 | ❌ Missing | |
| D-11 | Reference data (AKG) | 7.11 | ❌ Missing | |

---

## 3. Scope creep — in the codebase, in neither PRD

Flagged as requested. **None of these are in Source A or Source B.** All eleven were removed in the build pass — see the `Outcome` column.

| ID | Item | Location | Assessment | Outcome |
|---|---|---|---|---|
| **SC-01** | **ZeroStunting surplus-funding narrative** — "Dari dapur MBG menuju ZeroStunting" flow section, surplus-allocation figures (`zerostuntingAllocation: 248` Rp jt) | [index.html](index.html), [js/data.js](js/data.js), [js/beranda.js](js/beranda.js) | The most substantive creep. Asserts that **kitchen operating surplus funds stunting programs** — a *financial and programmatic claim* neither PRD makes. Source A frames ZeroStunting purely as the mission context, not a funding mechanism. Also brushes B's P&L exclusion. | ✅ **Removed.** The riskiest item: an unverified funding-flow claim on a public transparency site. Re-add only with explicit sign-off. |
| **SC-02** | **Kitchen camera panels** | [js/unit.js:244](js/unit.js#L244) | Source B lists CCTV as out of scope **twice**. See C-04. | ✅ **Removed** (user-confirmed). No AI imagery generated for it. |
| **SC-03** | **Testimonials** | [js/unit.js:168](js/unit.js#L168) | Marketing content; neither PRD mentions it. Attributed quotes on a data-transparency site invite "is this a real person?" questions. | ✅ **Removed.** |
| **SC-04** | **Supplier management panel** | [js/unit.js:224](js/unit.js#L224) | Adjacent to B's explicit **supply chain** exclusion. | ✅ **Removed.** |
| **SC-05** | **Recipes module** | [js/data.js](js/data.js) `recipes`, [js/unit.js](js/unit.js) | Neither PRD. Contradicts A's stated non-goal that the platform *does not author or decide menus*. | ✅ **Removed.** |
| **SC-06** | **Health-facility / Posyandu records** | [js/data.js:133](js/data.js#L133) | Neither PRD. Recipient segments include Balita/Ibu hamil, but facility records are not specified. | ✅ **Removed** — recipient segments now carry this concern. |
| **SC-07** | **ID/EN language switcher** | [js/layout.js](js/layout.js) | Both PRDs specify Indonesian only. It was a stub that `alert()`ed. | ✅ **Removed.** |
| **SC-08** | **Partners/donors band** | [index.html](index.html), `partners` | Neither PRD. | ✅ **Removed** — low risk, but out of spec. Easy to restore. |
| **SC-09** | **Food-safety forms** (chiller/freezer temps, organoleptic tests, sample retention) | [js/data.js](js/data.js) `formTypes`, `parseSamples` | Source A places **food-safety forms in Phase 2**. Present here as Phase 1. | ✅ **Removed** — deferred to Phase 2 per Source A. |
| **SC-10** | **Non-PRD role set** — `pengawas` / `program` / `finance` / `ceo` | [js/role.js](js/role.js) | Matches neither taxonomy. `finance` in particular has no PRD basis and points at excluded P&L scope. | ✅ **Replaced** with the six-role model (§3.2). |
| **SC-11** | **6-kitchen / 2-province footprint** incl. Simalungun, North Sumatra | [js/data.js](js/data.js) | Merged PRD specifies **3 kitchens in Malang Raya**. The Sumatra unit has no PRD basis at all. | ✅ **Replaced** with the 3-kitchen Malang Raya footprint. |

### Note on the "real anchor facts"

[CLAUDE.md](CLAUDE.md) marks several figures in `national` as **real anchor facts** not to be silently changed: **Rp 13.000/pax/day**, **Rp 6 jt/day incentive**, **3.992+ PM/day**. None of these appear in either PRD. They are presumably from [brief.md](brief.md) or a stakeholder conversation.

**Outcome:** C-01 was resolved in favour of the 3-kitchen Malang pilot, so `pmPerDay` is now **derived** from the kitchen list and comes to **5,150** — matching Source A's mockup exactly. The **Rp 13.000/pax/day** rate is retained and drives the expense model (`program.ratePerPax`). The **3.992+ PM/day** and **Rp 6 jt/day incentive** figures have **no home in the new footprint** and were not carried over. ⚠️ **This needs a decision:** either they were superseded by the mockup's 5,150, or the footprint is wrong.

---

## 4. What the current build does well

Worth preserving through any migration:

- **Clean separation of data from presentation.** [js/data.js](js/data.js) is a genuine single source of truth; swapping the footprint is a data-layer edit, not a rewrite.
- **The `PERSIAPAN` empty-state branch.** Preparation kitchens get designed empty states rather than blanks — exactly what the merged PRD asks for (§5.3, §6.1).
- **Placeholder-image discipline.** `UI.img()` + `onerror` fallbacks + [IMAGES.md](IMAGES.md) means no image is ever required. Genuinely good practice.
- **The 4-step wizard shell** ([js/unggah.js](js/unggah.js)) is the right skeleton for Input Data (I-09).
- **Reduced-motion support** — exceeds both PRDs.
- **Hand-rolled chart primitives** ([js/charts.js](js/charts.js)) — `line` and `bars` are directly reusable for P-24 and I-06.

---

## 5. Build sequencing (once unblocked)

Proposed order, dependency-driven:

1. **Resolve C-01/C-02/C-03/C-04 + the stack decision.** Nothing below is safe until these land.
2. **Data layer** — 3-kitchen Malang footprint; add AKG reference table, 9-nutrient menu items, segments, audit entries, documents, expenses. (D-01…D-11)
3. **Scoring engine** (X-03) — everything analytical depends on it.
4. **Immutability primitives** (X-01, X-02, X-04, X-05) — everything transparency-related depends on these.
5. **Public IA** — restructure nav to 5 pages (P-01), then Dapur (P-09), Menu & Gizi (P-18…P-25), Transparansi (P-26…P-28), Tentang (P-29).
6. **Beranda rebuild** onto the new primitives (P-04…P-08).
7. **Internal shell** — dark sidebar layout + role model (I-01…I-03).
8. **Internal pages** — Ringkasan (I-04…I-08), Input Data completion (I-10…I-14), Jejak Audit (I-15…I-17), then Pengeluaran / Arsitektur / Data Acuan / Dokumen / CMS / Pengguna.
9. **Scope-creep removal** (SC-01…SC-11) — do this deliberately and visibly, not as a side effect.

---

## 6. Status — all three steps complete

**Step 1** — [PRD_MERGED.md](PRD_MERGED.md) reconciles both sources with a 15-item conflict register.
**Step 2** — this document: 53 merged-PRD components audited, 11 scope-creep items flagged.
**Step 3** — built. 14 pages, 23 JS modules, 5 stylesheets. See [CHANGELOG.md](CHANGELOG.md).

**Verification:** every page executed under jsdom across all six roles — **84 renders, zero console errors**, gating matching §3.3 exactly, and interactions (segment recompute, filters, wizard gate, visibility toggle, map↔list highlight) confirmed working. The scoring engine reproduces the mockup's published figures within 1–4 points.

**Still open:** C-02 (role model) was assumed rather than signed off; ten conflicts remain client questions (PRD_MERGED §14); and the anchor-fact conflict noted above needs a decision.
