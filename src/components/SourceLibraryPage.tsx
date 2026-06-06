import Link from 'next/link';
import { sourcePolicy } from '@/src/data/image-tools';
import { sourceRegistry, sourceRegistryStats, type SourceRegistryItem } from '@/src/lib/sourceRegistry';
import { absoluteUrl } from '@/src/lib/site';
import { safeJsonLd } from '@/src/lib/seo/jsonLd';

const categoryOrder: SourceRegistryItem['category'][] = [
  'KDP',
  'Print production',
  'Marketplace image specs',
  'App store image specs',
  'Social image specs',
  'General reference'
];

function sourceConfidenceLabel(confidence: SourceRegistryItem['confidence']) {
  return sourcePolicy.confidenceLabels[confidence as keyof typeof sourcePolicy.confidenceLabels] || 'Official platform documentation';
}

function groupedSources() {
  return categoryOrder.map((category) => ({
    category,
    items: sourceRegistry.filter((source) => source.category === category)
  })).filter((group) => group.items.length > 0);
}

export function SourceLibraryPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Print Ready Tools Source Library',
    description: 'A centralized source library for KDP cover, print size, marketplace image, app store image, and social image specification references used by Print Ready Tools.',
    url: absoluteUrl('/sources/'),
    dateModified: sourceRegistryStats.lastReviewedAt,
    publisher: { '@type': 'Organization', name: 'Print Ready Tools', url: absoluteUrl('/') },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: sourceRegistryStats.total,
      itemListElement: sourceRegistry.slice(0, 50).map((source, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: source.label,
          url: source.href,
          description: source.usedFor
        }
      }))
    }
  };

  return (
    <main className="container stack">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }} />
      <article className="card stack source-library">
        <p className="eyebrow">Editorial source library</p>
        <h1>Print Ready Tools Source Library</h1>
        <p className="lead">This page lists the external references used when maintaining KDP cover calculators, print-size formulas, PixelFit image-size tools, safe-zone notes, and marketplace image checks.</p>
        <p>The calculator output is first-party math, but platform-specific limits can change. Official templates, printer requirements, upload previewers, and current marketplace documentation override this site when they differ.</p>
        <div className="metric-strip" aria-label="Source library summary">
          <span><strong>{sourceRegistryStats.total}</strong><small>tracked sources</small></span>
          <span><strong>{sourceRegistryStats.official}</strong><small>official sources</small></span>
          <span><strong>{sourceRegistryStats.strongSecondary}</strong><small>secondary sources</small></span>
          <span><strong>{sourceRegistryStats.lastReviewedAt}</strong><small>last reviewed</small></span>
        </div>
        <section className="note stack">
          <h2>How source confidence works</h2>
          <p>Every platform image specification is stored with a source URL, source label, confidence level, and last-checked date. Official documentation receives the highest confidence. Strong secondary sources are used only when official public documentation is incomplete, unclear, or not available for a display surface.</p>
          <ul>
            {Object.entries(sourcePolicy.confidenceLabels).map(([key, label]) => <li key={key}><strong>{key}</strong>: {label}</li>)}
          </ul>
        </section>
        {groupedSources().map((group) => (
          <section className="stack" key={group.category}>
            <h2>{group.category}</h2>
            <div className="source-grid">
              {group.items.map((source) => (
                <article className="source-card" key={source.href}>
                  <h3><a href={source.href} target="_blank" rel="noopener noreferrer nofollow">{source.label}</a></h3>
                  <p>{source.usedFor}</p>
                  <p className="small muted">Confidence: {sourceConfidenceLabel(source.confidence)} · Last checked {source.lastCheckedAt}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
        <section className="note stack">
          <h2>Correction path</h2>
          <p>When a source changes, update the centralized data record first, then re-check the related calculator page, structured data, metadata, sitemap entry, and crawler checks. Send corrections through the <Link href="/contact/">contact page</Link> with the affected URL and the current official source.</p>
        </section>
      </article>
    </main>
  );
}
