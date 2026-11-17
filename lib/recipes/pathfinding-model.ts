export interface Maze {
  width: number;
  height: number;
  cells: string[];
  start: number;
  goal: number;
}
export interface BfsStep {
  current: number;
  distance: number;
  visited: number[];
  frontier: number[];
  added: number[];
}
export interface BfsResult {
  maze: Maze;
  steps: BfsStep[];
  path: number[];
  distance: number | null;
  parents: (number | null)[];
}

export function parseMaze(input: string): Maze {
  const lines = input.trim().split(/\r?\n/).map(line => line.trim().toUpperCase());
  if (lines.length < 2 || lines.length > 16) throw new Error('Use 2–16 rows in the maze.');
  const width = lines[0].length;
  if (width < 2 || width > 24) throw new Error('Use 2–24 columns in the maze.');
  for (let row = 0; row < lines.length; row++) {
    if (lines[row].length !== width) throw new Error(`Row ${row + 1} has ${lines[row].length} characters; every row must have ${width}.`);
    if (/[^SG#.]/.test(lines[row])) throw new Error(`Row ${row + 1} contains an unsupported character. Use S, G, #, and . only.`);
  }
  const cells = lines.join('').split('');
  if (cells.filter(cell => cell === 'S').length !== 1) throw new Error('The maze needs exactly one S (start).');
  if (cells.filter(cell => cell === 'G').length !== 1) throw new Error('The maze needs exactly one G (goal).');
  return {width, height: lines.length, cells, start: cells.indexOf('S'), goal: cells.indexOf('G')};
}

/** Real unit-cost BFS, with deterministic right/down/left/up tie breaking. */
export function solveMaze(maze: Maze): BfsResult {
  const {width, height, cells, start, goal} = maze;
  const parents: (number | null)[] = Array(cells.length).fill(null);
  const distances = Array<number>(cells.length).fill(-1);
  distances[start] = 0;
  const queue = [start], visited: number[] = [], steps: BfsStep[] = [];
  let head = 0, found = false;
  while (head < queue.length) {
    const current = queue[head++];
    visited.push(current);
    const added: number[] = [];
    if (current === goal) found = true;
    else {
      const x = current % width, y = Math.floor(current / width);
      for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const nx = x + dx, ny = y + dy, next = ny * width + nx;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height || cells[next] === '#' || distances[next] !== -1) continue;
        distances[next] = distances[current] + 1;
        parents[next] = current;
        queue.push(next); added.push(next);
      }
    }
    steps.push({current, distance: distances[current], visited: [...visited], frontier: queue.slice(head), added});
    if (found) break;
  }
  const path: number[] = [];
  if (found) {
    let current: number | null = goal;
    while (current !== null) {path.unshift(current); current = parents[current];}
  }
  return {maze, steps, path, distance: found ? distances[goal] : null, parents};
}

export function cellCoordinates(maze: Maze, index: number): string {
  return `(${Math.floor(index / maze.width) + 1}, ${index % maze.width + 1})`;
}
