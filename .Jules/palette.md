## 2025-04-03 - Dynamic ARIA Labels & Tooltips for Async Actions
**Learning:** Users benefit from immediate feedback during async operations (transcribing, sending, generating). Combining dynamic ARIA labels with state-aware Tooltips provides a cohesive experience for both visual and screen-reader users.
**Action:** Always use mutation states (like `isPending`) to update `aria-label` and `TooltipContent` text dynamically.
