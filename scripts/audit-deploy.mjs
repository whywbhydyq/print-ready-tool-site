import fs from 'node:fs';

const fail = [];
function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    fail.push(`${path} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
    return {};
  }
}
function assert(condition, message) {
  if (!condition) fail.push(message);
}

const pkg = readJson('package.json');
const lock = readJson('package-lock.json');
const vercel = readJson('vercel.json');
const npmrc = fs.existsSync('.npmrc') ? fs.readFileSync('.npmrc', 'utf8') : '';

const runtimeDeps = Object.keys(pkg.dependencies || {}).sort();
const devDeps = Object.keys(pkg.devDependencies || {}).sort();
const expectedRuntimeDeps = ['next', 'react', 'react-dom'];

assert(pkg.engines?.node === '22.x', 'package.json must pin engines.node to 22.x for Vercel stability');
assert(/^npm@10\./.test(pkg.packageManager || ''), 'package.json must pin packageManager to npm@10.x');
assert(JSON.stringify(runtimeDeps) === JSON.stringify(expectedRuntimeDeps), `runtime dependencies should be only ${expectedRuntimeDeps.join(', ')}; got ${runtimeDeps.join(', ')}`);
for (const name of ['typescript', '@types/node', '@types/react', '@types/react-dom', 'eslint', 'eslint-config-next']) {
  assert(devDeps.includes(name), `${name} must be in devDependencies for build-time use`);
}
assert(lock.lockfileVersion === 3, 'package-lock.json must use lockfileVersion 3');
assert(lock.packages?.['']?.engines?.node === '22.x', 'package-lock root package must include engines.node 22.x');
assert(vercel.framework === 'nextjs', 'vercel.json framework must stay nextjs');
assert(vercel.installCommand === 'npm ci --include=dev --no-audit --no-fund', 'vercel.json installCommand must use deterministic npm ci');
assert(vercel.buildCommand === 'npm run build', 'vercel.json buildCommand must stay npm run build');
assert(/audit=false/.test(npmrc), '.npmrc must disable npm audit during install');
assert(/fund=false/.test(npmrc), '.npmrc must disable npm funding prompts');
assert(/progress=false/.test(npmrc), '.npmrc must disable install progress output');

if (fail.length) {
  console.error('Deployment audit failed:');
  for (const item of fail) console.error(`- ${item}`);
  process.exit(1);
}

console.log('Deployment install audit passed.');
