import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {readFile} from 'node:fs/promises';

// Make the already-packaged downloads available during local development too.
const sourceDownloads = {
  name: 'motion-atlas-local-downloads',
  configureServer(server: import('vite').ViteDevServer) {
    server.middlewares.use((request, response, next) => {
      const pathname = request.url?.split('?')[0];
      if (pathname !== '/source/bundle.json' && pathname !== '/motion-atlas-source.zip') {next(); return;}
      readFile(`dist${pathname}`).then(bytes => {
        response.setHeader('Content-Type', pathname.endsWith('.zip') ? 'application/zip' : 'application/json');
        response.end(bytes);
      }).catch(() => next());
    });
  },
};

export default defineConfig({
  base: './',
  plugins: [react(), sourceDownloads],
  server: {allowedHosts: true},
  build: {target: 'es2022', chunkSizeWarningLimit: 1000},
});
