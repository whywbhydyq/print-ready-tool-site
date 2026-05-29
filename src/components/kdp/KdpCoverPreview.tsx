import { formatInches, type KdpCoverResult } from '@/src/lib/kdp/cover';
import type { ReadingDirection } from '@/src/lib/kdp/presets';

type Props = {
  result: KdpCoverResult;
  showBarcode: boolean;
  readingDirection?: ReadingDirection;
};

export function KdpCoverPreview({ result, showBarcode, readingDirection = 'left-to-right' }: Props) {
  const width = 980;
  const height = 238;
  const marginX = 34;
  const marginY = 26;
  const rulerSpace = 28;
  const sideLabelSpace = 32;
  const availableWidth = width - marginX * 2 - sideLabelSpace;
  const availableHeight = height - marginY * 2 - rulerSpace;
  const scaleX = availableWidth / result.fullCoverWidthIn;
  const scaleY = availableHeight / result.fullCoverHeightIn;
  const spreadWidth = result.fullCoverWidthIn * scaleX;
  const spreadHeight = result.fullCoverHeightIn * scaleY;
  const originX = marginX;
  const originY = marginY;
  const bleedX = Math.max(result.bleedIn * scaleX, 6);
  const bleedY = Math.max(result.bleedIn * scaleY, 6);
  const trimX = originX + bleedX;
  const trimY = originY + bleedY;
  const trimHeight = result.trimHeightIn * scaleY;
  const coverWidth = result.trimWidthIn * scaleX;
  const spineWidth = Math.max(result.spineWidthIn * scaleX, 22);
  const leftLabel = readingDirection === 'right-to-left' ? 'Front cover' : 'Back cover';
  const rightLabel = readingDirection === 'right-to-left' ? 'Back cover' : 'Front cover';
  const leftX = trimX;
  const spineX = leftX + coverWidth;
  const rightX = spineX + spineWidth;
  const trimSpreadWidth = coverWidth * 2 + spineWidth;
  const safeInsetX = Math.min(20, Math.max(10, 0.25 * scaleX));
  const safeInsetY = Math.min(18, Math.max(9, 0.25 * scaleY));
  const barcodeWidth = Math.min(result.barcodeSafeZone.widthIn * scaleX, coverWidth * 0.34);
  const barcodeHeight = Math.min(result.barcodeSafeZone.heightIn * scaleY, trimHeight * 0.28);
  const barcodeX = leftX + coverWidth - barcodeWidth - safeInsetX - 8;
  const barcodeY = trimY + trimHeight - barcodeHeight - safeInsetY - 4;
  const spreadBottom = originY + spreadHeight;
  const trimBottom = trimY + trimHeight;
  const spineLabelSize = spineWidth < 36 ? 10 : 12;

  return (
    <div className="kdp-preview-frame" aria-label="KDP full cover spread preview">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Back cover, spine, front cover, bleed, trim, safe zone and barcode safe zone">
        <defs>
          <pattern id="paper-grain" width="22" height="22" patternUnits="userSpaceOnUse">
            <rect width="22" height="22" fill="#fffdf8" />
            <path d="M0 5 C7 3, 13 7, 22 4 M0 15 C8 13, 14 18, 22 14" fill="none" stroke="#efe7da" strokeWidth="0.8" opacity="0.62" />
          </pattern>
        </defs>
        <rect x={originX} y={originY} width={spreadWidth} height={spreadHeight} fill="#fff8ed" stroke="#ef4444" strokeWidth="1.4" strokeDasharray="6 5" />
        <rect x={leftX} y={trimY} width={trimSpreadWidth} height={trimHeight} fill="url(#paper-grain)" stroke="#1f2937" strokeWidth="1" />
        <rect x={leftX} y={trimY} width={coverWidth} height={trimHeight} fill="transparent" stroke="#111827" strokeWidth="1" />
        <rect x={spineX} y={trimY} width={spineWidth} height={trimHeight} fill="#f8f5ef" stroke="#111827" strokeWidth="1" />
        <rect x={rightX} y={trimY} width={coverWidth} height={trimHeight} fill="transparent" stroke="#111827" strokeWidth="1" />
        <rect x={leftX + safeInsetX} y={trimY + safeInsetY} width={coverWidth - safeInsetX * 2} height={trimHeight - safeInsetY * 2} fill="transparent" stroke="#60a5fa" strokeWidth="1.4" strokeDasharray="5 4" />
        <rect x={rightX + safeInsetX} y={trimY + safeInsetY} width={coverWidth - safeInsetX * 2} height={trimHeight - safeInsetY * 2} fill="transparent" stroke="#60a5fa" strokeWidth="1.4" strokeDasharray="5 4" />
        {showBarcode && <rect x={barcodeX} y={barcodeY} width={barcodeWidth} height={barcodeHeight} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" opacity="0.88" />}
        {showBarcode && <text x={barcodeX + barcodeWidth / 2} y={barcodeY + barcodeHeight / 2 - 3} textAnchor="middle" fontSize="10" fontWeight="700" fill="#374151">Barcode</text>}
        {showBarcode && <text x={barcodeX + barcodeWidth / 2} y={barcodeY + barcodeHeight / 2 + 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="#374151">safe zone</text>}
        <text x={leftX + coverWidth / 2} y={trimY + trimHeight / 2 - 6} textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">{leftLabel}</text>
        <text x={leftX + coverWidth / 2} y={trimY + trimHeight / 2 + 14} textAnchor="middle" fontSize="13" fill="#111827">{formatInches(result.trimWidthIn, 2)} × {formatInches(result.trimHeightIn, 2)} in</text>
        <text x={spineX + spineWidth / 2} y={trimY + trimHeight / 2 - 6} textAnchor="middle" fontSize={spineLabelSize} fontWeight="800" fill="#111827">Spine</text>
        <text x={spineX + spineWidth / 2} y={trimY + trimHeight / 2 + 11} textAnchor="middle" fontSize="10" fill="#111827">{formatInches(result.spineWidthIn, 3)} in</text>
        <text x={rightX + coverWidth / 2} y={trimY + trimHeight / 2 - 6} textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">{rightLabel}</text>
        <text x={rightX + coverWidth / 2} y={trimY + trimHeight / 2 + 14} textAnchor="middle" fontSize="13" fill="#111827">{formatInches(result.trimWidthIn, 2)} × {formatInches(result.trimHeightIn, 2)} in</text>
        <line x1={leftX} y1={trimBottom + 13} x2={rightX + coverWidth} y2={trimBottom + 13} stroke="#111827" strokeWidth="1" />
        <line x1={leftX} y1={trimBottom + 9} x2={leftX} y2={trimBottom + 17} stroke="#111827" strokeWidth="1" />
        <line x1={rightX + coverWidth} y1={trimBottom + 9} x2={rightX + coverWidth} y2={trimBottom + 17} stroke="#111827" strokeWidth="1" />
        <text x={leftX + trimSpreadWidth / 2} y={trimBottom + 29} textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827">Trim spread {formatInches(result.trimSpreadWidthIn, 3)} in · file width {formatInches(result.fullCoverWidthIn, 3)} in incl. bleed</text>
        <line x1={originX + spreadWidth + 18} y1={originY} x2={originX + spreadWidth + 18} y2={spreadBottom} stroke="#111827" strokeWidth="1" />
        <line x1={originX + spreadWidth + 14} y1={originY} x2={originX + spreadWidth + 22} y2={originY} stroke="#111827" strokeWidth="1" />
        <line x1={originX + spreadWidth + 14} y1={spreadBottom} x2={originX + spreadWidth + 22} y2={spreadBottom} stroke="#111827" strokeWidth="1" />
        <text x={originX + spreadWidth + 39} y={originY + spreadHeight / 2} textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827">{formatInches(result.fullCoverHeightIn, 2)} in</text>
      </svg>
    </div>
  );
}
