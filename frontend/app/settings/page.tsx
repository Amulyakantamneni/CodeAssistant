'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Settings, Palette, Cpu, Key, Code2, User, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const SETTINGS_SECTIONS = [
  {
    icon: Palette,
    title: 'Appearance',
    description: 'Theme, syntax highlighting, and display preferences',
    href: '/settings/appearance',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: Cpu,
    title: 'Model Selection',
    description: 'Choose AI models for code generation',
    href: '/settings/models',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Key,
    title: 'API Keys',
    description: 'Manage API keys for external providers',
    href: '/settings/api-keys',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Code2,
    title: 'Language Preferences',
    description: 'Default coding languages and frameworks',
    href: '/settings/languages',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: User,
    title: 'Account',
    description: 'Profile details and account settings',
    href: '/settings/account',
    color: 'from-purple-500 to-violet-600',
  },
];

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Settings"
        description="Configure your preferences and account"
        icon={Settings}
        iconColor="from-gray-600 to-gray-800"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SETTINGS_SECTIONS.map((section, index) => (
          <Link key={index} href={section.href}>
            <motion.div
              className="glass-card rounded-xl p-5 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color}`}>
                  <section.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {section.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
