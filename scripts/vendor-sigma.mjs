/**
 * Build the original Sigma homepage paper-network demo without Astro or remote assets.
 * Upstream: jacomyal/sigma.js @ e7748c88c861f19cab00be80cb7f836c5fef61e8 (MIT).
 * This adapter is Motion Atlas code. See docs/upstream-sigma.md for the limited changes.
 * Usage: node scripts/vendor-sigma.mjs [--verify]
 * Rebuilds from the checked-in editable sources; only npm install needs network access.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'public/vendor/sigma');
const source = path.join(target, 'source');
const upstream = path.join(source, 'upstream');
const commit = 'e7748c88c861f19cab00be80cb7f836c5fef61e8';
const hash = content => crypto.createHash('sha256').update(content).digest('hex');
const read = p => fs.readFile(path.join(upstream, p), 'utf8');

if (process.argv.includes('--verify')) {
  const manifest = JSON.parse(await fs.readFile(path.join(target, 'provenance.json'), 'utf8'));
  for (const item of manifest.files) {
    const actual = hash(await fs.readFile(path.join(target, item.path)));
    if (actual !== item.sha256) throw new Error(`Sigma integrity mismatch: ${item.path}`);
  }
  console.log(`Sigma: ${manifest.files.length} pinned files verified; upstream commit ${commit}.`);
  process.exit(0);
}

await fs.mkdir(path.join(target, 'data'), {recursive: true});
await fs.mkdir(path.join(target, 'licenses'), {recursive: true});
const demo = await read('packages/website/src/examples/homepage/demo.astro');
const originalScript = demo.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
const originalStyle = demo.match(/<style>\s*([\s\S]*?)<\/style>/)?.[1];
if (!originalScript || !originalStyle) throw new Error('Unexpected upstream Astro layout.');
const markup = demo.slice(0, demo.indexOf('<style>')).trim();
const themeScript = demo.match(/<script is:inline>\s*([\s\S]*?)<\/script>/)?.[1];
const app = `/* Original Sigma homepage demo script, extracted from pinned demo.astro.\n * Atlas adapter: pagehide cleanup and inspection metadata appended; renderer unchanged.\n */\n${originalScript}\n
window.__motionAtlasOriginal = {
  id: 'sigma', upstreamCommit: '${commit}', renderer, graph,
  getState: () => ({nodes: graph.order, edges: graph.size, selectedNode, hoveredNode,
    search: searchInput.value, camera: renderer.getCamera().getState()})
};
window.addEventListener('pagehide', () => {
  if (suggestionsTimeout) clearTimeout(suggestionsTimeout);
  renderer.kill();
}, {once: true});
document.getElementById('runtime-status')?.remove();
`;
await fs.writeFile(path.join(source, 'app.ts'), app);
await fs.writeFile(path.join(source, 'load-dataset.ts'),
  '/* Atlas hosting adaptation: relative CSV URLs; upstream parsing and graph unchanged. */\n' +
  (await read('packages/website/src/examples/homepage/load-dataset.ts')).replaceAll('fetch("/data/', 'fetch("./data/'));
for (const name of ['demo-nodes.csv', 'demo-edges.csv'])
  await fs.copyFile(path.join(upstream, 'packages/website/public/data', name), path.join(target, 'data', name));
await fs.copyFile(path.join(upstream, 'LICENSE.txt'), path.join(target, 'licenses/Sigma-MIT.txt'));
await fs.copyFile(path.join(upstream, 'LICENSE.txt'), path.join(target, 'LICENSE'));
await fs.copyFile(path.join(root, 'docs/upstream-sigma.md'), path.join(target, 'README.md'));

const baseCss = (await read('packages/website/src/styles/base.css'))
  .replace(/\/\* Monospace font \*\/[\s\S]*?(?=\/\* Main font \*\/)/, '/* Unused Cascadia font declaration omitted in Atlas. */\n\n')
  .replaceAll('url("/fonts/', 'url("./fonts/');
const css = `${baseCss}\n${await read('packages/website/src/styles/example-panel.css')}\n${originalStyle.replace(/@import[^;]+;/g, '')}\n
/* Atlas standalone viewport and status only; original graph/legend styling above. */
html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; color: var(--text); background: var(--bg); }
body { font-family: "Public Sans", Lato, Arial, sans-serif; }
#runtime-status { position: absolute; z-index: 3; left: 1rem; bottom: 1rem; max-width: min(30rem, calc(100% - 4rem)); padding: 1rem; background: var(--bg); border: var(--border); font: 14px/1.5 "Public Sans", Arial, sans-serif; }
#runtime-status a { color: var(--ruby); }
#source-credit { position: absolute; z-index: 2; bottom: .7rem; left: .7rem; padding: .35rem .6rem; background: color-mix(in srgb, var(--bg) 90%, transparent); color: var(--text); border: var(--border); font: 12px/1.35 "Public Sans", Arial, sans-serif; }
#source-credit a { color: var(--ruby); }
:focus-visible { outline: 2px solid var(--ruby); outline-offset: 3px; }
@media (max-width: 500px) { #source-credit { max-width: 45%; } }
`;
await fs.writeFile(path.join(target, 'style.css'), css);
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sigma — original paper network · Motion Atlas</title>
<meta name="description" content="Sigma's original interactive AI research-paper network, with its original renderer, selection, search and local OpenAlex metadata.">
<link rel="stylesheet" href="./style.css">
<script>${themeScript}</script>
</head><body>
${markup}
<div id="runtime-status" role="status">Loading the original paper network…</div>
<aside id="source-credit">Original by <a href="https://www.sigmajs.org/" target="_blank" rel="noopener">Sigma</a> · <a href="./source/upstream/packages/website/src/examples/homepage/demo.astro" target="_blank">Source</a> · <a href="./licenses/NOTICE.md" target="_blank">Notices</a></aside>
<script type="module" src="./boot.js"></script>
</body></html>\n`;
await fs.writeFile(path.join(target, 'index.html'), html);
await fs.writeFile(path.join(target, 'boot.js'), `// Motion Atlas hosting adapter. The original Sigma renderer requires WebGL2.
const status = document.getElementById('runtime-status');
try {
  const probe = document.createElement('canvas');
  const gl = probe.getContext('webgl2');
  if (!gl) throw new Error('WebGL2 is unavailable');
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  await document.fonts.ready;
  await import('./app.js');
} catch (error) {
  console.error('Original Sigma demo could not start:', error);
  status.textContent = error?.message === 'WebGL2 is unavailable'
    ? 'This original Sigma visualization needs WebGL2. This browser cannot start its GPU renderer. '
    : 'The original Sigma network could not load. Reload this page to try again. ';
  const link = document.createElement('a');
  link.href = 'https://www.sigmajs.org/'; link.target = '_blank'; link.rel = 'noopener';
  link.textContent = 'Open the original Sigma site'; status.append(link);
  document.getElementById('search-input').disabled = true;
}
`);

const packageJson = {
  name: 'motion-atlas-vendored-sigma-original', private: true, type: 'module',
  dependencies: {'sigma': '4.0.6', '@sigma/node-border': '4.0.0', '@sigma/layer-webgl': '4.0.0',
    graphology: '0.26.0', 'graphology-metrics': '2.3.0', 'lodash-es': '4.18.1'},
  devDependencies: {esbuild: '0.25.12'},
};
await fs.writeFile(path.join(source, 'package.json'), JSON.stringify(packageJson, null, 2) + '\n');
const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'atlas-sigma-original-'));
try {
  for (const file of ['package.json', 'app.ts', 'load-dataset.ts'])
    await fs.copyFile(path.join(source, file), path.join(temp, file));
  let locked = false;
  try { await fs.copyFile(path.join(source, 'package-lock.json'), path.join(temp, 'package-lock.json')); locked = true; } catch {}
  execFileSync('npm', [locked ? 'ci' : 'install', '--ignore-scripts', '--no-audit', '--no-fund'], {cwd: temp, stdio: 'inherit'});
  await fs.copyFile(path.join(temp, 'package-lock.json'), path.join(source, 'package-lock.json'));
  const {build} = await import(pathToFileURL(path.join(temp, 'node_modules/esbuild/lib/main.js')).href);
  const result = await build({entryPoints: [path.join(temp, 'app.ts')], absWorkingDir: temp,
    outfile: path.join(target, 'app.js'), bundle: true, format: 'esm', platform: 'browser',
    target: 'es2022', minify: true, sourcemap: true, legalComments: 'linked', metafile: true});
  await fs.writeFile(path.join(source, 'build-metafile.json'), JSON.stringify(result.metafile, null, 2) + '\n');
  const notices = ['# Dependency notices for the bundled Sigma original', '',
    'The original demo and its Sigma components are MIT licensed. Font licenses are separate. These exact notices accompany the locally bundled packages.', ''];
  const lock = JSON.parse(await fs.readFile(path.join(temp, 'package-lock.json'), 'utf8'));
  for (const [relative, item] of Object.entries(lock.packages)) {
    if (!relative || item.dev || item.optional) continue;
    const dir = path.join(temp, relative);
    let entries; try { entries = await fs.readdir(dir); } catch { continue; }
    const pkg = JSON.parse(await fs.readFile(path.join(dir, 'package.json'), 'utf8'));
    notices.push(`## ${pkg.name} ${pkg.version}`, '', `Declared license: ${pkg.license || 'See package notices'}`, '');
    for (const name of entries.filter(name => /^(licen[sc]e|copying|notice)(\.|$)/i.test(name))) {
      notices.push('```text', await fs.readFile(path.join(dir, name), 'utf8'), '```', '');
    }
  }
  await fs.writeFile(path.join(target, 'licenses/DEPENDENCIES.md'), notices.join('\n'));
} finally { await fs.rm(temp, {recursive: true, force: true}); }

