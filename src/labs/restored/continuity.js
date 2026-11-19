export const meta={id:'continuity',title:'Follow the same object',eyebrow:'Identity across views',description:'One reading collection becomes a shelf, three themes and a view of reading time. Pick a book and keep following it as the layout changes.'};

export const BOOKS=[
 {id:'01',title:'Small Worlds',theme:'Ideas',hours:4},{id:'02',title:'Field Notes',theme:'Craft',hours:7},
 {id:'03',title:'Night Atlas',theme:'Stories',hours:9},{id:'04',title:'Making Space',theme:'Craft',hours:5},
 {id:'05',title:'Hidden Order',theme:'Ideas',hours:8},{id:'06',title:'Borrowed Light',theme:'Stories',hours:6},
 {id:'07',title:'Time & Form',theme:'Ideas',hours:10},{id:'08',title:'Lines & Layers',theme:'Craft',hours:3},
 {id:'09',title:'After the Rain',theme:'Stories',hours:4},{id:'10',title:'Open Questions',theme:'Ideas',hours:6},
 {id:'11',title:'Daily Objects',theme:'Craft',hours:8},{id:'12',title:'A Longer Way',theme:'Stories',hours:11}
];
const themes=['Ideas','Craft','Stories'],colors={Ideas:'#c9dba7',Craft:'#e9b998',Stories:'#abd1d2'};
const mix=(a,b,t)=>a+(b-a)*t,clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10)};
const NS='http://www.w3.org/2000/svg';

export function bookLayout(kind,width){
 const w=Math.max(270,width),narrow=w<600;
 if(kind===0){const cols=narrow?(w<380?2:3):6,gap=narrow?12:18,pad=narrow?16:35,bw=(w-2*pad-gap*(cols-1))/cols,bh=narrow?120:146;return{height:Math.ceil(BOOKS.length/cols)*(bh+24)+45,items:BOOKS.map((b,i)=>({x:pad+(i%cols)*(bw+gap),y:26+Math.floor(i/cols)*(bh+24),w:bw,h:bh})),labels:[]};}
 if(kind===1){const pad=narrow?16:35,bw=Math.min(154,(w-pad*2-36)/4),gap=(w-pad*2-bw*4)/3,counters={Ideas:0,Craft:0,Stories:0};return{height:370,items:BOOKS.map(b=>{let j=counters[b.theme]++;return{x:pad+j*(bw+gap),y:53+themes.indexOf(b.theme)*116,w:bw,h:60}}),labels:themes.map((t,i)=>({text:t+' · 4 books',x:pad,y:38+i*116}))};}
 const left=narrow?126:205,right=w-38,step=32;
 return{height:460,items:BOOKS.map((b,i)=>({x:left+(b.hours/12)*(right-left)-12,y:26+i*step,w:24,h:24})),labels:BOOKS.map((b,i)=>({text:b.title,x:12,y:43+i*step})),axis:{left,right,y:428}};
}

