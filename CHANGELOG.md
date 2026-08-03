# Changelog

## 31 July 2026 — PRD reconciliation + build to spec

Reconciled two conflicting PRDs into a single spec, audited the existing build against it, and rebuilt the site to match. All work is scoped against **[PRD_MERGED.md](PRD_MERGED.md)**.

---

### New documents

| File | What it is |
|---|---|
| **[PRD_MERGED.md](PRD_MERGED.md)** | Reconciled spec. Per-component diff of [prd.md](prd.md) vs [prdfromzahra.pdf](prdfromzahra.pdf), with a **Conflict Register (§11)** of 15 disagreements — each stating both versions rather than silently merging. |
| **[GAP_ANALYSIS.md](GAP_ANALYSIS.md)** | Before/after component checklist (29 public + 24 internal + 11 primitives) plus an 11-item scope-creep register. |
| **CHANGELOG.md** | This file. |

**Authority rule applied:** the PDF (dated Draft v1, 15 July 2026) governs business scope, roles, exclusions, KPIs and NFRs; `prd.md` (derived from mockups captured 31 July 2026, and verified against them) governs component behaviour and the nutrition engine. Where they collided, nothing was merged silently.

### Decisions taken (previously blocking)

| ID | Conflict | Resolution |
|---|---|---|
| **C-01** | Kitchen footprint | Adopted the **3-kitchen Malang Raya** pilot. The prior 6-kitchen / 2-province set matched neither PRD. |
| **C-02** | Role taxonomy | Adopted the **six-role model** (§3.2) merging the PDF's separation of duties with the mockup's kitchen scoping. *Assumed, not explicitly signed off — worth reconfirming.* |
| **C-03** | Processing architecture | Adopted **Source B**: data is pre-cleaned outside the product; the workspace is a second-admin verification pass, not an in-app parsing engine. |
| **C-04** | CCTV / cameras | **Dropped entirely.** Source B excludes it twice; neither PRD contains it. No AI imagery was generated for it. |

### Stack decision

The build brief specified Next.js + TypeScript + Tailwind + shadcn/ui + Framer Motion. **The repo is the deliberate opposite** — static HTML/CSS/JS with a documented veto on exactly that stack. Confirmed with the user: **keep the static stack.** No dependencies were added to the repo.

### Tooling not available

- **21st.dev MCP** — not connected to the session; no such tool was available. All UI was hand-authored in the existing vanilla pattern.
- **Higgsfield MCP** — requires OAuth, which a non-interactive session cannot complete. **No imagery was generated.** [IMAGES.md](IMAGES.md) documents the one remaining image slot (kitchen documentation galleries) with prompts, and every slot still falls back to a branded SVG placeholder, so nothing is broken by their absence.

---

## Added

### Platform primitives (previously absent entirely)

- **Nutrition scoring engine** — [js/nutrition.js](js/nutrition.js). Nine nutrients × six recipient segments against a versioned AKG table. Each nutrient's percentage is **capped at 100% before averaging**, so an over-supplied nutrient can't mask a deficient one. Bands (Cukup ≥ 90 / Perlu perhatian ≥ 70 / Kurang) and per-meal targets are read from `MBG.akg` — **never hard-coded**, so adequacy policy changes in Data Acuan rather than in code.
- **Food composition table** (`MBG.tkpi`) — menu nutrition is now **computed from component weights**, not hand-typed. Change a gram value and every derived score moves with it.
- **Versioned AKG reference table** with effective date, source, status, and version history.
- **Locked records + content fingerprint** — every menu carries `lockedAt`, `lockedBy`, `source`, and a `hash`.
- **Append-only corrections** — the correction entry references the original via `ref`; both keep their own hash and both stay visible.
- **Declared data source** on every record.

### Public pages

