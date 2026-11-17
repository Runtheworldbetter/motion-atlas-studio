export const CODE_LIMITS = {characters:6000, lines:18, columns:90} as const;
export interface CodeLineChange {
  type: 'same' | 'removed' | 'added';
  text: string;
  beforeLine?: number;
  afterLine?: number;
}
export interface CodeModel {
  before: string;
  after: string;
  beforeDisplay: string;
  afterDisplay: string;
  changes: CodeLineChange[];
  added: number;
  removed: number;
  unchanged: number;
  maxLines: number;
  maxColumns: number;
  fontSize: number;
}

export function codeColumns(line: string): number {
  return [...line.replace(/\t/g, '    ')].reduce((width, char) => {
    if (/\p{Mark}/u.test(char)) return width;
    return width + ((char.codePointAt(0) || 0) >= 0x2e80 ? 2 : 1);
  }, 0);
}

function normalizeSnippet(input: string, name: string): string {
  if (input.length > CODE_LIMITS.characters) throw new Error(`${name}: use 6,000 characters or fewer.`);
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(input)) {
    throw new Error(`${name}: remove nonprinting control characters.`);
  }
  const normalized = input.replace(/\r\n?/g, '\n').replace(/\n+$/, '');
  const lines = normalized.split('\n');
  if (lines.length > CODE_LIMITS.lines) throw new Error(`${name}: use 18 lines or fewer.`);
  const longLine = lines.findIndex(line => codeColumns(line) > CODE_LIMITS.columns);
  if (longLine >= 0) throw new Error(`${name}, line ${longLine + 1}: wrap the line to 90 display columns or fewer.`);
  return normalized;
}

export function lineDiff(before: string, after: string): CodeLineChange[] {
  const a = before === '' ? [] : before.split('\n'), b = after === '' ? [] : after.split('\n');
  const lengths = Array.from({length:a.length + 1}, () => Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lengths[i][j] = a[i] === b[j] ? lengths[i + 1][j + 1] + 1 : Math.max(lengths[i + 1][j], lengths[i][j + 1]);
    }
  }
  const changes: CodeLineChange[] = [];
  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      changes.push({type:'same',text:a[i],beforeLine:i + 1,afterLine:j + 1}); i++; j++;
    } else if (i < a.length && (j === b.length || lengths[i + 1][j] >= lengths[i][j + 1])) {
      changes.push({type:'removed',text:a[i],beforeLine:i + 1}); i++;
    } else {
      changes.push({type:'added',text:b[j],afterLine:j + 1}); j++;
    }
  }
  return changes;
}

/** Strings are validated and compared as text. Nothing here evaluates code. */
export function parseCode(beforeInput: string, afterInput?: string): CodeModel {
  if (typeof afterInput !== 'string') throw new Error('Add an after snippet to compare with the before snippet.');
  const before = normalizeSnippet(beforeInput, 'Before');
  const after = normalizeSnippet(afterInput, 'After');
  if (!before.trim() && !after.trim()) throw new Error('Add code to at least one of the two inputs.');
  const beforeDisplay = before.replace(/\t/g, '    '), afterDisplay = after.replace(/\t/g, '    ');
  const displayLines = [...beforeDisplay.split('\n'), ...afterDisplay.split('\n')];
  const maxLines = Math.max(beforeDisplay.split('\n').length, afterDisplay.split('\n').length);
  const maxColumns = Math.max(1, ...displayLines.map(codeColumns));
  const changes = lineDiff(before, after);
  return {
    before, after, beforeDisplay, afterDisplay, changes,
    added:changes.filter(change => change.type === 'added').length,
    removed:changes.filter(change => change.type === 'removed').length,
    unchanged:changes.filter(change => change.type === 'same').length,
    maxLines, maxColumns,
    fontSize:Math.min(25, 790 / (maxColumns * 0.62), 330 / (maxLines * 1.3)),
  };
}
