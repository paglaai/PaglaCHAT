## 2025-05-14 - Redundant Tooltips Prevention
**Learning:** When introducing Radix UI tooltips to components that previously used the native HTML 'title' attribute, the native attribute must be removed to prevent double-tooltips (one from the browser, one from the UI library).
**Action:** Always scan for and remove 'title' attributes when wrapping icon-only buttons in the custom Tooltip component.

## 2025-05-14 - Interactive Trigger Propagation Prevention
**Learning:** When using management actions (Archive, Delete) within a selectable list item (like the conversation sidebar),  must be applied not only to the trigger buttons but also to the `AlertDialogContent`. This prevents interaction inside the dialog from bubbling up and triggering selection events on the parent list item in the background.
**Action:** Always wrap management dialog contents in a stopPropagation handler when they are triggered from within interactive list items.

## 2025-05-14 - Interactive Trigger Propagation Prevention
**Learning:** When using management actions (Archive, Delete) within a selectable list item (like the conversation sidebar), `onClick={(e) => e.stopPropagation()}` must be applied not only to the trigger buttons but also to the `AlertDialogContent`. This prevents interaction inside the dialog from bubbling up and triggering selection events on the parent list item in the background.
**Action:** Always wrap management dialog contents in a stopPropagation handler when they are triggered from within interactive list items.
