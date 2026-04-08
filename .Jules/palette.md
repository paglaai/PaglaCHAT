## 2025-05-14 - Tooltips on Disabled Elements
**Learning:** Radix UI `TooltipTrigger` (and many other library triggers) does not fire pointer or focus events when its child is a `disabled` HTML element. This prevents tooltips from showing when they are most needed—to explain why a button is disabled.
**Action:** Always wrap a `disabled` button in a `span` or `div` when using it as a `TooltipTrigger` to ensure the tooltip remains interactive and visible.
