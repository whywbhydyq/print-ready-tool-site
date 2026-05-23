export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://print-ready-tool-site.vercel.app').replace(/\/$/, '');

export function absoluteUrl(path = '/') {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
