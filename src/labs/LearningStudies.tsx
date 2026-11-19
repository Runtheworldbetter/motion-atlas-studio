import {useEffect, useMemo, useRef, useState} from 'react';
import {batchHistogram, binomialProbabilities, classificationData, classificationScore, classify, computeToyAttention, fitClassificationThreshold, runningProportions, sampleBernoulli, TOY_EMBEDDINGS, TOY_MATRICES, TOY_VOCABULARY} from '../../lib/explorations/learning';
import type {ClassificationItem, Vector2} from '../../lib/explorations/learning';
import './learning-studies.css';

const INK = '#263a2e', TEAL = '#66bfc3', ORANGE = '#e5a16b', LIME = '#d6edaa', PAPER = '#f5f6ef';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (n: number) => { const t = clamp(n); return t * t * t * (t * (t * 6 - 15) + 10); };
const interpolate = (a: number, b: number, t: number) => a + (b - a) * t;
const vector = (v: Vector2) => `[${v.map(x => x.toFixed(2)).join(', ')}]`;
const percent = (value: number) => `${(value * 100).toFixed(1)}%`;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    const change = () => setReduced(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  return reduced;
}

function useFigureWidth(mounted = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(760);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setWidth(Math.max(240, Math.round(element.getBoundingClientRect().width)));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [mounted]);
  return [ref, width] as const;
}

function useStory(count: number) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const current = useRef(progress);
  current.current = progress;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const from = current.current, start = performance.now();
    const tick = (now: number) => {
      const next = Math.min(count - 1, from + (now - start) / 2600);
      setProgress(next);
      if (next >= count - 1) setPlaying(false);
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, epoch, count]);
  return {
    progress, visual: reduced ? Math.round(progress) : progress, playing, reduced,
    jump: (step: number) => { setPlaying(false); setProgress(step); },
    pause: () => setPlaying(false),
    replay: () => { setProgress(0); current.current = 0; setEpoch(value => value + 1); setPlaying(true); },
  };
}

function StoryControls({labels, story}: {labels: readonly string[]; story: ReturnType<typeof useStory>}) {
  return <div className="learning-story-controls">
    <div className="learning-steps" role="group" aria-label="Explanation stages">
      {labels.map((label, i) => <button key={label} type="button" className={`lab-button ${Math.round(story.progress) === i ? 'is-active' : ''}`} aria-pressed={Math.round(story.progress) === i} onClick={() => story.jump(i)}><span>{String(i + 1).padStart(2, '0')}</span>{label}</button>)}
    </div>
    <div className="lab-controls learning-transport">
      <button className="lab-button" onClick={story.playing ? story.pause : story.replay}>{story.playing ? 'Pause' : 'Play whole story'}</button>
      <button className="lab-button" onClick={story.replay}>Replay</button>
      <label className="lab-field learning-scrub">Story position<input aria-label="Story position" type="range" min="0" max={(labels.length - 1) * 100} value={Math.round(story.progress * 100)} onChange={e => story.jump(Number(e.target.value) / 100)}/></label>
    </div>
    {story.reduced && <p className="lab-note">Reduced motion: playback uses readable stage poses.</p>}
  </div>;
}

const CLASS_STAGES = ['Collection', 'Light', 'Two features', 'Split', 'Tree', 'Test outcomes'] as const;
const CLASS_NOTES = [
  'Meet 36 synthetic plants. Color is their known class; a dashed ring marks the 12 held-out examples. Select one and follow its ID.',
  'Arrange the same plants by hours of light. No objects are added or replaced.',
  'Add soil moisture as a second feature. The simple classifier will still use only light, so some differences remain unexplained.',
  'Move one threshold: below it predicts shade; at or above it predicts sun. Each plant keeps its original class color.',
  'The same rule becomes a two-leaf decision tree. The 24 training examples choose the fitted threshold.',
  'Reveal performance on the 12 held-out plants. A cross marks a wrong prediction. Scores are computed from the rule and fixed labels.',
] as const;

