import { fromInches, toInches, type Unit } from './unit-conversion';

export type PrintSizeMode = 'pixels-to-print-size' | 'print-size-to-pixels' | 'effective-dpi';

export type PrintSizeInput = {
  mode: PrintSizeMode;
  width: number;
  height: number;
  unit: Unit;
  dpi: number;
  pixelWidth?: number;
  pixelHeight?: number;
  printWidth?: number;
  printHeight?: number;
};

export type QualityVerdict = 'close-view sharp' | 'good for many prints' | 'acceptable for posters / distance viewing' | 'risk of softness / pixelation';

export function dpiVerdict(dpi: number): QualityVerdict {
  if (dpi >= 300) return 'close-view sharp';
  if (dpi >= 200) return 'good for many prints';
  if (dpi >= 150) return 'acceptable for posters / distance viewing';
  return 'risk of softness / pixelation';
}

export function calculatePrintSize(input: PrintSizeInput) {
  if (input.mode === 'effective-dpi') {
    const pixelWidth = input.pixelWidth ?? input.width;
    const pixelHeight = input.pixelHeight ?? input.height;
    const printWidthIn = toInches(input.printWidth ?? input.width, input.unit, input.dpi);
    const printHeightIn = toInches(input.printHeight ?? input.height, input.unit, input.dpi);
    const effectiveDpi = Math.min(pixelWidth / printWidthIn, pixelHeight / printHeightIn);
    return {
      printWidth: fromInches(printWidthIn, input.unit, input.dpi),
      printHeight: fromInches(printHeightIn, input.unit, input.dpi),
      printWidthIn,
      printHeightIn,
      pixelWidth,
      pixelHeight,
      effectiveDpi,
      megapixels: (pixelWidth * pixelHeight) / 1_000_000,
      verdict: dpiVerdict(effectiveDpi),
      formula: 'effective DPI = pixels / print inches',
    };
  }

  const printWidthIn = input.mode === 'pixels-to-print-size' ? input.width / input.dpi : toInches(input.width, input.unit, input.dpi);
  const printHeightIn = input.mode === 'pixels-to-print-size' ? input.height / input.dpi : toInches(input.height, input.unit, input.dpi);
  const pixelWidth = input.mode === 'pixels-to-print-size' ? input.width : Math.round(printWidthIn * input.dpi);
  const pixelHeight = input.mode === 'pixels-to-print-size' ? input.height : Math.round(printHeightIn * input.dpi);
  const effectiveDpi = Math.min(pixelWidth / printWidthIn, pixelHeight / printHeightIn);

  return {
    printWidth: fromInches(printWidthIn, input.unit, input.dpi),
    printHeight: fromInches(printHeightIn, input.unit, input.dpi),
    printWidthIn,
    printHeightIn,
    pixelWidth,
    pixelHeight,
    effectiveDpi,
    megapixels: (pixelWidth * pixelHeight) / 1_000_000,
    verdict: dpiVerdict(effectiveDpi),
    formula: input.mode === 'pixels-to-print-size' ? 'inches = pixels / DPI' : 'pixels = inches × DPI',
  };
}
