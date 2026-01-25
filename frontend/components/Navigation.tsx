'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Cpu,
  Home,
  Sparkles,
  TestTube,
  BarChart3,
  Moon,
  Sun,
  Menu,
  Mail,
  LucideIcon,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  highlighted?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    label: 'Generate Code',
    href: '/generate',
    icon: Sparkles,
    highlighted: true,
  },
  {
    label: 'Testing',
    href: '/testing',
    icon: TestTube,
  },
  {
    label: 'Optimizer',
    href: '/optimizer',
    icon: BarChart3,
  },
  {
    label: 'Contact Us',
    href: '/contact',
    icon: Mail,
  },
];

// Flatten nav items for mobile menu
const MOBILE_NAV_ITEMS = NAV_ITEMS.map(item => ({
  label: item.label,
  href: item.href || '/',
  icon: item.icon,
  highlighted: item.highlighted,
}));

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50" ref={navRef}>
        <div className="glass-nav">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                <motion.div
                  className="p-1.5 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg shadow-sm ring-1 ring-white/40"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Cpu className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors hidden sm:inline">
                  AI Code Assistant
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden xl:flex items-center gap-0.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.href ? pathname === item.href : false;

                  if (item.highlighted) {
                    return (
                      <Link key={item.label} href={item.href!}>
                        <motion.span
                          className="nav-link-highlighted flex items-center gap-1.5 mx-1"
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </motion.span>
                      </Link>
                    );
                  }

                  return (
                    <Link key={item.label} href={item.href!}>
                      <motion.span
                        className={cn(
                          'nav-link flex items-center gap-1',
                          isActive && 'nav-link-active'
                        )}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="hidden 2xl:inline">{item.label}</span>
                      </motion.span>
                    </Link>
                  );
                })}
              </nav>

              {/* Right Side: CTA + Theme Toggle + Mobile Menu */}
              <div className="flex items-center gap-2">
                {/* Try for Free CTA */}
                <Link href="/generate" className="block">
                  <motion.button
                    className="cta-button cta-pulse flex items-center gap-2 text-xs sm:text-sm"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Try for Free
                  </motion.button>
                </Link>

                {/* Theme Toggle */}
                <motion.button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
                  aria-label="Toggle dark mode"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </motion.button>

                {/* Mobile Menu Toggle */}
                <motion.button
                  onClick={() => setMobileMenuOpen(true)}
                  className="xl:hidden p-2 rounded-lg hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
                  aria-label="Open menu"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={MOBILE_NAV_ITEMS}
      />
    </>
  );
}
