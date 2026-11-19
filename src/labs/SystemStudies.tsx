import {useEffect, useId, useMemo, useState} from 'react';
import {
  initialWorkflow, transitionWorkflow, diamondStencil, seedGrid, growGrid, suggestRepairs, applyRepairs,
  graphNeighborhood, DEFAULT_MATRIX, isStochasticMatrix, setMatrixProbability, simulateMarkov,
  type WorkflowEvent, type WorkflowState, type GraphEdge, type Matrix3,
} from '../../lib/explorations/systems';
import './system-studies.css';

const INK='#263a2e', PAPER='#f5f6ef', LIME='#d6edaa', TEAL='#66bfc3', ORANGE='#e5a16b';
const WORKFLOW_NODES: {id:WorkflowState;label:string;x:number;y:number}[] = [
  {id:'draft',label:'Draft',x:80,y:66},{id:'checking',label:'Checking',x:275,y:66},{id:'ready',label:'Ready',x:470,y:66},
  {id:'failed',label:'Failed',x:170,y:224},{id:'timeout',label:'Timed out',x:365,y:224},
  {id:'cancelled',label:'Cancelled',x:80,y:370},{id:'published',label:'Published',x:470,y:370},
];
const WORKFLOW_EDGES = [
  {from:'draft',to:'checking',path:'M135 66H220',label:'SUBMIT',x:177,y:48},
  {from:'checking',to:'ready',path:'M330 66H415',label:'VERIFIED',x:373,y:48},
  {from:'checking',to:'failed',path:'M250 94L187 195',label:'FAIL',x:190,y:147},
  {from:'checking',to:'timeout',path:'M300 94L350 195',label:'after 5s',x:363,y:147},
  {from:'failed',to:'checking',path:'M140 196Q120 115 222 83',label:'RETRY',x:112,y:137},
  {from:'timeout',to:'checking',path:'M397 195Q424 117 328 85',label:'RETRY',x:433,y:137},
  {from:'ready',to:'published',path:'M470 94V341',label:'PUBLISH',x:479,y:280},
];