function classificationPosition(item: ClassificationItem, index: number, stage: number, width: number, data: readonly ClassificationItem[], threshold: number) {
  const small = width < 560, columns = small ? 6 : 9, gap = (width - 64) / Math.max(1, columns - 1);
  const grid = {x: 32 + index % columns * gap, y: 112 + Math.floor(index / columns) * (small ? 57 : 78)};
  if (stage === 0) return grid;
  if (stage === 1) return {x: 38 + item.light / 12 * (width - 76), y: 145 + (index % 6) * 43};
  if (stage === 2) return {x: 38 + item.light / 12 * (width - 76), y: 430 - item.moisture / 100 * 302};
  const isSun = classify(item, threshold) === 'sun';
  const branch = data.filter(x => (classify(x, threshold) === 'sun') === isSun);
  const rank = branch.findIndex(x => x.id === item.id), sideColumns = small ? 3 : 5;
  if (stage === 3 || stage === 4) {
    const center = width * (isSun ? .75 : .25), branchWidth = width * .43;
    return {x: center - branchWidth / 2 + 20 + rank % sideColumns * (branchWidth - 40) / (sideColumns - 1), y: (stage === 4 ? 230 : 138) + Math.floor(rank / sideColumns) * (small ? 32 : 38)};
  }
  const correct = classify(item, threshold) === item.label;
  if (small) {
    const partitionItems = data.filter(x => x.partition === item.partition);
    const order = partitionItems.findIndex(x => x.id === item.id);
    return {x: 32 + order % 6 * (width - 64) / 5, y: (item.partition === 'train' ? 150 : 365) + Math.floor(order / 6) * 42};
  }
  const group = data.filter(x => x.partition === item.partition && (classify(x, threshold) === x.label) === correct);
  const rankInGroup = group.findIndex(x => x.id === item.id);
  const ncols = small ? 3 : 6, span = width * .43;
  return {x: width * (correct ? .25 : .75) - span / 2 + 18 + rankInGroup % ncols * (span - 36) / (ncols - 1), y: (item.partition === 'train' ? 150 : 325) + Math.floor(rankInGroup / ncols) * (small ? 33 : 37)};
}

