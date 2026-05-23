export type Unit = 'px' | 'in' | 'cm' | 'mm';

export function toInches(value: number, unit: Unit, dpi = 300): number {
  if (unit === 'in') return value;
  if (unit === 'cm') return value / 2.54;
  if (unit === 'mm') return value / 25.4;
  return value / dpi;
}

export function fromInches(value: number, unit: Unit, dpi = 300): number {
  if (unit === 'in') return value;
  if (unit === 'cm') return value * 2.54;
  if (unit === 'mm') return value * 25.4;
  return value * dpi;
}

export function round(value: number, digits = 3): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatDimension(value: number, unit: Unit, digits = unit === 'px' ? 0 : 3): string {
  return `${round(value, digits)} ${unit}`;
}
