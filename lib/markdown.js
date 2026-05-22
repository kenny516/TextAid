export function taEscapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function taSafeUrl(u) {
  const s = String(u || "").trim();
  if (/^(https?:|mailto:)/i.test(s)) return s;
  return "#";
}

export function taRenderInline(s) {
  let out = taEscapeHtml(s);
  out = out.replace(/`([^`\n]+?)`/g, (_m, c) => `<code>${c}</code>`);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t, u) => {
    return `<a href="${taEscapeHtml(taSafeUrl(u))}" target="_blank" rel="noopener noreferrer">${t}</a>`;
  });
  out = out.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__([^_\n]+?)__/g, "<strong>$1</strong>");
  out = out.replace(/(^|[\s(])\*([^*\n]+?)\*(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>");
  out = out.replace(/(^|[\s(])_([^_\n]+?)_(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>");
  out = out.replace(/~~([^~\n]+?)~~/g, "<del>$1</del>");
  return out;
}

export function taRenderMarkdown(src) {
  const text = String(src || "");
  const blocks = [];
  const fenceRe = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIdx = 0;
  for (const m of text.matchAll(fenceRe)) {
    if (m.index > lastIdx) blocks.push({ type: "text", value: text.slice(lastIdx, m.index) });
    blocks.push({ type: "code", lang: m[1] || "", value: m[2] });
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) blocks.push({ type: "text", value: text.slice(lastIdx) });

  const html = [];
  for (const b of blocks) {
    if (b.type === "code") {
      html.push(`<pre><code>${taEscapeHtml(b.value.replace(/\n$/, ""))}</code></pre>`);
      continue;
    }
    const lines = b.value.split("\n");
    let i = 0;
    let para = [];
    const flushPara = () => {
      if (!para.length) return;
      const joined = para.join(" ").trim();
      if (joined) html.push(`<p>${taRenderInline(joined)}</p>`);
      para = [];
    };
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed) {
        flushPara();
        i++;
        continue;
      }
      const h = /^(#{1,6})\s+(.+)$/.exec(trimmed);
      if (h) {
        flushPara();
        const lvl = Math.min(h[1].length + 2, 6);
        html.push(`<h${lvl}>${taRenderInline(h[2])}</h${lvl}>`);
        i++;
        continue;
      }
      if (/^>\s?/.test(trimmed)) {
        flushPara();
        const buf = [];
        while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
          buf.push(lines[i].trim().replace(/^>\s?/, ""));
          i++;
        }
        html.push(`<blockquote>${taRenderInline(buf.join(" "))}</blockquote>`);
        continue;
      }
      if (/^([-*+])\s+/.test(trimmed)) {
        flushPara();
        const items = [];
        while (i < lines.length && /^([-*+])\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^([-*+])\s+/, ""));
          i++;
        }
        html.push(`<ul>${items.map((it) => `<li>${taRenderInline(it)}</li>`).join("")}</ul>`);
        continue;
      }
      if (/^\d+\.\s+/.test(trimmed)) {
        flushPara();
        const items = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
          i++;
        }
        html.push(`<ol>${items.map((it) => `<li>${taRenderInline(it)}</li>`).join("")}</ol>`);
        continue;
      }
      if (/^([-*_])\1{2,}$/.test(trimmed)) {
        flushPara();
        html.push("<hr>");
        i++;
        continue;
      }
      para.push(trimmed);
      i++;
    }
    flushPara();
  }
  return html.join("");
}
