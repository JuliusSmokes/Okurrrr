/**
 * Enable GitHub Pages for this repo via GitHub API.
 * Requires: gh CLI installed and authenticated (gh auth login).
 * Run from project root: node scripts/enable-github-pages.js
 *
 * Uses "Deploy from a branch": branch main, path / (root).
 */

const { execSync } = require('child_process');

function run(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf-8', ...opts });
}

let owner, repo;
try {
  const out = run('gh repo view --json nameWithOwner');
  const json = JSON.parse(out);
  const nwo = json.nameWithOwner;
  if (!nwo) throw new Error('No nameWithOwner');
  [owner, repo] = nwo.split('/');
} catch (e) {
  console.error('');
  console.error('This folder is not linked to a GitHub repo yet.');
  console.error('');
  console.error('Do Step 1 first: create the repo and push your code.');
  console.error('  Run:  gh repo create Static-Selector --public --source=. --remote=origin --push');
  console.error('');
  console.error('Then run this again:  npm run enable-pages');
  console.error('');
  process.exit(1);
}

const body = JSON.stringify({
  source: { branch: 'main', path: '/' },
  build_type: 'legacy'
});

try {
  run(`gh api repos/${owner}/${repo}/pages -X POST --input -`, {
    input: body
  });
  console.log('GitHub Pages enabled.');
  console.log('Site URL (in 1–2 min): https://' + owner + '.github.io/' + repo + '/');
} catch (e) {
  if (e.stderr && (e.stderr.includes('409') || e.stderr.includes('Conflict'))) {
    console.log('GitHub Pages is already enabled for this repo.');
    console.log('Site URL: https://' + owner + '.github.io/' + repo + '/');
  } else {
    const stderr = (e.stderr || e.message || '') + '';
    console.error('');
    console.error('GitHub said no. That usually means you need to sign in.');
    console.error('');
    console.error('Try this:');
    console.error('  1. Run:  gh auth login');
    console.error('  2. Choose GitHub.com and sign in');
    console.error('  3. Run again:  npm run enable-pages');
    console.error('');
    if (stderr) console.error('Details:', stderr.trim());
    process.exit(1);
  }
}
