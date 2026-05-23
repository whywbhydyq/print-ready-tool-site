'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { z } from 'zod';
import {
  MAX_IMAGE_BYTES,
  bleed,
  buyerInstruction,
  commonSizes,
  csv,
  dpiPresets,
  encodeShare,
  etsyRows,
  fromInch,
  imageQuality,
  kdpCover,
  kdpInterior,
  printSize,
  round,
  svgGuide,
  textChecklist,
  type PrintMode,
  type Unit,
} from '@/src/lib/calculators';

const unitSchema = z.enum(['px', 'in', 'cm', 'mm']);
const positive = (label: string) => z.number({ invalid_type_error: `${label} is required` }).finite().positive(`${label} must be greater than 0`);
const dpiSchema = z.number().finite().min(1, 'DPI must be at least 1').max(2400, 'DPI above 2400 is outside the supported range');
const pageCountSchema = z.number().finite().int('Page count must be a whole number').positive('Page count must be greater than 0');
const printModeSchema = z.enum(['pixels-to-print-size', 'print-size-to-pixels', 'effective-dpi']);

const printSchema = z.object({
  mode: printModeSchema,
  width: positive('Width'),
  height: positive('Height'),
  unit: unitSchema,
  dpi: dpiSchema,
  pixelWidth: positive('Pixel width').optional(),
  pixelHeight: positive('Pixel height').optional(),
  printWidth: positive('Print width').optional(),
  printHeight: positive('Print height').optional(),
});

const imageSchema = z.object({
  pixelWidth: positive('Pixel width'),
  pixelHeight: positive('Pixel height'),
  targetWidth: positive('Target width'),
  targetHeight: positive('Target height'),
  unit: unitSchema,
  dpi: dpiSchema,
});

const bleedSchema = z.object({
  trimWidth: positive('Trim width'),
  trimHeight: positive('Trim height'),
  unit: unitSchema,
  bleedValue: z.number().finite().min(0, 'Bleed cannot be negative'),
  safeMargin: z.number().finite().min(0, 'Safe margin cannot be negative'),
  dpi: dpiSchema,
}).superRefine((value, ctx) => {
  const width = value.unit === 'cm' ? value.trimWidth / 2.54 : value.unit === 'mm' ? value.trimWidth / 25.4 : value.trimWidth;
  const height = value.unit === 'cm' ? value.trimHeight / 2.54 : value.unit === 'mm' ? value.trimHeight / 25.4 : value.trimHeight;
  const safe = value.unit === 'cm' ? value.safeMargin / 2.54 : value.unit === 'mm' ? value.safeMargin / 25.4 : value.safeMargin;
  if (safe * 2 >= width || safe * 2 >= height) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['safeMargin'], message: 'Safe margin is too large for this trim size' });
});

const kdpCoverSchema = z.object({
  trimWidth: positive('Trim width'),
  trimHeight: positive('Trim height'),
  pages: pageCountSchema,
  paper: z.enum(['white', 'cream', 'groundwood']),
  interior: z.enum(['bw', 'standard', 'premium']),
  dpi: dpiSchema,
});

const kdpInteriorSchema = z.object({
  trimWidth: positive('Trim width'),
  trimHeight: positive('Trim height'),
  hasBleed: z.boolean(),
  dpi: dpiSchema,
});

const etsySchema = z.object({ dpi: dpiSchema });

type Download = { label: string; filename: string; type: string; content: string; pngFromSvg?: boolean };

type ResultBlock = {
  summary: ReactNode;
  details: ReactNode[];
  warnings: string[];
  errors?: string[];
};

