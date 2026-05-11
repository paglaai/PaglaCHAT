## 2025-05-14 - Redundant Tooltips Prevention
**Learning:** When introducing Radix UI tooltips to components that previously used the native HTML 'title' attribute, the native attribute must be removed to prevent double-tooltips (one from the browser, one from the UI library).
**Action:** Always scan for and remove 'title' attributes when wrapping icon-only buttons in the custom Tooltip component.

## 2025-05-15 - List Item Destructive Actions Pattern
**Learning:** For destructive actions within a list (like deleting a conversation), using a single shared AlertDialog managed by an ID state (e.g., `conversationToDelete`) is more efficient and cleaner than nesting dialogs within each list item. Using `e.stopPropagation()` on action buttons prevents parent selection events from firing.
**Action:** Implement a single state-controlled AlertDialog at the page level for list-based deletions, and ensure all inline action buttons stop event propagation.
