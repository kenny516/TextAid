# TextAid

> A minimalist AI writing layer for any web page.
> Summarize, rewrite, translate and expand any selection — without
> leaving the tab.

TextAid is a Manifest V3 cross-browser extension. Bring your own
**OpenAI** or **Google Gemini** key; everything runs locally between
your browser and the provider you chose. No TextAid server, no proxy,
no account.

- 🛒 **Stores** — Chrome Web Store, Microsoft Edge Add-ons, Firefox AMO,
  Opera Add-ons, Mac App Store (Safari).
  See [`docs/SUPPORTED_BROWSERS.md`](docs/SUPPORTED_BROWSERS.md).
- 🔐 **Privacy** — see [`PRIVACY.md`](PRIVACY.md).
- 📜 **Changelog** — see [`CHANGELOG.md`](CHANGELOG.md).
- 🚀 **Releasing** — see [`RELEASING.md`](RELEASING.md).

## Features

- **Summarize** any selection into clean bullet points.
- **Rewrite** with four tones: professional, casual, creative, concise.
- **Translate** to 16 languages from a submenu (EN, FR, ES, DE, IT, PT,
  NL, PL, RU, UK, TR, AR, ZH, JA, KO, HI).
- **Expand** a sentence into a full paragraph.
- **Markdown rendering** in the result modal (bold, lists, code blocks,
  headings, links).
- **Rich error messages** with actionable hints when a model is
  rate-limited, out of quota or unavailable.
- **Direct keyboard shortcuts** — `Alt+Shift+S` summarize,
  `Alt+Shift+R` rewrite, `Alt+Shift+T` translate,
  `Ctrl+Shift+Y` (`Cmd+Shift+Y` on macOS) open the toolbar on the
  current selection.

## Providers and models

Choose your provider in the popup and paste your API key.

| Provider                          | Models                                                                                                                             | Cost                |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| **Google Gemini** _(recommended)_ | `gemini-2.5-flash` (default), `2.5-flash-lite`, `3-flash`, `2.5-pro`, `3-pro` (legacy `2.0-flash`, `1.5-pro` kept for back-compat) | Free tier available |
| **OpenAI**                        | `gpt-4o-mini`, `gpt-4o`, `gpt-4.1-nano/mini/full`, `gpt-5-mini`, `gpt-5`                                                           | Pay-per-use         |

Get a key:

- Gemini → <https://aistudio.google.com/app/apikey>
- OpenAI → <https://platform.openai.com/api-keys>

## Install

### From the stores

When the extension is published, install from your browser's official store:

- Chrome / Brave / Opera / Arc / Vivaldi → Chrome Web Store
- Edge → Microsoft Edge Add-ons
- Firefox / Zen / LibreWolf → addons.mozilla.org

### From source (development)

```bash
git clone https://github.com/kenny516/TextAid.git
cd TextAid
npm install
npm run build           # builds dist/chrome and dist/firefox
```

Then load the unpacked build:

- **Chromium** — `chrome://extensions` → enable Developer mode →
  _Load unpacked_ → select `dist/chrome/`.
- **Firefox** — `about:debugging#/runtime/this-firefox` →
  _Load Temporary Add-on_ → select `dist/firefox/manifest.json`.

Watch mode for development:

```bash
npm run dev:chrome      # rebuild dist/chrome on change
npm run dev:firefox
```

## Project layout

```
TextAid/
├── manifest.json          # MV3 manifest (canonical, used by Chrome)
├── background.js          # service worker / event page
├── content.js             # page-injected toolbar + result modal
├── content.css
├── popup.html / popup.css / popup.js
├── icons/
├── lib/                   # shared helpers (markdown, errors, ...)
├── scripts/
│   ├── build.mjs          # cross-browser build → dist/
│   ├── watch.mjs
│   └── version.mjs        # bump version across all manifests
├── landing/               # marketing site (Vite + React)
├── docs/
│   ├── SUPPORTED_BROWSERS.md
│   ├── STORE_LISTING.md   # ready-to-paste store copy
│   └── development.md
├── PRIVACY.md
├── CHANGELOG.md
├── RELEASING.md
└── README.md
```

## Releasing

See [`RELEASING.md`](RELEASING.md). In short:

```bash
npm run version:set -- minor    # 1.2.0 → 1.3.0
# update CHANGELOG.md
git commit -am "Release 1.3.0" && git tag v1.3.0
git push --follow-tags
```

The `release` workflow then builds and publishes
`dist/textaid-chrome-X.Y.Z.zip` and `dist/textaid-firefox-X.Y.Z.zip` as
GitHub Release assets.

To submit those artifacts to the Chrome Web Store, Edge Add-ons and
Firefox AMO, follow [`docs/STORE_LISTING.md`](docs/STORE_LISTING.md) —
it contains the descriptions, permission justifications and asset
checklist already written.

## Privacy

TextAid does not collect, store or transmit any user data to TextAid
itself. Your API key and preferences live in the browser's local
extension storage, and your selected text is sent **only** to the AI
provider you configured, **only** when you explicitly trigger an action.
Full details in [`PRIVACY.md`](PRIVACY.md).

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/<name>`).
3. Run `npm run dev:chrome` (or `:firefox`) and test the unpacked build.
4. Update `CHANGELOG.md` under `## [Unreleased]`.
5. Open a PR with a descriptive title.

## License

MIT — see [`LICENSE`](LICENSE).

## Star history

<a href="https://star-history.com/#kenny516/TextAid&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=kenny516/TextAid&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=kenny516/TextAid&type=Date" />
    <img alt="Star history of kenny516/TextAid" src="https://api.star-history.com/svg?repos=kenny516/TextAid&type=Date" />
  </picture>
</a>
