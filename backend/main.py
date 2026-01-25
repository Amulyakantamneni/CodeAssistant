from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import redis
from celery.result import AsyncResult

from config import settings
from celery_app import celery_app
from tasks import debug_code, refactor_code, optimize_code, test_code, generate_pr, analyze_all
from ai_service import analyze_with_ai, PROMPTS

app = FastAPI(
    title="Code Assistant API",
    description="AI-powered code analysis: Debug, Refactor, Optimize, Test, and PR Generation",
    version="2.0.0"
)

# CORS middleware
allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]
allow_all_origins = "*" in allowed_origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=not allow_all_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
redis_client = redis.from_url(settings.REDIS_URL)


# Request/Response Models
class CodeRequest(BaseModel):
    code: str = ""
    language: Optional[str] = ""
    github_url: Optional[str] = ""


class RefactorRequest(CodeRequest):
    principles: Optional[List[str]] = None


class OptimizeRequest(CodeRequest):
    focus_areas: Optional[List[str]] = None


class TestRequest(CodeRequest):
    test_framework: Optional[str] = ""


class PRRequest(BaseModel):
    original_code: str
    modified_code: str
    changes: Optional[str] = ""
    language: Optional[str] = ""
    title: Optional[str] = ""


class MultiAnalysisRequest(CodeRequest):
    tools: Optional[List[str]] = None


class GitHubExportRequest(BaseModel):
    code: str
    filename: str
    repo: str
    branch: Optional[str] = "main"
    commit_message: Optional[str] = ""
    github_token: str


class GitHubPRRequest(BaseModel):
    repo: str
    title: str
    body: Optional[str] = ""
    head: str
    base: Optional[str] = "main"
    github_token: str


class JobResponse(BaseModel):
    job_id: str
    status: str


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    code: Optional[str] = ""
    language: Optional[str] = ""
    history: Optional[List[ChatMessage]] = None


# Health check
@app.get("/api/health")
async def health_check():
    redis_status = "connected"
    try:
        redis_client.ping()
    except:
        redis_status = "disconnected"

    return {
        "status": "ok",
        "redis": redis_status,
        "version": "2.0.0"
    }


# ==================== ASYNC JOB ENDPOINTS ====================

@app.post("/api/jobs/debug", response_model=JobResponse)
async def create_debug_job(request: CodeRequest):
    """Create an async debug job."""
    task = debug_code.delay(
        code=request.code,
        language=request.language,
        github_url=request.github_url
    )
    return JobResponse(job_id=task.id, status="pending")


@app.post("/api/jobs/refactor", response_model=JobResponse)
async def create_refactor_job(request: RefactorRequest):
    """Create an async refactor job."""
    task = refactor_code.delay(
        code=request.code,
        language=request.language,
        github_url=request.github_url,
        principles=request.principles
    )
    return JobResponse(job_id=task.id, status="pending")


@app.post("/api/jobs/optimize", response_model=JobResponse)
async def create_optimize_job(request: OptimizeRequest):
    """Create an async optimize job."""
    task = optimize_code.delay(
        code=request.code,
        language=request.language,
        github_url=request.github_url,
        focus_areas=request.focus_areas
    )
    return JobResponse(job_id=task.id, status="pending")


@app.post("/api/jobs/test", response_model=JobResponse)
async def create_test_job(request: TestRequest):
    """Create an async test generation job."""
    task = test_code.delay(
        code=request.code,
        language=request.language,
        github_url=request.github_url,
        test_framework=request.test_framework
    )
    return JobResponse(job_id=task.id, status="pending")


@app.post("/api/jobs/pr", response_model=JobResponse)
async def create_pr_job(request: PRRequest):
    """Create an async PR generation job."""
    task = generate_pr.delay(
        original_code=request.original_code,
        modified_code=request.modified_code,
        changes=request.changes,
        language=request.language,
        title=request.title
    )
    return JobResponse(job_id=task.id, status="pending")


@app.post("/api/jobs/analyze-all", response_model=JobResponse)
async def create_multi_analysis_job(request: MultiAnalysisRequest):
    """Create an async multi-tool analysis job."""
    task = analyze_all.delay(
        code=request.code,
        language=request.language,
        github_url=request.github_url,
        tools=request.tools
    )
    return JobResponse(job_id=task.id, status="pending")


@app.get("/api/jobs/{job_id}")
async def get_job_status(job_id: str):
    """Get the status and result of a job."""
    task = AsyncResult(job_id, app=celery_app)

    if task.state == "PENDING":
        return {"job_id": job_id, "status": "pending", "result": None}
    elif task.state == "STARTED":
        return {"job_id": job_id, "status": "running", "result": None}
    elif task.state == "SUCCESS":
        return {"job_id": job_id, "status": "completed", "result": task.result}
    elif task.state == "FAILURE":
        return {"job_id": job_id, "status": "failed", "error": str(task.result)}
    else:
        return {"job_id": job_id, "status": task.state, "result": None}


# ==================== SYNC ENDPOINTS (for quick operations) ====================

