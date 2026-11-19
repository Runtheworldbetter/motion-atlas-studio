import {useEffect, useState} from 'react';
import './original-music.css';

export type OriginalMusicId = 'harmonics' | 'strings' | 'soundwaves' | 'spectrogram';

const ORIGINALS = {
  spectrogram: {title: 'Spectrogram', instruction: 'Choose a sound and see its frequencies. Draw your own tones, or try the optional microphone.', file: 'spectrogram/index.html'},
  harmonics: {title: 'Harmonics', instruction: 'Touch the strings and compare their vibration patterns.', file: 'harmonics.html'},
  strings: {title: 'Strings', instruction: 'Drag across a string to pluck it. Compare strings of different lengths.', file: 'strings.html'},
  soundwaves: {title: 'Sound Waves', instruction: 'Play the keyboard, then use the magnifier to look more closely at the moving air.', file: 'soundwaves.html'},
} as const;

/** Each upstream instrument has its own document, preserving its original design. */
export default function OriginalMusicExperiment({experiment}: {experiment: OriginalMusicId}) {
  const original = ORIGINALS[experiment];
  const [running, setRunning] = useState(true), [generation, setGeneration] = useState(0);
  useEffect(() => {
    const stopWhenHidden = () => {if (document.hidden) setRunning(false);};
    const stop = () => setRunning(false);
    document.addEventListener('visibilitychange', stopWhenHidden);
    window.addEventListener('atlas-stop-audio', stop);
    return () => {document.removeEventListener('visibilitychange', stopWhenHidden); window.removeEventListener('atlas-stop-audio', stop);};
  }, []);
  const url = `./vendor/chrome-music-lab/${original.file}`;
  return <div className="ml-original">
    <header className="ml-original-heading">
      <div><p className="ml-original-credit">CHROME MUSIC LAB · ORIGINAL EXPERIMENT</p><h3>{original.title}</h3><p>{original.instruction}</p></div>
      <div className="ml-original-actions">
        <button type="button" onClick={() => {if (running) setRunning(false); else {setGeneration(value => value + 1); setRunning(true);}}}>{running ? 'Stop experiment' : 'Start experiment'}</button>
        <a href={url} target="_blank" rel="noreferrer">Open full size</a>
      </div>
    </header>
    {running ? <iframe key={`${experiment}-${generation}`} className="ml-original-frame" title={`Original Chrome Music Lab: ${original.title}`} src={url} allow={experiment === 'spectrogram' ? 'autoplay; microphone' : 'autoplay'} sandbox="allow-scripts allow-same-origin"/> : <div className="ml-original-paused"><h4>{original.title} is stopped.</h4><p>Start it again to play. The original instrument restarts when reopened.</p><button type="button" onClick={() => {setGeneration(value => value + 1); setRunning(true);}}>Start experiment</button></div>}
    <footer className="ml-original-attribution"><p>By Google Creative Lab and collaborators. Original visuals and interactions, hosted here under Apache 2.0 with the upstream notices.</p><a href="https://github.com/googlecreativelab/chrome-music-lab" target="_blank" rel="noreferrer">Original source</a><a href={`./vendor/chrome-music-lab/${experiment === 'spectrogram' ? 'spectrogram/' : ''}THIRD-PARTY-NOTICES.txt`} target="_blank" rel="noreferrer">Licenses and changes</a>{experiment === 'spectrogram' && <a href="./originals/spectrogram-source.zip" download>Download original source</a>}</footer>
  </div>;
}
