'use client';

import { cn } from '@/lib/utils';

type ConsoleLevel = 'info' | 'success' | 'warning' | 'error';

export interface ConsoleLog {
  id: string;
  time: string;
  level: ConsoleLevel;
  message: string;
}

const LEVEL_STYLES: Record<ConsoleLevel, { label: string; color: string }> = {
  info: { label: 'INFO', color: 'text-blue-600 dark:text-blue-400' },
  success: { label: 'OK', color: 'text-green-600 dark:text-green-400' },
  warning: { label: 'WARN', color: 'text-yellow-600 dark:text-yellow-400' },
  error: { label: 'ERR', color: 'text-red-600 dark:text-red-400' },
};

interface OutputConsoleProps {
  logs: ConsoleLog[];
  onClear: () => void;
}

export function OutputConsole({ logs, onClear }: OutputConsoleProps) {
  return (
    <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg border border-gray-200/60 dark:border-dark-700/60 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Output Console</h3>
        <button
          onClick={onClear}
          className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Clear
        </button>
      </div>
      <div className="max-h-56 overflow-y-auto rounded-xl bg-gray-50 dark:bg-dark-900/40 border border-gray-200/60 dark:border-dark-700/60 p-3 font-mono text-xs">
        {logs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Console is empty.</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3">
                <span className="text-gray-400 w-16 shrink-0">{log.time}</span>
                <span className={cn('w-10 shrink-0 font-semibold', LEVEL_STYLES[log.level].color)}>
                  {LEVEL_STYLES[log.level].label}
                </span>
                <span className="text-gray-700 dark:text-gray-200">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
