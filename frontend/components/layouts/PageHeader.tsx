'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  actions?: ReactNode;
  badge?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconColor = 'from-primary-500 to-indigo-600',
  actions,
  badge,
}: PageHeaderProps) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {Icon && (
            <motion.div
              className={`p-3 bg-gradient-to-br ${iconColor} rounded-xl shadow-lg`}
              whileHover={{ scale: 1.05 }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {badge && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}
