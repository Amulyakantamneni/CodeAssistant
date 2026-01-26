'use client';

import { Bug, Sparkles, Zap, TestTube, GitPullRequest } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const TOOLS = [
  {
    id: 'debug',
    name: 'Debugger',
    icon: Bug,
    bgColor: 'tool-blue-bg',
  },
  {
    id: 'refactor',
    name: 'Refactorizer',
    icon: Sparkles,
    bgColor: 'tool-blue-bg',
  },
  {
    id: 'optimize',
    name: 'Optimizer',
    icon: Zap,
    bgColor: 'tool-blue-bg',
  },
  {
    id: 'test',
    name: 'Tester',
    icon: TestTube,
    bgColor: 'tool-blue-bg',
  },
  {
    id: 'pr',
    name: 'PR Generator',
    icon: GitPullRequest,
    bgColor: 'tool-blue-bg',
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
              'pill-3d tool-pill flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all font-medium spotlight',
              isSelected && 'active soft-glow'
            )}
          >
            <motion.div
              className={cn('p-1.5 rounded-lg icon-3d', tool.bgColor)}
              animate={isSelected ? { scale: [1, 1.15, 1], rotate: [0, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Icon className="w-4 h-4 text-white" />
            </motion.div>
            <span className="tool-blue-text">{tool.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
