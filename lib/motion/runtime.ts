import {
  bootstrap,
  LogLevel,
  makeProject,
  MetaFile,
  Player,
  Stage,
  Vector2,
  type FullSceneDescription,
  type LogPayload,
} from '@motion-canvas/core';
import {makeScene2D, type Scene2D} from '@motion-canvas/2d';
import type {SceneFactory} from './types';

/** A fresh scene description is created for every player instance. */
export type MotionSceneFactory = SceneFactory;

export interface MotionPlayerOptions {
  width?: number;
  height?: number;
  fps?: number;
  resolutionScale?: number;
  autoplay?: boolean;
  loop?: boolean;
  background?: string;
  initialTime?: number;
  onReady?: (durationSeconds: number) => void;
  onFrame?: (seconds: number, durationSeconds: number) => void;
  onEnded?: () => void;
  onError?: (message: string) => void;
}

export interface MotionPlayerHandle {
  readonly canvas: HTMLCanvasElement;
  readonly duration: number;
  readonly time: number;
  play(): void;
  pause(): void;
  setActive(active: boolean): void;
  restart(): void;
  seek(seconds: number): void;
  setSpeed(speed: number): void;
  dispose(): void;
}

/**
 * Embed the actual Motion Canvas Player and Stage without the editor or Vite
 * plugin. Import this module inside a client effect: its renderer needs the DOM.
 *
 * The Vite plugin normally adds the scene name and bootstraps project metadata.
 * Here those same exported Motion Canvas APIs perform that small setup in memory.
 */
