# Paper Shaders originals in Motion Atlas

Metaballs and Warp use Paper Shaders 0.0.82, revision `e7003a2d4e6e932e30b8fa11ec1239e6ea48e16a`.

- Upstream: https://github.com/paper-design/shaders
- Renderer source is copied without modification into `upstream/`.
- Original React components are preserved as a record of the preset definitions and uniform mapping.
- `presets/` extracts those exact preset values; only imports and type annotations change.
- `adapter.ts`, `style.css`, and the surrounding page are Atlas hosting controls. They do not replace or redraw the shaders.
- No external images, fonts, scripts, API calls, or analytics are loaded at runtime. The original noise texture is embedded in upstream source.

Keep LICENSE, NOTICE, and provenance.json with redistribution. Upstream files remain Apache-2.0; Atlas does not relicense them as MIT.

## Rebuild

From the Motion Atlas repository root:

```sh
node scripts/vendor-paper.mjs
```

The command uses pinned esbuild 0.25.12 to bundle the included TypeScript. The served bundle is checked in, so ordinary Atlas builds do not download or rebuild it. Serve this folder over HTTP and open index.html.

WebGL2 is required. Browsers without it see an availability message. The original renderers are preserved. Reduced-motion preference starts playback paused; the Play button enables it. Closing the document releases the renderer; the upstream mount pauses when hidden or offscreen.
