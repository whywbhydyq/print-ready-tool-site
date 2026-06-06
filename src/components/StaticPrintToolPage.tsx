'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CopyButton } from '@/src/components/CopyButton';
import { ImageUploadPreview, type LocalImage } from '@/src/components/ImageUploadPreview';
import { ResultCard } from '@/src/components/ResultCard';
import { fromInches, toInches, type LengthUnit } from '@/src/lib/image-tools/dpi';
import { calculateRequiredPixels, effectivePpi, gradePrintQuality } from '@/src/lib/image-tools/printSize';
import { round } from '@/src/lib/image-tools/format';
import { absoluteUrl } from '@/src/lib/site';
import { safeJsonLd } from '@/src/lib/seo/jsonLd';
import { ReviewSignal } from '@/src/components/seo/ReviewSignal';

type StaticToolKey = 'interior-bleed' | 'image-print-quality' | 'bleed-safe-zone' | 'etsy-printable' | 'common-print-sizes';

type ToolConfig = {
  key: StaticToolKey;
  title: string;
  description: string;
  path: string;
  primaryOutput: string;
};

export const staticToolConfigs: Record<string, ToolConfig> = {
  '/kdp-interior-bleed-calculator/': {
    key: 'interior-bleed',
    title: 'KDP Interior Bleed Calculator',
    description: 'Calculate manuscript page size with bleed, trim size, safe margin, and export pixels for KDP paperback interiors.',
    path: '/kdp-interior-bleed-calculator/',
    primaryOutput: 'full-bleed interior page size'
  },
  '/image-print-quality-checker/': {
    key: 'image-print-quality',
    title: 'Image Print Quality Checker',
    description: 'Check a local image against a target print size and see effective PPI, quality grade, shortfall, and required pixels.',
    path: '/image-print-quality-checker/',
    primaryOutput: 'effective PPI and print quality grade'
  },
  '/bleed-safe-zone-calculator/': {
    key: 'bleed-safe-zone',
    title: 'Bleed & Safe Zone Calculator',
    description: 'Calculate trim size, full bleed canvas, safe-zone rectangle, and pixel dimensions for print layouts.',
    path: '/bleed-safe-zone-calculator/',
    primaryOutput: 'trim, bleed, safe-zone, and pixel canvas'
  },
  '/etsy-printable-size-calculator/': {
    key: 'etsy-printable',
    title: 'Etsy Printable Size Pack Calculator',
    description: 'Generate printable wall-art ratio packs, pixel exports, and buyer instruction text for common Etsy downloads.',
    path: '/etsy-printable-size-calculator/',
    primaryOutput: 'ratio pack sizes and buyer instructions'
  },
  '/common-print-sizes/': {
    key: 'common-print-sizes',
    title: 'Common Print Sizes Library',
    description: 'Reference common photo, poster, document, card, and marketplace print sizes in inches, cm, mm, and pixels.',
    path: '/common-print-sizes/',
    primaryOutput: 'common size conversion table'
  }
};

const unitLabels: Record<LengthUnit, string> = { in: 'in', cm: 'cm', mm: 'mm' };

const trimPresets = [
  { label: 'KDP 5 × 8 in', width: 5, height: 8 },
  { label: 'KDP 5.5 × 8.5 in', width: 5.5, height: 8.5 },
  { label: 'KDP 6 × 9 in', width: 6, height: 9 },
  { label: 'KDP 7 × 10 in', width: 7, height: 10 },
  { label: 'KDP 8.5 × 11 in', width: 8.5, height: 11 },
  { label: 'Custom', width: 6, height: 9 }
];

