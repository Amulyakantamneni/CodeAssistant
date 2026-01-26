'use client';

import { ReactNode } from 'react';
import { Navigation } from '../Navigation';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
  showBackground?: boolean;
}

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function DashboardLayout({ children, showBackground = true }: DashboardLayoutProps) {
  return (
    <div className={showBackground ? 'cosmic-bg morph-bg min-h-screen' : 'min-h-screen bg-gray-50 dark:bg-dark-900'}>
      {/* Floating Orbs - Background Elements */}
      {showBackground && (
        <>
          <div className="floating-orb floating-orb-1" />
          <div className="floating-orb floating-orb-2" />
          <div className="floating-orb floating-orb-3" />
        </>
      )}

      <div className="relative z-10">
        <Navigation />

        <motion.main
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
