## 2025-05-15 - Tooltips on Disabled Elements
**Learning:** Radix UI tooltips (and many other library tooltips) do not trigger on disabled elements because they rely on pointer events that are suppressed on disabled buttons.
**Action:** Wrap disabled-prone buttons in a `span` or `div` inside the `TooltipTrigger` to capture hover/focus events and ensure the tooltip remains accessible even when the action is unavailable.

## 2025-05-15 - Dynamic ARIA Labels for Async Actions
**Learning:** Providing real-time feedback via ARIA labels (e.g., "Sending..." vs "Send") improves the experience for screen reader users by clearly communicating the current state of an asynchronous operation.
**Action:** Use conditional logic to update `aria-label` and tooltip content based on `isLoading` or `isPending` states.
