'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import {
  dpiPresets,
  imageSpecById,
  imageSpecs,
  paperById,
  paperSpecs,
  p0ToolPages,
  p1ToolPages,
  p2ToolPages,
  sourcePolicy,
  toolPageByPath,
  toolPages,
  type ImageSpec,
  type SafeZone,
  type ToolPage
} from '@/src/data/image-tools';
import {
  commonRatios,
  cropFit,
  detectCommonRatio,
  getRatioMismatch,
  padFit,
  simplifyRatio
} from '@/src/lib/image-tools/aspectRatio';
import { calculatePpi, pixelsForPhysicalSize, type LengthUnit } from '@/src/lib/image-tools/dpi';
import { calculatePrintSize, gradePrintQuality } from '@/src/lib/image-tools/printSize';
import { paperPixels } from '@/src/lib/image-tools/paperSize';
import { megapixels } from '@/src/lib/image-tools/megapixel';
import { round } from '@/src/lib/image-tools/format';
import { CopyButton } from '@/src/components/CopyButton';
import { ImageUploadPreview, type LocalImage } from '@/src/components/ImageUploadPreview';
import { OverlayDownloadButtons } from '@/src/components/OverlayDownloadButtons';
import { RelatedTools } from '@/src/components/RelatedTools';
import { ResultCard } from '@/src/components/ResultCard';
import { RiskBadge } from '@/src/components/RiskBadge';
import { SafeZoneCanvas } from '@/src/components/SafeZoneCanvas';

const PRINT_PRESETS = ['a4', 'a5', 'a3', 'letter', 'legal', 'business-card-us'];
const PASSPORT_ALLOWED = [600, 900, 1200];

type RiskLevel = 'safe' | 'warning' | 'danger' | 'info';
type Preset = { label: string; width: number; height: number };

function jsonLd(data: unknown) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function faqJsonLd(page: ToolPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  };
}

function breadcrumbJsonLd(page: ToolPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://print.ymirtool.com/' },
      { '@type': 'ListItem', position: 2, name: 'Image Size Tools', item: 'https://print.ymirtool.com/image-size/' },
      { '@type': 'ListItem', position: 3, name: page.title, item: `https://print.ymirtool.com${page.href}` }
    ]
  };
}

function checklistItem(label: string, ok: boolean | null, detail: string) {
  const level: RiskLevel = ok === null ? 'info' : ok ? 'safe' : 'danger';
  return { label, ok, detail, level };
}

function copyRows(rows: Array<Array<string | number>>) {
  return rows.map((row) => row.join('\t')).join('\n');
}

function collectZones(spec: ImageSpec, preset?: Preset, captionMode: 'short' | 'medium' | 'long' = 'medium', direction: 'ltr' | 'rtl' = 'ltr'): SafeZone[] {
  const baseWidth = preset?.width || spec.recommendedWidth || 1;
  const baseHeight = preset?.height || spec.recommendedHeight || 1;

  if (spec.id === 'youtube-banner') {
    const deviceZones: SafeZone[] = (spec.deviceVariants || []).map((device) => ({
      id: `device-${device.id}`,
      label: `${device.label} visible ${device.visibleWidth}×${device.visibleHeight}`,
      x: Math.max(0, (baseWidth - device.visibleWidth) / 2),
      y: Math.max(0, (baseHeight - device.visibleHeight) / 2),
      width: Math.min(baseWidth, device.visibleWidth),
      height: Math.min(baseHeight, device.visibleHeight),
      unit: 'px',
      severity: device.id === 'mobile' ? 'safe' : device.id === 'tv' ? 'info' : 'warning'
    }));
    return [...deviceZones, ...(spec.safeZones || [])];
  }

  if (spec.id === 'youtube-thumbnail') {
    const comparisonZones: SafeZone[] = [
      { id: 'mobile-4-5-preview', label: 'Mobile 4:5 crop reference', x: 0.21875, y: 0, width: 0.5625, height: 1, unit: 'percent', severity: 'info' }
    ];
    return [...(spec.safeZones || []), ...comparisonZones, ...(spec.cropRiskZones || []), ...(spec.uiObstructionZones || [])];
  }

  if (spec.id === 'short-video-safe-zone') {
    const captionHeight = captionMode === 'short' ? 0.14 : captionMode === 'long' ? 0.27 : 0.20;
    const rightX = direction === 'rtl' ? 0.02 : 0.82;
    return [
      { id: 'top-ui', label: 'Top UI risk', x: 0, y: 0, width: 1, height: 0.10, unit: 'percent', severity: 'warning' },
      { id: 'action-buttons', label: `${direction.toUpperCase()} action buttons`, x: rightX, y: 0.32, width: 0.16, height: 0.40, unit: 'percent', severity: 'warning' },
      { id: 'caption-area', label: `${captionMode} caption / CTA risk`, x: 0, y: 1 - captionHeight, width: 1, height: captionHeight, unit: 'percent', severity: 'warning' },
      { id: 'center-safe', label: 'Center content safe area', x: 0.10, y: 0.15, width: 0.64, height: 0.58, unit: 'percent', severity: 'safe' }
    ];
  }

  if (spec.id === 'linkedin-banner' && preset?.label.toLowerCase().includes('logo')) {
    return [
      { id: 'logo-center-safe', label: 'Logo center safe area', x: 0.15, y: 0.15, width: 0.70, height: 0.70, unit: 'percent', severity: 'safe' },
      { id: 'logo-edge-risk', label: 'Circular crop edge risk', x: 0, y: 0, width: 1, height: 1, unit: 'percent', severity: 'warning' }
    ];
  }

  if (spec.id === 'linkedin-banner' && preset?.label.toLowerCase().includes('url post')) {
    return [
      { id: 'url-post-center', label: 'Center text/logo safe area', x: 0.08, y: 0.12, width: 0.84, height: 0.76, unit: 'percent', severity: 'safe' },
      { id: 'url-post-edge-risk', label: 'Preview edge crop risk', x: 0, y: 0, width: 1, height: 1, unit: 'percent', severity: 'warning' }
    ];
  }

  if (spec.id === 'x-header' && preset?.label.toLowerCase().includes('profile image')) {
    return [
      { id: 'profile-center', label: 'Profile image center safe area', x: 0.14, y: 0.14, width: 0.72, height: 0.72, unit: 'percent', severity: 'safe' },
      { id: 'profile-round-crop', label: 'Round crop edge risk', x: 0, y: 0, width: 1, height: 1, unit: 'percent', severity: 'warning' }
    ];
  }

  return [...(spec.safeZones || []), ...(spec.cropRiskZones || []), ...(spec.uiObstructionZones || [])];
}

