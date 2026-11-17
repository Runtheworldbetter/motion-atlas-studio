import {useEffect, useRef, type ReactNode} from 'react';
import {ArrowDown, ArrowUp, X} from 'lucide-react';
import type {Preference} from '../lib/preferences';

export function Dialog({children, title, onClose, wide = false}: {children: ReactNode; title: string; onClose: () => void; wide?: boolean}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {ref.current?.showModal(); return () => ref.current?.close();}, []);
  return <dialog ref={ref} className={`dialog ${wide ? 'wide-dialog' : ''}`} aria-label={title} onCancel={onClose} onClick={e => {if (e.target === ref.current) onClose();}}>
    <div className="dialog-content"><button className="icon-button dialog-close" aria-label="Close dialog" onClick={onClose}><X size={20}/></button>{children}</div>
  </dialog>;
}

export function VoteButtons({preference, onVote, title}: {preference?: Preference; onVote: (value: -1 | 0 | 1) => void; title: string}) {
  const vote = preference?.vote ?? 0;
  return <div className={`vote-buttons vote-${vote}`} aria-label={`Your preference for ${title}`}>
    <button aria-label={`More like ${title}`} aria-pressed={vote === 1} title="More like this" onClick={() => onVote(vote === 1 ? 0 : 1)}><ArrowUp size={17}/></button>
    <span aria-label={`Your vote: ${vote}`}>{vote === 1 ? '+1' : vote === -1 ? '−1' : '0'}</span>
    <button aria-label={`Less like ${title}`} aria-pressed={vote === -1} title="Less like this" onClick={() => onVote(vote === -1 ? 0 : -1)}><ArrowDown size={17}/></button>
  </div>;
}

export function CodeEditor({value, onChange, label, onRun, compact = false}: {value: string; onChange: (value: string) => void; label: string; onRun: () => void; compact?: boolean}) {
  const gutter = useRef<HTMLDivElement>(null);
  return <div className={`code-editor ${compact ? 'short-editor' : ''}`}>
    <div className="line-numbers" ref={gutter} aria-hidden="true">{Array.from({length: Math.max(value.split('\n').length, compact ? 8 : 15)}, (_, i) => <span key={i}>{i + 1}</span>)}</div>
    <textarea spellCheck={false} autoCapitalize="off" autoCorrect="off" aria-label={label} value={value} onChange={e => onChange(e.target.value)} onScroll={e => {if (gutter.current) gutter.current.scrollTop = e.currentTarget.scrollTop;}} onKeyDown={e => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {e.preventDefault(); onRun();}
      if (e.key === 'Tab') {
        e.preventDefault(); const el = e.currentTarget; const start = el.selectionStart; const end = el.selectionEnd;
        onChange(value.slice(0, start) + '  ' + value.slice(end));
        requestAnimationFrame(() => {el.selectionStart = el.selectionEnd = start + 2;});
      }
    }}/>
  </div>;
}
