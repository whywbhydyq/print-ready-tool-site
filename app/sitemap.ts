import type { MetadataRoute } from 'next';
import { allRoutes } from '@/src/lib/content';
import { absoluteUrl } from '@/src/lib/site';

const lastModified = new Date('2026-05-24');

const primaryRoutes = new Set([
  '/',
  '/kdp-cover-calculator/',
  '/guides/kdp-spine-width-calculator/',
  '/guides/kdp-paperback-cover-rejection-checklist/',
  '/templates/kdp-cover-setup-checklist/'
]);

const lowerPriorityImageRoutes = new Set([
  '/image-size/print-size-calculator/',
  '/image-size/dpi-calculator/',
  '/image-size/image-print-quality-checker/'
]);

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes.map((path) => ({
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
