'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Play, Globe, Zap, Eye, Shield, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

interface LighthouseScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

interface LighthouseResult {
  url: string;
  scores: LighthouseScore;
  suggestions: string[];
}

export default function LighthousePage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<LighthouseResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    if (!url.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      setResult({
        url: url,
        scores: {
          performance: 92,
          accessibility: 88,
          bestPractices: 95,
          seo: 90,
        },
        suggestions: [
          'Serve images in next-gen formats (WebP, AVIF)',
          'Eliminate render-blocking resources',
          'Reduce unused JavaScript',
          'Add aria-label to interactive elements',
          'Use a <meta name="viewport"> tag',
        ],
      });
      setIsScanning(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const scoreCategories = [
    { key: 'performance', label: 'Performance', icon: Zap },
    { key: 'accessibility', label: 'Accessibility', icon: Eye },
    { key: 'bestPractices', label: 'Best Practices', icon: CheckCircle },
    { key: 'seo', label: 'SEO', icon: Globe },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Lighthouse"
        description="Run performance audits on web pages"
        icon={LineChart}
        iconColor="from-orange-500 to-red-600"
      />

      {/* URL Input */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
          <motion.button
            onClick={handleScan}
            disabled={!url.trim() || isScanning}
            className="hero-cta-primary flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5" />
            {isScanning ? 'Scanning...' : 'Run Audit'}
          </motion.button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {scoreCategories.map((category) => {
              const score = result.scores[category.key as keyof LighthouseScore];
              return (
                <motion.div
                  key={category.key}
                  className={`rounded-xl p-6 text-center ${getScoreBg(score)}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <category.icon className={`w-6 h-6 mx-auto mb-2 ${getScoreColor(score)}`} />
                  <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                    {score}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {category.label}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Suggestions */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Improvement Suggestions
            </h3>
            <div className="space-y-3">
              {result.suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-dark-700/50"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!result && !isScanning && (
        <div className="glass-card rounded-xl p-12 text-center">
          <LineChart className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Run a Performance Audit
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Enter a URL above to analyze performance, accessibility, best practices, and SEO.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isScanning && (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-primary-200 border-t-primary-500 rounded-full" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Analyzing {url}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            This may take a few moments...
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
