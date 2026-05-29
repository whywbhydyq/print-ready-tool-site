import { formatInches, inchesToCm, type KdpCoverResult } from '@/src/lib/kdp/cover';

type Props = {
  result: KdpCoverResult;
};

export function KdpMetricStrip({ result }: Props) {
  const metrics = [
    {
      label: 'Spine width',
      value: `${formatInches(result.spineWidthIn, 3)} in`,
      sub: `${(inchesToCm(result.spineWidthIn) * 10).toFixed(2)} mm`
    },
    {
      label: 'Cover file size incl. bleed',
      value: `${formatInches(result.fullCoverWidthIn, 3)} × ${formatInches(result.fullCoverHeightIn, 2)} in`,
      sub: `Trim spread: ${formatInches(result.trimSpreadWidthIn, 3)} × ${formatInches(result.trimHeightIn, 2)} in`
    },
    {
      label: 'Pixel canvas',
      value: `${result.pixelWidth} × ${result.pixelHeight} px`,
      sub: `@ ${result.ppi} PPI`
    },
    {
      label: 'Barcode safe zone',
      value: `${formatInches(result.barcodeSafeZone.widthIn, 3)} × ${formatInches(result.barcodeSafeZone.heightIn, 3)} in`,
      sub: `${inchesToCm(result.barcodeSafeZone.widthIn).toFixed(2)} × ${inchesToCm(result.barcodeSafeZone.heightIn).toFixed(2)} cm`
    }
  ];

  return (
    <div className="kdp-metric-strip">
      {metrics.map((metric) => (
        <div className="kdp-metric" key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <small>{metric.sub}</small>
        </div>
      ))}
    </div>
  );
}
