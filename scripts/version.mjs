#!/usr/bin/env node
/**
 * Bumps the TextAid version across every manifest in sync.
 *
 * Usage:
 *   npm run version:set -- 1.3.0
 *   npm run version:set -- patch | minor | major
 *
 * Updates:
 *   - package.json
 *   - manifest.json
 *   - landing/package.json
 *
 * Does NOT git commit or git tag — that lives in RELEASING.md so we keep
 * the bump and the changelog edit in the same intentional commit.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const TARGETS = [
    { path: "package.json", label: "extension" },
    { path: "manifest.json", label: "manifest" },
    { path: "landing/package.json", label: "landing" },
];

function readJson(p) {
    return JSON.parse(readFileSync(resolve(ROOT, p), "utf8"));
}
function writeJson(p, data) {
    writeFileSync(resolve(ROOT, p), JSON.stringify(data, null, 2) + "\n");
}

function parseSemver(v) {
    const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
    if (!m) throw new Error(`Not a valid semver: ${v}`);
    return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function bump(current, kind) {
    const [maj, min, pat] = parseSemver(current);
    if (kind === "major") return `${maj + 1}.0.0`;
    if (kind === "minor") return `${maj}.${min + 1}.0`;
    if (kind === "patch") return `${maj}.${min}.${pat + 1}`;
    parseSemver(kind);
    return kind;
}

const arg = process.argv[2];
if (!arg) {
    console.error("Usage: npm run version:set -- <semver | patch | minor | major>");
    process.exit(1);
}

const root = readJson("package.json");
const current = root.version;
const next = bump(current, arg);

console.log(`TextAid ${current} → ${next}\n`);

for (const t of TARGETS) {
    const j = readJson(t.path);
    j.version = next;
    writeJson(t.path, j);
    console.log(`  ✓ ${t.label.padEnd(10)} ${t.path}`);
}

console.log(
    `\nNext steps:\n  1. Update CHANGELOG.md (move [Unreleased] entries to [${next}])\n  2. git commit -am "Release ${next}"\n  3. git tag v${next} && git push --follow-tags`,
);