const commonSizes = [
  { group: 'Photo', name: '4 × 6 photo', widthIn: 4, heightIn: 6, note: 'Standard small photo print.' },
  { group: 'Photo', name: '5 × 7 photo', widthIn: 5, heightIn: 7, note: 'Common frame and greeting-card insert.' },
  { group: 'Photo', name: '8 × 10 photo', widthIn: 8, heightIn: 10, note: 'Classic portrait and art print size.' },
  { group: 'Poster', name: '11 × 14 poster', widthIn: 11, heightIn: 14, note: 'Popular wall-art ratio.' },
  { group: 'Poster', name: '12 × 18 poster', widthIn: 12, heightIn: 18, note: '2:3 wall-art size.' },
  { group: 'Poster', name: '16 × 20 poster', widthIn: 16, heightIn: 20, note: '4:5 wall-art size.' },
  { group: 'Poster', name: '18 × 24 poster', widthIn: 18, heightIn: 24, note: '3:4 poster size.' },
  { group: 'Poster', name: '24 × 36 poster', widthIn: 24, heightIn: 36, note: 'Large 2:3 poster.' },
  { group: 'Document', name: 'US Letter', widthIn: 8.5, heightIn: 11, note: 'US document and worksheet size.' },
  { group: 'Document', name: 'A4', widthIn: 8.27, heightIn: 11.69, note: 'ISO document size.' },
  { group: 'Card', name: 'US business card with bleed', widthIn: 3.75, heightIn: 2.25, note: '3.5 × 2 in trim plus 0.125 in bleed.' },
  { group: 'KDP', name: 'KDP 6 × 9 trim', widthIn: 6, heightIn: 9, note: 'Common paperback trim.' }
];

const etsyRatios = [
  { label: '2:3', ratio: 2 / 3, examples: '4×6, 8×12, 12×18, 16×24, 20×30, 24×36' },
  { label: '3:4', ratio: 3 / 4, examples: '6×8, 9×12, 12×16, 15×20, 18×24' },
  { label: '4:5', ratio: 4 / 5, examples: '4×5, 8×10, 12×15, 16×20' },
  { label: '5:7', ratio: 5 / 7, examples: '5×7, 10×14, 15×21' },
  { label: '11:14', ratio: 11 / 14, examples: '11×14, 22×28' },
  { label: 'ISO A', ratio: 1 / Math.SQRT2, examples: 'A5, A4, A3, A2' },
  { label: 'Square', ratio: 1, examples: '8×8, 10×10, 12×12, 20×20' }
];

function formatNumber(value: number, decimals = 2) {
  return round(value, decimals).toLocaleString('en-US', { maximumFractionDigits: decimals });
}

function formatDimension(widthIn: number, heightIn: number, unit: LengthUnit) {
  return `${formatNumber(fromInches(widthIn, unit), unit === 'in' ? 3 : 1)} × ${formatNumber(fromInches(heightIn, unit), unit === 'in' ? 3 : 1)} ${unitLabels[unit]}`;
}

function jsonLd(config: ToolConfig) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: config.title,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Any',
        url: absoluteUrl(config.path),
        description: config.description,
        isAccessibleForFree: true,
        featureList: ['Visible input controls', config.primaryOutput, 'Copyable result summary', 'Formula and limitation notes'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        creator: { '@type': 'Organization', name: 'Print Ready Tools', url: absoluteUrl('/') },
        dateModified: '2026-06-06',
        image: absoluteUrl('/og-image.png')
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Print Ready Tools', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: config.title, item: absoluteUrl(config.path) }
        ]
      }
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} />;
}

function ToolShell({ config, children }: { config: ToolConfig; children: React.ReactNode }) {
  return (
    <main className="container stack static-tool-page">
      {jsonLd(config)}
      <section className="hero tool-hero">
        <p className="small"><Link href="/">Print Ready Tools</Link></p>
        <h1>{config.title}</h1>
        <p className="lede">{config.description}</p>
        <p className="small muted">Inputs stay in your browser. Results are deterministic planning estimates; your printer, marketplace, or KDP previewer remains the final authority.</p>
        <p className="small muted">Last reviewed 2026-06-06 · Reviewed by Print Ready Tools.</p>
      </section>
      {children}
      <ReviewSignal reviewed="2026-06-06" scope="calculator" />
      <section className="card source-note">
        <h2>Sources, formulas, and limits</h2>
        <p>These calculators use standard print formulas: physical size × PPI for pixels, pixels ÷ physical size for effective PPI, and trim size plus bleed on every outside edge for full-bleed artwork. Marketplace specifications can change, so use official upload previews as the final check before publishing or printing.</p>
        <p className="small muted">Last reviewed 2026-06-06. This site is independent and not affiliated with Amazon KDP, Etsy, Adobe, Canva, or any print provider.</p>
      </section>
      <section className="card">
        <h2>Related next steps</h2>
        <p><Link href="/">KDP cover calculator</Link> · <Link href="/print-size-calculator/">Print size calculator</Link> · <Link href="/dpi-calculator/">DPI calculator</Link> · <Link href="/image-size/">PixelFit image tools</Link> · <Link href="/templates/print-ready-pdf-checklist/">Print-ready PDF checklist</Link></p>
      </section>
    </main>
  );
}

