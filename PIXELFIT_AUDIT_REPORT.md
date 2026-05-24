# PixelFit MVP Audit Report

Date: 2026-05-24
Target domain: `print.ymirtool.com`
Project name: PixelFit

## Documents followed

1. `第四项目_图像尺寸比例DPI安全区工具矩阵_需求文档.md`
2. `第四项目_图像尺寸比例DPI安全区工具矩阵_开发计划.md`

## Scope implemented

- Aspect Ratio Calculator
- Print Size Calculator
- DPI / PPI Calculator
- CM to Pixels Calculator
- A4 Size in Pixels
- YouTube Banner Safe Area Tool
- YouTube Thumbnail Safe Zone
- Short Video Safe Zone Overlay
- LinkedIn Banner Size & Safe Zone
- X Header Size Crop Preview

## Forbidden scope excluded

- No full image editor
- No AI image generation
- No login
- No cloud save
- No server-side image upload
- No batch compression or specified-KB compression
- No OCR or automatic subject detection
- No meta keywords

## Data architecture

Platform and paper data are centralized in `src/data/image-tools/`:

- `imageSpecs.ts`
- `paperSpecs.ts`
- `dpiPresets.ts`
- `toolPages.ts`
- `sourcePolicy.ts`
- `types.ts`

Every P0 platform spec has `sourceConfidence`, `sourceUrl` and `lastCheckedAt`.

## Calculations

Formula coverage is implemented in `src/lib/image-tools/`:

- aspect ratio simplification, target dimensions, crop fit, padding fit
- px, inch, cm, mm and PPI conversion
- print size and required pixel calculation
- A-series and US paper pixel dimensions with bleed and safe margin
- megapixel calculation
- SVG/PNG overlay generation

Calculation smoke tests are in `scripts/test-pixelfit-calculations.mjs`.

## Pages and SEO

All PixelFit P0 pages include a real interactive tool, result card, FAQ, related internal links, canonical metadata through `generateMetadata`, sitemap inclusion, source or formula note, breadcrumb JSON-LD, FAQ JSON-LD, and no meta keywords.

## Final audit result

`npm run check:all` passes after final fixes.
