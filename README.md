# SolvexR
> fast, offline-first, installable PWA built with React + Vite.
`2.0.X` `PWA`

Practice arithmetic under time pressure. Solve as many sums as you can before the clock runs out — get instant feedback on accuracy, average time, and a full submission log to fix mistakes.
---

## Features

- **Timed sessions** — configurable time control (1–60 min), live countdown + per-problem timer.
- **Operations** — toggle addition / subtraction / multiplication / division (at least one must stay enabled).
- **Number ranges** — independent `1–10 / 100 / 1000 / 10000` ranges for each operand.
- **Manual Number 2** — fix the second operand to a specific value (1–10000) instead of random.
- **Live stats** — progress bar, correct / wrong counters, answer history with `CheckCircle` / `XCircle` + time taken.
- **Finish modal** — end-of-session summary (accuracy, average time, submissions).
- **PWA** — standalone install, offline precache, `apple-touch-icon`, maskable icon, `favicon.svg` / `favicon.ico`.
- **Answer checking** — safe `switch`-based calculation (no `eval`), division answers checked to **2 decimals** (`toFixed(2)`).

## Tech Stack

- **Runtime:** React 19, TypeScript 6, Vite 8
- **Routing:** TanStack Router (file-based, `src/routes/`)
- **State:** Zustand (settings, persisted) + Jotai (answers)
- **Styling:** Tailwind CSS 4 (`@tailwindcss/vite`), `tailwind-merge` / `clsx` / `cva`, `react-circular-progressbar`
- **UI:** Radix UI (Checkbox, Select, Slider, Switch, Separator, Slot), Phosphor Icons
- **PWA:** `vite-plugin-pwa` (generateSW + Workbox), `@vite-pwa/assets-generator`

## Quick Start

**Prerequisites:** Node 20+, `pnpm` (or npm/yarn)

```bash
pnpm install
pnpm dev        # http://localhost:5173 — PWA dev enabled (navigateFallback)
pnpm build      # tsc -b && vite build → dist/
pnpm preview    # preview production build
pnpm lint       # oxlint
```

## Scripts

| Script | Description |
|---|---|
| `dev` | Vite dev server with HMR + PWA devOptions |
| `build` | Type-check + production build (precaches 25 entries) |
| `preview` | Serve `dist/` locally |
| `lint` | `oxlint` (config in `.oxlintrc.json`) |

## Project Structure

```
solvexr-vite/
├── public/
│   ├── favicon.svg              # source icon (solvexr.svg) — used for PWA generation
│   ├── favicon.ico              # 48×48
│   ├── pwa-64x64.png / pwa-192x192.png / pwa-512x512.png
│   ├── pwa-maskable-512x512.png # maskable (white bg, padding 0.3)
│   ├── apple-touch-icon.png     # 180×180
│   └── pfp.png / icons.svg / …
├── src/
│   ├── components/              # Header, FinishModal, ReloadPrompt, ui/*
│   ├── routes/                  # / (Home), /app (Practice), /settings, /about
│   ├── store/                   # settings.ts (zustand persist), answers.ts (jotai)
│   ├── lib/utils.ts
│   ├── main.tsx                 # TanStack Router + Jotai Provider
│   └── index.css
├── pwa-assets.config.ts         # @vite-pwa/assets-generator preset (minimal2023 + custom assetName)
├── vite.config.ts               # Vite + TanStack Router + tailwindcss + VitePWA manifest/workbox
├── index.html                   # favicon.svg, apple-touch-icon, theme-color #079697
└── tsconfig.json
```

## PWA

**Manifest** (`vite.config.ts:16`): `name: SolvexR`, `theme_color: #079697`, `background_color: #101215`, `display: standalone`, `orientation: portrait`, 4 icons (192, 512, maskable 512, apple 180).

**Workbox** — `globPatterns: **/*.{js,css,html,ico,svg,png,woff2}`, `navigateFallback: /index.html`, runtime caching for `fonts.googleapis.com`, `fonts.gstatic`, images, fonts, API (`NetworkFirst`).

**Icons — regeneration:**

```bash
# 1. Replace source
cp dist/solvexr.svg public/favicon.svg

# 2. Generate (uses pwa-assets.config.ts)
npx pwa-assets-generator
# → pwa-64x64.png, pwa-192x192.png, pwa-512x512.png,
#   pwa-maskable-512x512.png, apple-touch-icon.png, favicon.ico

# 3. Build to copy to dist/
pnpm build
```

Custom `assetName` in `pwa-assets.config.ts:22` maps to legacy filenames expected by the manifest (`pwa-maskable-*`, `apple-touch-icon.png`).

## Configuration

- **Settings store** `src/store/settings.ts:19` — `timeControl`, `numberOneRange`, `numberTwoRange`, `manualEnabled`/`maunalNumber`, `operations`; `changeStorage`, `changeRanges`, `changeOperations`, `getOperation()`; persisted as `solvexr-settings`.
- **Answers store** `src/store/answers.ts` — list + `addAnswer` / `clearAnswers`.
- **Practice logic** `src/routes/app.tsx:49` — `calculate(a,op,b)` switch (no `eval`), `toFixed(2)` comparison via `Number.parseFloat`.
- **Alias:** `@` → `src/` (see `vite.config.ts:144`).
