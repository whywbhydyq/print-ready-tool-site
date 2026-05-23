import { BleedTool } from '@/src/components/CalculatorClient';
import { absoluteUrl } from '@/src/lib/site';
const title='Bleed & Safe Zone Calculator';
const description='Calculate full bleed canvas, safe area, trim size and pixel margins.';
export const metadata={title,description,alternates:{canonical:absoluteUrl('/bleed-safe-zone-calculator/')}};
export default function Page(){return <BleedTool/>}
