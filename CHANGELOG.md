# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
