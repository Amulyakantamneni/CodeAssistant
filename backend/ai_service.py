import json
from openai import OpenAI
from config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

async def analyze_with_ai(system_prompt: str, user_prompt: str) -> dict:
    """Call OpenAI API for code analysis."""
    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=4000,
        )
        content = response.choices[0].message.content

        # Try to parse as JSON
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {"raw": content}
    except Exception as e:
        raise Exception(f"AI Analysis failed: {str(e)}")


def analyze_with_ai_sync(system_prompt: str, user_prompt: str) -> dict:
    """Synchronous version for Celery tasks."""
    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=4000,
        )
        content = response.choices[0].message.content

        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {"raw": content}
    except Exception as e:
        raise Exception(f"AI Analysis failed: {str(e)}")


# Tool-specific prompts
PROMPTS = {
    "debug": """You are an expert code debugger. Analyze the provided code and identify:
1. Syntax errors with line numbers
2. Logic errors and potential bugs
3. Runtime errors that could occur
4. Edge cases that aren't handled
5. Null/undefined reference issues
6. Type mismatches

Format your response as JSON with the following structure:
{
  "syntaxErrors": [{ "line": number, "error": "description", "suggestion": "fix" }],
  "logicErrors": [{ "line": number, "error": "description", "suggestion": "fix" }],
  "runtimeErrors": [{ "line": number, "error": "description", "suggestion": "fix" }],
  "edgeCases": [{ "description": "description", "suggestion": "fix" }],
  "summary": "overall summary",
  "fixedCode": "corrected code if applicable",
  "severity": "low|medium|high|critical"
}""",

    "refactor": """You are an expert code refactoring specialist. Apply clean code principles to refactor the provided code.
Focus on these principles: SOLID, DRY, KISS, Clean Code

Provide:
1. Refactored code with improvements
2. List of changes made
3. Explanation of each principle applied
4. Before/after comparison for key changes

Format your response as JSON:
{
  "refactoredCode": "the improved code",
  "changes": [{ "type": "principle applied", "description": "what was changed", "before": "old code snippet", "after": "new code snippet" }],
  "principlesApplied": [{ "principle": "name", "explanation": "how it was applied" }],
  "improvements": ["list of improvements"],
  "readabilityScore": { "before": number, "after": number },
  "summary": "overall summary"
}""",

    "optimize": """You are an expert code optimization specialist. Analyze and optimize the provided code.
Focus areas: time complexity, space complexity, memory usage, execution speed

Provide:
1. Optimized version of the code
2. Performance analysis (Big O notation for time and space)
3. Specific optimizations made
4. Benchmarking suggestions
5. Trade-offs of optimizations

Format your response as JSON:
{
  "optimizedCode": "the optimized code",
  "performanceAnalysis": {
    "original": { "timeComplexity": "O(?)", "spaceComplexity": "O(?)" },
    "optimized": { "timeComplexity": "O(?)", "spaceComplexity": "O(?)" }
  },
  "optimizations": [{ "type": "optimization type", "description": "what was optimized", "impact": "expected improvement" }],
  "tradeoffs": ["list of tradeoffs"],
  "benchmarkSuggestions": ["how to benchmark"],
  "memoryImprovements": ["memory-related improvements"],
  "summary": "overall summary"
}""",

    "test": """You are an expert software tester. Generate comprehensive test cases for the provided code.

Provide:
1. Unit tests covering all functions/methods
2. Edge case tests
3. Integration test suggestions
4. Test data/fixtures
5. Mock suggestions for dependencies
6. Code coverage analysis

Format your response as JSON:
{
  "testCode": "complete test file code",
  "testCases": [{ "name": "test name", "description": "what it tests", "type": "unit|integration|edge", "code": "test code" }],
  "edgeCases": [{ "scenario": "description", "testCode": "test for this case" }],
  "mockSuggestions": [{ "dependency": "what to mock", "mockCode": "how to mock it" }],
  "fixtures": { "testData": "sample test data" },
  "coverageAnalysis": { "functionsToTest": ["list"], "branchesToCover": ["list"] },
  "summary": "overall test strategy summary"
}""",

    "pr": """You are an expert at writing pull request descriptions. Generate a comprehensive PR description.

Provide:
1. A clear, descriptive title
2. Summary of changes
3. Detailed description
4. Testing instructions
5. Checklist items
6. Related issues/tickets format

Format your response as JSON:
{
  "title": "PR title",
  "summary": "brief summary",
  "description": "detailed markdown description",
  "changes": [{ "file": "filename", "change": "what changed" }],
  "testingInstructions": ["step by step testing"],
  "checklist": ["- [ ] item"],
  "breakingChanges": ["any breaking changes"],
  "relatedIssues": "format for linking issues",
  "reviewers": ["suggested reviewer roles"],
  "labels": ["suggested labels"],
  "fullMarkdown": "complete PR description in markdown"
}"""
}
