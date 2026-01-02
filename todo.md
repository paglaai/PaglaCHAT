# TogetherChatUI Clone - Project TODO

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
