#!/usr/bin/env node
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const outDir = process.env.LOCAL_SEO_OUT_DIR || '.seo-cache';
const baselinePath = process.env.SEO_DRIFT_BASELINE || path.join(outDir, 'seo-drift-baseline.json');
const reportPath = process.env.SEO_DRIFT_REPORT || path.join(outDir, 'seo-drift-report.json');
const updateBaseline = process.env.SEO_DRIFT_UPDATE_BASELINE === '1';

async function latestCrawlPath() {
  const direct = process.env.SEO_DRIFT_CRAWL_JSON;
  if (direct) return direct;
  const stable = path.join(outDir, 'local-seo-crawl-latest.json');
  try {
    await readFile(stable, 'utf8');
    return stable;
  } catch {}
  const files = (await readdir(outDir)).filter((file) => /^local-seo-crawl-.*\.json$/.test(file)).sort();
  if (!files.length) throw new Error(`No local SEO crawl JSON found in ${outDir}. Run npm run seo:crawl first.`);
  return path.join(outDir, files[files.length - 1]);
}

function capture(crawl) {
  const pages = Object.fromEntries((crawl.results || []).map((page) => [page.route, {
    status: page.status,
    title: page.title,
    description: page.description,
    canonical: page.canonical,
    h1s: page.h1s,
    wordCount: page.wordCount,
    jsonLdCount: page.jsonLdCount,
    ogImage: page.ogImage,
    twitterImage: page.twitterImage,
    issues: page.issues || []
  }]));
  return {
    cache_type: 'seo-drift-baseline',
    captured_at: new Date().toISOString(),
    baseUrl: crawl.baseUrl,
    routeCount: crawl.routeCount,
    globalIssueCount: crawl.globalIssueCount,
    failingPageCount: crawl.failingPageCount,
    failingLinkCount: crawl.failingLinkCount,
    sitemapUrlCount: crawl.sitemap?.urlCount,
    pages
  };
}

function compare(baseline, current) {
  const findings = [];
  const baselineRoutes = Object.keys(baseline.pages || {}).sort();
  const currentRoutes = Object.keys(current.pages || {}).sort();
  const baselineSet = new Set(baselineRoutes);
  const currentSet = new Set(currentRoutes);

  for (const route of baselineRoutes) {
    if (!currentSet.has(route)) findings.push({ severity: 'critical', route, field: 'route', message: 'Route removed from current crawl.' });
  }
  for (const route of currentRoutes) {
    if (!baselineSet.has(route)) findings.push({ severity: 'info', route, field: 'route', message: 'New route added since baseline.' });
  }

  for (const route of baselineRoutes.filter((route) => currentSet.has(route))) {
    const before = baseline.pages[route];
    const after = current.pages[route];
    for (const field of ['status', 'title', 'description', 'canonical', 'ogImage', 'twitterImage']) {
      if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) {
        const severity = field === 'status' || field === 'canonical' ? 'critical' : 'warning';
        findings.push({ severity, route, field, before: before[field], after: after[field], message: `${field} changed.` });
      }
    }
    if (JSON.stringify(before.h1s) !== JSON.stringify(after.h1s)) findings.push({ severity: 'warning', route, field: 'h1s', before: before.h1s, after: after.h1s, message: 'H1 set changed.' });
    if (after.jsonLdCount < before.jsonLdCount) findings.push({ severity: 'warning', route, field: 'jsonLdCount', before: before.jsonLdCount, after: after.jsonLdCount, message: 'JSON-LD block count decreased.' });
    if (after.wordCount < Math.floor(before.wordCount * 0.8)) findings.push({ severity: 'warning', route, field: 'wordCount', before: before.wordCount, after: after.wordCount, message: 'Visible word count dropped by more than 20%.' });
    if ((after.issues || []).length > (before.issues || []).length) findings.push({ severity: 'warning', route, field: 'issues', before: before.issues, after: after.issues, message: 'Page issue count increased.' });
  }

  if (current.globalIssueCount > baseline.globalIssueCount) findings.push({ severity: 'critical', route: '*', field: 'globalIssueCount', before: baseline.globalIssueCount, after: current.globalIssueCount, message: 'Global SEO issue count increased.' });
  if (current.failingLinkCount > baseline.failingLinkCount) findings.push({ severity: 'critical', route: '*', field: 'failingLinkCount', before: baseline.failingLinkCount, after: current.failingLinkCount, message: 'Broken internal link count increased.' });
  return findings;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const crawl = JSON.parse(await readFile(await latestCrawlPath(), 'utf8'));
  const current = capture(crawl);
  let baseline = null;
  try {
    baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
  } catch {}

  if (!baseline || updateBaseline) {
    await writeFile(baselinePath, JSON.stringify(current, null, 2));
    await writeFile(reportPath, JSON.stringify({ status: 'baseline-written', findings: [], baselinePath, routeCount: current.routeCount, writtenAt: current.captured_at }, null, 2));
    console.log(`SEO drift baseline written: ${baselinePath}`);
    console.log('SEO drift findings: 0');
    return;
  }

  const findings = compare(baseline, current);
  const critical = findings.filter((item) => item.severity === 'critical');
  const warning = findings.filter((item) => item.severity === 'warning');
  const info = findings.filter((item) => item.severity === 'info');
  await writeFile(reportPath, JSON.stringify({ status: findings.length ? 'drift-detected' : 'clean', comparedAt: new Date().toISOString(), baselinePath, counts: { critical: critical.length, warning: warning.length, info: info.length }, findings }, null, 2));
  console.log(`SEO drift findings: ${findings.length}`);
  console.log(`Critical: ${critical.length}`);
  console.log(`Warning: ${warning.length}`);
  console.log(`Info: ${info.length}`);
  console.log(`Report: ${reportPath}`);
  if (critical.length || warning.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
