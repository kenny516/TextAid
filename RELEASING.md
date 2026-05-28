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

## 5. Automated store publishing

Pushing a `v*.*.*` tag also triggers the store publish workflows:

### Firefox AMO (`publish-amo.yml`)

Signs and submits the Firefox build to addons.mozilla.org automatically.

**Required repository secrets** (Settings → Secrets and variables → Actions):

| Secret | Where to get it |
|--------|----------------|
| `AMO_JWT_ISSUER` | https://addons.mozilla.org/developers/addon/api/key/ |
| `AMO_JWT_SECRET` | same page |

### Microsoft Edge Add-ons (`publish-edge.yml`)

Uploads and publishes the Chrome build to the Edge Partner Center.

**Required repository secrets:**

| Secret | Where to get it |
|--------|----------------|
| `EDGE_PRODUCT_ID` | Edge Partner Center → your product URL |
| `EDGE_CLIENT_ID` | Azure AD app registration |
| `EDGE_CLIENT_SECRET` | Azure AD app → Certificates & secrets |
| `EDGE_ACCESS_TOKEN_URL` | Azure AD app → Overview → Endpoints |

Setup guide: https://learn.microsoft.com/microsoft-edge/extensions-chromium/publish/api/using-addons-api

**First-time AMO submission:** you must first create the listing manually
at https://addons.mozilla.org/developers/submit/ before the CI workflow
can sign and update it.

**First-time Edge submission:** create the product manually at
https://partner.microsoft.com/dashboard/microsoftedge/overview and note
the product ID before enabling the workflow.

## 6. Generate store assets

Before submitting to stores, generate the required promo tiles and icons:

```bash
npm install          # installs sharp and canvas (new dev deps)
npm run assets       # writes to store-assets/
```

Then capture screenshots manually — see `store-assets/SCREENSHOT_GUIDE.md`.

## Hotfix flow

For a quick fix on a published release:

```bash
npm run version:set -- patch
# edit CHANGELOG.md
git commit -am "Fix: <what broke>"
git tag vX.Y.Z+1 && git push --follow-tags
```

The release workflow handles the rest.
