/* eslint-disable @next/next/no-img-element */
'use client';
import type { SafeZone } from '@/src/data/image-tools';
import { resolveZone } from '@/src/lib/image-tools/overlay';
import type { LocalImage } from './ImageUploadPreview';
export function SafeZoneCanvas({ width, height, zones, image }: { width: number; height: number; zones: SafeZone[]; image?: LocalImage | null }) {
  return <div className="safe-preview" style={{ aspectRatio: `${width}/${height}` }}>{image && <img src={image.url} alt="Local image preview" />}<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Safe zone overlay">{zones.map((zone) => { const rect = resolveZone(zone, width, height); return <g key={zone.id}><rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} className={`zone zone-${zone.severity}`} /><text x={rect.x + 14} y={Math.max(28, rect.y + 30)}>{zone.label}</text></g>; })}</svg></div>;
}