function asNumber(value: string, fallback: number) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function readParam(params: URLSearchParams, key: string, fallback: number) {
  const raw = params.get(key);
  if (raw === null) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function zodMessages(result: { success: true } | { success: false; error: z.ZodError }) {
  if (result.success) return [];
  return result.error.issues.map((issue) => `${issue.path.join('.') || 'input'}: ${issue.message}`);
}

function downloadFile(filename: string, type: string, content: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function downloadPngFromSvg(filename: string, svg: string) {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    const loaded = new Promise<HTMLImageElement>((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = reject;
    });
    image.src = url;
    const loadedImage = await loaded;
    const canvas = document.createElement('canvas');
    canvas.width = loadedImage.naturalWidth || 1200;
    canvas.height = loadedImage.naturalHeight || 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available');
    ctx.drawImage(loadedImage, 0, 0);
    const pngBlob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((next) => next ? resolve(next) : reject(new Error('PNG export failed')), 'image/png'));
    const pngUrl = URL.createObjectURL(pngBlob);
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(pngUrl);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function NumberField({ label, value, set, step = 1, min }: { label: string; value: number; set: (n: number) => void; step?: number; min?: number }) {
  return <label><span>{label}</span><input type="number" step={step} min={min} value={Number.isFinite(value) ? value : ''} onChange={(event) => set(event.target.value === '' ? Number.NaN : Number(event.target.value))} /></label>;
}

function UnitSelect({ unit, set, allowPixels = true }: { unit: Unit; set: (u: Unit) => void; allowPixels?: boolean }) {
  return <label><span>Unit</span><select value={unit} onChange={(event) => set(event.target.value as Unit)}><option value="in">in</option><option value="cm">cm</option><option value="mm">mm</option>{allowPixels && <option value="px">px</option>}</select></label>;
}

function DpiField({ dpi, set }: { dpi: number; set: (n: number) => void }) {
  const [custom, setCustom] = useState(!dpiPresets.includes(dpi as (typeof dpiPresets)[number]));
  useEffect(() => { if (!dpiPresets.includes(dpi as (typeof dpiPresets)[number])) setCustom(true); }, [dpi]);
  return <label><span>DPI/PPI</span><select value={custom ? 'custom' : String(dpi)} onChange={(event) => { if (event.target.value === 'custom') { setCustom(true); return; } setCustom(false); set(Number(event.target.value)); }}>{dpiPresets.map((preset) => <option key={preset} value={preset}>{preset}</option>)}<option value="custom">Custom</option></select>{custom && <input className="inlineinput" type="number" min={1} max={2400} step={1} value={Number.isFinite(dpi) ? dpi : ''} onChange={(event) => set(event.target.value === '' ? Number.NaN : Number(event.target.value))} />}</label>;
}

function SizePreset({ onPick }: { onPick: (w: number, h: number) => void }) {
  return <label><span>Common size</span><select defaultValue="" onChange={(event) => { if (!event.target.value) return; const [w, h] = event.target.value.split('x').map(Number); onPick(w, h); }}><option value="">Choose a preset</option>{commonSizes.map(([name, w, h]) => <option key={name} value={`${w}x${h}`}>{name} ({w} × {h} in)</option>)}</select></label>;
}

function Actions({ text, share, downloads }: { text: string; share: Record<string, string | number | boolean | undefined>; downloads?: Download[] }) {
  const [status, setStatus] = useState('');
  async function copy(value: string, message: string) {
    try { await navigator.clipboard.writeText(value); setStatus(message); }
    catch { setStatus('Clipboard permission was denied.'); }
  }
  function shareUrl() {
    const url = new URL(window.location.href);
    url.search = encodeShare(share);
    return url.toString();
  }
  return <div className="buttonrow"><button type="button" onClick={() => copy(text, 'Result copied')}>Copy result</button><button type="button" onClick={() => copy(shareUrl(), 'Share link copied')}>Copy share link</button>{downloads?.map((item) => <button key={item.filename + item.label} type="button" onClick={() => item.pngFromSvg ? void downloadPngFromSvg(item.filename, item.content) : downloadFile(item.filename, item.type, item.content)}>{item.label}</button>)}<span className="muted">{status}</span></div>;
}

function ResultPanel({ result }: { result: ResultBlock }) {
  if (result.errors?.length) return <div className="result"><h2>Summary</h2><p className="warning">Fix input errors to calculate.</p><h3>Input errors</h3><ul>{result.errors.map((error) => <li key={error}>{error}</li>)}</ul></div>;
  return <div className="result"><h2>Summary</h2><div>{result.summary}</div><h3>Details</h3><ul>{result.details.map((item, index) => <li key={index}>{item}</li>)}</ul><h3>Warnings</h3><ul>{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>;
}

function StandardText({ source = 'KDP, Etsy and common print production guidance' }: { source?: string }) {
  return <><h2>Formula used</h2><p><code>inches = pixels / DPI</code>, <code>pixels = inches × DPI</code>, and <code>effective DPI = pixels / print inches</code>.</p><h2>Limits and warnings</h2><ul><li>Changing DPI metadata does not create new pixels.</li><li>Printer, paper, sharpening, compression, and viewing distance affect perceived quality.</li><li>Platform specs can change; official printer, KDP, Etsy or print-shop templates should be your final check.</li></ul><h2>FAQ</h2><p><strong>Is 300 DPI always required?</strong> No. 200–240 DPI can be acceptable for many prints, and 150 DPI can work for posters viewed farther away.</p><p><strong>Do these tools upload files?</strong> No. Image checks run in your browser and are not uploaded.</p><p className="small muted">Sources and last updated: {source}. Last updated 2026-05-23.</p></>;
}

export function PrintSizeTool() {
  const [mode, setMode] = useState<PrintMode>('pixels-to-print-size');
  const [width, setWidth] = useState(3000);
  const [height, setHeight] = useState(2400);
  const [unit, setUnit] = useState<Unit>('px');
  const [dpi, setDpi] = useState(300);
  const [pixelWidth, setPixelWidth] = useState(2400);
  const [pixelHeight, setPixelHeight] = useState(3000);
  const [printWidth, setPrintWidth] = useState(8);
  const [printHeight, setPrintHeight] = useState(10);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextMode = params.get('mode') as PrintMode | null;
    if (nextMode && ['pixels-to-print-size', 'print-size-to-pixels', 'effective-dpi'].includes(nextMode)) setMode(nextMode);
    setWidth(readParam(params, 'w', width));
    setHeight(readParam(params, 'h', height));
    setPixelWidth(readParam(params, 'pxw', pixelWidth));
    setPixelHeight(readParam(params, 'pxh', pixelHeight));
    setPrintWidth(readParam(params, 'pw', printWidth));
    setPrintHeight(readParam(params, 'ph', printHeight));
    setDpi(readParam(params, 'dpi', dpi));
    const nextUnit = params.get('unit') as Unit | null;
    if (nextUnit && ['px', 'in', 'cm', 'mm'].includes(nextUnit)) setUnit(nextUnit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const input = mode === 'effective-dpi' ? { mode, width: printWidth, height: printHeight, unit: unit === 'px' ? 'in' as Unit : unit, dpi, pixelWidth, pixelHeight, printWidth, printHeight } : { mode, width, height, unit, dpi };
  const parsed = printSchema.safeParse(input);
  const result = parsed.success ? printSize(parsed.data) : null;
  const svg = result ? svgGuide('Print Size Guide', [`Size: ${round(result.width, 3)} × ${round(result.height, 3)} ${input.unit}`, `Pixels: ${Math.round(result.pxw)} × ${Math.round(result.pxh)} px`, `Effective DPI: ${round(result.edpi, 1)}`, `Formula: ${result.formula}`]) : '';
  const text = result ? `Print size: ${round(result.width, 3)} x ${round(result.height, 3)} ${input.unit}; pixels: ${Math.round(result.pxw)} x ${Math.round(result.pxh)} px; effective DPI: ${round(result.edpi, 1)}; verdict: ${result.quality}` : 'Invalid print size inputs';

  return <Tool title="Print Size Calculator"><div className="formgrid"><label><span>Mode</span><select value={mode} onChange={(event) => { const next = event.target.value as PrintMode; setMode(next); if (next === 'print-size-to-pixels') { setUnit('in'); setWidth(8); setHeight(10); } if (next === 'pixels-to-print-size') setUnit('px'); }}><option value="pixels-to-print-size">Pixels to print size</option><option value="print-size-to-pixels">Print size to pixels</option><option value="effective-dpi">Effective DPI</option></select></label>{mode === 'effective-dpi' ? <><NumberField label="Pixel width" value={pixelWidth} set={setPixelWidth} min={1} /><NumberField label="Pixel height" value={pixelHeight} set={setPixelHeight} min={1} /><NumberField label="Print width" value={printWidth} set={setPrintWidth} step={0.01} min={0.01} /><NumberField label="Print height" value={printHeight} set={setPrintHeight} step={0.01} min={0.01} /><UnitSelect unit={unit === 'px' ? 'in' : unit} set={setUnit} allowPixels={false} /></> : <><NumberField label={mode === 'pixels-to-print-size' ? 'Pixel width' : 'Print width'} value={width} set={setWidth} step={mode === 'pixels-to-print-size' ? 1 : 0.01} min={0.01} /><NumberField label={mode === 'pixels-to-print-size' ? 'Pixel height' : 'Print height'} value={height} set={setHeight} step={mode === 'pixels-to-print-size' ? 1 : 0.01} min={0.01} /><UnitSelect unit={unit} set={setUnit} allowPixels={mode === 'pixels-to-print-size'} />{mode === 'print-size-to-pixels' && <SizePreset onPick={(w, h) => { setWidth(w); setHeight(h); setUnit('in'); }} />}</>}<DpiField dpi={dpi} set={setDpi} /></div><ResultPanel result={{ errors: zodMessages(parsed), summary: result && <p>{text}</p>, details: result ? [`Formula: ${result.formula}`, `Megapixels: ${round(result.mp, 2)} MP`, `Rounding: pixel dimensions are rounded to whole pixels.`] : [], warnings: ['DPI metadata alone does not add real pixels.', 'Viewing distance and print material affect perceived sharpness.', 'Use printer specifications when they differ from this estimate.'] }} /><Actions text={text} share={{ mode, w: width, h: height, unit, dpi, pxw: pixelWidth, pxh: pixelHeight, pw: printWidth, ph: printHeight }} downloads={result ? [{ label: 'Download SVG guide', filename: 'print-size-guide.svg', type: 'image/svg+xml', content: svg }, { label: 'Download PNG guide', filename: 'print-size-guide.png', type: 'image/png', content: svg, pngFromSvg: true }, { label: 'Download CSV', filename: 'print-size-result.csv', type: 'text/csv', content: csv([['field', 'value'], ['print_width', round(result.width, 3)], ['print_height', round(result.height, 3)], ['unit', input.unit], ['pixel_width', Math.round(result.pxw)], ['pixel_height', Math.round(result.pxh)], ['effective_dpi', round(result.edpi, 1)]]) }] : []} /><StandardText /></Tool>;
}

export function DpiTool() {
  const [pxw, setPxw] = useState(4000);
  const [pxh, setPxh] = useState(3000);
  const [w, setW] = useState(8);
  const [h, setH] = useState(10);
  const [unit, setUnit] = useState<Unit>('in');
  const [dpi, setDpi] = useState(300);
  useEffect(() => { const p = new URLSearchParams(window.location.search); setPxw(readParam(p, 'pxw', pxw)); setPxh(readParam(p, 'pxh', pxh)); setW(readParam(p, 'w', w)); setH(readParam(p, 'h', h)); setDpi(readParam(p, 'dpi', dpi)); const u = p.get('unit') as Unit | null; if (u && ['in', 'cm', 'mm'].includes(u)) setUnit(u); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const parsed = imageSchema.safeParse({ pixelWidth: pxw, pixelHeight: pxh, targetWidth: w, targetHeight: h, unit, dpi });
  const r = parsed.success ? imageQuality(pxw, pxh, w, h, unit) : null;
  const requiredPxW = Math.round(fromInch(unit === 'in' ? w : unit === 'cm' ? w / 2.54 : w / 25.4, 'px', dpi));
  const requiredPxH = Math.round(fromInch(unit === 'in' ? h : unit === 'cm' ? h / 2.54 : h / 25.4, 'px', dpi));
  const text = r ? `Effective DPI ${round(r.edpi, 1)}; ${r.quality}; image ${round(r.mp, 2)} MP; required at ${dpi} DPI: ${requiredPxW} x ${requiredPxH} px` : 'Invalid DPI inputs';
  return <Tool title="DPI Calculator"><div className="formgrid"><NumberField label="Pixel width" value={pxw} set={setPxw} min={1} /><NumberField label="Pixel height" value={pxh} set={setPxh} min={1} /><NumberField label="Print width" value={w} set={setW} step={0.01} min={0.01} /><NumberField label="Print height" value={h} set={setH} step={0.01} min={0.01} /><UnitSelect unit={unit} set={setUnit} allowPixels={false} /><DpiField dpi={dpi} set={setDpi} /></div><ResultPanel result={{ errors: zodMessages(parsed), summary: r && <p>{text}</p>, details: r ? [`Required pixels at ${dpi} DPI: ${requiredPxW} × ${requiredPxH} px`, `Aspect ratio difference: ${round(r.ratioDifference * 100, 2)}%`, ...r.max.map((x) => `${x.dpi} DPI max size: ${round(x.width, 2)} × ${round(x.height, 2)} in`)] : [], warnings: r?.cropRisk ? ['The image aspect ratio differs from the target; cropping or borders may be needed.', 'DPI is a planning estimate. Print material and viewing distance matter.'] : ['DPI is a planning estimate. Print material and viewing distance matter.'] }} /><Actions text={text} share={{ pxw, pxh, w, h, unit, dpi }} downloads={r ? [{ label: 'Download CSV', filename: 'dpi-result.csv', type: 'text/csv', content: csv([['dpi', 'max_width_in', 'max_height_in'], ...r.max.map((x) => [x.dpi, round(x.width, 2), round(x.height, 2)])]) }] : []} /><StandardText /></Tool>;
}

export function ImageTool() {
  const [pxw, setPxw] = useState(4000);
  const [pxh, setPxh] = useState(3000);
  const [w, setW] = useState(8);
  const [h, setH] = useState(10);
  const [unit, setUnit] = useState<Unit>('in');
  const [dpi, setDpi] = useState(300);
  const [fileWarning, setFileWarning] = useState('');
  function file(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.size > MAX_IMAGE_BYTES) { setFileWarning('This file is over 100MB. Use manual pixel entry instead.'); return; }
    const url = URL.createObjectURL(selected);
    const image = new Image();
    image.onload = () => { setPxw(image.width); setPxh(image.height); URL.revokeObjectURL(url); setFileWarning('Image dimensions were read locally. The file was not uploaded.'); };
    image.onerror = () => { URL.revokeObjectURL(url); setFileWarning('Could not read this image. Try entering pixel dimensions manually.'); };
    image.src = url;
  }
  const parsed = imageSchema.safeParse({ pixelWidth: pxw, pixelHeight: pxh, targetWidth: w, targetHeight: h, unit, dpi });
  const r = parsed.success ? imageQuality(pxw, pxh, w, h, unit) : null;
  const text = r ? `Image ${pxw} x ${pxh} px, target ${w} x ${h} ${unit}, effective DPI ${round(r.edpi, 1)} (${r.quality})` : 'Invalid image inputs';
  return <Tool title="Image Print Quality Checker"><p className="warning">Images are read locally in your browser. They are not uploaded, stored, or included in share links.</p><input type="file" accept="image/*" onChange={file} /><p className="small muted">{fileWarning}</p><div className="formgrid"><NumberField label="Pixel width" value={pxw} set={setPxw} min={1} /><NumberField label="Pixel height" value={pxh} set={setPxh} min={1} /><NumberField label="Target width" value={w} set={setW} step={0.01} min={0.01} /><NumberField label="Target height" value={h} set={setH} step={0.01} min={0.01} /><UnitSelect unit={unit} set={setUnit} allowPixels={false} /><DpiField dpi={dpi} set={setDpi} /></div><ResultPanel result={{ errors: zodMessages(parsed), summary: r && <p>{text}</p>, details: r ? [`Megapixels: ${round(r.mp, 2)} MP`, `Aspect ratio: ${round(r.aspect, 4)}`, ...r.max.map((x) => `${x.dpi} DPI max size: ${round(x.width, 2)} × ${round(x.height, 2)} in`)] : [], warnings: r?.cropRisk ? ['The image and target print size have different aspect ratios.', 'Image files are processed locally only.'] : ['Image files are processed locally only.', 'Compression, paper and sharpening can affect print quality.'] }} /><Actions text={text} share={{ w, h, unit, dpi }} downloads={r ? [{ label: 'Download CSV', filename: 'image-quality-result.csv', type: 'text/csv', content: csv([['field', 'value'], ['pixel_width', pxw], ['pixel_height', pxh], ['effective_dpi', round(r.edpi, 1)], ['verdict', r.quality]]) }] : []} /><StandardText /></Tool>;
}

export function BleedTool() {
  const [w, setW] = useState(8);
  const [h, setH] = useState(10);
  const [b, setB] = useState(0.125);
  const [s, setS] = useState(0.25);
  const [unit, setUnit] = useState<Unit>('in');
  const [dpi, setDpi] = useState(300);
  const parsed = bleedSchema.safeParse({ trimWidth: w, trimHeight: h, unit, bleedValue: b, safeMargin: s, dpi });
  const r = parsed.success ? bleed(w, h, unit, b, s, dpi) : null;
  const svg = r ? svgGuide('Bleed and Safe Zone Guide', [`Trim: ${w} × ${h} ${unit}`, `Full bleed: ${round(r.fullW, 3)} × ${round(r.fullH, 3)} ${unit}`, `Safe area: ${round(r.safeW, 3)} × ${round(r.safeH, 3)} ${unit}`, `Pixel canvas: ${r.fullPxW} × ${r.fullPxH} px`], 'bleed') : '';
  const text = r ? `Trim ${w} x ${h} ${unit}; full bleed ${round(r.fullW, 3)} x ${round(r.fullH, 3)} ${unit}; safe area ${round(r.safeW, 3)} x ${round(r.safeH, 3)} ${unit}; canvas ${r.fullPxW} x ${r.fullPxH} px` : 'Invalid bleed inputs';
  return <Tool title="Bleed & Safe Zone Calculator"><div className="formgrid"><NumberField label="Trim width" value={w} set={setW} step={0.01} min={0.01} /><NumberField label="Trim height" value={h} set={setH} step={0.01} min={0.01} /><UnitSelect unit={unit} set={setUnit} allowPixels={false} /><NumberField label="Bleed per side" value={b} set={setB} step={0.001} min={0} /><NumberField label="Safe margin" value={s} set={setS} step={0.001} min={0} /><DpiField dpi={dpi} set={setDpi} /><SizePreset onPick={(nextW, nextH) => { setW(nextW); setH(nextH); setUnit('in'); }} /></div><ResultPanel result={{ errors: zodMessages(parsed), summary: r && <p>{text}</p>, details: r ? [`Bleed per side: ${round(r.bleedIn, 3)} in (${r.bleedPx} px)`, `Safe margin: ${round(r.safeIn, 3)} in (${r.safePx} px)`, `Formula: full size = trim + bleed × 2`] : [], warnings: ['Keep important text and logos inside the safe area.', 'Some print providers require different bleed values.', 'Do not add crop marks unless the printer requests them.'] }} /><Actions text={text} share={{ w, h, unit, bleed: b, safe: s, dpi }} downloads={r ? [{ label: 'Download SVG guide', filename: 'bleed-safe-zone-guide.svg', type: 'image/svg+xml', content: svg }, { label: 'Download PNG guide', filename: 'bleed-safe-zone-guide.png', type: 'image/png', content: svg, pngFromSvg: true }, { label: 'Download CSV', filename: 'bleed-safe-zone-result.csv', type: 'text/csv', content: csv([['field', 'value'], ['trim', `${w}x${h} ${unit}`], ['full_bleed', `${round(r.fullW, 3)}x${round(r.fullH, 3)} ${unit}`], ['safe_area', `${round(r.safeW, 3)}x${round(r.safeH, 3)} ${unit}`], ['pixel_canvas', `${r.fullPxW}x${r.fullPxH}`]]) }] : []} /><StandardText /></Tool>;
}

export function KdpCoverTool() {
  const [w, setW] = useState(6);
  const [h, setH] = useState(9);
  const [pages, setPages] = useState(120);
  const [paper, setPaper] = useState<'white' | 'cream' | 'groundwood'>('white');
  const [interior, setInterior] = useState<'bw' | 'standard' | 'premium'>('bw');
  const [dpi, setDpi] = useState(300);
  const parsed = kdpCoverSchema.safeParse({ trimWidth: w, trimHeight: h, pages, paper, interior, dpi });
  const r = parsed.success ? kdpCover(w, h, pages, paper, interior, 'in', dpi) : null;
  const svg = r ? svgGuide('KDP Cover Guide', [`Full cover: ${round(r.coverW, 3)} × ${round(r.coverH, 3)} in`, `Spine: ${round(r.spineW, 3)} in`, `Canvas: ${r.pxW} × ${r.pxH} px`, `Bleed: 0.125 in per outside edge`], 'kdp') : '';
  const text = r ? `KDP cover ${round(r.coverW, 3)} x ${round(r.coverH, 3)} in; spine ${round(r.spineW, 3)} in; pixel canvas ${r.pxW} x ${r.pxH} px` : 'Invalid KDP cover inputs';
  return <Tool title="KDP Cover Size Calculator"><div className="formgrid"><NumberField label="Trim width in" value={w} set={setW} step={0.01} min={0.01} /><NumberField label="Trim height in" value={h} set={setH} step={0.01} min={0.01} /><NumberField label="Page count" value={pages} set={setPages} step={1} min={1} /><label><span>Paper</span><select value={paper} onChange={(event) => setPaper(event.target.value as typeof paper)}><option value="white">White</option><option value="cream">Cream</option><option value="groundwood">Groundwood</option></select></label><label><span>Interior</span><select value={interior} onChange={(event) => setInterior(event.target.value as typeof interior)}><option value="bw">Black & white</option><option value="standard">Standard color</option><option value="premium">Premium color</option></select></label><DpiField dpi={dpi} set={setDpi} /></div><ResultPanel result={{ errors: zodMessages(parsed), summary: r && <p>{text}</p>, details: r ? [`Formula: back cover + spine + front cover + 0.25 in outside bleed`, `Spine multiplier: ${r.multiplier} in/page`, `Front: ${w} × ${h} in; Back: ${w} × ${h} in`] : [], warnings: ['Use the official KDP template generator before upload.', 'Do not add crop marks or white borders around the one-page PDF cover.', ...(r && !r.canSpineText ? ['KDP says books under 79 pages should not have spine text.'] : [])] }} /><Actions text={text} share={{ trim: `${w}x${h}`, pages, paper, interior, dpi }} downloads={r ? [{ label: 'Download SVG guide', filename: 'kdp-cover-guide.svg', type: 'image/svg+xml', content: svg }, { label: 'Download PNG guide', filename: 'kdp-cover-guide.png', type: 'image/png', content: svg, pngFromSvg: true }, { label: 'Download checklist', filename: 'kdp-cover-checklist.txt', type: 'text/plain', content: textChecklist('KDP Cover Setup Checklist', ['Create one PDF containing back cover, spine and front cover.', 'Keep text and logos inside the safe zone.', 'Reserve barcode space unless you upload your own barcode.', 'Verify the final PDF in the official KDP previewer.']) }] : []} /><StandardText source="KDP cover setup guidance" /></Tool>;
}

export function KdpInteriorTool() {
  const [w, setW] = useState(6);
  const [h, setH] = useState(9);
  const [bleedOn, setBleedOn] = useState(true);
  const [dpi, setDpi] = useState(300);
  const parsed = kdpInteriorSchema.safeParse({ trimWidth: w, trimHeight: h, hasBleed: bleedOn, dpi });
  const r = parsed.success ? kdpInterior(w, h, 'in', bleedOn, dpi) : null;
  const svg = r ? svgGuide('KDP Interior Guide', [`Page setup: ${round(r.pageW, 3)} × ${round(r.pageH, 3)} in`, `Trim: ${w} × ${h} in`, `Canvas: ${r.pxW} × ${r.pxH} px`, bleedOn ? 'Bleed added to outside/top/bottom only' : 'No bleed added'], 'bleed') : '';
  const text = r ? `KDP interior page setup ${round(r.pageW, 3)} x ${round(r.pageH, 3)} in; ${r.pxW} x ${r.pxH} px at ${dpi} DPI` : 'Invalid KDP interior inputs';
  return <Tool title="KDP Interior Bleed Calculator"><div className="formgrid"><NumberField label="Trim width in" value={w} set={setW} step={0.01} min={0.01} /><NumberField label="Trim height in" value={h} set={setH} step={0.01} min={0.01} /><label><span>Bleed</span><select value={bleedOn ? 'yes' : 'no'} onChange={(event) => setBleedOn(event.target.value === 'yes')}><option value="yes">Yes</option><option value="no">No</option></select></label><DpiField dpi={dpi} set={setDpi} /></div><ResultPanel result={{ errors: zodMessages(parsed), summary: r && <p>{text}</p>, details: r ? [`With bleed: width adds 0.125 in to the outside edge; height adds 0.25 in total.`, `No extra bleed is added to the inside/gutter edge.`, `Formula: ${bleedOn ? 'trim width + 0.125; trim height + 0.25' : 'page size equals trim size'}`] : [], warnings: ['Interior bleed rules differ from full cover bleed.', 'Verify export settings in KDP previewer before publishing.'] }} /><Actions text={text} share={{ w, h, bleed: bleedOn, dpi }} downloads={r ? [{ label: 'Download SVG guide', filename: 'kdp-interior-guide.svg', type: 'image/svg+xml', content: svg }, { label: 'Download PNG guide', filename: 'kdp-interior-guide.png', type: 'image/png', content: svg, pngFromSvg: true }] : []} /><StandardText source="KDP interior bleed guidance" /></Tool>;
}

export function EtsyTool() {
  const [dpi, setDpi] = useState(300);
  const parsed = etsySchema.safeParse({ dpi });
  const rows = parsed.success ? etsyRows(dpi) : [];
  const text = parsed.success ? csv([['ratio', 'size_in', 'pixel_width', 'pixel_height', 'dpi', 'file_group'], ...rows.map((row) => [row.ratio, row.size, row.pxw, row.pxh, dpi, row.slug])]) : 'Invalid Etsy DPI input';
  return <Tool title="Etsy Printable Size Pack Calculator"><div className="formgrid"><DpiField dpi={dpi} set={setDpi} /></div><ResultPanel result={{ errors: zodMessages(parsed), summary: <p>{rows.length} printable sizes generated across common wall-art ratios at {dpi} DPI.</p>, details: ['Ratios included: 2:3, 3:4, 4:5, 5:7, 11:14, ISO, Square.', 'CSV columns include ratio, size, pixel width, pixel height, DPI and file group.', 'Use ZIP files when related sizes exceed platform file count limits.'], warnings: ['Etsy digital listings allow up to 5 uploaded files per listing and each file has a 20MB limit.', 'Ratio packs do not guarantee every frame size fits without cropping.', 'Do not imply Etsy endorsement or approval.'] }} /><table><thead><tr><th>Ratio</th><th>Size</th><th>Pixels</th></tr></thead><tbody>{rows.map((row) => <tr key={`${row.ratio}-${row.size}`}><td>{row.ratio}</td><td>{row.size}</td><td>{row.pxw} × {row.pxh}</td></tr>)}</tbody></table><Actions text={text} share={{ dpi }} downloads={[{ label: 'Download CSV', filename: 'etsy-printable-size-pack.csv', type: 'text/csv', content: text }, { label: 'Download buyer instruction', filename: 'etsy-buyer-instruction.txt', type: 'text/plain', content: buyerInstruction() }]} /><StandardText source="Etsy digital file limit and common wall-art ratio guidance" /></Tool>;
}

export function SizesTool() {
  const [dpi, setDpi] = useState(300);
  const rows = commonSizes.map(([name, w, h]) => [name, `${w} x ${h} in`, `${round(w * 2.54, 2)} x ${round(h * 2.54, 2)} cm`, `${Math.round(w * dpi)} x ${Math.round(h * dpi)} px`]);
  const text = csv([['size', 'inches', 'centimeters', `pixels_at_${dpi}_dpi`], ...rows]);
  return <Tool title="Common Print Sizes Library"><div className="formgrid"><DpiField dpi={dpi} set={setDpi} /></div><table><thead><tr><th>Size</th><th>Inches</th><th>Centimeters</th><th>Pixels at {dpi} DPI</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>)}</tbody></table><Actions text={text} share={{ dpi }} downloads={[{ label: 'Download CSV', filename: 'common-print-sizes.csv', type: 'text/csv', content: text }]} /><StandardText /></Tool>;
}

function Tool({ title, children }: { title: string; children: ReactNode }) {
  return <main className="container stack"><section className="tool stack"><h1>{title}</h1>{children}</section></main>;
}
