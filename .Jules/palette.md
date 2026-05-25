## 2025-05-14 - Redundant Tooltips Prevention
**Learning:** When introducing Radix UI tooltips to components that previously used the native HTML 'title' attribute, the native attribute must be removed to prevent double-tooltips (one from the browser, one from the UI library).
**Action:** Always scan for and remove 'title' attributes when wrapping icon-only buttons in the custom Tooltip component.

## 2025-05-15 - Tooltip and AlertDialog Nesting Pattern
**Learning:** When combining a Radix UI Tooltip and AlertDialog on the same trigger, the components must be nested carefully (AlertDialog > Tooltip > TooltipTrigger asChild > AlertDialogTrigger asChild > button) to ensure both work correctly without accessibility or event propagation issues.
**Action:** Use this standard nesting pattern for all destructive icon buttons that require tooltips to maintain clean DOM and proper event handling.
