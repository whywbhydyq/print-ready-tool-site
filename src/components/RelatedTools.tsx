import Link from 'next/link';
import { toolPageByPath } from '@/src/data/image-tools';
export function RelatedTools({ related }: { related: string[] }) {
  return <section className="card"><h2>Related tools</h2><div className="related-list">{related.map((href) => { const page = toolPageByPath(href); return <Link key={href} href={href}>{page?.title || href}</Link>; })}<Link href="/image-size/">All PixelFit image tools</Link></div></section>;
}
