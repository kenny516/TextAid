// Content script for TextAid extension
class TextAidContent {
    constructor() {
        this.isEnabled = true;
        this.settings = {};
        this.suggestionTimeout = null;
        this.lastSuggestionLength = 0;
        this.floatingToolbar = null;
        this.resultModal = null;
        this.currentSelectedText = ''; // Store current selection

        this.init();
    }

    init() {
        // Load settings
        this.loadSettings();

        // Set up event listeners
        this.setupEventListeners();

        // Listen for messages from background script
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
        });

        console.log('TextAid content script initialized on:', window.location.hostname);
    }

    loadSettings() {
        chrome.storage.sync.get([
            'enableSummary',
            'enableSuggestions',
            'enableContextMenu',
            'suggestionStyle',
            'aggressiveness'
        ], (result) => {
            this.settings = result;
            this.setupTypingListeners(); // Re-setup when settings change
        });
    }

    setupEventListeners() {
        // Text selection for floating toolbar
        document.addEventListener('mouseup', (e) => {
            // Délai pour permettre à la sélection de se stabiliser
            setTimeout(() => this.handleTextSelection(e), 50);
        });
        document.addEventListener('keyup', (e) => {
            setTimeout(() => this.handleTextSelection(e), 50);
        });

        // Hide toolbar when clicking elsewhere
        document.addEventListener('mousedown', (e) => {
            if (this.floatingToolbar && !this.floatingToolbar.contains(e.target)) {
                // Ne pas cacher immédiatement pour permettre le clic sur les boutons
                setTimeout(() => {
                    if (this.floatingToolbar && !this.floatingToolbar.contains(e.target)) {
                        this.hideFloatingToolbar();
                    }
                }, 100);
            }
        });
    }

    setupTypingListeners() {
        if (!this.settings.enableSuggestions) return;

        // Find all text inputs and textareas
        const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea, [contenteditable="true"]');

        textInputs.forEach(input => {
            // Avoid adding listeners multiple times
            if (input.dataset.textaidEnabled) return;
            input.dataset.textaidEnabled = 'true';

            // Skip password fields for security
            if (input.type === 'password') return;

            input.addEventListener('input', (e) => this.handleTyping(e));
            input.addEventListener('focus', (e) => this.handleFocus(e));
            input.addEventListener('blur', (e) => this.handleBlur(e));
        });

        // Watch for dynamically added inputs
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const newInputs = node.querySelectorAll ?
                            node.querySelectorAll('input[type="text"], input[type="email"], textarea, [contenteditable="true"]') :
                            [];
                        newInputs.forEach(input => {
                            if (!input.dataset.textaidEnabled && input.type !== 'password') {
                                input.dataset.textaidEnabled = 'true';
                                input.addEventListener('input', (e) => this.handleTyping(e));
                                input.addEventListener('focus', (e) => this.handleFocus(e));
                                input.addEventListener('blur', (e) => this.handleBlur(e));
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    handleTextSelection(e) {
        console.log('TextAid: handleTextSelection called');
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        console.log('TextAid: Selected text:', selectedText, 'Length:', selectedText.length);

        if (selectedText.length > 10) { // Only show for meaningful selections
            this.currentSelectedText = selectedText; // Store the selection
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            console.log('TextAid: Showing floating toolbar at:', rect);
            this.showFloatingToolbar(rect, selectedText);
        } else {
            console.log('TextAid: Hiding floating toolbar (text too short)');
            this.currentSelectedText = '';
            this.hideFloatingToolbar();
        }
    }

    showFloatingToolbar(rect, selectedText) {
        console.log('TextAid: showFloatingToolbar called with rect:', rect, 'text:', selectedText);
        this.hideFloatingToolbar(); // Remove existing toolbar

        this.floatingToolbar = document.createElement('div');
        this.floatingToolbar.className = 'textaid-floating-toolbar';
        this.floatingToolbar.innerHTML = `
            <button class="textaid-btn" data-action="summarize">📝 Summarize</button>
            <button class="textaid-btn" data-action="rephrase">✏️ Rephrase</button>
            <button class="textaid-btn" data-action="ideas">💡 Ideas</button>
            <button class="textaid-btn" data-action="expand">📈 Expand</button>
        `;

        // Position toolbar avec styles agressifs pour assurer l'affichage
        this.floatingToolbar.style.cssText = `
            position: absolute !important;
            top: ${window.scrollY + rect.top - 56}px !important;
            left: ${window.scrollX + rect.left}px !important;
            z-index: 2147483647 !important;
            display: flex !important;
            pointer-events: auto !important;
            visibility: visible !important;
            opacity: 1 !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(16px) !important;
            border: 1.5px solid #e5e5e5 !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10) !important;
            padding: 12px !important;
            gap: 12px !important;
            align-items: center !important;
            box-sizing: border-box !important;
        `;

        document.body.appendChild(this.floatingToolbar);
        console.log('TextAid: Floating toolbar added to DOM:', this.floatingToolbar);

        // Forcer les styles des boutons pour s'assurer qu'ils s'affichent
        const buttons = this.floatingToolbar.querySelectorAll('.textaid-btn');
        buttons.forEach(button => {
            button.style.cssText = `
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                min-width: 44px !important;
                height: auto !important;
                padding: 6px 12px !important;
                gap: 8px !important;
                border: none !important;
                border-radius: 8px !important;
                background: rgba(0,0,0,0.04) !important;
                color: var(--textaid-color-primary, #2E2E2E) !important;
                font-size: 14px !important;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                cursor: pointer !important;
                transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1) !important;
                box-sizing: border-box !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
                z-index: 2147483647 !important;
                white-space: nowrap !important;
            `;

            // Hover effects using JS-friendly non-!important toggles
            button.addEventListener('mouseenter', () => {
                button.style.background = 'var(--textaid-color-accent, #007BFF)';
                button.style.color = 'var(--textaid-color-white, #fff)';
                button.style.transform = 'translateY(-1px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(0,0,0,0.04)';
                button.style.color = 'var(--textaid-color-primary, #2E2E2E)';
                button.style.transform = 'translateY(0)';
            });
        });

        // Add click handlers avec preventDefault pour garder la sélection
        this.floatingToolbar.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Empêche la perte de sélection
        });

        this.floatingToolbar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('TextAid: Floating toolbar clicked:', e.target);
            if (e.target.classList.contains('textaid-btn')) {
                const action = e.target.dataset.action;
                console.log('TextAid: Processing action:', action, 'with text:', this.currentSelectedText);
                this.processSelectedText(this.currentSelectedText, action);
                this.hideFloatingToolbar();
            }
        });
    }

    hideFloatingToolbar() {
        if (this.floatingToolbar) {
            this.floatingToolbar.remove();
            this.floatingToolbar = null;
        }
    }

    handleTyping(e) {
        if (!this.settings.enableSuggestions) return;

        const input = e.target;
        const text = this.getInputText(input);

        if (!text || text.length < 3) return;

        // Clear existing timeout
        if (this.suggestionTimeout) {
            clearTimeout(this.suggestionTimeout);
        }

        // Determine suggestion frequency based on aggressiveness
        const wordCount = text.split(' ').length;
        const threshold = {
            'high': 3,
            'medium': 5,
            'low': 10
        }[this.settings.aggressiveness] || 5;

        if (wordCount % threshold !== 0) return;

        // Debounce suggestions
        this.suggestionTimeout = setTimeout(() => {
            this.getSuggestion(input, text);
        }, 500);
    }

    handleFocus(e) {
        // Could add focus-specific logic here
    }

    handleBlur(e) {
        // Hide any active suggestions
        this.hideSuggestion(e.target);
    }

    getInputText(input) {
        if (input.isContentEditable) {
            return input.textContent || '';
        }
        return input.value || '';
    }

    async getSuggestion(input, text) {
        // Don't suggest if text hasn't changed much
        if (Math.abs(text.length - this.lastSuggestionLength) < 5) return;
        this.lastSuggestionLength = text.length;

        try {
            const response = await chrome.runtime.sendMessage({
                action: 'getSuggestion',
                text: text,
                context: input.placeholder || 'text'
            });

            if (response && response.suggestion) {
                this.showSuggestion(input, response.suggestion);
            }
        } catch (error) {
            console.error('Error getting suggestion:', error);
        }
    }

    showSuggestion(input, suggestion) {
        this.hideSuggestion(input);

        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'textaid-suggestion';
        suggestionDiv.innerHTML = `
            <div class="textaid-suggestion-text">${suggestion}</div>
            <div class="textaid-suggestion-actions">
                <button class="textaid-accept">Accept</button>
                <button class="textaid-dismiss">×</button>
            </div>
        `;

        // Position suggestion
        const rect = input.getBoundingClientRect();
        suggestionDiv.style.position = 'absolute';
        suggestionDiv.style.top = (window.scrollY + rect.bottom + 5) + 'px';
        suggestionDiv.style.left = (window.scrollX + rect.left) + 'px';
        suggestionDiv.style.zIndex = '10000';

        document.body.appendChild(suggestionDiv);

        // Add event handlers
        suggestionDiv.querySelector('.textaid-accept').addEventListener('click', () => {
            this.acceptSuggestion(input, suggestion);
            this.hideSuggestion(input);
        });

        suggestionDiv.querySelector('.textaid-dismiss').addEventListener('click', () => {
            this.hideSuggestion(input);
        });

        // Store reference for cleanup
        input.textaidSuggestion = suggestionDiv;
    }

    hideSuggestion(input) {
        if (input.textaidSuggestion) {
            input.textaidSuggestion.remove();
            input.textaidSuggestion = null;
        }
    }

    acceptSuggestion(input, suggestion) {
        const currentText = this.getInputText(input);
        const newText = currentText + ' ' + suggestion;

        if (input.isContentEditable) {
            input.textContent = newText;
        } else {
            input.value = newText;
        }

        // Trigger input event for frameworks that need it
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // Focus and move cursor to end
        input.focus();
        if (input.setSelectionRange) {
            input.setSelectionRange(newText.length, newText.length);
        }
    }

    processSelectedText(text, action) {
        let prompt;

        switch (action) {
            case 'summarize':
                prompt = `Summarize this text concisely: ${text}`;
                break;
            case 'rephrase':
                prompt = `Rephrase this text professionally: ${text}`;
                break;
            case 'ideas':
                prompt = `Generate 3-5 ideas based on this text: ${text}`;
                break;
            case 'expand':
                prompt = `Expand on this text with more detail: ${text}`;
                break;
            default:
                return;
        }

        this.showProcessing(action);

        chrome.runtime.sendMessage({
            action: 'processText',
            prompt: prompt,
            type: action
        });
    }

    showProcessing(action) {
        this.showModal(`
            <div class="textaid-processing">
                <div class="textaid-spinner"></div>
                <p>Processing ${action}...</p>
            </div>
        `);
    }

    showModal(content) {
        this.hideModal();

        this.resultModal = document.createElement('div');
        this.resultModal.className = 'textaid-modal';

        this.resultModal.innerHTML = `
            <div class="textaid-modal-content">
                <button class="textaid-close">&times;</button>
                ${content}
            </div>
        `;

        document.body.appendChild(this.resultModal);
        console.log('Modal added to body with new Vercel design. Modal element:', this.resultModal);

        // Forcer les styles de la modal pour s'assurer qu'elle s'affiche
        this.resultModal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.6) !important;
            backdrop-filter: blur(8px) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 2147483647 !important;
            padding: 24px !important;
            box-sizing: border-box !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        `;

        // Forcer les styles du contenu de la modal
        const modalContent = this.resultModal.querySelector('.textaid-modal-content');
        if (modalContent) {
            modalContent.style.cssText = `
                background: white !important;
                border-radius: 12px !important;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                max-width: 500px !important;
                max-height: 80vh !important;
                width: 100% !important;
                overflow: hidden !important;
                position: relative !important;
                padding: 20px !important;
                box-sizing: border-box !important;
                visibility: visible !important;
                opacity: 1 !important;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            `;
        }

        // Forcer les styles du bouton de fermeture
        const closeButton = this.resultModal.querySelector('.textaid-close');
        if (closeButton) {
            closeButton.style.cssText = `
                position: absolute !important;
                top: 16px !important;
                right: 16px !important;
                width: 32px !important;
                height: 32px !important;
                border: none !important;
                background: #f5f5f5 !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 18px !important;
                color: #737373 !important;
                font-family: Arial, sans-serif !important;
                z-index: 2147483647 !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
                transition: all 150ms ease !important;
            `;

            closeButton.addEventListener('mouseenter', () => {
                closeButton.style.background = '#e5e5e5 !important';
            });

            closeButton.addEventListener('mouseleave', () => {
                closeButton.style.background = '#f5f5f5 !important';
            });
        }

        // Close handlers
        this.resultModal.querySelector('.textaid-close').addEventListener('click', () => {
            this.hideModal();
        });

        this.resultModal.addEventListener('click', (e) => {
            if (e.target === this.resultModal) {
                this.hideModal();
            }
        });
    }

    hideModal() {
        if (this.resultModal) {
            this.resultModal.remove();
            this.resultModal = null;
        }
    }

    handleMessage(message, sender, sendResponse) {
        console.log('TextAid content script received message:', message.action);

        switch (message.action) {
            case 'showProcessing':
                this.showProcessing(message.menuAction);
                break;

            case 'showResult':
                if (message.error) {
                    console.log('Showing error:', message.error);
                    this.showModal(`
                        <div class="textaid-error">
                            <h3>Error</h3>
                            <p>${message.error}</p>
                        </div>
                    `);
                } else {
                    console.log('Showing result:', message.result ? message.result.substring(0, 100) + '...' : 'empty');
                    this.showModal(`
                        <div class="textaid-result">
                            <h3>Result</h3>
                            <div class="textaid-result-text">${message.result}</div>
                            <div class="textaid-result-actions">
                                <button class="textaid-copy">Copy to Clipboard</button>
                            </div>
                        </div>
                    `);

                    // Add copy functionality
                    const copyBtn = this.resultModal.querySelector('.textaid-copy');
                    copyBtn.addEventListener('click', () => {
                        navigator.clipboard.writeText(message.result).then(() => {
                            copyBtn.textContent = 'Copied!';
                            setTimeout(() => copyBtn.textContent = 'Copy to Clipboard', 2000);
                        });
                    });
                }
                break;
        }
    }
}

// Initialize content script when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new TextAidContent());
} else {
    new TextAidContent();
}
