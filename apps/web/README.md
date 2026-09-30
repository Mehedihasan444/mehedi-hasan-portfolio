# Mehedi Hasan — Portfolio Web

Next.js 16 (App Router, `cacheComponents`) + React 19 + Tailwind CSS 4. Part of the
`mehedi-portfolio` pnpm monorepo — run commands from the repo root.

## Getting Started

```bash
cp apps/web/.env.example apps/web/.env.local   # set NEXT_PUBLIC_API_URL / NEXT_PUBLIC_SITE_URL
pnpm dev                                       # turbo dev (web + api)
# or web only:
pnpm --filter web dev
```

Open [http://localhost:3000](http://localhost:3000). Public pages live in
`apps/web/src/app/(main)/` (`page.tsx`, `projects/`, `blog/`, `contact/`); the admin
panel lives in `apps/web/src/app/admin/` (token-gated, see repo `AGENTS.md`).

## Commands (repo root)

```bash
pnpm build        # turbo build (web .next + api dist)
pnpm lint         # turbo lint (eslint, zero-warning gate)
pnpm typecheck    # turbo typecheck (tsc --noEmit)
pnpm format       # prettier --write
```

Production check: `pnpm --filter web build && PORT=3003 pnpm --filter web start`,
then `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3003/`.

## Learn More

- Repo guide: `AGENTS.md` (architecture + performance rules)
- Product: `docs/PRODUCT.md` · Design: `docs/DESIGN.md`
- [Next.js docs](https://nextjs.org/docs)
