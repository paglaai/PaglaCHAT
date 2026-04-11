
## 2025-04-11 - Polish with Radix Tooltips
**Learning:** Consistently using Radix UI Tooltips instead of native 'title' attributes provides a much more polished and theme-consistent experience. Also, always ensure icon-only buttons have descriptive ARIA labels for accessibility.
**Action:** Replace all native 'title' attributes with Tooltip components and verify all icon-only buttons have aria-label.

## 2025-04-11 - Tooltips and Disabled Elements
**Learning:** Radix UI tooltips (and native hover events) do not trigger on disabled elements. Wrapping a disabled button in a 'span' or 'div' allows the tooltip to capture hover events even when the button is inactive.
**Action:** Always wrap TooltipTrigger content in a 'span' if the underlying element can be disabled.
