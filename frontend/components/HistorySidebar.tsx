'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  X,
  Search,
  Clock,
  Code,
  FileText,
  TestTube,
  Zap,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryItem {
  id: string;
  type: 'generate' | 'test' | 'optimize' | 'docs';
  title: string;
  preview: string;
  timestamp: Date;
}

const TYPE_CONFIG = {
  generate: { icon: Code, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  test: { icon: TestTube, color: 'text-green-500', bg: 'bg-green-500/10' },
  optimize: { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  docs: { icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
};

// Mock data - in production this would come from context/API
const MOCK_HISTORY: HistoryItem[] = [
  {
    id: '1',
    type: 'generate',
    title: 'React form validation',
    preview: 'Create a form with email and password validation...',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    type: 'test',
    title: 'Unit tests for UserService',
    preview: 'Generate Jest tests for the user authentication...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    type: 'optimize',
    title: 'Optimize database queries',
    preview: 'Analyze and optimize the following SQL queries...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem?: (item: HistoryItem) => void;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function HistorySidebar({ isOpen, onClose, onSelectItem }: HistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>(MOCK_HISTORY);

  const filteredHistory = history.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(history.filter((item) => item.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 glass-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-dark-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <History className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">History</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {history.length} recent sessions
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-200/50 dark:border-dark-700/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-dark-700 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
              </div>

              {/* History List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No history found</p>
                  </div>
                ) : (
                  filteredHistory.map((item) => {
                    const config = TYPE_CONFIG[item.type];
                    const Icon = config.icon;

                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => onSelectItem?.(item)}
                        className="w-full p-4 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all text-left group"
                        whileHover={{ scale: 1.01, y: -2 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('p-2 rounded-lg', config.bg)}>
                            <Icon className={cn('w-4 h-4', config.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                {item.title}
                              </h3>
                              <span className="text-xs text-gray-400 flex-shrink-0">
                                {formatRelativeTime(item.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                              {item.preview}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleDelete(item.id, e)}
                              className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </motion.button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200/50 dark:border-dark-700/50">
                <button className="w-full py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Clear All History
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
