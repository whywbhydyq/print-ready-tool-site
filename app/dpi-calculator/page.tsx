import { DpiTool } from '@/src/components/CalculatorClient';
import { absoluteUrl } from '@/src/lib/site';
const title='DPI Calculator';
const description='Calculate effective DPI, required pixels and maximum print size.';
export const metadata={title,description,alternates:{canonical:absoluteUrl('/dpi-calculator/')}};
export default function Page(){return <DpiTool/>}
