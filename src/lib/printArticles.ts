import type { RouteTuple } from '@/src/lib/content';

export type PrintArticleSection = {
  heading: string;
  body: string[];
  bullets?: string[];
  table?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  };
};

export type PrintArticle = {
  path: string;
  title: string;
  description: string;
  updated: string;
  category: string;
  primaryCta: { href: string; label: string };
  sections: PrintArticleSection[];
  faq: { question: string; answer: string }[];
  related: { href: string; label: string }[];
  sources: { label: string; href: string }[];
};

export const printArticles: PrintArticle[] = [
  {
    "path": "/guides/kdp-paperback-cover-size-formula/",
    "title": "KDP paperback cover size formula",
    "description": "Use the KDP paperback cover formula to calculate full cover width, cover height, spine width, bleed, and trim spread before designing your cover.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Open the KDP cover calculator"
    },
    "sections": [
      {
        "heading": "The formula KDP expects you to understand",
        "body": [
          "A paperback cover is one continuous PDF file that includes the back cover, spine, and front cover. The file also includes bleed on the outside edges so printed artwork can be trimmed without leaving a white border.",
          "Use this structure: cover width equals bleed + back cover width + spine width + front cover width + bleed. Cover height equals bleed + trim height + bleed. The calculator shows both cover file size including bleed and trim spread before bleed."
        ],
        "bullets": [
          "Back cover width = selected trim width.",
          "Front cover width = selected trim width.",
          "Spine width = page count multiplied by the KDP paperback paper multiplier.",
          "Full cover width = trim width × 2 + spine width + bleed × 2.",
          "Full cover height = trim height + bleed × 2."
        ]
      },
      {
        "heading": "Official spine multipliers used by the calculator",
        "body": [
          "The calculator now uses Amazon KDP paperback spine multipliers in inches per page. Recalculate when you change final page count, interior type, or paper option."
        ],
        "table": {
          "caption": "KDP paperback spine multipliers",
          "headers": [
            "Interior / paper option",
            "Multiplier",
            "120-page spine"
          ],
          "rows": [
            [
              "Black & white · white paper",
              "page count × 0.002252 in",
              "0.270 in"
            ],
            [
              "Black & white · cream paper",
              "page count × 0.0025 in",
              "0.300 in"
            ],
            [
              "Standard color",
              "page count × 0.002252 in",
              "0.270 in"
            ],
            [
              "Premium color",
              "page count × 0.002347 in",
              "0.282 in"
            ]
          ]
        }
      },
      {
        "heading": "Worked example: 6 × 9, 120 pages, white paper",
        "body": [
          "For a 6 × 9 in black-and-white paperback on white paper with 120 pages and 0.125 in bleed, spine width is 120 × 0.002252 = 0.270 in. Cover width is 0.125 + 6 + 0.270 + 6 + 0.125 = 12.520 in. Cover height is 0.125 + 9 + 0.125 = 9.25 in."
        ],
        "table": {
          "caption": "Example result",
          "headers": [
            "Measurement",
            "Value"
          ],
          "rows": [
            [
              "Trim spread before bleed",
              "12.270 × 9 in"
            ],
            [
              "Cover file including bleed",
              "12.520 × 9.25 in"
            ],
            [
              "300 PPI canvas",
              "3756 × 2775 px"
            ]
          ]
        }
      },
      {
        "heading": "Use the official KDP previewer as the final check",
        "body": [
          "This site is an independent planning calculator for setting up a design canvas before using Photoshop, Affinity, Canva, Figma, or InDesign. Always compare the final upload with the official KDP calculator, template, and Previewer before publishing."
        ]
      }
    ],
    "faq": [
      {
        "question": "Does the KDP cover width include bleed?",
        "answer": "Yes. The full cover file width includes bleed on the outside left and right edges. The trim spread does not include that bleed."
      },
      {
        "question": "Is the spine included in front cover size?",
        "answer": "No. The spine is a separate center strip between the back cover and front cover."
      },
      {
        "question": "Which spine multipliers does this calculator use?",
        "answer": "It uses KDP paperback multipliers: 0.002252 for black-and-white white paper and standard color, 0.0025 for black-and-white cream paper, and 0.002347 for premium color."
      }
    ],
    "related": [
      {
        "href": "/guides/kdp-cover-size-with-bleed/",
        "label": "KDP cover size with bleed"
      },
      {
        "href": "/guides/kdp-spine-width-calculator/",
        "label": "KDP spine width calculator guide"
      },
      {
        "href": "/templates/kdp-cover-setup-checklist/",
        "label": "KDP cover setup checklist"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      },
      {
        "label": "Amazon KDP cover calculator",
        "href": "https://kdp.amazon.com/cover-calculator"
      }
    ]
  },
  {
    "path": "/guides/kdp-cover-size-with-bleed/",
    "title": "KDP cover size with bleed",
    "description": "Learn how KDP cover bleed changes paperback cover width and height, and why 0.125 in bleed must be added outside the trim area.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Calculate cover size with bleed"
    },
    "sections": [
      {
        "heading": "What bleed means for a KDP cover",
        "body": [
          "Bleed is extra artwork outside the final trim. A physical cover is trimmed after printing, and a small trim shift can reveal a white edge if backgrounds stop exactly at the trim line.",
          "For a paperback cover, include bleed on the outside edges of the full cover file. The calculator adds bleed to the left and right sides of the full spread and to the top and bottom of the cover height."
        ],
        "bullets": [
          "Add bleed to the full cover file, not to only the front cover.",
          "Extend backgrounds through the bleed.",
          "Keep important text, logos, and faces inside the safe region.",
          "Do not use the barcode area for important back-cover content."
        ]
      },
      {
        "heading": "Worked example with current spine multipliers",
        "body": [
          "For a 6 × 9 paperback, black-and-white interior, white paper, 120 pages, and 0.125 in bleed, the spine is 0.270 in. The full file width becomes 12.520 in; the trim spread before bleed is 12.270 in."
        ],
        "table": {
          "caption": "6 × 9 paperback with bleed",
          "headers": [
            "Item",
            "Value"
          ],
          "rows": [
            [
              "Trim spread before bleed",
              "12.270 × 9 in"
            ],
            [
              "Cover file including bleed",
              "12.520 × 9.25 in"
            ],
            [
              "300 PPI canvas",
              "3756 × 2775 px"
            ]
          ]
        }
      },
      {
        "heading": "Practical design rule",
        "body": [
          "Calculate the full cover file first, create that exact canvas size, then turn on guides for bleed, trim, spine, and barcode safe zone. Do not resize the finished artwork by eye after export."
        ]
      }
    ],
    "faq": [
      {
        "question": "How much bleed should I use for a KDP paperback cover?",
        "answer": "For planning, use 0.125 in bleed on the outside edges, then verify the file in KDP Previewer."
      },
      {
        "question": "Does bleed change the spine width?",
        "answer": "No. Bleed changes the outer file size; spine width is based on page count and paper type."
      },
      {
        "question": "Should the background extend into bleed?",
        "answer": "Yes. Backgrounds that reach the edge of the cover should extend through the bleed area."
      }
    ],
    "related": [
      {
        "href": "/guides/kdp-paperback-cover-size-formula/",
        "label": "KDP cover size formula"
      },
      {
        "href": "/guides/kdp-cover-pixel-size-300-dpi/",
        "label": "KDP cover pixel size at 300 PPI"
      },
      {
        "href": "/bleed-safe-zone-calculator/",
        "label": "Bleed and safe zone calculator"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      },
      {
        "label": "Amazon KDP cover calculator",
        "href": "https://kdp.amazon.com/cover-calculator"
      }
    ]
  },
  {
    "path": "/guides/kdp-cover-pixel-size-300-dpi/",
    "title": "KDP cover pixel size at 300 PPI",
    "description": "Convert KDP cover dimensions in inches into pixel canvas size for 300 PPI print artwork.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Calculate pixel canvas"
    },
    "sections": [
      {
        "heading": "Pixel size is a canvas conversion, not a separate trim size",
        "body": [
          "After calculating the full cover size in inches, convert it to pixels by multiplying width and height by the PPI you plan to use. At 300 PPI, a 12.520 × 9.25 in cover file becomes 3756 × 2775 px for a 6 × 9 in, 120-page, black-and-white paperback on white paper.",
          "Calculate the full cover file size first. Do not multiply only the front cover trim size, because that ignores the back cover, spine, and bleed."
        ],
        "bullets": [
          "Pixel width = full cover width in inches × PPI.",
          "Pixel height = full cover height in inches × PPI.",
          "Use the same canvas size in your design tool before exporting the final cover PDF."
        ]
      },
      {
        "heading": "Example pixel canvases for 6 × 9 paperbacks",
        "body": [
          "These examples assume 0.125 in bleed and 300 PPI. The width changes because spine width changes; the height stays 9.25 in for a 6 × 9 trim with bleed."
        ],
        "table": {
          "caption": "6 × 9 cover canvas examples at 300 PPI",
          "headers": [
            "Setup",
            "Cover size",
            "Pixel canvas"
          ],
          "rows": [
            [
              "120 pages · B&W white",
              "12.520 × 9.25 in",
              "3756 × 2775 px"
            ],
            [
              "200 pages · B&W white",
              "12.700 × 9.25 in",
              "3810 × 2775 px"
            ],
            [
              "200 pages · B&W cream",
              "12.750 × 9.25 in",
              "3825 × 2775 px"
            ],
            [
              "120 pages · premium color",
              "12.532 × 9.25 in",
              "3760 × 2775 px"
            ]
          ]
        }
      },
      {
        "heading": "When 300 PPI matters",
        "body": [
          "300 PPI is a common print planning target because it keeps text edges, line art, and cover images sharper than a low-resolution canvas. The calculator lets you change PPI, but for final print artwork, 300 PPI is the safer default unless your workflow specifies another target."
        ]
      }
    ],
    "faq": [
      {
        "question": "How do I calculate KDP cover pixels?",
        "answer": "First calculate the full cover file size including bleed, then multiply width and height by the selected PPI."
      },
      {
        "question": "Is 1800 × 2700 px enough for a 6 × 9 KDP cover?",
        "answer": "No. That only describes a 6 × 9 front cover at 300 PPI. A full paperback cover also needs back cover, spine, and bleed."
      },
      {
        "question": "Can I use 150 PPI?",
        "answer": "You can preview at lower PPI, but for final print planning the safer default is 300 PPI unless your printer or workflow gives another requirement."
      }
    ],
    "related": [
      {
        "href": "/dpi-calculator/",
        "label": "DPI / PPI calculator"
      },
      {
        "href": "/print-size-calculator/",
        "label": "Image print size calculator"
      },
      {
        "href": "/guides/kdp-cover-size-with-bleed/",
        "label": "KDP cover size with bleed"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      },
      {
        "label": "Amazon KDP cover calculator",
        "href": "https://kdp.amazon.com/cover-calculator"
      }
    ]
  },
  {
    "path": "/guides/kdp-barcode-safe-zone/",
    "title": "KDP barcode safe zone for paperback covers",
    "description": "Plan the barcode area on a KDP paperback back cover and avoid placing important cover text or artwork where the barcode may appear.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Show barcode safe zone"
    },
    "sections": [
      {
        "heading": "Why the back cover needs a barcode area",
        "body": [
          "KDP can place a barcode on the back cover if you do not provide your own. Keep the lower back-cover area free of important text, logos, faces, and design elements that would be damaged by an automatically placed barcode.",
          "The calculator marks a planning barcode safe zone so you can see where to avoid important artwork. Treat it as a practical design guide, then verify final placement in KDP Previewer."
        ],
        "bullets": [
          "Keep the barcode area visually quiet.",
          "Do not place review quotes, author bios, logos, or essential art inside it.",
          "Check the official preview after upload."
        ]
      },
      {
        "heading": "Amazon-placed barcode versus your own barcode",
        "body": [
          "If you upload a print-ready PDF without a barcode, KDP can place one on the back cover. If you provide your own barcode, it must remain clear, scannable, correctly positioned, and away from spine and trim edges."
        ],
        "table": {
          "caption": "Barcode planning checks",
          "headers": [
            "Choice",
            "What to reserve",
            "Risk"
          ],
          "rows": [
            [
              "Amazon-placed barcode",
              "Clear back-cover area where KDP can place it",
              "Text or images in that location can be rejected"
            ],
            [
              "Your own barcode",
              "Suggested 2 × 1.2 in area with required spacing",
              "Unreadable, colored, blurry, or misplaced barcodes can fail validation"
            ]
          ]
        }
      },
      {
        "heading": "Where it appears on a full cover spread",
        "body": [
          "For left-to-right books, the back cover is on the left side of the full spread, the spine is in the center, and the front cover is on the right. For right-to-left books, preview order changes, and KDP places the front cover on the left of the spine."
        ]
      }
    ],
    "faq": [
      {
        "question": "Will KDP always place a barcode?",
        "answer": "If you do not provide your own barcode, KDP can automatically place one on the back cover."
      },
      {
        "question": "Can I put text under the barcode?",
        "answer": "Avoid it. KDP says covers with images or text in the barcode location can be rejected when Amazon places the barcode."
      },
      {
        "question": "What size should my own barcode be?",
        "answer": "KDP lists a suggested size of 2 × 1.2 in and a minimum size of 1.4 × 0.8 in, with required spacing from spine and trim."
      }
    ],
    "related": [
      {
        "href": "/",
        "label": "KDP cover calculator"
      },
      {
        "href": "/guides/kdp-cover-size-with-bleed/",
        "label": "KDP cover bleed guide"
      },
      {
        "href": "/templates/kdp-cover-setup-checklist/",
        "label": "KDP cover checklist"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP barcode requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G5HDYGP4BXLX4RUW"
      },
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      }
    ]
  },
  {
    "path": "/guides/kdp-trim-size-page-count/",
    "title": "KDP trim size and page count guide",
    "description": "Choose a KDP paperback trim size and understand how page count, paper type, and trim size affect cover setup.",
    "updated": "2026-05-30",
    "category": "KDP print options",
    "primaryCta": {
      "href": "/",
      "label": "Calculate from trim size and pages"
    },
    "sections": [
      {
        "heading": "Trim size is the final cut size of the book",
        "body": [
          "Trim size is the width and height of the finished book after printing and cutting. KDP supports common paperback sizes such as 5 × 8, 5.5 × 8.5, 6 × 9, 7 × 10, 8 × 10, and 8.5 × 11, with availability affected by print options.",
          "Pick trim before creating the cover. A later trim change forces you to recalculate cover width, cover height, spine position, barcode position, and pixel canvas."
        ],
        "bullets": [
          "Choose trim size before designing the cover.",
          "Check page-count limits for the selected paper and ink option.",
          "Recalculate the spine after the formatted manuscript page count is final."
        ]
      },
      {
        "heading": "Page count changes the spine",
        "body": [
          "Two books can share the same trim size but require different cover widths because spine width depends on page count and paper option. If the manuscript changes from 120 pages to 200 pages, export a new cover file with updated spine width."
        ],
        "table": {
          "caption": "6 × 9 example changes",
          "headers": [
            "Page count / paper",
            "Spine",
            "Cover width"
          ],
          "rows": [
            [
              "120 pages · B&W white",
              "0.270 in",
              "12.520 in"
            ],
            [
              "200 pages · B&W white",
              "0.450 in",
              "12.700 in"
            ],
            [
              "200 pages · B&W cream",
              "0.500 in",
              "12.750 in"
            ]
          ]
        }
      },
      {
        "heading": "Common starting points",
        "body": [
          "Use 5.5 × 8.5 or 6 × 9 for many novels and nonfiction books, 7 × 10 for manuals and study guides, and 8.5 × 11 for larger workbooks. These are practical planning defaults, not universal rules."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is the default KDP trim size?",
        "answer": "KDP commonly uses 6 × 9 in as a default paperback starting point, but you should select the trim that fits your book format."
      },
      {
        "question": "Does page count affect cover size?",
        "answer": "Yes. Page count changes spine width, which changes the full cover width."
      },
      {
        "question": "Can I use a custom trim size?",
        "answer": "KDP supports custom sizes within its allowed ranges, but you should verify availability before designing."
      }
    ],
    "related": [
      {
        "href": "/guides/kdp-6x9-cover-size/",
        "label": "KDP 6×9 cover size"
      },
      {
        "href": "/guides/kdp-spine-width-calculator/",
        "label": "KDP spine width guide"
      },
      {
        "href": "/",
        "label": "KDP cover calculator"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP print options",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201834180"
      },
      {
        "label": "Amazon KDP cover calculator",
        "href": "https://kdp.amazon.com/cover-calculator"
      }
    ]
  },
  {
    "path": "/guides/kdp-cover-template-guide/",
    "title": "KDP cover template guide",
    "description": "Use a KDP cover template or SVG/PNG guide layer to set up paperback bleed, trim, spine, barcode area, and safe zones.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Download an SVG or PNG guide"
    },
    "sections": [
      {
        "heading": "What a cover template should show",
        "body": [
          "A useful paperback cover template shows the full file size, trim boundaries, spine area, bleed, and barcode planning area. KDP also provides downloadable cover templates from its official cover calculator.",
          "This site generates lightweight SVG and PNG guide layers for planning. Use them as a design reference, then verify against the official KDP template and upload preview before publishing."
        ],
        "bullets": [
          "Full cover file size including bleed.",
          "Back cover, spine, and front cover areas.",
          "Trim line and bleed line.",
          "Barcode planning area.",
          "Canvas pixel size for the selected PPI."
        ]
      },
      {
        "heading": "Production workflow checklist",
        "body": [
          "Use the generated guide as a setup layer, not as finished artwork. The working file should be created at the calculated full cover size, then exported as a single PDF after guide layers are hidden or removed."
        ],
        "table": {
          "caption": "Template setup sequence",
          "headers": [
            "Step",
            "What to verify"
          ],
          "rows": [
            [
              "1. Calculate dimensions",
              "Trim, page count, paper type, bleed, and spine"
            ],
            [
              "2. Create canvas",
              "Full cover size including bleed"
            ],
            [
              "3. Add guide layer",
              "Back, spine, front, trim, bleed, safe zone, barcode"
            ],
            [
              "4. Export final PDF",
              "One continuous cover without visible guide lines"
            ]
          ]
        }
      },
      {
        "heading": "Do not design from a screenshot",
        "body": [
          "A browser preview explains the layout, but a screenshot of the preview is not a production file. Use the calculated dimensions and guide downloads to create your actual cover canvas."
        ]
      }
    ],
    "faq": [
      {
        "question": "Can I use this site instead of the official KDP template?",
        "answer": "Use this site for fast planning and guide layers, but use KDP Previewer and official templates as the final check."
      },
      {
        "question": "What should be in a KDP cover template?",
        "answer": "At minimum: full file size, bleed, trim line, spine, front cover, back cover, and barcode planning area."
      },
      {
        "question": "Is the PNG guide my final cover?",
        "answer": "No. It is only a guide layer. Design and export your final cover separately."
      }
    ],
    "related": [
      {
        "href": "/",
        "label": "KDP cover calculator"
      },
      {
        "href": "/templates/kdp-cover-setup-checklist/",
        "label": "KDP cover setup checklist"
      },
      {
        "href": "/guides/kdp-paperback-cover-rejection-checklist/",
        "label": "KDP cover rejection checklist"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      },
      {
        "label": "Amazon KDP cover calculator",
        "href": "https://kdp.amazon.com/cover-calculator"
      }
    ]
  },
  {
    "path": "/guides/kdp-6x9-cover-size/",
    "title": "KDP 6×9 cover size guide",
    "description": "Calculate a 6×9 KDP paperback cover size with spine width, bleed, trim spread, pixel canvas, and barcode safe zone.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Load the 6×9 paperback calculator"
    },
    "sections": [
      {
        "heading": "Why 6 × 9 is a common paperback size",
        "body": [
          "6 × 9 in is a common U.S. paperback trim size and a practical default for many nonfiction, business, memoir, and general paperback projects. A 6 × 9 cover file is not simply 6 × 9; the full cover includes back cover, spine, front cover, and bleed."
        ]
      },
      {
        "heading": "Example setup",
        "body": [
          "For a 6 × 9 in paperback with black-and-white interior, white paper, 120 pages, and 0.125 in bleed, calculate the spine width first, then add back cover, spine, front cover, and bleed. Use the preset in the calculator, then adjust page count to match your final formatted manuscript."
        ],
        "bullets": [
          "Trim size: 6 × 9 in.",
          "Bleed: 0.125 in outside the trim.",
          "Full file width: back cover + spine + front cover + left/right bleed.",
          "Full file height: 9 in trim height + top/bottom bleed."
        ]
      },
      {
        "heading": "6 × 9 worked sizes",
        "body": [
          "These rows show how the same trim size changes when page count and paper choice change. Use them as quick checks, then run the calculator with your exact final page count."
        ],
        "table": {
          "caption": "Common 6 × 9 KDP cover sizes with 0.125 in bleed",
          "headers": [
            "Setup",
            "Spine",
            "Full cover size"
          ],
          "rows": [
            [
              "120 pages · B&W white",
              "0.270 in",
              "12.520 × 9.25 in"
            ],
            [
              "200 pages · B&W white",
              "0.450 in",
              "12.700 × 9.25 in"
            ],
            [
              "200 pages · B&W cream",
              "0.500 in",
              "12.750 × 9.25 in"
            ],
            [
              "300 pages · B&W white",
              "0.676 in",
              "12.926 × 9.25 in"
            ]
          ]
        }
      },
      {
        "heading": "When to recalculate",
        "body": [
          "Recalculate whenever page count, interior type, paper type, trim size, or bleed changes. A cover made for a 120-page book may not fit a 180-page book because the spine gets wider."
        ]
      }
    ],
    "faq": [
      {
        "question": "Is 6 × 9 the full KDP cover size?",
        "answer": "No. 6 × 9 is the trim size of one page or front cover. The full cover includes back cover, spine, front cover, and bleed."
      },
      {
        "question": "Why did my 6 × 9 cover width change?",
        "answer": "The width changes when page count or paper type changes because the spine width changes."
      },
      {
        "question": "Can I use the same cover for paperback and hardcover?",
        "answer": "No. Paperback and hardcover cover geometry differ. Use the correct format and official previewer."
      }
    ],
    "related": [
      {
        "href": "/guides/kdp-paperback-cover-size-formula/",
        "label": "KDP cover formula"
      },
      {
        "href": "/guides/kdp-trim-size-page-count/",
        "label": "KDP trim size and page count"
      },
      {
        "href": "/",
        "label": "KDP cover calculator"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP print options",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201834180"
      },
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      }
    ]
  },
  {
    "path": "/guides/kdp-spine-width-calculator/",
    "title": "KDP spine width calculator guide",
    "description": "Understand how KDP paperback spine width depends on page count, paper type, and interior format before designing the cover.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Calculate spine width"
    },
    "sections": [
      {
        "heading": "The spine is controlled by page count and paper choice",
        "body": [
          "The spine sits between the back cover and front cover. It gets wider as page count increases, and it varies by paper option. Do not place final spine text until your formatted manuscript page count is close to final.",
          "The calculator estimates spine width from page count and the KDP paperback multiplier for the selected paper setting, then uses it to build the full cover file size."
        ]
      },
      {
        "heading": "KDP multiplier table and examples",
        "body": [
          "Use the multiplier that matches your interior and paper choice. For standard color, KDP lists the same multiplier as black-and-white white paper; for premium color, use the premium color multiplier."
        ],
        "table": {
          "caption": "Paperback spine width examples",
          "headers": [
            "Setup",
            "Formula",
            "Result"
          ],
          "rows": [
            [
              "120 pages · B&W white",
              "120 × 0.002252",
              "0.270 in"
            ],
            [
              "120 pages · B&W cream",
              "120 × 0.0025",
              "0.300 in"
            ],
            [
              "200 pages · standard color",
              "200 × 0.002252",
              "0.450 in"
            ],
            [
              "200 pages · premium color",
              "200 × 0.002347",
              "0.469 in"
            ]
          ]
        }
      },
      {
        "heading": "Why small page-count changes matter",
        "body": [
          "A few pages may not look significant in the manuscript, but cover files are measured precisely. If a designer centers spine text on an old width and the manuscript later changes, the spine label can shift off center after upload."
        ],
        "bullets": [
          "Finalize the formatted manuscript before final cover export.",
          "Recalculate after changing paper type or interior color option.",
          "Keep spine text inside the spine safe area.",
          "Verify final alignment in KDP Previewer."
        ]
      },
      {
        "heading": "Do not confuse spine width with book thickness",
        "body": [
          "Spine width is the design measurement used in the cover file. Physical book thickness can vary slightly in manufacturing, but the cover file still needs to follow the upload template and preview requirements."
        ]
      }
    ],
    "faq": [
      {
        "question": "What inputs do I need for spine width?",
        "answer": "You need page count, interior type, and paper type. Trim size affects the rest of the cover, but spine width mainly depends on page count and paper option."
      },
      {
        "question": "When should I calculate spine width?",
        "answer": "After the manuscript is formatted and the page count is close to final."
      },
      {
        "question": "Does bleed change spine width?",
        "answer": "No. Bleed changes the outside file size. Spine width comes from page count and paper choice."
      }
    ],
    "related": [
      {
        "href": "/guides/kdp-paperback-cover-size-formula/",
        "label": "KDP cover formula"
      },
      {
        "href": "/guides/kdp-trim-size-page-count/",
        "label": "KDP trim size and page count"
      },
      {
        "href": "/",
        "label": "KDP cover calculator"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      },
      {
        "label": "Amazon KDP cover calculator",
        "href": "https://kdp.amazon.com/cover-calculator"
      }
    ]
  },
  {
    "path": "/guides/kdp-paperback-cover-rejection-checklist/",
    "title": "KDP paperback cover rejection checklist",
    "description": "Use this KDP paperback cover rejection checklist before upload: full-spread PDF size, bleed, spine text, barcode area, image resolution, fonts, layers, and color setup.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Check the cover dimensions first"
    },
    "sections": [
      {
        "heading": "Run these checks before uploading the cover PDF",
        "body": [
          "Most cover rejections come from a mismatch between the file you export and the print setup selected in KDP. Check the physical canvas size first, then inspect the design details that can fail during preview or review."
        ],
        "table": {
          "caption": "High-risk cover checks",
          "headers": [
            "Area",
            "What to check",
            "Why it matters"
          ],
          "rows": [
            [
              "Cover size",
              "Full spread includes back cover, spine, front cover, and bleed",
              "A front-cover-only image will not fit a paperback wrap"
            ],
            [
              "Bleed",
              "Backgrounds extend through 0.125 in bleed where artwork reaches the edge",
              "Stops white borders after trim"
            ],
            [
              "Spine text",
              "No spine text under 79 pages; text stays inside the spine safe area",
              "Small spines and shifted text can trigger rejection"
            ],
            [
              "Barcode area",
              "Back-cover barcode area is empty or your barcode meets KDP formatting rules",
              "Text or images in barcode location can be rejected"
            ],
            [
              "PDF export",
              "One PDF, fonts embedded, transparencies flattened, template text removed",
              "Prevents conversion and print errors"
            ],
            [
              "Images",
              "Cover image quality is planned around 300 DPI at final print size",
              "Avoids low-resolution or pixelated artwork"
            ]
          ]
        }
      },
      {
        "heading": "Worked example: 6 × 9 paperback, 120 pages",
        "body": [
          "For a 6 × 9 in black-and-white paperback on white paper with 120 pages, the spine is 120 × 0.002252 = 0.270 in. With 0.125 in bleed, the full cover file is 12.520 × 9.25 in. At 300 PPI, the design canvas is 3756 × 2775 px. If your exported PDF does not match those dimensions, fix the file before upload."
        ],
        "bullets": [
          "Do not export a 6 × 9 front-cover-only image.",
          "Do not center spine text from an older page count.",
          "Do not leave guide layers, crop marks, color bars, or template labels visible.",
          "Do not place review quotes, logos, or author photos inside the barcode area."
        ]
      },
      {
        "heading": "What the calculator can and cannot verify",
        "body": [
          "The calculator checks dimensions, spine width, bleed, pixel canvas, and barcode planning. It cannot inspect your final PDF for embedded fonts, locked security, flattened transparencies, raster quality, or hidden template layers. Use it before design export, then use KDP Previewer as the final upload check."
        ]
      }
    ],
    "faq": [
      {
        "question": "Can the calculator guarantee KDP approval?",
        "answer": "No. It can prevent obvious size and setup errors, but KDP Previewer and KDP review remain the final authority."
      },
      {
        "question": "What cover mistake should I check first?",
        "answer": "Check whether the file is the full back-spine-front spread including bleed. Many wrong files are only front-cover sized."
      },
      {
        "question": "Should I remove template lines before final export?",
        "answer": "Yes. Remove guide layers, template text, crop marks, and other setup aids from the final upload PDF."
      }
    ],
    "related": [
      {
        "href": "/guides/kdp-paperback-cover-size-formula/",
        "label": "KDP cover size formula"
      },
      {
        "href": "/guides/kdp-paperback-cover-pdf-requirements/",
        "label": "KDP cover PDF requirements"
      },
      {
        "href": "/guides/kdp-barcode-safe-zone/",
        "label": "KDP barcode safe zone"
      },
      {
        "href": "/",
        "label": "KDP cover calculator"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      },
      {
        "label": "Amazon KDP barcode requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G5HDYGP4BXLX4RUW"
      }
    ]
  },
  {
    "path": "/guides/kdp-spine-text-requirements/",
    "title": "KDP spine text requirements",
    "description": "Know when KDP paperback spine text is allowed, how much space it needs, and when a blank spine is safer.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Calculate the spine first"
    },
    "sections": [
      {
        "heading": "Spine text is not only a design choice",
        "body": [
          "KDP states that paperback books need at least 79 pages to include spine text. Below that threshold, spine text should be removed. Even above 79 pages, a thin spine may not have enough practical room for legible title and author text."
        ],
        "table": {
          "caption": "Spine text planning examples for 6 × 9, B&W white paper",
          "headers": [
            "Page count",
            "Spine width",
            "Practical decision"
          ],
          "rows": [
            [
              "78 pages",
              "0.176 in",
              "Do not add spine text"
            ],
            [
              "79 pages",
              "0.178 in",
              "Allowed by page count, but usually too tight for useful text"
            ],
            [
              "120 pages",
              "0.270 in",
              "Possible only with short, centered spine text"
            ],
            [
              "200 pages",
              "0.450 in",
              "More realistic for title and author text"
            ]
          ]
        }
      },
      {
        "heading": "Keep spine text inside the spine safe area",
        "body": [
          "Do not let spine text drift onto the front or back cover. KDP guidance requires spine text to stay within the spine area with margin on either side, so the text does not wrap onto adjacent panels during trimming and binding."
        ],
        "bullets": [
          "Calculate spine width from the final formatted page count.",
          "Use short spine text when the spine is narrow.",
          "Avoid decorative spine elements that touch the spine fold.",
          "Recheck after changing paper type or page count."
        ]
      },
      {
        "heading": "When a blank spine is the better choice",
        "body": [
          "For journals, workbooks, and short paperbacks, a blank spine may be cleaner and safer than very small text. If the spine is narrow, use the front cover and back cover for title, author, series, or volume information instead of forcing text onto the spine."
        ]
      }
    ],
    "faq": [
      {
        "question": "Can a 78-page KDP paperback have spine text?",
        "answer": "No. KDP says books need at least 79 pages to include spine text."
      },
      {
        "question": "Is spine text always safe after 79 pages?",
        "answer": "No. Page count may allow it, but the spine can still be too narrow for readable, well-centered text."
      },
      {
        "question": "Should I recalculate after changing page count?",
        "answer": "Yes. Page count changes spine width, which changes text placement."
      }
    ],
    "related": [
      {
        "href": "/guides/kdp-spine-width-calculator/",
        "label": "KDP spine width calculator guide"
      },
      {
        "href": "/guides/kdp-paperback-cover-size-formula/",
        "label": "KDP cover size formula"
      },
      {
        "href": "/",
        "label": "Calculate spine width"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      },
      {
        "label": "Amazon KDP cover calculator",
        "href": "https://kdp.amazon.com/cover-calculator"
      }
    ]
  },
  {
    "path": "/guides/kdp-paperback-cover-pdf-requirements/",
    "title": "KDP paperback cover PDF requirements",
    "description": "Prepare a single KDP paperback cover PDF with correct spread size, fonts, transparencies, layers, resolution, file size, and export cleanup.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Check the cover dimensions first"
    },
    "sections": [
      {
        "heading": "KDP expects one continuous cover PDF",
        "body": [
          "A paperback cover upload is not a front cover image. It should be one PDF containing back cover, spine, and front cover as a single spread at the calculated cover size. The file should match the print options selected for trim size, paper, ink, page count, and bleed."
        ]
      },
      {
        "heading": "Pre-upload PDF checklist",
        "body": [
          "Before uploading, inspect both the document setup and the exported PDF. The design can look correct on screen but still fail if fonts, transparencies, visible template text, or file security remain in the final PDF."
        ],
        "table": {
          "caption": "PDF export checklist",
          "headers": [
            "Check",
            "Pass condition"
          ],
          "rows": [
            [
              "File structure",
              "One full-spread PDF, not separate front/back files"
            ],
            [
              "Size",
              "Full cover size including bleed matches the calculator or KDP template"
            ],
            [
              "Fonts",
              "Fonts are embedded or converted according to your design workflow"
            ],
            [
              "Transparency",
              "Transparent effects are flattened where required by the export workflow"
            ],
            [
              "Template cleanup",
              "Crop marks, color bars, template text, and guide labels are removed"
            ],
            [
              "Security",
              "PDF is not locked or encrypted"
            ],
            [
              "File size",
              "Keep the PDF efficient; very large files can slow or fail conversion"
            ]
          ]
        }
      },
      {
        "heading": "Worked example: what the PDF size should be",
        "body": [
          "A 6 × 9 paperback with 120 black-and-white pages on white paper and 0.125 in bleed should export as a 12.520 × 9.25 in full cover PDF. If your PDF page size is 6 × 9 in, it is only a front-cover-sized file and is not ready for a paperback wrap."
        ]
      }
    ],
    "faq": [
      {
        "question": "Can I upload separate front and back cover PDFs?",
        "answer": "No. For a KDP paperback cover, prepare one PDF spread with back cover, spine, and front cover together."
      },
      {
        "question": "Should visible template lines remain in the PDF?",
        "answer": "No. Use guides for setup, then remove visible template text and guide lines before final export."
      },
      {
        "question": "Is a very large PDF a problem?",
        "answer": "It can be. KDP lists a 650 MB conversion limit and recommends keeping cover files much smaller when possible."
      }
    ],
    "related": [
      {
        "href": "/guides/kdp-cover-template-guide/",
        "label": "KDP cover template guide"
      },
      {
        "href": "/guides/kdp-paperback-cover-rejection-checklist/",
        "label": "KDP rejection checklist"
      },
      {
        "href": "/",
        "label": "Check cover dimensions first"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      },
      {
        "label": "Amazon KDP cover calculator",
        "href": "https://kdp.amazon.com/cover-calculator"
      }
    ]
  },
  {
    "path": "/guides/kdp-cover-safe-margin/",
    "title": "KDP cover safe margin guide",
    "description": "Plan KDP paperback safe margins around trim, spine folds, and barcode risk areas so important text and artwork survive print trimming.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Show safe zones"
    },
    "sections": [
      {
        "heading": "Safe margin protects content from print movement",
        "body": [
          "The safe area is where important cover text, logos, author photos, and essential artwork should stay. Bleed is for backgrounds that extend past the trim. Do not confuse bleed with safe margin: bleed is extra artwork outside trim, while safe margin pulls important content inward."
        ]
      },
      {
        "heading": "Practical safe-zone rules",
        "body": [
          "Use these planning checks before exporting the final PDF. They do not replace the official template, but they prevent the most common layout mistakes."
        ],
        "table": {
          "caption": "Cover safe margin checks",
          "headers": [
            "Area",
            "Keep out",
            "Reason"
          ],
          "rows": [
            [
              "Trim edge",
              "Text, logos, faces, review quotes",
              "Trim can shift slightly"
            ],
            [
              "Spine margin",
              "Spine text or art that touches the fold",
              "Content can wrap onto front/back panels"
            ],
            [
              "Barcode area",
              "Back-cover text, author photo, logo, background details",
              "KDP may place a barcode over it"
            ],
            [
              "Bleed area",
              "Important content",
              "Bleed is for backgrounds, not essential text"
            ]
          ]
        }
      },
      {
        "heading": "Example: planning a 6 × 9 back cover",
        "body": [
          "On a 6 × 9 paperback, create the full cover canvas first. Keep the back-cover description, author bio, and review quote inside the back panel safe area, not near the outer trim or barcode zone. Extend only background color, texture, or full-bleed artwork into the bleed."
        ]
      }
    ],
    "faq": [
      {
        "question": "Is bleed the same as safe margin?",
        "answer": "No. Bleed extends artwork outward past trim; safe margin keeps important content inward away from risky edges."
      },
      {
        "question": "Can text go into the bleed area?",
        "answer": "Avoid it. Text in bleed or near trim can be cut off or look uneven after printing."
      },
      {
        "question": "Should I keep the barcode area clear even if I plan my own barcode?",
        "answer": "Yes. Keep the required barcode area clear and verify your own barcode meets KDP formatting rules."
      }
    ],
    "related": [
      {
        "href": "/bleed-safe-zone-calculator/",
        "label": "Bleed and safe zone calculator"
      },
      {
        "href": "/guides/kdp-barcode-safe-zone/",
        "label": "KDP barcode safe zone"
      },
      {
        "href": "/",
        "label": "Show cover safe zones"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      },
      {
        "label": "Amazon KDP cover calculator",
        "href": "https://kdp.amazon.com/cover-calculator"
      }
    ]
  },
  {
    "path": "/guides/kdp-own-barcode-vs-amazon-barcode/",
    "title": "KDP own barcode vs Amazon-placed barcode",
    "description": "Compare uploading your own ISBN barcode with leaving room for Amazon/KDP to place a barcode automatically on the back cover.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Plan the barcode safe zone"
    },
    "sections": [
      {
        "heading": "You can upload a cover with or without your own barcode",
        "body": [
          "If you do not provide your own barcode, KDP can place one on the back cover. If you upload your own barcode, it must be clear, scannable, correctly positioned, and formatted correctly. The design decision affects what you should leave blank on the back cover."
        ]
      },
      {
        "heading": "Which barcode route fits your cover?",
        "body": [
          "Use this comparison before placing back-cover text and images. The safer early-design move is to reserve a quiet barcode box, even if you have not decided whether you will supply your own barcode."
        ],
        "table": {
          "caption": "Amazon-placed barcode vs own barcode",
          "headers": [
            "Option",
            "Best when",
            "Back-cover design rule"
          ],
          "rows": [
            [
              "Amazon/KDP places barcode",
              "You do not have your own barcode or you publish without providing one",
              "Leave the lower back-cover barcode area clear"
            ],
            [
              "Upload your own barcode",
              "You have an ISBN barcode that meets KDP formatting requirements",
              "Use the required size, spacing, color, and white background"
            ],
            [
              "Low-content without ISBN",
              "You publish a low-content book without an ISBN",
              "Expect KDP to place a 2 × 1.2 in white barcode box"
            ]
          ]
        }
      },
      {
        "heading": "Own barcode formatting checks",
        "body": [
          "KDP prefers vector barcode artwork when possible. Rasterized barcode images should be 300 PPI, sharp, clear, black, right-side up, square to the cover, and positioned away from trim and spine. Do not flatten an ISBN barcode into a busy background where it cannot be scanned."
        ]
      }
    ],
    "faq": [
      {
        "question": "Will KDP add a barcode if I do not provide one?",
        "answer": "Yes. KDP can place a barcode on the back cover when you do not provide your own."
      },
      {
        "question": "What size should my own barcode be?",
        "answer": "KDP lists a suggested 2 × 1.2 in size and a minimum 1.4 × 0.8 in size, with spacing from spine and trim."
      },
      {
        "question": "Can I put artwork behind the barcode?",
        "answer": "No. Use a clean white background and keep the barcode area free from important cover design elements."
      }
    ],
    "related": [
      {
        "href": "/guides/kdp-barcode-safe-zone/",
        "label": "KDP barcode safe zone"
      },
      {
        "href": "/guides/kdp-low-content-book-cover-setup/",
        "label": "Low-content cover setup"
      },
      {
        "href": "/",
        "label": "Plan the barcode area"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP barcode requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G5HDYGP4BXLX4RUW"
      },
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      }
    ]
  },
  {
    "path": "/guides/kdp-cover-300-dpi-image-quality/",
    "title": "KDP cover image quality and 300 DPI guide",
    "description": "Check KDP cover image resolution, effective DPI, scaling, pixelation, and final canvas size before exporting a paperback cover.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Calculate the pixel canvas"
    },
    "sections": [
      {
        "heading": "300 DPI depends on final printed size",
        "body": [
          "An image file can say 300 DPI and still look poor if it is enlarged too much on the cover. What matters is effective DPI at the size it prints. Check the pixel dimensions of your placed image and divide by the printed inches it occupies."
        ]
      },
      {
        "heading": "Worked examples for cover art",
        "body": [
          "Use the same DPI logic for full covers and individual images. A full cover canvas uses the calculated spread size. A photo placed on the front cover uses only the physical size of that photo on the page."
        ],
        "table": {
          "caption": "Effective DPI examples",
          "headers": [
            "Printed area",
            "Pixel dimensions",
            "Effective DPI"
          ],
          "rows": [
            [
              "Full 6 × 9, 120-page cover file: 12.520 × 9.25 in",
              "3756 × 2775 px",
              "300 DPI"
            ],
            [
              "Front-cover photo printed 6 × 9 in",
              "1200 × 1800 px",
              "200 DPI"
            ],
            [
              "Front-cover photo printed 4 × 6 in",
              "1200 × 1800 px",
              "300 DPI"
            ],
            [
              "Tiny logo printed 1.5 × 1.5 in",
              "600 × 600 px",
              "400 DPI"
            ]
          ]
        }
      },
      {
        "heading": "Do not fake resolution by changing metadata",
        "body": [
          "Changing a file’s DPI metadata does not create new detail. If an image is blurry, pixelated, heavily compressed, or manually upscaled, fix the source image or reduce its printed size. For final cover art, flatten visible artwork only after you are done editing and keep an editable source copy."
        ]
      }
    ],
    "faq": [
      {
        "question": "Is 1800 × 2700 px enough for a full 6 × 9 paperback cover?",
        "answer": "No. That is front-cover-sized at 300 DPI. A full paperback cover also includes back cover, spine, and bleed."
      },
      {
        "question": "Can I increase DPI without increasing quality?",
        "answer": "No. Changing metadata can report a different DPI, but it does not add real image detail."
      },
      {
        "question": "What is low resolution for KDP images?",
        "answer": "KDP describes images under 200 DPI as low resolution and recommends 300 DPI for best print quality."
      }
    ],
    "related": [
      {
        "href": "/guides/kdp-cover-pixel-size-300-dpi/",
        "label": "KDP cover pixel size at 300 PPI"
      },
      {
        "href": "/image-print-quality-checker/",
        "label": "Image print quality checker"
      },
      {
        "href": "/dpi-calculator/",
        "label": "DPI / PPI calculator"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP image formatting guidance",
        "href": "https://kdp.amazon.com/en_US/help/topic/G202169030"
      },
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      }
    ]
  },
  {
    "path": "/guides/kdp-cover-color-cmyk-rgb-guide/",
    "title": "KDP cover color, CMYK, RGB, and spot color guide",
    "description": "Avoid KDP paperback cover color problems by planning color space, spot colors, color profiles, and print-on-demand variation before export.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Check cover setup first"
    },
    "sections": [
      {
        "heading": "Color on screen is not the same as print color",
        "body": [
          "A cover can look bright on a monitor and print differently. KDP print-on-demand output has normal color variance, and files with mixed color spaces, embedded profiles, spot colors, or heavy transparency effects can produce unexpected results."
        ]
      },
      {
        "heading": "Color setup checks before export",
        "body": [
          "Use one practical color workflow and avoid print features that do not fit KDP’s print-on-demand process. If you design in RGB, expect conversion and preview changes; if you design in CMYK, still verify in KDP Previewer and proof copy."
        ],
        "table": {
          "caption": "Color risk checklist",
          "headers": [
            "Issue",
            "Why it matters",
            "Action"
          ],
          "rows": [
            [
              "Spot colors / Pantone",
              "Not compatible with KDP print-on-demand expectations",
              "Convert spot colors to process colors"
            ],
            [
              "Multiple color spaces",
              "Can cause color variance or unexpected output",
              "Keep the file consistent where possible"
            ],
            [
              "Color profiles",
              "May be removed or produce unexpected results",
              "Avoid relying on embedded profiles for final appearance"
            ],
            [
              "Transparency effects",
              "Can render differently in print",
              "Flatten or export according to your design software guidance"
            ]
          ]
        }
      },
      {
        "heading": "What this calculator can help with",
        "body": [
          "The calculator will not judge color quality. It gives the physical cover dimensions, pixel canvas, bleed, spine, and barcode planning area so your color decisions happen on the correct canvas size. Color approval still depends on the exported PDF, preview, and proof."
        ]
      }
    ],
    "faq": [
      {
        "question": "Should I use spot colors for a KDP cover?",
        "answer": "No. KDP says spot colors are not compatible with its print-on-demand model and recommends converting them to CMYK."
      },
      {
        "question": "Does the calculator check CMYK or RGB?",
        "answer": "No. It calculates size and guide geometry. Use your design software and KDP Previewer to check color output."
      },
      {
        "question": "Can a proof copy still look different from my screen?",
        "answer": "Yes. Screen color, paper, ink, and print-on-demand variation can produce visible differences."
      }
    ],
    "related": [
      {
        "href": "/guides/kdp-paperback-cover-pdf-requirements/",
        "label": "KDP cover PDF requirements"
      },
      {
        "href": "/guides/kdp-cover-300-dpi-image-quality/",
        "label": "KDP image quality and 300 DPI"
      },
      {
        "href": "/",
        "label": "Check cover setup first"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      },
      {
        "label": "Amazon KDP cover calculator",
        "href": "https://kdp.amazon.com/cover-calculator"
      }
    ]
  },
  {
    "path": "/guides/kdp-right-to-left-cover-layout/",
    "title": "KDP right-to-left cover layout guide",
    "description": "Plan KDP right-to-left paperback cover spread order, front/back placement, spine position, and barcode side before exporting a cover guide.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Switch reading direction"
    },
    "sections": [
      {
        "heading": "Reading direction changes the spread order",
        "body": [
          "For left-to-right paperbacks, the full cover spread is normally back cover on the left, spine in the center, and front cover on the right. KDP states that for right-to-left content, the front cover is placed to the left of the spine and the back cover to the right. Barcode placement also changes."
        ]
      },
      {
        "heading": "LTR versus RTL planning map",
        "body": [
          "Do not mirror only the cover art at the last minute. Set reading direction before placing front-cover art, back-cover copy, author bio, barcode, and spine text."
        ],
        "table": {
          "caption": "Paperback spread order",
          "headers": [
            "Reading direction",
            "Left of spine",
            "Right of spine",
            "Barcode planning"
          ],
          "rows": [
            [
              "Left-to-right",
              "Back cover",
              "Front cover",
              "Lower area of the back cover on the left panel"
            ],
            [
              "Right-to-left",
              "Front cover",
              "Back cover",
              "Lower area of the back cover on the right panel"
            ]
          ]
        }
      },
      {
        "heading": "How to use the calculator for RTL books",
        "body": [
          "Switch reading direction before checking the preview. The physical size formula does not change, but panel labeling and barcode placement do. Recheck all back-cover text and barcode-safe regions after changing direction."
        ]
      }
    ],
    "faq": [
      {
        "question": "Does right-to-left reading direction change cover width?",
        "answer": "No. It changes the panel order and barcode placement, not the width formula."
      },
      {
        "question": "Where is the front cover for an RTL paperback?",
        "answer": "KDP indicates that RTL layouts place the front cover to the left of the spine."
      },
      {
        "question": "Should I design LTR first and mirror later?",
        "answer": "No. Choose reading direction before placing front/back cover content and barcode space."
      }
    ],
    "related": [
      {
        "href": "/",
        "label": "Switch reading direction in the calculator"
      },
      {
        "href": "/guides/kdp-barcode-safe-zone/",
        "label": "KDP barcode safe zone"
      },
      {
        "href": "/guides/kdp-cover-template-guide/",
        "label": "KDP cover template guide"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      },
      {
        "label": "Amazon KDP cover calculator",
        "href": "https://kdp.amazon.com/cover-calculator"
      }
    ]
  },
  {
    "path": "/guides/kdp-low-content-book-cover-setup/",
    "title": "KDP low-content book cover setup checklist",
    "description": "Set up KDP paperback covers for journals, notebooks, planners, and workbooks with correct cover size, barcode planning, ISBN choice, and safe zones.",
    "updated": "2026-05-30",
    "category": "KDP cover setup",
    "primaryCta": {
      "href": "/",
      "label": "Calculate low-content cover size"
    },
    "sections": [
      {
        "heading": "Low-content books still need exact cover dimensions",
        "body": [
          "A notebook or planner can have simple interior pages, but the cover is still a paperback cover file. It needs the correct trim size, final page count, spine width, bleed, back cover, front cover, and barcode planning area."
        ]
      },
      {
        "heading": "Low-content cover decisions that affect design",
        "body": [
          "Plan these before opening your design file. The ISBN and barcode decision can affect the back cover, while page count affects the spine."
        ],
        "table": {
          "caption": "Low-content setup checks",
          "headers": [
            "Decision",
            "Design impact"
          ],
          "rows": [
            [
              "Trim size",
              "Common choices include 6 × 9, 7 × 10, 8 × 10, and 8.5 × 11; cover width and pixel canvas change with size"
            ],
            [
              "Page count",
              "Changes spine width and full cover width"
            ],
            [
              "Publish without ISBN",
              "KDP can place a barcode box on the back cover"
            ],
            [
              "Use your own ISBN",
              "You may provide your own barcode if it meets formatting rules"
            ],
            [
              "Interior style",
              "Journals and planners often need clean covers that leave barcode and trim safe zones clear"
            ]
          ]
        }
      },
      {
        "heading": "Worked example: 8.5 × 11 workbook, 120 pages",
        "body": [
          "For an 8.5 × 11 in low-content paperback with 120 black-and-white pages on white paper and 0.125 in bleed, the spine is 0.270 in. The full cover file is 17.520 × 11.25 in. At 300 PPI, the canvas is 5256 × 3375 px. A front-cover-only 2550 × 3300 px file is not enough for the full cover spread."
        ]
      },
      {
        "heading": "Back-cover barcode planning",
        "body": [
          "If you publish without an ISBN or do not provide your own barcode, leave a clean area where KDP can place the barcode. Avoid putting journal prompts, pattern details, logos, author names, or decorative frames in that area."
        ]
      }
    ],
    "faq": [
      {
        "question": "Do low-content books require an ISBN?",
        "answer": "KDP says low-content books do not require an ISBN, but you may use your own ISBN or publish without one."
      },
      {
        "question": "Will KDP place a barcode on a low-content book without ISBN?",
        "answer": "Yes. KDP says it will automatically place a barcode on the back cover when publishing without an ISBN."
      },
      {
        "question": "Can I use the same cover for every page count?",
        "answer": "No. Page count changes spine width, so the full cover width must be recalculated."
      }
    ],
    "related": [
      {
        "href": "/guides/kdp-own-barcode-vs-amazon-barcode/",
        "label": "Own barcode vs Amazon-placed barcode"
      },
      {
        "href": "/guides/kdp-trim-size-page-count/",
        "label": "KDP trim size and page count"
      },
      {
        "href": "/",
        "label": "Calculate low-content cover size"
      }
    ],
    "sources": [
      {
        "label": "Amazon KDP low-content books",
        "href": "https://kdp.amazon.com/en_US/help/topic/GGE5T76TWKA85DJM"
      },
      {
        "label": "Amazon KDP paperback cover requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G201953020"
      },
      {
        "label": "Amazon KDP barcode requirements",
        "href": "https://kdp.amazon.com/en_US/help/topic/G5HDYGP4BXLX4RUW"
      }
    ]
  },

  {
    "path": "/guides/kdp-6x9-120-page-cover-size/",
    "title": "KDP 6×9 cover size for 120 pages",
    "description": "Load a real 6×9 KDP paperback preset for 120 black-and-white pages on white paper, with spine width, bleed, pixel size, and calculator entry.",
    "updated": "2026-05-30",
    "category": "KDP cover preset",
    "primaryCta": {
      "href": "/?preset=six-by-nine-paperback",
      "label": "Load this 6×9 preset in the calculator"
    },
    "sections": [
      {
        "heading": "Preset parameters",
        "body": [
          "This is a single-task preset page, not a general article. It uses a 6 × 9 in paperback, 120 pages, black-and-white interior, white paper, 0.125 in bleed, left-to-right reading direction, and 300 PPI pixel planning.",
          "Use it when you need a quick planning canvas before checking the final file in the official KDP calculator and Previewer."
        ],
        "table": {
          "caption": "Preset input values",
          "headers": ["Field", "Value"],
          "rows": [
            ["Trim size", "6 × 9 in"],
            ["Page count", "120 pages"],
            ["Interior / paper", "Black & white · white paper"],
            ["Bleed", "0.125 in"],
            ["PPI", "300"],
            ["Reading direction", "Left to right"]
          ]
        }
      },
      {
        "heading": "Example output",
        "body": [
          "Using KDP's paperback spine multiplier for black-and-white white paper, the spine is 120 × 0.002252 = 0.270 in. The full cover file includes bleed; the trim spread does not."
        ],
        "table": {
          "caption": "Calculated 6 × 9 / 120-page result",
          "headers": ["Measurement", "Value"],
          "rows": [
            ["Spine width", "0.270 in"],
            ["Trim spread before bleed", "12.270 × 9 in"],
            ["Cover file including bleed", "12.520 × 9.25 in"],
            ["Pixel canvas at 300 PPI", "3756 × 2775 px"]
          ]
        }
      },
      {
        "heading": "Common mistakes for this setup",
        "body": [
          "Do not use a front-cover-only canvas for the full paperback cover. Do not remove bleed from the final cover file. Recalculate if the final manuscript page count changes after formatting. Keep the barcode planning zone clear unless you provide your own barcode."
        ]
      }
    ],
    "faq": [
      { "question": "Is this value fixed for every 6×9 paperback?", "answer": "No. The spine changes when page count or paper type changes." },
      { "question": "Can I put spine text on this 120-page paperback?", "answer": "This preset is above KDP's minimum page count for spine text, but the text still must fit inside the spine safe area." },
      { "question": "Should I still use the official KDP calculator?", "answer": "Yes. Treat this as a planning preset and verify the final PDF in KDP." }
    ],
    "related": [
      { "href": "/guides/kdp-paperback-cover-size-formula/", "label": "KDP cover size formula" },
      { "href": "/guides/kdp-cover-size-with-bleed/", "label": "KDP cover size with bleed" },
      { "href": "/guides/kdp-spine-width-calculator/", "label": "KDP spine width guide" }
    ],
    "sources": [
      { "label": "Amazon KDP paperback cover requirements", "href": "https://kdp.amazon.com/en_US/help/topic/G201953020" },
      { "label": "Amazon KDP print options and page-count limits", "href": "https://kdp.amazon.com/en_US/help/topic/G201834180" }
    ]
  },
  {
    "path": "/guides/kdp-5-5x8-5-200-page-cover-size/",
    "title": "KDP 5.5×8.5 cover size for 200 pages",
    "description": "Load a true 5.5×8.5 KDP paperback preset for a 200-page black-and-white cream-paper book, with spine width and full cover canvas.",
    "updated": "2026-05-30",
    "category": "KDP cover preset",
    "primaryCta": {
      "href": "/?preset=novel-cream",
      "label": "Load this 5.5×8.5 preset in the calculator"
    },
    "sections": [
      {
        "heading": "Preset parameters",
        "body": [
          "This preset is for a 5.5 × 8.5 in paperback with 200 black-and-white pages on cream paper, 0.125 in bleed, left-to-right reading direction, and 300 PPI pixel planning.",
          "It is useful for novels, memoirs, and similar text-heavy paperback interiors where cream paper changes the spine multiplier."
        ],
        "table": {
          "caption": "Preset input values",
          "headers": ["Field", "Value"],
          "rows": [
            ["Trim size", "5.5 × 8.5 in"],
            ["Page count", "200 pages"],
            ["Interior / paper", "Black & white · cream paper"],
            ["Bleed", "0.125 in"],
            ["PPI", "300"],
            ["Reading direction", "Left to right"]
          ]
        }
      },
      {
        "heading": "Example output",
        "body": [
          "For black-and-white cream paper, KDP's paperback spine multiplier is 0.0025 in per page. A 200-page book therefore has a 0.500 in spine."
        ],
        "table": {
          "caption": "Calculated 5.5 × 8.5 / 200-page result",
          "headers": ["Measurement", "Value"],
          "rows": [
            ["Spine width", "0.500 in"],
            ["Trim spread before bleed", "11.500 × 8.5 in"],
            ["Cover file including bleed", "11.750 × 8.75 in"],
            ["Pixel canvas at 300 PPI", "3525 × 2625 px"]
          ]
        }
      },
      {
        "heading": "Common mistakes for this setup",
        "body": [
          "Do not reuse a white-paper spine width for a cream-paper book. Do not design the spine before the final page count is locked. Keep spine text comfortably inside the spine because binding variance can shift the fold lines."
        ]
      }
    ],
    "faq": [
      { "question": "Why is this spine wider than white paper?", "answer": "KDP's cream-paper paperback multiplier is larger than the white-paper multiplier." },
      { "question": "Can this preset be used for 5×8?", "answer": "No. Use the calculator and select the exact trim size because cover width and height change." },
      { "question": "Is 200 pages inside KDP's range?", "answer": "Yes. It is inside the listed 5.5×8.5 paperback range for black-and-white cream paper." }
    ],
    "related": [
      { "href": "/guides/kdp-6x9-120-page-cover-size/", "label": "6×9 120-page preset" },
      { "href": "/guides/kdp-spine-text-requirements/", "label": "KDP spine text requirements" },
      { "href": "/guides/kdp-trim-size-page-count/", "label": "Trim size and page count guide" }
    ],
    "sources": [
      { "label": "Amazon KDP paperback cover requirements", "href": "https://kdp.amazon.com/en_US/help/topic/G201953020" },
      { "label": "Amazon KDP print options and page-count limits", "href": "https://kdp.amazon.com/en_US/help/topic/G201834180" }
    ]
  },
  {
    "path": "/guides/kdp-8-5x11-120-page-workbook-cover-size/",
    "title": "KDP 8.5×11 workbook cover size for 120 pages",
    "description": "Load an 8.5×11 KDP paperback workbook preset for 120 standard-color pages, with the large-trim page range and full cover canvas.",
    "updated": "2026-05-30",
    "category": "KDP cover preset",
    "primaryCta": {
      "href": "/?preset=workbook-color",
      "label": "Load this 8.5×11 workbook preset in the calculator"
    },
    "sections": [
      {
        "heading": "Preset parameters",
        "body": [
          "This preset is for an 8.5 × 11 in paperback workbook with 120 standard-color pages, 0.125 in bleed, left-to-right reading direction, and 300 PPI pixel planning.",
          "Because 8.5 × 11 is a large trim size, use the calculator's page-count warning rather than assuming the same maximum as a 6 × 9 paperback."
        ],
        "table": {
          "caption": "Preset input values",
          "headers": ["Field", "Value"],
          "rows": [
            ["Trim size", "8.5 × 11 in"],
            ["Page count", "120 pages"],
            ["Interior / paper", "Standard color · white paper"],
            ["Bleed", "0.125 in"],
            ["PPI", "300"],
            ["Reading direction", "Left to right"]
          ]
        }
      },
      {
        "heading": "Example output",
        "body": [
          "Standard color paperback interiors use the 0.002252 in per page spine multiplier. For 120 pages, the spine is 0.270 in."
        ],
        "table": {
          "caption": "Calculated 8.5 × 11 / 120-page result",
          "headers": ["Measurement", "Value"],
          "rows": [
            ["Spine width", "0.270 in"],
            ["Trim spread before bleed", "17.270 × 11 in"],
            ["Cover file including bleed", "17.520 × 11.25 in"],
            ["Pixel canvas at 300 PPI", "5256 × 3375 px"]
          ]
        }
      },
      {
        "heading": "Common mistakes for this setup",
        "body": [
          "Do not use a front-cover-only 8.5 × 11 canvas for the full cover spread. Keep back-cover worksheet previews, logos, and decorative frames out of the barcode planning zone. Check that the page count remains inside the standard-color paperback range."
        ]
      }
    ],
    "faq": [
      { "question": "Is 8.5×11 treated like a common 6×9 trim?", "answer": "No. KDP lists different maximum page counts for some large trim sizes, including 8.5×11." },
      { "question": "Does standard color change the minimum page count?", "answer": "Yes. KDP lists a higher minimum for standard-color paperback interiors than for black-and-white interiors." },
      { "question": "Can this preset be used for a low-content book?", "answer": "It can be used for planning a workbook-style paperback cover, but final ISBN, barcode, and upload checks still belong in KDP." }
    ],
    "related": [
      { "href": "/guides/kdp-low-content-book-cover-setup/", "label": "Low-content book cover setup" },
      { "href": "/guides/kdp-trim-size-page-count/", "label": "Trim size and page count guide" },
      { "href": "/guides/kdp-cover-size-with-bleed/", "label": "Cover size with bleed" }
    ],
    "sources": [
      { "label": "Amazon KDP paperback cover requirements", "href": "https://kdp.amazon.com/en_US/help/topic/G201953020" },
      { "label": "Amazon KDP print options and page-count limits", "href": "https://kdp.amazon.com/en_US/help/topic/G201834180" }
    ]
  }
];

export const articleRouteTuples = printArticles.map((article) => [article.path, article.title, article.description] as const) satisfies readonly RouteTuple[];

export function articleByPath(path: string): PrintArticle | undefined {
  return printArticles.find((article) => article.path === path);
}
