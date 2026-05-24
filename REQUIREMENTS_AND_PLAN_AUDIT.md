# PixelFit Requirements and Development Plan Audit

Date: 2026-05-24
Target: `print.ymirtool.com`
Repository package: complete local project delivery

## Source documents audited

1. `第四项目_图像尺寸比例DPI安全区工具矩阵_需求文档.md`
2. `第四项目_图像尺寸比例DPI安全区工具矩阵_开发计划.md`

The implementation keeps PixelFit inside the existing Print Ready Tools site and does not create a separate site.

## Requirement coverage matrix

| Requirement | Status | Evidence |
|---|---:|---|
| PixelFit merged into `print.ymirtool.com` | Done | App Router project uses `siteUrl = https://print.ymirtool.com`; PixelFit is under `/image-size/` |
| Aspect Ratio Calculator | Done | `/image-size/aspect-ratio-calculator/`; ratio simplification, target dimensions, crop and padding fit |
| Print Size Calculator | Done | `/image-size/print-size-calculator/`; pixels to inch/cm/mm, megapixels, quality grade |
| DPI / PPI Calculator | Done | `/image-size/dpi-calculator/`; PPI from pixels and physical size; required pixels from target PPI |
| CM to Pixels Calculator | Done | `/image-size/cm-to-pixels/`; cm/mm/in ↔ px |
| A4 Size in Pixels | Done | `/image-size/a4-size-in-pixels/`; A0–A6, Letter, Legal, DPI, bleed and safe margin |
| YouTube Banner Safe Area Tool | Done | 2560×1440 canvas, 1546×423 safe area, desktop band and device variants in data |
| YouTube Thumbnail Safe Zone | Done | 16:9 presets, 3840×2160 recommendation, timer badge risk zone |
| Short Video Safe Zone Overlay | Done | 9:16 presets, top UI, right buttons, caption/CTA zone and caption length control |
| LinkedIn Banner Size & Safe Zone | Done | 4200×700 page cover, 400×400 logo, 1200×627 URL post presets, edge/lower-right risk zones |
| X Header Size Crop Preview | Done | 1500×500 header with top/bottom 60px crop-risk zones |
| Do not build full image editor | Done | No editing tools, filters, drawing, transformations or server processing |
| Do not build AI image generation | Done | No AI or image generation dependency/API |
| Do not build login/cloud save | Done | No auth, database, session or cloud storage code |
| Images local only | Done | `ImageUploadPreview` uses File API and `URL.createObjectURL`; no upload endpoint |
| Platform specs centralized | Done | `src/data/image-tools/imageSpecs.ts` |
| `sourceConfidence`, `sourceUrl`, `lastCheckedAt` per spec | Done | All P0 platform specs include all three fields |
| Every P0 page has a real tool | Done | `PixelFitClient.tsx` renders one tool mode per page kind |
| Result cards | Done | `ResultCard` used by all P0 tool implementations |
| FAQ | Done | `toolPages.ts`; visible FAQ and FAQ JSON-LD |
| Related internal links | Done | `RelatedTools` component and per-page `related` arrays |
| Source notes | Done | `Shell` renders formula/source section; platform pages show source details |
| Canonical metadata | Done | `generateMetadata` in `app/[...slug]/page.tsx` |
| Sitemap inclusion | Done | `allRoutes` includes `toolPages`; `app/sitemap.ts` maps `allRoutes` |
| No meta keywords | Done | Audit script checks for `meta keywords` and `keywords:` in layout |
| AdSense non-interference policy | Done within code scope | No manual ad units are inserted in input, result, upload, copy/download or overlay preview areas. Auto Ads script remains global from the existing site. |
| Transparent PNG/SVG overlay downloads | Done | `OverlayDownloadButtons` generates transparent SVG and PNG overlays |
| Mobile responsive layout | Done | CSS grid, horizontal nav fallback and mobile media query |
| Vercel stale build skip | Done | `vercel.json` uses `node scripts/skip-old-vercel-builds.mjs` |

## Development plan coverage

| Plan step | Status | Evidence |
|---|---:|---|
| Read both documents | Done | This audit and implementation are mapped to both document names |
| Audit package/routes/components/lib/data/sitemap/robots/layout/adsense/trust pages/vercel | Done | Existing equivalents are present and covered by audit script |
| Confirm route plan | Done | `/image-size` + 10 nested P0 routes |
| Build data layer | Done | `imageSpecs`, `paperSpecs`, `dpiPresets`, `toolPages`, `sourcePolicy` |
| Build calculation library | Done | `aspectRatio`, `dpi`, `printSize`, `paperSize`, `cropFit`, `megapixel`, `overlay`, `format` |
| Build components | Done | `SafeZoneCanvas`, `ImageUploadPreview`, `OverlayDownloadButtons`, `ResultCard`, `RiskBadge`, `CopyButton`, `RelatedTools` |
| Implement aggregate page | Done | `/image-size/` |
| Implement 10 P0 pages | Done | All listed P0 routes generated statically |
| Update sitemap/metadata/FAQ schema/breadcrumb/internal links | Done | `content.ts`, `sitemap.ts`, `generateMetadata`, JSON-LD scripts |
| Check AdSense/privacy/disclaimer | Done | Existing trust pages retained; global AdSense meta/script retained; privacy text updated for local image checks |
| Run lint/typecheck/build | Done | `CHECK_RESULTS.md`, `local-check-logs/` |
| Fix errors | Done | Current `check:all` passes |
| Package local project | Done | Final zip excludes `.next` and `node_modules` |

## Remaining external-only validation

These cannot be completed inside this offline container:

- GitHub push status after the user uploads this package.
- Vercel build trigger status after the new GitHub commit.
- Production deployment status after Vercel finishes.
- Live domain verification at `https://print.ymirtool.com/image-size/` after deployment.

## Residual risks

- Platform specifications can change. The data layer includes `lastCheckedAt` and `sourceConfidence` so future updates can be made centrally.
- Google Auto Ads placement is controlled by Google after load. The code does not place manual ads inside core tools, but final visual ad placement must be checked after deployment.
