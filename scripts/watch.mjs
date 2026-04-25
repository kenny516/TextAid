#!/usr/bin/env node
// Watch source files and rebuild on change.
// Usage: npm run dev [chrome|firefox]  (default: both)

import { watch } from "node:fs";
import { spawn } from "node:child_process";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const WATCH_FILES = [
  "manifest.json",
  "popup.html", "popup.css", "popup.js",
  "content.css", "content.js",
  "background.js",
];
const WATCH_DIRS = ["icons"];

const targets = process.argv.slice(2).filter(Boolean);
const buildArgs = targets.length ? targets : [];

let timer = null;
let building = false;
let pending = false;

function build() {
  if (building) { pending = true; return; }
  building = true;
  const start = Date.now();
  const child = spawn(process.execPath, [join(ROOT, "scripts/build.mjs"), ...buildArgs], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let out = "";
  child.stdout.on("data", (b) => (out += b));
  child.stderr.on("data", (b) => (out += b));
  child.on("close", (code) => {
    building = false;
    const ms = Date.now() - start;
    if (code === 0) {
      const lines = out.trim().split("\n").filter((l) => l.startsWith("✓"));
      console.log(`[${new Date().toLocaleTimeString()}] rebuilt in ${ms}ms`);
      for (const l of lines) console.log("  " + l);
    } else {
      console.error(`[${new Date().toLocaleTimeString()}] build failed:\n${out}`);
    }
    if (pending) { pending = false; build(); }
  });
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(build, 120);
}

console.log(`Watching ${WATCH_FILES.length} files + ${WATCH_DIRS.length} dirs. Ctrl+C to stop.\n`);
build();

for (const f of WATCH_FILES) {
  try { watch(join(ROOT, f), schedule); } catch { /* file may not exist */ }
}
for (const d of WATCH_DIRS) {
  try { watch(join(ROOT, d), { recursive: true }, schedule); } catch { /* dir may not exist */ }
}
