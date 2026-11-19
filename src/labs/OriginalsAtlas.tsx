import {useEffect, useRef, useState} from 'react';
import {ArrowDownToLine, Code2, ExternalLink, RotateCcw, X} from 'lucide-react';
import {originals, originalFromHash, type AtlasOriginal} from '../../lib/originals/catalog';
import './originals.css';

const REPO = 'https://github.com/Runtheworldbetter/motion-atlas-studio/tree/main/public/vendor/';

function OriginalSurface({original, onClose}: {original: AtlasOriginal; onClose: () => void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [running, setRunning] = useState(true), [generation, setGeneration] = useState(0);
  const [loaded, setLoaded] = useState(false), [copyNote, setCopyNote] = useState('');
  const entry = `./vendor/${original.directory}/index.html`;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    window.dispatchEvent(new Event('atlas-stop-audio'));
    const hidden = () => {if (document.hidden && original.id === 'spectrogram') setRunning(false);};
    document.addEventListener('visibilitychange', hidden);
    return () => {dialog.current?.close(); document.removeEventListener('visibilitychange', hidden); previous?.focus();};
  }, [original.id]);
  function restart() {setLoaded(false); setGeneration(value => value + 1); setRunning(true);}
  return <dialog ref={dialog} className="original-dialog" aria-labelledby="original-title" onCancel={event => {event.preventDefault(); onClose();}} onClick={event => {if (event.target === dialog.current) onClose();}}>
    <header className="original-dialog-heading"><div><p className="original-credit">{original.author} <span>ORIGINAL</span></p><h2 id="original-title">{original.title}</h2><p className="original-instruction">{original.instruction}</p></div><button type="button" className="original-close" onClick={onClose} aria-label="Close original"><X size={22}/></button></header>
    <div className="original-tools"><div><a href={entry} target="_blank" rel="noreferrer"><ExternalLink size={15}/> Open full size</a><button type="button" onClick={restart}><RotateCcw size={15}/> Restart</button></div><div><a href={`./originals/${original.id}-source.zip`} download><ArrowDownToLine size={15}/> Download source</a><a href={REPO + original.directory} target="_blank" rel="noreferrer"><Code2 size={15}/> Source on GitHub</a><button type="button" onClick={async () => {try {await navigator.clipboard.writeText(location.href); setCopyNote('Launch link copied');} catch {setCopyNote('Copy the address from your browser');}}}>{copyNote || 'Copy launch link'}</button></div></div>
    <div className="original-stage">
      {running ? <>{!loaded && <div className="original-loading" role="status">Opening {original.title}…</div>}<iframe key={`${original.id}-${generation}`} title={`${original.title} — original by ${original.author}`} src={entry} onLoad={() => setLoaded(true)} allow={original.id === 'spectrogram' ? 'autoplay; microphone' : undefined} sandbox={original.id === 'loopy' || original.id === 'markov' ? 'allow-scripts allow-downloads allow-popups allow-forms' : 'allow-scripts allow-same-origin allow-downloads allow-popups allow-forms'}/></> : <div className="original-stopped"><h3>{original.title} is stopped.</h3><p>The experiment stopped while this page was out of view.</p><button type="button" onClick={restart}>Start again</button></div>}
    </div>
    <footer className="original-footer"><span>{original.license}{original.capability && <> · {original.capability}</>}</span><div><a href={`./vendor/${original.directory}/THIRD-PARTY-NOTICES.txt`} target="_blank" rel="noreferrer">Licenses & credits</a><a href={original.upstream} target="_blank" rel="noreferrer">Visit original</a><a href={`./vendor/${original.directory}/README.md`} target="_blank" rel="noreferrer">Integration notes</a></div></footer>
  </dialog>;
}

export default function OriginalsAtlas() {
  const [selected, setSelected] = useState<AtlasOriginal | undefined>(() => originalFromHash(location.hash));
  useEffect(() => {
    if (location.hash === '#originals' || location.hash.startsWith('#originals/')) document.getElementById('originals')?.scrollIntoView({block: 'start'});
    const sync = () => setSelected(originalFromHash(location.hash));
    window.addEventListener('hashchange', sync); window.addEventListener('popstate', sync);
    return () => {window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync);};
  }, []);
  function open(original: AtlasOriginal) {const url = new URL(location.href); url.hash = `originals/${original.id}`; history.pushState({}, '', url); setSelected(original);}
  function close() {setSelected(undefined); const url = new URL(location.href); url.hash = 'originals'; history.replaceState({}, '', url);}
  return <section id="originals" className="originals-atlas page-width" aria-labelledby="originals-heading">
    <header className="originals-heading"><div><p className="originals-kicker">THE ORIGINALS · SIX PROJECTS</p><h2 id="originals-heading">Good work, <em>in its original form.</em></h2><p>Play with the original experiments. Take their source with you.</p></div><a className="originals-guide" href="./docs/index.html#originals">Sources, licenses & reuse <ExternalLink size={15}/></a></header>
    <div className="originals-grid">{originals.map(original => <article className={`original-card original-${original.id}`} key={original.id}>
      <button type="button" className="original-open" onClick={() => open(original)} aria-label={`Open original ${original.title}`}>
        <div className="original-cover" aria-hidden="true"><span className="original-cover-category">{original.category}</span><strong>{original.id === 'spectrogram' ? <>SPECTRO<br/>GRAM</> : original.id === 'loopy' ? 'LOOPY' : original.id === 'markov' ? <>A ↔ B<br/><small>p = ?</small></> : original.id === 'sigma' ? <>CONNECTED<br/>IDEAS</> : original.id === 'pathfinding' ? <>FIND<br/>A PATH</> : <>METABALLS<br/>& WARP</>}</strong><span className="original-cover-author">{original.author}</span></div>
        <div className="original-card-copy"><h3>{original.title}</h3><p>{original.description}</p><span className="original-open-label">Open original</span></div>
      </button><div className="original-card-foot"><span>{original.license}</span><a href={`./originals/${original.id}-source.zip`} download aria-label={`Download ${original.title} source`}><ArrowDownToLine size={15}/> Source</a></div>
    </article>)}</div>
    <p className="originals-note">Hosted in Atlas with the authors’ code and credits. Each source download includes its licenses and integration notes. <a href="#music-lab/original-spectrogram">Spectrogram is also in Music Lab.</a></p>
    {selected && <OriginalSurface key={selected.id} original={selected} onClose={close}/>}
  </section>;
}
