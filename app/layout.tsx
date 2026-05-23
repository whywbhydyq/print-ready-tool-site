import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import { siteUrl } from '@/src/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Print Ready Tools | DPI, Bleed, KDP and Etsy Calculators', template: '%s | Print Ready Tools' },
  description: 'Free print-ready calculators for pixels, DPI, bleed, safe zones, KDP covers, and Etsy printable size packs.',
  openGraph: { title: 'Print Ready Tools', description: 'Free print-ready calculators for pixels, DPI, bleed, safe zones, KDP covers, and Etsy printable size packs.', url: siteUrl, siteName: 'Print Ready Tools', type: 'website' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><header className="header"><div className="container nav"><Link className="brand" href="/">Print Ready Tools</Link><Link href="/print-size-calculator/">Print Size</Link><Link href="/dpi-calculator/">DPI</Link><Link href="/bleed-safe-zone-calculator/">Bleed</Link><Link href="/kdp-cover-calculator/">KDP</Link><Link href="/etsy-printable-size-calculator/">Etsy</Link><Link href="/common-print-sizes/">Sizes</Link></div></header>{children}<footer className="footer"><div className="container nav small"><Link href="/about/">About</Link><Link href="/contact/">Contact</Link><Link href="/privacy/">Privacy</Link><Link href="/terms/">Terms</Link><Link href="/disclaimer/">Disclaimer</Link><Link href="/glossary/">Glossary</Link><span className="muted">© 2026 Print Ready Tools</span></div></footer><script src="/client-patch.js" /></body></html>;
}