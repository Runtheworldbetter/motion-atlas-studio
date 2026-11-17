import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCode,lineDiff,codeColumns} from '../lib/recipes/models/code.ts';
import {fitText,textUnits,wrapLabel} from '../lib/recipes/models/text.ts';

test('line diff reconstructs both original snippets without losing repeated lines', () => {
  const before='a\nb\na\nc',after='a\na\nd\nc';
  const changes=lineDiff(before,after);
  assert.equal(changes.filter(c=>c.type!=='added').map(c=>c.text).join('\n'),before);
  assert.equal(changes.filter(c=>c.type!=='removed').map(c=>c.text).join('\n'),after);
  assert.equal(changes.filter(c=>c.type==='removed').length,1);
  assert.equal(changes.filter(c=>c.type==='added').length,1);
});

test('pure additions, deletions, and unchanged snippets retain correct counts', () => {
  assert.equal(parseCode('','hello()').added,1);
  assert.equal(parseCode('hello()','').removed,1);
  const same=parseCode('a\nb','a\nb');
  assert.equal(same.added,0);assert.equal(same.removed,0);assert.equal(same.unchanged,2);
});

test('user code remains literal text and is never evaluated', () => {
  const source='globalThis.__motionRecipeExecuted = true;';
  const result=parseCode(source,'<script>throw new Error("no")</script>');
  assert.equal(result.before,source);
  assert.equal(result.after,'<script>throw new Error("no")</script>');
  assert.equal('__motionRecipeExecuted' in globalThis,false);
});

test('CRLF normalizes consistently while tabs are retained in data and expanded only for display', () => {
  const model=parseCode('def run():\r\n\treturn 1\r\n','def run():\n    return 2');
  assert.equal(model.before,'def run():\n\treturn 1');
  assert.equal(model.beforeDisplay,'def run():\n    return 1');
  assert.equal(codeColumns('\tA'),5);
  assert.equal(codeColumns('車'),2);
});

test('code validates both inputs and bounds lines, columns, bytes, and control characters', () => {
  assert.throws(()=>parseCode('x'),/after snippet/);
  assert.throws(()=>parseCode('',''),/at least one/);
  assert.throws(()=>parseCode(Array(19).fill('x').join('\n'),'x'),/18 lines/);
  assert.throws(()=>parseCode('x'.repeat(91),'x'),/90 display/);
  assert.throws(()=>parseCode('車'.repeat(46),'x'),/90 display/);
  assert.throws(()=>parseCode('x'.repeat(6001),'x'),/6,000/);
  assert.throws(()=>parseCode('x\u0000','y'),/control characters/);
});

test('code fits the declared viewport for largest accepted snippets', () => {
  const source=Array(18).fill('x'.repeat(90)).join('\n');
  const model=parseCode(source,source);
  assert.ok(model.fontSize>=14);
  assert.ok(model.fontSize*model.maxColumns*.62<=790.001);
  assert.ok(model.fontSize*model.maxLines*1.3<=330.001);
});

test('canvas labels truncate wide text while full model data stays available', () => {
  const fitted=fitText('WWWWWWWWWWWWWWWWWW',100,20);
  assert.ok(fitted.endsWith('…'));
  assert.ok(textUnits(fitted)*20<=100);
  const wrapped=wrapLabel('Customer receipts and expansion revenue',100,18);
  assert.ok(wrapped.split('\n').length<=2);
  assert.ok(wrapped.split('\n').every(line=>textUnits(line)*18<=100));
});