export function ClassificationStudy() {
  const data = useMemo(classificationData, []);
  const fitted = useMemo(() => fitClassificationThreshold(data), [data]);
  const [threshold, setThreshold] = useState(fitted);
  const [selectedId, setSelectedId] = useState('P08');
  const story = useStory(CLASS_STAGES.length);
  const [figure, width] = useFigureWidth();
  const lower = Math.floor(story.visual), upper = Math.min(5, lower + 1), blend = ease(story.visual - lower);
  const stage = Math.round(story.visual), selected = data.find(item => item.id === selectedId)!;
  const canvasHeight = width < 560 ? 620 : 520;
  const train = classificationScore(data, threshold, 'train'), test = classificationScore(data, threshold, 'test');
  const lineX = 38 + threshold / 12 * (width - 76);
  const positions = data.map((item, index) => {
    const a = classificationPosition(item, index, lower, width, data, threshold), b = classificationPosition(item, index, upper, width, data, threshold);
    return {x: interpolate(a.x, b.x, blend), y: interpolate(a.y, b.y, blend)};
  });
  return <section className="lab-demo learning-study" data-export-state={JSON.stringify({study:'classification',threshold,fittedThreshold:fitted,selectedId,stage:CLASS_STAGES[stage],progress:story.progress,data,training:train,test:stage===5?test:'Not yet revealed',basis:'Fixed synthetic data; one-feature decision stump fitted only on training labels.'})}>
    <StoryControls labels={CLASS_STAGES} story={story}/>
    <div className="lab-controls">
      <label className="lab-field">Light threshold: {threshold.toFixed(2)} hours<input type="range" min="0" max="12" step="0.05" value={threshold} onChange={e => {story.pause(); setThreshold(Number(e.target.value));}}/></label>
      <button className="lab-button" onClick={() => setThreshold(fitted)}>Fit on 24 training plants</button>
      <label className="lab-field">Follow a plant<select value={selectedId} onChange={e=>setSelectedId(e.target.value)}>{data.map(item=><option key={item.id} value={item.id}>{item.id} · {item.partition}</option>)}</select></label>
    </div>
    <div className="learning-legend"><span><i style={{background:ORANGE}}/>Known sun class</span><span><i style={{background:TEAL}}/>Known shade class</span><span>Dashed ring = held out</span><span>✕ = incorrect</span></div>
    <div className="lab-canvas learning-figure" ref={figure}>
      <svg data-export="true" viewBox={`0 0 ${width} ${canvasHeight}`} role="img" aria-label={`${CLASS_STAGES[stage]}. ${CLASS_NOTES[stage]}`}>
        <rect width={width} height={canvasHeight} fill={PAPER}/>
        <text x="24" y="35" fontSize="19" fontWeight="600">{CLASS_STAGES[stage]}</text>
        {(stage===1||stage===2)&&<g className="learning-axis"><path d={`M38 86 V450 H${width-28}`} fill="none" stroke="#899786"/>{[0,6,12].map(value=><text key={value} x={38+value/12*(width-76)} y="475" textAnchor="middle">{value}h</text>)}<text x={width/2} y="502" textAnchor="middle">Daily light</text>{stage===2&&<text x="24" y="71">Moisture: low ↓ high ↑</text>}{stage===2&&<line x1={lineX} x2={lineX} y1="90" y2="445" stroke={INK} strokeDasharray="5 5"/>}</g>}
        {stage===3&&<g><line x1={width/2} x2={width/2} y1="98" y2="470" stroke="#b1bba9"/><text x={width*.25} y="85" textAnchor="middle">Predict shade</text><text x={width*.75} y="85" textAnchor="middle">Predict sun</text></g>}
        {stage===4&&<g><rect x={width/2-96} y="65" width="192" height="45" rx="12" fill={LIME}/><text x={width/2} y="94" textAnchor="middle">Light ≥ {threshold.toFixed(2)}h?</text><path d={`M${width/2} 110 L${width*.25} 169 M${width/2} 110 L${width*.75} 169`} fill="none" stroke={INK}/><text x={width*.25} y="191" textAnchor="middle">No → shade</text><text x={width*.75} y="191" textAnchor="middle">Yes → sun</text></g>}
        {stage===5&&<g>{width<560?<text x="20" y="83">Crosses mark incorrect predictions</text>:<><text x={width*.25} y="83" textAnchor="middle">Correct</text><text x={width*.75} y="83" textAnchor="middle">Incorrect</text></>}<text x="20" y="117">Training · {train.correct}/{train.total}</text><line x1="18" x2={width-18} y1={width<560?319:278} y2={width<560?319:278} stroke="#c5cdbf"/><text x="20" y={width<560?343:303}>Held out · {test.correct}/{test.total}</text></g>}
        {data.map((item,index)=>{
          const position=positions[index], active=item.id===selectedId, wrong=stage===5&&classify(item,threshold)!==item.label;
          return <g key={item.id} transform={`translate(${position.x} ${position.y})`} role="button" tabIndex={0} aria-label={`${item.id}, ${item.partition}, ${item.label}, ${item.light} hours light, ${item.moisture}% moisture`} onClick={()=>setSelectedId(item.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelectedId(item.id);}}} className="learning-object">
            <title>{item.id}: {item.label}; {item.partition}; light {item.light}h; moisture {item.moisture}%</title>
            <circle r="22" fill="transparent"/>
            {active&&<circle r="20" fill="none" stroke={INK} strokeWidth="2"/>}
            <circle r="15" fill={item.label==='sun'?ORANGE:TEAL} stroke={INK} strokeWidth={active?2:1} strokeDasharray={item.partition==='test'?'3 3':undefined}/>
            <text y="5" textAnchor="middle" fontSize="14" fontWeight={active?700:500}>{item.id.slice(1)}</text>
            {wrong&&<path d="M10 -21 l8 8 M18 -21 l-8 8" stroke={INK} strokeWidth="2.5"/>}
          </g>;
        })}
        <circle cx={positions[data.findIndex(item=>item.id===selectedId)].x} cy={positions[data.findIndex(item=>item.id===selectedId)].y} r="20" fill="none" stroke={INK} strokeWidth="2" pointerEvents="none"/>
      </svg>
    </div>
    <div className="lab-insight learning-inspector"><strong>{selected.id} stays selected</strong><span>{selected.light}h light · {selected.moisture}% moisture · {selected.partition}</span><span>Known: {selected.label} · Prediction: {classify(selected,threshold)} · {classify(selected,threshold)===selected.label?'correct':'incorrect'}</span></div>
    <p className="lab-note">{CLASS_NOTES[stage]}</p>
    <p className="lab-note">The fitted rule minimizes training errors. Manual tuning after viewing test results makes the test score exploratory. Original data and implementation; <a href="https://r2d3.us/visual-intro-to-machine-learning-part-1/" target="_blank" rel="noreferrer">see the R2D3 inspiration ↗</a>.</p>
  </section>;
}

