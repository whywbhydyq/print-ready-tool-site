import type { KdpCoverResult } from '@/src/lib/kdp/cover';
import type { ReadingDirection } from '@/src/lib/kdp/presets';

export type KdpPanelSide = 'left' | 'right';

export function getKdpSpreadOrder(readingDirection: ReadingDirection) {
  const isRtl = readingDirection === 'right-to-left';
  return {
    leftPanel: isRtl ? 'Front cover' : 'Back cover',
    rightPanel: isRtl ? 'Back cover' : 'Front cover',
    orderText: isRtl ? 'Front cover | Spine | Back cover' : 'Back cover | Spine | Front cover',
    backCoverSide: (isRtl ? 'right' : 'left') as KdpPanelSide,
    barcodeCorner: isRtl ? 'lower-left of the back cover' : 'lower-right of the back cover'
  };
}

export function getKdpBarcodeBox(result: KdpCoverResult, readingDirection: ReadingDirection) {
  const order = getKdpSpreadOrder(readingDirection);
  const leftPanelStartIn = result.bleedIn;
  const spineStartIn = result.bleedIn + result.trimWidthIn;
  const rightPanelStartIn = spineStartIn + result.spineWidthIn;
  const backPanelStartIn = order.backCoverSide === 'right' ? rightPanelStartIn : leftPanelStartIn;
  const edgeInsetIn = 0.35;
  const bottomInsetIn = 0.3;
  const xIn = order.backCoverSide === 'right'
    ? backPanelStartIn + edgeInsetIn
    : backPanelStartIn + result.trimWidthIn - result.barcodeSafeZone.widthIn - edgeInsetIn;
  const yIn = result.bleedIn + result.trimHeightIn - result.barcodeSafeZone.heightIn - bottomInsetIn;

  return {
    xIn,
    yIn,
    widthIn: result.barcodeSafeZone.widthIn,
    heightIn: result.barcodeSafeZone.heightIn,
    panelSide: order.backCoverSide,
    corner: order.barcodeCorner
  };
}
