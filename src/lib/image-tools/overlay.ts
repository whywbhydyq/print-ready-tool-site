import type { SafeZone } from '@/src/data/image-tools';
export function resolveZone(zone: SafeZone, width: number, height: number) {
  return zone.unit === 'percent' ? { x: zone.x * width, y: zone.y * height, width: zone.width * width, height: zone.height * height } : zone;
}
function escapeXml(value: string) { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'); }
export function overlaySvg(title: string, width: number, height: number, zones: SafeZone[]) {
  const body = zones.map((zone) => { const rect = resolveZone(zone, width, height); const color = zone.severity === 'safe' ? '#16a34a' : zone.severity === 'danger' ? '#dc2626' : zone.severity === 'info' ? '#2563eb' : '#f97316'; return `<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="none" stroke="${color}" stroke-width="${Math.max(4, Math.round(width / 400))}" stroke-dasharray="18 10"/><text x="${rect.x + 12}" y="${Math.max(28, rect.y + 30)}" fill="${color}" font-family="Arial" font-size="${Math.max(18, Math.round(width / 70))}" font-weight="700">${escapeXml(zone.label)}</text>`; }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>${escapeXml(title)}</title>${body}</svg>`;
}
