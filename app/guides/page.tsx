import Link from 'next/link';
import type { Metadata } from 'next';
import { guides } from '@/src/lib/content';
import { absoluteUrl } from '@/src/lib/site';

const title = 'Print-Ready Guides';
const description = 'Practical print setup guides for DPI, pixels, bleed, KDP covers, and Etsy printable sizing.';
const url = absoluteUrl('/guides/');

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: 'Print Ready Tools', type: 'website' },
  twitter: { card: 'summary', title, description }
};

export default function GuidesPage() {
  return <main className="container stack"><section className="card"><h1>{title}</h1><p className="lede">Use these guides to check common print dimensions, bleed rules, KDP cover setup, and Etsy printable ratio packs before using the calculators.</p></section><section className="grid">{guides.map(([href, guideTitle, guideDescription]) => <Link className="card" href={href} key={href}><h2>{guideTitle}</h2><p className="muted">{guideDescription}</p></Link>)}</section></main>;
}
