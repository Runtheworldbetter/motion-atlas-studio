import {
  Camera, Circle, Code, CubicBezier, Gradient, Line, Node, Path, Rect, Txt,
} from '@motion-canvas/2d';
import {
  all, createSignal, DEFAULT, easeInOutCubic, easeOutBack, easeOutBounce,
  easeOutCubic, easeOutElastic, linear, waitFor,
} from '@motion-canvas/core';
import type {SceneFactory, SceneSpec} from './types';
import {P, TAU, grid, label, mix, stage} from './shared';

const category = 'Motion craft' as const;
export const craftSpecs: SceneSpec[] = [
  {id:'morphing-path',title:'Morphing shapes',category,description:'A vector path changes from a triangle to a star, circle, and rounded square.',technique:'Path morphing · color interpolation',tags:['morphing','vector','minimal'],color:P.teal},
  {id:'bezier-lab',title:'Bézier control points',category,description:'Control points bend a curve while a marker follows its position and direction.',technique:'CubicBezier · reactive control points',tags:['curves','geometry','explainers'],color:P.orange},
  {id:'spring-comparison',title:'Comparing spring motion',category,description:'Compare three spring responses with different amounts of overshoot and oscillation.',technique:'Signals · analytic spring motion',tags:['physics','easing','comparison'],color:P.lime},
  {id:'easing-race',title:'The easing race',category,description:'Five easing functions move objects over the same distance and duration.',technique:'Timing functions · parallel animation',tags:['easing','comparison','motion'],color:P.pink},
  {id:'kinetic-type',title:'Moving letters',category,description:'Each letter changes position, angle, and scale with a small timing offset.',technique:'Txt · per-letter reactive transforms',tags:['typography','editorial','playful'],color:P.lime},
  {id:'text-mask',title:'Color inside the letters',category,description:'Moving colors are clipped to the shapes of the letters.',technique:'Cached nodes · source-in compositing',tags:['typography','masking','color'],color:P.purple},
  {id:'camera-zoom',title:'Camera pan and zoom',category,description:'The camera zooms into a card, pans between cards, and returns to the overview.',technique:'Camera · centerOn · zoom',tags:['camera','systems','exploration'],color:P.blue},
  {id:'perspective-grid',title:'A rotating wireframe',category,description:'A rotating wireframe cube floats above a moving perspective grid.',technique:'2D projection · reactive line geometry',tags:['perspective','geometry','depth'],color:P.purple},
  {id:'concentric-tunnel',title:'A geometric tunnel',category,description:'Repeating rectangles grow and rotate to create a tunnel effect.',technique:'Rect · scale · rotation · opacity',tags:['generative','depth','loop'],color:P.teal},
  {id:'staggered-tiles',title:'A wave through the grid',category,description:'Tiles change size, angle, and color in a wave across the grid.',technique:'Signals · spatial staggering',tags:['grid','stagger','pattern'],color:P.lime},
  {id:'particle-burst',title:'Particle bursts',category,description:'Three particle bursts follow curved paths and fade.',technique:'Deterministic particles · transforms',tags:['particles','celebration','playful'],color:P.orange},
  {id:'code-evolution',title:'A Python refactor',category,description:'A Python loop becomes a comprehension, then a reusable function, with animated diffs.',technique:'Code · diff interpolation · selection',tags:['code','teaching','transformation'],color:P.blue},
];

function polygonPath(count: number, outer: number, inner = outer): string {
  const points = Array.from({length:count},(_,i)=>{
    const angle=-Math.PI/2+i/count*TAU;
    const radius=i%2?inner:outer;
    return `${Math.cos(angle)*radius},${Math.sin(angle)*radius}`;
  });
  return `M ${points.join(' L ')} Z`;
}

