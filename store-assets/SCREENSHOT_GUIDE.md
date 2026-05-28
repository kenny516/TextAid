# Screenshot Capture Guide

This guide walks you through capturing the 5 recommended store screenshots
for the Chrome Web Store, Edge Add-ons, and Firefox AMO submissions.

## Setup

1. Build and load the extension:
   ```bash
   npm run build
   # Chrome: chrome://extensions → Load unpacked → dist/chrome/
   # Firefox: about:debugging → Load Temporary Add-on → dist/firefox/manifest.json
   ```
2. Open the extension popup and configure a test API key (Gemini free tier
   recommended — get one at https://aistudio.google.com/app/apikey).
3. Use **1280×800** browser window for Chrome/Edge screenshots.
   Firefox AMO accepts up to **2400×1800**.

---

## Screenshot 1 — Floating toolbar on selected text

**File name:** `01-toolbar.png`

1. Navigate to https://en.wikipedia.org/wiki/Artificial_intelligence
2. Select a paragraph (e.g. the opening paragraph).
3. The TextAid floating toolbar should appear above the selection.
4. Press **F12** → Device mode (or **Ctrl+Shift+M**), set dimensions to 1280×800.
5. Screenshot: **Ctrl+Shift+P → "Capture screenshot"** (full-size or visible area).

**What to show:** the toolbar with icons (Summarize, Rewrite, Translate, Expand)
floating neatly over highlighted text.

---

## Screenshot 2 — Summarize result modal

**File name:** `02-summarize-result.png`

1. On the same Wikipedia page, select a paragraph.
2. Click **Summarize** in the toolbar (or press **Alt+Shift+S**).
3. Wait for the AI result to stream in.
4. Take the screenshot once the result modal is fully populated with bullet points.

**What to show:** the dark modal with a clean bullet-point summary, the
"Copy", "Replace", "Insert below" action buttons visible at the bottom.

---

## Screenshot 3 — Translate-to submenu

**File name:** `03-translate-submenu.png`

1. Select any text on a page.
2. Click the toolbar's **More (⋯)** button to open the dropdown.
3. Hover over **Translate to…** to reveal the 16-language submenu.
4. Screenshot while the submenu is visible.

**What to show:** the full language list (EN, FR, ES, DE, IT, PT, NL, PL,
RU, UK, TR, AR, ZH, JA, KO, HI) scrollable in the submenu panel.

---

## Screenshot 4 — Settings popup

**File name:** `04-popup-settings.png`

1. Click the TextAid extension icon in the browser toolbar to open the popup.
2. Make sure the **Gemini** provider is selected so the Free/Paid badges are visible.
3. Open the model dropdown to show all model options with Free/Paid badges.
4. Screenshot the popup (popup is 360 px wide — use DevTools to position it).

**What to show:** the dark popup with the three-provider selector, the model
dropdown showing the Free/Paid badges, and the API key status dot.

---

## Screenshot 5 — Context-menu entry

**File name:** `05-context-menu.png`

1. Select a paragraph on any page.
2. Right-click to open the browser context menu.
3. Hover over **TextAid** to reveal the submenu (Summarize, Rewrite, Translate, Expand).
4. Screenshot while the submenu is visible.

**What to show:** the native browser right-click menu with the
"TextAid ▶" entry and its sub-actions visible.

---

## File locations

Place all captured screenshots in:

```
store-assets/
├── 01-toolbar.png
├── 02-summarize-result.png
├── 03-translate-submenu.png
├── 04-popup-settings.png
└── 05-context-menu.png
```

## Upload targets

| Store | Spec | Min | Max |
|-------|------|-----|-----|
| Chrome Web Store | 1280×800 or 640×400 PNG | 1 | 5 |
| Edge Add-ons | 1366×768 PNG | 1 | 10 |
| Firefox AMO | any, max 2400×1800 | 1 | unlimited |
