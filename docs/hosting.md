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

Publish the contents of `dist/` to a static web host. There is no server process, database, login provider, or environment secret to configure. Keep the source ZIP and third-party notices with the other build assets.

Vite's relative base supports a domain root or a subdirectory. Scene navigation uses query parameters on the entry page, so it does not require server-side route rewrites. Use the complete URL of the deployed entry page when sharing or embedding a scene.

For an existing RTWB website, a separate subdomain provides a straightforward deployment boundary. Add a link from the main site, or embed a particular explanation where it is useful. Configure any custom domain through your chosen host's domain settings and DNS instructions.

## GitHub Pages: optional, manual deployment

The repository includes `.github/workflows/pages.yml`. It runs only when a maintainer chooses **Run workflow**, and only builds/deploys the repository's default branch. CI runs independently on pushes and pull requests.

1. In repository **Settings → Pages**, select **GitHub Actions** as the build/deployment source.
2. Confirm that the `github-pages` environment permits deployments from the default branch. Add required reviewers if your repository uses that control.
3. Open **Actions → Deploy to GitHub Pages → Run workflow**, choose the default branch, and run it.
4. Review the deployment URL produced by the workflow, then open a gallery link, a recipe, an embed, and a source download on that URL.

The build job has read-only repository permissions. Only the deployment job receives `pages: write` and `id-token: write`, using GitHub's built-in token/OIDC flow. No personal access token or stored deployment secret is required. A workflow file does not enable Pages or change repository visibility by itself.

The workflow uses official GitHub Actions pinned to release commits. For platform settings and availability, see GitHub's documentation on [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Scene and preset links

Append a query to the deployed entry-page URL:

| Query | Result |
| --- | --- |
| `?scene=parametric-knot` | Open a gallery scene |
| `?recipe=trace&example=human-correction` | Open a recipe with a supplied preset |
| `?scene=parametric-knot&embed=1` | Show a focused gallery preview |
| `?recipe=trace&example=human-correction&embed=1` | Show a focused preset preview |

Recipe IDs are `trace`, `waterfall`, `code`, `fourier`, and `pathfinding`. Use the app's share controls to construct links without copying an ID manually. Edited input is not encoded in these URLs.

```html
<iframe
  src="https://motion-atlas-studio.aarjavtrivedi.chatgpt.site/?scene=parametric-knot&embed=1"
  title="Motion Atlas: a parametric knot"
  width="960"
  height="640"
  loading="lazy"
  style="width: 100%; max-width: 960px; border: 0;"
></iframe>
```

Give every embed a descriptive title and enough height for its controls. Check the host's framing policy if a preview is blocked: the parent site's `frame-src` policy and the hosted app's `frame-ancestors`/`X-Frame-Options` policy must allow the intended embedding. Browser restrictions on third-party storage can affect local preferences inside an iframe; the standalone app is the clearest place to manage a collection.

## Before deploying a change

Run CI checks and inspect the built preview. Confirm that edited inputs remain local, downloads contain the intended files, scene links work at the deployment base path, and keyboard/reduced-motion controls remain usable. If adding any remote service or telemetry, update the interface and [privacy documentation](privacy.md) to describe the changed behavior.
