# DirtyChat - Wireframes & UI Layouts

## 1. Login Screen

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         ┌─────────────────┐         │
│         │   DirtyChat     │         │
│         └─────────────────┘         │
│                                     │
│   Multi-Model AI Chat Application   │
│                                     │
│      ┌─────────────────────┐        │
│      │   Sign In with      │        │
│      │   Manus OAuth       │        │
│      └─────────────────────┘        │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

## 2. Main Chat Interface (Desktop)

```
┌────────────────────────────────────────────────────────────────┐
│ DirtyChat                                                       │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────────────────────┐   │
│  │ SIDEBAR          │  │ CHAT AREA                        │   │
│  ├──────────────────┤  ├──────────────────────────────────┤   │
│  │ User Profile     │  │ Conversation Title               │   │
│  │ [Settings]       │  │ [Archive] [Delete]               │   │
│  │                  │  ├──────────────────────────────────┤   │
│  │ [Select Model]   │  │ Message 1 (User)                 │   │
│  │ [System Prompt]  │  │                                  │   │
│  │                  │  │ Message 2 (Assistant)            │   │
│  │ [+ New Chat]     │  │ [Image Display]                  │   │
│  │                  │  │                                  │   │
│  │ Conversation 1   │  │ Message 3 (User)                 │   │
│  │ Conversation 2   │  │                                  │   │
│  │ Conversation 3   │  │ Message 4 (Assistant)            │   │
│  │ Conversation 4   │  │                                  │   │
│  │                  │  ├──────────────────────────────────┤   │
│  │                  │  │ [🎤] [Text Input]  [🖼️] [Send]   │   │
│  │                  │  │                                  │   │
│  └──────────────────┘  └──────────────────────────────────┘   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

## 3. Main Chat Interface (Mobile)

```
┌──────────────────────┐
│ DirtyChat            │
├──────────────────────┤
│ [☰] Conversation     │
│ Title                │
├──────────────────────┤
│                      │
│ Message 1 (User)     │
│                      │
│ Message 2 (Assistant)│
│ [Image Display]      │
│                      │
│ Message 3 (User)     │
│                      │
├──────────────────────┤
│ [🎤] [Text Input]    │
│ [🖼️] [Send]          │
├──────────────────────┤
│ ┌──────────────────┐ │
│ │ Sidebar (Hidden) │ │
│ │ [Settings]       │ │
│ │ [New Chat]       │ │
│ │ Conversations    │ │
│ └──────────────────┘ │
└──────────────────────┘
```

## 4. Settings Page

```
┌────────────────────────────────────────────────────────────────┐
│ ← Settings                                                      │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────────────────────────────┐   │
│  │ Navigation   │  │ PROFILE TAB                          │   │
│  ├──────────────┤  ├──────────────────────────────────────┤   │
│  │ Profile      │  │ Profile Information                  │   │
│  │ API Keys     │  │ Name: [User Name]                    │   │
│  │ Preferences  │  │ Email: [user@example.com]            │   │
│  │              │  │ Member Since: [Date]                 │   │
│  │              │  │                                      │   │
│  │              │  │ Account Actions                      │   │
│  │              │  │ [Sign Out]                           │   │
│  │              │  │                                      │   │
│  └──────────────┘  └──────────────────────────────────────┘   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

## 5. API Keys Tab

```
┌────────────────────────────────────────────────────────────────┐
│ ← Settings                                                      │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────────────────────────────┐   │
│  │ Navigation   │  │ API KEYS TAB                         │   │
│  ├──────────────┤  ├──────────────────────────────────────┤   │
│  │ Profile      │  │ Add your API keys for cloud LLM      │   │
│  │ API Keys     │  │ providers. Keys are encrypted.       │   │
│  │ Preferences  │  │                                      │   │
│  │              │  │ OpenAI API Key                       │   │
│  │              │  │ [••••••••••••••••]                   │   │
│  │              │  │ Get key from platform.openai.com     │   │
│  │              │  │                                      │   │
│  │              │  │ Anthropic API Key                    │   │
│  │              │  │ [••••••••••••••••]                   │   │
│  │              │  │ Get key from console.anthropic.com   │   │
│  │              │  │                                      │   │
│  │              │  │ Groq API Key                         │   │
│  │              │  │ [••••••••••••••••]                   │   │
│  │              │  │ Get key from console.groq.com        │   │
│  │              │  │                                      │   │
│  │              │  │ [Save API Keys]                      │   │
│  │              │  │                                      │   │
│  └──────────────┘  └──────────────────────────────────────┘   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

## 6. Preferences Tab

```
┌────────────────────────────────────────────────────────────────┐
│ ← Settings                                                      │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────────────────────────────┐   │
│  │ Navigation   │  │ PREFERENCES TAB                      │   │
│  ├──────────────┤  ├──────────────────────────────────────┤   │
│  │ Profile      │  │ Default Model                        │   │
│  │ API Keys     │  │ [GPT-4 ▼]                           │   │
│  │ Preferences  │  │                                      │   │
│  │              │  │ Default System Prompt                │   │
│  │              │  │ [General Assistant ▼]                │   │
│  │              │  │                                      │   │
│  │              │  │ Auto-save Conversations              │   │
│  │              │  │ [☑]                                  │   │
│  │              │  │                                      │   │
│  │              │  │ Enable Notifications                 │   │
│  │              │  │ [☑]                                  │   │
│  │              │  │                                      │   │
│  │              │  │ Theme                                │   │
│  │              │  │ [Light ▼]                            │   │
│  │              │  │                                      │   │
│  │              │  │ [Save Preferences]                   │   │
│  │              │  │                                      │   │
│  └──────────────┘  └──────────────────────────────────────┘   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

