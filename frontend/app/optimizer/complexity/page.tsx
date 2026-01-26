'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Play, AlertTriangle, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

interface ComplexityResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  functions: Array<{
    name: string;
    complexity: number;
    lines: number;
    status: 'good' | 'warning' | 'danger';
  }>;
  suggestions: string[];
}

export default function ComplexityPage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<ComplexityResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult({
        score: 12,
        grade: 'B',
        functions: [
          { name: 'processUserData', complexity: 8, lines: 45, status: 'warning' },
          { name: 'validateInput', complexity: 3, lines: 15, status: 'good' },
          { name: 'handleSubmit', complexity: 15, lines: 78, status: 'danger' },
          { name: 'formatResponse', complexity: 2, lines: 12, status: 'good' },
        ],
        suggestions: [
          'Extract the nested conditions in handleSubmit into separate functions',
          'Consider using a state machine pattern for processUserData',
          'The switch statement on line 34 could be replaced with a lookup object',
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const gradeColors = {
    A: 'text-green-500 bg-green-100 dark:bg-green-900/30',
    B: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    C: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
    D: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
    F: 'text-red-500 bg-red-100 dark:bg-red-900/30',
  };

  const statusConfig = {
    good: { color: 'text-green-500', icon: CheckCircle, label: 'Low' },
    warning: { color: 'text-yellow-500', icon: AlertTriangle, label: 'Medium' },
    danger: { color: 'text-red-500', icon: AlertTriangle, label: 'High' },
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Complexity Check"
        description="Calculate cyclomatic complexity and identify areas for simplification"
        icon={GitBranch}
        iconColor="from-violet-500 to-purple-600"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Code to Analyze
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="w-full h-96 px-4 py-3 rounded-xl bg-gray-900 text-gray-300 font-mono text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
          <motion.button
            onClick={handleAnalyze}
            disabled={!code.trim() || isAnalyzing}
            className="mt-4 hero-cta-primary flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <GitBranch className="w-5 h-5" />
            {isAnalyzing ? 'Analyzing...' : 'Check Complexity'}
          </motion.button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Score Card */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cyclomatic Complexity</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{result.score}</p>
                  </div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${gradeColors[result.grade]}`}>
                    {result.grade}
                  </div>
                </div>
              </div>

              {/* Function Breakdown */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Function Analysis</h4>
                <div className="space-y-2">
                  {result.functions.map((fn, index) => {
                    const config = statusConfig[fn.status];
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${config.color}`} />
                            <span className="font-mono text-sm text-gray-900 dark:text-white">
                              {fn.name}()
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-500">
                              {fn.lines} lines
                            </span>
                            <span className={config.color}>
                              Complexity: {fn.complexity}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Suggestions</h4>
                <div className="glass-card rounded-xl p-4 space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">•</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card rounded-xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <GitBranch className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Analyze your code to see complexity metrics
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
