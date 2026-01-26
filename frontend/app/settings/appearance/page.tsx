'use client';

import { motion } from 'framer-motion';
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const THEMES = [
  { id: 'light', name: 'Light', icon: Sun, description: 'Light background with dark text' },
  { id: 'dark', name: 'Dark', icon: Moon, description: 'Dark background with light text' },
  { id: 'system', name: 'System', icon: Monitor, description: 'Follow system preference' },
];

const SYNTAX_THEMES = [
  { id: 'github', name: 'GitHub', preview: 'bg-white' },
  { id: 'dracula', name: 'Dracula', preview: 'bg-purple-900' },
  { id: 'monokai', name: 'Monokai', preview: 'bg-gray-800' },
  { id: 'nord', name: 'Nord', preview: 'bg-slate-800' },
  { id: 'one-dark', name: 'One Dark', preview: 'bg-gray-900' },
];

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();

  return (
    <DashboardLayout>
      <PageHeader
        title="Appearance"
        description="Customize the look and feel"
        icon={Palette}
        iconColor="from-pink-500 to-rose-600"
      />

      {/* Theme Selection */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Theme
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {THEMES.map((t) => (
            <motion.button
              key={t.id}
              onClick={() => setTheme(t.id as 'light' | 'dark')}
              className={`p-4 rounded-xl text-left transition-all ${
                theme === t.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                  : 'glass-card hover:border-primary-300 dark:hover:border-primary-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <t.icon className={`w-5 h-5 ${theme === t.id ? 'text-primary-500' : 'text-gray-500'}`} />
                {theme === t.id && <Check className="w-5 h-5 text-primary-500" />}
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">{t.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.description}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Syntax Theme */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Syntax Theme
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {SYNTAX_THEMES.map((st) => (
            <motion.button
              key={st.id}
              className="glass-card rounded-xl p-3 text-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`h-16 rounded-lg mb-2 ${st.preview}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-500">
                {st.name}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Font Size */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Editor Font Size
        </h3>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">12px</span>
            <input
              type="range"
              min="12"
              max="24"
              defaultValue="14"
              className="flex-1 accent-primary-500"
            />
            <span className="text-sm text-gray-500">24px</span>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Current: 14px
          </p>
        </div>
      </section>

      {/* Other Preferences */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Display Preferences
        </h3>
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Line numbers</h4>
              <p className="text-sm text-gray-500">Show line numbers in code editor</p>
            </div>
            <button className="relative w-12 h-6 bg-primary-500 rounded-full">
              <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Word wrap</h4>
              <p className="text-sm text-gray-500">Wrap long lines in the editor</p>
            </div>
            <button className="relative w-12 h-6 bg-primary-500 rounded-full">
              <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Minimap</h4>
              <p className="text-sm text-gray-500">Show minimap for navigation</p>
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
