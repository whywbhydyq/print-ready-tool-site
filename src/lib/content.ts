import { toolPages } from '@/src/data/image-tools';
import { articleRouteTuples } from '@/src/lib/printArticles';

export type RouteTuple = readonly [string, string, string];

export const coreTools = [
  ['/', 'KDP Cover Calculator - Spine & Bleed', 'Calculate paperback cover size, spine width, bleed, barcode safe zone, trim spread, and pixel canvas for KDP uploads.'],
  ['/kdp-interior-bleed-calculator/', 'KDP Interior Bleed Calculator', 'Calculate KDP manuscript trim size, full-bleed page size, safe margin, and export pixels before uploading paperback interiors.'],
  ['/image-size/', 'PixelFit Image Size Tools', 'Aspect ratio, DPI, A4 pixels and social safe-zone overlays for local image checks.'],
  ['/print-size-calculator/', 'Print Size Calculator', 'Convert pixels to inches, centimetres, millimetres, and required print pixels by DPI for posters, photos, PDFs, and artwork.'],
  ['/dpi-calculator/', 'DPI Calculator', 'Calculate effective DPI, required pixels, maximum print size, and print-quality grade for artwork, photos, posters, and PDFs.'],
  ['/image-print-quality-checker/', 'Image Print Quality Checker', 'Check a local image against target print dimensions and see effective PPI, shortfall, quality grade, and required pixels.'],
  ['/bleed-safe-zone-calculator/', 'Bleed & Safe Zone Calculator', 'Calculate trim size, full-bleed canvas, safe-zone rectangle, and pixel dimensions for print layouts and marketplace files.'],
  ['/etsy-printable-size-calculator/', 'Etsy Printable Size Pack Calculator', 'Generate Etsy printable ratio pack sizes, 300 DPI pixel exports, and buyer instruction text for wall-art downloads.'],
  ['/common-print-sizes/', 'Common Print Sizes Library', 'Reference common photo, poster, document, card, and marketplace print sizes in inches, cm, mm, and pixels by PPI.']
] as const satisfies readonly RouteTuple[];

export const guideRoots = [
  ['/guides/', 'Print-Ready Guides', 'Browse print-ready guides for DPI, bleed, safe zones, common print sizes, KDP covers, and Etsy printable setup workflows.'],
  ['/templates/', 'Print-Ready Templates', 'Copy reusable print-ready checklists and buyer instruction templates for Etsy downloads, KDP covers, and PDF delivery.']
] as const satisfies readonly RouteTuple[];

export const guides = [
  ['/guides/8x10-print-size-pixels-300-dpi/', '8x10 Print Size in Pixels at 300 DPI', 'Calculate 8×10 print pixels at 300 DPI, compare lower PPI options, and understand cropping before exporting art or photos.'],
  ['/guides/a4-size-in-pixels-300-dpi/', 'A4 Size in Pixels at 300 DPI', 'Calculate A4 size in pixels at 300 DPI, compare 200 and 150 PPI, and add bleed for printer-ready A4 files.'],
  ['/guides/24x36-poster-size-pixels/', '24x36 Poster Size in Pixels', 'Calculate 24×36 poster pixels at 300, 200, and 150 PPI, with bleed and viewing-distance guidance for large prints.'],
  ['/guides/business-card-bleed-size/', 'Business Card Bleed Size', 'Calculate business card trim, bleed, safe margin, and 300 DPI pixel dimensions for common US and metric print layouts.'],
  ['/guides/canva-print-bleed-crop-marks/', 'Canva Print Bleed and Crop Marks', 'Set up Canva print bleed, crop marks, safe margins, and PDF export options before sending artwork to a printer.'],
  ['/guides/kdp-6x9-cover-size/', 'KDP 6x9 Cover Size', 'Calculate a 6×9 paperback cover with spine width, bleed, barcode safety, and 300 PPI canvas before designing the PDF.'],
  ['/guides/kdp-6x9-120-page-cover-size/', 'KDP 6x9 Cover Size for 120 Pages', 'Review preset 6×9 paperback cover dimensions for 120 black-and-white pages, including spine, bleed, and pixel canvas.'],
  ['/guides/kdp-5-5x8-5-200-page-cover-size/', 'KDP 5.5x8.5 Cover Size for 200 Pages', 'Review preset 5.5×8.5 cream-paper paperback cover dimensions for 200 pages, including spine, bleed, and export pixels.'],
  ['/guides/kdp-8-5x11-120-page-workbook-cover-size/', 'KDP 8.5x11 Workbook Cover Size for 120 Pages', 'Review preset 8.5×11 standard-color workbook cover dimensions for 120 pages, including spine, bleed, and cover pixels.'],
  ['/guides/kdp-spine-width-calculator/', 'KDP Spine Width Calculator', 'Calculate KDP paperback spine width from page count and paper multiplier, then use it in the full cover size formula.'],
  ['/guides/kdp-paperback-cover-rejection-checklist/', 'KDP Paperback Cover Rejection Checklist', 'Avoid KDP paperback cover upload mistakes around trim size, spine width, bleed, barcode space, and PDF export.'],
  ['/guides/kdp-paperback-cover-size-formula/', 'KDP Paperback Cover Size Formula', 'Calculate back cover, spine, front cover and bleed as one continuous cover file.'],
  ['/guides/kdp-cover-size-with-bleed/', 'KDP Cover Size With Bleed', 'Understand how bleed changes a KDP paperback cover canvas, full spread width, trim spread, and exported pixel dimensions.'],
  ['/guides/kdp-cover-pixel-size-300-dpi/', 'KDP Cover Pixel Size at 300 PPI', 'Convert KDP cover dimensions in inches into a print-ready 300 PPI pixel canvas for Photoshop, Canva, Affinity, or InDesign.'],
  ['/guides/kdp-barcode-safe-zone/', 'KDP Barcode Safe Zone', 'Plan the KDP back-cover barcode safe zone before placing text, logos, QR codes, background art, or an author photo.'],
  ['/guides/kdp-trim-size-page-count/', 'KDP Trim Size and Page Count Guide', 'Choose a KDP trim size and understand page-count limits before calculating spine width, bleed, and full cover dimensions.'],
  ['/guides/kdp-cover-template-guide/', 'KDP Cover Template Guide', 'Use official KDP templates and guide layers for bleed, trim, spine, barcode, safe margins, and final cover proofing.'],
  ['/guides/kdp-spine-text-requirements/', 'KDP Spine Text Requirements', 'Know when KDP paperback spine text is allowed, how to keep it inside the spine, and when to leave the spine blank.'],
  ['/guides/kdp-paperback-cover-pdf-requirements/', 'KDP Paperback Cover PDF Requirements', 'Prepare a one-piece KDP back-spine-front cover PDF with fonts, layers, bleed, barcode space, and preview checks handled correctly.'],
  ['/guides/kdp-cover-safe-margin/', 'KDP Cover Safe Margin Guide', 'Keep important KDP cover text and art away from trim, spine folds, barcode placement, and other safe-margin risk areas.'],
  ['/guides/kdp-own-barcode-vs-amazon-barcode/', 'KDP Own Barcode vs Amazon Barcode', 'Compare uploading your own ISBN barcode with leaving space for KDP to place one, including layout and rejection risks.'],
  ['/guides/kdp-cover-300-dpi-image-quality/', 'KDP Cover Image Quality and 300 DPI', 'Check KDP cover image resolution, effective DPI, placed-image quality, and 300 PPI export risk before uploading a paperback cover.'],
  ['/guides/kdp-cover-color-cmyk-rgb-guide/', 'KDP Cover Color, CMYK, RGB and Spot Colors', 'Avoid KDP cover color-space, RGB, CMYK, transparency, and spot-color issues before exporting the final paperback PDF.'],
  ['/guides/kdp-right-to-left-cover-layout/', 'KDP Right-to-Left Cover Layout', 'Understand how right-to-left reading direction changes KDP front cover, back cover, spine order, and barcode placement.'],
  ['/guides/kdp-low-content-book-cover-setup/', 'KDP Low-Content Book Cover Setup', 'Set up KDP low-content paperback covers for journals, notebooks, planners, and workbooks with trim, spine, and bleed checks.'],
  ['/guides/etsy-printable-wall-art-sizes/', 'Etsy Printable Wall Art Sizes', 'Plan Etsy printable wall art sizes with multiple ratio files, frame examples, pixel exports, and buyer instructions.'],
  ['/guides/etsy-printable-ratio-guide/', 'Etsy Printable Ratio Guide', 'Understand Etsy printable ratios including 2:3, 3:4, 4:5, 5:7, 11:14, ISO A sizes, and square files.']
] as const satisfies readonly RouteTuple[];

