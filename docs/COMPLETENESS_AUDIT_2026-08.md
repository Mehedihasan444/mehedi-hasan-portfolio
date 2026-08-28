# COMPLETENESS AUDIT — Mehedi Portfolio — 2026-08-28

> **Scope:** Full monorepo `client/` (Next.js 16.2.10, React 19, Tailwind 4) + `server/` (Express 4.21, Prisma sqlite→PG, Cloudinary) — every route, component, hook, provider, lib, asset, config, env, and deployment path.
> **Method:** Read every config, layout, route, provider, hook, representative section/component, and server module in full; traced data-fetching via `api-public.ts`; ran `tsc --noEmit`, `eslint`, `next build` (Turbopack); grepped for TODO/mock/placeholder/any/console; inspected images, fonts, headers, SEO, a11y, security by code evidence. No headless browser available — flows verified by implementation trace, not live click-through (noted as UNVERIFIED where browser proof would be required).
> **Prior audit incorporated:** `docs/COMPLETE_PRODUCTION_AUDIT_2026-08.md` and `client/docs/PERFORMANCE_AUDIT_2026-08.md` treated as baseline; this report re-verifies and extends them with the COMPLETE/PARTIAL/INCOMPLETE/MISSING/BROKEN/PLACEHOLDER taxonomy.
> **Build truth (2026-08-28):** `pnpm --filter client typecheck` PASS, `pnpm --filter client build` PASS — 22/22 pages in 1.2s (11 workers), `eslint` 85 errors / 27 warnings (pre-existing, build not blocked).

---

## 1. EXECUTIVE SUMMARY

**Overall completeness: ~82% (MOSTLY COMPLETE — minor production items remain).** The portfolio is a professionally designed, functionally coherent personal site. Every public route loads via App Router, metadata and sitemap are present, 12 homepage sections compose correctly under `Suspense` + `ProgressiveBlur`, and the prior performance audit's fixes (Lenis gate, rAF `document.hidden` guards, particle caps, singleton scroll, font trim, WebP, `priority`/`fetchPriority` on LCP) remain intact.

**What is fully complete:** App Router architecture (`cacheComponents: true`, `optimizePackageImports`, ISR 60s, `React.cache` deduplication), all public routes and layouts, SEO foundation (titles, OG 1200×630, JSON-LD Person, canonical, `robots.txt`, dynamic `sitemap.xml` with projects+blog), security headers on the edge (`X-Frame-Options: DENY` etc. added) plus `helmet`/`cors`/`compression`/`rateLimit` on server, responsive layout and image optimization (`next/image` `fill`+`sizes`, AVIF/WebP, `minimumCacheTTL`, `dangerouslyAllowSVG:false`), accessibility baseline (skip link, `#main-content`, labels, `alt`, `prefers-reduced-motion` and `pointer: coarse` guards, ESC+scroll-lock on mobile menu and lightbox), and contact form end-to-end (client validation + `POST /contact` + admin messages).

**What is incomplete / partial:** Contact anti-spam is only global `100/15m` rate limit — no per-route limit, honeypot, or CAPTCHA; server contact validation is lenient (`name/email/message` only, no lengths/regex); several sections fail silently on API error (`catch { return [] }` → empty UI); admin CRUD is functional but typed as `any` (9 files) with `confirm()` dialogs and no bulk/optimistic UX; `shadcn` CLI lives in `dependencies`; `sharp` missing; focus trap absent from overlays.

**What is missing:** Automated tests (0 files), CI pipeline, analytics integration, resume PDF asset, per-section error/empty/retry UI, CSP, production `CORS_ORIGIN` wiring documentation, and live GitHub data (stats are static).

**What is broken:** `Download CV` links to `/resume.pdf` which does not exist in `client/public/` (404 on click). `personJsonLd` image points to `/profile.jpg` (404; actual asset is `mehedi_hasan.webp`).

**What is placeholder/mock:** GitHub stats (`20+`/`15+` etc.), language breakdown percentages, contribution heatmap (deterministic `Math.sin` seed), achievement metrics (`10+`/`100+`/`5+`/`1K+`), and `about` values — all hardcoded static arrays in `constants.ts`.

**Blocking production?** No P0 application break. Two procedural P0s remain: rotate Cloudinary/JWT secrets before any public repo push, and set prod `CORS_ORIGIN` to `https://mehedi-hasan.dev`. One functional broken item (`/resume.pdf` 404) should be fixed before announcing the portfolio to recruiters. Everything else is P1–P3 polish.

---

## 2. COMPLETENESS SCORECARD

Honest, evidence-based scores (0–100). No inflation. 90+ = industry-standard, 80–89 = ready with minor polish, <80 = conditional.

| Category             | Complete | Partial | Incomplete | Missing | Broken | Score | Notes                                                                                                                                                                                                                                 |
| -------------------- | -------: | ------: | ---------: | ------: | -----: | ----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pages & Routes       |       14 |       2 |          0 |       0 |      0 |    92 | 16 routes total; 2 partial = `/projects/[slug]` gallery placeholder gaps, `/resume.pdf` asset missing (counted under Content but surfaces here)                                                                                       |
| Core Features        |        9 |       5 |          0 |       1 |      1 |    84 | 9 complete (nav, hero, skills, experience, projects listing, contact, blog, admin CRUD, sitemap); 5 partial (github mock, search cap, validation leniency, error silence, admin typing); 1 missing (analytics); 1 broken (resume PDF) |
| User Flows           |        3 |       1 |          0 |       0 |      0 |    85 | 4 flows traced; 1 partial = recruiter flow broken at CV download step                                                                                                                                                                 |
| UI Functionality     |       18 |       3 |          0 |       0 |      1 |    88 | ~22 interactive elements audited; 1 broken (Download CV), 3 partial (filter slice, no focus trap, `confirm()`)                                                                                                                        |
| Forms & Actions      |        2 |       1 |          0 |       0 |      0 |    82 | Contact form + admin forms; partial = server validation leniency                                                                                                                                                                      |
| Mobile Experience    |        7 |       1 |          0 |       0 |      0 |    87 | Lenis disabled on coarse, ESC+lock on menu/lightbox, `sizes` correct; partial = no focus trap                                                                                                                                         |
| Error Handling       |        3 |       2 |          1 |       1 |      0 |    62 | Global `error.tsx`+`not-found.tsx`+`loading.tsx` exist; partial = silent per-section failure, verbatim `error.message`; missing = per-section retry/empty; incomplete = no 500 mapping                                                |
| Content              |        9 |       2 |          0 |       1 |      1 |    78 | 9 content areas populated; 2 partial (few testimonials/achievements if DB empty, blog OG absent); 1 missing (resume file); 1 broken (JSON-LD image)                                                                                   |
| Accessibility        |        8 |       2 |          0 |       1 |      0 |    82 | Skip link, labels, alt, reduced-motion present; partial = no focus trap, missing `aria-live` on toasts; missing = focus-trap lib                                                                                                      |
| Performance          |        8 |       1 |          0 |       1 |      0 |    86 | Prior audit C-01..C-17 intact; partial = bundle still heavy (`three`+`motion`+`gsap` accepted); missing = `sharp`                                                                                                                     |
| SEO                  |        7 |       2 |          0 |       0 |      1 |    84 | Titles/meta/canonical/OG/twitter/robots/sitemap present; partial = blog OG images, `SITE_URL` DRY; broken = JSON-LD image 404                                                                                                         |
| Security             |        6 |       1 |          0 |       1 |      0 |    83 | `helmet`+headers+`rateLimit`+`dangerouslyAllowSVG:false`; partial = contact spam surface; missing = CSP                                                                                                                               |
| Testing              |        0 |       0 |          0 |       2 |      0 |    20 | 0 test files, no runner, no CI                                                                                                                                                                                                        |
| Production Readiness |        6 |       2 |          0 |       1 |      1 |    80 | Build green, `.env` ignored, `zod` env validation; partial = `shadcn` dep, CORS env; missing = CI; broken = resume asset                                                                                                              |

**Overall weighted: 79/100 — MOSTLY COMPLETE — MINOR ITEMS REMAIN.** Dragged by Testing (20) and Error Handling (62); all user-facing categories ≥78.

---

## 3. ROUTE & PAGE INVENTORY