export function StateMachineStudy() {
  const [model,setModel]=useState(initialWorkflow);
  const [clock,setClock]=useState(false);
  const [trail,setTrail]=useState<{event:string;state:string;accepted:boolean;reason:string}[]>([]);
  const [message,setMessage]=useState('Attach a source, then submit. Try the guard before attaching one.');
  const marker=useId().replace(/:/g,'');
  function send(event:WorkflowEvent) {
    const result=transitionWorkflow(model,event);
    setModel(result.model);setMessage(result.reason);
    setTrail(previous=>event==='RESET'?[]:[...previous,{event,state:result.model.state,accepted:result.accepted,reason:result.reason}].slice(-12));
    if(result.model.state!=='checking')setClock(false);
  }
  useEffect(()=>{
    if(!clock||model.state!=='checking')return;
    const timer=window.setTimeout(()=>{
      const result=transitionWorkflow(model,'TICK');setModel(result.model);setMessage(result.reason);
      setTrail(previous=>[...previous,{event:'TICK',state:result.model.state,accepted:true,reason:result.reason}].slice(-12));
      if(result.model.state!=='checking')setClock(false);
    },1000);
    return()=>window.clearTimeout(timer);
  },[clock,model]);
  const names=Object.fromEntries(WORKFLOW_NODES.map(node=>[node.id,node.label]));
  return <div className="lab-demo systems-study" data-export-state={JSON.stringify({kind:'state-machine',model,trail})}>
    <div className="systems-topline"><span className="systems-kicker">A fictional workshop announcement</span><span className="systems-pill">Current: {names[model.state]}</span></div>
    <div className="lab-controls">
      <label className="lab-field systems-check"><input type="checkbox" checked={model.hasSource} disabled={model.state!=='draft'} onChange={e=>setModel({...model,hasSource:e.target.checked})}/>Source attached</label>
      <button className="lab-button" disabled={model.state!=='draft'} onClick={()=>send('SUBMIT')}>Submit for check</button>
      <button className="lab-button" disabled={model.state!=='checking'} onClick={()=>send('VERIFIED')}>Pass check</button>
      <button className="lab-button" disabled={model.state!=='checking'} onClick={()=>send('FAIL')}>Fail check</button>
      <button className="lab-button" disabled={!['failed','timeout'].includes(model.state)} onClick={()=>send('RETRY')}>Retry ({model.attempts}/3 used)</button>
      <button className="lab-button" disabled={model.state!=='ready'} onClick={()=>send('PUBLISH')}>Publish</button>
      <button className="lab-button" disabled={['cancelled','published'].includes(model.state)} onClick={()=>send('CANCEL')}>Cancel</button>
      <button className="lab-button" onClick={()=>{setClock(false);send('RESET');}}>Reset</button>
    </div>
    <div className="lab-canvas systems-scroll">
      <svg data-export="true" fontFamily="system-ui, sans-serif" className="systems-workflow" viewBox="0 0 550 425" role="img" aria-label={`Workflow diagram. Current state ${names[model.state]}. Submit requires a source; retry allows fewer than three attempts; checking times out after five simulated seconds.`}>
        <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill={INK}/></marker></defs>
        <rect width="550" height="425" rx="18" fill={PAPER}/>
        {WORKFLOW_EDGES.map(edge=><g key={edge.label+edge.from}><path d={edge.path} fill="none" stroke={model.state===edge.from?TEAL:'#bbc8b8'} strokeWidth={model.state===edge.from?3:2} markerEnd={`url(#${marker})`}/><text x={edge.x} y={edge.y} textAnchor="middle" fontSize="14" fill={INK}>{edge.label}</text></g>)}
        <path d="M80 95V339" fill="none" stroke="#c3aa91" strokeWidth="2" strokeDasharray="5 5" markerEnd={`url(#${marker})`}/>
        <text x="32" y="264" fontSize="14" fill="#865d3b">CANCEL</text><text x="22" y="285" fontSize="14" fill="#865d3b">any open state</text>
        {WORKFLOW_NODES.map(node=><g key={node.id}><rect x={node.x-57} y={node.y-28} width="114" height="56" rx="14" fill={model.state===node.id?LIME:'#e7ecdf'} stroke={model.state===node.id?INK:'#b5c4b1'} strokeWidth={model.state===node.id?3:1.5}/><text x={node.x} y={node.y+6} textAnchor="middle" fontSize="18" fontWeight="650" fill={INK}>{node.label}</text></g>)}
        <rect x="228" y="107" width="94" height="6" rx="3" fill="#dbe4d5"/><rect x="228" y="107" width={94*model.elapsed/5} height="6" rx="3" fill={ORANGE}/>
      </svg>
    </div>
    <div className="lab-controls systems-clock"><strong>Check window: {model.elapsed}/5 seconds</strong><button className="lab-button" disabled={model.state!=='checking'} onClick={()=>send('TICK')}>Advance 1 second</button><button className={`lab-button ${clock?'is-active':''}`} disabled={model.state!=='checking'} onClick={()=>setClock(!clock)}>{clock?'Pause clock':'Run clock'}</button></div>
    <p className="lab-insight" aria-live="polite">{message}</p>
    <div className="systems-rules"><span>Guard: source attached</span><span>Retry guard: attempts &lt; 3</span><span>Delay: 5 seconds without a result</span></div>
    {trail.length>0&&<ol className="systems-trail" aria-label="Event trail">{trail.map((item,index)=><li key={index} className={item.accepted?'':'systems-blocked'} title={item.reason}><b>{item.event}</b><span>{item.accepted?names[item.state]:'Guard blocked'}</span></li>)}</ol>}
    <p className="lab-note">Original example inspired by <a href="https://stately.ai/blog/2026-03-26-introducing-stately-sketch" target="_blank" rel="noreferrer">Stately’s interactive simulation</a>. The clock runs only when you start it.</p>
  </div>;
}

