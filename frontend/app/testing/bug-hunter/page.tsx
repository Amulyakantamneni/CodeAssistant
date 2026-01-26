'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, Play, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

interface BugReport {
  severity: 'error' | 'warning' | 'info';
  line: number;
  title: string;
  description: string;
  suggestion: string;
}

export default function BugHunterPage() {
  const [code, setCode] = useState('');
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setBugs([
        {
          severity: 'error',
          line: 15,
          title: 'Potential null reference',
          description: 'The variable `user` could be null when accessing `user.name`.',
          suggestion: 'Add a null check before accessing properties: `if (user) { ... }`',
        },
        {
          severity: 'warning',
          line: 23,
          title: 'Unused variable',
          description: 'The variable `tempData` is declared but never used.',
          suggestion: 'Remove the unused variable or use it in your code.',
        },
        {
          severity: 'info',
          line: 42,
          title: 'Consider async/await',
          description: 'This Promise chain could be simplified with async/await.',
          suggestion: 'Refactor to: `const result = await fetchData();`',
        },
      ]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const severityIcon = {
    error: <AlertTriangle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const severityBg = {
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Bug Hunter"
        description="Find logical errors, syntax issues, and potential bugs in your code"
        icon={Bug}
        iconColor="from-red-500 to-orange-600"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paste your code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste the code you want to analyze for bugs..."
            className="w-full h-96 px-4 py-3 rounded-xl bg-gray-900 text-gray-300 font-mono text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
          <motion.button
            onClick={handleAnalyze}
            disabled={!code.trim() || isAnalyzing}
            className="mt-4 hero-cta-primary flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Bug className="w-5 h-5" />
            {isAnalyzing ? 'Hunting Bugs...' : 'Hunt for Bugs'}
          </motion.button>
        </div>

        {/* Results */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Analysis Results
          </label>
          <div className="space-y-4 h-96 overflow-y-auto pr-2">
            {bugs.length > 0 ? (
              bugs.map((bug, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border ${severityBg[bug.severity]}`}
                >
                  <div className="flex items-start gap-3">
                    {severityIcon[bug.severity]}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {bug.title}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Line {bug.line}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {bug.description}
                      </p>
                      <div className="bg-white/50 dark:bg-dark-800/50 rounded-lg p-2">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Suggestion:</span> {bug.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                {isAnalyzing ? (
                  <div className="animate-pulse">
                    <Bug className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Analyzing your code...</p>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Paste code and click "Hunt for Bugs" to analyze
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