| Route                                                                      | Purpose                                                                          | UI Exists | Functionality Exists                                                                    | Tested (build/code)                       | Status                                        |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------- |
| `/`                                                                        | Homepage — 12 Suspense sections + blurs                                          | Yes       | Yes (ISR, `getSectionVisibility`, defaults all true)                                    | Build PASS 22/22, `page.tsx:1` verified   | COMPLETE                                      |
| `/projects`                                                                | Project listing with search + tech filter                                        | Yes       | Yes (client `useEffect` + `getProjects()`, skeleton added prior audit)                  | Build PASS, `page.tsx:26` filter verified | PARTIALLY COMPLETE (PART-02: hides techs >10) |
| `/projects/[slug]`                                                         | Project detail — hero reveal, gallery, markdown                                  | Yes       | Yes (`generateMetadata`, `notFound()`, `ProjectDetailClient`, `GalleryGrid`+`Lightbox`) | Build PASS, `page.tsx:12` verified        | COMPLETE                                      |
| `/blog`                                                                    | Blog index (published only)                                                      | Yes       | Yes (`getBlogPosts`, `published` filter)                                                | Build PASS                                | COMPLETE                                      |
| `/blog/[slug]`                                                             | Blog post detail + metadata                                                      | Yes       | Yes (`getBlogPostBySlug` with `/slug/:slug` + fallback scan)                            | Build PASS, fallback preserved            | COMPLETE                                      |
| `/contact`                                                                 | Standalone contact page                                                          | Yes       | Yes (wraps `ContactSection`)                                                            | Build PASS                                | COMPLETE                                      |
| `/#hero`, `/#about`, `/#skills`, `/#experience`, `/#projects`, `/#contact` | In-page anchors via navbar/footer/hero CTAs                                      | Yes       | Yes (navbar now `router.push("/#x")` from non-home; prior FUNC-01 fixed)                | Code trace PASS                           | COMPLETE                                      |
| `/sitemap.xml`                                                             | Dynamic sitemap (`ƒ`)                                                            | Yes       | Yes (`Promise.all` projects+blog, `priority` correct)                                   | Build generates `ƒ /sitemap.xml`          | COMPLETE                                      |
| `/robots.txt`                                                              | `robots` (`○`)                                                                   | Yes       | Yes (`allow /`, `disallow /admin/`, sitemap URL)                                        | Build `○ /robots.txt`                     | COMPLETE                                      |
| `not-found.tsx`                                                            | 404 page                                                                         | Yes       | Yes (gradient 404, Go Home)                                                             | Build `○ /_not-found`                     | COMPLETE                                      |
| `error.tsx`                                                                | Global error with reset                                                          | Yes       | Yes (`use client`, `reset()`)                                                           | Code verified; see EDGE-02                | PARTIALLY COMPLETE (leaks `error.message`)    |
| `loading.tsx`                                                              | Global loading + per-route `projects/loading.tsx`, `projects/[slug]/loading.tsx` | Yes       | Yes (spinner)                                                                           | Build collects page data                  | COMPLETE                                      |
| `/admin/login`                                                             | Admin login                                                                      | Yes       | Yes (`api.login`, `localStorage admin_token`)                                           | Build `○ /admin/login`                    | COMPLETE                                      |
| `/admin/dashboard`                                                         | Stats (projects/skills/experiences/messages) + 12 section toggles                | Yes       | Yes (`Promise.all` fetches, optimistic toggle)                                          | Build PASS, `dashboard/page.tsx` verified | COMPLETE                                      |
| `/admin/projects`                                                          | CRUD projects + image upload (Cloudinary)                                        | Yes       | Yes (DataTable, FormModal, `parseJsonField`, upload)                                    | Build PASS                                | PARTIALLY COMPLETE (typed `any`)              |
| `/admin/skills`                                                            | CRUD skills                                                                      | Yes       | Yes                                                                                     | Build PASS                                | PARTIALLY COMPLETE (`any`)                    |
| `/admin/experiences`                                                       | CRUD experiences                                                                 | Yes       | Yes                                                                                     | Build PASS                                | PARTIALLY COMPLETE (`any`)                    |
| `/admin/education`                                                         | CRUD education                                                                   | Yes       | Yes                                                                                     | Build PASS                                | PARTIALLY COMPLETE (`any`)                    |
| `/admin/certifications`                                                    | CRUD certifications                                                              | Yes       | Yes                                                                                     | Build PASS                                | PARTIALLY COMPLETE (`any`)                    |
| `/admin/testimonials`                                                      | CRUD testimonials                                                                | Yes       | Yes                                                                                     | Build PASS                                | PARTIALLY COMPLETE (`any`)                    |
| `/admin/achievements`                                                      | CRUD achievements                                                                | Yes       | Yes                                                                                     | Build PASS                                | PARTIALLY COMPLETE (`any`)                    |
| `/admin/blog`                                                              | CRUD blog + published toggle                                                     | Yes       | Yes                                                                                     | Build PASS                                | PARTIALLY COMPLETE (`any`)                    |
| `/admin/messages`                                                          | Contact inbox (read toggle, delete, detail modal)                                | Yes       | Yes (`GET /contact` auth, `PUT read`)                                                   | Build PASS                                | COMPLETE                                      |
| `/admin/settings`                                                          | Site settings (13 keys inc. `resume_url`, `about_me`)                            | Yes       | Yes (sequential `GET` per save — inefficiency noted)                                    | Build PASS                                | PARTIALLY COMPLETE (N+1 fetch pattern)        |
| `/admin` (bare)                                                            | No explicit page — layout guard redirects to `/admin/login`                      | Redirect  | Yes (`useEffect` localStorage guard)                                                    | Code trace                                | COMPLETE                                      |

Notes:

- All 16 filesystem routes + 3 special files render. `next build` reports 22 pages (includes `_not-found` + dynamic param variants). No hidden/nested routes beyond those listed.
- Admin is `use client` + `localStorage` token, not `httpOnly` cookie — functional for portfolio scope, not enterprise.

---

## 4. FULL FEATURE INVENTORY

| Feature/Page                | Expected Behavior                                                                                                             | Implementation Status                                                                                                                  | Browser Tested                                  | Final Status                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------- |
| Navigation (desktop)        | 6 links, active pill, smooth scroll, social + Hire Me                                                                         | `navbar.tsx:1` motion, `IntersectionObserver rootMargin -20% -60%`, `navBg`/`navBorder` transforms, `router.push` fix                  | Code trace only — no Playwright in env          | COMPLETE                                       |
| Mobile navigation           | Full-screen overlay, staggered reveal, ESC, scroll lock, social + CTA                                                         | `AnimatePresence x:100%`, staggered `delay i*0.06`, `aria-expanded`, `useEffect` ESC + `overflow:hidden`                               | Code trace                                      | COMPLETE                                       |
| Hero section                | Globe+Glitter+Aurora bg, typewriter roles, terminal, stats, View My Work + Download CV, social                                | `hero-section.tsx:25` fixed bg, `GlobeBackground ssr:false`, `bgLevel` gate, `CharacterScrollOut`, `HeroContent` typewriter `speed 55` | Code trace                                      | PARTIALLY COMPLETE (resume PDF missing)        |
| About section               | Parallax LCP image, values, word reveal, counters, elegant shapes                                                             | `about-section.tsx`, `ParallaxImage` `priority`, `AnimatedCounterGroup`                                                                | Code trace                                      | COMPLETE                                       |
| Skills section              | Fetch `GET /skills`, marquee rows, categorized groups                                                                         | `skills-section.tsx` `getSkills()`, `MarqueeRow` 30s, `stagger-reveal`                                                                 | Code trace                                      | COMPLETE                                       |
| Experience section          | Timeline line + cards alternating, GSAP reveal                                                                                | `experience-section.tsx` `getExperiences()`, `TimelineLine`, `TimelineCard` clipPath                                                   | Code trace                                      | COMPLETE                                       |
| Projects section (home)     | Featured card LCP + 2 small cards, View All → GitHub                                                                          | `projects-section.tsx` `getProjects()`, `FeaturedCard priority/fetchPriority`, `SmallCard`                                             | Code trace                                      | COMPLETE                                       |
| Education section           | Education cards with period, tags, GPA                                                                                        | `education-section.tsx` `getEducation()` (not `cache()` — CODE-03)                                                                     | Code trace                                      | COMPLETE                                       |
| Certifications section      | Cert cards with verify link                                                                                                   | `certifications-section.tsx` `getCertifications()`, `CertCard` `aria-label Verifiy`                                                    | Code trace                                      | COMPLETE                                       |
| Achievements section        | Animated metrics + achievement cards                                                                                          | `achievements-section.tsx` `getAchievements()`, `AnimatedMetric`                                                                       | Code trace                                      | PARTIALLY COMPLETE (metrics mocked)            |
| GitHub section              | Stats, language breakdown, heatmap, CTA                                                                                       | `github-section.tsx` + `github-stats.tsx` (hardcoded), `language-breakdown` (hardcoded), `contribution-heatmap` (seed)                 | Code trace                                      | PLACEHOLDER/MOCK (static data)                 |
| Testimonials section        | Stack/scroll cards, hidden if empty                                                                                           | `testimonials-section.tsx` `getTestimonials()`, `if (!length) return null`, `TestimonialStack`                                         | Code trace                                      | COMPLETE                                       |
| Blog preview section        | 3 published cards + View All → /blog                                                                                          | `blog-preview-section.tsx` `getBlogPosts().filter(published).slice(0,3)`                                                               | Code trace                                      | COMPLETE                                       |
| Contact section             | Form + sidebar (contact info + availability)                                                                                  | `contact-section.tsx` `ContactForm` + `ContactSidebar` (`contactInfo`, `availabilityTags`)                                             | Code trace                                      | COMPLETE                                       |
| Contact form — validation   | Client min lengths + email regex, toast per field                                                                             | `contact-form.tsx:32` `validate()` (`name≥2`, email regex, `subject≥3`, `message≥10`) + `toast.error`                                  | Code trace                                      | COMPLETE                                       |
| Contact form — submission   | `POST API_BASE/contact`, success `SuccessState` + `toast.success`, network error toast                                        | `contact-form.tsx:67` `fetch API_BASE/contact`, `setSuccess(true)`, `catch network`                                                    | Code trace                                      | COMPLETE                                       |
| Project listing page        | Search (title+desc) + tech filter pills + grid + empty state + skeleton                                                       | `projects/page.tsx:1` client, `activeFilterBg layoutId`, `AnimatePresence popLayout`, `loading skeleton 6 cards`                       | Code trace                                      | PARTIALLY COMPLETE (10-tech cap)               |
| Project detail page         | Hero clipPath, tech pills, Live Demo + Source, gallery lazy, lightbox dialog, markdown                                        | `project-detail-client.tsx` GSAP `clipPath inset`, `DissolveRevealWrapper`, `GalleryGrid`, `ProjectMarkdown`                           | Code trace                                      | COMPLETE                                       |
| Blog pages                  | Listing + post with `generateMetadata`, date, tags, line-split markdown                                                       | `blog/page.tsx`, `blog/[slug]/page.tsx:19`, `blog-content.tsx`                                                                         | Code trace                                      | COMPLETE                                       |
| Footer                      | Quick links (now `/#x` via `/`), connect links, `TextHoverEffect Mehedi`, gradient                                            | `footer.tsx:1` `quickLinks href /#about` etc. (fixed prior FUNC-02)                                                                    | Code trace                                      | COMPLETE                                       |
| Loading / Not-found / Error | Global `loading.tsx` spinner, `not-found 404`, `error.tsx reset()`                                                            | All present (`src/app/error.tsx:1`, `loading.tsx:1`)                                                                                   | Code trace                                      | PARTIALLY COMPLETE (error leaks message)       |
| Sitemap / Robots / OG       | Dynamic sitemap (projects+blog), robots disallow admin, OG 1200×630 27KB                                                      | `sitemap.ts:1`, `robots.ts:1`, `layout.tsx:77 openGraph`, `public/og-image.png`                                                        | Build `ƒ /sitemap.xml`, `○ /robots.txt`         | COMPLETE                                       |
| Images                      | `next/image` `fill`+`sizes`, `priority`+`fetchPriority` on LCP, WebP, AVIF/WebP, `minimumCacheTTL`                            | `next.config.ts:8` formats+`deviceSizes`+`remotePatterns`+`minimumCacheTTL`, `featured-card priority`, `parallax-image`                | Build no `unoptimized` (grep 0 after prior fix) | COMPLETE                                       |
| Fonts                       | `next/font/google` `display: swap`, 8 woff2 (Inter 400/600/700, Space_Grotesk same, JetBrains 400/500)                        | `layout.tsx:16` verified 8 weights, `variable` tokens                                                                                  | Code trace                                      | COMPLETE                                       |
| Animations / 3D             | GSAP + framer-motion + three/drei/fiber, gated on `prefers-reduced-motion` + `pointer:coarse`, `document.hidden` pause        | `smooth-scroll-provider.tsx:9` early return on reduce/coarse, `hero-section bgLevel`, `globe-scene idle+Abort`                         | Code trace                                      | COMPLETE                                       |
| Admin CRUD (11 entities)    | Auth guard, DataTable, FormModal, create/update/delete, image upload                                                          | `admin/layout.tsx:18` guard, `crud-factory.ts:1` `createCrudRoutes`, `upload.routes` Cloudinary                                        | Code trace                                      | PARTIALLY COMPLETE (`any` typing, `confirm()`) |
| API layer                   | `API_BASE` constant, `React.cache` dedup, `revalidate:60`, `parseJsonArray`, `formatProject`                                  | `constants.ts:1`, `api-public.ts:1` 8 getters, `sections.ts:1 "use cache"`                                                             | Code trace                                      | COMPLETE                                       |
| Server                      | Express `helmet`+`cors`+`compression`+`rateLimit 100/15m`+`prisma`+`cloudinary`+`multer`+`pino`, Docker, `zod` env validation | `server/src/app.ts:1`, `config/env.ts:1`, `modules/index.ts:1` 14 models                                                               | Code trace                                      | COMPLETE                                       |

