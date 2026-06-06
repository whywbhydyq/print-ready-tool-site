const TITLE_OVERRIDES: Record<string, string> = {
  '/about/': 'About Print Ready Tools',
  '/contact/': 'Contact Print Ready Tools',
  '/terms/': 'Terms of Use',
  '/glossary/': 'Print Size Glossary',
  '/guides/kdp-8-5x11-120-page-workbook-cover-size/': 'KDP 8.5×11 Workbook Cover',
  '/guides/kdp-barcode-safe-zone/': 'KDP Barcode Safe Zone',
  '/guides/kdp-cover-300-dpi-image-quality/': 'KDP Cover 300 DPI Image Quality',
  '/guides/kdp-cover-color-cmyk-rgb-guide/': 'KDP Cover Color Guide',
  '/guides/kdp-low-content-book-cover-setup/': 'KDP Low-Content Cover Setup',
  '/image-size/figma-psd-overlay-download-hub/': 'SVG and PNG Overlay Hub',
  '/content-clusters/': 'Print-Ready Content Cluster Map'
};

const META_SUFFIXES = {
  coreTool: ' Enter your own dimensions, review the formulas, copy the result, and verify the final output against printer or platform requirements.',
  imageTool: ' Use local browser checks to compare ratios, pixels, safe zones, file-size limits, and export decisions before publishing.',
  guide: ' Use the examples, formulas, and related calculators to verify the final export before sending files to a printer.',
  template: ' Copy the checklist text, adapt it to your product, and verify dimensions before publishing or delivery.',
  trust: ' Review the site scope, limitations, local image handling, and verification rules before relying on calculator output.'
} as const;

function routeSuffix(path: string) {
  if (path.startsWith('/image-size/')) return META_SUFFIXES.imageTool;
  if (path.startsWith('/guides/')) return META_SUFFIXES.guide;
  if (path.startsWith('/templates/')) return META_SUFFIXES.template;
  if (['/about/', '/contact/', '/privacy/', '/terms/', '/disclaimer/', '/glossary/', '/sources/', '/content-clusters/'].includes(path)) return META_SUFFIXES.trust;
  return META_SUFFIXES.coreTool;
}

function trimAtWord(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const slice = value.slice(0, maxLength + 1);
  const lastSpace = slice.lastIndexOf(' ');
  return `${slice.slice(0, lastSpace > 110 ? lastSpace : maxLength).replace(/[\s,.;:]+$/, '')}.`;
}

export function pageSeoTitle(path: string, title: string) {
  return TITLE_OVERRIDES[path] || title;
}

export function pageSeoDescription(path: string, description: string) {
  const clean = description.trim().replace(/\s+/g, ' ');
  if (clean.length >= 120 && clean.length <= 155) return clean;
  if (clean.length > 155) return trimAtWord(clean, 155);
  const expanded = `${clean}${routeSuffix(path)}`;
  const normalized = trimAtWord(expanded, 155);
  if (normalized.length >= 120) return normalized;
  return trimAtWord(`${clean} Use this page to check dimensions, compare risks, copy results, and confirm final requirements before exporting.`, 155);
}
