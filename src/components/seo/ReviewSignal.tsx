import Link from 'next/link';

type ReviewSignalProps = {
  reviewed?: string;
  scope?: 'calculator' | 'guide' | 'template' | 'site';
};

const scopeText: Record<NonNullable<ReviewSignalProps['scope']>, string> = {
  calculator: 'Calculator outputs are generated from visible inputs and standard print formulas, then presented with copyable results and limitation notes.',
  guide: 'Guide content is reviewed against the related calculator logic, current source notes, and practical print-production workflows.',
  template: 'Template text is reviewed for production handoff clarity, buyer-safe wording, and compatibility with the related calculators.',
  site: 'Site policies and trust pages are reviewed for transparent scope, privacy expectations, correction handling, and independence from named platforms.'
};

export function ReviewSignal({ reviewed = '2026-06-06', scope = 'calculator' }: ReviewSignalProps) {
  return (
    <aside className="review-signal" aria-label="Review and citation note">
      <h2>Review method and citation note</h2>
      <p>{scopeText[scope]}</p>
      <ul>
        <li>Last reviewed: {reviewed}.</li>
        <li>Final authority: the printer, marketplace upload previewer, or official platform template.</li>
        <li>Correction path: report outdated specs or formula mismatches through the <Link href="/contact/">contact page</Link>.</li>
      </ul>
    </aside>
  );
}
