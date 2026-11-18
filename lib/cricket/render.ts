import {createCricketPoseEngine, type Camera, type Hand, type CricketPose} from './pose.ts';

export const strokeEngine=createCricketPoseEngine();
type Role='front'|'back';
type Bounds={minX:number;maxX:number;minY:number;maxY:number};
const boundsCache:Partial<Record<Camera,Bounds>>={};
export interface StrokeRenderOptions {width:number;hand:Hand;camera:Camera;progress:number;imprints:boolean;}
export function exportStrokeSvg(options:Omit<StrokeRenderOptions,'width'|'hand'>&{hand:Hand|'compare'}){
  const hands:Hand[]=options.hand==='compare'?['left','right']:[options.hand];
  const width=hands.length===2?600:720;
  const drawings=hands.map(hand=>renderStrokeSvg({...options,hand,width}));
  const height=Math.max(...drawings.map(drawing=>drawing.height))+118;
  const palette:Record<string,string>={'--background':'#f8faf8','--foreground':'#263a35','--border':'#c5ceca','--muted':'#dce3df','--muted-foreground':'#75837c','--viz-series-1':'#2475b7','--viz-series-2':'#c36343','--viz-series-3':'#b18422'};
  const phase=strokeEngine.frames.filter(frame=>frame.t<=options.progress+.00001).at(-1)!.label;
  let markup=`<svg xmlns="http://www.w3.org/2000/svg" width="${width*hands.length}" height="${height}" viewBox="0 0 ${width*hands.length} ${height}"><rect width="100%" height="100%" fill="#f8faf8"/><style>text{font:14px system-ui,sans-serif;fill:#263a35}.cs-number{font-size:12px;font-weight:600;dominant-baseline:central}.heading{font-size:18px;font-weight:600}</style>`;
  hands.forEach((hand,index)=>{
    const drawing=drawings[index],x=index*width;
    markup+=`<text x="${x+width/2}" y="26" text-anchor="middle" class="heading">${hand==='left'?'Left-handed':'Right-handed'} · ${options.camera==='side'?'Side view':'Bowler’s view'} · ${phase}</text><text x="${x+width/2}" y="49" text-anchor="middle">Top hand ${hand==='left'?'R':'L'} · Bottom hand ${hand==='left'?'L':'R'} · Front foot ${hand==='left'?'R':'L'}</text><svg x="${x}" y="64" width="${width}" height="${drawing.height}" viewBox="0 0 ${width} ${drawing.height}">${drawing.markup}</svg>`;
  });
  markup+=`<text x="${width*hands.length/2}" y="${height-29}" text-anchor="middle">Blue: top arm &amp; hand · Orange: bottom arm &amp; hand · Gold: bat</text><text x="${width*hands.length/2}" y="${height-8}" text-anchor="middle">Motion Atlas · ${options.imprints?'Imprints: 1 Backlift · 2 Contact · 3 Extension':'Bat imprints off'} · Authored coaching illustration</text></svg>`;
  return markup.replace(/var\((--[a-z0-9-]+)\)/g,(_,key:string)=>palette[key]??'#263a35');
}
/** Authored geometry only: no user input is interpolated into the SVG markup. */
export function renderStrokeSvg({width:w,hand,camera,progress,imprints}:StrokeRenderOptions){
    const engine=strokeEngine;
    const add=(a:number[],b:number[])=>a.map((v,i)=>v+b[i]);
    const sub=(a:number[],b:number[])=>a.map((v,i)=>v-b[i]);
    const mul=(a:number[],k:number)=>a.map(v=>v*k);
    const unit=(a:number[])=>mul(a,1/(Math.hypot(...a)||1));
    const mix=(a:number[],b:number[],t:number)=>add(a,mul(sub(b,a),t));
    const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
    const fmt=(v:number)=>Number(v.toFixed(2));
    const xy=(p:number[])=>`${fmt(p[0])},${fmt(p[1])}`;
    const path=(d:string,fill='none',stroke='var(--border)',width=1,extra='')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
    const line=(a:number[],b:number[],stroke:string,width:number,extra='')=>path(`M${xy(a)} L${xy(b)}`,'none',stroke,width,extra);
    const txt=(p:number[],text:string,anchor='start',cls='text-small')=>`<text x="${fmt(p[0])}" y="${fmt(p[1])}" text-anchor="${anchor}" class="${cls}">${text}</text>`;
    const roleColour={front:'var(--viz-series-1)',back:'var(--viz-series-2)',bat:'var(--viz-series-3)'};
    const raw=(p:number[])=>camera==='side'?[-p[1],-p[2]]:[p[0],.38*p[1]-p[2]];
    const depth=(p:number[])=>camera==='side'?-p[0]:p[1];
    const stopFor=(id:string)=>engine.stops.find(s=>s.id===id)!;
    const contactT=()=>stopFor('contact').t;
    
    const bodyKeys=['head','frontShoulder','backShoulder','frontElbow','backElbow','frontHip','backHip','frontKnee','backKnee','frontFoot','backFoot','top','bottom','batEnd'] as const;
    function bounds(){
      if(boundsCache[camera])return boundsCache[camera];
      const points:number[][]=[];
      for(let i=0;i<=120;i++)for(const h of ['left','right'] as const){
        const q=engine.pose(i/120,h);bodyKeys.forEach(k=>points.push(raw(q[k])));
        points.push(raw(add(q.head,[0,0,19])));
        points.push(raw(add(q.frontFoot,[h==='right'?-20:20,12,-q.frontFoot[2]])));
        points.push(raw(add(q.backFoot,[h==='right'?-20:20,9,-q.backFoot[2]])));
      }
      for(const p of [[0,-77,0],[0,-77,72],[0,148,15],[0,93,0]])points.push(raw(p));
      const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
      return boundsCache[camera]={minX:Math.min(...xs)-16,maxX:Math.max(...xs)+16,minY:Math.min(...ys)-18,maxY:Math.max(...ys)+14};
    }
      const b=bounds(),scale=Math.min(1.75,(w-24)/(b.maxX-b.minX)),height=Math.ceil((b.maxY-b.minY)*scale+18);
      const left=(w-(b.maxX-b.minX)*scale)/2;
      const P=(p:number[])=>{const v=raw(p);return [left+(v[0]-b.minX)*scale,8+(v[1]-b.minY)*scale];};
      const q=engine.pose(progress,hand),p={} as Record<(typeof bodyKeys)[number],number[]>;bodyKeys.forEach(k=>p[k]=P(q[k]));
      const C={body:'var(--muted)',outline:'var(--border)',neutral:'var(--muted-foreground)'};

      let out=`<title>${hand==='left'?'Left':'Right'}-handed straight drive</title><desc>Illustrative complete stroke. The top arm and hand use the first colour, bottom arm and hand the second, and bat the third. Grey imprints numbered one, two and three mark backlift, contact and extension. These are not measurements from a personal video.</desc>`;
      if(camera==='side'){
        const groundY=P([0,0,0])[1];
        out+=line([12,groundY],[w-12,groundY],'var(--border)',1);
        out+=txt([14,groundY+17],'← Bowler');
      }else{
        out+=path(`M${xy(P([-40,-84,0]))} L${xy(P([40,-84,0]))} L${xy(P([67,123,0]))} L${xy(P([-67,123,0]))} Z`,'var(--muted)','none',0,'opacity=".40"');
        out+=line(P([-67,38,0]),P([67,38,0]),'var(--border)',1);
      }
      for(const x of [-7,0,7])out+=line(P([x,-77,0]),P([x,-77,72]),'var(--border)',1.5*scale);
      out+=line(P([-9,-77,72]),P([9,-77,72]),'var(--border)',1.5*scale);
      const bat=(state:CricketPose,ghost=false)=>{
        const BP=(d:number)=>P(add(state.grip,mul(state.axis,d))),a=BP(26),end=BP(90),u=unit(sub(end,a)),n=[-u[1],u[0]],at=(pt:number[],offset:number)=>add(pt,mul(n,offset*scale));
        const colour=ghost?'var(--muted-foreground)':roleColour.bat;
        let s=line(BP(-8),BP(29),colour,(ghost?1.2:4.5)*scale,ghost?'stroke-dasharray="3 3"':'');
        s+=path(`M${xy(at(a,4.8))} L${xy(at(end,6.7))} Q${xy(add(end,mul(u,2.5*scale)))} ${xy(at(end,-6.7))} L${xy(at(a,-4.8))} Z`,ghost?'none':colour,colour,(ghost?1.1:.5)*scale,ghost?'stroke-dasharray="4 3"':'');
        if(!ghost)s+=line(at(mix(a,end,.1),-2.5),at(mix(a,end,.89),-2.5),'var(--background)',.9*scale,'opacity=".45"');
        return s;
      };
      const reached:{anchor:number[];num:number;id:string;visible:boolean}[]=[];
      if(imprints){
        for(const [id,num] of [['backlift',1],['contact',2],['extension',3]] as const){
          const milestone=stopFor(id),visible=progress+.0005>=milestone.t;
          const state=engine.pose(milestone.t,hand);
          if(visible)out+=`<g opacity=".46">${bat(state,true)}</g>`;
          const anchor=id==='contact'?P(engine.contact.point):P(state.batEnd);
          reached.push({anchor,num,id,visible});
        }
      }
      const tube=(a:number[],b:number[],width:number,fill:string)=>line(a,b,fill,width*scale);
      const chain=(a:number[],b:number[],c:number[],width:number,fill:string)=>tube(a,b,width,fill)+tube(b,c,width*.82,fill);
      const shoe=(which:Role)=>{
        const foot=q[`${which}Foot`],toe=P(q[`${which}Toe`]);
        return tube(p[`${which}Foot`],toe,8.2,C.neutral);
      };
      const pad=(which:Role)=>{
        const a=p[`${which}Knee`],z=p[`${which}Foot`],u=unit(sub(z,a)),n=[-u[1],u[0]],top=add(a,mul(u,-4*scale)),end=add(z,mul(u,-5*scale));
        const offset=(pt:number[],d:number)=>add(pt,mul(n,d*scale));
        let s=path(`M${xy(offset(top,9.5))} Q${xy(add(top,mul(u,-5*scale)))} ${xy(offset(top,-9.5))} L${xy(offset(end,-7))} Q${xy(add(end,mul(u,4*scale)))} ${xy(offset(end,7))} Z`,'var(--background)',C.outline,1*scale);
        s+=line(offset(mix(top,end,.28),9),offset(mix(top,end,.28),-9),C.outline,1.3*scale);
        return s;
      };
      const leg=(which:Role)=>chain(p[`${which}Hip`],p[`${which}Knee`],p[`${which}Foot`],18,C.body)+shoe(which)+pad(which);
      const arm=(which:Role)=>{
        const shoulder=p[`${which}Shoulder`],elbow=p[`${which}Elbow`],wrist=p[which==='front'?'top':'bottom'],c=roleColour[which];
        return chain(shoulder,elbow,wrist,11.4,'var(--background)')+chain(shoulder,elbow,wrist,8.7,c)+`<circle cx="${fmt(elbow[0])}" cy="${fmt(elbow[1])}" r="${3.4*scale}" fill="${c}" stroke="var(--background)" stroke-width="${1.1*scale}"/>`;
      };

      const initial=engine.pose(0,hand);
      const nearLeg:Role=depth(initial.frontHip)>depth(initial.backHip)?'front':'back';
      const farLeg=nearLeg==='front'?'back':'front';
      out+=leg(farLeg)+leg(nearLeg);

      const shoulderMid=mix(p.frontShoulder,p.backShoulder,.5),hipMid=mix(p.frontHip,p.backHip,.5);
      // A soft convex hull follows the actual shoulder/hip anchors. A fixed
      // perpendicular trapezoid can leave the higher shoulder floating.
      const bodyPoints=[p.frontShoulder,p.backShoulder,p.frontHip,p.backHip].flatMap(center=>
        Array.from({length:8},(_,i)=>[center[0]+7*scale*Math.cos(i*Math.PI/4),center[1]+7*scale*Math.sin(i*Math.PI/4)]));
      bodyPoints.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
      const cross=(o:number[],a:number[],b:number[])=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
      const half=(points:number[][])=>{const hull:number[][]=[];for(const point of points){while(hull.length>=2&&cross(hull[hull.length-2],hull[hull.length-1],point)<=0)hull.pop();hull.push(point);}return hull.slice(0,-1);};
      const hull=[...half(bodyPoints),...half([...bodyPoints].reverse())];
      out+=path(`M${hull.map(xy).join(' L')} Z`,C.body,C.outline,.8*scale,'fill-opacity=".88"');
      const neck=P(add(q.head,[0,0,-14]));
      out+=tube(shoulderMid,neck,8,C.body);
      const head=p.head;
      out+=`<ellipse cx="${fmt(head[0])}" cy="${fmt(head[1])}" rx="${11.5*scale}" ry="${15*scale}" fill="var(--muted)" stroke="var(--muted-foreground)" stroke-width="${.8*scale}"/>`;
      if(camera==='side')out+=line([head[0]-11*scale,head[1]-5*scale],[head[0]-17*scale,head[1]-5*scale],C.neutral,2.3*scale);
      else out+=line([head[0]-12*scale,head[1]-5*scale],[head[0]+12*scale,head[1]-5*scale],C.neutral,2.3*scale);
      // Stable diagnostic layers: the coloured chains never swap at shoulder crossings.
      out+=arm('back')+arm('front');
      out+=bat(q);
      const glove=(pos:number[],role:Role)=>{
        const a=P(pos),b=P(add(pos,mul(q.axis,4))),u=unit(sub(b,a)),n=[-u[1],u[0]],at=(x:number,y:number)=>add(add(a,mul(n,x*scale)),mul(u,y*scale));
        return path(`M${xy(at(-6.4,-5))} Q${xy(at(0,-7))} ${xy(at(6.4,-5))} L${xy(at(7,4))} Q${xy(at(0,7))} ${xy(at(-6.4,4))} Z`,roleColour[role],'var(--background)',1.3*scale);
      };
      out+=glove(q.bottom,'back')+glove(q.top,'front');
      const ct=contactT();
      let ball;
      if(progress<ct){const bt=stopFor('backlift').t,part=clamp((progress-bt)/(ct-bt),0,1);ball=[0,148+(engine.contact.point[1]-148)*part,engine.contact.point[2]+6*(1-part)];}
      else{const part=clamp((progress-ct)/.27,0,1);ball=[0,engine.contact.point[1]+155*part,engine.contact.point[2]+8*part];}
      const bp=P(ball);
      if(bp[0]>3&&bp[0]<w-3&&bp[1]>3&&bp[1]<height-3)out+=`<circle cx="${fmt(bp[0])}" cy="${fmt(bp[1])}" r="${3.6*scale}" fill="var(--foreground)" stroke="var(--background)" stroke-width="${1.2*scale}"/>`;
      // Every imprint anchor is numbered; labels live on the matching checkpoint controls.
      const used:number[][]=[];
      for(const r of reached){
        const a=r.anchor,offset=r.id==='contact'?[20,16]:a[0]<w/2?[-17,-12]:[17,-12];
        const base=[clamp(a[0]+offset[0],12,w-12),clamp(a[1]+offset[1],12,height-12)];
        const candidates=[base];
        for(const radius of [28,44,60])for(const angle of [0,Math.PI/2,-Math.PI/2,Math.PI,Math.PI/4,-Math.PI/4,3*Math.PI/4,-3*Math.PI/4]){
          candidates.push([clamp(base[0]+radius*Math.cos(angle),12,w-12),clamp(base[1]+radius*Math.sin(angle),12,height-12)]);
        }
        const at=candidates.find(pos=>used.every(old=>Math.hypot(pos[0]-old[0],pos[1]-old[1])>=25))||base;
        used.push(at);
        if(!r.visible)continue;
        out+=`<circle cx="${fmt(a[0])}" cy="${fmt(a[1])}" r="${r.id==='contact'?6:3}" fill="none" stroke="var(--muted-foreground)" stroke-width="1"/>`;
        out+=line(a,at,'var(--muted-foreground)',.8);
        out+=`<circle cx="${fmt(at[0])}" cy="${fmt(at[1])}" r="10" fill="var(--background)" stroke="var(--muted-foreground)" stroke-width="1"/>`;
        out+=txt(at,String(r.num),'middle','cs-number');
      }
      return {markup:out,height,width:w};
}