function InteriorBleedTool({ config }: { config: ToolConfig }) {
  const [presetIndex, setPresetIndex] = useState(2);
  const [unit, setUnit] = useState<LengthUnit>('in');
  const [customWidth, setCustomWidth] = useState(6);
  const [customHeight, setCustomHeight] = useState(9);
  const [bleed, setBleed] = useState(0.125);
  const [safeMargin, setSafeMargin] = useState(0.375);
  const [ppi, setPpi] = useState(300);
  const selected = trimPresets[presetIndex] || trimPresets[2];
  const widthIn = selected.label === 'Custom' ? Math.max(1, toInches(customWidth, unit)) : selected.width;
  const heightIn = selected.label === 'Custom' ? Math.max(1, toInches(customHeight, unit)) : selected.height;
  const bleedIn = Math.max(0, Math.min(0.5, bleed));
  const safeIn = Math.max(0, Math.min(2, safeMargin));
  const fullWidthIn = widthIn + bleedIn * 2;
  const fullHeightIn = heightIn + bleedIn * 2;
  const safeWidthIn = Math.max(0, widthIn - safeIn * 2);
  const safeHeightIn = Math.max(0, heightIn - safeIn * 2);
  const pixels = calculateRequiredPixels(fullWidthIn, fullHeightIn, 'in', Math.max(72, ppi));
  const summary = `KDP interior trim: ${formatDimension(widthIn, heightIn, 'in')}\nFull bleed page: ${formatDimension(fullWidthIn, fullHeightIn, 'in')}\nSafe text area: ${formatDimension(safeWidthIn, safeHeightIn, 'in')}\nPixel canvas: ${pixels.widthPx} × ${pixels.heightPx}px at ${ppi} PPI\nBleed: ${formatNumber(bleedIn, 3)} in on every outside edge.`;

  return (
    <ToolShell config={config}>
      <section className="tool workspace stack">
        <div className="workspace-grid">
          <div className="card control-panel stack">
            <h2>Enter interior page specs</h2>
            <label>Trim preset<select value={presetIndex} onChange={(event) => setPresetIndex(Number(event.target.value))}>{trimPresets.map((preset, index) => <option value={index} key={preset.label}>{preset.label}</option>)}</select></label>
            {selected.label === 'Custom' && <div className="formgrid"><label>Unit<select value={unit} onChange={(event) => setUnit(event.target.value as LengthUnit)}><option value="in">Inches</option><option value="cm">Centimetres</option><option value="mm">Millimetres</option></select></label><label>Custom width<input type="number" min="1" step="0.01" value={customWidth} onChange={(event) => setCustomWidth(Number(event.target.value))} /></label><label>Custom height<input type="number" min="1" step="0.01" value={customHeight} onChange={(event) => setCustomHeight(Number(event.target.value))} /></label></div>}
            <div className="formgrid"><label>Bleed per edge, inches<input type="number" min="0" max="0.5" step="0.001" value={bleed} onChange={(event) => setBleed(Number(event.target.value))} /></label><label>Safe margin per edge, inches<input type="number" min="0" max="2" step="0.01" value={safeMargin} onChange={(event) => setSafeMargin(Number(event.target.value))} /></label><label>PPI for export pixels<input type="number" min="72" max="1200" step="1" value={ppi} onChange={(event) => setPpi(Number(event.target.value))} /></label></div>
          </div>
          <ResultCard title="Interior bleed result">
            <div className="metric-grid"><div><span>Full bleed page</span><strong>{formatDimension(fullWidthIn, fullHeightIn, 'in')}</strong></div><div><span>Safe text area</span><strong>{formatDimension(safeWidthIn, safeHeightIn, 'in')}</strong></div><div><span>Pixel canvas</span><strong>{pixels.widthPx} × {pixels.heightPx}px</strong></div></div>
            <p>The formula is <code>full page = trim + bleed × 2</code>. Keep body text and page numbers inside the safe area, not on the trim or bleed line.</p>
            <CopyButton text={summary} label="Copy interior result" />
          </ResultCard>
        </div>
      </section>
      <section className="card"><h2>Worked example</h2><p>A 6 × 9 in paperback interior with 0.125 in bleed exports as 6.25 × 9.25 in. At 300 PPI that equals 1875 × 2775 px for a single full-bleed page background. Text should still stay inside the trim-safe area.</p></section>
    </ToolShell>
  );
}

