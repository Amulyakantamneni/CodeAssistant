'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Home,
  Sparkles,
  TestTube,
  BarChart3,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  Wrench,
  Activity,
  User,
  Settings,
  Code,
  FileCode,
  Database,
  FileText,
  Bug,
  AlertTriangle,
  Shield,
  FlaskConical,
  Zap,
  Paintbrush,
  Languages,
  GitBranch,
  Gauge,
  RefreshCw,
  Monitor,
  Key,
  Terminal,
  Server,
  LineChart,
  FolderOpen,
  Plus,
  Upload,
  LucideIcon,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

interface NavSubItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  highlighted?: boolean;
  subItems?: NavSubItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
    subItems: [
      { label: 'Overview', href: '/', description: 'Platform overview', icon: FolderOpen },
      { label: 'New Session', href: '/session/new', description: 'Start a fresh coding task', icon: Plus },
      { label: 'Import Project', href: '/import', description: 'Connect GitHub or upload files', icon: Upload },
    ],
  },
  {
    label: 'Generate',
    href: '/generate',
    icon: Sparkles,
    highlighted: true,
    subItems: [
      { label: 'Text-to-Code', href: '/generate', description: 'Natural language prompting', icon: Code },
      { label: 'Boilerplate Generator', href: '/generate/boilerplate', description: 'React, Python, Django setup', icon: FileCode },
      { label: 'Snippet Library', href: '/generate/snippets', description: 'Save and reuse patterns', icon: Database },
      { label: 'SQL/Query Builder', href: '/generate/sql', description: 'Database code generation', icon: Database },
      { label: 'Documentation', href: '/generate/docs', description: 'README and docstrings', icon: FileText },
    ],
  },
  {
    label: 'Test & Debug',
    href: '/testing',
    icon: TestTube,
    subItems: [
      { label: 'Unit Test Generator', href: '/testing/unit-tests', description: 'Jest, PyTest, and more', icon: FlaskConical },
      { label: 'Bug Hunter', href: '/testing/bug-hunter', description: 'Find logical errors', icon: Bug },
      { label: 'Error Explainer', href: '/testing/error-explainer', description: 'Stack trace analysis', icon: AlertTriangle },
      { label: 'Security Audit', href: '/testing/security', description: 'Vulnerability scanning', icon: Shield },
      { label: 'A/B Testing', href: '/testing', description: 'Run experiments', icon: FlaskConical },
    ],
  },
  {
    label: 'Optimize',
    href: '/optimizer',
    icon: BarChart3,
    subItems: [
      { label: 'Efficiency Analysis', href: '/optimizer/efficiency', description: 'Algorithm optimization', icon: Zap },
      { label: 'Clean Code', href: '/optimizer/clean-code', description: 'Code standards', icon: Paintbrush },
      { label: 'Language Converter', href: '/optimizer/convert', description: 'Port to other languages', icon: Languages },
      { label: 'Complexity Check', href: '/optimizer/complexity', description: 'Cyclomatic complexity', icon: GitBranch },
      { label: 'Performance Tuning', href: '/optimizer', description: 'Faster execution', icon: Gauge },
      { label: 'Legacy Converter', href: '/optimizer/legacy', description: 'Modernize old code', icon: RefreshCw },
    ],
  },
  {
    label: 'Tools',
    href: '/tools',
    icon: Wrench,
    subItems: [
      { label: 'Environment Settings', href: '/tools/environment', description: 'IDE extensions config', icon: Monitor },
      { label: 'API Management', href: '/tools/api-keys', description: 'Manage API keys', icon: Key },
      { label: 'Terminal/CLI', href: '/tools/terminal', description: 'Sandbox command line', icon: Terminal },
    ],
  },
  {
    label: 'Monitoring',
    href: '/monitoring',
    icon: Activity,
    subItems: [
      { label: 'Uptime Dashboard', href: '/monitoring/uptime', description: 'Service status', icon: Server },
      { label: 'Lighthouse', href: '/monitoring/lighthouse', description: 'Performance scores', icon: LineChart },
    ],
  },
];

// Flatten nav items for mobile menu
const MOBILE_NAV_ITEMS = NAV_ITEMS.map(item => ({
  label: item.label,
  href: item.href || '/',
  icon: item.icon,
  highlighted: item.highlighted,
  subItems: item.subItems?.map(sub => ({ label: sub.label, href: sub.href })),
}));

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    transition: { duration: 0.15 },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

function NavDropdown({
  item,
  isOpen,
  isActive,
  onToggle,
}: {
  item: NavItem;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative flex items-center">
      <Link href={item.href || '/'}>
        <motion.span
          className={cn(
            item.highlighted ? 'nav-link-highlighted' : 'nav-link',
            item.highlighted ? 'flex items-center gap-1.5 mx-1' : 'flex items-center gap-1',
            isActive && !item.highlighted && 'nav-link-active'
          )}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
        </motion.span>
      </Link>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'ml-1 p-1.5 rounded-lg transition-colors',
          item.highlighted ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
        )}
        aria-label={`Toggle ${item.label} menu`}
      >
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && item.subItems && (
          <motion.div
            className="dropdown-menu simple-menu"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="dropdown-content">
              <div className="dropdown-items">
                {item.subItems.map((subItem) => {
                  const SubIcon = subItem.icon;
                  return (
                    <Link key={subItem.href} href={subItem.href} onClick={onToggle}>
                      <motion.div className="dropdown-item" whileHover={{ x: 4 }}>
                        {SubIcon && (
                          <div className="dropdown-item-icon">
                            <SubIcon className="w-4 h-4" />
                          </div>
                        )}
                        <div className="dropdown-item-content">
                          <span className="dropdown-item-label">{subItem.label}</span>
                          {subItem.description && (
                            <span className="dropdown-item-desc">{subItem.description}</span>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

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
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider leading-none">
                    Code
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
                    AI Code Assistant
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + '/') : false;

                  if (item.subItems && item.subItems.length > 0) {
                    return (
                      <NavDropdown
                        key={item.label}
                        item={item}
                        isOpen={openDropdown === item.label}
                        isActive={isActive}
                        onToggle={() => toggleDropdown(item.label)}
                      />
                    );
                  }

                  return (
                    <Link key={item.label} href={item.href!}>
                      <motion.span
                        className={cn(
                          item.highlighted ? 'nav-link-highlighted' : 'nav-link',
                          item.highlighted ? 'flex items-center gap-1.5 mx-1' : 'flex items-center gap-1',
                          isActive && !item.highlighted && 'nav-link-active'
                        )}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </motion.span>
                    </Link>
                  );
                })}
              </nav>

              {/* Right Side: User, Settings, Theme Toggle, Mobile Menu */}
              <div className="flex items-center gap-1">
                {/* User Icon */}
                <Link href="/settings/account">
                  <motion.button
                    className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
                    aria-label="Account"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </motion.button>
                </Link>

                {/* Settings Icon */}
                <Link href="/settings">
                  <motion.button
                    className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
                    aria-label="Settings"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
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

                {/* Sign Up Button (Desktop) */}
                <Link href="/signup" className="hidden lg:block ml-2">
                  <motion.button
                    className="cta-button text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up
                  </motion.button>
                </Link>

                {/* Mobile Menu Button */}
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
