/* Motion Atlas host for the original Red Blob diagram functions. No search/rendering reimplementation. */
import {diagrams, makeDiagramFrontier, makeDiagramExpansion, makeDiagramWeights, makeDiagramAStar} from './atlas-diagrams.js';

const initializers = {frontier: makeDiagramFrontier, expansion: makeDiagramExpansion, weights: makeDiagramWeights, astar: makeDiagramAStar};
const mounted = new Set();
const controls = [...document.querySelectorAll('nav [data-panel]')];
let active = 'frontier';
let resizeFrame = 0;

function pauseScene(section) {
  for (const button of section.querySelectorAll('.play_pause')) {
    if (button.textContent === 'Pause animation') button.click();
  }
}
function resizeVisible() {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    for (const diagram of diagrams) {
      if (!diagram.parent.closest('[hidden]') && diagram.parent.clientWidth > 0) {
        diagram.setSize();
        diagram.redraw();
      }
    }
  });
}
function show(id) {
  active = id;
  for (const section of document.querySelectorAll('[data-scene]')) {
    const selected = section.dataset.scene === id;
    if (!selected) pauseScene(section);
    section.hidden = !selected;
  }
  controls.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.panel === id)));
  if (!mounted.has(id)) {
    initializers[id]();
    mounted.add(id);
    for (const input of document.querySelectorAll(`[data-scene="${id}"] input[type="range"]`))
      input.setAttribute('aria-label', id === 'frontier' ? 'Breadth-first frontier distance' : 'Search step');
    for (const button of document.querySelectorAll(`[data-scene="${id}"] .step_back`)) button.setAttribute('aria-label', 'Step backward');
    for (const button of document.querySelectorAll(`[data-scene="${id}"] .step_forward`)) button.setAttribute('aria-label', 'Step forward');
  }
  resizeVisible();
}
for (const button of controls) button.addEventListener('click', () => show(button.dataset.panel));
const observer = new ResizeObserver(resizeVisible);
observer.observe(document.querySelector('main'));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) document.querySelectorAll('[data-scene]').forEach(pauseScene);
});
window.addEventListener('pagehide', () => {
  document.querySelectorAll('[data-scene]').forEach(pauseScene);
  observer.disconnect();
  cancelAnimationFrame(resizeFrame);
}, {once: true});
window.__motionAtlasOriginal = {
  id: 'red-blob', diagrams,
  getState: () => ({active, diagrams: diagrams.map(diagram => ({
    id: diagram.parent.id, starts: [...diagram.options.starts],
    weights: diagram.graph.ids().map(id => ({id, weight: Number.isFinite(diagram.graph.tile_weight(id)) ? diagram.graph.tile_weight(id) : 'wall'})),
    search: (() => { const {ss, map} = diagram.rerunSearch(); return {current: ss.current, frontier: ss.frontier, steps: ss.steps, cells: map}; })(),
  }))}),
};
show(active);