const morphingPath: SceneFactory = function* (view) {
  stage(view);
  const shapes=[
    polygonPath(3,135), polygonPath(10,145,70),
    'M 0,-125 C 69,-125 125,-69 125,0 C 125,69 69,125 0,125 C -69,125 -125,69 -125,0 C -125,-69 -69,-125 0,-125 Z',
    'M -85,-115 L 85,-115 Q 115,-115 115,-85 L 115,85 Q 115,115 85,115 L -85,115 Q -115,115 -115,85 L -115,-85 Q -115,-115 -85,-115 Z',
  ];
  view.add(new Circle({size:360,stroke:P.grid,lineWidth:1}));
  view.add(new Circle({size:430,stroke:P.grid,lineWidth:1,lineDash:[3,10]}));
  const shape=new Path({data:shapes[0],fill:P.teal,stroke:P.ink,lineWidth:2,y:-12});
  view.add(shape);
  const name=label(view,'TRIANGLE',0,205,P.teal,19);
  const names=['TRIANGLE','STAR','CIRCLE','SOFT SQUARE'];
  const colors=[P.teal,P.orange,P.purple,P.lime];
  yield* waitFor(0.7);
  for(let i=1;i<=4;i++){
    const j=i%4;
    yield* all(shape.data(shapes[j],1.35,easeInOutCubic),shape.fill(colors[j],1.35),shape.rotation(i*90,1.35),name.text(names[j],0.35),name.fill(colors[j],0.35));
    yield* waitFor(0.65);
  }
};

const bezierLab: SceneFactory = function* (view) {
  stage(view); grid(view);
  const clock=createSignal(0);
  const a=()=>[-300,80] as [number,number];
  const b=()=>[-170+65*Math.sin(clock()*TAU),-170+55*Math.cos(clock()*TAU)] as [number,number];
  const c=()=>[130+80*Math.cos(clock()*TAU),135+70*Math.sin(clock()*TAU)] as [number,number];
  const d=()=>[300,-65] as [number,number];
  view.add(new Line({points:()=>[a(),b(),c(),d()],stroke:P.muted,lineWidth:1.5,lineDash:[7,8]}));
  const curve=new CubicBezier({p0:a,p1:b,p2:c,p3:d,stroke:P.orange,lineWidth:6});
  view.add(curve);
  [a,b,c,d].forEach((point,i)=>view.add(new Circle({position:point,size:i===0||i===3?15:20,fill:i===0||i===3?P.orange:P.bg,stroke:P.ink,lineWidth:2})));
  view.add(new Rect({size:[33,21],radius:5,fill:P.lime,position:()=>curve.getPointAtPercentage((clock()*2)%1).position,rotation:()=>curve.getPointAtPercentage((clock()*2)%1).tangent.degrees}));
  label(view,'CONTROL POINTS SET THE CURVE',0,220,P.muted,18);
  yield* clock(1,10,linear);
};

const springComparison: SceneFactory = function* (view) {
  stage(view);
  const time=createSignal(0);
  const names=['QUIET','BALANCED','BOUNCY'];
  const colors=[P.teal,P.lime,P.orange];
  const response=(row:number)=>{
    const t=time()%5;
    if(row===0)return 1-(1+3.4*t)*Math.exp(-3.4*t);
    const damping=row===1?1.5:0.7;
    return 1-Math.exp(-damping*t)*(Math.cos(6*t)+damping/6*Math.sin(6*t));
  };
  for(let i=0;i<3;i++){
    const y=-110+i*110;
    label(view,names[i],-365,y,P.muted,18);
    view.add(new Line({points:[[-235,y],[300,y]],stroke:P.grid,lineWidth:3}));
    view.add(new Line({points:[[210,y-28],[210,y+28]],stroke:P.muted,lineWidth:1,lineDash:[4,4]}));
    view.add(new Circle({size:31,fill:colors[i],y,x:()=>Math.floor(time()/5)%2===0?mix(-235,210,response(i)):mix(210,-235,response(i))}));
  }
  label(view,'THREE SPRING RESPONSES',0,215,P.muted,18);
  yield* time(10,10,linear);
};

