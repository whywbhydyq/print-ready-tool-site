import type { MetadataRoute } from 'next';
import { allRoutes } from '@/src/lib/content';
import { absoluteUrl } from '@/src/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date('2026-05-23'),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path.includes('calculator') ? 0.9 : 0.7
  }));
}
