import type { Metadata } from 'next';
import { KdpCoverHome } from '@/src/components/kdp/KdpCoverHome';
import { siteUrl } from '@/src/lib/site';
import { openGraphImage, twitterImages } from '@/src/lib/seo/social';

const description = 'Calculate KDP paperback cover size, spine width, bleed, barcode zone, trim spread, and pixel canvas. Enter trim size, page count, paper type, and PPI.';

export const metadata: Metadata = {
  title: 'KDP Cover Size & Spine Calculator | Print Ready Tools',
  description,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'KDP Cover Size & Spine Calculator | Print Ready Tools',
    description,
    url: siteUrl,
    siteName: 'Print Ready Tools',
    type: 'website',
    images: openGraphImage()
  },
  twitter: { card: 'summary_large_image', title: 'KDP Cover Size & Spine Calculator | Print Ready Tools', description, images: twitterImages() }
};

export default function Home() {
  return <KdpCoverHome />;
}
