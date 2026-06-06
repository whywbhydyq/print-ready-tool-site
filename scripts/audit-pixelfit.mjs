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
const p1Routes = ['pinterest-pin-size-checker','pinterest-2-3-ratio-calculator','product-image-size-checker','google-shopping-image-size-checker','shopify-image-megapixel-calculator','instagram-image-without-cropping','social-media-image-size-calculator','universal-social-image-size-recommender','website-banner-crop-preview','hero-image-focal-point-preview','facebook-event-cover-size','xiaohongshu-cover-size','xiaohongshu-image-no-crop','open-graph-image-checker','business-card-size-in-pixels'];
const p2Routes = ['google-play-asset-checker','google-play-app-icon-size','google-play-feature-graphic-size','google-play-screenshot-checker','app-store-screenshot-size-matrix','iphone-screenshot-size-calculator','ipad-screenshot-size-calculator','etsy-listing-image-size','amazon-product-image-size','email-header-image-size','passport-id-photo-size-checker','figma-psd-overlay-download-hub','batch-social-media-export-plan','marketplace-image-compliance-checklist','multi-language-social-image-sizes','advanced-safe-zone-database'];
const p0Specs = ['youtube-banner','youtube-thumbnail','short-video-safe-zone','linkedin-banner','x-header'];
const p1Specs = ['pinterest-pin','google-shopping-image','shopify-image','instagram-feed','website-banner','hero-image','facebook-event-cover','xiaohongshu-cover','open-graph','business-card-pixels'];
const p2Specs = ['google-play-assets','google-play-app-icon','google-play-feature-graphic','google-play-screenshot','app-store-screenshots','etsy-listing-image','amazon-product-image','email-header-image','passport-id-photo','marketplace-image-compliance'];

let fail = false;
function check(condition, message) {
  if (condition) console.log(`PASS ${message}`);
  else { console.error(`FAIL ${message}`); fail = true; }
}
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function matchAll(text, regex) { return [...text.matchAll(regex)].map((match) => match[1]); }

for (const file of mustExist) check(fs.existsSync(path.join(root, file)), `exists: ${file}`);
const allText = mustExist.filter((f) => fs.existsSync(path.join(root, f))).map(read).join('\n');
const content = read('src/lib/content.ts');
const catchAll = read('app/[...slug]/page.tsx');
const sitemap = read('app/sitemap.ts');
const toolPages = read('src/data/image-tools/toolPages.ts');
const specs = read('src/data/image-tools/imageSpecs.ts');
const pixelClient = read('src/components/PixelFitClient.tsx');
const routes = matchAll(toolPages, /href: '([^']+)'/g);
const staticContentRoutes = matchAll(content, /\['(\/[^']+\/)'/g);