const ATTENTION_STAGES = ['Tokens', 'Q · K', 'Causal mask', 'Mix values', 'Output'] as const;
const ATTENTION_NOTES = [
  'Whitespace-separated words become two-number embeddings, with a small positional offset. Select a query token to follow its calculation.',
  'Three fixed matrices create Q, K and V. Each query–key dot product is divided by √2, the square root of the key dimension.',
  'Future positions receive −∞ before softmax. Their attention is exactly zero; visible past positions and the current token sum to one.',
  'Multiply each value vector by its attention weight and add the results. The mixed vector is computed from the selected query row.',
  'A fixed linear readout turns the mixed vector into eight logits. Temperature changes only this output softmax, not the attention weights.',
] as const;

export function TransformerStudy() {
  const [input,setInput]=useState('we share clear ideas with context');
  const [query,setQuery]=useState(3),[temperature,setTemperature]=useState(.8);
  const story=useStory(ATTENTION_STAGES.length),stage=Math.round(story.visual);
  const model=useMemo(()=>computeToyAttention(input,query,temperature),[input,query,temperature]);
  const [figure,width]=useFigureWidth(Boolean(model));
  const keyWidth=width<500?Math.min(160,width*.52):210;
  const svgHeight=460,queryX=width<300?42:width<500?52:width*.2,keyX=width<500?width-keyWidth/2-12:width*.73;
  const keyY=(index:number)=>91+index*51;
  const queryY=217;
  const output = model ? model.vocabulary.map((token,i)=>({token,probability:model.probabilities[i],logit:model.logits[i]})).sort((a,b)=>b.probability-a.probability) : [];
  return <section className="lab-demo learning-study" data-export-state={JSON.stringify({study:'toy-attention',input,query:model?.query??query,temperature,stage:ATTENTION_STAGES[stage],progress:story.progress,matrices:TOY_MATRICES,model:model?{...model,maskedScores:model.maskedScores.map(value=>Number.isFinite(value)?value:'-Infinity')}:null,basis:'Original hand-set two-dimensional matrices; one causal head, no training, residual, MLP or GPT-2 weights.'})}>
    <div className="learning-model-label">ONE CAUSAL HEAD <span>Computed · hand-set · untrained</span></div>
    <p className="lab-note">A small, inspectable attention model. It calculates real matrix operations; it is not GPT-2 or a trained language model.</p>
    <div className="lab-controls"><label className="lab-field learning-input">Input sequence<input value={input} maxLength={160} onChange={e=>{story.pause();setInput(e.target.value);}} aria-describedby="learning-token-help"/></label><label className="lab-field">Output temperature: {temperature.toFixed(1)}<input type="range" min="0.2" max="2" step="0.1" value={temperature} onChange={e=>setTemperature(Number(e.target.value))}/></label></div>
    <p className="lab-note" id="learning-token-help">The first six whitespace tokens are used. Vocabulary: {TOY_VOCABULARY.join(', ')}. Other words share an explicit unknown vector.</p>
    <StoryControls labels={ATTENTION_STAGES} story={story}/>
    {!model?<div className="lab-canvas learning-figure" ref={figure}><svg data-export="true" viewBox={`0 0 ${width} 180`} role="img" aria-label="Enter at least one token to inspect its calculation."><rect width={width} height="180" fill={PAPER}/><text x="20" y="75" fontSize="18">Enter at least one token.</text><text x="20" y="105">No calculation yet.</text></svg></div>:<>
      <div className="learning-token-row" role="group" aria-label="Select the query token">{model.tokens.map((token,i)=><button key={`${i}-${token}`} className={`lab-button ${model.query===i?'is-active':''}`} onClick={()=>setQuery(i)} aria-pressed={model.query===i}><span>{i+1}</span>{token.slice(0,16)}{!Object.hasOwn(TOY_EMBEDDINGS,token)?' · unknown':''}</button>)}</div>
      <div className="lab-canvas learning-figure" ref={figure}><svg data-export="true" viewBox={`0 0 ${width} ${svgHeight}`} role="img" aria-label={`${ATTENTION_STAGES[stage]} for query ${model.query+1}, ${model.tokens[model.query]}.`}>
        <rect width={width} height={svgHeight} fill={PAPER}/>
        <text x="20" y="31" fontSize="18" fontWeight="600">{width<500?ATTENTION_STAGES[stage]:stage===0?'A position has a vector':stage===1?'Compare the query with each key':stage===2?'The future is masked':stage===3?'Mix the visible values':'A vector becomes a distribution'}</text>
        {model.tokens.map((token,i)=>{
          const masked=i>model.query,weight=model.attention[i],y=keyY(i),limit=width<500?7:12,label=token.length>limit?token.slice(0,limit-1)+'…':token;
          return <g key={i}>
            {stage>=1&&<path d={`M${queryX+35} ${queryY} C${width*.43} ${queryY} ${width*.42} ${y} ${keyX-keyWidth/2} ${y}`} fill="none" stroke={masked&&stage>=2?'#b8c1b1':TEAL} strokeWidth={stage>=2?masked?1:2+weight*13:2} strokeDasharray={masked&&stage>=2?'4 5':undefined}/>} 
            <rect x={keyX-keyWidth/2} y={y-20} width={keyWidth} height="42" rx="9" fill={masked&&stage>=2?'#e8ebe1':i===model.query?LIME:'#fcfdf8'} stroke={i===model.query?INK:'#bac6b3'}/>
            <text x={keyX-keyWidth/2+10} y={width<500&&stage>0?y-3:y+5} fontSize="14">{i+1} {label}</text>
            <text x={keyX+keyWidth/2-9} y={width<500?y+16:y+5} textAnchor="end" fontSize="14" fontWeight="600">{stage>=2?masked?'×':percent(weight):stage===1?model.scaledScores[i].toFixed(2):''}</text>
          </g>;
        })}
        <rect x={queryX-34} y={queryY-27} width="68" height="54" rx="12" fill={INK}/><text x={queryX} y={queryY-42} textAnchor="middle">Query {model.query+1}</text><text x={queryX} y={queryY+5} textAnchor="middle" fill={PAPER} fontSize="14">{model.tokens[model.query].slice(0,7)}</text>
        <text x="20" y="430" fontSize="14">{stage>=3?`Mixed value = ${vector(model.mixed)}`:stage>=2?'× = future, attention 0':stage===1?'Scores = (Q · K) / √2':'Embedding + position → Q / K / V'}</text>
      </svg></div>
      <p className="lab-insight"><strong>{ATTENTION_STAGES[stage]}.</strong> {ATTENTION_NOTES[stage]}</p>
      <div className="learning-vector-strip"><div className="lab-stat"><span>Selected Q</span><strong>{vector(model.queries[model.query])}</strong></div><div className="lab-stat"><span>Attention sum</span><strong>{model.attention.reduce((a,b)=>a+b,0).toFixed(6)}</strong></div><div className="lab-stat"><span>Weighted V</span><strong>{vector(model.mixed)}</strong></div></div>
      <details className="learning-details" open={stage===1||stage===2||stage===3}><summary>Inspect the actual numbers</summary><div className="learning-table-scroll"><table><thead><tr><th>Position / token</th><th>K</th><th>Q · K</th><th>÷ √2</th><th>Mask</th><th>Attention</th><th>V</th></tr></thead><tbody>{model.tokens.map((token,i)=><tr key={i} className={i===model.query?'learning-selected-row':''}><th>{i+1} · {token.slice(0,20)}</th><td>{vector(model.keys[i])}</td><td>{model.dotProducts[i].toFixed(3)}</td><td>{model.scaledScores[i].toFixed(3)}</td><td>{i>model.query?'−∞':'visible'}</td><td>{percent(model.attention[i])}</td><td>{vector(model.values[i])}</td></tr>)}</tbody></table></div><p className="lab-note">Attention = softmax(mask(QKᵀ / √2)). Mixed value = Σ attentionᵢ × Vᵢ.</p></details>
      {stage===4&&<div className="learning-distribution"><h4>Output after the selected position</h4>{output.map(item=><div className="learning-probability-row" key={item.token}><span>{item.token}</span><div><i style={{width:`${item.probability*100}%`}}/></div><strong>{percent(item.probability)}</strong></div>)}<p className="lab-note">Output = softmax(logits / {temperature.toFixed(1)}). These hand-set logits illustrate a distribution; the highest bar is not a meaningful language prediction.</p></div>}
      <details className="learning-details"><summary>Embedding and matrix definitions</summary><p className="lab-note">Row vectors: x = token embedding + [0.08 × position, −0.05 × position], with zero-based position. Unknown embedding = [−0.4, −0.4]. Q = xWQ; K = xWK; V = xWV. Output logit for word w = mixed V · embedding(w).</p><pre>{JSON.stringify({embeddings:TOY_EMBEDDINGS,matrices:TOY_MATRICES},null,2)}</pre></details>
    </>}
    <p className="lab-note">Go deeper with the <a href="https://poloclub.github.io/transformer-explainer/" target="_blank" rel="noreferrer">original Transformer Explainer running GPT-2 ↗</a>. Mathematical reference: <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer">Attention Is All You Need ↗</a>.</p>
  </section>;
}

