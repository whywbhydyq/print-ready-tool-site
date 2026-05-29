'use client';

import { useState } from 'react';
import { formatInches, type KdpCoverResult } from '@/src/lib/kdp/cover';

type Props = {
  result: KdpCoverResult;
  summary: string;
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

function buildSvgGuide(result: KdpCoverResult) {
  const scale = 72;
  const width = result.fullCoverWidthIn * scale;
  const height = result.fullCoverHeightIn * scale;
  const bleed = result.bleedIn * scale;
  const trimWidth = result.trimWidthIn * scale;
  const trimHeight = result.trimHeightIn * scale;
  const spineWidth = Math.max(result.spineWidthIn * scale, 10);
  const backX = bleed;
  const trimY = bleed;
  const spineX = backX + trimWidth;
  const frontX = spineX + spineWidth;
  const safeInset = 0.25 * scale;
  const barcodeW = result.barcodeSafeZone.widthIn * scale;
  const barcodeH = result.barcodeSafeZone.heightIn * scale;
  const barcodeX = backX + trimWidth - barcodeW - 0.35 * scale;
  const barcodeY = trimY + trimHeight - barcodeH - 0.3 * scale;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#fffdf8"/>
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="8 6"/>
  <rect x="${backX}" y="${trimY}" width="${trimWidth + spineWidth + trimWidth}" height="${trimHeight}" fill="none" stroke="#111827" stroke-width="2"/>
  <rect x="${backX + safeInset}" y="${trimY + safeInset}" width="${trimWidth - safeInset * 2}" height="${trimHeight - safeInset * 2}" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="8 6"/>
  <rect x="${frontX + safeInset}" y="${trimY + safeInset}" width="${trimWidth - safeInset * 2}" height="${trimHeight - safeInset * 2}" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="8 6"/>
  <line x1="${spineX}" y1="${trimY}" x2="${spineX}" y2="${trimY + trimHeight}" stroke="#111827" stroke-width="2"/>
  <line x1="${frontX}" y1="${trimY}" x2="${frontX}" y2="${trimY + trimHeight}" stroke="#111827" stroke-width="2"/>
  <rect x="${barcodeX}" y="${barcodeY}" width="${barcodeW}" height="${barcodeH}" fill="#e5e7eb" stroke="#6b7280"/>
  <text x="${backX + trimWidth / 2}" y="${trimY + trimHeight / 2}" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700">Back cover</text>
  <text x="${spineX + spineWidth / 2}" y="${trimY + trimHeight / 2}" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Spine</text>
  <text x="${frontX + trimWidth / 2}" y="${trimY + trimHeight / 2}" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700">Front cover</text>
</svg>`;
}

export function KdpResultActions({ result, summary, disabled = false }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const svg = buildSvgGuide(result);
  const baseName = guideBaseName(result);
  const figmaSetup = `KDP cover setup
Canvas incl. bleed: ${formatInches(result.fullCoverWidthIn, 3)} × ${formatInches(result.fullCoverHeightIn, 2)} in
Trim spread: ${formatInches(result.trimSpreadWidthIn, 3)} × ${formatInches(result.trimHeightIn, 2)} in
Pixels: ${result.pixelWidth} × ${result.pixelHeight}px @ ${result.ppi} PPI
Back cover: ${formatInches(result.trimWidthIn, 2)} × ${formatInches(result.trimHeightIn, 2)} in
Front cover: ${formatInches(result.trimWidthIn, 2)} × ${formatInches(result.trimHeightIn, 2)} in
Spine: ${formatInches(result.spineWidthIn, 3)} in
Bleed: ${formatInches(result.bleedIn, 3)} in on outside edges
Barcode safe zone: ${formatInches(result.barcodeSafeZone.widthIn, 3)} × ${formatInches(result.barcodeSafeZone.heightIn, 3)} in`;

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
      <button type="button" className="kdp-action-button" disabled={disabled} onClick={downloadPng}>Download PNG guide</button>
      <button type="button" className="kdp-action-button" disabled={disabled} onClick={() => window.print()}>Print setup</button>
      {copied === 'failed' && <p className="kdp-copy-error">Copy failed — select and copy manually.</p>}
    </div>
  );
}