function ImagePrintQualityTool({ config }: { config: ToolConfig }) {
  const [image, setImage] = useState<LocalImage | null>(null);
  const [manualWidth, setManualWidth] = useState(2400);
  const [manualHeight, setManualHeight] = useState(3000);
  const [targetWidth, setTargetWidth] = useState(8);
  const [targetHeight, setTargetHeight] = useState(10);
  const [unit, setUnit] = useState<LengthUnit>('in');
  const widthPx = image?.width || manualWidth;
  const heightPx = image?.height || manualHeight;
  const ppi = effectivePpi(widthPx, heightPx, targetWidth, targetHeight, unit);
  const grade = gradePrintQuality(ppi);
  const required300 = calculateRequiredPixels(targetWidth, targetHeight, unit, 300);
  const shortfallW = Math.max(0, required300.widthPx - widthPx);
  const shortfallH = Math.max(0, required300.heightPx - heightPx);
  const summary = `Image: ${widthPx} × ${heightPx}px\nTarget print: ${targetWidth} × ${targetHeight} ${unit}\nEffective PPI: ${formatNumber(ppi, 1)}\nQuality grade: ${grade}\n300 PPI target: ${required300.widthPx} × ${required300.heightPx}px\nShortfall: ${shortfallW} px wide, ${shortfallH} px tall.`;

  return (
    <ToolShell config={config}>
      <section className="tool workspace stack">
        <div className="workspace-grid">
          <div className="stack">
            <ImageUploadPreview onImage={setImage} />
            <div className="card control-panel stack"><h2>Manual dimensions or target print size</h2><div className="formgrid"><label>Image width px<input type="number" min="1" value={manualWidth} onChange={(event) => setManualWidth(Number(event.target.value))} /></label><label>Image height px<input type="number" min="1" value={manualHeight} onChange={(event) => setManualHeight(Number(event.target.value))} /></label><label>Target width<input type="number" min="0.1" step="0.1" value={targetWidth} onChange={(event) => setTargetWidth(Number(event.target.value))} /></label><label>Target height<input type="number" min="0.1" step="0.1" value={targetHeight} onChange={(event) => setTargetHeight(Number(event.target.value))} /></label><label>Unit<select value={unit} onChange={(event) => setUnit(event.target.value as LengthUnit)}><option value="in">Inches</option><option value="cm">Centimetres</option><option value="mm">Millimetres</option></select></label></div></div>
          </div>
          <ResultCard title="Print quality result">
            <div className="metric-grid"><div><span>Effective PPI</span><strong>{formatNumber(ppi, 1)}</strong></div><div><span>Grade</span><strong>{grade}</strong></div><div><span>300 PPI target</span><strong>{required300.widthPx} × {required300.heightPx}px</strong></div></div>
            <p>{grade === 'High' ? 'This image meets the common 300 PPI print target for the selected size.' : 'This image is below a 300 PPI target for the selected size. Use a smaller print size, a higher-resolution original, or accept softer output.'}</p>
            <p>Width shortfall: {shortfallW}px. Height shortfall: {shortfallH}px.</p>
            <CopyButton text={summary} label="Copy quality result" />
          </ResultCard>
        </div>
      </section>
      <section className="card"><h2>How to read the result</h2><p>Effective PPI is the lower of horizontal PPI and vertical PPI. 300 PPI is a common high-quality target for close-viewed prints, 200 PPI is often acceptable, 150 PPI is visibly softer, and lower values are usually risky unless viewed from far away.</p></section>
    </ToolShell>
  );
}

