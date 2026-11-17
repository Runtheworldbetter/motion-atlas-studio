import {Circle, Line, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {createSignal, linear, type ThreadGenerator} from '@motion-canvas/core';
import type {SceneSpec, SceneFactory} from './types';
import {P, stage, label, line, dot, mix, TAU} from './shared';

const C = 'Systems & AI' as const;
export const systemsSpecs:SceneSpec[] = [
  {id:'neural-signal',title:'Signals through a network',category:C,description:'Scripted pulses move through the layers of an example network.',technique:'Scripted pulses · layered graph · reactive signals',tags:['AI','networks','propagation'],color:P.teal},
  {id:'attention-matrix',title:'A causal attention mask',category:C,description:'A causal mask limits each row to the current and earlier tokens. Synthetic weights sum to one in each row.',technique:'Synthetic heatmap · causal masking · row normalization',tags:['AI','heatmaps','attention'],color:P.purple},
  {id:'token-stream',title:'Tokens and possible actions',category:C,description:'An example sentence splits into labeled words, followed by invented probabilities for three actions.',technique:'Staggered typography · illustrative labels · animated bars',tags:['AI','typography','probability'],color:P.orange},
  {id:'agent-handoff',title:'The work changes hands',category:C,description:'A task passes from a human to a planner, specialist, and reviewer.',technique:'Swimlanes · path tracing · state transitions',tags:['agents','workflow','handoff'],color:P.blue},
  {id:'semantic-memory',title:'A context graph',category:C,description:'A highlighted path connects example facts to their source card.',technique:'Preset path · highlighted nodes · example card',tags:['memory','graphs','retrieval'],color:P.lime},
  {id:'causal-graph',title:'Inspection and idle time',category:C,description:'An illustrative diagram links faster inspection to fewer idle days and greater availability.',technique:'Hypothetical relationships · synthetic outcome · directed edges',tags:['causality','systems','explanation'],color:P.pink},
  {id:'sorting-race',title:'Bubble sort and insertion sort',category:C,description:'Bubble sort and insertion sort run on the same array. Their steps are fitted to the same playback duration.',technique:'Computed traces · adjusted playback · swap counts',tags:['algorithms','walkthrough','sorting'],color:P.yellow},
  {id:'pathfinding',title:'A path through the maze',category:C,description:'Breadth-first search explores reachable cells before revealing a shortest route.',technique:'Breadth-first search · grid animation · path reveal',tags:['algorithms','routing','grids'],color:P.teal},
  {id:'binary-search',title:'Cut the search in half',category:C,description:'Each binary-search comparison narrows a sorted array to the half that could contain the target.',technique:'Array state · interval masking · decision steps',tags:['algorithms','search','explanation'],color:P.orange},
  {id:'mesh-network',title:'A packet changes route',category:C,description:'A packet switches between two preset routes when a relay is shown as offline.',technique:'Illustrative state · preset paths · packet motion',tags:['networks','resilience','routing'],color:P.blue},
  {id:'event-pipeline',title:'An event pipeline',category:C,description:'Packets move through ingestion, validation, planning, and execution, with one event sent for review.',technique:'Queue motion · routing branches · synchronized states',tags:['events','automation','workflow'],color:P.purple},
  {id:'vehicle-lifecycle',title:'A vehicle lifecycle',category:C,description:'A vehicle returns from a lease, passes through inspection and service, and begins its next lease.',technique:'Lifecycle path · active states · vector vehicle',tags:['fleet','lifecycle','orchestration'],color:P.lime},
];

function text(view:View2D,value:string,x:number,y:number,size=23,color=P.ink){return label(view,value,x,y,color,size);}
function box(view:View2D,x:number,y:number,w:number,h:number,fill=P.panel,stroke=P.grid,radius=14){const r=new Rect({position:[x,y],size:[w,h],radius,fill,stroke,lineWidth:2});view.add(r);return r;}
function arrow(view:View2D,pts:[number,number][],color=P.muted,width=3){const n=new Line({points:pts,stroke:color,lineWidth:width,lineCap:'round',lineJoin:'round',endArrow:true,arrowSize:12});view.add(n);return n;}
const clamp=(n:number,a=0,b=1)=>Math.min(b,Math.max(a,n));
const fract=(n:number)=>n-Math.floor(n);
function atPath(points:[number,number][],progress:number):[number,number]{const p=clamp(progress)*(points.length-1);const i=Math.min(points.length-2,Math.floor(p));const f=p-i;return [mix(points[i][0],points[i+1][0],f),mix(points[i][1],points[i+1][1],f)];}

const neural:SceneFactory=function*(view){
  stage(view);const t=createSignal(0);const sizes=[4,6,5,4,2];const xs=[-350,-175,0,175,350];
  const nodes=sizes.map((count,k)=>Array.from({length:count},(_,i):[number,number]=>[xs[k],(i-(count-1)/2)*58]));
  for(let k=0;k<nodes.length-1;k++)for(let i=0;i<nodes[k].length;i++)for(let j=0;j<nodes[k+1].length;j++){
    const edge=line(view,[nodes[k][i],nodes[k+1][j]],P.grid,1.4);edge.opacity(.7);
  }
  for(let k=0;k<nodes.length-1;k++)for(let j=0;j<3;j++){
    const a=nodes[k][(j*2+k)%nodes[k].length],b=nodes[k+1][(j+k+1)%nodes[k+1].length];
    view.add(new Circle({size:9,fill:P.teal,position:()=>{const p=fract(t()*2.2-k*.16-j*.2);return [mix(a[0],b[0],p),mix(a[1],b[1],p)];},opacity:()=>.35+.65*Math.sin(Math.PI*fract(t()*2.2-k*.16-j*.2))}));
  }
  nodes.forEach((layer,k)=>layer.forEach((p,i)=>{
    const pulse=()=>Math.pow(Math.max(0,Math.cos((t()*2.2-k*.19-i*.035)*TAU)),6);
    view.add(new Circle({position:p,size:()=>27+15*pulse(),fill:P.bg,stroke:k===4?P.orange:P.teal,lineWidth:()=>2+4*pulse(),opacity:()=>.45+.55*pulse()}));
    view.add(new Circle({position:p,size:()=>9+12*pulse(),fill:k===4?P.orange:P.teal,opacity:()=>.25+.75*pulse()}));
  }));
  text(view,'INPUT',-350,-210,19,P.muted);text(view,'FEATURES',0,-210,19,P.muted);text(view,'OUTPUT',350,-210,19,P.muted);
  label(view,'Scripted network pulses',0,220);yield* t(1,10,linear);
};

const attention:SceneFactory=function*(view){
  stage(view);const t=createSignal(0);const words=['The','car','is','ready','for','its','next','lease'];const size=42,startX=-75,startY=-140;
  text(view,'QUERY',-335,-184,19,P.muted);const current=new Txt({text:()=>words[Math.min(7,Math.floor(t()*8))],position:[-335,-65],fontSize:45,fontFamily:'Arial',fill:P.purple});view.add(current);
  text(view,'looks back',-335,-5,22,P.muted);text(view,'at context',-335,26,22,P.muted);
  for(let row=0;row<8;row++)for(let col=0;col<8;col++){
    const x=startX+col*size,y=startY+row*size;
    const raw=(c:number)=>.18+.82*Math.pow((Math.sin(row*4.6+c*2.7)+1)/2,1.8);
    const total=Array.from({length:row+1},(_,c)=>raw(c)).reduce((a,b)=>a+b,0);
    const weight=col<=row?raw(col)/total:0;
    view.add(new Rect({position:[x,y],size:36,radius:5,fill:col<=row?P.purple:P.muted,opacity:()=>col>row?.025:(.1+.9*weight)*(row===Math.min(7,Math.floor(t()*8))?1:.42)}));
  }
  words.forEach((word,i)=>{text(view,word,startX+i*size,-190,18,P.muted);text(view,word,300,startY+i*size,20,P.muted);});
  view.add(new Rect({position:()=>[startX+3.5*size,startY+Math.min(7,Math.floor(t()*8))*size],size:[8*size-4,size-2],radius:6,stroke:P.purple,lineWidth:2}));
  label(view,'Synthetic weights · each row sums to 1 · causal mask',0,220,P.muted,20);yield* t(1,10,linear);
};

const tokens:SceneFactory=function*(view){
  stage(view);const t=createSignal(0);text(view,'What should this vehicle do next?',0,-188,34);
  const words=['What','should','this','vehicle','do','next','?'];const widths=[92,112,78,128,64,80,42];const total=widths.reduce((a,b)=>a+b,0)+6*12;let xx=-total/2;
  words.forEach((word,i)=>{const x=xx+widths[i]/2;xx+=widths[i]+12;
    const a=()=>clamp(t()*5-i*.16);view.add(new Rect({position:()=>[x,-90+18*(1-a())],size:[widths[i],56],radius:9,fill:P.panel,stroke:P.orange,lineWidth:2,opacity:()=>.3+.7*a()}));
    view.add(new Txt({text:word,position:()=>[x,-90+18*(1-a())],fontSize:23,fill:P.ink,fontFamily:'Arial',opacity:()=>.3+.7*a()}));
    text(view,`T${String(i+1).padStart(2,'0')}`,x,-43,16,P.muted);
  });
  arrow(view,[[0,-12],[0,26]],P.orange);text(view,'Possible next action',-225,61,23,P.muted);
  const options=[['inspect',.64,P.teal],['service',.23,P.blue],['redeploy',.13,P.purple]] as const;
  options.forEach(([name,p,color],i)=>{const y=106+i*43;text(view,name,-260,y,24);box(view,65,y,340,22,P.grid,P.grid,6);view.add(new Rect({position:()=>[-105+170*p*clamp((t()-.18)*2.4),y],size:()=>[340*p*clamp((t()-.18)*2.4),22],radius:6,fill:color}));view.add(new Txt({text:()=>Math.round(100*p*clamp((t()-.18)*2.4))+'%',position:[290,y],fontSize:24,fill:color,fontFamily:'Arial'}));});
  label(view,'Example word labels and probabilities',0,246,P.muted,18);yield* t(1,9,linear);
};

const handoff:SceneFactory=function*(view){
  stage(view);const t=createSignal(0);const ys=[-140,-50,40,130];const names=['Human','Planner','Specialist','Reviewer'];const colors=[P.ink,P.blue,P.teal,P.pink];
  ys.forEach((y,i)=>{text(view,names[i],-346,y,24,colors[i]);line(view,[[-250,y],[390,y]],P.grid,2);});
  const jobs=[{x:-205,y:ys[0],w:86,txt:'Goal'},{x:-75,y:ys[1],w:140,txt:'Plan'},{x:100,y:ys[2],w:152,txt:'Do the work'},{x:284,y:ys[3],w:152,txt:'Check'}];
  const pts:[number,number][]=[[-245,-140],[-160,-140],[-160,-50],[-5,-50],[-5,40],[180,40],[180,130],[365,130]];
  line(view,pts,P.grid,4);view.add(new Line({points:pts,stroke:P.orange,lineWidth:4,lineJoin:'round',end:()=>t(),endArrow:true,arrowSize:12}));
  view.add(new Circle({size:15,fill:P.orange,position:()=>atPath(pts,t())}));
  jobs.forEach((j,i)=>{const b=box(view,j.x,j.y,j.w,52,P.panel,colors[i],10);b.lineWidth(()=>Math.floor(t()*4)===i?4:2);text(view,j.txt,j.x,j.y,21,colors[i]);});
  text(view,'THE WORK TRAIL',0,-215,19,P.muted);label(view,'Goal → plan → action → evidence',0,215);yield* t(1,10,linear);
};

const memory:SceneFactory=function*(view){
  stage(view);const t=createSignal(0);const pts:[number,number][]=[[-205,-25],[-350,-135],[-95,-160],[-355,95],[-100,115],[75,-65],[55,130]];const names=['Vehicle','Lease','Return','Supplier','Inspection','Service','Evidence'];
  const edges=[[0,1],[0,2],[0,3],[0,4],[2,4],[4,5],[5,6],[3,6]];
  edges.forEach(([a,b])=>line(view,[pts[a],pts[b]],P.grid,3));
  const path=[pts[1],pts[0],pts[4],pts[5],pts[6]];view.add(new Line({points:path,stroke:P.lime,lineWidth:4,end:()=>clamp(t()*1.4)}));
  pts.forEach((p,i)=>{view.add(new Circle({position:p,size:i===0?105:85,fill:P.panel,stroke:i===0?P.lime:P.grid,lineWidth:2}));text(view,names[i],p[0],p[1],i===0?24:18,i===0?P.lime:P.ink);});
  box(view,280,5,250,240,P.panel,P.grid,18);text(view,'EXAMPLE FACT',280,-82,17,P.lime);
  text(view,'Lease ends',280,-28,26);text(view,'Friday',280,10,38,P.ink);text(view,'Inspection booked',280,58,19,P.muted);text(view,'Source · event 42',280,95,18,P.muted);
  view.add(new Rect({position:[280,5],size:[250,240],radius:18,stroke:P.lime,lineWidth:2,opacity:()=>clamp((t()-.38)*3)}));
  label(view,'Example graph path and source card',0,220);yield* t(1,10,linear);
};

const causal:SceneFactory=function*(view){
  stage(view);const t=createSignal(0);const nodes:[number,number,string][]=[[-310,-105,'Inspection'],[0,-105,'Idle days'],[310,-105,'Availability'],[-155,85,'Capacity'],[155,85,'Demand']];
  arrow(view,[[-235,-105],[-95,-105]],P.pink);arrow(view,[[90,-105],[225,-105]],P.pink);arrow(view,[[-155,45],[-30,-65]],P.muted);arrow(view,[[155,45],[285,-65]],P.muted);
  nodes.forEach(([x,y,name],i)=>{box(view,x,y,i<3?176:155,70,P.panel,i<3?P.pink:P.grid,14);text(view,name,x,y,23,i<3?P.ink:P.muted);});
  const p=()=>clamp((t()-.16)*1.5);box(view,-275,132,218,52,P.panel,P.teal,26);text(view,'Faster inspection',-275,132,19,P.teal);
  view.add(new Circle({position:()=>[mix(-220,225,p()),-105],size:14,fill:P.pink,opacity:()=>t()<.85?1:0}));
  text(view,'Illustrative outcome',220,139,19,P.muted);view.add(new Txt({text:()=>`${Math.round(8-5*p())} idle days`,position:[220,179],fontSize:32,fill:P.teal,fontFamily:'Arial'}));
  text(view,'INSPECTION AND IDLE TIME',0,-210,19,P.muted);label(view,'Hypothetical relationships and values',0,235,P.muted,19);yield* t(1,10,linear);
};

type SortFrame={values:number[];a:number;b:number;swaps:number};
function sortingFrames(kind:'bubble'|'insertion'){
  const values=[8,3,10,2,7,4,9,1,6,5],frames:SortFrame[]=[{values:[...values],a:-1,b:-1,swaps:0}];let swaps=0;
  const record=(a:number,b:number)=>frames.push({values:[...values],a,b,swaps});
  if(kind==='bubble'){for(let n=values.length-1;n>0;n--)for(let i=0;i<n;i++){if(values[i]>values[i+1]){[values[i],values[i+1]]=[values[i+1],values[i]];swaps++;}record(i,i+1);}}
  else {for(let i=1;i<values.length;i++){let j=i;while(j>0&&values[j-1]>values[j]){[values[j-1],values[j]]=[values[j],values[j-1]];swaps++;record(j-1,j);j--;}record(j,j);}}
  frames.push({values:[...values],a:-1,b:-1,swaps});return frames;
}
const sorting:SceneFactory=function*(view){
  stage(view);const t=createSignal(0);const traces=[sortingFrames('bubble'),sortingFrames('insertion')];const names=['Bubble sort','Insertion sort'];const colors=[P.yellow,P.teal];
  traces.forEach((frames,k)=>{const bottom=k===0?-30:178;const get=()=>frames[Math.min(frames.length-1,Math.floor(t()*frames.length))];text(view,names[k],-302,bottom-152,25,colors[k]);
    line(view,[[-375,bottom],[375,bottom]],P.grid,2);
    for(let i=0;i<10;i++){const x=-315+i*70;view.add(new Rect({position:()=>[x,bottom-get().values[i]*10/2],size:()=>[48,get().values[i]*10],radius:6,fill:()=>get().a===i||get().b===i?colors[k]:P.muted,opacity:()=>get().a===i||get().b===i?1:.65}));view.add(new Txt({text:()=>String(get().values[i]),position:[x,bottom+19],fontSize:20,fill:P.ink,fontFamily:'Arial'}));}
    view.add(new Txt({text:()=>`${get().swaps} swaps`,position:[280,bottom-152],fontSize:22,fill:P.muted,fontFamily:'Arial'}));
  });label(view,'Steps fitted to the same playback duration',0,240,P.muted,19);yield* t(1,11,linear);
};

function bfs(){const cols=15,rows=9;const key=(x:number,y:number)=>y*cols+x;const walls=new Set<number>();for(let y=0;y<7;y++)walls.add(key(4,y));for(let y=2;y<9;y++)walls.add(key(9,y));for(let x=1;x<4;x++)walls.add(key(x,5));for(let x=11;x<14;x++)walls.add(key(x,6));const start=key(0,4),goal=key(14,4),queue=[start],seen=new Set([start]),parent=new Map<number,number>();let pos=0;while(pos<queue.length){const n=queue[pos++];if(n===goal)break;const x=n%cols,y=Math.floor(n/cols);for(const [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]){const xx=x+dx,yy=y+dy,nn=key(xx,yy);if(xx<0||xx>=cols||yy<0||yy>=rows||walls.has(nn)||seen.has(nn))continue;seen.add(nn);parent.set(nn,n);queue.push(nn);}}const path=[goal];while(path[0]!==start&&parent.has(path[0]))path.unshift(parent.get(path[0])!);return {cols,rows,walls,start,goal,queue,path};}
const pathfinding:SceneFactory=function*(view){
  stage(view);const t=createSignal(0);const map=bfs();const step=40;const xy=(i:number):[number,number]=>[-280+(i%15)*step,-170+Math.floor(i/15)*step];
  for(let i=0;i<map.cols*map.rows;i++){const visit=map.queue.indexOf(i),route=map.path.indexOf(i);view.add(new Rect({position:xy(i),size:34,radius:5,fill:()=>i===map.start?P.orange:i===map.goal?P.pink:map.walls.has(i)?'#3c4b52':route>=0&&t()>.72&&route/Math.max(1,map.path.length-1)<(t()-.72)/.28?P.teal:visit>=0&&visit/map.queue.length<t()/.72?P.blue:P.panel,opacity:()=>map.walls.has(i)?1:visit>=0&&visit/map.queue.length<t()/.72?.9:.65}));}
  text(view,'S',...xy(map.start),22,P.bg);text(view,'G',...xy(map.goal),22,P.bg);
  text(view,'BREADTH-FIRST SEARCH',0,-222,20,P.muted);view.add(new Txt({text:()=>t()<.72?'Explore reachable cells':'Trace a shortest route',position:[0,218],fontSize:23,fill:()=>t()<.72?P.blue:P.teal,fontFamily:'Arial'}));yield* t(1,11,linear);
};

const binary:SceneFactory=function*(view){
  stage(view);const t=createSignal(0);const values=[2,5,8,12,16,23,38,47,56,72,81,93],target=72;const steps:{lo:number;hi:number;mid:number;message:string}[]=[];let lo=0,hi=values.length-1;while(lo<=hi){const mid=Math.floor((lo+hi)/2);steps.push({lo,hi,mid,message:values[mid]===target?'Found 72':values[mid]<target?`${values[mid]} < 72 · search right`:`${values[mid]} > 72 · search left`});if(values[mid]===target)break;if(values[mid]<target)lo=mid+1;else hi=mid-1;}
  const state=()=>steps[Math.min(steps.length-1,Math.floor(t()*steps.length))];text(view,'Find 72',0,-165,42,P.orange);text(view,'A sorted list lets us discard half the candidates',0,-106,22,P.muted);
  for(let i=0;i<values.length;i++){const x=-352+i*64;view.add(new Rect({position:[x,0],size:[55,70],radius:9,fill:()=>i===state().mid?P.orange:P.panel,stroke:()=>i===state().mid?P.orange:P.grid,lineWidth:2,opacity:()=>i>=state().lo&&i<=state().hi?1:.23}));view.add(new Txt({text:String(values[i]),position:[x,0],fontSize:25,fill:()=>i===state().mid?P.bg:P.ink,fontFamily:'Arial',opacity:()=>i>=state().lo&&i<=state().hi?1:.23}));}
  view.add(new Line({points:()=>[[-352+state().mid*64,85],[-352+state().mid*64,47]],stroke:P.orange,lineWidth:3,endArrow:true,arrowSize:12}));
  view.add(new Txt({text:()=>state().message,position:[0,135],fontSize:29,fill:P.orange,fontFamily:'Arial'}));label(view,'Compare the midpoint. Keep the relevant half.',0,218);yield* t(1,9,linear);
};

const mesh:SceneFactory=function*(view){
  stage(view);const t=createSignal(0);const pts:[number,number][]=[[-355,0],[-170,-125],[-170,125],[40,-125],[40,125],[235,0],[370,0]];const links=[[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[3,4],[5,6]];
  links.forEach(([a,b])=>{const l=line(view,[pts[a],pts[b]],P.grid,4);l.opacity(()=>t()>.42&&(a===3||b===3)?.25:1);});
  const upper=[pts[0],pts[1],pts[3],pts[5],pts[6]],lower=[pts[0],pts[2],pts[4],pts[5],pts[6]];
  view.add(new Line({points:()=>t()<.42?upper:lower,stroke:()=>t()<.42?P.blue:P.teal,lineWidth:4}));
  pts.forEach((p,i)=>{view.add(new Circle({position:p,size:i===0||i===6?58:42,fill:P.panel,stroke:()=>i===3&&t()>.42?P.pink:i===0||i===6?P.ink:P.blue,lineWidth:3,opacity:()=>i===3&&t()>.42?.45:1}));if(i===3)view.add(new Txt({text:()=>t()>.42?'×':'',position:p,fontSize:36,fill:P.pink,fontFamily:'Arial'}));});
  view.add(new Circle({position:()=>atPath(t()<.42?upper:lower,t()<.42?fract(t()*5):fract((t()-.42)*3.5)),size:16,fill:()=>t()<.42?P.blue:P.teal}));
  text(view,'SEND',-355,63,19,P.muted);text(view,'RECEIVE',370,63,19,P.muted);view.add(new Txt({text:()=>t()<.42?'Relay route available':'Relay offline · alternate route',position:[0,-205],fontSize:25,fill:()=>t()<.42?P.blue:P.teal,fontFamily:'Arial'}));label(view,'Example with two preset routes',0,215);yield* t(1,11,linear);
};

const pipeline:SceneFactory=function*(view){
  stage(view);const t=createSignal(0);const xs=[-325,-110,105,320],names=['Ingest','Validate','Plan','Execute'],colors=[P.blue,P.purple,P.teal,P.lime];
  for(let i=0;i<3;i++)arrow(view,[[xs[i]+73,-35],[xs[i+1]-78,-35]],P.grid,3);
  arrow(view,[[-110,18],[-110,132],[70,132]],P.orange,3);
  box(view,155,132,165,65,P.panel,P.orange,12);text(view,'Review',155,132,24,P.orange);
  xs.forEach((x,i)=>{box(view,x,-35,150,90,P.panel,colors[i],15);text(view,names[i],x,-35,24,colors[i]);text(view,String(i+1).padStart(2,'0'),x,-115,18,P.muted);});
  for(let n=0;n<6;n++){const flagged=n===2;const p=()=>fract(t()*1.5+n/6);const points:[number,number][]=flagged?[[-430,-35],[-110,-35],[-110,132],[155,132]]:[[-430,-35],[-325,-35],[-110,-35],[105,-35],[320,-35],[430,-35]];view.add(new Rect({position:()=>atPath(points,p()),size:14,radius:4,fill:flagged?P.orange:P.teal,rotation:()=>p()*90,opacity:()=>p()<.03||p()>.97?.3:1}));}
  text(view,'EVENT → DECISION → ACTION',0,-205,22,P.muted);label(view,'The flagged event goes to review',0,225);yield* t(1,10,linear);
};

const lifecycle:SceneFactory=function*(view){
  stage(view);const t=createSignal(0);const pts:[number,number][]=[[-330,-100],[-110,-100],[110,-100],[330,-100],[330,110],[110,110],[-110,110],[-330,110],[-330,-100]];
  line(view,pts,P.grid,5);view.add(new Line({points:pts,stroke:P.lime,lineWidth:5,end:()=>t(),lineJoin:'round'}));
  const places:[number,number,string,number][]=[[-330,-100,'Lease',0],[-110,-100,'Return',1],[110,-100,'Inspect',2],[330,-100,'Service',3],[110,110,'Redeploy',5],[-330,110,'Next lease',7]];
  places.forEach(([x,y,name,idx])=>{view.add(new Circle({position:[x,y],size:22,fill:()=>t()>=idx/8?P.lime:P.muted}));text(view,name,x,y+(y<0?-42:44),24,idx===5?P.lime:P.ink);});
  const car=new Rect({position:()=>atPath(pts,t()),size:[64,34],radius:10,fill:P.lime,stroke:P.bg,lineWidth:3});view.add(car);car.add(new Rect({size:[23,24],radius:4,fill:P.bg}));
  text(view,'VEHICLE LIFECYCLE',0,-217,20,P.muted);text(view,'Lease → return → inspect → service → redeploy',0,220,22,P.muted);yield* t(1,12,linear);
};

export const systemsScenes:Record<string,SceneFactory>={
  'neural-signal':neural,'attention-matrix':attention,'token-stream':tokens,'agent-handoff':handoff,
  'semantic-memory':memory,'causal-graph':causal,'sorting-race':sorting,'pathfinding':pathfinding,
  'binary-search':binary,'mesh-network':mesh,'event-pipeline':pipeline,'vehicle-lifecycle':lifecycle,
};
