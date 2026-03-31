## 2026-03-31 - Tooltips for Disabled Icon-Only Buttons
**Learning:** Radix UI Tooltips (used in shadcn/ui) do not trigger on elements with `disabled` attribute. This is a common accessibility pitfall when providing feedback for inactive actions.
**Action:** Always wrap `TooltipTrigger` children in a `<span>` or `<div>` when the trigger is a button that can be disabled. This allows the tooltip to capture hover/focus events even when the underlying button is inactive.

## 2026-03-31 - Dynamic Feedback for Async Operations
**Learning:** Providing real-time state updates in tooltips and ARIA labels (e.g., changing "Send message" to "Sending...") significantly improves perceived performance and clarifies the application state during network-bound operations.
**Action:** Implement conditional logic for `aria-label` and `TooltipContent` to reflect loading or processing states.
