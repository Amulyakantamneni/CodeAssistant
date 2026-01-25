'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ToggleLeft,
  PlayCircle,
  Bell,
  Check,
  ChevronRight,
  Users,
  Target,
  Shield,
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

const FEATURE_FLAGS_BENEFITS = [
  { icon: Shield, text: 'Zero-risk deployments' },
  { icon: Users, text: 'Gradual rollouts' },
  { icon: Target, text: 'Targeted releases' },
];

const SESSION_REPLAY_BENEFITS = [
  { icon: PlayCircle, text: 'Watch real user sessions' },
  { icon: Target, text: 'Identify friction points' },
  { icon: Check, text: 'Debug issues faster' },
];

export default function TestingPage() {
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
              <span className="text-2xl">🧪</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Experimentation & Control
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="title-gradient neon-glow">Feature Flags</span>
              <br />
              <span className="text-gray-900 dark:text-white">& Session Replay</span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ship with confidence. Control feature rollouts and watch how users
              interact with your product in real-time.
            </p>
          </motion.section>

          {/* Feature Flags Section */}
          <motion.section className="mb-16" variants={itemVariants}>
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="feature-icon bg-gradient-to-br from-emerald-500 to-teal-600 mb-6">
                    <ToggleLeft className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Feature Flags
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Ship faster with zero risk. Toggle features on/off instantly
                    without new deployments. Control who sees what with powerful
                    targeting rules.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {FEATURE_FLAGS_BENEFITS.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                          <benefit.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span>{benefit.text}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="coming-soon-badge">Coming Soon</span>
                </div>

                {/* Preview Card */}
                <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                  <div className="space-y-4">
                    {['Dark Mode', 'New Checkout Flow', 'AI Assistant'].map((flag, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-dark-800 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-emerald-500' : index === 1 ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                          <span className="font-medium text-gray-900 dark:text-white">{flag}</span>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative ${index === 0 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${index === 0 ? 'right-1' : 'left-1'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Session Replay Section */}
          <motion.section className="mb-16" variants={itemVariants}>
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Preview Card */}
                <div className="order-2 md:order-1 glass-card rounded-2xl p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
                  <div className="aspect-video bg-white dark:bg-dark-800 rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center">
                        <PlayCircle className="w-10 h-10 text-pink-500" />
                      </div>
                    </div>
                    {/* Fake browser chrome */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 dark:bg-dark-700 flex items-center px-3 gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 h-4 bg-white dark:bg-dark-600 rounded ml-2" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Session #1234</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">2:34 / 5:12</span>
                  </div>
                </div>

                <div className="order-1 md:order-2">
                  <div className="feature-icon bg-gradient-to-br from-pink-500 to-rose-600 mb-6">
                    <PlayCircle className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Session Replay
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    See what your users see. Watch real user sessions to identify
                    friction points, debug issues, and understand how people actually
                    use your product.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {SESSION_REPLAY_BENEFITS.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center">
                          <benefit.icon className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                        </div>
                        <span>{benefit.text}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="coming-soon-badge">Coming Soon</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Email Signup Section */}
          <motion.section className="text-center" variants={itemVariants}>
            <div className="glass-card rounded-3xl p-8 md:p-12 max-w-2xl mx-auto">
              <Bell className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Get Notified When We Launch
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Be the first to know when Feature Flags and Session Replay are available.
                We&apos;ll send you early access.
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
                    Notify Me
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
