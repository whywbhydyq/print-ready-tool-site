export type LengthUnit = 'in' | 'cm' | 'mm';
export function toInches(value: number, unit: LengthUnit) {
  if (unit === 'cm') return value / 2.54;
  if (unit === 'mm') return value / 25.4;
  return value;
}
export function fromInches(value: number, unit: LengthUnit) {
  if (unit === 'cm') return value * 2.54;
  if (unit === 'mm') return value * 25.4;
  return value;
}
export function pxToInches(px: number, ppi: number) { return px / ppi; }
export function inchesToPx(inches: number, ppi: number) { return inches * ppi; }
export function cmToPx(cm: number, ppi: number) { return inchesToPx(cm / 2.54, ppi); }
export function pxToCm(px: number, ppi: number) { return pxToInches(px, ppi) * 2.54; }
export function mmToPx(mm: number, ppi: number) { return inchesToPx(mm / 25.4, ppi); }
export function pxToMm(px: number, ppi: number) { return pxToInches(px, ppi) * 25.4; }
export function calculatePpi(px: number, physicalSize: number, unit: LengthUnit) { return px / toInches(physicalSize, unit); }
export function pixelsForPhysicalSize(size: number, unit: LengthUnit, ppi: number) { return toInches(size, unit) * ppi; }
