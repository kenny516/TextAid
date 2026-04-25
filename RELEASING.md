# Releasing TextAid

TextAid follows [Semantic Versioning](https://semver.org/) and
[Keep a Changelog](https://keepachangelog.com/).

The version is **synced across three files** at all times:

- `package.json`            — extension build
- `manifest.json`           — what the browser sees
- `landing/package.json`    — the landing page

Don't edit them by hand. Use the bump script instead.

## 1. Bump the version

```bash
# Explicit version
npm run version:set -- 1.3.0

# Or semver bump
npm run version:set -- patch    # 1.2.0 → 1.2.1
npm run version:set -- minor    # 1.2.0 → 1.3.0
npm run version:set -- major    # 1.2.0 → 2.0.0
```

This rewrites all three manifests in lockstep.

## 2. Update the changelog

Open `CHANGELOG.md` and:

1. Move every entry from `## [Unreleased]` into a new `## [X.Y.Z] - YYYY-MM-DD`
   section right below it.
2. Keep an empty `## [Unreleased]` block at the top for the next cycle.
3. Group changes under `### Added` / `### Changed` / `### Fixed` / `### Removed`.

The release workflow extracts the matching `[X.Y.Z]` block as the release body.

## 3. Commit and tag

```bash
git add -A
git commit -m "Release X.Y.Z"
git tag vX.Y.Z
git push --follow-tags
```

## 4. The `Release` workflow takes over

Pushing a `v*.*.*` tag triggers `.github/workflows/release.yml`, which:

1. Builds `dist/textaid-chrome-X.Y.Z.zip` and `dist/textaid-firefox-X.Y.Z.zip`
2. Also publishes version-less aliases (`textaid-chrome.zip`,
   `textaid-firefox.zip`) so the docs links never break
3. Creates a GitHub Release with the changelog section as the body
4. Attaches both zips as release assets

The landing page's Download buttons point at `releases/latest/download/...`,
so they automatically pick up the new artifacts.

## 5. Submit to the Web Store / AMO (optional)

The same zips work for:

- **Chrome Web Store** — upload `dist/textaid-chrome-X.Y.Z.zip`
- **Firefox AMO** — upload `dist/textaid-firefox-X.Y.Z.zip` (signed automatically)
- **Edge Add-ons** — same as Chromium

## Hotfix flow

For a quick fix on a published release:

```bash
npm run version:set -- patch
# edit CHANGELOG.md
git commit -am "Fix: <what broke>"
git tag vX.Y.Z+1 && git push --follow-tags
```

The release workflow handles the rest.
