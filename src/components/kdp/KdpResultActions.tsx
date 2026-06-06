'use client';

import { useState } from 'react';
import { formatInches, type KdpCoverResult } from '@/src/lib/kdp/cover';
import { getKdpBarcodeBox, getKdpSpreadOrder } from '@/src/lib/kdp/layout';
import type { ReadingDirection } from '@/src/lib/kdp/presets';

const MAX_PNG_EXPORT_PIXELS = 100_000_000;

type Props = {
  result: KdpCoverResult;
  summary: string;
  readingDirection: ReadingDirection;
  showBarcode: boolean;
  disabled?: boolean;
};

function downloadTextFile(filename: string, mimeType: string, content: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function safeFilePart(value: number, decimals = 2): string {
  return formatInches(value, decimals).replace(/[^0-9.]+/g, '-').replace(/^-|-$/g, '');
}

function guideBaseName(result: KdpCoverResult): string {
  return `kdp-cover-${safeFilePart(result.trimWidthIn)}x${safeFilePart(result.trimHeightIn)}-${result.pageCount}p-${result.ppi}ppi-guide`;
}

function buildSvgGuide(result: KdpCoverResult, readingDirection: ReadingDirection, showBarcode: boolean) {
  const scale = 72;
  const width = result.fullCoverWidthIn * scale;
  const height = result.fullCoverHeightIn * scale;
  const bleed = result.bleedIn * scale;
  const trimWidth = result.trimWidthIn * scale;
  const trimHeight = result.trimHeightIn * scale;
  const spineWidth = Math.max(result.spineWidthIn * scale, 10);
  const leftX = bleed;
  const trimY = bleed;
  const spineX = leftX + trimWidth;
  const rightX = spineX + spineWidth;
  const safeInset = 0.25 * scale;
  const order = getKdpSpreadOrder(readingDirection);
  const pngPixelCount = result.pixelWidth * result.pixelHeight;
  const pngExportAllowed = Number.isFinite(pngPixelCount) && pngPixelCount <= MAX_PNG_EXPORT_PIXELS;
  const barcodeBox = getKdpBarcodeBox(result, readingDirection);
  const barcodeX = barcodeBox.xIn * scale;
  const barcodeY = barcodeBox.yIn * scale;
  const barcodeW = barcodeBox.widthIn * scale;
  const barcodeH = barcodeBox.heightIn * scale;
  const barcodeMarkup = showBarcode ? `
  <rect x="${barcodeX}" y="${barcodeY}" width="${barcodeW}" height="${barcodeH}" fill="#e5e7eb" stroke="#6b7280"/>
  <text x="${barcodeX + barcodeW / 2}" y="${barcodeY + barcodeH / 2 - 5}" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700">Barcode</text>
  <text x="${barcodeX + barcodeW / 2}" y="${barcodeY + barcodeH / 2 + 10}" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700">safe zone</text>` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#fffdf8"/>
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="8 6"/>
  <rect x="${leftX}" y="${trimY}" width="${trimWidth + spineWidth + trimWidth}" height="${trimHeight}" fill="none" stroke="#111827" stroke-width="2"/>
  <rect x="${leftX + safeInset}" y="${trimY + safeInset}" width="${trimWidth - safeInset * 2}" height="${trimHeight - safeInset * 2}" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="8 6"/>
  <rect x="${rightX + safeInset}" y="${trimY + safeInset}" width="${trimWidth - safeInset * 2}" height="${trimHeight - safeInset * 2}" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="8 6"/>
  <line x1="${spineX}" y1="${trimY}" x2="${spineX}" y2="${trimY + trimHeight}" stroke="#111827" stroke-width="2"/>
  <line x1="${rightX}" y1="${trimY}" x2="${rightX}" y2="${trimY + trimHeight}" stroke="#111827" stroke-width="2"/>${barcodeMarkup}
  <text x="${leftX + trimWidth / 2}" y="${trimY + trimHeight / 2}" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700">${order.leftPanel}</text>
  <text x="${spineX + spineWidth / 2}" y="${trimY + trimHeight / 2}" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Spine</text>
  <text x="${rightX + trimWidth / 2}" y="${trimY + trimHeight / 2}" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700">${order.rightPanel}</text>
  <text x="${leftX + trimWidth / 2}" y="${height - bleed / 2}" text-anchor="middle" font-family="Arial" font-size="12">${formatInches(result.trimWidthIn, 2)} × ${formatInches(result.trimHeightIn, 2)} in</text>
  <text x="${rightX + trimWidth / 2}" y="${height - bleed / 2}" text-anchor="middle" font-family="Arial" font-size="12">${formatInches(result.trimWidthIn, 2)} × ${formatInches(result.trimHeightIn, 2)} in</text>
  <text x="${spineX + spineWidth / 2}" y="${height - bleed / 2}" text-anchor="middle" font-family="Arial" font-size="12">${formatInches(result.spineWidthIn, 3)} in spine</text>
</svg>`;
}

export function KdpResultActions({ result, summary, readingDirection, showBarcode, disabled = false }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const svg = buildSvgGuide(result, readingDirection, showBarcode);
  const baseName = guideBaseName(result);
  const order = getKdpSpreadOrder(readingDirection);
  const pngPixelCount = result.pixelWidth * result.pixelHeight;
  const pngExportAllowed = Number.isFinite(pngPixelCount) && pngPixelCount <= MAX_PNG_EXPORT_PIXELS;
  const figmaSetup = `KDP cover setup
Canvas incl. bleed: ${formatInches(result.fullCoverWidthIn, 3)} × ${formatInches(result.fullCoverHeightIn, 2)} in
Trim spread: ${formatInches(result.trimSpreadWidthIn, 3)} × ${formatInches(result.trimHeightIn, 2)} in
Layout: ${order.orderText}
Pixels: ${result.pixelWidth} × ${result.pixelHeight}px @ ${result.ppi} PPI
Back cover: ${formatInches(result.trimWidthIn, 2)} × ${formatInches(result.trimHeightIn, 2)} in
Front cover: ${formatInches(result.trimWidthIn, 2)} × ${formatInches(result.trimHeightIn, 2)} in
Spine: ${formatInches(result.spineWidthIn, 3)} in
Bleed: ${formatInches(result.bleedIn, 3)} in on outside edges
Barcode safe zone: ${showBarcode ? `${formatInches(result.barcodeSafeZone.widthIn, 3)} × ${formatInches(result.barcodeSafeZone.heightIn, 3)} in, ${order.barcodeCorner}` : 'hidden in guide'}`;

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((current) => (current === key ? null : current)), 1600);
    } catch {
      setCopied('failed');
      window.setTimeout(() => setCopied((current) => (current === 'failed' ? null : current)), 2200);
    }
  };

  const downloadPng = () => {
    if (!pngExportAllowed) {
      setCopied('png-too-large');
      window.setTimeout(() => setCopied((current) => (current === 'png-too-large' ? null : current)), 2600);
      return;
    }
    const image = new Image();
    const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(result.fullCoverWidthIn * result.ppi);
      canvas.height = Math.round(result.fullCoverHeightIn * result.ppi);
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#fffdf8';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const anchor = document.createElement('a');
        anchor.href = pngUrl;
        anchor.download = `${baseName}.png`;
        anchor.click();
      }
      URL.revokeObjectURL(svgUrl);
    };
    image.src = svgUrl;
  };

  return (
    <div className="kdp-actions-card">
      <h3>Quick actions</h3>
      <button type="button" className="kdp-action-button" disabled={disabled} onClick={() => copy('dimensions', summary)}>{disabled ? 'Calculate first' : copied === 'dimensions' ? 'Copied' : 'Copy dimensions'}</button>
      <button type="button" className="kdp-action-button" disabled={disabled} onClick={() => copy('setup', figmaSetup)}>{disabled ? 'Calculate first' : copied === 'setup' ? 'Copied' : 'Copy Photoshop / Figma setup'}</button>
      <button type="button" className="kdp-action-button" disabled={disabled} onClick={() => downloadTextFile(`${baseName}.svg`, 'image/svg+xml', svg)}>Download SVG guide</button>
      <button type="button" className="kdp-action-button" disabled={disabled || !pngExportAllowed} onClick={downloadPng}>Download PNG guide</button>
      <button type="button" className="kdp-action-button" disabled={disabled} onClick={() => window.print()}>Print setup</button>
      {copied === 'failed' && <p className="kdp-copy-error">Copy failed — select and copy manually.</p>}
      {copied === 'png-too-large' && <p className="kdp-copy-error">PNG guide is too large for safe browser export. Use SVG instead.</p>}
      {!pngExportAllowed && <p className="kdp-copy-error">PNG disabled above {Math.round(MAX_PNG_EXPORT_PIXELS / 1_000_000)}MP; SVG remains available.</p>}
    </div>
  );
}
