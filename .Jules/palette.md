## 2025-05-14 - Redundant Tooltips Prevention
**Learning:** When introducing Radix UI tooltips to components that previously used the native HTML 'title' attribute, the native attribute must be removed to prevent double-tooltips (one from the browser, one from the UI library).
**Action:** Always scan for and remove 'title' attributes when wrapping icon-only buttons in the custom Tooltip component.

## 2026-05-13 - Sidebar Action Buttons Pattern
**Learning:** Icon-only action buttons in the conversation sidebar require a combination of Tooltips for discoverability, ARIA labels for screen readers, and explicit focus-visible styles for keyboard navigation to meet the app's accessibility standards.
**Action:** Use the `Tooltip` + `aria-label` + `focus-visible:ring-2` pattern for all small inline actions in list items.
