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

export type KdpCoverResult = {
  trimWidthIn: number;
  trimHeightIn: number;
  spineWidthIn: number;
  fullCoverWidthIn: number;
  fullCoverHeightIn: number;
  bleedIn: number;
  pixelWidth: number;
  pixelHeight: number;
  barcodeSafeZone: {
    widthIn: number;
    heightIn: number;
    xIn: number;
    yIn: number;
  };
  pageRange: {
    min: number;
    max: number;
  };
  warnings: string[];
};

const CM_PER_INCH = 2.54;

// Planning multipliers for the first-screen calculator. The UI keeps a clear
// KDP Previewer disclaimer because platform templates remain the final check.
const SPINE_MULTIPLIERS: Record<InteriorType, Record<PaperType, number>> = {
  'black-white': {
    white: 0.003375,
    cream: 0.0035,
    color: 0.003375
  },
  'standard-color': {
    white: 0.00365,
    cream: 0.00365,
    color: 0.00365
  },
  'premium-color': {
    white: 0.0042,
    cream: 0.0042,
    color: 0.0042
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
  const pageRange = input.binding === 'hardcover' ? { min: 75, max: 550 } : { min: 24, max: 828 };

  if (safePageCount < pageRange.min) warnings.push(`Page count is below the common ${input.binding} planning range.`);
  if (safePageCount > pageRange.max) warnings.push(`Page count is above the common ${input.binding} planning range.`);
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
    bleedIn: safeBleed,
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
