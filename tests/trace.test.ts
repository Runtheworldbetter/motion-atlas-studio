import test from 'node:test';
import assert from 'node:assert/strict';
import {parseTrace, tracePosition, formatTraceTime} from '../lib/recipes/models/trace.ts';

const event = (time:number, actor='Agent', label='An event') => ({time,actor,label});
const input = (events:unknown[]) => JSON.stringify({title:'Synthetic trace',events});

test('trace preserves chronology and stable input order for equal timestamps', () => {
  const model = parseTrace(input([event(8,'Reviewer','Finish'),event(0,'Human','Ask'),event(4,'Agent','First'),event(4,'Agent','Second')]));
  assert.deepEqual(model.events.map(item => item.label),['Ask','First','Second','Finish']);
  assert.deepEqual(model.actors,['Human','Agent','Reviewer']);
  assert.equal(model.start,0);
  assert.equal(model.end,8);
  assert.equal(tracePosition(model,model.events[2]),0.5);
});

test('trace keeps complete labels and details and applies the documented default status', () => {
  const detail = 'Evidence attached to the handoff';
  const model = parseTrace(input([{...event(0),detail},event(1)]));
  assert.equal(model.events[0].detail,detail);
  assert.equal(model.events[0].status,'info');
});

test('equal timestamps remain finite and share a position', () => {
  const model = parseTrace(input([event(5,'One'),event(5,'Two')]));
  assert.equal(model.span,0);
  assert.deepEqual(model.events.map(item => tracePosition(model,item)),[0.5,0.5]);
});

test('trace rejects malformed schema, invalid times, and unknown statuses', () => {
  for (const text of ['{','null','[]','{}',input([event(0)])]) assert.throws(() => parseTrace(text));
  for (const time of [-1,'3',86401,null]) assert.throws(() => parseTrace(input([{time,actor:'A',label:'Test'},event(5)])),/time/);
  assert.throws(() => parseTrace(input([{...event(0),status:'maybe'},event(1)])),/status/);
  assert.throws(() => parseTrace(input([event(0,'   '),event(1)])),/actor/);
});

test('trace bounds events, actor lanes, text, and total input size', () => {
  assert.throws(() => parseTrace(input(Array.from({length:19},(_,i) => event(i)))),/18/);
  assert.throws(() => parseTrace(input(Array.from({length:5},(_,i) => event(i,`Actor ${i}`)))),/4 actors/);
  assert.throws(() => parseTrace(input([event(0,'A','x'.repeat(141)),event(1)])),/140/);
  assert.throws(() => parseTrace(' '.repeat(20001)),/20,000/);
});

test('elapsed time labels retain subsecond precision without pretending to be wall-clock dates', () => {
  assert.equal(formatTraceTime(0),'0s');
  assert.equal(formatTraceTime(0.125),'0.125s');
  assert.equal(formatTraceTime(75),'1m 15s');
});
