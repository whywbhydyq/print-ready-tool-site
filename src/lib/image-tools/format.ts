export function round(value: number, digits = 2) {
  return Math.round((value + Number.EPSILON) * 10 ** digits) / 10 ** digits;
}
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
export function csv(rows: Array<Array<string | number>>) {
  return rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
}
