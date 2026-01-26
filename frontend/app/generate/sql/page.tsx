'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Play, Copy, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const DB_TYPES = ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'SQL Server'];

export default function SQLBuilderPage() {
  const [prompt, setPrompt] = useState('');
  const [dbType, setDbType] = useState('PostgreSQL');
  const [generatedSQL, setGeneratedSQL] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedSQL(`-- Generated ${dbType} query for: "${prompt}"
SELECT
    u.id,
    u.name,
    u.email,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > NOW() - INTERVAL '30 days'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 10;`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="SQL/Query Builder"
        description="Generate database queries from natural language"
        icon={Database}
        iconColor="from-cyan-500 to-blue-600"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Database Type
            </label>
            <div className="flex flex-wrap gap-2">
              {DB_TYPES.map((db) => (
                <button
                  key={db}
                  onClick={() => setDbType(db)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    dbType === db
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                  }`}
                >
                  {db}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Describe your query
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Get the top 10 customers by total order value in the last 30 days"
              className="w-full h-40 px-4 py-3 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
            />
          </div>

          <motion.button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="hero-cta-primary flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'Generate Query'}
          </motion.button>
        </div>

        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated SQL
            </label>
            {generatedSQL && (
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="bg-gray-900 rounded-xl p-4 min-h-[300px]">
            {generatedSQL ? (
              <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                {generatedSQL}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Your generated query will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
