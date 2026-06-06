# FULL-AUDIT-REPORT.md — Print Ready Tools SEO Skill Audit

Date: 2026-06-06 Asia/Tokyo  
Project: `print-ready-tool-site`  
Domain: `https://print.ymirtool.com`  
Workflow: `seo` + `seo-audit` skill, run inline from local source and local Next.js dev server.  
Constraints honored: did not run `npm run build`; did not run test scripts.

## Executive Summary

Overall SEO Health Score: **65/100**

Business type detected: browser-based calculator and print/image specification utility site for KDP covers, DPI, print size, safe zones, and social/marketplace image assets.

The site has a solid technical foundation: crawlable route inventory, canonical metadata, working sitemap/robots generation, one-H1 pages, and no obvious internal link breakage in the local crawl. The main SEO gap is quality fulfillment: several URLs promise calculators or templates but render generic fallback content. This weakens search intent satisfaction, E-E-A-T, and conversion quality. Security/dependency risk is also material because the current Next.js/PostCSS stack is audit-vulnerable.

## Crawl and Evidence Summary

- Local route crawl: **88 page routes** plus `/robots.txt`, `/sitemap.xml`, `/ads.txt`, and redirect aliases.
- Sitemap URLs generated locally: **86**.
- Robots output: `User-Agent: *`, `Allow: /`, sitemap points to production sitemap.
- Local status results: all crawled canonical routes returned 200; redirect aliases returned 308 then canonical content.
- Homepage live text was reachable via browser tool; it exposes the KDP calculator UI and calculator result copy.
- TypeScript: `npm run typecheck` passed.
- Lint: `npm run lint` passed.
- Production dependency audit: `npm audit --omit=dev` failed with 2 vulnerabilities.
- Full dependency audit: `npm audit` failed with 5 vulnerabilities.

## Score Breakdown

| Category | Weight | Score | Weighted contribution |
|---|---:|---:|---:|
| Technical SEO | 22% | 68 | 15.0 |
| Content Quality | 23% | 58 | 13.3 |
| On-Page SEO | 20% | 66 | 13.2 |
| Schema / Structured Data | 10% | 60 | 6.0 |
| Performance / CWV | 10% | 70 | 7.0 |
| AI Search Readiness | 10% | 62 | 6.2 |
| Images | 5% | 78 | 3.9 |

## Top Critical Issues

- Upgrade vulnerable production dependency chain: `npm audit --omit=dev` reports `next` high severity and `postcss` moderate severity; full audit reports 5 total vulnerabilities.
- Implement real tools for `/kdp-interior-bleed-calculator/`, `/image-print-quality-checker/`, `/bleed-safe-zone-calculator/`, `/etsy-printable-size-calculator/`, and `/common-print-sizes/`; they currently render generic explanatory pages with about 177–179 words instead of calculators.

## Top Quick Wins

- Patch the sitemap audit script assertion so local SEO/PixelFit audit does not produce false failure on `allRoutes.filter(...).map(...)`.
- Add `.seo-cache/` to `.gitignore` and keep generated audit summaries out of commits unless intentionally needed.
- Add a shared `safeJsonLd()` helper and replace direct JSON-LD `JSON.stringify` injection.
- Add WebApplication JSON-LD to the high-value PixelFit calculator pages and Breadcrumb/WebPage JSON-LD to generic static pages.
- Rewrite short descriptions for high-value tool pages to 120–155 characters with the input, output, and target user intent.

## Technical SEO

### Positive findings

- `app/sitemap.ts` is driven from `allRoutes` and filters known non-canonical aliases.
- `app/robots.ts` allows crawl access and declares the canonical sitemap URL.
- `next.config.mjs` disables `x-powered-by` via `poweredByHeader: false`.
- Redirects exist for `/kdp-cover-calculator/:path*`, `/image-size/print-size-calculator`, and `/image-size/dpi-calculator`.
- Local crawl found no canonical route returning non-200.
- All crawled pages had exactly one H1.

### Issues

1. **Dependency/security risk** — `npm audit --omit=dev` reports vulnerable production dependency chain: `next` high severity and `postcss` moderate severity. Full audit also reports vulnerable dev chain through `eslint-config-next`/`glob`.
2. **No explicit security headers** — No configured CSP, Referrer-Policy, X-Content-Type-Options, X-Frame-Options/frame-ancestors, or Permissions-Policy in `next.config.mjs` or `vercel.json`.
3. **Redirect chain nuance** — slashless `/image-size/print-size-calculator` redirects to `/image-size/print-size-calculator/`, which then redirects to `/print-size-calculator/`. This is acceptable but avoid linking to the first-hop legacy URL.
4. **Sitemap lastModified is uniform** — all sitemap entries use `2026-05-30`, which is easy to maintain but less precise than per-route modified dates.

## Content Quality

### Route class distribution

