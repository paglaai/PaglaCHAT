# DirtyChat - Design DNA

## Design Philosophy

DirtyChat embraces the **International Typographic Style** (Swiss Style), characterized by clean, grid-based layouts, mathematical precision, and functional aesthetics. The design prioritizes clarity, accessibility, and timeless elegance over trendy decoration.

### Core Principles

**Clarity**: Every element serves a purpose. Information hierarchy guides users through complex interactions without cognitive overload.

**Precision**: Consistent spacing, typography, and alignment create a sense of order and professionalism.

**Functionality**: Design decisions are driven by user needs. Beauty emerges from solving problems elegantly.

**Accessibility**: Inclusive design ensures all users, regardless of ability, can use DirtyChat effectively.

**Restraint**: Minimal ornamentation. Bold accents used strategically to guide attention.

## Color Palette

### Primary Colors

| Color     | Value   | Usage                            | Accessibility            |
| --------- | ------- | -------------------------------- | ------------------------ |
| **White** | #FFFFFF | Background, primary surface      | High contrast with text  |
| **Black** | #000000 | Text, primary foreground         | WCAG AAA contrast ratio  |
| **Red**   | #FF0000 | Accent, call-to-action, emphasis | Bold, attention-grabbing |

### Secondary Colors

| Color           | Value   | Usage                                  |
| --------------- | ------- | -------------------------------------- |
| **Light Gray**  | #F5F5F5 | Secondary backgrounds, disabled states |
| **Medium Gray** | #E5E5E5 | Borders, dividers                      |
| **Dark Gray**   | #333333 | Secondary text, subtle elements        |

### Semantic Colors

| Color              | Value   | Usage                           |
| ------------------ | ------- | ------------------------------- |
| **Success Green**  | #22C55E | Positive actions, confirmations |
| **Error Red**      | #EF4444 | Errors, destructive actions     |
| **Warning Orange** | #F59E0B | Warnings, cautions              |
| **Info Blue**      | #3B82F6 | Information, help text          |

## Typography

### Font Family

**Inter** - Clean, geometric sans-serif designed for screen use. Excellent readability at all sizes.

### Type Scale

| Role          | Size | Weight | Line Height | Usage                      |
| ------------- | ---- | ------ | ----------- | -------------------------- |
| **Display**   | 32px | 700    | 1.2         | Page titles, main headings |
| **Heading 1** | 28px | 700    | 1.3         | Section titles             |
| **Heading 2** | 24px | 600    | 1.4         | Subsection titles          |
| **Heading 3** | 20px | 600    | 1.4         | Component titles           |
| **Body**      | 16px | 400    | 1.6         | Main content, messages     |
| **Small**     | 14px | 400    | 1.5         | Secondary text, labels     |
| **Tiny**      | 12px | 400    | 1.4         | Captions, metadata         |

### Font Weights

- **400**: Regular (body text, default)
- **500**: Medium (emphasized text)
- **600**: Semibold (subheadings)
- **700**: Bold (headings, strong emphasis)

## Spacing System

Based on 4px grid for precise, scalable spacing.

| Token   | Value | Usage                                |
| ------- | ----- | ------------------------------------ |
| **xs**  | 4px   | Minimal spacing, icon margins        |
| **sm**  | 8px   | Compact spacing, button padding      |
| **md**  | 16px  | Standard spacing, section padding    |
| **lg**  | 24px  | Generous spacing, major sections     |
| **xl**  | 32px  | Large spacing, page sections         |
| **2xl** | 48px  | Extra large spacing, layout sections |

## Border & Radius

| Token             | Value   | Usage                         |
| ----------------- | ------- | ----------------------------- |
| **Border Weight** | 1px     | All borders, dividers         |
| **Border Color**  | #E5E5E5 | Default borders               |
| **Border Radius** | 4px     | Subtle rounding on components |

## Shadows

Minimal use of shadows to maintain flat, clean aesthetic.

| Token      | Value                      | Usage                          |
| ---------- | -------------------------- | ------------------------------ |
| **Subtle** | 0 1px 2px rgba(0,0,0,0.05) | Hover states, slight elevation |
| **Small**  | 0 2px 4px rgba(0,0,0,0.1)  | Cards, containers              |
| **Medium** | 0 4px 8px rgba(0,0,0,0.15) | Modals, dropdowns              |

