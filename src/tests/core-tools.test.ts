import { describe, expect, it } from 'vitest';
import {
  bleed,
  buyerInstruction,
  commonSizes,
  csv,
  encodeShare,
  etsyRows,
  imageQuality,
  kdpCover,
  kdpInterior,
  printSize,
  quality,
  svgGuide,
} from '../lib/calculators';

describe('print size calculator core', () => {
  it('converts pixels to print size at 300 DPI', () => {
    const result = printSize({ mode: 'pixels-to-print-size', width: 3000, height: 2400, unit: 'in', dpi: 300 });

    expect(result.width).toBeCloseTo(10, 5);
    expect(result.height).toBeCloseTo(8, 5);
    expect(result.pxw).toBe(3000);
    expect(result.pxh).toBe(2400);
    expect(result.edpi).toBeCloseTo(300, 5);
    expect(result.quality).toBe('close-view sharp');
  });

  it('converts print size to required pixels', () => {
    const result = printSize({ mode: 'print-size-to-pixels', width: 8, height: 10, unit: 'in', dpi: 300 });

    expect(result.pxw).toBe(2400);
    expect(result.pxh).toBe(3000);
    expect(result.width).toBeCloseTo(8, 5);
    expect(result.height).toBeCloseTo(10, 5);
  });

  it('calculates effective DPI from pixels and physical size', () => {
    const result = printSize({
      mode: 'effective-dpi',
      width: 8,
      height: 10,
      unit: 'in',
      dpi: 300,
      pixelWidth: 2400,
      pixelHeight: 3000,
      printWidth: 8,
      printHeight: 10,
    });

    expect(result.edpi).toBeCloseTo(300, 5);
    expect(result.mp).toBeCloseTo(7.2, 5);
  });
});

describe('dpi and image quality calculators', () => {
  it('returns quality verdict thresholds', () => {
    expect(quality(300)).toBe('close-view sharp');
    expect(quality(240)).toBe('good for many prints');
    expect(quality(150)).toBe('acceptable for posters / distance viewing');
    expect(quality(96)).toBe('risk of softness / pixelation');
  });

  it('calculates image effective DPI and crop risk', () => {
    const result = imageQuality(4000, 3000, 8, 10, 'in');

    expect(result.edpi).toBeCloseTo(300, 5);
    expect(result.mp).toBeCloseTo(12, 5);
    expect(result.cropRisk).toBe(true);
    expect(result.max.find((row) => row.dpi === 300)?.width).toBeCloseTo(13.333, 3);
  });
});

describe('bleed and safe zone calculator', () => {
  it('calculates full bleed canvas, safe area, and pixel margins', () => {
    const result = bleed(8, 10, 'in', 0.125, 0.25, 300);

    expect(result.fullW).toBeCloseTo(8.25, 5);
    expect(result.fullH).toBeCloseTo(10.25, 5);
    expect(result.safeW).toBeCloseTo(7.5, 5);
    expect(result.safeH).toBeCloseTo(9.5, 5);
    expect(result.fullPxW).toBe(2475);
    expect(result.fullPxH).toBe(3075);
    expect(result.bleedPx).toBe(38);
    expect(result.safePx).toBe(75);
    expect(result.invalid).toBe(false);
  });

  it('flags a safe margin that consumes the trim area', () => {
    const result = bleed(8, 10, 'in', 0.125, 4, 300);
    expect(result.invalid).toBe(true);
  });
});

describe('KDP calculators', () => {
  it('calculates KDP cover size and spine width', () => {
    const result = kdpCover(6, 9, 120, 'white', 'bw', 'in', 300);

    expect(result.spineW).toBeCloseTo(0.27024, 5);
    expect(result.coverW).toBeCloseTo(12.52024, 5);
    expect(result.coverH).toBeCloseTo(9.25, 5);
    expect(result.canSpineText).toBe(true);
    expect(result.pxW).toBe(3756);
    expect(result.pxH).toBe(2775);
  });

  it('warns through canSpineText for books under 79 pages', () => {
    const result = kdpCover(6, 9, 78, 'white', 'bw', 'in', 300);
    expect(result.canSpineText).toBe(false);
  });

  it('calculates KDP interior bleed size', () => {
    const result = kdpInterior(6, 9, 'in', true, 300);

    expect(result.pageW).toBeCloseTo(6.125, 5);
    expect(result.pageH).toBeCloseTo(9.25, 5);
    expect(result.pxW).toBe(1838);
    expect(result.pxH).toBe(2775);
  });

  it('keeps no-bleed interior equal to trim size', () => {
    const result = kdpInterior(6, 9, 'in', false, 300);

    expect(result.pageW).toBeCloseTo(6, 5);
    expect(result.pageH).toBeCloseTo(9, 5);
  });
});

describe('Etsy printable and export helpers', () => {
  it('generates common ratio pack rows at 300 DPI', () => {
    const rows = etsyRows(300);
    const eightByTen = rows.find((row) => row.ratio === '4:5' && row.width === 8 && row.height === 10);

    expect(eightByTen).toMatchObject({ pxw: 2400, pxh: 3000, slug: '4-5' });
    expect(rows.some((row) => row.ratio === '2:3')).toBe(true);
    expect(rows.some((row) => row.ratio === 'Square')).toBe(true);
  });

  it('generates CSV, share URL params, SVG labels, and buyer instructions', () => {
    expect(csv([['ratio', 'size'], ['4:5', '8x10']])).toContain('"4:5"');

    const share = encodeShare({ mode: 'effective-dpi', w: 8, h: 10, imageFile: undefined });
    expect(share).toContain('mode=effective-dpi');
    expect(share).not.toContain('imageFile');

    const svg = svgGuide('Bleed test', ['Trim: 8 x 10 in'], 'bleed');
    expect(svg).toContain('Full bleed canvas');
    expect(svg).toContain('Trim line');
    expect(svg).toContain('Safe area');

    expect(buyerInstruction()).toContain('Digital files are not physical products');
  });

  it('includes common print sizes used by the tool pages', () => {
    expect(commonSizes.some(([name]) => name === 'A4')).toBe(true);
    expect(commonSizes.some(([name]) => name === 'Business Card')).toBe(true);
    expect(commonSizes.some(([name]) => name === 'KDP 6x9')).toBe(true);
  });
});
