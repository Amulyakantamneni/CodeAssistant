'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Github, Link, FolderOpen, ArrowRight, Check } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const IMPORT_METHODS = [
  {
    id: 'github',
    name: 'GitHub Repository',
    description: 'Connect your GitHub account and import a repository',
    icon: Github,
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 'url',
    name: 'From URL',
    description: 'Import from a public Git repository URL',
    icon: Link,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'upload',
    name: 'Upload Files',
    description: 'Upload local files or a ZIP archive',
    icon: Upload,
    color: 'from-green-500 to-emerald-600',
  },
];

export default function ImportPage() {
  const [method, setMethod] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleGitHubConnect = () => {
    setIsConnecting(true);
    // In a real app, this would trigger OAuth flow
    setTimeout(() => setIsConnecting(false), 2000);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Import Project"
        description="Connect an existing project to get started"
        icon={FolderOpen}
        iconColor="from-emerald-500 to-teal-600"
      />

      <div className="max-w-2xl mx-auto">
        {/* Import Methods */}
        <div className="space-y-4 mb-8">
          {IMPORT_METHODS.map((m) => (
            <motion.button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`w-full p-5 rounded-xl text-left transition-all ${
                method === m.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                  : 'glass-card hover:border-primary-300 dark:hover:border-primary-700'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${m.color}`}>
                  <m.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{m.name}</h3>
                  <p className="text-sm text-gray-500">{m.description}</p>
                </div>
                {method === m.id && <Check className="w-5 h-5 text-primary-500" />}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Method-specific UI */}
        {method === 'github' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Connect to GitHub
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Authorize AI Code Assistant to access your repositories.
            </p>
            <motion.button
              onClick={handleGitHubConnect}
              disabled={isConnecting}
              className="w-full py-3 px-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Github className="w-5 h-5" />
              {isConnecting ? 'Connecting...' : 'Connect GitHub Account'}
            </motion.button>
          </motion.div>
        )}

        {method === 'url' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Import from URL
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Repository URL
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
            <motion.button
              disabled={!repoUrl.trim()}
              className="w-full hero-cta-primary flex items-center justify-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Import Repository
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {method === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Upload Files
            </h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports .zip, .tar.gz, or individual files
              </p>
              <input type="file" className="hidden" multiple />
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