## 7. Documents Page

```
┌────────────────────────────────────────────────────────────────┐
│ ← Documents                                                     │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Upload Area                                                      │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Drag & drop files here or click to select                │   │
│ │ [Choose File]                                            │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ Document List                                                    │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Document Title 1                                         │   │
│ │ Uploaded: 2024-01-15 | Size: 2.5 MB | Chunks: 12        │   │
│ │ [View] [Delete]                                          │   │
│ ├──────────────────────────────────────────────────────────┤   │
│ │ Document Title 2                                         │   │
│ │ Uploaded: 2024-01-14 | Size: 1.8 MB | Chunks: 8         │   │
│ │ [View] [Delete]                                          │   │
│ ├──────────────────────────────────────────────────────────┤   │
│ │ Document Title 3                                         │   │
│ │ Uploaded: 2024-01-13 | Size: 3.2 MB | Chunks: 15        │   │
│ │ [View] [Delete]                                          │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

## 8. Welcome State

```
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│                                                                  │
│                      ┌─────────────────┐                        │
│                      │ ■ (Red Square)  │                        │
│                      └─────────────────┘                        │
│                                                                  │
│              Welcome to DirtyChat                               │
│                                                                  │
│         Select a model and create a new conversation            │
│                  to get started                                 │
│                                                                  │
│        Multi-model AI chat with support for OpenAI,             │
│        Anthropic, Groq, and more                                │
│                                                                  │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

## 9. Image Generation Flow

```
Step 1: User enters prompt
┌────────────────────────────────────────┐
│ [Text Input] Generate an image...      │
│ [🖼️ Generate] [Send]                   │
└────────────────────────────────────────┘

Step 2: Loading state
┌────────────────────────────────────────┐
│ Generating image...                    │
│ [⟳ Loading...]                         │
└────────────────────────────────────────┘

Step 3: Image displayed
┌────────────────────────────────────────┐
│ [Generated Image]                      │
│ Prompt: Generate an image...           │
│ [Download] [Edit] [Delete]             │
└────────────────────────────────────────┘

Step 4: Edit mode
┌────────────────────────────────────────┐
│ [Generated Image]                      │
│ [Edit prompt input field]              │
│ [Apply Edit] [Cancel]                  │
└────────────────────────────────────────┘
```

## 10. Voice Recording Flow

```
Step 1: Ready to record
┌────────────────────────────────────────┐
│ [Text Input]                           │
│ [🎤 Record] [🖼️] [Send]                │
└────────────────────────────────────────┘

Step 2: Recording
┌────────────────────────────────────────┐
│ [Text Input]                           │
│ [⏹ Stop Recording] [🖼️] [Send]         │
│ Recording... 0:05                      │
└────────────────────────────────────────┘

Step 3: Transcribing
┌────────────────────────────────────────┐
│ [Text Input]                           │
│ [⟳ Transcribing...] [🖼️] [Send]        │
└────────────────────────────────────────┘

Step 4: Transcribed text added
┌────────────────────────────────────────┐
│ [Text Input] Transcribed text here      │
│ [🎤 Record] [🖼️] [Send]                │
└────────────────────────────────────────┘
```

## 11. Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Sidebar collapses into hamburger menu
- Full-width chat area
- Stacked input controls

### Tablet (640px - 1024px)
- Two-column layout
- Sidebar takes 40% width
- Chat area takes 60% width
- Flexible input controls

### Desktop (> 1024px)
- Two-column layout
- Sidebar fixed at 256px
- Chat area takes remaining width
- Horizontal input controls

## 12. Color Scheme in Wireframes

- **White**: Main background
- **Light Gray**: Secondary backgrounds, disabled states
- **Black**: Text and primary elements
- **Red**: Accent color, buttons, emphasis
- **Gray**: Borders and dividers

## 13. Typography in Wireframes

- **Display**: Page titles (32px, bold)
- **Heading**: Section titles (24px, semibold)
- **Body**: Main content (16px, regular)
- **Small**: Secondary text (14px, regular)
- **Tiny**: Captions (12px, regular)

## 14. Interaction States

### Buttons
- **Default**: Red background, white text
- **Hover**: Opacity 90%
- **Active**: Opacity 80%
- **Disabled**: Gray background, reduced opacity

### Input Fields
- **Default**: White background, gray border
- **Focus**: Red border
- **Error**: Red border, error text below
- **Disabled**: Gray background

### Links
- **Default**: Red text, underline on hover
- **Visited**: Dark gray text
- **Hover**: Opacity 80%