export const templates = [
  ['/templates/etsy-buyer-instruction-template/', 'Etsy Buyer Instruction Template', 'Copy an Etsy digital printable buyer instruction template with ratio notes, printing steps, color caveats, and usage terms.'],
  ['/templates/kdp-cover-setup-checklist/', 'KDP Cover Setup Checklist', 'Use a KDP paperback cover setup checklist for trim size, page count, spine width, bleed, barcode space, and PDF export.'],
  ['/templates/print-ready-pdf-checklist/', 'Print-Ready PDF Checklist', 'Check print-ready PDF page size, bleed, safe margins, embedded fonts, image resolution, color settings, and proofing steps.']
] as const satisfies readonly RouteTuple[];

export const trust = [
  ['/about/', 'About', 'Learn what Print Ready Tools provides, how PixelFit image tools work locally in the browser, and where calculator limits apply.'],
  ['/contact/', 'Contact', 'Contact Print Ready Tools for specification corrections, source updates, bug reports, and print calculator feature requests.'],
  ['/privacy/', 'Privacy Policy', 'Read the privacy policy for browser-based print calculators and local image tools that avoid uploading user image files.'],
  ['/terms/', 'Terms', 'Review terms for using free print-ready calculators, KDP cover estimates, PixelFit image checks, and marketplace guidance.'],
  ['/disclaimer/', 'Disclaimer', 'Understand limits of print calculator estimates, safe-zone overlays, KDP guidance, Etsy ratios, and marketplace image checks.'],
  ['/glossary/', 'Glossary', 'Look up definitions for DPI, PPI, bleed, safe zone, trim size, aspect ratio, pixels, megapixels, and print canvas terms.'],
  ['/sources/', 'Source Library', 'Review the external source library used for KDP cover, print-size, marketplace image, app store image, and social media image specifications.'],
  ['/content-clusters/', 'Print-Ready Content Cluster Map', 'Explore the site topic-cluster architecture for KDP covers, DPI, bleed, Etsy printable products, and platform image-size tools.']
] as const satisfies readonly RouteTuple[];

export const staticContentRoutes = [...coreTools, ...guideRoots, ...guides, ...templates, ...trust] as const;

export const allRoutes = [
  '/',
  ...staticContentRoutes.map((route) => route[0]),
  ...articleRouteTuples.map((route) => route[0]),
  ...toolPages.map((tool) => tool.href)
].filter((value, index, array) => array.indexOf(value) === index);

export function byPath(path: string): RouteTuple | undefined {
  return staticContentRoutes.find((item) => item[0] === path);
}
