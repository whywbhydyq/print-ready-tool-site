import type { MetadataRoute } from 'next';
import { allRoutes } from '@/src/lib/content';
const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://print-ready-tool-site.vercel.app').replace(/\/$/, '');
export default function sitemap(): MetadataRoute.Sitemap { return allRoutes.map((path) => ({ url: `${base}${path}`, lastModified: new Date('2026-05-22'), changeFrequency: path === '/' ? 'weekly' : 'monthly', priority: path === '/' ? 1 : path.includes('calculator') ? 0.9 : 0.7 })); }
