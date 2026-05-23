import { KdpCoverTool } from '@/src/components/CalculatorClient';
import { absoluteUrl } from '@/src/lib/site';

const title='KDP Cover Size Calculator';
const description='Calculate KDP paperback cover full size, spine width and pixel canvas.';
const url=absoluteUrl('/kdp-cover-calculator/');

export const metadata={
  title,
  description,
  alternates:{canonical:url},
  openGraph:{title,description,url,siteName:'Print Ready Tools',type:'website'},
  twitter:{card:'summary',title,description}
};

export default function Page(){return <KdpCoverTool/>}
