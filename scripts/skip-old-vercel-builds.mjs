const { VERCEL_GIT_COMMIT_SHA, VERCEL_GIT_COMMIT_REF = 'main', VERCEL_GIT_REPO_OWNER, VERCEL_GIT_REPO_SLUG } = process.env;
function continueBuild(reason) { console.log(`[skip-old-vercel-builds] continuing build: ${reason}`); process.exit(1); }
function skipBuild(reason) { console.log(`[skip-old-vercel-builds] skipping build: ${reason}`); process.exit(0); }
if (!VERCEL_GIT_COMMIT_SHA || !VERCEL_GIT_REPO_OWNER || !VERCEL_GIT_REPO_SLUG) continueBuild('missing Vercel Git metadata');
try {
  const url = `https://api.github.com/repos/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}/commits/${VERCEL_GIT_COMMIT_REF}`;
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'vercel-skip-old-builds' } });
  if (!response.ok) continueBuild(`GitHub returned ${response.status}`);
  const latest = await response.json();
  const latestSha = latest?.sha;
  if (!latestSha) continueBuild('latest SHA missing from GitHub response');
  if (latestSha !== VERCEL_GIT_COMMIT_SHA) skipBuild(`commit ${VERCEL_GIT_COMMIT_SHA} is older than ${latestSha} on ${VERCEL_GIT_COMMIT_REF}`);
  continueBuild('current commit is latest');
} catch (error) {
  continueBuild(error instanceof Error ? error.message : 'unknown check failure');
}
