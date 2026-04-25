# Supported browsers

TextAid is a Manifest V3 web extension. From a single source tree, `npm run build`
produces ready-to-publish packages for every major browser family.

| Browser   | Engine    | Package          | Store                          | Status |
| --------- | --------- | ---------------- | ------------------------------ | ------ |
| Chrome    | Chromium  | `chrome` build   | Chrome Web Store               | ✅     |
| Brave     | Chromium  | `chrome` build   | Chrome Web Store (auto)        | ✅     |
| Edge      | Chromium  | `chrome` build   | Edge Add-ons (or CWS auto)     | ✅     |
| Opera     | Chromium  | `chrome` build   | Opera Add-ons / CWS            | ✅     |
| Arc       | Chromium  | `chrome` build   | Chrome Web Store (auto)        | ✅     |
| Vivaldi   | Chromium  | `chrome` build   | Chrome Web Store (auto)        | ✅     |
| Firefox   | Gecko     | `firefox` build  | addons.mozilla.org (AMO)       | ✅     |
| Zen       | Gecko     | `firefox` build  | AMO (auto)                     | ✅     |
| LibreWolf | Gecko     | `firefox` build  | AMO (auto)                     | ✅     |
| Safari    | WebKit    | Xcode wrapper    | Mac App Store                  | ⚙️ Mac required |

## Building

```bash
npm install        # one-time
npm run build      # builds all targets → dist/
```

Outputs:

```
dist/
├── chrome/                      ← unpacked, ready to "Load unpacked"
├── firefox/                     ← unpacked, ready to "Load Temporary Add-on"
├── textaid-chrome-1.1.0.zip     ← upload to Chrome Web Store
└── textaid-firefox-1.1.0.zip    ← upload to AMO
```

Single target:

```bash
npm run build:chrome
npm run build:firefox
```

## Local install (development)

### Chromium (Chrome, Brave, Edge, Opera, Arc, Vivaldi)

1. Open `chrome://extensions/` (or `brave://extensions/`, `edge://extensions/`, etc.)
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** → select `dist/chrome/`

### Firefox / Zen / LibreWolf

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select `dist/firefox/manifest.json`

> Temporary add-ons disappear on browser restart. For permanent local install,
> sign the build at AMO (free) → produces an `.xpi` you can install permanently.

### Safari (macOS only)

Safari requires native wrapping via Xcode:

```bash
# On macOS with Xcode installed:
npm run build:chrome
xcrun safari-web-extension-converter dist/chrome \
  --project-location ./safari-app \
  --bundle-identifier dev.kenny516.textaid \
  --app-name "TextAid"
```

Then open the generated Xcode project, sign with your Apple Developer account,
and run. For App Store distribution you need a paid Apple Developer
membership ($99/yr).

Note: a few APIs differ on Safari (no `chrome.commands` global shortcut on iOS,
limited `host_permissions` UX). The core toolbar, popup, summarize/rewrite, and
streaming work.

## Publishing

| Store              | URL                                     | Cost           | Review time |
| ------------------ | --------------------------------------- | -------------- | ----------- |
| Chrome Web Store   | https://chrome.google.com/webstore/devconsole | $5 one-time    | 1–3 days   |
| Edge Add-ons       | https://partner.microsoft.com/dashboard/microsoftedge | Free | 1–7 days |
| Firefox AMO        | https://addons.mozilla.org/developers   | Free           | < 24 h (auto) |
| Opera Add-ons      | https://addons.opera.com/developer      | Free           | 1–2 weeks  |
| Mac App Store      | https://developer.apple.com             | $99/yr         | 1–3 days   |

Brave, Arc, Vivaldi, Zen, LibreWolf all install directly from CWS / AMO — no
separate submission needed.

## Cross-browser code notes

The codebase uses the `chrome.*` namespace throughout. Firefox 115+ aliases
`chrome.*` to `browser.*` so no polyfill is needed. If you add APIs that diverge
(e.g., `chrome.declarativeNetRequest` vs `browser.declarativeNetRequest` quirks),
add a thin wrapper in `background.js`.
