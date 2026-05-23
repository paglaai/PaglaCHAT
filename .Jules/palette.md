## 2025-05-14 - Redundant Tooltips Prevention
**Learning:** When introducing Radix UI tooltips to components that previously used the native HTML 'title' attribute, the native attribute must be removed to prevent double-tooltips (one from the browser, one from the UI library).
**Action:** Always scan for and remove 'title' attributes when wrapping icon-only buttons in the custom Tooltip component.

## 2026-05-23 - Keyboard Event Propagation in Interactive Lists
**Learning:** When nesting interactive elements (buttons) inside a parent container that also handles selection (e.g., conversation list items), `e.stopPropagation()` must be called in both `onClick` AND `onKeyDown` handlers of the nested buttons to prevent accidental parent triggers during keyboard navigation.
**Action:** Always ensure nested buttons in list items have both click and keydown propagation stops if the parent is interactive.
