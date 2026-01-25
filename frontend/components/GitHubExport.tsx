'use client';

import { useState } from 'react';
import {
  Github,
  Upload,
  Check,
  AlertCircle,
  Key,
  GitBranch,
  FileCode,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface GitHubExportProps {
  code: string;
  results?: any;
  onSuccess?: (data: any) => void;
}

export function GitHubExport({ code, results, onSuccess }: GitHubExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    githubToken: '',
    repo: '',
    branch: 'main',
    filename: 'code.js',
    commitMessage: '',
    createPR: false,
    prTitle: '',
    prBody: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleExport = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const exportResult = await api.github.export({
        code,
        filename: formData.filename,
        repo: formData.repo,
        branch: formData.branch,
        commit_message:
          formData.commitMessage || `Update ${formData.filename} via Code Assistant`,
        github_token: formData.githubToken,
      });

      if (exportResult.success) {
        let message = `Code exported successfully! View commit: ${exportResult.data.commit_url}`;

        if (formData.createPR && formData.prTitle) {
          const prResult = await api.github.createPR({
            repo: formData.repo,
            title: formData.prTitle,
            body: formData.prBody || results?.pr?.data?.fullMarkdown || '',
            head: formData.branch,
            base: 'main',
            github_token: formData.githubToken,
          });

          if (prResult.success) {
            message += `\n\nPR created: ${prResult.data.pr_url}`;
          }
        }

        setSuccess(message);
        onSuccess?.(exportResult.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card card-shine rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg">
            <Github className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <span className="font-semibold block">Export to GitHub</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Push code and create PR
            </span>
          </div>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-6 pb-6"
          >
            <div className="space-y-4 pt-2">
              {/* GitHub Token */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Key className="w-4 h-4" />
                  GitHub Personal Access Token
                </label>
                <input
                  type="password"
                  name="githubToken"
                  value={formData.githubToken}
                  onChange={handleChange}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Token needs repo scope.{' '}
                  <a
                    href="https://github.com/settings/tokens/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline"
                  >
                    Create token
                  </a>
                </p>
              </div>

              {/* Repository */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Github className="w-4 h-4" />
                  Repository
                </label>
                <input
                  type="text"
                  name="repo"
                  value={formData.repo}
                  onChange={handleChange}
                  placeholder="username/repository"
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Branch */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <GitBranch className="w-4 h-4" />
                    Branch
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="main"
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Filename */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FileCode className="w-4 h-4" />
                    Filename
                  </label>
                  <input
                    type="text"
                    name="filename"
                    value={formData.filename}
                    onChange={handleChange}
                    placeholder="src/code.js"
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Commit Message */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  Commit Message
                </label>
                <input
                  type="text"
                  name="commitMessage"
                  value={formData.commitMessage}
                  onChange={handleChange}
                  placeholder="Update code via Code Assistant"
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Create PR Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="createPR"
                  id="createPR"
                  checked={formData.createPR}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor="createPR"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Also create a Pull Request
                </label>
              </div>

              {/* PR Fields */}
              {formData.createPR && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pl-6 border-l-2 border-primary-500"
                >
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      PR Title
                    </label>
                    <input
                      type="text"
                      name="prTitle"
                      value={formData.prTitle}
                      onChange={handleChange}
                      placeholder="Add new feature"
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      PR Description
                    </label>
                    <textarea
                      name="prBody"
                      value={formData.prBody}
                      onChange={handleChange}
                      placeholder="Description of changes..."
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    />
                    {results?.pr?.data?.fullMarkdown && (
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            prBody: results.pr.data.fullMarkdown,
                          }))
                        }
                        className="text-xs text-primary-500 hover:underline mt-1"
                      >
                        Use generated PR description
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm whitespace-pre-wrap">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-4 h-4" />
                    Success!
                  </div>
                  {success}
                </div>
              )}

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={loading || !formData.githubToken || !formData.repo || !code}
                className={cn(
                  'w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2',
                  loading || !formData.githubToken || !formData.repo || !code
                    ? 'bg-gray-300 dark:bg-dark-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black'
                )}
              >
                {loading ? (
                  <>
                    <div className="spinner spinner-dark" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Export to GitHub
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GitHubExport;
