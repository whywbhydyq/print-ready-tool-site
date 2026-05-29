import './globals.css';
import Link from 'next/link';
import Script from 'next/script';
import type { Metadata } from 'next';
import { siteUrl } from '@/src/lib/site';
const description = 'Calculate KDP cover size, spine width, bleed, barcode safe zone, image pixels, DPI, and print readiness before uploading or printing.';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'KDP Cover Size & Spine Calculator - Print Ready Tool', template: '%s | Print Ready Tools' },
  description,
  other: { 'google-adsense-account': 'ca-pub-1653188471819736' },
  openGraph: { title: 'KDP Cover Size & Spine Calculator', description, url: siteUrl, siteName: 'Print Ready Tools', type: 'website' },
  twitter: { card: 'summary', title: 'KDP Cover Size & Spine Calculator', description }
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><header className="header"><div className="container nav"><Link className="brand" href="/">Print Ready Tools</Link><Link href="/image-size/">PixelFit</Link><Link href="/print-size-calculator/">Print Size</Link><Link href="/dpi-calculator/">DPI</Link><Link href="/bleed-safe-zone-calculator/">Bleed</Link><Link href="/kdp-cover-calculator/">KDP</Link><Link href="/etsy-printable-size-calculator/">Etsy</Link><Link href="/common-print-sizes/">Sizes</Link><Link href="/guides/">Guides</Link><Link href="/templates/">Templates</Link></div></header>{children}<footer className="footer"><div className="container nav small"><Link href="/image-size/">PixelFit Image Tools</Link><Link href="/guides/">Guides</Link><Link href="/templates/">Templates</Link><Link href="/about/">About</Link><Link href="/contact/">Contact</Link><Link href="/privacy/">Privacy</Link><Link href="/terms/">Terms</Link><Link href="/disclaimer/">Disclaimer</Link><Link href="/glossary/">Glossary</Link><span className="muted">© 2026 Print Ready Tools</span></div></footer><Script id="adsense-auto-ads" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1653188471819736" crossOrigin="anonymous" strategy="afterInteractive" /></body></html>;
}
