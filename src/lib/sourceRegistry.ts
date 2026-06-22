import { imageSpecs, sourcePolicy } from '@/src/data/image-tools';
import { printArticles } from '@/src/lib/printArticles';

export type SourceRegistryItem = {
  label: string;
  href: string;
  category: 'KDP' | 'Print production' | 'Marketplace image specs' | 'Social image specs' | 'App store image specs' | 'General reference';
  confidence: keyof typeof sourcePolicy.confidenceLabels | 'official';
  lastCheckedAt: string;
  usedFor: string;
};

const manualSources: SourceRegistryItem[] = [
  {
    label: 'Amazon KDP paperback cover requirements',
    href: 'https://kdp.amazon.com/en_US/help/topic/G201953020',
    category: 'KDP',
    confidence: 'official',
    lastCheckedAt: '2026-06-22',
    usedFor: 'KDP cover bleed, trim, PDF and paperback cover planning guidance.'
  },
  {
    label: 'Amazon KDP cover calculator',
    href: 'https://kdp.amazon.com/cover-calculator',
    category: 'KDP',
    confidence: 'official',
    lastCheckedAt: '2026-06-22',
    usedFor: 'Final KDP template checks, cover spread verification and paperback preview workflow.'
  },
  {
    label: 'Amazon KDP manuscript formatting and bleed guidance',
    href: 'https://kdp.amazon.com/en_US/help/topic/G201834230',
    category: 'KDP',
    confidence: 'official',
    lastCheckedAt: '2026-06-06',
    usedFor: 'Interior bleed, trim-page setup, margin planning and upload review reminders.'
  }
];

function categorizeSource(label: string, href: string): SourceRegistryItem['category'] {
  const lower = `${label} ${href}`.toLowerCase();
  if (lower.includes('kdp') || lower.includes('amazon.com/cover-calculator')) return 'KDP';
  if (lower.includes('google play') || lower.includes('app store') || lower.includes('developer.apple')) return 'App store image specs';
  if (lower.includes('youtube') || lower.includes('tiktok') || lower.includes('linkedin') || lower.includes('pinterest') || lower.includes('facebook') || lower.includes('instagram') || lower.includes('x.com')) return 'Social image specs';
  if (lower.includes('merchant') || lower.includes('etsy') || lower.includes('shopify') || lower.includes('amazon')) return 'Marketplace image specs';
  if (lower.includes('adobe') || lower.includes('canva') || lower.includes('print')) return 'Print production';
  return 'General reference';
}

function addUnique(items: SourceRegistryItem[]) {
  const byHref = new Map<string, SourceRegistryItem>();
  for (const item of items) {
    const existing = byHref.get(item.href);
    if (!existing) {
      byHref.set(item.href, item);
      continue;
    }
    byHref.set(item.href, {
      ...existing,
      usedFor: Array.from(new Set([...existing.usedFor.split(' | '), item.usedFor])).join(' | '),
      confidence: existing.confidence === 'official' ? existing.confidence : item.confidence
    });
  }
  return Array.from(byHref.values()).sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    if (a.confidence !== b.confidence) return a.confidence === 'official' ? -1 : 1;
    return a.label.localeCompare(b.label);
  });
}

const imageSources: SourceRegistryItem[] = imageSpecs.map((spec) => ({
  label: spec.sourceLabel,
  href: spec.sourceUrl,
  category: categorizeSource(spec.sourceLabel, spec.sourceUrl),
  confidence: spec.sourceConfidence,
  lastCheckedAt: spec.lastCheckedAt,
  usedFor: `${spec.platform} ${spec.assetType} sizing and safe-zone guidance for ${spec.title}.`
}));

const articleSources: SourceRegistryItem[] = printArticles.flatMap((article) => article.sources.map((source) => ({
  label: source.label,
  href: source.href,
  category: categorizeSource(source.label, source.href),
  confidence: 'official' as const,
  lastCheckedAt: article.updated,
  usedFor: `Source support for ${article.title}.`
})));

export const sourceRegistry = addUnique([...manualSources, ...imageSources, ...articleSources]);

export const sourceRegistryStats = {
  total: sourceRegistry.length,
  official: sourceRegistry.filter((item) => item.confidence === 'official').length,
  strongSecondary: sourceRegistry.filter((item) => item.confidence === 'strong-secondary').length,
  communityObserved: sourceRegistry.filter((item) => item.confidence === 'community-observed').length,
  internalEstimate: sourceRegistry.filter((item) => item.confidence === 'internal-estimate').length,
  lastReviewedAt: '2026-06-06'
};
