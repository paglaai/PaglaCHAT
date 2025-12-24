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
- [ ] Model management and configuration (seeding)
- [ ] System prompts management (seeding)

## Multi-Model LLM Integration
- [ ] Integrate OpenAI API support
- [ ] Integrate Anthropic API support
- [ ] Integrate Groq API support
- [ ] Integrate other cloud providers (Together AI, Hugging Face, etc.)
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
- [ ] Implement document upload functionality
- [ ] Create document chunking and embedding system
- [ ] Set up vector storage for document retrieval
- [ ] Implement RAG retrieval procedure
- [ ] Create document management UI
- [ ] Store documents in cloud storage (S3)

## System Prompts & Advanced Features
- [ ] Create system prompts library with predefined personalities
- [ ] Implement system prompt selection UI
- [ ] Build tool/function calling system
- [ ] Implement tool definition and execution
- [ ] Add voice-to-text transcription (Whisper API)
- [ ] Implement image generation from text (Image API)

## User Settings & Profile
- [ ] Create user profile page
- [ ] Implement API key management for cloud providers
- [ ] Build settings UI for preferences
- [ ] Add user preferences storage

## Testing & Optimization
- [ ] Write unit tests for backend procedures
- [ ] Write unit tests for frontend components
- [ ] Conduct end-to-end testing
- [ ] Optimize performance and bundle size
- [ ] Test responsive design across devices

## Deployment & Final Steps
- [ ] Create checkpoint for deployment
- [ ] Prepare deployment documentation
- [ ] Test production build
- [ ] Final QA and bug fixes
