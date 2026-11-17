export type WaterfallKind = 'start' | 'change' | 'total';
export interface WaterfallRow {
  label: string;
  kind: WaterfallKind;
  value: number;
  start: number;
  end: number;
  cumulative: number;
}
export interface WaterfallModel {
  rows: WaterfallRow[];
  opening: number;
  closing: number;
  netChange: number;
  minimum: number;
  maximum: number;
  magnitude: number;
}

/** Small RFC-style CSV parser: quoted commas, escaped quotes, CRLF, and quoted newlines. */
export function parseCsv(input: string): string[][] {
  if (input.length > 20000) throw new Error('Keep the CSV below 20,000 characters.');
  const source = input.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const rows: string[][] = [];
  let row: string[] = [], field = '';
  let mode: 'start' | 'plain' | 'quoted' | 'after-quote' = 'start';
  const endField = () => {row.push(field); field = ''; mode = 'start';};
  const endRow = () => {
    endField();
    if (row.some(value => value.trim().length > 0)) rows.push(row);
    row = [];
  };
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (mode === 'quoted') {
      if (char === '"') {
        if (source[i + 1] === '"') {field += '"'; i++;}
        else mode = 'after-quote';
      } else field += char;
      continue;
    }
    if (mode === 'after-quote') {
      if (char === ',') endField();
      else if (char === '\n') endRow();
      else if (!/\s/.test(char)) throw new Error('Unexpected text after a closing CSV quote.');
      continue;
    }
    if (char === ',') {endField(); continue;}
    if (char === '\n') {endRow(); continue;}
    if (char === '"') {
      if (mode !== 'start') throw new Error('Put quotes around the whole CSV field. Escape inner quotes as "".');
      mode = 'quoted';
    } else {field += char; mode = 'plain';}
  }
  if (mode === 'quoted') throw new Error('A quoted CSV field is missing its closing quote.');
  if (field || row.length || mode === 'after-quote') endRow();
  return rows;
}

function finiteNumber(text: string, name: string): number {
  const clean = text.trim();
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(clean)) {
    throw new Error(`${name}: use a number without currency symbols or thousands separators.`);
  }
  const value = Number(clean);
  if (!Number.isFinite(value)) throw new Error(`${name}: values must be finite numbers.`);
  return Object.is(value, -0) ? 0 : value;
}

function matchesTotal(actual: number, expected: number, magnitude: number): boolean {
  const tolerance = Math.max(Number.MIN_VALUE * 16, Number.EPSILON * 32 * Math.max(Math.abs(actual), Math.abs(expected), magnitude));
  return Math.abs(actual - expected) <= tolerance;
}

export function parseWaterfall(input: string): WaterfallModel {
  const csv = parseCsv(input);
  const header = csv.shift()?.map(value => value.trim().toLowerCase());
  if (!header || header.length !== 3 || new Set(header).size !== 3 || !['label','value','type'].every(name => header.includes(name))) {
    throw new Error('Start with the CSV header: label,value,type');
  }
  if (csv.length < 3 || csv.length > 12) throw new Error('Use 3 to 12 data rows: an opening start, changes, and a closing total.');
  const labelIndex = header.indexOf('label'), valueIndex = header.indexOf('value'), typeIndex = header.indexOf('type');
  const rows: WaterfallRow[] = [];
  let cumulative = 0, opening = 0, netChange = 0, magnitude = 0;
  for (let i = 0; i < csv.length; i++) {
    const fields = csv[i];
    if (fields.length !== 3) throw new Error(`CSV row ${i + 2} must have exactly 3 fields. Quote labels containing commas.`);
    const label = fields[labelIndex].trim().replace(/\s+/g, ' ');
    if (!label || label.length > 120) throw new Error(`CSV row ${i + 2}: label must contain 1 to 120 characters.`);
    const kind = fields[typeIndex].trim().toLowerCase() as WaterfallKind;
    if (!['start','change','total'].includes(kind)) throw new Error(`${label}: type must be start, change, or total.`);
    if (i === 0 && kind !== 'start') throw new Error('The first data row must have type start.');
    if (i > 0 && kind === 'start') throw new Error('Only the first row can be a start. Use total for a subtotal.');
    if (i === csv.length - 1 && kind !== 'total') throw new Error('The last row must have type total. Leave its value blank to calculate it.');
    if (kind === 'total') {
      if (fields[valueIndex].trim()) {
        const declared = finiteNumber(fields[valueIndex], label);
        if (!matchesTotal(declared, cumulative, magnitude)) {
          throw new Error(`${label}: total ${formatWaterfallValue(declared)} does not reconcile to ${formatWaterfallValue(cumulative)}. Leave the value blank to calculate it.`);
        }
      }
      rows.push({label, kind, value:cumulative, start:0, end:cumulative, cumulative});
      continue;
    }
    const value = finiteNumber(fields[valueIndex], label);
    const start = kind === 'start' ? 0 : cumulative;
    const next = kind === 'start' ? value : cumulative + value;
    if (!Number.isFinite(next)) throw new Error(`${label}: the cumulative total exceeds the supported number range.`);
    cumulative = Object.is(next, -0) ? 0 : next;
    if (kind === 'start') opening = value;
    else {
      netChange += value;
      if (!Number.isFinite(netChange)) throw new Error('The sum of changes exceeds the supported number range.');
    }
    magnitude = Math.max(magnitude, Math.abs(start), Math.abs(cumulative), Math.abs(value));
    rows.push({label, kind, value, start, end:cumulative, cumulative});
  }
  if (!rows.some(row => row.kind === 'change')) throw new Error('Include at least one change row.');
  const endpoints = rows.flatMap(row => [row.start, row.end]);
  const minimum = Math.min(0, ...endpoints), maximum = Math.max(0, ...endpoints);
  return {rows, opening, closing:cumulative, netChange, minimum, maximum, magnitude:Math.max(Math.abs(minimum),Math.abs(maximum)) || 1};
}

/** Normalization avoids max-min overflow when finite inputs span a very wide range. */
export function waterfallFraction(model: WaterfallModel, value: number): number {
  const low = model.minimum / model.magnitude, high = model.maximum / model.magnitude;
  const range = high - low || 1;
  return (value / model.magnitude - low + range * 0.12) / (range * 1.24);
}

export function formatWaterfallValue(value: number): string {
  if (value === 0) return '0';
  const absolute = Math.abs(value);
  if (absolute >= 1e12 || absolute < 0.001) return value.toExponential(2);
  const unit = absolute >= 1e9 ? [1e9,'B'] : absolute >= 1e6 ? [1e6,'M'] : absolute >= 1e3 ? [1e3,'K'] : [1,''];
  return `${Number((value / Number(unit[0])).toFixed(2))}${unit[1]}`;
}