function imageChecklist(spec: ImageSpec, width: number, height: number, fileSizeMb: number, format = '') {
  const mp = megapixels(width, height);
  const ratio = spec.recommendedWidth && spec.recommendedHeight ? getRatioMismatch(width, height, spec.recommendedWidth, spec.recommendedHeight) : 0;
  const checks = [
    checklistItem('Minimum width', spec.minWidth ? width >= spec.minWidth : null, spec.minWidth ? `${width}px vs minimum ${spec.minWidth}px` : 'No minimum width listed for this spec.'),
    checklistItem('Minimum height', spec.minHeight ? height >= spec.minHeight : null, spec.minHeight ? `${height}px vs minimum ${spec.minHeight}px` : 'No minimum height listed for this spec.'),
    checklistItem('Recommended canvas', spec.recommendedWidth && spec.recommendedHeight ? width >= spec.recommendedWidth && height >= spec.recommendedHeight : null, spec.recommendedWidth && spec.recommendedHeight ? `${width}×${height}px vs ${spec.recommendedWidth}×${spec.recommendedHeight}px target` : 'No single recommended canvas.'),
    checklistItem('Aspect ratio', spec.recommendedWidth && spec.recommendedHeight ? ratio <= 0.025 : null, spec.recommendedWidth && spec.recommendedHeight ? `${round(ratio * 100, 2)}% ratio mismatch` : 'Variable ratio.'),
    checklistItem('Megapixels', spec.maxMegapixels ? mp <= spec.maxMegapixels : null, spec.maxMegapixels ? `${round(mp, 2)}MP vs maximum ${spec.maxMegapixels}MP` : `${round(mp, 2)}MP; no MP limit listed.`),
    checklistItem('File size', spec.maxFileSizeMB ? fileSizeMb <= spec.maxFileSizeMB : null, spec.maxFileSizeMB ? `${round(fileSizeMb, 2)}MB vs maximum ${spec.maxFileSizeMB}MB` : `${round(fileSizeMb, 2)}MB; no MB limit listed.`),
    checklistItem('Format', spec.supportedFormats?.length ? spec.supportedFormats.some((item) => format.toLowerCase().includes(item.toLowerCase().replace('jpg', 'jpeg'))) : null, spec.supportedFormats?.length ? `Allowed: ${spec.supportedFormats.join(', ')}` : 'No supported format list in this spec.')
  ];
  const dangerCount = checks.filter((item) => item.level === 'danger').length;
  const warningCount = checks.filter((item) => item.level === 'info').length;
  return { checks, level: dangerCount ? 'danger' as const : warningCount ? 'warning' as const : 'safe' as const, mp, ratioMismatch: ratio };
}

function Shell({ page, children, source }: { page: ToolPage; children: ReactNode; source?: ImageSpec }) {
  return (
    <main className="container stack">
      {jsonLd(faqJsonLd(page))}
      {jsonLd(breadcrumbJsonLd(page))}
      <section className="hero tool-hero">
        <p className="small"><Link href="/image-size/">PixelFit image tools</Link></p>
        <h1>{page.title}</h1>
        <p className="lede">{page.description}</p>
      </section>
      <section className="tool workspace stack">{children}</section>
      <section className="card">
        <h2>FAQ</h2>
        {page.faq.map((item) => <p key={item.question}><strong>{item.question}</strong><br />{item.answer}</p>)}
      </section>
      <RelatedTools related={page.related} />
      <section className="card source-note">
        <h2>Sources and limits</h2>
        {source ? (
          <p><strong>{source.sourceConfidence}</strong>: <a href={source.sourceUrl}>{source.sourceLabel}</a>. Last checked {source.lastCheckedAt}.</p>
        ) : (
          <p>Print formulas use standard inch, cm, mm and PPI conversions. Last checked {sourcePolicy.lastReviewedAt}.</p>
        )}
        <p className="small muted">{sourcePolicy.summary}</p>
      </section>
    </main>
  );
}

function Hub({ page }: { page: ToolPage }) {
  const groups = [
    { title: 'Print & DPI', items: p0ToolPages.filter((item) => ['aspect', 'print', 'dpi', 'unit', 'paper'].includes(item.kind)) },
    { title: 'Social safe zones', items: [...p0ToolPages, ...p1ToolPages].filter((item) => item.kind === 'safe' || item.kind === 'pinterest-ratio' || item.kind === 'recommender') },
    { title: 'Product & marketplace', items: [...p1ToolPages, ...p2ToolPages].filter((item) => ['check', 'megapixel'].includes(item.kind) || item.href.includes('marketplace')) },
    { title: 'App store assets', items: p2ToolPages.filter((item) => item.kind === 'matrix' || item.href.includes('google-play') || item.href.includes('app-store') || item.href.includes('screenshot')) },
    { title: 'Overlay downloads & export planning', items: p2ToolPages.filter((item) => item.kind === 'overlay-hub' || item.kind === 'batch') },
    { title: 'Reference databases', items: p2ToolPages.filter((item) => item.kind === 'database') }
  ];

  return (
    <main className="container stack">
      {jsonLd(faqJsonLd(page))}
      {jsonLd(breadcrumbJsonLd(page))}
      <section className="hero">
        <p className="small"><strong>PixelFit for print.ymirtool.com</strong></p>
        <h1>{page.title}</h1>
        <p className="lede">Check image proportions, DPI, paper pixel sizes, product readiness and safe-zone overlays before printing or uploading. All image previews run locally in your browser.</p>
      </section>
      {groups.map((group) => group.items.length > 0 && (
        <section className="card" key={group.title}>
          <h2>{group.title}</h2>
          <div className="grid">
            {group.items.map((item) => <Link className="card tool-card" key={item.href} href={item.href}><h3>{item.title}</h3><p className="muted">{item.description}</p></Link>)}
          </div>
        </section>
      ))}
      <section className="card">
        <h2>How to choose the right tool</h2>
        <ul>
          <li>Use Aspect Ratio when the image fits the wrong frame.</li>
          <li>Use Print Size, DPI and CM to Pixels for print planning.</li>
          <li>Use safe-zone tools before uploading banners, thumbnails, social posts or product images.</li>
          <li>Use product and social recommenders when you need a readiness decision rather than a simple dimension.</li>
        </ul>
      </section>
      <section className="card"><h2>FAQ</h2>{page.faq.map((item) => <p key={item.question}><strong>{item.question}</strong><br />{item.answer}</p>)}</section>
    </main>
  );
}

