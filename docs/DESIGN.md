# Design System — Mehedi Portfolio

> Source of truth: `client/src/app/globals.css` (Tailwind 4 + `tw-animate-css`) and `client/src/app/layout.tsx` (fonts). Keep this doc in sync with those files.

## 1. Brand & Mood

Space-black / midnight premium tech portfolio. The hero is dark (`#050810`) with emerald-to-cyan aurora/glow accents. Visual language: **glass + gradient + glow**, not flat corporate. Heavy use of blur/saturate to feel depth, but performance-gated on mobile/reduced-motion (see `AGENTS.md`).

## 2. Color Tokens

All tokens are CSS variables in `:root` / `.dark` (identical — dark is the only theme, `next-themes` defaults to `dark`, `enableSystem: false`).

| Token                                   | Value                                           | Usage                                                             |
| --------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| `--background`                          | `#050810`                                       | page bg                                                           |
| `--foreground`                          | `#f0f2ff`                                       | primary text                                                      |
| `--card`                                | `rgba(10,12,24,0.7)` / `rgba(6,14,10,0.7)` dark | section cards                                                     |
| `--primary`                             | `#059669` (emerald)                             | CTAs, accent dot, selection                                       |
| `--primary-foreground`                  | `#ffffff`                                       | button text                                                       |
| `--secondary`                           | `rgba(8,22,16,0.9)`                             | secondary surfaces                                                |
| `--accent`                              | `#06b6d4` (cyan)                                | links, live indicators                                            |
| `--border`                              | `rgba(5,150,105,0.15)`                          | card/section borders                                              |
| `--ring`                                | `rgba(5,150,105,0.4)`                           | focus ring                                                        |
| `--violet` → `#059669`                  | alias to emerald                                | historic violet tokens map to emerald (see `globals.css` comment) |
| `--violet-soft` → `#34d399`             | emerald-soft                                    | gradients, `text-gradient`                                        |
| `--cyan` / `--cyan-soft`                | `#06b6d4` / `#67e8f9`                           | aurora, telemetry                                                 |
| `--indigo` → `#047857`                  | alias                                           | timelines                                                         |
| `--rose` `#f43f5e`, `--amber` `#f59e0b` | alerts only                                     | do not use as brand                                               |

Body bg is 3 radial gradients on `#050810` (see `@layer base body`): `100% 60% at 50% -10%` emerald 0.08, `60%40 at 90%90` cyan 0.05, `40%30 at 10%70` green 0.04. `background-attachment: fixed` on desktop, `scroll` on ≤768px / reduced-motion (performance, `globals.css:239`).

### Semantic mappings (via `@theme inline`)

`--color-background` → `--background`, `--color-emerald` `#059669`, `--color-glass` `rgba(255,255,255,0.03)`, etc. Tailwind tokens `bg-background`, `text-foreground`, `border-border` resolve from these.

## 3. Typography

| Role    | Font           | Variable                | Weights shipped                             | Usage                                      |
| ------- | -------------- | ----------------------- | ------------------------------------------- | ------------------------------------------ |
| Body    | Inter          | `--font-inter`          | 400, 600, 700 (`next/font` `display: swap`) | `body`, paragraphs, UI                     |
| Heading | Space Grotesk  | `--font-space-grotesk`  | 400, 600, 700                               | `h1..h6`, `font-heading`                   |
| Mono    | JetBrains Mono | `--font-jetbrains-mono` | 400, 500                                    | `code`, `pre`, `kbd`, TerminalBlock, stats |

Weights are intentionally trimmed to 8 woff2 (was 11) — see `layout.tsx:16`. Do not add `500` to sans/heading or `600` to mono without audit. Preloads appear as `link rel=preload as=font` on `curl -I /`.

Scale: hero `text-5xl → lg:text-8xl` uppercase tight, section `text-4xl sm:text-5xl`, body `sm:text-lg`, mono `text-sm` labels with `tracking-[0.3em]` uppercase.

## 4. Spacing & Layout

- **Container:** `container-inner` `max-w-7xl` (80rem) centered `mx-auto`. Sections use `px-6` (1.5rem) + `py-32` (8rem) via `section-padding` utility.
- **Section rhythm:** `src/app/(main)/page.tsx` stacks 12 `Suspense` sections separated by `ProgressiveBlur` `height 15–20vh` dividers.
- **Radius:** `--radius 0.75rem` token; scales `xs:0.375rem → 3xl:2.25rem`, `full:9999px`. Cards use `rounded-2xl`.
- **Scroll:** `html { scroll-behavior: smooth }`, Lenis smooth scroll on fine pointer only (disabled on `pointer: coarse`), `ScrollToTop` pill bottom-right.

