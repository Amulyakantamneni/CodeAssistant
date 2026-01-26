'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Play, Lightbulb, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

interface ErrorExplanation {
  summary: string;
  cause: string;
  solution: string;
  codeExample?: string;
}

export default function ErrorExplainerPage() {
  const [stackTrace, setStackTrace] = useState('');
  const [explanation, setExplanation] = useState<ErrorExplanation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!stackTrace.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setExplanation({
        summary: 'TypeError: Cannot read property \'map\' of undefined',
        cause: 'You are trying to call the .map() method on a variable that is undefined. This typically happens when data from an API hasn\'t loaded yet, or when accessing a nested property that doesn\'t exist.',
        solution: 'Add a null check before calling .map(), or provide a default empty array. You can use optional chaining (?.) or a logical OR (||) to handle this.',
        codeExample: `// Before (causes error)
const items = data.items.map(item => <Item key={item.id} />);

// After (fixed)
const items = data?.items?.map(item => <Item key={item.id} />) || [];

// Or with default value
const items = (data.items || []).map(item => <Item key={item.id} />);`,
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Error Explainer"
        description="Get plain-English explanations for error messages and stack traces"
        icon={AlertTriangle}
        iconColor="from-yellow-500 to-orange-600"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paste your error or stack trace
          </label>
          <textarea
            value={stackTrace}
            onChange={(e) => setStackTrace(e.target.value)}
            placeholder={`TypeError: Cannot read property 'map' of undefined
    at UserList (UserList.js:15:23)
    at renderWithHooks (react-dom.development.js:14985:18)
    at mountIndeterminateComponent (react-dom.development.js:17811:13)
    ...`}
            className="w-full h-64 px-4 py-3 rounded-xl bg-red-950 text-red-200 font-mono text-sm border border-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
          />
          <motion.button
            onClick={handleAnalyze}
            disabled={!stackTrace.trim() || isAnalyzing}
            className="mt-4 hero-cta-primary flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Lightbulb className="w-5 h-5" />
            {isAnalyzing ? 'Analyzing...' : 'Explain This Error'}
          </motion.button>
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Explanation
          </label>
          {explanation ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="glass-card rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Error Summary
                </h4>
                <p className="text-gray-700 dark:text-gray-300">{explanation.summary}</p>
              </div>

              <div className="glass-card rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What Caused This?
                </h4>
                <p className="text-gray-600 dark:text-gray-400">{explanation.cause}</p>
              </div>

              <div className="glass-card rounded-xl p-4 border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  How to Fix
                </h4>
                <p className="text-green-700 dark:text-green-300 mb-3">{explanation.solution}</p>
                {explanation.codeExample && (
                  <pre className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-300 overflow-x-auto">
                    {explanation.codeExample}
                  </pre>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="glass-card rounded-xl p-8 h-64 flex items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Paste an error and click "Explain" to get help
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
