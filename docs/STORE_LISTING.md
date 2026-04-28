# Store listing copy

Ready-to-paste assets for submitting **TextAid** to the Chrome Web Store,
Microsoft Edge Add-ons, and Mozilla Add-ons (AMO).

> Privacy policy URL to use everywhere:
> <https://github.com/kenny516/TextAid/blob/main/PRIVACY.md>
>
> Homepage URL: <https://github.com/kenny516/TextAid>
> Support URL: <https://github.com/kenny516/TextAid/issues>
> License: MIT

---

## 1. Names & taglines

- **Name**: `TextAid`
- **Short tagline (≤ 45 chars)**: `AI writing layer for any web page`
- **One-liner (≤ 132 chars)**: `Summarize, rewrite, translate and expand any text on any page — using your own OpenAI or Gemini key. No servers.`

---

## 2. Short description (≤ 200 chars — Edge requires this)

```
TextAid adds a minimalist AI toolbar to every page. Select text, then
summarize, rewrite, translate to 16 languages, or expand it — using
your own OpenAI or Gemini key. Local-first, no servers.
```

## 3. Long description (Chrome Web Store, Edge, AMO)

```
TextAid is a minimalist AI writing layer for the web.

Select any text on any page, and TextAid lets you instantly:

  • Summarize  — clean bullet-point summaries
  • Rewrite    — professional, casual, creative or concise tone
  • Translate  — to 16 languages (EN, FR, ES, DE, IT, PT, NL, PL, RU,
                 UK, TR, AR, ZH, JA, KO, HI)
  • Expand     — turn a sentence into a paragraph

Three direct keyboard shortcuts:
  • Alt+Shift+S → Summarize selection
  • Alt+Shift+R → Rewrite selection
  • Alt+Shift+T → Translate selection
  • Ctrl+Shift+Y (Cmd+Shift+Y) → open the toolbar on the current selection

— Bring your own AI —
TextAid talks directly to OpenAI or Google Gemini from your browser,
using your own API key. There is no TextAid server, no proxy, no
account, no signup. Gemini has a generous free tier; OpenAI is
pay-per-use.

Supported models (April 2026):
  • Gemini 2.5 Flash / Flash-Lite / Pro, Gemini 3 Flash / Pro
  • GPT-4o-mini, GPT-4o, GPT-4.1 (nano/mini/full), GPT-5 (mini/full)

— Privacy by design —
  • Your API key is stored only in your browser's encrypted storage
  • Text is sent to the provider only when you explicitly trigger an action
  • Password fields are skipped automatically
  • No analytics, no telemetry, no tracking, no ads
  • 100 % open source: https://github.com/kenny516/TextAid

— Other niceties —
  • Markdown rendering (bold, lists, code, headings, links) in results
  • Rich error messages with actionable hints when a model is rate-limited
    or your quota is exhausted
  • Works on Chrome, Edge, Brave, Opera, Arc, Vivaldi, Firefox, Zen,
    LibreWolf, and Safari (via the macOS wrapper)

Privacy policy: https://github.com/kenny516/TextAid/blob/main/PRIVACY.md
```

---

## 4. Categories

| Store | Primary | Secondary |
| --- | --- | --- |
| Chrome Web Store | Productivity | Developer Tools |
| Edge Add-ons     | Productivity | Communication |
| Firefox AMO      | Other        | _(no secondary)_ — keywords: productivity, ai, writing |

---

## 5. Permissions justifications (copy/paste per permission)

These are the answers to give in the dashboard "Privacy practices" / "Why
do you need this permission?" sections. Both Chrome and Edge will reject
vague answers ("required for the extension to work"). Be specific.

### `activeTab`
> Used to read the text the user has actively selected on the current
> tab when they trigger a TextAid action (toolbar button, context-menu
> item, or keyboard shortcut). The selection is sent to the AI provider
> the user configured, and is not persisted by the extension.

### `scripting`
> Used to inject the floating TextAid toolbar and the result modal into
> the active tab when the user makes a text selection. No code is fetched
> from a remote source; the injected scripts are part of the signed
> extension package.

### `contextMenus`
> Used to add the "TextAid → Summarize / Rewrite / Translate / Expand"
> entries to the right-click menu when text is selected, so the user can
> trigger an AI action without opening the popup.

