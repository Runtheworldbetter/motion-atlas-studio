/** Original upstream implementations hosted with their own licenses and editable source. */
export interface AtlasOriginal {
  id: string; title: string; author: string; category: string; description: string; instruction: string;
  directory: string; upstream: string; source: string; license: string; capability?: string;
}
export const originals: readonly AtlasOriginal[] = [
  {id: 'spectrogram', title: 'Spectrogram', author: 'Google Creative Lab', category: 'Music & sound',
    description: 'See the frequencies inside a sound as a moving landscape.', instruction: 'Choose an instrument or draw across the sound field. Microphone input is optional.',
    directory: 'chrome-music-lab/spectrogram', upstream: 'https://musiclab.chromeexperiments.com/Spectrogram/', source: 'https://github.com/googlecreativelab/chrome-music-lab/tree/e54bb414908da2b6286a6ad6431a5fcf8b68dc3f/spectrogram', license: 'Apache 2.0 + notices', capability: 'WebGL · audio'},
  {id: 'loopy', title: 'LOOPY', author: 'Nicky Case', category: 'Systems',
    description: 'Draw a system. Give it a nudge. Follow the consequences.', instruction: 'Draw a loop, connect it, and press Play. Use “save as file” to keep your model before closing.',
    directory: 'loopy', upstream: 'https://ncase.me/loopy/', source: 'https://github.com/ncase/loopy', license: 'CC0 + notices'},
  {id: 'markov', title: 'Markov chains', author: 'Victor Powell & Lewis Lehe', category: 'Probability',
    description: 'Change the odds and follow the original linked matrix, diagrams, and weather sequences.', instruction: 'Adjust probabilities and speed. Hover matrix cells to follow transitions in the moving diagram.',
    directory: 'setosa-markov', upstream: 'https://setosa.io/ev/markov-chains/', source: 'https://github.com/vicapow/explained-visually/tree/master/client/explanations/markov-chains', license: 'MIT + notices'},
  {id: 'sigma', title: 'A network of papers', author: 'Sigma.js contributors', category: 'Networks',
    description: 'Search thousands of AI papers and bring their connections into focus.', instruction: 'Search for a paper, select it, and explore the surrounding citations and co-authors.',
    directory: 'sigma', upstream: 'https://www.sigmajs.org/embed/homepage/demo/', source: 'https://github.com/jacomyal/sigma.js', license: 'MIT · OpenAlex data CC0', capability: 'WebGL2'},
  {id: 'pathfinding', title: 'Inside a search', author: 'Amit Patel · Red Blob Games', category: 'Algorithms',
    description: 'Move the goal and watch a pathfinding algorithm explore its options.', instruction: 'Drag a start or goal. Step through the search, edit the terrain, and compare the algorithms.',
    directory: 'red-blob', upstream: 'https://www.redblobgames.com/pathfinding/a-star/introduction.html', source: 'https://www.redblobgames.com/pathfinding/a-star/build/_introduction.js.map', license: 'Apache 2.0 + notices'},
  {id: 'paper', title: 'Metaballs & Warp', author: 'Paper', category: 'Materials',
    description: 'Explore the original flowing shapes, colors, and shader presets.', instruction: 'Switch between Metaballs and Warp. Try an original preset, then change its speed and scale.',
    directory: 'paper-shaders', upstream: 'https://shaders.paper.design/metaballs', source: 'https://github.com/paper-design/shaders', license: 'Apache 2.0 + NOTICE', capability: 'WebGL2'},
];
export function originalFromHash(hash: string): AtlasOriginal | undefined {
  return hash.startsWith('#originals/') ? originals.find(item => item.id === hash.slice(11)) : undefined;
}
