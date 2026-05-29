import type { Metadata } from 'next';
import { KdpCoverHome } from '@/src/components/kdp/KdpCoverHome';
import { siteUrl } from '@/src/lib/site';

const description = 'Calculate KDP paperback cover size, spine width, bleed, barcode safe zone, trim spread, and 300 PPI pixel canvas from trim size, page count, paper type, and PPI.';

export const metadata: Metadata = {
  title: 'KDP Paperback Cover Size & Spine Calculator',
  description,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'KDP Paperback Cover Size & Spine Calculator',
    description,
    url: siteUrl,
    siteName: 'Print Ready Tools',
    type: 'website'
  },
  twitter: { card: 'summary', title: 'KDP Paperback Cover Size & Spine Calculator', description }
};

export default function Home() {
  return <KdpCoverHome />;
}
