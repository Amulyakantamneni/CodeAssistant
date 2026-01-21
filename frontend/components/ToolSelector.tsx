'use client';

import { Bug, Sparkles, Zap, TestTube, GitPullRequest } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const TOOLS = [
  {
    id: 'debug',
    name: 'Debugger',
    icon: Bug,
    bgColor: 'bg-orange-500',
    selectedBg: 'bg-orange-50 dark:bg-orange-900/30',
    selectedBorder: 'border-orange-200 dark:border-orange-700',
  },
  {
    id: 'refactor',
    name: 'Refactorizer',
    icon: Sparkles,
    bgColor: 'bg-pink-500',
    selectedBg: 'bg-pink-50 dark:bg-pink-900/30',
    selectedBorder: 'border-pink-200 dark:border-pink-700',
  },
  {
    id: 'optimize',
    name: 'Optimizer',
    icon: Zap,
    bgColor: 'bg-yellow-500',
    selectedBg: 'bg-yellow-50 dark:bg-yellow-900/30',
    selectedBorder: 'border-yellow-200 dark:border-yellow-700',
  },
  {
    id: 'test',
    name: 'Tester',
    icon: TestTube,
    bgColor: 'bg-teal-500',
    selectedBg: 'bg-teal-50 dark:bg-teal-900/30',
    selectedBorder: 'border-teal-200 dark:border-teal-700',
  },
  {
    id: 'pr',
    name: 'PR Generator',
    icon: GitPullRequest,
    bgColor: 'bg-purple-500',
    selectedBg: 'bg-purple-50 dark:bg-purple-900/30',
    selectedBorder: 'border-purple-200 dark:border-purple-700',
  },
];

interface ToolSelectorProps {
  selectedTools: string[];
  setSelectedTools: (tools: string[] | ((prev: string[]) => string[])) => void;
}

export function ToolSelector({
  selectedTools,
  setSelectedTools,
}: ToolSelectorProps) {
  const toggleTool = (toolId: string) => {
    setSelectedTools((prev: string[]) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    );
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {TOOLS.map((tool, index) => {
        const isSelected = selectedTools.includes(tool.id);
        const Icon = tool.icon;

        return (
          <motion.button
            key={tool.id}
            onClick={() => toggleTool(tool.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              scale: 1.05,
              y: -2,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              'pill-3d flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all font-medium',
              isSelected && 'active glow'
            )}
          >
            <motion.div
              className={cn('p-1.5 rounded-lg', tool.bgColor)}
              animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Icon className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-gray-800 dark:text-gray-200">{tool.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
