// Debug script pour identifier les problèmes d'affichage TextAid

// Vérifier si l'extension est chargée
console.log('=== DEBUG TEXTAID ===');
console.log('Extension TextAid - Debug script loaded');

// Vérifier si content.css est chargé
function checkCSSLoaded() {
    const testElement = document.createElement('div');
    testElement.className = 'textaid-floating-toolbar';
    testElement.style.display = 'none';
    document.body.appendChild(testElement);

    const computedStyle = window.getComputedStyle(testElement);
    const hasCSS = computedStyle.position === 'absolute';

    console.log('CSS chargé:', hasCSS);
    console.log('Position calculée:', computedStyle.position);
    console.log('Z-index calculé:', computedStyle.zIndex);

    document.body.removeChild(testElement);
    return hasCSS;
}

// Tester la sélection de texte
function testTextSelection() {
    console.log('=== TEST SELECTION ===');

    // Créer un élément de test
    const testDiv = document.createElement('div');
    testDiv.innerHTML = 'Ceci est un texte de test pour TextAid. Sélectionnez-moi !';
    testDiv.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        padding: 20px;
        background: #f0f0f0;
        border: 2px solid #007BFF;
        z-index: 1000000;
        font-family: Arial, sans-serif;
    `;

    document.body.appendChild(testDiv);

    // Ajouter un bouton de test
    const testButton = document.createElement('button');
    testButton.textContent = 'Tester Floating Toolbar';
    testButton.style.cssText = `
        position: fixed;
        top: 100px;
        left: 10px;
        padding: 10px;
        background: #007BFF;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000000;
    `;

    testButton.onclick = function () {
        // Simuler une sélection
        const range = document.createRange();
        range.selectNodeContents(testDiv);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        console.log('Texte sélectionné:', selection.toString());

        // Vérifier si TextAid répond
        const event = new Event('mouseup');
        document.dispatchEvent(event);
    };

    document.body.appendChild(testButton);
}

// Tester la création manuelle du floating toolbar
function testFloatingToolbar() {
    console.log('=== TEST FLOATING TOOLBAR ===');

    // Supprimer les anciens toolbars de test
    const existing = document.querySelectorAll('.textaid-debug-toolbar');
    existing.forEach(el => el.remove());

    const toolbar = document.createElement('div');
    toolbar.className = 'textaid-floating-toolbar textaid-debug-toolbar';
    toolbar.innerHTML = `
        <button class="textaid-btn">📝</button>
        <button class="textaid-btn">✏️</button>
        <button class="textaid-btn">💡</button>
        <button class="textaid-btn">📈</button>
    `;

    // Position fixe pour test
    toolbar.style.cssText += `
        position: fixed !important;
        top: 150px !important;
        left: 10px !important;
        display: flex !important;
    `;

    document.body.appendChild(toolbar);
    console.log('Floating toolbar de test créé:', toolbar);

    return toolbar;
}

// Tester la modal
function testModal() {
    console.log('=== TEST MODAL ===');

    const modal = document.createElement('div');
    modal.className = 'textaid-modal';
    modal.innerHTML = `
        <div class="textaid-modal-content">
            <button class="textaid-close">&times;</button>
            <div style="padding: 20px;">
                <h3>Test Modal TextAid</h3>
                <p>Cette modal de test utilise les nouvelles classes CSS.</p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    console.log('Modal de test créée:', modal);

    // Fermer au clic
    modal.onclick = function (e) {
        if (e.target === modal || e.target.classList.contains('textaid-close')) {
            modal.remove();
        }
    };

    return modal;
}

// Lancer les tests
setTimeout(() => {
    console.log('=== DEBUT DES TESTS ===');

    checkCSSLoaded();
    testTextSelection();

    // Ajouter boutons de test
    const testPanel = document.createElement('div');
    testPanel.style.cssText = `
        position: fixed;
        top: 200px;
        left: 10px;
        padding: 15px;
        background: white;
        border: 2px solid #007BFF;
        border-radius: 8px;
        z-index: 1000000;
        font-family: Arial, sans-serif;
    `;

    testPanel.innerHTML = `
        <div style="margin-bottom: 10px; font-weight: bold;">Tests TextAid Debug</div>
        <button onclick="testFloatingToolbar()" style="margin: 5px; padding: 8px; background: #28A745; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Toolbar</button>
        <button onclick="testModal()" style="margin: 5px; padding: 8px; background: #DC3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Modal</button>
        <button onclick="this.parentElement.remove()" style="margin: 5px; padding: 8px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Fermer</button>
    `;

    // Exposer les fonctions globalement pour les boutons
    window.testFloatingToolbar = testFloatingToolbar;
    window.testModal = testModal;

    document.body.appendChild(testPanel);

}, 1000);

console.log('Debug script TextAid initialisé');
