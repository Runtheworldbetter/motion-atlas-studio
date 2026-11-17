import {useEffect, useMemo, useRef, useState} from 'react';
import {
  ArrowDownToLine, ArrowRight, AudioLines, BarChart3, BookOpen, Braces,
  Check, CheckCircle2, ChevronDown, Code2, Copy, ExternalLink, FileJson,
  FolderOpen, GitBranch, Heart, Info, Layers3, Link2, Loader2,
  Play, RotateCcw, Route, Search, ShieldCheck, Sparkles, Trash2, Upload,
} from 'lucide-react';
import {recipes} from '../lib/recipes/catalog';
import type {RecipeDefinition, RecipeId, RecipeResult} from '../lib/recipes/types';
import {specs, scenes} from '../lib/motion/catalog';
import {getSceneBasis} from '../lib/motion/basis';
import {PREFERENCE_KEY, validatePreferences, type Preferences, type Preference} from '../lib/preferences';
import {createZip} from '../lib/zip';
import {MotionPlayer, useReducedMotion} from './Player';
import {CodeEditor, Dialog, VoteButtons} from './components';
import initialRecipe from './initial-recipe';

const REPOSITORY = 'https://github.com/Runtheworldbetter/motion-atlas-studio';
const FILE_LIMIT = 128 * 1024;
const recipeIcons = {trace: GitBranch, waterfall: BarChart3, code: Braces, fourier: AudioLines, pathfinding: Route};
const recipeNames = {trace: 'Event trace', waterfall: 'Waterfall', code: 'Code diff', fourier: 'Harmonics', pathfinding: 'Pathfinder'};
const validPreferenceIds = new Set([...specs.map(s => s.id), ...recipes.map(r => `recipe:${r.id}`)]);
const sourceLoaders = import.meta.glob('../lib/{recipes,motion}/*.ts', {query: '?raw', import: 'default'});
type Draft = {input: string; secondary: string; exampleId: string; renderedInput: string; renderedSecondary: string};
type Inputs = {recipe: RecipeId; input: string; secondary?: string};

function requestedRecipe(): RecipeDefinition {
  const params = new URLSearchParams(location.search);
  return recipes.find(r => r.id === params.get('recipe')) ?? recipes.find(r => r.id === initialRecipe?.recipe) ?? recipes[0];
}
function startingDraft(recipe: RecipeDefinition): Draft {
  const params = new URLSearchParams(location.search);
  const example = (params.get('recipe') === recipe.id && recipe.examples.find(e => e.id === params.get('example'))) || recipe.examples[0];
  const custom = initialRecipe?.recipe === recipe.id && !params.has('example') ? initialRecipe : null;
  const input = custom?.input ?? example.input;
  const secondary = custom?.secondary ?? example.secondary ?? '';
  return {input, secondary, exampleId: custom ? '' : example.id, renderedInput: input, renderedSecondary: secondary};
}
function download(content: BlobPart, filename: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], {type}));
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
function downloadSnapshot(canvas: HTMLCanvasElement, name: string) {
  canvas.toBlob(blob => {if (blob) download(blob, `motion-atlas-${name}.png`, 'image/png');}, 'image/png');
}
function sourceGroup(id: string) {
  const category = specs.find(s => s.id === id)?.category;
  return category === 'Math & nature' ? 'math' : category === 'Systems & AI' ? 'systems' : category === 'Data stories' ? 'data' : 'craft';
}

