#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = (process.env.LOCAL_SEO_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const outDir = process.env.LOCAL_SEO_OUT_DIR || '.seo-cache';
const maxInternalLinkFetches = Number(process.env.LOCAL_SEO_MAX_LINK_FETCHES || 200);
const fetchTimeoutMs = Number(process.env.LOCAL_SEO_FETCH_TIMEOUT_MS || 15000);

const requiredHeaders = [
  'content-security-policy',
  'referrer-policy',
  'permissions-policy',
  'x-content-type-options',
  'x-frame-options'
];

const requiredAiCrawlers = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot'];

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&times;/g, '×')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function extractOne(html, pattern) {
  const match = html.match(pattern);
  return match ? decodeHtml(match[1].trim()) : '';
}

function extractAll(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => decodeHtml(match[1])).filter(Boolean);
}

function attrValue(attrs, name) {
  const match = attrs.match(new RegExp(`${name}=[\"']([^\"']*)[\"']`, 'i'));
  return match ? decodeHtml(match[1]) : '';
}

function externalLinkAudit(html) {
  const issues = [];
  const links = [];
  for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
    const attrs = match[1];
    const href = attrValue(attrs, 'href');
    if (!/^https?:\/\//i.test(href)) continue;
    const rel = attrValue(attrs, 'rel').toLowerCase();
    const target = attrValue(attrs, 'target').toLowerCase();
    links.push({ href, target, rel });
    if (target === '_blank' && (!rel.includes('noopener') || !rel.includes('noreferrer'))) {
      issues.push(`external target=_blank missing rel noopener noreferrer: ${href}`);
    }
  }
  return { links, issues };
}

