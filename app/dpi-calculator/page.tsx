import { DpiTool } from '@/src/components/CalculatorClient';
import { absoluteUrl } from '@/src/lib/site';

const title='DPI Calculator';
const description='Calculate effective DPI, required pixels and maximum print size.';
const url=absoluteUrl('/dpi-calculator/');

export const metadata={
  title,
  description,
  alternates:{canonical:url},
  openGraph:{title,description,url,siteName:'Print Ready Tools',type:'website'},
  twitter:{card:'summary',title,description}
};

export default function Page(){return <DpiTool/>}