function BleedSafeZoneTool({ config }: { config: ToolConfig }) {
  const [width, setWidth] = useState(8);
  const [height, setHeight] = useState(10);
  const [unit, setUnit] = useState<LengthUnit>('in');
  const [bleed, setBleed] = useState(0.125);
  const [safe, setSafe] = useState(0.25);
  const [ppi, setPpi] = useState(300);
  const widthIn = Math.max(0.1, toInches(width, unit));
  const heightIn = Math.max(0.1, toInches(height, unit));
  const bleedIn = Math.max(0, Math.min(2, bleed));
  const safeIn = Math.max(0, Math.min(3, safe));
  const fullWidthIn = widthIn + bleedIn * 2;
  const fullHeightIn = heightIn + bleedIn * 2;
  const safeWidthIn = Math.max(0, widthIn - safeIn * 2);
  const safeHeightIn = Math.max(0, heightIn - safeIn * 2);
  const fullPixels = calculateRequiredPixels(fullWidthIn, fullHeightIn, 'in', ppi);
  const trimPixels = calculateRequiredPixels(widthIn, heightIn, 'in', ppi);
  const summary = `Trim: ${formatDimension(widthIn, heightIn, 'in')}\nFull bleed canvas: ${formatDimension(fullWidthIn, fullHeightIn, 'in')}\nSafe zone: ${formatDimension(safeWidthIn, safeHeightIn, 'in')}\nFull bleed pixels: ${fullPixels.widthPx} × ${fullPixels.heightPx}px at ${ppi} PPI\nTrim pixels: ${trimPixels.widthPx} × ${trimPixels.heightPx}px.`;

  return (
    <ToolShell config={config}>
      <section className="tool workspace stack"><div className="workspace-grid"><div className="card control-panel stack"><h2>Enter trim, bleed, and safe margin</h2><div className="formgrid"><label>Trim width<input type="number" min="0.1" step="0.01" value={width} onChange={(event) => setWidth(Number(event.target.value))} /></label><label>Trim height<input type="number" min="0.1" step="0.01" value={height} onChange={(event) => setHeight(Number(event.target.value))} /></label><label>Unit<select value={unit} onChange={(event) => setUnit(event.target.value as LengthUnit)}><option value="in">Inches</option><option value="cm">Centimetres</option><option value="mm">Millimetres</option></select></label><label>Bleed per edge, inches<input type="number" min="0" max="2" step="0.001" value={bleed} onChange={(event) => setBleed(Number(event.target.value))} /></label><label>Safe margin per edge, inches<input type="number" min="0" max="3" step="0.01" value={safe} onChange={(event) => setSafe(Number(event.target.value))} /></label><label>PPI<input type="number" min="72" max="1200" value={ppi} onChange={(event) => setPpi(Number(event.target.value))} /></label></div></div><ResultCard title="Bleed and safe-zone result"><div className="metric-grid"><div><span>Full bleed</span><strong>{formatDimension(fullWidthIn, fullHeightIn, 'in')}</strong></div><div><span>Safe zone</span><strong>{formatDimension(safeWidthIn, safeHeightIn, 'in')}</strong></div><div><span>Full pixels</span><strong>{fullPixels.widthPx} × {fullPixels.heightPx}px</strong></div></div><p>The formula is <code>full bleed = trim + bleed × 2</code>. The safe zone is <code>trim - safe margin × 2</code>. Important text, logos, faces, and QR codes should remain inside the safe-zone rectangle.</p><CopyButton text={summary} label="Copy bleed result" /></ResultCard></div></section>
      <section className="card"><h2>Common use</h2><p>For many print products, 0.125 in bleed and 0.25 in safe margin are practical starting values. Packaging, wide-format posters, and marketplace templates may require different values, so always match the printer template before exporting final artwork.</p></section>
    </ToolShell>
  );
}

