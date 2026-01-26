'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  highlighted?: boolean;
  subItems?: { label: string; href: string }[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

const menuVariants = {
  closed: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const overlayVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: 20 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05 + 0.1,
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>([]);

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setOpenSections([]);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleSection = (label: string) => {
    setOpenSections((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="mobile-menu-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-sm z-50 glass-menu"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-dark-700/50">
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  Menu
                </span>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
                  aria-label="Close menu"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isOpen = openSections.includes(item.label);

                  return (
                    <motion.div
                      key={item.href}
                      custom={index}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Link href={item.href} onClick={onClose} className="flex-1">
                          <span
                            className={cn(
                              'mobile-nav-link flex items-center gap-3',
                              isActive && 'mobile-nav-link-active',
                              item.highlighted && 'mobile-nav-link-highlighted'
                            )}
                          >
                            <Icon className="w-5 h-5" />
                            {item.label}
                          </span>
                        </Link>
                        {hasSubItems && (
                          <button
                            type="button"
                            onClick={() => toggleSection(item.label)}
                            className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                            aria-label={`Toggle ${item.label} submenu`}
                          >
                            <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
                          </button>
                        )}
                      </div>

                      {hasSubItems && isOpen && (
                        <div className="ml-10 mt-2 space-y-1">
                          {item.subItems!.map((subItem) => (
                            <Link key={subItem.href} href={subItem.href} onClick={onClose}>
                              <span className="mobile-nav-link block text-sm">
                                {subItem.label}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </nav>

              {/* CTA Button */}
              <div className="p-4 border-t border-gray-200/50 dark:border-dark-700/50">
                <motion.div
                  custom={navItems.length}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                >
                  <Link href="/signup" onClick={onClose}>
                    <motion.button
                      className="w-full cta-button flex items-center justify-center gap-2 py-3"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Sparkles className="w-5 h-5" />
                      Sign Up
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
