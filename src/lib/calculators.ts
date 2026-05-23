export type Unit = 'px' | 'in' | 'cm' | 'mm';
export type PrintMode = 'pixels-to-print-size' | 'print-size-to-pixels' | 'effective-dpi';

export const dpiPresets = [72, 96, 150, 200, 240, 300, 600] as const;
export const MAX_IMAGE_BYTES = 100 * 1024 * 1024;

export const inch = (value: number, unit: Unit, dpi = 300) => {
  if (unit === 'in') return value;
  if (unit === 'cm') return value / 2.54;
  if (unit === 'mm') return value / 25.4;
  return value / dpi;
};

export const fromInch = (value: number, unit: Unit, dpi = 300) => {
  if (unit === 'in') return value;
  if (unit === 'cm') return value * 2.54;
  if (unit === 'mm') return value * 25.4;
  return value * dpi;
};

export const round = (n: number, d = 3) => Math.round((n + Number.EPSILON) * 10 ** d) / 10 ** d;
export const quality = (dpi: number) => dpi >= 300 ? 'close-view sharp' : dpi >= 200 ? 'good for many prints' : dpi >= 150 ? 'acceptable for posters / distance viewing' : 'risk of softness / pixelation';

export function printSize(input: { mode: PrintMode; width: number; height: number; unit: Unit; dpi: number; pixelWidth?: number; pixelHeight?: number; printWidth?: number; printHeight?: number }) {
  if (input.mode === 'effective-dpi') {
    const pxw = input.pixelWidth ?? input.width;
    const pxh = input.pixelHeight ?? input.height;
    const wi = inch(input.printWidth ?? input.width, input.unit, input.dpi);
    const hi = inch(input.printHeight ?? input.height, input.unit, input.dpi);
    const edpi = Math.min(pxw / wi, pxh / hi);
    return {
      width: fromInch(wi, input.unit, input.dpi),
      height: fromInch(hi, input.unit, input.dpi),
      widthIn: wi,
      heightIn: hi,
      pxw,
      pxh,
      edpi,
      mp: pxw * pxh / 1000000,
      quality: quality(edpi),
      formula: 'effective DPI = pixels / print inches',
    };
  }

  const wi = input.mode === 'pixels-to-print-size' ? input.width / input.dpi : inch(input.width, input.unit, input.dpi);
  const hi = input.mode === 'pixels-to-print-size' ? input.height / input.dpi : inch(input.height, input.unit, input.dpi);
  const pxw = input.mode === 'pixels-to-print-size' ? input.width : Math.round(wi * input.dpi);
  const pxh = input.mode === 'pixels-to-print-size' ? input.height : Math.round(hi * input.dpi);
  const edpi = Math.min(pxw / wi, pxh / hi);
  return {
    width: fromInch(wi, input.unit, input.dpi),
    height: fromInch(hi, input.unit, input.dpi),
    widthIn: wi,
    heightIn: hi,
    pxw,
    pxh,
    edpi,
    mp: pxw * pxh / 1000000,
    quality: quality(edpi),
    formula: input.mode === 'pixels-to-print-size' ? 'inches = pixels / DPI' : 'pixels = inches × DPI',
  };
}

export function imageQuality(pxw: number, pxh: number, tw: number, th: number, unit: Unit = 'in') {
  const wi = inch(tw, unit, 300);
  const hi = inch(th, unit, 300);
  const edpi = Math.min(pxw / wi, pxh / hi);
  const ratio = pxw / pxh;
  const targetRatio = wi / hi;
  const diff = Math.abs(ratio - targetRatio) / targetRatio;
  return {
    aspect: ratio,
    targetRatio,
    ratioDifference: diff,
    cropRisk: diff > 0.02,
    mp: pxw * pxh / 1000000,
    edpi,
    quality: quality(edpi),
    max: [300, 240, 200, 150].map((d) => ({ dpi: d, width: pxw / d, height: pxh / d })),
  };
}