function normalizeInternalHref(href) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
  if (/^https?:\/\//i.test(href)) {
    try {
      const url = new URL(href);
      const base = new URL(baseUrl);
      if (url.origin !== base.origin) return null;
      return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    } catch {
      return null;
    }
  }
  if (!href.startsWith('/')) return null;
  const withoutHash = href.split('#')[0].split('?')[0];
  if (!withoutHash || withoutHash.startsWith('/_next') || withoutHash.includes('.')) return null;
  return withoutHash.endsWith('/') ? withoutHash : `${withoutHash}/`;
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), fetchTimeoutMs);
  try {
    return await fetch(url, { redirect: 'manual', ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchText(url, options = {}) {
  const response = await fetchWithTimeout(url, options);
  const text = await response.text();
  return { status: response.status, headers: Object.fromEntries(response.headers.entries()), text };
}

async function fetchHead(url) {
  const response = await fetchWithTimeout(url, { method: 'HEAD' });
  return { status: response.status, headers: Object.fromEntries(response.headers.entries()) };
}

async function readSitemap() {
  const sitemap = await fetchText(`${baseUrl}/sitemap.xml`);
  if (sitemap.status !== 200) throw new Error(`sitemap.xml returned ${sitemap.status}`);
  const locs = extractAll(sitemap.text, /<loc>([^<]+)<\/loc>/g);
  const lastmods = extractAll(sitemap.text, /<lastmod>([^<]+)<\/lastmod>/g);
  const routes = locs.map((loc) => {
    const url = new URL(loc);
    return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  });
  const issues = [];
  if (routes.length > 50000) issues.push(`sitemap exceeds 50000 URLs: ${routes.length}`);
  if (/<priority>/i.test(sitemap.text)) issues.push('sitemap includes deprecated priority tags');
  if (/<changefreq>/i.test(sitemap.text)) issues.push('sitemap includes deprecated changefreq tags');
  const duplicateLocs = locs.filter((loc, index) => locs.indexOf(loc) !== index);
  if (duplicateLocs.length) issues.push(`duplicate sitemap URLs: ${new Set(duplicateLocs).size}`);
  if (lastmods.length !== locs.length) issues.push(`lastmod count ${lastmods.length} does not match URL count ${locs.length}`);
  if (lastmods.length > 1 && new Set(lastmods).size === 1) issues.push('all sitemap lastmod values are identical');
  if (locs.some((loc) => loc.startsWith('http://'))) issues.push('sitemap contains HTTP URLs');
  if (!routes.includes('/sources/')) issues.push('sitemap missing /sources/ source library');
  if (!routes.includes('/content-clusters/')) issues.push('sitemap missing /content-clusters/ topic cluster map');
  return { routes, sitemap: { urlCount: locs.length, lastmodCount: lastmods.length, uniqueLastmodCount: new Set(lastmods).size, issues } };
}

function parseJsonLd(html) {
  const blocks = extractAll(html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const errors = [];
  for (const block of blocks) {
    try {
      JSON.parse(block.replace(/&quot;/g, '"').trim());
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return { count: blocks.length, errors };
}

function inspectHtml(route, html, status) {
  const title = extractOne(html, /<title>([\s\S]*?)<\/title>/i);
  const description = extractOne(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i) || extractOne(html, /<meta\s+content=["']([^"']*)["']\s+name=["']description["'][^>]*>/i);
  const canonical = extractOne(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i) || extractOne(html, /<link\s+href=["']([^"']+)["']\s+rel=["']canonical["'][^>]*>/i);
  const ogImage = extractOne(html, /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["'][^>]*>/i) || extractOne(html, /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["'][^>]*>/i);
  const twitterImage = extractOne(html, /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["'][^>]*>/i) || extractOne(html, /<meta\s+content=["']([^"']+)["']\s+name=["']twitter:image["'][^>]*>/i);
  const twitterCard = extractOne(html, /<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["'][^>]*>/i) || extractOne(html, /<meta\s+content=["']([^"']+)["']\s+name=["']twitter:card["'][^>]*>/i);
  const h1s = extractAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map(stripTags);
  const jsonLd = parseJsonLd(html);
  const text = stripTags(html);
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const internalLinks = [...new Set(extractAll(html, /href=["']([^"']+)["']/gi).map(normalizeInternalHref).filter(Boolean))];
  const externalAudit = externalLinkAudit(html);
  const issues = [...externalAudit.issues];
  if (status !== 200) issues.push(`status ${status}`);
  if (!title) issues.push('missing title');
  if (title && title.length < 30) issues.push(`short title ${title.length}`);
  if (title.length > 60) issues.push(`long title ${title.length}`);
  if (description.length < 120) issues.push(`short description ${description.length}`);
  if (description.length > 160) issues.push(`long description ${description.length}`);
  if (!canonical) issues.push('missing canonical');
  if (canonical) {
    let canonicalPath = normalizeInternalHref(canonical);
    if (!canonicalPath && /^https?:\/\//i.test(canonical)) {
      try {
        const parsedCanonical = new URL(canonical);
        canonicalPath = parsedCanonical.pathname.endsWith('/') ? parsedCanonical.pathname : `${parsedCanonical.pathname}/`;
      } catch {
        canonicalPath = null;
      }
    }
    if (canonicalPath !== route) issues.push(`canonical mismatch ${canonical}`);
  }
  if (h1s.length !== 1) issues.push(`h1 count ${h1s.length}`);
  if (wordCount < 220) issues.push(`low word count ${wordCount}`);
  if (jsonLd.count === 0) issues.push('missing json-ld');
  if (jsonLd.errors.length) issues.push(`json-ld parse error ${jsonLd.errors[0]}`);
  if (!ogImage) issues.push('missing og:image');
  if (!twitterImage) issues.push('missing twitter:image');
  if (twitterCard && twitterCard !== 'summary_large_image') issues.push(`twitter card is ${twitterCard}`);
  return { route, status, title, titleLength: title.length, description, descriptionLength: description.length, canonical, ogImage, twitterImage, twitterCard, h1s, wordCount, jsonLdCount: jsonLd.count, jsonLdErrors: jsonLd.errors, internalLinks, externalLinkCount: externalAudit.links.length, issues };
}

async function inspectSiteResources() {
  const homepage = await fetchText(`${baseUrl}/`);
  const headerIssues = requiredHeaders.filter((name) => !homepage.headers[name]).map((name) => `missing security header ${name}`);
  const robots = await fetchText(`${baseUrl}/robots.txt`);
  const robotsIssues = [];
  if (robots.status !== 200) robotsIssues.push(`robots.txt status ${robots.status}`);
  if (!/sitemap:\s*\S+\/sitemap\.xml/i.test(robots.text)) robotsIssues.push('robots.txt does not reference sitemap.xml');
  if (/disallow:\s*\//i.test(robots.text)) robotsIssues.push('robots.txt contains a global disallow');
  for (const crawler of requiredAiCrawlers) {
    if (!robots.text.includes(crawler)) robotsIssues.push(`robots.txt missing explicit AI crawler rule for ${crawler}`);
  }
  const llms = await fetchText(`${baseUrl}/llms.txt`);
  const llmsIssues = [];
  if (llms.status !== 200) llmsIssues.push(`llms.txt status ${llms.status}`);
  if (!/^#\s+Print Ready Tools/m.test(llms.text)) llmsIssues.push('llms.txt missing site heading');
  if (!/##\s+Primary tools/i.test(llms.text)) llmsIssues.push('llms.txt missing Primary tools section');
  if (!/##\s+Key formulas/i.test(llms.text)) llmsIssues.push('llms.txt missing Key formulas section');
  if (!/Citation guidance/i.test(llms.text)) llmsIssues.push('llms.txt missing citation guidance');
  if (!/Source library/i.test(llms.text)) llmsIssues.push('llms.txt missing source library reference');
  if (!/AI crawler access/i.test(llms.text)) llmsIssues.push('llms.txt missing AI crawler access section');
  if (!/Content cluster map/i.test(llms.text)) llmsIssues.push('llms.txt missing content cluster map reference');
  const ogImage = await fetchHead(`${baseUrl}/og-image.png`);
  const imageIssues = [];
  const contentLength = Number(ogImage.headers['content-length'] || 0);
  if (ogImage.status !== 200) imageIssues.push(`og-image.png status ${ogImage.status}`);
  if (!/image\//i.test(ogImage.headers['content-type'] || '')) imageIssues.push(`og-image.png content-type ${ogImage.headers['content-type'] || 'missing'}`);
  if (contentLength > 0 && contentLength > 200000) imageIssues.push(`og-image.png too large ${contentLength} bytes`);
  const sources = await fetchText(`${baseUrl}/sources/`);
  const clusters = await fetchText(`${baseUrl}/content-clusters/`);
  const sourceIssues = [];
  if (sources.status !== 200) sourceIssues.push(`sources page status ${sources.status}`);
  const sourceLinks = externalLinkAudit(sources.text).links;
  if (sourceLinks.length < 10) sourceIssues.push(`sources page has only ${sourceLinks.length} external source links`);
  if (!/source confidence works/i.test(sources.text)) sourceIssues.push('sources page missing confidence explanation');
  if (!/official platform documentation/i.test(sources.text)) sourceIssues.push('sources page missing official-source language');
  const clusterIssues = [];
  if (clusters.status !== 200) clusterIssues.push(`content clusters page status ${clusters.status}`);
  const clusterLinkCount = extractAll(clusters.text, /href=["']([^"']+)["']/gi).map(normalizeInternalHref).filter(Boolean).length;
  if (clusterLinkCount < 20) clusterIssues.push(`content clusters page has only ${clusterLinkCount} internal links`);
  if (!/User stories/i.test(clusters.text)) clusterIssues.push('content clusters page missing user stories');
  if (!/Linkable asset/i.test(clusters.text)) clusterIssues.push('content clusters page missing linkable asset notes');
  if (!/Measurement/i.test(clusters.text)) clusterIssues.push('content clusters page missing measurement notes');
  return { headers: homepage.headers, headerIssues, robots: { status: robots.status, issues: robotsIssues }, llms: { status: llms.status, issues: llmsIssues }, assets: { ogImage: { status: ogImage.status, contentType: ogImage.headers['content-type'] || '', contentLength, issues: imageIssues } }, sources: { status: sources.status, externalLinkCount: sourceLinks.length, issues: sourceIssues }, clusters: { status: clusters.status, internalLinkCount: clusterLinkCount, issues: clusterIssues } };
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const { routes, sitemap } = await readSitemap();
  const siteResources = await inspectSiteResources();
  const routeSet = new Set(routes);
  const results = [];
  const discoveredLinks = new Set();

  for (const route of routes) {
    const page = await fetchText(`${baseUrl}${route}`);
    const result = inspectHtml(route, page.text, page.status);
    result.internalLinks.forEach((link) => discoveredLinks.add(link));
    results.push(result);
  }

  const normalizedTitleMap = new Map();
  const normalizedDescriptionMap = new Map();
  for (const result of results) {
    const normalizedTitle = result.title.trim().toLowerCase();
    const normalizedDescription = result.description.trim().toLowerCase();
    if (normalizedTitle) normalizedTitleMap.set(normalizedTitle, [...(normalizedTitleMap.get(normalizedTitle) || []), result]);
    if (normalizedDescription) normalizedDescriptionMap.set(normalizedDescription, [...(normalizedDescriptionMap.get(normalizedDescription) || []), result]);
  }
  for (const [, duplicates] of normalizedTitleMap) {
    if (duplicates.length > 1) duplicates.forEach((result) => result.issues.push(`duplicate title shared by ${duplicates.length} routes`));
  }
  for (const [, duplicates] of normalizedDescriptionMap) {
    if (duplicates.length > 1) duplicates.forEach((result) => result.issues.push(`duplicate description shared by ${duplicates.length} routes`));
  }

  const linkChecks = [];
  const linksToFetch = [...discoveredLinks].filter((link) => !routeSet.has(link)).slice(0, maxInternalLinkFetches);
  for (const link of linksToFetch) {
    try {
      const response = await fetchWithTimeout(`${baseUrl}${link}`);
      linkChecks.push({ href: link, status: response.status, knownCanonical: routeSet.has(link) });
    } catch (error) {
      linkChecks.push({ href: link, status: 0, knownCanonical: routeSet.has(link), error: error instanceof Error ? error.message : String(error) });
    }
  }

  const globalIssues = [
    ...sitemap.issues.map((issue) => `sitemap: ${issue}`),
    ...siteResources.headerIssues,
    ...siteResources.robots.issues.map((issue) => `robots: ${issue}`),
    ...siteResources.llms.issues.map((issue) => `llms: ${issue}`),
    ...siteResources.assets.ogImage.issues.map((issue) => `asset: ${issue}`),
    ...siteResources.sources.issues.map((issue) => `sources: ${issue}`),
    ...siteResources.clusters.issues.map((issue) => `clusters: ${issue}`)
  ];
  const failingPages = results.filter((result) => result.issues.length > 0);
  const failingLinks = linkChecks.filter((item) => item.status === 0 || item.status >= 400);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const report = { baseUrl, generatedAt: new Date().toISOString(), routeCount: routes.length, failingPageCount: failingPages.length, failingLinkCount: failingLinks.length, globalIssueCount: globalIssues.length, sitemap, siteResources, globalIssues, results, linkChecks };
  const jsonPath = path.join(outDir, `local-seo-crawl-${timestamp}.json`);
  const mdPath = path.join(outDir, `local-seo-crawl-${timestamp}.md`);
  await writeFile(jsonPath, JSON.stringify(report, null, 2));
  await writeFile(path.join(outDir, 'local-seo-crawl-latest.json'), JSON.stringify(report, null, 2));
  await writeFile(mdPath, [
    '# Local SEO Crawl Report',
    '',
    `Base URL: ${baseUrl}`,
    `Generated: ${report.generatedAt}`,
    `Routes checked: ${routes.length}`,
    `Global issues: ${globalIssues.length}`,
    `Pages with issues: ${failingPages.length}`,
    `Broken internal links: ${failingLinks.length}`,
    '',
    '## Global issues',
    globalIssues.length ? globalIssues.map((issue) => `- ${issue}`).join('\n') : 'None.',
    '',
    '## Page issues',
    failingPages.length ? failingPages.map((page) => `- ${page.route}: ${page.issues.join('; ')}`).join('\n') : 'None.',
    '',
    '## Broken internal links',
    failingLinks.length ? failingLinks.map((link) => `- ${link.href}: ${link.status}${link.error ? ` (${link.error})` : ''}`).join('\n') : 'None.'
  ].join('\n'));

  console.log(`Routes checked: ${routes.length}`);
  console.log(`Global issues: ${globalIssues.length}`);
  console.log(`Pages with issues: ${failingPages.length}`);
  console.log(`Broken internal links: ${failingLinks.length}`);
  console.log(`JSON report: ${jsonPath}`);
  console.log(`Markdown report: ${mdPath}`);
  if (globalIssues.length || failingPages.length || failingLinks.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
