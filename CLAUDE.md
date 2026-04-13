# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (localhost:3000)
npm run build     # Production build (standalone output)
npm run start     # Run production server
npm run lint      # Run ESLint
npm run analyze   # Build with bundle analyzer (requires cross-env ANALYZE=true)
```

There is no test suite configured in this project.

## Architecture

GuambraWeb is a Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 web agency site with Supabase as the backend.

### Route Structure

The `src/app/` directory uses the Next.js App Router with these main sections:
- **Public marketing**: `/`, `/servicios`, `/planes`, `/portafolio`, `/nosotros`, `/contacto`
- **E-commerce**: `/tienda`, `/tienda/[slug]`, `/tienda/carrito`, `/tienda/checkout`, `/confirmacion-pago`
- **Admin dashboard** (protected): `/admin/*` — clients, projects, subscriptions, support tickets, finances, sales, marketing, team, bio links, config
- **Auth**: `/auth/login`
- **Bio page**: `/links` — public profile with analytics
- **User area**: `/mi-suscripcion`

### Data Layer

All Supabase interactions follow a strict client separation:
- `src/lib/supabase/client.ts` — browser client (use in Client Components)
- `src/lib/supabase/server.ts` — server client with cookie handling (use in Server Components and Server Actions)
- `src/lib/supabase/admin.ts` — service role client (admin API routes only, never exposed to browser)

Server mutations go through **Server Actions** in `src/app/actions/` (bio-links, subscription, projects, profile, tickets, etc.). API routes in `src/app/api/` handle admin operations and bio analytics tracking.

### Key TypeScript Types

Database types are generated and live in `src/types/database.ts`. The main tables are: `customers`, `orders`, `orders_items`, `products`, `projects`, `subscriptions`, `users`, `bio_links`, `bio_portfolio`, `bio_blocks`, `bio_page_visits`, `assets_it`.

### Theme System

Two themes exist: `"negro"` (dark) and `"cian"` (cyan-blue), defined in `src/app/theme.config.ts` as HSL CSS variable maps. The `ThemeProvider` in `src/components/providers/ThemeProvider.tsx` applies these as CSS custom properties. Tailwind is configured with `darkMode: "class"` and extends those CSS variables (`--primary`, `--secondary`, `--accent`, etc.) as color tokens.

### Path Alias

`@/*` maps to `src/*` — use this for all internal imports.

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Next.js Config Notes

- Output is `standalone` — the build is self-contained.
- `jspdf`, `html2canvas`, and `canvas` are listed as `serverExternalPackages` (PDF generation).
- Remote image patterns allow Supabase storage, Unsplash, Google, Imgur, and Cloudinary.
