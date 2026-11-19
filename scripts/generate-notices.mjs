import {existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Read the installed, locked production tree. No network access or dependency
// execution is involved. Preserve upstream NOTICE files as well as LICENSEs.
const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const output = path.join(root, 'public/third-party-notices.txt');
const check = process.argv.includes('--check');
const unknown = process.argv.slice(2).filter(arg => arg !== '--check');
if (unknown.length) throw new Error(`Unknown argument: ${unknown.join(', ')}`);
const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const manifest = readJson(path.join(root, 'package.json'));
const lock = readJson(path.join(root, 'package-lock.json'));
const overridesFile = path.join(root, 'docs/license-overrides.json');
const overrides = existsSync(overridesFile) ? readJson(overridesFile) : {};
const visited = new Set();
const packages = new Map();
const errors = [];
const omitted = new Set();
const usedOverrides = new Set();
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const portable = file => file.split(path.sep).join('/');
const normalise = text => text.replace(/\r\n?/g, '\n').trimEnd() + '\n';
const noticeName = /^(?:(?:licen[cs]es?|copying|copyright|notices?)(?:$|[._-])|third[-_]party[-_].*(?:notices?|licenses?))/i;
const licenseName = /^(?:licen[cs]es?|copying)(?:$|[._-])/i;

function resolvePackage(name, from) {
  let current = from;
  while (current === root || current.startsWith(root + path.sep)) {
    const candidate = path.join(current, 'node_modules', name);
    if (existsSync(path.join(candidate, 'package.json'))) return candidate;
    if (current === root) break;
    current = path.dirname(current);
  }
  return null;
}

function noticeFiles(directory) {
  const result = [];
  function walk(relative, depth) {
    if (depth > 5) throw new Error(`Notice directory is too deep: ${relative}`);
    for (const entry of readdirSync(path.join(directory, relative), {withFileTypes: true})) {
      const file = path.join(relative, entry.name);
      if (entry.isDirectory()) walk(file, depth + 1);
      else if (entry.isFile()) result.push(file);
    }
  }
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    if (!noticeName.test(entry.name)) continue;
    if (entry.isDirectory()) walk(entry.name, 0);
    else if (entry.isFile()) result.push(entry.name);
  }
  return result.sort(compare).map(file => ({
    name: portable(file),
    text: normalise(readFileSync(path.join(directory, file), 'utf8')),
    isLicense: licenseName.test(file.split(path.sep)[0]),
  }));
}

function licenseLabel(pkg) {
  if (typeof pkg.license === 'string') return pkg.license;
  if (pkg.license?.type) return pkg.license.type;
  if (Array.isArray(pkg.licenses)) return pkg.licenses.map(item => item.type || item).join(' OR ');
  return '';
}

