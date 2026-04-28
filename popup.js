// TextAid popup
const ICONS = {
  "chevron-down":
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  copy:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
  "alert-circle":
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
  "loader-2":
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
  command:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>',
  "external-link":
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
};

function icon(name) {
  return ICONS[name] || "";
}

const MODELS = {
  gemini: [
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", tier: "free", tag: "Recommended" },
    { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite", tier: "free", tag: "Cheapest" },
    { id: "gemini-3-flash", label: "Gemini 3 Flash", tier: "free", tag: "Latest" },
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", tier: "paid" },
    { id: "gemini-3-pro", label: "Gemini 3 Pro", tier: "paid", tag: "Premium" },
    { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash", tier: "free", tag: "Legacy" },
    { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro", tier: "paid", tag: "Legacy" },
  ],
  openai: [
    { id: "gpt-4o-mini", label: "GPT-4o mini", tier: "paid", tag: "Recommended" },
    { id: "gpt-4.1-nano", label: "GPT-4.1 nano", tier: "paid", tag: "Cheapest" },
    { id: "gpt-4.1-mini", label: "GPT-4.1 mini", tier: "paid" },
    { id: "gpt-5-mini", label: "GPT-5 mini", tier: "paid" },
    { id: "gpt-4o", label: "GPT-4o", tier: "paid" },
    { id: "gpt-4.1", label: "GPT-4.1", tier: "paid" },
    { id: "gpt-5", label: "GPT-5", tier: "paid", tag: "Premium" },
  ],
};

const KEY_PATTERNS = {
  openai: /^sk-/,
  gemini: /^AIza/,
};

const KEY_PLACEHOLDERS = {
  openai: "sk-...",
  gemini: "AIza...",
};

const TONE_OPTIONS = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "concise", label: "Concise" },
  { id: "creative", label: "Creative" },
];

class CustomSelect {
  constructor(root, options, value, onChange) {
    this.root = root;
    this.options = options;
    this.value = value;
    this.onChange = onChange;
    this.open = false;
    this.render();
    this.bindOutside();
  }

  render() {
    const current = this.options.find((o) => o.id === this.value) || this.options[0];
    this.value = current.id;
    this.root.innerHTML = `
      <button type="button" class="ta-cs-trigger" aria-haspopup="listbox" aria-expanded="false">
        <span class="ta-cs-label">${current.label}</span>
        <span class="ta-cs-chev" aria-hidden="true">${ICONS["chevron-down"]}</span>
      </button>
      <ul class="ta-cs-menu" role="listbox" hidden></ul>
    `;
    this.trigger = this.root.querySelector(".ta-cs-trigger");
    this.menu = this.root.querySelector(".ta-cs-menu");
    this.label = this.root.querySelector(".ta-cs-label");
    this.trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });
    this.renderMenu();
  }

  renderMenu() {
    this.menu.innerHTML = "";
    this.options.forEach((opt) => {
      const li = document.createElement("li");
      li.className = "ta-cs-item" + (opt.id === this.value ? " is-selected" : "");
      li.role = "option";
      li.dataset.value = opt.id;
      const tierBadge = opt.tier
        ? `<span class="ta-cs-tier ta-cs-tier--${opt.tier}">${opt.tier === "free" ? "Free" : "Paid"}</span>`
        : "";
      const tagBadge = opt.tag ? `<span class="ta-cs-tag">${opt.tag}</span>` : "";
      const check = opt.id === this.value ? `<span class="ta-cs-check">${ICONS["check"]}</span>` : "";
      li.innerHTML = `
        <span class="ta-cs-item-label">${opt.label}</span>
        <span class="ta-cs-item-meta">${tagBadge}${tierBadge}${check}</span>
      `;
      li.addEventListener("click", (e) => {
        e.stopPropagation();
        this.set(opt.id);
        this.close();
      });
      this.menu.appendChild(li);
    });
  }

  setOptions(options, value) {
    this.options = options;
    if (value !== undefined) this.value = value;
    this.label.textContent = (this.options.find((o) => o.id === this.value) || this.options[0])?.label || "";
    if (!this.options.find((o) => o.id === this.value)) this.value = this.options[0]?.id;
    this.renderMenu();
  }

  set(id) {
    if (this.value === id) return;
    this.value = id;
    this.label.textContent = this.options.find((o) => o.id === id)?.label || id;
    this.renderMenu();
    this.onChange?.(id);
  }

  toggle() { this.open ? this.close() : this.show(); }

  show() {
    this.open = true;
    this.menu.hidden = false;
    this.trigger.setAttribute("aria-expanded", "true");
    this.root.classList.add("is-open");
  }

  close() {
    this.open = false;
    this.menu.hidden = true;
    this.trigger.setAttribute("aria-expanded", "false");
    this.root.classList.remove("is-open");
  }

  bindOutside() {
    document.addEventListener("click", (e) => {
      if (this.open && !this.root.contains(e.target)) this.close();
    });
    document.addEventListener("keydown", (e) => {
      if (this.open && e.key === "Escape") this.close();
    });
  }
}

