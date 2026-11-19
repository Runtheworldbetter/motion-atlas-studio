import assert from 'node:assert/strict';
import test from 'node:test';
import {
  initialWorkflow, transitionWorkflow, diamondStencil, seedGrid, growGrid, suggestRepairs, applyRepairs,
  orthogonalNeighbors, graphNeighborhood, normalizeRow, setMatrixProbability, isStochasticMatrix,
  simulateMarkov, multiplyDistribution, DEFAULT_MATRIX, type Matrix3,
} from '../lib/explorations/systems.ts';

test('workflow blocks missing evidence and permits a guarded successful run',()=>{
  const draft=initialWorkflow();const blocked=transitionWorkflow(draft,'SUBMIT');
  assert.equal(blocked.accepted,false);assert.deepEqual(blocked.model,draft);
  const checking=transitionWorkflow({...draft,hasSource:true},'SUBMIT').model;
  assert.equal(checking.state,'checking');assert.equal(checking.attempts,1);
  assert.equal(transitionWorkflow(checking,'PUBLISH').accepted,false);
  assert.equal(transitionWorkflow(transitionWorkflow(checking,'VERIFIED').model,'PUBLISH').model.state,'published');
});
test('workflow timeout occurs on the fifth tick, retry resets delay and is bounded',()=>{
  let model=transitionWorkflow({...initialWorkflow(),hasSource:true},'SUBMIT').model;
  for(let i=0;i<4;i++){model=transitionWorkflow(model,'TICK').model;assert.equal(model.state,'checking');}
  model=transitionWorkflow(model,'TICK').model;assert.equal(model.state,'timeout');
  model=transitionWorkflow(model,'RETRY').model;assert.equal(model.elapsed,0);assert.equal(model.attempts,2);
  model=transitionWorkflow(transitionWorkflow(model,'FAIL').model,'RETRY').model;
  model=transitionWorkflow(model,'FAIL').model;
  assert.equal(model.attempts,3);assert.equal(transitionWorkflow(model,'RETRY').accepted,false);
});
test('cancellation is terminal until reset; later timer ticks cannot revive it',()=>{
  const cancelled=transitionWorkflow({...initialWorkflow(),state:'checking'},'CANCEL').model;
  assert.equal(cancelled.state,'cancelled');assert.equal(transitionWorkflow(cancelled,'TICK').accepted,false);
  assert.deepEqual(transitionWorkflow(cancelled,'RESET').model,initialWorkflow());
});
test('growth uses only the previous four-neighbour generation and respects its stencil',()=>{
  const stencil=diamondStencil(7,2),seed=seedGrid(7),next=growGrid(seed,stencil,7);
  assert.equal(next.filter(Boolean).length,5);assert.equal(seed.filter(Boolean).length,1);
  let grid=next;for(let i=0;i<6;i++)grid=growGrid(grid,stencil,7);
  assert.deepEqual(grid,stencil);assert.deepEqual(orthogonalNeighbors(0,7),[1,7]);
});
test('repair suggestions explain support; application changes only selected valid candidates',()=>{
  const stencil=diamondStencil(7,2),grid=[...stencil];grid[24]=false;grid[23]=false;
  const suggestions=suggestRepairs(grid,stencil,7);assert.ok(suggestions.some(s=>s.index===24&&s.support===3));
  const repaired=applyRepairs(grid,stencil,7,[24,0]);
  assert.equal(repaired[24],true);assert.equal(repaired[23],false);assert.equal(repaired[0],false);
  assert.deepEqual(applyRepairs(grid,stencil,7,[]),grid);
  assert.equal(grid[24],false);
});
test('unsupported empty cells are not repair candidates',()=>{
  const grid=seedGrid(7),stencil=diamondStencil(7,2);
  assert.equal(suggestRepairs(grid,stencil,7).length,0);
  assert.throws(()=>growGrid([],stencil,7),RangeError);
});
test('graph focus counts hops without losing cycles or including disconnected nodes',()=>{
  const edges=[['a','b'],['b','c'],['c','a'],['c','d'],['x','y']].map(([source,target])=>({source,target,explanation:''}));
  assert.deepEqual([...graphNeighborhood('a',1,edges)].sort(),['a','b','c']);
  assert.deepEqual([...graphNeighborhood('a',2,edges)].sort(),['a','b','c','d']);
  assert.deepEqual([...graphNeighborhood('alone',2,edges)],['alone']);
});
test('normalization handles weights and a zero row; invalid weights are rejected',()=>{
  assert.deepEqual(normalizeRow([2,3,5]),[.2,.3,.5]);assert.deepEqual(normalizeRow([0,0,0],1),[0,1,0]);
  assert.throws(()=>normalizeRow([1,-1,1]),RangeError);assert.throws(()=>normalizeRow([NaN,1,1]),RangeError);
});
test('matrix edits preserve the requested probability, other proportions and row sums',()=>{
  const changed=setMatrixProbability(DEFAULT_MATRIX,0,0,.2);
  assert.equal(changed[0][0],.2);assert.ok(Math.abs(changed[0][1]/changed[0][2]-3)<1e-10);assert.ok(isStochasticMatrix(changed));
  assert.deepEqual(changed[1],DEFAULT_MATRIX[1]);assert.equal(DEFAULT_MATRIX[0][0],.6);
  const identity:Matrix3=[[1,0,0],[0,1,0],[0,0,1]];
  assert.deepEqual(setMatrixProbability(identity,0,0,.6)[0],[.6,.2,.2]);
  assert.ok(!isStochasticMatrix([[1,1,0],[0,1,0],[0,0,1]]));
});
test('Markov simulation is seeded, conserves mass, and matches known matrix multiplication',()=>{
  const first=simulateMarkov(DEFAULT_MATRIX,80,42),second=simulateMarkov(DEFAULT_MATRIX,80,42);
  assert.deepEqual(first,second);assert.notDeepEqual(first.path,simulateMarkov(DEFAULT_MATRIX,80,43).path);
  assert.equal(first.path.length,81);assert.ok(Math.abs(first.distribution.reduce((a,b)=>a+b,0)-1)<1e-10);
  assert.deepEqual(multiplyDistribution([1,0,0],DEFAULT_MATRIX),DEFAULT_MATRIX[0]);
  assert.ok(first.path.every(n=>n>=0&&n<=2));
});
test('deterministic and absorbing Markov chains follow their specified paths',()=>{
  const cycle:Matrix3=[[0,1,0],[0,0,1],[1,0,0]];
  assert.deepEqual(simulateMarkov(cycle,6,7).path,[0,1,2,0,1,2,0]);
  assert.deepEqual(simulateMarkov(cycle,2,7).distribution,[0,0,1]);
  const absorbing:Matrix3=[[0,0,1],[0,1,0],[0,0,1]];
  assert.deepEqual(simulateMarkov(absorbing,4,7).path,[0,2,2,2,2]);
  assert.throws(()=>simulateMarkov(cycle,-1,42),RangeError);
});
