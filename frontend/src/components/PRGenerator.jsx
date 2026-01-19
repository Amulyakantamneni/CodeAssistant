import React, { useState } from 'react';
import { GitPullRequest, ArrowRight, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../utils/api';

export function PRGenerator({ originalCode, modifiedCode, language, onGenerate }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [changes, setChanges] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await api.generatePR(
        originalCode,
        modifiedCode,
        changes,
        language,
        title
      );
      setResult(response.data);
      onGenerate?.(response.data);
    } catch (error) {
      console.error('PR generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.fullMarkdown) {
      await navigator.clipboard.writeText(result.fullMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
          <GitPullRequest className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">PR Generator</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Generate pull request description</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Original Code
            </label>
            <textarea
              value={originalCode}
              readOnly
              placeholder="Original code will appear here..."
              className="w-full h-40 px-4 py-2 font-mono text-sm bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Modified Code
            </label>
            <textarea
              value={modifiedCode}
              readOnly
              placeholder="Modified code will appear here..."
              className="w-full h-40 px-4 py-2 font-mono text-sm bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg resize-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
            PR Title (optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Add user authentication feature"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
            Changes Summary (optional)
          </label>
          <textarea
            value={changes}
            onChange={(e) => setChanges(e.target.value)}
            placeholder="Describe the changes made..."
            rows={3}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || (!originalCode && !modifiedCode)}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
            loading || (!originalCode && !modifiedCode)
              ? 'bg-gray-300 dark:bg-dark-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
          }`}
        >
          {loading ? (
            <>
              <div className="spinner" />
              Generating...
            </>
          ) : (
            <>
              <GitPullRequest className="w-4 h-4" />
              Generate PR Description
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{result.title || 'Generated PR'}</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg text-sm transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {result.labels && result.labels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.labels.map((label, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            <div className="p-4 bg-gray-100 dark:bg-dark-700 rounded-xl max-h-96 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {result.fullMarkdown || result.description || JSON.stringify(result, null, 2)}
              </pre>
            </div>

            {result.checklist && result.checklist.length > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <h4 className="font-medium text-yellow-700 dark:text-yellow-400 mb-2">Review Checklist</h4>
                <ul className="space-y-1 text-sm">
                  {result.checklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <input type="checkbox" className="mt-1" />
                      <span>{item.replace(/^- \[ \] /, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
