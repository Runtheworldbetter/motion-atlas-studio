// Rebuild the included Paper originals without changing the upstream renderer.
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const cwd = fileURLToPath(new URL('../public/vendor/paper-shaders/', import.meta.url));
const result = spawnSync('npx', ['--yes', 'esbuild@0.25.12', 'adapter.ts', '--bundle', '--format=esm', '--target=es2022', '--sourcemap', '--legal-comments=linked', '--outfile=bundle.js'], {cwd, stdio: 'inherit'});
if (result.status !== 0) process.exit(result.status ?? 1);
