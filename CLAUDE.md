# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **static prototype** dashboard for the SPPG kitchen network under Indonesia's Makan Bergizi Gratis (MBG) program (EduFarmers × ZeroStunting). Plain HTML + CSS + JS — **no framework, no build step, no runtime dependencies, no package.json**. Deployed to GitHub Pages from repo root.

All data is mock. UI copy is **Bahasa Indonesia**; code identifiers are English.

## The spec

**Build against [PRD_MERGED.md](PRD_MERGED.md), not the source PRDs.** It reconciles two conflicting sources — [prd.md](prd.md) (mockup-derived, component-exact) and [prdfromzahra.pdf](prdfromzahra.pdf) (client PRD, Draft v1, 15 July 2026) — and logs every disagreement in its **Conflict Register (§11)** with both versions stated.

Four conflicts were resolved by the user on 31 July 2026 and are now settled:

| ID | Resolution |
|---|---|
| **C-01** | 3-kitchen Malang Raya footprint (Kedungkandang KDK-01, Singosari SGS-02, Kepanjen KPJ-03) |
| **C-02** | Six-role model per §3.2 (assumed, not explicitly signed off — reconfirm before production) |
| **C-03** | Data arrives **pre-cleaned** from a desktop step; the workspace is a second-admin verification pass, **not** an in-app parsing engine |
| **C-04** | **CCTV / kitchen cameras dropped entirely** — Source B excludes them twice. Do not re-add. |

Conflicts **C-06 … C-15** remain open questions for the client (PRD_MERGED §14). [GAP_ANALYSIS.md](GAP_ANALYSIS.md) tracks component coverage and the scope-creep register.

## Commands

```bash
python -m http.server 5577   # then open http://localhost:5577  (also .claude/launch.json → "mbg")
npx serve .                  # alternative
```

There is no build, lint, or test tooling. Verification = open the page and check the browser console for errors.

## Architecture

### Script loading is the contract

Every page is a plain `.html` file that loads scripts as classic `<script>` tags **in dependency order**. Each JS file is an IIFE that assigns one global. There are no modules, no imports, no bundler — so **order in the HTML matters** and a new file must be added to every page that needs it.

Load order: `icons.js` → `data.js` → `nutrition.js` → `ui.js` → (`charts.js` / `map.js` as needed) → `role.js` → (`layout.js` **or** `internal.js`) → *page script*.

| Global | File | Role |
|---|---|---|
| `icon(name, cls)` | [js/icons.js](js/icons.js) | Inline SVG icon set. **Only source of icons** — no icon library. Add a path to the `P` map to add an icon. |
| `MBG` | [js/data.js](js/data.js) | All mock data. Single source of truth. |
| `Nutrition` | [js/nutrition.js](js/nutrition.js) | Adequacy scoring engine (§4.3) |
| `UI` | [js/ui.js](js/ui.js) | `img`, `fmt`, `observe`, `stagger`, `openLightbox`, `bindChips` |
| `Charts` | [js/charts.js](js/charts.js) | Hand-rolled SVG `donut` / `line` / `bars` + `animateBars`. No chart library. |
| `MapView` | [js/map.js](js/map.js) | Stylized nested map (Indonesia → Jawa Timur → Malang Raya). **Not geographic** (C-13). |
| `Role` | [js/role.js](js/role.js) | Six-role mock state + `ACCESS` permission matrix |
| `Layout` | [js/layout.js](js/layout.js) | `Layout.render({page})` — public header/footer |
| `Internal` | [js/internal.js](js/internal.js) | `Internal.mount({page, title, sub, render})` — dark workspace shell |

### Pages

**Public** (light theme, `#header-mount` / `#page` / `#footer-mount`): [index.html](index.html) · [dapur.html](dapur.html) · [dapur-detail.html](dapur-detail.html)`?k=<slug>` · [menu.html](menu.html) · [transparansi.html](transparansi.html) · [tentang.html](tentang.html)

**Internal** (dark sidebar, single `#workspace` mount): [ringkasan.html](ringkasan.html) · [input.html](input.html) · [audit.html](audit.html) · [biaya.html](biaya.html) · [arsitektur.html](arsitektur.html) · [acuan.html](acuan.html) · [dokumen.html](dokumen.html) · [pengguna.html](pengguna.html)

HTML files contain only mount points; everything else is rendered by JS.

### Rendering pattern

Everything is **template literals assigned to `innerHTML`**. There is no diffing and no reactive layer. Whenever you replace a subtree you must re-run the behaviors it needs — re-bind listeners and call `UI.observe(container)` (and `Charts.animateBars` if it contains `.hbar-fill`). [js/menu.js](js/menu.js) `paint()` is the reference implementation: it re-renders, re-binds segment buttons, animates the nutrient bars, and re-observes.

`UI.observe` respects `prefers-reduced-motion`. Numbers use `.count` with `data-to` / `data-prefix` / `data-suffix` / `data-decimals`; reveals use `.reveal` + `data-delay`.

### Data layer

[js/data.js](js/data.js) builds everything from a few primitives:

