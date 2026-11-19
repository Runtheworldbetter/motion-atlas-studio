import assert from 'node:assert/strict';
import test from 'node:test';
import {createZip, decodeSourceBundle, loadSourceBundle} from '../lib/zip.ts';

// Read the standard central directory rather than relying on the writer's
// iteration order. Real extraction is also checked during release validation.
function readStoredEntries(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const decoder = new TextDecoder('utf-8', {fatal: true});
  const end = bytes.length - 22;
  assert.equal(view.getUint32(end, true), 0x06054b50, 'end-of-directory signature');
  const count = view.getUint16(end + 10, true);
  const directorySize = view.getUint32(end + 12, true);
  let cursor = view.getUint32(end + 16, true);
  assert.equal(cursor + directorySize, end);
  const entries = new Map<string, {data: Uint8Array; crc: number}>();
  for (let index = 0; index < count; index++) {
    assert.equal(view.getUint32(cursor, true), 0x02014b50, 'central-directory signature');
    assert.equal(view.getUint16(cursor + 10, true), 0, 'stored compression method');
    assert.equal(view.getUint16(cursor + 8, true) & 0x0800, 0x0800, 'UTF-8 filename flag');
    const size = view.getUint32(cursor + 20, true);
    assert.equal(view.getUint32(cursor + 24, true), size);
    const nameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    const name = decoder.decode(bytes.subarray(cursor + 46, cursor + 46 + nameLength));
    const offset = view.getUint32(cursor + 42, true);
    assert.equal(view.getUint32(offset, true), 0x04034b50, 'local-file signature');
    const localNameLength = view.getUint16(offset + 26, true);
    const localExtraLength = view.getUint16(offset + 28, true);
    assert.equal(decoder.decode(bytes.subarray(offset + 30, offset + 30 + localNameLength)), name);
    const start = offset + 30 + localNameLength + localExtraLength;
    const crc = view.getUint32(cursor + 16, true);
    assert.equal(view.getUint32(offset + 14, true), crc);
    assert.equal(view.getUint32(offset + 18, true), size);
    assert.ok(start + size <= view.getUint32(end + 16, true), 'file data must precede the central directory');
    entries.set(name, {data: bytes.subarray(start, start + size), crc});
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  assert.equal(cursor, end);
  assert.equal(entries.size, count);
  return entries;
}

test('ZIP preserves nested UTF-8 paths and content with standard CRC-32', () => {
  const files = {'docs/λ.txt': 'An explanation → a useful idea 🌱', 'checksum.txt': '123456789', 'empty.txt': ''};
  const entries = readStoredEntries(createZip(files));
  for (const [name, text] of Object.entries(files)) assert.equal(new TextDecoder().decode(entries.get(name)?.data), text);
  // Published CRC-32/ISO-HDLC check value for the ASCII sequence 123456789.
  assert.equal(entries.get('checksum.txt')?.crc, 0xcbf43926);
  assert.equal(entries.get('empty.txt')?.crc, 0);
});

test('source JSON and ZIP preserve binary audio/image bytes alongside editable Unicode text', () => {
  const binary = Uint8Array.from([0, 255, 128, 1, 13, 10, 0, 254]);
  const bundle = JSON.parse(JSON.stringify({
    'audio/sample.bin': {encoding: 'base64', data: Buffer.from(binary).toString('base64')},
    'README.md': 'Original sound → editable source 🎵',
  }));
  const files = decodeSourceBundle(bundle);
  assert.deepEqual(files['audio/sample.bin'], binary);
  const entries = readStoredEntries(createZip(files));
  assert.deepEqual(entries.get('audio/sample.bin')?.data, binary);
  assert.equal(new TextDecoder().decode(entries.get('README.md')?.data), bundle['README.md']);
  assert.throws(() => decodeSourceBundle({'../private': 'bad'}), /path/i);
  assert.throws(() => decodeSourceBundle({'sample.bin': {encoding: 'utf16', data: 'wrong'}}), /entry/i);
});

test('ZIP output is repeatable across object insertion order', () => {
  assert.deepEqual(
    createZip({'src/main.ts': 'export {};', 'LICENSE': 'License text', '.gitignore': 'node_modules/\n'}),
    createZip({'.gitignore': 'node_modules/\n', 'LICENSE': 'License text', 'src/main.ts': 'export {};'}),
  );
  assert.equal(readStoredEntries(createZip({})).size, 0);
});

test('ZIP refuses path traversal and absolute paths on POSIX and Windows', () => {
  for (const name of ['../escape.txt', 'dir/../../escape.txt', '/absolute.txt', '\\absolute.txt',
    '..\\escape.txt', 'dir\\..\\escape.txt', 'C:/escape.txt', 'C:\\escape.txt']) {
    assert.throws(() => createZip({[name]: 'data'}), /path/i, name);
  }
});

test('ZIP refuses ambiguous or truncated archive entry names', () => {
  for (const name of ['', '.', '..', './file.txt', 'dir/./file.txt', 'dir//file.txt', 'dir/', 'nul\0.txt']) {
    assert.throws(() => createZip({[name]: 'data'}), /path/i, JSON.stringify(name));
  }
});


test('split source manifests assemble all chunks and reject duplicate or unsafe parts', async () => {
  const manifest = {format: 'motion-atlas-source-v2', parts: ['bundle-1.json', 'bundle-2.json']};
  const chunks: Record<string, unknown> = {'bundle-1.json': {'README.md': 'Editable'}, 'bundle-2.json': {'sample.bin': {encoding: 'base64', data: 'AP8='}}};
  const files = await loadSourceBundle(manifest, async name => chunks[name]);
  assert.equal(files['README.md'], 'Editable');
  assert.deepEqual(files['sample.bin'], Uint8Array.of(0, 255));
  await assert.rejects(loadSourceBundle({...manifest, parts: ['../secret.json']}, async () => ({})), /manifest/i);
  await assert.rejects(loadSourceBundle(manifest, async () => ({'same.txt': 'duplicate'})), /duplicate/i);
});
