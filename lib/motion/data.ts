import {Circle, Line, Rect, Txt} from '@motion-canvas/2d';
import {createSignal, linear, easeInOutCubic, waitFor} from '@motion-canvas/core';
import type {SceneFactory,SceneSpec} from './types';
import {P,stage,label,grid,line,TAU,mix,v} from './shared';
import {histogramCounts,histogramObservations} from './gallery-models.ts';
const colors=[P.teal,P.lime,P.orange,P.blue,P.pink,P.purple];
const spec=(id:string,title:string,description:string,technique:string,tags:string[],color:string):SceneSpec=>({id,title,category:'Data stories',description,technique,tags,color});
export const dataSpecs:SceneSpec[]=[
 spec('bar-race','The leaderboard keeps moving','Watch five categories overtake each other as the same dataset changes through time.','Reactive bars · animated rank · number interpolation',['charts','competition','business'],P.lime),
 spec('flow-ribbons','Follow the flow','Colored streams make a many-to-many allocation visible at a glance.','Cubic ribbon geometry · travelling particles',['flows','systems','business'],P.teal),
 spec('radial-progress','Three rhythms of progress','Concentric rings reveal milestones moving at very different speeds.','Animated arcs · counters · circular composition',['radial','minimal','dashboards'],P.orange),
 spec('distribution','A distribution takes shape','Seeded synthetic observations arrive one by one; every arrival increments its actual bin count.','Seeded observations · arrival-derived counts',['statistics','particles','learning'],P.purple),
 spec('scatter-migration','When clusters drift','Follow three populations as their centers move through a shared space.','Reactive coordinates · clusters · connecting trails',['statistics','spatial','learning'],P.blue),
 spec('treemap','Space tells the story','A fixed area keeps rebalancing as the relative weight of each group changes.','Nested rectangles · proportional layout · signals',['composition','business','geometric'],P.lime),
 spec('chord-flow','Everything is connected','Read reciprocal movement between five groups around a circular map.','Curved links · circular layout · directional particles',['networks','radial','flows'],P.pink),
 spec('cohort-heatmap','Patterns in a grid','Rows arrive in sequence, revealing how each cohort changes over time.','Color interpolation · staggered cells · matrix layout',['charts','patterns','business'],P.teal),
 spec('uncertainty-band','Sketching a forecast range','An authored center line and widening bounds demonstrate how to draw a forecast-range illustration.','Authored bounds · progressive curve · range encoding',['statistics','charts','business'],P.blue),
 spec('waterfall','How we got here','Build a total one positive and negative contribution at a time.','Cumulative arithmetic · animated bars · connectors',['charts','business','storytelling'],P.orange),
 spec('scenario-fan','One start. Three futures.','Compare three illustrative trajectories branching from the same history.','Signal-driven paths · dashed lines · coordinated labels',['storytelling','business','charts'],P.purple),
 spec('live-sparkline','Signals in the noise','Three live-looking traces turn a compact dashboard into a moving instrument.','Sliding windows · periodic functions · number signals',['dashboards','minimal','waves'],P.teal),
];
export const dataScenes:Record<string,SceneFactory>={
 'bar-race':function*(view){stage(view);const t=createSignal(0);const starts=[42,68,51,83,61],ends=[96,63,86,72,91];const names=['ALPHA','BETA','GAMMA','DELTA','EPSILON'];const val=(i:number)=>mix(starts[i],ends[i],t());
 const rank=(i:number)=>starts.map((_,j)=>j).sort((a,b)=>val(b)-val(a)||a-b).indexOf(i);
 // Keep each item in its true ranked row. Fade through a near-tie instead of
 // moving two full-width bars and their labels through the same space.
 const visibility=(i:number)=>{const gap=Math.min(...starts.map((_,j)=>j===i?Infinity:Math.abs(val(j)-val(i))));const q=Math.min(1,gap/1.5);return q*q*(3-2*q);};
 for(let i=0;i<5;i++){const y=()=>-152+70*rank(i),opacity=()=>visibility(i);view.add(new Rect({x:()=>-220+val(i)*2.7,y,width:()=>val(i)*5.4,height:44,radius:6,fill:colors[i],opacity}));view.add(new Txt({text:names[i],x:-325,y,fontSize:21,fill:P.ink,fontFamily:'Arial',opacity}));view.add(new Txt({text:()=>Math.round(val(i)).toString(),x:()=>-195+val(i)*5.4,y,fontSize:23,fill:colors[i],fontFamily:'Arial',opacity}));}
 label(view,'ILLUSTRATIVE CATEGORY INDEX',0,216);yield* t(1,7,easeInOutCubic);yield* waitFor(1);yield* t(0,2,easeInOutCubic);
 },
 'flow-ribbons':function*(view){stage(view);const t=createSignal(0);const ys=[-138,0,138];const target=[-120,25,144];const names=['SOURCE A','SOURCE B','SOURCE C'];const dest=['DIRECT','REVIEW','ESCALATE'];const routes=[[0,0,44],[0,1,18],[1,0,22],[1,1,36],[1,2,14],[2,1,20],[2,2,40]];
 const path=(a:number,b:number,p:number)=>{const s=p*p*(3-2*p);return v(mix(-260,260,p),mix(ys[a],target[b],s));};
 routes.forEach(([a,b,w],idx)=>{view.add(new Line({points:Array.from({length:65},(_,i)=>path(a,b,i/64)),stroke:colors[a],lineWidth:w,opacity:.18,lineCap:'round'}));for(let k=0;k<4;k++)view.add(new Circle({position:()=>path(a,b,(t()+k/4+idx*.08)%1),size:8,fill:colors[a]}));});
 ys.forEach((y,i)=>{view.add(new Rect({position:[-275,y],size:[18,70],radius:4,fill:colors[i]}));label(view,names[i],-355,y,P.ink,20);view.add(new Rect({position:[275,target[i]],size:[18,70],radius:4,fill:colors[(i+2)%6]}));label(view,dest[i],354,target[i],P.ink,20);});label(view,'WHERE EACH UNIT GOES',0,218);yield* t(3,10,linear);
 },
 'radial-progress':function*(view){stage(view);const t=createSignal(0);const goals=[.87,.64,.42],names=['Coverage','Completion','Efficiency'];for(let i=0;i<3;i++){view.add(new Circle({position:[-120,0],size:330-i*75,stroke:P.grid,lineWidth:25}));view.add(new Circle({position:[-120,0],size:330-i*75,stroke:colors[i],lineWidth:25,startAngle:-90,endAngle:()=>-90+360*goals[i]*(.3+.7*t()),lineCap:'round'}));view.add(new Circle({position:[167,-80+i*80],size:12,fill:colors[i]}));label(view,names[i],275,-94+i*80,P.muted,22);view.add(new Txt({text:()=>Math.round(goals[i]*(.3+.7*t())*100)+'%',position:[260,-58+i*80],fontSize:31,fill:colors[i],fontFamily:'Arial'}));}label(view,'A SHARED GOAL, DIFFERENT PACES',0,218);yield* t(1,5,easeInOutCubic);yield* waitFor(1.3);yield* t(0,2.7,easeInOutCubic);
 },
 'distribution':function*(view){
  stage(view);const t=createSignal(.12);const samples=histogramObservations();
  const final=histogramCounts(samples,samples.length);const unit=270/Math.max(...final);
  const arrived=()=>Math.min(samples.length,Math.floor(t()*samples.length+1e-8));
  const counts=()=>histogramCounts(samples,arrived());
  line(view,[[-390,150],[390,150]],P.muted,2);
  for(let bin=0;bin<15;bin++){
   view.add(new Rect({x:-350+bin*50,y:()=>150-counts()[bin]*unit/2,width:36,height:()=>counts()[bin]*unit,radius:[5,5,0,0],fill:colors[Math.abs(bin-7)%6]}));
   label(view,String(bin+1),-350+bin*50,175,P.muted,14);
  }
  samples.forEach((sample,i)=>{
   const landing=(i+1)/samples.length,flight=.12;
   const u=()=>Math.max(0,Math.min(1,(t()-(landing-flight))/flight));
   const target=150-(sample.previousInBin+.5)*unit;
   view.add(new Circle({x:-350+sample.bin*50+sample.jitter,y:()=>mix(-210,target,u()*u()),size:6,fill:P.ink,opacity:()=>t()>=landing-flight&&t()<landing?0.85:0}));
  });
  view.add(new Txt({text:()=>`${arrived()} / ${samples.length} observations`,x:220,y:-185,fontSize:25,fill:P.ink,fontFamily:'Arial'}));
  label(view,'EACH ARRIVAL ADDS ONE OBSERVATION',0,222,P.muted,20);
  yield* t(1,7,linear);yield* waitFor(2);
 },
 'scatter-migration':function*(view){stage(view);grid(view);const t=createSignal(0);const start=[[-210,80],[100,-90],[215,100]],end=[[-120,-100],[150,100],[250,-75]];for(let k=0;k<3;k++){for(let i=0;i<25;i++){const a=i*2.399,r=18+Math.sqrt(i)*13;const x=Math.cos(a)*r,y=Math.sin(a)*r*.7;line(view,[[start[k][0]+x,start[k][1]+y],[end[k][0]+x,end[k][1]+y]],colors[k]+'25',1);view.add(new Circle({x:()=>mix(start[k][0],end[k][0],t())+x,y:()=>mix(start[k][1],end[k][1],t())+y,size:8+i%4,fill:colors[k],opacity:.85}));}}label(view,'COORDINATED MOTION REVEALS THE GROUPS',0,225);yield* t(1,4,easeInOutCubic);yield* waitFor(1);yield* t(0,4,easeInOutCubic);
 },
 'treemap':function*(view){stage(view);const t=createSignal(0);const a=()=>mix(370,510,t()),b=()=>mix(195,290,t());view.add(new Rect({x:()=>-390+a()/2,y:0,width:()=>a()-8,height:360,fill:P.teal,radius:10}));view.add(new Rect({x:()=>a()/2,y:()=>-180+b()/2,width:()=>780-a()-8,height:()=>b()-8,fill:P.lime,radius:10}));view.add(new Rect({x:()=>a()/2,y:()=>b()/2,width:()=>780-a()-8,height:()=>360-b()-8,fill:P.orange,radius:10}));view.add(new Txt({text:()=>`A\n${Math.round(a()/780*100)}%`,x:()=>-390+a()/2,y:0,fontSize:48,fontFamily:'Arial',fill:P.bg,textAlign:'center'}));view.add(new Txt({text:()=>`B · ${Math.round((780-a())/780*b()/360*100)}%`,x:()=>a()/2,y:()=>-180+b()/2,fontSize:31,fontFamily:'Arial',fill:P.bg}));view.add(new Txt({text:()=>`C · ${100-Math.round(a()/780*100)-Math.round((780-a())/780*b()/360*100)}%`,x:()=>a()/2,y:()=>b()/2,fontSize:30,fontFamily:'Arial',fill:P.bg}));label(view,'PROPORTIONS YOU CAN FEEL',0,225);yield* t(1,4,easeInOutCubic);yield* waitFor(1);yield* t(0,4,easeInOutCubic);
 },
 'chord-flow':function*(view){stage(view);const t=createSignal(0);const N=5,R=170;const point=(i:number)=>v(Math.cos(i/N*TAU-Math.PI/2)*R,Math.sin(i/N*TAU-Math.PI/2)*R);const path=(a:number,b:number,p:number)=>{const p0=point(a),p1=point(b);return v((1-p)**2*p0.x+p*p*p1.x,(1-p)**2*p0.y+p*p*p1.y)};for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){view.add(new Line({points:Array.from({length:50},(_,k)=>path(i,j,k/49)),stroke:colors[i],opacity:.17,lineWidth:5+(j-i)*4}));view.add(new Circle({position:()=>path(i,j,(t()+j*.17)%1),size:9,fill:colors[i]}));view.add(new Circle({position:()=>path(i,j,1-(t()+i*.13+.4)%1),size:7,fill:colors[j]}));}for(let i=0;i<N;i++){const p=point(i);view.add(new Circle({position:p,size:52,fill:colors[i]}));label(view,String.fromCharCode(65+i),p.x,p.y,P.bg,25);}label(view,'MOVEMENT BETWEEN FIVE GROUPS',0,226);yield* t(3,10,linear);
 },
 'cohort-heatmap':function*(view){stage(view);const t=createSignal(0);for(let r=0;r<6;r++){label(view,'Group '+(r+1),-360,-145+r*56,P.muted,22);for(let c=0;c<9;c++){const n=Math.min(1,Math.max(.09,1-c*.085-r*.035+Math.sin(c+r)*.08));view.add(new Rect({position:[-225+c*69,-145+r*56],size:[59,46],radius:6,fill:P.teal,opacity:()=>Math.min(n,Math.max(.06,t()*1.8-(r+c)*.075))}));}}for(let c=0;c<9;c++)label(view,String(c+1),-225+c*69,-194,P.muted,19);label(view,'PERIOD →    ·    BRIGHTER = HIGHER RETENTION',0,226);yield* t(1,5,linear);yield* waitFor(4);
 },
 'uncertainty-band':function*(view){stage(view);grid(view);const t=createSignal(.1);const fn=(p:number)=>70-150*p+25*Math.sin(p*9);const px=(p:number)=>-370+740*p;view.add(new Line({points:()=>{const n=70,pts=[];for(let i=0;i<=n;i++){const p=i/n*t();pts.push(v(px(p),fn(p)-(15+p*75)));}for(let i=n;i>=0;i--){const p=i/n*t();pts.push(v(px(p),fn(p)+(15+p*75)));}return pts;},closed:true,fill:'#82acff24'}));view.add(new Line({points:()=>Array.from({length:100},(_,i)=>{const p=i/99*t();return v(px(p),fn(p));}),lineWidth:4,stroke:P.blue,lineCap:'round'}));view.add(new Circle({position:()=>v(px(t()),fn(t())),size:14,fill:P.ink}));label(view,'AUTHORED RANGE · ILLUSTRATIVE BOUNDS',0,225);label(view,'FORECAST DESIGN EXAMPLE',-210,-182,P.muted,19);yield* t(1,6,linear);yield* waitFor(3);
 },
 'waterfall':function*(view){stage(view);const t=createSignal(0);const contributions=[55,25,-18,32,-14];const total=contributions.reduce((sum,value)=>sum+value,0);const changes=[...contributions,total];const names=['START','GROWTH','COST','UPLIFT','LOSS','TOTAL'];const before=changes.map((_,i)=>i===5?0:contributions.slice(0,i).reduce((sum,value)=>sum+value,0));line(view,[[-400,155],[400,155]],P.grid,2);
 for(let i=0;i<6;i++){const p=()=>Math.max(.08,Math.min(1,t()*6-i));const current=()=>before[i]+changes[i]*p();view.add(new Rect({x:-325+i*130,y:()=>155-(before[i]+current())/2*3.5,width:80,height:()=>Math.abs(changes[i])*p()*3.5,fill:i===0||i===5?P.blue:changes[i]>0?P.teal:P.orange,radius:5}));label(view,names[i],-325+i*130,183,P.muted,18);view.add(new Txt({text:()=>((i>0&&i<5&&changes[i]>0)?'+':'')+Math.round(changes[i]*p()),x:-325+i*130,y:()=>155-Math.max(before[i],current())*3.5-25,fontSize:24,fontFamily:'Arial',fill:P.ink}));if(i<5){const level=before[i]+changes[i];view.add(new Line({points:[[-285+i*130,155-level*3.5],[-235+i*130,155-level*3.5]],stroke:P.muted,lineWidth:1,opacity:()=>p()}));}}
 label(view,'ILLUSTRATIVE INDEX · CONTRIBUTIONS TO THE TOTAL',0,235,P.muted,19);yield* t(1,7,linear);yield* waitFor(2);
 },
 'scenario-fan':function*(view){stage(view);grid(view);const t=createSignal(.05);const history=Array.from({length:50},(_,i)=>v(-370+i*3.8,80-i*.9+Math.sin(i*.4)*6));line(view,history,P.ink,4);const origin=history[49];const slopes=[-175,-45,120];for(let k=0;k<3;k++){view.add(new Line({points:()=>Array.from({length:70},(_,i)=>{const p=i/69*t();return v(origin.x+p*520,origin.y+slopes[k]*p+Math.sin(p*8)*9*p)}),stroke:colors[k],lineWidth:4,lineDash:k===1?[]:[10,7],lineCap:'round'}));view.add(new Circle({position:()=>v(origin.x+t()*520,origin.y+slopes[k]*t()+Math.sin(t()*8)*9*t()),size:11,fill:colors[k]}));}label(view,'COMMON HISTORY',-285,165,P.muted,19);['ACCELERATE','BASE CASE','SLOWDOWN'].forEach((s,i)=>label(view,s,310,[-174,-20,141][i],colors[i],20));label(view,'THREE SCENARIOS · SAME STARTING POINT',0,230);yield* t(1,6,linear);yield* waitFor(3);
 },
 'live-sparkline':function*(view){stage(view);const t=createSignal(0);const names=['SIGNAL','MOMENTUM','CAPACITY'];for(let k=0;k<3;k++){const y=-135+k*135;view.add(new Rect({position:[0,y],size:[810,110],radius:12,fill:P.panel}));label(view,names[k],-290,y-24,P.muted,18);view.add(new Txt({text:()=>((k+1)*18+Math.sin(t()*TAU+k)*7).toFixed(1),position:[-285,y+17],fontSize:33,fontFamily:'Arial',fill:colors[k]}));view.add(new Line({points:()=>Array.from({length:140},(_,i)=>{const q=i/140*9+t()*TAU;let z=Math.sin(q*1.8+k)*19+Math.sin(q*4.3)*7;if(k===0)z+=Math.pow(Math.max(0,Math.sin(q*1.8)),16)*25;return v(-150+i*3.7,y-z);}),stroke:colors[k],lineWidth:3,lineCap:'round'}));}label(view,'THREE LIVE-LOOKING SIGNALS · SYNTHETIC DATA',0,223,P.muted,19);yield* t(1,10,linear);
 }
};
