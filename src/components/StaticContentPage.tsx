import Link from 'next/link';
import type { StaticPage } from '@/src/lib/staticPageContent';
import { absoluteUrl } from '@/src/lib/site';
import { safeJsonLd } from '@/src/lib/seo/jsonLd';
import { ReviewSignal } from '@/src/components/seo/ReviewSignal';

function StaticTableView({ table }: { table: NonNullable<StaticPage['sections'][number]['table']> }) {
  return (
    <div className="table-wrap">
      <table>
        {table.caption && <caption>{table.caption}</caption>}
        <thead>
          <tr>{table.headers.map((header) => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row) => <tr key={row.join('|')}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

export function StaticContentPage({ page }: { page: StaticPage }) {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': page.kind === 'hub' ? 'CollectionPage' : 'Article',
    name: page.title,
    headline: page.title,
    description: page.description,
    url: absoluteUrl(page.path),
    dateModified: page.updated,
    inLanguage: 'en',
    publisher: { '@type': 'Organization', name: 'Print Ready Tools', url: absoluteUrl('/') },
    mainEntityOfPage: absoluteUrl(page.path),
    author: { '@type': 'Organization', name: 'Print Ready Tools', url: absoluteUrl('/') },
    image: absoluteUrl('/og-image.png')
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Print Ready Tools', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: page.path.startsWith('/templates/') ? 'Templates' : 'Guides', item: absoluteUrl(page.path.startsWith('/templates/') ? '/templates/' : '/guides/') },
      { '@type': 'ListItem', position: 3, name: page.title, item: absoluteUrl(page.path) }
    ]
  };

  return (
    <main className="container stack">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <article className="card stack">
        <p className="eyebrow">{page.kind === 'hub' ? 'Print-ready resource hub' : page.kind === 'template' ? 'Copyable production template' : 'Print-ready guide'}</p>
        <h1>{page.title}</h1>
        <p className="lead">{page.intro}</p>
        <p className="small muted">Last updated {page.updated} · Reviewed by Print Ready Tools.</p>
        {page.sections.map((section) => (
          <section className="stack" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
            {section.table && <StaticTableView table={section.table} />}
          </section>
        ))}
        <section className="stack">
          <h2>Related calculators and resources</h2>
          <ul>
            {page.related.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}
          </ul>
        </section>
        <ReviewSignal reviewed={page.updated} scope={page.kind === 'template' ? 'template' : page.kind === 'hub' ? 'site' : 'guide'} />
        <section className="note stack">
          <h2>Source and limitation note</h2>
          <p>{page.sourceNote}</p>
          <p className="small muted">Last updated {page.updated}.</p>
        </section>
      </article>
    </main>
  );
}
