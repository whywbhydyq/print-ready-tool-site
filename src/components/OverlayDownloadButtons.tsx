'use client';
import type { SafeZone } from '@/src/data/image-tools';
import { overlaySvg, resolveZone } from '@/src/lib/image-tools/overlay';
function downloadBlob(filename: string, type: string, content: string | Blob) {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
async function downloadPng(filename: string, width: number, height: number, zones: SafeZone[]) {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  ctx.clearRect(0, 0, width, height); ctx.setLineDash([18, 10]); ctx.lineWidth = Math.max(4, Math.round(width / 400)); ctx.font = `700 ${Math.max(18, Math.round(width / 70))}px Arial`;
  zones.forEach((zone) => { const rect = resolveZone(zone, width, height); const color = zone.severity === 'safe' ? '#16a34a' : zone.severity === 'danger' ? '#dc2626' : zone.severity === 'info' ? '#2563eb' : '#f97316'; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.strokeRect(rect.x, rect.y, rect.width, rect.height); ctx.fillText(zone.label, rect.x + 12, Math.max(28, rect.y + 30)); });
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (blob) downloadBlob(filename, 'image/png', blob);
}
export function OverlayDownloadButtons({ title, slug, width, height, zones }: { title: string; slug: string; width: number; height: number; zones: SafeZone[] }) {
  const svg = overlaySvg(title, width, height, zones);
  return <div className="buttonrow"><button type="button" onClick={() => downloadBlob(`${slug}-overlay.svg`, 'image/svg+xml', svg)}>Download SVG overlay</button><button type="button" onClick={() => void downloadPng(`${slug}-overlay.png`, width, height, zones)}>Download PNG overlay</button></div>;
}
