# FIRST-MD-EXECUTION-REPORT.md — FULL-AUDIT-REPORT Execution

Date: 2026-06-06 Asia/Tokyo  
Source MD executed first: `FULL-AUDIT-REPORT.md`  
Project: `print-ready-tool-site`  
Constraints honored: did not run `npm run build`; did not run test scripts.

## Completed items from the first MD

### 1. Dependency/security risk remediated

Changed:
- `next`: `14.2.35` -> `15.5.19`
- `eslint-config-next`: `14.2.35` -> `15.5.19`
- Added `overrides.postcss = 8.5.15`
- Updated `package-lock.json`

Validation:
- `npm audit --omit=dev`: `found 0 vulnerabilities`
- `npm audit --audit-level=moderate`: `found 0 vulnerabilities`

### 2. Security headers added

Changed:
- `next.config.mjs`

Added headers:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`
- `Permissions-Policy`
- `Content-Security-Policy` with allowances for required Next.js inline runtime behavior and AdSense domains

Local header check confirmed all five headers are emitted by the Next dev server.

### 3. Static calculator/tool stubs replaced with real tools

Changed:
- Added `src/components/StaticPrintToolPage.tsx`
- Updated `app/[...slug]/page.tsx`
- Updated `app/globals.css`

Implemented real tool UI for:
- `/kdp-interior-bleed-calculator/`
- `/image-print-quality-checker/`
- `/bleed-safe-zone-calculator/`
- `/etsy-printable-size-calculator/`
- `/common-print-sizes/`

Each now has visible input controls, deterministic calculations, formula notes, copyable results, source/limit text, and related next steps.

Local status check:
- `/kdp-interior-bleed-calculator/`: 200
- `/image-print-quality-checker/`: 200
- `/bleed-safe-zone-calculator/`: 200
- `/etsy-printable-size-calculator/`: 200
- `/common-print-sizes/`: 200

### 4. JSON-LD hardened and expanded

Changed:
- Added `src/lib/seo/jsonLd.ts`
- Updated `app/layout.tsx`
- Updated `app/[...slug]/page.tsx`
- Updated `src/components/PixelFitClient.tsx`
- Updated `src/components/PrintArticlePage.tsx`
- Updated `src/components/kdp/KdpCoverHome.tsx`
- Added JSON-LD to the new static tool pages

Improvements:
- Replaced direct `JSON.stringify(...)` injection with `safeJsonLd(...)`.
- Added site-wide `Organization` and `WebSite` JSON-LD.
- Added `WebApplication` JSON-LD to PixelFit tool pages.
- Added `WebApplication` and `BreadcrumbList` JSON-LD to the five newly fulfilled static tools.
- Added generic JSON-LD for remaining static/trust pages.

### 5. PixelFit validation correctness improved

Changed:
- `src/components/PixelFitClient.tsx`

Fixes:
- Added image format normalization so `24-bit PNG`, `image/png`, `JPG`, and `JPEG` compare correctly.
- Added `maxFileSizeKB` support alongside `maxFileSizeMB`.
- File size checks now use a unified limit model instead of ignoring KB-only specs.

### 6. KDP input and export safety improved

Changed:
- `src/lib/kdp/cover.ts`
- `src/components/kdp/KdpCoverHome.tsx`
- `src/components/kdp/KdpResultActions.tsx`
- `app/globals.css`

Fixes:
- Added finite-number guards and clamping for custom trim, page count, bleed, and PPI.
- Added input `max` attributes for browser-level guardrails.
- Shows every warning instead of only the first warning.
- Disabled PNG export above a browser-safe 100MP threshold while keeping SVG export available.

### 7. Sitemap audit false failure fixed

Changed:
- `scripts/audit-pixelfit.mjs`

Fix:
- Updated the sitemap assertion from a brittle `allRoutes.map` substring check to a structural `allRoutes` + `.map(` check, allowing the existing `allRoutes.filter(...).map(...)` implementation.

Validation:
- `npm run audit:pixelfit`: passed.

### 8. AI-search-ready file added

Changed:
- Added `public/llms.txt`

Purpose:
- Provides a concise inventory of canonical tools, source/limit policy, privacy boundary, and preferred citation language for AI crawlers and answer engines.

Local status check:
- `/llms.txt`: 200

## Validation commands executed

Allowed local checks only:

```txt
npm run typecheck
npm run lint
npm audit --omit=dev
npm audit --audit-level=moderate
npm run audit:pixelfit
NEXT_TELEMETRY_DISABLED=1 npm run dev -- --hostname 127.0.0.1 --port 3015
curl checks for the five fulfilled tool URLs, sitemap, robots, and llms.txt
local header scan with curl -I
```

Skipped by instruction:

```txt
npm run build
all test scripts
```

## Current validation status

| Gate | Result |
|---|---|
| TypeScript | Pass |
| Lint | Pass; Next warns `next lint` is deprecated for future Next 16 migration |
| Production audit | Pass, 0 vulnerabilities |
| Full moderate+ audit | Pass, 0 vulnerabilities |
| PixelFit audit script | Pass |
| Five former stub tool pages | Pass, all 200 locally |
| Security headers | Pass locally |
| Build | Not run by instruction |
| Tests | Not run by instruction |

## Remaining items for the second MD / next execution

These belong to `ACTION-PLAN.md` or lower-priority sections not fully closed by this first pass:

1. Expand thin `/guides/` and `/templates/` hub/basic pages beyond generic fallback copy.
2. Rewrite short meta descriptions for high-priority pages to 120-155 characters where needed.
3. Make sitemap `lastModified` per-route instead of mostly uniform.
4. Add a deterministic local SEO crawler script if you want this audit repeatable in CI without external APIs.
5. Consider migrating from `next lint` to the ESLint CLI before a future Next 16 migration.