## Component Specifications

### Buttons

**Primary Button**

- Background: Red (#FF0000)
- Text: White
- Padding: 12px 24px
- Border Radius: 4px
- Font Weight: 600
- Hover: Opacity 90%
- Active: Opacity 80%
- Disabled: Gray background, reduced opacity

**Secondary Button**

- Background: Transparent
- Border: 1px solid #E5E5E5
- Text: Black
- Padding: 12px 24px
- Hover: Background #F5F5F5
- Active: Background #E5E5E5

**Icon Button**

- Size: 40px × 40px
- Icon Size: 20px
- Hover: Background #F5F5F5
- Padding: 8px

### Input Fields

- Height: 40px
- Padding: 12px 16px
- Border: 1px solid #E5E5E5
- Border Radius: 4px
- Font Size: 16px
- Focus: Border color changes to Red (#FF0000)
- Error: Border color Red, error text below input

### Cards

- Background: White
- Border: 1px solid #E5E5E5
- Border Radius: 4px
- Padding: 16px
- Shadow: Subtle

### Dividers

- Color: #E5E5E5
- Weight: 1px
- Margin: 16px vertical

## Layout Grid

8-column responsive grid system.

| Breakpoint | Columns | Gutter | Margin |
| ---------- | ------- | ------ | ------ |
| Mobile     | 4       | 8px    | 16px   |
| Tablet     | 8       | 16px   | 24px   |
| Desktop    | 12      | 16px   | 32px   |

## Interaction Design

### Micro-interactions

**Hover States**: Subtle background color change or opacity adjustment. No jarring transitions.

**Click Feedback**: Immediate visual response (button press effect, color change).

**Loading States**: Spinner icon with "Loading..." text. Prevents multiple submissions.

**Error States**: Red border on input, error message below. Clear explanation of issue.

**Success States**: Green checkmark, brief success message. Auto-dismiss after 3 seconds.

### Transitions

- Duration: 200ms for most interactions
- Easing: ease-in-out for smooth motion
- Avoid: Excessive animations, distracting effects

### Animations

**Message Appearance**: Fade in smoothly as messages arrive.

**Typing Indicator**: Subtle pulsing dots to show AI is thinking.

**Image Loading**: Skeleton loader while image generates.

**Sidebar Collapse**: Smooth slide animation on mobile.

## Data Visualization

### Charts & Graphs

- Use neutral colors (black, gray, red for emphasis)
- Clear labels and legends
- Accessible color schemes (colorblind-friendly)
- Consistent line weights and styles

### Icons

- Lucide React for consistency
- 20px or 24px standard sizes
- Stroke weight: 2px
- Consistent visual weight across set

## Dark Mode (Future)

When dark mode is implemented:

- Background: #1A1A1A
- Surface: #2A2A2A
- Text: #FFFFFF
- Accent: #FF4444 (slightly lighter red for contrast)
- Borders: #404040

## Accessibility Standards

- WCAG 2.1 Level AA compliance
- Color contrast ratio: 4.5:1 minimum for text
- Focus indicators: Visible on all interactive elements
- Keyboard navigation: Full support without mouse
- Screen readers: Semantic HTML, ARIA labels
- Motion: Respects prefers-reduced-motion setting

## Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-red: #ff0000;
  --color-gray-light: #f5f5f5;
  --color-gray-medium: #e5e5e5;
  --color-gray-dark: #333333;

  /* Typography */
  --font-family: "Inter", sans-serif;
  --font-size-display: 32px;
  --font-size-h1: 28px;
  --font-size-h2: 24px;
  --font-size-h3: 20px;
  --font-size-body: 16px;
  --font-size-small: 14px;
  --font-size-tiny: 12px;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  /* Borders */
  --border-width: 1px;
  --border-radius: 4px;

  /* Shadows */
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-small: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 8px rgba(0, 0, 0, 0.15);
}
```

## Brand Voice & Tone

**Professional**: Respectful, knowledgeable, authoritative.

**Clear**: Simple language, avoid jargon where possible.

**Helpful**: Supportive tone, anticipate user needs.

**Honest**: Transparent about limitations and errors.

**Concise**: Say more with fewer words.

## Visual References

- Swiss International Style (1950s-1970s)
- Bauhaus design principles
- Contemporary minimalism
- Grid-based layouts
- Geometric precision
