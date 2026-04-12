## 2025-05-15 - [Improving Accessible Icon Buttons with Tooltips]
**Learning:** Icon-only buttons are invisible to screen readers without ARIA labels, and ambiguous to sighted users without tooltips. Additionally, Radix UI tooltips (and many others) do not trigger on disabled elements because they stop bubbling pointer events. Wrapping the trigger in a `span` or `div` allows the tooltip to capture events even when the button is disabled.

**Action:** Always provide `aria-label` for icon-only buttons. When adding tooltips to buttons that can be disabled, wrap the `Button` in a `span` or `div` inside the `TooltipTrigger`. Use `focus-visible` styles for better keyboard accessibility.
