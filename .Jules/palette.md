## 2025-05-15 - [Tooltip Accessibility on Disabled Elements]
**Learning:** In Radix UI/shadcn/ui, `Tooltip` components do not trigger when the `TooltipTrigger`'s child (e.g., a `Button`) is disabled.
**Action:** Wrap the disabled element in a `div` or `span` within the `TooltipTrigger` to ensure the tooltip still appears on hover even when the action is unavailable.

## 2025-05-15 - [Dynamic Feedback for Async Actions]
**Learning:** Standard static ARIA labels and tooltips on icon-only buttons (like "Send") can be misleading during loading states.
**Action:** Update `aria-label` and `TooltipContent` dynamically based on the component's state (e.g., "Sending..." vs "Send message") to provide better context to screen readers and sighted users.