const noticeFiles = ['NOTICE.md', 'Sigma-MIT.txt', 'DEPENDENCIES.md', 'Hauora-OFL.txt', 'Public-Sans-OFL.txt', 'Public-Sans-LICENSE.md', 'CC0-1.0.txt'];
const completeNotices = [];
for (const filename of noticeFiles) completeNotices.push(`\n===== ${filename} =====\n`, await fs.readFile(path.join(target, 'licenses', filename), 'utf8'));
await fs.writeFile(path.join(target, 'THIRD-PARTY-NOTICES.txt'), completeNotices.join('\n'));

const files = [];
async function walk(dir, relative = '') {
  for (const item of await fs.readdir(dir, {withFileTypes: true})) {
    const p = path.posix.join(relative, item.name);
    if (item.isDirectory()) await walk(path.join(dir, item.name), p);
    else if (p !== 'provenance.json') files.push({path: p, sha256: hash(await fs.readFile(path.join(dir, item.name)))});
  }
}
await walk(target);
await fs.writeFile(path.join(target, 'provenance.json'), JSON.stringify({
  project: 'Sigma original homepage paper network', commit,
  source: `https://github.com/jacomyal/sigma.js/tree/${commit}/packages/website/src/examples/homepage`,
  dataSource: `https://github.com/jacomyal/sigma.js/tree/${commit}/packages/website/public/data`,
  licenses: {code: 'MIT', openAlexMetadata: 'CC0-1.0', hauora: 'OFL-1.1', publicSans: 'OFL-1.1 (see additional upstream notice)'},
  files: files.sort((a, b) => a.path.localeCompare(b.path)),
}, null, 2) + '\n');
console.log(`Built original Sigma demo with ${files.length} locally hosted files.`);
