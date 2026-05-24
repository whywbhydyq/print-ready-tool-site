import type { MetadataRoute } from 'next';
import { allRoutes } from '@/src/lib/content';
import { absoluteUrl } from '@/src/lib/site';

const lastModified = new Date('2026-05-24');

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === '/' ? 'weekly' : path.includes('calculator') ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path.includes('calculator') ? 0.9 : 0.7
  }));
}
