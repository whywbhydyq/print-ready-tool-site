import { trimPresetById, type BindingType, type InteriorType, type PaperType, type ReadingDirection } from '@/src/lib/kdp/presets';

export type KdpCoverInput = {
  binding: BindingType;
  interior: InteriorType;
  paper: PaperType;
  readingDirection: ReadingDirection;
  trimId: string;
  customWidthIn: number;
  customHeightIn: number;
  pageCount: number;
  bleedIn: number;
  ppi: number;
  showBarcode: boolean;
};

export type KdpPageRange = {
  min: number;
  max: number;
  source: 'kdp-common-trim' | 'kdp-large-trim' | 'custom-estimate' | 'hardcover-disabled';
};

export type KdpCoverResult = {
  trimWidthIn: number;
  trimHeightIn: number;
  spineWidthIn: number;
  fullCoverWidthIn: number;
  fullCoverHeightIn: number;
  trimSpreadWidthIn: number;
  bleedIn: number;
  ppi: number;
  pageCount: number;
  pixelWidth: number;
  pixelHeight: number;
  barcodeSafeZone: {
    widthIn: number;
    heightIn: number;
    xIn: number;
    yIn: number;
  };
  pageRange: KdpPageRange;
  warnings: string[];
};

const CM_PER_INCH = 2.54;

// KDP paperback spine multipliers from Amazon KDP's paperback cover
// requirements. Values are inches per page. The calculator remains an
// independent planning aid; final files should still be verified in KDP Previewer.
const SPINE_MULTIPLIERS: Record<InteriorType, Record<PaperType, number>> = {
  'black-white': {
    white: 0.002252,
    cream: 0.0025,
    color: 0.002252
  },
  'standard-color': {
    white: 0.002252,
    cream: 0.002252,
    color: 0.002252
  },
  'premium-color': {
    white: 0.002347,
    cream: 0.002347,
    color: 0.002347
  }
};

const COMMON_PAPERBACK_PAGE_RANGES: Record<InteriorType, Record<PaperType, KdpPageRange>> = {
  'black-white': {
    white: { min: 24, max: 828, source: 'kdp-common-trim' },
    cream: { min: 24, max: 776, source: 'kdp-common-trim' },
    color: { min: 24, max: 828, source: 'kdp-common-trim' }
  },
  'standard-color': {
    white: { min: 72, max: 600, source: 'kdp-common-trim' },
    cream: { min: 72, max: 600, source: 'kdp-common-trim' },
    color: { min: 72, max: 600, source: 'kdp-common-trim' }
  },
  'premium-color': {
    white: { min: 24, max: 828, source: 'kdp-common-trim' },
    cream: { min: 24, max: 828, source: 'kdp-common-trim' },
    color: { min: 24, max: 828, source: 'kdp-common-trim' }
  }
};

const LARGE_85_PAPERBACK_PAGE_RANGES: Record<InteriorType, Record<PaperType, KdpPageRange>> = {
  'black-white': {
    white: { min: 24, max: 590, source: 'kdp-large-trim' },
    cream: { min: 24, max: 550, source: 'kdp-large-trim' },
    color: { min: 24, max: 590, source: 'kdp-large-trim' }
  },
  'standard-color': {
    white: { min: 72, max: 600, source: 'kdp-large-trim' },
    cream: { min: 72, max: 600, source: 'kdp-large-trim' },
    color: { min: 72, max: 600, source: 'kdp-large-trim' }
  },
  'premium-color': {
    white: { min: 24, max: 590, source: 'kdp-large-trim' },
    cream: { min: 24, max: 590, source: 'kdp-large-trim' },
    color: { min: 24, max: 590, source: 'kdp-large-trim' }
  }
};

export function roundTo(value: number, decimals = 3): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatInches(value: number, decimals = 3): string {
  return roundTo(value, decimals).toLocaleString('en-US', {
    minimumFractionDigits: value < 1 ? decimals : 0,
    maximumFractionDigits: decimals
  });
}

export function inchesToCm(value: number): number {
  return roundTo(value * CM_PER_INCH, 2);
}

export function getPaperMultiplier(interior: InteriorType, paper: PaperType): number {
  const byPaper = SPINE_MULTIPLIERS[interior] || SPINE_MULTIPLIERS['black-white'];
  return byPaper[paper] || byPaper.white;
}

