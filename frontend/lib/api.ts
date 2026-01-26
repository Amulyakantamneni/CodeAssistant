import axios from 'axios';

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE = RAW_API_BASE.replace(/\/$/, '').endsWith('/api')
  ? RAW_API_BASE.replace(/\/$/, '')
  : `${RAW_API_BASE.replace(/\/$/, '')}/api`;

export interface CodeRequest {
  code: string;
  language?: string;
  github_url?: string;
}

export interface JobResponse {
  job_id: string;
  status: string;
}

export interface JobResult {
  job_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export const api = {
  // Async Job Endpoints
  jobs: {
    debug: async (data: CodeRequest): Promise<JobResponse> => {
      const response = await axios.post(`${API_BASE}/jobs/debug`, data);
      return response.data;
    },

    refactor: async (data: CodeRequest & { principles?: string[] }): Promise<JobResponse> => {
      const response = await axios.post(`${API_BASE}/jobs/refactor`, data);
      return response.data;
    },

    optimize: async (data: CodeRequest & { focus_areas?: string[] }): Promise<JobResponse> => {
      const response = await axios.post(`${API_BASE}/jobs/optimize`, data);
      return response.data;
    },

    test: async (data: CodeRequest & { test_framework?: string }): Promise<JobResponse> => {
      const response = await axios.post(`${API_BASE}/jobs/test`, data);
      return response.data;
    },

    pr: async (data: {
      original_code: string;
      modified_code: string;
      changes?: string;
      language?: string;
      title?: string;
    }): Promise<JobResponse> => {
      const response = await axios.post(`${API_BASE}/jobs/pr`, data);
      return response.data;
    },

    analyzeAll: async (data: CodeRequest & { tools?: string[] }): Promise<JobResponse> => {
      const response = await axios.post(`${API_BASE}/jobs/analyze-all`, data);
      return response.data;
    },

    getStatus: async (jobId: string): Promise<JobResult> => {
      const response = await axios.get(`${API_BASE}/jobs/${jobId}`);
      return response.data;
    },
  },

  // Sync Endpoints (for quick operations)
  sync: {
    debug: async (data: CodeRequest) => {
      const response = await axios.post(`${API_BASE}/debug`, data);
      return response.data;
    },

    refactor: async (data: CodeRequest & { principles?: string[] }) => {
      const response = await axios.post(`${API_BASE}/refactor`, data);
      return response.data;
    },

    optimize: async (data: CodeRequest & { focus_areas?: string[] }) => {
      const response = await axios.post(`${API_BASE}/optimize`, data);
      return response.data;
    },

    test: async (data: CodeRequest & { test_framework?: string }) => {
      const response = await axios.post(`${API_BASE}/test`, data);
      return response.data;
    },
    generate: async (data: CodeRequest) => {
      const response = await axios.post(`${API_BASE}/generate`, data);
      return response.data;
    },

    generatePR: async (data: {
      original_code: string;
      modified_code: string;
      changes?: string;
      language?: string;
      title?: string;
    }) => {
      const response = await axios.post(`${API_BASE}/generate-pr`, data);
      return response.data;
    },
    chatAssistant: async (data: {
      message: string;
      code?: string;
      language?: string;
      history?: { role: string; content: string }[];
    }) => {
      const response = await axios.post(`${API_BASE}/chat-assistant`, data);
      return response.data;
    },
  },

  // GitHub Integration
  github: {
    export: async (data: {
      code: string;
      filename: string;
      repo: string;
      branch?: string;
      commit_message?: string;
      github_token: string;
    }) => {
      const response = await axios.post(`${API_BASE}/github/export`, data);
      return response.data;
    },

    createPR: async (data: {
      repo: string;
      title: string;
      body?: string;
      head: string;
      base?: string;
      github_token: string;
    }) => {
      const response = await axios.post(`${API_BASE}/github/create-pr`, data);
      return response.data;
    },
  },

  // Health check
  health: async () => {
    const response = await axios.get(`${API_BASE}/health`);
    return response.data;
  },
};

// Polling helper for job status
export async function pollJobStatus(
  jobId: string,
  onUpdate: (result: JobResult) => void,
  interval = 1000,
  maxAttempts = 300
): Promise<JobResult> {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const result = await api.jobs.getStatus(jobId);
        onUpdate(result);

        if (result.status === 'completed' || result.status === 'failed') {
          resolve(result);
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          reject(new Error('Job timed out'));
          return;
        }

        setTimeout(poll, interval);
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
}
