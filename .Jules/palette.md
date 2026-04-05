## 2025-05-14 - [Improved Icon-only Button Accessibility]
**Learning:** Icon-only buttons often lack textual alternatives, making them inaccessible to screen readers and potentially confusing for sighted users. Dynamic feedback (e.g., 'Sending...') in both ARIA labels and tooltips significantly improves micro-UX by providing real-time state confirmation.
**Action:** Always wrap icon-only buttons with `Tooltip` and provide descriptive, state-aware `aria-label` and `TooltipContent`.
