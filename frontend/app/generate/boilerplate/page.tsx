'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCode, ArrowRight, Check } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const FRAMEWORKS = [
  {
    id: 'react',
    name: 'React',
    description: 'Modern UI library with hooks and components',
    templates: ['Vite + React', 'Next.js', 'Create React App'],
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Versatile language for web, data, and automation',
    templates: ['FastAPI', 'Django', 'Flask'],
  },
  {
    id: 'node',
    name: 'Node.js',
    description: 'JavaScript runtime for backend development',
    templates: ['Express', 'NestJS', 'Fastify'],
  },
  {
    id: 'go',
    name: 'Go',
    description: 'Fast, compiled language for systems programming',
    templates: ['Gin', 'Echo', 'Fiber'],
  },
];

export default function BoilerplatePage() {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const currentFramework = FRAMEWORKS.find((f) => f.id === selectedFramework);

  return (
    <DashboardLayout>
      <PageHeader
        title="Boilerplate Generator"
        description="Generate project scaffolding for popular frameworks"
        icon={FileCode}
        iconColor="from-blue-500 to-indigo-600"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Framework Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            1. Choose a Framework
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FRAMEWORKS.map((framework) => (
              <motion.button
                key={framework.id}
                onClick={() => {
                  setSelectedFramework(framework.id);
                  setSelectedTemplate(null);
                }}
                className={`p-4 rounded-xl text-left transition-all ${
                  selectedFramework === framework.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                    : 'glass-card hover:border-primary-300 dark:hover:border-primary-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {framework.name}
                  </h4>
                  {selectedFramework === framework.id && (
                    <Check className="w-5 h-5 text-primary-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {framework.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Template Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            2. Select a Template
          </h3>
          {currentFramework ? (
            <div className="space-y-3">
              {currentFramework.templates.map((template) => (
                <motion.button
                  key={template}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    selectedTemplate === template
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                      : 'glass-card hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {template}
                    </span>
                    {selectedTemplate === template && (
                      <Check className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Select a framework to see available templates
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      {selectedTemplate && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button className="hero-cta-primary flex items-center gap-2">
            Generate {selectedTemplate} Project
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
