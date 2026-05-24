import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { byPath, guides, templates, trust } from '@/src/lib/content';
import { absoluteUrl } from '@/src/lib/site';
import { pageByPath, pages as pixelFitPages } from '@/src/data/image-tools';
import { PixelFitPage } from '@/src/components/PixelFitClient';

const extra:{[k:string]:string}={
'/about/':'Print Ready Tools provides free browser-based calculators for print sizes, DPI, bleed, safe zones, KDP covers, Etsy printable files, and PixelFit image size tools. We are independent and not affiliated with Amazon, Etsy, Canva, Adobe, YouTube, TikTok, LinkedIn or X.',
'/contact/':'For corrections, source updates or feature requests, contact aren.ymir@gmail.com. Do not send files containing private customer data.',
'/privacy/':'Images are checked locally in your browser and are not uploaded or stored. Analytics should only use anonymous aggregate events and never record file names or exact image content.',
'/terms/':'These tools are provided as-is for general print setup, image size, DPI and safe-zone guidance. Verify final requirements with your printer, marketplace or platform.',
'/disclaimer/':'This site does not guarantee KDP, Etsy, platform upload, social media display or print approval. Official templates and platform specifications override calculator estimates.',
'/glossary/':'DPI/PPI: pixels per inch for print sizing. Bleed: extra artwork beyond trim. Safe zone: area for important content. Trim: final cut size. Aspect ratio: width-to-height proportion.',
'/templates/etsy-buyer-instruction-template/':'Thank you for purchasing this printable. Choose the ratio file matching your frame, print at 100% scale, and use high-quality paper or a professional print shop. Files are for personal use only unless your listing says otherwise.',
'/templates/kdp-cover-setup-checklist/':'KDP cover checklist: calculate trim, spine and bleed; create one PDF with back cover, spine and front cover; keep text in the safe zone; leave barcode space; verify with the official KDP previewer.',
'/templates/print-ready-pdf-checklist/':'Print-ready PDF checklist: correct page size, required bleed, embedded fonts, high-resolution images, safe-zone content, correct color profile, and printer-specific export settings.'
};

type PageProps = { params:{slug:string[]} };

export function generateStaticParams(){return [...guides,...templates,...trust,...pixelFitPages.map(p=>[p.href,p.title,p.description] as [string,string,string])].map(([href])=>({slug:href.split('/').filter(Boolean)}))}

export function generateMetadata({params}:PageProps): Metadata {
  const path='/' + params.slug.join('/') + '/';
  const pixelFit=pageByPath(path);
  if(pixelFit){return {title:pixelFit.title,description:pixelFit.description,alternates:{canonical:absoluteUrl(path)},openGraph:{title:pixelFit.title,description:pixelFit.description,url:absoluteUrl(path),siteName:'Print Ready Tools',type:'website'},twitter:{card:'summary',title:pixelFit.title,description:pixelFit.description}}}
  const item=byPath(path);const title=item?.[1]||'Print Ready Guide';const description=item?.[2]||'Print-ready calculator guide and checklist.';return {title,description,alternates:{canonical:absoluteUrl(path)},openGraph:{title,description,url:absoluteUrl(path),siteName:'Print Ready Tools',type:'article'}}
}

export default function Page({params}:PageProps){
  const path='/' + params.slug.join('/') + '/';
  const pixelFit=pageByPath(path);
  if(pixelFit)return <PixelFitPage page={pixelFit}/>;
  const item=byPath(path);if(!item)notFound();const [href,title,desc]=item;const body=extra[path]||`${desc} Use the related calculator to enter your own values, review formulas, copy results, and download guide templates. This page explains when the result applies, when it does not, and what official platform checks still matter.`;const isTrustPage=trust.some(([trustHref])=>trustHref===path);if(isTrustPage){return <main className="container stack"><article className="card"><h1>{title}</h1><p>{body}</p><h2>Related tools</h2><p><Link href="/print-size-calculator/">Print Size Calculator</Link> · <Link href="/dpi-calculator/">DPI Calculator</Link> · <Link href="/image-size/">PixelFit Image Size Tools</Link> · <Link href="/bleed-safe-zone-calculator/">Bleed &amp; Safe Zone Calculator</Link> · <Link href="/kdp-cover-calculator/">KDP Cover Size Calculator</Link></p><p className="small muted">Last updated 2026-05-24.</p></article></main>}return <main className="container stack"><article className="card"><h1>{title}</h1><p>{body}</p><h2>Formula or rule</h2><p>Use physical size × DPI for pixel requirements. For bleed, add bleed to both sides. For KDP covers, use back cover + spine + front cover + outside bleed.</p><h2>Worked example</h2><p>At 300 DPI, an 8 × 10 inch print needs 2400 × 3000 pixels. A 6 × 9 inch KDP interior with bleed becomes 6.125 × 9.25 inches.</p><h2>Limits</h2><p>Printer, paper, marketplace and software requirements vary. Use official platform templates as the final check.</p><h2>Related calculators</h2><p><Link href="/print-size-calculator/">Print Size Calculator</Link> · <Link href="/dpi-calculator/">DPI Calculator</Link> · <Link href="/image-size/">PixelFit Image Size Tools</Link> · <Link href="/bleed-safe-zone-calculator/">Bleed &amp; Safe Zone Calculator</Link> · <Link href="/kdp-cover-calculator/">KDP Cover Size Calculator</Link> · <Link href="/etsy-printable-size-calculator/">Etsy Printable Size Pack Calculator</Link></p><p className="small muted">Sources and last updated: KDP, Etsy and common print production guidance. Last updated 2026-05-23.</p></article></main>
}
