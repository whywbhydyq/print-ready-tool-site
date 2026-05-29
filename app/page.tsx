import Link from 'next/link';
import type { Metadata } from 'next';
import { coreTools, guides, templates } from '@/src/lib/content';
import { siteUrl, absoluteUrl } from '@/src/lib/site';

const description = 'Free print-ready calculators for KDP covers, spine width, bleed, DPI, image pixels, templates, and marketplace print setup. Start with the KDP cover calculator or choose a related print tool.';

export const metadata: Metadata = {
  title: 'Print Ready Tools for KDP Covers, DPI, Bleed and Templates',
  description,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'Print Ready Tools for KDP Covers, DPI, Bleed and Templates',
    description,
    url: siteUrl,
    siteName: 'Print Ready Tools',
    type: 'website'
  },
  twitter: { card: 'summary', title: 'Print Ready Tools', description }
};

const kdpLinks = [
  ['/kdp-cover-calculator/', 'KDP cover size calculator', 'Calculate paperback cover file size, spine width, bleed, barcode safe zone, and pixel canvas.'],
  ['/guides/kdp-paperback-cover-size-formula/', 'KDP cover size formula', 'Back cover + spine + front cover + bleed, explained step by step.'],
  ['/guides/kdp-cover-size-with-bleed/', 'KDP cover size with bleed', 'Understand why the cover file is larger than the trim spread.'],
  ['/guides/kdp-spine-width-calculator/', 'KDP spine width calculator', 'Understand spine width from page count and paper type.'],
  ['/guides/kdp-cover-pixel-size-300-dpi/', 'KDP cover pixels at 300 PPI', 'Convert the calculated cover size into a design canvas.'],
  ['/guides/kdp-barcode-safe-zone/', 'KDP barcode safe zone', 'Keep back-cover text and art out of the barcode area.']
] as const;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'Print Ready Tools',
      url: siteUrl,
      description
    },
    {
      '@type': 'ItemList',
      name: 'Primary print-ready tools',
      itemListElement: kdpLinks.map(([href, title], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: title,
        url: absoluteUrl(href)
      }))
    }
  ]
};

export default function Home() {
  return (
    <main className="container stack print-home-hub">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero print-hub-hero">
        <p className="small muted">Independent browser-based print planning tools</p>
        <h1>Print-ready calculators for KDP covers, DPI, bleed, and templates</h1>
        <p className="lede">Start with the KDP paperback cover calculator, then use related tools for print size, DPI, safe zones, and marketplace-ready files.</p>
        <div className="buttonrow">
          <Link className="primary-link" href="/kdp-cover-calculator/">Open KDP cover calculator</Link>
          <Link className="secondary-link" href="/print-size-calculator/">Image print size calculator</Link>
        </div>
      </section>

      <section className="card print-hub-focus" aria-labelledby="kdp-tools">
        <h2 id="kdp-tools">KDP cover workflow</h2>
        <div className="grid">
          {kdpLinks.map(([href, title, desc]) => (
            <Link className="card print-hub-tool-card" href={href} key={href}>
              <h3>{title}</h3>
              <p>{desc}</p>
              {href === '/kdp-cover-calculator/' && <span className="print-hub-card-cta">Start calculator</span>}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid" aria-label="Related print calculators">
        <div className="card">
          <h2>Print sizing</h2>
          {coreTools.slice(3, 7).map(([href, title, desc]) => <p key={href}><Link href={href}>{title}</Link><br /><span className="small muted">{desc}</span></p>)}
        </div>
        <div className="card">
          <h2>Image checks</h2>
          {coreTools.slice(2, 3).map(([href, title, desc]) => <p key={href}><Link href={href}>{title}</Link><br /><span className="small muted">{desc}</span></p>)}
          {coreTools.slice(5, 6).map(([href, title, desc]) => <p key={href}><Link href={href}>{title}</Link><br /><span className="small muted">{desc}</span></p>)}
        </div>
        <div className="card">
          <h2>KDP article library</h2>
          {guides.filter(([, title]) => title.includes('KDP')).map(([href, title, desc]) => <p key={href}><Link href={href}>{title}</Link><br /><span className="small muted">{desc}</span></p>)}
          {templates.slice(1, 2).map(([href, title, desc]) => <p key={href}><Link href={href}>{title}</Link><br /><span className="small muted">{desc}</span></p>)}
        </div>
      </section>
    </main>
  );
}
