## 2025-05-14 - Redundant Tooltips Prevention
**Learning:** When introducing Radix UI tooltips to components that previously used the native HTML 'title' attribute, the native attribute must be removed to prevent double-tooltips (one from the browser, one from the UI library).
**Action:** Always scan for and remove 'title' attributes when wrapping icon-only buttons in the custom Tooltip component.

## 2025-05-22 - Efficient Dialog Management for Lists
**Learning:** Instead of rendering a confirmation dialog for every item in a list, use a single dialog component managed by a state representing the 'active' item (e.g., `itemToDeleteId`). This significantly reduces DOM overhead and improves performance for large lists while maintaining a clean component structure.
**Action:** Implement shared action dialogs at the page level using a state-driven approach rather than nesting dialogs within list items.
