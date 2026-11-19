// Motion Atlas hosting adapter. The original Sigma renderer requires WebGL2.
const status = document.getElementById('runtime-status');
try {
  const probe = document.createElement('canvas');
  const gl = probe.getContext('webgl2');
  if (!gl) throw new Error('WebGL2 is unavailable');
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  await document.fonts.ready;
  await import('./app.js');
} catch (error) {
  console.error('Original Sigma demo could not start:', error);
  status.textContent = error?.message === 'WebGL2 is unavailable'
    ? 'This original Sigma visualization needs WebGL2. This browser cannot start its GPU renderer. '
    : 'The original Sigma network could not load. Reload this page to try again. ';
  const link = document.createElement('a');
  link.href = 'https://www.sigmajs.org/'; link.target = '_blank'; link.rel = 'noopener';
  link.textContent = 'Open the original Sigma site'; status.append(link);
  document.getElementById('search-input').disabled = true;
}
