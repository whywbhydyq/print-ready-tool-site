import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allRoutes, byPath, trust } from '@/src/lib/content';
import { absoluteUrl } from '@/src/lib/site';
import { toolPageByPath } from '@/src/data/image-tools';
import { PixelFitPage } from '@/src/components/PixelFitClient';
import { articleByPath } from '@/src/lib/printArticles';
import { PrintArticlePage } from '@/src/components/PrintArticlePage';
import { StaticPrintToolPage } from '@/src/components/StaticPrintToolPage';
import { StaticContentPage } from '@/src/components/StaticContentPage';
import { SourceLibraryPage } from '@/src/components/SourceLibraryPage';
import { ContentClustersPage } from '@/src/components/ContentClustersPage';
import { staticPageByPath } from '@/src/lib/staticPageContent';
import { safeJsonLd } from '@/src/lib/seo/jsonLd';
import { pageSeoDescription, pageSeoTitle } from '@/src/lib/seo/metadata';
import { openGraphImage, twitterImages } from '@/src/lib/seo/social';
const extra: Record<string, string> = {
  '/about/': 'Print Ready Tools is a YmirTool site that provides free browser-based calculators for print sizes, DPI, bleed, safe zones, KDP covers, Etsy printable files, and PixelFit image size tools. We are independent and not affiliated with Amazon, Etsy, Canva, Adobe, YouTube, TikTok, LinkedIn or X.',
  '/contact/': 'For corrections, source updates or feature requests, contact ymirtool@ymirtool.com. Do not send files containing private customer data.',
  '/privacy/': 'YmirTool designs these tools so images are checked locally in your browser and are not uploaded or stored. Analytics should only use anonymous aggregate events and never record file names or exact image content.',
  '/terms/': 'These YmirTool tools are provided as-is for general print setup, image size, DPI and safe-zone guidance. Verify final requirements with your printer, marketplace or platform.',
  '/disclaimer/': 'YmirTool does not guarantee KDP, Etsy, platform upload, social media display or print approval. Official templates and platform specifications override calculator estimates.',
  '/glossary/': 'DPI/PPI: pixels per inch for print sizing. Bleed: extra artwork beyond trim. Safe zone: area for important content. Trim: final cut size. Aspect ratio: width-to-height proportion.',
  '/sources/': 'Print Ready Tools maintains a centralized source library for KDP, print production, marketplace image, app store image, and social image specifications. Official platform documentation and printer templates override calculator guidance when requirements differ.',
  '/content-clusters/': 'Print Ready Tools publishes a content cluster map that connects each calculator hub with supporting guides, templates, source notes, user stories, and measurement signals for search experience optimization.',
  '/templates/etsy-buyer-instruction-template/': 'Thank you for purchasing this printable. Choose the ratio file matching your frame, print at 100% scale, and use high-quality paper or a professional print shop. Files are for personal use only unless your listing says otherwise.',
  '/templates/kdp-cover-setup-checklist/': 'KDP cover checklist: calculate trim, spine and bleed; create one PDF with back cover, spine and front cover; keep text in the safe zone; leave barcode space; verify with the official KDP previewer.',
  '/templates/print-ready-pdf-checklist/': 'Print-ready PDF checklist: correct page size, required bleed, embedded fonts, high-resolution images, safe-zone content, correct color profile, and printer-specific export settings.'
};
type PageProps = { params: { slug: string[] } };
function pathFromSlug(slug: string[]) { return '/' + slug.join('/') + '/'; }
export const dynamicParams = false;
export function generateStaticParams() { return allRoutes.filter((href) => href !== '/').map((href) => ({ slug: href.split('/').filter(Boolean) })); }
const aliasToPixelPath: Record<string, string> = {
  '/print-size-calculator/': '/image-size/print-size-calculator/',
  '/dpi-calculator/': '/image-size/dpi-calculator/'
};
const pixelCanonicalPath: Record<string, string> = {
  '/image-size/print-size-calculator/': '/print-size-calculator/',
  '/image-size/dpi-calculator/': '/dpi-calculator/'
};
const fulfilledStaticToolPaths = new Set([
  '/kdp-interior-bleed-calculator/',
  '/image-print-quality-checker/',
  '/bleed-safe-zone-calculator/',
  '/etsy-printable-size-calculator/',
  '/common-print-sizes/'
]);