@app.post("/api/debug")
async def debug_sync(request: CodeRequest):
    """Synchronous debug endpoint."""
    try:
        source_code = request.code
        if request.github_url:
            import httpx
            raw_url = request.github_url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")
            async with httpx.AsyncClient() as client:
                response = await client.get(raw_url)
                source_code = response.text

        if not source_code:
            raise HTTPException(status_code=400, detail="No code provided")

        user_prompt = f"Language: {request.language or 'auto-detect'}\n\nCode:\n{source_code}"
        result = await analyze_with_ai(PROMPTS["debug"], user_prompt)

        return {"success": True, "data": result, "tool": "debugger"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/refactor")
async def refactor_sync(request: RefactorRequest):
    """Synchronous refactor endpoint."""
    try:
        source_code = request.code
        if request.github_url:
            import httpx
            raw_url = request.github_url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")
            async with httpx.AsyncClient() as client:
                response = await client.get(raw_url)
                source_code = response.text

        if not source_code:
            raise HTTPException(status_code=400, detail="No code provided")

        user_prompt = f"Language: {request.language or 'auto-detect'}\n\nCode:\n{source_code}"
        result = await analyze_with_ai(PROMPTS["refactor"], user_prompt)

        return {"success": True, "data": result, "tool": "refactorizer"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/optimize")
async def optimize_sync(request: OptimizeRequest):
    """Synchronous optimize endpoint."""
    try:
        source_code = request.code
        if request.github_url:
            import httpx
            raw_url = request.github_url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")
            async with httpx.AsyncClient() as client:
                response = await client.get(raw_url)
                source_code = response.text

        if not source_code:
            raise HTTPException(status_code=400, detail="No code provided")

        user_prompt = f"Language: {request.language or 'auto-detect'}\n\nCode:\n{source_code}"
        result = await analyze_with_ai(PROMPTS["optimize"], user_prompt)

        return {"success": True, "data": result, "tool": "optimizer"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/test")
async def test_sync(request: TestRequest):
    """Synchronous test generation endpoint."""
    try:
        source_code = request.code
        if request.github_url:
            import httpx
            raw_url = request.github_url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")
            async with httpx.AsyncClient() as client:
                response = await client.get(raw_url)
                source_code = response.text

        if not source_code:
            raise HTTPException(status_code=400, detail="No code provided")

        user_prompt = f"Language: {request.language or 'auto-detect'}\n\nCode:\n{source_code}"
        result = await analyze_with_ai(PROMPTS["test"], user_prompt)

        return {"success": True, "data": result, "tool": "tester"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat-assistant")
async def chat_assistant(request: ChatRequest):
    """Chat assistant endpoint with optional code context."""
    try:
        history = request.history or []
        history_text = "\n".join([f"{item.role}: {item.content}" for item in history])
        code_block = request.code or ""
        user_prompt = f"""
Language: {request.language or 'auto-detect'}

Code:
{code_block}

History:
{history_text or 'None'}

User Question:
{request.message}
"""
        result = await analyze_with_ai(PROMPTS["assistant"], user_prompt)
        return {"success": True, "data": result, "tool": "assistant"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-pr")
async def generate_pr_sync(request: PRRequest):
    """Synchronous PR generation endpoint."""
    try:
        if not request.original_code and not request.modified_code:
            raise HTTPException(status_code=400, detail="Original and modified code required")

        user_prompt = f"""
Language: {request.language or 'auto-detect'}
Suggested Title: {request.title or 'Auto-generated PR'}
Changes Summary: {request.changes or 'See code diff'}

Original Code:
{request.original_code}

Modified Code:
{request.modified_code}
"""
        result = await analyze_with_ai(PROMPTS["pr"], user_prompt)

        return {"success": True, "data": result, "tool": "pr-generator"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== GITHUB INTEGRATION ====================

@app.post("/api/github/export")
async def export_to_github(request: GitHubExportRequest):
    """Export code to GitHub repository."""
    try:
        from github import Github

        g = Github(request.github_token)
        repo = g.get_repo(request.repo)

        # Check if file exists
        sha = None
        try:
            contents = repo.get_contents(request.filename, ref=request.branch)
            sha = contents.sha
        except:
            pass

        commit_message = request.commit_message or f"Update {request.filename} via Code Assistant"

        if sha:
            result = repo.update_file(
                path=request.filename,
                message=commit_message,
                content=request.code,
                sha=sha,
                branch=request.branch
            )
        else:
            result = repo.create_file(
                path=request.filename,
                message=commit_message,
                content=request.code,
                branch=request.branch
            )

        return {
            "success": True,
            "data": {
                "commit_url": result["commit"].html_url,
                "file_url": result["content"].html_url
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/github/create-pr")
async def create_github_pr(request: GitHubPRRequest):
    """Create a pull request on GitHub."""
    try:
        from github import Github

        g = Github(request.github_token)
        repo = g.get_repo(request.repo)

        pr = repo.create_pull(
            title=request.title,
            body=request.body,
            head=request.head,
            base=request.base
        )

        return {
            "success": True,
            "data": {
                "pr_url": pr.html_url,
                "pr_number": pr.number
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
