import { EtsyTool } from '@/src/components/CalculatorClient';
import { absoluteUrl } from '@/src/lib/site';
const title='Etsy Printable Size Pack Calculator';
const description='Generate printable ratio pack size tables and buyer instruction notes.';
export const metadata={title,description,alternates:{canonical:absoluteUrl('/etsy-printable-size-calculator/')}};
export default function Page(){return <EtsyTool/>}
