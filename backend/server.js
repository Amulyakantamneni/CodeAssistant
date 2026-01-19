import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { Octokit } from '@octokit/rest';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Octokit for GitHub operations
const getOctokit = (token) => new Octokit({ auth: token || process.env.GITHUB_TOKEN });

// Helper function to call OpenAI
async function analyzeWithAI(systemPrompt, userPrompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });
    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`AI Analysis failed: ${error.message}`);
  }
}

// Fetch code from GitHub URL
async function fetchGitHubCode(url) {
  try {
    // Convert GitHub URL to raw content URL
    let rawUrl = url;
    if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
      rawUrl = url
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
    }

    const response = await axios.get(rawUrl);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch code from GitHub: ${error.message}`);
  }
}

// ==================== DEBUGGER ====================
app.post('/api/debug', async (req, res) => {
  try {
    const { code, language, githubUrl } = req.body;

    let sourceCode = code;
    if (githubUrl) {
      sourceCode = await fetchGitHubCode(githubUrl);
    }

    if (!sourceCode) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const systemPrompt = `You are an expert code debugger. Analyze the provided code and identify:
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
}`;

    const result = await analyzeWithAI(systemPrompt, `Language: ${language || 'auto-detect'}\n\nCode:\n${sourceCode}`);

    // Try to parse as JSON, if fails return as text
    try {
      const parsed = JSON.parse(result);
      res.json({ success: true, data: parsed, tool: 'debugger' });
    } catch {
      res.json({ success: true, data: { raw: result }, tool: 'debugger' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== REFACTORIZER ====================
app.post('/api/refactor', async (req, res) => {
  try {
    const { code, language, githubUrl, principles } = req.body;

    let sourceCode = code;
    if (githubUrl) {
      sourceCode = await fetchGitHubCode(githubUrl);
    }

    if (!sourceCode) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const selectedPrinciples = principles || ['SOLID', 'DRY', 'KISS', 'Clean Code'];

    const systemPrompt = `You are an expert code refactoring specialist. Apply clean code principles to refactor the provided code.
Focus on these principles: ${selectedPrinciples.join(', ')}

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
}`;

    const result = await analyzeWithAI(systemPrompt, `Language: ${language || 'auto-detect'}\n\nCode:\n${sourceCode}`);

    try {
      const parsed = JSON.parse(result);
      res.json({ success: true, data: parsed, tool: 'refactorizer' });
    } catch {
      res.json({ success: true, data: { raw: result }, tool: 'refactorizer' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== OPTIMIZER ====================
app.post('/api/optimize', async (req, res) => {
  try {
    const { code, language, githubUrl, focusAreas } = req.body;

    let sourceCode = code;
    if (githubUrl) {
      sourceCode = await fetchGitHubCode(githubUrl);
    }

    if (!sourceCode) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const areas = focusAreas || ['time complexity', 'space complexity', 'memory usage', 'execution speed'];

    const systemPrompt = `You are an expert code optimization specialist. Analyze and optimize the provided code.
Focus areas: ${areas.join(', ')}

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
}`;

    const result = await analyzeWithAI(systemPrompt, `Language: ${language || 'auto-detect'}\n\nCode:\n${sourceCode}`);

    try {
      const parsed = JSON.parse(result);
      res.json({ success: true, data: parsed, tool: 'optimizer' });
    } catch {
      res.json({ success: true, data: { raw: result }, tool: 'optimizer' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== TESTER ====================
app.post('/api/test', async (req, res) => {
  try {
    const { code, language, githubUrl, testFramework } = req.body;

    let sourceCode = code;
    if (githubUrl) {
      sourceCode = await fetchGitHubCode(githubUrl);
    }

    if (!sourceCode) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const framework = testFramework || 'auto-detect';

    const systemPrompt = `You are an expert software tester. Generate comprehensive test cases for the provided code.