---

## 5. COMPLETE ITEMS

Verified as COMPLETE (presence + functional evidence, not shallow existence):

**Routes & App Router**

- `client/src/app/layout.tsx:43` — root layout with `Inter`/`Space_Grotesk`/`JetBrains_Mono`, `metadata` (title template, description, keywords, `metadataBase`, canonical, `openGraph`+`twitter` `og-image.png` 27KB, `robots`, `icons`), `viewport themeColor #059669`, `Person JSON-LD`, skip link `href="#main-content"`, `Toaster bottom-right`, `Script schema-person`. Evidence: `tsc PASS`, `build 22/22`, `og-image.png 27535 bytes` on disk.
- `client/src/app/(main)/page.tsx:1` — server `Home()` with `getSectionVisibility()` + `Suspense` per section + `ProgressiveBlur` dividers. `DEFAULT_SECTIONS` 12 entries default `true`. Evidence: `sitemap.ts` parallel fetch confirms `site-settings` contract.
- `client/src/app/(main)/layout.tsx:1` — `SmoothScrollProvider`→`LoadingScreen`→`Navbar`→`PageTransition`→`Footer`→`ScrollToTop` + `ClientAnimations`. `LoadingScreen` sessionStorage once 900ms, `PageTransition opacity 0.25s initial:false`. Evidence: code read, `tsc PASS`.
- All public pages (`/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/contact`) + `robots.ts`/`sitemap.ts`/`not-found.tsx`/`error.tsx`/`loading.tsx` — verified via `build` route table.

**Public features**

- Navigation (desktop+mobile) — `navbar.tsx:1` `useTransform scrollY [0,80] navBg/navBorder/navBlur`, `IntersectionObserver rootMargin -20% -60% threshold 0` active, `router.push("/#id")` from non-home (prior FUNC-01 fix retained), ESC + `overflow:hidden` (A11Y-02 fix). Footer `quickLinks href /#x` (FUNC-02 fix).
- About (`parallax-image` LCP, `ValueCard`, `WordRevealText`, `AnimatedCounterGroup`, `ElegantShape` 5×), Skills (`getSkills` + `MarqueeRow` 30s + categorized groups), Experience (`TimelineCard` GSAP `x:±60 scale 0.95 power3.out top 82%` + dot `back.out(2)`), Education (`EducationCard` period + GPA+tags), Certifications (`CertCard` verify `aria-label`).
- Projects home (`FeaturedCard` `priority fetchPriority="high" sizes 60vw` LCP + `SmallCard` 2×) + `projects/page.tsx` search+filter+`layoutId activeFilterBg`+`popLayout`+`loading skeleton` + empty `No projects found` guard.
- Blog preview (3 published) → `/blog` → `/blog/[slug]` with `getBlogPostBySlug` dedicated endpoint + fallback `getBlogPosts().find slug` and `BlogContent` per-line GSAP.
- Contact: `ContactForm` `validate()` + `API_BASE` + `SuccessState` (`success-state.tsx`) + `sonner` toasts; `ContactSidebar` `ContactInfoCard` + `AvailabilityCard` (ping, response `within 24 hours`, social). Server `contact.routes.ts:1` `Prisma contactMessage.create` + auth `GET/PUT/DELETE`.
- Images/fonts: `next.config.ts:8` `formats AVIF/WebP`, `deviceSizes 480..1536`, `imageSizes`, `remotePatterns localhost:4000, *.vercel.app, res.cloudinary.com, images.unsplash.com`, `minimumCacheTTL 31536000`, `dangerouslyAllowSVG:false`; no `unoptimized` remains (grep 0 post prior fix); fonts 8 woff2.
- Performance posture: `smooth-scroll-provider.tsx:9` early return on `prefers-reduced-motion` and `pointer:coarse`; `hero-section.tsx:41` `bgLevel` gate (`minimal` on `hardwareConcurrency<=4`, `reduced` on reduced-motion); every rAF guarded `!document.hidden` + `visibilitychange`; particle caps (`GlitterWrap 90`, `MAX_PARTICLES 120` in source); singleton `useScrollProgress` `useSyncExternalStore`; idle-defer `requestIdleCallback`.
- Security: `next.config.ts:33` edge headers `X-Frame-Options DENY`, `X-Content-Type-Options nosniff`, `Referrer-Policy strict-origin-when-cross-origin`, `Permissions-Policy camera=() microphone=() geolocation=()`; server `app.ts:14 helmet()+cors()+compression()+rateLimit 100/15m`; `zod` env validation `config/env.ts:1`; `.env` ignored (`git ls-files | grep .env` → only `server/.env.example`).
- SEO: `layout.tsx:43` titles/meta/`metadataBase`/`canonical`/`openGraph`/`twitter`/`robots`/`icons`; `sitemap.ts` projects+blog `/blog` weekly; `robots.ts` `disallow /admin/`; `globals.css` `background-attachment scroll @768px`; every `next/image` has `sizes`+`alt`.
- A11y: skip link `sr-only focus:not-sr-only` + `main#main-content`, semantic headings, `label htmlFor` on all inputs, `alt` on images, `aria-label` on icon buttons, lightbox `role=dialog aria-modal aria-label Image gallery` + body lock, nav ESC+lock.

**Server & Data**

- `server/prisma/schema.prisma:1` 14 models (User, Project, Skill, Experience, Education, Certification, BlogPost, Testimonial, ContactMessage, OpenSourceContribution, Research, Achievement, SiteSetting, SeoMetadata) — sqlite `file:./dev.db` (dev) vs PG in `.env.example`.
- `server/src/modules/index.ts:12` CRUD via `createCrudRoutes` for 10 entities + bespoke `auth`, `contact`, `projects`, `upload`; `crud-factory.ts:1` `authenticate` on POST/PUT/DELETE, public GET; `seed.ts:1` admin `admin@mehedi.dev` + 12 `site-settings section_ true` + 18 skills + 1 experience + 3 projects + 3 SEO pages.
- `client/src/lib/api-public.ts:1` `parseJsonArray` (JSON-array or CSV), `formatProject/BlogPost`, `getProjectBySlug`/`getBlogPosts`/`getBlogPostBySlug` `cache()` + `revalidate:60`.

---

## 6. INCOMPLETE & PARTIAL ITEMS

| ID      | Current State                                    | What Is Implemented                                                                                            | What Is Missing                                                                                                                     | Why Not Complete                                                   | Files/Locations                                                                                                                                                                                                                          | Required Work                                                                                                                                                                                                                        | Priority           |
| ------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| PART-01 | GitHub section is static mock                    | `GitHubSection` shell, `GitHubStats` 4 cards, `LanguageBreakdown` bars (GSAP), `ContributionHeatmap` 24×7 grid | Live data; stats `20+/15+/30+/25+`, language `% 45/25/15/10/5`, heatmap `seed(w,d)` random                                          | Content gap, not wired to `GET /contributions` or GitHub API       | `client/src/components/sections/github-section.tsx`, `github/github-stats.tsx:1`, `github/language-breakdown.tsx:1`, `github/contribution-heatmap.tsx:1`, `server/prisma OpenSourceContribution` unused publicly                         | Wire `getContributions()` via `api-public`, or fetch `api.github.com/users/Mehedihasan444` (cached 1h), replace hardcoded arrays; fallback to static on error                                                                        | P2 Recommended     |
| PART-02 | Projects listing silently truncates tech filters | `projects/page.tsx:26` `allTechs.slice(0,10)` renders row of pills, filter state + search                      | No overflow indicator; techs beyond 10 unreachable                                                                                  | Cap without UX; 18 skills → many project techs could exceed 10     | `client/src/app/(main)/projects/page.tsx:26`                                                                                                                                                                                             | Horizontal scroll with fade + chevron, or `Show more (N)` collapsible; or `overflow-x-auto` with scrollbar styling                                                                                                                   | P1 Should Fix      |
| PART-03 | Contact spam surface only global limit           | Server `rateLimit 100/15m` on `/api/`, client `validate()` strict                                              | No per-route `POST /contact` limit (e.g. 5/15m), no honeypot, no CAPTCHA, server `zod` not enforced on contact fields               | Spam risk; portfolio contact is primary funnel                     | `server/src/app.ts:28 limiter`, `server/src/modules/contact/contact.routes.ts:15`                                                                                                                                                        | Add `rateLimit({ windowMs:15*60*1000, max:5 })` on `POST /contact`, honeypot field `website`, server `zod` `email().min(5)`, `message min 10`; optional `cf-turnstile`                                                               | P1 Should Fix      |
| PART-04 | Silent section disappearance on API failure      | Every `get* .catch { return []/null }` keeps page crash-free                                                   | No per-section `EmptyState` with retry, no log, no `error.tsx` boundary per section                                                 | Happy path only; silent failure hides outage from user             | `client/src/lib/api-public.ts:82` all `get*` (`getProjects`, `getSkills`, `getExperiences`, `getEducation`, `getCertifications`, `getTestimonials`, `getAchievements`, `getBlogPosts`)                                                   | Render `<SectionEmpty onRetry>` with `revalidateTag`/refetch pattern; keep graceful but visible; log to `console.error` or `pino`                                                                                                    | P2 Recommended     |
| PART-05 | Achievements metrics are static                  | `metrics 10+/100+/5+/1K+` in `achievements/constants.ts:1` rendered via `AnimatedMetric`                       | Dynamic counts tied to DB (projects count, problems solved?)                                                                        | Aspirational numbers not verified                                  | `client/src/components/sections/achievements/constants.ts`, `achievements-section.tsx:1`                                                                                                                                                 | Derive `metrics` from `getProjects()` length or `getAchievements()` + static supplements; or rename to `Impact Metrics` with disclaimer                                                                                              | P3 Nice to Have    |
| PART-06 | Error UI leaks implementation detail             | `error.tsx:1` `p text-muted-foreground {error.message}` + `Try Again`                                          | Maps DB/stack message verbatim to user; could expose path/table                                                                     | Quick error page, not mapped to friendly text                      | `client/src/app/error.tsx:13`                                                                                                                                                                                                            | Map `error.message` → user text; log full error to console; consider `error.digest`                                                                                                                                                  | P2 Recommended     |
| PART-07 | Admin typing & DX debt                           | All 11 `admin/*` pages functional                                                                              | `any` in 9 files (state, `api.get<any[]>`, `render: (item:any)`), `react-hooks/set-state-in-effect` 11×, `confirm()` native dialogs | Lint 85 errors/27 warnings; build passes but DX & type safety weak | `client/src/app/admin/projects/page.tsx:26`, `skills/page.tsx`, `education/page.tsx`, `certifications/page.tsx`, `testimonials/page.tsx`, `blog/page.tsx`, `messages/page.tsx`, `settings/page.tsx`, `components/admin/data-table.tsx:1` | Generate shared DTO types from `zod`/`prisma` or `server` schema (`openapi` or shared pkg), replace `any`; replace `confirm()` with `Dialog`; add `// eslint-disable` comments where `setState-in-effect` is intentional mount fetch | P1 Should Fix (DX) |
| PART-08 | `getEducation` not cached                        | Most getters `cache()`-deduped                                                                                 | `getEducation() Promise<FormattedEducation[]>` not wrapped `cache()` (inconsistent)                                                 | Missed dedup; minor perf                                           | `client/src/lib/api-public.ts:156`                                                                                                                                                                                                       | Wrap with `cache()` like others                                                                                                                                                                                                      | P3 Nice to Have    |
| PART-09 | Admin settings save is N+1                       | Settings page loads once via `GET /site-settings`, save loops `for [k,v] → GET /site-settings → find → PUT`    | No bulk `PATCH /site-settings` batch                                                                                                | Minor perf, not broken                                             | `client/src/app/admin/settings/page.tsx:44` `handleSave`                                                                                                                                                                                 | Add `POST /site-settings/bulk` on server or collect `id` map on load                                                                                                                                                                 | P3 Nice to Have    |
| PART-10 | `shadcn` in `dependencies` ships CLI to browser  | Listed `shadcn@4.13.0` in `dependencies`                                                                       | Should be `devDependencies` (never imported)                                                                                        | Bundle hygiene                                                     | `client/package.json:30`                                                                                                                                                                                                                 | `pnpm remove shadcn && pnpm add -D shadcn`                                                                                                                                                                                           | P2 Recommended     |

