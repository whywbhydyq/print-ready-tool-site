# ACTION-PLAN.md — Print Ready Tools SEO Remediation Plan

Date: 2026-06-06 Asia/Tokyo  
Scope: local SEO skill audit of `print-ready-tool-site`  
Constraints honored: no `npm run build`; no test scripts.

## Immediate acceptance gates

The project should not be treated as SEO-clean until these gates pass locally:

1. `npm run typecheck` passes.
2. `npm run lint` passes.
3. `npm audit --omit=dev` has no high/moderate production dependency issue or has a documented exception.
4. Local crawler confirms all canonical routes return 200.
5. High-value calculator routes render actual tool UI, not fallback text.

## Critical — fix first

### 1. Upgrade vulnerable dependencies

Target files:
- `package.json`
- `package-lock.json`

Work:
- Upgrade `next`, `eslint-config-next`, and any transitive `postcss`/`glob` chain as needed.
- Re-run `npm ci --ignore-scripts`, `npm run typecheck`, `npm run lint`, and `npm audit --omit=dev`.
- Do not execute `npm run build` under the current instruction set.

Acceptance:
- Production audit has no high/moderate vulnerabilities or the remaining item is explicitly justified with mitigation.

### 2. Replace calculator stubs with actual tools

Target URLs:
- `/kdp-interior-bleed-calculator/`
- `/image-print-quality-checker/`
- `/bleed-safe-zone-calculator/`
- `/etsy-printable-size-calculator/`
- `/common-print-sizes/`

Work:
- Add dedicated React components or route rendering branches.
- Each page needs inputs, formula explanation, computed result, copy action, source/limitation note, and related next step.
- Do not downgrade page titles or descriptions to match the current weak implementation.

Acceptance:
- Each route has >450 useful words or equivalent tool UI content.
- Each route contains visible input controls and deterministic output.
- Local crawl classifies each as a fulfilled tool page.

## High — next batch

### 3. Expand thin guides and template pages

Target groups:
- `/guides/` hub
- 8 short basic guide pages
- `/templates/` hub and 3 template pages

Work:
- Convert hub pages into categorized internal-link hubs.
- Add examples, tables, common mistakes, source notes, and CTA to relevant calculators.
- Ensure each basic guide answers the query without relying on generic fallback sections.

Acceptance:
- Important guides/templates exceed 350–600 words or include useful tables/templates.
- No high-value guide uses the generic fallback body.

### 4. Add structured data by page type

Target files:
- `app/layout.tsx`
- `src/components/PixelFitClient.tsx`
- `src/components/PrintArticlePage.tsx`
- `src/components/kdp/KdpCoverHome.tsx`
- new shared helper, e.g. `src/lib/seo/jsonLd.ts`

Work:
- Add site-wide `Organization` and `WebSite` graph.
- Add `WebApplication`/`SoftwareApplication` to real calculator/tool pages.
- Keep `BreadcrumbList` where relevant.
- Reduce broad FAQPage use where it does not create durable value under the supplied skill rules.
- Escape JSON-LD with `JSON.stringify(data).replace(/</g, '\u003c')`.

Acceptance:
- JSON-LD parses on all high-value pages.
- No generic tool route has zero structured data.
- No direct unescaped JSON-LD injection remains.

### 5. Add explicit security headers

Target file:
- `next.config.mjs` or `vercel.json`

Recommended headers:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` with unnecessary browser APIs disabled
- CSP with allowance for required Next.js and AdSense scripts
- HSTS at platform/proxy level after HTTPS validation

Acceptance:
- Production header scan confirms headers are present.
- AdSense still loads on eligible pages.

## Medium — SEO growth layer

### 6. Add AI-search-ready summaries

Work:
- Add `/llms.txt` or `/ai-search/` with concise tool inventory, canonical URLs, source policy, and limitations.
- Add visible “sources checked” or “last checked” sections to image spec pages where source data exists.

Acceptance:
- AI crawlers and answer engines can extract the site purpose, canonical tools, and factual boundaries without executing JS.

### 7. Improve metadata quality

Work:
- Rewrite short meta descriptions for calculators, guides, and PixelFit pages to 120–155 characters.
- Keep title length generally in the 35–60 character range before site suffix where possible.

Acceptance:
- No high-priority page has description under 80 characters.
- Duplicate title/description pairs are limited to intentional canonical aliases only.

### 8. Improve sitemap precision

Work:
- Track article/tool updated dates and emit per-route `lastModified` instead of a global date.
- Keep non-canonical aliases excluded from sitemap.

Acceptance:
- Sitemap remains 200 locally.
- Canonical URLs only.
- Updated dates reflect source content where available.

## Low — maintenance

### 9. Add deterministic local SEO crawl script

Work:
- Create a script that starts from known route manifest or localhost and checks status, title, description, canonical, H1, word count, JSON-LD parseability, and internal links.
- Store results in `local-check-logs/` or `.seo-cache/`.

Acceptance:
- Script can run without external APIs.
- Script does not invoke build or test commands.

## Recommended next execution order

1. Dependency upgrade and audit remediation.
2. Real calculator implementations for the five under-fulfilled tool URLs.
3. Structured data helper + WebApplication schemas.
4. Thin content expansion for guide/template hubs.
5. Security headers and production header verification.
6. Optional PDF client report generation after fixes are complete.
