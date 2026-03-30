## 2025-05-15 - Improving Accessibility for Icon-only Buttons
**Learning:** Radix UI tooltips do not trigger on disabled elements. Wrapping the trigger in a `span` or `div` is necessary to capture hover events for disabled buttons. Icon-only buttons must have `aria-label` and clear `focus-visible` states for accessibility.
**Action:** Always wrap disabled-prone tooltip triggers in a `span` and ensure `aria-label` is present.
