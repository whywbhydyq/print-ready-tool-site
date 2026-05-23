export const DPI_PRESETS = [72, 96, 150, 200, 240, 300, 600] as const;
export const DEFAULT_DPI = 300;
export const MIN_DPI = 1;
export const MAX_DPI = 2400;

export type DpiPreset = (typeof DPI_PRESETS)[number] | 'custom';

export function isPresetDpi(value: number): boolean {
  return DPI_PRESETS.includes(value as (typeof DPI_PRESETS)[number]);
}
