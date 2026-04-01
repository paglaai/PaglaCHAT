## 2025-05-15 - [A11y/UX] Tooltips for Disabled Buttons and Icon-Only Button Accessibility

**Learning:** Radix UI `TooltipTrigger` components do not respond to hover or focus events on elements with the `disabled` attribute. To provide necessary context (like why a button is disabled) to all users, the trigger element must be wrapped in a non-disabled container like a `span` or `div`. Additionally, icon-only buttons require explicit `aria-label` and consistent `focus-visible` styles to ensure a high-quality experience for keyboard and screen reader users.

**Action:** When adding tooltips to buttons that can be disabled (e.g., Send or Voice Input), always wrap the button in a `<span>` inside the `TooltipTrigger`. For all icon-only buttons, apply `focus-visible:ring-1 focus-visible:ring-accent focus-visible:outline-none` and provide a descriptive `aria-label`.