export function mount(container){
 let width=900,progress=0,selected='07',raf=0,stopped=false,playing=false,resizeObserver;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 container.innerHTML=`<div class="controls"><div class="continuity-layout" role="group" aria-label="Collection view"><button class="button" data-layout="0" type="button" aria-pressed="true">Shelf</button><button class="button" data-layout="1" type="button" aria-pressed="false">Themes</button><button class="button" data-layout="2" type="button" aria-pressed="false">Reading time</button></div><button class="button primary" data-play type="button">Play all views</button></div><div class="scene continuity-scene"><svg role="img" aria-label="Twelve fictional books retain their identity across a shelf, themes and reading-time plot"><title>One collection, three views</title><desc>Every coloured shape is the same book in every view. Select a book with a click or the keyboard.</desc><g data-back></g><g data-books></g><g data-top></g></svg></div><div class="continuity-legend"><span><i style="background:${colors.Ideas}"></i>Ideas</span><span><i style="background:${colors.Craft}"></i>Craft</span><span><i style="background:${colors.Stories}"></i>Stories</span><span>Outlined: selected book</span></div><div class="controls"><label class="control continuity-timeline">Story position <input aria-label="Collection story position" type="range" min="0" max="200" step="1" value="0"></label><span data-position class="muted">Shelf</span></div><div class="detail continuity-detail" aria-live="polite"><div><strong data-selected-title></strong><p data-selected-info></p></div><span>Fictional titles and illustrative reading times.</span></div>`;
 const svg=container.querySelector('svg'),back=container.querySelector('[data-back]'),bookLayer=container.querySelector('[data-books]'),top=container.querySelector('[data-top]'),slider=container.querySelector('input[type=range]'),play=container.querySelector('[data-play]');
 function el(tag,attrs={},parent=svg,text){const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;parent.appendChild(e);return e;}
 function txt(text,x,y,parent,attrs={}){return el('text',{x,y,fill:'#22372e','font-size':14,...attrs},parent,text);}
 const nodes=BOOKS.map(b=>{
  const g=el('g',{class:'continuity-book',tabindex:0,role:'button','aria-label':`Select ${b.title}, ${b.theme}, ${b.hours} reading hours`},bookLayer);
  el('title',{},g,b.title);const body=el('rect',{class:'book-body',rx:7,fill:colors[b.theme]},g),spine=el('path',{stroke:'#22372e','stroke-opacity':'.15','stroke-width':2,fill:'none'},g),rule=el('path',{stroke:'#22372e','stroke-opacity':'.25','stroke-width':1,fill:'none'},g);
  const label=el('text',{fill:'#22372e','font-size':14,'font-weight':500},g),id=txt(b.id,0,0,g,{'font-size':14,'font-weight':600}),halo=el('rect',{fill:'none',stroke:'#22372e','stroke-width':2,rx:10,'pointer-events':'none'},g);
  g.addEventListener('click',()=>{selected=b.id;draw();updateDetail()});g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selected=b.id;draw();updateDetail()}});
  return{g,body,spine,rule,label,id,halo};
 });
 function updateDetail(){const b=BOOKS.find(b=>b.id===selected);container.querySelector('[data-selected-title]').textContent=`${b.id} · ${b.title}`;container.querySelector('[data-selected-info]').textContent=`${b.theme} · ${b.hours} hours of reading · the same selection in every view`;}
 function draw(){if(stopped)return;
  const a=Math.min(1,Math.floor(progress)),b=Math.min(2,a+1),t=ease(progress-a),la=bookLayout(a,width),lb=bookLayout(b,width),height=mix(la.height,lb.height,t),near=Math.round(progress),catalogWeight=1-clamp(progress),timeWeight=clamp(progress-1);
  svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.style.height=height+'px';back.replaceChildren();top.replaceChildren();
  for(const[layout,alpha]of [[la,1-t],[lb,t]]){if(alpha<.005)continue;let group=el('g',{opacity:alpha},back);for(const l of layout.labels)txt(l.text,l.x,l.y,group,{'font-size':width<600?14:15});if(layout.axis){const{left,right,y}=layout.axis;el('path',{d:`M ${left} ${y-8} H ${right}`,stroke:'#9eafa2','stroke-width':1,fill:'none'},group);[0,4,8,12].forEach(v=>{const x=left+(v/12)*(right-left);txt(String(v),x,y+12,group,{'text-anchor':'middle'});});txt('Reading time (hours)',(left+right)/2,y+31,group,{'text-anchor':'middle'});}}
  BOOKS.forEach((book,i)=>{const p=la.items[i],q=lb.items[i],x=mix(p.x,q.x,t),y=mix(p.y,q.y,t),w=mix(p.w,q.w,t),h=mix(p.h,q.h,t),n=nodes[i],active=book.id===selected;
   n.g.setAttribute('transform',`translate(${x} ${y})`);n.g.setAttribute('aria-pressed',String(active));n.body.setAttribute('width',w);n.body.setAttribute('height',h);n.body.setAttribute('rx',mix(7,4,timeWeight));n.spine.setAttribute('d',`M 7 5 V ${h-5}`);n.spine.setAttribute('opacity',catalogWeight);n.rule.setAttribute('d',`M 13 ${h-32} H ${w-12}`);n.rule.setAttribute('opacity',catalogWeight);
   n.label.replaceChildren();let words=book.title.split(' '),lines=[],line='';const max=Math.max(6,Math.floor((w-22)/7.2));for(const word of words){if(line&&(line+' '+word).length>max){lines.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)lines.push(line);lines.forEach((line,j)=>el('tspan',{x:13,y:29+j*18},n.label,line));n.label.setAttribute('opacity',catalogWeight);
   n.id.setAttribute('x',mix(21,w/2,clamp(progress)));n.id.setAttribute('y',mix(h-13,h/2+5,clamp(progress)));n.id.setAttribute('text-anchor','middle');n.halo.setAttribute('x',-4);n.halo.setAttribute('y',-4);n.halo.setAttribute('width',w+8);n.halo.setAttribute('height',h+8);n.halo.setAttribute('opacity',active?1:0);
  });
  if(timeWeight>.99){const i=BOOKS.findIndex(b=>b.id===selected),p=bookLayout(2,width).items[i];const right=p.x+36<width-40;txt(BOOKS[i].hours+' h',right?p.x+36:p.x-9,p.y+17,top,{'font-size':14,'font-weight':600,'text-anchor':right?'start':'end'});}
  slider.value=String(Math.round(progress*100));container.querySelector('[data-position]').textContent=['Shelf','Themes','Reading time'][near];container.querySelectorAll('[data-layout]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.layout)===near)));
 }
 function stop(){cancelAnimationFrame(raf);playing=false;play.textContent='Play all views'}
 function go(to){stop();if(reduced.matches){progress=to;draw();return;}const from=progress,start=performance.now(),duration=850;const tick=now=>{const t=clamp((now-start)/duration);progress=mix(from,to,ease(t));draw();if(t<1)raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);}
 container.querySelectorAll('[data-layout]').forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.layout))));
 slider.addEventListener('input',()=>{stop();progress=Number(slider.value)/100;draw()});
 play.addEventListener('click',()=>{if(playing){stop();return;}if(reduced.matches){progress=2;draw();return;}stop();playing=true;play.textContent='Pause';progress=0;const start=performance.now();const tick=now=>{const s=(now-start)/1000;if(s<1)progress=0;else if(s<3)progress=ease((s-1)/2);else if(s<4.5)progress=1;else if(s<6.5)progress=1+ease((s-4.5)/2);else progress=2;draw();if(s<7.3&&playing)raf=requestAnimationFrame(tick);else stop()};raf=requestAnimationFrame(tick);});
 resizeObserver=new ResizeObserver(()=>{const next=Math.max(270,container.querySelector('.scene').getBoundingClientRect().width);if(next!==width){width=next;draw()}});resizeObserver.observe(container.querySelector('.scene'));updateDetail();draw();
 return{destroy(){stopped=true;stop();resizeObserver.disconnect()},getState(){return{study:'continuity',illustrative:true,progress,selected,books:BOOKS}},getSvg(){return svg}};
}
