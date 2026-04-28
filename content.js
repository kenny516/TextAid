// TextAid content script
const TA_ICONS = {
  "align-justify":
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  "pen-line":
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  lightbulb:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
  expand:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 21H3"/><path d="M21 3H3"/><path d="M9 8l-3 4 3 4"/><path d="M15 8l3 4-3 4"/></svg>',
  replace:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4c0-1.1.9-2 2-2"/><path d="M20 2c1.1 0 2 .9 2 2"/><path d="M22 8c0 1.1-.9 2-2 2"/><path d="M16 10c-1.1 0-2-.9-2-2"/><path d="m3 7 3 3 3-3"/><path d="M6 10V5a3 3 0 0 1 3-3h1"/><rect width="8" height="8" x="2" y="14" rx="2"/></svg>',
  "more-horizontal":
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
  x:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  copy:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  "alert-circle":
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
  "arrow-down":
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>',
};

const TA_ACTION_LABELS = {
  summarize: "SUMMARIZE",
  rephrase: "REWRITE",
  ideas: "IDEAS",
  expand: "EXPAND",
  custom: "CUSTOM",
  translate: "TRANSLATE",
  grammar: "GRAMMAR",
  formal: "FORMAL",
  casual: "CASUAL",
};

function tIcon(name) {
  return TA_ICONS[name] || "";
}

class TextAid {
  constructor() {
    this.settings = {};
    this.toolbar = null;
    this.modal = null;
    this.dropdown = null;
    this.toast = null;
    this.toastTimer = null;
    this.selectionText = "";
    this.selectionRect = null;
    this.selectionEditable = false;
    this.selectionRange = null;
    this.selectionTimer = null;
    this.modalState = null;
    this.init();
  }

