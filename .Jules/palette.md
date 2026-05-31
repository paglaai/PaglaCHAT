## 2025-05-14 - Redundant Tooltips Prevention
**Learning:** When introducing Radix UI tooltips to components that previously used the native HTML 'title' attribute, the native attribute must be removed to prevent double-tooltips (one from the browser, one from the UI library).
**Action:** Always scan for and remove 'title' attributes when wrapping icon-only buttons in the custom Tooltip component.

## 2025-05-31 - Nesting Tooltips and Dialogs
**Learning:** When combining a Tooltip and an AlertDialog on a single trigger, the correct nesting sequence is: `AlertDialog` -> `Tooltip` -> `TooltipTrigger asChild` -> `AlertDialogTrigger asChild` -> button.
**Action:** Use this specific nesting order to ensure both components work correctly and accessibility is maintained.
