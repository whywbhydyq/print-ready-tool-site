import { SizesTool } from '@/src/components/CalculatorClient';
import { absoluteUrl } from '@/src/lib/site';
const title='Common Print Sizes Library';
const description='Reference common print sizes in inches, cm, mm and pixels.';
export const metadata={title,description,alternates:{canonical:absoluteUrl('/common-print-sizes/')}};
export default function Page(){return <SizesTool/>}
