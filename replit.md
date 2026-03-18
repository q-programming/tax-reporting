# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Two packages: an Express API server serving mock data and a React frontend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Frontend**: React + Vite + Tailwind CSS
- **Build**: esbuild (CJS bundle for server)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (mock data endpoints)
│   └── tax-app/            # React + Vite frontend
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, scripts)
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package
```

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server serving mock tax data.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes:
  - `GET /api/healthz` — health check
  - `GET /api/tax/summary` — KPI data, monthly chart data, tax category distribution
  - `GET /api/tax/transactions` — list of 85 mock tax transactions
- Mock data is generated server-side in `src/routes/tax.ts`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)

### `artifacts/tax-app` (`@workspace/tax-app`)

Tax Reporting web application built with React + Vite + Tailwind CSS.

- **Frontend** fetches data from the API server via plain `fetch` calls (`src/lib/api.ts`) wrapped in React Query hooks (`src/hooks/use-tax-data.ts`)
- **Routing**: Wouter for client-side routing between `/tax-summary` and `/tax-transactions`
- **Pages**:
  - **Tax Summary** (`/tax-summary`): KPI cards, bar chart (monthly income vs expenses), donut chart (tax distribution)
  - **Tax Transactions** (`/tax-transactions`): Sortable/searchable data table with pagination
- **Layout**: Collapsible left sidebar with user profile dropdown, navigation links
- **Charts**: Recharts (bar chart, pie/donut chart)
- **Theme**: Yellow (#fee600) leading color with light sidebar
- **Key dependencies**: recharts, date-fns, lucide-react, @tanstack/react-query, wouter
- **Self-contained** — all types and API calls live in `src/lib/api.ts`

### `scripts` (`@workspace/scripts`)

Utility scripts package. Run via `pnpm --filter @workspace/scripts run <script>`.
