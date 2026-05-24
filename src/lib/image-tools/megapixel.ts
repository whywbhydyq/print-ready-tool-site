export function megapixels(widthPx: number, heightPx: number) { return widthPx * heightPx / 1_000_000; }
export function megapixelRisk(widthPx: number, heightPx: number, limit = 64) { const mp = megapixels(widthPx, heightPx); return { megapixels: mp, exceedsLimit: mp > limit }; }
