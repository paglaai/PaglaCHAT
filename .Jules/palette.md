# Palette's UX Journal

This journal tracks critical UX and accessibility learnings for the DirtyChat application.

## 2025-05-15 - Tooltips on Disabled Elements
**Learning:** Radix UI tooltips (used via shadcn/ui) do not trigger hover events on disabled elements because disabled elements do not emit mouse events.
**Action:** Wrap disabled buttons in a `<span>` or `<div>` and use that as the `TooltipTrigger` to ensure tooltips are visible even when the action is unavailable.

## 2025-05-15 - Dynamic ARIA Labels for Async States
**Learning:** For buttons that trigger long-running async operations (like sending a message or transcribing audio), static ARIA labels can be misleading.
**Action:** Use dynamic ARIA labels and tooltip content that reflect the current state (e.g., "Sending message..." vs "Send message") to provide real-time feedback to screen reader users.
