# AI-Powered Automated Blogging Platform

Production-grade platform combining CMS, CRM, and multi-provider AI for automated content generation with MENA localization.

## Features

### Core Platform
- **Real Estate CMS**: Property, agent, and page management
- **CRM System**: Lead tracking, deal pipeline, conversion analytics
- **AI Control Panel**: Multi-provider AI management (OpenAI, Claude, Gemini, Groq, Grok, OpenRouter)
- **Prompt Template Manager**: Version-controlled prompt library with testing console

### Automated Blogging
- **Content Research**: Multi-source ingestion (RSS, News API, Reddit, Twitter, TikTok)
- **AI Generation**: Automated article creation with quality checks
- **Batch Processing**: Daily scheduled content pipeline (Dubai time UTC+4)
- **Quality Assurance**: Plagiarism detection, toxicity filtering, accessibility checks
- **Publishing**: Automated MDX generation, SEO optimization, sitemap updates
- **Social Distribution**: Multi-platform scheduling (Twitter, LinkedIn, Facebook)

### MENA Localization
- Regional relevance scoring for UAE/GCC content
- MENA-specific keyword filtering
- Localized content angles and perspectives

## Tech Stack

### Frontend
- **Framework**: Vite + React 18 + TypeScript
- **UI**: ShadCN UI (Radix primitives) + Tailwind CSS
- **Routing**: React Router v6
- **State**: React hooks + TanStack Query
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL + Prisma ORM
- **Queue**: BullMQ + Redis
- **AI**: Multi-provider integration with fallback routing
- **Security**: JWT auth, API key encryption, GDPR compliance

### Automation
- **Scheduling**: GitHub Actions (daily batch)
- **Monitoring**: Sentry + OpenTelemetry
- **Deployment**: Vercel (frontend) + Render/AWS (backend)

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Database setup
npm run prisma:migrate
npm run prisma:generate

# Start development servers
npm run dev          # Frontend (port 5173)
npm run server:dev   # Backend (port 3001)
```

### Database Migration

```bash
npm run prisma:migrate
npm run prisma:studio  # View database
```

### Batch Processing

```bash
# Manual batch run
npm run batch:daily

# GitHub Actions runs automatically at 6 AM UTC+4
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ai/              # AI provider & prompt management
│   │   ├── layout/          # Sidebar, navigation
│   │   └── ui/              # ShadCN components
│   ├── pages/
│   │   ├── blog/            # Blog management pages
│   │   ├── cms/             # CMS pages
│   │   └── crm/             # CRM pages
│   ├── contexts/            # React contexts (theme, etc.)
│   └── types/               # TypeScript definitions
├── server/
│   ├── routes/              # API endpoints
│   ├── services/            # Business logic
│   │   ├── content-research.ts
│   │   ├── article-generation.ts
│   │   ├── quality-check.ts
│   │   ├── batch-processor.ts
│   │   └── publishing.ts
│   ├── middleware/          # Auth, validation
│   └── lib/                 # Utilities (Prisma, encryption)
├── prisma/
│   └── schema.prisma        # Database schema
└── .github/
    └── workflows/
        └── daily-batch.yml  # Automated scheduling
```

## API Endpoints

### Blog Management
- `GET /api/blog` - List posts
- `POST /api/blog` - Create post
- `PUT /api/blog/:id` - Update post
- `DELETE /api/blog/:id` - Delete post
- `POST /api/blog/:id/publish` - Publish post

### Content Research
- `GET /api/content-topics` - List topics
- `POST /api/content-topics` - Create topic
- `GET /api/content-sources` - List sources
- `POST /api/content-sources` - Add source

### Batch Jobs
- `GET /api/batch-jobs` - List jobs
- `POST /api/batch-jobs` - Create job
- `POST /api/batch-jobs/:id/retry` - Retry failed job

### AI Providers
- `GET /api/ai-providers` - List providers
- `POST /api/ai-providers` - Add provider
- `POST /api/ai-providers/:id/test` - Test connection
- `POST /api/ai-providers/:id/usage` - Log usage

## Environment Variables

Required variables in `.env`:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
ENCRYPTION_KEY="..."
FRONTEND_URL="http://localhost:5173"

# AI Provider Keys
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GOOGLE_API_KEY=""
GROQ_API_KEY=""
GROK_API_KEY=""
OPENROUTER_API_KEY=""

# Content Sources
NEWS_API_KEY=""
```

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Render/AWS)
```bash
# Set environment variables
# Deploy with Dockerfile or Node.js buildpack
npm run server
```

### GitHub Actions
- Workflow runs daily at 6 AM UTC+4
- Commits generated content to repo
- Requires secrets: `DATABASE_URL`, `ENCRYPTION_KEY`, `FRONTEND_URL`

## Monitoring

- **Logs**: Server logs via `console.log` (integrate Sentry for production)
- **Metrics**: AI usage tracked in `ai_usage_logs` table
- **Jobs**: Monitor batch jobs via `/blog/jobs` page
- **Errors**: Failed jobs logged with retry mechanism

## Security

- API keys encrypted at rest (AES-256-CBC)
- JWT authentication for protected routes
- CORS configured for frontend origin
- Input validation via Zod schemas
- SQL injection prevention via Prisma

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT License

## Support

For issues or questions, open a GitHub issue.
