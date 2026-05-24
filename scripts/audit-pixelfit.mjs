import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const mustExist = [
  'package.json','app/layout.tsx','app/page.tsx','app/[...slug]/page.tsx','app/sitemap.ts','app/robots.ts','app/globals.css','public/ads.txt','vercel.json','scripts/skip-old-vercel-builds.mjs',
  'src/data/image-tools/imageSpecs.ts','src/data/image-tools/paperSpecs.ts','src/data/image-tools/dpiPresets.ts','src/data/image-tools/toolPages.ts','src/data/image-tools/sourcePolicy.ts','src/data/image-tools/types.ts',
  'src/lib/image-tools/aspectRatio.ts','src/lib/image-tools/dpi.ts','src/lib/image-tools/printSize.ts','src/lib/image-tools/paperSize.ts','src/lib/image-tools/cropFit.ts','src/lib/image-tools/megapixel.ts','src/lib/image-tools/overlay.ts',
  'src/components/SafeZoneCanvas.tsx','src/components/ImageUploadPreview.tsx','src/components/OverlayDownloadButtons.tsx','src/components/ResultCard.tsx','src/components/RiskBadge.tsx','src/components/CopyButton.tsx','src/components/RelatedTools.tsx','src/components/PixelFitClient.tsx'
];
const p0Routes = ['aspect-ratio-calculator','print-size-calculator','dpi-calculator','cm-to-pixels','a4-size-in-pixels','youtube-banner-safe-area','youtube-thumbnail-safe-zone','short-video-safe-zone','linkedin-banner-size','x-header-size'];
const p1Routes = ['pinterest-pin-size-checker','pinterest-2-3-ratio-calculator','product-image-size-checker','google-shopping-image-size-checker','shopify-image-megapixel-calculator','instagram-image-without-cropping','universal-social-image-size-recommender','website-banner-crop-preview','hero-image-focal-point-preview','xiaohongshu-cover-size','xiaohongshu-image-no-crop','open-graph-image-checker'];
const p2Routes = ['google-play-asset-checker','google-play-feature-graphic-size','app-store-screenshot-size-matrix','iphone-screenshot-size-calculator','ipad-screenshot-size-calculator','etsy-listing-image-size','amazon-product-image-size','email-header-image-size','passport-id-photo-size-checker','figma-psd-overlay-download-hub','batch-social-media-export-plan'];
const p0Specs = ['youtube-banner','youtube-thumbnail','short-video-safe-zone','linkedin-banner','x-header'];
const p1Specs = ['pinterest-pin','google-shopping-image','shopify-image','instagram-feed','website-banner','hero-image','xiaohongshu-cover','open-graph'];
const p2Specs = ['google-play-assets','google-play-feature-graphic','app-store-screenshots','etsy-listing-image','amazon-product-image','email-header-image','passport-id-photo'];
let fail = false;
function check(condition, message) { if (condition) console.log(`PASS ${message}`); else { console.error(`FAIL ${message}`); fail = true; } }
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
for (const file of mustExist) check(fs.existsSync(path.join(root, file)), `exists: ${file}`);
const allText = mustExist.filter((f)=>fs.existsSync(path.join(root,f))).map(read).join('\n');
check(!/meta\s+name=["']keywords/i.test(allText) && !/keywords\s*:/i.test(read('app/layout.tsx')), 'no meta keywords');
check(!/upload\s*\(|fetch\([^)]*api/i.test(read('src/components/ImageUploadPreview.tsx')), 'image upload preview has no server upload call');
check(read('vercel.json').includes('node scripts/skip-old-vercel-builds.mjs'), 'vercel ignoreCommand uses script');
const toolPages = read('src/data/image-tools/toolPages.ts');
const pageCount = (toolPages.match(/href: '\/image-size\//g)||[]).length;
check(pageCount === 34, `image-size page count is 34 including hub, got ${pageCount}`);
for (const slug of p0Routes) check(toolPages.includes(`/image-size/${slug}/`), `P0 route present: /image-size/${slug}/`);
for (const slug of p1Routes) check(toolPages.includes(`/image-size/${slug}/`), `P1 route present: /image-size/${slug}/`);
for (const slug of p2Routes) check(toolPages.includes(`/image-size/${slug}/`), `P2 route present: /image-size/${slug}/`);
const specs = read('src/data/image-tools/imageSpecs.ts');
for (const spec of p0Specs) check(specs.includes(`id: '${spec}'`), `P0 spec present: ${spec}`);
for (const spec of p1Specs) check(specs.includes(`id: '${spec}'`), `P1 spec present: ${spec}`);
for (const spec of p2Specs) check(specs.includes(`id: '${spec}'`), `P2 spec present: ${spec}`);
const expectedSpecCount = p0Specs.length + p1Specs.length + p2Specs.length;
check((specs.match(/sourceConfidence:/g)||[]).length >= expectedSpecCount, 'each P0/P1 platform spec has sourceConfidence');
check((specs.match(/sourceUrl:/g)||[]).length >= expectedSpecCount, 'each P0/P1 platform spec has sourceUrl');
check((specs.match(/lastCheckedAt:/g)||[]).length >= expectedSpecCount, 'each P0/P1 platform spec has lastCheckedAt');
check(allText.includes('Download SVG overlay') && allText.includes('Download PNG overlay'), 'overlay SVG and PNG downloads implemented');
check(allText.includes('Your image stays in your browser') && allText.includes('We do not upload or store your file'), 'local image privacy notice present');
check(allText.includes('FAQPage') && allText.includes('BreadcrumbList'), 'FAQ and breadcrumb JSON-LD implemented');
for (const slug of [...p0Routes, ...p1Routes, ...p2Routes]) check(read('app/sitemap.ts').includes('allRoutes') && toolPages.includes(`/image-size/${slug}/`), `sitemap source includes /image-size/${slug}/`);
const pixelClient = read('src/components/PixelFitClient.tsx');
for (const token of ['ResultCard','CopyButton','RelatedTools','ImageUploadPreview','SafeZoneCanvas','OverlayDownloadButtons']) check(pixelClient.includes(token), `PixelFit client uses ${token}`);
for (const token of ['PinterestRatioTool','CheckTool','MegapixelTool','RecommenderTool','FocalTool']) check(pixelClient.includes(token), `P1 tool implemented: ${token}`);
for (const token of ['MatrixTool','OverlayHubTool','BatchPlanTool']) check(pixelClient.includes(token), `P2 tool implemented: ${token}`);
check(pixelClient.includes('Core calculators') && pixelClient.includes('Social and marketplace tools') && pixelClient.includes('Advanced export and store asset tools'), 'hub uses user-facing tool group labels');
check(pixelClient.includes('captionMode') && pixelClient.includes('Caption length'), 'short video caption length control implemented');
check(pixelClient.includes('Megapixels for this preset'), 'megapixel calculation surfaced in safe-zone result card');
check(pixelClient.includes('Manual checklist still required'), 'product checker avoids unsupported visual/AI diagnosis');
check(pixelClient.includes('object-position') || pixelClient.includes('focal point'), 'focal point guidance implemented');
check(read('app/page.tsx').includes("export const dynamic = 'force-dynamic'") === false, 'home page is not forced dynamic');
check(!read('src/components/PixelFitClient.tsx').includes('AdSense placements should stay outside'), 'no user-facing AdSense placement instruction');
check(!read('src/components/PixelFitClient.tsx').includes('P0 tools') && !read('src/components/PixelFitClient.tsx').includes('P1 expansion tools') && !read('src/components/PixelFitClient.tsx').includes('P2 complete-plan tools'), 'no user-facing P0/P1/P2 hub labels');
check(!read('src/data/image-tools/toolPages.ts').includes("title: 'Figma / PSD Overlay Download Hub'"), 'overlay hub title does not imply PSD export');
if (fail) process.exit(1);
console.log('PixelFit P0 + P1 + P2 full-plan audit passed.');
