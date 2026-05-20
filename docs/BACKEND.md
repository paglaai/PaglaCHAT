# DirtyChat - Backend Architecture & API Specifications

## Architecture Overview

DirtyChat backend follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│      Frontend (React + Vite)        │
├─────────────────────────────────────┤
│      tRPC Client Layer              │
├─────────────────────────────────────┤
│      tRPC Router Layer              │
│  (Procedures & Input Validation)    │
├─────────────────────────────────────┤
│      Business Logic Layer           │
│  (Services & Utilities)             │
├─────────────────────────────────────┤
│      Data Access Layer              │
│  (Drizzle ORM & Database)           │
├─────────────────────────────────────┤
│      External Services              │
│  (LLM APIs, S3, Whisper, etc.)      │
└─────────────────────────────────────┘
```

## Technology Stack

| Layer                | Technology          | Purpose                                      |
| -------------------- | ------------------- | -------------------------------------------- |
| **API Framework**    | tRPC 11             | Type-safe RPC with end-to-end type inference |
| **Runtime**          | Node.js + Express 4 | Server runtime and HTTP framework            |
| **Database**         | MySQL/TiDB          | Relational data storage                      |
| **ORM**              | Drizzle ORM         | Type-safe database access                    |
| **Authentication**   | Manus OAuth + JWT   | User authentication and session management   |
| **File Storage**     | AWS S3              | Document and image storage                   |
| **LLM Integration**  | Provider APIs       | OpenAI, Anthropic, Groq, Together AI         |
| **Voice Processing** | Whisper API         | Audio transcription                          |
| **Image Generation** | Image API           | Text-to-image generation                     |

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Conversations Table

```sql
CREATE TABLE conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  title VARCHAR(255),
  modelId INT,
  systemPromptId INT,
  isArchived BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (modelId) REFERENCES models(id),
  FOREIGN KEY (systemPromptId) REFERENCES systemPrompts(id)
);
```

### Messages Table

```sql
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversationId INT NOT NULL,
  role ENUM('user', 'assistant', 'system') NOT NULL,
  content LONGTEXT,
  tokensUsed INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversationId) REFERENCES conversations(id)
);
```

### Models Table

```sql
CREATE TABLE models (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL,
  provider VARCHAR(100) NOT NULL,
  modelId VARCHAR(255) NOT NULL,
  description TEXT,
  contextWindow INT,
  costPer1kTokens DECIMAL(10, 6),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### System Prompts Table

```sql
CREATE TABLE systemPrompts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  content LONGTEXT NOT NULL,
  category VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Documents Table

```sql
CREATE TABLE documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  title VARCHAR(255),
  fileName VARCHAR(255),
  fileType VARCHAR(50),
  fileSize INT,
  s3Key VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Document Chunks Table

```sql
CREATE TABLE documentChunks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  documentId INT NOT NULL,
  chunkIndex INT,
  content LONGTEXT,
  embedding JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (documentId) REFERENCES documents(id)
);
```

### Tools Table

```sql
CREATE TABLE tools (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  parameters JSON,
  isEnabled BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints (tRPC Procedures)

### Chat Router

**chat.createConversation**

- Input: `{ title: string, modelId: number, systemPromptId?: number }`
- Output: `{ id: number, title: string, createdAt: Date }`
- Auth: Protected

**chat.sendMessage**

- Input: `{ conversationId: number, message: string, useRAG?: boolean }`
- Output: `{ messageId: number, response: string, tokensUsed: number }`
- Auth: Protected
- Features: Streaming support, RAG integration, tool calling

**chat.listConversations**

- Input: None
- Output: `Conversation[]`
- Auth: Protected

**chat.getConversation**

- Input: `{ conversationId: number }`
- Output: `{ conversation: Conversation, messages: Message[] }`
- Auth: Protected

**chat.deleteConversation**

- Input: `{ conversationId: number }`
- Output: `{ success: boolean }`
- Auth: Protected

**chat.archiveConversation**

- Input: `{ conversationId: number }`
- Output: `{ success: boolean }`
- Auth: Protected

**chat.listModels**

- Input: None
- Output: `Model[]`
- Auth: Public

**chat.listSystemPrompts**

- Input: None
- Output: `SystemPrompt[]`
- Auth: Public

### Documents Router

**documents.uploadDocument**

- Input: `{ title: string, fileName: string, fileType: string, content: string }`
- Output: `{ documentId: number, chunks: number }`
- Auth: Protected
- Features: Automatic chunking, S3 upload

**documents.listDocuments**

- Input: None
- Output: `Document[]`
- Auth: Protected

**documents.deleteDocument**

- Input: `{ documentId: number }`
- Output: `{ success: boolean }`
- Auth: Protected

**documents.searchDocuments**

- Input: `{ query: string, limit?: number }`
- Output: `DocumentChunk[]`
- Auth: Protected
- Features: Semantic search, similarity scoring

### Voice Router

**voice.transcribeAudio**

- Input: `{ audioUrl: string, language?: string, prompt?: string }`
- Output: `{ text: string, language: string, segments: Segment[] }`
- Auth: Protected
- External: Whisper API

### Images Router

**images.generateImage**

- Input: `{ prompt: string, conversationId: number }`
- Output: `{ imageUrl: string, prompt: string }`
- Auth: Protected
- External: Image Generation API

**images.editImage**

- Input: `{ imageUrl: string, prompt: string, conversationId: number }`
- Output: `{ imageUrl: string, prompt: string }`
- Auth: Protected

### Tools Router

**tools.listTools**

- Input: None
- Output: `Tool[]`
- Auth: Protected

**tools.executeTool**

- Input: `{ toolName: string, parameters: Record<string, any> }`
- Output: `{ result: any, success: boolean }`
- Auth: Protected

### Auth Router

**auth.me**

- Input: None
- Output: `User | null`
- Auth: Public

**auth.logout**

- Input: None
- Output: `{ success: boolean }`
- Auth: Protected

## LLM Service Layer

### Unified LLM Interface

```typescript
interface LLMMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | ContentBlock[];
}

