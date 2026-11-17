# Hosting and embeds

## Build a static site

From the project root:

```sh
npm ci
npm test
npm run typecheck
node scripts/generate-notices.mjs --check
npm run build
npm run preview
```

Publish the contents of `dist/` to a static web host. The app runs in the browser and needs no backend setup. Include the source ZIP and third-party notices with the other build assets.

Vite's relative base supports a domain root or a subdirectory. Scene navigation uses query parameters on the entry page. Use that page's complete URL when sharing or embedding a scene.

The public app runs at [runtheworldbetter.github.io/motion-atlas-studio/](https://runtheworldbetter.github.io/motion-atlas-studio/). An existing website can link to it or embed it on a page such as `/tools/motion-atlas/`. This also works for a WordPress page that permits iframe embeds. To serve the app from your own website, publish `dist/` at the desired path using that site's host.

## Deploy to GitHub Pages

The public repository uses `.github/workflows/pages.yml` for manual releases from the default branch. CI runs on pushes and pull requests. To set up a fork or publish an update:

1. In repository **Settings → Pages**, select **GitHub Actions** as the build/deployment source.
2. Confirm that the `github-pages` environment permits deployments from the default branch, with any reviewers your repository requires.
3. Open **Actions → Deploy to GitHub Pages → Run workflow**, choose the default branch, and run it.
4. Open the deployment URL and check a gallery scene, a recipe, an embed, and a source download.

The build job has read-only repository permissions. The deployment job uses `pages: write` and `id-token: write` with GitHub's built-in token/OIDC flow. No personal access token or stored deployment secret is required.

The workflow uses official GitHub Actions pinned to release commits. For platform settings and availability, see GitHub's documentation on [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Scene and preset links

Append a query to the deployed entry-page URL:

| Query | Result |
| --- | --- |
| `?scene=parametric-knot` | Open a gallery scene |
| `?recipe=trace&example=human-correction` | Open a recipe with a supplied preset |
| `?scene=parametric-knot&embed=1` | Show a focused gallery preview |
| `?recipe=trace&example=human-correction&embed=1` | Show a focused preset preview |

Recipe IDs are `trace`, `waterfall`, `code`, `fourier`, and `pathfinding`. The app's **Share / embed** controls generate these links. To share edited input, download the input or a project ZIP.

```html
<iframe
  src="https://runtheworldbetter.github.io/motion-atlas-studio/?scene=parametric-knot&embed=1"
  title="Motion Atlas: a parametric knot"
  width="960"
  height="640"
  loading="lazy"
  style="width: 100%; max-width: 960px; border: 0;"
></iframe>
```

Give every embed a descriptive title and enough height for its controls. If a preview is blocked, check the parent site's `frame-src` policy and the app host's `frame-ancestors`/`X-Frame-Options` policy. Browser restrictions on third-party storage can prevent preferences from saving inside an iframe. Open the app directly to manage saved votes and notes.

## Before deploying a change

Run the checks above and open the built preview. Check that inputs stay local, downloads contain the intended files, links work at the deployed path, and keyboard and reduced-motion controls work. If adding a remote service or telemetry, update the interface and [privacy documentation](privacy.md) to explain what data is sent.
