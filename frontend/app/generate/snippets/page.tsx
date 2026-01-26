'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Plus, Search, Copy, Trash2, Code } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

interface Snippet {
  id: string;
  name: string;
  language: string;
  code: string;
  tags: string[];
}

const MOCK_SNIPPETS: Snippet[] = [
  {
    id: '1',
    name: 'React useDebounce Hook',
    language: 'typescript',
    code: 'export function useDebounce<T>(value: T, delay: number): T { ... }',
    tags: ['react', 'hooks', 'utility'],
  },
  {
    id: '2',
    name: 'Python API Error Handler',
    language: 'python',
    code: '@app.exception_handler(HTTPException)\nasync def http_exception_handler...',
    tags: ['python', 'fastapi', 'error-handling'],
  },
  {
    id: '3',
    name: 'SQL Pagination Query',
    language: 'sql',
    code: 'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    tags: ['sql', 'pagination', 'database'],
  },
];

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>(MOCK_SNIPPETS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSnippets = snippets.filter(
    (snippet) =>
      snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <PageHeader
        title="Snippet Library"
        description="Save and reuse common code patterns"
        icon={Database}
        iconColor="from-purple-500 to-pink-600"
        actions={
          <motion.button
            className="cta-button flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            New Snippet
          </motion.button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>
      </div>

      {/* Snippets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSnippets.map((snippet) => (
          <motion.div
            key={snippet.id}
            className="glass-card rounded-xl p-5 group"
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-primary-500" />
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {snippet.name}
                </h3>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300">
                {snippet.language}
              </span>
            </div>

            <div className="bg-gray-900 rounded-lg p-3 mb-3 font-mono text-sm text-gray-300 overflow-hidden">
              <code className="line-clamp-3">{snippet.code}</code>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {snippet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSnippets.length === 0 && (
        <div className="text-center py-12">
          <Database className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No snippets found</p>
        </div>
      )}
    </DashboardLayout>
  );
}
