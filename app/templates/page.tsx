import Link from 'next/link';
import type { Metadata } from 'next';
import { templates } from '@/src/lib/content';
import { absoluteUrl } from '@/src/lib/site';

const title = 'Print-Ready Templates';
const description = 'Copyable templates and checklists for Etsy printable buyers, KDP cover setup, and print-ready PDF review.';
const url = absoluteUrl('/templates/');

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: 'Print Ready Tools', type: 'website' },
  twitter: { card: 'summary', title, description }
};

export default function TemplatesPage() {
  return <main className="container stack"><section className="card"><h1>{title}</h1><p className="lede">Use these short templates as starting points for printable delivery instructions, KDP cover checks, and print-ready PDF review.</p></section><section className="grid">{templates.map(([href, templateTitle, templateDescription]) => <Link className="card" href={href} key={href}><h2>{templateTitle}</h2><p className="muted">{templateDescription}</p></Link>)}</section></main>;
}
