export interface SceneBasis {
  label: string;
  detail: string;
}

/** The provenance of each gallery animation, separate from its visual style. */
export const sceneBases: Record<string, SceneBasis> = {
  'orbital-resonance': {
    label: 'Parametric geometry',
    detail: 'Two prescribed circular motions run at a 3:2 frequency ratio. This is a geometric construction, without gravitational dynamics.',
  },
  'fourier-epicycles': {
    label: 'Computed harmonic sum',
    detail: 'The circle endpoint and curve use the same four odd sine harmonics. The truncated sum approximates a square wave; the editable Fourier recipe exposes the coefficients.',
  },
  lissajous: {
    label: 'Parametric geometry',
    detail: 'Points follow x = sin(3θ + φ), y = sin(2θ), with a changing phase and display scaling.',
  },
  'wave-interference': {
    label: 'Computed wave sum',
    detail: 'Two equal-amplitude cosine waves are added at each point. Color indicates the sign of displacement; size indicates its magnitude. No distance attenuation is modeled.',
  },
  'pendulum-wave': {
    label: 'Choreographed motion',
    detail: 'Angles follow prescribed sine functions with selected periods. The lengths and timing make a visual pattern rather than a numerically simulated pendulum experiment.',
  },
  phyllotaxis: {
    label: 'Procedural geometry',
    detail: 'Seed positions use the golden angle and a square-root radius. Rotation and radial breathing are decorative motion added to that construction.',
  },
  'strange-attractor': {
    label: 'Numerical trajectory',
    detail: 'A Lorenz trajectory is computed with forward Euler integration, step 0.006, and σ = 10, ρ = 28, β = 8/3, then sampled and projected for display.',
  },
  'vector-field': {
    label: 'Consistent analytic field',
    detail: 'Particle paths are analytic spirals, and arrows use the derivative of those same paths. Arrow lengths are normalized for readability; particles fade and restart at the boundary.',
  },
  'polar-rose': {
    label: 'Parametric geometry',
    detail: 'The three curves use r = cos(kθ), for k = 3, 5, and 7, with a decorative rotation.',
  },
  'wave-surface': {
    label: 'Parametric surface',
    detail: 'A product of sine and cosine determines the height of a projected wireframe. The animation is a trigonometric surface, without a fluid solver.',
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
    detail: 'Pulses and connections are authored to illustrate a layered network. No learned weights, activations, or inference are being computed.',
  },
  'attention-matrix': {
    label: 'Synthetic normalized weights',
    detail: 'Synthetic positive values are normalized within each causal row; future positions are masked. The weights come from a formula, rather than a language model.',
  },
  'token-stream': {
    label: 'Illustrative sequence',
    detail: 'The word split, token labels, and choice probabilities are invented to demonstrate sequence animation. They are not tokenizer or model outputs.',
  },
  'agent-handoff': {
    label: 'Illustrative workflow',
    detail: 'An authored sequence moves a task through four roles. It demonstrates a workflow diagram, without running agents or executing the displayed work.',
  },
  'semantic-memory': {
    label: 'Illustrative system',
    detail: 'The graph, highlighted path, and source card are authored examples. There is no embedding search, memory store, or retrieval process behind them.',
  },
  'causal-graph': {
    label: 'Illustrative hypothesis',
    detail: 'The relationships and changing idle-day value form a hypothetical story. They are not estimated causal effects or evidence of a business outcome.',
  },
  'sorting-race': {
    label: 'Computed algorithm traces',
    detail: 'Bubble sort and adjacent-swap insertion sort execute on the same fixed array. Each trace is fitted to the same playback duration, so animation speed is not an algorithm benchmark.',
  },
  pathfinding: {
    label: 'Computed breadth-first search',
    detail: 'Breadth-first search builds a parent map on a fixed unweighted grid, and the route follows those parents. The editable pathfinding recipe adds actual expansion and frontier records.',
  },
  'binary-search': {
    label: 'Computed algorithm trace',
    detail: 'The displayed interval and midpoint come from actual binary-search comparisons on the fixed sorted array, with target 72.',
  },
  'mesh-network': {
    label: 'Illustrative system',
    detail: 'The relay failure and two alternative packet routes are authored. The scene does not implement a routing protocol or measure network resilience.',
  },
  'event-pipeline': {
    label: 'Illustrative workflow',
    detail: 'Packets follow authored routes, including a preselected review branch. No input events are validated, planned, or executed.',
  },
  'vehicle-lifecycle': {
    label: 'Illustrative workflow',
    detail: 'A vehicle icon follows an authored lifecycle path. The stages illustrate a process, without operational records or measured durations.',
  },
  'bar-race': {
    label: 'Synthetic data',
    detail: 'Five invented values interpolate between fixed endpoints. Ranking is calculated from those values at each frame; there is no external time series.',
  },
  'flow-ribbons': {
    label: 'Illustrative flow diagram',
    detail: 'Routes and ribbon widths are authored design inputs. The moving dots illustrate direction and are not counted units or measured throughput.',
  },
  'radial-progress': {
    label: 'Synthetic data',
    detail: 'Three invented percentages drive both ring lengths and numeric labels. They demonstrate a dashboard composition, without measured performance indicators.',
  },
  distribution: {
    label: 'Computed synthetic observations',
    detail: 'A seeded generator creates 120 binned observations. Each arriving dot increments its own bin, and every bar is computed from observations that have arrived.',
  },
  'scatter-migration': {
    label: 'Synthetic geometry',
    detail: 'Three designed point groups translate between fixed centers. The animation demonstrates correspondence through motion, without fitted clusters or observed migration.',
  },
  treemap: {
    label: 'Authored proportions',
    detail: 'Three areas follow interpolated partition dimensions; labels come from those proportions. Gutters are visual spacing and the values are invented.',
  },
  'chord-flow': {
    label: 'Illustrative network',
    detail: 'Five nodes have authored curved links and widths. Dots indicate bidirectional movement, without a measured flow matrix.',
  },
  'cohort-heatmap': {
    label: 'Synthetic data',
    detail: 'A deterministic formula creates the declining cell values. The rows and periods illustrate a cohort chart, without observed users or retention counts.',
  },
  'uncertainty-band': {
    label: 'Illustrative forecast design',
    detail: 'The centerline and widening bounds are authored functions. The shaded range has no fitted forecast model or stated probability coverage.',
  },
  waterfall: {
    label: 'Computed cumulative arithmetic',
    detail: 'The fixed illustrative contributions are added cumulatively and the final bar is their actual sum. Use the editable waterfall recipe to supply your own values.',
  },
  'scenario-fan': {
    label: 'Illustrative scenarios',
    detail: 'A synthetic history branches into three authored trajectories. These are design examples without probabilities or a forecast model.',
  },
  'live-sparkline': {
    label: 'Synthetic signals',
    detail: 'Periodic functions generate the scrolling curves and counters. They are visual dashboard motifs, not live feeds; counters are not measurements of the plotted endpoints.',
  },
  'morphing-path': {
    label: 'Motion technique',
    detail: 'Motion Canvas interpolates between four authored vector paths, along with their colors and rotation.',
  },
  'bezier-lab': {
    label: 'Computed curve geometry',
    detail: 'The cubic Bézier curve follows its moving control points. The traveler uses Motion Canvas curve-position and tangent sampling.',
  },
  'spring-comparison': {
    label: 'Analytic motion responses',
    detail: 'Three closed-form step responses show different settling and overshoot. The parameters are selected for comparison and the motion restarts every five seconds.',
  },
  'easing-race': {
    label: 'Timing-function comparison',
    detail: 'Five Motion Canvas easing functions receive the same progress signal and travel between the same endpoints in the same duration.',
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
    detail: 'A Motion Canvas camera pans and zooms through an authored scene, then returns to the overview.',
  },
  'perspective-grid': {
    label: 'Projected geometry',
    detail: 'A rotated cube uses perspective projection, while a decorative grid scrolls below it. All drawing uses two-dimensional Motion Canvas nodes.',
  },
  'concentric-tunnel': {
    label: 'Procedural motion',
    detail: 'Repeated rectangles change scale, rotation, and opacity to create an apparent tunnel.',
  },
  'staggered-tiles': {
    label: 'Procedural motion',
    detail: 'A radial phase offset drives each tile’s scale, angle, fill, and opacity.',
  },
  'particle-burst': {
    label: 'Choreographed particles',
    detail: 'Deterministic formulas create curved particle paths, rotation, and fading. There are no collision or fluid dynamics.',
  },
  'code-evolution': {
    label: 'Motion technique',
    detail: 'The Code node interpolates between three authored Python snippets and highlights selected ranges. The displayed Python is not executed.',
  },
};

export function getSceneBasis(id: string): SceneBasis {
  return sceneBases[id] ?? {
    label: 'Source-defined animation',
    detail: 'See the scene source for its construction and inputs.',
  };
}
