import { BleedTool } from '@/src/components/CalculatorClient';
import { absoluteUrl } from '@/src/lib/site';

const title='Bleed & Safe Zone Calculator';
const description='Calculate full bleed canvas, safe area, trim size and pixel margins.';
const url=absoluteUrl('/bleed-safe-zone-calculator/');

export const metadata={
  title,
  description,
  alternates:{canonical:url},
  openGraph:{title,description,url,siteName:'Print Ready Tools',type:'website'},
  twitter:{card:'summary',title,description}
};

export default function Page(){return <BleedTool/>}
