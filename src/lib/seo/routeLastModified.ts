import { toolPages } from '@/src/data/image-tools/toolPages';
import { imageSpecs } from '@/src/data/image-tools/imageSpecs';
import { printArticles } from '@/src/lib/printArticles';
import { staticPages } from '@/src/lib/staticPageContent';

const siteRefreshDate = '2026-06-06';

const specLastCheckedById = Object.fromEntries(imageSpecs.map((spec) => [spec.id, spec.lastCheckedAt]));
const articleDateByPath = Object.fromEntries(printArticles.map((article) => [article.path, article.updated]));
const staticDateByPath = Object.fromEntries(staticPages.map((page) => [page.path, page.updated]));
const pixelDateByPath = Object.fromEntries(toolPages.map((page) => [page.href, page.specId ? specLastCheckedById[page.specId] || siteRefreshDate : siteRefreshDate]));

const staticToolDates: Record<string, string> = {
  '/': siteRefreshDate,
  '/kdp-interior-bleed-calculator/': siteRefreshDate,
  '/image-print-quality-checker/': siteRefreshDate,
  '/bleed-safe-zone-calculator/': siteRefreshDate,
  '/etsy-printable-size-calculator/': siteRefreshDate,
  '/common-print-sizes/': siteRefreshDate,
  '/print-size-calculator/': siteRefreshDate,
  '/dpi-calculator/': siteRefreshDate,
  '/image-size/': siteRefreshDate
};

const trustDates: Record<string, string> = {
  '/about/': siteRefreshDate,
  '/contact/': siteRefreshDate,
  '/privacy/': siteRefreshDate,
  '/terms/': siteRefreshDate,
  '/disclaimer/': siteRefreshDate,
  '/glossary/': siteRefreshDate,
  '/sources/': siteRefreshDate,
  '/content-clusters/': siteRefreshDate
};

export const routeLastModifiedByPath: Record<string, string> = {
  ...pixelDateByPath,
  ...articleDateByPath,
  ...staticDateByPath,
  ...staticToolDates,
  ...trustDates
};

export function getRouteLastModified(path: string): Date {
  return new Date(routeLastModifiedByPath[path] || siteRefreshDate);
}
