# Product Hunt Launch — TextAid

> Ready-to-paste copy for the Product Hunt submission.
> Best time to post: **00:01 PT** on a Tuesday or Wednesday.

---

## Name

```
TextAid
```

## Tagline (≤ 60 characters)

```
AI writing layer for every page — bring your own key
```

## Description (≤ 260 characters, shown on the card)

```
A minimalist browser extension that adds AI actions to any web page.
Select text → summarize, rewrite, translate to 16 languages, or expand.
Works with Gemini (free tier), GPT-4o, or Claude. No servers, no signup.
```

## Topics / Tags

```
Productivity
Browser Extensions
Artificial Intelligence
Writing
Open Source
```

---

## Maker's First Comment (post this yourself as soon as the page goes live)

```
Hey Product Hunt! 👋

I built TextAid because I got tired of copy-pasting between web pages and
ChatGPT. The idea: keep a writing AI one click (or one keystroke) away on
every page, with zero lock-in.

Here's what makes it different:

🔑 Bring your own key — TextAid talks directly to OpenAI, Gemini, or
   Anthropic Claude from your browser. No TextAid server, no proxy, no
   account required. Gemini has a generous free tier, so it's effectively
   free to start.

⌨️  Works anywhere — floating toolbar on any selection, three keyboard
   shortcuts (Alt+Shift+S to summarize, Alt+Shift+R to rewrite,
   Alt+Shift+T to translate), and a right-click context menu.

🌐 16 languages — the Translate submenu covers EN, FR, ES, DE, IT, PT,
   NL, PL, RU, UK, TR, AR, ZH, JA, KO, HI out of the box.

👻 Ghost completions — an optional inline suggestion mode shows an AI
   completion below any text field as you type. Press Tab to accept.

🔒 Privacy first — your API key and history live only in your browser.
   No telemetry, no analytics, no ads. 100% open source (MIT).

Available on Firefox AMO and Edge Add-ons today. Chrome Web Store
submission in progress.

Would love your feedback — what actions should I add next? 🙏
```

---

## Gallery image captions (match screenshots from SCREENSHOT_GUIDE.md)

| # | File | Caption |
|---|------|---------|
| 1 | `01-toolbar.png` | The floating TextAid toolbar appears whenever you select text — no popup needed. |
| 2 | `02-summarize-result.png` | Clean bullet-point summaries rendered in the result modal, with Copy / Replace / Insert actions. |
| 3 | `03-translate-submenu.png` | Translate to 16 languages from a single submenu — no settings page required. |
| 4 | `04-popup-settings.png` | Choose your AI provider (Gemini, OpenAI, Claude) and model in the compact popup. Free/Paid badges keep costs transparent. |
| 5 | `05-context-menu.png` | Right-click on any selection for the full TextAid submenu — no keyboard shortcut needed. |

---

## Launch day checklist

- [ ] Post at **00:01 PT** (08:01 UTC) for maximum voting window
- [ ] Add all 5 gallery images
- [ ] Post maker's first comment immediately after publishing
- [ ] Cross-post to:
  - [ ] **HackerNews** — [Show HN: TextAid – AI writing layer for any web page (open source)](https://news.ycombinator.com/submit)
  - [ ] **Reddit r/productivity** — "I built a browser extension that adds AI writing actions to every page (no account needed)"
  - [ ] **Reddit r/ChatGPT** — same post, angle on "use ChatGPT/Claude on any page without leaving the tab"
  - [ ] **Reddit r/selfhosted** (angle: bring-your-own-key, no servers)
  - [ ] **Twitter/X** — tag @ProductHunt in the post
- [ ] Reply to every comment on launch day
- [ ] Add the PH badge to the landing page after launch:
  ```html
  <a href="https://www.producthunt.com/posts/textaid" target="_blank">
    <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=XXXX&theme=dark"
         alt="TextAid on Product Hunt" width="250" height="54" />
  </a>
  ```
  Replace `XXXX` with the real post ID from the PH URL.

---

## Post-launch: add PH badge to landing

Once the PH post is live, add the badge to
`landing/src/components/sections/navbar.tsx` or the footer.
The badge URL pattern is:
```
https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=<ID>&theme=dark
```
