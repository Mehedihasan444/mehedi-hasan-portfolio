# Product Vision — Mehedi Portfolio

> Mehedi Hasan — Full Stack Developer & Software Engineer (Dhaka, Bangladesh). Site is the primary personal brand, hiring funnel, and content hub.

## 1. Positioning

- **One-liner:** Crafting elegant, scalable web applications at the intersection of design and engineering.
- **Audience:** remote hiring managers, CTOs, startup founders; peer developers; potential collaborators.
- **Differentiator:** premium glass/aurora aesthetics with production-grade performance (see `apps/web/docs/PERFORMANCE_AUDIT_2026-08.md` — Verdict: PRODUCTION READY WITH MINOR OPTIMIZATIONS).
- **Voice:** concise, technical, achievement-driven. Hero roles rotate via `Typewriter speed 55 deleteSpeed 30`.

## 2. Site Map & Sections

Canonical URL `https://mehedi-hasan.dev` (`SITE_URL`). 12 sections toggled via `src/lib/sections.ts` / `DEFAULT_SECTIONS` (default all `true`; `site-settings` key `section_<name> = "true"`).

| #   | Route / Anchor    | Section component                                                                                            | Data source                              |
| --- | ----------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| 1   | `/#hero`          | `hero-section.tsx` (Globe + Glitter + Aurora fixed `z-0`)                                                    | static (`hero/constants.ts` roles/stats) |
| 2   | `/#about`         | `about-section.tsx` (`ParallaxImage` lazy below-fold, `ValueCard`, `WordRevealText`)                         | static                                   |
| 3   | `/#skills`        | `skills-section.tsx` (`marquee-row`; API-first with static fallback)                                         | `GET /skills` (paginated)                |
| 4   | `/#experience`    | `experience-section.tsx` (`timeline-card`, `timeline-line`)                                                  | `GET /experiences`                       |
| 5   | `/#projects`      | `projects-section.tsx` + `projects/work-track.tsx` (pinned horizontal scroll, numbered work boxes, CTA card) | `GET /projects` (paginated)              |
| 6   | `#education`      | `education-section.tsx`                                                                                      | `GET /education`                         |
| 7   | `#certifications` | `certifications-section.tsx` (`cert-card`)                                                                   | `GET /certifications`                    |
| 8   | `#achievements`   | `achievements-section.tsx`                                                                                   | `GET /achievements`                      |
| 9   | `#github`         | `github-section.tsx` (`contribution-heatmap`, `language-breakdown`)                                          | static + GitHub API (optional)           |
| 10  | `#testimonials`   | `testimonials-section.tsx`                                                                                   | `GET /testimonials`                      |
| 11  | `#blog`           | `blog-preview-section.tsx` (3 cards) → `/blog` + `/blog/[slug]`                                              | `GET /blog` via `React.cache`            |
| 12  | `/#contact`       | `contact-section.tsx` (`contact-form` → `POST /contact`, `contact-sidebar`)                                  | `POST /contact` (5/15m + honeypot)       |

Plus routes:

- `/projects` (grid) + `/projects/[slug]` (`generateMetadata` + `ProjectDetailClient` with `gallery-grid` + `lightbox` + `project-markdown`)
- `/blog` + `/blog/[slug]` (`blog-content.tsx` line-split markdown, `fallback` to full-list scan)
- `/contact` (standalone contact page)
- `/admin/*` — auth `layout.tsx` + CRUD pages (`achievements`, `blog`, `certifications`, `dashboard`, `education`, `experiences`, `messages`, `projects`, `settings`, `skills`, `testimonials`) — not part of public performance audit.
- `robots.ts`, `sitemap.ts` (dynamic), `not-found.tsx`, `error.tsx`, `loading.tsx`.

`src/app/(main)/page.tsx` composes all sections, each wrapped `Suspense fallback <SectionFallback>` with `ProgressiveBlur` 15–20vh dividers. `layout.tsx` wraps with `Providers` (next-themes dark), `SmoothScrollProvider` (Lenis, fine-pointer only), `LoadingScreen` (sessionStorage once, 900ms), `Navbar`/`Footer`, `PageTransition` (opacity 0.25s).

## 3. Data Model & API

**Base:** `NEXT_PUBLIC_API_URL` (`http://localhost:4000/api/v1` fallback) — constant `API_BASE`. All public reads are `fetch(..., { next: { revalidate: 60 } })` (ISR 60s) and `React.cache` deduped (see `src/lib/api-public.ts:1`).

