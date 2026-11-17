import assert from 'node:assert/strict';
import test from 'node:test';
import {parseMaze, solveMaze} from '../lib/recipes/pathfinding-model.ts';

test('BFS finds the known shortest detour and respects walls', () => {
  const result = solveMaze(parseMaze('S..\n##.\n..G'));
  assert.equal(result.distance, 4);
  assert.deepEqual(result.path, [0, 1, 2, 5, 8]);
  assert.ok(result.path.every(index => result.maze.cells[index] !== '#'));
});
test('each cell is queued and expanded at most once, in increasing distance', () => {
  const result = solveMaze(parseMaze('S..\n...\n..G'));
  const expanded = result.steps.map(s => s.current);
  const discovered = [result.maze.start, ...result.steps.flatMap(s => s.added)];
  assert.equal(new Set(expanded).size, expanded.length);
  assert.equal(new Set(discovered).size, discovered.length);
  assert.equal(result.distance, 4);
  result.steps.forEach((step, i) => {if (i) assert.ok(step.distance >= result.steps[i - 1].distance);});
  for (let i = 1; i < result.path.length; i++) {
    const a = result.path[i - 1], b = result.path[i];
    assert.equal(Math.abs(a % 3 - b % 3) + Math.abs(Math.floor(a / 3) - Math.floor(b / 3)), 1);
    assert.equal(result.parents[b], a);
  }
});
test('unreachable goal returns no path rather than a fabricated route', () => {
  const result = solveMaze(parseMaze('S#G\n###\n...'));
  assert.equal(result.distance, null);
  assert.deepEqual(result.path, []);
  assert.equal(result.steps.length, 1);
  assert.deepEqual(result.steps[0].frontier, []);
});
test('parser rejects malformed dimensions, symbols, and endpoints', () => {
  for (const input of ['S.G', 'S.\n..G', 'SS\n.G', '..\n.G', 'SG\n.?', 'S' + '.'.repeat(24) + '\nG' + '.'.repeat(24)]) assert.throws(() => parseMaze(input));
});
test('CRLF and lower-case endpoints are accepted consistently', () => {
  const maze = parseMaze('s..\r\n..g');
  assert.equal(maze.start, 0);
  assert.equal(maze.goal, 5);
  assert.equal(solveMaze(maze).distance, 3);
});
