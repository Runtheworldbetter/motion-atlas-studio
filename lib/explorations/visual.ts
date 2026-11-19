/** Original mathematical models for Atlas's interactive visual studies. */
export const clamp = (n: number, low = 0, high = 1) => Math.max(low, Math.min(high, n));
export const smooth = (n: number) => {const x = clamp(n); return x*x*x*(x*(x*6-15)+10);};

export function projectile(speed: number, degrees: number, gravity = 9.81) {
  if (![speed, degrees, gravity].every(Number.isFinite) || speed <= 0 || gravity <= 0 || degrees <= 0 || degrees >= 90) throw new RangeError('Choose positive speed and gravity, and an angle between 0 and 90 degrees.');
  const angle = degrees*Math.PI/180, vx = speed*Math.cos(angle), vy = speed*Math.sin(angle);
  const duration = 2*vy/gravity;
  return {vx, vy, duration, range: vx*duration, height: vy*vy/(2*gravity), at(time: number) {const t=clamp(time,0,duration); return {x:vx*t,y:Math.max(0,vy*t-gravity*t*t/2),vx,vy:vy-gravity*t};}};
}

/** Unit-mass spring released from rest; exact under-, critically- and over-damped solutions. */
export function springPosition(time: number, stiffness: number, damping: number, from = 0, to = 1) {
  if (![time, stiffness, damping, from, to].every(Number.isFinite) || stiffness <= 0 || damping < 0) throw new RangeError('A spring needs positive stiffness and non-negative damping.');
  const t=Math.max(0,time), w=Math.sqrt(stiffness), z=damping/(2*w), distance=from-to;
  if (Math.abs(z-1)<1e-6) return to+distance*Math.exp(-w*t)*(1+w*t);
  if(z<1){const wd=w*Math.sqrt(1-z*z);return to+distance*Math.exp(-z*w*t)*(Math.cos(wd*t)+(z*w/wd)*Math.sin(wd*t));}
  const d=Math.sqrt(z*z-1),r1=-w*(z-d),r2=-w*(z+d);
  return to+distance*(r2*Math.exp(r1*t)-r1*Math.exp(r2*t))/(r2-r1);
}

/** Exact velocity of the same unit-mass, initially stationary spring. */
export function springVelocity(time: number, stiffness: number, damping: number, from = 0, to = 1) {
  if (![time, stiffness, damping, from, to].every(Number.isFinite) || stiffness <= 0 || damping < 0) throw new RangeError('A spring needs positive stiffness and non-negative damping.');
  const t=Math.max(0,time),w=Math.sqrt(stiffness),z=damping/(2*w),distance=from-to;
  if(Math.abs(z-1)<1e-6)return -distance*w*w*t*Math.exp(-w*t);
  if(z<1){const wd=w*Math.sqrt(1-z*z);return -distance*w*w/wd*Math.exp(-z*w*t)*Math.sin(wd*t);}
  const d=Math.sqrt(z*z-1),r1=-w*(z-d),r2=-w*(z+d);
  return distance*r1*r2*(Math.exp(r1*t)-Math.exp(r2*t))/(r2-r1);
}

/** Passing through the target is not rest: position and velocity must both be small. */
export function springSettled(time:number,stiffness:number,damping:number,from:number,to:number,tolerance=.1){
  return Math.abs(springPosition(time,stiffness,damping,from,to)-to)<=tolerance&&Math.abs(springVelocity(time,stiffness,damping,from,to))<=tolerance;
}

/** Shared module and phase offsets keep the external gears meshed. */
export const gears = [
  {id:'input',name:'Input',teeth:12,turns:3,base:0,color:'#d6edaa'},
  {id:'idler',name:'Idler',teeth:24,turns:-1.5,base:Math.PI/24,color:'#7bc8cd'},
  {id:'output',name:'Output',teeth:36,turns:1,base:0,color:'#eeb586'},
] as const;