function EtsyPrintableTool({ config }: { config: ToolConfig }) {
  const [longEdge, setLongEdge] = useState(24);
  const [ppi, setPpi] = useState(300);
  const rows = useMemo(() => etsyRatios.map((item) => {
    const heightIn = longEdge;
    const widthIn = item.ratio * heightIn;
    const pixels = calculateRequiredPixels(widthIn, heightIn, 'in', ppi);
    return { ...item, widthIn, heightIn, pixels };
  }), [longEdge, ppi]);
  const instruction = `Download the ratio file that matches your frame. Print at 100% scale, do not use fit-to-page unless your print shop requires it, and choose the file closest to your frame ratio. For best results use matte or fine-art paper and verify the preview before printing.`;
  const summary = rows.map((row) => `${row.label}\t${formatNumber(row.widthIn, 2)}×${formatNumber(row.heightIn, 2)} in\t${row.pixels.widthPx}×${row.pixels.heightPx}px\t${row.examples}`).join('\n');

  return (
    <ToolShell config={config}>
      <section className="tool workspace stack"><div className="workspace-grid"><div className="card control-panel stack"><h2>Generate a printable ratio pack</h2><label>Maximum long edge, inches<input type="number" min="4" max="60" step="0.5" value={longEdge} onChange={(event) => setLongEdge(Number(event.target.value))} /></label><label>PPI for export pixels<input type="number" min="72" max="1200" step="1" value={ppi} onChange={(event) => setPpi(Number(event.target.value))} /></label><p className="small muted">The calculator creates one maximum-size export for each ratio. Buyers can scale that file down to smaller frames with the same ratio.</p></div><ResultCard title="Etsy ratio pack output"><div className="table-wrap"><table><thead><tr><th>Ratio file</th><th>Export size</th><th>Pixels</th><th>Buyer examples</th></tr></thead><tbody>{rows.map((row) => <tr key={row.label}><td>{row.label}</td><td>{formatNumber(row.widthIn, 2)} × {formatNumber(row.heightIn, 2)} in</td><td>{row.pixels.widthPx} × {row.pixels.heightPx}px</td><td>{row.examples}</td></tr>)}</tbody></table></div><CopyButton text={`${summary}\n\nBuyer instruction:\n${instruction}`} label="Copy Etsy pack" /></ResultCard></div></section>
      <section className="card"><h2>Buyer instruction text</h2><p>{instruction}</p><p>Include a note that color can vary by monitor, paper, printer profile, and print shop. If you include ISO A sizes, name them separately because A-series files do not exactly match common US frame ratios.</p></section>
    </ToolShell>
  );
}

function CommonPrintSizesTool({ config }: { config: ToolConfig }) {
  const [ppi, setPpi] = useState(300);
  const [group, setGroup] = useState('All');
  const groups = ['All', ...Array.from(new Set(commonSizes.map((item) => item.group)))];
  const rows = commonSizes.filter((item) => group === 'All' || item.group === group).map((item) => ({ ...item, pixels: calculateRequiredPixels(item.widthIn, item.heightIn, 'in', ppi) }));
  const summary = rows.map((row) => `${row.name}\t${formatDimension(row.widthIn, row.heightIn, 'in')}\t${formatDimension(row.widthIn, row.heightIn, 'cm')}\t${row.pixels.widthPx}×${row.pixels.heightPx}px @ ${ppi} PPI`).join('\n');

  return (
    <ToolShell config={config}>
      <section className="tool workspace stack"><div className="card control-panel"><h2>Filter the print size table</h2><div className="formgrid"><label>Group<select value={group} onChange={(event) => setGroup(event.target.value)}>{groups.map((item) => <option key={item}>{item}</option>)}</select></label><label>PPI for pixel column<input type="number" min="72" max="1200" value={ppi} onChange={(event) => setPpi(Number(event.target.value))} /></label></div></div><ResultCard title="Common print sizes"><table><thead><tr><th>Use case</th><th>Size in inches</th><th>Size in cm</th><th>Size in mm</th><th>Pixels at {ppi} PPI</th><th>Note</th></tr></thead><tbody>{rows.map((row) => <tr key={row.name}><td>{row.name}</td><td>{formatDimension(row.widthIn, row.heightIn, 'in')}</td><td>{formatDimension(row.widthIn, row.heightIn, 'cm')}</td><td>{formatDimension(row.widthIn, row.heightIn, 'mm')}</td><td>{row.pixels.widthPx} × {row.pixels.heightPx}</td><td>{row.note}</td></tr>)}</tbody></table><CopyButton text={summary} label="Copy size table" /></ResultCard></section>
      <section className="card"><h2>How to choose a size</h2><p>Start with the physical product or frame size, then multiply inches by the target PPI. Use 300 PPI for close-viewed prints, 200 PPI for many acceptable posters, and lower PPI only when the viewing distance is large or the printer explicitly allows it.</p></section>
    </ToolShell>
  );
}

export function StaticPrintToolPage({ path }: { path: string }) {
  const config = staticToolConfigs[path];
  if (!config) return null;
  if (config.key === 'interior-bleed') return <InteriorBleedTool config={config} />;
  if (config.key === 'image-print-quality') return <ImagePrintQualityTool config={config} />;
  if (config.key === 'bleed-safe-zone') return <BleedSafeZoneTool config={config} />;
  if (config.key === 'etsy-printable') return <EtsyPrintableTool config={config} />;
  return <CommonPrintSizesTool config={config} />;
}
