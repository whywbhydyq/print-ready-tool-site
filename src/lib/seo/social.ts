import { absoluteUrl } from '@/src/lib/site';

export const defaultOgImage = {
  url: absoluteUrl('/og-image.png'),
  width: 1200,
  height: 630,
  alt: 'Print Ready Tools calculators for KDP covers, print size, DPI, bleed, and image checks'
};

export function openGraphImage() {
  return [defaultOgImage];
}

export function twitterImages() {
  return [defaultOgImage.url];
}
