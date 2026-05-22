import { describe, it, expect } from "vitest";
import { friendlyError } from "../lib/errors.js";

const geminiRateBody = JSON.stringify({
  error: { status: "RESOURCE_EXHAUSTED", message: "quota" },
});
const openaiRateBody = JSON.stringify({
  error: { code: "rate_limit_exceeded", message: "Too many requests" },
});
const openaiQuotaBody = JSON.stringify({
  error: { code: "insufficient_quota", message: "billing" },
});
const openaiKeyBody = JSON.stringify({
  error: { code: "invalid_api_key", message: "Bad key" },
});
const openaiModelBody = JSON.stringify({
  error: { code: "model_not_found", message: "no model" },
});
const geminiContextBody = JSON.stringify({
  error: {
    status: "INVALID_ARGUMENT",
    message: "maximum context length exceeded",
  },
});
const claudeAuthBody = JSON.stringify({
  error: { type: "authentication_error", message: "invalid key" },
});
const claudeRateBody = JSON.stringify({
  error: { type: "rate_limit_error", message: "slow down" },
});
const claudeOverloadBody = JSON.stringify({
  error: { type: "overloaded_error", message: "busy" },
});

// ─── Generic HTTP errors ──────────────────────────────────────────────────────

describe("friendlyError — generic", () => {
  it("returns network message on status 0", () => {
    const msg = friendlyError("OpenAI", 0, "");
    expect(msg).toContain("internet");
  });

  it("handles 413 — payload too large", () => {
    const msg = friendlyError("Gemini", 413, "");
    expect(msg).toContain("too large");
  });

  it("handles 500 internal error", () => {
    const msg = friendlyError("OpenAI", 500, "");
    expect(msg).toContain("internal error");
  });

  it("falls back to raw text when no JSON and unknown status", () => {
    const msg = friendlyError("OpenAI", 418, "I am a teapot");
    expect(msg).toBe("I am a teapot");
  });

  it("falls back to generic message when raw is empty", () => {
    const msg = friendlyError("Gemini", 599, "");
    expect(msg).toContain("599");
  });
});

// ─── OpenAI errors ───────────────────────────────────────────────────────────

describe("friendlyError — OpenAI", () => {
  it("detects invalid API key (401)", () => {
    const msg = friendlyError("OpenAI", 401, "");
    expect(msg).toContain("API key");
  });

  it("detects invalid_api_key error code", () => {
    const msg = friendlyError("OpenAI", 403, openaiKeyBody);
    expect(msg).toContain("API key");
  });

  it("detects rate limit", () => {
    const msg = friendlyError("OpenAI", 429, openaiRateBody);
    expect(msg).toMatch(/rate limit/i);
  });

  it("detects quota exhausted", () => {
    const msg = friendlyError("OpenAI", 429, openaiQuotaBody);
    expect(msg).toMatch(/quota/i);
  });

  it("detects model not found", () => {
    const msg = friendlyError("OpenAI", 404, openaiModelBody);
    expect(msg).toContain("Model not found");
  });

  it("detects 503 overload", () => {
    const msg = friendlyError("OpenAI", 503, "");
    expect(msg).toMatch(/overloaded/i);
  });
});

// ─── Gemini errors ───────────────────────────────────────────────────────────

describe("friendlyError — Gemini", () => {
  it("detects RESOURCE_EXHAUSTED (quota)", () => {
    const msg = friendlyError("Gemini", 429, geminiRateBody);
    expect(msg).toMatch(/quota|rate limit/i);
  });

  it("detects context too long (INVALID_ARGUMENT)", () => {
    const msg = friendlyError("Gemini", 400, geminiContextBody);
    expect(msg).toContain("too long");
  });

  it("detects PERMISSION_DENIED as key error", () => {
    const body = JSON.stringify({ error: { status: "PERMISSION_DENIED" } });
    const msg = friendlyError("Gemini", 403, body);
    expect(msg).toContain("API key");
  });
});

// ─── Claude errors ───────────────────────────────────────────────────────────

describe("friendlyError — Claude", () => {
  it("detects authentication_error", () => {
    const msg = friendlyError("Claude", 401, claudeAuthBody);
    expect(msg).toContain("Claude API key");
    expect(msg).toContain("sk-ant-");
  });

  it("detects rate_limit_error", () => {
    const msg = friendlyError("Claude", 429, claudeRateBody);
    expect(msg).toMatch(/rate limit/i);
  });

  it("detects overloaded_error", () => {
    const msg = friendlyError("Claude", 529, claudeOverloadBody);
    expect(msg).toMatch(/overloaded/i);
    expect(msg).toContain("Haiku");
  });

  it("detects 401 by status alone (no body)", () => {
    const msg = friendlyError("Claude", 401, "");
    expect(msg).toContain("Claude API key");
  });
});
