import type { Metadata } from 'next';
import { KdpCoverHome } from '@/src/components/kdp/KdpCoverHome';
import { siteUrl } from '@/src/lib/site';

const description = 'Calculate KDP paperback cover size, spine width, bleed, barcode safe zone, and pixel canvas from trim size, page count, paper type, and interior type.';

export const metadata: Metadata = {
  title: 'KDP Cover Size & Spine Calculator - Print Ready Tool',
  description,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'KDP Cover Size & Spine Calculator',
    description,
    url: siteUrl,
    siteName: 'Print Ready Tools',
    type: 'website'
  }
};

export default function Home() {
  return <KdpCoverHome />;
}
