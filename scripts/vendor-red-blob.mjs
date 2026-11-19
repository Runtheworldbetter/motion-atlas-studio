/**
 * Package Red Blob's actual A* diagrams from the deployed source map, not a reimplementation.
 * Sources are pinned by SHA-256 because this source is published on redblobgames.com, not a tagged repo.
 * Usage: node scripts/vendor-red-blob.mjs [--verify]
 * No package installation or network access is required to rebuild the checked-in source.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'public/vendor/red-blob');
const source = path.join(target, 'source');
const snapshotUrl = 'https://www.redblobgames.com/pathfinding/a-star/build/_introduction.js.map';
const snapshotHash = 'a92677fadf5b4bfd7bb9290a28f6737c23042f5c004061ad4d8527afd909be4d';
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');

if (process.argv.includes('--verify')) {
  const manifest = JSON.parse(await fs.readFile(path.join(target, 'provenance.json'), 'utf8'));
  for (const file of manifest.files) {
    if (hash(await fs.readFile(path.join(target, file.path))) !== file.sha256)
      throw new Error(`Red Blob integrity mismatch: ${file.path}`);
  }
  console.log(`Red Blob: ${manifest.files.length} files verified against the pinned source snapshot.`);
  process.exit(0);
}

const snapshot = await fs.readFile(path.join(source, 'upstream-source-map.json'));
if (hash(snapshot) !== snapshotHash) throw new Error('Red Blob upstream source-map hash differs from the audited snapshot.');
const map = JSON.parse(snapshot);
for (let i = 0; i < map.sources.length; i++) {
  const relative = new URL(map.sources[i], snapshotUrl).pathname.slice(1);
  const output = path.join(source, relative);
  await fs.mkdir(path.dirname(output), {recursive: true});
  await fs.writeFile(output, map.sourcesContent[i]);
}
const original = await fs.readFile(path.join(source, 'pathfinding/a-star/introduction.js'), 'utf8');
function between(start, end) {
  const a = original.indexOf(start), b = original.indexOf(end, a + start.length);
  if (a < 0 || b < 0) throw new Error(`Source extraction marker missing: ${start}`);
  return original.slice(a, b);
}
const functions = [
  between('function manhattan_heuristic', '/**'),
  between('const currentTileStyleMap', 'const introStyleMap'),
  between('const reconstructedPathStyle', 'function mouseoverLayer'),
  between('function mouseoverLayer', 'function nodeLayer'),
  between('let diagram_frontier_walls', 'function makeDiagramContour'),
  between('function makeDiagramAStar', 'onLoad(makeDiagramAStar);'),
].join('\n').replace(/^onLoad\([^\n]+\);\s*$/gm, '');
const extracted = `/*!
 * Original functions from Red Blob Games' A* introduction.
 * Copyright 2014, 2020 Red Blob Games <redblobgames@gmail.com>
 * License: Apache-2.0. See LICENSE and THIRD-PARTY-NOTICES.txt.
 * Motion Atlas adaptation, 2026: extract the plain-grid initializers only,
 * use local imports, and register original Diagram instances for viewport resizing.
 * Search, grid, canvas layers, marker dragging, and slider playback are unchanged.
 */
import {SearchOptions} from './source/pathfinding/search.js';
import {SquareGrid, SquareGridLayout} from './source/pathfinding/grid.js';
import {Diagram as OriginalDiagram, Layers, Markers, Patterns, addSlider, addSliderSteps} from './source/pathfinding/diagram.js';
export const diagrams = [];
class Diagram extends OriginalDiagram {
  constructor(...args) { super(...args); diagrams.push(this); }
}
${functions}
export {makeDiagramFrontier, makeDiagramExpansion, makeDiagramWeights, makeDiagramAStar};
`;
await fs.writeFile(path.join(target, 'atlas-diagrams.js'), extracted);

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
  project: 'Red Blob Games original A* plain-grid diagrams', source: snapshotUrl,
  sourceSnapshotSha256: snapshotHash, retrieved: '2026-11-19',
  upstreamPage: 'https://www.redblobgames.com/pathfinding/a-star/introduction.html',
  licenses: {firstPartyCode: 'Apache-2.0', conrec: 'See original BSD-style and Nicholas Yue notices; archived unchanged, not loaded by these diagrams'},
  runtimeSources: ['source/pathfinding/search.js', 'source/pathfinding/grid.js', 'source/pathfinding/diagram.js', 'source/mjs/draggable.v2.js'],
  excluded: ['StarRaven illustrated maps and sprites', 'Article prose', 'Analytics', 'Remote fonts and assets'],
  files: files.sort((a, b) => a.path.localeCompare(b.path)),
}, null, 2) + '\n');
console.log(`Built Red Blob original diagrams; ${files.length} files recorded. No dependencies installed.`);
