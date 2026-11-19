/** Motion Atlas static build, 2026-11-18. MIT; see licenses/ATLAS-MIT.txt. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {finished} from 'node:stream/promises';
import {createHash} from 'node:crypto';

const root = path.dirname(fileURLToPath(import.meta.url));
const buildDir = process.env.ATLAS_SPECTROGRAM_BUILD_DIR;
if (!buildDir) throw new Error('Set ATLAS_SPECTROGRAM_BUILD_DIR to the isolated directory with the installed build-package.json dependencies. See README.md.');
const require = createRequire(path.join(path.resolve(buildDir), 'package.json'));
const {build} = require('esbuild');
const sass = require('sass');
const pug = require('pug');
const SVGIcons2SVGFontStream = require('svgicons2svgfont');
const svg2ttf = require('svg2ttf');
const ttf2woff = require('ttf2woff');
const from = (p) => path.join(root, 'source', p);
const to = (p) => path.join(root, p);
const mkdir = (p) => fs.mkdirSync(p, {recursive: true});
for (const dir of ['js', 'css', 'bin/fonts/icons', 'img']) mkdir(to(dir));

fs.writeFileSync(to('index.html'), pug.renderFile(from('src/jade/index.jade'), {pretty: true}));
fs.writeFileSync(to('css/screen.css'), sass.compile(from('src/sass/screen.scss'), {
  style: 'expanded', logger: {warn() {}, debug() {}}
}).css);
fs.copyFileSync(from('atlas-compat.css'), to('css/atlas-compat.css'));
fs.copyFileSync(from('atlas-compat.js'), to('js/atlas-compat.js'));
fs.copyFileSync(from('third-party/jquery-2.1.3.min.js'), to('js/jquery.min.js'));
fs.cpSync(from('src/images'), to('img'), {recursive: true});
fs.cpSync(from('src/bin'), to('bin'), {recursive: true});
fs.cpSync(from('fonts'), to('bin/fonts'), {recursive: true});

// Match the upstream gulp wildcard order, preserving original BSD notices.
const o3d = ['base.js', 'math.js', 'quaternions.js', 'shader.js'];
fs.writeFileSync(to('js/bundle.js'), o3d.map(name => fs.readFileSync(from(`src/javascripts/o3djs/${name}`), 'utf8')).join('\n;\n'));
await build({
  absWorkingDir: root,
  entryPoints: ['source/src/javascripts/main.js'],
  outfile: to('js/app.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2018'],
  minify: false,
  legalComments: 'inline',
  banner: {js: '/* Original Chrome Music Lab Spectrogram, packaged by Motion Atlas. See THIRD-PARTY-NOTICES.txt and provenance.json. */'}
});

// Rebuild the original icon font from the included, unmodified SVG artwork.
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-spectrogram-font-'));
try {
  const fontPath = path.join(temp, 'icons.svg');
  const output = fs.createWriteStream(fontPath);
  const font = new SVGIcons2SVGFontStream({fontName: 'icons', normalize: true, fontHeight: 1000, log() {}});
  font.on('error', error => output.destroy(error));
  font.pipe(output);
  const icons = fs.readdirSync(from('src/icons')).filter(name => name.endsWith('.svg')).sort();
  if (icons.length !== 13) throw new Error(`Expected 13 original icon glyphs; got ${icons.length}`);
  icons.forEach((name, index) => {
    const glyph = fs.createReadStream(from(`src/icons/${name}`));
    glyph.metadata = {unicode: [String.fromCharCode(0xE001 + index)], name: name.slice(0, -4)};
    font.write(glyph);
  });
  font.end();
  await finished(output);
  const ttf = svg2ttf(fs.readFileSync(fontPath, 'utf8'), {ts: 1671148800}).buffer;
  const woff = ttf2woff(new Uint8Array(ttf)).buffer;
  fs.writeFileSync(to('bin/fonts/icons/icons.woff'), Buffer.from(woff));
} finally { fs.rmSync(temp, {recursive: true, force: true}); }

const walk = dir => fs.readdirSync(to(dir), {withFileTypes: true}).flatMap(entry => {
  const name = `${dir}/${entry.name}`;
  return entry.isDirectory() ? walk(name) : [name];
});
const files = ['index.html', ...['js', 'css', 'bin', 'img'].flatMap(walk)].sort();
const sha256 = file => createHash('sha256').update(fs.readFileSync(to(file))).digest('hex');
const manifest = JSON.parse(fs.readFileSync(to('provenance.json'), 'utf8'));
manifest.distribution_sha256 = Object.fromEntries(files.map(file => [file, sha256(file)]));
manifest.distribution_bytes = files.reduce((sum, file) => sum + fs.statSync(to(file)).size, 0);
fs.writeFileSync(to('provenance.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Built original Spectrogram: ${files.length} runtime files, ${manifest.distribution_bytes.toLocaleString()} bytes. All runtime URLs are local.`);