function NumberField({ label, value, set, step = 1, min = 0 }: { label: string; value: number; set: (n: number) => void; step?: number; min?: number }) {
  return <label>{label}<input type="number" min={min} step={step} value={Number.isFinite(value) ? value : ''} onChange={(event) => set(Number(event.target.value))} /></label>;
}

function AspectTool({ page }: { page: ToolPage }) {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [target, setTarget] = useState('16:9');
  const [targetWidth, setTargetWidth] = useState(1200);
  const [targetHeight, setTargetHeight] = useState(720);
  const ratioTarget = commonRatios.find((item) => item.label === target) || commonRatios[3];
  const ratio = simplifyRatio(width, height);
  const fitHeight = Math.round(targetWidth * ratioTarget.height / ratioTarget.width);
  const fitWidth = Math.round(targetHeight * ratioTarget.width / ratioTarget.height);
  const crop = cropFit(width, height, ratioTarget.width, ratioTarget.height);
  const pad = padFit(width, height, ratioTarget.width, ratioTarget.height);
  const common = detectCommonRatio(width, height);
  const mismatch = getRatioMismatch(width, height, ratioTarget.width, ratioTarget.height);
  const cropPixels = Math.max(0, width * height - crop.width * crop.height);
  const padPixels = Math.max(0, pad.width * pad.height - width * height);
  const summary = `${width}×${height}px simplifies to ${ratio.label}${common ? ` (${common.label})` : ''}. Target ${target}. ${targetWidth}px wide should be ${fitHeight}px high; ${targetHeight}px high should be ${fitWidth}px wide. Crop fit ${crop.width}×${crop.height}; padding canvas ${pad.width}×${pad.height}.`;

  return (
    <Shell page={page}>
      <div className="formgrid">
        <NumberField label="Image width px" value={width} set={setWidth} min={1} />
        <NumberField label="Image height px" value={height} set={setHeight} min={1} />
        <label>Target ratio<select value={target} onChange={(event) => setTarget(event.target.value)}>{commonRatios.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}</select></label>
        <NumberField label="Target width px" value={targetWidth} set={setTargetWidth} min={1} />
        <NumberField label="Target height px" value={targetHeight} set={setTargetHeight} min={1} />
      </div>
      <ResultCard title="Ratio result">
        <p>{summary}</p>
        <div className="metric-grid">
          <div><strong>{ratio.label}</strong><span>simplified ratio</span></div>
          <div><strong>{round(width / height, 4)}</strong><span>decimal ratio</span></div>
          <div><strong>{round(mismatch * 100, 2)}%</strong><span>target mismatch</span></div>
          <div><strong>{round(cropPixels / (width * height) * 100, 2)}%</strong><span>pixels cropped</span></div>
          <div><strong>{round(padPixels / (width * height) * 100, 2)}%</strong><span>padding added</span></div>
        </div>
        <ul>
          <li>Crop fit removes pixels on the {crop.cropAxis} axis.</li>
          <li>Padding fit preserves the full image and adds empty space on the {pad.padAxis} axis.</li>
        </ul>
        <CopyButton text={summary} />
      </ResultCard>
    </Shell>
  );
}

function PrintSizeTool({ page }: { page: ToolPage }) {
  const [width, setWidth] = useState(3000);
  const [height, setHeight] = useState(2400);
  const [ppi, setPpi] = useState(300);
  const [paperId, setPaperId] = useState('a4');
  const paper = paperById(paperId);
  const result = calculatePrintSize(width, height, ppi);
  const requiredWidth = Math.round(paper.widthMm / 25.4 * ppi);
  const requiredHeight = Math.round(paper.heightMm / 25.4 * ppi);
  const landscapeRequiredWidth = Math.round(paper.heightMm / 25.4 * ppi);
  const landscapeRequiredHeight = Math.round(paper.widthMm / 25.4 * ppi);
  const fitsPortrait = width >= requiredWidth && height >= requiredHeight;
  const fitsLandscape = width >= landscapeRequiredWidth && height >= landscapeRequiredHeight;
  const deficitPortrait = Math.max(requiredWidth / width, requiredHeight / height, 1);
  const summary = `${width}×${height}px at ${ppi} PPI prints ${round(result.widthIn)}×${round(result.heightIn)} in (${round(result.widthCm)}×${round(result.heightCm)} cm). Quality: ${result.quality}. ${paper.name} needs ${requiredWidth}×${requiredHeight}px portrait at ${ppi} PPI.`;

  return (
    <Shell page={page}>
      <div className="formgrid">
        <NumberField label="Pixel width" value={width} set={setWidth} min={1} />
        <NumberField label="Pixel height" value={height} set={setHeight} min={1} />
        <label>DPI/PPI<select value={ppi} onChange={(event) => setPpi(Number(event.target.value))}>{dpiPresets.map((preset) => <option key={preset}>{preset}</option>)}</select></label>
        <label>Target paper<select value={paperId} onChange={(event) => setPaperId(event.target.value)}>{PRINT_PRESETS.map((id) => { const item = paperById(id); return <option value={item.id} key={item.id}>{item.name}</option>; })}</select></label>
      </div>
      <ResultCard title="Print readiness">
        <p>{summary}</p>
        <div className="metric-grid">
          <div><strong>{round(result.widthIn, 2)} × {round(result.heightIn, 2)} in</strong><span>maximum size</span></div>
          <div><strong>{round(result.widthCm, 1)} × {round(result.heightCm, 1)} cm</strong><span>maximum size</span></div>
          <div><strong>{round(result.megapixels, 2)} MP</strong><span>image area</span></div>
          <div><strong>{result.quality}</strong><span>quality grade</span></div>
        </div>
        <ul>
          <li>{paper.name} portrait: <RiskBadge level={fitsPortrait ? 'safe' : 'danger'} /> requires {requiredWidth}×{requiredHeight}px.</li>
          <li>{paper.name} landscape: <RiskBadge level={fitsLandscape ? 'safe' : 'danger'} /> requires {landscapeRequiredWidth}×{landscapeRequiredHeight}px.</li>
          <li>Portrait shortfall if not enough: {round((deficitPortrait - 1) * 100, 1)}% more pixels on the limiting side.</li>
          <li>Changing DPI metadata does not create image detail.</li>
        </ul>
        <CopyButton text={summary} />
      </ResultCard>
    </Shell>
  );
}

