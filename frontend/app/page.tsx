'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Header } from '@/components/Header';
import { CodeInput } from '@/components/CodeInput';
import { ToolSelector } from '@/components/ToolSelector';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { GitHubExport } from '@/components/GitHubExport';
import { api } from '@/lib/api';

export default function Home() {
  // Input state
  const [code, setCode] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [language, setLanguage] = useState('');

  // Tool selection state
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Results state
  const [results, setResults] = useState<Record<string, { status: string; data?: any }>>({});

  // Modified code from results
  const [modifiedCode, setModifiedCode] = useState('');

  const hasInput = code.trim().length > 0 || githubUrl.trim().length > 0;

  const runTools = useCallback(async () => {
    if (!hasInput || selectedTools.length === 0) {
      toast.error('Please enter code and select at least one tool');
      return;
    }

    setIsLoading(true);
    setResults({});

    // Initialize results with pending status
    const initialResults: Record<string, { status: string; data?: any }> = {};
    selectedTools.forEach((tool: string) => {
      initialResults[tool] = { status: 'pending' };
    });
    setResults(initialResults);

    try {
      // Launch all tools in parallel using sync endpoints (no Redis required)
      const toolPromises = selectedTools.map(async (tool: string) => {
        try {
          // Update to running status
          setResults((prev: Record<string, { status: string; data?: any }>) => ({
            ...prev,
            [tool]: { status: 'running' },
          }));

          const requestData = {
            code,
            language,
            github_url: githubUrl,
          };

          let response;
          switch (tool) {
            case 'debug':
              response = await api.sync.debug(requestData);
              break;
            case 'refactor':
              response = await api.sync.refactor(requestData);
              break;
            case 'optimize':
              response = await api.sync.optimize(requestData);
              break;
            case 'test':
              response = await api.sync.test(requestData);
              break;
            case 'pr':
              response = await api.sync.generatePR({
                original_code: code,
                modified_code: modifiedCode || code,
                language,
              });
              break;
            default:
              throw new Error(`Unknown tool: ${tool}`);
          }

          // Extract modified code from results
          if (response.data) {
            const data = response.data;
            if (data.fixedCode) {
              setModifiedCode(data.fixedCode);
            } else if (data.refactoredCode) {
              setModifiedCode(data.refactoredCode);
            } else if (data.optimizedCode) {
              setModifiedCode(data.optimizedCode);
            }
          }

          setResults((prev: Record<string, { status: string; data?: any }>) => ({
            ...prev,
            [tool]: {
              status: 'completed',
              data: response.data,
            },
          }));
        } catch (error: any) {
          console.error(`Error running ${tool}:`, error);
          setResults((prev: Record<string, { status: string; data?: any }>) => ({
            ...prev,
            [tool]: { status: 'failed', data: { error: error.message } },
          }));
        }
      });

      await Promise.all(toolPromises);

      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [code, githubUrl, language, selectedTools, hasInput, modifiedCode]);

  const clearResults = () => {
    setResults({});
    setModifiedCode('');
    toast.success('Results cleared');
  };

  const handleExportSuccess = () => {
    toast.success('Successfully exported to GitHub!');
  };

  // Get the best modified code from results
  const getBestModifiedCode = () => {
    if (modifiedCode) return modifiedCode;
    if (results.refactor?.data?.refactoredCode) return results.refactor.data.refactoredCode;
    if (results.optimize?.data?.optimizedCode) return results.optimize.data.optimizedCode;
    if (results.debug?.data?.fixedCode) return results.debug.data.fixedCode;
    return code;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Code Assistant</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Debug, refactor, optimize, and test your code with AI-powered tools. Run multiple
            analyses simultaneously and export to GitHub.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input */}
          <div className="lg:col-span-2 space-y-6">
            <CodeInput
              code={code}
              setCode={setCode}
              githubUrl={githubUrl}
              setGithubUrl={setGithubUrl}
              language={language}
              setLanguage={setLanguage}
            />

            {/* Results Dashboard */}
            {Object.keys(results).length > 0 && (
              <ResultsDashboard results={results} onClear={clearResults} />
            )}
          </div>

          {/* Right Column - Tools & Export */}
          <div className="space-y-6">
            <ToolSelector
              selectedTools={selectedTools}
              setSelectedTools={setSelectedTools}
              onRunTools={runTools}
              isLoading={isLoading}
              hasInput={hasInput}
            />

            {/* GitHub Export */}
            {(code || Object.keys(results).length > 0) && (
              <GitHubExport
                code={getBestModifiedCode() || code}
                results={results}
                onSuccess={handleExportSuccess}
              />
            )}

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-primary-500/10 to-purple-500/10 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-800">
              <h3 className="font-semibold text-primary-700 dark:text-primary-400 mb-3">
                Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  Select multiple tools to run simultaneous analyses
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  Use GitHub URLs to analyze remote files directly
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  Export optimized code back to GitHub with one click
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  Jobs run in background workers for faster processing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-dark-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Code Assistant - AI-Powered Development Tools
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Built with Next.js + FastAPI + Redis/Celery
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
