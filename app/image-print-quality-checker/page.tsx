import { ImageTool } from '@/src/components/CalculatorClient';
import { absoluteUrl } from '@/src/lib/site';

const title='Image Print Quality Checker';
const description='Check local image dimensions against a target print size.';
const url=absoluteUrl('/image-print-quality-checker/');

export const metadata={
  title,
  description,
  alternates:{canonical:url},
  openGraph:{title,description,url,siteName:'Print Ready Tools',type:'website'},
  twitter:{card:'summary',title,description}
};

export default function Page(){return <ImageTool/>}
