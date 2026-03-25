## 2025-05-15 - [Icon-only Button Accessibility]
**Learning:** Icon-only buttons in the DirtyChat interface were missing ARIA labels and visual tooltips, making them inaccessible to screen readers and potentially confusing for new users.
**Action:** Always wrap icon-only buttons with the `Tooltip` component and provide a descriptive `aria-label` that matches the tooltip content. The `TooltipProvider` is already available at the root level in `App.tsx`.
