import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const port = 3311;
const base = `http://127.0.0.1:${port}`;
const artifacts = join(root, 'local-check-logs', 'ui-smoke');
const downloads = join(artifacts, 'downloads');
mkdirSync(downloads, { recursive: true });

function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
async function waitForServer() {
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${base}/image-size/`);
      if (res.ok) return;
    } catch {}
    await wait(1000);
  }
  throw new Error('next start did not become ready');
}
function screenshot(path, size, file) {
  execFileSync('/usr/bin/chromium', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    `--window-size=${size}`, `--screenshot=${join(artifacts, file)}`, `${base}${path}`
  ], { stdio: 'pipe', timeout: 90000 });
  if (!existsSync(join(artifacts, file))) throw new Error(`missing screenshot ${file}`);
}
async function httpCheck(path, needle) {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error(`${path} status ${res.status}`);
  const html = await res.text();
  if (!html.includes(needle)) throw new Error(`${path} missing ${needle}`);
}
async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });
  return {
    send(method, params = {}) {
      const callId = ++id;
      ws.send(JSON.stringify({ id: callId, method, params }));
      return new Promise((resolve, reject) => pending.set(callId, { resolve, reject }));
    },
    close() { ws.close(); }
  };
}
async function cdpClickDownloadAndCopy() {
  const chrome = spawn('/usr/bin/chromium', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--remote-debugging-port=9223',
    `--user-data-dir=${join(artifacts, 'chrome-profile')}`, 'about:blank'
  ], { stdio: ['ignore', 'ignore', 'ignore'] });
  try {
    await wait(1500);
    await fetch('http://127.0.0.1:9223/json/version');
    const target = await (await fetch(`http://127.0.0.1:9223/json/new?${encodeURIComponent(`${base}/image-size/youtube-banner-safe-area/`)}`, { method: 'PUT' })).json();
    const page = await connect(target.webSocketDebuggerUrl);
    await page.send('Page.enable');
    await page.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads, eventsEnabled: true }).catch(() => {});
    await page.send('Browser.grantPermissions', { origin: base, permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'] }).catch(() => {});
    await wait(2500);
    const buttons = await page.send('Runtime.evaluate', { expression: `Array.from(document.querySelectorAll('button')).map((b) => b.textContent).join('|')`, returnByValue: true });
    if (!String(buttons.result.value).includes('Download SVG overlay')) throw new Error('download buttons not rendered in real browser');
    await page.send('Runtime.evaluate', { expression: `Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Download SVG overlay')).click()` });
    await wait(1000);
    if (!readdirSync(downloads).some((name) => name.endsWith('.svg'))) throw new Error('SVG download did not create a file');
    await page.send('Runtime.evaluate', { expression: `Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Download PNG overlay')).click()` });
    await wait(1500);
    if (!readdirSync(downloads).some((name) => name.endsWith('.png'))) throw new Error('PNG download did not create a file');
    await page.send('Page.navigate', { url: `${base}/image-size/aspect-ratio-calculator/` });
    await wait(1500);
    await page.send('Runtime.evaluate', { expression: `Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Copy summary')).click()` });
    await wait(1000);
    const copyStatus = await page.send('Runtime.evaluate', { expression: `document.body.innerText.includes('Copied') || document.body.innerText.includes('Clipboard denied')`, returnByValue: true });
    if (!copyStatus.result.value) throw new Error('copy button did not respond');
    page.close();
  } finally {
    chrome.kill('SIGTERM');
  }
}

rmSync(artifacts, { recursive: true, force: true });
mkdirSync(downloads, { recursive: true });
const server = spawn('npx', ['next', 'start', '-p', String(port)], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
server.stdout.on('data', (d) => { output += d.toString(); });
server.stderr.on('data', (d) => { output += d.toString(); });
try {
  await waitForServer();
  await httpCheck('/image-size/', 'Image Size, DPI &amp; Safe Zone Tools');
  await httpCheck('/image-size/youtube-banner-safe-area/', 'Download SVG overlay');
  await httpCheck('/image-size/advanced-safe-zone-database/', 'Source confidence');
  await httpCheck('/image-size/social-media-image-size-calculator/', 'Social Media Image Size Calculator');
  screenshot('/image-size/', '1366,768', 'hub-1366.png');
  screenshot('/image-size/youtube-banner-safe-area/', '1366,768', 'youtube-banner-1366.png');
  screenshot('/image-size/advanced-safe-zone-database/', '1366,768', 'database-1366.png');
  screenshot('/image-size/youtube-banner-safe-area/', '375,812', 'youtube-banner-mobile.png');
  await cdpClickDownloadAndCopy();
  console.log('UI smoke passed. Screenshots and downloads saved in local-check-logs/ui-smoke.');
} finally {
  server.kill('SIGTERM');
  await wait(500);
  if (server.exitCode === null) server.kill('SIGKILL');
  if (output) console.log(output.trim().split('\n').slice(-8).join('\n'));
}
process.exit(0);
