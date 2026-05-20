# DirtyChat - Information Architecture

## Site Map & Navigation Structure

```
DirtyChat
├── Authentication
│   ├── Login (OAuth)
│   └── Sign Out
│
├── Main Application
│   ├── Chat Interface (Primary)
│   │   ├── Sidebar Navigation
│   │   │   ├── User Profile
│   │   │   ├── Settings Link
│   │   │   ├── Model Selection
│   │   │   ├── System Prompt Selection
│   │   │   ├── New Chat Button
│   │   │   └── Conversation History
│   │   │
│   │   ├── Main Content Area
│   │   │   ├── Chat Header
│   │   │   ├── Message Display Area
│   │   │   │   ├── User Messages
│   │   │   │   ├── Assistant Messages (with Markdown)
│   │   │   │   ├── Image Display
│   │   │   │   └── Tool Execution Results
│   │   │   │
│   │   │   └── Input Area
│   │   │       ├── Text Input
│   │   │       ├── Voice Input Button
│   │   │       ├── Image Generation Button
│   │   │       └── Send Button
│   │   │
│   │   └── Welcome State
│   │       ├── Branding
│   │       ├── Getting Started Guide
│   │       └── Feature Overview
│   │
│   ├── Settings Page
│   │   ├── Profile Tab
│   │   │   ├── User Information (Read-only)
│   │   │   └── Sign Out Button
│   │   │
│   │   ├── API Keys Tab
│   │   │   ├── OpenAI API Key Input
│   │   │   ├── Anthropic API Key Input
│   │   │   ├── Groq API Key Input
│   │   │   ├── Together AI API Key Input
│   │   │   └── Save Button
│   │   │
│   │   └── Preferences Tab
│   │       ├── Default Model Selection
│   │       ├── Default System Prompt Selection
│   │       ├── Auto-save Conversations Toggle
│   │       ├── Enable Notifications Toggle
│   │       ├── Theme Selection
│   │       └── Save Button
│   │
│   └── Documents Page
│       ├── Document List
│       │   ├── Document Title
│       │   ├── Upload Date
│       │   ├── File Size
│       │   ├── Delete Button
│       │   └── View Chunks Button
│       │
│       ├── Upload Area
│       │   ├── File Input
│       │   ├── Drag & Drop Zone
│       │   └── Upload Button
│       │
│       └── Document Details
│           ├── Document Metadata
│           ├── Chunk List
│           └── Similarity Score Display
```

## User Flows

### Flow 1: New User Onboarding

1. User visits DirtyChat
2. Redirected to OAuth login
3. Authenticates with Manus account
4. Lands on chat interface
5. Sees welcome screen with getting started guide
6. Optionally navigates to Settings to add API keys
7. Creates first conversation
8. Selects model and system prompt
9. Sends first message

### Flow 2: Multi-Model Conversation

1. User opens existing conversation
2. Conversation history loads
3. User selects different model from dropdown
4. User types message
5. Message sent to selected model
6. Response streams in real-time
7. User can continue conversation or switch models
8. Conversation auto-saves

### Flow 3: Document Upload & RAG

1. User navigates to Documents page
2. Uploads PDF or text file
3. System chunks document automatically
4. Chunks stored in database
5. User returns to chat
6. User asks question related to document
7. System retrieves relevant chunks
8. Chunks injected into LLM prompt
9. Response includes document context

### Flow 4: Voice Input

1. User in chat interface
2. Clicks microphone button
3. Browser requests microphone permission
4. User speaks
5. Audio recorded
6. User clicks stop button
7. Audio sent to Whisper API
8. Transcription returned
9. Text appended to input field
10. User can edit and send

### Flow 5: Image Generation

1. User in chat interface
2. Types image generation prompt
3. Clicks image generation button
4. Request sent to image generation API
5. Loading indicator shown
6. Image displayed in chat
7. User can download, edit, or delete image
8. Image stored in conversation history

## Content Hierarchy

### Primary Content

- Chat messages (user and assistant)
- Conversation history
- User profile information

### Secondary Content

- System prompts and descriptions
- Model information and capabilities
- Document metadata

### Tertiary Content

- Help text and tooltips
- Settings descriptions
- Feature explanations

## Data Organization

### Conversations

Organized chronologically with most recent first. Users can search by title or content.

### Messages

Grouped by conversation. Displayed chronologically within each conversation. Includes metadata (timestamp, model used, tokens consumed).

### Documents

Organized by upload date. Searchable by filename. Includes metadata (size, format, upload date, chunk count).

### Models

Grouped by provider (OpenAI, Anthropic, Groq, Together AI). Includes model capabilities and pricing information.

### System Prompts

Categorized by type (General, Developer, Research, Data Analyst, Creative Writer). Each includes description and example usage.

## Interaction Patterns

### Conversation Selection

Click on conversation in sidebar to load it. Visual indication of currently selected conversation.

### Model Switching

Dropdown selector in sidebar. Switching models mid-conversation preserves history but uses new model for subsequent messages.

### Message Sending

Enter key or click send button. Disabled when input is empty. Shows loading state during processing.

### Document Upload

Drag and drop or click to select. Shows progress during upload and processing.

### Settings Management

Tab-based navigation. Save buttons persist changes. Confirmation on destructive actions.

## Accessibility Considerations

- Keyboard navigation support (Tab, Enter, Escape)
- ARIA labels for all interactive elements
- Color contrast ratios meet WCAG AA standards
- Focus indicators visible on all interactive elements
- Screen reader support for dynamic content
- Semantic HTML structure
- Form labels properly associated with inputs

## Responsive Design Breakpoints

| Breakpoint | Width          | Layout                               |
| ---------- | -------------- | ------------------------------------ |
| Mobile     | < 640px        | Single column, stacked sidebar       |
| Tablet     | 640px - 1024px | Flexible layout, collapsible sidebar |
| Desktop    | > 1024px       | Two-column layout, fixed sidebar     |

## Performance Considerations

- Lazy loading of conversation history
- Pagination for large message lists
- Image optimization and compression
- Code splitting for routes
- Service worker for offline support
- Caching strategies for API responses