| Class | Count |
|---|---:|
| home_tool | 1 |
| static_tool_stub | 6 |
| pixelfit_tool | 42 |
| other | 1 |
| thin_guide | 8 |
| template | 4 |
| article | 20 |
| trust | 6 |


### Thin or under-fulfilled pages

Local crawl found **26 pages below 220 words**. The most important group is the calculator/tool stubs:

| URL | Word count | Problem |
|---|---:|---|
| `/kdp-interior-bleed-calculator/` | 177 | Promises tool/calculator intent but renders mostly static fallback content. |
| `/print-size-calculator/` | 261 | Promises tool/calculator intent but renders mostly static fallback content. |
| `/dpi-calculator/` | 228 | Promises tool/calculator intent but renders mostly static fallback content. |
| `/bleed-safe-zone-calculator/` | 177 | Promises tool/calculator intent but renders mostly static fallback content. |
| `/etsy-printable-size-calculator/` | 178 | Promises tool/calculator intent but renders mostly static fallback content. |
| `/common-print-sizes/` | 177 | Promises tool/calculator intent but renders mostly static fallback content. |

Additional thin groups include `/guides/` basics, `/templates/` pages, and trust pages. Trust pages can be shorter, but privacy/terms/contact pages should still be complete enough for AdSense, user trust, and policy review.


## On-Page SEO

### Positive findings

- Canonicals are absolute and use `https://print.ymirtool.com`.
- Open Graph and Twitter metadata exist on crawled pages.
- H1 structure is consistent.
- The home page has strong task-oriented copy and calculator UI text.

### Issues

- Many meta descriptions are too short to communicate the full value proposition. Local crawl found short descriptions on high-value pages including calculator, guide, template, and image-size tool pages.
- Several pages use generic repeated sections such as `Formula or rule`, `Worked example`, `Limits`, and `Related calculators`; this causes weak page differentiation.
- The `/guides/` and `/templates/` hubs do not act as rich navigational hubs; they are currently fallback content pages rather than true hub pages.

## Schema & Structured Data

### Positive findings

- JSON-LD parses without syntax errors in the local crawl.
- Home page includes `WebApplication`, `Offer`, `FAQPage`, and `BreadcrumbList`.
- KDP article pages include `Article`, `Organization`, `FAQPage`, and `BreadcrumbList`.
- PixelFit pages emit Breadcrumb and FAQ JSON-LD.

### Issues

- **23 crawled pages have no JSON-LD**, including several static calculator/tool pages and trust pages.
- PixelFit calculator pages mostly lack `WebApplication`/`SoftwareApplication` structured data despite functioning as tools.
- FAQPage is broadly emitted across tool and article pages. Under the supplied SEO skill rules, FAQ rich results should not be relied on for non-government/non-health authority sites; use it sparingly or remove where it adds no durable benefit.
- JSON-LD injection uses direct `JSON.stringify(...)` in `dangerouslySetInnerHTML`; safe for current local static data, but it should still be wrapped in an escaping helper before any future CMS/content import.

## Performance / Core Web Vitals

No production Lighthouse or CrUX field data was collected in this run. The local dev server was used only for route rendering and metadata extraction; dev-server latency is not representative of production performance.

Static inspection suggests the project is relatively lightweight: no local image assets, no heavy image imports, and most pages are text/tool UI. Main performance risks are client-side tool interactivity, canvas/SVG generation for large user inputs, and AdSense auto ads loading on eligible pages.

## Images

- No static image library was found under `public/` except `ads.txt`.
- Local uploaded images are previewed in-browser and not sent to a backend.
- `SafeZoneCanvas` gives preview images an alt value of `Local image preview`.
- Because the site is tool-heavy and not image-asset-heavy, image SEO risk is low. The larger issue is image-validation correctness inside PixelFit, not missing image alt attributes.

## AI Search / GEO Readiness

Strengths:

- KDP article pages include source links and concrete calculations.
- Homepage copy is concise and answer-oriented.
- Tool pages expose deterministic values and task-specific language.

Weaknesses:

- No `llms.txt` or AI-crawler briefing file.
- Thin fallback pages are poor citation targets.
- Several tools have no dedicated schema describing their function, input, output, limitations, and source policy.
- Source freshness is represented in `imageSpecs.ts` for image tools, but not exposed consistently on every page in crawlable body text.

## Limitations of This Run

- Did not run `npm run build`.
- Did not run test scripts.
- Did not collect Lighthouse/CrUX/field CWV data.
- Container DNS could not resolve the production domain; production robots/sitemap/header checks were inferred from source and local server. Browser tool was able to fetch the live homepage text.
- DataForSEO, Google Search Console, GA4, PageSpeed API, Moz/Bing backlink APIs, Playwright screenshots, and production header scans were not available.

## Priority Recommendations

### Critical

{bullet(critical)}

### High

{bullet(high)}

### Medium

{bullet(medium)}

### Low

{bullet(low)}
