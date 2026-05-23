import { PrintSizeTool } from '@/src/components/CalculatorClient';
import { absoluteUrl } from '@/src/lib/site';

const title = 'Print Size Calculator';
const description = 'Convert pixels to inches, cm, mm and required pixels by DPI.';
const url = absoluteUrl('/print-size-calculator/');

export const metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: 'Print Ready Tools', type: 'website' },
  twitter: { card: 'summary', title, description }
};

export default function Page(){return <PrintSizeTool/>}
