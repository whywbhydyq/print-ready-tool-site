export type CommonRatio = { label: string; width: number; height: number };
export const commonRatios: CommonRatio[] = [
  { label: '1:1', width: 1, height: 1 }, { label: '4:5', width: 4, height: 5 }, { label: '3:4', width: 3, height: 4 },
  { label: '16:9', width: 16, height: 9 }, { label: '9:16', width: 9, height: 16 }, { label: '1.91:1', width: 191, height: 100 },
  { label: '2:3', width: 2, height: 3 }, { label: '3:2', width: 3, height: 2 }
];
export function gcd(a: number, b: number): number { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); return b ? gcd(b, a % b) : a || 1; }
export function simplifyRatio(width: number, height: number) { const d = gcd(width, height); const w = Math.round(width / d); const h = Math.round(height / d); return { w, h, label: `${w}:${h}` }; }
export function calculateHeight(width: number, ratioW: number, ratioH: number) { return width * ratioH / ratioW; }
export function calculateWidth(height: number, ratioW: number, ratioH: number) { return height * ratioW / ratioH; }
export function getRatioMismatch(sourceW: number, sourceH: number, targetW: number, targetH: number) { return Math.abs(sourceW / sourceH - targetW / targetH) / (targetW / targetH); }
export function detectCommonRatio(width: number, height: number, tolerance = 0.015) { const ratio = width / height; return commonRatios.find((item) => Math.abs(ratio - item.width / item.height) / (item.width / item.height) <= tolerance) || null; }
export function cropFit(sourceW: number, sourceH: number, targetW: number, targetH: number) { const target = targetW / targetH; const source = sourceW / sourceH; if (source > target) return { width: Math.round(sourceH * target), height: sourceH, cropAxis: 'width' as const }; return { width: sourceW, height: Math.round(sourceW / target), cropAxis: 'height' as const }; }
export function padFit(sourceW: number, sourceH: number, targetW: number, targetH: number) { const target = targetW / targetH; const source = sourceW / sourceH; if (source < target) return { width: Math.round(sourceH * target), height: sourceH, padAxis: 'width' as const }; return { width: sourceW, height: Math.round(sourceW / target), padAxis: 'height' as const }; }
