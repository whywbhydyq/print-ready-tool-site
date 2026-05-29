import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allRoutes, byPath, trust } from '@/src/lib/content';
import { absoluteUrl } from '@/src/lib/site';
import { toolPageByPath } from '@/src/data/image-tools';
import { PixelFitPage } from '@/src/components/PixelFitClient';
import { KdpCoverHome } from '@/src/components/kdp/KdpCoverHome';
const extra: Record<string, string> = {
  '/about/': 'Print Ready Tools provides free browser-based calculators for print sizes, DPI, bleed, safe zones, KDP covers, Etsy printable files, and PixelFit image size tools. We are independent and not affiliated with Amazon, Etsy, Canva, Adobe, YouTube, TikTok, LinkedIn or X.',
  '/contact/': 'For corrections, source updates or feature requests, contact aren.ymir@gmail.com. Do not send files containing private customer data.',
  '/privacy/': 'Images are checked locally in your browser and are not uploaded or stored. Analytics should only use anonymous aggregate events and never record file names or exact image content.',
  '/terms/': 'These tools are provided as-is for general print setup, image size, DPI and safe-zone guidance. Verify final requirements with your printer, marketplace or platform.',
  '/disclaimer/': 'This site does not guarantee KDP, Etsy, platform upload, social media display or print approval. Official templates and platform specifications override calculator estimates.',
  '/glossary/': 'DPI/PPI: pixels per inch for print sizing. Bleed: extra artwork beyond trim. Safe zone: area for important content. Trim: final cut size. Aspect ratio: width-to-height proportion.',
  '/templates/etsy-buyer-instruction-template/': 'Thank you for purchasing this printable. Choose the ratio file matching your frame, print at 100% scale, and use high-quality paper or a professional print shop. Files are for personal use only unless your listing says otherwise.',
  '/templates/kdp-cover-setup-checklist/': 'KDP cover checklist: calculate trim, spine and bleed; create one PDF with back cover, spine and front cover; keep text in the safe zone; leave barcode space; verify with the official KDP previewer.',
  '/templates/print-ready-pdf-checklist/': 'Print-ready PDF checklist: correct page size, required bleed, embedded fonts, high-resolution images, safe-zone content, correct color profile, and printer-specific export settings.'
};
type PageProps = { params: { slug: string[] } };
export const dynamicParams = false;
export function generateStaticParams() { return allRoutes.filter((href) => href !== '/').map((href) => ({ slug: href.split('/').filter(Boolean) })); }
export function generateMetadata({ params }: PageProps): Metadata {
  const path = '/' + params.slug.join('/') + '/';
  const pixel = toolPageByPath(path);
  if (pixel) {
    const canonicalPath = path === '/image-size/print-size-calculator/' ? '/print-size-calculator/' : path;
    return { title: pixel.title, description: pixel.description, alternates: { canonical: absoluteUrl(canonicalPath) }, openGraph: { title: pixel.title, description: pixel.description, url: absoluteUrl(canonicalPath), siteName: 'Print Ready Tools', type: 'website' }, twitter: { card: 'summary', title: pixel.title, description: pixel.description } };
  }
  const item = byPath(path); const title = item?.[1] || 'Print Ready Guide'; const description = item?.[2] || 'Print-ready calculator guide and checklist.';
  return { title, description, alternates: { canonical: absoluteUrl(path) }, openGraph: { title, description, url: absoluteUrl(path), siteName: 'Print Ready Tools', type: 'article' } };
}
export default function Page({ params }: PageProps) {
  const path = '/' + params.slug.join('/') + '/';
  if (path === '/kdp-cover-calculator/') return <KdpCoverHome />;
  const pixel = toolPageByPath(path);
  if (pixel) return <PixelFitPage page={pixel} />;
  const item = byPath(path); if (!item) notFound();
  const [, title, desc] = item;
  const body = extra[path] || `${desc} Use the related calculator to enter your own values, review formulas, copy results, and download guide templates. This page explains when the result applies, when it does not, and what official platform checks still matter.`;
  const isTrustPage = trust.some(([trustHref]) => trustHref === path);
  return <main className="container stack"><article className="card"><h1>{title}</h1><p>{body}</p>{!isTrustPage && <><h2>Formula or rule</h2><p>Use physical size × DPI for pixel requirements. For bleed, add bleed to both sides. For safe zones, keep important content inside the marked interior region.</p><h2>Worked example</h2><p>At 300 DPI, an 8 × 10 inch print needs 2400 × 3000 pixels. A4 at 300 DPI is about 2480 × 3508 pixels.</p><h2>Limits</h2><p>Printer, paper, marketplace and platform requirements vary. Use official templates and upload previewers as the final check.</p></>}<h2>Related calculators</h2><p><Link href="/image-size/">PixelFit Image Size Tools</Link> · <Link href="/image-size/print-size-calculator/">Image Print Size Calculator</Link> · <Link href="/image-size/dpi-calculator/">DPI / PPI Calculator</Link> · <Link href="/image-size/a4-size-in-pixels/">A4 Size in Pixels</Link> · <Link href="/image-size/youtube-banner-safe-area/">YouTube Banner Safe Area</Link></p><p className="small muted">Last updated 2026-05-24.</p></article></main>;
}