### `storage`
> Used to persist the user's API key and preferences (chosen provider,
> model, writing style, suggestion frequency, target translation language)
> in `chrome.storage.local`. Nothing is synced to a remote server.

### `host_permissions: <all_urls>`
> TextAid is designed to work on any page where the user selects text
> (docs, email, social media, internal tools, etc.). The permission is
> used exclusively to (a) inject the toolbar UI on the page the user is
> reading and (b) read the user's active text selection. The extension
> does not scan, scrape, pre-fetch, or otherwise touch pages without an
> explicit user gesture, and it makes no outbound requests to third
> parties from the host context — only to the AI provider's API
> (`api.openai.com` / `generativelanguage.googleapis.com`) that the user
> configured with their own key.

### Remote code use (Chrome Web Store / Edge)
> **No remote code is executed.** The extension does not load scripts
> from a remote URL, does not use `eval()`, and ships all of its logic
> inside the packaged build.

### Data usage disclosures (Chrome Web Store)

Tick **only** these boxes; leave everything else unticked:

- ☑ "Personally identifiable information" → only the **API key** the user
  provides, stored locally, used to authenticate the user's own
  requests to OpenAI / Google.
- ☑ "User activity" → only the **text the user explicitly selects** when
  triggering an action, sent to the user's chosen AI provider.

Then certify all three boxes:
- ☑ I do not sell or transfer user data to third parties, outside of the
  approved use cases.
- ☑ I do not use or transfer user data for purposes that are unrelated
  to my item's single purpose.
- ☑ I do not use or transfer user data to determine creditworthiness
  or for lending purposes.

### Single purpose statement (Chrome Web Store)

```
TextAid lets the user run AI writing actions (summarize, rewrite,
translate, expand) on text they select on any web page, using their own
OpenAI or Gemini API key.
```

---

## 6. Asset checklist

| Asset | Spec | Status |
| --- | --- | --- |
| Extension ZIPs | `dist/textaid-chrome-1.2.0.zip`, `dist/textaid-firefox-1.2.0.zip` | ✅ produced by `npm run build` |
| Privacy policy URL | Public HTTPS URL | ✅ `PRIVACY.md` on `main` branch |
| Icon 128×128 | PNG | ✅ `icons/icon-textaid.png` |
| Icon 300×300 (Edge logo) | PNG, transparent background recommended | ⚠️ to upscale from `icons/icon-textaid.png` |
| Small promo tile (Chrome) | 440×280 PNG | ⚠️ to design |
| Marquee tile (Chrome, optional) | 1400×560 PNG | ⚠️ to design |
| Screenshots Chrome / Edge | 1280×800 or 640×400 PNG, 1–5 images | ⚠️ to capture |
| Screenshots AMO | 2400×1800 max, at least 1 | ⚠️ to capture |

Suggested screenshots to take (in order):

1. Floating toolbar appearing over a paragraph the user just selected.
2. Summarize result modal with bullet points.
3. Translate-to submenu with the 16 languages visible.
4. Settings popup showing the provider/model dropdown with Free/Paid badges.
5. Context-menu entry "TextAid → Rewrite".

---

## 7. Submission order (recommended)

1. **Firefox AMO** — fastest auto-review, gets you a real public listing
   URL within minutes that the other stores will sometimes ask for as a
   "where else is this published" reference.
2. **Microsoft Edge Add-ons** — free, 1–7 day review.
3. **Chrome Web Store** — $5 one-time fee, 1–3 day review.

---

## 8. Reviewer notes (paste in the "Notes for reviewer" field)

```
TextAid is a fully client-side extension. It does not have a backend.

To test:
  1. Install the extension.
  2. Open the popup and paste a Google AI Studio Gemini API key
     (free, https://aistudio.google.com/app/apikey).
     Alternatively an OpenAI key starting with sk-... will also work.
  3. On any page (e.g. https://en.wikipedia.org), select a paragraph,
     then either:
       - press Alt+Shift+S to summarize, or
       - right-click → TextAid → Summarize.
  4. A result modal will appear with the AI-generated summary.

All network traffic goes directly from the browser to either
api.openai.com or generativelanguage.googleapis.com. The extension makes
no requests to any other host. No remote code is loaded at runtime.

Source code: https://github.com/kenny516/TextAid
Privacy policy: https://github.com/kenny516/TextAid/blob/main/PRIVACY.md
```
