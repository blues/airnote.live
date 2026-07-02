# CLAUDE.md

## Project Overview

Airnote.live is a web app for configuring and monitoring Blues Airnote air quality devices. Users scan a QR code on their device to change device settings, and view real-time AQI, PM2.5, temperature, humidity, and voltage readings, plus historical charts and a map. Built as an open-source reference for Notecard-based web apps.

Live at https://airnote.live

## Tech Stack

- **Framework:** SvelteKit 2 with Svelte 4
- **Language:** TypeScript (strict mode)
- **Build:** Vite 5
- **Deployment:** Netlify (adapter-netlify)
- **Node:** 20.17.0 (Volta)
- **Charts:** Chart.js 4 with date-fns adapter
- **Maps:** Mapbox GL
- **API Client:** @blues-inc/notehub-js
- **Markdown:** MDSvex with remark/rehype plugins

## Commands

```bash
npm run dev          # Dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run check        # Type check (svelte-check)
npm run test         # Unit tests (Vitest)
npm run lint         # Prettier + ESLint check
npm run format       # Auto-format with Prettier
npm run cypress:open # E2E tests (interactive)
npm run cypress:run  # E2E tests (headless)
```

## Project Structure

```
src/
├── lib/
│   ├── components/       # UI components
│   │   └── charts/       # AQI, PM, Temperature, Humidity, Voltage charts
│   ├── constants/        # Enums and constants (DateRangeOptions, ErrorTypes, TooltipStates)
│   ├── constants.ts      # Global constants (product UIDs, API URL, GA ID)
│   ├── icons/            # SVG icon components
│   ├── images/           # Static images
│   ├── layout/           # Header, Footer
│   ├── services/         # Business logic & API layer
│   │   ├── notehub.ts    # Notehub API wrapper
│   │   ├── device.ts     # Device data processing
│   │   ├── air.ts        # AQI calculations, heat index
│   │   └── *Model.ts     # TypeScript interfaces
│   ├── stores/           # Svelte writable stores (settings state)
│   └── util/             # Helpers (dates, errors, share, url)
├── routes/
│   ├── +page.svelte              # Home (device UID entry)
│   ├── [deviceUID]/
│   │   ├── +page.server.ts       # Device settings loader
│   │   ├── +page.svelte          # Device settings page
│   │   └── dashboard/
│   │       ├── +page.server.ts   # Dashboard data loader
│   │       └── +page.svelte      # Dashboard with charts/map
│   ├── quickstart/               # Setup guide (MDSvex)
│   └── api/download/+server.ts   # CSV export endpoint
└── test/
    └── services/device.test.ts   # Unit tests
```

## Environment Variables

Required in `.env`:

- `HUB_AUTH_TOKEN` — Notehub API token (server-side)
- `PUBLIC_MAPBOX_TOKEN` — Mapbox access token (client-side, must be `PUBLIC_` prefixed)

## Code Conventions

- **Formatting:** Prettier — 2 spaces, single quotes, no trailing commas, 80 char width
- **Components:** PascalCase `.svelte` files
- **Services/utils:** camelCase `.ts` files
- **Models:** Separate `*Model.ts` files with TypeScript interfaces
- **Data fetching:** Server-side in `+page.server.ts` via `load()` functions
- **State:** Svelte writable stores for form state; SvelteKit page stores for URL params
- **Testing:** `data-cy="..."` attributes for Cypress selectors
- **Imports:** Use `$lib/` alias for anything under `src/lib/`

## Key Patterns

- Device data flows: Notehub API → `notehub.ts` → `device.ts` (processing) → `+page.server.ts` (load) → components
- PIN-based authentication for device settings changes
- Charts are reactive Svelte components wrapping Chart.js canvases
- CSV export via `/api/download` server endpoint using PapaParse

## Deployment

Netlify auto-deploys from git. Config in `netlify.toml`:

- Build: `npm run build`
- Publish: `build/`
