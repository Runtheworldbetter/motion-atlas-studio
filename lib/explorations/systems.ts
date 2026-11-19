export type WorkflowState = 'draft' | 'checking' | 'ready' | 'failed' | 'timeout' | 'cancelled' | 'published';
export type WorkflowEvent = 'SUBMIT' | 'VERIFIED' | 'FAIL' | 'TICK' | 'RETRY' | 'CANCEL' | 'PUBLISH' | 'RESET';
export type Workflow = {state: WorkflowState; attempts: number; elapsed: number; hasSource: boolean};
export type WorkflowResult = {model: Workflow; accepted: boolean; reason: string};
export const initialWorkflow = (): Workflow => ({state: 'draft', attempts: 0, elapsed: 0, hasSource: false});

/** Explicit transition table; no asynchronous effects are hidden in the model. */
export function transitionWorkflow(model: Workflow, event: WorkflowEvent): WorkflowResult {
  const move = (state: WorkflowState, reason: string, changes: Partial<Workflow> = {}): WorkflowResult => ({model: {...model, state, ...changes}, accepted: true, reason});
  const reject = (reason: string): WorkflowResult => ({model: {...model}, accepted: false, reason});
  if (event === 'RESET') return {model: initialWorkflow(), accepted: true, reason: 'Returned to the draft.'};
  if (event === 'CANCEL' && ['draft', 'checking', 'ready', 'failed', 'timeout'].includes(model.state)) return move('cancelled', 'Cancellation closes this run.');
  if (event === 'SUBMIT' && model.state === 'draft') {
    if (!model.hasSource) return reject('Guard blocked: attach a source before submitting.');
    return move('checking', 'Source present; checking begins.', {attempts: 1, elapsed: 0});
  }
  if (event === 'TICK' && model.state === 'checking') {
    const elapsed = Math.min(5, model.elapsed + 1);
    return move(elapsed === 5 ? 'timeout' : 'checking', elapsed === 5 ? 'After 5 seconds without a result, time out.' : 'One simulated second elapsed.', {elapsed});
  }
  if (event === 'VERIFIED' && model.state === 'checking') return move('ready', 'The check passed; publication is now allowed.');
  if (event === 'FAIL' && model.state === 'checking') return move('failed', 'The check returned a failure.');
  if (event === 'RETRY' && ['failed', 'timeout'].includes(model.state)) {
    if (model.attempts >= 3) return reject('Guard blocked: the three-attempt budget is exhausted.');
    return move('checking', 'Retry starts a fresh 5-second window.', {attempts: model.attempts + 1, elapsed: 0});
  }
  if (event === 'PUBLISH' && model.state === 'ready') return move('published', 'Only a verified draft can be published.');
  return reject(`${event} is not available from ${model.state}.`);
}

export function orthogonalNeighbors(index: number, size: number): number[] {
  const x = index % size, y = Math.floor(index / size);
  return [[x-1,y],[x+1,y],[x,y-1],[x,y+1]].filter(([xx,yy]) => xx>=0&&yy>=0&&xx<size&&yy<size).map(([xx,yy])=>yy*size+xx);
}
export function diamondStencil(size = 13, radius = 5): boolean[] {
  const center = Math.floor(size / 2);
  return Array.from({length: size*size}, (_, i) => Math.abs(i%size-center)+Math.abs(Math.floor(i/size)-center)<=radius);
}
export function seedGrid(size = 13): boolean[] {
  return Array.from({length: size*size}, (_, i) => i===Math.floor(size/2)*size+Math.floor(size/2));
}
export function growGrid(grid: readonly boolean[], stencil: readonly boolean[], size: number): boolean[] {
  if (grid.length !== size*size || stencil.length !== grid.length) throw new RangeError('Grid and stencil dimensions must agree.');
  return grid.map((alive, i) => alive || (stencil[i] && orthogonalNeighbors(i,size).some(n=>grid[n])));
}
export type RepairSuggestion = {index: number; support: number; possible: number; reason: string};
export function suggestRepairs(grid: readonly boolean[], stencil: readonly boolean[], size: number): RepairSuggestion[] {
  if (grid.length !== size*size || stencil.length !== grid.length) throw new RangeError('Grid and stencil dimensions must agree.');
  return grid.flatMap((alive,index) => {
    if (alive || !stencil[index]) return [];
    const neighbors=orthogonalNeighbors(index,size), support=neighbors.filter(n=>grid[n]).length;
    return support>=2 ? [{index,support,possible:neighbors.length,reason:`${support}/${neighbors.length} adjacent cells are alive; this cell is inside the stencil.`}] : [];
  }).sort((a,b)=>b.support-a.support||a.index-b.index);
}
/** Revalidate against the current grid and apply only approved indices. */
export function applyRepairs(grid: readonly boolean[], stencil: readonly boolean[], size: number, selected: readonly number[]): boolean[] {
  const allowed=new Set(suggestRepairs(grid,stencil,size).map(s=>s.index));
  const approved=new Set(selected.filter(i=>allowed.has(i)));
  return grid.map((alive,i)=>alive||approved.has(i));
}

