import type { MetadataRoute } from 'next';
import { allRoutes } from '@/src/lib/content';
import { absoluteUrl } from '@/src/lib/site';
import { getRouteLastModified } from '@/src/lib/seo/routeLastModified';

const nonCanonicalRoutes = new Set([
  '/kdp-cover-calculator/',
  '/image-size/print-size-calculator/',
  '/image-size/dpi-calculator/'
]);

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes.filter((path) => !nonCanonicalRoutes.has(path)).map((path) => ({
    url: absoluteUrl(path),
    lastModified: getRouteLastModified(path)
  }));
}
