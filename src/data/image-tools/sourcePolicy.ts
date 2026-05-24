export const sourcePolicy = {
  lastReviewedAt: '2026-05-24',
  summary: 'Platform dimensions are centralized in data files. Every platform spec must include sourceConfidence, sourceUrl and lastCheckedAt. Official platform documentation overrides this tool when specifications differ.',
  confidenceLabels: {
    official: 'Official platform documentation',
    'strong-secondary': 'High-quality secondary source; verify against official platform docs before high-stakes production',
    'community-observed': 'Observed by community or implementation practice, not guaranteed by platform',
    'internal-estimate': 'Conservative internal reference for UI risk, not an exact official pixel guarantee'
  }
} as const;
