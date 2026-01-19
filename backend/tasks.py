from celery_app import celery_app
from ai_service import analyze_with_ai_sync, PROMPTS
import httpx


def fetch_github_code(url: str) -> str:
    """Fetch code from a GitHub URL."""
    raw_url = url
    if "github.com" in url and "raw.githubusercontent.com" not in url:
        raw_url = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")

    response = httpx.get(raw_url, timeout=30)
    response.raise_for_status()
    return response.text


@celery_app.task(bind=True, name="tasks.debug_code")
def debug_code(self, code: str, language: str = "", github_url: str = ""):
    """Debug code task."""
    try:
        source_code = code
        if github_url:
            source_code = fetch_github_code(github_url)

        if not source_code:
            return {"error": "No code provided"}

        user_prompt = f"Language: {language or 'auto-detect'}\n\nCode:\n{source_code}"
        result = analyze_with_ai_sync(PROMPTS["debug"], user_prompt)

        return {"success": True, "data": result, "tool": "debugger"}
    except Exception as e:
        return {"success": False, "error": str(e), "tool": "debugger"}


@celery_app.task(bind=True, name="tasks.refactor_code")
def refactor_code(self, code: str, language: str = "", github_url: str = "", principles: list = None):
    """Refactor code task."""
    try:
        source_code = code
        if github_url:
            source_code = fetch_github_code(github_url)

        if not source_code:
            return {"error": "No code provided"}

        selected_principles = principles or ["SOLID", "DRY", "KISS", "Clean Code"]
        system_prompt = PROMPTS["refactor"].replace(
            "SOLID, DRY, KISS, Clean Code",
            ", ".join(selected_principles)
        )

        user_prompt = f"Language: {language or 'auto-detect'}\n\nCode:\n{source_code}"
        result = analyze_with_ai_sync(system_prompt, user_prompt)

        return {"success": True, "data": result, "tool": "refactorizer"}
    except Exception as e:
        return {"success": False, "error": str(e), "tool": "refactorizer"}


@celery_app.task(bind=True, name="tasks.optimize_code")
def optimize_code(self, code: str, language: str = "", github_url: str = "", focus_areas: list = None):
    """Optimize code task."""
    try:
        source_code = code
        if github_url:
            source_code = fetch_github_code(github_url)

        if not source_code:
            return {"error": "No code provided"}

        areas = focus_areas or ["time complexity", "space complexity", "memory usage", "execution speed"]
        system_prompt = PROMPTS["optimize"].replace(
            "time complexity, space complexity, memory usage, execution speed",
            ", ".join(areas)
        )

        user_prompt = f"Language: {language or 'auto-detect'}\n\nCode:\n{source_code}"
        result = analyze_with_ai_sync(system_prompt, user_prompt)

        return {"success": True, "data": result, "tool": "optimizer"}
    except Exception as e:
        return {"success": False, "error": str(e), "tool": "optimizer"}


@celery_app.task(bind=True, name="tasks.test_code")
def test_code(self, code: str, language: str = "", github_url: str = "", test_framework: str = ""):
    """Generate tests task."""
    try:
        source_code = code
        if github_url:
            source_code = fetch_github_code(github_url)

        if not source_code:
            return {"error": "No code provided"}

        framework = test_framework or "auto-detect"
        system_prompt = PROMPTS["test"].replace(
            "Generate comprehensive test cases",
            f"Generate comprehensive test cases using {framework} framework"
        )

        user_prompt = f"Language: {language or 'auto-detect'}\n\nCode:\n{source_code}"
        result = analyze_with_ai_sync(system_prompt, user_prompt)

        return {"success": True, "data": result, "tool": "tester"}
    except Exception as e:
        return {"success": False, "error": str(e), "tool": "tester"}


@celery_app.task(bind=True, name="tasks.generate_pr")
def generate_pr(self, original_code: str, modified_code: str, changes: str = "", language: str = "", title: str = ""):
    """Generate PR description task."""
    try:
        if not original_code and not modified_code:
            return {"error": "Original and modified code required"}

        user_prompt = f"""
Language: {language or 'auto-detect'}
Suggested Title: {title or 'Auto-generated PR'}
Changes Summary: {changes or 'See code diff'}

Original Code:
{original_code}

Modified Code:
{modified_code}
"""
        result = analyze_with_ai_sync(PROMPTS["pr"], user_prompt)

        return {"success": True, "data": result, "tool": "pr-generator"}
    except Exception as e:
        return {"success": False, "error": str(e), "tool": "pr-generator"}


@celery_app.task(bind=True, name="tasks.analyze_all")
def analyze_all(self, code: str, language: str = "", github_url: str = "", tools: list = None):
    """Run multiple analysis tools."""
    try:
        source_code = code
        if github_url:
            source_code = fetch_github_code(github_url)

        if not source_code:
            return {"error": "No code provided"}

        selected_tools = tools or ["debug", "refactor", "optimize", "test"]
        results = {}

        for tool in selected_tools:
            try:
                if tool == "debug":
                    result = debug_code(source_code, language)
                elif tool == "refactor":
                    result = refactor_code(source_code, language)
                elif tool == "optimize":
                    result = optimize_code(source_code, language)
                elif tool == "test":
                    result = test_code(source_code, language)
                else:
                    result = {"error": f"Unknown tool: {tool}"}

                results[tool] = result
            except Exception as e:
                results[tool] = {"error": str(e)}

        return {"success": True, "data": results, "tool": "multi-analysis"}
    except Exception as e:
        return {"success": False, "error": str(e), "tool": "multi-analysis"}