const GRID_SIZE=13;
const STENCIL=diamondStencil(GRID_SIZE,5);
export function RepairStudy() {
  const [grid,setGrid]=useState<boolean[]>(()=>[...STENCIL]);
  const [damaged,setDamaged]=useState(false),[growing,setGrowing]=useState(false),[proposing,setProposing]=useState(false);
  const [selected,setSelected]=useState<number[]>([]),[focused,setFocused]=useState(84),[generation,setGeneration]=useState(5);
  const [message,setMessage]=useState('Remove a few cells, inspect the suggestions, and choose which repairs to apply.');
  const id=useId().replace(/:/g,'');
  const suggestions=useMemo(()=>proposing?suggestRepairs(grid,STENCIL,GRID_SIZE):[],[grid,proposing]);
  const candidates=new Set(suggestions.map(s=>s.index));
  useEffect(()=>{
    if(!growing||damaged)return;
    const next=growGrid(grid,STENCIL,GRID_SIZE);
    if(next.every((v,i)=>v===grid[i])){setGrowing(false);return;}
    const timer=window.setTimeout(()=>{setGrid(next);setGeneration(g=>g+1);},400);
    return()=>window.clearTimeout(timer);
  },[growing,damaged,grid]);
  function damage(index:number) {
    setFocused(index);
    if(candidates.has(index)){setSelected(previous=>previous.includes(index)?previous.filter(i=>i!==index):[...previous,index]);return;}
    if(!grid[index])return;
    setGrid(previous=>previous.map((v,i)=>i===index?false:v));setDamaged(true);setGrowing(false);setProposing(false);setSelected([]);setMessage('Cell removed. Suggestions will use the current neighbours, not a remembered image.');
  }
  function gap() {setGrid(previous=>previous.map((alive,i)=>Math.abs(i%13-6)<=1&&Math.abs(Math.floor(i/13)-6)<=1?false:alive));setDamaged(true);setGrowing(false);setProposing(false);setSelected([]);setMessage('A central gap is ready to inspect. The unsupported centre will need another review after its neighbours return.');}
  function startSeed(){setGrid(seedGrid(13));setDamaged(false);setGrowing(false);setProposing(false);setSelected([]);setGeneration(0);setMessage('Growth rule: an empty stencil cell grows if at least one orthogonal neighbour is alive.');}
  function apply(){const next=applyRepairs(grid,STENCIL,13,selected);const count=next.filter((alive,i)=>alive&&!grid[i]).length;setGrid(next);setSelected([]);setProposing(false);setMessage(`Applied ${count} selected repair${count===1?'':'s'}. Other empty cells remain unchanged. Propose again to inspect new support.`);}
  return <div className="lab-demo systems-study" data-export-state={JSON.stringify({kind:'local-rule-repair',size:13,grid,stencil:STENCIL,generation,damaged,suggestions,selected})}>
    <div className="systems-topline"><span className="systems-kicker">Local rules, visible support</span><span className="systems-pill">{grid.filter(Boolean).length}/{STENCIL.filter(Boolean).length} stencil cells alive</span></div>
    <div className="lab-controls"><button className="lab-button" onClick={startSeed}>Start from seed</button><button className="lab-button" disabled={damaged||growing} onClick={()=>{setGrid(growGrid(grid,STENCIL,13));setGeneration(g=>g+1);}}>Grow one step</button><button className={`lab-button ${growing?'is-active':''}`} disabled={damaged} onClick={()=>setGrowing(!growing)}>{growing?'Pause growth':'Play growth'}</button><button className="lab-button" onClick={gap}>Make a gap</button><button className="lab-button" disabled={!damaged} onClick={()=>{setProposing(true);setSelected([]);setMessage('Candidates need two live orthogonal neighbours and must be inside the visible stencil. Support is a count, not a learned probability.');}}>Propose repairs</button><button className="lab-button" disabled={!selected.length} onClick={apply}>Apply selected ({selected.length})</button><button className="lab-button" onClick={()=>{setGrid([...STENCIL]);setDamaged(false);setGrowing(false);setProposing(false);setSelected([]);setGeneration(5);setMessage('Restored the original stencil.');}}>Restore</button></div>
    <div className="systems-repair-layout">
      <div className="lab-canvas systems-grid-wrap"><svg data-export="true" fontFamily="system-ui, sans-serif" className="systems-grid" viewBox="0 0 416 416" role="grid" tabIndex={0} aria-label="Repair grid. Arrow keys choose a cell. Enter removes a live cell or toggles a suggested repair." aria-rowcount={13} aria-colcount={13} aria-activedescendant={`${id}-${focused}`} onKeyDown={event=>{const delta:Record<string,number>={ArrowLeft:-1,ArrowRight:1,ArrowUp:-13,ArrowDown:13};if(event.key in delta){event.preventDefault();setFocused(i=>Math.max(0,Math.min(168,i+delta[event.key])));}if(event.key==='Enter'||event.key===' '){event.preventDefault();damage(focused);}}}>
        <rect width="416" height="416" fill={PAPER} rx="18"/>
        {Array.from({length:13},(_,y)=><g key={y} role="row">{Array.from({length:13},(_,x)=>{const i=y*13+x,chosen=selected.includes(i),candidate=candidates.has(i),distance=Math.abs(x-6)+Math.abs(y-6);return <rect key={i} id={`${id}-${i}`} role="gridcell" aria-label={`Row ${y+1}, column ${x+1}: ${grid[i]?'alive':candidate?'suggested repair':STENCIL[i]?'empty stencil cell':'outside stencil'}`} aria-selected={chosen} x={x*30+14} y={y*30+14} width="27" height="27" rx="5" fill={grid[i]?(distance%2===0?TEAL:LIME):chosen?ORANGE:candidate?'#f2ddbf':STENCIL[i]?'#e5e9de':'#f0f1e9'} stroke={focused===i?INK:chosen?'#a6612c':candidate?ORANGE:STENCIL[i]?'#c2cfbb':'none'} strokeWidth={focused===i?3:1.5} strokeDasharray={!grid[i]&&!chosen&&STENCIL[i]?'3 2':undefined} onClick={()=>damage(i)}/>;})}</g>)}
      </svg></div>
      <div className="systems-repair-inspector"><h4>Review before applying</h4><p className="lab-note">Tap a live cell to remove it. Keyboard: focus the grid, use arrow keys, then Enter. Orange cells are proposed; checked cells are approved.</p>
        <div className="systems-support-rule"><b>Repair rule</b><span>Inside stencil + at least 2 live orthogonal neighbours</span></div>
        {proposing?<div className="systems-suggestions">{suggestions.length?suggestions.map(s=><label key={s.index} className="systems-suggestion"><input type="checkbox" checked={selected.includes(s.index)} onChange={()=>setSelected(previous=>previous.includes(s.index)?previous.filter(i=>i!==s.index):[...previous,s.index])}/><span><b>Cell {Math.floor(s.index/13)+1}, {s.index%13+1}</b><small>{s.reason}</small></span><strong>{s.support}/{s.possible}</strong></label>):<p>No cells meet the support rule. Restore the stencil or add support by reviewing a different gap.</p>}</div>:<p className="lab-note">No repair is selected automatically. “Propose repairs” explains eligible candidates.</p>}
      </div>
    </div>
    <p className="lab-insight" aria-live="polite">{message}</p>
    <p className="lab-note">An original deterministic stencil model, inspired by the damage-and-regrowth interaction in <a href="https://distill.pub/2020/growing-ca/" target="_blank" rel="noreferrer">Distill’s Growing Neural Cellular Automata</a>. This example has no neural network, training or learned healing.</p>
  </div>;
}

