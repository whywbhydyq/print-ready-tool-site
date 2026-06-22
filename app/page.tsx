import type { Metadata } from 'next';
import { KdpCoverHome } from '@/src/components/kdp/KdpCoverHome';
import { siteUrl } from '@/src/lib/site';
import { openGraphImage, twitterImages } from '@/src/lib/seo/social';

const description = 'Use this KDP cover calculator to calculate paperback cover size, spine width, bleed, barcode zone, trim spread, and 300 PPI pixel canvas.';

export const metadata: Metadata = {
  title: 'KDP Cover Calculator - Spine & Bleed | Print Ready Tools',
  description,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'KDP Cover Calculator - Spine & Bleed | Print Ready Tools',
    description,
    url: siteUrl,
    siteName: 'Print Ready Tools',
    type: 'website',
    images: openGraphImage()
  },
  twitter: { card: 'summary_large_image', title: 'KDP Cover Calculator - Spine & Bleed | Print Ready Tools', description, images: twitterImages() }
};

export default function Home() {
  return <KdpCoverHome />;
}