function DpiTool({ page }: { page: ToolPage }) {
  const [pixels, setPixels] = useState(2480);
  const [size, setSize] = useState(210);
  const [unit, setUnit] = useState<LengthUnit>('mm');
  const [targetPpi, setTargetPpi] = useState(300);
  const ppi = calculatePpi(pixels, size, unit);
  const required = pixelsForPhysicalSize(size, unit, targetPpi);
  const comparison = dpiPresets.map((preset) => ({ preset, px: Math.round(pixelsForPhysicalSize(size, unit, preset)) }));
  const summary = `${pixels}px across ${size}${unit} equals ${round(ppi, 1)} PPI. At ${targetPpi} PPI, ${size}${unit} needs ${Math.round(required)}px.`;

  return (
    <Shell page={page}>
      <div className="formgrid">
        <NumberField label="Pixels on one side" value={pixels} set={setPixels} min={1} />
        <NumberField label="Physical size" value={size} set={setSize} min={0.01} step={0.01} />
        <label>Unit<select value={unit} onChange={(event) => setUnit(event.target.value as LengthUnit)}><option value="mm">mm</option><option value="cm">cm</option><option value="in">in</option></select></label>
        <label>Target PPI<select value={targetPpi} onChange={(event) => setTargetPpi(Number(event.target.value))}>{dpiPresets.map((preset) => <option key={preset}>{preset}</option>)}</select></label>
      </div>
      <ResultCard title="DPI / PPI result">
        <p>{summary}</p>
        <ul><li>Quality at effective PPI: {gradePrintQuality(ppi)}</li><li>Formula: PPI = pixels / inches. Rewriting the DPI tag alone does not add real pixels.</li></ul>
        <table><thead><tr><th>PPI</th><th>Required pixels for {size}{unit}</th></tr></thead><tbody>{comparison.map((row) => <tr key={row.preset}><td>{row.preset}</td><td>{row.px}px</td></tr>)}</tbody></table>
        <CopyButton text={summary} />
      </ResultCard>
    </Shell>
  );
}

function UnitTool({ page }: { page: ToolPage }) {
  const [value, setValue] = useState(10);
  const [mode, setMode] = useState<'to-px' | 'from-px'>('to-px');
  const [unit, setUnit] = useState<LengthUnit>('cm');
  const [ppi, setPpi] = useState(300);
  const converted = mode === 'to-px' ? pixelsForPhysicalSize(value, unit, ppi) : (value / ppi) * (unit === 'cm' ? 2.54 : unit === 'mm' ? 25.4 : 1);
  const exact = round(converted, 3);
  const summary = mode === 'to-px' ? `${value}${unit} at ${ppi} PPI is ${Math.round(converted)}px (exact ${exact}px).` : `${value}px at ${ppi} PPI is ${exact}${unit}.`;

  return (
    <Shell page={page}>
      <div className="formgrid">
        <label>Mode<select value={mode} onChange={(event) => setMode(event.target.value as 'to-px' | 'from-px')}><option value="to-px">cm/mm/in to pixels</option><option value="from-px">pixels to cm/mm/in</option></select></label>
        <NumberField label="Value" value={value} set={setValue} min={0.01} step={0.01} />
        <label>Unit<select value={unit} onChange={(event) => setUnit(event.target.value as LengthUnit)}><option value="cm">cm</option><option value="mm">mm</option><option value="in">in</option></select></label>
        <label>DPI/PPI<select value={ppi} onChange={(event) => setPpi(Number(event.target.value))}>{dpiPresets.map((preset) => <option key={preset}>{preset}</option>)}</select></label>
      </div>
      <ResultCard title="Unit conversion">
        <p>{summary}</p>
        <p>Example: 10cm at 300 PPI is about 1181px. Raster files must use whole pixels, so rounded and exact values are both shown.</p>
        <CopyButton text={summary} />
      </ResultCard>
    </Shell>
  );
}

