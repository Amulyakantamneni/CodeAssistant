# Code Assistant

A comprehensive AI-powered code analysis tool with debugging, refactoring, optimization, testing, and PR generation capabilities.

Built with **Next.js** (Frontend) + **FastAPI** (Backend) + **Redis/Celery** (Worker Queue) + **Docker**.

![Code Assistant](https://img.shields.io/badge/Code-Assistant-purple)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)
![Redis](https://img.shields.io/badge/Redis-7-red)
![Celery](https://img.shields.io/badge/Celery-5.3-green)

## Features

### Tools

| Tool | Description |
|------|-------------|
| **Debugger** | Identifies syntax and logic errors with line numbers and suggested fixes |
| **Refactorizer** | Applies clean code principles (SOLID, DRY, KISS) to improve code quality |
| **Optimizer** | Suggests performance improvements with Big O analysis |
| **Tester** | Generates comprehensive test cases and test code |
| **PR Generator** | Creates professional pull request descriptions |

### Additional Features

- **Dark/Light Mode** - Toggle between themes
- **GitHub Integration** - Import code from GitHub URLs
- **Export to GitHub** - Push code changes directly to repositories
- **Create PRs** - Generate and create pull requests
- **Multi-tool Analysis** - Run multiple tools simultaneously
- **Background Jobs** - Long-running tasks processed by Celery workers
- **Real-time Updates** - Job status polling with live updates
- **File Upload** - Upload local files for analysis
- **Results Dashboard** - View all analysis results in one place
- **Export Results** - Download analysis results as JSON

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Next.js       │────▶│   FastAPI       │────▶│   Redis         │
│   Frontend      │     │   Backend       │     │   Broker        │
│   (Port 3000)   │     │   (Port 8000)   │     │   (Port 6379)   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │   Celery        │
                                                │   Workers       │
                                                │                 │
                                                └─────────────────┘
```

## Project Structure

```
code-assistant/
├── backend/
│   ├── main.py            # FastAPI application
│   ├── celery_app.py      # Celery configuration
│   ├── tasks.py           # Celery background tasks
│   ├── ai_service.py      # OpenAI integration
│   ├── config.py          # Configuration settings
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Main page
│   │   └── globals.css    # Global styles
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── CodeInput.tsx
│   │   ├── ToolSelector.tsx
│   │   ├── ResultsDashboard.tsx
│   │   ├── GitHubExport.tsx
│   │   └── ThemeProvider.tsx
│   ├── lib/
│   │   ├── api.ts         # API client
│   │   └── utils.ts       # Utility functions
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Getting Started

### Option 1: Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Amulyakantamneni/CodeAssistant.git
   cd CodeAssistant
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

3. **Start all services:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - Flower (Task Monitor): http://localhost:5555

### Option 2: Manual Setup

#### Prerequisites
- Python 3.11+
- Node.js 20+
- Redis

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY=your_key_here
export REDIS_URL=redis://localhost:6379/0

# Start Redis (required)
redis-server

# Start Celery worker (in a new terminal)
celery -A celery_app worker --loglevel=info

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables (optional)
export NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

## API Endpoints

### Async Job Endpoints (Recommended)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/jobs/debug` | POST | Create debug job |
| `/api/jobs/refactor` | POST | Create refactor job |
| `/api/jobs/optimize` | POST | Create optimize job |
| `/api/jobs/test` | POST | Create test generation job |
| `/api/jobs/pr` | POST | Create PR generation job |
| `/api/jobs/analyze-all` | POST | Run multiple tools |
| `/api/jobs/{job_id}` | GET | Get job status/result |

### Sync Endpoints (Quick Operations)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/debug` | POST | Synchronous debug |
| `/api/refactor` | POST | Synchronous refactor |
| `/api/optimize` | POST | Synchronous optimize |
| `/api/test` | POST | Synchronous test generation |
| `/api/generate-pr` | POST | Synchronous PR generation |

### GitHub Integration

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/github/export` | POST | Export code to GitHub |
| `/api/github/create-pr` | POST | Create a pull request |

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Celery** - Distributed task queue
- **Redis** - Message broker & result backend
- **OpenAI API** - AI-powered analysis
- **PyGithub** - GitHub API integration

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **React Syntax Highlighter** - Code display
- **Lucide React** - Icons

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Deployment

### Recommended Platforms

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | **Vercel** | Native Next.js support |
| Backend | **Railway** / **Render** | Python + Redis support |
| Redis | **Upstash** / **Redis Cloud** | Managed Redis |
| Workers | **Railway** / **Render** | Background workers |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `GITHUB_TOKEN` | GitHub Personal Access Token | No |
| `REDIS_URL` | Redis connection URL | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | No |

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with AI-powered tools for developers
