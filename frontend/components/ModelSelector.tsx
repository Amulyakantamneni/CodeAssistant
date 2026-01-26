'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Cpu, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: typeof Sparkles;
  color: string;
}

const MODELS: Model[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Most capable, best for complex tasks',
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Fast and capable',
    icon: Zap,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Excellent for coding tasks',
    icon: Cpu,
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'llama-3',
    name: 'Llama 3',
    provider: 'Meta',
    description: 'Open source, good performance',
    icon: Cpu,
    color: 'from-purple-500 to-pink-600',
  },
];

interface ModelSelectorProps {
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
  compact?: boolean;
}

export function ModelSelector({
  selectedModel = 'gpt-4o',
  onModelChange,
  compact = false,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  const handleSelect = (modelId: string) => {
    onModelChange?.(modelId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl transition-all',
          'bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm',
          'border border-gray-200 dark:border-dark-600',
          'hover:border-primary-300 dark:hover:border-primary-600',
          compact ? 'text-sm' : ''
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={cn('p-1.5 rounded-lg bg-gradient-to-br', currentModel.color)}>
          <currentModel.icon className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="text-left">
          <span className="font-medium text-gray-900 dark:text-white">
            {currentModel.name}
          </span>
          {!compact && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {currentModel.provider}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute top-full mt-2 right-0 z-50 w-72 glass-card rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Select Model
                </div>
                <div className="space-y-1">
                  {MODELS.map((model) => {
                    const isSelected = model.id === selectedModel;
                    return (
                      <motion.button
                        key={model.id}
                        onClick={() => handleSelect(model.id)}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left',
                          isSelected
                            ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                            : 'hover:bg-gray-100 dark:hover:bg-dark-700'
                        )}
                        whileHover={{ x: 4 }}
                      >
                        <div className={cn('p-2 rounded-lg bg-gradient-to-br', model.color)}>
                          <model.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {model.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {model.provider}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {model.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-primary-500" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
