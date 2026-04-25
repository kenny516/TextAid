#!/usr/bin/env node
// Cross-browser build for TextAid.
// Produces dist/<target>/ folders + dist/textaid-<target>-<version>.zip for:
//   - chrome   (Chromium: Chrome, Brave, Edge, Opera, Arc, Vivaldi)
//   - firefox  (Gecko: Firefox, Zen, LibreWolf)
//
// Safari is handled separately via xcrun safari-web-extension-converter (see docs/SUPPORTED_BROWSERS.md).
//
// Usage:
//   npm run build              -> builds all targets
//   npm run build -- chrome    -> build a single target
//   npm run build -- firefox

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync, statSync, createWriteStream } from "node:fs";
import { join, resolve, relative, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");

// Files copied verbatim into every target folder.
const SHIP_FILES = [
  "popup.html",
  "popup.css",
  "popup.js",
  "content.css",
  "content.js",
  "background.js",
];
const SHIP_DIRS = ["icons"];

const baseManifest = JSON.parse(readFileSync(join(ROOT, "manifest.json"), "utf8"));
const VERSION = baseManifest.version;

const TARGETS = {
  chrome: (m) => m, // canonical
  firefox: (m) => {
    const out = structuredClone(m);
    // Firefox MV3 uses background.scripts (event page), not service_worker.
    out.background = { scripts: ["background.js"] };
    out.browser_specific_settings = {
      gecko: { id: "textaid@kenny516.dev", strict_min_version: "115.0" },
    };
    return out;
  },
};

function buildTarget(name) {
  const transform = TARGETS[name];
  if (!transform) throw new Error(`Unknown target: ${name}`);

  const outDir = join(DIST, name);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  for (const f of SHIP_FILES) cpSync(join(ROOT, f), join(outDir, f));
  for (const d of SHIP_DIRS) cpSync(join(ROOT, d), join(outDir, d), { recursive: true });

  const manifest = transform(baseManifest);
  writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));

  const zipPath = join(DIST, `textaid-${name}-${VERSION}.zip`);
  zipDir(outDir, zipPath);

  console.log(`✓ ${name.padEnd(8)}  ${relative(ROOT, outDir)}  →  ${relative(ROOT, zipPath)}`);
}

function zipDir(srcDir, zipPath) {
  // Use adm-zip if installed; otherwise fall back to system zip.
  try {
    const require = createRequire(import.meta.url);
    const AdmZip = require("adm-zip");
    const zip = new AdmZip();
    walk(srcDir, (file) => zip.addLocalFile(file, dirname(relative(srcDir, file)) || ""));
    zip.writeZip(zipPath);
    return;
  } catch {
    // adm-zip not installed
  }
  // Fallback: PowerShell on Windows, zip on unix.
  const { execSync } = require("node:child_process");
  rmSync(zipPath, { force: true });
  if (process.platform === "win32") {
    execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${srcDir}\\*' -DestinationPath '${zipPath}' -Force"`);
  } else {
    execSync(`cd '${srcDir}' && zip -rq '${zipPath}' .`);
  }
}

function walk(dir, cb) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, cb);
    else cb(full);
  }
}

const argv = process.argv.slice(2).filter(Boolean);
const targets = argv.length ? argv : Object.keys(TARGETS);

mkdirSync(DIST, { recursive: true });
console.log(`Building TextAid v${VERSION}\n`);
for (const t of targets) buildTarget(t);
console.log(`\nDone. Artifacts in ${relative(ROOT, DIST)}/`);