  init() {
    chrome.storage.sync.get(
      [
        "enableFloatingToolbar",
        "enableContextMenu",
        "enableSuggestions",
        "suggestionStyle",
      ],
      (r) => {
        this.settings = {
          enableFloatingToolbar: r.enableFloatingToolbar !== false,
          enableContextMenu: r.enableContextMenu !== false,
          enableSuggestions: r.enableSuggestions === true,
          suggestionStyle: r.suggestionStyle || "professional",
        };
      }
    );

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync") return;
      Object.entries(changes).forEach(([k, v]) => {
        if (k in this.settings || ["enableFloatingToolbar", "enableContextMenu", "enableSuggestions", "suggestionStyle"].includes(k)) {
          this.settings[k] = v.newValue;
        }
      });
    });

    document.addEventListener("mouseup", (e) => {
      if (e.target && e.target.closest && e.target.closest(".textaid-root")) return;
      this.scheduleSelection();
    }, true);
    document.addEventListener("keyup", () => this.scheduleSelection(), true);
    document.addEventListener(
      "mousedown",
      (e) => {
        if (this.toolbar && !e.target.closest(".textaid-root")) {
          this.hideToolbar();
        }
        if (this.dropdown && !e.target.closest(".textaid-root")) {
          this.hideDropdown();
        }
      },
      true
    );
    document.addEventListener("scroll", () => this.hideToolbar(), true);

    chrome.runtime.onMessage.addListener((msg) => this.onMessage(msg));
  }

  scheduleSelection() {
    clearTimeout(this.selectionTimer);
    this.selectionTimer = setTimeout(() => this.handleSelection(), 80);
  }

  handleSelection() {
    if (!this.settings.enableFloatingToolbar) {
      this.hideToolbar();
      return;
    }
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      this.hideToolbar();
      return;
    }
    const text = sel.toString().trim();
    if (text.length < 4) {
      this.hideToolbar();
      return;
    }
    const anchorNode = sel.anchorNode;
    if (anchorNode && anchorNode.parentElement && anchorNode.parentElement.closest(".textaid-root")) {
      return;
    }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) {
      this.hideToolbar();
      return;
    }
    this.selectionText = text;
    this.selectionRect = rect;
    this.selectionRange = range.cloneRange();
    this.selectionEditable = this.isEditableContext(anchorNode);
    this.showToolbar();
  }

  isEditableContext(node) {
    if (!node) return false;
    const el = node.nodeType === 1 ? node : node.parentElement;
    if (!el) return false;
    if (el.isContentEditable) return true;
    const active = document.activeElement;
    if (active && (active.tagName === "TEXTAREA" || (active.tagName === "INPUT" && /^(text|email|search|url|tel)$/i.test(active.type || "text")))) {
      return true;
    }
    return false;
  }

  showToolbar() {
    this.hideToolbar();
    const tb = document.createElement("div");
    tb.className = "textaid-toolbar textaid-root";

    const buttons = [
      { action: "summarize", icon: "align-justify", label: "Summarize", showLabel: true },
      { action: "rephrase", icon: "pen-line", label: "Rewrite" },
      { action: "ideas", icon: "lightbulb", label: "Ideas" },
      { action: "expand", icon: "expand", label: "Expand" },
    ];
    buttons.forEach((b) => tb.appendChild(this.makeToolbarBtn(b)));

    if (this.selectionEditable) {
      tb.appendChild(
        this.makeToolbarBtn({
          action: "replace-prompt",
          icon: "replace",
          label: "Replace selection",
        })
      );
    }

    const div = document.createElement("span");
    div.className = "ta-tb-divider";
    tb.appendChild(div);

    const more = this.makeToolbarBtn({ action: "__more", icon: "more-horizontal", label: "More" });
    tb.appendChild(more);

    document.body.appendChild(tb);
    this.toolbar = tb;
    this.positionToolbar();
    requestAnimationFrame(() => tb.classList.add("is-visible"));
  }

  makeToolbarBtn({ action, icon, label, showLabel }) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ta-tb-btn" + (showLabel ? "" : " ta-tb-btn--icon");
    btn.dataset.action = action;
    btn.innerHTML = tIcon(icon) + (showLabel ? `<span>${label}</span>` : "");
    if (!showLabel) {
      const tip = document.createElement("span");
      tip.className = "ta-tb-tooltip";
      tip.textContent = label;
      btn.appendChild(tip);
    }
    btn.addEventListener("mousedown", (e) => e.preventDefault());
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (action === "__more") {
        this.openMoreDropdown(btn);
      } else if (action === "replace-prompt") {
        this.openCustomPrompt(true);
      } else {
        this.runAction(action);
      }
    });
    return btn;
  }

  positionToolbar() {
    if (!this.toolbar || !this.selectionRect) return;
    const rect = this.selectionRect;
    const tbRect = this.toolbar.getBoundingClientRect();
    const margin = 8;
    let top = window.scrollY + rect.top - tbRect.height - 8;
    if (rect.top - tbRect.height - 8 < 0) {
      top = window.scrollY + rect.bottom + 8;
    }
    let left = window.scrollX + rect.left + rect.width / 2 - tbRect.width / 2;
    const maxLeft = window.scrollX + window.innerWidth - tbRect.width - margin;
    const minLeft = window.scrollX + margin;
    left = Math.max(minLeft, Math.min(left, maxLeft));
    this.toolbar.style.top = top + "px";
    this.toolbar.style.left = left + "px";
  }

  hideToolbar() {
    if (!this.toolbar) return;
    const tb = this.toolbar;
    this.toolbar = null;
    tb.classList.remove("is-visible");
    setTimeout(() => tb.remove(), 140);
    this.hideDropdown();
  }

  openMoreDropdown(anchor) {
    this.hideDropdown();
    const dd = document.createElement("div");
    dd.className = "textaid-dropdown textaid-root";
    const items = [
      { action: "translate", label: "Translate to English" },
      { action: "grammar", label: "Fix grammar" },
      { action: "formal", label: "Make formal" },
      { action: "casual", label: "Make casual" },
      { action: "__custom", label: "Custom prompt…" },
    ];
    items.forEach((it) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ta-dd-item";
      btn.textContent = it.label;
      btn.addEventListener("mousedown", (e) => e.preventDefault());
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.hideDropdown();
        if (it.action === "__custom") {
          this.openCustomPrompt(false);
        } else {
          this.runAction(it.action);
        }
      });
      dd.appendChild(btn);
    });
    document.body.appendChild(dd);
    this.dropdown = dd;
    const r = anchor.getBoundingClientRect();
    const ddRect = dd.getBoundingClientRect();
    let left = window.scrollX + r.right - ddRect.width;
    left = Math.max(window.scrollX + 8, left);
    dd.style.top = window.scrollY + r.bottom + 6 + "px";
    dd.style.left = left + "px";
  }

  hideDropdown() {
    if (this.dropdown) {
      this.dropdown.remove();
      this.dropdown = null;
    }
  }

  runAction(action) {
    const text = this.selectionText;
    if (!text) return;
    const tone = this.settings.suggestionStyle || "professional";
    const prompts = {
      summarize: `Summarize the following text concisely in bullet points (under 200 words):\n\n${text}`,
      rephrase: `Rewrite the following text in a ${tone} tone, preserving meaning:\n\n${text}`,
      ideas: `Generate 3-5 related ideas based on the following text:\n\n${text}`,
      expand: `Expand on the following text with more detail and context:\n\n${text}`,
      translate: `Translate the following text to English. Output only the translation:\n\n${text}`,
      grammar: `Correct grammar and spelling in the following text. Output only the corrected text:\n\n${text}`,
      formal: `Rewrite the following text in a formal tone. Output only the rewritten text:\n\n${text}`,
      casual: `Rewrite the following text in a casual, friendly tone. Output only the rewritten text:\n\n${text}`,
    };
    const prompt = prompts[action];
    if (!prompt) return;
    this.hideToolbar();
    this.openResultModal(action);
    chrome.runtime.sendMessage({ action: "processText", prompt, type: action });
  }

  openCustomPrompt(replaceMode) {
    this.hideToolbar();
    const overlay = document.createElement("div");
    overlay.className = "textaid-modal textaid-root";
    overlay.innerHTML = `
      <div class="ta-modal-card">
        <div class="ta-modal-head">
          <span class="ta-modal-title">CUSTOM PROMPT</span>
          <button type="button" class="ta-modal-close" data-close>${tIcon("x")}</button>
        </div>
        <div class="ta-modal-body">
          <textarea class="ta-prompt-input" placeholder="Describe what you want done with the selected text…"></textarea>
        </div>
        <div class="ta-modal-foot">
          <button type="button" class="ta-foot-btn" data-cancel>Cancel</button>
          <button type="button" class="ta-foot-btn ta-foot-btn--primary" data-run>Run</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("is-visible"));
    const close = () => {
      overlay.classList.remove("is-visible");
      setTimeout(() => overlay.remove(), 140);
    };
    overlay.querySelector("[data-close]").addEventListener("click", close);
    overlay.querySelector("[data-cancel]").addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    const ta = overlay.querySelector(".ta-prompt-input");
    setTimeout(() => ta.focus(), 50);
    overlay.querySelector("[data-run]").addEventListener("click", () => {
      const customPrompt = ta.value.trim();
      if (!customPrompt) return;
      const text = this.selectionText;
      const fullPrompt = customPrompt + "\n\nText:\n" + text;
      close();
      this.openResultModal("custom");
      chrome.runtime.sendMessage({
        action: "processText",
        prompt: fullPrompt,
        type: "custom",
        replaceMode: !!replaceMode,
      });
    });
  }

  openResultModal(action) {
    this.hideModal();
    const overlay = document.createElement("div");
    overlay.className = "textaid-modal textaid-root";
    const title = TA_ACTION_LABELS[action] || "RESULT";
    overlay.innerHTML = `
      <div class="ta-modal-card">
        <div class="ta-modal-head">
          <span class="ta-modal-title">
            <span class="ta-action-name">${title}</span>
            <span class="ta-streaming">streaming…</span>
          </span>
          <button type="button" class="ta-modal-close" data-close>${tIcon("x")}</button>
        </div>
        <div class="ta-modal-body ta-modal-body--center" data-body>
          <span class="ta-loading-dots"><span></span><span></span><span></span></span>
        </div>
        <div class="ta-modal-foot" data-foot></div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("is-visible"));
    overlay.querySelector("[data-close]").addEventListener("click", () => this.hideModal());
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) this.hideModal();
    });
    this.modal = overlay;
    this.modalState = {
      action,
      text: "",
      started: false,
      editable: this.selectionEditable,
      range: this.selectionRange,
    };
  }

  hideModal() {
    if (!this.modal) return;
    const m = this.modal;
    this.modal = null;
    this.modalState = null;
    m.classList.remove("is-visible");
    setTimeout(() => m.remove(), 140);
  }

  appendStream(chunk) {
    if (!this.modal || !this.modalState) return;
    const body = this.modal.querySelector("[data-body]");
    if (!this.modalState.started) {
      this.modalState.started = true;
      body.classList.remove("ta-modal-body--center");
      body.textContent = "";
    }
    this.modalState.text += chunk;
    body.textContent = this.modalState.text;
    body.scrollTop = body.scrollHeight;
  }

  finishStream() {
    if (!this.modal || !this.modalState) return;
    const stream = this.modal.querySelector(".ta-streaming");
    if (stream) stream.remove();
    if (!this.modalState.started) {
      const body = this.modal.querySelector("[data-body]");
      body.classList.remove("ta-modal-body--center");
      body.textContent = this.modalState.text || "(empty response)";
    }
    this.renderModalFooter();
    this.saveHistory();
  }

  renderModalFooter() {
    const foot = this.modal.querySelector("[data-foot]");
    foot.innerHTML = "";
    const text = this.modalState.text || "";

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "ta-foot-btn";
    copy.innerHTML = `${tIcon("copy")}<span>Copy</span>`;
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(text);
        copy.innerHTML = `${tIcon("check")}<span>Copied</span>`;
        setTimeout(() => (copy.innerHTML = `${tIcon("copy")}<span>Copy</span>`), 1200);
      } catch (e) {
        console.error("Clipboard failed", e);
      }
    });
    foot.appendChild(copy);

    if (this.modalState.editable) {
      const repl = document.createElement("button");
      repl.type = "button";
      repl.className = "ta-foot-btn";
      repl.innerHTML = `${tIcon("replace")}<span>Replace</span>`;
      repl.addEventListener("click", () => {
        this.replaceSelection(text);
        this.hideModal();
      });
      foot.appendChild(repl);
    }

    const insert = document.createElement("button");
    insert.type = "button";
    insert.className = "ta-foot-btn ta-foot-btn--primary";
    insert.innerHTML = `${tIcon("arrow-down")}<span>Insert below</span>`;
    insert.addEventListener("click", () => {
      this.insertBelow(text);
      this.hideModal();
    });
    foot.appendChild(insert);
  }

  showStreamError(error) {
    if (!this.modal) return;
    const body = this.modal.querySelector("[data-body]");
    body.classList.remove("ta-modal-body--center");
    body.innerHTML = `
      <div class="ta-modal-error">
        <span class="ta-modal-error-title">${tIcon("alert-circle")}<span>Something went wrong</span></span>
        <span class="ta-modal-error-msg"></span>
      </div>`;
    body.querySelector(".ta-modal-error-msg").textContent = error || "Unknown error";
    const stream = this.modal.querySelector(".ta-streaming");
    if (stream) stream.remove();
  }

  replaceSelection(text) {
    const active = document.activeElement;
    if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) {
      const start = active.selectionStart;
      const end = active.selectionEnd;
      const v = active.value;
      active.value = v.slice(0, start) + text + v.slice(end);
      const pos = start + text.length;
      active.setSelectionRange(pos, pos);
      active.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
    if (this.modalState && this.modalState.range) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(this.modalState.range);
    }
    if (document.queryCommandSupported && document.queryCommandSupported("insertText")) {
      const ok = document.execCommand("insertText", false, text);
      if (ok) return;
    }
    navigator.clipboard.writeText(text).then(() => this.toastMsg("Copied to clipboard"));
  }

  insertBelow(text) {
    const insertion = "\n\n" + text;
    const active = document.activeElement;
    if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) {
      const end = active.selectionEnd;
      const v = active.value;
      active.value = v.slice(0, end) + insertion + v.slice(end);
      const pos = end + insertion.length;
      active.setSelectionRange(pos, pos);
      active.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
    if (this.modalState && this.modalState.range && this.modalState.editable) {
      const range = this.modalState.range.cloneRange();
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      if (document.queryCommandSupported && document.queryCommandSupported("insertText")) {
        const ok = document.execCommand("insertText", false, insertion);
        if (ok) return;
      }
    }
    navigator.clipboard.writeText(text).then(() => this.toastMsg("Copied to clipboard"));
  }

  saveHistory() {
    if (!this.modalState) return;
    const text = this.modalState.text || "";
    if (!text) return;
    const record = {
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      action: this.modalState.action,
      snippet: text.slice(0, 80).replace(/\s+/g, " "),
      fullText: text,
      ts: Date.now(),
    };
    chrome.runtime.sendMessage({ action: "saveHistory", record });
  }

  toastMsg(message) {
    if (this.toast) this.toast.remove();
    if (this.toastTimer) clearTimeout(this.toastTimer);
    const t = document.createElement("div");
    t.className = "textaid-toast textaid-root";
    t.textContent = message;
    document.body.appendChild(t);
    this.toast = t;
    requestAnimationFrame(() => t.classList.add("is-visible"));
    this.toastTimer = setTimeout(() => {
      t.classList.remove("is-visible");
      setTimeout(() => t.remove(), 200);
    }, 1800);
  }

  onMessage(msg) {
    if (!msg || !msg.action) return;
    switch (msg.action) {
      case "showProcessing":
        this.openResultModal(msg.menuAction || "result");
        break;
      case "streamChunk":
        this.appendStream(msg.chunk || "");
        break;
      case "streamDone":
        this.finishStream();
        break;
      case "streamError":
        this.showStreamError(msg.error);
        break;
      case "showResult":
        if (!this.modal) this.openResultModal(msg.type || "result");
        if (msg.error) {
          this.showStreamError(msg.error);
        } else {
          this.appendStream(msg.result || "");
          this.finishStream();
        }
        break;
      case "showToolbarFromShortcut":
        this.handleSelection();
        if (!this.toolbar) this.toastMsg("Select text first");
        break;
      case "runActionFromShortcut": {
        const sel = window.getSelection();
        const text = sel ? sel.toString().trim() : "";
        if (!text || text.length < 2) {
          this.toastMsg("Select text first");
          break;
        }
        this.selectionText = text;
        if (sel.rangeCount > 0) {
          const r = sel.getRangeAt(0);
          this.selectionRect = r.getBoundingClientRect();
          this.selectionRange = r.cloneRange();
          this.selectionEditable = this.isEditableContext(sel.anchorNode);
        }
        this.runAction(msg.runAction);
        break;
      }
    }
  }
}

new TextAid();
