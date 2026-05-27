## 2025-05-14 - Redundant Tooltips Prevention
**Learning:** When introducing Radix UI tooltips to components that previously used the native HTML 'title' attribute, the native attribute must be removed to prevent double-tooltips (one from the browser, one from the UI library).
**Action:** Always scan for and remove 'title' attributes when wrapping icon-only buttons in the custom Tooltip component.

## 2025-05-15 - Interactive Nesting with Tooltip and AlertDialog
**Learning:** When nesting interactive triggers like `TooltipTrigger` and `AlertDialogTrigger`, using `asChild` on both ensures they share the same underlying DOM element (e.g., a button). Additionally, adding `onClick={(e) => e.stopPropagation()}` to `AlertDialogContent` prevents interactions within the dialog from bubbling up to parent containers (like list items).
**Action:** Use `asChild` for nested triggers and stop propagation on dialog content when nested in clickable list items.
