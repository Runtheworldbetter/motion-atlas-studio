import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCsv,parseWaterfall,waterfallFraction} from '../lib/recipes/models/waterfall.ts';

const csv = (changes:number[],opening=100) => 'label,value,type\nOpening,'+opening+',start\n'+changes.map((value,i) => `Change ${i},${value},change`).join('\n')+'\nClosing,,total';

test('CSV quoted fields preserve commas, escaped quotes, newlines, and empty trailing fields', () => {
  assert.deepEqual(parseCsv('label,value,type\r\n"Payroll, benefits",-8,change\r\n"A ""quoted"" label",,total\r\n'),[
    ['label','value','type'],['Payroll, benefits','-8','change'],['A "quoted" label','','total'],
  ]);
  assert.deepEqual(parseCsv('"two\nlines",2,change'),[['two\nlines','2','change']]);
  assert.deepEqual(parseCsv('a,b,'),[['a','b','']]);
});

test('CSV rejects unterminated or malformed quoting', () => {
  assert.throws(() => parseCsv('"missing,2,start'),/closing quote/);
  assert.throws(() => parseCsv('"a"oops,2,start'),/closing CSV quote/);
  assert.throws(() => parseCsv('a"b,2,start'),/whole CSV field/);
});

test('changes conserve a running total, including a negative closing balance', () => {
  const model = parseWaterfall(csv([-31,-8,9,-2],24));
  assert.equal(model.opening,24);
  assert.equal(model.netChange,-32);
  assert.equal(model.closing,-8);
  assert.deepEqual(model.rows.map(row => row.cumulative),[24,-7,-15,-6,-8,-8]);
  assert.equal(model.rows.at(-1)?.start,0);
  assert.equal(model.rows.at(-1)?.end,-8);
});

test('subtotal checkpoints do not get added a second time', () => {
  const model = parseWaterfall('label,value,type\nOpening,100,start\nGrowth,20,change\nSubtotal,120,total\nLoss,-30,change\nClosing,90,total');
  assert.equal(model.closing,90);
  assert.equal(model.netChange,-10);
  assert.equal(model.rows[3].start,120);
  assert.throws(() => parseWaterfall('label,value,type\nOpening,100,start\nGrowth,20,change\nClosing,130,total'),/does not reconcile/);
});

test('fractional arithmetic accepts a correctly rounded declared total', () => {
  const model = parseWaterfall('label,value,type\nOpening,0.1,start\nChange,0.2,change\nClosing,0.3,total');
  assert.ok(Math.abs(model.closing-0.3)<1e-15);
});

test('zero and negative domains produce finite in-bounds ordered positions', () => {
  for (const model of [parseWaterfall(csv([0],0)),parseWaterfall(csv([-8,3],-10)),parseWaterfall(csv([-30,20],10))]) {
    const values = [...new Set([model.minimum,0,model.maximum])].sort((a,b) => a-b);
    const positions = values.map(value => waterfallFraction(model,value));
    assert.ok(positions.every(value => Number.isFinite(value) && value >= 0 && value <= 1));
    for(let i=1;i<positions.length;i++) assert.ok(positions[i] >= positions[i-1]);
  }
});

test('conservation and bar continuity hold across varied signed change sequences', () => {
  for(let seed=1;seed<=60;seed++) {
    const opening=seed-30;
    const changes=Array.from({length:6},(_,i) => ((seed*(i+7)*13)%83)-41);
    const model=parseWaterfall(csv(changes,opening));
    assert.equal(model.closing,opening+changes.reduce((a,b)=>a+b,0));
    for(let i=1;i<model.rows.length-1;i++) assert.equal(model.rows[i].start,model.rows[i-1].cumulative);
  }
});

test('waterfall rejects missing structure, excess rows, nonfinite values, and overflow', () => {
  assert.throws(() => parseWaterfall('label,value\nOpen,2'),/header/);
  assert.throws(() => parseWaterfall('label,value,type\nOpen,2,total\nChange,3,change\nClose,,total'),/first/);
  assert.throws(() => parseWaterfall('label,value,type\nOpen,2,start\nChange,3,change\nClose,5,change'),/last/);
  for(const value of ['NaN','Infinity','0x10','1e999','']) assert.throws(() => parseWaterfall(`label,value,type\nOpen,2,start\nChange,${value},change\nClose,,total`));
  assert.throws(() => parseWaterfall(csv(Array(11).fill(1))),/12/);
  assert.throws(() => parseWaterfall(csv([1e308],1e308)),/number range/);
});
