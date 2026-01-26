'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, Server, LineChart, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const MONITORING_TOOLS = [
  {
    icon: Server,
    title: 'Uptime Dashboard',
    description: 'Monitor service status and API health',
    href: '/monitoring/uptime',
    color: 'from-green-500 to-emerald-600',
    stats: { value: '99.9%', label: 'Uptime' },
  },
  {
    icon: LineChart,
    title: 'Lighthouse',
    description: 'Run performance audits on your web pages',
    href: '/monitoring/lighthouse',
    color: 'from-orange-500 to-red-600',
    stats: { value: '92', label: 'Score' },
  },
];

export default function MonitoringPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Performance & Monitoring"
        description="Track service health and performance metrics"
        icon={Activity}
        iconColor="from-red-500 to-rose-600"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MONITORING_TOOLS.map((tool, index) => (
          <Link key={index} href={tool.href}>
            <motion.div
              className="glass-card rounded-2xl p-6 h-full cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tool.stats.value}
                  </div>
                  <div className="text-sm text-gray-500">{tool.stats.label}</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {tool.description}
              </p>
              <div className="flex items-center gap-2 text-primary-500">
                <span className="text-sm font-medium">View Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
