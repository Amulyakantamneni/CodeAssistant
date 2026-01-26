'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Check, Sparkles, Zap, Brain } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const MODELS = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Most capable model, best for complex coding tasks',
    speed: 'Fast',
    quality: 'Highest',
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-600',
    recommended: true,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Great balance of speed and capability',
    speed: 'Very Fast',
    quality: 'High',
    icon: Zap,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Excellent for nuanced coding and explanations',
    speed: 'Fast',
    quality: 'Highest',
    icon: Brain,
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'llama-3',
    name: 'Llama 3 70B',
    provider: 'Meta',
    description: 'Open source, good for general tasks',
    speed: 'Medium',
    quality: 'Good',
    icon: Cpu,
    color: 'from-purple-500 to-pink-600',
  },
];

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o');

  return (
    <DashboardLayout>
      <PageHeader
        title="Model Selection"
        description="Choose AI models for code generation"
        icon={Cpu}
        iconColor="from-blue-500 to-indigo-600"
      />

      <div className="space-y-4">
        {MODELS.map((model) => (
          <motion.button
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className={`w-full p-5 rounded-xl text-left transition-all ${
              selectedModel === model.id
                ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                : 'glass-card hover:border-primary-300 dark:hover:border-primary-700'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${model.color}`}>
                <model.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {model.name}
                  </h3>
                  <span className="text-sm text-gray-500">{model.provider}</span>
                  {model.recommended && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {model.description}
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-gray-500">
                    Speed: <span className="font-medium text-gray-700 dark:text-gray-300">{model.speed}</span>
                  </span>
                  <span className="text-gray-500">
                    Quality: <span className="font-medium text-gray-700 dark:text-gray-300">{model.quality}</span>
                  </span>
                </div>
              </div>
              {selectedModel === model.id && (
                <div className="p-2 rounded-full bg-primary-500">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 glass-card rounded-xl p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Note:</strong> Model availability depends on your API key configuration.
          Configure your API keys in <a href="/settings/api-keys" className="text-primary-500 hover:underline">Settings → API Keys</a>.
        </p>
      </div>
    </DashboardLayout>
  );
}