function PaperTool({ page }: { page: ToolPage }) {
  const [paperId, setPaperId] = useState('a4');
  const [ppi, setPpi] = useState(300);
  const [landscape, setLandscape] = useState(false);
  const [bleedMm, setBleedMm] = useState(3);
  const [safeMm, setSafeMm] = useState(5);
  const paper = paperById(paperId);
  const result = paperPixels(paper, ppi, landscape, bleedMm, safeMm);
  const rows = dpiPresets.map((preset) => ({ preset, result: paperPixels(paper, preset, landscape, bleedMm, safeMm) }));
  const summary = `${paper.name} at ${ppi} PPI is ${result.trimWidthPx}×${result.trimHeightPx}px. With ${bleedMm}mm bleed: ${result.fullBleedWidthPx}×${result.fullBleedHeightPx}px. Safe area with ${safeMm}mm margin: ${result.safeWidthPx}×${result.safeHeightPx}px.`;

  return (
    <Shell page={page}>
      <div className="formgrid">
        <label>Paper size<select value={paperId} onChange={(event) => setPaperId(event.target.value)}>{paperSpecs.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>DPI/PPI<select value={ppi} onChange={(event) => setPpi(Number(event.target.value))}>{dpiPresets.map((preset) => <option key={preset}>{preset}</option>)}</select></label>
        <label>Orientation<select value={landscape ? 'landscape' : 'portrait'} onChange={(event) => setLandscape(event.target.value === 'landscape')}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label>
        <NumberField label="Bleed mm" value={bleedMm} set={setBleedMm} min={0} step={0.1} />
        <NumberField label="Safe margin mm" value={safeMm} set={setSafeMm} min={0} step={0.1} />
      </div>
      <ResultCard title="Paper pixels">
        <p>{summary}</p>
        <table><thead><tr><th>DPI</th><th>Trim pixels</th><th>Full bleed pixels</th><th>Safe area pixels</th></tr></thead><tbody>{rows.map((row) => <tr key={row.preset}><td>{row.preset}</td><td>{row.result.trimWidthPx}×{row.result.trimHeightPx}</td><td>{row.result.fullBleedWidthPx}×{row.result.fullBleedHeightPx}</td><td>{row.result.safeWidthPx}×{row.result.safeHeightPx}</td></tr>)}</tbody></table>
        <CopyButton text={summary} />
      </ResultCard>
    </Shell>
  );
}

function SafeTool({ page }: { page: ToolPage }) {
  const spec = imageSpecById(page.specId);
  const [localImage, setLocalImage] = useState<LocalImage | null>(null);
  const [presetValue, setPresetValue] = useState('');
  const [captionMode, setCaptionMode] = useState<'short' | 'medium' | 'long'>('medium');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  if (!spec) return <Shell page={page}><p>Spec missing.</p></Shell>;

  const preset = spec.commonPresets?.find((item) => `${item.width}x${item.height}` === presetValue) || spec.commonPresets?.[0] || (spec.recommendedWidth && spec.recommendedHeight ? { label: 'Recommended', width: spec.recommendedWidth, height: spec.recommendedHeight } : undefined);
  const width = preset?.width || spec.recommendedWidth || 1200;
  const height = preset?.height || spec.recommendedHeight || 630;
  const zones = collectZones(spec, preset, captionMode, direction);
  const imageWidth = localImage?.width || width;
  const imageHeight = localImage?.height || height;
  const mismatch = spec.recommendedWidth && spec.recommendedHeight ? getRatioMismatch(imageWidth, imageHeight, width, height) : 0;
  const mp = megapixels(imageWidth, imageHeight);
  const checklist = imageChecklist(spec, imageWidth, imageHeight, localImage ? localImage.size / 1024 / 1024 : 0, localImage?.type || '').checks;
  const summary = `${spec.title}: working canvas ${width}×${height}px, ${zones.length} overlay zones. ${localImage ? `Loaded image ${imageWidth}×${imageHeight}px (${round(mp, 2)}MP).` : 'Upload an optional local image to preview crop and UI risk.'}`;

  return (
    <Shell page={page} source={spec}>
      <div className="workspace-grid">
        <div className="control-panel card">
          <h2>Controls</h2>
          {spec.commonPresets && <label>Preset<select value={presetValue} onChange={(event) => setPresetValue(event.target.value)}><option value="">Default preset</option>{spec.commonPresets.map((item) => <option key={item.label} value={`${item.width}x${item.height}`}>{item.label}</option>)}</select></label>}
          {spec.id === 'short-video-safe-zone' && <><label>Caption length<select value={captionMode} onChange={(event) => setCaptionMode(event.target.value as 'short' | 'medium' | 'long')}><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></select></label><label>UI direction<select value={direction} onChange={(event) => setDirection(event.target.value as 'ltr' | 'rtl')}><option value="ltr">LTR</option><option value="rtl">RTL reference</option></select></label></>}
          <ImageUploadPreview onImage={setLocalImage} />
          <OverlayDownloadButtons title={page.title} slug={page.slug} width={width} height={height} zones={zones} />
          <p className="small muted">Download overlays are transparent guides only. Uploaded image previews stay in this browser.</p>
        </div>
        <div className="preview-panel">
          <h2 className="visually-compact">Workspace preview</h2>
          <SafeZoneCanvas width={width} height={height} zones={zones} image={localImage} />
          <div className="zone-legend">{zones.map((zone) => <span className={`risk risk-${zone.severity}`} key={zone.id}>{zone.label}</span>)}</div>
        </div>
      </div>
      <ResultCard title="Safe-zone result">
        <p>{summary}</p>
        <div className="metric-grid">
          <div><strong>{width}×{height}</strong><span>working canvas</span></div>
          <div><strong>{spec.aspectRatio || `${round(width / height, 2)}:1`}</strong><span>target ratio</span></div>
          <div><strong>{round(mismatch * 100, 2)}%</strong><span>image mismatch</span></div>
          <div><strong>{round(mp, 2)} MP</strong><span>Megapixels for this preset</span></div>
        </div>
        <table><thead><tr><th>Check</th><th>Status</th><th>Detail</th></tr></thead><tbody>{checklist.map((item) => <tr key={item.label}><td>{item.label}</td><td><RiskBadge level={item.level} /></td><td>{item.detail}</td></tr>)}</tbody></table>
        <ul>{spec.notes.map((note) => <li key={note}>{note}</li>)}</ul>
        {spec.id === 'youtube-thumbnail' && <p><strong>16:9 / 4:5 note:</strong> the blue center reference shows a conservative 4:5 mobile crop area for vertical-video surfaces. Build important text inside the center, away from the lower-right timer badge.</p>}
        <CopyButton text={summary} />
      </ResultCard>
    </Shell>
  );
}

function PinterestRatioTool({ page }: { page: ToolPage }) {
  const [w, setW] = useState(1200);
  const [h, setH] = useState(900);
  const [targetLong, setTargetLong] = useState(1500);
  const crop = cropFit(w, h, 2, 3);
  const pad = padFit(w, h, 2, 3);
  const targetWidth = Math.round(targetLong * 2 / 3);
  const mismatch = getRatioMismatch(w, h, 2, 3);
  const cropPercent = round(Math.max(0, (w * h - crop.width * crop.height) / (w * h) * 100), 2);
  const summary = `${w}×${h}px to Pinterest 2:3: target ${targetWidth}×${targetLong}px, crop fit ${crop.width}×${crop.height}, padding canvas ${pad.width}×${pad.height}, ratio mismatch ${round(mismatch * 100, 2)}%.`;

  return (
    <Shell page={page}>
      <div className="formgrid"><NumberField label="Source width px" value={w} set={setW} min={1} /><NumberField label="Source height px" value={h} set={setH} min={1} /><NumberField label="Target height px" value={targetLong} set={setTargetLong} min={1} /></div>
      <ResultCard title="Pinterest 2:3 plan"><p>{summary}</p><ul><li>Crop removes {cropPercent}% of source pixels.</li><li>Padding preserves all source pixels and creates a 2:3 canvas.</li></ul><CopyButton text={summary} /></ResultCard>
    </Shell>
  );
}

function CheckTool({ page }: { page: ToolPage }) {
  const spec = imageSpecById(page.specId);
  const [localImage, setLocalImage] = useState<LocalImage | null>(null);
  const [w, setW] = useState(spec?.recommendedWidth || 1500);
  const [h, setH] = useState(spec?.recommendedHeight || 1500);
  const [mb, setMb] = useState(2);
  const [format, setFormat] = useState('image/jpeg');

  if (!spec) return <Shell page={page}><p>Spec missing.</p></Shell>;

  const width = localImage?.width || w;
  const height = localImage?.height || h;
  const fileMb = localImage ? localImage.size / 1024 / 1024 : mb;
  const type = localImage?.type || format;
  const report = imageChecklist(spec, width, height, fileMb, type);
  const zones = collectZones(spec);
  const summary = `${spec.title} check: ${width}×${height}px, ${round(report.mp, 2)}MP, ${round(fileMb, 2)}MB. Result ${report.level}. Manual checklist still required for composition, subject crop, policy text and final platform upload.`;

  return (
    <Shell page={page} source={spec}>
      <div className="workspace-grid">
        <div className="control-panel card">
          <h2>Input</h2>
          <ImageUploadPreview onImage={setLocalImage} />
          <div className="formgrid"><NumberField label="Width px" value={w} set={setW} min={1} /><NumberField label="Height px" value={h} set={setH} min={1} /><NumberField label="File size MB" value={mb} set={setMb} min={0} step={0.1} /><label>Format<select value={format} onChange={(event) => setFormat(event.target.value)}><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option><option value="image/gif">GIF</option><option value="image/tiff">TIFF</option></select></label></div>
        </div>
        {zones.length > 0 && <SafeZoneCanvas width={spec.recommendedWidth || width} height={spec.recommendedHeight || height} zones={zones} image={localImage} />}
      </div>
      <ResultCard title="Readiness report">
        <p>{summary}</p>
        <div className="metric-grid"><div><strong>{width}×{height}</strong><span>image size</span></div><div><strong>{round(report.mp, 2)} MP</strong><span>megapixels</span></div><div><strong>{round(fileMb, 2)} MB</strong><span>file size</span></div><div><strong><RiskBadge level={report.level} /></strong><span>risk level</span></div></div>
        <table><thead><tr><th>Check</th><th>Status</th><th>Detail</th></tr></thead><tbody>{report.checks.map((item) => <tr key={item.label}><td>{item.label}</td><td><RiskBadge level={item.level} /></td><td>{item.detail}</td></tr>)}</tbody></table>
        <h3>Manual checklist still required</h3>
        <ul><li>Subject must not be cropped in a misleading way.</li><li>Text, badges, discount claims and watermarks may be restricted by the destination platform.</li><li>This tool does not use AI or OCR to inspect image content.</li></ul>
        <CopyButton text={summary} />
      </ResultCard>
    </Shell>
  );
}

function MegapixelTool({ page }: { page: ToolPage }) {
  const spec = imageSpecById(page.specId);
  const [w, setW] = useState(5000);
  const [h, setH] = useState(5000);
  const [mb, setMb] = useState(18);
  if (!spec) return <Shell page={page}><p>Spec missing.</p></Shell>;
  const mp = megapixels(w, h);
  const mpOk = spec.maxMegapixels ? mp <= spec.maxMegapixels : true;
  const mbOk = spec.maxFileSizeMB ? mb <= spec.maxFileSizeMB : true;
  const summary = `${w}×${h}px is ${round(mp, 2)}MP and ${round(mb, 2)}MB. ${spec.platform}: megapixel ${mpOk ? 'ok' : 'too high'}, file size ${mbOk ? 'ok' : 'too high'}.`;
  return <Shell page={page} source={spec}><div className="formgrid"><NumberField label="Width px" value={w} set={setW} min={1} /><NumberField label="Height px" value={h} set={setH} min={1} /><NumberField label="File size MB" value={mb} set={setMb} min={0} step={0.1} /></div><ResultCard title="Megapixel report"><p>{summary}</p><ul><li><RiskBadge level={mpOk ? 'safe' : 'danger'} /> {round(mp, 2)}MP vs limit {spec.maxMegapixels || 'not listed'}MP.</li><li><RiskBadge level={mbOk ? 'safe' : 'danger'} /> {round(mb, 2)}MB vs limit {spec.maxFileSizeMB || 'not listed'}MB.</li><li>A file can be under the MB limit and still fail if the megapixel count is too high.</li></ul><CopyButton text={summary} /></ResultCard></Shell>;
}

function RecommenderTool({ page }: { page: ToolPage }) {
  const [w, setW] = useState(1200);
  const [h, setH] = useState(630);
  const candidates = useMemo(() => imageSpecs.filter((spec) => spec.recommendedWidth && spec.recommendedHeight && ['P0', 'P1'].includes(spec.priority)).map((spec) => ({ spec, mismatch: getRatioMismatch(w, h, spec.recommendedWidth || 1, spec.recommendedHeight || 1) })).sort((a, b) => a.mismatch - b.mismatch), [w, h]);
  const summary = `${w}×${h}px checked against ${candidates.length} social and product targets. Best fit: ${candidates[0]?.spec.title || 'none'}.`;
  return <Shell page={page}><div className="formgrid"><NumberField label="Image width px" value={w} set={setW} min={1} /><NumberField label="Image height px" value={h} set={setH} min={1} /></div><ResultCard title="Universal recommendation"><p>{summary}</p><table><thead><tr><th>Target</th><th>Recommended</th><th>Mismatch</th><th>Risk</th><th>Next tool</th></tr></thead><tbody>{candidates.map(({ spec, mismatch }) => <tr key={spec.id}><td>{spec.title}</td><td>{spec.recommendedWidth}×{spec.recommendedHeight}</td><td>{round(mismatch * 100, 2)}%</td><td><RiskBadge level={mismatch <= 0.025 ? 'safe' : mismatch <= 0.12 ? 'warning' : 'danger'} /></td><td><Link href={spec.relatedToolSlugs[0] || '/image-size/aspect-ratio-calculator/'}>Open</Link></td></tr>)}</tbody></table><CopyButton text={summary} /></ResultCard></Shell>;
}

function FocalTool({ page }: { page: ToolPage }) {
  const spec = imageSpecById(page.specId);
  const [localImage, setLocalImage] = useState<LocalImage | null>(null);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  if (!spec) return <Shell page={page}><p>Spec missing.</p></Shell>;
  const width = spec.recommendedWidth || 2400;
  const height = spec.recommendedHeight || 1350;
  const zones: SafeZone[] = [{ id: 'focal-point', label: `Focal point ${x}% / ${y}%`, x: Math.max(0, x / 100 - 0.08), y: Math.max(0, y / 100 - 0.08), width: 0.16, height: 0.16, unit: 'percent', severity: 'safe' }, ...collectZones(spec)];
  const mobileRisk = x < 32 || x > 68 ? 'warning' : 'safe';
  const verticalRisk = y < 20 || y > 80 ? 'warning' : 'safe';
  const summary = `Focal point at ${x}% / ${y}%: horizontal crop risk ${mobileRisk}, vertical crop risk ${verticalRisk}.`;
  return <Shell page={page} source={spec}><div className="workspace-grid"><div className="control-panel card"><ImageUploadPreview onImage={setLocalImage} /><label>X position %<input type="range" min="0" max="100" value={x} onChange={(event) => setX(Number(event.target.value))} /></label><label>Y position %<input type="range" min="0" max="100" value={y} onChange={(event) => setY(Number(event.target.value))} /></label><OverlayDownloadButtons title={page.title} slug={page.slug} width={width} height={height} zones={zones} /></div><SafeZoneCanvas width={width} height={height} zones={zones} image={localImage} /></div><ResultCard title="Focal point result"><p>{summary}</p><ul><li>Keep the focal point near the center to survive responsive crops.</li><li>Use CSS object-position or your theme focal-point control to align around this point.</li></ul><CopyButton text={summary} /></ResultCard></Shell>;
}

function MatrixTool({ page }: { page: ToolPage }) {
  const spec = imageSpecById(page.specId);
  const [w, setW] = useState(spec?.commonPresets?.[0]?.width || spec?.recommendedWidth || 1290);
  const [h, setH] = useState(spec?.commonPresets?.[0]?.height || spec?.recommendedHeight || 2796);
  const [mb, setMb] = useState(2);
  if (!spec) return <Shell page={page}><p>Spec missing.</p></Shell>;
  const presets = spec.commonPresets || [];
  const exact = presets.find((preset) => preset.width === w && preset.height === h);
  const rotated = presets.find((preset) => preset.width === h && preset.height === w);
  const nearest = presets.map((preset) => ({ preset, score: Math.abs(preset.width - w) + Math.abs(preset.height - h) })).sort((a, b) => a.score - b.score)[0]?.preset;
  const mp = megapixels(w, h);
  const maxDim = Math.max(w, h);
  const minDim = Math.min(w, h);
  const googleScreenshotRule = ['google-play-assets', 'google-play-screenshot'].includes(spec.id) ? minDim >= 320 && maxDim <= 3840 && maxDim <= minDim * 2 : true;
  const passportRule = spec.id === 'passport-id-photo' ? PASSPORT_ALLOWED.includes(w) && w === h : true;
  const fileRule = (!spec.maxFileSizeMB || mb <= spec.maxFileSizeMB) && (!spec.maxFileSizeKB || mb * 1024 <= spec.maxFileSizeKB || Boolean(exact && !exact.label.toLowerCase().includes('icon')));
  const verdict = exact ? 'exact match' : rotated ? 'matches when rotated' : googleScreenshotRule && passportRule && fileRule ? 'near a known asset size' : 'needs adjustment';
  const summary = `${w}×${h}px, ${round(mp, 2)}MP, ${round(mb, 2)}MB: ${spec.title} ${verdict}.`;
  return <Shell page={page} source={spec}><div className="formgrid"><NumberField label="Pixel width" value={w} set={setW} min={1} /><NumberField label="Pixel height" value={h} set={setH} min={1} /><NumberField label="File size MB" value={mb} set={setMb} min={0} step={0.1} /><label>Preset<select onChange={(event) => { const [pw, ph] = event.target.value.split('x').map(Number); if (pw && ph) { setW(pw); setH(ph); } }}><option value="">Choose target</option>{presets.map((preset) => <option key={preset.label} value={`${preset.width}x${preset.height}`}>{preset.label}</option>)}</select></label></div><ResultCard title="Asset matrix result"><p>{summary}</p><table><thead><tr><th>Accepted / working preset</th><th>Pixels</th><th>Mismatch</th></tr></thead><tbody>{presets.map((preset) => <tr key={preset.label}><td>{preset.label}</td><td>{preset.width}×{preset.height}</td><td>{round(getRatioMismatch(w, h, preset.width, preset.height) * 100, 2)}%</td></tr>)}</tbody></table><ul><li>Closest listed target: {nearest ? `${nearest.label} (${nearest.width}×${nearest.height})` : 'n/a'}.</li><li>Google Play screenshots: minimum side 320px, maximum side 3840px, and longest side cannot exceed 2× shortest side. <RiskBadge level={googleScreenshotRule ? 'safe' : 'danger'} /></li><li>Passport/ID photo approval is never guaranteed by this tool; official review controls acceptance. <RiskBadge level={passportRule ? 'safe' : 'warning'} /></li><li>Final upload acceptance must be checked in the platform console.</li></ul><CopyButton text={summary} /></ResultCard></Shell>;
}

function OverlayHubTool({ page }: { page: ToolPage }) {
  const overlaySpecs = imageSpecs.filter((spec) => collectZones(spec).length > 0 && spec.recommendedWidth && spec.recommendedHeight);
  const [specId, setSpecId] = useState(overlaySpecs[0]?.id || 'youtube-banner');
  const spec = imageSpecById(specId) || overlaySpecs[0];
  if (!spec) return <Shell page={page}><p>No overlay specs found.</p></Shell>;
  const zones = collectZones(spec);
  const w = spec.recommendedWidth || 1200;
  const h = spec.recommendedHeight || 630;
  const summary = `${spec.title} overlay: ${w}×${h}px, ${zones.length} guide zones, source confidence ${spec.sourceConfidence}.`;
  return <Shell page={page} source={spec}><div className="workspace-grid"><div className="control-panel card"><h2>Choose overlay</h2><label>Overlay target<select value={specId} onChange={(event) => setSpecId(event.target.value)}>{overlaySpecs.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><p className="small muted">Use these transparent SVG and PNG overlays in Figma, Photoshop, Illustrator, Canva, Affinity or other editors.</p><OverlayDownloadButtons title={spec.title} slug={spec.id} width={w} height={h} zones={zones} /></div><SafeZoneCanvas width={w} height={h} zones={zones} /></div><ResultCard title="Overlay package"><p>{summary}</p><ul>{spec.notes.map((note) => <li key={note}>{note}</li>)}</ul><CopyButton text={summary} /></ResultCard></Shell>;
}

function BatchPlanTool({ page }: { page: ToolPage }) {
  const [w, setW] = useState(2400);
  const [h, setH] = useState(1350);
  const [scope, setScope] = useState<'social' | 'product' | 'app' | 'all'>('social');
  const groups: Record<'social' | 'product' | 'app' | 'all', string[]> = { social: ['youtube-banner', 'youtube-thumbnail', 'short-video-safe-zone', 'linkedin-banner', 'x-header', 'pinterest-pin', 'instagram-feed', 'open-graph', 'xiaohongshu-cover'], product: ['google-shopping-image', 'shopify-image', 'etsy-listing-image', 'amazon-product-image'], app: ['google-play-feature-graphic', 'app-store-screenshots', 'google-play-assets'], all: [] };
  const rows = imageSpecs.filter((spec) => spec.recommendedWidth && spec.recommendedHeight && (scope === 'all' || groups[scope].includes(spec.id))).map((spec) => ({ spec, mismatch: getRatioMismatch(w, h, spec.recommendedWidth || 1, spec.recommendedHeight || 1), crop: cropFit(w, h, spec.recommendedWidth || 1, spec.recommendedHeight || 1), pad: padFit(w, h, spec.recommendedWidth || 1, spec.recommendedHeight || 1) })).sort((a, b) => a.mismatch - b.mismatch);
  const summary = `${w}×${h}px source image export plan: ${rows.length} targets in ${scope} scope.`;
  return <Shell page={page}><div className="formgrid"><NumberField label="Source width px" value={w} set={setW} min={1} /><NumberField label="Source height px" value={h} set={setH} min={1} /><label>Export scope<select value={scope} onChange={(event) => setScope(event.target.value as 'social' | 'product' | 'app' | 'all')}><option value="social">Social</option><option value="product">Product / marketplace</option><option value="app">App store assets</option><option value="all">All listed targets</option></select></label></div><ResultCard title="Export plan"><p>{summary}</p><table><thead><tr><th>Target</th><th>Export canvas</th><th>Mismatch</th><th>Crop fit</th><th>Padding fit</th></tr></thead><tbody>{rows.map(({ spec, mismatch, crop, pad }) => <tr key={spec.id}><td>{spec.title}</td><td>{spec.recommendedWidth}×{spec.recommendedHeight}</td><td>{round(mismatch * 100, 2)}%</td><td>{crop.width}×{crop.height}</td><td>{pad.width}×{pad.height}</td></tr>)}</tbody></table><ul><li>This creates a production checklist, not resized files.</li><li>Export separate canvases when text, face, logo or product position matters.</li></ul><CopyButton text={summary + '\n' + copyRows(rows.map(({ spec }) => [spec.title, `${spec.recommendedWidth}×${spec.recommendedHeight}`]))} /></ResultCard></Shell>;
}


function DatabaseTool({ page }: { page: ToolPage }) {
  const [priority, setPriority] = useState<'all' | 'P0' | 'P1' | 'P2'>('all');
  const [query, setQuery] = useState('');
  const rows = imageSpecs
    .filter((spec) => priority === 'all' || spec.priority === priority)
    .filter((spec) => {
      const haystack = `${spec.platform} ${spec.assetType} ${spec.title} ${spec.aspectRatio || ''} ${spec.sourceConfidence}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  const isLanguagePage = page.slug.includes('multi-language');
  const socialRows = rows.filter((spec) => ['YouTube', 'TikTok / Instagram Reels / YouTube Shorts', 'LinkedIn', 'X', 'Pinterest', 'Instagram', 'Xiaohongshu', 'Open Graph / Social Share', 'Facebook'].some((name) => spec.platform.includes(name)));
  const displayRows = isLanguagePage ? socialRows : rows;
  const summary = `${page.title}: ${displayRows.length} specs listed with source confidence, last checked date and safe-zone availability.`;

  return (
    <Shell page={page}>
      <div className="formgrid">
        <label>Filter by priority<select value={priority} onChange={(event) => setPriority(event.target.value as 'all' | 'P0' | 'P1' | 'P2')}><option value="all">All</option><option value="P0">Core tools</option><option value="P1">Expansion tools</option><option value="P2">Advanced tools</option></select></label>
        <label>Search specs<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="YouTube, Pinterest, official, 1:1" /></label>
      </div>
      <ResultCard title={isLanguagePage ? 'Multi-language social planning notes' : 'Safe-zone database'}>
        <p>{summary}</p>
        {isLanguagePage && <ul><li>CJK copy often needs larger text blocks and shorter visible titles.</li><li>Arabic and Hebrew layouts need right-to-left action-area review for short-video overlays.</li><li>Use platform-specific previews before publishing; this page does not translate or edit images.</li></ul>}
        <table><thead><tr><th>Spec</th><th>Canvas</th><th>Ratio</th><th>Zones</th><th>Source confidence</th><th>Last checked</th></tr></thead><tbody>{displayRows.map((spec) => <tr key={spec.id}><td><strong>{spec.title}</strong><br /><span className="small muted">{spec.platform} · {spec.assetType}</span></td><td>{spec.recommendedWidth && spec.recommendedHeight ? `${spec.recommendedWidth}×${spec.recommendedHeight}` : 'varies'}</td><td>{spec.aspectRatio || 'varies'}</td><td>{collectZones(spec).length}</td><td><RiskBadge level={spec.sourceConfidence === 'official' ? 'safe' : spec.sourceConfidence === 'internal-estimate' ? 'warning' : 'info'} /> {spec.sourceConfidence}</td><td>{spec.lastCheckedAt}</td></tr>)}</tbody></table>
        <h3>Source confidence meaning</h3>
        <ul><li><strong>official</strong>: platform-owned documentation.</li><li><strong>strong-secondary</strong>: reliable secondary documentation or consolidated platform guidance.</li><li><strong>community-observed</strong>: observed UI behavior that can vary.</li><li><strong>internal-estimate</strong>: conservative planning overlay, not an official claim.</li></ul>
        <CopyButton text={summary + '\n' + copyRows(displayRows.map((spec) => [spec.title, spec.platform, spec.recommendedWidth && spec.recommendedHeight ? `${spec.recommendedWidth}×${spec.recommendedHeight}` : 'varies', spec.sourceConfidence, spec.lastCheckedAt]))} />
      </ResultCard>
    </Shell>
  );
}

export function PixelFitPage({ page }: { page: ToolPage }) {
  if (page.kind === 'hub') return <Hub page={page} />;
  if (page.kind === 'aspect') return <AspectTool page={page} />;
  if (page.kind === 'print') return <PrintSizeTool page={page} />;
  if (page.kind === 'dpi') return <DpiTool page={page} />;
  if (page.kind === 'unit') return <UnitTool page={page} />;
  if (page.kind === 'paper') return <PaperTool page={page} />;
  if (page.kind === 'pinterest-ratio') return <PinterestRatioTool page={page} />;
  if (page.kind === 'check') return <CheckTool page={page} />;
  if (page.kind === 'megapixel') return <MegapixelTool page={page} />;
  if (page.kind === 'recommender') return <RecommenderTool page={page} />;
  if (page.kind === 'focal') return <FocalTool page={page} />;
  if (page.kind === 'matrix') return <MatrixTool page={page} />;
  if (page.kind === 'overlay-hub') return <OverlayHubTool page={page} />;
  if (page.kind === 'batch') return <BatchPlanTool page={page} />;
  if (page.kind === 'database') return <DatabaseTool page={page} />;
  return <SafeTool page={page} />;
}

export { toolPageByPath, toolPages };