export default function App() {
  const [recipeId, setRecipeId] = useState<RecipeId>(() => requestedRecipe().id);
  const [drafts, setDrafts] = useState<Record<RecipeId, Draft>>(() => Object.fromEntries(recipes.map(r => [r.id, startingDraft(r)])) as Record<RecipeId, Draft>);
  const [results, setResults] = useState<Record<RecipeId, RecipeResult>>(() => Object.fromEntries(recipes.map(r => {const d = startingDraft(r); return [r.id, r.compile(d.input, d.secondary)];})) as Record<RecipeId, RecipeResult>);
  const [errors, setErrors] = useState<Partial<Record<RecipeId, string>>>({});
  const [activeTab, setActiveTab] = useState<'explain' | 'data' | 'source'>('explain');
  const [sourceText, setSourceText] = useState('');
  const [sourceModal, setSourceModal] = useState<{path: string; text: string} | null>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [selectedScene, setSelectedScene] = useState<string | null>(() => {
    const id = new URLSearchParams(location.search).get('scene'); return id && specs.some(s => s.id === id) ? id : null;
  });
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All experiments');
  const [voteFilter, setVoteFilter] = useState('all');
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {return validatePreferences(JSON.parse(localStorage.getItem(PREFERENCE_KEY) ?? '{}'), validPreferenceIds);} catch {return {};}
  });
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [galleryPlaying, setGalleryPlaying] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const reduced = useReducedMotion();
  const primaryUpload = useRef<HTMLInputElement>(null);
  const secondaryUpload = useRef<HTMLInputElement>(null);
  const preferencesUpload = useRef<HTMLInputElement>(null);
  const recipe = recipes.find(r => r.id === recipeId)!;
  const draft = drafts[recipeId];
  const result = results[recipeId];
  const dirty = draft.input !== draft.renderedInput || draft.secondary !== draft.renderedSecondary;
  const error = errors[recipeId];
  const embed = new URLSearchParams(location.search).get('embed') === '1';
  const activeExample = recipe.examples.find(e => e.id === draft.exampleId);
  const recipePreference = preferences[`recipe:${recipeId}`];

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== PREFERENCE_KEY && event.key !== null) return;
      try {setPreferences(validatePreferences(JSON.parse(localStorage.getItem(PREFERENCE_KEY) ?? '{}'), validPreferenceIds));} catch {setStorageAvailable(false);}
    };
    try {localStorage.getItem(PREFERENCE_KEY);} catch {setStorageAvailable(false);}
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => {if (!notice) return; const timer = setTimeout(() => setNotice(''), 4200); return () => clearTimeout(timer);}, [notice]);
  useEffect(() => {if (reduced) setGalleryPlaying(false);}, [reduced]);
  useEffect(() => {
    const onPop = () => {
      const params = new URLSearchParams(location.search);
      const found = recipes.find(r => r.id === params.get('recipe')) ?? requestedRecipe();
      if (found) {
        setRecipeId(found.id);
        const ex = found.examples.find(e => e.id === params.get('example'));
        if (ex) loadPreset(found, ex.id, false);
      }
      const id = params.get('scene'); setSelectedScene(id && specs.some(s => s.id === id) ? id : null);
    };
    window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    if (activeTab !== 'source') return;
    let cancelled = false; setSourceText('Loading recipe source…');
    sourceLoaders[`../lib/recipes/${recipeId}.ts`]?.().then(text => {if (!cancelled) setSourceText(String(text));}).catch(() => {if (!cancelled) setSourceText('Open the source download for the complete recipe.');});
    return () => {cancelled = true;};
  }, [recipeId, activeTab]);

  function routeTo(id: RecipeId, exampleId: string, replace = false) {
    const url = new URL(location.href); url.search = ''; url.hash = ''; url.searchParams.set('recipe', id);
    if (exampleId) url.searchParams.set('example', exampleId);
    history[replace ? 'replaceState' : 'pushState']({}, '', url);
  }
  function selectRecipe(id: RecipeId) {setRecipeId(id); setActiveTab('explain'); routeTo(id, drafts[id].exampleId);}
  function renderDraft(id: RecipeId, next = drafts[id]) {
    const definition = recipes.find(r => r.id === id)!;
    try {
      const compiled = definition.compile(next.input, next.secondary);
      setResults(current => ({...current, [id]: compiled}));
      setDrafts(current => ({...current, [id]: {...next, renderedInput: next.input, renderedSecondary: next.secondary}}));
      setErrors(current => ({...current, [id]: ''}));
    } catch (e) {setErrors(current => ({...current, [id]: e instanceof Error ? e.message : 'Please check this input.'}));}
  }
  function loadPreset(definition: RecipeDefinition, exampleId: string, navigate = true) {
    const example = definition.examples.find(e => e.id === exampleId) ?? definition.examples[0];
    const next = {input: example.input, secondary: example.secondary ?? '', exampleId: example.id, renderedInput: example.input, renderedSecondary: example.secondary ?? ''};
    setRecipeId(definition.id); setDrafts(current => ({...current, [definition.id]: next})); renderDraft(definition.id, next);
    if (navigate) routeTo(definition.id, example.id);
  }
  function updateDraft(value: string, secondary = false) {
    setDrafts(current => ({...current, [recipeId]: {...current[recipeId], [secondary ? 'secondary' : 'input']: value}}));
    if (error) setErrors(current => ({...current, [recipeId]: ''}));
  }
  async function openInput(file: File | undefined, secondary = false) {
    if (!file) return;
    if (file.size > FILE_LIMIT) {setNotice('Please choose a file smaller than 128 KiB.'); return;}
    try {
      const text = await file.text();
      let imported: Inputs | null = null;
      try {
        const value = JSON.parse(text);
        if (value?.format === 'motion-atlas-input-v1') {
          if (!recipes.some(r => r.id === value.recipe) || typeof value.input !== 'string' || (value.secondary !== undefined && typeof value.secondary !== 'string')) throw new Error('Invalid input export.');
          imported = value;
        }
      } catch (e) {if (e instanceof Error && e.message === 'Invalid input export.') throw e;}
      if (imported) {
        const next = {...drafts[imported.recipe], input: imported.input, secondary: imported.secondary ?? '', exampleId: ''};
        setRecipeId(imported.recipe); setDrafts(current => ({...current, [imported!.recipe]: next})); renderDraft(imported.recipe, next); routeTo(imported.recipe, '');
      } else {
        const next = {...draft, [secondary ? 'secondary' : 'input']: text};
        setDrafts(current => ({...current, [recipeId]: next})); renderDraft(recipeId, next);
      }
      setNotice(`${file.name} opened locally.`);
    } catch (e) {setNotice(e instanceof Error ? e.message : 'The file could not be read.');}
  }
  function commitPreferences(update: (current: Preferences) => Preferences) {
    let current = preferences;
    try {current = validatePreferences(JSON.parse(localStorage.getItem(PREFERENCE_KEY) ?? '{}'), validPreferenceIds);} catch {setStorageAvailable(false);}
    const next = update(current);
    setPreferences(next);
    try {localStorage.setItem(PREFERENCE_KEY, JSON.stringify(next)); setStorageAvailable(true);} catch {setStorageAvailable(false);}
  }
  function setPreference(id: string, changes: Partial<Preference>) {commitPreferences(current => ({...current, [id]: {...(current[id] ?? {vote: 0, note: ''}), ...changes}}));}
  function linkFor(kind: 'recipe' | 'scene', id: string, embedded = false) {
    const url = new URL(location.origin + location.pathname); url.searchParams.set(kind, id);
    if (kind === 'recipe' && drafts[id as RecipeId].exampleId) url.searchParams.set('example', drafts[id as RecipeId].exampleId);
    if (embedded) url.searchParams.set('embed', '1'); return url.href;
  }
  async function copy(text: string, message = 'Copied to clipboard.') {
    try {await navigator.clipboard.writeText(text); setNotice(message);} catch {setSourceModal({path: 'Copy this text', text});}
  }
  async function downloadProject() {
    try {
      recipe.compile(draft.input, draft.secondary); setBusy(true);
      const response = await fetch(new URL('./source/bundle.json', location.href));
      if (!response.ok) throw new Error('The source download is temporarily unavailable.');
      const files: Record<string, string> = await response.json();
      files['src/initial-recipe.ts'] = `import type {RecipeId} from '../lib/recipes/types';\nconst initialRecipe: {recipe: RecipeId; input: string; secondary?: string} | null = ${JSON.stringify({recipe: recipeId, input: draft.input, secondary: draft.secondary}, null, 2)};\nexport default initialRecipe;\n`;
      files['YOUR-RECIPE.md'] = `# Your Motion Atlas recipe\n\nThis project opens with your edited ${recipeNames[recipeId]} inputs.\n\n1. Install Node.js 22.13 or newer.\n2. Run npm ci.\n3. Run npm run dev.\n4. Open the local address shown.\n\nInput is stored in src/initial-recipe.ts. No uploaded data or credentials are required.\n`;
      const bytes = createZip(files);
      download(bytes.buffer as ArrayBuffer, `motion-atlas-${recipeId}.zip`, 'application/zip');
      setNotice('Project downloaded with your edited inputs.');
    } catch (e) {setNotice(e instanceof Error ? e.message : 'Project download failed.');} finally {setBusy(false);}
  }
  function exportInput() {download(JSON.stringify({format: 'motion-atlas-input-v1', recipe: recipeId, input: draft.input, secondary: draft.secondary}, null, 2), `motion-atlas-${recipeId}-input.json`, 'application/json'); setNotice('Input downloaded. Open this file to restore it later.');}
  function openScene(id: string) {setSelectedScene(id); const url = new URL(location.href); url.search = ''; url.hash = ''; url.searchParams.set('scene', id); history.pushState({}, '', url);}
  function closeScene() {setSelectedScene(null); routeTo(recipeId, draft.exampleId, true);}
  async function viewSceneSource(id: string) {const path = `lib/motion/${sourceGroup(id)}.ts`; const text = await sourceLoaders[`../${path}`]?.(); setSourceModal({path, text: String(text ?? 'Source unavailable.')});}
  const filtered = useMemo(() => specs.filter(s =>
    (category === 'All experiments' || s.category === category) &&
    (voteFilter === 'all' || (voteFilter === 'liked' ? preferences[s.id]?.vote === 1 : voteFilter === 'disliked' ? preferences[s.id]?.vote === -1 : !preferences[s.id]?.vote)) &&
    `${s.title} ${s.description} ${s.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [category, query, voteFilter, preferences]);
  const selectedSpec = specs.find(s => s.id === selectedScene);
  const votedCount = Object.values(preferences).filter(p => p.vote !== 0).length;
  const likedCount = Object.values(preferences).filter(p => p.vote === 1).length;

  if (embed) {
    const id = selectedSpec?.id ?? recipeId;
    return <main className="embed-shell"><MotionPlayer id={`embed-${id}`} factory={selectedSpec ? scenes[selectedSpec.id] : result.factory} title={selectedSpec?.title ?? result.title} autoplay={!reduced}/><div className="embed-caption"><a href={linkFor(selectedSpec ? 'scene' : 'recipe', id)} target="_blank" rel="noreferrer">{selectedSpec?.title ?? result.title} <ExternalLink size={13}/></a><span>Motion Atlas / Motion Canvas</span></div></main>;
  }

  return <>
    <a href="#studio" className="skip-link">Skip to editor</a>
    <header className="site-header"><a className="brand" href={location.pathname} aria-label="Motion Atlas home"><span className="brand-mark">m</span><span>motion<span className="brand-serif">atlas</span><small>AN RTWB PROJECT</small></span></a><nav aria-label="Main navigation"><a href="#studio">Studio</a><a href="#collection">Collection <span>48</span></a><a href="#guide">How it works</a></nav><div className="header-actions"><button className="text-button saved-button" onClick={() => setPreferencesOpen(true)}><Heart size={16}/> Your picks {votedCount > 0 && <span className="count-badge">{votedCount}</span>}</button><a className="github-button" href={REPOSITORY} target="_blank" rel="noreferrer"><Code2 size={17}/><span>Source</span><ExternalLink size={13}/></a></div></header>

    <main>
      <section className="intro page-width"><div><p className="eyebrow"><span className="status-dot"/> AN OPEN TOOLKIT FOR ANIMATED EXPLANATIONS</p><h1>Make the workings <em>visible.</em></h1><p className="intro-copy">Start with an example. Change the input. See your story move.</p></div><div className="intro-aside"><span className="local-badge"><ShieldCheck size={15}/> Runs in your browser</span><p>No account. No uploads to a server.<br/>Working source you can take with you.</p></div></section>

      <section id="studio" className="studio page-width" aria-label="Recipe editor">
        <div className="section-heading"><div className="section-kicker"><span>01</span> THE STUDIO</div><span className="quiet-note">Five recipes. Your inputs.</span></div>
        <div className="recipe-tabs" role="tablist" aria-label="Choose a recipe">{recipes.map(r => {const Icon = recipeIcons[r.id]; return <button key={r.id} id={`tab-${r.id}`} role="tab" aria-selected={recipeId === r.id} aria-controls="recipe-panel" tabIndex={recipeId === r.id ? 0 : -1} onClick={() => selectRecipe(r.id)} onKeyDown={e => {
          if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {e.preventDefault(); const current = recipes.findIndex(item => item.id === r.id); const index = e.key === 'Home' ? 0 : e.key === 'End' ? recipes.length - 1 : (current + (e.key === 'ArrowRight' ? 1 : -1) + recipes.length) % recipes.length; selectRecipe(recipes[index].id); document.getElementById(`tab-${recipes[index].id}`)?.focus();}
        }}><Icon size={18}/><span>{recipeNames[r.id]}</span>{recipeId === r.id && <span className="tab-dot"/>}</button>;})}</div>

        <div id="recipe-panel" className="workspace" role="tabpanel" aria-labelledby={`tab-${recipeId}`}>
          <div className="input-panel">
            <div className="panel-heading"><span><Code2 size={15}/> EDIT THE INPUT</span><span className="format-badge">{recipe.inputFormat}</span></div>
            <div className="preset-select"><label htmlFor="preset">Start with an example</label><div><select id="preset" value={draft.exampleId} onChange={e => loadPreset(recipe, e.target.value)}>{!draft.exampleId && <option value="">Your imported example</option>}{recipe.examples.map(example => <option key={example.id} value={example.id}>{example.name}</option>)}</select><ChevronDown size={15}/></div><p>{activeExample?.description ?? 'Your own inputs, ready to edit.'}</p></div>
            <div className="editor-label"><label>{recipe.inputLabel}</label><button className="text-button" onClick={() => primaryUpload.current?.click()}><FolderOpen size={14}/> Open file</button></div>
            <CodeEditor label={recipe.inputLabel} value={draft.input} onChange={value => updateDraft(value)} onRun={() => renderDraft(recipeId)} compact={!!recipe.secondaryLabel}/>
            {recipe.secondaryLabel && <><div className="editor-label"><label>{recipe.secondaryLabel}</label><button className="text-button" onClick={() => secondaryUpload.current?.click()}><FolderOpen size={14}/> Open file</button></div><CodeEditor label={recipe.secondaryLabel} value={draft.secondary} onChange={value => updateDraft(value, true)} onRun={() => renderDraft(recipeId)} compact/></>}
            <input ref={primaryUpload} className="visually-hidden" type="file" accept={`${recipe.accept},.json,application/json`} aria-label="Open primary input file" onChange={e => {openInput(e.target.files?.[0]); e.target.value = '';}}/>
            <input ref={secondaryUpload} className="visually-hidden" type="file" accept=".txt,.py,.js,.ts,.json" aria-label="Open after-code file" onChange={e => {openInput(e.target.files?.[0], true); e.target.value = '';}}/>
            {error && <div className="input-error" role="alert"><strong>Check the input</strong><p>{error}</p><span>The preview keeps the last valid version.</span></div>}
            <div className="editor-actions"><button className="primary-button" onClick={() => renderDraft(recipeId)}><Play size={15} fill="currentColor"/> Render changes <kbd>⌘ ↵</kbd></button><button className="icon-button" aria-label="Reset to selected example" title="Reset example" onClick={() => loadPreset(recipe, draft.exampleId)}><RotateCcw size={17}/></button><button className="icon-button" aria-label="Download editable input" title="Download input" onClick={exportInput}><ArrowDownToLine size={17}/></button></div>
            <div className="editor-status">{dirty ? <><span className="status-dot amber"/> Changes waiting to render</> : <><CheckCircle2 size={13}/> Preview matches the input</>}<span>Edits stay in this tab</span></div>
            <details className="input-help"><summary><Info size={14}/> Input format & limits</summary><p>{recipe.help}</p><p>Open a file up to 128 KiB or edit directly. Download your input to keep it after closing this tab.</p></details>
          </div>

          <div className="output-panel">
            <div className="panel-heading"><span><span className="status-dot"/> LIVE PREVIEW</span><span className="format-badge">MOTION CANVAS</span></div>
            <MotionPlayer key={recipeId} id={`recipe-${recipeId}`} factory={result.factory} title={result.title} autoplay={!reduced} onSnapshot={canvas => downloadSnapshot(canvas, recipeId)}/>
            <div className="preview-description"><div><h2>{result.title}</h2><p>{result.summary}</p></div><VoteButtons preference={recipePreference} title={recipeNames[recipeId]} onVote={vote => setPreference(`recipe:${recipeId}`, {vote})}/></div>
            <div className="result-tabs" role="tablist" aria-label="Recipe details"><button role="tab" aria-selected={activeTab === 'explain'} onClick={() => setActiveTab('explain')}><BookOpen size={14}/> How it works</button><button role="tab" aria-selected={activeTab === 'data'} onClick={() => setActiveTab('data')}><Layers3 size={14}/> Inspect values <span>{result.rows.length}</span></button><button role="tab" aria-selected={activeTab === 'source'} onClick={() => setActiveTab('source')}><Code2 size={14}/> Recipe source</button></div>
            <div className="result-details">
              {activeTab === 'explain' && <><p>{recipe.description}</p><div className="basis-note"><CheckCircle2 size={15}/><p>{recipe.basis}</p></div></>}
              {activeTab === 'data' && <div className="data-table-wrap"><table><thead><tr><th>Item</th><th>Value</th><th>Explanation</th></tr></thead><tbody>{result.rows.map((row, index) => <tr key={index}><th scope="row">{row.label}</th><td>{row.value}</td><td>{row.detail ?? ''}</td></tr>)}</tbody></table></div>}
              {activeTab === 'source' && <><div className="source-caption"><code>lib/recipes/{recipeId}.ts</code><button className="text-button" onClick={() => copy(sourceText)}><Copy size={13}/> Copy</button></div><pre className="source-code" tabIndex={0}>{sourceText}</pre><p className="small-note">Download project includes this recipe, its helpers, the player, and your edited inputs.</p></>}
            </div>
            <div className="reuse-actions"><button className="secondary-button" onClick={downloadProject} disabled={busy}>{busy ? <Loader2 size={16} className="spinning"/> : <ArrowDownToLine size={16}/>} Download project</button><button className="text-button" onClick={() => setShareOpen(true)}><Link2 size={15}/> Share / embed</button><span className="reuse-note">MIT licensed · Yours to adapt</span></div>
          </div>
        </div>
      </section>

      <section id="collection" className="collection page-width">
        <div className="section-heading"><div className="section-kicker"><span>02</span> THE COLLECTION</div><button className="text-button" onClick={() => setGalleryPlaying(!galleryPlaying)}>{galleryPlaying ? 'Pause previews' : 'Animate previews'} <Sparkles size={15}/></button></div>
        <div className="collection-heading"><div><h2>A field guide to <em>possibility.</em></h2><p>48 experiments in mathematics, systems, data, and motion. Vote for what you want to explore.</p></div><span className="collection-count">48 <small>EXPERIMENTS</small></span></div>
        <div className="category-filters" role="group" aria-label="Filter collection">{['All experiments', 'Math & nature', 'Systems & AI', 'Data stories', 'Motion craft'].map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}<span>{c === 'All experiments' ? 48 : 12}</span></button>)}</div>
        <div className="collection-toolbar"><label className="search-field"><Search size={17}/><input aria-label="Search experiments" placeholder="Find an idea, a technique, a feeling…" value={query} onChange={e => setQuery(e.target.value)}/></label><div className="filter-right"><span>{filtered.length} experiments</span><select aria-label="Filter by your votes" value={voteFilter} onChange={e => setVoteFilter(e.target.value)}><option value="all">All votes</option><option value="liked">Upvoted</option><option value="disliked">Downvoted</option><option value="unrated">Unrated</option></select></div></div>
        <div className="gallery-grid">{filtered.map((spec, i) => <article key={spec.id} className="gallery-card"><button className="gallery-open" onClick={() => openScene(spec.id)} aria-label={`Open ${spec.title}`}><div className="card-preview"><MotionPlayer id={`card-${spec.id}`} factory={scenes[spec.id]} title={spec.title} compact autoplay={galleryPlaying && !reduced} posterTime={2.5}/><span className="card-number">{String(specs.findIndex(s => s.id === spec.id) + 1).padStart(2, '0')}</span><span className="open-indicator"><ArrowRight size={18}/></span></div></button><div className="card-body"><p className="card-category">{spec.category}</p><h3><button onClick={() => openScene(spec.id)}>{spec.title}</button></h3><p>{spec.description}</p><div className="card-footer"><span className="basis-pill">{getSceneBasis(spec.id).label}</span><VoteButtons title={spec.title} preference={preferences[spec.id]} onVote={vote => setPreference(spec.id, {vote})}/></div></div></article>)}</div>
        {!filtered.length && <div className="empty-state"><Search size={28}/><h3>No experiments match yet.</h3><p>Try a different search or clear your filters.</p><button className="secondary-button" onClick={() => {setQuery(''); setCategory('All experiments'); setVoteFilter('all');}}>Clear filters</button></div>}
        <div className="collection-footnote"><ShieldCheck size={15}/><span>Your votes and notes stay on this device. They are personal preferences, not community scores.</span><button className="text-button" onClick={() => setPreferencesOpen(true)}>Review your picks <ArrowRight size={14}/></button></div>
      </section>

      <section id="guide" className="guide page-width"><div className="section-kicker"><span>03</span> MAKE IT YOURS</div><h2>A short path from <em>idea to explanation.</em></h2><div className="guide-grid"><article><span className="guide-number">01</span><h3>Start with something real.</h3><p>Choose a recipe and a preloaded example. Edit the text directly or open a local file. Inputs never leave your browser.</p></article><article><span className="guide-number">02</span><h3>Follow what changes.</h3><p>Render, pause, scrub, and inspect the values. Each recipe explains its calculation. Gallery illustrations are labeled as illustrations.</p></article><article><span className="guide-number">03</span><h3>Take the working parts.</h3><p>Download a runnable project with your input, capture a PNG, or embed a preset. Build on it under the MIT license.</p></article></div><div className="open-source-banner"><div><p className="eyebrow">OPEN SOURCE, ALL THE WAY DOWN</p><h3>Built with Motion Canvas.<br/>Shared by Run The World Better.</h3><p>A small toolkit for showing how algorithms, data, and work evolve.</p></div><div><code>npm ci<br/>npm run dev</code><div className="banner-links"><a className="secondary-button" href="./motion-atlas-source.zip" download><ArrowDownToLine size={15}/> Download source</a><a className="text-button" href={REPOSITORY} target="_blank" rel="noreferrer">GitHub <ExternalLink size={14}/></a></div></div></div></section>
    </main>

    <footer className="site-footer page-width"><a className="brand footer-brand" href="https://runtheworldbetter.com" target="_blank" rel="noreferrer">RTWB <ArrowRight size={16}/></a><p>Make useful things. Help others understand them.</p><div><a href="https://motioncanvas.io" target="_blank" rel="noreferrer">Motion Canvas</a><a href="./third-party-notices.txt" target="_blank" rel="noreferrer">Licenses & credits</a><button className="text-button" onClick={() => setPreferencesOpen(true)}>Your local data</button></div></footer>

    {selectedSpec && <Dialog title={selectedSpec.title} wide onClose={closeScene}><p className="eyebrow">{selectedSpec.category}</p><h2 className="dialog-title">{selectedSpec.title}</h2><MotionPlayer id={`view-${selectedSpec.id}`} factory={scenes[selectedSpec.id]} title={selectedSpec.title} autoplay={!reduced} onSnapshot={canvas => downloadSnapshot(canvas, selectedSpec.id)}/><div className="scene-description"><p>{selectedSpec.description}</p><VoteButtons title={selectedSpec.title} preference={preferences[selectedSpec.id]} onVote={vote => setPreference(selectedSpec.id, {vote})}/></div><div className="basis-note"><Info size={17}/><p><strong>{getSceneBasis(selectedSpec.id).label}.</strong> {getSceneBasis(selectedSpec.id).detail}</p></div><p className="scene-technique">{selectedSpec.technique}</p><label className="note-label" htmlFor="scene-note">What works for you? <span>Saved on this device</span></label><textarea id="scene-note" className="note-input" placeholder="A useful pattern, something unclear, an idea to revisit…" maxLength={1200} value={preferences[selectedSpec.id]?.note ?? ''} onChange={e => setPreference(selectedSpec.id, {note: e.target.value})}/><div className="dialog-actions"><button className="secondary-button" onClick={() => viewSceneSource(selectedSpec.id)}><Code2 size={15}/> View source</button><button className="text-button" onClick={() => copy(linkFor('scene', selectedSpec.id), 'Scene link copied.')}><Link2 size={15}/> Copy link</button><button className="text-button" onClick={() => copy(`<iframe src="${linkFor('scene', selectedSpec.id, true)}" title="${selectedSpec.title.replaceAll('"', '&quot;')}" style="width:100%;aspect-ratio:16/10;border:0" loading="lazy" allowfullscreen></iframe>`, 'Embed code copied.')}><Code2 size={15}/> Copy embed</button></div></Dialog>}

    {shareOpen && <Dialog title="Share this recipe" onClose={() => setShareOpen(false)}><p className="eyebrow">PASS IT ON</p><h2 className="dialog-title">Share the starting point.</h2><p>These links open <strong>{activeExample?.name ?? recipe.examples[0].name}</strong>. Your edited inputs stay in this tab. Use Download project to share your customized version as a file.</p><label className="share-label">Recipe link</label><div className="copy-field"><input readOnly value={linkFor('recipe', recipeId)} aria-label="Recipe link"/><button className="icon-button" aria-label="Copy recipe link" onClick={() => copy(linkFor('recipe', recipeId), 'Preset link copied.')}><Copy size={17}/></button></div><label className="share-label">Embed in a page</label><textarea className="embed-code" readOnly aria-label="Embed code" value={`<iframe src="${linkFor('recipe', recipeId, true)}" title="Motion Atlas ${recipeNames[recipeId]}" style="width:100%;aspect-ratio:16/10;border:0" loading="lazy" allowfullscreen></iframe>`}/><div className="dialog-actions"><button className="secondary-button" onClick={() => copy(`<iframe src="${linkFor('recipe', recipeId, true)}" title="Motion Atlas ${recipeNames[recipeId]}" style="width:100%;aspect-ratio:16/10;border:0" loading="lazy" allowfullscreen></iframe>`)}>Copy embed</button><button className="text-button" onClick={downloadProject}>Download your project <ArrowDownToLine size={15}/></button></div></Dialog>}

    {sourceModal && <Dialog title="Source code" wide onClose={() => setSourceModal(null)}><p className="eyebrow">THE WORKING PARTS</p><h2 className="dialog-title source-title">{sourceModal.path}</h2><pre className="modal-source" tabIndex={0}>{sourceModal.text}</pre><div className="dialog-actions"><button className="secondary-button" onClick={() => copy(sourceModal.text)}><Copy size={15}/> Copy source</button><a className="text-button" href="./motion-atlas-source.zip" download>Download complete source <ArrowDownToLine size={15}/></a></div></Dialog>}

    {preferencesOpen && <Dialog title="Your local preferences" onClose={() => {setPreferencesOpen(false); setConfirmClear(false);}}><p className="eyebrow">YOUR EYE. YOUR COLLECTION.</p><h2 className="dialog-title">Your picks.</h2><p>Upvotes mean “more like this.” Downvotes mean “less.” Notes are yours. {storageAvailable ? 'Everything here is saved in this browser.' : 'Browser storage is unavailable; export to keep your choices.'}</p><div className="preference-summary"><div><strong>{likedCount}</strong><span>UPVOTED</span></div><div><strong>{votedCount - likedCount}</strong><span>DOWNVOTED</span></div><div><strong>{Object.values(preferences).filter(p => p.note).length}</strong><span>NOTES</span></div></div><div className="preference-list">{Object.entries(preferences).filter(([,p]) => p.vote !== 0 || p.note).map(([id,p]) => {const spec = specs.find(s => s.id === id); const r = recipes.find(item => `recipe:${item.id}` === id); return <div key={id}><div><strong>{spec?.title ?? r?.title ?? id}</strong>{p.note && <p>{p.note}</p>}</div><VoteButtons title={spec?.title ?? r?.title ?? id} preference={p} onVote={vote => setPreference(id, {vote})}/></div>;})}{!Object.values(preferences).some(p => p.vote !== 0 || p.note) && <p className="empty-picks">Choose an arrow on a recipe or experiment to begin.</p>}</div><div className="dialog-actions"><button className="secondary-button" onClick={() => download(JSON.stringify({format: 'motion-atlas-preferences-v2', exportedAt: new Date().toISOString(), preferences}, null, 2), 'motion-atlas-preferences.json', 'application/json')}><ArrowDownToLine size={15}/> Export preferences</button><button className="text-button" onClick={() => preferencesUpload.current?.click()}><Upload size={15}/> Import</button></div><input ref={preferencesUpload} type="file" className="visually-hidden" accept=".json" aria-label="Import preferences" onChange={async e => {const file = e.target.files?.[0]; e.target.value = ''; if (!file) return; if (file.size > FILE_LIMIT) {setNotice('Preference file must be smaller than 128 KiB.'); return;} try {const value = JSON.parse(await file.text()); const imported = validatePreferences(value.preferences, validPreferenceIds); commitPreferences(current => ({...current, ...imported})); setNotice('Preferences imported into this browser.');} catch (err) {setNotice(err instanceof Error ? err.message : 'Invalid preferences file.');}}}/><div className="clear-data">{confirmClear ? <><span>Clear all votes and notes on this device?</span><button className="danger-button" onClick={() => {commitPreferences(() => ({})); setConfirmClear(false); setNotice('Local preferences cleared.');}}>Clear everything</button><button className="text-button" onClick={() => setConfirmClear(false)}>Cancel</button></> : <button className="text-button" onClick={() => setConfirmClear(true)}><Trash2 size={14}/> Clear local preferences</button>}</div></Dialog>}

    {notice && <div className="toast" role="status"><Check size={16}/>{notice}</div>}
    {!storageAvailable && <div className="storage-warning" role="status">Preferences are temporary. Export them to keep a copy.</div>}
  </>;
}
