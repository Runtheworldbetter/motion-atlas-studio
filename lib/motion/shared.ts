import {Circle, Line, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {Vector2, type PossibleVector2} from '@motion-canvas/core';
export const P={bg:'#10171b',panel:'#192329',grid:'#243138',ink:'#edf4ed',muted:'#7e949e',teal:'#71e4cf',lime:'#c7f484',orange:'#ff8f62',pink:'#ed92bb',blue:'#82acff',purple:'#b7a2f7',yellow:'#f4d777'};
export function stage(view:View2D){view.fill(P.bg);}
export function label(view:View2D,text:string,x=0,y=205,color=P.muted,size=21){const node=new Txt({text,position:[x,y],fontFamily:'Arial, sans-serif',fontSize:size,fill:color});view.add(node);return node;}
export function grid(view:View2D,step=60){for(let x=-420;x<=420;x+=step)view.add(new Line({points:[[x,-210],[x,210]],stroke:P.grid,lineWidth:1}));for(let y=-210;y<=210;y+=step)view.add(new Line({points:[[-420,y],[420,y]],stroke:P.grid,lineWidth:1}));}
export function dot(view:View2D,x:number,y:number,r=8,color=P.teal){const n=new Circle({position:[x,y],size:r*2,fill:color});view.add(n);return n;}
export function line(view:View2D,points:PossibleVector2[],color=P.teal,width=3){const n=new Line({points,stroke:color,lineWidth:width,lineCap:'round',lineJoin:'round'});view.add(n);return n;}
export const v=(x:number,y:number)=>new Vector2(x,y);
export const TAU=Math.PI*2;
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