- **Dapur** ([dapur.html](dapur.html)) — kitchen list with codes, addresses, responsible person, capacity utilization, and **bidirectional map ↔ list highlighting**.
- **Menu & Gizi** ([menu.html](menu.html)) — the analytical core. Kitchen selector, locked-menu date selector, category breakdown with totals, **six-segment selector that recomputes everything below it**, score explainer, nine-nutrient bars with target markers and a *Berlebih* state, 14-day history chart with the 90% threshold, and the Permenkes 28/2019 source note.
- **Transparansi** ([transparansi.html](transparansi.html)) — document library with category filters and search. Internal documents stay listed with full metadata but their **download link is withheld**. Four openness principles.
- **Tentang** ([tentang.html](tentang.html)) — the scoping page: what the platform does vs. what stays the kitchen's responsibility.
- **Beranda** rebuilt — "Porsi hari ini" card with per-component grams, headline adequacy score, provenance and lock notice; impact band; map + kitchen cards; announcements.
- **Kitchen detail** rebuilt as [dapur-detail.html](dapur-detail.html) — adds certifications with issuer/number, per-menu adequacy scores, an upload placeholder, and a transparency trail.

### Internal workspace (all new — none of this existed)

Dark-sidebar shell ([js/internal.js](js/internal.js)) with FASE 1 / FASE 2 grouping, role switcher, data-scope indicator, locked nav items, and an **"Akses ditutup"** card that names the acting role and lists its permissions.

| Page | Contents |
|---|---|
| [ringkasan.html](ringkasan.html) | KPIs · **data-entry compliance** (weekday-only, missing dates named, persiapan excluded with an explicit note) · cross-kitchen adequacy chart · comparison table · activity feed |
| [input.html](input.html) | 4-step wizard. Step 3 gates **"Kunci dan kirim"** behind a running `n dari m` confirmation counter; nothing saves until locked |
| [audit.html](audit.html) | Correction spotlight (original *Tidak berubah* / correction *Menunjuk catatan asli*) + filterable history by kitchen, action, and free-text over entity/actor/hash |
| [biaya.html](biaya.html) | Expenditure by kitchen/period, source-vs-adjustment split, cost per portion **with its calculation and lower-bound caveat shown**, six-category table, period trend |
| [arsitektur.html](arsitektur.html) | Single-ingestion-interface diagram + source-readiness table (Fase 1 available, Fase 2 planned) |
| [acuan.html](acuan.html) | AKG table with version metadata and history · templates with full data dictionary and validation rules |
| [dokumen.html](dokumen.html) | Upload area with visibility selector, filters, version history, **Publik/Internal toggle** governing the public page, plus CMS content/announcements/gallery |
| [pengguna.html](pengguna.html) | User table with kitchen scope + permission matrix. Super Admin only |

---

## Changed

- **[js/data.js](js/data.js) rewritten.** 3 Malang kitchens with codes, coordinates, addresses. Program aggregates are now **derived** from the kitchen list rather than typed, so the footprint stays self-consistent. Added AKG, TKPI, audit trail, expenses, documents, users, announcements, templates, intake sources.
- **[js/role.js](js/role.js) rewritten** — six roles, an `ACCESS` matrix as the single source of truth for gating, and per-role permission lists.
- **[js/layout.js](js/layout.js) rewritten** — five public nav links + "Masuk ruang internal", plus the persistent MOCKUP banner.
- **[js/map.js](js/map.js) rewritten** — nested Indonesia → Jawa Timur → Malang Raya, with `MapView.select()` for external highlighting. Still deliberately **stylized, not projected** (C-13).
- **[js/charts.js](js/charts.js)** — added `threshold`, `min`, and `max` options to `Charts.line` for the 90% adequacy reference line.
- **[js/icons.js](js/icons.js)** — added 12 icons (`fingerprint`, `history`, `database`, `filter`, `edit`, `trash`, `plus`, `minus`, `alert`, `arrowLeft`, `logout`, `flow`).
- **New [css/app.css](css/app.css)** — all new surfaces plus the dark internal theme. Loads last: `tokens → base → components → pages → app`.
- **[CLAUDE.md](CLAUDE.md), [README.md](README.md), [IMAGES.md](IMAGES.md)** rewritten for the new structure and the settled decisions.

