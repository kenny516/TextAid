# 🚀 Guide de Développement - TextAid

## 🛠️ Configuration de l'Environnement

### Prérequis

- **Git** : Version 2.40+
- **Chrome** : Version 100+ avec mode développeur
- **Éditeur** : VS Code recommandé avec extensions :
  - Git Graph
  - Chrome Extension Dev Tools
  - Prettier
  - ESLint

### Installation

```bash
# Cloner le repository
git clone https://github.com/kenny516/textaid-extension.git
cd textaid-extension

# Vérifier l'installation
git status
```

## 🌿 Workflow Git

### Structure des Branches

```
main (production)
├── dev (développement)
│   ├── feat/design-system
│   ├── feat/ai-integration
│   ├── feat/popup-interface
│   └── fix/display-issues
└── hotfix/critical-bug
```

### Conventions de Nommage

#### Branches

- `feat/` : Nouvelles fonctionnalités
- `fix/` : Corrections de bugs
- `hotfix/` : Corrections urgentes production
- `docs/` : Documentation uniquement
- `refactor/` : Refactoring sans nouvelles fonctionnalités
- `test/` : Ajout ou modification de tests

#### Commits (Conventional Commits)

```bash
feat: ajouter floating toolbar avec glassmorphism
fix: corriger l'affichage des modales sur Firefox
docs: mettre à jour le guide d'installation
style: appliquer le design system Vercel
refactor: optimiser le code de content.js
test: ajouter tests pour les fournisseurs IA
```

### Processus de Développement

#### 1. Démarrer une Nouvelle Fonctionnalité

```bash
# Mettre à jour dev
git checkout dev
git pull origin dev

# Créer la branche de fonctionnalité
git checkout -b feat/nom-fonctionnalite

# Vérifier la branche
git branch
```

#### 2. Développement

```bash
# Développer la fonctionnalité
# ... coding ...

# Ajouter les fichiers modifiés
git add .

# Commit avec message descriptif
git commit -m "feat: description de la fonctionnalité"

# Push réguliers pour sauvegarder
git push origin feat/nom-fonctionnalite
```

#### 3. Pull Request

```bash
# S'assurer que dev est à jour
git checkout dev
git pull origin dev

# Rebaser la branche si nécessaire
git checkout feat/nom-fonctionnalite
git rebase dev

# Push final
git push origin feat/nom-fonctionnalite
```

Ensuite, créer la PR sur GitHub :

- Base : `dev`
- Compare : `feat/nom-fonctionnalite`
- Template de description (voir ci-dessous)

## 📋 Template Pull Request

```markdown
## 🎯 Description

Brève description de la fonctionnalité ou correction

## ✅ Type de Changement

- [ ] 🐛 Bug fix (correction non-breaking)
- [ ] ✨ Nouvelle fonctionnalité (changement non-breaking)
- [ ] 💥 Breaking change (correction ou fonctionnalité breaking)
- [ ] 📚 Documentation uniquement

## 🧪 Tests Effectués

- [ ] Tests manuels sur Chrome
- [ ] Tests de régression
- [ ] Tests sur différents sites web
- [ ] Vérification du design system

## 📱 Screenshots

[Ajouter des screenshots si applicable]

## 🔗 Issues Liées

Closes #123
Relates to #456

## ✅ Checklist

- [ ] Mon code suit les guidelines du projet
- [ ] J'ai effectué une auto-review
- [ ] J'ai commenté les parties complexes
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de warnings
- [ ] J'ai testé sur plusieurs sites web
```

## 🧪 Tests et Validation

### Tests Manuels

1. **Chargement Extension**

```bash
# Recharger l'extension
powershell -ExecutionPolicy Bypass -File "reload-extension.ps1"
```

2. **Tests Fonctionnels**

- Ouvrir `debug-test.html`
- Tester chaque fonctionnalité
- Vérifier sur différents sites (Google, GitHub, etc.)

3. **Tests Design**

- Vérifier le design system
- Tester les animations
- Contrôler la compatibilité mobile

### Debug et Dépannage

#### Console Chrome DevTools

```javascript
// Vérifier le chargement de l'extension
console.log("TextAid loaded:", !!window.textAid);

// Vérifier les styles CSS
getComputedStyle(document.querySelector(".textaid-floating-toolbar"));
```

#### Erreurs Communes

1. **Extension non chargée**

   - Vérifier le manifest.json
   - Recharger l'extension
   - Vérifier les permissions

2. **Styles non appliqués**

   - Forcer le rechargement CSS
   - Vérifier les conflits de styles
   - Utiliser les styles inline si nécessaire

3. **API non fonctionnelles**
   - Vérifier les clés API
   - Contrôler les quotas
   - Vérifier la connectivité réseau

## 📦 Release et Déploiement

### Préparation Release

```bash
# Mettre à jour main avec dev
git checkout main
git pull origin main
git merge dev

# Tag de version
git tag -a v2.0.0 -m "Release v2.0.0 - Design Vercel"
git push origin v2.0.0

# Push vers main
git push origin main
```

### Génération Package

```bash
# Créer le package pour Chrome Web Store
# (à automatiser avec script)
zip -r textaid-v2.0.0.zip . -x "*.git*" "docs/*" "*.md" "debug-*"
```

## 🔧 Configuration VS Code

### Extensions Recommandées

```json
{
  "recommendations": [
    "ms-vscode.vscode-git-graph",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ritwickdey.liveserver",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Settings

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "git.autofetch": true,
  "git.confirmSync": false
}
```

## 🎯 Bonnes Pratiques

### Code Quality

- **Noms explicites** : Variables et fonctions descriptives
- **Commentaires** : Expliquer le "pourquoi", pas le "quoi"
- **Modularité** : Fonctions courtes et spécialisées
- **Consistency** : Suivre les conventions établies

### Git Workflow

- **Commits atomiques** : Un changement = un commit
- **Messages clairs** : Décrire l'impact du changement
- **Branches courtes** : Merger rapidement
- **Historique propre** : Rebase avant merge si nécessaire

### Testing

- **Test early, test often** : Tester à chaque modification
- **Cross-browser** : Vérifier sur différents navigateurs
- **Real conditions** : Tester sur vrais sites web
- **Edge cases** : Tester les cas limites

---

## 🆘 Support

### Problèmes Communs

- [Issues GitHub](https://github.com/kenny516/textaid-extension/issues)
- Documentation technique dans `/docs`
- Changelog pour historique des modifications

### Contact Développement

- **GitHub** : [@kenny516](https://github.com/kenny516)
- **Issues** : Créer un ticket sur GitHub
- **Discussions** : GitHub Discussions du projet
