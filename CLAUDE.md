# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Type-check + build (tsc -b && vite build)
npm run lint       # Run ESLint
npm test           # Run tests in watch mode (Vitest)
npm run test:run   # Run tests once (no watch)
```

To run a single test file:
```bash
npx vitest run src/utils/math/queuingFormulas.test.ts
```

To sync and build the Android APK locally (requires Java 21 + Android SDK):
```bash
npm run build && npx cap sync android
cd android && ./gradlew assembleRelease
```

## Architecture

**LambdaρRo** is a mobile-first PWA / Android app for queuing theory (Operations Research) calculations. All computation is client-side — there is no backend.

### State Management
- Two React Context providers in `src/context/`:
  - `ThemeContext` — dark/light mode, persisted in `localStorage`
  - `SettingsContext` — decimal precision and tolerance settings
- No global state library; props and context cover all needs.

### Queuing Models
Four supported models, each with a dedicated calculator component and a distribution-visualization component:

| Model | Calculator | Distribution |
|-------|-----------|--------------|
| M/M/1 | `MM1.tsx` | `DistMM1.tsx` |
| M/M/1/K | `MM1K.tsx` | `DistMM1K.tsx` |
| M/M/c | `MMC.tsx` | `DistMMC.tsx` |
| M/M/c/N | `MMCN.tsx` | `DistMMCN.tsx` |

All mathematical formulas live in `src/utils/math/queuingFormulas.ts`. This is the single source of truth for calculations and is fully unit-tested in `queuingFormulas.test.ts` (150+ assertions covering normal cases, edge cases, Little's Law, ρ=1 special cases, and lambda conservation).

### Views / Routing
Views are in `src/views/`. Navigation between models is handled via `Navbar.tsx` (bottom nav). There is no router library — view switching is managed with local state in `App.tsx`.

### Styling
TailwindCSS v4 with dark/light mode. Theme class is toggled on the `<html>` element by `ThemeContext`.

### Mobile Distribution
Capacitor wraps the Vite build (`dist/`) as an Android app (app ID: `com.regnault.colascalc`). GitHub Actions (`.github/workflows/android.yml`) builds and uploads the APK on every push to `main`.
