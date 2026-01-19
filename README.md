# Code Assistant

A comprehensive AI-powered code analysis tool with debugging, refactoring, optimization, testing, and PR generation capabilities.

![Code Assistant](https://img.shields.io/badge/Code-Assistant-purple)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## Features

### Tools

- **Debugger** - Identifies syntax and logic errors with line numbers and suggested fixes
- **Refactorizer** - Applies clean code principles (SOLID, DRY, KISS) to improve code quality
- **Optimizer** - Suggests performance improvements with Big O analysis
- **Tester** - Generates comprehensive test cases and test code
- **PR Generator** - Creates professional pull request descriptions

### Additional Features

- **Dark/Light Mode** - Toggle between themes
- **GitHub Integration** - Import code from GitHub URLs
- **Export to GitHub** - Push code changes directly to repositories
- **Create PRs** - Generate and create pull requests
- **Multi-tool Analysis** - Run multiple tools simultaneously
- **File Upload** - Upload local files for analysis
- **Results Dashboard** - View all analysis results in one place
- **Export Results** - Download analysis results as JSON

## Project Structure

```
code-assistant/
├── backend/
│   ├── server.js          # Express API server
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # API utilities
│   │   ├── App.jsx        # Main application
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── public/            # Static assets
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   └── package.json       # Frontend dependencies
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- GitHub Personal Access Token (for GitHub features)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd code-assistant
   ```

2. **Set up the backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and add your API keys
   ```

3. **Set up the frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
GITHUB_TOKEN=your_github_token_here
```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## API Endpoints

### Analysis Tools

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/debug` | POST | Debug code for errors |
| `/api/refactor` | POST | Refactor code with clean code principles |
| `/api/optimize` | POST | Optimize code for performance |
| `/api/test` | POST | Generate test cases |
| `/api/generate-pr` | POST | Generate PR description |
| `/api/analyze-all` | POST | Run multiple tools simultaneously |

### GitHub Integration

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/github/export` | POST | Export code to GitHub |
| `/api/github/create-pr` | POST | Create a pull request |

### Request Format

```json
{
  "code": "your code here",
  "language": "JavaScript",
  "githubUrl": "optional GitHub file URL"
}
```

## Usage

1. **Enter your code** - Paste code directly or provide a GitHub URL
2. **Select language** - Choose the programming language (or auto-detect)
3. **Choose tools** - Select one or more analysis tools
4. **Run analysis** - Click the run button to execute selected tools
5. **Review results** - View detailed results in the dashboard
6. **Export** - Export to GitHub or download results

## Tech Stack

### Backend
- Express.js - Web framework
- OpenAI API - AI-powered analysis
- Octokit - GitHub API integration
- Axios - HTTP client

### Frontend
- React 18 - UI framework
- Vite - Build tool
- Tailwind CSS - Styling
- Framer Motion - Animations
- React Syntax Highlighter - Code display
- Lucide React - Icons

## Screenshots

The application features a modern UI with:
- Clean, responsive design
- Dark and light mode support
- Intuitive tool selection
- Expandable result cards
- Code syntax highlighting

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with AI-powered tools for developers