const easingRace: SceneFactory = function* (view) {
  stage(view);
  const phase=createSignal(0);
  const easings=[linear,easeInOutCubic,easeOutBack,easeOutBounce,easeOutElastic];
  const names=['LINEAR','SMOOTH','BACK','BOUNCE','ELASTIC'];
  const colors=[P.blue,P.teal,P.lime,P.orange,P.pink];
  for(let i=0;i<5;i++){
    const y=-150+i*70;
    label(view,names[i],-355,y,P.muted,17);
    view.add(new Line({points:[[-240,y],[275,y]],stroke:P.grid,lineWidth:3}));
    view.add(new Rect({x:()=>-240+easings[i](phase())*250,y,width:()=>Math.max(2,easings[i](phase())*500),height:3,fill:colors[i],opacity:0.35}));
    view.add(new Circle({size:26,fill:colors[i],x:()=>-240+easings[i](phase())*500,y}));
  }
  label(view,'SAME DISTANCE AND DURATION',0,220,P.muted,18);
  yield* phase(1,3.4,linear);yield* waitFor(1);
  yield* phase(0,3.4,linear);yield* waitFor(0.8);
};

const kineticType: SceneFactory = function* (view) {
  stage(view);
  const time=createSignal(0);
  const words=['WORDS','IN','MOTION'];
  const colors=[P.ink,P.lime,P.ink];
  words.forEach((word,row)=>{
    [...word].forEach((char,i)=>{
      const center=i-(word.length-1)/2;
      view.add(new Txt({text:char,fontFamily:'Arial, sans-serif',fontWeight:800,fontSize:93,fill:colors[row],x:center*76,y:()=>-125+row*118+Math.sin(time()*1.7+i*.65+row*.75)*13,rotation:()=>Math.sin(time()*1.7+i*.65+row*.75)*7,scale:()=>1+0.035*Math.cos(time()*1.7+i*.65+row*.75)}));
    });
  });
  yield* time(TAU/1.7*3,10,linear);
};

const textMask: SceneFactory = function* (view) {
  stage(view);
  const time=createSignal(0);
  const stencil=new Node({cache:true,y:-10});
  stencil.add(new Txt({text:'FLOW',fontFamily:'Arial, sans-serif',fontSize:210,fontWeight:900,fill:P.ink}));
  const ink=new Node({cache:true,compositeOperation:'source-in'});
  ink.add(new Rect({size:[850,300],fill:new Gradient({type:'linear',from:[-400,0],to:[400,0],stops:[{offset:0,color:P.purple},{offset:0.35,color:P.pink},{offset:0.7,color:P.orange},{offset:1,color:P.yellow}]})}));
  for(let i=0;i<7;i++){
    ink.add(new Circle({size:190+i*17,position:()=>[Math.sin(time()*.7+i*.9)*380,Math.cos(time()*.9+i)*100],fill:[P.teal,P.blue,P.purple,P.pink][i%4],opacity:0.8}));
  }
  stencil.add(ink);view.add(stencil);
  view.add(new Line({points:[[-330,125],[330,125]],lineWidth:1,stroke:P.grid}));
  label(view,'COLOR CLIPPED TO THE LETTERS',0,192,P.muted,18);
  yield* time(10,10,linear);
};

