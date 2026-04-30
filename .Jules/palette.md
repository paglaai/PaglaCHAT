## 2025-05-14 - Redundant Tooltips Prevention
**Learning:** When introducing Radix UI tooltips to components that previously used the native HTML 'title' attribute, the native attribute must be removed to prevent double-tooltips (one from the browser, one from the UI library).
**Action:** Always scan for and remove 'title' attributes when wrapping icon-only buttons in the custom Tooltip component.

## 2025-05-15 - Tooltips on Disabled Elements
**Learning:** Radix UI and many other tooltip libraries do not trigger on elements with 'pointer-events: none', which is often the default for disabled buttons. Wrapping the button in a 'span' with 'display: inline-block' (or using a wrapper div) allows the tooltip to capture hover events even when the inner button is disabled.
**Action:** Always wrap disabled buttons in a 'span' or 'div' when they need to display a tooltip explaining their state.
