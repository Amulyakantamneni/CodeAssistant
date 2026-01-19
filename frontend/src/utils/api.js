import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // Debug code
  debug: async (code, language, githubUrl) => {
    const response = await axios.post(`${API_BASE}/debug`, {
      code,
      language,
      githubUrl
    });
    return response.data;
  },

  // Refactor code
  refactor: async (code, language, githubUrl, principles) => {
    const response = await axios.post(`${API_BASE}/refactor`, {
      code,
      language,
      githubUrl,
      principles
    });
    return response.data;
  },

  // Optimize code
  optimize: async (code, language, githubUrl, focusAreas) => {
    const response = await axios.post(`${API_BASE}/optimize`, {
      code,
      language,
      githubUrl,
      focusAreas
    });
    return response.data;
  },

  // Generate tests
  test: async (code, language, githubUrl, testFramework) => {
    const response = await axios.post(`${API_BASE}/test`, {
      code,
      language,
      githubUrl,
      testFramework
    });
    return response.data;
  },

  // Generate PR description
  generatePR: async (originalCode, modifiedCode, changes, language, title) => {
    const response = await axios.post(`${API_BASE}/generate-pr`, {
      originalCode,
      modifiedCode,
      changes,
      language,
      title
    });
    return response.data;
  },

  // Run multiple tools
  analyzeAll: async (code, language, githubUrl, tools) => {
    const response = await axios.post(`${API_BASE}/analyze-all`, {
      code,
      language,
      githubUrl,
      tools
    });
    return response.data;
  },

  // Export to GitHub
  exportToGitHub: async (code, filename, repo, branch, commitMessage, githubToken) => {
    const response = await axios.post(`${API_BASE}/github/export`, {
      code,
      filename,
      repo,
      branch,
      commitMessage,
      githubToken
    });
    return response.data;
  },

  // Create PR on GitHub
  createPR: async (repo, title, body, head, base, githubToken) => {
    const response = await axios.post(`${API_BASE}/github/create-pr`, {
      repo,
      title,
      body,
      head,
      base,
      githubToken
    });
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await axios.get(`${API_BASE}/health`);
    return response.data;
  }
};
