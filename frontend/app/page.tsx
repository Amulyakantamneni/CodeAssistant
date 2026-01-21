'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Header } from '@/components/Header';
import { CodeInput } from '@/components/CodeInput';
import { ToolSelector } from '@/components/ToolSelector';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { GitHubExport } from '@/components/GitHubExport';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

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
          const errorDetail =
            error?.response?.data?.detail || error?.response?.data?.error || error?.message;
          console.error(`Error running ${tool}:`, error);
          setResults((prev: Record<string, { status: string; data?: any }>) => ({
            ...prev,
            [tool]: { status: 'failed', data: { error: errorDetail || 'Unknown error' } },
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
    <div className="cosmic-bg">
      <div className="relative z-10">
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              <span className="title-gradient">Code Assistant</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Debug, refactor, optimize, and test your code with AI-powered tools.
              <br />
              Run multiple analyses simultaneously and export to GitHub.
            </p>
          </div>

          {/* Tool Selector - Horizontal Pills */}
          <div className="mb-8">
            <ToolSelector
              selectedTools={selectedTools}
              setSelectedTools={setSelectedTools}
            />
          </div>

          {/* Code Input */}
          <div className="mb-6">
            <CodeInput
              code={code}
              setCode={setCode}
              githubUrl={githubUrl}
              setGithubUrl={setGithubUrl}
              language={language}
              setLanguage={setLanguage}
            />
          </div>

          {/* Run Analysis Button */}
          <div className="mb-8">
            <button
              onClick={runTools}
              disabled={isLoading || selectedTools.length === 0 || !hasInput}
              className={cn(
                'w-full py-4 rounded-xl font-semibold text-white text-lg transition-all flex items-center justify-center gap-2',
                isLoading || selectedTools.length === 0 || !hasInput
                  ? 'bg-gray-400 dark:bg-dark-600 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl'
              )}
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  Analyzing...
                </>
              ) : (
                'Run Analysis'
              )}
            </button>
            {!hasInput && selectedTools.length > 0 && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                Please enter code or a GitHub URL first
              </p>
            )}
            {hasInput && selectedTools.length === 0 && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                Please select at least one tool
              </p>
            )}
          </div>

          {/* Results Dashboard */}
          {Object.keys(results).length > 0 && (
            <div className="mb-8">
              <ResultsDashboard results={results} onClear={clearResults} />
            </div>
          )}

          {/* GitHub Export - Show after results */}
          {Object.keys(results).length > 0 && (
            <div className="mb-8">
              <GitHubExport
                code={getBestModifiedCode() || code}
                results={results}
                onSuccess={handleExportSuccess}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200/50 dark:border-dark-700/50 mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Code Assistant - AI-Powered Development Tools
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
