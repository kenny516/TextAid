import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";

it("bumps manifests and lockfile versions without changing locked dependencies", () => {
  const root = mkdtempSync(join(tmpdir(), "textaid-version-"));
  try {
    mkdirSync(join(root, "scripts"));
    mkdirSync(join(root, "landing"));
    copyFileSync(
      new URL("../scripts/version.mjs", import.meta.url),
      join(root, "scripts/version.mjs"),
    );
    const manifests = ["package.json", "manifest.json", "landing/package.json"];
    const locks = ["package-lock.json", "landing/package-lock.json"];
    const dependency = { version: "2.0.0", integrity: "unchanged" };
    for (const path of manifests) {
      writeFileSync(join(root, path), JSON.stringify({ version: "1.4.0" }));
    }
    for (const path of locks) {
      writeFileSync(
        join(root, path),
        JSON.stringify({
          version: "1.3.0",
          lockfileVersion: 3,
          packages: {
            "": { version: "1.3.0", name: "textaid" },
            "node_modules/example": dependency,
          },
        }),
      );
    }
    execFileSync(process.execPath, [join(root, "scripts/version.mjs"), "patch"]);
    for (const path of [...manifests, ...locks]) {
      const json = JSON.parse(readFileSync(join(root, path), "utf8"));
      expect(json.version).toBe("1.4.1");
      if (locks.includes(path)) {
        expect(json.packages[""].version).toBe("1.4.1");
        expect(json.packages[""].name).toBe("textaid");
        expect(json.packages["node_modules/example"]).toEqual(dependency);
      }
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