function pageRangeFromTable(table: Record<InteriorType, Record<PaperType, KdpPageRange>>, interior: InteriorType, paper: PaperType): KdpPageRange {
  const byPaper = table[interior] || table['black-white'];
  return byPaper[paper] || byPaper.white;
}

function isLarge85Trim(trimId: string, trimWidthIn: number, trimHeightIn: number) {
  return trimId === '8.5x11' || (trimWidthIn >= 8.5 && trimHeightIn >= 8.5);
}

export function getKdpPageRange(input: KdpCoverInput, trimWidthIn: number, trimHeightIn: number): KdpPageRange {
  if (input.binding === 'hardcover') return { min: 75, max: 550, source: 'hardcover-disabled' };
  if (input.trimId === 'custom') {
    const source = isLarge85Trim(input.trimId, trimWidthIn, trimHeightIn) ? LARGE_85_PAPERBACK_PAGE_RANGES : COMMON_PAPERBACK_PAGE_RANGES;
    const range = pageRangeFromTable(source, input.interior, input.paper);
    return { ...range, source: 'custom-estimate' };
  }
  const source = isLarge85Trim(input.trimId, trimWidthIn, trimHeightIn) ? LARGE_85_PAPERBACK_PAGE_RANGES : COMMON_PAPERBACK_PAGE_RANGES;
  return pageRangeFromTable(source, input.interior, input.paper);
}

export function calculateKdpCoverSize(input: KdpCoverInput): KdpCoverResult {
  const trim = trimPresetById(input.trimId);
  const trimWidthIn = input.trimId === 'custom' ? input.customWidthIn : trim.widthIn;
  const trimHeightIn = input.trimId === 'custom' ? input.customHeightIn : trim.heightIn;
  const safePageCount = Math.max(1, Math.round(input.pageCount || 1));
  const safeBleed = Math.max(0, input.bleedIn || 0);
  const safePpi = Math.max(72, Math.round(input.ppi || 300));
  const spineWidthIn = roundTo(safePageCount * getPaperMultiplier(input.interior, input.paper), 3);
  const fullCoverWidthIn = roundTo(trimWidthIn * 2 + spineWidthIn + safeBleed * 2, 3);
  const fullCoverHeightIn = roundTo(trimHeightIn + safeBleed * 2, 3);
  const warnings: string[] = [];
  const pageRange = getKdpPageRange(input, trimWidthIn, trimHeightIn);

  if (safePageCount < pageRange.min) warnings.push(`Page count is below the KDP ${input.binding} range for this trim, paper, and interior type.`);
  if (safePageCount > pageRange.max) warnings.push(`Page count is above the KDP ${input.binding} range for this trim, paper, and interior type.`);
  if (pageRange.source === 'custom-estimate') warnings.push('Custom trim page-count limits are estimated from the closest KDP paperback trim group; verify the final range in KDP.');
  if (safePageCount < 79) warnings.push('KDP does not allow spine text on paperbacks with fewer than 79 pages.');
  if (trimWidthIn < 4 || trimHeightIn < 6) warnings.push('Custom trim is unusually small; check KDP trim-size support.');
  if (trimWidthIn > 8.5 || trimHeightIn > 11) warnings.push('Custom trim is large; verify the size in KDP before designing.');
  if (safeBleed < 0.125) warnings.push('KDP cover artwork usually needs 0.125 in bleed on outside edges.');
  if (safePpi < 300) warnings.push('Pixel canvas is below 300 PPI; print detail may be limited.');

  return {
    trimWidthIn: roundTo(trimWidthIn, 3),
    trimHeightIn: roundTo(trimHeightIn, 3),
    spineWidthIn,
    fullCoverWidthIn,
    fullCoverHeightIn,
    trimSpreadWidthIn: roundTo(trimWidthIn * 2 + spineWidthIn, 3),
    bleedIn: safeBleed,
    ppi: safePpi,
    pageCount: safePageCount,
    pixelWidth: Math.round(fullCoverWidthIn * safePpi),
    pixelHeight: Math.round(fullCoverHeightIn * safePpi),
    barcodeSafeZone: {
      widthIn: 2,
      heightIn: 1.2,
      xIn: roundTo(safeBleed + trimWidthIn - 2.35, 3),
      yIn: roundTo(safeBleed + trimHeightIn - 1.65, 3)
    },
    pageRange,
    warnings
  };
}
