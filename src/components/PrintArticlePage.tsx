import Link from 'next/link';
import type { PrintArticle } from '@/src/lib/printArticles';
import { absoluteUrl } from '@/src/lib/site';

function canonicalInternalHref(href: string) {
  return href === '/kdp-cover-calculator' || href === '/kdp-cover-calculator/' ? '/' : href;
}

function articleJsonLd(article: PrintArticle) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        dateModified: article.updated,
        datePublished: article.updated,
        mainEntityOfPage: absoluteUrl(article.path),
        author: { '@type': 'Organization', name: 'Print Ready Tools' },
        publisher: { '@type': 'Organization', name: 'Print Ready Tools' }
      },
      {
        '@type': 'FAQPage',
        mainEntity: article.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Print Ready Tools', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Print-Ready Guides', item: absoluteUrl('/guides/') },
          { '@type': 'ListItem', position: 3, name: article.title, item: absoluteUrl(article.path) }
        ]
      }
    ]
  };
}

export function PrintArticlePage({ article }: { article: PrintArticle }) {
  return (
    <main className="container stack print-article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }} />
      <article className="card print-article">
        <p className="small muted">{article.category} · Updated {article.updated}</p>
        <h1>{article.title}</h1>
        <p className="lede">{article.description}</p>
        <p className="buttonrow">
          <Link className="primary-link" href={canonicalInternalHref(article.primaryCta.href)}>{article.primaryCta.label}</Link>
          <Link className="secondary-link" href="/guides/">Browse print guides</Link>
        </p>
        {article.sections.map((section) => (
          <section key={section.heading} className="print-article-section">
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
            {section.table && (
              <figure className="print-article-table-wrap">
                {section.table.caption && <figcaption>{section.table.caption}</figcaption>}
                <div className="print-article-table-scroll">
                  <table className="print-article-table">
                    <thead>
                      <tr>{section.table.headers.map((header) => <th key={header}>{header}</th>)}</tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row.join('|')}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </figure>
            )}
          </section>
        ))}
      </article>

      <section className="grid print-article-support" aria-label="Article support links">
        <div className="card">
          <h2>Related tools and guides</h2>
          {article.related.map((item) => <p key={item.href}><Link href={canonicalInternalHref(item.href)}>{item.label}</Link></p>)}
        </div>
        <div className="card">
          <h2>Quick FAQ</h2>
          {article.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
        </div>
        <div className="card source-note">
          <h2>Sources checked</h2>
          <p className="small muted">Use official platform documentation and preview tools as the final authority for publishing decisions.</p>
          {article.sources.map((source) => <p key={source.href}><a href={source.href} rel="nofollow noopener noreferrer" target="_blank">{source.label}</a></p>)}
        </div>
      </section>
    </main>
  );
}
