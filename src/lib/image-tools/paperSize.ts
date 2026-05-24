import type { PaperSpec } from '@/src/data/image-tools';
export function paperPixels(paper: PaperSpec, ppi: number, landscape = false, bleedMm = 0, safeMarginMm = 0) {
  const trimWidthMm = landscape ? paper.heightMm : paper.widthMm;
  const trimHeightMm = landscape ? paper.widthMm : paper.heightMm;
  const trimWidthPx = Math.round(trimWidthMm / 25.4 * ppi);
  const trimHeightPx = Math.round(trimHeightMm / 25.4 * ppi);
  const fullBleedWidthPx = Math.round((trimWidthMm + bleedMm * 2) / 25.4 * ppi);
  const fullBleedHeightPx = Math.round((trimHeightMm + bleedMm * 2) / 25.4 * ppi);
  const safeWidthPx = Math.round(Math.max(0, trimWidthMm - safeMarginMm * 2) / 25.4 * ppi);
  const safeHeightPx = Math.round(Math.max(0, trimHeightMm - safeMarginMm * 2) / 25.4 * ppi);
  return { trimWidthMm, trimHeightMm, trimWidthPx, trimHeightPx, fullBleedWidthPx, fullBleedHeightPx, safeWidthPx, safeHeightPx };
}
