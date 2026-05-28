# Development Guide — TextAid

## Prerequisites

- **Node.js** 18+ and **npm**
- **Git** 2.40+
- A Chromium-based browser (Chrome, Brave, Edge…) or Firefox for testing

Recommended editor: VS Code with these extensions:
- [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) — linting and formatting (the project uses Biome, not ESLint/Prettier)
- [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)

## Setup

```bash
git clone https://github.com/kenny516/TextAid.git
cd TextAid
npm install
```

## Development workflow

### Build once

```bash
npm run build           # builds dist/chrome/ and dist/firefox/
npm run build:chrome    # Chrome-only
npm run build:firefox   # Firefox-only
```

### Watch mode (auto-rebuild on save)

```bash
npm run dev:chrome
npm run dev:firefox
```

### Load the unpacked build in your browser

**Chromium** (Chrome, Brave, Edge, Opera, Arc, Vivaldi):

1. Open `chrome://extensions/` (or `brave://extensions/`, `edge://extensions/`, etc.)
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** → select `dist/chrome/`
4. After each rebuild, click the refresh icon on the extension card
   (or use the "Extensions: Reload extension" VS Code command if you have
   the Chrome Extension dev-tools installed)

**Firefox / Zen / LibreWolf**:

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select `dist/firefox/manifest.json`

> Temporary add-ons disappear on browser restart. For a permanent local
> install, sign the build via AMO (free) to get a `.xpi` file.

## Project layout

```
TextAid/
├── manifest.json          # MV3 manifest (canonical Chrome entry point)
├── background.js          # Service worker — handles API calls, context menus, shortcuts
├── content.js             # Injected into pages — toolbar, dropdown, modal, suggestions
├── content.css            # Injected styles (dark monochrome, double-class specificity)
├── popup.html / .css / .js
├── icons/
├── lib/
│   ├── errors.js          # friendlyError() — parses provider error bodies
│   └── markdown.js        # renderMarkdown() — converts MD to safe HTML
├── scripts/
│   ├── build.mjs          # Bundles dist/chrome and dist/firefox
│   ├── watch.mjs          # File watcher that triggers build.mjs
│   └── version.mjs        # Bumps version in package.json, manifest.json, landing/package.json
├── tests/
│   ├── errors.test.js
│   └── markdown.test.js
├── landing/               # Marketing site (Vite + React)
└── docs/
    ├── SUPPORTED_BROWSERS.md
    ├── STORE_LISTING.md
    └── development.md     # this file
```

## Testing

Tests are written with [Vitest](https://vitest.dev/) and cover the shared
`lib/` helpers.

```bash
npm run test          # single run
npm run test:watch    # watch mode
```

## Linting

The project uses [Biome](https://biomejs.dev/) for both linting and
formatting (no ESLint, no Prettier).

```bash
npm run lint          # check lib/ and tests/
npm run lint:fix      # auto-fix safe issues
```

## Debugging

Open browser DevTools on the relevant context:

| Context          | How to open                                           |
| ---------------- | ----------------------------------------------------- |
| Service worker   | `chrome://extensions/` → "Service worker" link        |
| Content script   | DevTools on any page → Console (select the extension) |
| Popup            | Right-click the extension icon → "Inspect popup"      |

Useful snippet in the page console to check if the content script loaded:

```js
document.querySelectorAll('.textaid-toolbar, .textaid-modal, .textaid-suggestion')
```

The main injected CSS class is `.textaid-root` (double-class specificity
`.textaid-root.textaid-root` is used in `content.css` to override host styles).

## Git workflow

### Branch naming

| Prefix       | Purpose                                  |
| ------------ | ---------------------------------------- |
| `feat/`      | New features                             |
| `fix/`       | Bug fixes                                |
| `hotfix/`    | Urgent production fixes                  |
| `docs/`      | Documentation-only changes               |
| `refactor/`  | Code cleanup without behaviour change    |
| `test/`      | Adding or modifying tests                |

### Commit messages (Conventional Commits)

```
feat: add grammar-fix action to the toolbar
fix: prevent dropdown from closing on scroll
docs: update provider table in README
refactor: extract streaming logic into helper
test: add edge cases for friendlyError Claude path
```

### Feature branch flow

```bash
# Start from main
git checkout main && git pull

# New branch
git checkout -b feat/my-feature

# … develop …
git add .
git commit -m "feat: my feature description"
git push origin feat/my-feature
```

Then open a PR targeting `main`.

## Releasing

See [`RELEASING.md`](../RELEASING.md) for the full release flow.
The short version:

```bash
npm run version:set -- minor   # bumps package.json, manifest.json, landing/package.json
# update CHANGELOG.md
git commit -am "Release X.Y.Z"
git tag vX.Y.Z && git push --follow-tags
```

A GitHub Actions workflow then builds the browser zips and creates a
GitHub Release automatically.

