## 2025-04-04 - Accessible Tooltips for Disabled Elements
**Learning:** Radix UI tooltips (and many others) do not trigger on disabled elements because disabled elements do not emit mouse events. Wrapping the trigger in a `span` or `div` allows capturing hover events and showing the tooltip even when the interactive element is disabled.
**Action:** Always wrap `TooltipTrigger` children in a `span` if they might be disabled to ensure consistent UX feedback.