const cameraZoom: SceneFactory = function* (view) {
  stage(view);
  // Camera renders its separate `scene` tree, not ordinary Node children added
  // after construction. Populate that scene explicitly when using constructors.
  const world=new Node({});
  const camera=new Camera({scene:world});view.add(camera);
  const cards:Rect[]=[];
  const positions:[[number,number],[number,number],[number,number],[number,number],[number,number]]=[[-255,-80],[0,-80],[255,-80],[-128,100],[128,100]];
  const colors=[P.teal,P.orange,P.purple,P.lime,P.blue];
  positions.forEach((p,i)=>{
    if(i>0)world.add(new Line({points:[positions[Math.max(0,i-1)],p],stroke:P.muted,lineWidth:2,lineDash:[6,8]}));
  });
  positions.forEach((p,i)=>{
    const card=new Rect({position:p,size:[180,120],radius:14,fill:P.panel,stroke:colors[i],lineWidth:2});
    card.add(new Txt({text:`0${i+1}`,y:-29,fontFamily:'Arial',fontSize:23,fill:colors[i]}));
    for(let j=0;j<6;j++)card.add(new Circle({size:12,position:[-48+(j%3)*48,10+Math.floor(j/3)*24],fill:colors[i],opacity:0.45+j*.08}));
    world.add(card);cards.push(card);
  });
  label(view,'ZOOM IN, PAN, AND ZOOM OUT',0,224,P.muted,18);
  yield* waitFor(1);
  yield* all(camera.centerOn(cards[0],1.8),camera.zoom(2.15,1.8));
  yield* waitFor(.7);
  yield* camera.centerOn(cards[2],2);
  yield* waitFor(.7);
  yield* all(camera.centerOn(cards[4],1.3),camera.zoom(1.7,1.3));
  yield* camera.reset(1.8);
  yield* waitFor(.7);
};

const perspectiveGrid: SceneFactory = function* (view) {
  stage(view);
  const t=createSignal(0);
  for(let i=-8;i<=8;i++)view.add(new Line({points:()=>[[i*28,-65],[i*130,245]],stroke:P.purple,lineWidth:1,opacity:.35}));
  for(let i=0;i<12;i++)view.add(new Line({points:()=>{
    const z=((i/12+t()*.09)%1);const y=-65+z*z*310;
    return [[-460,y],[460,y]];
  },stroke:P.purple,lineWidth:1,opacity:.35}));
  const vertices=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  const project=(index:number):[number,number]=>{
    const [x,y,z]=vertices[index];const a=t()*.6;const b=-.35;
    const xx=x*Math.cos(a)+z*Math.sin(a);const zz=-x*Math.sin(a)+z*Math.cos(a);
    const yy=y*Math.cos(b)-zz*Math.sin(b);const depth=y*Math.sin(b)+zz*Math.cos(b);
    const factor=115/(1+depth*.2);
    return [xx*factor,yy*factor-45];
  };
  const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  edges.forEach(([a,b],i)=>view.add(new Line({points:()=>[project(a),project(b)],stroke:i<4?P.teal:P.pink,lineWidth:3,opacity:.9})));
  vertices.forEach((_,i)=>view.add(new Circle({position:()=>project(i),size:7,fill:P.ink})));
  label(view,'DEPTH FROM TWO-DIMENSIONAL GEOMETRY',0,230,P.muted,17);
  yield* t(TAU/.6,10,linear);
};

const concentricTunnel: SceneFactory = function* (view) {
  stage(view);
  const t=createSignal(0);
  const colors=[P.teal,P.blue,P.purple,P.pink];
  for(let i=0;i<18;i++){
    const depth=()=>((i/18+t())%1);
    view.add(new Rect({size:()=>34+Math.pow(depth(),1.45)*670,radius:()=>12+depth()*36,rotation:()=>depth()*65+Math.sin(t()*TAU)*20,lineWidth:()=>1+depth()*2,stroke:colors[i%4],opacity:()=>Math.sin(depth()*Math.PI)*.8}));
  }
  view.add(new Circle({size:14,fill:P.ink}));
  yield* t(1,10,linear);
};