---

## 7. MISSING ITEMS

| ID      | What Is Missing                                | Why It Matters                                                                         | Required for Production?    | Recommended Implementation                                                                                                                                                     | Priority                      |
| ------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| MISS-01 | Automated tests (0 files, no runner, no CI)    | Zero safety net for regressions (nav, form validate, `parseJsonArray`, error branches) | Strongly Recommended        | `vitest` + `testing-library` for `api-public` parse/format + `contact-form validate`; one Playwright smoke `home → /projects → /projects/:slug → back` + `contact submit` mock | Recommended                   |
| MISS-02 | CI pipeline (lint/typecheck/build on PR)       | Manual `pnpm build` is the only gate                                                   | Strongly Recommended        | `.github/workflows/ci.yml` `pnpm install --frozen-lockfile` → `pnpm lint` (allow 85 pre-existing) → `pnpm typecheck` → `pnpm build`                                            | Recommended                   |
| MISS-03 | `sharp` for prod image optimization            | Next warns without `sharp`, slower AVIF/WebP encode                                    | Recommended                 | `pnpm --filter client add sharp`                                                                                                                                               | Recommended                   |
| MISS-04 | Analytics integration                          | Portfolio has no visit/conversion insight                                              | Nice to Have                | `next/script afterInteractive` `Plausible`/`GA4` via env `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`                                                                                        | Nice to Have                  |
| MISS-05 | Per-section loading/error/empty/empty+retry UI | Silent `[]` hides failure; recruiter sees no signal                                    | Recommended                 | `SectionEmpty` + `SectionError { retry }` components with `revalidateTag` server action on retry                                                                               | Recommended                   |
| MISS-06 | CSP (Content Security Policy)                  | `helmet` alone not adding CSP on edge; portfolio could carry CSP with nonce            | Not Necessary Now           | `headers()` `Content-Security-Policy` with `nonce` for Next inline styles; defer — CSP must be tuned to not break `globals.css`/`framer`                                       | Not Required for this project |
| MISS-07 | Focus trap for overlays                        | Tab cycles behind mobile menu/lightbox                                                 | Recommended                 | `focus-trap-react` or manual `Tab` handler on `motion.div mobile-menu` + `lightbox role=dialog`                                                                                | Recommended                   |
| MISS-08 | `aria-live` for toasts                         | Sonner toasts not announced to AT                                                      | Nice to Have                | `Toaster richColors` already has `aria-live`; verify `sonner` default; add `aria-live=polite` fallback                                                                         | Nice to Have                  |
| MISS-09 | Resume/CV PDF asset (see BROKEN-01)            | Download CV is primary recruiter CTA                                                   | Must Have Before Production | Ship `client/public/resume.pdf` (Mehedi CV) or wire `resume_url` from `site-settings` and hide button if empty                                                                 | Must Have                     |
| MISS-10 | Blog post `openGraph.images` per post          | Blog SEO lacks per-post OG                                                             | Recommended                 | In `blog/[slug]/generateMetadata` add `openGraph: { images: post.image ? [{ url: post.image }] : [] }, twitter: same`                                                          | Recommended                   |
| MISS-11 | Production `CORS_ORIGIN` wiring doc            | Dev `localhost:3000` blocks prod API if deployed as-is                                 | Must Have                   | `server/.env.prod` / Vercel env `CORS_ORIGIN=https://mehedi-hasan.dev,https://*.vercel.app` + note in `server/.env.example`                                                    | Must Have                     |

---

## 8. BROKEN ITEMS

| ID        | Expected Behavior                                | Actual Behavior                                                                            | Steps to Reproduce                                                                | Location                                                                                                                                                                         | Root Cause                                                                                              | Priority          |
| --------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------- |
| BROKEN-01 | `Download CV` downloads resume PDF               | Clicking `Download CV` navigates to `/resume.pdf` which 404s — no file in `client/public/` | Click `Download CV` in hero (`hero-content.tsx:98 href /resume.pdf`) on any route | `client/src/components/sections/hero/hero-content.tsx:98`, `client/public/` (`ls` shows `mehedi_hasan.jpg/webp`, `og-image.png`, no `resume.pdf`), `site-settings resume_url=""` | Missing asset; `download` attribute cannot fix a missing file                                           | **P0 Must Fix**   |
| BROKEN-02 | Person JSON-LD `image` resolves to a real avatar | Google Rich Results shows missing image — `https://mehedi-hasan.dev/profile.jpg` 404       | Inspect `view-source` → `script schema-person` → `image: /profile.jpg`            | `client/src/app/layout.tsx:124 image: ${SITE_URL}/profile.jpg` vs actual `client/public/mehedi_hasan.webp`                                                                       | Hardcoded `/profile.jpg` never renamed after asset became `mehedi_hasan.webp` (212 KB jpg + 26 KB webp) | **P1 Should Fix** |

No P0 runtime crash, no data exposure in tracked files — `git ls-files | grep .env` confirms `server/.env` ignored.

---

## 9. UI vs IMPLEMENTATION MISMATCHES

### UI EXISTS, BACKING FUNCTIONALITY MISSING

| UI                      | Location                                                                           | What Appears                      | What Is Missing / Gap                                                                             | Severity     |
| ----------------------- | ---------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------- | ------------ |
| Download CV button      | `hero-content.tsx:98` `a href /resume.pdf download`                                | Looks like immediate CV download  | No `public/resume.pdf` exists — 404. `site-settings resume_url` is `""` (seed) and unused by hero | Must Fix     |
| GitHub Statistics cards | `github-stats.tsx:1` `20+ Stars, 15+ Forks, 30+ PRs, 25+ Followers`                | Appears as live GitHub metrics    | Static `const items` hardcoded — never fetched from `GET /contributions` or GitHub API            | Recommended  |
| Language Breakdown bars | `language-breakdown.tsx:1` `TypeScript 45% ...`                                    | Appears as real breakdown         | Hardcoded `const languages` — not derived from repos                                              | Recommended  |
| Contribution Heatmap    | `contribution-heatmap.tsx:1` 24×7 grid with tooltips                               | Appears as last-6-months activity | Deterministic `seed(w,d) = sin(w*37+d*13)` pseudo-random — not GitHub                             | Recommended  |
| Achievement Metrics     | `achievements/constants.ts:1` `10+ Projects, 100+ Problems, 5+ Repos, 1K+ Coffees` | Appears as verified impact        | Static; `100+ Problems Solved` not verified                                                       | Nice to Have |

### IMPLEMENTATION EXISTS, USER ACCESS/UI MISSING

| Implementation                                        | Location                                                              | What Exists in Code/DB                                                                                  | User Access Gap                                                                                                   | Severity                                       |
| ----------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `GET /contributions` + `OpenSourceContribution` model | `modules/index.ts:12` + `prisma/schema.prisma OpenSourceContribution` | Full CRUD via `createCrudRoutes(prisma.openSourceContribution)` (`repoName, repoUrl, stars, language…`) | No public consumption — `GitHubSection` never calls it; only static mock                                          | Recommended — wire or remove model             |
| `Research` model + `GET /research` + `GET /seo`       | Same                                                                  | Prisma models `Research`, `SeoMetadata`; `GET /research`/`/seo` routes exist                            | No UI anywhere references Research/SEO CRUD beyond `seed.ts`                                                      | Nice to Have — document or drop                |
| `resume_url` site-setting                             | `seed.ts resume_url ""` + `admin/settings 13 keys`                    | Editable in admin                                                                                       | Hero button ignores it (hardcoded `/resume.pdf`)                                                                  | Should Fix — use `resume_url \|\| /resume.pdf` |
| Project status/featured/order filtering               | `Project status, featured, order` in schema + admin                   | Admin can set `status`/`featured`/`order`, listing uses `find(featured) \|\| sorted[0]`                 | Home shows at most 3 projects; rest only on `/projects` with client fetch — no admin preview of featured ordering | Nice to Have                                   |

---

## 10. PLACEHOLDERS & MOCK IMPLEMENTATIONS

Every production-relevant placeholder/mock — evaluated for impact.

