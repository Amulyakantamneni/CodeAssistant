'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Check, ExternalLink } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const IDE_EXTENSIONS = [
  {
    id: 'vscode',
    name: 'VS Code',
    description: 'Official extension for Visual Studio Code',
    installed: true,
    version: '1.2.0',
    link: 'https://marketplace.visualstudio.com',
  },
  {
    id: 'jetbrains',
    name: 'JetBrains',
    description: 'Plugin for IntelliJ IDEA, WebStorm, PyCharm, etc.',
    installed: false,
    version: '1.0.0',
    link: 'https://plugins.jetbrains.com',
  },
  {
    id: 'neovim',
    name: 'Neovim',
    description: 'Lua plugin for Neovim',
    installed: false,
    version: '0.9.0',
    link: 'https://github.com',
  },
  {
    id: 'sublime',
    name: 'Sublime Text',
    description: 'Package for Sublime Text 4',
    installed: false,
    version: '1.1.0',
    link: 'https://packagecontrol.io',
  },
];

export default function EnvironmentPage() {
  const [extensions, setExtensions] = useState(IDE_EXTENSIONS);

  const toggleInstall = (id: string) => {
    setExtensions(extensions.map((ext) =>
      ext.id === id ? { ...ext, installed: !ext.installed } : ext
    ));
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Environment Settings"
        description="Configure IDE extensions and development tools"
        icon={Monitor}
        iconColor="from-blue-500 to-indigo-600"
      />

      {/* IDE Extensions */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          IDE Extensions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {extensions.map((ext) => (
            <motion.div
              key={ext.id}
              className="glass-card rounded-xl p-5"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {ext.name}
                    </h4>
                    <span className="text-xs text-gray-500">v{ext.version}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {ext.description}
                  </p>
                  <a
                    href={ext.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
                  >
                    View in marketplace
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <motion.button
                  onClick={() => toggleInstall(ext.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    ext.installed
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {ext.installed ? (
                    <>
                      <Check className="w-4 h-4" />
                      Installed
                    </>
                  ) : (
                    'Install'
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Default Settings */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Default Settings
        </h3>
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Auto-format on save</h4>
              <p className="text-sm text-gray-500">Automatically format code when saving files</p>
            </div>
            <button className="relative w-12 h-6 bg-primary-500 rounded-full">
              <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Inline suggestions</h4>
              <p className="text-sm text-gray-500">Show AI suggestions inline while typing</p>
            </div>
            <button className="relative w-12 h-6 bg-primary-500 rounded-full">
              <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Telemetry</h4>
              <p className="text-sm text-gray-500">Send anonymous usage data to improve the product</p>
            </div>
            <button className="relative w-12 h-6 bg-gray-300 dark:bg-dark-600 rounded-full">
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
            </button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