- **`akg`** — versioned reference table: 6 recipient segments × 9 nutrients daily requirement + per-segment `targetPct`, plus `bands` (cukup 90 / perhatian 70). **Adequacy policy lives here, not in code** — `Nutrition` reads thresholds from this object.
- **`tkpi`** — food composition per 100 g. **Menu nutrition is computed from this**, never hand-typed, so changing a component's grams automatically changes every score derived from it.
- **`kitchens`** — 3 units built from `kitchenCfg`. `BEROPERASI` units get generated locked menus; `PERSIAPAN` units get empty arrays and `null` fields, and the UI renders a designed empty state rather than blanks — **preserve that branch when adding fields**.
- **`program`** — all aggregates are **derived** from `kitchens` (never hand-typed), so the footprint stays internally consistent.
- **`auditTrail`** — append-only; the correction entry references the original via `ref` and both keep their own `hash`.

Access via `MBG.kitchenBySlug`, `MBG.kitchenByCode`, `MBG.activeKitchens()`, `MBG.program`.

`MBG.fingerprint(obj)` is a **non-cryptographic stand-in** for the real content hash a server would compute. Do not present it as a security guarantee.

### Nutrition scoring (the analytical core)

`Nutrition.score(menu, segmentId)` returns `{segment, rows, overall, band, targetPct}`. The rule that matters: **each nutrient's percentage is capped at 100% before averaging**, so one over-supplied nutrient can never mask a deficient one. Per-nutrient status adds a **Berlebih** state above 100%; the overall band never uses it.

### Role gating (mock only — not security)

`Role` stores the selected role in `localStorage['mbg.role']`. `Role.ACCESS` maps page key → allowed role ids and is the single source of truth — `Role.can(page)` drives both the sidebar locks and whether `Internal.mount` renders the page or `Role.deniedCard()`. Adding an internal page means adding it to `ACCESS`, `Internal.NAV`, and `PERMS`.

Internal pages don't redirect — they render an **"Akses ditutup"** card naming the acting role and listing its permissions. Page scripts don't subscribe to role changes themselves; `Internal.mount` re-paints on `Role.onChange`.

### Images

No image is required. Every `<img>` falls back to a branded SVG placeholder via `onerror`; use `UI.img(src, alt, type, cls, ratio)` rather than raw tags. `type` keys into `MBG.placeholder` (`food`, `kitchen`, `gallery`, `portrait`, `hero`, `recipe`).

[IMAGES.md](IMAGES.md) is the authoritative list of expected filenames/folders. Keep it in sync when adding an image slot.

### CSS

Five stylesheets, always in this order: [tokens.css](css/tokens.css) → [base.css](css/base.css) → [components.css](css/components.css) → [pages.css](css/pages.css) → [app.css](css/app.css).

`app.css` holds every surface built against PRD_MERGED (public pages + the dark internal workspace). `pages.css` retains shared primitives (`.hero`, `.chart*`, `.hbars`, `.kpi`, `.page-hd`) and **also still contains dead rules for the removed unit/overview pages** — safe to prune.

All color, type, spacing, radius, shadow, and motion values are CSS custom properties in `tokens.css` — use `var(--…)`, never hardcode a hex. Brand is purple (`--brand-*`) + orange (`--accent-*`) on cream. Data-viz colors are `--viz-1..6`, mirrored as a literal `VIZ` array in `charts.js` (keep the two in sync).

## Conventions and constraints

- **No dependencies.** No npm, no CDN scripts, no Tailwind/shadcn/lucide/React/Next. Google Fonts are the only external resource. *(This was reaffirmed on 31 July 2026 against a request to migrate to Next.js — see CHANGELOG.)*
- **All paths relative** (`css/…`, `js/…`, `assets/…`) so the site works both at a domain root and under `…github.io/<repo>/`.
- All numeric/currency output goes through `id-ID` formatting (`MBG.fmt` / `MBG.fmtDec` / `MBG.rupiah`) and is styled with `.num` or `.mono` (tabular mono).
- Every page carries the `MOCKUP` banner and figures stay visibly simulated. The AKG/TKPI "simulated values" caveat must remain on Menu & Gizi and Data Acuan.
- **No CCTV, live video, or camera panels** (C-04) — explicitly out of scope in Source B.
- **Pengeluaran is expenditure reporting, not P&L** (C-05) — no revenue, margin, or profit anywhere.
- Immutability applies to **operational records**; CMS content stays editable/deletable (C-07).
- No real personal contact data on public pages.
- Only the role preference goes in `localStorage`.
- Out of scope by design: real backend/API, real auth or RBAC, a real file-parsing engine, supply chain, attendance, mobile app, predictive analytics.

## Testing note

There is no test tooling in-repo (by design). Pages were verified by executing each one under **jsdom in a scratchpad** (never installed into this repo) across all six roles, checking for zero console errors and correct gating. `window.matchMedia` is absent in jsdom and must be shimmed in any such harness — it is not a product bug.

## Note on brief.md

[brief.md](brief.md) is the original build brief and still describes a **Next.js + Tailwind + Vercel** stack with `/unit/[slug]` routes. That stack was deliberately rejected in favor of the static site described above. Treat brief.md as historical context only — PRD_MERGED.md supersedes it for requirements.