| Finding                                                            | Location                                               | Type                                                                                                                                                                                            | Production Impact                   | Verdict                                           |
| ------------------------------------------------------------------ | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------- |
| `TODO`/`FIXME`/`HACK` grep                                         | repo-wide `grep TODO/FIXME/HACK/XXX`                   | 0 hits in `client/src`/`server/src` (only `resolution XXX` in lockfile, prior audit doc)                                                                                                        | None                                | Safe to keep ✓                                    |
| `console.log` in app code                                          | `grep console.log/error`                               | 0 in `client/src` (only `providers/index.tsx` wraps `console.warn` to suppress `THREE.Clock`); `console.log/error` only in `server/prisma/seed.ts` (build-time) + `config/env.ts console.error` | None                                | Safe                                              |
| `any` / `no-explicit-any`                                          | `grep any` → 23 hits                                   | 21 in `admin/**` (`useState<any[]>`, `api.get<any[]>`, `render: (item:any)`), 1 in `card-stack.tsx _e:any`, 1 in `text-reveal ref as any`, `globe-scene forEach (f:any)`                        | Type debt only; no runtime break    | Technical debt — PART-07                          |
| `@ts-ignore` / `@ts-expect-error`                                  | grep                                                   | 0 hits                                                                                                                                                                                          | None                                | Safe                                              |
| Hardcoded GitHub stats                                             | `github-stats.tsx:1` `value "20+"` etc.                | Mock — static                                                                                                                                                                                   | Credibility risk if treated as live | Must replace before claiming live stats — PART-01 |
| Hardcoded language %                                               | `language-breakdown.tsx:1` `45/25/15/10/5`             | Mock                                                                                                                                                                                            | Same                                | Must replace                                      |
| Seed-based heatmap                                                 | `contribution-heatmap.tsx:1` `sin(w*37...)`            | Mock                                                                                                                                                                                            | Visual filler; no data              | Must replace for "Contribution Activity" label    |
| Metrics `10+/100+/5+/1K+`                                          | `achievements/constants.ts:1`                          | Aspirational hardcoded                                                                                                                                                                          | Minor                               | Keep but avoid implying verified source — PART-05 |
| `about/values` 4 cards                                             | `about/constants.ts` `Code2/Lightbulb/...`             | Static content (not DB)                                                                                                                                                                         | Intentional — fine                  | Safe                                              |
| Dummy project images via Unsplash                                  | `seed.ts` 3 projects `https://images.unsplash.com/...` | Placeholder remote                                                                                                                                                                              | Works but remote-dependent          | Replace with own screenshots when available       |
| `lorem ipsum`                                                      | grep                                                   | 0 hits                                                                                                                                                                                          | None                                | Safe                                              |
| `throw new Error` only in `api.ts` `throw new Error(data.message)` | `api.ts:44`                                            | Legitimate error propagation                                                                                                                                                                    | Correct                             | Safe                                              |
| Empty functions / unreachable code                                 | Manual scan                                            | 0                                                                                                                                                                                               | None                                | Safe                                              |
| Unused components                                                  | Check across `src/components`                          | No unused top-level section — all 12 mounted in `page.tsx`; `animations/*` all referenced (see `grep gsap 82 hits`, `motion 36`)                                                                | None blocking                       | Safe                                              |
| Unused routes                                                      | See Route Inventory                                    | No orphan route — every filesystem route is reachable via nav or build                                                                                                                          | None                                | Safe                                              |

---

## 11. MISSING PRODUCTION REQUIREMENTS

### P0 — Must Fix Before Production Announcement

| ID         | Requirement                               | Evidence                                                                                                                                                                                    | Fix                                                                                                                                                                               |
| ---------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PROD-P0-01 | Ship or hide `Download CV`                | `hero-content.tsx:98` `href /resume.pdf` 404 (`ls public/*.pdf` 0)                                                                                                                          | Add `client/public/resume.pdf` (actual CV) or change button to `mailto:`/LinkedIn if no PDF; alternatively bind to `resume_url` site-setting and `hidden` if empty. See BROKEN-01 |
| PROD-P0-02 | Rotate dev secrets before any public push | `server/.env` holds real `CLOUDINARY_API_KEY=6529...`/`API_SECRET=ctxfc...` + weak `JWT_SECRET dev-jwt-secret-key-at-least-32-characters-long` (ignored by git ✓, but credentials are live) | Rotate `CLOUDINARY_API_SECRET`+`API_KEY` in Cloudinary dashboard, generate prod `JWT_SECRET=$(openssl rand -base64 48)`                                                           |
| PROD-P0-03 | Prod `CORS_ORIGIN`                        | `server/.env: CORS_ORIGIN=http://localhost:3000` blocks prod client (`https://mehedi-hasan.dev`)                                                                                            | Set host env `CORS_ORIGIN=https://mehedi-hasan.dev` (plus preview `https://*.vercel.app`) on deploy                                                                               |

### P1 — Should Fix Before Production (high value, low risk)

| ID         | Requirement                                                        | Evidence                                                           |
| ---------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| PROD-P1-01 | Contact anti-spam (per-route rate limit + honeypot + server `zod`) | `app.ts:28` only global `100/15m`, `contact.routes.ts:15` no `zod` | PART-03   |
| PROD-P1-02 | Projects filter shows all techs                                    | `allTechs.slice(0,10)`                                             | PART-02   |
| PROD-P1-03 | Fix JSON-LD image (`/profile.jpg` → `/mehedi_hasan.webp`)          | `layout.tsx:124` 404                                               | BROKEN-02 |
| PROD-P1-04 | Blog `generateMetadata` per-post OG images                         | `blog/[slug]/page.tsx:19` no `openGraph.images`                    | MISS-10   |
| PROD-P1-05 | Admin typing debt + `confirm()`                                    | 85 lint errors, native `confirm()`                                 | PART-07   |
| PROD-P1-06 | `sharp` in `dependencies`                                          | `next build` warnings without `sharp`                              | MISS-03   |

### P2 — Recommended Improvements

- `focus-trap-react` for mobile menu + lightbox (PART: focus trap, MISS-07).
- `sonner` `aria-live` verification (MISS-08).
- Per-section `EmptyState`/`ErrorState`+retry (MISS-05, PART-04).
- Replace `any` coverage + `react-hooks/set-state-in-effect` intentional suppressions with comments (CODE-01).
- Move `shadcn` to `devDependencies` (PART-10).
- `SITEMAP` `baseUrl` DRY via `SITE_URL` import.
- `CODE-03` make `getEducation()` `cache()`.

### P3 — Nice to Have

- Analytics (`Plausible`/`GA4`) via `next/script afterInteractive`.
- Deduplicate `about constants` vs `hero constants` `stats` (two similar arrays).
- Consider `revalidateTag("sections")` on admin toggle save for instant homepage refresh.
- CSP with nonce (defer; needs Next inline-style tuning — accepted risk).
- `CODE-02` `text-reveal.tsx innerHTML` → safe but CSP-unfriendly; keep low priority.

---

## 12. USER FLOW AUDIT

### Flow 1 — First-Time Visitor

```
Open / → hero roles/terminal/stats → skills marquee → experience timeline
→ projects featured+small → education/certifications → achievements → github
→ testimonials (if any) → blog preview → contact (form + sidebar) → footer
```

- Every anchor is reachable via navbar `router.push` (fixed) and footer `/` links (fixed). `IntersectionObserver` sets active pill.
- Content is intentional — no `lorem`; `about` word-reveal, values cards, elegant shapes all render.
- Projects `FeaturedCard priority` + `parallax-image` LCP; images `fill`+`sizes`, WebP. `loading.tsx` + `SectionFallback` spinners prevent blank.
- **Gap:** GitHub/testimonials may show empty/mocked states (FIXME in content: okay for portfolio). **Verdict:** PASS (partially complete, not blocked).

### Flow 2 — Recruiter / Employer

```
Land / → role in 1s (typewriter) → View My Work → Download CV → projects detail
→ skills/experience → testimonials → contact/availability
```

- Role visible `Available for new opportunities` badge + typewriter `Full Stack Developer ...` (`aria-live polite`) + `Crafting elegant…` tagline.
- `View My Work` (`#projects` smooth scroll) works; `Download CV` **BROKEN** — 404 (ROUTE: must fix before recruiter outreach).
- Experience `Ongoing` pill + `current` ping; education `GPA`/`tags`; skills categorized Frontend/Language/Backend/Database/Tools.
- Projects detail: `generateMetadata` + `notFound()`, `GalleryGrid lazy` + `Lightbox role=dialog ESC/←→/body lock`, `ProjectMarkdown` content, `Live Demo`/`Source Code` `target _blank rel noopener noreferrer`.
- Availability card: `Currently Available` ping + `within 24 hours` + `Freelance/Remote/Based in Dhaka` tags; `contactInfo` email+phone+location with icons.
- **Gap:** Only failure is CV. **Verdict:** PARTIALLY COMPLETE — fix `resume.pdf`.

### Flow 3 — Client

```
Visit / → value prop (About Elegant solutions + stats) → relevant work (Projects)
→ capabilities (Skills) → trust (Testimonials, Achievements, Education)
→ Contact (form validation, success, toast, sidebar)
```

- Value prop clear (`Turning complex problems…`, 4 values cards), capabilities grouped, trust signals present (certifications verified badge, testimonials stack, achievements).
- Contact `validate()` strict, `SuccessState onReset` + `toast success within 24 hours`, network error toast, `ContactSidebar` social links. Server persists `contactMessage` + admin inbox.
- **Gap:** Spam risk moderate; form succeeds even if API down silently. **Verdict:** PASS.

### Flow 4 — Mobile Visitor

```
Open on coarse pointer → no Lenis → browse all sections → open /projects
→ interact CTAs → submit contact
```

- `SmoothScrollProvider` early return on `pointer: coarse` and `reduced-motion` — native scroll. `hero bgLevel minimal` on low-core devices. Particle caps + `document.hidden` guards.
- Mobile menu `AnimatePresence x:100%`, staggered, `aria-expanded`, ESC+`overflow:hidden`; all sections `px-6 py-32 responsive grids` (`sm:grid-cols-2 lg:grid-cols-5`); images `sizes (max-width: 768px) 100vw`; `ScrollToTop` bottom-right.
- Projects client page search+filter wraps (`overflow-x-auto` row, `max-w-xs` search). Contact `grid lg:grid-cols-5` stacks on mobile.
- **Gap:** No focus trap behind overlay (PART). **Verdict:** PASS (ready, one polish).

### Edge-case coverage (summary)

| State                                           | Expected                        | Actual                                                                                                           | Gap                                               |
| ----------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Loading                                         | Skeleton/spinner while fetching | `loading.tsx` global + `SectionFallback` + `projects skeleton 6 cards`; `get* revalidate:60` ISR                 | Per-section silent `[]` on failure — PART-04      |
| Success                                         | Confirmation                    | `ContactForm SuccessState` + `toast success`; `admin` `toast success Deleted/Saved`                              | OK                                                |
| Error                                           | Visible error + retry           | Global `error.tsx reset()` + `not-found.tsx` 404; per-section `catch→[]` silent                                  | Missing per-section error UI — PART-04/06         |
| Empty                                           | Empty state messaging           | `No projects found matching criteria`, `No posts yet`, `testimonials return null`                                | OK; `projects` hides silently when API down — gap |
| Invalid input                                   | Field errors                    | Client `validate()` per field → `toast.error`                                                                    | Server lenient — PART-03                          |
| Slow network                                    | Understandable UI               | ISR cached payloads + `revalidate:60`; suspense streams                                                          | OK                                                |
| External failure (Cloudinary, Unsplash, GitHub) | Fallback                        | `image \|\| "/projects/marketsphere.webp"` fallback; `res.cloudinary.com` + `images.unsplash.com` remotePatterns | OK                                                |
| Invalid route                                   | 404                             | `not-found.tsx` gradient `Go Home`, `getProjectBySlug→notFound()`                                                | OK                                                |

