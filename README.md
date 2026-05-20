# DirtyChat - Multi-Model AI Chat Application

A sophisticated, full-stack LLM chat application with support for multiple AI providers, Retrieval-Augmented Generation (RAG), voice input, image generation, and advanced tool-calling capabilities. Built with React 19, Express 4, tRPC 11, and inspired by International Typographic Style design principles.

![DirtyChat](https://img.shields.io/badge/DirtyChat-Multi--Model%20LLM%20Chat-FF0000?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express%204-339933?style=flat-square&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🚀 Features

### Core Chat Functionality

- **Multi-Model Support**: Seamlessly switch between OpenAI, Anthropic, Groq, Together AI, and local models
- **Real-Time Streaming**: Stream responses token-by-token with markdown rendering
- **Conversation Management**: Create, organize, archive, and search conversations
- **Message History**: Persistent storage with full conversation context

### Advanced Features

- **Retrieval-Augmented Generation (RAG)**: Upload documents and inject relevant context into LLM prompts
- **Voice Input**: Hands-free chat using Whisper API transcription
- **Image Generation**: Create and edit images from text prompts within conversations
- **Tool Calling**: LLM-triggered external integrations (web search, weather, calculator, code execution)
- **System Prompts Library**: Pre-built personas (General, Developer, Research, Data Analyst, Creative Writer)

### User Experience

- **International Typographic Style Design**: Clean, grid-based layout with mathematical precision
- **Mobile Optimization**: Fully responsive interface for mobile, tablet, and desktop
- **User Settings**: Manage API keys, preferences, and profile information
- **Dark Mode Ready**: Theme infrastructure for future dark mode support

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Quick Start

### Prerequisites

- Node.js 22.13.0 or higher
- pnpm 10.4.1 or higher
- MySQL/TiDB database
- API keys for LLM providers (optional for testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dirtychat.git
cd dirtychat

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Initialize database
pnpm db:push

# Seed initial data (models, system prompts)
node server/seed.mjs

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/dirtychat

# Authentication
JWT_SECRET=your-secret-key-here
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# LLM Providers (Optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...
TOGETHER_API_KEY=...

# Storage
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=...
```

## 🛠️ Development

### Project Structure

```
dirtychat/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities and helpers
│   │   ├── App.tsx           # Main app component
│   │   └── index.css         # Global styles
│   ├── index.html            # HTML template
│   └── public/               # Static assets
│
├── server/                    # Backend (Express + tRPC)
│   ├── routers/              # tRPC procedure definitions
│   ├── db.ts                 # Database queries
│   ├── storage.ts            # S3 storage helpers
│   ├── _core/                # Core infrastructure
│   └── seed.mjs              # Database seeding script
│
├── drizzle/                   # Database schema & migrations
│   ├── schema.ts             # Table definitions
│   └── migrations/           # SQL migration files
│
├── docs/                      # Documentation
│   ├── PRD.md               # Product requirements
│   ├── IA.md                # Information architecture
│   ├── DESIGN_DNA.md        # Design system
│   ├── BACKEND.md           # Backend architecture
│   └── WIREFRAMES.md        # UI wireframes
│
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.js        # Tailwind CSS config
└── README.md                 # This file
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Building for Production

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

## 📚 API Documentation

### Chat Router

#### Create Conversation

```typescript
trpc.chat.createConversation.mutate({
  title: "My Conversation",
  modelId: 1,
  systemPromptId: 1,
});
```

#### Send Message

```typescript
trpc.chat.sendMessage.mutate({
  conversationId: 1,
  message: "Hello, how are you?",
  useRAG: true,
});
```

#### List Conversations

```typescript
const conversations = await trpc.chat.listConversations.useQuery();
```

#### List Models

```typescript
const models = await trpc.chat.listModels.useQuery();
```

#### List System Prompts

```typescript
const prompts = await trpc.chat.listSystemPrompts.useQuery();
```

### Documents Router

#### Upload Document

```typescript
trpc.documents.uploadDocument.mutate({
  title: "My Document",
  fileName: "document.pdf",
  fileType: "application/pdf",
  content: "Document content here...",
});
```

#### Search Documents

```typescript
const results = await trpc.documents.searchDocuments.useQuery({
  query: "search term",
  limit: 5,
});
```

### Voice Router

#### Transcribe Audio

```typescript
const result = await trpc.voice.transcribeAudio.mutate({
  audioUrl: "https://example.com/audio.webm",
  language: "en",
});
```

### Images Router

#### Generate Image

```typescript
const result = await trpc.images.generateImage.mutate({
  prompt: "A serene landscape",
  conversationId: 1,
});
```

#### Edit Image

```typescript
const result = await trpc.images.editImage.mutate({
  imageUrl: "https://example.com/image.png",
  prompt: "Add a rainbow",
  conversationId: 1,
});
```

## 🗄️ Database Schema

### Users

Stores user account information and authentication details.

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

### Conversations

Stores chat conversation metadata.

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

### Messages

Stores individual chat messages.

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

### Models

Stores available LLM models and configurations.

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

### System Prompts

Stores pre-built assistant personalities.

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

### Documents

Stores uploaded documents for RAG.

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

### Document Chunks

Stores chunked document content.

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

## 🚀 Deployment

### Prerequisites

- Docker and Docker Compose
- AWS S3 bucket for file storage
- MySQL/TiDB database
- Node.js hosting environment

### Deployment Steps

1. **Build the application**

   ```bash
   pnpm build
   ```

2. **Set production environment variables**

   ```bash
   export DATABASE_URL=mysql://...
   export JWT_SECRET=...
   # ... other variables
   ```

3. **Run database migrations**

   ```bash
   pnpm db:push
   ```

4. **Start the production server**
   ```bash
   pnpm start
   ```

### Docker Deployment

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY . .
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Run `pnpm format` before committing
- Write tests for new features

### Commit Messages

- Use conventional commits format
- Examples: `feat: add voice input`, `fix: resolve chat streaming issue`, `docs: update README`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by International Typographic Style design principles
- Built with [React](https://react.dev), [Express](https://expressjs.com), and [tRPC](https://trpc.io)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)
- Styling with [Tailwind CSS](https://tailwindcss.com)

## 📞 Support

For support, email support@dirtychat.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Real-time collaboration with WebSockets
- [ ] Advanced RAG with vector embeddings
- [ ] Model fine-tuning interface
- [ ] Team workspaces and permissions
- [ ] Mobile native apps (iOS/Android)
- [ ] Custom tool builder
- [ ] Integration marketplace
- [ ] Enterprise features (SSO, audit logs)

---

**Made with ❤️ by the DirtyChat Team**
