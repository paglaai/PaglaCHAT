# DirtyChat - Project TODO

## Database Schema & Backend Setup
- [x] Design and implement database schema (users, conversations, messages, models, documents, tools, system_prompts)
- [x] Create database migrations and seed initial data
- [x] Implement user authentication and session management
- [x] Set up tRPC procedures for core features

## Core Backend API
- [x] User authentication (login, logout, session management)
- [x] Conversation CRUD operations (create, read, update, delete)
- [x] Message persistence and retrieval
- [x] Model management and configuration (seeding)
- [x] System prompts management (seeding)

## Multi-Model LLM Integration
- [x] Integrate OpenAI API support (seeded)
- [x] Integrate Anthropic API support (seeded)
- [x] Integrate Groq API support (seeded)
- [x] Integrate other cloud providers (seeded)
- [ ] Implement local model support (GGUF via llama.cpp)
- [x] Create LLM service layer for unified API calls (basic)
- [ ] Implement streaming response handling

## Frontend Chat Interface
- [x] Design and implement International Typographic Style theme
- [x] Create main chat layout with sidebar and message area
- [x] Implement message display with markdown rendering
- [x] Build model selection dropdown/interface
- [x] Create conversation history sidebar
- [x] Implement typing indicators and loading states
- [x] Add error handling and user feedback

## Document Management & RAG
- [x] Implement document upload functionality
- [x] Create document chunking and embedding system
- [x] Set up vector storage for document retrieval
- [x] Implement RAG retrieval procedure
- [x] Create document management UI
- [x] Store documents in cloud storage (S3)

## System Prompts & Advanced Features
- [x] Create system prompts library with predefined personalities (5 prompts seeded)
- [x] Implement system prompt selection UI
- [x] Build tool/function calling system (router created)
- [x] Implement tool definition and execution (router created)
- [x] Add voice-to-text transcription (Whisper API) - router created
- [x] Implement image generation from text (Image API) - router created

## User Settings & Profile
- [x] Create user profile page
- [x] Implement API key management for cloud providers
- [x] Build settings UI for preferences
- [ ] Add user preferences storage (backend integration)

## Testing & Optimization
- [x] Write unit tests for backend procedures (11 tests passing)
- [ ] Write unit tests for frontend components
- [ ] Conduct end-to-end testing
- [x] Optimize performance and bundle size
- [x] Test responsive design across devices (mobile-optimized)

## Deployment & Final Steps
- [ ] Create checkpoint for deployment
- [ ] Prepare deployment documentation
- [ ] Test production build
- [ ] Final QA and bug fixes

## Mobile App Features (Phase 2)
- [x] Implement tool/function calling system
- [x] Create user settings and profile page
- [x] Optimize frontend for mobile responsiveness
- [ ] Implement voice recording UI
- [ ] Add image display in chat messages
- [ ] Write frontend component tests
- [ ] Conduct end-to-end testing


## Phase 3: Enhanced Features & Optimizations

### Conversation Export
- [x] Implement PDF export functionality
- [x] Implement Markdown export functionality
- [x] Implement JSON export functionality
- [x] Add export button to chat interface
- [x] Create export service layer

### Analytics Dashboard
- [x] Create analytics page component
- [x] Implement model usage tracking
- [x] Add conversation metrics visualization
- [x] Create charts for usage patterns
- [ ] Implement date range filtering

### PWA & Offline Support
- [x] Create service worker for offline caching
- [x] Add PWA manifest for installability
- [x] Implement PWA registration hook
- [x] Add install prompt UI
- [x] Enable offline functionality

### Conversation Sharing
- [x] Create sharing router for share links
- [x] Implement share token generation
- [x] Add share statistics tracking
- [x] Create share revocation functionality
- [ ] Add share UI to chat interface

### Performance Optimization
- [ ] Implement message pagination
- [ ] Add lazy loading for images
- [ ] Optimize bundle size
- [ ] Implement caching strategies
- [ ] Add service worker for offline support

### PWA Features
- [ ] Add manifest.json for installability
- [ ] Implement service worker
- [ ] Add offline page
- [ ] Enable push notifications
- [ ] Test on mobile devices

### Collaboration Features
- [ ] Implement conversation sharing
- [ ] Add share link generation
- [ ] Create read-only conversation view
- [ ] Implement access control
- [ ] Add collaboration notifications


## Phase 4: Custom Notification System

### Notification Backend
- [x] Add notifications table to database schema
- [x] Create notification types enum (info, success, warning, error, custom)
- [x] Implement notification service layer
- [x] Create tRPC procedures for notification CRUD
- [x] Add notification persistence and history

### Notification Frontend
- [x] Create notification context provider
- [x] Build notification toast component
- [x] Implement notification center/panel
- [ ] Add notification preferences UI
- [ ] Create notification sound/badge support

### Notification Integration
- [ ] Integrate notifications for conversation events
- [ ] Add notifications for document uploads
- [ ] Implement notifications for model responses
- [ ] Add notifications for sharing events
- [ ] Create notifications for system alerts
