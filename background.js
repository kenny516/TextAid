// TextAid background service worker
const DEFAULTS = {
  aiProvider: "gemini",
  apiKey: "",
  model: "",
  suggestionStyle: "professional",
  enableSummary: true,
  enableSuggestions: false,
  enableContextMenu: true,
  enableFloatingToolbar: true,
};

const DEFAULT_MODELS = {
  gemini: "gemini-2.0-flash",
  openai: "gpt-4o-mini",
};

const ACTION_LIMITS = {
  summarize: 400,
  rephrase: 600,
  ideas: 500,
  expand: 800,
  custom: 800,
  translate: 600,
  grammar: 600,
  formal: 600,
  casual: 600,
};

class TextAidBackground {
  constructor() {
    this.settings = { ...DEFAULTS };
    this.init();
  }

  init() {
    this.loadSettings();
    chrome.runtime.onInstalled.addListener(() => {
      this.setupContextMenus();
    });
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      this.handleMessage(msg, sender, sendResponse);
      return true;
    });
    chrome.contextMenus.onClicked.addListener((info, tab) => this.onContextMenu(info, tab));
    if (chrome.commands && chrome.commands.onCommand) {
      chrome.commands.onCommand.addListener((command) => {
        if (command !== "open-toolbar") return;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs && tabs[0];
          if (!tab) return;
          chrome.tabs.sendMessage(tab.id, { action: "showToolbarFromShortcut" }).catch(() => {});
        });
      });
    }
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync") return;
      let menusDirty = false;
      Object.entries(changes).forEach(([k, v]) => {
        this.settings[k] = v.newValue;
        if (k === "enableContextMenu") menusDirty = true;
      });
      if (menusDirty) this.setupContextMenus();
    });
  }

  loadSettings() {
    chrome.storage.sync.get(Object.keys(DEFAULTS), (result) => {
      this.settings = { ...DEFAULTS, ...result };
      this.setupContextMenus();
    });
  }

  modelFor() {
    return this.settings.model || DEFAULT_MODELS[this.settings.aiProvider] || DEFAULT_MODELS.gemini;
  }

  setupContextMenus() {
    chrome.contextMenus.removeAll(() => {
      if (!this.settings.enableContextMenu) return;
      try {
        chrome.contextMenus.create({ id: "textaid-main", title: "TextAid", contexts: ["selection"] });
        chrome.contextMenus.create({ id: "textaid-summarize", parentId: "textaid-main", title: "Summarize", contexts: ["selection"] });
        chrome.contextMenus.create({ id: "textaid-rephrase", parentId: "textaid-main", title: "Rephrase", contexts: ["selection"] });
        chrome.contextMenus.create({ id: "textaid-ideas", parentId: "textaid-main", title: "Generate ideas", contexts: ["selection"] });
        chrome.contextMenus.create({ id: "textaid-expand", parentId: "textaid-main", title: "Expand", contexts: ["selection"] });
      } catch (e) {
        console.error("Context menu setup failed", e);
      }
    });
  }

  onContextMenu(info, tab) {
    const text = info.selectionText;
    if (!text || !tab) return;
    const tone = this.settings.suggestionStyle || "professional";
    let action, prompt;
    switch (info.menuItemId) {
      case "textaid-summarize":
        action = "summarize";
        prompt = `Summarize the following text concisely in bullet points (under 200 words):\n\n${text}`;
        break;
      case "textaid-rephrase":
        action = "rephrase";
        prompt = `Rewrite the following text in a ${tone} tone, preserving meaning:\n\n${text}`;
        break;
      case "textaid-ideas":
        action = "ideas";
        prompt = `Generate 3-5 related ideas based on the following text:\n\n${text}`;
        break;
      case "textaid-expand":
        action = "expand";
        prompt = `Expand on the following text with more detail and context:\n\n${text}`;
        break;
      default:
        return;
    }
    chrome.tabs.sendMessage(tab.id, { action: "showProcessing", menuAction: action }).catch(() => {});
    this.processWithAI(prompt, action, tab.id);
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case "updateSettings":
          this.settings = { ...this.settings, ...message.settings };
          this.setupContextMenus();
          sendResponse({ success: true });
          break;
        case "processText":
          if (sender.tab) {
            this.processWithAI(message.prompt, message.type, sender.tab.id);
          }
          sendResponse({ accepted: true });
          break;
        case "testApiKey": {
          const res = await this.testApiKey(message.provider, message.apiKey, message.model);
          sendResponse(res);
          break;
        }
        case "saveHistory":
          await this.saveHistory(message.record);
          sendResponse({ ok: true });
          break;
        case "getSuggestion":
          if (this.settings.enableSuggestions) {
            const suggestion = await this.getSuggestion(message.text, message.context);
            sendResponse({ suggestion });
          } else {
            sendResponse({ suggestion: null });
          }
          break;
        default:
          sendResponse({ error: "Unknown action" });
      }
    } catch (e) {
      console.error("handleMessage failed", e);
      sendResponse({ error: e.message });
    }
  }

  async saveHistory(record) {
    if (!record) return;
    return new Promise((resolve) => {
      chrome.storage.local.get(["textaid:history"], (r) => {
        const list = Array.isArray(r["textaid:history"]) ? r["textaid:history"] : [];
        list.unshift(record);
        const trimmed = list.slice(0, 20);
        chrome.storage.local.set({ "textaid:history": trimmed }, () => resolve());
      });
    });
  }

  friendlyError(provider, status, raw) {
    if (status === 401 || status === 403) return "Invalid API key — check settings";
    if (status === 429) return "Rate limit reached — wait a moment or switch provider";
    if (status === 0) return `Couldn't reach ${provider}`;
    return raw || `${provider} request failed (${status})`;
  }

  async processWithAI(prompt, type, tabId) {
    if (!this.settings.apiKey) {
      chrome.tabs.sendMessage(tabId, { action: "streamError", error: "Please configure your API key in the extension settings." }).catch(() => {});
      return;
    }
    const provider = this.settings.aiProvider;
    const model = this.modelFor();
    const maxTokens = ACTION_LIMITS[type] || 600;
    try {
      if (provider === "openai") {
        await this.streamOpenAI(prompt, type, tabId, model, maxTokens);
      } else {
        await this.streamGemini(prompt, type, tabId, model, maxTokens);
      }
    } catch (e) {
      console.error("AI processing failed", e);
      try {
        const fallback = await this.bufferedFallback(provider, prompt, type, model, maxTokens);
        chrome.tabs.sendMessage(tabId, { action: "streamChunk", chunk: fallback }).catch(() => {});
        chrome.tabs.sendMessage(tabId, { action: "streamDone" }).catch(() => {});
      } catch (e2) {
        const msg = e2 && e2.friendly ? e2.friendly : e.message;
        chrome.tabs.sendMessage(tabId, { action: "streamError", error: msg }).catch(() => {});
      }
    }
  }

  async streamOpenAI(prompt, type, tabId, model, maxTokens) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.settings.apiKey}`,
      },
      body: JSON.stringify({
        model,
        stream: true,
        messages: [
          { role: "system", content: `You are a helpful writing assistant. Be ${this.settings.suggestionStyle} in your responses.` },
          { role: "user", content: prompt },
        ],
        max_tokens: maxTokens,
        temperature: type === "ideas" || type === "creative" ? 0.8 : 0.4,
      }),
    });
    if (!res.ok || !res.body) {
      const txt = await res.text().catch(() => "");
      const err = new Error(this.friendlyError("OpenAI", res.status, txt));
      err.friendly = err.message;
      throw err;
    }
    await this.consumeSSE(res.body, tabId, (data) => {
      if (data === "[DONE]") return null;
      try {
        const j = JSON.parse(data);
        return j.choices?.[0]?.delta?.content || "";
      } catch {
        return "";
      }
    });
  }

  async streamGemini(prompt, type, tabId, model, maxTokens) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(this.settings.apiKey)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a helpful writing assistant. Be ${this.settings.suggestionStyle} in your responses.\n\n${prompt}` }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: type === "ideas" || type === "creative" ? 0.8 : 0.4,
        },
      }),
    });
    if (!res.ok || !res.body) {
      const txt = await res.text().catch(() => "");
      const err = new Error(this.friendlyError("Gemini", res.status, txt));
      err.friendly = err.message;
      throw err;
    }
    await this.consumeSSE(res.body, tabId, (data) => {
      try {
        const j = JSON.parse(data);
        const parts = j.candidates?.[0]?.content?.parts || [];
        return parts.map((p) => p.text || "").join("");
      } catch {
        return "";
      }
    });
  }

  async consumeSSE(body, tabId, parseData) {
    const reader = body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 1);
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data) continue;
          const chunk = parseData(data);
          if (chunk === null) {
            chrome.tabs.sendMessage(tabId, { action: "streamDone" }).catch(() => {});
            return;
          }
          if (chunk) {
            chrome.tabs.sendMessage(tabId, { action: "streamChunk", chunk }).catch(() => {});
          }
        }
      }
    } finally {
      try { reader.releaseLock(); } catch {}
    }
    chrome.tabs.sendMessage(tabId, { action: "streamDone" }).catch(() => {});
  }

  async bufferedFallback(provider, prompt, type, model, maxTokens) {
    if (provider === "openai") {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.settings.apiKey}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: `You are a helpful writing assistant. Be ${this.settings.suggestionStyle} in your responses.` },
            { role: "user", content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.4,
        }),
      });
      if (!r.ok) {
        const txt = await r.text().catch(() => "");
        const e = new Error(this.friendlyError("OpenAI", r.status, txt));
        e.friendly = e.message;
        throw e;
      }
      const j = await r.json();
      return j.choices?.[0]?.message?.content?.trim() || "";
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(this.settings.apiKey)}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.4 },
      }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      const e = new Error(this.friendlyError("Gemini", r.status, txt));
      e.friendly = e.message;
      throw e;
    }
    const j = await r.json();
    return j.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  }

  async testApiKey(provider, apiKey, model) {
    if (!apiKey) return { ok: false, error: "No API key provided" };
    const useModel = model || DEFAULT_MODELS[provider];
    try {
      if (provider === "openai") {
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: useModel,
            messages: [{ role: "user", content: "ping" }],
            max_tokens: 1,
          }),
        });
        if (!r.ok) {
          const txt = await r.text().catch(() => "");
          return { ok: false, error: this.friendlyError("OpenAI", r.status, txt) };
        }
        return { ok: true };
      } else {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(useModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const r = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "ping" }] }],
            generationConfig: { maxOutputTokens: 1 },
          }),
        });
        if (!r.ok) {
          const txt = await r.text().catch(() => "");
          return { ok: false, error: this.friendlyError("Gemini", r.status, txt) };
        }
        return { ok: true };
      }
    } catch (e) {
      return { ok: false, error: this.friendlyError(provider, 0, e.message) };
    }
  }

  async getSuggestion(text, context) {
    if (!this.settings.apiKey || !text || !text.trim()) return null;
    const provider = this.settings.aiProvider;
    const model = this.modelFor();
    const prompt = `Complete this ${context || "text"} in a ${this.settings.suggestionStyle} tone. Only provide the completion, no explanation: "${text}"`;
    try {
      if (provider === "openai") {
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.settings.apiKey}` },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: "You are a writing assistant. Provide brief, contextual completions." },
              { role: "user", content: prompt },
            ],
            max_tokens: 50,
            temperature: 0.7,
          }),
        });
        if (!r.ok) return null;
        const j = await r.json();
        return j.choices?.[0]?.message?.content?.trim() || null;
      }
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(this.settings.apiKey)}`;
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 50, temperature: 0.7 },
        }),
      });
      if (!r.ok) return null;
      const j = await r.json();
      return j.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
    } catch (e) {
      console.error("Suggestion fetch failed", e);
      return null;
    }
  }
}

new TextAidBackground();