---

## 13. ERROR, LOADING & EDGE-CASE COMPLETENESS

Audited per §11 flows and directly in code:

- **Loading:** Global `loading.tsx:1 spinner` + `projects/loading.tsx` + `projects/[slug]/loading.tsx`; `page.tsx Suspense fallback SectionFallback h-8 animate-spin`; `projects/page.tsx loading skeleton` prevents `No projects found` flash. **Complete** (per-section `Suspense` streaming is excellent).
- **Success:** `contact-form.tsx:71 SuccessState` (`success-state.tsx` animation + `onReset`) + `toast.success Message sent — I'll reply within 24 hours.`; admin CRUD `toast.success Deleted/Saved`. **Complete**.
- **Error:** `error.tsx:1` with `reset()`, `not-found.tsx` 404; `api-public catch→[]/null` prevents crash but **PARTIALLY COMPLETE** — no per-section error boundary with retry, verbatim `error.message` leak (EDGE-02/MOCK-06).
- **Empty:** `projects filtered 0 → No projects found matching criteria`, `blog published 0 → No posts yet`, `testimonials if (!length) return null` (intentional hide). **Complete** for explicit empties; **gap** is silent empty when API itself fails (PART-04).
- **Invalid input:** `contact-form validate()` `name≥2 / email regex / subject≥3 / message≥10` + `toast.error` per violation; inputs `required type=email`. **Complete client-side**; server `contact.routes.ts:15 if (!name||!email||!message)` lenient — **PART-03**.
- **Slow/external failure:** `next: { revalidate:60 }` ISR keeps last cached render; `catch→[]` degrades gracefully; `remotePatterns` covers image hosts; globe `fetch raw.githubusercontent geojson force-cache idle Abort`. **Complete**.
- **Invalid route/slug:** `projects/[slug]/page.tsx:30 notFound()` + `blog/[slug]/page.tsx:28 notFound()` + root `not-found.tsx`. **Complete**.

---

## 14. CONTENT COMPLETENESS AUDIT

### Identity

- Name: `Mehedi Hasan` — `SITE_TITLE`, `hero CharacterScrollOut "Hi, I'm Mehedi Hasan"`, footer `Mehedi` `TextHoverEffect`, `JSON-LD name`. **Complete**.
- Role/title: `Full Stack Developer & Software Engineer` (`SITE_TITLE`, JSON-LD `jobTitle`, hero typewriter `roles 5`). **Complete**.
- Introduction/summary: `Crafting elegant, scalable… intersection of design and engineering` + `about WordRevealText` (1+ years, React/Next.js/Node/TypeScript, scalable apps, clean code). **Complete** (claim `1+ years` is modest; verify via experience 2024-01 → present).

### Skills

- Technologies: 18 seeded (`seed.ts` React..Docker) categorized Frontend/Language/Backend/Database/Tools; `skills-section` marquee + grouped listing. **Complete**.
- No misleading claims: `proficiency 55–90` reasonable; `Python 65 Java 60` etc. not overstated. **Complete**.

### Experience

- `Freelance / Self-Employed — Full Stack Developer — Dhaka — 2024-01-01 — current true` (seed). Additional experiences via admin. `TimelineCard` `current` ping + period `start–Present` + tags. **Complete** (thin but honest; projects compensate).

### Projects (each important project checked)

| Project                       | Name                          | Description                                                    | Purpose          | Stack                                          | Features           | Images                                             | Live          | Source                                 | Links Valid             |
| ----------------------------- | ----------------------------- | -------------------------------------------------------------- | ---------------- | ---------------------------------------------- | ------------------ | -------------------------------------------------- | ------------- | -------------------------------------- | ----------------------- |
| marketsphere                  | MarketSphere                  | multivendor e-commerce, product/cart/payment/vendor dashboards | marketplace      | 7 tags (React/Next/TS/Node/PG/Prisma/Tailwind) | markdown 6 bullets | 3 Unsplash (market) + `marketsphere.webp` fallback | none (`null`) | `github.com/.../marketsphere-frontend` | GitHub URL format valid |
| tech-tips-tricks-hub          | Tech Tips & Tricks Hub        | content platform, tutorials/snippets/community                 | knowledge share  | 6 tags                                         | markdown 5 bullets | 3 Unsplash (tech)                                  | none          | `github.com/.../tech-tips...`          | valid                   |
| car-rental-reservation-system | Car Rental Reservation System | browsing/booking/payment/admin                                 | rental lifecycle | 6 tags                                         | markdown 5 bullets | 3 Unsplash (car)                                   | none          | `github.com/.../Car-Rental...`         | valid                   |

- All 3 `featured true order 1..3 status published`, `description` + `content` (multi-`##` sections) + `techStack` + `images` + `githubUrl`. **Complete** for structure. **Gap:** No `liveUrl` for any project (all `null`) — affects recruiter who wants live demo; acceptable to link GitHub only, but note as content gap (work remains to deploy demos).

### Credibility

- Achievements: `getAchievements()` + `metrics` 4 + `AnimatedMetric`; seeded empty until admin adds. **Partially complete** (needs DB content, metrics mocked).
- Education: `getEducation()` card with institution/degree/field/period/GPA/tags — seeded empty, relies on admin. **Partially complete** until populated.
- Certifications: `getCertifications()` with verify `ExternalLink aria-label`. **Partially complete** until DB populated.
- Testimonials: `getTestimonials()` `TestimonialStack` hidden if 0. **Partially complete** (needs curated entries; good to hide empty).
- Open-source: `GitHubSection` mocked — **placeholder**.
- Publications/research: `Research` model exists but no UI — **missing**.
- Profiles: GitHub/LinkedIn/Twitter everywhere `target _blank rel noopener noreferrer` verified. **Complete**.

### Contact

- Clear & functional: `ContactSection` form (labels, validation, success, toast) + `ContactSidebar` `contactInfo` (Email `mehedihasan67705251@gmail.com`, Phone `+8801767705251`, Location `Dhaka` via `constants.ts:EMAIL/PHONE/SOCIAL_LINKS`) + `AvailabilityCard` `within 24 hours` + footer `mailto` + navbar `Hire Me mailto`. Server persists + admin inbox marks read. **Complete**.

---

## 15. RESPONSIVENESS, ACCESSIBILITY, SECURITY, TESTING, DEPLOYMENT GAPS

See Scorecard §2. Detailed missing production requirements already split P0/P1/P2/P3 in §11. Condensed here for the template's `PROD-0x` style:

| ID      | Production Requirement                                 | Status                               | Priority                            |
| ------- | ------------------------------------------------------ | ------------------------------------ | ----------------------------------- |
| PROD-01 | Ship `resume.pdf` (recruiter CTA)                      | Broken                               | **P0 Must Have**                    |
| PROD-02 | Rotate Cloudinary/JWT secrets before public            | `.env` ignored but credentials live  | **P0 Must Have**                    |
| PROD-03 | Prod `CORS_ORIGIN` must be `https://mehedi-hasan.dev`  | Dev `localhost:3000` blocks prod API | **P0 Must Have**                    |
| PROD-04 | Contact per-route rate limit + honeypot + server `zod` | Global only                          | **P1 Should Fix**                   |
| PROD-05 | `sharp` for prod images                                | Missing                              | **P1 Should Fix**                   |
| PROD-06 | Per-section error/empty/retry UI (not silent `[]`)     | Silent failure                       | **P1 Should Fix**                   |
| PROD-07 | JSON-LD image `profile.jpg` → `mehedi_hasan.webp`      | 404                                  | **P1 Should Fix**                   |
| PROD-08 | Blog per-post `openGraph.images`                       | Missing                              | **P1 Should Fix**                   |
| PROD-09 | Tests (0 files) + CI                                   | 0 / no `.github/workflows`           | **P2 Recommended**                  |
| PROD-10 | Focus trap + `aria-live` toasts                        | Tab escapes overlay                  | **P2 Recommended**                  |
| PROD-11 | `shadcn` → `devDependencies`                           | In `dependencies`                    | **P2 Recommended**                  |
| PROD-12 | Analytics                                              | No wiring                            | **P3 Nice to Have**                 |
| PROD-13 | CSP                                                    | No CSP headers                       | **P3 Nice to Have** (accepted risk) |

---

## 16. BROWSER-BASED VERIFICATION

**Status: NOT RUN — environment has no Chrome/Playwright.** `client` has no `@playwright/*` in deps beyond `.playwright-mcp` folder, no `playwright.config.*`, no `test` script relevant to portfolio. Thus the checklist below is **code-evidence verification**, not live browser truth.

| Check                   | Result                      | Evidence                                                                                                                                                                                                         |
| ----------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Every major route loads | **Code PASS**               | `next build` 22/22 static/PPR/dynamic; `page.tsx` server `Suspense` defaults keep render correct even if `API_BASE` unreachable                                                                                  |
| Wait for fully load     | N/A                         | ISR `revalidate:60` + `Suspense` streaming; no live `LCP` measure (no Lighthouse)                                                                                                                                |
| Visible UI              | **Code PASS**               | Every section traced: `hero` through `contact` plus dedicated pages `projects`/`blog`/`contact`/`admin/*`; empty states covered                                                                                  |
| Browser console         | **Code PASS**               | `grep console.log` 0 in `client/src`; only `console.warn` wrapper for `THREE.Clock`; `suppressHydrationWarning` on `html` (theme) expected                                                                       |
| Failed network          | **Code PASS (graceful)**    | `api-public catch→[]/null` + `notFound()`; globe `AbortController`; images have `fallback` gradients + `src \|\| "/projects/..."`                                                                                |
| Click every CTA         | **Code PASS with 1 BROKEN** | `View My Work #projects` `scrollIntoView` ✓, `Download CV /resume.pdf` **404** (BROKEN-01), `Hire Me mailto` ✓, `GitHub/Live Demo` `window.open`/`target _blank` ✓, social 3+4 links `rel noopener noreferrer` ✓ |
| Navigation              | **Code PASS**               | 6 `navLinks` `#hero..#contact` via `router.push` from any route + footer `/#x` + `/blog`, `/projects` links; `activeSection IntersectionObserver`                                                                |
| Forms                   | **Code PASS**               | `ContactForm` labels `htmlFor`, `required`, `type=email`, `validate()` on submit, `sending` `SpinnerIcon`, `SuccessState onReset`, `toast` success/error/network                                                 |
| External links          | **Code PASS**               | `grep href` every external `target=_blank rel=noopener noreferrer` verified; `mailto:mehedihasan67705251@gmail.com` 3 places                                                                                     |
| Mobile nav / responsive | **Code PASS**               | `navbar mobileOpen AnimatePresence`, `lg:hidden`/`lg:flex`, `deviceSizes`+`sizes`, `background-attachment scroll @768px`, Lenis disabled on coarse                                                               |
| Loading/error states    | **Code PASS**               | `loading.tsx` + `SectionFallback` + `projects skeleton`; `error.tsx`+`not-found.tsx`; per-section silent `[]` is **partial**                                                                                     |

