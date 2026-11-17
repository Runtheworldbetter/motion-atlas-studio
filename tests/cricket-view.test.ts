import assert from 'node:assert/strict';
import test from 'node:test';
import {cricketViewFromParams, patchCricketView, readCricketView, setCricketViewParams} from '../lib/recipes/models/cricket-view.ts';

test('a mode change preserves custom poses and camera direction', () => {
  const input = {title: 'My edited swing', frames: [{grip: [42, -40]}], handedness: 'left', mirror: true, contactHold: 3};
  const changed = JSON.parse(patchCricketView(JSON.stringify(input), {handedness: 'right'}));
  assert.deepEqual(changed, {...input, handedness: 'right'});
  assert.deepEqual(input.frames, [{grip: [42, -40]}]);
});

test('invalid documents are not replaced when a mode control is used', () => {
  for (const input of ['{', 'null', '[]', 'true']) assert.throws(() => patchCricketView(input, {handedness: 'left'}), /JSON/);
  for (const input of ['{', 'null', '[]', '{"handedness":"maybe"}', '{"mirror":"false"}']) assert.equal(readCricketView(input), null);
  assert.deepEqual(readCricketView('{}'), {handedness: 'right', mirror: false});
});

test('shared links restore handedness and camera direction independently', () => {
  for (const handedness of ['left', 'right'] as const) for (const mirror of [false, true]) {
    const params = new URLSearchParams('recipe=cricket&example=drive-contact');
    setCricketViewParams(params, {handedness, mirror});
    assert.equal(params.get('recipe'), 'cricket');
    assert.equal(params.get('example'), 'drive-contact');
    assert.deepEqual(cricketViewFromParams(new URLSearchParams(params.toString())), {handedness, mirror});
  }
  assert.deepEqual(cricketViewFromParams(new URLSearchParams('handedness=wrong&mirror=yes')), {});
  assert.deepEqual(cricketViewFromParams(new URLSearchParams('handedness=left')), {handedness: 'left'});
});
