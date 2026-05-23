import fs from 'node:fs';

function write(path, content) { fs.writeFileSync(path, content); }
function replace(path, from, to) {
  const current = fs.readFileSync(path, 'utf8');
  if (current.includes(from)) write(path, current.replace(from, to));
}

const css = fs.readFileSync('app/globals.css', 'utf8');
if (!css.includes('homepage-cro-v2')) {
  write('app/globals.css', css + '\n/* homepage-cro-v2 */\n.hero{background:linear-gradient(180deg,#fff,#fff7ed);border-color:#fed7aa}.grid>.card{text-decoration:none;transition:transform .15s ease,box-shadow .15s ease}.grid>.card:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(15,23,42,.08)}input:focus,select:focus,textarea:focus,button:focus,a:focus-visible{outline:3px solid rgba(37,99,235,.35);outline-offset:2px}@media(max-width:700px){.buttonrow button{width:100%}table{display:block;overflow-x:auto;white-space:nowrap}}\n');
}

replace('app/page.tsx', 'Print-Ready Size Calculators', 'Print Size, DPI & Bleed Calculators');
replace('app/page.tsx', 'Calculate pixels, DPI/PPI, bleed, safe zones, KDP paperback covers, KDP interior bleed, and Etsy printable ratio packs. Results are copyable, shareable, and designed for real print setup decisions.', 'Calculate pixels, print dimensions, DPI/PPI, bleed, safe zones, paperback covers, interior bleed, printable ratio packs, and common print sizes. Copy the result, export files when needed, then verify final settings before print.');
replace('src/components/CalculatorClient.tsx', "const text = result ? `Print size: ${round(result.width, 3)} x ${round(result.height, 3)} ${input.unit}; pixels: ${Math.round(result.pxw)} x ${Math.round(result.pxh)} px; effective DPI: ${round(result.edpi, 1)}; verdict: ${result.quality}` : 'Invalid print size inputs';", "const printUnit = mode === 'pixels-to-print-size' ? 'in' : input.unit;\n  const printWidthValue = mode === 'pixels-to-print-size' ? result?.widthIn : result?.width;\n  const printHeightValue = mode === 'pixels-to-print-size' ? result?.heightIn : result?.height;\n  const text = result ? `Print size: ${round(printWidthValue ?? 0, 3)} x ${round(printHeightValue ?? 0, 3)} ${printUnit}; pixels: ${Math.round(result.pxw)} x ${Math.round(result.pxh)} px; effective DPI: ${round(result.edpi, 1)}; verdict: ${result.quality}` : 'Invalid print size inputs';");

const readme = fs.readFileSync('README.md', 'utf8');
if (!readme.includes('## SEO and UX checklist')) {
  write('README.md', readme.replace('## Development', '## SEO and UX checklist\n\n- Use https://print.ymirtool.com as the only public production domain.\n- Do not add meta keywords.\n- Keep review notes short and contextual.\n- Do not add /weekly to the sitemap unless an actual route exists.\n\n## Development'));
}