const GRAPH_NODES=[
  {id:'garden',label:'Garden',x:270,y:220,detail:'The shared growing space connects water, soil and people.'},
  {id:'water',label:'Water',x:110,y:140,detail:'Irrigation depends on storage and supply.'},
  {id:'soil',label:'Soil',x:430,y:140,detail:'Soil is supported by compost and seasonal planting.'},
  {id:'compost',label:'Compost',x:535,y:250,detail:'Food scraps become an input to healthy soil.'},
  {id:'kitchen',label:'Kitchen',x:535,y:375,detail:'The kitchen receives produce and returns organic waste.'},
  {id:'market',label:'Market',x:360,y:390,detail:'A community outlet for harvested produce.'},
  {id:'seeds',label:'Seeds',x:430,y:40,detail:'Seeds connect seasonal knowledge to the soil.'},
  {id:'school',label:'School',x:105,y:340,detail:'School visits connect the garden to learning.'},
  {id:'workshop',label:'Workshop',x:270,y:65,detail:'Workshops share practical growing skills.'},
  {id:'tools',label:'Tools',x:270,y:440,detail:'Shared tools support garden and school activities.'},
  {id:'library',label:'Library',x:65,y:440,detail:'A library hosts learning materials and community sessions.'},
  {id:'tank',label:'Rain tank',x:65,y:35,detail:'Stored rain supplies the irrigation system.'},
];
const GRAPH_EDGES:GraphEdge[]=[
  {source:'garden',target:'water',explanation:'The garden uses irrigation water.'},{source:'garden',target:'soil',explanation:'The growing beds depend on soil.'},
  {source:'garden',target:'market',explanation:'The market distributes garden produce.'},{source:'garden',target:'school',explanation:'The school visits the garden.'},
  {source:'garden',target:'workshop',explanation:'Workshops share skills used in the garden.'},{source:'garden',target:'tools',explanation:'Shared tools maintain the garden.'},
  {source:'water',target:'tank',explanation:'The rain tank supplies stored irrigation water.'},{source:'soil',target:'compost',explanation:'Compost adds organic matter to the soil.'},
  {source:'soil',target:'seeds',explanation:'Seeds are planted in prepared soil.'},{source:'compost',target:'kitchen',explanation:'The kitchen sends suitable food scraps to compost.'},
  {source:'kitchen',target:'market',explanation:'The kitchen sources produce through the market.'},{source:'school',target:'library',explanation:'The library supports school learning sessions.'},
  {source:'school',target:'tools',explanation:'School activities use the shared tools.'},{source:'seeds',target:'workshop',explanation:'Seed-saving is a workshop topic.'},
];
export function NeighborhoodStudy() {
  const [selected,setSelected]=useState('garden'),[hops,setHops]=useState(1),[query,setQuery]=useState(''),[edgeIndex,setEdgeIndex]=useState<number|null>(null);
  const focused=useMemo(()=>graphNeighborhood(selected,hops,GRAPH_EDGES),[selected,hops]);
  const node=GRAPH_NODES.find(n=>n.id===selected)!;
  const matches=query.trim()?GRAPH_NODES.filter(n=>(n.label+' '+n.detail).toLowerCase().includes(query.toLowerCase())):[];
  const edges=GRAPH_EDGES.map((edge,index)=>({...edge,index})).filter(edge=>edge.source===selected||edge.target===selected);
  function select(id:string){setSelected(id);setEdgeIndex(null);}
  const label=(id:string)=>GRAPH_NODES.find(n=>n.id===id)?.label||id;
  return <div className="lab-demo systems-study" data-export-state={JSON.stringify({kind:'neighborhood',selected,hops,query,nodes:GRAPH_NODES,edges:GRAPH_EDGES,focused:[...focused],selectedEdge:edgeIndex})}>
    <div className="systems-topline"><span className="systems-kicker">A fictional community ecosystem</span><span className="systems-pill">{focused.size} of {GRAPH_NODES.length} nodes in focus</span></div>
    <div className="lab-controls"><label className="lab-field">Find a connection<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try rain, seeds or learning"/></label><div className="systems-segment" role="group" aria-label="Neighbourhood depth">{[1,2].map(n=><button key={n} className={`lab-button ${hops===n?'is-active':''}`} onClick={()=>setHops(n)}>{n} hop{n>1?'s':''}</button>)}</div><button className="lab-button" onClick={()=>{select('garden');setHops(1);setQuery('');}}>Reset focus</button></div>
    {query&&<div className="systems-search-results" aria-live="polite">{matches.length?matches.map(n=><button className="lab-button" key={n.id} onClick={()=>select(n.id)}>{n.label}</button>):<span>No matching nodes. Try “soil” or “school”.</span>}</div>}
    <div className="systems-network-layout"><div className="lab-canvas systems-scroll"><svg data-export="true" fontFamily="system-ui, sans-serif" className="systems-network" viewBox="0 0 600 490" role="group" aria-label={`Community network. ${node.label} selected, ${hops}-hop neighbours highlighted. All node labels remain visible.`}>
      <rect width="600" height="490" rx="18" fill={PAPER}/>
      {GRAPH_EDGES.map((edge,index)=>{const a=GRAPH_NODES.find(n=>n.id===edge.source)!,b=GRAPH_NODES.find(n=>n.id===edge.target)!,active=focused.has(a.id)&&focused.has(b.id);return <g key={index}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={edgeIndex===index?ORANGE:active?'#80a38c':'#dce2d6'} strokeWidth={edgeIndex===index?5:active?2.5:1.5}/><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth="18" onClick={()=>setEdgeIndex(index)}><title>{edge.explanation}</title></line></g>;})}
      {GRAPH_NODES.map(n=><g key={n.id} role="button" tabIndex={0} aria-label={`Select ${n.label}`} aria-pressed={selected===n.id} className="systems-svg-button" onClick={()=>select(n.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(n.id);}}}><circle cx={n.x} cy={n.y} r={selected===n.id?24:17} fill={selected===n.id?TEAL:focused.has(n.id)?LIME:'#e3e7dc'} stroke={selected===n.id?INK:focused.has(n.id)?'#819b76':'#b9c6b2'} strokeWidth={selected===n.id?3:1.5}/><text x={n.x} y={n.y+37} textAnchor="middle" fontSize="17" fontWeight={selected===n.id?750:550} fill={focused.has(n.id)?INK:'#74816f'}>{n.label}</text></g>)}
    </svg></div><aside className="systems-network-inspector"><h4>{node.label}</h4><p>{node.detail}</p><p className="lab-note">One hop is one direct connection. Two hops also include your neighbours’ neighbours. Links here are undirected relationships.</p><h5>Direct connections</h5><div className="systems-edge-list">{edges.map(edge=><button key={edge.index} className={`systems-edge-button ${edgeIndex===edge.index?'is-active':''}`} onClick={()=>setEdgeIndex(edge.index)}><b>{label(edge.source)} · {label(edge.target)}</b><span>{edge.explanation}</span></button>)}</div></aside></div>
    <p className="lab-insight" aria-live="polite">{edgeIndex!==null?GRAPH_EDGES[edgeIndex].explanation:`${node.label} and its ${hops}-hop neighbourhood are highlighted. Unrelated nodes stay labelled so you keep your bearings.`}</p>
    <p className="lab-note">Original graph and data, inspired by <a href="https://www.sigmajs.org/how-to/interactivity/hover-search/" target="_blank" rel="noreferrer">Sigma’s search and neighbourhood focus</a>. Select any node by mouse or keyboard; connection explanations also have buttons.</p>
  </div>;
}

