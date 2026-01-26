'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Zap, Shield, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { FeatureGrid } from '@/components/FeatureGrid';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const HERO_FEATURES = [
  { icon: Sparkles, text: 'Prompt-to-code generation' },
  { icon: Zap, text: 'Instant experiments & analytics' },
  { icon: Shield, text: 'Secure & Private' },
];

const HOME_FUNCTIONALITIES = [
  'Generate code from natural language prompts.',
  'Test, debug, and explain errors in plain English.',
  'Optimize, refactor, and convert legacy code.',
  'Integrate tools, manage APIs, and monitor performance.',
];

const RECOMMENDED_SDKS = [
  {
    name: 'PostHog',
    description: 'Feature flags, session replay, and product analytics in one.',
  },
  {
    name: 'Statsig',
    description: 'Experimentation, feature gates, and safe rollouts.',
  },
  {
    name: 'Plausible / GA4',
    description: 'Privacy-first web analytics or Google Analytics 4.',
  },
];

export default function HomePage() {
  return (
    <div className="cosmic-bg morph-bg overflow-hidden min-h-screen">
      {/* Floating Orbs - 3D Background Elements */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      <div className="relative z-10">
        <Header />

        <motion.main
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <section className="py-16 md:py-24">
            <motion.div className="text-center" variants={itemVariants}>
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Powered by Advanced AI
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="title-gradient neon-glow">
                  Ship Code Faster
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  with AI-Powered Tools
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Turn plain-English prompts into working code, then optimize,
                test, and ship with confidence. Run experiments, track analytics,
                and understand your users all in one powerful platform.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                variants={itemVariants}
              >
                <Link href="/generate">
                  <motion.button
                    className="hero-cta-primary flex items-center gap-2"
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Code className="w-5 h-5" />
                    Generate from a Prompt
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="#features">
                  <motion.button
                    className="hero-cta-secondary flex items-center gap-2"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View All Features
                  </motion.button>
                </Link>
              </motion.div>

              {/* Hero Features */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-6"
                variants={itemVariants}
              >
                {HERO_FEATURES.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <feature.icon className="w-5 h-5 text-primary-500" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* Home / Dashboard */}
          <section className="py-12" id="home-dashboard">
            <motion.div className="text-center mb-8" variants={itemVariants}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                <span className="title-gradient">Your AI Engineering HQ</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                One place to generate, test, optimize, and ship production-ready code with confidence.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
              <motion.div className="glass-card rounded-2xl p-6" variants={itemVariants}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  What you can do here
                </h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  {HOME_FUNCTIONALITIES.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div className="glass-card rounded-2xl p-6 flex flex-col justify-between" variants={itemVariants}>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Start a new task
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Kick off a fresh coding session or import an existing project to begin.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Link href="/session/new">
                    <motion.button
                      className="hero-cta-primary w-full flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sparkles className="w-4 h-4" />
                      Start New Task
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                  <Link href="/import">
                    <motion.button
                      className="hero-cta-secondary w-full flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Import Project
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Feature Grid Section */}
          <section id="features">
            <FeatureGrid />
          </section>

          {/* Recommended Tooling */}
          <motion.section
            className="py-10"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Recommended SDKs
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Best-in-class tooling if you want to plug in analytics fast.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RECOMMENDED_SDKS.map((sdk) => (
                <div key={sdk.name} className="glass-card rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {sdk.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {sdk.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Bottom CTA Section */}
          <motion.section
            className="py-16 text-center"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="title-gradient">Ready to Ship Faster?</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
                Join thousands of developers using AI Code Assistant to write better code,
                faster. No credit card required.
              </p>
              <Link href="/generate">
                <motion.button
                  className="hero-cta-primary flex items-center gap-2 mx-auto"
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="w-5 h-5" />
                  Try for Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.section>
        </motion.main>

        {/* Footer */}
        <footer className="border-t border-gray-200/50 dark:border-dark-700/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI Code Assistant - AI-Powered Development Tools
              </p>
              <div className="flex items-center gap-6">
                <Link
                  href="/contact"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/testing"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Testing
                </Link>
                <Link
                  href="/optimizer"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Optimizer
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