function repositoryUrl(pkg) {
  let url = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url;
  if (!url) return pkg.homepage || '';
  if (/^[\w.-]+\/[\w.-]+$/.test(url)) url = `https://github.com/${url}`;
  return url.replace(/^github:/, 'https://github.com/').replace(/^git\+/, '').replace(/^git:\/\//, 'https://');
}

function applyOverride(id, pkg, notices) {
  const override = overrides[id];
  if (!override) return notices;
  usedOverrides.add(id);
  if (!override.reason || !Array.isArray(override.files) || !override.files.length) {
    errors.push(`${id}: override requires a reason and explicitly sourced files.`);
    return notices;
  }
  if (override.license !== licenseLabel(pkg)) {
    errors.push(`${id}: override no longer matches the package's declared license.`);
    return notices;
  }
  for (const entry of override.files) {
    const absolute = path.resolve(root, entry.file || '');
    if (!absolute.startsWith(path.join(root, 'docs/licenses') + path.sep) || !entry.source || !existsSync(absolute)) {
      errors.push(`${id}: missing or invalid reviewed notice file/source.`);
      continue;
    }
    const bytes = readFileSync(absolute);
    if (!entry.sha256 || createHash('sha256').update(bytes).digest('hex') !== entry.sha256) {
      errors.push(`${id}: reviewed notice checksum is missing or does not match its recorded source.`);
      continue;
    }
    const text = normalise(bytes.toString('utf8'));
    if (!text.trim()) {errors.push(`${id}: reviewed notice file is empty.`); continue;}
    notices.push({name: portable(path.relative(root, absolute)), text, source: entry.source, isLicense: entry.isLicense === true});
  }
  return notices;
}

function visit(name, from, optional = false) {
  const directory = resolvePackage(name, from);
  if (!directory) {
    if (optional) omitted.add(name);
    else errors.push(`Missing installed production dependency: ${name}. Run npm ci first.`);
    return;
  }
  const real = realpathSync(directory);
  if (visited.has(real)) return;
  visited.add(real);
  const pkg = readJson(path.join(directory, 'package.json'));
  const id = `${pkg.name}@${pkg.version}`;
  const installedPath = portable(path.relative(root, directory));
  if (lock.packages?.[installedPath]?.version !== pkg.version) {
    errors.push(`${id}: installed version does not match package-lock.json at ${installedPath}.`);
  }
  const license = licenseLabel(pkg);
  if (!license || license === 'UNLICENSED') errors.push(`${id}: missing or UNLICENSED license metadata; review provenance.`);
  const notices = applyOverride(id, pkg, noticeFiles(directory));
  if (!notices.some(notice => notice.isLicense && notice.text.trim())) {
    errors.push(`${id}: no full LICENSE/COPYING text. Add a version-specific, sourced entry in docs/license-overrides.json; do not infer a copyright holder.`);
  }
  const existing = packages.get(id);
  if (existing && JSON.stringify(existing.notices) !== JSON.stringify(notices)) {
    errors.push(`${id}: duplicate installs contain different notices; review both copies.`);
  } else if (!existing) {
    packages.set(id, {id, license, repository: repositoryUrl(pkg), notices, override: overrides[id]?.reason});
  }
  const children = new Set([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.optionalDependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]);
  for (const child of [...children].sort(compare)) {
    const isOptional = Object.hasOwn(pkg.optionalDependencies || {}, child) || pkg.peerDependenciesMeta?.[child]?.optional === true;
    visit(child, directory, isOptional);
  }
}

for (const name of Object.keys(manifest.dependencies || {}).sort(compare)) visit(name, root);
for (const id of Object.keys(overrides)) {
  if (!usedOverrides.has(id)) errors.push(`Unused license override: ${id}. Remove or re-review it after dependency changes.`);
}
// These faithful upstream instruments are static HTML, outside the npm tree.
// Keep their reviewed licenses in the same downloadable notice bundle.
const vendorRoot = path.join(root, 'public/vendor/chrome-music-lab');
const vendorNotices = [];
for (const name of ['LICENSE-APACHE-2.0.txt', 'THIRD-PARTY-NOTICES.txt']) {
  const file = path.join(vendorRoot, name);
  if (!existsSync(file) || !readFileSync(file, 'utf8').trim()) errors.push(`Chrome Music Lab: missing retained notice ${name}.`);
  else vendorNotices.push({name, text: normalise(readFileSync(file, 'utf8'))});
}
const provenanceFile = path.join(vendorRoot, 'provenance.json');
if (!existsSync(provenanceFile)) errors.push('Chrome Music Lab: missing pinned provenance.');
else {
  const provenance = readJson(provenanceFile);
  for (const name of ['harmonics.html', 'strings.html', 'soundwaves.html']) {
    const file = path.join(vendorRoot, name), expected = provenance.distribution_sha256?.[name];
    if (!expected || !existsSync(file) || createHash('sha256').update(readFileSync(file)).digest('hex') !== expected) {
      errors.push(`Chrome Music Lab: ${name} differs from its reviewed distribution checksum.`);
    }
  }
}
if (errors.length) {
  console.error('Third-party notice generation stopped:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const lines = [
    'Motion Atlas — third-party notices',
    '',
    'Generated by scripts/generate-notices.mjs from the installed packages locked',
    'in package-lock.json and the reviewed vendored Music Lab originals.',
    'Do not edit this file by hand.',
    '',
    'Scope: the complete production dependency closure, including installed peers',
    'and optional packages. This deliberately includes packages or files that a',
    'particular browser build may tree-shake away. Development-only build tools',
    'are excluded. Upstream bundled notices are reproduced in full, including',
    'the three self-contained Chrome Music Lab instruments outside the npm tree.',
    '',
    'Motion Atlas authored code is covered separately by the root MIT LICENSE.',
    'Third-party copyrights and licenses remain with their respective holders.',
    '',
    `Production package versions: ${packages.size}`,
    ...(omitted.size ? [`Uninstalled optional packages (not distributed): ${[...omitted].sort(compare).join(', ')}`] : []),
    '',
    ...[...packages.values()].sort((a, b) => compare(a.id, b.id)).flatMap(pkg => [
      '='.repeat(78), pkg.id, `Declared license: ${pkg.license}`,
      ...(pkg.repository ? [`Upstream: ${pkg.repository}`] : []),
      ...(pkg.override ? [`Reviewed notice source: ${pkg.override}`] : []), '',
      ...pkg.notices.flatMap(notice => [
        `--- ${notice.name} ---`, ...(notice.source ? [`Source: ${notice.source}`, ''] : []), notice.text.trimEnd(), '',
      ]),
    ]),
    '='.repeat(78),
    'Chrome Music Lab originals: Harmonics, Strings, Sound Waves',
    'Upstream: https://github.com/googlecreativelab/chrome-music-lab',
    'Provenance: public/vendor/chrome-music-lab/provenance.json', '',
    ...vendorNotices.flatMap(notice => [`--- ${notice.name} ---`, notice.text.trimEnd(), '']),
  ];
  const text = lines.join('\n');
  if (check) {
    if (!existsSync(output) || readFileSync(output, 'utf8') !== text) {
      console.error('Third-party notices are stale. Run node scripts/generate-notices.mjs and commit the result.');
      process.exitCode = 1;
    } else console.log(`Third-party notices verified for ${packages.size} production package versions.`);
  } else {
    mkdirSync(path.dirname(output), {recursive: true});
    writeFileSync(output, text);
    console.log(`Wrote public/third-party-notices.txt for ${packages.size} production package versions.`);
  }
}
