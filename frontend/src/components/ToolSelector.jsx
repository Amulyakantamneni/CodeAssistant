import React from 'react';
import { Bug, Sparkles, Zap, TestTube, GitPullRequest, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const TOOLS = [
  {
    id: 'debug',
    name: 'Debugger',
    description: 'Find syntax & logic errors',
    icon: Bug,
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-600 dark:text-red-400',
  },
  {
    id: 'refactor',
    name: 'Refactorizer',
    description: 'Apply clean code principles',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    textColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'optimize',
    name: 'Optimizer',
    description: 'Improve performance',
    icon: Zap,
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    textColor: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    id: 'test',
    name: 'Tester',
    description: 'Generate test cases',
    icon: TestTube,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-600 dark:text-green-400',
  },
  {
    id: 'pr',
    name: 'PR Generator',
    description: 'Create pull request',
    icon: GitPullRequest,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
];

export function ToolSelector({ selectedTools, setSelectedTools, onRunTools, isLoading, hasInput }) {
  const toggleTool = (toolId) => {
    setSelectedTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((t) => t !== toolId)
        : [...prev, toolId]
    );
  };

  const selectAll = () => {
    setSelectedTools(TOOLS.filter(t => t.id !== 'pr').map((t) => t.id));
  };

  const clearAll = () => {
    setSelectedTools([]);
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary-500" />
          Select Tools
        </h2>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Select multiple tools to run simultaneously on your code
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {TOOLS.map((tool) => {
          const isSelected = selectedTools.includes(tool.id);
          const Icon = tool.icon;

          return (
            <motion.button
              key={tool.id}
              onClick={() => toggleTool(tool.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? `${tool.bgColor} border-current ${tool.textColor}`
                  : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${tool.color}`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {tool.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={onRunTools}
        disabled={isLoading || selectedTools.length === 0 || !hasInput}
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
          isLoading || selectedTools.length === 0 || !hasInput
            ? 'bg-gray-300 dark:bg-dark-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <>
            <div className="spinner" />
            Analyzing...
          </>
        ) : (
          <>
            Run {selectedTools.length} Tool{selectedTools.length !== 1 ? 's' : ''}
          </>
        )}
      </button>

      {!hasInput && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          Please enter code or a GitHub URL first
        </p>
      )}
    </div>
  );
}
