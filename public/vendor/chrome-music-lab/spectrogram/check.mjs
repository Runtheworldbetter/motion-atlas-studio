/** Focused distribution and audio lifecycle checks. Motion Atlas, MIT. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const manifest = JSON.parse(read('provenance.json'));
const runtime = Object.keys(manifest.distribution_sha256);
assert(runtime.length > 40, 'Distribution manifest must cover the complete runtime.');
for (const file of runtime) {
  const bytes = fs.readFileSync(path.join(root, file));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.distribution_sha256[file], `Hash mismatch: ${file}`);
  if (file.endsWith('.js')) new vm.Script(bytes.toString(), {filename: file});
}
function localReference(file, reference) {
  if (/^(?:data:|#)/i.test(reference)) return;
  assert(!/^(?:https?:)?\/\//i.test(reference), `External runtime asset: ${reference}`);
  const resolved = path.resolve(root, path.dirname(file), reference.split('?')[0]);
  assert(resolved.startsWith(root + path.sep), `Asset escapes package: ${reference}`);
  assert(fs.existsSync(resolved), `Missing local asset: ${file} → ${reference}`);
}
for (const match of read('index.html').matchAll(/\b(?:src|href|data-src)="([^"]+)"/g)) localReference('index.html', match[1]);
for (const file of runtime.filter(name => name.endsWith('.css'))) {
  for (const match of read(file).matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) localReference(file, match[1]);
}
for (const match of read('js/app.js').matchAll(/["'](bin\/shaders\/[^"']+)["']/g)) localReference('index.html', match[1]);
for (const name of ['LICENSE', 'THIRD-PARTY-NOTICES.txt', 'README.md', 'upstream-sha256.json', 'source/src/javascripts/main.js', 'source/src/jade/index.jade', 'source/src/sass/screen.scss']) assert(fs.existsSync(path.join(root, name)), `Missing source/notice: ${name}`);

// Stop/visibility guarantees matter most when audio decoding or permission is late.
let decode;
let resolveMicrophone;
let started = 0;
let stopped = 0;
let trackStops = 0;
const node = () => ({connect() {}, disconnect() {}, gain: {value: 1}, frequency: {value: 0}, Q: {value: 0}});
class AudioContextDouble {
  constructor() { this.state = 'running'; this.destination = node(); }
  suspend() { this.state = 'suspended'; return Promise.resolve(); }
  resume() { this.state = 'running'; return Promise.resolve(); }
  createAnalyser() { return node(); }
  createGain() { return node(); }
  createBiquadFilter() { return node(); }
  createMediaStreamSource() { return node(); }
  createBufferSource() { return {...node(), start() { started++; }, stop() { stopped++; }}; }
  createOscillator() { return {...node(), start() { started++; }, stop() { stopped++; }}; }
}
const jquery = new Proxy({}, {get() { return () => jquery; }});
const sandbox = {
  window: {AudioContext: AudioContextDouble, AtlasSpectrogram: {status() {}}},
  AudioContext: AudioContextDouble,
  document: {hidden: false},
  navigator: {mediaDevices: {getUserMedia() { return new Promise(resolve => { resolveMicrophone = resolve; }); }}},
  require: () => ({loadTrackSrc(context, src, callback) { decode = callback; }}),
  module: {exports: {}}, $: () => jquery, console, setTimeout, clearTimeout
};
vm.runInNewContext(read('source/src/javascripts/UI/player.js'), sandbox);
const Player = sandbox.module.exports;
const player = new Player();
player.setLoop(true);
assert.equal(player.context.state, 'suspended', 'Audio starts suspended.');
assert.equal(started, 0, 'No startup audio source.');

player.playSrc('late.mp3');
player.stop();
decode({duration: 1});
assert.equal(started, 0, 'A late decode cannot restart a stopped sample.');
player.playSrc('hidden.mp3');
sandbox.document.hidden = true;
decode({duration: 1});
assert.equal(started, 0, 'A hidden page cannot start a decoded sample.');
sandbox.document.hidden = false;

player.playSrc('played.mp3');
decode({duration: 1});
assert.equal(started, 1, 'An active decoded sample starts.');
assert.equal(player.filterGain.gain.value, 0.65, 'Sample gain remains conservative.');
player.stop();
assert.equal(stopped, 1, 'Stop releases the active source.');

const stream = () => ({getTracks() { return [{stop() { trackStops++; }}]; }});
player.live();
player.stop();
resolveMicrophone(stream());
await Promise.resolve();
await Promise.resolve();
assert.equal(trackStops, 1, 'Late microphone permission is immediately released after stop.');
assert(!player.input, 'No stale microphone input remains.');

player.live();
resolveMicrophone(stream());
await Promise.resolve();
await Promise.resolve();
assert(player.input, 'Explicit approved microphone input connects.');
assert.equal(player.filterGain.gain.value, 0, 'Microphone is not fed to the speakers.');
player.stop();
assert.equal(trackStops, 2, 'Stop releases all active microphone tracks.');
assert.equal(player.input, null);

player.playTone(440);
assert(player.osc, 'Drawing creates a tone after explicit input.');
player.stop();
assert.equal(player.osc, null, 'Stop releases the drawing oscillator.');
const beforeInvalid = started;
player.playTone(null);
assert.equal(started, beforeInvalid, 'Out-of-bounds drawing does not create an invalid tone.');
console.log(`PASS: ${runtime.length} runtime hashes, JavaScript syntax, local assets/notices, and 14 audio lifecycle assertions.`);