export function gearPath(teeth: number, module: number) {
  if (!Number.isInteger(teeth) || teeth < 12 || module <= 0) throw new RangeError('Use at least twelve teeth and a positive module.');
  const pitch=teeth*module/2,base=pitch*Math.cos(25*Math.PI/180),tip=pitch+module,root=pitch-1.25*module;
  const involute=(r:number)=>r<=base?0:Math.sqrt((r/base)**2-1)-Math.acos(base/r);
  const half=(r:number)=>Math.PI/(2*teeth)*.97+involute(pitch)-involute(r);
  const points:number[][]=[], point=(r:number,a:number)=>points.push([r*Math.cos(a),r*Math.sin(a)]), start=Math.max(root,base), step=2*Math.PI/teeth;
  for(let tooth=0;tooth<teeth;tooth++) {const center=tooth*step;point(root,center-half(start));for(let i=0;i<=7;i++){const r=start+(tip-start)*i/7;point(r,center-half(r));}for(let i=1;i<=4;i++)point(tip,center-half(tip)+2*half(tip)*i/4);for(let i=6;i>=0;i--){const r=start+(tip-start)*i/7;point(r,center+half(r));}point(root,center+half(start));for(let i=1;i<=5;i++)point(root,center+half(start)+(step-2*half(start))*i/5);}
  return points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(3)},${y.toFixed(3)}`).join(' ')+' Z';
}

export const probeParts = [
  {id:'antenna',title:'High-gain antenna',role:'A narrow radio beam carries measurements and receives commands.',color:'#d6edaa',offset:[0,-72]},
  {id:'bus',title:'Equipment bus',role:'The central structure holds computers, communications and control equipment.',color:'#b9b0da',offset:[0,80]},
  {id:'instruments',title:'Science instruments',role:'Different sensors turn their surroundings into measurements.',color:'#77c9ce',offset:[170,-20]},
  {id:'power',title:'Power supply',role:'A long-lived power source supplies the spacecraft and its instruments.',color:'#eeb586',offset:[-175,55]},
  {id:'boom',title:'Sensor boom',role:'A long support places sensitive instruments away from the main body.',color:'#b8c9b3',offset:[190,95]},
] as const;

/** CPU counterpart of Atlas's original GLSL material field. Coordinates preserve
 * WebGL's bottom-left origin; the returned opaque RGBA pixels use canvas rows. */
export function materialPixels(width:number,height:number,time:number,mode:number,amount:number,grain:number,pixels=new Uint8ClampedArray(width*height*4)){
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||pixels.length!==width*height*4||![time,amount,grain].every(Number.isFinite)||![0,1,2].includes(mode))throw new RangeError('Choose a positive frame size, a supported material, and finite controls.');
  const step=(low:number,high:number,value:number)=>{const t=clamp((value-low)/(high-low));return t*t*(3-2*t);};
  const centers=Array.from({length:5},(_,i)=>[Math.sin(time*.4+i*1.3)*.55,Math.cos(time*.3+i*2.1)*.26]);
  for(let y=0;y<height;y++){
    const glY=height-y-.5,py=glY/height-.5,wave=Math.sin(py*7+time)*amount*2+time,rowWave=.22*Math.cos(py*11-time*.7);
    for(let x=0;x<width;x++){
      const glX=x+.5,px=(glX-width/2)/height;
      let value=0;
      if(mode===0)value=.5+.24*Math.sin(px*12+wave)+rowWave;
      else if(mode===1){for(const [cx,cy] of centers)value+=.025*(.5+amount)/((px-cx)**2+(py-cy)**2+.004);value=step(.45,1.15,value);}
      else {const angle=Math.atan2(py,px)+time*.22;value=.5+.5*Math.sin(Math.hypot(px,py)*26-angle*amount*3+Math.sin(angle*3+time)*1.8);}
      const teal=step(.05,.65,value),lime=step(.64,1,value),hash=Math.sin(glX*127.1+glY*311.7)*43758.5453,noise=(hash-Math.floor(hash)-.5)*grain*.2,index=(y*width+x)*4;
      pixels[index]=255*((.075+(.34-.075)*teal)*(1-lime)+.83*lime+noise);
      pixels[index+1]=255*((.16+(.73-.16)*teal)*(1-lime)+.93*lime+noise);
      pixels[index+2]=255*((.14+(.75-.14)*teal)*(1-lime)+.64*lime+noise);
      pixels[index+3]=255;
    }
  }
  return pixels;
}
