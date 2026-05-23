import { ImageTool } from '@/src/components/CalculatorClient';
import { absoluteUrl } from '@/src/lib/site';
const title='Image Print Quality Checker';
const description='Check local image dimensions against a target print size without uploading files.';
export const metadata={title,description,alternates:{canonical:absoluteUrl('/image-print-quality-checker/')}};
export default function Page(){return <ImageTool/>}
