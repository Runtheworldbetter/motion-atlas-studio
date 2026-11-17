import {Circle, Line, Node, Txt} from '@motion-canvas/2d';
import {createSignal, linear, Vector2} from '@motion-canvas/core';
import type {SceneFactory, SceneSpec} from './types';
import {P, stage, grid, label, line, dot, v, TAU} from './shared';
import {spiralPoint, spiralVelocity} from './gallery-models.ts';

const spec=(id:string,title:string,description:string,technique:string,tags:string[],color:string):SceneSpec=>({id,title,description,technique,tags,color,category:'Math & nature'});
export const mathSpecs:SceneSpec[]=[
  spec('orbital-resonance','Three turns meet two','Two prescribed circular motions trace a woven pattern as their frequencies meet in a 3:2 ratio.','Reactive positions · synchronized signals',['orbits','patterns','geometry'],P.teal),
  spec('fourier-epicycles','Circles make a square wave','Four rotating circles add together, turning simple oscillations into a surprisingly sharp waveform.','Nested signals · live line geometry',['waves','fourier','explanation'],P.orange),
  spec('lissajous','Lissajous loom','A 3:2 frequency ratio weaves a ribbon that changes shape as its phase drifts.','Parametric curves · animated phase',['curves','symmetry','loops'],P.purple),
  spec('wave-interference','When waves meet','Two coherent sources create islands of reinforcement and cancellation across a field.','Signal-driven particles · wave superposition',['waves','particles','physics'],P.pink),
  spec('pendulum-wave','A roomful of oscillators','Prescribed pendulum-like motions fall into patterns, scatter, and gather again.','Choreographed oscillators · geometry',['rhythm','motion','patterns'],P.lime),
  spec('phyllotaxis','Nature’s golden angle','Seeds placed 137.508° apart build the interlocking spirals seen in sunflower heads.','Procedural layout · staggered motion',['nature','golden angle','particles'],P.yellow),
  spec('strange-attractor','Order inside chaos','A numerical Lorenz trajectory loops through two wings while a marker follows its path.','Numerical integration · projected paths',['chaos','trajectories','science'],P.orange),
  spec('vector-field','Follow the current','A field of arrows guides luminous particles into a spiraling sink.','Vector arrows · procedural trajectories',['flow','particles','fields'],P.teal),
  spec('polar-rose','A garden of equations','Three tiny changes to a polar equation produce flowers with three, five, and seven petals.','Polar coordinates · curve tracing',['geometry','symmetry','flowers'],P.pink),
  spec('wave-surface','A trigonometric surface','A projected wireframe traces a changing surface defined by a product of sine and cosine.','Projected 3D geometry · reactive polylines',['surface','3D projection','waves'],P.blue),
  spec('standing-wave','Two travelers, one standing wave','Waves moving in opposite directions add up to a pattern with fixed nodes.','Superposition · synchronized waveforms',['waves','explanation','physics'],P.lime),
  spec('parametric-knot','The endless knot','A torus knot turns in space while bright markers reveal the continuity of its path.','Parametric 3D projection · depth cues',['knots','3D projection','geometry'],P.purple),
];

