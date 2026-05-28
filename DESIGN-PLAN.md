# TextAid Design System

> Documents the **current** visual design of the TextAid extension.
> The original Vercel-style plan (light theme, Inter, blue accent) was
> superseded during v1.1.0 by a dark monochrome aesthetic inspired by
> Raycast, Linear, and Apple's system UI.

## Color Palette

All values are exposed as CSS custom properties so they're available
throughout both `popup.css` (scoped to `:root`) and `content.css`
(scoped to `.textaid-root.textaid-root` to survive host-page CSS).

| Token              | Value                        | Usage                          |
| ------------------ | ---------------------------- | ------------------------------ |
| `--ta-bg`          | `#0a0a0a`                    | Page / panel background        |
| `--ta-fg`          | `#fafafa`                    | Primary text                   |
| `--ta-soft`        | `rgba(250,250,250, 0.65)`    | Secondary text                 |
| `--ta-muted`       | `rgba(250,250,250, 0.45)`    | Placeholder / label text       |
| `--ta-border`      | `rgba(255,255,255, 0.08–0.10)` | Dividers, input borders      |
| `--ta-border-strong` | `rgba(255,255,255, 0.14–0.18)` | Focused borders             |
| `--ta-card`        | `rgba(255,255,255, 0.04)`    | Subtle surface                 |
| `--ta-card-strong` | `rgba(255,255,255, 0.08)`    | Hover state surface            |
| `--ta-card-hot`    | `rgba(255,255,255, 0.14)`    | Active / pressed surface       |
| `--ta-accent`      | `#fafafa`                    | Primary button fill            |
| `--ta-accent-fg`   | `#0a0a0a`                    | Text on accent fill            |
| `--green`          | `#34d399`                    | Success / connected dot        |
| `--red`            | `#f87171`                    | Error / warning dot            |
| `--gray`           | `#737373`                    | Idle dot                       |

## Typography

| Role          | Font family                                              | Size  | Weight |
| ------------- | -------------------------------------------------------- | ----- | ------ |
| UI / body     | `"Geist", -apple-system, BlinkMacSystemFont, system-ui` | 13 px | 400    |
| Brand name    | same                                                     | 14 px | 600    |
| Section label | same (uppercased, letter-spacing 0.08 em)                | 11 px | 500    |
| Monospace     | `"Geist Mono", ui-monospace, "SF Mono", Consolas`        | 13 px | 400    |

Geist and Geist Mono are loaded via Google Fonts in `popup.css`.
`content.css` deliberately avoids remote font imports (CSP-safe on every
host site) and falls back to the system font stack.

## Border Radius Scale

| Token           | Value  | Used for                  |
| --------------- | ------ | ------------------------- |
| `--ta-radius-sm` | 6 px  | Buttons, dropdown items   |
| `--ta-radius`    | 8 px  | Cards, inputs, toolbar    |
| `--ta-radius-lg` | 12 px | Modal, large containers   |

## Transitions

All interactive elements use `120ms ease` (`--ta-t`).
No spring or complex easing — keeps the extension lightweight and
consistent with system-native feel.

## Elevation / Shadows

```
Toolbar / dropdown:  0 8px 24px rgba(0, 0, 0, 0.4)
Modal backdrop:      rgba(0, 0, 0, 0.7) + backdrop-filter: blur(6px)
```

## Component Reference

### Floating Toolbar (`.textaid-toolbar`, `content.css`)

- Dark opaque background (`#0a0a0a`), 10 px border-radius, 1 px white-10% border
- Buttons: 28 × 28 px icon buttons, 6 px text-icon gap, transparent background
- Hover → `--ta-card-strong`; Active → `--ta-card-hot`
- SVG icons are 14 × 14 px, `stroke-width: 1.5` (Lucide style)
- Appears with `opacity 0 → 1` + `translateY(4px → 0)` in 120 ms

### Dropdown (`.textaid-dropdown`, `content.css`)

- Same dark background as toolbar; min-width 200 px
- Items: 30 px tall, 10 px horizontal padding, 6 px border-radius on hover
- Submenu language list scrollable up to 280 px

### Modal (`.textaid-modal`, `content.css`)

- Full-viewport fixed overlay: `rgba(0,0,0,0.7)` + `backdrop-filter: blur(6px)`
- Inner card: `max-width 520 px`, `#111` background, 12 px border-radius

### Popup (`popup.html` / `popup.css`)

- Fixed width 360 px, min-height 540 px
- Sections separated by `1px solid var(--border)` top borders
- Provider selector: three-segment control (Gemini / OpenAI / Claude)
- Toggle switches: custom `ta-switch` component with animated track

### Inline Suggestion Widget (`content.css`)

- Shown below the focused input field, small rounded card
- Ghost-text rendered in `--ta-muted` colour; Tab accepts, Esc dismisses
