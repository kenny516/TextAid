// Popup script for TextAid extension settings (Vercel-inspired Design)
document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const providerToggles = document.querySelectorAll('.toggle-option');
    const apiKeyInput = document.getElementById('apiKey');
    const enableSummaryToggle = document.getElementById('enableSummary');
    const enableContextMenuToggle = document.getElementById('enableContextMenu');
    const enableFloatingToolbarToggle = document.getElementById('enableFloatingToolbar');
    const saveButton = document.getElementById('saveSettings');
    const statusMessage = document.getElementById('statusMessage');
    const connectionStatus = document.getElementById('connectionStatus');

    let currentProvider = 'openai';

    // Initialize
    loadSettings();
    setupEventListeners();

    function setupEventListeners() {
        // Provider toggle buttons
        providerToggles.forEach(toggle => {
            toggle.addEventListener('click', function () {
                const provider = this.dataset.provider;
                selectProvider(provider);
            });
        });

        // API key input
        apiKeyInput.addEventListener('input', validateApiKey);
        apiKeyInput.addEventListener('blur', validateApiKey);

        // Save button
        saveButton.addEventListener('click', saveSettings);

        // Feature toggles
        [enableSummaryToggle, enableContextMenuToggle, enableFloatingToolbarToggle].forEach(toggle => {
            toggle.addEventListener('change', function () {
                this.parentElement.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.parentElement.style.transform = 'scale(1)';
                }, 100);
            });
        });
    }

    function selectProvider(provider) {
        currentProvider = provider;

        // Update UI
        providerToggles.forEach(toggle => {
            toggle.classList.remove('active');
        });
        document.querySelector(`[data-provider="${provider}"]`).classList.add('active');

        // Update API key placeholder and help
        updateApiKeyPlaceholder(provider);
        validateApiKey();
    }

    function updateApiKeyPlaceholder(provider) {
        if (provider === 'openai') {
            apiKeyInput.placeholder = 'sk-proj-...';
        } else if (provider === 'gemini') {
            apiKeyInput.placeholder = 'AIza...';
        }
    }

    function validateApiKey() {
        const apiKey = apiKeyInput.value.trim();

        if (!apiKey) {
            updateConnectionStatus('disconnected', 'No API key provided');
            return false;
        }

        if (currentProvider === 'openai' && !apiKey.startsWith('sk-')) {
            updateConnectionStatus('error', 'Invalid OpenAI key format');
            return false;
        }

        if (currentProvider === 'gemini' && !apiKey.startsWith('AIza')) {
            updateConnectionStatus('error', 'Invalid Gemini key format');
            return false;
        }

        updateConnectionStatus('connected', 'API key format valid');
        return true;
    }

    function updateConnectionStatus(status, message) {
        connectionStatus.className = 'status-indicator';
        connectionStatus.textContent = message;

        if (status === 'connected') {
            connectionStatus.classList.add('status-connected');
        } else if (status === 'error') {
            connectionStatus.classList.add('status-disconnected');
        } else {
            connectionStatus.classList.add('status-disconnected');
        }
    }

    function loadSettings() {
        chrome.storage.sync.get([
            'aiProvider',
            'apiKey',
            'enableSummary',
            'enableContextMenu',
            'enableFloatingToolbar'
        ], function (result) {
            // Set provider
            const provider = result.aiProvider || 'openai';
            selectProvider(provider);

            // Set API key
            if (result.apiKey) {
                apiKeyInput.value = result.apiKey;
                validateApiKey();
            }

            // Set feature toggles
            enableSummaryToggle.checked = result.enableSummary !== false;
            enableContextMenuToggle.checked = result.enableContextMenu !== false;
            enableFloatingToolbarToggle.checked = result.enableFloatingToolbar !== false;
        });
    }

    function saveSettings() {
        if (!validateApiKey()) {
            showStatusMessage('Please provide a valid API key', 'error');
            return;
        }

        const settings = {
            aiProvider: currentProvider,
            apiKey: apiKeyInput.value.trim(),
            enableSummary: enableSummaryToggle.checked,
            enableContextMenu: enableContextMenuToggle.checked,
            enableFloatingToolbar: enableFloatingToolbarToggle.checked
        };

        // Add loading state to button
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';

        chrome.storage.sync.set(settings, function () {
            // Reset button
            saveButton.disabled = false;
            saveButton.textContent = 'Save Settings';

            if (chrome.runtime.lastError) {
                showStatusMessage('Error saving settings', 'error');
            } else {
                showStatusMessage('Settings saved successfully!', 'success');
                updateConnectionStatus('connected', 'Connected');

                // Notify background script
                chrome.runtime.sendMessage({
                    action: 'updateSettings',
                    settings: settings
                });
            }
        });
    }

    function showStatusMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';

        // Auto-hide after 3 seconds
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }
});
