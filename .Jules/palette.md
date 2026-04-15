## 2026-04-15 - [Accessible Tooltips for Disabled Buttons]
**Learning:** Radix UI Tooltip triggers do not fire hover events on disabled elements. To provide feedback on why a button is disabled, the trigger must be wrapped in a non-disabled container (like a span).
**Action:** Always wrap TooltipTrigger content in a span when the trigger is a button that can be disabled.
