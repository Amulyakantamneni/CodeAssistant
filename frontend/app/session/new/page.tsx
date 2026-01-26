'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Code, FileCode, Database, Globe, Smartphone, Server, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const PROJECT_TYPES = [
  { id: 'web', name: 'Web Application', icon: Globe, description: 'React, Vue, or Angular app' },
  { id: 'api', name: 'API/Backend', icon: Server, description: 'REST or GraphQL API' },
  { id: 'mobile', name: 'Mobile App', icon: Smartphone, description: 'React Native or Flutter' },
  { id: 'script', name: 'Script/Utility', icon: Code, description: 'Automation or CLI tool' },
  { id: 'fullstack', name: 'Full Stack', icon: FileCode, description: 'Frontend + Backend' },
  { id: 'data', name: 'Data/ML', icon: Database, description: 'Data processing or ML' },
];

export default function NewSessionPage() {
  const router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const handleStart = () => {
    // In a real app, this would create a session and redirect
    router.push('/generate');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="New Session"
        description="Start a fresh coding task"
        icon={Plus}
        iconColor="from-blue-500 to-indigo-600"
      />

      <div className="max-w-2xl mx-auto">
        {/* Project Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="My Awesome Project"
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>

        {/* Project Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            What are you building?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PROJECT_TYPES.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => setProjectType(type.id)}
                className={`p-4 rounded-xl text-left transition-all ${
                  projectType === type.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                    : 'glass-card hover:border-primary-300 dark:hover:border-primary-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <type.icon className={`w-6 h-6 mb-2 ${projectType === type.id ? 'text-primary-500' : 'text-gray-500'}`} />
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">{type.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{type.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Brief Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you want to build..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
        </div>

        {/* Start Button */}
        <motion.button
          onClick={handleStart}
          disabled={!projectName.trim()}
          className="w-full hero-cta-primary flex items-center justify-center gap-2 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Coding
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </DashboardLayout>
  );
}