export function bleed(trimW: number, trimH: number, unit: Unit, bleedVal: number, safeVal: number, dpi: number) {
  const tw = inch(trimW, unit, dpi);
  const th = inch(trimH, unit, dpi);
  const b = inch(bleedVal, unit, dpi);
  const s = inch(safeVal, unit, dpi);
  const fw = tw + b * 2;
  const fh = th + b * 2;
  const sw = tw - s * 2;
  const sh = th - s * 2;
  return {
    trimW: fromInch(tw, unit, dpi),
    trimH: fromInch(th, unit, dpi),
    fullW: fromInch(fw, unit, dpi),
    fullH: fromInch(fh, unit, dpi),
    safeW: fromInch(sw, unit, dpi),
    safeH: fromInch(sh, unit, dpi),
    trimInW: tw,
    trimInH: th,
    fullInW: fw,
    fullInH: fh,
    safeInW: sw,
    safeInH: sh,
    fullPxW: Math.round(fw * dpi),
    fullPxH: Math.round(fh * dpi),
    bleedPx: Math.round(b * dpi),
    safePx: Math.round(s * dpi),
    bleedIn: b,
    safeIn: s,
    invalid: s * 2 >= tw || s * 2 >= th || b < 0 || s < 0,
  };
}

export const spineMultipliers: Record<string, number> = {
  bw_white: 0.002252,
  bw_cream: 0.0025,
  bw_groundwood: 0.0025,
  standard_white: 0.002252,
  standard_cream: 0.002252,
  premium_white: 0.002347,
  premium_cream: 0.002347,
};

export function kdpCover(trimW: number, trimH: number, pages: number, paper: string, interior: string, unit: Unit, dpi = 300) {
  const tw = inch(trimW, unit, dpi);
  const th = inch(trimH, unit, dpi);
  const key = `${interior}_${paper}`;
  const multiplier = spineMultipliers[key] || 0.002252;
  const sw = pages * multiplier;
  const cw = tw * 2 + sw + 0.25;
  const ch = th + 0.25;
  return {
    coverW: fromInch(cw, unit, dpi),
    coverH: fromInch(ch, unit, dpi),
    frontW: fromInch(tw, unit, dpi),
    frontH: fromInch(th, unit, dpi),
    backW: fromInch(tw, unit, dpi),
    backH: fromInch(th, unit, dpi),
    spineW: fromInch(sw, unit, dpi),
    coverInW: cw,
    coverInH: ch,
    trimInW: tw,
    trimInH: th,
    spineIn: sw,
    bleedIn: 0.125,
    multiplier,
    pxW: Math.round(cw * dpi),
    pxH: Math.round(ch * dpi),
    canSpineText: pages >= 79,
  };
}

export function kdpInterior(trimW: number, trimH: number, unit: Unit, hasBleed: boolean, dpi = 300) {
  const tw = inch(trimW, unit, dpi);
  const th = inch(trimH, unit, dpi);
  const outsideBleedIn = hasBleed ? 0.125 : 0;
  const verticalBleedIn = hasBleed ? 0.125 : 0;
  const verticalBleedTotalIn = verticalBleedIn * 2;
  const pageInW = tw + outsideBleedIn;
  const pageInH = th + verticalBleedTotalIn;
  return {
    pageW: fromInch(pageInW, unit, dpi),
    pageH: fromInch(pageInH, unit, dpi),
    pageInW,
    pageInH,
    trimInW: tw,
    trimInH: th,
    pxW: Math.round(pageInW * dpi),
    pxH: Math.round(pageInH * dpi),
    outsideBleedIn,
    verticalBleedIn,
    verticalBleedTotalIn,
  };
}