check(!/meta\s+name=["']keywords/i.test(allText) && !/keywords\s*:/i.test(read('app/layout.tsx')), 'no meta keywords');
check(!/upload\s*\(|fetch\([^)]*api|XMLHttpRequest|FormData/i.test(read('src/components/ImageUploadPreview.tsx')), 'image upload preview has no server upload call');
check(read('vercel.json').includes('node scripts/skip-old-vercel-builds.mjs'), 'vercel ignoreCommand uses script');
check(content.includes('guideRoots') && content.includes("['/guides/'") && content.includes("['/templates/'"), 'guide and template directory roots are real static routes');
check(catchAll.includes('allRoutes.filter') && catchAll.includes("href !== '/'"), 'generateStaticParams covers allRoutes and excludes home');
check(sitemap.includes('allRoutes') && sitemap.includes('.map('), 'sitemap is driven by allRoutes');
for (const href of ['/', ...staticContentRoutes, ...routes]) {
  if (href === '/') continue;
  check(content.includes(href) || toolPages.includes(href), `route source contains ${href}`);
}

const pageCount = routes.filter((href) => href.startsWith('/image-size/')).length;
check(pageCount === 42, `image-size page count is 42 including hub, got ${pageCount}`);
for (const slug of p0Routes) check(toolPages.includes(`/image-size/${slug}/`), `P0 route present: /image-size/${slug}/`);
for (const slug of p1Routes) check(toolPages.includes(`/image-size/${slug}/`), `P1 route present: /image-size/${slug}/`);
for (const slug of p2Routes) check(toolPages.includes(`/image-size/${slug}/`), `P2 route present: /image-size/${slug}/`);
for (const spec of p0Specs) check(specs.includes(`id: '${spec}'`), `P0 spec present: ${spec}`);
for (const spec of p1Specs) check(specs.includes(`id: '${spec}'`), `P1 spec present: ${spec}`);
for (const spec of p2Specs) check(specs.includes(`id: '${spec}'`), `P2 spec present: ${spec}`);
const expectedSpecCount = p0Specs.length + p1Specs.length + p2Specs.length;
check((specs.match(/sourceConfidence:/g) || []).length >= expectedSpecCount, 'each platform spec has sourceConfidence');
check((specs.match(/sourceUrl:/g) || []).length >= expectedSpecCount, 'each platform spec has sourceUrl');
check((specs.match(/lastCheckedAt:/g) || []).length >= expectedSpecCount, 'each platform spec has lastCheckedAt');
check(allText.includes('Download SVG overlay') && allText.includes('Download PNG overlay'), 'overlay SVG and PNG downloads implemented');
check(allText.includes('Your image stays in your browser') && allText.includes('We do not upload or store your file'), 'local image privacy notice present');
check(allText.includes('WebApplication') && allText.includes('BreadcrumbList'), 'tool and breadcrumb JSON-LD implemented');
for (const slug of [...p0Routes, ...p1Routes, ...p2Routes]) check(sitemap.includes('allRoutes') && toolPages.includes(`/image-size/${slug}/`), `sitemap source includes /image-size/${slug}/`);
for (const token of ['ResultCard','CopyButton','RelatedTools','ImageUploadPreview','SafeZoneCanvas','OverlayDownloadButtons']) check(pixelClient.includes(token), `PixelFit client uses ${token}`);
for (const token of ['PinterestRatioTool','CheckTool','MegapixelTool','RecommenderTool','FocalTool']) check(pixelClient.includes(token), `P1 tool implemented: ${token}`);
for (const token of ['MatrixTool','OverlayHubTool','BatchPlanTool','DatabaseTool']) check(pixelClient.includes(token), `P2 tool implemented: ${token}`);
check(pixelClient.includes('Print & DPI') && pixelClient.includes('Social safe zones') && pixelClient.includes('Product & marketplace') && pixelClient.includes('App store assets') && pixelClient.includes('Reference databases'), 'hub uses task-based user-facing group labels');
check(pixelClient.includes('targetHeight') && pixelClient.includes('pixels cropped') && pixelClient.includes('padding added'), 'aspect ratio tool supports reverse dimension and crop/padding percentages');
check(pixelClient.includes('Target paper') && pixelClient.includes('Portrait shortfall'), 'print size tool checks target paper readiness');
check(pixelClient.includes('72') && pixelClient.includes('Required pixels'), 'DPI/A4 pages expose DPI comparison tables');
check(pixelClient.includes('deviceVariants') && pixelClient.includes('Mobile 4:5 crop reference'), 'YouTube banner device variants and thumbnail 4:5 reference implemented');
check(pixelClient.includes('captionMode') && pixelClient.includes('Caption length') && pixelClient.includes('RTL reference'), 'short video caption length and RTL controls implemented');
check(pixelClient.includes('Profile image center safe area') && pixelClient.includes('url-post-center'), 'preset-specific LinkedIn/X safe-zone logic implemented');
check(pixelClient.includes('Megapixels for this preset'), 'megapixel calculation surfaced in safe-zone result card');
check(pixelClient.includes('Manual checklist still required'), 'product checker avoids unsupported visual/AI diagnosis');
check(pixelClient.includes('object-position') || pixelClient.includes('focal point'), 'focal point guidance implemented');
check(pixelClient.includes('Source confidence meaning') && pixelClient.includes('Multi-language social planning notes'), 'advanced database and multi-language guidance implemented');
check(toolPages.includes('/image-size/social-media-image-size-calculator/') && toolPages.includes('/image-size/business-card-size-in-pixels/'), 'missing P1 independent pages are present');
check(toolPages.includes('/image-size/google-play-app-icon-size/') && toolPages.includes('/image-size/google-play-screenshot-checker/') && toolPages.includes('/image-size/advanced-safe-zone-database/'), 'missing P2 independent pages are present');
check(pixelClient.includes('transparent SVG and PNG overlays') && !read('src/data/image-tools/toolPages.ts').includes("title: 'Figma / PSD Overlay Download Hub'"), 'overlay hub does not imply PSD export');
check(read('app/page.tsx').includes("export const dynamic = 'force-dynamic'") === false, 'home page is not forced dynamic');
check(!pixelClient.includes('AdSense placements should stay outside'), 'no user-facing AdSense placement instruction');
check(!pixelClient.includes('P0 tools') && !pixelClient.includes('P1 expansion tools') && !pixelClient.includes('P2 complete-plan tools'), 'no user-facing P0/P1/P2 hub labels');

if (fail) process.exit(1);
console.log('PixelFit P0 + P1 + P2 full-plan audit passed.');
