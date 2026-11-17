import assert from 'node:assert/strict';
import test from 'node:test';
import {validatePreferences} from '../lib/preferences.ts';

const ids = new Set(['parametric-knot', 'standing-wave', 'recipe:trace']);

test('preference imports preserve all three votes and independent notes', () => {
  const input = {
    'parametric-knot': {vote: 1, note: 'The shape makes the relationship clear.'},
    'standing-wave': {vote: -1, note: ''},
    'recipe:trace': {vote: 0, note: 'Keep this note even after clearing the vote.'},
  };
  assert.deepEqual(validatePreferences(JSON.parse(JSON.stringify(input)), ids), input);
});

test('unknown IDs and prototype keys do not become saved preferences', () => {
  const input = JSON.parse('{"parametric-knot":{"vote":1,"note":"✓","userId":"not part of this format"},"retired-scene":null,"__proto__":{"polluted":true},"constructor":{"vote":1,"note":"unknown"}}');
  const result = validatePreferences(input, ids);
  assert.deepEqual(result, {'parametric-knot': {vote: 1, note: '✓'}});
  assert.equal(Object.hasOwn(result, '__proto__'), false);
  assert.equal(Object.hasOwn(result, 'constructor'), false);
  assert.equal(Object.getPrototypeOf(result), Object.prototype);
  assert.equal(Object.hasOwn(Object.prototype, 'polluted'), false);
  assert.notEqual(result['parametric-knot'], input['parametric-knot']);
});

test('a malformed known row rejects the import without mutating its input', () => {
  const badRows = [null, [], 'like', {vote: '1', note: ''}, {vote: true, note: ''},
    {vote: 2, note: ''}, {vote: 0.5, note: ''}, {vote: 1}, {vote: 1, note: null},
    {vote: 1, note: {text: 'nested notes are not supported'}}];
  for (const bad of badRows) {
    const input = {'parametric-knot': {vote: 1, note: 'Already valid'}, 'recipe:trace': bad};
    const before = JSON.stringify(input);
    assert.throws(() => validatePreferences(input, ids), /Invalid/);
    assert.equal(JSON.stringify(input), before);
  }
});

test('note length boundary is enforced without truncating a valid note', () => {
  const note = 'a'.repeat(1200);
  assert.equal(validatePreferences({'recipe:trace': {vote: 0, note}}, ids)['recipe:trace'].note, note);
  assert.throws(() => validatePreferences({'recipe:trace': {vote: 0, note: note + 'a'}}, ids), /1,200/);
});

test('preferences require an object, while an empty collection is valid', () => {
  for (const input of [null, undefined, [], 'text', 1, true]) {
    assert.throws(() => validatePreferences(input, ids), /preferences object/);
  }
  assert.deepEqual(validatePreferences({}, ids), {});
});