Test framework preference: ${framework}

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
}`;

    const result = await analyzeWithAI(systemPrompt, `Language: ${language || 'auto-detect'}\n\nCode:\n${sourceCode}`);

    try {
      const parsed = JSON.parse(result);
      res.json({ success: true, data: parsed, tool: 'tester' });
    } catch {
      res.json({ success: true, data: { raw: result }, tool: 'tester' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PR GENERATOR ====================
app.post('/api/generate-pr', async (req, res) => {
  try {
    const { originalCode, modifiedCode, changes, language, title } = req.body;

    if (!originalCode || !modifiedCode) {
      return res.status(400).json({ error: 'Original and modified code required' });
    }

    const systemPrompt = `You are an expert at writing pull request descriptions. Generate a comprehensive PR description.

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
}`;

    const result = await analyzeWithAI(systemPrompt, `
Language: ${language || 'auto-detect'}
Suggested Title: ${title || 'Auto-generated PR'}
Changes Summary: ${changes || 'See code diff'}

Original Code:
${originalCode}

Modified Code:
${modifiedCode}
`);

    try {
      const parsed = JSON.parse(result);
      res.json({ success: true, data: parsed, tool: 'pr-generator' });
    } catch {
      res.json({ success: true, data: { raw: result }, tool: 'pr-generator' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MULTI-TOOL ANALYSIS ====================
app.post('/api/analyze-all', async (req, res) => {
  try {
    const { code, language, githubUrl, tools } = req.body;

    let sourceCode = code;
    if (githubUrl) {
      sourceCode = await fetchGitHubCode(githubUrl);
    }

    if (!sourceCode) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const selectedTools = tools || ['debug', 'refactor', 'optimize', 'test'];
    const results = {};

    // Run selected tools in parallel
    const promises = selectedTools.map(async (tool) => {
      try {
        let endpoint;
        switch (tool) {
          case 'debug':
            endpoint = '/api/debug';
            break;
          case 'refactor':
            endpoint = '/api/refactor';
            break;
          case 'optimize':
            endpoint = '/api/optimize';
            break;
          case 'test':
            endpoint = '/api/test';
            break;
          default:
            return { tool, error: 'Unknown tool' };
        }

        // Internal call simulation
        const response = await axios.post(`http://localhost:${PORT}${endpoint}`, {
          code: sourceCode,
          language
        });

        return { tool, data: response.data };
      } catch (error) {
        return { tool, error: error.message };
      }
    });

    const toolResults = await Promise.all(promises);
    toolResults.forEach(result => {
      results[result.tool] = result.data || { error: result.error };
    });

    res.json({ success: true, data: results, tool: 'multi-analysis' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GITHUB EXPORT ====================
app.post('/api/github/export', async (req, res) => {
  try {
    const { code, filename, repo, branch, commitMessage, githubToken } = req.body;

    if (!code || !filename || !repo) {
      return res.status(400).json({ error: 'Code, filename, and repo are required' });
    }

    const octokit = getOctokit(githubToken);
    const [owner, repoName] = repo.split('/');

    // Get the current file SHA if it exists (for updates)
    let sha;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo: repoName,
        path: filename,
        ref: branch || 'main'
      });
      sha = data.sha;
    } catch {
      // File doesn't exist, that's fine for new files
    }

    // Create or update file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: filename,
      message: commitMessage || `Update ${filename} via Code Assistant`,
      content: Buffer.from(code).toString('base64'),
      branch: branch || 'main',
      ...(sha && { sha })
    });

    res.json({
      success: true,
      data: {
        commitUrl: response.data.commit.html_url,
        fileUrl: response.data.content.html_url
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CREATE PR ON GITHUB ====================
app.post('/api/github/create-pr', async (req, res) => {
  try {
    const { repo, title, body, head, base, githubToken } = req.body;

    if (!repo || !title || !head) {
      return res.status(400).json({ error: 'Repo, title, and head branch are required' });
    }

    const octokit = getOctokit(githubToken);
    const [owner, repoName] = repo.split('/');

    const response = await octokit.pulls.create({
      owner,
      repo: repoName,
      title,
      body: body || '',
      head,
      base: base || 'main'
    });

    res.json({
      success: true,
      data: {
        prUrl: response.data.html_url,
        prNumber: response.data.number
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Code Assistant Backend running on port ${PORT}`);
});
