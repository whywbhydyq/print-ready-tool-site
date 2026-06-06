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
  source: 'kdp-trim-table' | 'custom-estimate' | 'hardcover-disabled';
  label: string;
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
export const KDP_MIN_TRIM_WIDTH_IN = 4;
export const KDP_MIN_TRIM_HEIGHT_IN = 6;
export const KDP_MAX_TRIM_WIDTH_IN = 8.5;
export const KDP_MAX_TRIM_HEIGHT_IN = 11.69;
export const KDP_MIN_PPI = 72;
export const KDP_MAX_PPI = 1200;
export const KDP_MIN_BLEED_IN = 0;
export const KDP_MAX_BLEED_IN = 0.5;
export const KDP_MAX_PAGE_COUNT_INPUT = 828;


// KDP paperback spine multipliers from Amazon KDP's paperback cover
// requirements. Values are inches per page. The calculator remains an
// independent planning aid; final files should still be verified in KDP Previewer.
const SPINE_MULTIPLIERS: Record<InteriorType, number> = {
  'black-white': 0.002252,
  'standard-color': 0.002252,
  'premium-color': 0.002347
};
const BLACK_WHITE_CREAM_MULTIPLIER = 0.0025;

type PageRangeKey = 'blackWhiteWhite' | 'blackWhiteCream' | 'standardColorWhite' | 'premiumColorWhite';
type PaperbackTrimRange = Record<PageRangeKey, KdpPageRange>;

function range(min: number, max: number, label: string): KdpPageRange {
  return { min, max, source: 'kdp-trim-table', label };
}

const COMMON_PAPERBACK_RANGE: PaperbackTrimRange = {
  blackWhiteWhite: range(24, 828, 'KDP paperback common trim · B&W white'),
  blackWhiteCream: range(24, 776, 'KDP paperback common trim · B&W cream'),
  standardColorWhite: range(72, 600, 'KDP paperback common trim · standard color'),
  premiumColorWhite: range(24, 828, 'KDP paperback common trim · premium color')
};

const LARGE_825_PAPERBACK_RANGE: PaperbackTrimRange = {
  blackWhiteWhite: range(24, 800, 'KDP paperback 8.25 in trim · B&W white'),
  blackWhiteCream: range(24, 750, 'KDP paperback 8.25 in trim · B&W cream'),
  standardColorWhite: range(72, 600, 'KDP paperback 8.25 in trim · standard color'),
  premiumColorWhite: range(24, 800, 'KDP paperback 8.25 in trim · premium color')
};

const LARGE_85_PAPERBACK_RANGE: PaperbackTrimRange = {
  blackWhiteWhite: range(24, 590, 'KDP paperback 8.5 in trim · B&W white'),
  blackWhiteCream: range(24, 550, 'KDP paperback 8.5 in trim · B&W cream'),
  standardColorWhite: range(72, 600, 'KDP paperback 8.5 in trim · standard color'),
  premiumColorWhite: range(24, 590, 'KDP paperback 8.5 in trim · premium color')
};

const A4_PAPERBACK_RANGE: PaperbackTrimRange = {
  blackWhiteWhite: range(24, 780, 'KDP paperback A4 trim · B&W white'),
  blackWhiteCream: range(24, 730, 'KDP paperback A4 trim · B&W cream'),
  // KDP lists standard color as not available for this A4 row. The calculator uses
  // the nearest standard-color paperback maximum only as a conservative warning range
  // when a user enters a custom A4-like trim.
  standardColorWhite: range(72, 600, 'KDP custom A4-like trim · standard color estimate'),
  premiumColorWhite: range(24, 590, 'KDP paperback A4 trim · premium color')
};

const PAPERBACK_PAGE_RANGE_BY_TRIM: Record<string, PaperbackTrimRange> = {
  '5x8': COMMON_PAPERBACK_RANGE,
  '5.06x7.81': COMMON_PAPERBACK_RANGE,
  '5.25x8': COMMON_PAPERBACK_RANGE,
  '5.5x8.5': COMMON_PAPERBACK_RANGE,
  '6x9': COMMON_PAPERBACK_RANGE,
  '6.14x9.21': COMMON_PAPERBACK_RANGE,
  '6.69x9.61': COMMON_PAPERBACK_RANGE,
  '7x10': COMMON_PAPERBACK_RANGE,
  '7.44x9.69': COMMON_PAPERBACK_RANGE,
  '7.5x9.25': COMMON_PAPERBACK_RANGE,
  '8x10': COMMON_PAPERBACK_RANGE,
  '8.25x6': LARGE_825_PAPERBACK_RANGE,
  '8.25x8.25': LARGE_825_PAPERBACK_RANGE,
  '8.5x8.5': LARGE_85_PAPERBACK_RANGE,
  '8.5x11': LARGE_85_PAPERBACK_RANGE,
  '8.27x11.69': A4_PAPERBACK_RANGE
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
  if (interior === 'black-white' && paper === 'cream') return BLACK_WHITE_CREAM_MULTIPLIER;
  return SPINE_MULTIPLIERS[interior] || SPINE_MULTIPLIERS['black-white'];
}

function pageRangeKey(interior: InteriorType, paper: PaperType): PageRangeKey {
  if (interior === 'standard-color') return 'standardColorWhite';
  if (interior === 'premium-color') return 'premiumColorWhite';
  return paper === 'cream' ? 'blackWhiteCream' : 'blackWhiteWhite';
}

function rangeFromTrimTable(trimId: string, interior: InteriorType, paper: PaperType): KdpPageRange | undefined {
  const table = PAPERBACK_PAGE_RANGE_BY_TRIM[trimId];
  return table?.[pageRangeKey(interior, paper)];
}