## 5. Utilities (do not duplicate)

| Utility                              | Effect                                                                                 |
| ------------------------------------ | -------------------------------------------------------------------------------------- |
| `glass`                              | `rgba(6,14,10,0.65)` + `blur(16px) saturate(180%)` + `1px border rgba(5,150,105,0.12)` |
| `glass-light`                        | `rgba(255,255,255,0.03)` + `blur(12px)` for nav sheets                                 |
| `glass-hover`                        | hover → `rgba(5,150,105,0.06)` + `border 0.25`                                         |
| `text-gradient`                      | `135deg #34d399 0% #059669 40% #06b6d4 100%` clip text                                 |
| `glow-violet` / `glow-cyan`          | `0 0 30px + 80px` colored shadows                                                      |
| `glow-border` / `glow-border-static` | `inset -1px` gradient mask composite border                                            |
| `noise-overlay` / `card-noise`       | inline `feTurbulence` SVG noise `opacity 0.04–0.05`                                    |
| `shimmer`                            | 200% bg linear sweep `2.5s infinite`                                                   |
| `section-label`                      | `0.75rem 500 0.25em uppercase var(--violet-soft)`                                      |

## 6. Motion

Tokens in `@theme inline`: `--animate-fade-in 0.5s`, `--animate-float 6s ease-in-out infinite`, `--animate-marquee 30s linear infinite`, `--animate-ping-slow 3s`, etc. Keyframes: `fade-in/up/down`, `scale-in`, `float`, `glow`, `shimmer`, `aurora 12s`, `marquee`, `orbit`, `grain 0.3s steps(1)`.

**Rules:**

- Only animate `transform` + `opacity` (no layout props).
- Gate with `prefers-reduced-motion` early return and `document.hidden` pause — see `AGENTS.md`.
- Provider: `PageTransition` is opacity-only `0.25s` (`initial: false`) — do not reintroduce `y:20` 0.5s.

## 7. 3D & Canvas

- **Stack:** `three`, `@react-three/fiber`, `@react-three/drei`. All canvases `ssr:false`, `dpr [1,1.5]`, `powerPreference: "high-performance"`, `antialias true, alpha true`.
- **Hero stack (fixed `z-0` behind `z-10` content):** `GlobeBackground` (`Canvas` + `GlobeScene` with `LandDots`/`MarkerDots`/`GlowRing`), optional `GlitterWrapBackground` (90 particles on `full`), optional `AuroraShaderBackground` (GLSL 15 iterations, 18 fps tick, gated on coarse/reduced-motion), then radial `50% 50%` scrim `rgba(5,8,16,0.8→0.9)` for text contrast.
- **Hero parallax:** `contentY [0,80]`, `opacity [1,0.6]`, `scale [1,0.97]` via `framer-motion useTransform`.

## 8. Components

- **Navbar / Footer:** Glass strips, sticky nav with scroll-hide transform.
- **HeroContent:** `AnimatedBadge`, `Typewriter`, `TerminalBlock`, stats (`framer-motion stagger 0.12`), CTA `MagneticButton` (strength 0.2–0.3).
- **Projects:** `FeaturedCard` (LCP, `priority` + `fetchPriority: high`, `sizes 60vw`) + 2 `SmallCard` in `lg:grid-cols-5` `lg:row-span-2`.
- **Skills:** `marquee-track` 30s `marquee-container` fade masks, `proficiency-bar` GSAP scrub.
- **Timeline cards:** GSAP `ScrollTrigger` `start top 80%`.

## 9. Assets

- **LCP:** `public/mehedi_hasan.webp` 26 KB (not `mehedi_hasan.jpg` 212K). Keep only `.webp` for projects (`carrental 67K`, `marketsphere 44K`, `techtips 88K` — PNGs deleted).
- **OG:** `public/og-image.png` 1200×630 27 KB (ImageMagick `xc:"#050810"`). Regenerate on title change.
- **Images config:** `next.config.ts` `formats ["image/avif","image/webp"]`, `deviceSizes 480–1536`, `minimumCacheTTL: 31536000`.

## 10. Accessibility

Selection `rgba(5,150,105,0.25)`, scrollbar 5px gradient emerald→cyan, `focus-visible` 2px `#059669` outline. `Inter` antialiased, heading `Space Grotesk`.