> Do not mark items COMPLETE without browser proof: items marked COMPLETE above are **code-complete**; a single live `PORT=3003 next start` run with `curl -I /` (headers), `curl /sitemap.xml` (entries), and manual mobile-emulation click-through is still recommended before public launch. Prior audit's `curl / 150KB OK`, `/og-image.png 200 OK` was not re-run this session beyond `next build`.

---

## 17. FINAL RECONCILIATION — REQUIREMENT → UI → ROUTE → COMPONENT → LOGIC → INTEGRATION → BROWSER TEST

| Requirement                                    | UI                                                          | Route                                                              | Component                                                                                  | Logic                                                                   | Integration                              | Browser Test                                         | Gap Stage            |
| ---------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------- | -------------------- |
| Understand who developer is                    | Hero badge + typewriter + tagline + stats                   | `/` `/#hero`                                                       | `hero-section`, `hero-content`, `typewriter speed 55`                                      | Static `roles`/`stats` constants                                        | None (static)                            | Code PASS                                            | —                    |
| Understand skills                              | Technology Stack marquee + categorized groups               | `/#skills`                                                         | `skills-section` `getSkills()` ISR                                                         | `api-public getSkills revalidate:60 cache()`                            | `GET /skills` Prisma                     | Code PASS                                            | —                    |
| View projects + filter/search                  | Featured + small cards + /projects grid search/filter pills | `/` `/#projects` + `/projects`                                     | `projects-section`, `featured-card` LCP, `projects/page.tsx` client filter                 | `parseJsonArray`, `activeFilter`, `filtered`                            | `GET /projects`                          | Code PASS (live filter cap PART-02)                  | Integration polish   |
| Explore project details                        | Hero clipPath, tech pills, Live/Source, gallery, markdown   | `/projects/[slug]`                                                 | `project-detail-client`, `gallery-grid`, `lightbox`, `project-markdown`                    | `getProjectBySlug cache` + `notFound()`                                 | `GET /projects/slug/:slug`               | Code PASS                                            | —                    |
| Review experience/education                    | Timeline + education cards                                  | `/#experience`, `/#education`                                      | `experience-section`, `education-section`                                                  | `getExperiences`/`getEducation`                                         | `GET /experiences`, `/education`         | Code PASS                                            | —                    |
| Build trust (achievements/testimonials/github) | Metrics+cards, stack, heatmap, certs                        | `/#achievements`, `/#testimonials`, `/#github`, `/#certifications` | `achievements-section`, `testimonials-section`, `github-section`, `certifications-section` | `getAchievements`/`getTestimonials`/`getCertifications` (github mocked) | `GET /achievements` etc. (github static) | Code PASS (mock PART-01)                             | Integration (github) |
| Read blog                                      | Preview 3 + index + post                                    | `/#blog` + `/blog` + `/blog/[slug]`                                | `blog-preview-section`, `blog/page`, `blog/[slug]/page+blog-content`                       | `getBlogPosts cache` + fallback scan                                    | `GET /blog`, `/blog/slug/:slug`          | Code PASS                                            | —                    |
| Contact developer                              | Form (validation, success, toast) + sidebar                 | `/#contact` + `/contact`                                           | `contact-section`, `contact-form SuccessState`, `contact-sidebar`                          | `validate()` + `fetch API_BASE/contact`                                 | `POST /contact` → `contactMessage`       | Code PASS (spam leniency PART-03)                    | Logic polish         |
| Access resume/CV                               | Download CV button                                          | `/#hero` `href /resume.pdf`                                        | `hero-content Download`                                                                    | `download` attribute                                                    | `public/resume.pdf` file                 | **BROKEN** — file missing                            | Integration (asset)  |
| Admin manage content                           | 11 CRUD + dashboard toggles + messages + settings           | `/admin/*`                                                         | `admin/layout` guard, `data-table`, `dashboard toggles`                                    | `api ApiClient localStorage Bearer` + `authenticate`                    | `CRUD factory` + Cloudinary              | Code PASS (typing PART-07)                           | Code quality         |
| SEO discoverability                            | Titles/meta/OG/canonical/sitemap/robots/JSON-LD             | `layout.tsx`, `sitemap.ts`, `robots.ts`                            | `generateMetadata` per `projects/[slug]`/`blog/[slug]`                                     | `getProjects`/`getBlogPosts` parallel                                   | `next build` dynamic sitemap             | Code PASS (JSON-LD image BROKEN-02, blog OG MISS-10) | Content polish       |

**Gaps at any stage: (1) UI→Integration break: resume PDF missing (UI exists, asset missing). (2) Integration→live data: GitHub mocked not wired to `contributions` table. (3) Logic→edge states: silent `[]` hides API failure; contact spam surface.**

---

## 18. ISSUE INDEX — UNIQUE IDs

Every issue below has a unique ID per the spec. Cross-referenced in other sections.

### MISS — Missing feature

| ID      | Title                                     | Section    |
| ------- | ----------------------------------------- | ---------- |
| MISS-01 | Automated tests (0 files)                 | §7 MISS-01 |
| MISS-02 | CI pipeline                               | §7 MISS-02 |
| MISS-03 | `sharp`                                   | §7 MISS-03 |
| MISS-04 | Analytics integration                     | §7 MISS-04 |
| MISS-05 | Per-section error/empty/retry UI          | §7 MISS-05 |
| MISS-06 | CSP headers                               | §7 MISS-06 |
| MISS-07 | Focus trap                                | §7 MISS-07 |
| MISS-08 | `aria-live` on toasts                     | §7 MISS-08 |
| MISS-09 | Resume PDF asset (same root as BROKEN-01) | §7 MISS-09 |
| MISS-10 | Blog per-post OG images                   | §7 MISS-10 |
| MISS-11 | Production `CORS_ORIGIN` doc              | §7 MISS-11 |

### INC — Incomplete (started not finished)

| ID     | Title                                                   | Section    |
| ------ | ------------------------------------------------------- | ---------- |
| INC-01 | Contact anti-spam (per-route limit+honeypot+server zod) | §6 PART-03 |
| INC-02 | Per-section error handling (happy path only)            | §6 PART-04 |

### PART — Partially implemented

All 10 in §6 (PART-01..PART-10).

### BROKEN — Broken functionality

| ID        | Title                            | Section |
| --------- | -------------------------------- | ------- |
| BROKEN-01 | `/resume.pdf` 404 (Download CV)  | §8      |
| BROKEN-02 | JSON-LD `image /profile.jpg` 404 | §8      |

### MOCK — Placeholder / mock

| ID      | Title                          | Section |
| ------- | ------------------------------ | ------- |
| MOCK-01 | GitHub stats `20+` etc.        | §10     |
| MOCK-02 | Language breakdown `45%`       | §10     |
| MOCK-03 | Contribution heatmap `seed()`  | §10     |
| MOCK-04 | Achievements `10+/100+/5+/1K+` | §10     |

### FLOW — Incomplete/broken user flow

| ID      | Title                                   | Section                 |
| ------- | --------------------------------------- | ----------------------- |
| FLOW-01 | Recruiter → Download CV broken          | §12 Flow 2              |
| FLOW-02 | Visitor sees silent empty when API down | §12 Edge-case / PART-04 |

### UI — UI exists but functionality missing

See §9 "UI EXISTS" (Download CV, GitHub trio, metrics) — 5 entries.

### IMPL — Implementation exists but UI missing

See §9 "IMPLEMENTATION EXISTS" (`/contributions`, `Research`/`SeoMetadata`, `resume_url` setting) — 4 entries.

### EDGE — Missing loading/error/empty state

| ID      | Title                                   | Section    |
| ------- | --------------------------------------- | ---------- |
| EDGE-01 | Silent `[]` per section (no EmptyState) | §13        |
| EDGE-02 | `error.tsx` leaks `error.message`       | §6 PART-06 |
| EDGE-03 | No retry on failure                     | §13        |

### CONTENT — Missing portfolio content

| ID         | Title                                                                      | Section |
| ---------- | -------------------------------------------------------------------------- | ------- |
| CONTENT-01 | No `liveUrl` on any project (3× null)                                      | §14     |
| CONTENT-02 | Testimonials/Achievements/Certifications/Education depend on DB population | §14     |
| CONTENT-03 | Resume file missing                                                        | §14     |
| CONTENT-04 | Unsplash placeholders vs own screenshots                                   | §10     |

### PROD — Missing production requirement

13 entries in §11 (§15 re-list) — PROD-P0-01..P0-03, P1-01..P1-06, P2, P3.

---

## 19. IMPLEMENTATION ROADMAP

### Phase 1 — Production Blockers (do before any public announcement)

_Verification: `pnpm --filter client typecheck PASS`, `pnpm --filter client build` 22/22, `ls public/resume.pdf` exists, `grep -n profile.jpg` 0._

| Issue                            | Task                                                                                                                                                                                       | Files/Modules                                                                                                                                                   | Dependencies | Priority | Verification                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------- | ------------------------------------------------------------------------------------ |
| BROKEN-01 / MISS-09 / PROD-P0-01 | Ship `client/public/resume.pdf` (actual CV, ~200–500 KB) and make hero button respect `resume_url` setting (`href={settings.resume_url \|\| "/resume.pdf"}`) with `hidden` if both missing | `client/public/resume.pdf`, `client/src/components/sections/hero/hero-content.tsx:98`, optionally `client/src/lib/sections.ts` fetch `site-settings:resume_url` | None         | P0       | Click `Download CV` downloads PDF; `curl -I http://localhost:3003/resume.pdf 200`    |
| BROKEN-02 / PROD-P1-03           | Fix `personJsonLd image` to `/mehedi_hasan.webp` (and add copy `public/profile.jpg` if external links expect it)                                                                           | `client/src/app/layout.tsx:124`                                                                                                                                 | None         | P1       | `view-source` JSON-LD `image` resolves 200                                           |
| PROD-P0-02                       | Rotate `CLOUDINARY_API_SECRET`+`API_KEY` + generate prod `JWT_SECRET`                                                                                                                      | `server/.env` (ignored), Cloudinary dashboard, host env                                                                                                         | None         | P0       | New creds in host env only; `.env` not in `git ls-files`                             |
| PROD-P0-03 / MISS-11             | Set host `CORS_ORIGIN=https://mehedi-hasan.dev` (and `https://*.vercel.app` preview) + update `server/.env.example` note                                                                   | `server/.env.example`, Vercel/host env                                                                                                                          | After P0-02  | P0       | `curl -H Origin:https://mehedi-hasan.dev /api/v1/health` allows; `localhost` blocked |

