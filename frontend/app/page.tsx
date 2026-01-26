'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { CodeInput } from '@/components/CodeInput';
import { ToolSelector } from '@/components/ToolSelector';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import GitHubExport from '@/components/GitHubExport';
import { OutputConsole, type ConsoleLog } from '@/components/OutputConsole';
import { ChatAssistant } from '@/components/ChatAssistant';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function GeneratePage() {
  // Input state
  const [code, setCode] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [language, setLanguage] = useState('');

  // Tool selection state
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Results state
  const [results, setResults] = useState<Record<string, { status: string; data?: any }>>({});

  // Modified code from results
  const [modifiedCode, setModifiedCode] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);

  const hasInput = code.trim().length > 0 || githubUrl.trim().length > 0;

  const addLog = useCallback((level: ConsoleLog['level'], message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setConsoleLogs((prev) => [...prev, { id, time: timestamp, level, message }]);
  }, []);

  const clearLogs = () => {
    setConsoleLogs([]);
  };

  const runTools = useCallback(async () => {
    if (!hasInput || selectedTools.length === 0) {
      toast.error('Please enter a prompt or code and select at least one tool');
      addLog(
        'warning',
        'Please enter a prompt or code and select at least one tool before running analysis.'
      );
      return;
    }

    setIsLoading(true);
    setResults({});
    addLog('info', `Running ${selectedTools.length} tool(s)...`);

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
          addLog('info', `Starting ${tool}...`);

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
          addLog('success', `${tool} completed.`);
        } catch (error: any) {
          const errorDetail =
            error?.response?.data?.detail || error?.response?.data?.error || error?.message;
          console.error(`Error running ${tool}:`, error);
          setResults((prev: Record<string, { status: string; data?: any }>) => ({
            ...prev,
            [tool]: { status: 'failed', data: { error: errorDetail || 'Unknown error' } },
          }));
          addLog('error', `${tool} failed: ${errorDetail || 'Unknown error'}`);
        }
      });

      await Promise.all(toolPromises);

      toast.success('Analysis complete!');
      addLog('success', 'All analyses complete.');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
      addLog('error', 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [code, githubUrl, language, selectedTools, hasInput, modifiedCode, addLog]);

  const clearResults = () => {
    setResults({});
    setModifiedCode('');
    toast.success('Results cleared');
    addLog('info', 'Results cleared.');
  };

  const generateFromPrompt = useCallback(async () => {
    if (!code.trim()) {
      toast.error('Please enter a prompt first');
      addLog('warning', 'Please enter a prompt before generating.');
      return;
    }

    setIsGenerating(true);
    setResults({});
    addLog('info', 'Generating code from prompt...');

    try {
      const response = await api.sync.generate({
        code,
        language,
      });

      const generatedCode =
        response?.data?.generatedCode ||
        response?.data?.code ||
        response?.data?.output ||
        '';

      if (!generatedCode) {
        throw new Error('No code returned from generator');
      }

      setModifiedCode(generatedCode);
      setResults({
        generate: {
          status: 'completed',
          data: {
            summary: response?.data?.summary,
            language: response?.data?.language || language,
            generatedCode,
          },
        },
      });
      addLog('success', 'Code generated successfully.');
      toast.success('Code generated');
    } catch (error: any) {
      const errorDetail =
        error?.response?.data?.detail || error?.response?.data?.error || error?.message;
      addLog('error', `Generation failed: ${errorDetail || 'Unknown error'}`);
      toast.error('Generation failed. Please try again.');
      setResults({
        generate: {
          status: 'failed',
          data: { error: errorDetail || 'Unknown error' },
        },
      });
    } finally {
      setIsGenerating(false);
    }
  }, [code, language, addLog]);

  const handleExportSuccess = () => {
    toast.success('Successfully exported to GitHub!');
    addLog('success', 'Exported to GitHub.');
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
    <div className="cosmic-bg morph-bg overflow-hidden min-h-screen">
      {/* Floating Orbs - 3D Background Elements */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      <div className="relative z-10">
        <Header />

        <motion.main
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div className="text-center mb-10" variants={itemVariants}>
            <motion.h1
              className="text-4xl sm:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="title-gradient neon-glow">Generate Code</span>
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Describe what you want in plain English, or bring your existing code.
              <br />
              Generate, refactor, optimize, and test with AI-powered tools.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6">
            <div>
              {/* Tool Selector - Horizontal Pills */}
              <motion.div className="mb-8" variants={itemVariants}>
                <ToolSelector
                  selectedTools={selectedTools}
                  setSelectedTools={setSelectedTools}
                />
              </motion.div>

              {/* Code Input */}
              <motion.div className="mb-6" variants={itemVariants}>
                <CodeInput
                  code={code}
                  setCode={setCode}
                  githubUrl={githubUrl}
                  setGithubUrl={setGithubUrl}
                  language={language}
                  setLanguage={setLanguage}
                  onGeneratePrompt={generateFromPrompt}
                  isGenerating={isGenerating}
                />
              </motion.div>

              {/* Run Tools Button */}
              <motion.div className="mb-6" variants={itemVariants}>
                <motion.button
                  onClick={runTools}
                  disabled={isLoading || selectedTools.length === 0 || !hasInput}
                  className={cn(
                    'w-full py-4 rounded-xl font-semibold text-white text-lg flex items-center justify-center gap-2 ripple-effect spotlight',
                    isLoading || selectedTools.length === 0 || !hasInput
                      ? 'bg-gray-400 dark:bg-dark-600 cursor-not-allowed'
                      : 'btn-premium'
                  )}
                  whileHover={
                    !isLoading && selectedTools.length > 0 && hasInput
                      ? { scale: 1.02, y: -3 }
                      : {}
                  }
                  whileTap={
                    !isLoading && selectedTools.length > 0 && hasInput
                      ? { scale: 0.98, y: 0 }
                      : {}
                  }
                >
                  {isLoading ? (
                    <>
                      <div className="spinner" />
                      Running AI tools...
                    </>
                  ) : (
                    'Run AI Tools'
                  )}
                </motion.button>
                {!hasInput && selectedTools.length > 0 && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Please enter a prompt, code, or a GitHub URL first
                  </p>
                )}
                {hasInput && selectedTools.length === 0 && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Please select at least one tool
                  </p>
                )}
              </motion.div>

              <motion.div className="mb-8" variants={itemVariants}>
                <OutputConsole logs={consoleLogs} onClear={clearLogs} />
              </motion.div>

              {/* Results Dashboard */}
              {Object.keys(results).length > 0 && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ResultsDashboard results={results} onClear={clearResults} />
                </motion.div>
              )}

              {/* GitHub Export - Show after results */}
              {Object.keys(results).length > 0 && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <GitHubExport
                    code={getBestModifiedCode() || code}
                    results={results}
                    onSuccess={handleExportSuccess}
                  />
                </motion.div>
              )}
            </div>

            <motion.aside
              className="space-y-6 xl:sticky xl:top-24 h-fit"
              variants={itemVariants}
            >
              <ChatAssistant code={code} language={language} />
            </motion.aside>
          </div>
        </motion.main>

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
