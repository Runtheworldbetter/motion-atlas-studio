import {useEffect, useRef} from 'react';
import * as correction from './restored/correction.js';
import * as continuity from './restored/continuity.js';
import * as typography from './restored/typography.js';
import type {RestoredStudyModule} from './restored/types';
import './restored/restored-studies.css';

/** Keep the original study's rendering and interactions; adapt only its lifecycle
 * and export contract to Atlas. React does not own the mounted study's children. */
function RestoredStudy({source}: {source: RestoredStudyModule}) {
  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = host.current!;
    const element = root.current!;
    const study = source.mount(container);
    const svg = study.getSvg();
    svg.dataset.export = 'true';
    const publishState = () => {
      const serialized = JSON.stringify(study.getState());
      if (element.dataset.exportState !== serialized) element.dataset.exportState = serialized;
    };
    // Every original study draws into its mounted SVG. Observing that subtree
    // synchronizes both animated frames and manual inspection without polling.
    const observer = new MutationObserver(publishState);
    observer.observe(svg, {attributes: true, childList: true, characterData: true, subtree: true});
    const events = ['input', 'change', 'click', 'keydown'] as const;
    events.forEach(event => container.addEventListener(event, publishState));
    publishState();

    return () => {
      observer.disconnect();
      events.forEach(event => container.removeEventListener(event, publishState));
      study.destroy();
      container.replaceChildren();
      delete element.dataset.exportState;
    };
  }, [source]);

  return <section ref={root} className="lab-demo restored-study" aria-label={source.meta.title}>
    <div ref={host} className="restored-study-host"/>
  </section>;
}

export function CorrectionStudy() {return <RestoredStudy source={correction}/>;}
export function ContinuityStudy() {return <RestoredStudy source={continuity}/>;}
export function TypographyStudy() {return <RestoredStudy source={typography}/>;}
