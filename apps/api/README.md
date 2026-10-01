# Mehedi Hasan — Portfolio API

Express 4 + Prisma 6 (PostgreSQL) backend for the portfolio site. Workspace name `api`;
runs at `http://localhost:4000/api/v1` locally.

## Routes

| Route                  | Notes                                                                             |
| ---------------------- | --------------------------------------------------------------------------------- |
| `GET /`                | status payload — service, environment, uptime, endpoint hints                     |
| `GET /api/v1/health`   | liveness probe (skips the rate limiter)                                           |
| `POST /api/v1/auth/*`  | login, register (guarded by `ALLOW_PUBLIC_REGISTER`), me                          |
| `POST /api/v1/contact` | message capture                                                                   |
| `/api/v1/:resource`    | generic CRUD via `src/utils/crud-factory.ts` (authenticate on writes, public GET) |

Middleware order in `src/app.ts`: Helmet → CORS (`CORS_ORIGIN` allowlist) → cookies →
compression → JSON body (1 mb) → rate limit (100/15 min on `/api/`).

## Setup

```bash
cp .env.example .env            # DATABASE_URL, JWT_SECRET, CORS_ORIGIN, CLOUDINARY_*
pnpm docker:up                  # Postgres 16 + pgAdmin
pnpm prisma:migrate             # apply migrations
pnpm prisma:seed                # admin user + demo content
pnpm dev                        # tsx watch src/app.ts
```

Other scripts: `pnpm build` (`prisma generate && tsc`), `pnpm start`, `pnpm lint`,
`pnpm typecheck`, `pnpm prisma:studio`.

## Deployment notes

`vercel.json` uses the legacy `builds` config pointing at `dist/app.js`, which makes
Vercel skip the project build settings. Two consequences:

1. `postinstall: prisma generate` is required — otherwise the function dies on import
   with `@prisma/client did not initialize yet` and every request (including CORS
   preflights) fails with an opaque 500.
2. Build before deploying: `pnpm build && vercel --prod`.

Set `CORS_ORIGIN=https://<web-origin>,http://localhost:3000` on Vercel and redeploy
after changing env vars.
