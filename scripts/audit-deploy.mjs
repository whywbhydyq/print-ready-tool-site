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
const vercel = readJson('vercel.json');
const npmrc = fs.existsSync('.npmrc') ? fs.readFileSync('.npmrc', 'utf8') : '';

const runtimeDeps = Object.keys(pkg.dependencies || {}).sort();
const devDeps = Object.keys(pkg.devDependencies || {}).sort();
const expectedRuntimeDeps = ['@types/node', '@types/react', '@types/react-dom', 'next', 'react', 'react-dom', 'typescript'];
const expectedDevDeps = ['eslint', 'eslint-config-next'];
const expectedVersions = {
  '@types/node': '20.19.41',
  '@types/react': '18.3.29',
  '@types/react-dom': '18.3.7',
  next: '15.5.19',
  react: '18.2.0',
  'react-dom': '18.2.0',
  typescript: '5.9.3',
  eslint: '8.57.1',
  'eslint-config-next': '15.5.19',
};

assert(pkg.engines?.node === '22.x', 'package.json must pin engines.node to 22.x for Vercel stability');
assert(pkg.packageManager === 'pnpm@9.15.9', 'package.json must pin packageManager to pnpm@9.15.9 to avoid the Vercel npm install hang');
assert(!fs.existsSync('package-lock.json'), 'package-lock.json must not be committed when Vercel is forced onto pnpm');
assert(JSON.stringify(runtimeDeps) === JSON.stringify(expectedRuntimeDeps), `runtime dependencies should be only ${expectedRuntimeDeps.join(', ')}; got ${runtimeDeps.join(', ')}`);
assert(JSON.stringify(devDeps) === JSON.stringify(expectedDevDeps), `devDependencies should be only ${expectedDevDeps.join(', ')}; got ${devDeps.join(', ')}`);
for (const [name, version] of Object.entries(expectedVersions)) {
  assert(pkg.dependencies?.[name] === version || pkg.devDependencies?.[name] === version, `${name} must be pinned to ${version} to reduce pnpm no-lock deployment drift`);
}
assert(pkg.overrides?.postcss === '8.5.15', 'npm-compatible overrides.postcss must remain pinned to 8.5.15');
assert(pkg.pnpm?.overrides?.postcss === '8.5.15', 'pnpm.overrides.postcss must remain pinned to 8.5.15');
assert(vercel.framework === 'nextjs', 'vercel.json framework must stay nextjs');
assert(vercel.installCommand === 'corepack enable && pnpm install --prod --no-frozen-lockfile --ignore-scripts', 'vercel.json installCommand must use pnpm and must not invoke npm');
assert(!/\bnpm\b/.test(vercel.installCommand || ''), 'vercel installCommand must not invoke npm because npm install/ci hangs in Vercel');
assert(/\bpnpm install\b/.test(vercel.installCommand || ''), 'vercel installCommand must invoke pnpm install');
assert(vercel.installCommand.includes('--prod'), 'vercel installCommand should install only production dependencies');
assert(vercel.installCommand.includes('--no-frozen-lockfile'), 'vercel installCommand must use --no-frozen-lockfile until pnpm-lock.yaml can be generated in an environment with pnpm access');
assert(vercel.installCommand.includes('--ignore-scripts'), 'vercel installCommand must keep dependency lifecycle scripts disabled during install');
assert(vercel.buildCommand === 'node_modules/.bin/next build', 'vercel.json buildCommand must call Next directly and must not trigger npm/pnpm prebuild');
assert(vercel.buildCommand !== 'npm run build', 'Vercel must not use npm run build');
assert(vercel.buildCommand !== 'pnpm run build', 'Vercel must not use pnpm run build because package prebuild is a local quality gate');
assert(/registry=https:\/\/registry\.npmjs\.org\//.test(npmrc), '.npmrc must pin the public npm registry for package-manager consistency');
assert(/audit=false/.test(npmrc), '.npmrc must disable package-manager audit during install');
assert(/fund=false/.test(npmrc), '.npmrc must disable funding prompts');
assert(/progress=false/.test(npmrc), '.npmrc must disable progress output');

if (fail.length) {
  console.error('Deployment audit failed:');
  for (const item of fail) console.error(`- ${item}`);
  process.exit(1);
}

console.log('Deployment install audit passed.');
