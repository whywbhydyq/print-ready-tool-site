export type StaticTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

export type StaticSection = {
  heading: string;
  body: string[];
  bullets?: string[];
  table?: StaticTable;
};

export type StaticPage = {
  path: string;
  title: string;
  description: string;
  updated: string;
  kind: 'hub' | 'guide' | 'template';
  intro: string;
  sections: StaticSection[];
  related: { href: string; label: string }[];
  sourceNote: string;
};

export const staticPages: StaticPage[] = [
  {
    path: '/guides/',
    title: 'Print-Ready Guides',
    description: 'Browse practical print-ready guides for DPI, bleed, trim, safe zones, KDP paperback covers, Etsy printable ratios, and pixel dimensions.',
    updated: '2026-06-06',
    kind: 'hub',
    intro: 'Use this guide hub when you need the rule behind a calculator result. The pages below explain common print dimensions, bleed math, KDP paperback cover setup, Etsy printable ratio packs, and when a printer or marketplace template should override a generic formula.',
    sections: [
      {
        heading: 'Start with the task you are trying to finish',
        body: [
          'Most print problems come from mixing physical size, pixel size, and export settings. Pick the task first: checking whether an image is large enough, adding bleed to a layout, building a KDP cover, or preparing downloadable wall art for buyers.',
          'For close-viewed photo prints and book covers, 300 PPI is the usual planning target. Posters can sometimes pass at lower effective PPI because viewing distance is larger, but marketplace uploads and professional printers may still require exact dimensions.'
        ],
        table: {
          caption: 'Guide categories',
          headers: ['Need', 'Best starting point', 'Calculator to use'],
          rows: [
            ['Pixel dimensions for a print', '8×10, A4, and poster pixel guides', 'Print Size Calculator'],
            ['Bleed or safe zone setup', 'Business card and Canva bleed guides', 'Bleed & Safe Zone Calculator'],
            ['Paperback cover setup', 'KDP cover formula and preset examples', 'KDP Cover Calculator'],
            ['Printable wall art files', 'Etsy ratio and wall-art size guides', 'Etsy Printable Size Pack Calculator']
          ]
        }
      },
      {
        heading: 'Use calculators for final numbers',
        body: [
          'Guide pages use common examples so they are easy to scan. Your final export can change when the trim size, page count, paper type, bleed, safe margin, or target PPI changes. Use the related calculator before creating production files.',
          'The safest workflow is: choose the physical size, calculate pixels or bleed, create the document at the full output size, keep important content inside the safe area, export a PDF or image, then verify with the printer or platform previewer.'
        ],
        bullets: [
          'Use inches × PPI for print pixel dimensions.',
          'Add bleed to both opposite edges of a layout.',
          'Keep text, logos, QR codes, and faces inside the safe zone.',
          'Use official KDP, Etsy, Canva, or printer templates as the final authority.'
        ]
      }
    ],
    related: [
      { href: '/print-size-calculator/', label: 'Print Size Calculator' },
      { href: '/dpi-calculator/', label: 'DPI Calculator' },
      { href: '/bleed-safe-zone-calculator/', label: 'Bleed & Safe Zone Calculator' },
      { href: '/', label: 'KDP Cover Calculator' },
      { href: '/etsy-printable-size-calculator/', label: 'Etsy Printable Size Pack Calculator' }
    ],
    sourceNote: 'The hub summarizes common print-production math. Always verify final acceptance against the printer, KDP previewer, marketplace upload flow, or the official template for the product.'
  },
  {
    path: '/templates/',
    title: 'Print-Ready Templates',
    description: 'Copy reusable print-ready checklists and buyer instruction templates for Etsy downloads, KDP paperback covers, and print PDF delivery.',
    updated: '2026-06-06',
    kind: 'hub',
    intro: 'These templates are operational checklists, not design files. Use them to reduce repeated setup mistakes before you send a file to a buyer, printer, print-on-demand platform, or KDP paperback workflow.',
    sections: [
      {
        heading: 'Choose the template that matches the handoff',
        body: [
          'A buyer instruction template should be short, plain, and focused on which file to print. A production checklist should be stricter because it controls dimensions, bleed, fonts, image resolution, and export settings.',
          'For marketplace files, the template should also explain what the customer receives and what they do not receive. For production PDFs, the checklist should be completed before the file enters a proofing or upload preview step.'
        ],
        table: {
          caption: 'Template map',
          headers: ['Template', 'Use when', 'Main risk reduced'],
          rows: [
            ['Etsy buyer instruction', 'Selling downloadable art, planners, or printable inserts', 'Buyer prints the wrong ratio or scale'],
            ['KDP cover setup checklist', 'Preparing a paperback cover PDF', 'Wrong spine, bleed, barcode area, or trim spread'],
            ['Print-ready PDF checklist', 'Sending a file to a printer or client', 'Missing bleed, unembedded fonts, low-resolution images']
          ]
        }
      },
      {
        heading: 'How to use these templates',
        body: [
          'Copy the checklist, replace the bracketed details with your own product information, and attach the relevant calculator output. Keep the language conservative: do not promise printer approval, platform approval, or identical color across monitors and papers.',
          'Before publishing a template-backed product, run a manual proof. Open the PDF or image at 100% scale, confirm final dimensions, inspect edges for bleed coverage, and check whether important text sits safely inside the printable area.'
        ],
        bullets: [
          'Attach ratio notes to digital downloads.',
          'Attach trim, spine, and bleed numbers to KDP covers.',
          'Attach page size, bleed, font, and image-resolution notes to print PDFs.'
        ]
      }
    ],
    related: [
      { href: '/templates/etsy-buyer-instruction-template/', label: 'Etsy Buyer Instruction Template' },
      { href: '/templates/kdp-cover-setup-checklist/', label: 'KDP Cover Setup Checklist' },
      { href: '/templates/print-ready-pdf-checklist/', label: 'Print-Ready PDF Checklist' },
      { href: '/common-print-sizes/', label: 'Common Print Sizes Library' }
    ],
    sourceNote: 'Templates are general workflow aids. Printer specifications, KDP requirements, marketplace policies, and client production notes override these examples.'
  },
  {
    path: '/guides/8x10-print-size-pixels-300-dpi/',
    title: '8x10 Print Size in Pixels at 300 DPI',
    description: 'Calculate 8×10 print pixels at 300 DPI, compare 200 and 150 PPI options, and see when cropping or upscaling is needed.',
    updated: '2026-06-06',
    kind: 'guide',
    intro: 'An 8×10 inch print at 300 PPI needs 2400 × 3000 pixels. That is the clean planning number for close-viewed photo prints, art prints, and small wall prints when the printer expects a 300 PPI file.',
    sections: [
      {
        heading: 'Pixel dimensions by print quality target',
        body: [
          'The formula is physical size in inches multiplied by pixels per inch. For an 8×10 print, width pixels equal 8 × PPI and height pixels equal 10 × PPI. Use the same formula if the artwork is vertical or horizontal; only the orientation changes.',
          'A smaller source file may still print acceptably at poster distance, but for handheld or close-viewed prints, treat 300 PPI as the safer export target.'
        ],
        table: {
          caption: '8×10 pixel requirements',
          headers: ['Target', 'Pixels', 'Use case'],
          rows: [
            ['300 PPI', '2400 × 3000 px', 'Close-viewed photo or art print'],
            ['240 PPI', '1920 × 2400 px', 'Good quality for many consumer prints'],
            ['200 PPI', '1600 × 2000 px', 'Acceptable for some posters or casual output'],
            ['150 PPI', '1200 × 1500 px', 'Low detail; check a proof before selling']
          ]
        }
      },
      {
        heading: 'Cropping and ratio checks',
        body: [
          'The 8×10 frame uses a 4:5 aspect ratio. A phone photo, camera file, or AI image may not match 4:5 exactly, so you may need to crop or add borders before exporting. Do not stretch the file to 2400 × 3000 unless the ratio already matches.',
          'If the source image is smaller than the target, decide whether upscaling is acceptable. Upscaling changes pixel count but does not create the same detail as a true high-resolution source.'
        ],
        bullets: ['Use 4:5 crop before export.', 'Keep signatures and text away from the edge.', 'Export at the final pixel size after cropping, not before.']
      }
    ],
    related: [
      { href: '/print-size-calculator/', label: 'Print Size Calculator' },
      { href: '/image-print-quality-checker/', label: 'Image Print Quality Checker' },
      { href: '/common-print-sizes/', label: 'Common Print Sizes Library' }
    ],
    sourceNote: 'Pixel counts are calculated with size × PPI. Printer sharpening, paper type, ink system, and viewing distance can change the practical quality threshold.'
  },
  {
    path: '/guides/a4-size-in-pixels-300-dpi/',
    title: 'A4 Size in Pixels at 300 DPI',
    description: 'Calculate A4 pixel dimensions at 300 DPI, compare 200 and 150 PPI, and understand bleed requirements for A4 print files.',
    updated: '2026-06-06',
    kind: 'guide',
    intro: 'A4 paper is 210 × 297 mm, or about 8.27 × 11.69 inches. At 300 PPI, the standard rounded pixel size is 2480 × 3508 pixels.',
    sections: [
      {
        heading: 'A4 pixel table',
        body: [
          'A4 is an ISO paper size, so it is usually specified in millimetres. To calculate pixels, convert millimetres to inches and multiply by the target PPI. The common 300 PPI result is rounded because 210 mm and 297 mm do not convert to whole inches.',
          'Use portrait or landscape orientation based on the layout. The pixel numbers are the same pair reversed.'
        ],
        table: {
          caption: 'A4 pixels by PPI',
          headers: ['Target', 'Pixels, portrait', 'Notes'],
          rows: [
            ['300 PPI', '2480 × 3508 px', 'High-quality print planning'],
            ['240 PPI', '1984 × 2806 px', 'Good quality for many documents'],
            ['200 PPI', '1654 × 2339 px', 'Often acceptable for text-light graphics'],
            ['150 PPI', '1240 × 1754 px', 'Low detail for close viewing']
          ]
        }
      },
      {
        heading: 'A4 with bleed',
        body: [
          'If the design prints to the edge, add bleed before export. A common print bleed is 3 mm per side, making the document 216 × 303 mm before trimming. Some printers use 0.125 inch bleed, so match the printer template.',
          'Keep headers, page numbers, logos, and QR codes inside the safe margin. Bleed is only for background color, photos, and artwork that can be trimmed.'
        ],
        bullets: ['A4 trim: 210 × 297 mm.', 'A4 with 3 mm bleed: 216 × 303 mm.', '300 PPI A4 trim: about 2480 × 3508 px.']
      }
    ],
    related: [
      { href: '/image-size/a4-size-in-pixels/', label: 'A4 Pixel Calculator' },
      { href: '/bleed-safe-zone-calculator/', label: 'Bleed & Safe Zone Calculator' },
      { href: '/common-print-sizes/', label: 'Common Print Sizes Library' }
    ],
    sourceNote: 'A4 dimensions follow the ISO paper size convention. Bleed and margin requirements are printer-specific.'
  },
  {
    path: '/guides/24x36-poster-size-pixels/',
    title: '24x36 Poster Size in Pixels',
    description: 'Calculate 24×36 poster pixels at 300, 200, and 150 PPI, with guidance on viewing distance, bleed, and export safety.',
    updated: '2026-06-06',
    kind: 'guide',
    intro: 'A 24×36 inch poster at 300 PPI is 7200 × 10800 pixels. That is a large file, so poster workflows often balance pixel density, viewing distance, file size, and printer requirements.',
    sections: [
      {
        heading: 'Poster pixel dimensions',
        body: [
          'Use 300 PPI when the poster will be inspected closely or when a print vendor requests it. For posters viewed from several feet away, 200 PPI or 150 PPI may be acceptable, but the final decision should come from the printer proof or upload guidance.',
          'Large posters also need careful sharpening and compression choices. Avoid exporting a huge JPEG with obvious artifacts, and avoid enlarging a small source image without checking detail at print scale.'
        ],
        table: {
          caption: '24×36 poster pixels',
          headers: ['Target', 'Pixels', 'Typical use'],
          rows: [
            ['300 PPI', '7200 × 10800 px', 'Maximum-detail poster or strict vendor spec'],
            ['240 PPI', '5760 × 8640 px', 'High quality with smaller files'],
            ['200 PPI', '4800 × 7200 px', 'Common acceptable poster planning target'],
            ['150 PPI', '3600 × 5400 px', 'Distance-viewed poster; proof first']
          ]
        }
      },
      {
        heading: 'Bleed and safe area',
        body: [
          'If the poster has edge-to-edge artwork, add the printer bleed to the canvas. With 0.125 inch bleed per side, a 24×36 trim becomes 24.25×36.25 inches. At 300 PPI, that full bleed canvas is 7275 × 10875 pixels.',
          'Keep event dates, sponsor logos, QR codes, and faces inside the safe area. The larger the poster, the more visible a bad trim or low-resolution logo can become.'
        ]
      }
    ],
    related: [
      { href: '/print-size-calculator/', label: 'Print Size Calculator' },
      { href: '/image-print-quality-checker/', label: 'Image Print Quality Checker' },
      { href: '/bleed-safe-zone-calculator/', label: 'Bleed & Safe Zone Calculator' }
    ],
    sourceNote: 'Poster pixel recommendations depend on viewing distance and the printer. Use these calculations as setup numbers, then verify with proofing.'
  },
  {
    path: '/guides/business-card-bleed-size/',
    title: 'Business Card Bleed Size',
    description: 'Calculate business card bleed, trim, safe margin, and 300 DPI pixels for common US and metric print card layouts.',
    updated: '2026-06-06',
    kind: 'guide',
    intro: 'A common US business card trim is 3.5 × 2 inches. With 0.125 inch bleed per side, the full artwork canvas is 3.75 × 2.25 inches before trimming.',
    sections: [
      {
        heading: 'Trim, bleed, and safe margin',
        body: [
          'Bleed is extra artwork that extends beyond the final cut edge. It prevents thin white slivers when trimming is slightly off. Safe margin is the interior area where text and logos should stay so they are not cut or visually crowded.',
          'Many US printers use 0.125 inch bleed and ask for important content at least 0.125 to 0.25 inch inside the trim. Metric templates often use 3 mm bleed. Follow the exact template for the print shop you use.'
        ],
        table: {
          caption: 'Common US business card setup',
          headers: ['Area', 'Size', '300 PPI pixels'],
          rows: [
            ['Trim', '3.5 × 2 in', '1050 × 600 px'],
            ['Full bleed, 0.125 in each side', '3.75 × 2.25 in', '1125 × 675 px'],
            ['Conservative safe area, 0.25 in margin', '3 × 1.5 in', '900 × 450 px']
          ]
        }
      },
      {
        heading: 'Practical export checks',
        body: [
          'Background color, photos, and texture can extend to the bleed edge. Names, titles, phone numbers, QR codes, logos, and legal text should stay inside the safe area. If the design has borders, use a thick border or move it inward; thin edge borders make trimming variation obvious.',
          'Export as the printer requests, usually PDF for vector-heavy cards or high-resolution image formats for image-only artwork. Confirm whether the printer expects crop marks.'
        ]
      }
    ],
    related: [
      { href: '/image-size/business-card-size-in-pixels/', label: 'Business Card Pixel Tool' },
      { href: '/bleed-safe-zone-calculator/', label: 'Bleed & Safe Zone Calculator' },
      { href: '/templates/print-ready-pdf-checklist/', label: 'Print-Ready PDF Checklist' }
    ],
    sourceNote: 'Business card dimensions vary by country and printer. Treat 3.5×2 in with 0.125 in bleed as a common US setup, not a universal rule.'
  },
  {
    path: '/guides/canva-print-bleed-crop-marks/',
    title: 'Canva Print Bleed and Crop Marks',
    description: 'Set up Canva print bleed, crop marks, PDF export options, and safe margins before sending artwork to a printer.',
    updated: '2026-06-06',
    kind: 'guide',
    intro: 'Canva can show print bleed and export PDFs with crop marks, but the settings need to match the final printer requirement. The goal is to extend backgrounds beyond the trim while keeping important content away from the cut line.',
    sections: [
      {
        heading: 'Bleed workflow in Canva',
        body: [
          'Turn on print bleed while designing so you can see the outer bleed area. Extend background photos, color blocks, and decorative patterns to the bleed edge. Do not place text, logos, QR codes, or faces in the bleed area.',
          'When exporting, choose the PDF option recommended by the printer. If the printer asks for crop marks and bleed, enable both. If the printer provides its own upload preview or template, compare the exported PDF to that preview before ordering.'
        ],
        bullets: ['Show print bleed before final layout.', 'Extend backgrounds past trim.', 'Keep important content inside the safe margin.', 'Export PDF with crop marks only when the printer requests them.']
      },
      {
        heading: 'Common mistakes',
        body: [
          'A frequent mistake is adding a white margin because the background was not pulled into the bleed area. Another is placing text too close to the trim edge, especially on flyers and business cards. Thin borders are also risky because a small trim shift can make them look uneven.',
          'If Canva art is image-heavy, confirm that imported images are large enough at final print size. A document can have the right page size but still contain low-resolution placed images.'
        ],
        table: {
          caption: 'Canva print checks',
          headers: ['Check', 'Pass condition'],
          rows: [
            ['Page size', 'Matches final trim or printer template'],
            ['Bleed', 'Background extends beyond trim on every edge'],
            ['Safe margin', 'Text and logos are comfortably inside trim'],
            ['Export', 'PDF setting matches printer instructions']
          ]
        }
      }
    ],
    related: [
      { href: '/bleed-safe-zone-calculator/', label: 'Bleed & Safe Zone Calculator' },
      { href: '/templates/print-ready-pdf-checklist/', label: 'Print-Ready PDF Checklist' },
      { href: '/image-print-quality-checker/', label: 'Image Print Quality Checker' }
    ],
    sourceNote: 'Canva interface labels and export options can change. Use the live Canva export dialog and printer instructions as the final source.'
  },
  {
    path: '/guides/etsy-printable-wall-art-sizes/',
    title: 'Etsy Printable Wall Art Sizes',
    description: 'Plan Etsy printable wall art files by ratio pack, frame size, pixel export target, and buyer printing instructions.',
    updated: '2026-06-06',
    kind: 'guide',
    intro: 'A strong Etsy printable wall art listing usually includes multiple ratio files so buyers can print common frame sizes without awkward cropping. The file names and instructions should make the correct choice obvious.',
    sections: [
      {
        heading: 'Common ratio pack structure',
        body: [
          'Instead of selling one image file, many sellers provide a pack such as 2:3, 3:4, 4:5, 5:7, 11:14, ISO A, and square. Each ratio file can scale down to several smaller frames that share the same shape.',
          'Export the largest practical version for each ratio. A buyer printing a smaller size can scale down cleanly, while a buyer trying to print larger than the file supports may see blur or artifacts.'
        ],
        table: {
          caption: 'Printable wall art ratio examples',
          headers: ['Ratio', 'Frame examples', 'Typical note'],
          rows: [
            ['2:3', '4×6, 8×12, 12×18, 20×30', 'Common photo and poster ratio'],
            ['3:4', '6×8, 9×12, 12×16, 18×24', 'Popular wall-art ratio'],
            ['4:5', '8×10, 12×15, 16×20', 'Common US frame ratio'],
            ['5:7', '5×7, 10×14', 'Gift and small-frame ratio'],
            ['ISO A', 'A5, A4, A3, A2', 'International paper sizes']
          ]
        }
      },
      {
        heading: 'Buyer clarity matters',
        body: [
          'Etsy buyers may not understand ratio language. Include a simple instruction file that lists frame sizes under each file name and tells the buyer to print at 100% scale or select the matching frame ratio at a print shop.',
          'Do not promise exact color matching. Monitor calibration, paper, ink, and print shop settings can all change color and contrast.'
        ],
        bullets: ['Name files by ratio and maximum size.', 'Include a buyer instruction PDF or text file.', 'State that no physical product is shipped for digital listings.', 'Mention that colors can vary by device and printer.']
      }
    ],
    related: [
      { href: '/etsy-printable-size-calculator/', label: 'Etsy Printable Size Pack Calculator' },
      { href: '/guides/etsy-printable-ratio-guide/', label: 'Etsy Printable Ratio Guide' },
      { href: '/templates/etsy-buyer-instruction-template/', label: 'Etsy Buyer Instruction Template' }
    ],
    sourceNote: 'Frame availability varies by market and seller. Use the ratio pack as a planning aid and disclose exactly what files are included.'
  },
  {
    path: '/guides/etsy-printable-ratio-guide/',
    title: 'Etsy Printable Ratio Guide',
    description: 'Understand 2:3, 3:4, 4:5, 5:7, 11:14, ISO, and square printable ratios for Etsy wall art downloads.',
    updated: '2026-06-06',
    kind: 'guide',
    intro: 'Printable ratio files solve a buyer problem: one artwork design may need different crops to fit different frame shapes. A ratio tells the relationship between width and height, not a fixed physical size.',
    sections: [
      {
        heading: 'How ratios map to frames',
        body: [
          'A 2:3 file can print at 8×12 or 20×30 because both sizes share the same shape. A 4:5 file can print at 8×10 or 16×20. If the buyer sends a 2:3 file to an 8×10 frame, the print must crop or add borders.',
          'Create separate crops for ratios where important artwork would otherwise be lost. Do not simply stretch one file into several ratios.'
        ],
        table: {
          caption: 'Ratio quick reference',
          headers: ['Ratio', 'Equivalent shape', 'Frame examples'],
          rows: [
            ['2:3', '1.5', '4×6, 8×12, 12×18, 20×30'],
            ['3:4', '1.333', '6×8, 9×12, 12×16, 18×24'],
            ['4:5', '1.25', '8×10, 12×15, 16×20'],
            ['5:7', '1.4', '5×7, 10×14'],
            ['11:14', '1.273', '11×14, 22×28'],
            ['Square', '1.0', '8×8, 12×12, 20×20']
          ]
        }
      },
      {
        heading: 'Export strategy',
        body: [
          'For each ratio, create the largest file you intend to support at the chosen PPI. For example, a 20×30 inch 2:3 file at 300 PPI is 6000 × 9000 pixels. A 16×20 inch 4:5 file at 300 PPI is 4800 × 6000 pixels.',
          'If file sizes become too large for marketplace delivery, provide a PDF with download instructions or use a file hosting workflow allowed by the marketplace. Keep product descriptions precise so buyers understand what they receive.'
        ]
      }
    ],
    related: [
      { href: '/etsy-printable-size-calculator/', label: 'Etsy Printable Size Pack Calculator' },
      { href: '/guides/etsy-printable-wall-art-sizes/', label: 'Etsy Printable Wall Art Sizes' },
      { href: '/print-size-calculator/', label: 'Print Size Calculator' }
    ],
    sourceNote: 'Ratio examples are common seller conventions, not official Etsy requirements. Seller listings should state exact included files.'
  },
  {
    path: '/templates/etsy-buyer-instruction-template/',
    title: 'Etsy Buyer Instruction Template',
    description: 'Copy a clear Etsy digital printable buyer instruction template with ratio notes, printing steps, color caveats, and usage terms.',
    updated: '2026-06-06',
    kind: 'template',
    intro: 'Use this template as a starting point for a digital printable listing. Replace bracketed text, remove anything that does not apply, and keep the promise aligned with the files you actually deliver.',
    sections: [
      {
        heading: 'Copyable buyer instruction',
        body: [
          'Thank you for your purchase. This is a digital download; no physical item will be shipped. Download the file that matches your frame ratio, then print at home, through a local print shop, or through an online print service.',
          'Included files: [list ratios and sizes]. For best results, print at 100% scale on [recommended paper]. Colors may vary because monitors, paper, ink, and printer profiles differ. This file is for [personal use / your license terms].'
        ]
      },
      {
        heading: 'Add a ratio table',
        body: [
          'A ratio table prevents avoidable buyer confusion. Put the file name in the first column and the compatible frame sizes in the second column. If you include ISO sizes, keep them separate from US frame ratios.',
          'Do not ask buyers to crop unless your listing clearly says cropping may be required. The stronger approach is to include separate ratio files where the important artwork is already composed correctly.'
        ],
        table: {
          caption: 'Instruction table example',
          headers: ['File name', 'Fits these examples'],
          rows: [
            ['2x3-ratio.jpg', '4×6, 8×12, 12×18, 20×30'],
            ['3x4-ratio.jpg', '6×8, 9×12, 12×16, 18×24'],
            ['4x5-ratio.jpg', '8×10, 12×15, 16×20'],
            ['ISO-A-file.jpg', 'A5, A4, A3, A2']
          ]
        }
      }
    ],
    related: [
      { href: '/etsy-printable-size-calculator/', label: 'Etsy Printable Size Pack Calculator' },
      { href: '/guides/etsy-printable-wall-art-sizes/', label: 'Etsy Printable Wall Art Sizes' },
      { href: '/guides/etsy-printable-ratio-guide/', label: 'Etsy Printable Ratio Guide' }
    ],
    sourceNote: 'This is a communication template, not legal advice. Match the license text to the product and marketplace policy.'
  },
  {
    path: '/templates/kdp-cover-setup-checklist/',
    title: 'KDP Cover Setup Checklist',
    description: 'Use a KDP paperback cover setup checklist for trim size, page count, spine width, bleed, barcode space, and PDF export.',
    updated: '2026-06-06',
    kind: 'template',
    intro: 'Complete this checklist before exporting a paperback cover PDF for KDP. The cover should be one continuous spread: back cover, spine, and front cover, with bleed added on the outside edges.',
    sections: [
      {
        heading: 'Pre-design numbers',
        body: [
          'Record the trim size, final page count, interior type, paper type, and bleed value before building the canvas. If any of those inputs change, recalculate the full cover size and spine width before exporting.',
          'Spine text is not always allowed. If the page count is too low for a readable spine, leave the spine blank or use the official KDP guidance and previewer as the final decision point.'
        ],
        bullets: ['Trim size confirmed.', 'Final page count confirmed.', 'Paper and interior option confirmed.', 'Spine width calculated.', 'Full cover width and height calculated.']
      },
      {
        heading: 'Layout and export checks',
        body: [
          'Keep important text inside the safe area and keep the barcode region clear unless you are supplying your own barcode according to KDP rules. Extend background artwork through the bleed so trimming does not create white edges.',
          'Export a print PDF with fonts handled correctly and transparent guide layers removed or hidden. Upload the PDF to KDP and inspect the Previewer before approving.'
        ],
        table: {
          caption: 'KDP cover handoff checklist',
          headers: ['Check', 'Pass condition'],
          rows: [
            ['Canvas', 'One-piece back-spine-front cover file'],
            ['Bleed', 'Background reaches full bleed edges'],
            ['Spine', 'Width matches final page count and paper type'],
            ['Barcode', 'Clear region remains on back cover'],
            ['PDF', 'Guide layers removed and previewer inspected']
          ]
        }
      }
    ],
    related: [
      { href: '/', label: 'KDP Cover Calculator' },
      { href: '/guides/kdp-paperback-cover-size-formula/', label: 'KDP Cover Formula' },
      { href: '/guides/kdp-paperback-cover-rejection-checklist/', label: 'KDP Rejection Checklist' }
    ],
    sourceNote: 'KDP requirements can change by marketplace, trim, paper, and product type. Use the official KDP calculator and Previewer before publishing.'
  },
  {
    path: '/templates/print-ready-pdf-checklist/',
    title: 'Print-Ready PDF Checklist',
    description: 'Check print-ready PDF page size, bleed, safe margins, embedded fonts, image resolution, color settings, and proofing steps.',
    updated: '2026-06-06',
    kind: 'template',
    intro: 'Use this checklist before sending a PDF to a printer, client, or marketplace upload flow. It focuses on measurable production issues that commonly cause rejections or poor print output.',
    sections: [
      {
        heading: 'File setup checks',
        body: [
          'Confirm that the PDF page size matches the requested trim or full bleed size. If the job requires bleed, artwork should extend to the bleed edge on every side that prints to the edge. Important content should remain inside the safe margin.',
          'Check placed images at their final displayed size, not only their original pixel dimensions. A large image scaled up in the layout may have low effective PPI even if the source file looked large.'
        ],
        bullets: ['Correct page size.', 'Required bleed included.', 'Safe margin respected.', 'Images meet effective PPI target.', 'No accidental crop or white border.']
      },
      {
        heading: 'Export and proof checks',
        body: [
          'Embed or outline fonts according to the printer requirement. Remove hidden guide layers, comments, and unused objects when appropriate. Use the color profile requested by the printer rather than guessing.',
          'Open the exported PDF in a separate viewer before delivery. Inspect the first page, last page, edges, fine text, QR codes, and any page with full-bleed artwork.'
        ],
        table: {
          caption: 'PDF preflight checklist',
          headers: ['Area', 'What to confirm'],
          rows: [
            ['Fonts', 'Embedded, outlined, or otherwise accepted by the printer'],
            ['Images', 'Effective PPI is suitable for the product'],
            ['Color', 'Profile and mode match printer instructions'],
            ['Marks', 'Crop marks included only when requested'],
            ['Proof', 'Exported PDF inspected outside the design app']
          ]
        }
      }
    ],
    related: [
      { href: '/bleed-safe-zone-calculator/', label: 'Bleed & Safe Zone Calculator' },
      { href: '/image-print-quality-checker/', label: 'Image Print Quality Checker' },
      { href: '/common-print-sizes/', label: 'Common Print Sizes Library' }
    ],
    sourceNote: 'This checklist does not replace a printer preflight system. Vendor specifications and proofing results are the final production authority.'
  }
];

export const staticPageByPath = (path: string) => staticPages.find((page) => page.path === path);

export const staticPageLastModified = Object.fromEntries(staticPages.map((page) => [page.path, page.updated]));
