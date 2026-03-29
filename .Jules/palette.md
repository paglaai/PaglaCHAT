# Palette's UX Journal

## 2025-05-14 - [Radix UI Tooltip on Disabled Elements]
**Learning:** Radix UI tooltips (and many others) do not trigger on elements that have `disabled` attribute because they don't fire pointer events.
**Action:** Wrap the disabled element (like a Button) in a `span` or `div` that can capture the hover event to show the tooltip even when the action is unavailable.