const staggeredTiles: SceneFactory = function* (view) {
  stage(view);
  const t=createSignal(0);
  for(let row=0;row<7;row++)for(let col=0;col<13;col++){
    const radius=Math.hypot((col-6)*.9,row-3);
    const pulse=()=>Math.pow((Math.sin(t()*2-radius*.8)+1)/2,3);
    view.add(new Rect({position:[(col-6)*55,(row-3)*55],size:42,radius:7,fill:()=>pulse()>.66?P.lime:pulse()>.25?P.teal:P.panel,stroke:P.grid,lineWidth:1,scale:()=>.65+pulse()*.4,rotation:()=>pulse()*45,opacity:()=>.5+pulse()*.5}));
  }
  yield* t(TAU*3/2,10,linear);
};

const particleBurst: SceneFactory = function* (view) {
  stage(view);
  const t=createSignal(0);
  const colors=[P.orange,P.yellow,P.pink,P.teal,P.lime,P.purple];
  const origins=[[-180,20],[190,-30],[0,-70]];
  for(let burst=0;burst<3;burst++)for(let i=0;i<34;i++){
    const angle=(i/34*TAU)+burst*.73;
    const speed=65+(i*71%130);
    const age=()=>((t()+burst*1.15)%3.7);
    view.add(new Rect({size:[5+(i%3)*3,10+(i%4)*4],radius:2,fill:colors[i%colors.length],position:()=>{
      const a=age();const distance=speed*(1-Math.exp(-a*1.5));
      return [origins[burst][0]+Math.cos(angle)*distance,origins[burst][1]+Math.sin(angle)*distance+a*a*14];
    },rotation:()=>i*41+age()*(i%2?95:-110),scale:()=>Math.max(.05,1-age()*.19),opacity:()=>Math.max(0,Math.min(1,(3.2-age())/1.1))}));
  }
  label(view,'CURVED PATHS, ROTATION, AND FADING',0,230,P.muted,18);
  yield* t(11.1,11.1,linear);
};

const codeEvolution: SceneFactory = function* (view) {
  stage(view);
  view.add(new Rect({size:[790,350],radius:18,fill:P.panel,stroke:P.grid,lineWidth:1}));
  [P.orange,P.yellow,P.teal].forEach((color,i)=>view.add(new Circle({size:11,position:[-360+i*20,-146],fill:color})));
  label(view,'transform.py',220,-145,P.muted,17);
  const code=new Code({
    position:[-350,-80],offset:[-1,-1],fontSize:25,fontFamily:'monospace',fill:P.ink,
    code:'squares = []\nfor x in range(8):\n    squares.append(x * x)',
    drawHooks:{
      token(ctx,text,position,color,selection){
        ctx.save();
        ctx.globalAlpha*=0.6+0.4*selection;
        ctx.fillStyle=color;
        ctx.fillText(text,position.x,position.y);
        ctx.restore();
      },
    },
  });
  view.add(code);
  const caption=label(view,'START WITH A LOOP',0,220,P.blue,18);
  yield* waitFor(1.2);
  yield* code.selection(code.findFirstRange('squares.append(x * x)'),.7);
  yield* waitFor(.5);
  yield* all(code.code('squares = [x * x for x in range(8)]',1.5),code.selection(DEFAULT,0.4),caption.text('USE A LIST COMPREHENSION',.4));
  yield* waitFor(1.2);
  yield* all(code.code('def square(values):\n    return [x * x for x in values]\n\nsquares = square(range(8))',1.6),caption.text('EXTRACT A FUNCTION',.4));
  yield* waitFor(1.3);
  yield* code.selection(code.findFirstRange('square'),.5);
  yield* waitFor(1.2);
};

export const craftScenes: Record<string, SceneFactory> = {
  'morphing-path':morphingPath,
  'bezier-lab':bezierLab,
  'spring-comparison':springComparison,
  'easing-race':easingRace,
  'kinetic-type':kineticType,
  'text-mask':textMask,
  'camera-zoom':cameraZoom,
  'perspective-grid':perspectiveGrid,
  'concentric-tunnel':concentricTunnel,
  'staggered-tiles':staggeredTiles,
  'particle-burst':particleBurst,
  'code-evolution':codeEvolution,
};
