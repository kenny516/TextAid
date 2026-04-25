# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-04-25

### Added
- Donation channels: GitHub Sponsors, Buy Me a Coffee, Ko-fi, surfaced via
  a new **Support** section on the landing and a `.github/FUNDING.yml`
  sponsor button on the repo.
- Live **GitHub stars** badge in the landing navbar (cached 1h in
  `localStorage`, falls back gracefully if the API rate-limits).
- Comprehensive `/docs` page on the landing: install per browser, API key
  setup, shortcuts, FAQ, troubleshooting — with sticky sidebar nav and
  scroll-spy.
- Download section with one card per browser family (Chromium, Gecko,
  Safari, Source) and explicit per-browser steps.
- `npm run version:set` script that bumps `package.json`, `manifest.json`
  and `landing/package.json` in lockstep.
- `RELEASING.md` documenting the full release flow.
- `.github/workflows/release.yml` — pushing a `vX.Y.Z` tag now builds both
  browser zips, extracts the matching CHANGELOG section, and publishes a
  GitHub Release with version-pinned and version-less artifact aliases.

### Changed
- Adopted a unified PNG icon (`icons/icon-textaid.png`) across the
  extension manifest, popup, landing favicon, navbar and footer logos.
- Landing mockup now mirrors the real extension (rounded toolbar, modal
  result card with status header).
- Synced versioning: every manifest now reports `1.2.0`.

### Fixed
- Toolbar **More** dropdown disappearing on click — `mouseup` selection
  handler now ignores events that originate inside `.textaid-root`.
- Native `<select>` widgets in the popup looked broken on Windows. They
  were replaced by a styled `CustomSelect` component for model and tone.
- API key **Test** errors are now shown inline in a red-tinted card
  beneath the status row, instead of being hidden in a tooltip.
- Invisible primary button labels on the Download cards (the global
  `a { color: inherit }` rule was overriding Tailwind utilities — fixed
  with `!text-*` prefixes).

## [1.1.0] - 2025

### Changed
- Full visual rewrite to match the new TextAid landing page (dark monochrome,
  Geist font, hairline borders, white accent — Raycast/Linear/Apple feel).
- Stripped all `element.style.cssText` blocks from `content.js`; injected UI now
  relies entirely on `content.css` with double-class specificity and `all: revert`.
- Removed all emoji from the UI; replaced with inline lucide-style SVG icons.
- Default Gemini model bumped to `gemini-2.0-flash`.
- Default for inline suggestions flipped to OFF.

### Added
- Streaming responses (SSE) for both OpenAI and Gemini.
- "Replace selection" and "Insert below" actions in the result modal.
- "Test" button in the popup that pings the provider with the current API key.
- Local history of the last 20 results, surfaced as 5 most-recent rows in popup.
- Keyboard shortcut `Ctrl/Cmd + Shift + Space` to summon the toolbar on the
  current selection.
- Custom prompt action and a "more" dropdown (Translate, Fix grammar, Make
  formal, Make casual, Custom prompt…).
- Friendlier error messages for 401/403/429 and network failures.
- 128px extension icon.

## [2.0.0] - 2025-08-23

### 🎨 Ajouté

- **Design System Vercel** : Interface moderne avec palette de couleurs professionnelle
- **Glassmorphism Effects** : Floating toolbar avec backdrop-filter
- **Police Inter** : Typography moderne et lisible
- **CSS Custom Properties** : Système de design cohérent
- **Animations Fluides** : Transitions et micro-interactions
- **Modales Modernes** : Interface épurée avec glassmorphism
- **Debug Tools** : Pages de test et outils de diagnostic

### 🔄 Modifié

- **Interface Popup** : Redesign complet avec toggles modernes
- **Floating Toolbar** : Nouveau design avec effets visuels
- **Système de Modales** : Interface utilisateur améliorée
- **Code JavaScript** : Optimisation et nettoyage
- **Styles CSS** : Refactoring complet avec design system

### 🐛 Corrigé

- **Problèmes d'affichage** : Styles inline agressifs pour compatibilité
- **Z-index conflicts** : Utilisation de z-index maximum (2147483647)
- **Compatibilité cross-site** : Fonctionnement garanti sur tous les sites
- **Boutons invisibles** : Forçage d'affichage avec cssText

### 🗑️ Supprimé

- **Anciens styles** : Suppression du CSS legacy
- **Code dupliqué** : Nettoyage et refactoring

## [1.0.0] - 2025-08-22

### 🎨 Ajouté

- **Extension Chrome** : Structure de base Manifest V3
- **Multi-AI Support** : OpenAI, Claude, Gemini, Ollama
- **Text Processing** : Summarize, Rephrase, Ideas, Expand
- **Floating Toolbar** : Interface de sélection de texte
- **Popup Settings** : Configuration des fournisseurs IA
- **Context Menu** : Intégration menu clic-droit
- **Real-time Suggestions** : Auto-complétion intelligente

### 🔧 Technique

- **Service Worker** : background.js pour API calls
- **Content Script** : injection dans les pages web
- **Storage API** : Sauvegarde sécurisée des paramètres
- **Chrome APIs** : Utilisation des APIs extension

## [Non publié]

### 🚀 Prochaines fonctionnalités

- **Multi-language Support** : Support des langues multiples
- **Site-specific Integration** : Google Docs, Gmail
- **Voice Input** : Entrée vocale
- **Firefox Compatibility** : Support de Firefox
- **Advanced AI Features** : Fonctionnalités IA avancées

---

**Légende**

- 🎨 **Ajouté** : Nouvelles fonctionnalités
- 🔄 **Modifié** : Changements de fonctionnalités existantes
- 🐛 **Corrigé** : Corrections de bugs
- 🗑️ **Supprimé** : Fonctionnalités supprimées
- 🔧 **Technique** : Améliorations techniques
- 🚀 **Prochaines** : Fonctionnalités planifiées
