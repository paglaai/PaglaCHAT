# Palette's Journal - DirtyChat

This journal tracks critical UX and accessibility learnings discovered during the development of DirtyChat.

## 2025-05-14 - Tooltips and ARIA labels for icon-only buttons
**Learning:** Icon-only buttons without labels or tooltips are a major accessibility and usability barrier. Users shouldn't have to guess what an icon does, and screen readers need descriptive text.
**Action:** Always wrap icon-only buttons in a Tooltip component and provide a descriptive aria-label.
