## 2025-05-14 - Tooltips and Disabled Buttons
**Learning:** Radix UI tooltips (used via shadcn/ui components) may not trigger on disabled elements because they don't capture pointer events. Additionally, when visually verifying tooltips in headless environments, `hover(force=True)` in Playwright is more reliable for ensuring the hover state is triggered.
**Action:** When implementing tooltips for potentially disabled buttons, consider wrapping them in a `span` if hover feedback is critical during the disabled state, or prioritize ARIA labels for functional accessibility.