export const mathScenes:Record<string,SceneFactory>={
  'orbital-resonance':function*(view){
    stage(view);const t=createSignal(0);const cy=-20;
    for(const r of [116,182])view.add(new Circle({position:[0,cy],size:r*2,stroke:P.grid,lineWidth:2}));
    for(let i=0;i<100;i++){const a=i/100*TAU;
      view.add(new Line({points:[v(116*Math.cos(3*a),cy+116*Math.sin(3*a)),v(182*Math.cos(2*a),cy+182*Math.sin(2*a))],stroke:i%2?P.teal:P.blue,lineWidth:1.2,opacity:()=>0.05+0.34*Math.max(0,Math.min(1,t()*1.5-i/100))}));}
    view.add(new Circle({position:[0,cy],size:20,fill:P.yellow}));
    for(const [r,n,c] of [[116,3,P.teal],[182,2,P.orange]] as const){
      view.add(new Circle({position:()=>[r*Math.cos(TAU*n*t()),cy+r*Math.sin(TAU*n*t())],size:24,fill:c}));
      view.add(new Circle({position:()=>[r*Math.cos(TAU*n*t()),cy+r*Math.sin(TAU*n*t())],size:40,stroke:c,lineWidth:2,opacity:0.25}));
    }
    label(view,'3 : 2',-350,-120,P.ink,42);label(view,'FREQUENCY RATIO',-350,-75,P.muted,14);
    label(view,'A shared rhythm leaves a geometric trace',0,220);
    yield* t(1,10,linear);
  },
  'fourier-epicycles':function*(view){
    stage(view);const t=createSignal(0);const terms=[1,3,5,7];
    const center=(n:number)=>{let x=-255,y=-15;for(let i=0;i<n;i++){const a=t()*TAU*2*terms[i];x+=68/terms[i]*Math.cos(a);y+=68/terms[i]*Math.sin(a);}return v(x,y);};
    view.add(new Line({points:[[-90,-15],[410,-15]],stroke:P.grid,lineWidth:2}));
    terms.forEach((n,i)=>{
      view.add(new Circle({position:()=>center(i),size:136/n,stroke:i===0?P.muted:P.grid,lineWidth:2}));
      view.add(new Line({points:()=>[center(i),center(i+1)],stroke:[P.orange,P.yellow,P.teal,P.blue][i],lineWidth:3}));
      view.add(new Circle({position:()=>center(i+1),size:i===3?13:7,fill:[P.orange,P.yellow,P.teal,P.blue][i]}));
    });
    view.add(new Line({points:()=>[center(4),v(40,center(4).y)],stroke:P.muted,lineWidth:1.5,lineDash:[5,6]}));
    view.add(new Line({points:()=>Array.from({length:240},(_,i)=>{const a=t()*TAU*2-i/239*TAU*1.6;return v(40+i/239*370,-15+terms.reduce((s,n)=>s+68/n*Math.sin(a*n),0));}),stroke:P.orange,lineWidth:5,lineCap:'round'}));
    label(view,'1',-255,135,P.orange,23);label(view,'+ ⅓ + ⅕ + ⅐',-150,135,P.muted,23);
    label(view,'Rotating circles → harmonic sum',0,220);
    yield* t(1,10,linear);
  },
  'lissajous':function*(view){
    stage(view);grid(view,80);const t=createSignal(0);
    const point=(a:number,p:number)=>v(290*Math.sin(3*a+p),-15+155*Math.sin(2*a));
    for(let j=3;j>=0;j--)view.add(new Line({points:()=>Array.from({length:340},(_,i)=>point(i/339*TAU,t()*TAU+j*0.025)),stroke:j===0?P.purple:P.blue,lineWidth:j===0?4:2,opacity:j===0?0.9:0.12}));
    for(let i=0;i<15;i++)view.add(new Circle({position:()=>point(t()*TAU*2-i*0.025,t()*TAU),size:15-i*0.55,fill:P.ink,opacity:1-i/16}));
    label(view,'x = sin(3θ + φ)     y = sin(2θ)',0,220);
    yield* t(1,10,linear);
  },
  'wave-interference':function*(view){
    stage(view);const t=createSignal(0);const sources=[[-125,-20],[125,-20]];
    for(let ix=-12;ix<=12;ix++)for(let iy=-5;iy<=5;iy++){
      const x=ix*30,y=iy*30-20;
      const amplitude=()=>sources.reduce((s,[sx,sy])=>s+Math.cos(Math.hypot(x-sx,y-sy)/28-t()*TAU*3),0)/2;
      view.add(new Circle({position:[x,y],size:()=>3+19*Math.abs(amplitude()),fill:()=>amplitude()>0?P.teal:P.pink,opacity:()=>0.18+0.82*Math.abs(amplitude())}));
    }
    sources.forEach(([x,y])=>{view.add(new Circle({position:[x,y],size:25,stroke:P.ink,lineWidth:2}));view.add(new Circle({position:[x,y],size:9,fill:P.ink}));});
    label(view,'Positive displacement',-205,202,P.teal,18);label(view,'Negative displacement',200,202,P.pink,18);
    label(view,'Small dots show displacement near zero',0,236,P.muted,16);
    yield* t(1,9,linear);
  },
  'pendulum-wave':function*(view){
    stage(view);const t=createSignal(0);line(view,[[-400,-174],[400,-174]],P.muted,2);
    for(let i=0;i<15;i++){
      const x=-350+i*50,length=310*(11/(11+i))**2+45;
      const point=()=>{const a=0.22*Math.sin(t()*TAU*(11+i)+0.8);return v(x+Math.sin(a)*length,-174+Math.cos(a)*length);};
      view.add(new Line({points:()=>[v(x,-174),point()],stroke:P.muted,lineWidth:1.4}));
      view.add(new Circle({position:point,size:22,fill:[P.lime,P.teal,P.blue][i%3]}));
      dot(view,x,-174,3,P.muted);
    }
    label(view,'15 timed oscillators · choreographed periods',0,222);
    yield* t(1,12,linear);
  },
  'phyllotaxis':function*(view){
    stage(view);const t=createSignal(0);const root=new Node({position:[0,-15],rotation:()=>t()*60});view.add(root);
    const golden=Math.PI*(3-Math.sqrt(5));
    for(let i=1;i<=233;i++){
      const a=i*golden,r=Math.sqrt(i)*12;
      const ripple=()=>0.82+0.18*Math.sin(t()*TAU*2-r/45);
      root.add(new Circle({position:()=>[Math.cos(a)*r*ripple(),Math.sin(a)*r*ripple()],width:11,height:16,rotation:a*180/Math.PI+90,fill:[P.yellow,P.lime,P.teal][Math.floor(i/40)%3],opacity:()=>0.65+0.35*Math.sin(i/15-t()*TAU*2)**2}));
    }
    label(view,'137.508°',-335,-40,P.yellow,31);label(view,'GOLDEN ANGLE',-335,0,P.muted,14);
    label(view,'One placement rule. Interlocking spirals.',0,222);
    yield* t(1,10,linear);
  },
  'strange-attractor':function*(view){
    stage(view);const t=createSignal(0);const path:{x:number;y:number;z:number}[]=[];let x=0.1,y=0,z=0;
    for(let i=0;i<6400;i++){const dt=.006;const dx=10*(y-x),dy=x*(28-z)-y,dz=x*y-8/3*z;x+=dx*dt;y+=dy*dt;z+=dz*dt;if(i>1200&&i%14===0)path.push({x,y,z});}
    const project=(p:{x:number;y:number;z:number})=>{const a=.2*Math.sin(t()*TAU);return v((p.x*Math.cos(a)+p.y*Math.sin(a))*13,(25-p.z)*7.2-20);};
    view.add(new Line({points:()=>path.map(project),stroke:P.blue,lineWidth:2,opacity:0.18}));
    view.add(new Line({points:()=>path.map(project),stroke:P.orange,lineWidth:3,end:()=>.12+.88*t(),lineCap:'round'}));
    view.add(new Circle({position:()=>project(path[Math.min(path.length-1,Math.floor((.12+.88*t())*(path.length-1)))]),size:16,fill:P.ink}));
    label(view,'Lorenz system · σ = 10, ρ = 28, β = 8/3',0,222);
    yield* t(1,11,linear);
  },
  'vector-field':function*(view){
    stage(view);const t=createSignal(0);
    for(let ix=-8;ix<=8;ix++)for(let iy=-4;iy<=4;iy++){
      const x=ix*46,y=iy*40-20;const velocity=spiralVelocity(x,y);
      const magnitude=Math.hypot(velocity.x,velocity.y);if(magnitude<1e-8)continue;
      const length=18+7*Math.min(1,Math.hypot(x/370,(y+20)/160));
      const dx=velocity.x/magnitude*length,dy=velocity.y/magnitude*length;
      view.add(new Line({points:[v(x-dx*.5,y-dy*.5),v(x+dx*.5,y+dy*.5)],stroke:P.muted,lineWidth:1.3,endArrow:true,arrowSize:5,opacity:.42}));
    }
    for(let i=0;i<26;i++){
      const p=()=>((t()+i/26)%1);
      view.add(new Circle({position:()=>{const point=spiralPoint(p(),i*2.4);return v(point.x,point.y);},size:()=>5+8*(1-p()),fill:i%3?P.teal:P.yellow,opacity:()=>Math.sin(Math.PI*p())}));
    }
    view.add(new Circle({position:[0,-20],size:16,fill:P.ink}));
    label(view,'Arrows and particles follow the same spiral field',0,222);
    yield* t(1,10,linear);
  },
  'polar-rose':function*(view){
    stage(view);const t=createSignal(0);
    [3,5,7].forEach((k,j)=>{
      const cx=-275+j*275,color=[P.pink,P.teal,P.yellow][j];
      const point=(a:number)=>{const r=112*Math.cos(k*a),rot=t()*TAU/3;return v(cx+r*Math.cos(a+rot),-25+r*Math.sin(a+rot));};
      view.add(new Circle({position:[cx,-25],size:230,stroke:P.grid,lineWidth:1}));
      view.add(new Line({points:()=>Array.from({length:350},(_,i)=>point(i/349*Math.PI)),stroke:color,lineWidth:4,lineCap:'round'}));
      view.add(new Circle({position:()=>point(t()*Math.PI*2),size:15,fill:P.ink}));
      label(view,`${k} petals`,cx,145,color,23);
    });
    label(view,'r = cos(kθ)',0,222);
    yield* t(1,10,linear);
  },
  'wave-surface':function*(view){
    stage(view);const t=createSignal(0);
    const point=(u:number,w:number)=>v((u-w)*22,(u+w)*8-25-36*Math.sin(u*.55+t()*TAU*2)*Math.cos(w*.45-t()*TAU*2));
    for(let u=-8;u<=8;u++)view.add(new Line({points:()=>Array.from({length:29},(_,j)=>point(u,-7+j*.5)),stroke:P.teal,lineWidth:1.8,opacity:.85}));
    for(let w=-7;w<=7;w++)view.add(new Line({points:()=>Array.from({length:33},(_,i)=>point(-8+i*.5,w)),stroke:P.blue,lineWidth:1.6,opacity:.65}));
    view.add(new Line({points:[[-370,90],[0,220],[370,90]],stroke:P.grid,lineWidth:2}));
    label(view,'z = sin(x + t) cos(y − t)',0,235);
    yield* t(1,10,linear);
  },
  'standing-wave':function*(view){
    stage(view);const t=createSignal(0);const ys=[-132,-12,115];
    const wave=(u:number,j:number)=>j===0?26*Math.sin(u*TAU*2-t()*TAU*3):j===1?26*Math.sin(u*TAU*2+t()*TAU*3):52*Math.sin(u*TAU*2)*Math.cos(t()*TAU*3);
    ys.forEach((y,j)=>{
      view.add(new Line({points:[[-365,y],[365,y]],stroke:P.grid,lineWidth:1}));
      view.add(new Line({points:()=>Array.from({length:280},(_,i)=>v(-365+i/279*730,y+wave(i/279,j))),stroke:[P.teal,P.pink,P.lime][j],lineWidth:j===2?4:3,lineCap:'round'}));
      label(view,['→','←','Σ'][j],-411,y,[P.teal,P.pink,P.lime][j],28);
    });
    for(let i=0;i<=4;i++)view.add(new Circle({position:[-365+i*182.5,115],size:10,fill:P.ink}));
    label(view,'Opposite directions · fixed nodes in the sum',0,223);
    yield* t(1,9,linear);
  },
  'parametric-knot':function*(view){
    stage(view);const t=createSignal(0);
    const projected=(a:number)=>{const r=2+Math.cos(3*a),x=r*Math.cos(2*a),y=r*Math.sin(2*a),z=Math.sin(3*a),b=t()*TAU;const xx=x*Math.cos(b)+z*Math.sin(b),zz=-x*Math.sin(b)+z*Math.cos(b);return {point:v(xx*92,(y*.82-zz*.38)*72-20),depth:zz};};
    view.add(new Circle({position:[0,-20],size:[670,390],stroke:P.grid,lineWidth:1}));
    view.add(new Line({points:()=>Array.from({length:380},(_,i)=>projected(i/379*TAU).point),stroke:P.purple,lineWidth:5,lineCap:'round'}));
    for(let i=0;i<22;i++)view.add(new Circle({position:()=>projected(i/22*TAU+t()*TAU).point,size:()=>8+2*projected(i/22*TAU+t()*TAU).depth,fill:i%3?P.purple:P.ink,opacity:()=>.68+.1*projected(i/22*TAU+t()*TAU).depth}));
    label(view,'(2, 3) torus knot · projected into 2D',0,223);
    yield* t(1,12,linear);
  },
};
