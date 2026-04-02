# Palette's Journal

## 2025-05-14 - Tooltips and ARIA labels for Interactive Icons
**Learning:** Icon-only buttons without tooltips or ARIA labels are inaccessible and provide poor UX. Furthermore, Radix UI Tooltips do not trigger on disabled elements, requiring a wrapper (like a `span`) to capture hover events and provide context for why a button is disabled.
**Action:** Always wrap icon-only buttons in a `Tooltip` with a descriptive `aria-label`. If the button can be disabled, use a `span` or `div` wrapper for the `TooltipTrigger`.