---

## Removed (scope creep — in neither PRD)

Each of these was flagged in [GAP_ANALYSIS.md](GAP_ANALYSIS.md) §3 before removal.

| Item | Why |
|---|---|
| **Kitchen camera panels** | CCTV explicitly out of scope in Source B, twice (C-04) |
| **ZeroStunting surplus-funding narrative** | Asserted that kitchen operating surplus funds stunting programs — a financial claim **neither PRD makes**. The riskiest item removed: an unverified funding-flow claim on a public transparency site. |
| **Testimonials** | Not in either PRD; attributed quotes invite "is this a real person?" questions on a data-transparency site |
| **Supplier management panel** | Adjacent to Source B's explicit supply-chain exclusion |
| **Recipes module** | Contradicts the stated non-goal that the platform does not author or decide menus |
| **Health-facility / Posyandu records** | Not specified in either PRD |
| **ID/EN language switcher** | Both PRDs specify Indonesian only; it was a stub that `alert()`ed |
| **Partners/donors band** | Not in either PRD |
| **Food-safety forms** (chiller temps, organoleptic tests) | Source A places these in **Phase 2**; they were present as Phase 1 |
| **Old role set** (`pengawas`/`program`/`finance`/`ceo`) | Matched neither taxonomy; `finance` pointed at excluded P&L scope |
| **6-kitchen / 2-province footprint** | Replaced per C-01 |

Deleted files: `unit.html`, `overview.html`, `unggah.html`, `js/unit.js`, `js/overview.js`, `js/unggah.js`, `assets/img/placeholders/cam.svg`.

---

## Verification

No test tooling was added to the repo. Instead every page was executed under **jsdom in a scratchpad directory** (never installed into this repo):

- **14 pages × 6 roles = 84 renders, zero console errors.**
- Role gating verified against the §3.3 permission matrix — each role sees exactly its allowed pages and the access-denied card everywhere else.
- Interactions verified: segment switching recomputes headline score, per-nutrient rows *and* the history chart; kitchen/date selectors; document filters (8 public / 2 withheld); the wizard gate staying disabled at 8-of-9 and enabling at 9-of-9; audit filters; visibility toggle; map ↔ card highlighting.
- Scoring engine cross-checked against the mockup: computed segment scores land within 1–4 points of the mockup's published figures (96/90/86/79/68/67 vs 98/93/90/83/69/69), with portion weight matching exactly at 415 g. Program totals reproduce the mockup's 5,150 daily recipients and 25-of-34 schools exactly.

One caveat worth recording: `window.matchMedia` is not implemented in jsdom and must be shimmed in any such harness. That is a harness artifact, **not** a product bug.

---

## Known gaps / open items

- **C-02 (role model) was assumed, not signed off.** The six-role split is my proposal; it changes the permission matrix and the Pengguna module if the client disagrees.
- **Ten conflicts remain open** for the client — see [PRD_MERGED.md §14](PRD_MERGED.md). Most consequential: whether the scoring engine is genuinely Phase 1 (C-09), and whether one meal per school day is correct (C-14) — multi-meal-type would require reworking the scoring model.
- **Two apparent defects in Source B** worth reporting back to its author: §10.4 "Kitchen Information" duplicates §10.2 Transactions verbatim (C-12), and §12.2 "Data Validation Accuracy" reuses another KPI's description (C-15).
- **Anchor-fact conflict unresolved.** The previous build marked Rp 13.000/pax/day, Rp 6 jt/day incentive, and 3.992+ PM/day as *real anchor facts*, but the mockup shows **5,150** daily recipients. The 3-kitchen footprint uses 5,150 (matching the mockup and PRD); the Rp 13.000/pax rate is retained in the expense model. **The 3.992+ figure has no home in the new footprint and needs a decision.**
- `css/pages.css` still contains dead rules for the removed unit/overview pages — harmless, safe to prune later.
