export type ContentCluster = {
  id: string;
  title: string;
  intent: string;
  hub: { href: string; label: string };
  spokes: { href: string; label: string; role: string }[];
  userStories: string[];
  linkableAsset: string;
  measurement: string;
};

export const contentClusters: ContentCluster[] = [
  {
    id: 'kdp-cover-production',
    title: 'KDP cover production',
    intent: 'Users need an upload-ready paperback cover spread with trim, spine, bleed, barcode space, safe margins, and final PDF checks handled together.',
    hub: { href: '/', label: 'KDP Cover Size & Spine Calculator' },
    spokes: [
      { href: '/guides/kdp-paperback-cover-size-formula/', label: 'KDP paperback cover size formula', role: 'Explains the core spread-width formula.' },
      { href: '/guides/kdp-cover-size-with-bleed/', label: 'KDP cover size with bleed', role: 'Shows how bleed changes the cover canvas.' },
      { href: '/guides/kdp-spine-width-calculator/', label: 'KDP spine width calculator', role: 'Supports page-count and paper-type decisions.' },
      { href: '/guides/kdp-barcode-safe-zone/', label: 'KDP barcode safe zone', role: 'Protects the back-cover barcode area.' },
      { href: '/templates/kdp-cover-setup-checklist/', label: 'KDP cover setup checklist', role: 'Turns calculator output into a proofing checklist.' }
    ],
    userStories: [
      'As a self-publisher, I want one cover spread number so I can create a single PDF canvas without stitching files later.',
      'As a designer, I want the spine and barcode risks separated so I can decide where text and background art are safe.',
      'As a production reviewer, I want formula evidence and a checklist so I can audit the file before uploading to KDP.'
    ],
    linkableAsset: 'Calculator output with SVG/PNG guide overlay and a copyable KDP production summary.',
    measurement: 'Track calculator starts, copy actions, overlay downloads, and links from KDP formula or rejection-checklist guides back to the homepage tool.'
  },
  {
    id: 'print-size-dpi',
    title: 'Print size, DPI, and pixel readiness',
    intent: 'Users need to convert between pixels, inches, centimetres, millimetres, PPI, and practical print quality before ordering or selling a print.',
    hub: { href: '/print-size-calculator/', label: 'Print Size Calculator' },
    spokes: [
      { href: '/dpi-calculator/', label: 'DPI Calculator', role: 'Calculates effective PPI and maximum print size.' },
      { href: '/image-print-quality-checker/', label: 'Image Print Quality Checker', role: 'Checks a local image against a target product size.' },
      { href: '/common-print-sizes/', label: 'Common Print Sizes Library', role: 'Provides common target sizes and pixel tables.' },
      { href: '/guides/8x10-print-size-pixels-300-dpi/', label: '8x10 pixels at 300 DPI', role: 'Captures a high-volume print-size use case.' },
      { href: '/guides/a4-size-in-pixels-300-dpi/', label: 'A4 pixels at 300 DPI', role: 'Supports document and international paper searches.' }
    ],
    userStories: [
      'As an Etsy seller, I want to know whether a downloaded or generated image can print at the advertised frame size.',
      'As a photographer, I want maximum print size from a pixel file without guessing from megapixels alone.',
      'As a buyer, I want an answer-first pixel table so I can choose the right export before visiting a print shop.'
    ],
    linkableAsset: 'Common-size conversion tables with 150, 200, 240, and 300 PPI planning numbers.',
    measurement: 'Track clicks from guide tables into print-size and image-quality tools, plus copy actions from the calculated result cards.'
  },
  {
    id: 'bleed-safe-zone',
    title: 'Bleed, trim, and safe-zone planning',
    intent: 'Users need to prevent white edges, cut-off text, clipped QR codes, and marketplace rejection caused by missing bleed or unsafe content placement.',
    hub: { href: '/bleed-safe-zone-calculator/', label: 'Bleed & Safe Zone Calculator' },
    spokes: [
      { href: '/kdp-interior-bleed-calculator/', label: 'KDP Interior Bleed Calculator', role: 'Applies bleed math to paperback interior pages.' },
      { href: '/guides/business-card-bleed-size/', label: 'Business card bleed size', role: 'Explains trim, bleed, and safe margin on a small-format product.' },
      { href: '/guides/canva-print-bleed-crop-marks/', label: 'Canva print bleed and crop marks', role: 'Connects design-app export steps with bleed planning.' },
      { href: '/templates/print-ready-pdf-checklist/', label: 'Print-ready PDF checklist', role: 'Adds preflight steps after geometry is correct.' }
    ],
    userStories: [
      'As a Canva user, I want plain bleed and crop-mark guidance so I know what to enable before PDF export.',
      'As a small business owner, I want a safe-zone rectangle so logos, QR codes, and addresses stay away from the cut edge.',
      'As a print operator, I want source dimensions in inches and pixels so the submitted file matches the production template.'
    ],
    linkableAsset: 'Reusable trim/bleed/safe-zone formula block and print-ready PDF checklist.',
    measurement: 'Track related-link depth between bleed calculator, Canva guide, business-card guide, and PDF checklist.'
  },
  {
    id: 'etsy-printable-products',
    title: 'Etsy printable product setup',
    intent: 'Users need a practical ratio-pack workflow for printable wall art, buyer instructions, color caveats, and frame-size compatibility.',
    hub: { href: '/etsy-printable-size-calculator/', label: 'Etsy Printable Size Pack Calculator' },
    spokes: [
      { href: '/guides/etsy-printable-wall-art-sizes/', label: 'Etsy printable wall art sizes', role: 'Explains the product-size planning problem.' },
      { href: '/guides/etsy-printable-ratio-guide/', label: 'Etsy printable ratio guide', role: 'Maps ratios to common frames and ISO A sizes.' },
      { href: '/templates/etsy-buyer-instruction-template/', label: 'Etsy buyer instruction template', role: 'Provides copyable post-purchase instructions.' },
      { href: '/common-print-sizes/', label: 'Common Print Sizes Library', role: 'Provides physical dimensions and pixel targets.' }
    ],
    userStories: [
      'As a printable seller, I want ratio-pack dimensions so one listing can support multiple frame families.',
      'As a buyer, I want clear instructions so I choose the correct file and avoid fit-to-page scaling errors.',
      'As a support reviewer, I want color and usage caveats stated before delivery so expectations are controlled.'
    ],
    linkableAsset: 'Copyable buyer instruction template plus ratio-pack pixel table.',
    measurement: 'Track template copy events and links between Etsy guides, ratio calculator, and common-size tables.'
  },
  {
    id: 'platform-image-specs',
    title: 'Platform image-size compliance',
    intent: 'Users need local image checks for social, marketplace, app-store, and website image assets without uploading private image files.',
    hub: { href: '/image-size/', label: 'PixelFit Image Size Tools' },
    spokes: [
      { href: '/image-size/open-graph-image-checker/', label: 'Open Graph Image Checker', role: 'Checks social share-card image size and safe text area.' },
      { href: '/image-size/google-play-asset-checker/', label: 'Google Play Image Size Checker', role: 'Checks app icon, feature graphic, and related image assets.' },
      { href: '/image-size/app-store-screenshot-size-matrix/', label: 'App Store Screenshot Size', role: 'Supports app listing screenshot dimensions.' },
      { href: '/image-size/amazon-product-image-size/', label: 'Amazon Product Image Size', role: 'Checks marketplace product image dimensions.' },
      { href: '/image-size/social-media-image-size-calculator/', label: 'Social Media Image Size Calculator', role: 'Compares one image against several platform canvases.' }
    ],
    userStories: [
      'As a marketer, I want to know which platform crops text or UI before publishing a campaign image.',
      'As an app publisher, I want asset dimensions and file-size limits checked locally before store upload.',
      'As an ecommerce operator, I want marketplace image dimensions checked without sending product images to a server.'
    ],
    linkableAsset: 'Source-backed platform image specification database with local browser checks and safe-zone overlays.',
    measurement: 'Track source-link clicks, local upload starts, safe-zone downloads, and movement from source library to individual checkers.'
  }
];

export const clusterRoute = '/content-clusters/';