export function ProbabilityStudy() {
  const [bias,setBias]=useState(.5),[seed,setSeed]=useState(731),[count,setCount]=useState(0),[running,setRunning]=useState(false);
  const frame=useRef(0),reduced=useReducedMotion(),[figure,width]=useFigureWidth();
  const outcomes=useMemo(()=>sampleBernoulli(seed,bias,1000),[seed,bias]);
  const samples=outcomes.slice(0,count),proportions=runningProportions(samples),heads=samples.reduce((a,b)=>a+b,0);
  const histogram=batchHistogram(samples),expected=binomialProbabilities(10,bias);
  const chartLeft=44,chartRight=width-22,chartWidth=chartRight-chartLeft,traceTop=174,traceHeight=145,barTop=409,barHeight=137;
  const scaleY=Math.min(1,Math.max(.25,...expected,...histogram.proportions)*1.05);
  const trace=proportions.map((p,i)=>`${i===0?'M':'L'}${chartLeft+(i+1)/Math.max(count,1)*chartWidth},${traceTop+(1-p)*traceHeight}`).join(' ');
  useEffect(()=>()=>cancelAnimationFrame(frame.current),[]);
  const stop=()=>{cancelAnimationFrame(frame.current);setRunning(false);};
  const reset=()=>{stop();setCount(0);};
  const run=(quantity:number)=>{
    stop();
    const target=Math.min(1000,count+quantity);
    if(reduced||quantity===1){setCount(target);return;}
    const start=performance.now(),from=count;
    setRunning(true);
    const tick=(now:number)=>{
      const t=clamp((now-start)/2200);
      setCount(Math.min(target,from+Math.ceil((target-from)*t)));
      if(t<1)frame.current=requestAnimationFrame(tick);else setRunning(false);
    };
    frame.current=requestAnimationFrame(tick);
  };
  const recent=samples.slice(-12),coinsPerRow=Math.max(1,Math.floor((width-44)/34));
  return <section className="lab-demo learning-study" data-export-state={JSON.stringify({study:'probability',model:'Independent Bernoulli(p); disjoint batches of 10; exact Binomial(10,p) reference.',bias,seed,count,samples,heads,empirical:count?heads/count:null,expected: bias,batchHistogram:histogram,binomial:expected})}>
    <div className="lab-controls"><label className="lab-field">Probability of heads: {percent(bias)}<input type="range" min="0" max="1" step="0.01" value={bias} onChange={e=>{reset();setBias(Number(e.target.value));}}/></label><label className="lab-field learning-seed">Seed<input type="number" min="0" max="4294967295" step="1" value={seed} onChange={e=>{reset();setSeed(clamp(Math.trunc(Number(e.target.value)||0),0,4294967295));}}/></label></div>
    <div className="lab-controls"><button className="lab-button" disabled={count>=1000||running} onClick={()=>run(1)}>Flip once</button><button className="lab-button" disabled={count>=1000||running} onClick={()=>run(100)}>Run 100 flips</button><button className="lab-button" disabled={count>=1000||running} onClick={()=>run(1000-count)}>Run to 1,000</button>{running&&<button className="lab-button" onClick={stop}>Pause</button>}<button className="lab-button" onClick={reset}>Reset same seed</button><button className="lab-button" onClick={()=>{reset();setSeed((seed+1)>>>0);}}>New seed</button></div>
    <div className="learning-vector-strip"><div className="lab-stat"><span>Observed heads</span><strong>{heads} / {count}</strong></div><div className="lab-stat"><span>Empirical proportion</span><strong>{count?percent(heads/count):'—'}</strong></div><div className="lab-stat"><span>Expected proportion</span><strong>{percent(bias)}</strong></div></div>
    <div className="lab-canvas learning-figure" ref={figure}><svg data-export="true" viewBox={`0 0 ${width} 600`} role="img" aria-label={`Seeded coin experiment: ${heads} heads in ${count} flips. Expected probability ${percent(bias)}.`}>
      <rect width={width} height="600" fill={PAPER}/><text x="20" y="29" fontSize="18" fontWeight="600">{width<400?'One run, many flips':'A single run has a history'}</text>
      {recent.length?recent.map((value,i)=><g key={count-recent.length+i} transform={`translate(${27+(i%coinsPerRow)*34} ${62+Math.floor(i/coinsPerRow)*33})`}><circle r="14" fill={value?TEAL:'#fcfdf8'} stroke={INK}/><text y="5" textAnchor="middle" fontSize="14">{value?'H':'T'}</text></g>):<text x="20" y="74">Run an experiment to begin.</text>}
      <text x="20" y="144">Running proportion of heads</text>
      {[0,.5,1].map(value=><g key={value}><line x1={chartLeft} x2={chartRight} y1={traceTop+(1-value)*traceHeight} y2={traceTop+(1-value)*traceHeight} stroke="#d8ded0"/><text x={chartLeft-8} y={traceTop+(1-value)*traceHeight+5} textAnchor="end">{value}</text></g>)}
      <line x1={chartLeft} x2={chartRight} y1={traceTop+(1-bias)*traceHeight} y2={traceTop+(1-bias)*traceHeight} stroke="#348c91" strokeWidth="2" strokeDasharray="6 5"/>
      <path d={trace} fill="none" stroke={INK} strokeWidth="2"/>
      <text x={chartLeft} y="342">0</text><text x={chartRight} y="342" textAnchor="end">{count} flips</text>
      <text x="20" y="382" fontSize="17" fontWeight="600">Heads in batches of 10</text>
      <text x="20" y="402" fontSize="14">{histogram.batches} complete batches</text>
      <line x1={chartLeft} x2={chartRight} y1={barTop} y2={barTop} stroke="#d8ded0"/><text x={chartLeft-7} y={barTop+5} textAnchor="end" fontSize="14">{Math.round(scaleY*100)}%</text><text x={chartLeft-7} y={barTop+barHeight+5} textAnchor="end" fontSize="14">0%</text>
      {expected.map((probability,k)=>{
        const slot=chartWidth/11,x=chartLeft+k*slot+slot*.13,barWidth=slot*.74;
        return <g key={k}><rect x={x} y={barTop+barHeight-probability/scaleY*barHeight} width={barWidth} height={probability/scaleY*barHeight} fill={TEAL} opacity=".32"/><rect x={x+barWidth*.15} y={barTop+barHeight-histogram.proportions[k]/scaleY*barHeight} width={barWidth*.7} height={histogram.proportions[k]/scaleY*barHeight} fill={INK}/><text x={x+barWidth/2} y="568" textAnchor="middle" fontSize="14">{k}</text><title>{k} heads: exact {percent(probability)}; observed {percent(histogram.proportions[k])}</title></g>;
      })}
      <line x1={chartLeft} x2={chartRight} y1={barTop+barHeight} y2={barTop+barHeight} stroke={INK}/><text x={width/2} y="592" textAnchor="middle">Number of heads</text>
    </svg></div>
    <div className="learning-legend"><span><i style={{background:INK}}/>Observed</span><span><i style={{background:TEAL}}/>Exact model</span><span>Dashed line = probability p</span></div>
    <p className="lab-insight">Each flip is an independent Bernoulli trial with fixed p = {bias.toFixed(2)}. A batch of ten has expected heads {Number((10*bias).toFixed(2))} and variance {(10*bias*(1-bias)).toFixed(2)}. Incomplete batches are excluded from the histogram.</p>
    <details className="learning-details"><summary>Exact distribution and observed frequencies</summary><div className="learning-table-scroll"><table><thead><tr><th>Heads in 10</th><th>Exact probability</th><th>Observed batches</th><th>Observed proportion</th></tr></thead><tbody>{expected.map((p,k)=><tr key={k}><th>{k}</th><td>{percent(p)}</td><td>{histogram.counts[k]}</td><td>{histogram.batches?percent(histogram.proportions[k]):'—'}</td></tr>)}</tbody></table></div></details>
    <p className="lab-note">Same seed + same bias gives the same sample sequence. Changing bias starts a new experiment. A finite run need not match the exact probability. Original implementation inspired by <a href="https://seeing-theory.brown.edu/basic-probability/index.html" target="_blank" rel="noreferrer">Seeing Theory ↗</a>; exact model: <a href="https://itl.nist.gov/div898/handbook/eda/section3/eda366i.htm" target="_blank" rel="noreferrer">NIST binomial distribution ↗</a>.</p>
  </section>;
}