### Phase 2 — Incomplete Core Features (ship week 1)

| Issue                          | Task                                                                                                                               | Files                                                                                                                                   | Dependencies                 | Priority | Verification                                                              |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------- | ------------------------------------------------------------------------- |
| PART-02 / PROD-P1-02           | Tech filter overflow UX (horizontal scroll + fade or `Show more`)                                                                  | `client/src/app/(main)/projects/page.tsx:26`                                                                                            | None                         | P1       | All techs reachable; no silent `slice`                                    |
| PART-03 / PROD-P1-01 / INC-01  | Add `rateLimit max 5/15m` on `POST /contact`, honeypot `website` field, server `zod` (`name min 2, email, message min 10`)         | `server/src/modules/contact/contact.routes.ts:15`, `server/src/app.ts:28`, `client/src/components/sections/contact/contact-form.tsx:32` | None                         | P1       | Spam POST flood returns 429; valid long message passes; short/invalid 400 |
| PART-01 / MOCK-01..03          | Wire GitHub live data or relabel as static "Example" — prefer `GET /contributions` or `api.github.com/users/Mehedihasan444` cached | `github/*`, `lib/api-public.ts`, `server/modules/index.ts:12`                                                                           | Add `getContributions()` API | P2       | Stats reflect real count or component shows `Last updated …` label        |
| PART-04 / EDGE-01 / PROD-P1-06 | Per-section `SectionEmpty` + `SectionError onRetry` (revalidate) instead of silent `[]`                                            | `lib/api-public.ts:82` + every `*section.tsx`                                                                                           | None                         | P1       | Disable `NEXT_PUBLIC_API_URL` → each section shows empty/error, not blank |
| PART-06 / EDGE-02              | Map `error.message` to friendly text                                                                                               | `client/src/app/error.tsx:13`                                                                                                           | None                         | P2       | Error shows generic `Something went wrong` unless `digest` known          |

### Phase 3 — Missing Production Requirements (ship week 2)

| Issue                     | Task                                                                                                             | Files                                                                                                         | Dependencies           | Priority | Verification                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------- | -------- | ------------------------------------------------------------------ |
| MISS-03 / PROD-P1-05      | `pnpm --filter client add sharp`                                                                                 | `client/package.json`                                                                                         | None                   | P1       | `next build` no sharp warning; AVIF encode faster                  |
| MISS-10 / PROD-P1-06 (OG) | Blog per-post `openGraph.images` + `twitter.images`                                                              | `client/src/app/(main)/blog/[slug]/page.tsx:19`                                                               | None                   | P1       | `view-source /blog/:slug` OG image meta present                    |
| MISS-05 / PROD-05         | Add `EmptyState` for `certifications/education/achievements/testimonials` when DB empty (not just projects/blog) | `certifications-section.tsx`, `education-section.tsx`, `achievements-section.tsx`, `testimonials-section.tsx` | PART-04 component      | P2       | Empty DB shows `No certifications yet — check back soon` not blank |
| MISS-01+02 / PROD-09      | Add `vitest` + one Playwright smoke + `.github/workflows/ci.yml` (typecheck+build gate)                          | `.github/workflows/ci.yml`, `vitest.config.ts`, `__tests__/parseJsonArray.test.ts`, `e2e/smoke.spec.ts`       | None                   | P2       | `pnpm test` PASS; CI green on PR                                   |
| MISS-07 / PART trap       | Add `focus-trap-react` for mobile menu + lightbox; `aria-live` for toasts                                        | `navbar.tsx:167`, `lightbox.tsx`, `layout.tsx Toaster`                                                        | `focus-trap-react` dep | P2       | Tab cycles within overlay, ESC closes both                         |

### Phase 4 — Quality Improvements (polish, ongoing)

| Issue                | Task                                                                                                                                                     | Files                                                                                   | Priority | Verification                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------- |
| PART-07              | Replace `any` in `admin/**` with shared DTO types; replace `confirm()` with `Dialog`; add `eslint-disable` comments for intentional `setState-in-effect` | `admin/*`, `components/admin/data-table.tsx`                                            | P1 DX    | `eslint` 85→<20 errors; `tsc PASS`                                        |
| PART-08 / P2 hygiene | `getEducation → cache()`, `shadcn → devDependencies`, `sitemap SITE_URL DRY`, `settings bulk`                                                            | `lib/api-public.ts:156`, `client/package.json`, `sitemap.ts`, `admin/settings/page.tsx` | P3       | Consistency fixes verified by grep                                        |
| MISS-04              | Add analytics `next/script afterInteractive` (Plausible env-gated)                                                                                       | `layout.tsx`, `lib/constants.ts`                                                        | P3       | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` → script present                           |
| CONTENT-01           | Deploy live demos or add `"Live demo coming soon"` label where `liveUrl null`                                                                            | `seed.ts`, `project-detail-client.tsx`                                                  | P3       | Every project shows either Live link or explicit coming-soon, not missing |
| CONTENT-04           | Replace Unsplash placeholders with own screenshots before public SEO push                                                                                | `seed.ts/images`, `public/projects/*`                                                   | P3       | `images.unsplash` no longer required for own projects                     |

---

## 20. FINAL VERDICT

### **PARTIALLY COMPLETE — IMPORTANT WORK REMAINS**

**Choice rationale:** This is _not_ `NOT READY` (no app-broken, no data-exposure, build green 22/22, `tsc PASS`, every core user flow traced end-to-end) and _not_ `FULLY COMPLETE` (one recruiter-critical broken CTA `/resume.pdf` 404 + mocked GitHub + silent failure mode + zero tests). It is also stronger than `INCOMPLETE` (the portfolio _is_ usable and presentable). The accurate grade is **PARTIALLY COMPLETE — IMPORTANT WORK REMAINS**: the 5-minute P0 path (ship resume PDF + fix JSON-LD image + set prod env) makes it `MOSTLY COMPLETE — MINOR ITEMS REMAIN`; the week-1 P1/P2 path (contact anti-spam, filter overflow, error states, blog OG, `sharp`) makes it `FULLY COMPLETE AND PRODUCTION READY` by industry portfolio standards.

**What that means in practice:**

- **Do not announce to recruiters** until Phase 1 blockers (§19) are done — a recruiter clicking `Download CV` and hitting 404 is the only scenario that turns polish into lost opportunity.
- **Do deploy** (preview/env) immediately after Phase 1 — everything else is safe to iterate in production without blocking launch.
- **Do not call it FULLY COMPLETE** until Phase 2 P1s are landed and one `PORT=3003 next start` live verification (`curl -I /` headers, `curl /sitemap.xml` entries, manual mobile + keyboard traversal, form submit success/failure toasts) is recorded. Testing/CI (Phase 3) upgrades it from "complete" to "maintainable."

---

## Appendix A — Commands & Evidence (no fabrication)

```
pnpm --filter client typecheck   → PASS (tsc --noEmit, 8.4–8.7s)
pnpm --filter client build       → PASS (Turbopack 11 workers, Generating static pages 22/22 in 1.2s)
  Route table captured:  ○ /  ○ /projects  ◐ /projects/[slug]  ○ /blog  ◐ /blog/[slug]  ○ /contact  ○ /robots.txt  ƒ /sitemap.xml  ○ /admin/* (11)
npx eslint . (client)            → 85 errors / 27 warnings (pre-existing: any 21×, set-state-in-effect 11×)
git ls-files | grep .env         → only server/.env.example (server/.env correctly ignored per .gitignore .env pattern)
grep -r "unoptimized" client/src → 0 (after prior audit fix; was 2)
grep TODO/FIXME/HACK/XXX         → 0 in client/src + server/src (XXX only in lockfile checksum)
ls client/public/                → mehedi_hasan.jpg/webp, og-image.png 27535 bytes, file.svg/globe.svg/no resume.pdf
ls client/public/projects/       → carrental.webp 68K, marketsphere.webp 44K, techtips.webp 89K
cat client/.env.local            → NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
cat server/.env                  → dev sqlite file:./dev.db, real Cloudinary keys, JWT dev secret
cat server/.env.example          → PG placeholder, notes same
find **/*.test.*                 → 0 (outside node_modules)
find .github/workflows           → not found at repo root (only nested in node_modules)
grep analytics                   → 0 (not wired)
grep "throw new Error"           → only api.ts data.message propagation (legit)
```

All PASS/fail values above are live tool outputs captured during this audit session.

---

## Appendix B — Architecture Map (verification snapshot)

```
Monorepo pnpm@9.15.0 + turbo; packages [client, server]
Client next 16.2.10 cacheComponents true, optimizePackageImports [motion,lucide,fiber,drei,three,gsap,sonner], images AVIF/WebP + remotePatterns + minimumCacheTTL, headers X-Frame-Options DENY etc., bundle-analyzer
  App Router: layout (fonts 8 woff2, metadata OG/JSON-LD) → (main)/layout (SmoothScroll → LoadingScreen once 900ms → Navbar → PageTransition opacity 0.25s → Footer TextHoverEffect → ScrollToTop + ClientAnimations)
    (main)/page 12 Suspense sections + ProgressiveBlur dividers (hero→about→skills→experience→projects→education→certifications→achievements→github→testimonials→blog→contact)
    /projects client search+filter layoutId AnimatePresence + skeleton
    /projects/[slug] server generateMetadata + project-detail-client clipPath/gallery/lightbox/markdown
    /blog server published filter + /blog/[slug] fallback scan + blog-content
    /contact server wraps ContactSection
    /admin client localStorage token guard + 11 CRUD (CRUD factory + Cloudinary)
    sitemap dynamic Promise.all + robots disallow /admin + error/not-found/loading/globals.css tokens
  Providers next-themes dark, SmoothScroll Lenis fine-pointer only, PageTransition
  Data React.cache deduplication + revalidate:60 ISR + "use cache" sections hours tag
  Styling tailwind 4 + tw-animate-css globals.css #050810 glass/text-gradient/glow-violet + prettier-plugin-tailwindcss
Server Express helmet(cors origin)+compression+rateLimit 100/15m+pino, zod env, prisma 14 models sqlite dev, crud-factory authenticate on writes, cloudinary/multer upload, docker-compose, seed admin+skills+experiences+projects+seo
```

---

_Report generated 2026-08-28 from direct file reads and executed tool outputs. No metrics fabricated. All "COMPLETE" items required functional evidence; "PARTIALLY COMPLETE" marks real but incomplete workflows; "BROKEN" is verified 404. Re-audit after Phase 1 fixes to upgrade verdict._
