/** Small, dependency-free ZIP writer for local source exports (stored entries). */
export function createZip(files: Record<string, string>): Uint8Array {
  const encoder = new TextEncoder();
  const entries: {name: Uint8Array; data: Uint8Array; crc: number; offset: number}[] = [];
  const parts: Uint8Array[] = [];
  let offset = 0;
  const crc32 = (bytes: Uint8Array) => {
    let crc = 0xffffffff;
    for (const b of bytes) {
      crc ^= b;
      for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  };
  for (const [path, content] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
    if (!path || path.includes('\\') || path.includes('\0') || /^[a-zA-Z]:/.test(path) || path.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('Invalid archive path.');
    const name = encoder.encode(path);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const header = new Uint8Array(30 + name.length);
    const v = new DataView(header.buffer);
    v.setUint32(0, 0x04034b50, true); v.setUint16(4, 20, true); v.setUint16(6, 0x0800, true);
    v.setUint16(12, 0x21, true); v.setUint32(14, crc, true);
    v.setUint32(18, data.length, true); v.setUint32(22, data.length, true);
    v.setUint16(26, name.length, true); header.set(name, 30);
    entries.push({name, data, crc, offset}); parts.push(header, data); offset += header.length + data.length;
  }
  const directoryOffset = offset;
  for (const entry of entries) {
    const header = new Uint8Array(46 + entry.name.length); const v = new DataView(header.buffer);
    v.setUint32(0, 0x02014b50, true); v.setUint16(4, 20, true); v.setUint16(6, 20, true);
    v.setUint16(8, 0x0800, true); v.setUint16(14, 0x21, true); v.setUint32(16, entry.crc, true);
    v.setUint32(20, entry.data.length, true); v.setUint32(24, entry.data.length, true);
    v.setUint16(28, entry.name.length, true); v.setUint32(42, entry.offset, true);
    header.set(entry.name, 46); parts.push(header); offset += header.length;
  }
  const end = new Uint8Array(22); const v = new DataView(end.buffer);
  v.setUint32(0, 0x06054b50, true); v.setUint16(8, entries.length, true); v.setUint16(10, entries.length, true);
  v.setUint32(12, offset - directoryOffset, true); v.setUint32(16, directoryOffset, true); parts.push(end);
  const result = new Uint8Array(offset + end.length); let position = 0;
  for (const part of parts) {result.set(part, position); position += part.length;}
  return result;
}
