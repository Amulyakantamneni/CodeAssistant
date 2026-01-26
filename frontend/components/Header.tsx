'use client';

import Link from 'next/link';
import { Moon, Sun, Cpu, Mail, Home, Sparkles, BarChart3, TestTube, UserPlus } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg shadow-sm ring-1 ring-white/40">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              AI Code Assistant
            </span>
          </div>

          <nav className="hidden xl:flex items-center gap-4">
            <Link href="/" className="nav-link flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link href="/generate" className="nav-link-highlighted flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generate
            </Link>
            <Link href="/optimizer" className="nav-link flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Optimizer
            </Link>
            <Link href="/testing" className="nav-link flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Tester
            </Link>
            <Link href="/contact" className="nav-link flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/signup"
              className="cta-button flex items-center gap-2 text-xs sm:text-sm"
              aria-label="Sign up"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Link>
            <a
              href="mailto:hello@codeassistant.ai"
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
              aria-label="Contact us"
            >
              <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </a>

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
