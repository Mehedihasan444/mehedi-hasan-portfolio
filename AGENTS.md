# AGENTS.md — Mehedi Portfolio Monorepo

This file guides AI agents and human contributors working in this repository. Read it before making any code or docs change.

## Repository Structure

```
mehedi-portfolio/                 # pnpm monorepo (turborepo)
├── client/                      # Next.js 16.2.10 (App Router, React 19, Tailwind 4)
│   ├── src/app/                 # (main) public pages + /admin + layout, loading, error, sitemap, robots
│   ├── src/components/          # 3d/, animations/, layout/, sections/, ui/
│   ├── src/hooks/               # use-scroll-progress (singleton), use-parallax, use-globe-scroll, etc.
│   ├── src/lib/                 # api-public.ts (React.cache), constants, sections, gsap, utils
│   ├── src/providers/           # Providers, SmoothScrollProvider (Lenis), PageTransition
│   ├── public/                  # mehedi_hasan.webp (LCP), projects/*.webp, og-image.png (1200×630)
│   ├── next.config.ts           # cacheComponents, optimizePackageImports, images AVIF/WebP
│   └── docs/PERFORMANCE_AUDIT_2026-08.md
├── server/                      # Backend (API at NEXT_PUBLIC_API_URL, default http://localhost:4000/api/v1)
├── docs/                        # Root docs: DESIGN.md, PRODUCT.md (this audit also creates them)
├── package.json                 # turbo dev/build/lint/typecheck/format
├── pnpm-workspace.yaml          # packages: [client, server, packages/*]
├── turbo.json, .prettierrc, commitlint.config.js, .husky/
└── AGENTS.md                    # ← you are here
```

**Package manager:** `pnpm@9.15.0` (enforced via `packageManager` field). Node `>=20`.

## Commands (run from repo root unless noted)

```bash
pnpm dev              # turbo dev — runs client+server in parallel (persistent, no cache)
pnpm build            # turbo build — builds all workspaces (.next/**, dist/**)
pnpm lint             # turbo lint (client: eslint)
pnpm typecheck        # turbo typecheck (client: tsc --noEmit)
pnpm format           # prettier --write "**/*.{ts,tsx,js,json,css,md}"
pnpm format:check     # prettier --check
# Client-only (when you need Next specifics):
pnpm --filter client dev
pnpm --filter client build        # Turbopack, 11 workers, ISR 60s
pnpm --filter client analyze      # ANALYZE=true next build (bundle-analyzer)
PORT=3003 pnpm --filter client start  # production start (verify before PR)
```

Build is green when: `next build` compiles, TypeScript passes, and lint pre-existing 113 problems is not increased. Do not block on pre-existing `react-hooks/set-state-in-effect` warnings in `hero-section.tsx` / `card-stack.tsx` — they are known.

## Architecture Rules

### Next.js

- **App Router only.** Pages live in `src/app/(main)/` (public) and `src/app/admin/` (protected). Never add `pages/` directory.
- **`cacheComponents: true`** is enabled in `next.config.ts`. Use `"use cache"` + `cacheLife`/`cacheTag` for data fetches (`src/lib/sections.ts` is the reference).
- **Images:** Always use `next/image` with `fill` + `sizes`, `priority`+`fetchPriority="high"` for LCP (see `parallax-image.tsx`, `featured-card.tsx`). Never set `unoptimized`. `public/projects/*.webp` are LCP; `.png` duplicates were deleted — do not re-add PNGs.
- **Fonts:** `next/font/google` with `display: swap`. Weights are intentionally trimmed to 8 woff2 (Inter 400,600,700; Space_Grotesk 400,600,700; JetBrains_Mono 400,500). Do not add `500` on display fonts or `600` on mono without justification.
- **Remote images:** `next.config.ts` allows `localhost:4000`, `**.vercel.app`, `res.cloudinary.com`, `images.unsplash.com` with `minimumCacheTTL: 31536000`. Add new hosts there before using remote `src`.
- **ISR:** Public API helpers in `src/lib/api-public.ts` use `next: { revalidate: 60 }` and `React.cache` deduplication. `getBlogPostBySlug` tries `/blog/slug/:slug` then falls back to `getBlogPosts()` scan — preserve this.

