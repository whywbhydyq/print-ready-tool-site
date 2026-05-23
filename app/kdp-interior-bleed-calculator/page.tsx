import { KdpInteriorTool } from '@/src/components/CalculatorClient';
import { absoluteUrl } from '@/src/lib/site';
const title='KDP Interior Bleed Calculator';
const description='Calculate KDP interior page setup size with and without bleed.';
export const metadata={title,description,alternates:{canonical:absoluteUrl('/kdp-interior-bleed-calculator/')}};
export default function Page(){return <KdpInteriorTool/>}
