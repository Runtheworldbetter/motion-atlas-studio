import {readdir, readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, relative, extname} from 'node:path';
import {deflateRawSync} from 'node:zlib';
import {createZip} from '../lib/zip.ts';
import {originals} from '../lib/originals/catalog.ts';

const root = process.cwd();
const omit = new Set(['.git', '.openai', '.sites-runtime', '.wrangler', 'node_modules', 'dist', 'outputs', '.DS_Store', '__pycache__']);
const rootEntries = new Set(['src', 'lib', 'scripts', 'tests', 'docs', 'public', '.github', 'package.json', 'package-lock.json', 'vite.config.ts', 'tsconfig.json', 'index.html', 'README.md', 'LICENSE', 'CONTRIBUTING.md', '.gitignore']);
const allowed = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.html', '.css', '.md', '.txt', '.svg', '.yml', '.yaml', '.py', '.jade', '.pug', '.less', '.scss', '.glsl', '.frag', '.vert', '.csv', '.map']);
const binary = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.mp3', '.wav', '.ogg', '.woff', '.woff2', '.ttf', '.eot', '.otf', '.wasm']);
const files = Object.create(null);
const jsonFiles = Object.create(null);
const decoder = new TextDecoder('utf-8', {fatal: true});
async function walk(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    if (omit.has(entry.name) || entry.name.startsWith('.env') || entry.name.startsWith('.dev.vars')) continue;
    if (directory === root && !rootEntries.has(entry.name)) continue;
    const path = resolve(directory, entry.name); const name = relative(root, path).replaceAll('\\', '/');
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile() && (name.startsWith('public/vendor/') || allowed.has(extname(path)) || /^(LICENSE|NOTICE|COPYING)([._-]|$)/i.test(entry.name) || entry.name === '.gitignore')) {
      const bytes = await readFile(path);
      let content;
      if (!binary.has(extname(path).toLowerCase())) {
        try { content = decoder.decode(bytes); } catch { /* Preserve non-UTF-8 upstream assets as bytes. */ }
      }
      files[name] = content === undefined ? bytes : content;
      jsonFiles[name] = content === undefined ? {encoding: 'base64', data: bytes.toString('base64')} : content;
    }
  }
}
await walk(root);
// Deployment identity belongs only to the hosting checkout, never to a reusable export.
if (!files['.gitignore'].split('\n').includes('.openai/')) files['.gitignore'] += '\n# Deployment identity belongs to your own hosting environment.\n.openai/\n';
jsonFiles['.gitignore'] = files['.gitignore'];
await mkdir('dist/source', {recursive: true});
const parts = [];
let chunk = Object.create(null), chunkSize = 2;
async function flushChunk() {
  if (!Object.keys(chunk).length) return;
  const name = `bundle-${parts.length + 1}.json`;
  await writeFile(`dist/source/${name}`, JSON.stringify(chunk));
  parts.push(name); chunk = Object.create(null); chunkSize = 2;
}
for (const [name, content] of Object.entries(jsonFiles)) {
  const size = Buffer.byteLength(JSON.stringify({[name]: content}));
  if (chunkSize + size > 4 * 1024 * 1024) await flushChunk();
  chunk[name] = content; chunkSize += size;
}
await flushChunk();
await writeFile('dist/source/bundle.json', JSON.stringify({format: 'motion-atlas-source-v2', parts}));
for (const [name, content] of Object.entries(files)) {
  const destination = resolve('dist/source', name);
  await mkdir(resolve(destination, '..'), {recursive: true});
  await writeFile(destination, content);
}
await writeFile('dist/motion-atlas-source.zip', createZip(files, deflateRawSync));
await mkdir('dist/originals', {recursive: true});
for (const original of originals) {
  const prefix = `public/vendor/${original.directory}/`;
  const selected = Object.fromEntries(Object.entries(files).filter(([name]) => name.startsWith(prefix)));
  if (!selected[`${prefix}index.html`] || !selected[`${prefix}THIRD-PARTY-NOTICES.txt`] || !selected[`${prefix}provenance.json`]) throw new Error(`Incomplete original source export: ${original.id}`);
  // Keep the rebuild entry point and its documentation next to the original's source.
  const stems = {spectrogram: 'spectrogram', loopy: 'loopy', markov: 'setosa', sigma: 'sigma', pathfinding: 'red-blob', paper: 'paper'};
  for (const [name, content] of Object.entries(files)) {
    if (name.startsWith(`scripts/vendor-${stems[original.id]}.`) || name.startsWith(`docs/upstream-${stems[original.id]}`) || (original.id === 'markov' && name === 'docs/upstream-markov.md')) selected[name] = content;
  }
  selected['ATLAS-LICENSE'] = files['LICENSE'];
  selected['START-HERE.md'] = `# ${original.title} — original source\n\nBy ${original.author}.\n\nThis archive contains the actual upstream implementation, the local hosting adapter, runtime assets, provenance, and retained licenses.\n\n## Run\n\nFrom this archive's root, run a static server such as \`python3 -m http.server 8080\`, then open \`http://localhost:8080/${prefix}index.html\`. A local server (rather than opening a file URL) is required for module/data requests.\n\n## Source and license\n\n- Upstream: ${original.upstream}\n- Source: ${original.source}\n- Start with \`${prefix}README.md\` for scope, changes and rebuild instructions.\n- Read \`${prefix}THIRD-PARTY-NOTICES.txt\` and the original LICENSE/NOTICE files before reuse.\n- Atlas-authored hosting code is MIT; upstream files retain their own licenses.\n\nThe full Atlas project is at https://github.com/Runtheworldbetter/motion-atlas-studio.\n`;
  await writeFile(`dist/originals/${original.id}-source.zip`, createZip(selected, deflateRawSync));
}
console.log(`Packaged ${Object.keys(files).length} public source files and ${originals.length} original-source archives (binary assets preserved).`);