class Popup {
  constructor() {
    this.provider = "gemini";
    this.bind();
  }

  $(id) {
    return document.getElementById(id);
  }

  bind() {
    document.addEventListener("DOMContentLoaded", () => this.init());
  }

  init() {
    this.injectIcons();
    this.renderShortcut();
    this.attachEvents();
    this.load();
    this.refreshHistory();
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes["textaid:history"]) {
        this.refreshHistory();
      }
    });
  }

  injectIcons() {
    this.$("iconExternal").innerHTML = icon("external-link");
  }

  renderShortcut() {
    const el = this.$("shortcutHint");
    if (!el) return;
    if (chrome && chrome.commands && chrome.commands.getAll) {
      chrome.commands.getAll((cmds) => {
        const open = (cmds || []).find((c) => c.name === "open-toolbar");
        const sc = open && open.shortcut ? open.shortcut : "";
        if (sc) {
          el.textContent = sc.replace(/\+/g, " ");
        } else {
          const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
          el.textContent = isMac ? "⇧ ⌘ Y" : "Ctrl Shift Y";
        }
      });
    } else {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      el.textContent = isMac ? "⇧ ⌘ Y" : "Ctrl Shift Y";
    }
  }

  attachEvents() {
    document.querySelectorAll(".ta-seg").forEach((btn) => {
      btn.addEventListener("click", () => this.selectProvider(btn.dataset.provider));
    });
    this.$("apiKey").addEventListener("input", () => this.validateKey());
    this.$("testKey").addEventListener("click", () => this.testKey());
    this.$("saveSettings").addEventListener("click", () => this.save());
    this.modelSelect = new CustomSelect(this.$("modelSelect"), MODELS[this.provider], MODELS[this.provider][0].id);
    this.toneSelect = new CustomSelect(this.$("toneSelect"), TONE_OPTIONS, "professional");
  }

  selectProvider(provider) {
    this.provider = provider;
    document.querySelector(".ta-segmented").dataset.active = provider;
    document.querySelectorAll(".ta-seg").forEach((b) => {
      b.setAttribute("aria-selected", String(b.dataset.provider === provider));
    });
    this.$("apiKey").placeholder = KEY_PLACEHOLDERS[provider];
    this.populateModels(provider);
    this.validateKey();
  }

  populateModels(provider, selected) {
    if (!this.modelSelect) return;
    const opts = MODELS[provider];
    const value = selected && opts.find((o) => o.id === selected) ? selected : opts[0].id;
    this.modelSelect.setOptions(opts, value);
  }

  validateKey() {
    const key = this.$("apiKey").value.trim();
    if (!key) {
      this.setStatus("idle", "Idle");
      return false;
    }
    const pat = KEY_PATTERNS[this.provider];
    if (pat && !pat.test(key)) {
      this.setStatus("err", "Invalid key format");
      return false;
    }
    this.setStatus("idle", "Ready to test");
    return true;
  }

  setStatus(kind, text, errorDetail) {
    const dot = this.$("statusDot");
    dot.className = "ta-dot ta-dot--" + kind;
    this.$("statusText").textContent = text;
    const err = this.$("statusError");
    if (errorDetail) {
      err.textContent = errorDetail;
      err.hidden = false;
    } else {
      err.textContent = "";
      err.hidden = true;
    }
  }

  async testKey() {
    const key = this.$("apiKey").value.trim();
    if (!key) {
      this.setStatus("err", "Enter a key first");
      return;
    }
    if (!this.validateKey()) return;
    const btn = this.$("testKey");
    btn.disabled = true;
    btn.textContent = "Testing…";
    this.setStatus("loading", "Testing…");
    try {
      const res = await chrome.runtime.sendMessage({
        action: "testApiKey",
        provider: this.provider,
        apiKey: key,
        model: this.modelSelect.value,
      });
      if (res && res.ok) {
        this.setStatus("ok", "Connected");
      } else {
        const msg = (res && res.error) || "Unknown error — service worker may be inactive";
        this.setStatus("err", "Connection failed", msg);
      }
    } catch (e) {
      this.setStatus("err", "Connection failed", e.message || String(e));
    } finally {
      btn.disabled = false;
      btn.textContent = "Test";
    }
  }

  load() {
    chrome.storage.sync.get(
      [
        "aiProvider",
        "apiKey",
        "model",
        "suggestionStyle",
        "enableFloatingToolbar",
        "enableContextMenu",
        "enableSuggestions",
      ],
      (r) => {
        const provider = r.aiProvider || "gemini";
        this.selectProvider(provider);
        if (r.model) this.populateModels(provider, r.model);
        if (r.apiKey) this.$("apiKey").value = r.apiKey;
        this.toneSelect.set(r.suggestionStyle || "professional");
        this.$("enableFloatingToolbar").checked = r.enableFloatingToolbar !== false;
        this.$("enableContextMenu").checked = r.enableContextMenu !== false;
        this.$("enableSuggestions").checked = r.enableSuggestions === true;
        this.validateKey();
      }
    );
  }

  save() {
    const settings = {
      aiProvider: this.provider,
      apiKey: this.$("apiKey").value.trim(),
      model: this.modelSelect.value,
      suggestionStyle: this.toneSelect.value,
      enableFloatingToolbar: this.$("enableFloatingToolbar").checked,
      enableContextMenu: this.$("enableContextMenu").checked,
      enableSuggestions: this.$("enableSuggestions").checked,
    };
    const btn = this.$("saveSettings");
    chrome.storage.sync.set(settings, () => {
      chrome.runtime.sendMessage({ action: "updateSettings", settings });
      btn.innerHTML = icon("check") + '<span class="ta-btn-label">Saved</span>';
      setTimeout(() => {
        btn.innerHTML = '<span class="ta-btn-label">Save</span>';
      }, 1400);
    });
  }

  refreshHistory() {
    chrome.storage.local.get(["textaid:history"], (r) => {
      const items = (r["textaid:history"] || []).slice(0, 5);
      const list = this.$("historyList");
      list.innerHTML = "";
      if (!items.length) {
        const empty = document.createElement("li");
        empty.className = "ta-history-empty";
        empty.textContent = "Nothing yet — select text on any page to get started.";
        list.appendChild(empty);
        return;
      }
      items.forEach((item) => {
        const row = document.createElement("li");
        row.className = "ta-history-row";

        const tag = document.createElement("span");
        tag.className = "ta-history-tag";
        tag.textContent = item.action || "result";

        const snippet = document.createElement("span");
        snippet.className = "ta-history-snippet";
        snippet.textContent = item.snippet || "";

        const copy = document.createElement("button");
        copy.className = "ta-history-copy";
        copy.title = "Copy result";
        copy.innerHTML = icon("copy");
        copy.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(item.fullText || "");
            copy.innerHTML = icon("check");
            setTimeout(() => (copy.innerHTML = icon("copy")), 1000);
          } catch (e) {
            console.error("Copy failed", e);
          }
        });

        row.appendChild(tag);
        row.appendChild(snippet);
        row.appendChild(copy);
        list.appendChild(row);
      });
    });
  }
}

new Popup();