const MARKOV_NAMES=['Explore','Make','Rest'];
const MARKOV_COLORS=[TEAL,LIME,ORANGE];
const STORAGE_KEY='motion-atlas-markov-study-v1';
function readMarkov():{matrix:Matrix3;seed:number;steps:number} {
  const fallback={matrix:DEFAULT_MATRIX.map(row=>[...row]) as Matrix3,seed:42,steps:0};
  try {const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(value?.version===1&&isStochasticMatrix(value.matrix)&&Number.isInteger(value.seed)&&value.seed>=0&&value.seed<=4294967295)return {matrix:value.matrix,seed:value.seed,steps:Number.isInteger(value.steps)&&value.steps>=0&&value.steps<=120?value.steps:0};}catch{/* Storage is optional. */}
  return fallback;
}
const MARKOV_POSITIONS=[[90,100],[410,100],[250,300]];
const MARKOV_ROUTES=[
  {i:0,j:0,d:'M62 77C-6 -4 185 -4 118 77',x:90,y:23},{i:1,j:1,d:'M382 77C314 -4 505 -4 438 77',x:410,y:23},{i:2,j:2,d:'M229 329C174 411 326 411 271 329',x:250,y:402},
  {i:0,j:1,d:'M132 85Q250 12 368 85',x:250,y:58},{i:1,j:0,d:'M368 115Q250 188 132 115',x:250,y:151},
  {i:0,j:2,d:'M104 140Q125 245 210 288',x:132,y:237},{i:2,j:0,d:'M215 266Q180 160 128 128',x:201,y:208},
  {i:1,j:2,d:'M396 140Q375 245 290 288',x:368,y:237},{i:2,j:1,d:'M285 266Q320 160 372 128',x:299,y:208},
];
export function MarkovStudy() {
  const [initial]=useState(readMarkov);
  const [matrix,setMatrix]=useState<Matrix3>(initial.matrix),[seed,setSeed]=useState(initial.seed),[steps,setSteps]=useState(initial.steps),[playing,setPlaying]=useState(false);
  const [selection,setSelection]=useState<[number,number]>([0,0]),[saved,setSaved]=useState(true);
  const result=useMemo(()=>simulateMarkov(matrix,steps,seed),[matrix,steps,seed]);
  const current=result.path[result.path.length-1], marker=useId().replace(/:/g,'');
  useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,matrix,seed,steps}));setSaved(true);}catch{setSaved(false);}},[matrix,seed,steps]);
  useEffect(()=>{if(steps>0)setSelection([result.path[result.path.length-2],current]);},[steps,current,result.path]);
  useEffect(()=>{if(!playing)return;if(steps>=120){setPlaying(false);return;}const timer=window.setTimeout(()=>setSteps(s=>s+1),650);return()=>window.clearTimeout(timer);},[playing,steps]);
  function edit(i:number,j:number,value:number){if(!Number.isFinite(value))return;setPlaying(false);setMatrix(previous=>setMatrixProbability(previous,i,j,value/100));setSteps(0);setSelection([i,j]);}
  const visits=MARKOV_NAMES.map((_,i)=>result.path.filter(n=>n===i).length);
  return <div className="lab-demo systems-study" data-export-state={JSON.stringify({kind:'markov',matrix,seed,steps,path:result.path,distribution:result.distribution,selection})}>
    <div className="systems-topline"><span className="systems-kicker">Three states, different rhythms</span><span className="systems-pill">{saved?'Saved on this device':'Storage unavailable · session only'}</span></div>
    <div className="systems-markov-layout"><div className="systems-matrix-panel"><h4>From row · to column</h4><table className="systems-matrix"><thead><tr><th scope="col">From / to</th>{MARKOV_NAMES.map(n=><th scope="col" key={n}>{n}</th>)}</tr></thead><tbody>{matrix.map((row,i)=><tr key={i}><th scope="row">{MARKOV_NAMES[i]}<small>Σ = {(row.reduce((a,b)=>a+b,0)*100).toFixed(0)}%</small></th>{row.map((value,j)=><td key={j} className={selection[0]===i&&selection[1]===j?'is-selected':''}><label><span className="systems-sr-only">{MARKOV_NAMES[i]} to {MARKOV_NAMES[j]}, probability percent</span><input type="number" min="0" max="100" step="5" value={Number((value*100).toFixed(1))} onFocus={()=>setSelection([i,j])} onChange={e=>edit(i,j,Number(e.target.value))}/><span aria-hidden="true">%</span></label></td>)}</tr>)}</tbody></table><p className="lab-note">Edit a probability. The other two cells share the remaining percentage in their existing ratio. If both were zero, they split it equally. Every row stays at 100%.</p><div className="systems-transition-note"><b>{MARKOV_NAMES[selection[0]]} to {MARKOV_NAMES[selection[1]]}</b><span>{(matrix[selection[0]][selection[1]]*100).toFixed(1)}% chance on the next step</span></div></div>
      <div className="lab-canvas systems-scroll"><svg data-export="true" fontFamily="system-ui, sans-serif" className="systems-markov" viewBox="0 0 500 425" role="group" aria-label={`Markov chain. Current state ${MARKOV_NAMES[current]}. Selected transition ${MARKOV_NAMES[selection[0]]} to ${MARKOV_NAMES[selection[1]]}.`}>
        <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill={INK}/></marker></defs><rect width="500" height="425" rx="18" fill={PAPER}/>
        {MARKOV_ROUTES.map(route=>{const active=selection[0]===route.i&&selection[1]===route.j;return <g key={`${route.i}-${route.j}`} role="button" tabIndex={0} className="systems-svg-button" aria-label={`Select ${MARKOV_NAMES[route.i]} to ${MARKOV_NAMES[route.j]}, ${(matrix[route.i][route.j]*100).toFixed(1)} percent`} onClick={()=>setSelection([route.i,route.j])} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelection([route.i,route.j]);}}}><path d={route.d} stroke="transparent" strokeWidth="22" fill="none"/><path d={route.d} stroke={active?TEAL:'#bdcbb7'} strokeWidth={active?4:2} fill="none" markerEnd={`url(#${marker})`}/><rect x={route.x-26} y={route.y-15} width="52" height="23" rx="5" fill={active?'#ddede4':PAPER}/><text x={route.x} y={route.y+2} textAnchor="middle" fontSize="14" fontWeight={active?750:500} fill={INK}>{Math.round(matrix[route.i][route.j]*100)}%</text></g>;})}
        {MARKOV_POSITIONS.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="39" fill={MARKOV_COLORS[i]} stroke={current===i?INK:'#b6c5af'} strokeWidth={current===i?4:1.5}/><text x={x} y={y+6} textAnchor="middle" fontSize="18" fontWeight="700" fill={INK}>{MARKOV_NAMES[i]}</text>{current===i&&<circle cx={x+31} cy={y-30} r="8" fill={INK} stroke={PAPER} strokeWidth="3"/>}</g>)}
      </svg></div></div>
    <div className="lab-controls"><label className="lab-field">Random seed<input type="number" min="0" max="4294967295" value={seed} onChange={e=>{setSeed(Math.max(0,Math.min(4294967295,Math.floor(Number(e.target.value)||0))));setSteps(0);setPlaying(false);}}/></label><button className="lab-button" disabled={playing||steps>=120} onClick={()=>setSteps(s=>s+1)}>One step</button><button className={`lab-button ${playing?'is-active':''}`} disabled={steps>=120} onClick={()=>setPlaying(!playing)}>{playing?'Pause':'Play path'}</button><button className="lab-button" onClick={()=>{setSteps(0);setPlaying(false);}}>Reset path</button><button className="lab-button" onClick={()=>{setMatrix(DEFAULT_MATRIX.map(row=>[...row]) as Matrix3);setSeed(42);setSteps(0);setPlaying(false);}}>Reset all</button><span className="lab-stat">Step {steps}/120</span></div>
    <div className="systems-distributions"><h4>Probability after {steps} step{steps===1?'':'s'} · exact calculation</h4><div className="systems-distribution-rows">{result.distribution.map((p,i)=><div key={i}><b>{MARKOV_NAMES[i]}</b><span className="systems-bar"><span style={{width:`${p*100}%`,background:MARKOV_COLORS[i]}}/></span><strong>{(p*100).toFixed(1)}%</strong><small>{visits[i]} visits in this path</small></div>)}</div></div>
    <div className="systems-path" aria-label="Recent seeded path">{result.path.slice(-18).map((state,index)=><span key={index} style={{background:MARKOV_COLORS[state]}} title={`Step ${Math.max(0,result.path.length-18)+index}: ${MARKOV_NAMES[state]}`}>{MARKOV_NAMES[state]}</span>)}</div>
    <p className="lab-insight">The same matrix and seed reproduce the same path. The bars show all possible paths’ probability at this step; visit counts describe this one random path, including its starting state.</p>
    <p className="lab-note">Original implementation inspired by <a href="https://setosa.io/ev/markov-chains/" target="_blank" rel="noreferrer">Setosa’s linked transition matrix and diagram</a>. Settings and the path position persist locally; playback never starts automatically.</p>
  </div>;
}
