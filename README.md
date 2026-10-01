# Mehedi Hasan — Portfolio

Full-stack developer portfolio: a Next.js 16 frontend with an Express + Prisma API, deployed as two Vercel projects.

- **Web:** https://mehedi-hasan-portfolio-client.vercel.app
- **API:** https://mehedi-hasan-portfolio-server.vercel.app (root route reports status, `/api/v1/health` for probes)

## Stack

| App        | Tech                                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| `apps/web` | Next.js 16 (App Router, `cacheComponents`), React 19, Tailwind CSS 4, GSAP, Lenis, three.js/R3F             |
| `apps/api` | Express 4, Prisma 6 (PostgreSQL), Zod, JWT + httpOnly cookies, Cloudinary, Pino, Helmet + CORS + rate limit |

Tooling: `pnpm@9.15.0` workspaces + Turborepo, TypeScript 5.7, ESLint (zero-warning gate), Prettier (Tailwind plugin), commitlint + Husky.

## Repository layout

```
apps/web/     Next.js site — public pages in src/app/(main), admin panel in src/app/admin
apps/api/     Express API — src/modules (auth, contact, projects, upload, CRUD), prisma/
docs/         DESIGN.md, PRODUCT.md + dated audits
AGENTS.md     architecture, performance and contribution rules — read before editing
```

## Getting started

```bash
pnpm install

cp apps/web/.env.example apps/web/.env.local   # NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SITE_URL
cp apps/api/.env.example apps/api/.env         # DATABASE_URL, JWT_SECRET, CORS_ORIGIN, Cloudinary

pnpm --filter api docker:up                    # local Postgres + pgAdmin
pnpm --filter api prisma:migrate               # apply schema
pnpm --filter api prisma:seed                  # admin user, skills, projects, settings

pnpm dev                                       # web (3000) + api (4000) in parallel
```

## Commands

Run from the repo root:

| Command                             | What it does                          |
| ----------------------------------- | ------------------------------------- |
| `pnpm dev`                          | turbo dev — web + api                 |
| `pnpm build`                        | turbo build (web `.next`, api `dist`) |
| `pnpm lint`                         | ESLint with `--max-warnings=0`        |
| `pnpm typecheck`                    | `tsc --noEmit` per workspace          |
| `pnpm format` / `pnpm format:check` | Prettier write / check                |
| `pnpm --filter api prisma:generate` | regenerate Prisma client              |

## Deployment

Both apps deploy to Vercel (CLI is linked per app: `apps/web/.vercel`, `apps/api/.vercel`).

```bash
pnpm --filter web build                                  # then: cd apps/web && vercel --prod
pnpm --filter api build                                  # then: cd apps/api && vercel --prod
```

The API's `vercel.json` uses the legacy `builds` config, so Vercel's build settings are
skipped — always build `apps/api` locally first so `dist/` is fresh, and keep the
`postinstall: prisma generate` script (without it the function crashes at import time and
the browser reports a misleading CORS error).

Required API env vars on Vercel: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`,
`CORS_ORIGIN` (comma-separated, must include the web origin), `CLOUDINARY_*`, `NODE_ENV`.
After changing env vars, redeploy for them to take effect.

## Documentation

- [`AGENTS.md`](AGENTS.md) — architecture, performance guardrails, do/don't list
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — product vision, sections, data model, SEO
- [`docs/DESIGN.md`](docs/DESIGN.md) — color, typography, glass/gradient system
- [`apps/web/docs/PERFORMANCE_AUDIT_2026-08.md`](apps/web/docs/PERFORMANCE_AUDIT_2026-08.md) — production performance audit
