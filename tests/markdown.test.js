import { describe, it, expect } from "vitest";
import { taEscapeHtml, taSafeUrl, taRenderInline, taRenderMarkdown } from "../lib/markdown.js";

// ─── taEscapeHtml ────────────────────────────────────────────────────────────

describe("taEscapeHtml", () => {
  it("escapes ampersand", () => {
    expect(taEscapeHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes angle brackets", () => {
    expect(taEscapeHtml("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;",
    );
  });

  it("escapes double quotes", () => {
    expect(taEscapeHtml('"hello"')).toBe("&quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(taEscapeHtml("it's")).toBe("it&#39;s");
  });

  it("leaves plain text untouched", () => {
    expect(taEscapeHtml("hello world")).toBe("hello world");
  });

  it("coerces non-strings", () => {
    expect(taEscapeHtml(42)).toBe("42");
  });
});

// ─── taSafeUrl ───────────────────────────────────────────────────────────────

describe("taSafeUrl", () => {
  it("allows https URLs", () => {
    expect(taSafeUrl("https://example.com")).toBe("https://example.com");
  });

  it("allows http URLs", () => {
    expect(taSafeUrl("http://example.com")).toBe("http://example.com");
  });

  it("allows mailto URLs", () => {
    expect(taSafeUrl("mailto:hello@example.com")).toBe("mailto:hello@example.com");
  });

  it("blocks javascript: URIs", () => {
    expect(taSafeUrl("javascript:alert(1)")).toBe("#");
  });

  it("returns # for empty string", () => {
    expect(taSafeUrl("")).toBe("#");
  });

  it("returns # for null/undefined", () => {
    expect(taSafeUrl(null)).toBe("#");
    expect(taSafeUrl(undefined)).toBe("#");
  });
});

// ─── taRenderInline ──────────────────────────────────────────────────────────

describe("taRenderInline", () => {
  it("renders inline code", () => {
    expect(taRenderInline("`foo`")).toContain("<code>foo</code>");
  });

  it("renders bold with **", () => {
    expect(taRenderInline("**bold**")).toContain("<strong>bold</strong>");
  });

  it("renders bold with __", () => {
    expect(taRenderInline("__bold__")).toContain("<strong>bold</strong>");
  });

  it("renders italic with * surrounded by spaces", () => {
    expect(taRenderInline("hello *world* ok")).toContain("<em>world</em>");
  });

  it("renders strikethrough", () => {
    expect(taRenderInline("~~strike~~")).toContain("<del>strike</del>");
  });

  it("renders a safe link", () => {
    const out = taRenderInline("[GitHub](https://github.com)");
    expect(out).toContain('<a href="https://github.com"');
    expect(out).toContain("GitHub");
    expect(out).toContain('rel="noopener noreferrer"');
  });

  it("blocks javascript: links", () => {
    const out = taRenderInline("[click](javascript:alert(1))");
    expect(out).toContain('href="#"');
  });

  it("escapes HTML before applying markdown", () => {
    const out = taRenderInline("<b>not bold</b>");
    expect(out).toContain("&lt;b&gt;");
    expect(out).not.toContain("<b>");
  });
});

// ─── taRenderMarkdown ────────────────────────────────────────────────────────

describe("taRenderMarkdown", () => {
  it("wraps plain text in <p>", () => {
    expect(taRenderMarkdown("hello world")).toBe("<p>hello world</p>");
  });

  it("renders h1 as h3 (offset +2)", () => {
    expect(taRenderMarkdown("# Title")).toContain("<h3>");
  });

  it("renders h2 as h4", () => {
    expect(taRenderMarkdown("## Subtitle")).toContain("<h4>");
  });

  it("caps heading level at h6", () => {
    expect(taRenderMarkdown("###### Deep")).toContain("<h6>");
  });

  it("renders unordered list", () => {
    const out = taRenderMarkdown("- alpha\n- beta");
    expect(out).toContain("<ul>");
    expect(out).toContain("<li>alpha</li>");
    expect(out).toContain("<li>beta</li>");
  });

  it("renders ordered list", () => {
    const out = taRenderMarkdown("1. first\n2. second");
    expect(out).toContain("<ol>");
    expect(out).toContain("<li>first</li>");
  });

  it("renders fenced code block", () => {
    const out = taRenderMarkdown("```js\nconsole.log('hi')\n```");
    expect(out).toContain("<pre><code>");
    expect(out).toContain("console.log(&#39;hi&#39;)");
  });

  it("renders blockquote", () => {
    expect(taRenderMarkdown("> some quote")).toContain("<blockquote>");
  });

  it("renders horizontal rule", () => {
    expect(taRenderMarkdown("---")).toContain("<hr>");
  });

  it("separates paragraphs on blank line", () => {
    const out = taRenderMarkdown("first\n\nsecond");
    expect(out).toContain("<p>first</p>");
    expect(out).toContain("<p>second</p>");
  });

  it("returns empty string for empty input", () => {
    expect(taRenderMarkdown("")).toBe("");
    expect(taRenderMarkdown(null)).toBe("");
  });
});
