# Data and privacy

Motion Atlas runs as a static application in your browser. The public app has no account system, application database, preference API, or analytics integration.

## Preferences

Upvotes, downvotes, and notes are saved in local storage for this site's browser origin. They remain on the same browser/device until you clear them or browser storage is removed. Another person using that browser profile may be able to see them. Opening another hostname, browser, or device starts a separate collection.

Use the preference export/import controls to move a collection yourself. The clear-preferences control removes the app's saved preferences on the current browser. It does not delete files you have downloaded or copies you have shared. Storage restrictions or private browsing can prevent preferences from persisting; the interface reports a local-save problem if one occurs.

Reactions are personal choices. There are no shared vote counts, public notes, cloud synchronization, recommendation training, or background monitoring.

## Recipe input and local files

Pasted input and files opened in a recipe are parsed in browser memory. The app does not send their contents to a server. Before/after code is displayed, not executed. Uploaded files are bounded by a 128 KiB per-file limit and each recipe's own model limits.

Editor drafts are not saved across page reloads. Download input or a project ZIP if you want to keep a draft. A customized project ZIP intentionally contains the selected recipe input; review that input before sharing the ZIP. A preference export intentionally contains your selected ratings and notes.

## Links and hosting

Scene links and embed links contain a gallery ID or recipe/preset selection. They do not include edited inputs or notes. To share a custom example, deliberately share an input download or customized project instead.

The hosting service necessarily receives ordinary requests for the page and its static assets, including the URL you visit. Its access logs and platform behavior are separate from the app's local storage. Following an external link, such as the GitHub repository or Motion Canvas documentation, opens a different service with its own practices.

If you host a modified version, review and update this page to match what that version actually collects or sends.
