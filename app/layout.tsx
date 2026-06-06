import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import { AdSenseAutoAds } from '@/src/components/AdSenseAutoAds';
import { absoluteUrl, siteUrl } from '@/src/lib/site';
import { safeJsonLd } from '@/src/lib/seo/jsonLd';
import { openGraphImage, twitterImages } from '@/src/lib/seo/social';

const description = 'Calculate KDP cover size, spine width, bleed, barcode safe zone, image pixels, DPI, and print readiness before uploading or printing.';

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Print Ready Tools',
      url: siteUrl,
      parentOrganization: { '@type': 'Organization', name: 'YmirTool', url: 'https://ymirtool.com' }
    },
    {
      '@type': 'WebSite',
      name: 'Print Ready Tools',
      url: siteUrl,
      description,
      inLanguage: 'en',
      publisher: { '@type': 'Organization', name: 'Print Ready Tools', url: siteUrl },
      potentialAction: {
        '@type': 'SearchAction',
        target: absoluteUrl('/image-size/?q={search_term_string}'),
        'query-input': 'required name=search_term_string'
      }
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'KDP Cover Size & Spine Calculator - Print Ready Tool', template: '%s | Print Ready Tools' },
  description,
  other: {
    'baidu-site-verification': 'codeva-RtAtAyOcTn',
    'google-adsense-account': 'ca-pub-1653188471819736'
  },
  openGraph: { title: 'KDP Cover Size & Spine Calculator', description, url: siteUrl, siteName: 'Print Ready Tools', type: 'website', images: openGraphImage() },
  twitter: { card: 'summary_large_image', title: 'KDP Cover Size & Spine Calculator', description, images: twitterImages() }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container nav">
            <Link className="brand" href="/" aria-label="Print Ready Tools home"><span className="brand-mark">▱</span><span>Print Ready Tools</span><small>by PixelFit</small></Link>
            <nav className="top-links" aria-label="Primary navigation">
              <Link className="active" href="/">KDP Cover</Link>
              <Link href="/kdp-interior-bleed-calculator/">Interior</Link>
              <Link href="/dpi-calculator/">DPI</Link>
              <Link href="/bleed-safe-zone-calculator/">Bleed</Link>
              <Link href="/templates/">Templates</Link>
              <Link href="/guides/">Guides</Link>
              <Link href="/content-clusters/">Clusters</Link>
            </nav>
          </div>
        </header>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(siteJsonLd) }} />
        {children}
        <footer className="footer">
          <div className="container nav small">
            <Link href="/image-size/">PixelFit Image Tools</Link>
            <Link href="/guides/">Guides</Link>
            <Link href="/templates/">Templates</Link>
            <Link href="/about/">About</Link>
            <Link href="/contact/">Contact</Link>
            <Link href="/privacy/">Privacy</Link>
            <Link href="/terms/">Terms</Link>
            <Link href="/disclaimer/">Disclaimer</Link>
            <Link href="/glossary/">Glossary</Link>
            <Link href="/sources/">Sources</Link>
            <Link href="/content-clusters/">Content Clusters</Link>
            <span className="muted">© 2026 Print Ready Tools</span>
          </div>
        </footer>
        <AdSenseAutoAds />
      </body>
    </html>
  );
}
