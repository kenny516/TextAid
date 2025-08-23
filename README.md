# TextAid - AI Assistant Chrome Extension

A versatile AI-powered browser extension that enhances productivity across web-based text interactions. TextAid provides intelligent text summarization, real-time writing suggestions, and contextual content generation for any web page.

## Features

### 🤖 Multi-AI Provider Support

- **OpenAI GPT-4o-mini**: High-quality responses with pay-per-use model
- **Google Gemini 1.5-flash**: Free tier with generous quotas (recommended)
- Easy switching between providers in settings

### 🔍 Text Summarization

- Select any text on a webpage and get instant, concise summaries
- Bullet-point format for easy reading
- Context-aware summarization

### ✍️ Real-time Writing Assistance

- Smart auto-complete suggestions while typing
- Contextual sentence completion
- Customizable suggestion frequency (Low/Medium/High)

### 🎯 Context Menu Actions

- **Rephrase**: Professional, casual, or concise tone options
- **Generate Ideas**: Get creative suggestions based on selected text
- **Expand Text**: Add more detail and context to your content

### ⚙️ Customizable Settings

- Multiple writing styles: Casual, Professional, Creative, Concise
- Adjustable suggestion aggressiveness
- Toggle features on/off as needed
- Secure API key storage

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The TextAid icon should appear in your browser toolbar

### Configuration

1. Click the TextAid icon in the toolbar
2. Enter your OpenAI API key (starts with `sk-`) or your Google Gemini key (starts with `AIza...`)
3. Configure your preferred settings and AI providers
4. Save and start using the extension!

## Usage

### Text Summarization

1. Select any text on a webpage
2. Right-click and choose "TextAid" → "Summarize Selected Text"
3. Or use the floating toolbar that appears after selection

### Writing Suggestions

1. Click in any text field or textarea
2. Start typing - suggestions will appear automatically based on your frequency settings
3. Click "Accept" to use a suggestion or "×" to dismiss

### Context Actions

- **Right-click menu**: Select text → Right-click → TextAid → Choose action
- **Floating toolbar**: Select text → Click the desired action button

## API Requirements

This extension supports two AI providers:

### 🆓 Google Gemini (Recommended - Free)

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)
5. **Free tier includes**: 15 requests/minute, 1500 requests/day, 1M tokens/month

### 💳 OpenAI (Pay-per-use)

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key (starts with `sk-`)
5. Add billing information and credits

**Note**: Gemini is recommended for most users due to its generous free tier and excellent performance.

## Privacy & Security

- API keys are stored locally in Chrome's secure storage
- Text is only sent to OpenAI when you explicitly trigger an action
- Password fields are automatically excluded from suggestions
- No tracking or data collection by the extension itself

## Development

### Project Structure

```
TextAid/
├── manifest.json          # Extension configuration
├── popup.html            # Settings popup UI
├── popup.js              # Settings popup logic
├── background.js         # Service worker & API integration
├── content.js            # Page interaction & UI injection
├── content.css           # Styles for injected UI elements
├── icons/                # Extension icons
├── plan.md              # Project planning document
├── agent.md             # Development workflow
└── README.md            # This file
```

### Tech Stack

- **Extension**: Chrome Manifest V3
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **AI**: OpenAI GPT-4o-mini API
- **Storage**: Chrome Storage API

### Development Workflow

This project follows the "Think, Plan, Code, Verify, Commit" methodology outlined in `agent.md`.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/new-feature`)
3. Follow the development workflow in `agent.md`
4. Commit your changes with descriptive messages
5. Push to your branch and create a Pull Request

## License

MIT License - see LICENSE file for details.

## Roadmap

### Phase 1 (Current)

- [x] Basic extension structure
- [x] Text summarization
- [x] Context menu integration
- [x] Real-time typing suggestions
- [ ] Testing and bug fixes

### Phase 2 (Future)

- [ ] Multi-language support
- [ ] Site-specific integrations (Google Docs, Gmail)
- [ ] Voice input support
- [ ] Advanced AI features
- [ ] Firefox compatibility

## Support

For issues, feature requests, or questions:

- Create an issue in the GitHub repository
- Check existing issues for solutions
- Provide detailed information about your environment and the problem

## Changelog

### v1.0.0 (In Development)

- Initial release
- Text summarization functionality
- Real-time typing suggestions
- Context menu actions
- Customizable settings panel
