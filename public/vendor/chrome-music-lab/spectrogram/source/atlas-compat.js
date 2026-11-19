/* Motion Atlas integration, 2026-11-18. MIT; see licenses/ATLAS-MIT.txt.
 * The original spectral renderer and instrument artwork are unchanged. */
(function () {
  'use strict';
  var spectrogram = null;
  var statusTimer = null;
  var failed = false;
  var statusElement = document.createElement('div');
  statusElement.className = 'atlas-status';
  statusElement.setAttribute('role', 'status');
  statusElement.setAttribute('aria-live', 'polite');
  document.body.appendChild(statusElement);

  function status(message) {
    clearTimeout(statusTimer);
    statusElement.textContent = message;
    statusElement.classList.add('visible');
    statusTimer = setTimeout(function () { statusElement.classList.remove('visible'); }, 8000);
  }

  function releaseTone() {
    if (!spectrogram || !spectrogram.player) return;
    spectrogram.player.stopTone();
    window.jQuery('#spectrogram').off('mousemove', spectrogram.handleTrack).off('touchmove', spectrogram.handleTrack);
  }

  function stop() {
    if (!spectrogram || !spectrogram.player) return;
    spectrogram.stop();
    spectrogram.stopRender();
    spectrogram.drawingMode = false;
    releaseTone();
    window.jQuery('.music-box__buttons__button').removeClass('selected').attr('aria-pressed', 'false');
    window.jQuery('.music-box__modal').stop(true, true).hide();
    var context = spectrogram.player.context;
    if (context && context.state !== 'closed') context.suspend().catch(function () {});
  }

  function unavailable(reason) {
    if (failed) return;
    failed = true;
    stop();
    document.body.classList.add('atlas-unavailable');
    var panel = document.createElement('section');
    panel.className = 'atlas-fallback';
    panel.setAttribute('role', 'status');
    var heading = document.createElement('h1');
    heading.textContent = 'The original Spectrogram needs WebGL and Web Audio';
    var copy = document.createElement('p');
    copy.textContent = 'This browser could not start the original renderer. Try opening it full size in a browser with graphics acceleration. The original visual has been preserved; no substitute animation is shown.';
    var links = document.createElement('p');
    var full = document.createElement('a');
    full.href = './index.html';
    full.target = '_blank';
    full.rel = 'noopener';
    full.textContent = 'Open full size';
    var source = document.createElement('a');
    source.href = 'https://github.com/googlecreativelab/chrome-music-lab/tree/e54bb414908da2b6286a6ad6431a5fcf8b68dc3f/spectrogram';
    source.target = '_blank';
    source.rel = 'noopener';
    source.textContent = 'Original source';
    links.append(full, source);
    panel.append(heading, copy, links);
    document.body.appendChild(panel);
    document.querySelectorAll('.music-box__buttons__button').forEach(function (button) {
      button.setAttribute('aria-disabled', 'true');
      button.tabIndex = -1;
    });
    if (reason) console.warn('Original Spectrogram could not initialize:', reason.message || reason);
  }

  function unlock() {
    if (!spectrogram || !spectrogram.player || document.hidden || failed) return;
    var context = spectrogram.player.context;
    if (context.state === 'suspended') context.resume().catch(function () {
      status('Audio could not start. Tap an instrument again to enable sound.');
    });
  }

  function prepare() {
    if (!(window.AudioContext || window.webkitAudioContext)) { unavailable(); return false; }
    var canvas = document.getElementById('spectrogram');
    var gl;
    try { gl = canvas.getContext('webgl', {antialias: true}) || canvas.getContext('experimental-webgl', {antialias: true}); }
    catch (error) { unavailable(error); return false; }
    if (!gl) { unavailable(); return false; }
    canvas.addEventListener('webglcontextlost', function (event) {
      event.preventDefault();
      unavailable('Graphics context was lost. Reload the experiment to try again.');
    });
    return true;
  }

  function connect(original) {
    spectrogram = original;
    // A first gesture unlocks audio; no sound, sample, or microphone starts here.
    document.addEventListener('pointerdown', unlock, {capture: true, passive: true});
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { stop(); status('Sound stopped. Choose an instrument to play again.'); return; }
      var button = event.target.closest && event.target.closest('.music-box__buttons__button');
      if (button && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault(); unlock(); button.click();
      }
    });
    document.addEventListener('click', function (event) {
      if (!(event.target.closest && event.target.closest('.music-box__buttons__button'))) return;
      queueMicrotask(function () {
        var selected = document.querySelector('.music-box__buttons__button.selected');
        document.querySelectorAll('.music-box__buttons__button').forEach(function (button) {
          button.setAttribute('aria-pressed', String(button === selected));
        });
        if (!selected) stop();
      });
    });
    // A release outside the drawing canvas must never leave an oscillator running.
    window.addEventListener('mouseup', releaseTone);
    window.addEventListener('touchend', releaseTone, {passive: true});
    window.addEventListener('touchcancel', releaseTone, {passive: true});
    window.addEventListener('blur', stop);
    window.addEventListener('pagehide', stop);
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); });
    window.addEventListener('message', function (event) {
      if (event.source === window.parent && event.data && event.data.type === 'atlas-original-stop') stop();
    });
  }

  window.AtlasSpectrogram = {prepare: prepare, unavailable: unavailable, connect: connect, unlock: unlock, status: status, stop: stop};
}());
