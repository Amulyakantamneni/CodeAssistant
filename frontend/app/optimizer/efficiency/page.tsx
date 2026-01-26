'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, TrendingUp, Clock, Database } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

interface EfficiencyResult {
  timeComplexity: { current: string; suggested: string };
  spaceComplexity: { current: string; suggested: string };
  suggestions: Array<{ title: string; description: string; impact: 'high' | 'medium' | 'low' }>;
  optimizedCode?: string;
}

export default function EfficiencyPage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<EfficiencyResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult({
        timeComplexity: { current: 'O(n²)', suggested: 'O(n log n)' },
        spaceComplexity: { current: 'O(n)', suggested: 'O(1)' },
        suggestions: [
          {
            title: 'Use a hash map for lookups',
            description: 'Replace nested loop with a hash map to reduce time complexity from O(n²) to O(n).',
            impact: 'high',
          },
          {
            title: 'Early return optimization',
            description: 'Add early return conditions to avoid unnecessary iterations.',
            impact: 'medium',
          },
          {
            title: 'Avoid creating intermediate arrays',
            description: 'Use generators or reduce operations to avoid memory allocation.',
            impact: 'low',
          },
        ],
        optimizedCode: `// Optimized version using hash map
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = [];

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.push(item);
    } else {
      seen.add(item);
    }
  }

  return duplicates;
}`,
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const impactColor = {
    high: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
    low: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Efficiency Analysis"
        description="Analyze and optimize algorithm complexity and performance"
        icon={Zap}
        iconColor="from-yellow-500 to-orange-600"
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
            placeholder="Paste your code here for efficiency analysis..."
            className="w-full h-80 px-4 py-3 rounded-xl bg-gray-900 text-gray-300 font-mono text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
          <motion.button
            onClick={handleAnalyze}
            disabled={!code.trim() || isAnalyzing}
            className="mt-4 hero-cta-primary flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap className="w-5 h-5" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Efficiency'}
          </motion.button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Complexity Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono text-red-500">{result.timeComplexity.current}</span>
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-lg font-mono text-green-500">{result.timeComplexity.suggested}</span>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Space</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono text-red-500">{result.spaceComplexity.current}</span>
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-lg font-mono text-green-500">{result.spaceComplexity.suggested}</span>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Optimization Suggestions</h4>
                {result.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h5 className="font-medium text-gray-900 dark:text-white">{suggestion.title}</h5>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${impactColor[suggestion.impact]}`}>
                        {suggestion.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{suggestion.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Optimized Code */}
              {result.optimizedCode && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Optimized Code</h4>
                  <pre className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                    {result.optimizedCode}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <div className="glass-card rounded-xl p-8 h-80 flex items-center justify-center">
              <div className="text-center">
                <Zap className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Analyze your code to get efficiency insights
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
