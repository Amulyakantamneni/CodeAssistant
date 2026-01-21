import json
import re
from openai import OpenAI
from config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def _parse_ai_json(content: str) -> dict:
    """Parse JSON from model output, including fenced or prefixed responses."""
    cleaned = content.strip()
    candidates = [cleaned]

    fenced = re.search(r"```(?:json)?\s*(.*?)\s*```", cleaned, re.DOTALL | re.IGNORECASE)
    if fenced:
        candidates.insert(0, fenced.group(1).strip())

    first_curly = cleaned.find("{")
    last_curly = cleaned.rfind("}")
    if first_curly != -1 and last_curly != -1 and last_curly > first_curly:
        candidates.append(cleaned[first_curly : last_curly + 1])

    first_bracket = cleaned.find("[")
    last_bracket = cleaned.rfind("]")
    if first_bracket != -1 and last_bracket != -1 and last_bracket > first_bracket:
        candidates.append(cleaned[first_bracket : last_bracket + 1])

    for candidate in candidates:
        try:
            parsed = json.loads(candidate)
            if isinstance(parsed, str):
                nested = parsed.strip()
                if (nested.startswith("{") and nested.endswith("}")) or (
                    nested.startswith("[") and nested.endswith("]")
                ):
                    return json.loads(nested)
            return parsed
        except json.JSONDecodeError:
            continue

    return {"raw": content}


async def analyze_with_ai(system_prompt: str, user_prompt: str) -> dict:
    """Call OpenAI API for code analysis."""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=4000,
        )
        content = response.choices[0].message.content

        return _parse_ai_json(content)
    except Exception as e:
        raise Exception(f"AI Analysis failed: {str(e)}")


def analyze_with_ai_sync(system_prompt: str, user_prompt: str) -> dict:
    """Synchronous version for Celery tasks."""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=4000,
        )
        content = response.choices[0].message.content

        return _parse_ai_json(content)
    except Exception as e:
        raise Exception(f"AI Analysis failed: {str(e)}")


# Tool-specific prompts
PROMPTS = {
    "debug": """You are an expert code debugger. Analyze the provided code and identify issues.

Provide a clear, minimal JSON response that is easy to read.
Return JSON only; no code fences or extra text.
{
  "summary": "overall summary in 1-2 sentences",
  "severity": "low|medium|high|critical",
  "issues": [{ "category": "syntax|logic|runtime|edge|type", "line": number, "issue": "description", "suggestion": "fix" }],
  "fixedCode": "corrected code if applicable"
}""",

    "refactor": """You are an expert code refactoring specialist. Apply clean code principles to refactor the provided code.
Focus on: SOLID, DRY, KISS, Clean Code

Provide a clear, minimal JSON response that is easy to read.
Return JSON only; no code fences or extra text.
{
  "summary": "overall summary in 1-2 sentences",
  "refactoredCode": "the improved code",
  "keyChanges": ["short bullet 1", "short bullet 2", "short bullet 3"],
  "principlesApplied": [{ "principle": "name", "why": "brief explanation" }],
  "beforeAfter": [{ "title": "short change title", "before": "old snippet", "after": "new snippet" }]
}""",

    "optimize": """You are an expert code optimization specialist. Analyze and optimize the provided code.
Focus areas: time complexity, space complexity, memory usage, execution speed

Provide a clear, minimal JSON response that is easy to read.
Return JSON only; no code fences or extra text.
{
  "summary": "overall summary in 1-2 sentences",
  "optimizedCode": "the optimized code",
  "complexity": {
    "original": { "time": "O(?)", "space": "O(?)" },
    "optimized": { "time": "O(?)", "space": "O(?)" }
  },
  "keyChanges": ["short bullet 1", "short bullet 2", "short bullet 3"],
  "tradeoffs": ["list of tradeoffs"],
  "benchmarkSuggestions": ["how to benchmark"]
}""",

    "test": """You are an expert software tester. Generate test cases and testing guidance for the provided code.

Provide a clear, minimal JSON response that is easy to read.
Return JSON only; no code fences or extra text.
{
  "summary": "overall test strategy summary in 1-2 sentences",
  "testCode": "complete test file code",
  "testCases": [
    { "name": "test name", "type": "unit|integration|e2e|edge", "inputs": "short inputs", "expected": "short expected output" }
  ],
  "edgeCases": ["short edge case 1", "short edge case 2"],
  "coverageAnalysis": {
    "untested": ["function or branch name"],
    "recommendations": ["short suggestion to increase coverage"]
  },
  "executionPlan": {
    "frameworks": ["Jest|Mocha|PyTest|unittest|JUnit|NUnit|MSTest"],
    "commands": ["command to run tests"],
    "notes": ["short note about setup or config"]
  },
  "bugDetection": [
    { "test": "failing test name", "likelyCause": "probable root cause", "location": "file or function" }
  ],
  "testingSuggestions": ["improvement to tests or assertions"],
  "mocks": ["dependency to mock"],
  "fixtures": ["fixture/data needed"]
}""",

    "pr": """You are an expert at writing pull request descriptions. Generate a clear PR description.

Provide a clear, minimal JSON response that is easy to read.
Return JSON only; no code fences or extra text.
{
  "title": "PR title",
  "summary": "brief summary",
  "changes": ["short change 1", "short change 2"],
  "testing": ["step by step testing"],
  "fullMarkdown": "complete PR description in markdown"
}"""
}
