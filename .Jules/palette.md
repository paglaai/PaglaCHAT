## 2025-05-14 - Redundant Tooltips Prevention

**Learning:** When introducing Radix UI tooltips to components that previously used the native HTML 'title' attribute, the native attribute must be removed to prevent double-tooltips (one from the browser, one from the UI library).
**Action:** Always scan for and remove 'title' attributes when wrapping icon-only buttons in the custom Tooltip component.
