import type { MetadataRoute } from 'next';
import { allRoutes } from '@/src/lib/content';
import { absoluteUrl } from '@/src/lib/site';

const lastModified = new Date('2026-05-30');

const primaryRoutes = new Set([
  '/',
  '/guides/kdp-spine-width-calculator/',
  '/guides/kdp-6x9-120-page-cover-size/',
  '/guides/kdp-5-5x8-5-200-page-cover-size/',
  '/guides/kdp-8-5x11-120-page-workbook-cover-size/',
  '/guides/kdp-paperback-cover-rejection-checklist/',
  '/templates/kdp-cover-setup-checklist/',
  '/guides/kdp-paperback-cover-size-formula/',
  '/guides/kdp-cover-size-with-bleed/',
  '/guides/kdp-cover-pixel-size-300-dpi/',
  '/guides/kdp-barcode-safe-zone/',
  '/guides/kdp-trim-size-page-count/',
  '/guides/kdp-cover-template-guide/',
  '/guides/kdp-spine-text-requirements/',
  '/guides/kdp-paperback-cover-pdf-requirements/',
  '/guides/kdp-cover-safe-margin/',
  '/guides/kdp-own-barcode-vs-amazon-barcode/',
  '/guides/kdp-cover-300-dpi-image-quality/',
  '/guides/kdp-cover-color-cmyk-rgb-guide/',
  '/guides/kdp-right-to-left-cover-layout/',
  '/guides/kdp-low-content-book-cover-setup/'
]);

const lowerPriorityImageRoutes = new Set([
  '/image-size/print-size-calculator/',
  '/image-size/dpi-calculator/',
  '/image-size/image-print-quality-checker/'
]);

const nonCanonicalRoutes = new Set([
  '/kdp-cover-calculator/',
  '/image-size/print-size-calculator/',
  '/image-size/dpi-calculator/'
]);

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes.filter((path) => !nonCanonicalRoutes.has(path)).map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === '/' ? 'weekly' : path.includes('calculator') || path.includes('safe') ? 'weekly' : 'monthly',
    priority: primaryRoutes.has(path)
      ? path === '/' ? 1 : 0.9
      : lowerPriorityImageRoutes.has(path)
        ? 0.5
        : path.startsWith('/image-size')
          ? 0.65
          : path.includes('calculator')
            ? 0.8
            : 0.6
  }));
}
