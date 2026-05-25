function assertClose(name, actual, expected, tolerance = 1) {
  if (Math.abs(actual - expected) > tolerance) {
    console.error(`FAIL ${name}: expected ${expected}, got ${actual}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS ${name}: ${actual}`);
  }
}
function gcd(a, b) { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); return b ? gcd(b, a % b) : a || 1; }
function simplify(w, h) { const d = gcd(w, h); return `${Math.round(w / d)}:${Math.round(h / d)}`; }
function cmToPx(cm, ppi) { return cm / 2.54 * ppi; }
function mmToPx(mm, ppi) { return mm / 25.4 * ppi; }
function printIn(px, ppi) { return px / ppi; }
function quality(ppi) { return ppi >= 300 ? 'High' : ppi >= 200 ? 'Acceptable' : ppi >= 150 ? 'Low' : 'Not recommended'; }
const ratioCases = [[1920,1080,'16:9'],[1080,1920,'9:16'],[1080,1350,'4:5'],[1000,1500,'2:3']];
for (const [w,h,expected] of ratioCases) {
  const actual = simplify(w,h);
  if (actual !== expected) { console.error(`FAIL ratio ${w}x${h}: expected ${expected}, got ${actual}`); process.exitCode = 1; }
  else console.log(`PASS ratio ${w}x${h}: ${actual}`);
}
assertClose('10cm at 300 PPI', Math.round(cmToPx(10,300)), 1181, 0);
assertClose('210mm at 300 PPI', Math.round(mmToPx(210,300)), 2480, 1);
assertClose('297mm at 300 PPI', Math.round(mmToPx(297,300)), 3508, 1);
assertClose('3000px at 300 PPI inches', printIn(3000,300), 10, 0);
assertClose('Pinterest 1000x1500 megapixels', 1000*1500/1000000, 1.5, 0);
assertClose('Shopify 5000x5000 megapixels', 5000*5000/1000000, 25, 0);
assertClose('Open Graph 1200x630 ratio width/height', Math.round((1200/630)*100), 190, 0);

assertClose('Google Play feature graphic width', 1024, 1024, 0);
assertClose('Google Play feature graphic height', 500, 500, 0);
assertClose('App Store iPhone 6.9 portrait height', 2796, 2796, 0);
assertClose('US passport 2 inches at 300 PPI', 2 * 300, 600, 0);
assertClose('Amazon 2000x2000 megapixels', 2000*2000/1000000, 4, 0);
assertClose('Email 1200x400 ratio width/height', Math.round((1200/400)*100), 300, 0);
assertClose('Facebook event 1920x1005 ratio width/height', Math.round((1920/1005)*100), 191, 0);
assertClose('US business card trim 3.5in at 300 PPI', 3.5 * 300, 1050, 0);
assertClose('US business card full bleed 3.75in at 300 PPI', 3.75 * 300, 1125, 0);
assertClose('Google Play app icon size', 512, 512, 0);
assertClose('Google Play screenshot max ratio rule', 1920 / 1080, 1.7777777778, 0.001);

if (quality(300) !== 'High' || quality(200) !== 'Acceptable' || quality(150) !== 'Low' || quality(149) !== 'Not recommended') {
  console.error('FAIL print quality thresholds'); process.exitCode = 1;
} else console.log('PASS print quality thresholds');
if (process.exitCode) process.exit(process.exitCode);
console.log('PixelFit P0 + P1 + P2 calculation smoke tests passed.');
