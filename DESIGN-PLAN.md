# TextAid Extension - Design Plan (Style Vercel)

## 🎨 Design System Overview

### Color Palette
- **Primary Text/Icons**: `#2E2E2E` (Anthracite grey - solid and readable)
- **Background**: `#F8F8F8` (Very light grey - clean and minimalist)
- **Accent (buttons, highlights)**: `#007BFF` (Bright blue - technology, trust, modern)
- **Success/Validation**: `#28A745` (Green - confirmation messages)
- **Error/Warning**: `#DC3545` (Red - error messages)

### Typography (Vercel-inspired)
- **Primary Font**: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace**: `'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace`

### Design Principles (Vercel Style)
- **Minimalism**: Clean, spacious layouts
- **Sharp Typography**: Clear hierarchy and readability
- **Subtle Shadows**: Elegant depth without heaviness
- **Rounded Corners**: Modern 8px border-radius
- **Micro-interactions**: Smooth transitions and hover effects

## 🎯 Components to Redesign

### 1. Popup Interface (`popup.html` + `popup.css`)
**Current Issues**: Basic styling, no cohesive design
**Vercel-inspired Improvements**:
- Clean header with extension logo/title
- Card-based layout for settings sections
- Modern toggle switches for provider selection
- Sleek input fields with floating labels
- Subtle gradients and shadows
- Status indicators with icons

### 2. Floating Toolbar (`content.css`)
**Current Issues**: Generic button styling
**Vercel-inspired Improvements**:
- Glassmorphism effect with backdrop-blur
- Icon-first design with minimal text
- Smooth hover animations
- Unified button sizing and spacing
- Drop shadow for depth

### 3. Modal System (`content.css`)
**Current Issues**: Basic modal appearance
**Vercel-inspired Improvements**:
- Backdrop blur effect
- Card-style modal with subtle shadow
- Typography hierarchy (title, body, actions)
- Loading states with skeleton UI
- Action buttons with proper states

### 4. Context Menu Integration
**Current Issues**: Default browser styling
**Vercel-inspired Improvements**:
- Custom icons for each action
- Consistent with overall design language

## 📐 Layout & Spacing System

### Grid System (Vercel-inspired)
- **Base unit**: 8px
- **Spacing scale**: 4px, 8px, 16px, 24px, 32px, 48px
- **Container max-width**: 400px (popup)
- **Border radius**: 8px (cards), 6px (buttons), 4px (inputs)

### Typography Scale
- **Heading 1**: 24px / 1.2 line-height / 600 weight
- **Heading 2**: 20px / 1.3 line-height / 600 weight
- **Heading 3**: 16px / 1.4 line-height / 500 weight
- **Body**: 14px / 1.5 line-height / 400 weight
- **Caption**: 12px / 1.4 line-height / 400 weight

## 🎭 Visual Effects

### Shadows (Vercel-style)
- **Card shadow**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **Button shadow**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **Modal shadow**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

### Animations
- **Transition duration**: 150ms (fast), 200ms (normal), 300ms (slow)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- **Hover scale**: `transform: scale(1.02)`
- **Button press**: `transform: scale(0.98)`

## 🔧 Implementation Plan

### Phase 1: Typography & Base Styles
1. Import Inter font from Google Fonts
2. Set up CSS custom properties (variables)
3. Reset default styles
4. Establish typography system

### Phase 2: Popup Redesign
1. Create new layout structure
2. Style provider selection section
3. Redesign API key inputs
4. Add status indicators
5. Implement micro-interactions

### Phase 3: Floating Toolbar Redesign
1. Glassmorphism background
2. Icon-based buttons
3. Hover effects and animations
4. Improved positioning logic

### Phase 4: Modal System Redesign
1. Backdrop blur effect
2. Card-style content area
3. Loading skeleton states
4. Action button improvements
5. Close button redesign

### Phase 5: Polish & Refinements
1. Consistent spacing throughout
2. Color adjustments for accessibility
3. Responsive behavior
4. Animation fine-tuning

## 📱 Component Specifications

### Popup Dimensions
- **Width**: 380px
- **Height**: Auto (max 600px)
- **Padding**: 24px

### Button Specifications
- **Height**: 36px (normal), 32px (small)
- **Padding**: 0 16px
- **Border radius**: 6px
- **Font weight**: 500

### Input Field Specifications
- **Height**: 40px
- **Border**: 1px solid rgba(46, 46, 46, 0.15)
- **Border radius**: 6px
- **Padding**: 0 12px

### Modal Specifications
- **Max width**: 500px
- **Border radius**: 12px
- **Backdrop**: rgba(0, 0, 0, 0.5) with blur(8px)

## 🎨 Visual Mockup Goals

### Popup Interface
```
┌─────────────────────────────────┐
│  TextAid                     ⚙️  │
├─────────────────────────────────┤
│                                 │
│  🤖 AI Provider                 │
│  ┌─────────────────────────────┐ │
│  │ ○ OpenAI    ● Gemini       │ │
│  └─────────────────────────────┘ │
│                                 │
│  🔑 API Configuration           │
│  ┌─────────────────────────────┐ │
│  │ Enter your API key...       │ │
│  └─────────────────────────────┘ │
│                                 │
│  ✓ Connected                    │
│                                 │
└─────────────────────────────────┘
```

### Floating Toolbar
```
┌─────────────────────────────┐
│ 📝  ✏️  💡  📈           │
└─────────────────────────────┘
```

This design plan will transform TextAid into a modern, professional extension that matches Vercel's design philosophy while maintaining excellent usability.
