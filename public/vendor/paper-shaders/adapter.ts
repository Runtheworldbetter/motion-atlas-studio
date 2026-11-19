// Motion Atlas standalone host. Original renderer and preset values are in upstream/ and presets/.
import {ShaderMount} from './upstream/shader-mount';
import {ShaderFitOptions} from './upstream/shader-sizing';
import {getShaderColorFromString} from './upstream/get-shader-color-from-string';
import {getShaderNoiseTexture} from './upstream/get-shader-noise-texture';
import {metaballsFragmentShader} from './upstream/shaders/metaballs';
import {warpFragmentShader, WarpPatterns} from './upstream/shaders/warp';
import {metaballsPresets} from './presets/metaballs';
import {warpPresets} from './presets/warp';

const surface = document.querySelector<HTMLElement>('#surface')!;
const shader = document.querySelector<HTMLSelectElement>('#shader')!;
const preset = document.querySelector<HTMLSelectElement>('#preset')!;
const speed = document.querySelector<HTMLInputElement>('#speed')!;
const scale = document.querySelector<HTMLInputElement>('#scale')!;
const detail = document.querySelector<HTMLInputElement>('#detail')!;
const play = document.querySelector<HTMLButtonElement>('#play')!;
let mount: ShaderMount | undefined;
let playing = !matchMedia('(prefers-reduced-motion: reduce)').matches;
let settings: Record<string, any> = {};
const presets = () => shader.value === 'warp' ? warpPresets : metaballsPresets;
const noise = getShaderNoiseTexture();
function uniforms() {
  const p = settings;
  const common = {u_colors: p.colors.map(getShaderColorFromString), u_colorsCount: p.colors.length,
    u_noiseTexture: noise, u_fit: ShaderFitOptions[p.fit], u_scale: p.scale, u_rotation: p.rotation,
    u_originX: p.originX, u_originY: p.originY, u_offsetX: p.offsetX, u_offsetY: p.offsetY,
    u_worldWidth: p.worldWidth, u_worldHeight: p.worldHeight};
  return shader.value === 'warp' ? {...common, u_proportion: p.proportion, u_softness: p.softness,
    u_distortion: p.distortion, u_swirl: p.swirl, u_swirlIterations: p.swirlIterations,
    u_shapeScale: p.shapeScale, u_shape: WarpPatterns[p.shape]} : {...common,
    u_colorBack: getShaderColorFromString(p.colorBack), u_count: p.count, u_size: p.size};
}
function labels() {
  for (const input of [speed, scale, detail]) document.querySelector<HTMLOutputElement>('#' + input.id + '-value')!.value = input.value;
  play.textContent = playing ? 'Pause' : 'Play';
  play.setAttribute('aria-pressed', String(playing));
}
function selectPreset() {
  settings = {...presets()[Number(preset.value)].params};
  speed.value = String(settings.speed); scale.value = String(settings.scale);
  const warp = shader.value === 'warp';
  document.querySelector('#detail-label')!.textContent = warp ? 'Distortion' : 'Number of shapes';
  detail.min = warp ? '0' : '1'; detail.max = warp ? '1' : '20'; detail.step = warp ? '.01' : '1';
  detail.value = String(warp ? settings.distortion : settings.count);
  mount?.dispose(); mount = undefined; surface.replaceChildren();
  try {
    mount = new ShaderMount(surface, warp ? warpFragmentShader : metaballsFragmentShader,
      uniforms(), {preserveDrawingBuffer: true}, playing ? settings.speed : 0, settings.frame, 1, 2560 * 1440);
    document.querySelector<HTMLElement>('#fallback')!.hidden = true;
  } catch (error) {
    surface.replaceChildren();
    document.querySelector<HTMLElement>('#fallback')!.hidden = false;
    document.querySelectorAll<HTMLInputElement | HTMLButtonElement>('[data-render-control]').forEach(el => el.disabled = true);
  }
  labels();
}
function selectShader() {
  preset.replaceChildren(...presets().map((p, i) => {const option = document.createElement('option'); option.value = String(i); option.textContent = p.name; return option;}));
  selectPreset();
}
shader.addEventListener('change', selectShader); preset.addEventListener('change', selectPreset);
speed.addEventListener('input', () => {settings.speed = Number(speed.value); mount?.setSpeed(playing ? settings.speed : 0); labels();});
scale.addEventListener('input', () => {settings.scale = Number(scale.value); mount?.setUniforms(uniforms()); labels();});
detail.addEventListener('input', () => {settings[shader.value === 'warp' ? 'distortion' : 'count'] = Number(detail.value); mount?.setUniforms(uniforms()); labels();});
play.addEventListener('click', () => {playing = !playing; mount?.setSpeed(playing ? settings.speed : 0); labels();});
document.querySelector('#reset')!.addEventListener('click', selectPreset);
document.querySelector('#save')!.addEventListener('click', () => {mount?.canvasElement.toBlob(blob => {
  if (!blob) return; const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = 'paper-' + shader.value + '.png'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}, 'image/png');});
window.addEventListener('pagehide', () => {mount?.dispose(); mount = undefined;});
selectShader();