const trustDetails: Record<string, { heading: string; body: string[] }[]> = {
  '/about/': [
    { heading: 'What this site does', body: ['Print Ready Tools provides browser-based calculators for print production planning. The site focuses on measurable setup questions: paper size, image pixels, effective PPI, bleed, safe-zone planning, KDP paperback cover dimensions, and marketplace image export targets.', 'The tools are designed for early production decisions before you open a design app or upload a file. They help you choose a canvas size, check whether an image is large enough, and copy calculation results into a production checklist.'] },
    { heading: 'Independence and limitations', body: ['Print Ready Tools is operated as a YmirTool site and is independent from Amazon, Etsy, Canva, Adobe, Meta, Google, TikTok, LinkedIn, X, and print vendors. Brand and platform names are used only to describe file setup contexts.', 'The calculators do not approve files. Official templates, platform upload systems, printer preflight tools, and live previewers remain the final authority when requirements differ from a calculator result.'] }
  ],
  '/contact/': [
    { heading: 'What to send', body: ['Use contact email for specification corrections, broken links, source updates, calculator bugs, and feature requests. The most useful report includes the page URL, the expected result, the result you saw, and the printer or platform source that supports the correction.', 'Do not send private customer files, unpublished manuscripts, identification documents, or sensitive images. For image-size issues, describe the pixel dimensions and target output size instead of attaching the file.'] },
    { heading: 'Correction workflow', body: ['When a specification appears outdated, the preferred correction path is to update the centralized data source and then verify the affected calculator, metadata, structured data, sitemap entry, and source note. This keeps visible guidance and machine-readable data aligned.', 'Feature requests are prioritized when they improve measurable output: more accurate formulas, clearer warnings, better export copy, or additional calculator presets that reduce production mistakes. Include the practical workflow you are trying to complete so the requested change can be checked against a real use case.'] }
  ],
  '/privacy/': [
    { heading: 'Local image handling', body: ['PixelFit image tools are designed to read image dimensions locally in the browser. The site should not require uploading user images to a server for dimension checks, safe-zone previews, ratio checks, or print-quality calculations.', 'Because calculations are local, users can check file dimensions without sending image contents, file names, customer artwork, or draft publishing assets to Print Ready Tools. Browser memory and local object URLs are used for previews where supported.'] },
    { heading: 'Operational data', body: ['The site may use ordinary hosting logs, browser requests, and aggregate analytics to understand performance and usage. Analytics should not intentionally record uploaded image contents, exact file names, private customer data, or unpublished manuscript material.', 'If advertising or analytics scripts are present, they are separate from local calculator logic. Users should avoid entering confidential or regulated information into public web tools unless the tool explicitly supports that workflow.'] }
  ],
  '/terms/': [
    { heading: 'Permitted use', body: ['The tools are provided for general print setup, image sizing, and marketplace production planning. You may use calculator outputs to plan design canvases, communicate with clients, prepare checklists, and compare your files with printer or platform requirements.', 'The site is not a substitute for professional prepress review, legal review, accessibility review, trademark clearance, or marketplace policy approval. You are responsible for checking final files before ordering prints or publishing products.'] },
    { heading: 'No approval guarantee', body: ['Calculator results are estimates based on the selected inputs and available source guidance. A file can have correct dimensions and still fail for color, content policy, font, transparency, barcode, compression, or account-specific reasons.', 'By using the site, you agree to verify final requirements with the official platform, printer template, upload previewer, or production contact. If a source changes, the official current source overrides older site content.'] }
  ],
  '/disclaimer/': [
    { heading: 'Planning tool scope', body: ['Print Ready Tools calculates measurable setup values such as inches, pixels, bleed, safe-zone rectangles, spine width, and aspect-ratio differences. These values are useful for planning, but they do not cover every reason a file can be rejected or print poorly.', 'Print production also depends on paper, ink, finishing, color profile, compression, font handling, transparency, trim tolerance, marketplace policy, and the exact export settings used in your design application.'] },
    { heading: 'Final authority', body: ['KDP, Etsy, Google Play, App Store Connect, social platforms, local printers, and print-on-demand vendors can change requirements. When this site conflicts with an official current template, upload validator, previewer, or vendor instruction, the official or vendor-specific requirement controls.', 'Use the calculators to reduce setup mistakes, then run the final file through the appropriate previewer, proof, or preflight workflow before publishing, selling, or ordering production prints.'] }
  ],
  '/glossary/': [
    { heading: 'Core print terms', body: ['DPI and PPI are often used together in print planning. In these tools, PPI means the effective number of image pixels available per printed inch. A 3000 pixel image printed 10 inches wide has 300 PPI across that width.', 'Trim is the final cut size. Bleed is extra artwork outside the trim that prevents white edges after cutting. Safe zone is the interior area where important text, logos, QR codes, and faces should stay.'] },
    { heading: 'Image and layout terms', body: ['Aspect ratio is the relationship between width and height, such as 16:9, 4:5, or 2:3. Megapixels equal width times height divided by one million. Canvas means the full working area of an exported image or PDF.', 'Crop removes part of the image to fit a target ratio. Padding keeps the whole image visible by adding borders or background space. Effective PPI should be checked after scaling an image in the final layout, not only from the original file.'] }
  ],
  '/content-clusters/': [
    { heading: 'What the content cluster map covers', body: ['The content cluster map documents how calculator hubs, guide spokes, templates, and source-library pages work together. It is intended for users checking the site structure, for maintainers planning internal links, and for crawlers that need a concise view of topical coverage.', 'Each cluster includes a user intent, a primary hub URL, supporting spoke URLs, linkable asset notes, and measurement signals. This makes it easier to detect gaps after adding new calculators or articles.'] },
    { heading: 'How updates are handled', body: ['When a new guide or tool is added, it should be attached to the closest cluster rather than left as an orphan page. If a page changes intent, its internal links, sitemap freshness, metadata, and llms.txt references should be reviewed together.', 'The map is not a keyword-volume report. Live SERP, Search Console, and backlink data should be layered on top after deployment to decide which clusters deserve more content investment.'] }
  ],
  '/sources/': [
    { heading: 'What the source library covers', body: ['The source library centralizes external references used across calculators and guides. It includes KDP documentation, platform image-size specifications, app-store asset references, marketplace image requirements, and selected print-production references.', 'The page separates official platform documentation from strong secondary references and internal planning estimates, so users and AI systems can distinguish deterministic calculator math from fast-changing platform requirements.'] },
    { heading: 'How updates are handled', body: ['When a source changes, the data record, visible calculator copy, structured data, sitemap freshness, and crawler checks should be updated together. This prevents a calculator from showing one requirement while metadata, source notes, or AI-readable summaries imply another.', 'Users can report outdated specifications through the contact page. The preferred correction includes the affected Print Ready Tools URL and the current official source URL.'] }
  ]
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  const path = pathFromSlug(slug);
  const article = articleByPath(path);
  if (article) {
    return {
      title: pageSeoTitle(article.path, article.title),
      description: pageSeoDescription(article.path, article.description),
      alternates: { canonical: absoluteUrl(article.path) },
      openGraph: { title: pageSeoTitle(article.path, article.title), description: pageSeoDescription(article.path, article.description), url: absoluteUrl(article.path), siteName: 'Print Ready Tools', type: 'article', images: openGraphImage() },
      twitter: { card: 'summary_large_image', title: pageSeoTitle(article.path, article.title), description: pageSeoDescription(article.path, article.description), images: twitterImages() }
    };
  }
  const aliasTarget = aliasToPixelPath[path];
  const pixel = toolPageByPath(aliasTarget || path);
  if (pixel) {
    const pixelPath = aliasTarget || path;
    const canonicalPath = pixelCanonicalPath[pixelPath] || path;
    const title = pageSeoTitle(canonicalPath, pixel.title);
    const description = pageSeoDescription(canonicalPath, pixel.description);
    return { title, description, alternates: { canonical: absoluteUrl(canonicalPath) }, openGraph: { title, description, url: absoluteUrl(canonicalPath), siteName: 'Print Ready Tools', type: 'website', images: openGraphImage() }, twitter: { card: 'summary_large_image', title, description, images: twitterImages() } };
  }
  const staticPage = staticPageByPath(path);
  const item = byPath(path); const rawTitle = staticPage?.title || item?.[1] || 'Print Ready Guide'; const rawDescription = staticPage?.description || item?.[2] || 'Print-ready calculator guide and checklist.';
  const title = pageSeoTitle(path, rawTitle); const description = pageSeoDescription(path, rawDescription);
  return { title, description, alternates: { canonical: absoluteUrl(path) }, openGraph: { title, description, url: absoluteUrl(path), siteName: 'Print Ready Tools', type: staticPage?.kind === 'guide' ? 'article' : 'website', images: openGraphImage() }, twitter: { card: 'summary_large_image', title, description, images: twitterImages() } };
}
export default async function Page({ params }: PageProps) {
  const { slug } = params;
  const path = pathFromSlug(slug);
  const article = articleByPath(path);
  if (article) return <PrintArticlePage article={article} />;
  if (path === '/sources/') return <SourceLibraryPage />;
  if (path === '/content-clusters/') return <ContentClustersPage />;
  const aliasTarget = aliasToPixelPath[path];
  const pixel = toolPageByPath(aliasTarget || path);
  if (pixel) return <PixelFitPage page={pixel} />;
  if (fulfilledStaticToolPaths.has(path)) return <StaticPrintToolPage path={path} />;
  const staticPage = staticPageByPath(path);
  if (staticPage) return <StaticContentPage page={staticPage} />;
  const item = byPath(path); if (!item) notFound();
  const [, title, desc] = item;
  const body = extra[path] || `${desc} Use the related calculator to enter your own values, review formulas, copy results, and download guide templates. This page explains when the result applies, when it does not, and what official platform checks still matter.`;
  const isTrustPage = trust.some(([trustHref]) => trustHref === path);
  const staticPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': isTrustPage ? 'WebPage' : 'Article',
    name: title,
    headline: title,
    description: desc,
    url: absoluteUrl(path),
    dateModified: '2026-06-06',
    publisher: { '@type': 'Organization', name: 'Print Ready Tools', url: absoluteUrl('/') }
  };
  return <main className="container stack"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(staticPageJsonLd) }} /><article className="card"><h1>{title}</h1><p>{body}</p>{isTrustPage ? trustDetails[path]?.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>) : <><h2>Formula or rule</h2><p>Use physical size × DPI for pixel requirements. For bleed, add bleed to both sides. For safe zones, keep important content inside the marked interior region.</p><h2>Worked example</h2><p>At 300 DPI, an 8 × 10 inch print needs 2400 × 3000 pixels. A4 at 300 DPI is about 2480 × 3508 pixels.</p><h2>Limits</h2><p>Printer, paper, marketplace and platform requirements vary. Use official templates and upload previewers as the final check.</p></>}<h2>Related calculators</h2><p><Link href="/image-size/">PixelFit Image Size Tools</Link> · <Link href="/print-size-calculator/">Image Print Size Calculator</Link> · <Link href="/dpi-calculator/">DPI / PPI Calculator</Link> · <Link href="/image-size/a4-size-in-pixels/">A4 Size in Pixels</Link> · <Link href="/image-size/youtube-banner-safe-area/">YouTube Banner Safe Area</Link></p><p className="small muted">Last updated 2026-06-06.</p></article></main>;
}