| Entity        | Key fields                                                                                                                     | Endpoint                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Project       | `title, slug, description, content, techStack (JSON array), liveUrl, githubUrl, image, images (JSON), featured, order, status` | `GET /projects`, `GET /projects/slug/:slug`     |
| Skill         | `name, category, icon, proficiency, order`                                                                                     | `GET /skills`                                   |
| Experience    | `company, role, description, startDate, endDate, location, type, current, tags`                                                | `GET /experiences`                              |
| Education     | `institution, degree, field, description, startDate, endDate, location, gpa, tags`                                             | `GET /education`                                |
| Certification | `title, issuer, url, date, description, image`                                                                                 | `GET /certifications`                           |
| Testimonial   | `name, role, company, content, avatar, rating, featured, order`                                                                | `GET /testimonials`                             |
| Achievement   | `title, description, date, icon`                                                                                               | `GET /achievements`                             |
| BlogPost      | `title, slug, content, excerpt, tags (JSON), image, published, featured`                                                       | `GET /blog`, `GET /blog/slug/:slug` (preferred) |
| SiteSettings  | `key=section_<name>, value="true"/"false"`                                                                                     | `GET /site-settings`                            |

`parseJsonArray` handles JSON-encoded `techStack/tags/images` strings. `formatProject`/`formatBlogPost` normalize.

## 4. User Journeys

1. **Hire:** lands hero → typewriter roles → `View My Work` (#projects) or `Download CV` (`/resume.pdf`) → contact form (success state + sonner toast) → `sonner` bottom-right.
2. **Browse projects:** pinned horizontal scroll through numbered work boxes (info + image + tools) → `/projects/[slug]` detail (clipPath reveal, gallery lazy images) → end CTA card → `/projects`.
3. **Evaluate skills:** marquee 30s infinite, grouped Frontend/Language/Backend/Database/Tools (static fallback when API empty).
4. **Read blog:** `/blog` grid → `/blog/[slug]` with `BlogContent` (GSAP per-line reveal, fallback scan).

## 5. Content & Admin

Admin is SPA at `/admin/*` (protected `layout.tsx`, token-gated). Auth sets an httpOnly `SameSite=strict` cookie (+ Bearer fallback); `POST /auth/register` is blocked in production unless `ALLOW_PUBLIC_REGISTER=true`, and all write routes + contact/message reads require the `admin` role. List endpoints are paginated (`?page&limit`, max 100). No public writes except contact `POST /contact`. Public pages are `cacheComponents` static + ISR; admin pages are client-rendered.

## 6. SEO

- Metadata in `src/app/layout.tsx`: `SITE_TITLE`, `SITE_DESCRIPTION`, `keywords` (Full Stack / Next.js / TypeScript / Bangladesh), `metadataBase`, `canonical`, `openGraph` + `twitter` with `og-image.png` (1200×630 27 KB, `public/og-image.png`), `robots` + `googleBot max-image-preview large`, icons `/favicon.ico`, `/apple-touch-icon.png`.
- Person `JSON-LD` `Schema.org/Person` (jobTitle Full Stack, Dhaka, alumni Daffodil International University).
- `sitemap.ts` dynamic, `robots.ts` index/follow.
- Images use `next/image` `fill`+`sizes` (avoids CLS); only the hero portrait is LCP-prioritized — all section/grid images are `loading="lazy"`.

## 7. Integrations

- **Analytics:** not yet wired (placeholder for GA/plausible via `next/script` `strategy="afterInteractive"`). Do not add blocking scripts.
- **Fonts:** `next/font/google` `Inter`/`Space Grotesk`/`JetBrains Mono` 8 woff2 `display: swap`.
- **Email:** `EMAIL mehedihasan67705251@gmail.com`, `PHONE +8801767705251`, socials `github`/`linkedin`/`twitter` (see `constants.ts`).
- **Maps/3D:** optional `d3-geo` for globe land dots (idle+abort+cache, see performance audit).

## 8. Deployment

- **Web:** `apps/web` (Next.js, Turbopack, 11 workers, `cacheComponents: true`, `optimizePackageImports` for `framer-motion`/`lucide`/`three`/`gsap`), `PORT=3003 npx next start` — verify `curl -I /` 200, `og-image.png` 200.
- **API:** `apps/api` (separate workspace) at `NEXT_PUBLIC_API_URL`. Env `PORT`, `API_BASE` not committed.
- **Commit style:** Conventional via `commitlint` + `husky` `prepare`.
- **Monorepo:** `turbo` `dev` (persistent), `build`, `lint`, `typecheck`, `prettier-plugin-tailwindcss`.

## 9. Roadmap

- Lighthouse CI on PRs (desktop + mobile throttled), `ANALYZE=true` bundle check for 709K `three` chunk.
- Replace remaining GSAP trivial fades with CSS to drop `gsap` from non-interactive sections.
- Split `HeroSection` to server shell + client transforms subtree (reduce 103 client files).
