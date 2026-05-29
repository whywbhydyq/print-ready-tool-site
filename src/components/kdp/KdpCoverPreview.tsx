import { formatInches, type KdpCoverResult } from '@/src/lib/kdp/cover';

type Props = {
  result: KdpCoverResult;
  showBarcode: boolean;
};

export function KdpCoverPreview({ result, showBarcode }: Props) {
  const width = 980;
  const height = 260;
  const marginX = 36;
  const marginY = 30;
  const scale = Math.min((width - marginX * 2) / result.fullCoverWidthIn, (height - marginY * 2) / result.fullCoverHeightIn);
  const spreadWidth = result.fullCoverWidthIn * scale;
  const spreadHeight = result.fullCoverHeightIn * scale;
  const originX = (width - spreadWidth) / 2;
  const originY = (height - spreadHeight) / 2;
  const bleed = result.trimWidthIn > 0 ? result.fullCoverWidthIn - (result.trimWidthIn * 2 + result.spineWidthIn) : 0;
  const bleedEdge = Math.max(bleed / 2, 0.125);
  const trimX = originX + bleedEdge * scale;
  const trimY = originY + result.bleedIn * scale;
  const trimHeight = result.trimHeightIn * scale;
  const backWidth = result.trimWidthIn * scale;
  const spineWidth = Math.max(result.spineWidthIn * scale, 16);
  const frontWidth = result.trimWidthIn * scale;
  const backX = trimX;
  const spineX = backX + backWidth;
  const frontX = spineX + spineWidth;
  const safeInset = Math.min(22, Math.max(12, 0.22 * scale));
  const barcodeWidth = result.barcodeSafeZone.widthIn * scale;
  const barcodeHeight = result.barcodeSafeZone.heightIn * scale;
  const barcodeX = backX + backWidth - barcodeWidth - 30;
  const barcodeY = trimY + trimHeight - barcodeHeight - 18;
  const pageOrder = result.trimWidthIn > 0 ? ['Back cover', 'Front cover'] : ['Back cover', 'Front cover'];

  return (
    <div className="kdp-preview-frame" aria-label="KDP full cover spread preview">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Back cover, spine, front cover, bleed, trim, safe zone and barcode safe zone">
        <defs>
          <pattern id="paper-grain" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#fffdf8" />
            <path d="M0 4 C6 2, 12 6, 20 3 M0 15 C8 13, 13 18, 20 14" fill="none" stroke="#efe7da" strokeWidth="0.8" opacity="0.65" />
          </pattern>
        </defs>
        <rect x={originX} y={originY} width={spreadWidth} height={spreadHeight} fill="#fff8ed" stroke="#ef4444" strokeWidth="1.4" strokeDasharray="6 5" />
        <rect x={trimX} y={trimY} width={backWidth + spineWidth + frontWidth} height={trimHeight} fill="url(#paper-grain)" stroke="#1f2937" strokeWidth="1" />
        <rect x={backX} y={trimY} width={backWidth} height={trimHeight} fill="transparent" stroke="#111827" strokeWidth="1" />
        <rect x={spineX} y={trimY} width={spineWidth} height={trimHeight} fill="#f8f5ef" stroke="#111827" strokeWidth="1" />
        <rect x={frontX} y={trimY} width={frontWidth} height={trimHeight} fill="transparent" stroke="#111827" strokeWidth="1" />
        <rect x={backX + safeInset} y={trimY + safeInset} width={backWidth - safeInset * 2} height={trimHeight - safeInset * 2} fill="transparent" stroke="#60a5fa" strokeWidth="1.4" strokeDasharray="5 4" />
        <rect x={frontX + safeInset} y={trimY + safeInset} width={frontWidth - safeInset * 2} height={trimHeight - safeInset * 2} fill="transparent" stroke="#60a5fa" strokeWidth="1.4" strokeDasharray="5 4" />
        {showBarcode && <rect x={barcodeX} y={barcodeY} width={barcodeWidth} height={barcodeHeight} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" opacity="0.85" />}
        {showBarcode && <text x={barcodeX + barcodeWidth / 2} y={barcodeY + barcodeHeight / 2 - 3} textAnchor="middle" fontSize="12" fontWeight="700" fill="#374151">Barcode</text>}
        {showBarcode && <text x={barcodeX + barcodeWidth / 2} y={barcodeY + barcodeHeight / 2 + 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="#374151">safe zone</text>}
        <text x={backX + backWidth / 2} y={trimY + trimHeight / 2 - 6} textAnchor="middle" fontSize="19" fontWeight="800" fill="#111827">{pageOrder[0]}</text>
        <text x={backX + backWidth / 2} y={trimY + trimHeight / 2 + 16} textAnchor="middle" fontSize="15" fill="#111827">{formatInches(result.trimWidthIn, 2)} × {formatInches(result.trimHeightIn, 2)} in</text>
        <text x={spineX + spineWidth / 2} y={trimY + trimHeight / 2 - 8} textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">Spine</text>
        <text x={spineX + spineWidth / 2} y={trimY + trimHeight / 2 + 14} textAnchor="middle" fontSize="13" fill="#111827">{formatInches(result.spineWidthIn, 3)} in</text>
        <text x={frontX + frontWidth / 2} y={trimY + trimHeight / 2 - 6} textAnchor="middle" fontSize="19" fontWeight="800" fill="#111827">{pageOrder[1]}</text>
        <text x={frontX + frontWidth / 2} y={trimY + trimHeight / 2 + 16} textAnchor="middle" fontSize="15" fill="#111827">{formatInches(result.trimWidthIn, 2)} × {formatInches(result.trimHeightIn, 2)} in</text>
        <line x1={backX} y1={trimY + trimHeight + 18} x2={backX + backWidth} y2={trimY + trimHeight + 18} stroke="#111827" strokeWidth="1" />
        <line x1={spineX} y1={trimY + trimHeight + 18} x2={spineX + spineWidth} y2={trimY + trimHeight + 18} stroke="#111827" strokeWidth="1" />
        <line x1={frontX} y1={trimY + trimHeight + 18} x2={frontX + frontWidth} y2={trimY + trimHeight + 18} stroke="#111827" strokeWidth="1" />
        <text x={backX + backWidth / 2} y={trimY + trimHeight + 33} textAnchor="middle" fontSize="14" fill="#111827">{formatInches(result.trimWidthIn, 2)} in</text>
        <text x={spineX + spineWidth / 2} y={trimY + trimHeight + 33} textAnchor="middle" fontSize="14" fill="#111827">{formatInches(result.spineWidthIn, 3)} in</text>
        <text x={frontX + frontWidth / 2} y={trimY + trimHeight + 33} textAnchor="middle" fontSize="14" fill="#111827">{formatInches(result.trimWidthIn, 2)} in</text>
        <text x={originX + spreadWidth / 2} y={height - 8} textAnchor="middle" fontSize="15" fontWeight="700" fill="#111827">{formatInches(result.fullCoverWidthIn, 3)} in</text>
        <line x1={originX + spreadWidth + 24} y1={originY} x2={originX + spreadWidth + 24} y2={originY + spreadHeight} stroke="#111827" strokeWidth="1" />
        <text x={originX + spreadWidth + 44} y={originY + spreadHeight / 2} textAnchor="middle" fontSize="15" fontWeight="700" fill="#111827">{formatInches(result.fullCoverHeightIn, 2)} in</text>
      </svg>
    </div>
  );
}
