'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wrench, Monitor, Key, Terminal, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const TOOLS = [
  {
    icon: Monitor,
    title: 'Environment Settings',
    description: 'Configure IDE extensions and development environment',
    href: '/tools/environment',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Key,
    title: 'API Management',
    description: 'Manage API keys for LLMs and external services',
    href: '/tools/api-keys',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Terminal,
    title: 'Terminal/CLI',
    description: 'Access a built-in sandbox command-line helper',
    href: '/tools/terminal',
    color: 'from-green-500 to-emerald-600',
  },
];

export default function ToolsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Tools & Integration"
        description="Configure your development environment and integrations"
        icon={Wrench}
        iconColor="from-purple-500 to-pink-600"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool, index) => (
          <Link key={index} href={tool.href}>
            <motion.div
              className="glass-card rounded-2xl p-6 h-full cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {tool.description}
              </p>
              <div className="flex items-center gap-2 text-primary-500">
                <span className="text-sm font-medium">Configure</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
