import { pxToInches, toInches, type LengthUnit } from './dpi';
export type PrintQuality = 'High' | 'Acceptable' | 'Low' | 'Not recommended';
export function gradePrintQuality(ppi: number): PrintQuality { if (ppi >= 300) return 'High'; if (ppi >= 200) return 'Acceptable'; if (ppi >= 150) return 'Low'; return 'Not recommended'; }
export function calculatePrintSize(widthPx: number, heightPx: number, ppi: number) { const widthIn = pxToInches(widthPx, ppi); const heightIn = pxToInches(heightPx, ppi); return { widthIn, heightIn, widthCm: widthIn * 2.54, heightCm: heightIn * 2.54, widthMm: widthIn * 25.4, heightMm: heightIn * 25.4, megapixels: widthPx * heightPx / 1_000_000, quality: gradePrintQuality(ppi) }; }
export function calculateRequiredPixels(width: number, height: number, unit: LengthUnit, ppi: number) { return { widthPx: Math.round(toInches(width, unit) * ppi), heightPx: Math.round(toInches(height, unit) * ppi) }; }
export function effectivePpi(widthPx: number, heightPx: number, width: number, height: number, unit: LengthUnit) { return Math.min(widthPx / toInches(width, unit), heightPx / toInches(height, unit)); }
