'use client';

import { Moon, Sun, Code2, MessageCircle } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">Code Assistant</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
              aria-label="Messages"
            >
              <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
