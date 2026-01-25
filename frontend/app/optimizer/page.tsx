'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Globe,
  Server,
  FlaskConical,
  Bell,
  Check,
  ChevronRight,
  TrendingUp,
  Eye,
  Zap,
} from 'lucide-react';
import { Header } from '@/components/Header';

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

const ANALYTICS_FEATURES = [
  {
    icon: BarChart3,
    title: 'Product Analytics',
    description: 'Track events, funnels, and retention in real-time.',
    gradient: 'from-blue-500 to-cyan-600',
    stats: [
      { label: 'Events', value: '2.4M' },
      { label: 'Users', value: '45K' },
      { label: 'Retention', value: '78%' },
    ],
  },
  {
    icon: Globe,
    title: 'Web Analytics',
    description: 'Privacy-first tracking for traffic and acquisition.',
    gradient: 'from-orange-500 to-amber-600',
    stats: [
      { label: 'Visitors', value: '128K' },
      { label: 'Bounce', value: '32%' },
      { label: 'Avg Time', value: '4:23' },
    ],
  },
  {
    icon: Server,
    title: 'Infra Analytics',
    description: 'Monitor performance, latency, and API health.',
    gradient: 'from-slate-500 to-gray-600',
    stats: [
      { label: 'Uptime', value: '99.9%' },
      { label: 'P99', value: '124ms' },
      { label: 'Errors', value: '0.02%' },
    ],
  },
];

const EXPERIMENT_BENEFITS = [
  { icon: TrendingUp, text: 'Data-driven decisions' },
  { icon: Eye, text: 'Statistical significance' },
  { icon: Zap, text: 'Fast iteration cycles' },
];

export default function OptimizerPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="cosmic-bg morph-bg overflow-hidden min-h-screen">
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      <div className="relative z-10">
        <Header />

        <motion.main
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.section className="text-center mb-16" variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <span className="text-2xl">📊</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Analytics & Optimization
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="title-gradient neon-glow">Deep Analytics</span>
              <br />
              <span className="text-gray-900 dark:text-white">& Marketing Experiments</span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Understand your users, optimize your funnels, and run experiments
              to maximize conversions. All in one unified platform.
            </p>
          </motion.section>

          {/* Analytics Cards Section */}
          <motion.section className="mb-16" variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">
              Comprehensive Analytics Suite
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {ANALYTICS_FEATURES.map((feature, index) => (
                <motion.div
                  key={index}
                  className="glass-card rounded-2xl p-6"
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className={`feature-icon bg-gradient-to-br ${feature.gradient} mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {feature.description}
                  </p>

                  {/* Stats Preview */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200/50 dark:border-dark-600/50">
                    {feature.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <span className="coming-soon-badge">Coming Soon</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Marketing Experiments Section */}
          <motion.section className="mb-16" variants={itemVariants}>
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="feature-icon bg-gradient-to-br from-purple-500 to-indigo-600 mb-6">
                    <FlaskConical className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Marketing Experiments
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Run A/B tests on landing pages, copy, and CTAs to maximize
                    your conversion rates. Make data-driven decisions with
                    statistical confidence.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {EXPERIMENT_BENEFITS.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                          <benefit.icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span>{benefit.text}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="coming-soon-badge">Coming Soon</span>
                </div>

                {/* Preview Card */}
                <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      CTA Button Test
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400">
                      Running
                    </span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: 'Variant A', conversion: 3.2, visitors: 12453, winner: false },
                      { name: 'Variant B', conversion: 4.8, visitors: 12441, winner: true },
                    ].map((variant, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl ${variant.winner ? 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30' : 'bg-white dark:bg-dark-800'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {variant.name}
                            {variant.winner && (
                              <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                                Winner!
                              </span>
                            )}
                          </span>
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {variant.conversion}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>{variant.visitors.toLocaleString()} visitors</span>
                          <span>+{(variant.conversion * 0.1).toFixed(1)}% vs control</span>
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 dark:bg-dark-600 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${variant.winner ? 'bg-green-500' : 'bg-gray-400'}`}
                            style={{ width: `${variant.conversion * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Email Signup Section */}
          <motion.section className="text-center" variants={itemVariants}>
            <div className="glass-card rounded-3xl p-8 md:p-12 max-w-2xl mx-auto">
              <Bell className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Get Early Access
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Be among the first to try our analytics and experimentation platform.
                Sign up for early access and updates.
              </p>

              {isSubmitted ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Thanks! We&apos;ll be in touch.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="email-capture max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  <button type="submit" className="flex items-center gap-2">
                    Get Access
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </motion.section>
        </motion.main>

        {/* Footer */}
        <footer className="border-t border-gray-200/50 dark:border-dark-700/50 mt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              AI Code Assistant - AI-Powered Development Tools
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
