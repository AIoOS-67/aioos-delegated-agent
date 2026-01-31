# AiOOS - AI Onchain Operating System

> Gemini 3 Hackathon Project - Delegated Agent Authorization Demo

## Overview

AiOOS demonstrates a complete delegation flow for AI agents:

1. **Human Login** - Authenticate via Auth0 or try Demo Mode
2. **Create AI Agent** - Set permissions, constraints, and expiration
3. **Execute Tasks** - Agent uses Gemini to perform multi-step tasks
4. **Revoke Access** - Instantly terminate agent access at any time

## Tech Stack

- **Frontend**: Next.js 14 + React + Tailwind CSS
- **Auth**: Auth0 (OIDC) with Demo Mode fallback
- **Database**: SQLite (better-sqlite3)
- **AI**: Google Gemini API (`gemini-2.0-flash`)
- **Deploy**: Docker + Google Cloud Run

## Quick Start (Local Development)

### Prerequisites

- Node.js 20+
- npm or yarn
- Gemini API key (get one at [Google AI Studio](https://aistudio.google.com/))

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd aioos-hackathon

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local with your settings
# At minimum, set:
# - GEMINI_API_KEY=your_gemini_api_key
# - DEMO_MODE_ENABLED=true

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `DEMO_MODE_ENABLED` | Enable demo mode without Auth0 | Yes (for demo) |
| `AUTH0_SECRET` | Auth0 secret (32 bytes) | For Auth0 |
| `AUTH0_BASE_URL` | Your app URL | For Auth0 |
| `AUTH0_ISSUER_BASE_URL` | Auth0 domain | For Auth0 |
| `AUTH0_CLIENT_ID` | Auth0 client ID | For Auth0 |
| `AUTH0_CLIENT_SECRET` | Auth0 client secret | For Auth0 |
| `DATABASE_PATH` | SQLite database path | Optional |

## Deploy to Google Cloud Run

### Prerequisites

- Google Cloud account with billing enabled
- `gcloud` CLI installed and configured
- Enable required APIs:
  ```bash
  gcloud services enable run.googleapis.com
  gcloud services enable cloudbuild.googleapis.com
  ```

### One-Command Deploy

```bash
# Deploy directly from source
gcloud run deploy aioos-demo \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="DEMO_MODE_ENABLED=true,GEMINI_API_KEY=your_key"
```

### CI/CD with Cloud Build

1. Connect your repository to Cloud Build
2. Create a trigger for the main branch
3. Set environment variables as substitutions or secrets:
   ```bash
   gcloud builds submit --config cloudbuild.yaml \
     --substitutions=_GEMINI_API_KEY="your_key"
   ```

### Environment Variables in Cloud Run

Set secrets securely:

```bash
# Create a secret
echo -n "your_gemini_api_key" | gcloud secrets create gemini-api-key --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"

# Deploy with secret
gcloud run deploy aioos-demo \
  --source . \
  --region us-central1 \
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest"
```

## Project Structure

```
aioos-hackathon/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── agent/         # Agent CRUD operations
│   │   ├── task/          # Task execution
│   │   └── revoke/        # Agent revocation
│   ├── dashboard/         # Dashboard page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── AgentCard.tsx      # Agent display card
│   ├── CreateAgentModal.tsx  # Agent creation form
│   └── TaskExecutor.tsx   # Task execution UI
├── lib/
│   ├── auth.ts            # Authentication utilities
│   ├── db.ts              # Database operations
│   └── gemini.ts          # Gemini API integration
├── Dockerfile             # Container configuration
├── cloudbuild.yaml        # CI/CD configuration
└── README.md
```

## Features

### Agent Creation
- Custom name and description
- Granular permissions (text, code, data analysis, etc.)
- Optional constraints for agent behavior
- Configurable expiration time

### Task Execution
- Real-time step-by-step progress
- Streaming updates via Server-Sent Events
- Automatic agent validity checking at each step

### Instant Revocation
- One-click agent termination
- Immediately stops running tasks
- Full audit logging

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/login` | Auth0 login |
| GET | `/api/auth/logout` | Auth0 logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/demo` | Enter demo mode |
| GET | `/api/agent` | List user's agents |
| POST | `/api/agent` | Create new agent |
| GET | `/api/agent/[id]` | Get agent details |
| DELETE | `/api/agent/[id]` | Delete agent |
| POST | `/api/revoke/[agentId]` | Revoke agent |
| POST | `/api/task/execute` | Execute task (streaming) |

## Demo Flow

1. Click "Try Demo Mode" on the landing page
2. Create a new agent with desired permissions
3. Click "Execute Task" and enter a task description
4. Watch the agent execute steps in real-time
5. Click "Revoke" to immediately disable the agent
6. Observe that revoked agents cannot execute new tasks

## Security Considerations

- Agents are scoped to their creator
- Expiration times are enforced server-side
- Revocation is immediate and irreversible
- All actions are audit-logged
- Demo mode uses isolated demo user context

## License

MIT License - Built for Gemini 3 Hackathon

---

**AiOOS - AI Onchain Operating System**
Built with Google Gemini
