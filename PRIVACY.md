# TextAid Privacy Policy

_Last updated: 2026-04-28_

TextAid is a browser extension that helps you summarize, rewrite, translate
and expand text on any web page using an AI provider of your choice
(OpenAI or Google Gemini).

This document describes **what data TextAid handles, where it goes, and
what it never does**. It applies to every distribution channel — Chrome
Web Store, Microsoft Edge Add-ons, Mozilla Add-ons (AMO), Opera Add-ons,
and any sideloaded build from this repository.

---

## TL;DR

- **We have no servers.** TextAid talks directly to your chosen AI provider
  (OpenAI or Google) from your browser, using your own API key.
- **We never see your text, your keys, or your usage.**
- **No analytics, no telemetry, no tracking, no ads.**
- All settings (including your API key) are stored locally in the
  browser's encrypted extension storage.
- The source code is open and auditable at
  <https://github.com/kenny516/TextAid>.

---

## 1. Data the extension handles

### 1.1 Data you provide

| Data | Where it is stored | Where it is sent |
| --- | --- | --- |
| OpenAI / Gemini API key | `chrome.storage.local` (encrypted by the browser) | Only to the corresponding provider's API endpoint, attached as an `Authorization` / query-string credential, when you trigger an action. |
| Your preferences (model, writing style, language, suggestion frequency, enabled features) | `chrome.storage.local` | Never sent anywhere. |
| Selected text or text typed in a field, **at the moment you trigger an action** (toolbar button, keyboard shortcut, or context-menu item) | Not persisted. Held in memory only for the duration of the request. | Sent to the provider you configured (OpenAI `api.openai.com` or Google `generativelanguage.googleapis.com`) as the prompt body. |

### 1.2 Data the extension does **not** collect

- No browsing history, URLs, page contents, form contents, cookies,
  or DOM snapshots are read or transmitted, except the specific text you
  explicitly select or type in a field where you trigger a suggestion.
- Password fields and inputs flagged as sensitive (`type="password"`,
  `autocomplete="new-password"`, etc.) are excluded from auto-suggestions
  by design.
- No background scraping. The extension is purely reactive — it acts only
  in response to a user gesture (selection, click, shortcut, context menu).
- No analytics SDK, no error reporting service, no remote config, no
  remote code execution.

### 1.3 Where your text actually goes

When you trigger an AI action, the selected text and a short instruction
prompt are sent **directly from your browser** to:

- **OpenAI**: `https://api.openai.com` — see the
  [OpenAI privacy policy](https://openai.com/policies/privacy-policy)
  and [API data usage policy](https://openai.com/policies/api-data-usage-policies).
- **Google Gemini**: `https://generativelanguage.googleapis.com` — see the
  [Google AI / Gemini API additional terms](https://ai.google.dev/terms).

TextAid does not proxy, log, mirror, or otherwise observe these requests.
The `host_permissions: ["<all_urls>"]` declared in the manifest is used
exclusively to (a) inject the floating toolbar and result modal on the
page you are reading, and (b) read the text you have actively selected or
typed. It is **not** used to make outbound network requests to third
parties.

---

## 2. Permissions justification

| Permission | Purpose |
| --- | --- |
| `activeTab` | Read the user's current text selection when an action is triggered. |
| `scripting` | Inject the toolbar / result modal UI into the active tab on demand. |
| `contextMenus` | Add the "TextAid → Summarize / Rewrite / Translate / Expand" right-click entries. |
| `storage` | Persist your API key and preferences locally. |
| `host_permissions: <all_urls>` | The extension is meant to work on **any** page where you select text. It does not pre-fetch or scan pages. |

---

## 3. Data sharing and sale

We do not sell, rent, lease, share, or transmit user data to any third
party for any purpose, because we do not collect any user data in the
first place.

The only third parties that ever receive your data are the AI providers
**you** configured with **your own** API key, and only with the text **you**
explicitly submitted.

---

## 4. Data retention and deletion

- Settings and the API key live in your browser's local extension
  storage. Uninstalling the extension removes them.
- You can wipe everything at any time from the popup ("Clear settings")
  or from your browser's extension management UI.
- TextAid itself retains nothing because TextAid has no servers.

---

## 5. Children

TextAid is a developer tool aimed at general adult audiences. It is not
directed at children under 13 (or under 16 in the EEA / UK).

---

## 6. Security

- API keys are stored using the browser's standard extension storage,
  which is sandboxed per-extension and encrypted at rest by the browser.
- All outbound requests go to the official HTTPS endpoints of OpenAI and
  Google. There is no fallback to plain HTTP.
- The extension contains no remote-code-execution path: it does not
  `eval()`, does not load remote scripts, and ships every byte of its
  logic inside the signed package.

---

## 7. Open source

The full source tree, including every line that handles your data, is
public at <https://github.com/kenny516/TextAid> under the MIT license.
You can audit it, build it yourself, and verify that what is described
above matches what runs in your browser.

---

## 8. Changes to this policy

If this policy ever changes (for example, if a future version adds an
optional cloud sync feature), the change will be:

1. Committed to this file, with the date updated above.
2. Mentioned in `CHANGELOG.md`.
3. Surfaced as an in-extension notice **before** any new data flow is
   activated, with an explicit opt-in.

---

## 9. Contact

For privacy-related questions, please open an issue at
<https://github.com/kenny516/TextAid/issues> with the label `privacy`.
