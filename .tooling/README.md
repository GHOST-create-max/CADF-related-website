# Tooling (CADF site)

Dev tooling for the static site in `CADF( final)/` — a page generator plus a
headless-browser test suite. Not part of the published website.

## First run in a fresh sandbox

    cd .tooling
    npm run setup      # installs deps + extracts Chromium into ../.cache/
    npm run serve      # http://localhost:8000

`.cache/` and `node_modules/` are git-ignored and are **not** restored between
sessions, so `npm run setup` may need re-running. It is idempotent.

### Why a custom Chromium

`cdn.playwright.dev` and `storage.googleapis.com` are unreachable from this
sandbox, so `npx playwright install` fails. `setup-browser.js` instead
decompresses the Chromium shipped through the npm registry
(`@sparticuz/chromium`) into `../.cache/chrome/`, with its bundled system
libraries. GPU/Vulkan is disabled in the launch flags because ANGLE crashes
headless in this container.

## Building the pages

    npm run build      # node build/build.js

The four HTML pages are **generated**, not hand-edited. `build/shell.js` holds
the shared chrome (icon set, rail, mobile menu, footer, `<head>`) and
`build/build.js` holds the per-page content. This is what removes the
copy-pasted navbar/footer that used to live in all four files.

> Edit `build/*.js`, then run `npm run build`. Editing the generated
> `.html` files directly means losing the change on the next build.

## Site files

| File | Role |
|---|---|
| `styles.css` | single stylesheet for all pages (replaced the 4 near-identical ones) |
| `common.js`  | theme, mobile menu, loader, scroll animations, smooth scroll |
| `script.js`  | home: category filter chips |
| `about.js`   | placeholder |
| `gallery.js` | lightbox (reads its data from the DOM) |
| `contact.js` | form validation, draft autosave |

A small inline script in each `<head>` applies the saved theme before first
paint so dark-mode users don't get a white flash.

## Test suite

    npm test     # check + shared + features + modal + visual + audit

| Script | What it asserts |
|---|---|
| `check.js`    | all 4 pages: no console/JS errors, no failed requests, no broken images, no missing `alt`, loader not stuck |
| `shared.js`   | `common.js` behaves identically on all 4 pages: loader hides, content interactive, theme toggles **and persists**, active nav link, mobile menu + Escape |
| `features.js` | home filter chips, gallery keyboard nav (Enter / arrows / Escape / focus return), contact form validation + draft + confirmation |
| `modal.js`    | all 12 lightbox images actually load |
| `visual.js`   | dark-mode screenshots, no oversized SVGs, no horizontal overflow |
| `audit.js`    | accessibility per page: one `h1`, no skipped heading levels, every control has an accessible name, every field has a label, `lang`, title/description, skip link, landmarks |
| `shoot.js`    | desktop (1440px) + mobile (390px) screenshots into `shots/` |

All of them should report **0 issues / 0 échecs**.