export function mountMotionCanvas(
  container: HTMLElement,
  id: string,
  sceneFactory: MotionSceneFactory,
  options: MotionPlayerOptions = {},
): MotionPlayerHandle {
  const fps = options.fps ?? 30;
  const size = new Vector2(options.width ?? 960, options.height ?? 540);
  const resolutionScale = options.resolutionScale ?? 0.75;
  const description = makeScene2D(sceneFactory);

  // Player supplies size, playback, logger and the other per-instance fields.
  // The same cast is implicit in the plugin's `?scene` import type declaration.
  const scene = {...description, name: id} as FullSceneDescription;
  const project = bootstrap(
    id,
    {core: '3.17.2', two: '3.17.2', ui: null, vitePlugin: null},
    [],
    makeProject({scenes: [scene], experimentalFeatures: true}),
    new MetaFile(id),
    new MetaFile(`${id}-settings`),
  );

  const stage = new Stage();
  stage.configure({
    size,
    resolutionScale,
    colorSpace: 'srgb',
    background: options.background ?? '#0b101b',
  });
  const canvas = stage.finalBuffer;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.objectFit = 'contain';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `${id.replaceAll('-', ' ')} animation`);
  container.appendChild(canvas);

  let disposed = false;
  let requestedActive = true;
  let wantsPlayback = options.autoplay ?? true;
  let durationFrames = 0;
  let currentFrame = 0;
  let ready = false;
  let firstRender = true;
  // Keep the latest requested time until that frame has actually been painted.
  // Player captures its seek at the start of an asynchronous update, so a seek
  // queued during rendering must survive that older render completing.
  let pendingSeek: number | null = null;
  let errorReported = false;

  const player = new Player(
    project,
    {size, resolutionScale, fps, range: [0, Infinity], audioOffset: 0},
    {loop: options.loop ?? true, muted: true},
    Math.max(0, Math.round((options.initialTime ?? 0) * fps)),
  );
  const pendingSeekFrame = () => pendingSeek === null ? null :
    Math.max(0, Math.min(durationFrames, Math.round(pendingSeek * fps)));

  // Motion Canvas's transparent layout frame measures the animation's text.
  // Its intermediate strings are implementation detail, not accessible content.
  const measurementFrame = document.getElementById('motion-canvas-2d-frame');
  measurementFrame?.setAttribute('aria-hidden', 'true');
  measurementFrame?.setAttribute('role', 'presentation');

  const detachLayoutRoots = () => {
    // Scene2D measures text/layout in a hidden DOM root. Removing only the
    // visible canvas would leave those roots attached after gallery unmounts.
    for (const instance of player.playback.onScenesRecalculated.current) {
      (instance as Scene2D).getView().element?.remove();
    }
  };

  const render = async () => {
    if (disposed) {
      detachLayoutRoots();
      player.onRender.unsubscribe(render);
      player.onRecalculated.unsubscribe(onRecalculated);
      return;
    }
    if (!player.playback.currentScene) return;
    const renderedFrame = player.playback.frame;
    await stage.render(
      player.playback.currentScene,
      player.playback.previousScene,
    );
    if (disposed) return;
    const seekFrame = pendingSeekFrame();
    // At playback speeds above 1, Motion Canvas advances in larger frame
    // steps and may land just beyond the requested integer frame.
    if (seekFrame !== null && renderedFrame >= seekFrame &&
      renderedFrame - seekFrame < player.playback.speed) {
      pendingSeek = null;
    }
    if (firstRender) {
      firstRender = false;
      options.onReady?.(durationFrames / fps);
    }
    // Freeze the painted final frame before Player can reset to the start.
    // Pausing alone would leave its animation loop running in the background.
    if (options.loop === false && wantsPlayback && ready && pendingSeek === null &&
      durationFrames > 0 && (player.playback.finished || renderedFrame >= durationFrames)) {
      wantsPlayback = false;
      player.togglePlayback(false);
      options.onEnded?.();
    }
    if (!wantsPlayback && pendingSeek === null && !disposed) player.deactivate();
  };

  const updateActivity = () => {
    if (disposed) return;
    if (requestedActive && !document.hidden && (wantsPlayback || firstRender || pendingSeek !== null)) {
      player.activate();
      player.togglePlayback(wantsPlayback);
    } else {
      player.togglePlayback(false);
      // Pausing alone leaves Motion Canvas's requestAnimationFrame loop running.
      player.deactivate();
    }
  };

  const onDuration = (frames: number) => {
    durationFrames = frames;
  };
  const onFrame = (frame: number) => {
    currentFrame = frame;
    if (!disposed) options.onFrame?.(frame / fps, durationFrames / fps);
  };
  const onRecalculated = () => {
    if (disposed) {
      detachLayoutRoots();
      return;
    }
    ready = true;
    const target = pendingSeekFrame();
    if (target !== null) player.requestSeek(target);
  };
  const onLog = (entry: LogPayload) => {
    if (disposed || entry.level !== LogLevel.Error || errorReported) return;
    errorReported = true;
    const message = entry.message || 'This animation could not be rendered.';
    console.error(`[Motion Canvas: ${id}]`, message, entry.stack ?? '');
    options.onError?.(message);
  };

  player.onRender.subscribe(render);
  player.onDurationChanged.subscribe(onDuration);
  player.onFrameChanged.subscribe(onFrame);
  player.onRecalculated.subscribe(onRecalculated);
  project.logger.onLogged.subscribe(onLog);
  document.addEventListener('visibilitychange', updateActivity);
  updateActivity();

  return {
    canvas,
    get duration() {
      return durationFrames / fps;
    },
    get time() {
      return currentFrame / fps;
    },
    play() {
      wantsPlayback = true;
      updateActivity();
    },
    pause() {
      wantsPlayback = false;
      updateActivity();
    },
    setActive(active) {
      requestedActive = active;
      updateActivity();
    },
    restart() {
      if (disposed) return;
      pendingSeek = 0;
      player.requestReset();
      wantsPlayback = true;
      updateActivity();
    },
    seek(seconds) {
      if (disposed || !Number.isFinite(seconds)) return;
      pendingSeek = Math.max(0, seconds);
      if (ready) player.requestSeek(pendingSeekFrame()!);
      // Queue the seek before activation, and respect offscreen/hidden state.
      updateActivity();
    },
    setSpeed(speed) {
      if (disposed || !Number.isFinite(speed)) return;
      player.setSpeed(Math.max(0.25, Math.min(3, speed)));
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      player.togglePlayback(false);
      player.deactivate();
      detachLayoutRoots();
      // A recalculation already in flight can recreate its hidden layout root.
      // Keep the guarded render/recalculated callbacks until that run finishes.
      player.onDurationChanged.unsubscribe(onDuration);
      player.onFrameChanged.unsubscribe(onFrame);
      project.logger.onLogged.unsubscribe(onLog);
      document.removeEventListener('visibilitychange', updateActivity);
      canvas.remove();
    },
  };
}
