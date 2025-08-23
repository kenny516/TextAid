// Background script for TextAid extension
class TextAidBackground {
    constructor() {
        this.settings = {
            enableSummary: true,
            enableSuggestions: true,
            enableContextMenu: true,
            suggestionStyle: 'professional',
            aggressiveness: 'medium'
        };

        this.init();
    }

    init() {
        // Load settings on startup
        this.loadSettings();

        // Set up context menus
        this.setupContextMenus();

        // Listen for messages from content script and popup
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keeps the message channel open for async responses
        });

        // Handle extension installation
        chrome.runtime.onInstalled.addListener(() => {
            console.log('TextAid extension installed');
            this.setupContextMenus();
        });
    }

    loadSettings() {
        chrome.storage.sync.get([
            'aiProvider',
            'apiKey',
            'enableSummary',
            'enableSuggestions',
            'enableContextMenu',
            'suggestionStyle',
            'aggressiveness'
        ], (result) => {
            console.log('Raw storage result:', result);

            this.settings = {
                aiProvider: result.aiProvider || 'openai',
                apiKey: result.apiKey || '',
                enableSummary: result.enableSummary !== false, // default true
                enableSuggestions: result.enableSuggestions !== false, // default true  
                enableContextMenu: result.enableContextMenu !== false, // default true
                suggestionStyle: result.suggestionStyle || 'professional',
                aggressiveness: result.aggressiveness || 'medium'
            };

            console.log('TextAid settings loaded:', {
                aiProvider: this.settings.aiProvider,
                hasApiKey: !!this.settings.apiKey,
                apiKeyStart: this.settings.apiKey ? this.settings.apiKey.substring(0, 7) + '...' : 'none',
                enableSummary: this.settings.enableSummary,
                enableContextMenu: this.settings.enableContextMenu
            });
            this.setupContextMenus(); // Update menus when settings change
        });
    }

    setupContextMenus() {
        // Remove existing menus
        chrome.contextMenus.removeAll(() => {
            console.log('TextAid setting up context menus, enableContextMenu:', this.settings.enableContextMenu);

            if (!this.settings.enableContextMenu) {
                console.log('Context menus disabled in settings');
                return;
            }

            try {
                // Create main menu
                chrome.contextMenus.create({
                    id: 'textaid-main',
                    title: 'TextAid',
                    contexts: ['selection']
                });
                console.log('Created main TextAid context menu');

                // Summarize option
                if (this.settings.enableSummary) {
                    chrome.contextMenus.create({
                        id: 'textaid-summarize',
                        parentId: 'textaid-main',
                        title: 'Summarize Selected Text',
                        contexts: ['selection']
                    });
                    console.log('Created summarize menu');
                }

                // Rephrase options
                chrome.contextMenus.create({
                    id: 'textaid-rephrase',
                    parentId: 'textaid-main',
                    title: 'Rephrase',
                    contexts: ['selection']
                });

                chrome.contextMenus.create({
                    id: 'textaid-rephrase-professional',
                    parentId: 'textaid-rephrase',
                    title: 'Make Professional',
                    contexts: ['selection']
                });

                chrome.contextMenus.create({
                    id: 'textaid-rephrase-casual',
                    parentId: 'textaid-rephrase',
                    title: 'Make Casual',
                    contexts: ['selection']
                });

                chrome.contextMenus.create({
                    id: 'textaid-rephrase-concise',
                    parentId: 'textaid-rephrase',
                    title: 'Make Concise',
                    contexts: ['selection']
                });

                // Generate ideas
                chrome.contextMenus.create({
                    id: 'textaid-ideas',
                    parentId: 'textaid-main',
                    title: 'Generate Ideas',
                    contexts: ['selection']
                });

                // Expand text
                chrome.contextMenus.create({
                    id: 'textaid-expand',
                    parentId: 'textaid-main',
                    title: 'Expand Text',
                    contexts: ['selection']
                });

                console.log('All context menus created successfully');

            } catch (error) {
                console.error('Error creating context menus:', error);
            }
        });

        // Handle context menu clicks
        chrome.contextMenus.onClicked.addListener((info, tab) => {
            this.handleContextMenuClick(info, tab);
        });
    }

    handleContextMenuClick(info, tab) {
        console.log('TextAid context menu clicked:', info.menuItemId, 'on tab:', tab.id);

        const selectedText = info.selectionText;
        if (!selectedText) {
            console.log('No selected text found');
            return;
        }

        console.log('Selected text length:', selectedText.length);

        let action, prompt;

        switch (info.menuItemId) {
            case 'textaid-summarize':
                action = 'summarize';
                prompt = `Summarize this text concisely in bullet points (100-200 words): ${selectedText}`;
                break;

            case 'textaid-rephrase-professional':
                action = 'rephrase';
                prompt = `Rephrase this text in a professional tone: ${selectedText}`;
                break;

            case 'textaid-rephrase-casual':
                action = 'rephrase';
                prompt = `Rephrase this text in a casual, friendly tone: ${selectedText}`;
                break;

            case 'textaid-rephrase-concise':
                action = 'rephrase';
                prompt = `Make this text more concise while keeping the meaning: ${selectedText}`;
                break;

            case 'textaid-ideas':
                action = 'generate';
                prompt = `Generate 3-5 related ideas or suggestions based on this text: ${selectedText}`;
                break;

            case 'textaid-expand':
                action = 'expand';
                prompt = `Expand on this text with more detail and context: ${selectedText}`;
                break;

            default:
                return;
        }

        // Send to content script to show loading and handle result
        console.log('Sending processing message to content script for action:', action);
        chrome.tabs.sendMessage(tab.id, {
            action: 'showProcessing',
            menuAction: action
        });

        // Process with AI
        this.processWithAI(prompt, action, tab.id);
    }

    async handleMessage(message, sender, sendResponse) {
        switch (message.action) {
            case 'updateSettings':
                this.settings = { ...this.settings, ...message.settings };
                this.setupContextMenus();
                sendResponse({ success: true });
                break;

            case 'getSuggestion':
                if (this.settings.enableSuggestions) {
                    const suggestion = await this.getSuggestion(message.text, message.context);
                    sendResponse({ suggestion });
                }
                break;

            case 'processText':
                const result = await this.processWithAI(message.prompt, message.type, sender.tab.id);
                sendResponse({ result });
                break;

            default:
                sendResponse({ error: 'Unknown action' });
        }
    }

    async processWithAI(prompt, type, tabId) {
        console.log('Processing with AI, provider:', this.settings.aiProvider, 'type:', type, 'hasApiKey:', !!this.settings.apiKey);

        if (!this.settings.apiKey) {
            console.log('No API key configured');
            chrome.tabs.sendMessage(tabId, {
                action: 'showResult',
                error: 'Please configure your API key in the extension settings.'
            });
            return;
        }

        try {
            let result;

            if (this.settings.aiProvider === 'openai') {
                result = await this.callOpenAI(prompt, type);
            } else if (this.settings.aiProvider === 'gemini') {
                result = await this.callGemini(prompt, type);
            } else {
                throw new Error('Unknown AI provider: ' + this.settings.aiProvider);
            }

            chrome.tabs.sendMessage(tabId, {
                action: 'showResult',
                result: result,
                type: type
            });

            return result;

        } catch (error) {
            console.error('Error processing with AI:', error);
            chrome.tabs.sendMessage(tabId, {
                action: 'showResult',
                error: `Error: ${error.message}`
            });
        }
    }

    async callOpenAI(prompt, type) {
        console.log('Making API request to OpenAI...');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.settings.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful writing assistant. Be ${this.settings.suggestionStyle} in your responses.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: type === 'summarize' ? 300 : 500,
                temperature: type === 'creative' ? 0.8 : 0.3
            })
        });

        console.log('API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`API request failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API response received, choices:', data.choices?.length);

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid API response format');
        }

        return data.choices[0].message.content.trim();
    }

    async callGemini(prompt, type) {
        console.log('Making API request to Gemini...');

        // Gemini API endpoint
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.settings.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a helpful writing assistant. Be ${this.settings.suggestionStyle} in your responses. ${prompt}`
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: type === 'summarize' ? 300 : 500,
                    temperature: type === 'creative' ? 0.8 : 0.3
                }
            })
        });

        console.log('Gemini API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error response:', errorText);
            throw new Error(`Gemini API request failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Gemini API response received, candidates:', data.candidates?.length);

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
            throw new Error('Invalid Gemini API response format');
        }

        return data.candidates[0].content.parts[0].text.trim();
    }

    async getSuggestion(text, context) {
        if (!this.settings.apiKey || !text.trim()) {
            return null;
        }

        try {
            const prompt = `Complete this ${context || 'text'} in a ${this.settings.suggestionStyle} tone. Only provide the completion, no explanation: "${text}"`;

            if (this.settings.aiProvider === 'openai') {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.settings.apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a writing assistant. Provide brief, contextual completions.'
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        max_tokens: 50,
                        temperature: 0.7
                    })
                });

                if (!response.ok) {
                    return null;
                }

                const data = await response.json();
                return data.choices[0].message.content.trim();

            } else if (this.settings.aiProvider === 'gemini') {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.settings.apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            maxOutputTokens: 50,
                            temperature: 0.7
                        }
                    })
                });

                if (!response.ok) {
                    return null;
                }

                const data = await response.json();
                return data.candidates[0].content.parts[0].text.trim();
            }

        } catch (error) {
            console.error('Error getting suggestion:', error);
            return null;
        }
    }
}

// Initialize the background script
new TextAidBackground();
