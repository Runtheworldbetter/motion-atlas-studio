import {readdir, readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, relative, extname} from 'node:path';
import {createZip} from '../lib/zip.ts';

const root = process.cwd();
const omit = new Set(['.git', '.openai', '.sites-runtime', '.wrangler', 'node_modules', 'dist', 'outputs']);
const rootEntries = new Set(['src', 'lib', 'scripts', 'tests', 'docs', 'public', '.github', 'package.json', 'package-lock.json', 'vite.config.ts', 'tsconfig.json', 'index.html', 'README.md', 'LICENSE', 'CONTRIBUTING.md', '.gitignore']);
const allowed = new Set(['.ts', '.tsx', '.mjs', '.json', '.html', '.css', '.md', '.txt', '.svg', '.yml', '.yaml']);
const files = {};
async function walk(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    if (omit.has(entry.name) || entry.name.startsWith('.env') || entry.name.startsWith('.dev.vars')) continue;
    if (directory === root && !rootEntries.has(entry.name)) continue;
    const path = resolve(directory, entry.name); const name = relative(root, path).replaceAll('\\', '/');
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile() && (allowed.has(extname(path)) || ['LICENSE', '.gitignore'].includes(entry.name))) {
      files[name] = await readFile(path, 'utf8');
    }
  }
}
await walk(root);
// The hosted checkout tracks its manifest; reusable exports do not.
if (!files['.gitignore'].split('\n').includes('.openai/')) files['.gitignore'] += '\n# Deployment identity belongs to your own hosting environment.\n.openai/\n';
await mkdir('dist/source', {recursive: true});
await writeFile('dist/source/bundle.json', JSON.stringify(files));
for (const [name, content] of Object.entries(files)) {
  const destination = resolve('dist/source', name);
  await mkdir(resolve(destination, '..'), {recursive: true});
  await writeFile(destination, content);
}
await writeFile('dist/motion-atlas-source.zip', createZip(files));
console.log(`Packaged ${Object.keys(files).length} public source files; no deployment identity or local data included.`);
