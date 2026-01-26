'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Plus, Eye, EyeOff, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  key: string;
  status: 'active' | 'invalid' | 'expired';
  lastUsed?: string;
}

const MOCK_KEYS: ApiKey[] = [
  { id: '1', name: 'OpenAI Production', provider: 'OpenAI', key: 'sk-...abc123', status: 'active', lastUsed: '2 hours ago' },
  { id: '2', name: 'Anthropic API', provider: 'Anthropic', key: 'sk-ant-...xyz789', status: 'active', lastUsed: '1 day ago' },
  { id: '3', name: 'GitHub Token', provider: 'GitHub', key: 'ghp_...def456', status: 'expired' },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(MOCK_KEYS);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const statusConfig = {
    active: { color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
    invalid: { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', icon: AlertCircle },
    expired: { color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: AlertCircle },
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="API Management"
        description="Manage API keys for LLMs and external services"
        icon={Key}
        iconColor="from-amber-500 to-orange-600"
        actions={
          <motion.button
            onClick={() => setIsAddingNew(true)}
            className="cta-button flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Add API Key
          </motion.button>
        }
      />

      {/* API Keys List */}
      <div className="space-y-4">
        {keys.map((apiKey) => {
          const config = statusConfig[apiKey.status];
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={apiKey.id}
              className="glass-card rounded-xl p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                    <Key className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {apiKey.name}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {apiKey.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {apiKey.provider}
                      </span>
                      {apiKey.lastUsed && (
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                          Last used: {apiKey.lastUsed}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-dark-700 font-mono text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {showKey === apiKey.id ? apiKey.key : '••••••••••••••••'}
                    </span>
                    <button
                      onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {showKey === apiKey.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add New Key Modal */}
      {isAddingNew && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsAddingNew(false)}
        >
          <motion.div
            className="glass-card rounded-2xl p-6 w-full max-w-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New API Key
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="My API Key"
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provider
                </label>
                <select className="w-full px-4 py-2 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                  <option>OpenAI</option>
                  <option>Anthropic</option>
                  <option>GitHub</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 font-mono"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 cta-button">
                  Save Key
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
