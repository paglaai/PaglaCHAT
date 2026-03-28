## 2025-05-15 - [Improving Accessibility and Tooltip Interaction]
**Learning:** Radix UI tooltips do not trigger on disabled elements; wrapping the trigger in a `span` or `div` is necessary to capture hover events for disabled buttons. This ensures users know why a button is disabled (e.g., "Type a message to send").
**Action:** Always wrap disabled buttons in a `span` when using tooltips to provide feedback on disabled states.

## 2025-05-15 - [Dynamic Feedback during Async Operations]
**Learning:** Improving UX during async operations by using dynamic ARIA labels (e.g., 'Sending message' vs 'Send message') and corresponding tooltip text provides real-time feedback for screen readers and visual users alike.
**Action:** Use conditional logic to update `aria-label` and tooltip content based on loading states.