function customRangeSource(trimWidthIn: number, trimHeightIn: number): PaperbackTrimRange {
  if (trimWidthIn >= 8.45 && trimHeightIn >= 8.45) return LARGE_85_PAPERBACK_RANGE;
  if (trimWidthIn >= 8.2 && trimHeightIn <= 8.6) return LARGE_825_PAPERBACK_RANGE;
  if (trimHeightIn >= 11.5) return A4_PAPERBACK_RANGE;
  return COMMON_PAPERBACK_RANGE;
}

export function getKdpPageRange(input: KdpCoverInput, trimWidthIn: number, trimHeightIn: number): KdpPageRange {
  if (input.binding === 'hardcover') return { min: 75, max: 550, source: 'hardcover-disabled', label: 'KDP hardcover range shown for reference only' };
  const key = pageRangeKey(input.interior, input.paper);
  if (input.trimId === 'custom') {
    const estimate = customRangeSource(trimWidthIn, trimHeightIn)[key];
    return { ...estimate, source: 'custom-estimate', label: `${estimate.label} · custom trim estimate` };
  }
  return rangeFromTrimTable(input.trimId, input.interior, input.paper) || COMMON_PAPERBACK_RANGE[key];
}

function finiteOrDefault(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateKdpCoverSize(input: KdpCoverInput): KdpCoverResult {
  const trim = trimPresetById(input.trimId);
  const rawTrimWidthIn = input.trimId === 'custom' ? finiteOrDefault(input.customWidthIn, trim.widthIn) : trim.widthIn;
  const rawTrimHeightIn = input.trimId === 'custom' ? finiteOrDefault(input.customHeightIn, trim.heightIn) : trim.heightIn;
  const trimWidthIn = input.trimId === 'custom' ? clamp(rawTrimWidthIn, KDP_MIN_TRIM_WIDTH_IN, KDP_MAX_TRIM_WIDTH_IN) : trim.widthIn;
  const trimHeightIn = input.trimId === 'custom' ? clamp(rawTrimHeightIn, KDP_MIN_TRIM_HEIGHT_IN, KDP_MAX_TRIM_HEIGHT_IN) : trim.heightIn;
  const rawPageCount = Math.round(finiteOrDefault(input.pageCount, 1));
  const safePageCount = clamp(rawPageCount || 1, 1, KDP_MAX_PAGE_COUNT_INPUT);
  const rawBleed = finiteOrDefault(input.bleedIn, 0.125);
  const safeBleed = clamp(rawBleed, KDP_MIN_BLEED_IN, KDP_MAX_BLEED_IN);
  const rawPpi = Math.round(finiteOrDefault(input.ppi, 300));
  const safePpi = clamp(rawPpi || 300, KDP_MIN_PPI, KDP_MAX_PPI);
  const spineWidthIn = roundTo(safePageCount * getPaperMultiplier(input.interior, input.paper), 3);
  const fullCoverWidthIn = roundTo(trimWidthIn * 2 + spineWidthIn + safeBleed * 2, 3);
  const fullCoverHeightIn = roundTo(trimHeightIn + safeBleed * 2, 3);
  const warnings: string[] = [];
  const pageRange = getKdpPageRange(input, trimWidthIn, trimHeightIn);

  if (input.trimId === 'custom' && rawTrimWidthIn !== trimWidthIn) warnings.push(`Custom trim width was clamped to the KDP paperback range (${KDP_MIN_TRIM_WIDTH_IN}-${KDP_MAX_TRIM_WIDTH_IN} in).`);
  if (input.trimId === 'custom' && rawTrimHeightIn !== trimHeightIn) warnings.push(`Custom trim height was clamped to the KDP paperback range (${KDP_MIN_TRIM_HEIGHT_IN}-${KDP_MAX_TRIM_HEIGHT_IN} in).`);
  if (rawPageCount !== safePageCount) warnings.push(`Page count was clamped to ${safePageCount}; this calculator limits paperback planning inputs to 1-${KDP_MAX_PAGE_COUNT_INPUT} pages.`);
  if (rawBleed !== safeBleed) warnings.push(`Bleed was clamped to ${formatInches(safeBleed, 3)} in; use 0-${KDP_MAX_BLEED_IN} in for this planner.`);
  if (rawPpi !== safePpi) warnings.push(`PPI was clamped to ${safePpi}; use ${KDP_MIN_PPI}-${KDP_MAX_PPI} PPI for browser-safe exports.`);

  if (safePageCount < pageRange.min) warnings.push(`Page count is below the ${pageRange.label} range.`);
  if (safePageCount > pageRange.max) warnings.push(`Page count is above the ${pageRange.label} range.`);
  if (pageRange.source === 'custom-estimate') warnings.push('Custom trim page-count limits are estimated from the closest KDP paperback trim group; verify the final range in KDP.');
  if (safePageCount < 79) warnings.push('KDP does not allow spine text on paperbacks with fewer than 79 pages.');
  if (input.trimId === 'custom' && (trimWidthIn <= KDP_MIN_TRIM_WIDTH_IN || trimHeightIn <= KDP_MIN_TRIM_HEIGHT_IN)) warnings.push('Custom paperback trim is at the lower KDP limit; verify the chosen trim in KDP before designing.');
  if (input.trimId === 'custom' && (trimWidthIn >= KDP_MAX_TRIM_WIDTH_IN || trimHeightIn >= KDP_MAX_TRIM_HEIGHT_IN)) warnings.push('Custom paperback trim is at the upper KDP limit; verify the chosen trim in KDP before designing.');
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
