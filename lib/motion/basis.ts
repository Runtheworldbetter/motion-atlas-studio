export interface SceneBasis {
  label: string;
  detail: string;
}

/** The provenance of each gallery animation, separate from its visual style. */
export const sceneBases: Record<string, SceneBasis> = {
  'orbital-resonance': {
    label: 'Parametric geometry',
    detail: 'Two circular paths run at a 3:2 frequency ratio. The scene draws lines between corresponding points.',
  },
  'fourier-epicycles': {
    label: 'Computed harmonic sum',
    detail: 'The circles and curve use the same four odd sine harmonics to approximate a square wave. Use the Harmonics recipe to edit the coefficients.',
  },
  lissajous: {
    label: 'Parametric geometry',
    detail: 'Points follow x = sin(3θ + φ), y = sin(2θ), with a changing phase and display scaling.',
  },
  'wave-interference': {
    label: 'Computed wave sum',
    detail: 'Two cosine waves with equal, constant amplitude are added at each point. Color shows the sign of displacement; size shows its magnitude.',
  },
  'pendulum-wave': {
    label: 'Choreographed motion',
    detail: 'Sine functions with preset periods control the angles of 15 pendulum shapes. Their lengths and timing are chosen to form patterns.',
  },
  phyllotaxis: {
    label: 'Procedural geometry',
    detail: 'Seed positions use the golden angle and a square-root radius. The pattern also rotates and expands rhythmically.',
  },
  'strange-attractor': {
    label: 'Numerical trajectory',
    detail: 'A Lorenz trajectory is computed with forward Euler integration, step 0.006, and σ = 10, ρ = 28, β = 8/3, then sampled and projected for display.',
  },
  'vector-field': {
    label: 'Computed vector field',
    detail: 'Particles follow spiral equations; the arrows show their velocity direction. Arrow lengths are scaled for readability. Particles fade and restart at the boundary.',
  },
  'polar-rose': {
    label: 'Parametric geometry',
    detail: 'The curves use r = cos(kθ), with k = 3, 5, and 7. The shapes rotate as markers follow them.',
  },
  'wave-surface': {
    label: 'Parametric surface',
    detail: 'A product of sine and cosine sets the height of a wireframe surface, which is projected into two dimensions.',
  },
  'standing-wave': {
    label: 'Computed wave sum',
    detail: 'Two equal-amplitude sine waves travel in opposite directions. Their exact sum is drawn below them, including the fixed nodes.',
  },
  'parametric-knot': {
    label: 'Parametric geometry',
    detail: 'A (2, 3) torus-knot equation is rotated and projected into two dimensions. Marker size and opacity provide depth cues.',
  },
  'neural-signal': {
    label: 'Illustrative system',
    detail: 'Scripted pulses and connections illustrate a layered network.',
  },
  'attention-matrix': {
    label: 'Synthetic normalized weights',
    detail: 'A formula generates synthetic weights that sum to one in each row. Future token positions are masked.',
  },
  'token-stream': {
    label: 'Illustrative sequence',
    detail: 'The word split, token labels, and probabilities are invented examples of sequence animation.',
  },
  'agent-handoff': {
    label: 'Illustrative workflow',
    detail: 'A scripted task passes through four roles: human, planner, specialist, and reviewer.',
  },
  'semantic-memory': {
    label: 'Illustrative system',
    detail: 'A preset path connects an example graph to a source card. The facts and links are fictional.',
  },
  'causal-graph': {
    label: 'Illustrative hypothesis',
    detail: 'The arrows show hypothetical relationships. The idle-day values are invented to illustrate a possible outcome.',
  },
  'sorting-race': {
    label: 'Computed algorithm traces',
    detail: 'Bubble sort and adjacent-swap insertion sort run on the same fixed array. Swap counts come from those runs; playback speed is adjusted so both finish together.',
  },
  pathfinding: {
    label: 'Computed breadth-first search',
    detail: 'Breadth-first search records how each cell was reached, then traces a shortest route back through those cells. Use the Pathfinder recipe to edit the maze and inspect the search steps.',
  },
  'binary-search': {
    label: 'Computed algorithm trace',
    detail: 'Binary-search comparisons set the highlighted interval and midpoint in a fixed sorted array. The target is 72.',
  },
  'mesh-network': {
    label: 'Illustrative system',
    detail: 'The scene scripts a relay failure and switches the packet between two preset routes.',
  },
  'event-pipeline': {
    label: 'Illustrative workflow',
    detail: 'Packets follow preset routes through an example workflow. One is assigned to the review branch.',
  },
  'vehicle-lifecycle': {
    label: 'Illustrative workflow',
    detail: 'A vehicle icon follows a preset path through lease, return, inspection, service, and redeployment.',
  },
  'bar-race': {
    label: 'Synthetic data',
    detail: 'Five synthetic values change between fixed endpoints. Their rank is calculated at each frame.',
  },
  'flow-ribbons': {
    label: 'Illustrative flow diagram',
    detail: 'Preset routes and ribbon widths form the diagram. Moving dots show direction.',
  },
  'radial-progress': {
    label: 'Synthetic data',
    detail: 'Three synthetic percentages control the ring lengths and numeric labels.',
  },
  distribution: {
    label: 'Computed synthetic observations',
    detail: 'A seeded generator creates 120 observations. Each arriving dot adds one to its histogram bin.',
  },
  'scatter-migration': {
    label: 'Synthetic geometry',
    detail: 'Three synthetic groups of points move between fixed centers. Trails connect each starting and ending position.',
  },
  treemap: {
    label: 'Synthetic proportions',
    detail: 'Three rectangles resize between preset proportions, with percentage labels calculated from their areas. Gaps separate the rectangles.',
  },
  'chord-flow': {
    label: 'Illustrative network',
    detail: 'Five nodes have preset curved links and widths. Dots show movement in both directions.',
  },
  'cohort-heatmap': {
    label: 'Synthetic data',
    detail: 'A fixed formula creates declining synthetic retention values for six cohorts over nine periods.',
  },
  'uncertainty-band': {
    label: 'Illustrative forecast design',
    detail: 'Preset functions draw a centerline and widening band. The bounds are chosen for this chart example.',
  },
  waterfall: {
    label: 'Computed cumulative arithmetic',
    detail: 'Synthetic contributions are added cumulatively, and the final bar shows their sum. Use the Waterfall recipe to enter your own values.',
  },
  'scenario-fan': {
    label: 'Illustrative scenarios',
    detail: 'A synthetic history branches into three preset paths to illustrate a scenario chart.',
  },
  'live-sparkline': {
    label: 'Synthetic signals',
    detail: 'Separate periodic functions generate the synthetic curves and counters in this dashboard example.',
  },
  'morphing-path': {
    label: 'Motion technique',
    detail: 'Motion Canvas interpolates between four vector paths, changing their colors and rotation.',
  },
  'bezier-lab': {
    label: 'Computed curve geometry',
    detail: 'Control points change a cubic Bézier curve. A marker follows the curve using Motion Canvas position and tangent sampling.',
  },
  'spring-comparison': {
    label: 'Analytic motion responses',
    detail: 'Three spring-response equations produce different amounts of settling and overshoot. The motion restarts every five seconds.',
  },
  'easing-race': {
    label: 'Timing-function comparison',
    detail: 'Five Motion Canvas easing functions move objects between the same endpoints over the same duration.',
  },
  'kinetic-type': {
    label: 'Motion technique',
    detail: 'Phase-shifted sine functions control each letter’s position, rotation, and scale.',
  },
  'text-mask': {
    label: 'Motion technique',
    detail: 'Cached nodes and source-in compositing restrict moving gradients and circles to the letterforms.',
  },
  'camera-zoom': {
    label: 'Motion technique',
    detail: 'A Motion Canvas camera pans and zooms between cards, then returns to the overview.',
  },
  'perspective-grid': {
    label: 'Projected geometry',
    detail: 'A rotating cube is projected onto two-dimensional Motion Canvas nodes. A grid scrolls below it.',
  },
  'concentric-tunnel': {
    label: 'Procedural motion',
    detail: 'Repeating rectangles change size, angle, and opacity to create a tunnel effect.',
  },
  'staggered-tiles': {
    label: 'Procedural motion',
    detail: 'The timing of each tile depends on its distance from the center, creating a wave of changes in size, angle, color, and opacity.',
  },
  'particle-burst': {
    label: 'Choreographed particles',
    detail: 'Fixed formulas control the curved particle paths, rotation, and fading.',
  },
  'code-evolution': {
    label: 'Motion technique',
    detail: 'The Code node animates changes between three Python snippets and highlights selected lines. The snippets are displayed as text.',
  },
};

export function getSceneBasis(id: string): SceneBasis {
  if (id === 'cricket-coaching') return {
    label: 'Synthetic motion, computed geometry',
    detail: 'Authored batting keyframes drive a jointed figure with two hands on one handle. Bat angles, traces, and ball contact are calculated from those frames. Open the Cricket recipe to edit the poses.',
  };
  if (id === 'post-training-feedback') return {
    label: 'Computed policy-gradient model',
    detail: 'A small one-prompt policy uses supplied reward scores to calculate each update. The starting probabilities and scores are examples; subsequent probabilities follow the stated learning rule. Open the Post-training recipe to change the reward.',
  };
  return sceneBases[id] ?? {
    label: 'Animation example',
    detail: 'See the scene source for its inputs and calculations.',
  };
}
