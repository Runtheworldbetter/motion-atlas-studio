import {Line, Rect, Txt} from '@motion-canvas/2d';
import {createSignal, linear, waitFor} from '@motion-canvas/core';
import {P, label, stage} from '../motion/shared';
import type {RecipeDefinition} from './types';
import {cellCoordinates, parseMaze, solveMaze} from './pathfinding-model.ts';

const examples = [
  {id: 'detour', name: 'A short detour', description: 'The shortest route bends around several walls.', input: '###########\n#S..#....G#\n#.#.#.###.#\n#.#...#...#\n#.#####.#.#\n#.......#.#\n###########'},
  {id: 'openings', name: 'Find the openings', description: 'Two long walls force a journey through their gaps.', input: '....#..........\n....#..........\n....#....#.....\n....#....#.....\nS...#....#....G\n.####....#.....\n....#....#.###.\n.........#.....\n.........#.....'},
  {id: 'open', name: 'Open field', description: 'See why BFS expands in distance layers.', input: '.............\n.S...........\n.............\n.........G...\n.............'},
  {id: 'blocked', name: 'No route', description: 'An unreachable goal is a valid result, not an error.', input: '###########\n#S...#...G#\n#....#....#\n#....#....#\n###########'},
];

export const pathfindingRecipe: RecipeDefinition = {
  id: 'pathfinding', title: 'Explore a shortest path', subtitle: 'Edit a maze. Follow the search.',
  description: 'Edit the text grid, then watch a real breadth-first search explore its queue and reconstruct a shortest route.',
  inputLabel: 'Maze', inputFormat: 'Text grid', accept: '.txt,text/plain', color: P.teal,
  examples,
  help: 'Use S for the start, G for the goal, # for a wall, and . for an open cell. Include exactly one S and one G. All rows must have the same width: 2–24 columns and 2–16 rows. Movement is one cell up/down/left/right, with equal cost. Coordinates below are (row, column), starting at 1.',
  basis: 'Actual breadth-first search on an unweighted grid. A cell enters the queue once; cells are expanded in increasing distance. Neighbors are considered right, down, left, up. Search stops when G is removed from the queue; parent links reconstruct a shortest path.',
  compile(input) {
    const result = solveMaze(parseMaze(input));
    const {maze, steps, path, distance} = result;
    const format = (index: number) => cellCoordinates(maze, index);
    const explorationTime = Math.min(12, Math.max(5, steps.length * .085));
    const duration = explorationTime + (path.length ? 1.8 : 0) + 1.4;
    return {
      title: distance === null ? 'This goal is unreachable' : `A shortest route in ${distance} moves`,
      summary: `${maze.width} × ${maze.height} grid · ${steps.length} cells expanded · ${distance === null ? 'no route' : `${distance} moves`}`,
      duration,
      rows: [
        {label: 'Start → goal', value: `${format(maze.start)} → ${format(maze.goal)}`, detail: 'Coordinates are (row, column), starting at 1.'},
        {label: 'Result', value: distance === null ? 'No route exists' : `${distance} moves`, detail: distance === null ? 'Every reachable cell was expanded.' : `Path: ${path.map(format).join(' → ')}`},
        ...steps.map((step, i) => ({label: `Step ${i + 1}`, value: `Expand ${format(step.current)}`, detail: `Distance ${step.distance}; ${step.visited.length} expanded; ${step.frontier.length} queued. ${step.current === maze.goal ? 'Goal reached.' : step.added.length ? `Add ${step.added.map(format).join(', ')}.` : 'No new neighbors.'}`})),
      ],
      factory: function* (view) {
        stage(view);
        const progress = createSignal(0), reveal = createSignal(0), done = createSignal(0);
        const stepSize = Math.min(620 / maze.width, 330 / maze.height, 48);
        const left = -115 - (maze.width - 1) * stepSize / 2;
        const top = -14 - (maze.height - 1) * stepSize / 2;
        const xy = (index: number) => [left + index % maze.width * stepSize, top + Math.floor(index / maze.width) * stepSize] as [number, number];
        const current = () => steps[Math.min(steps.length - 1, Math.floor(progress() * steps.length))];
        const revealed = () => Math.floor(reveal() * Math.max(0, path.length - 1));
        label(view, 'BREADTH-FIRST SEARCH', -110, -225, P.ink, 23);
        maze.cells.forEach((cell, i) => {
          const routeIndex = path.indexOf(i);
          view.add(new Rect({position: xy(i), size: stepSize - 4, radius: Math.min(5, stepSize / 7), fill: () => i === maze.start ? P.lime : i === maze.goal ? P.pink : cell === '#' ? '#3c4b52' : done() && routeIndex >= 0 && routeIndex <= revealed() ? P.teal : current().current === i ? P.yellow : current().frontier.includes(i) ? P.orange : current().visited.includes(i) ? P.blue : P.panel, opacity: () => cell === '#' || i === maze.start || i === maze.goal || current().current === i ? 1 : current().frontier.includes(i) || current().visited.includes(i) ? .8 : .55}));
        });
        if (path.length) view.add(new Line({points: path.map(xy), stroke: P.ink, lineWidth: Math.max(2, stepSize * .08), lineCap: 'round', lineJoin: 'round', end: reveal, opacity: done}));
        for (const [index, text] of [[maze.start, 'S'], [maze.goal, 'G']] as const) view.add(new Txt({text, position: xy(index), fontFamily: 'Arial', fontWeight: 700, fontSize: Math.max(13, stepSize * .48), fill: P.bg}));
        view.add(new Rect({position: [335, -15], size: [180, 325], radius: 14, fill: P.panel}));
        label(view, 'QUEUED', 335, -140, P.orange, 17);
        view.add(new Txt({text: () => String(current().frontier.length), position: [335, -104], fontFamily: 'Arial', fontSize: 39, fill: P.orange}));
        label(view, 'EXPANDED', 335, -43, P.blue, 17);
        view.add(new Txt({text: () => String(current().visited.length), position: [335, -7], fontFamily: 'Arial', fontSize: 39, fill: P.blue}));
        label(view, 'SHORTEST ROUTE', 335, 53, P.muted, 14);
        view.add(new Txt({text: () => done() ? distance === null ? 'No route' : `${distance} moves` : 'Searching', position: [335, 90], fontFamily: 'Arial', fontSize: 24, fill: () => done() ? distance === null ? P.pink : P.teal : P.muted}));
        view.add(new Txt({text: () => done() ? distance === null ? 'All reachable cells explored · the goal is isolated' : 'Shortest route reconstructed from parent links' : `Expand ${format(current().current)} · discover ${current().added.length} new ${current().added.length === 1 ? 'cell' : 'cells'}`, position: [0, 203], fontFamily: 'Arial', fontSize: 20, fill: P.ink}));
        label(view, 'ORANGE: QUEUED     BLUE: EXPANDED     TEAL: ROUTE', 0, 239, P.muted, 16);
        yield* progress(1, explorationTime, linear);
        done(1);
        if (path.length) yield* reveal(1, 1.8, linear);
        yield* waitFor(1.4);
      },
    };
  },
};