interface LLMRequest {
  messages: LLMMessage[];
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  tools?: Tool[];
  toolChoice?: "auto" | "none" | "required";
}

interface LLMResponse {
  content: string;
  tokensUsed: number;
  model: string;
  finishReason: string;
  toolCalls?: ToolCall[];
}
```

### Provider Adapters

Each provider (OpenAI, Anthropic, Groq, Together AI) has an adapter that:

1. Translates unified request to provider-specific format
2. Handles authentication and rate limiting
3. Processes provider-specific responses
4. Normalizes output to unified format

### Streaming Support

Streaming responses are handled through Server-Sent Events (SSE) with:

- Token-by-token streaming
- Automatic retry on connection loss
- Graceful degradation to polling

## Authentication & Authorization

### OAuth Flow

1. User clicks "Sign In"
2. Redirected to Manus OAuth provider
3. User authenticates
4. Redirected back with authorization code
5. Backend exchanges code for access token
6. User record created/updated in database
7. Session cookie set with JWT

### Session Management

- JWT tokens stored in HTTP-only cookies
- Token expiration: 30 days
- Refresh token rotation on each request
- CSRF protection enabled

### Role-Based Access Control

```typescript
enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// Protected procedure example
const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx });
});

// Admin procedure example
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx });
});
```

## Error Handling

### Error Types

| Code                  | Status | Description              |
| --------------------- | ------ | ------------------------ |
| PARSE_ERROR           | 400    | Invalid input            |
| BAD_REQUEST           | 400    | Malformed request        |
| UNAUTHORIZED          | 401    | Authentication required  |
| FORBIDDEN             | 403    | Insufficient permissions |
| NOT_FOUND             | 404    | Resource not found       |
| CONFLICT              | 409    | Resource conflict        |
| PRECONDITION_FAILED   | 412    | Precondition failed      |
| PAYLOAD_TOO_LARGE     | 413    | Request too large        |
| UNPROCESSABLE_CONTENT | 422    | Cannot process request   |
| TOO_MANY_REQUESTS     | 429    | Rate limit exceeded      |
| INTERNAL_SERVER_ERROR | 500    | Server error             |

### Error Response Format

```json
{
  "code": "BAD_REQUEST",
  "message": "Invalid input",
  "data": {
    "path": "chat.sendMessage",
    "details": "Message cannot be empty"
  }
}
```

## Performance Optimization

### Caching Strategy

- **Database queries**: Redis caching for models and system prompts
- **API responses**: Client-side caching with React Query
- **LLM responses**: No caching (unique per conversation)

### Database Optimization

- Indexes on frequently queried columns (userId, conversationId)
- Pagination for large result sets
- Connection pooling with maximum 10 connections

### API Rate Limiting

- Per-user rate limit: 100 requests/minute
- Per-IP rate limit: 1000 requests/minute
- Exponential backoff for LLM provider APIs

## Security Measures

### Data Protection

- API keys encrypted with AES-256
- Passwords hashed with bcrypt (salt rounds: 10)
- HTTPS enforced for all connections
- CORS configured for frontend domain only

### Input Validation

- Zod schemas for all inputs
- SQL injection prevention via parameterized queries
- XSS prevention via output encoding
- CSRF tokens for state-changing operations

### Audit Logging

- All user actions logged with timestamp
- Sensitive operations flagged for review
- Logs retained for 90 days

## Deployment & DevOps

### Environment Variables

```
DATABASE_URL=mysql://user:pass@host/db
JWT_SECRET=<random-secret-key>
VITE_APP_ID=<manus-app-id>
OAUTH_SERVER_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=<api-key>
BUILT_IN_FORGE_API_URL=https://api.manus.im
```

### Monitoring & Logging

- Application logs: Structured JSON logging
- Error tracking: Sentry integration
- Performance monitoring: New Relic APM
- Uptime monitoring: Pingdom

### Backup & Recovery

- Daily database backups
- Point-in-time recovery capability
- Disaster recovery plan with RTO < 4 hours
