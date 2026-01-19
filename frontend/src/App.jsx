import React, { useState, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { CodeInput } from './components/CodeInput';
import { ToolSelector } from './components/ToolSelector';
import { ResultsDashboard } from './components/ResultsDashboard';
import { GitHubExport } from './components/GitHubExport';
import { PRGenerator } from './components/PRGenerator';
import { api } from './utils/api';

function App() {
  const { darkMode, toggleDarkMode } = useTheme();

  // Input state
  const [code, setCode] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [language, setLanguage] = useState('');

  // Tool selection state
  const [selectedTools, setSelectedTools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Results state
  const [results, setResults] = useState({});

  // PR Generator state
  const [showPRGenerator, setShowPRGenerator] = useState(false);
  const [modifiedCode, setModifiedCode] = useState('');

  const hasInput = code.trim().length > 0 || githubUrl.trim().length > 0;

  const runTools = useCallback(async () => {
    if (!hasInput || selectedTools.length === 0) {
      toast.error('Please enter code and select at least one tool');
      return;
    }

    setIsLoading(true);
    setResults({});

    const toolResults = {};

    try {
      // Check if PR generator is selected
      const hasPR = selectedTools.includes('pr');
      const analyzeTools = selectedTools.filter(t => t !== 'pr');

      // Run analysis tools in parallel
      const promises = analyzeTools.map(async (tool) => {
        try {
          let response;
          switch (tool) {
            case 'debug':
              response = await api.debug(code, language, githubUrl);
              break;
            case 'refactor':
              response = await api.refactor(code, language, githubUrl);
              break;
            case 'optimize':
              response = await api.optimize(code, language, githubUrl);
              break;
            case 'test':
              response = await api.test(code, language, githubUrl);
              break;
            default:
              throw new Error(`Unknown tool: ${tool}`);
          }
          return { tool, success: true, data: response };
        } catch (error) {
          console.error(`Error running ${tool}:`, error);
          return { tool, success: false, error: error.message };
        }
      });

      const responses = await Promise.all(promises);

      // Process responses
      responses.forEach(({ tool, success, data, error }) => {
        if (success) {
          toolResults[tool] = data;

          // Update modified code for PR generator
          if (data.data) {
            if (data.data.fixedCode) {
              setModifiedCode(data.data.fixedCode);
            } else if (data.data.refactoredCode) {
              setModifiedCode(data.data.refactoredCode);
            } else if (data.data.optimizedCode) {
              setModifiedCode(data.data.optimizedCode);
            }
          }
        } else {
          toolResults[tool] = { error };
          toast.error(`${tool} failed: ${error}`);
        }
      });

      // Handle PR generation if selected
      if (hasPR) {
        try {
          const modCode = toolResults.refactor?.data?.refactoredCode ||
                         toolResults.optimize?.data?.optimizedCode ||
                         toolResults.debug?.data?.fixedCode ||
                         code;

          const prResponse = await api.generatePR(
            code,
            modCode,
            'Auto-generated from Code Assistant analysis',
            language,
            'Code improvements from Code Assistant'
          );
          toolResults.pr = prResponse;
        } catch (error) {
          console.error('PR generation failed:', error);
          toolResults.pr = { error: error.message };
        }
      }

      setResults(toolResults);

      const successCount = Object.values(toolResults).filter(r => !r.error).length;
      if (successCount > 0) {
        toast.success(`Analysis complete! ${successCount} tool${successCount > 1 ? 's' : ''} finished`);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [code, githubUrl, language, selectedTools, hasInput]);

  const clearResults = () => {
    setResults({});
    setModifiedCode('');
    toast.success('Results cleared');
  };

  const handleExportSuccess = (data) => {
    toast.success('Successfully exported to GitHub!');
  };

  const handlePRGenerate = (data) => {
    setResults(prev => ({ ...prev, pr: { data, tool: 'pr-generator' } }));
    toast.success('PR description generated!');
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
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-dark-950 min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: darkMode ? '#1e293b' : '#fff',
              color: darkMode ? '#f1f5f9' : '#1e293b',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            },
          }}
        />

        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">Code Assistant</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Debug, refactor, optimize, and test your code with AI-powered tools.
              Run multiple analyses simultaneously and export to GitHub.
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
                <ResultsDashboard
                  results={results}
                  darkMode={darkMode}
                  onClear={clearResults}
                />
              )}

              {/* PR Generator (shown when there are results) */}
              {Object.keys(results).length > 0 && (
                <PRGenerator
                  originalCode={code}
                  modifiedCode={getBestModifiedCode()}
                  language={language}
                  onGenerate={handlePRGenerate}
                />
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

              {/* GitHub Export (shown when there's code) */}
              {(code || Object.keys(results).length > 0) && (
                <GitHubExport
                  code={getBestModifiedCode() || code}
                  results={results}
                  onSuccess={handleExportSuccess}
                />
              )}

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-primary-500/10 to-purple-500/10 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-800">
                <h3 className="font-semibold text-primary-700 dark:text-primary-400 mb-3">Quick Tips</h3>
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
                    Generate PR descriptions automatically from your changes
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
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleDarkMode}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
