import Link from 'next/link';
import type { Metadata } from 'next';
import { coreTools, guides, templates } from '@/src/lib/content';
import { siteUrl } from '@/src/lib/site';

const description = 'Free print-ready calculators for pixels, DPI, bleed, safe zones, KDP covers, and Etsy printable size packs.';

export const metadata: Metadata = {
  title: 'Print Ready Tools | DPI, Bleed, KDP and Etsy Calculators',
  description,
  alternates: { canonical: siteUrl },
  openGraph: { title: 'Print Ready Tools', description, url: siteUrl, siteName: 'Print Ready Tools', type: 'website' }
};

export default function Home(){return <main className="container stack"><section className="hero"><p className="small"><strong>Free print-ready workflow hub</strong></p><h1>Print Size, DPI &amp; Bleed Calculators</h1><p>Calculate pixels, print dimensions, DPI/PPI, bleed, safe zones, paperback covers, interior bleed, printable ratio packs, and common print sizes. Copy the result, export files when needed, then verify final settings before print.</p></section><section className="grid">{coreTools.map(([href,title,desc])=><Link className="card" href={href} key={href}><h2>{title}</h2><p className="muted">{desc}</p></Link>)}</section><section className="grid"><div className="card"><h2>Guides</h2>{guides.slice(0,6).map(([h,t])=><p key={h}><Link href={h}>{t}</Link></p>)}</div><div className="card"><h2>Templates</h2>{templates.map(([h,t,d])=><p key={h}><Link href={h}>{t}</Link><br/><span className="muted small">{d}</span></p>)}</div></section></main>}