### Performance (non-negotiable)

Every animation/canvas must guard for low-end devices. Copy the patterns in `client/docs/PERFORMANCE_AUDIT_2026-08.md` C-01..C-17:

- **Early return** on `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and `"(pointer: coarse)"` (touch).
- **Pause rAF loops** when `document.hidden` (add `visibilitychange` handling, see `smooth-scroll-provider.tsx`).
- **Throttle** `mousemove` (32ms or rAF batching) and **cap** particle counts (`MAX_PARTICLES 120`, glitter 90).
- **Idle-defer** heavy work via `requestIdleCallback` (fallback `setTimeout 500ms`), see `client-animations.tsx`, `globe-scene.tsx`.
- **Singleton scroll:** Never instantiate `useScrollProgress` more than once per tree. The hook is now a `useSyncExternalStore` singleton — do not revert to per-component listeners.
- **Lenis:** Disabled on `pointer: coarse` and reduced-motion. Never re-enable on touch without profiling.
- **CSS:** `body { background-attachment: fixed }` switches to `scroll` on `max-width:768px` via media query — do not remove.

### State & Data

- **Server Components by default.** Only add `"use client"` if you need `useState`/`useEffect`/`useFrame`/`motion`. `103` client files already is high — prefer server.
- **Sections:** `DEFAULT_SECTIONS` in `src/lib/constants.ts` (12 entries). `src/lib/sections.ts` `getSectionVisibility()` controls rendering in `src/app/(main)/page.tsx` via `Suspense` per section + `ProgressiveBlur` dividers.
- **API base:** `NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api/v1`). Never hardcode `localhost` in code — use `API_BASE` constant.

### Styling

- **Tailwind CSS 4** with `tw-animate-css`. Tokens in `src/app/globals.css` (`--background: #050810`, `--primary: #059669`, etc.). Use `glass`, `glass-hover`, `text-gradient`, `glow-violet` utilities — do not introduce new color systems.
- **3D:** `three@0.185.1`, `@react-three/fiber@9.6.1`, `@react-three/drei@10.7.7` are gated `ssr:false` + low `dpr` (`[1, 1.5]`). Always `powerPreference: "high-performance"`.

### Git & Style

- **Conventional commits** enforced by commitlint + husky (`feat:`, `fix:`, `docs:`, `perf:`, `chore:`).
- **Prettier** with `prettier-plugin-tailwindcss` — run `pnpm format` before PR. Do not hand-order Tailwind classes.
- **Images:** OG image is `public/og-image.png` 1200×630 27 KB (ImageMagick). Regenerate with `convert -size 1200x630 xc:"#050810" ...` if you change site title.

## Do / Don't

- **Do** verify with `pnpm --filter client typecheck && pnpm --filter client build` and `PORT=3003 npx next start` curl checks (`/` 150 KB, `/og-image.png` 200 OK) before PR.
- **Do** respect `pointer: coarse` — test heavy effects on touch emulation.
- **Don't** add `unoptimized` to `next/image`, new PNG assets, or new font weights without audit.
- **Don't** create `pages/` or duplicate `getBlogPostBySlug` over-fetch (use `React.cache`).
- **Don't** run `requestAnimationFrame` loops without `document.hidden` guard.
- **Don't** commit `.env.local` — it contains `NEXT_PUBLIC_API_URL`.

## Docs

- `docs/DESIGN.md` — color, typography, spacing, glass/gradient system.
- `docs/PRODUCT.md` — product vision, sections, data model, SEO, deployment.
- `client/docs/PERFORMANCE_AUDIT_2026-08.md` — full production audit (Verdict: PRODUCTION READY WITH MINOR OPTIMIZATIONS, 2026-08-28).

When you modify behavior, update the corresponding doc. Keep `AGENTS.md` concise — it is the entrypoint agents read first.
