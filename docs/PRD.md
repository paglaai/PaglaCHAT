# DirtyChat - Product Requirements Document

## Executive Summary

**DirtyChat** is a sophisticated, multi-model LLM chat application that enables users to interact with various AI models from different providers (OpenAI, Anthropic, Groq, Together AI) through a unified, elegant interface. The application emphasizes clean design, powerful functionality, and seamless user experience with support for advanced features like Retrieval-Augmented Generation (RAG), voice input, image generation, and tool-calling capabilities.

## Product Vision

To democratize access to cutting-edge AI models by providing a unified platform where users can leverage multiple LLM providers without vendor lock-in, while maintaining a pristine, professional interface inspired by International Typographic Style principles.

## Core Features

### 1. Multi-Model LLM Support
- **Supported Providers**: OpenAI, Anthropic, Groq, Together AI, and local models via GGUF
- **Model Selection**: Users can switch between models mid-conversation
- **Streaming Responses**: Real-time response streaming with markdown rendering
- **Context Management**: Automatic conversation history management with token optimization

### 2. Conversation Management
- **Create/Edit/Delete**: Full CRUD operations on conversations
- **Archive Feature**: Archive conversations without deletion
- **Conversation History**: Persistent storage with full message history
- **Search**: Find conversations by title or content
- **Export**: Export conversations as markdown or JSON

### 3. Retrieval-Augmented Generation (RAG)
- **Document Upload**: Support for PDF, TXT, DOCX, and other text formats
- **Automatic Chunking**: Intelligent text chunking with overlap for context preservation
- **Semantic Search**: Similarity-based document retrieval
- **Context Injection**: Automatically include relevant documents in LLM prompts
- **Document Management**: Organize, delete, and manage uploaded documents

### 4. Advanced Features
- **System Prompts Library**: Pre-built personas (General Assistant, Developer, Research, Data Analyst, Creative Writer)
- **Voice Input**: Hands-free chat using Whisper API transcription
- **Image Generation**: Create images from text prompts within conversations
- **Image Editing**: Edit generated images with additional prompts
- **Tool Calling**: LLM-triggered external integrations (web search, weather, calculator, code execution)

### 5. User Management
- **Authentication**: OAuth 2.0 integration with Manus platform
- **Profile Management**: User profile with email and account information
- **API Key Management**: Secure storage of provider API keys
- **User Preferences**: Customizable settings for models, prompts, and interface behavior
- **Role-Based Access**: Admin and user roles for future expansion

### 6. Mobile Optimization
- **Responsive Design**: Fully responsive interface for mobile, tablet, and desktop
- **Touch-Friendly Controls**: Optimized buttons and inputs for touch interaction
- **Mobile Navigation**: Collapsible sidebar for smaller screens
- **Performance**: Optimized bundle size and lazy loading for mobile networks

## Technical Architecture

### Frontend Stack
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 with custom design tokens
- **State Management**: TanStack React Query with tRPC
- **UI Components**: shadcn/ui with Radix UI primitives
- **Markdown Rendering**: Streamdown for rich text display
- **Icons**: Lucide React

### Backend Stack
- **Runtime**: Node.js with Express 4
- **API Framework**: tRPC 11 for type-safe RPC
- **Database**: MySQL/TiDB with Drizzle ORM
- **LLM Integration**: Unified LLM service layer with provider abstraction
- **File Storage**: S3 for document and image storage
- **Authentication**: Manus OAuth with JWT sessions

### Database Schema
- **users**: User accounts and authentication
- **conversations**: Chat conversation metadata
- **messages**: Individual messages with role and content
- **models**: Available LLM models and configurations
- **systemPrompts**: Pre-built assistant personalities
- **documents**: Uploaded documents for RAG
- **documentChunks**: Chunked document content with embeddings
- **tools**: Available tool definitions for function calling

## User Personas

### 1. Developer
- Uses DirtyChat for code generation, debugging, and technical documentation
- Prefers Developer system prompt
- Frequently uses code execution tool
- Values context from uploaded documentation

### 2. Researcher
- Leverages RAG for literature review and data analysis
- Uses Research system prompt
- Uploads academic papers and datasets
- Needs conversation export and citation tracking

### 3. Content Creator
- Uses Creative Writer system prompt
- Generates and edits images
- Needs voice input for hands-free brainstorming
- Values conversation organization and export

### 4. Business Analyst
- Uses Data Analyst system prompt
- Analyzes documents and datasets
- Needs tool integration for data retrieval
- Prefers specific model selection for consistency

## Success Metrics

### Engagement
- Daily Active Users (DAU)
- Average session duration
- Conversations per user per week
- Feature adoption rates (voice, image generation, RAG)

### Performance
- Page load time < 2 seconds
- Time to first response < 1 second
- API response time < 500ms (p95)
- Mobile Lighthouse score > 90

### Quality
- User satisfaction score > 4.5/5
- Error rate < 0.1%
- Model response accuracy > 95%
- Document retrieval precision > 90%

## Roadmap

### Phase 1 (Current)
- ✅ Multi-model support
- ✅ Conversation management
- ✅ RAG functionality
- ✅ Voice input and image generation
- ✅ Tool calling system

### Phase 2 (Q2 2026)
- Real-time collaboration (WebSocket support)
- Advanced RAG with vector embeddings
- Model fine-tuning interface
- Team workspaces
- Conversation sharing and permissions

### Phase 3 (Q3 2026)
- Mobile native apps (iOS/Android)
- Advanced analytics and insights
- Custom tool builder
- Integration marketplace
- Enterprise features (SSO, audit logs)

## Constraints & Assumptions

### Constraints
- API rate limits from LLM providers
- Token context window limitations per model
- File size limits for document uploads (100MB)
- Storage quotas per user

### Assumptions
- Users have valid API keys for cloud providers
- Users have stable internet connection
- Browsers support modern Web APIs (Web Audio, File API)
- Users understand LLM capabilities and limitations

## Success Criteria

1. **Functionality**: All core features work as specified
2. **Performance**: Meets performance benchmarks
3. **UX**: International Typographic Style maintained consistently
4. **Reliability**: 99.5% uptime SLA
5. **Security**: End-to-end encryption for sensitive data, secure API key storage