export const etsyPacks = [
  { ratio: '2:3', slug: '2-3', sizes: [[4, 6], [8, 12], [12, 18], [16, 24], [20, 30], [24, 36]] },
  { ratio: '3:4', slug: '3-4', sizes: [[6, 8], [9, 12], [12, 16], [15, 20], [18, 24]] },
  { ratio: '4:5', slug: '4-5', sizes: [[8, 10], [12, 15], [16, 20], [20, 25], [24, 30]] },
  { ratio: '5:7', slug: '5-7', sizes: [[5, 7], [10, 14], [15, 21]] },
  { ratio: '11:14', slug: '11-14', sizes: [[11, 14], [22, 28]] },
  { ratio: 'ISO', slug: 'iso', sizes: [[5.83, 8.27], [8.27, 11.69], [11.69, 16.54], [16.54, 23.39], [23.39, 33.11]] },
  { ratio: 'Square', slug: 'square', sizes: [[8, 8], [10, 10], [12, 12], [16, 16], [20, 20]] },
] as const;

export const commonSizes = [
  ['A4', 8.27, 11.69],
  ['US Letter', 8.5, 11],
  ['8x10 Photo', 8, 10],
  ['11x14 Poster', 11, 14],
  ['16x20 Poster', 16, 20],
  ['24x36 Poster', 24, 36],
  ['Business Card', 3.5, 2],
  ['KDP 6x9', 6, 9],
  ['KDP 8.5x11', 8.5, 11],
  ['5x7 Invitation', 5, 7],
  ['4x6 Photo', 4, 6],
  ['Square 12x12', 12, 12],
] as const;

export function csv(rows: (string | number)[][]) {
  return rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
}

export function etsyRows(dpi: number, selected?: string[]) {
  return etsyPacks
    .filter((pack) => !selected?.length || selected.includes(pack.slug))
    .flatMap((pack) => pack.sizes.map((size) => ({
      ratio: pack.ratio,
      slug: pack.slug,
      size: `${size[0]}x${size[1]} in`,
      width: size[0],
      height: size[1],
      pxw: Math.round(size[0] * dpi),
      pxh: Math.round(size[1] * dpi),
    })));
}

export function encodeShare(params: Record<string, string | number | boolean | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value));
  });
  return query.toString();
}

function escapeXml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export function svgGuide(title: string, lines: string[], kind: 'generic' | 'bleed' | 'kdp' = 'generic') {
  const labels = kind === 'kdp'
    ? ['Back cover', 'Spine', 'Front cover', 'Barcode reminder']
    : kind === 'bleed'
      ? ['Full bleed canvas', 'Trim line', 'Safe area', 'Keep text inside safe area']
      : ['Print-ready guide', 'Trim', 'Safe area', 'Check printer specs'];
  const safeTitle = escapeXml(title);
  const safeLabels = labels.map(escapeXml).join(' • ');
  const detailText = lines
    .slice(0, 5)
    .map((line, index) => `<text x="60" y="${780 + index * 34}" font-size="20" font-family="Arial">${escapeXml(line)}</text>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="960" viewBox="0 0 1200 960"><rect width="1200" height="960" fill="#fff7ed"/><text x="60" y="70" font-size="34" font-family="Arial" font-weight="700">${safeTitle}</text><rect x="90" y="130" width="1020" height="540" fill="#fff" stroke="#f97316" stroke-width="12"/><rect x="150" y="190" width="900" height="420" fill="none" stroke="#111827" stroke-width="4" stroke-dasharray="16 10"/><rect x="230" y="260" width="740" height="280" fill="none" stroke="#16a34a" stroke-width="5"/><line x1="600" y1="130" x2="600" y2="670" stroke="#2563eb" stroke-width="3"/><text x="110" y="720" font-size="22" font-family="Arial">${safeLabels}</text>${detailText}</svg>`;
}

export function buyerInstruction() {
  return 'Thank you for your purchase. Choose the ratio file that matches your frame or paper size, print at 100% scale, and use high-quality paper or a professional print shop. Colors may vary by monitor, printer and paper. Digital files are not physical products. Files are for personal use unless your listing states otherwise.';
}

export function textChecklist(title: string, items: string[]) {
  return `${title}\n\n${items.map((item, index) => `${index + 1}. ${item}`).join('\n')}`;
}
