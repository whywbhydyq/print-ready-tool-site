export const productionSiteUrl = 'https://print.ymirtool.com';
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || productionSiteUrl).replace(/\/$/, '');
export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}
