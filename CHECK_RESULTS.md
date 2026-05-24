# Check Results

Date: 2026-05-24

## Final command

```bash
npm run check:all
```

## Result

Passed.

## Included checks

```bash
npm run typecheck
npm run lint
npm run test:calculations
NEXT_TELEMETRY_DISABLED=1 npm run build
npm run audit:pixelfit
```

## Output summary

- TypeScript typecheck: passed
- ESLint: passed, no warnings or errors
- Calculation smoke tests: passed
- Next.js production build: passed
- Static pages generated: 59
- PixelFit full-plan audit: passed
- Meta keywords: none found
- Server image upload calls: none found
- Vercel ignoreCommand: script-based configuration present
- PixelFit page count: 34 `/image-size/` pages including hub
- P0 routes: present
- P1 routes: present
- P2 routes: present
- Source fields: `sourceConfidence`, `sourceUrl`, `lastCheckedAt` present for platform specs
- SVG and PNG overlay downloads: implemented
- Local image privacy notice: present
- FAQ and breadcrumb JSON-LD: implemented
- User-facing P0/P1/P2 hub labels: removed
- User-facing AdSense placement instruction: removed
- Overlay hub title no longer implies native PSD export

## Logs

See:

- `local-check-logs/check-all-tidy-final.log`
- `local-check-logs/build-tidy-retry.log`
- `local-check-logs/audit-tidy.log`
- `local-check-logs/test-calculations-tidy.log`
