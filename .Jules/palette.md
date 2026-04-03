## 2025-05-15 - Enhancing Icon-Only Button Discoverability and Accessibility
**Learning:** Icon-only buttons often lack clear intent for screen readers and can be ambiguous for users. Adding dynamic ARIA labels and Radix UI tooltips significantly improves the micro-UX and accessibility without cluttering the UI.
**Action:** Always wrap icon-only buttons in a `Tooltip` and provide a descriptive `aria-label`. If the button has an async state (e.g., loading/sending), update both the tooltip content and the ARIA label to reflect the current state.