export type GraphEdge = {source: string; target: string; explanation: string};
export function graphNeighborhood(start: string, hops: number, edges: readonly GraphEdge[]): Set<string> {
  const seen=new Set([start]); let frontier=[start];
  for(let depth=0;depth<Math.max(0,Math.floor(hops));depth++) {
    const next:string[]=[];
    for(const id of frontier) for(const edge of edges) {
      const other=edge.source===id?edge.target:edge.target===id?edge.source:null;
      if(other!==null&&!seen.has(other)){seen.add(other);next.push(other);}
    }
    frontier=next;
  }
  return seen;
}

export type Matrix3 = [number[], number[], number[]];
export const DEFAULT_MATRIX: Matrix3 = [[.6,.3,.1],[.2,.65,.15],[.35,.15,.5]];
export function normalizeRow(values: readonly number[], fallback = 0): number[] {
  if(values.length!==3||values.some(v=>!Number.isFinite(v)||v<0)||![0,1,2].includes(fallback)) throw new RangeError('Three finite nonnegative weights and a valid fallback state are required.');
  const sum=values.reduce((a,b)=>a+b,0);
  if(sum===0) return [0,1,2].map(i=>i===fallback?1:0);
  return values.map(v=>v/sum);
}
export function isStochasticMatrix(value: unknown): value is Matrix3 {
  return Array.isArray(value)&&value.length===3&&value.every(row=>Array.isArray(row)&&row.length===3&&row.every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1)&&Math.abs(row.reduce((a:number,b:number)=>a+b,0)-1)<1e-9);
}
/** Hold the edited probability fixed; distribute its remainder proportionally. */
export function setMatrixProbability(matrix: Matrix3, row: number, column: number, value: number): Matrix3 {
  if(!isStochasticMatrix(matrix)||![0,1,2].includes(row)||![0,1,2].includes(column)||!Number.isFinite(value)) throw new RangeError('Invalid matrix edit.');
  const p=Math.max(0,Math.min(1,value));
  const others=matrix[row].reduce((sum,v,j)=>sum+(j===column?0:v),0);
  return matrix.map((values,i)=>i!==row?[...values]:values.map((v,j)=>j===column?p:others>0?v/others*(1-p):(1-p)/2)) as Matrix3;
}
export function nextRandom(seed: number): {seed:number; value:number} {
  const next=(Math.imul(seed>>>0,1664525)+1013904223)>>>0;
  return {seed:next,value:next/4294967296};
}
export function multiplyDistribution(distribution: readonly number[], matrix: Matrix3): number[] {
  if(!isStochasticMatrix(matrix)||distribution.length!==3||distribution.some(v=>!Number.isFinite(v)||v<0)||Math.abs(distribution.reduce((a,b)=>a+b,0)-1)>1e-9) throw new RangeError('A normalized distribution and matrix are required.');
  return [0,1,2].map(j=>distribution.reduce((sum,p,i)=>sum+p*matrix[i][j],0));
}
export function simulateMarkov(matrix: Matrix3, steps: number, seed: number, start = 0): {path:number[]; distribution:number[]; seed:number} {
  if(!isStochasticMatrix(matrix)||![0,1,2].includes(start)||!Number.isInteger(steps)||steps<0||steps>10000) throw new RangeError('Invalid Markov simulation.');
  let current=start, randomSeed=seed>>>0;
  let distribution:number[]=[0,1,2].map(i=>i===start?1:0);
  const path=[current];
  for(let step=0;step<steps;step++) {
    const random=nextRandom(randomSeed);randomSeed=random.seed;
    let cumulative=0, chosen=2;
    for(let j=0;j<3;j++){cumulative+=matrix[current][j];if(random.value<cumulative){chosen=j;break;}}
    current=chosen;path.push(current);distribution=multiplyDistribution(distribution,matrix);
  }
  return {path,distribution,seed:randomSeed};
}
