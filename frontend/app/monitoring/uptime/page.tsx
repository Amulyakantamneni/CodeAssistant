'use client';

import { motion } from 'framer-motion';
import { Server, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const SERVICES = [
  { name: 'API Gateway', status: 'operational', latency: '45ms', uptime: '99.99%' },
  { name: 'OpenAI API', status: 'operational', latency: '120ms', uptime: '99.95%' },
  { name: 'GitHub API', status: 'operational', latency: '89ms', uptime: '99.90%' },
  { name: 'Redis Cache', status: 'operational', latency: '12ms', uptime: '100%' },
  { name: 'Celery Workers', status: 'degraded', latency: '230ms', uptime: '98.50%' },
];

const INCIDENTS = [
  { date: '2024-01-15', title: 'Elevated API latency', duration: '23 min', resolved: true },
  { date: '2024-01-10', title: 'Worker queue backlog', duration: '45 min', resolved: true },
];

export default function UptimePage() {
  const operationalCount = SERVICES.filter((s) => s.status === 'operational').length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Uptime Dashboard"
        description="Monitor service status and health"
        icon={Server}
        iconColor="from-green-500 to-emerald-600"
        actions={
          <motion.button
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        }
      />

      {/* Overall Status */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                All Systems Operational
              </h3>
              <p className="text-sm text-gray-500">
                {operationalCount} of {SERVICES.length} services running normally
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">99.9%</div>
            <div className="text-sm text-gray-500">30-day uptime</div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Services</h3>
        <div className="space-y-3">
          {SERVICES.map((service, index) => (
            <motion.div
              key={index}
              className="glass-card rounded-xl p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {service.status === 'operational' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {service.name}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    service.status === 'operational'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {service.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{service.latency}</span>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-gray-900 dark:text-white font-medium">{service.uptime}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Incidents</h3>
        <div className="space-y-3">
          {INCIDENTS.map((incident, index) => (
            <motion.div
              key={index}
              className="glass-card rounded-xl p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {incident.title}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">{incident.date}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Duration: {incident.duration}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
