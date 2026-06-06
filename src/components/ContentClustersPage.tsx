import Link from 'next/link';
import { contentClusters } from '@/src/lib/seo/contentClusters';
import { absoluteUrl } from '@/src/lib/site';
import { safeJsonLd } from '@/src/lib/seo/jsonLd';
import { ReviewSignal } from '@/src/components/seo/ReviewSignal';

function clusterJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Print-Ready Content Cluster Map',
        description: 'Internal topic-cluster map for print-size, KDP cover, bleed, Etsy printable, and platform image-size workflows.',
        url: absoluteUrl('/content-clusters/'),
        dateModified: '2026-06-06',
        inLanguage: 'en',
        publisher: { '@type': 'Organization', name: 'Print Ready Tools', url: absoluteUrl('/') }
      },
      {
        '@type': 'ItemList',
        name: 'Print Ready Tools topic clusters',
        itemListElement: contentClusters.map((cluster, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: cluster.title,
          item: absoluteUrl(cluster.hub.href)
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Print Ready Tools', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Content Clusters', item: absoluteUrl('/content-clusters/') }
        ]
      }
    ]
  };
}

export function ContentClustersPage() {
  return (
    <main className="container stack content-cluster-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(clusterJsonLd()) }} />
      <section className="hero">
        <p className="eyebrow">SEO cluster map</p>
        <h1>Print-Ready Content Cluster Map</h1>
        <p className="lede">This page maps the site architecture by search intent, hub page, supporting spokes, linkable asset, and measurement signal. It is built for users, crawlers, and AI answer engines that need a concise view of how Print Ready Tools groups related print-production topics.</p>
        <p className="small muted">Last reviewed 2026-06-06 · Built from the local route inventory and source-backed calculator pages.</p>
      </section>

      <section className="card stack">
        <h2>How this cluster map should be used</h2>
        <p>Each cluster has one primary hub that should receive the strongest internal links. Supporting spokes answer narrower questions, provide templates, or document edge cases. The map also names the linkable asset that can earn external references, and the measurement signal that should be checked after deployment.</p>
        <p>The goal is not to create duplicate pages. The goal is to make page purpose explicit: calculator pages solve the task, guide pages explain the reasoning, templates help users act on the result, and source pages document where changeable platform requirements came from.</p>
      </section>

      <section className="cluster-grid" aria-label="Print-ready SEO content clusters">
        {contentClusters.map((cluster) => (
          <article className="card cluster-card stack" key={cluster.id}>
            <div>
              <p className="eyebrow">Cluster</p>
              <h2>{cluster.title}</h2>
              <p>{cluster.intent}</p>
            </div>
            <div className="cluster-hub">
              <span>Hub</span>
              <Link href={cluster.hub.href}>{cluster.hub.label}</Link>
            </div>
            <div>
              <h3>Supporting spokes</h3>
              <ul>
                {cluster.spokes.map((spoke) => (
                  <li key={spoke.href}><Link href={spoke.href}>{spoke.label}</Link>: {spoke.role}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>User stories</h3>
              <ul>
                {cluster.userStories.map((story) => <li key={story}>{story}</li>)}
              </ul>
            </div>
            <p><strong>Linkable asset:</strong> {cluster.linkableAsset}</p>
            <p><strong>Measurement:</strong> {cluster.measurement}</p>
          </article>
        ))}
      </section>

      <section className="card stack">
        <h2>Cross-cluster internal linking rules</h2>
        <ul>
          <li>KDP pages should link back to the homepage calculator when the user needs spine, bleed, barcode, or full-spread numbers.</li>
          <li>Print-size and DPI pages should link to the image quality checker when the user needs to evaluate an actual file.</li>
          <li>Bleed pages should link to print-ready PDF templates when geometry has been calculated and the user needs a preflight checklist.</li>
          <li>Etsy printable pages should link to buyer instructions and common print sizes because users usually need both ratio files and delivery text.</li>
          <li>Platform image pages should link to the source library when a specification might have changed since the last review date.</li>
        </ul>
      </section>

      <ReviewSignal reviewed="2026-06-06" scope="site" />
    </main>
  );
}
