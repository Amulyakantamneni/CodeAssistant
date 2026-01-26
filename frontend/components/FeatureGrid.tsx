'use client';

import { motion } from 'framer-motion';
import {
  ToggleLeft,
  FlaskConical,
  BarChart3,
  Globe,
  Server,
  PlayCircle,
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const FEATURE_CATEGORIES = [
  {
    id: 'experimentation',
    title: 'Experimentation & Control',
    emoji: '🧪',
    features: [
      {
        id: 'feature-flags',
        title: 'Feature Flags',
        description: 'Ship faster with zero risk. Toggle features on/off instantly without new deployments.',
        icon: ToggleLeft,
        gradient: 'tool-accent',
        href: '/testing',
        comingSoon: true,
      },
      {
        id: 'marketing-experiments',
        title: 'Marketing Experiments',
        description: 'Run A/B tests on landing pages and copy to maximize your conversion rates.',
        icon: FlaskConical,
        gradient: 'tool-accent',
        href: '/optimizer',
        comingSoon: true,
      },
    ],
  },
  {
    id: 'analytics',
    title: 'Deep Analytics',
    emoji: '📊',
    features: [
      {
        id: 'product-analytics',
        title: 'Product Analytics',
        description: 'Understand user behavior. Track events, funnels, and retention in real-time.',
        icon: BarChart3,
        gradient: 'tool-accent',
        href: '/optimizer',
        comingSoon: true,
      },
      {
        id: 'web-analytics',
        title: 'Web Analytics',
        description: 'Privacy-first tracking for your site traffic and acquisition channels.',
        icon: Globe,
        gradient: 'tool-accent',
        href: '/optimizer',
        comingSoon: true,
      },
      {
        id: 'infra-analytics',
        title: 'Infra Analytics',
        description: 'Monitor backend performance, latency, and API health alongside user data.',
        icon: Server,
        gradient: 'tool-accent',
        href: '/optimizer',
        comingSoon: true,
      },
    ],
  },
  {
    id: 'user-experience',
    title: 'User Experience',
    emoji: '🔍',
    features: [
      {
        id: 'session-replay',
        title: 'Session Replay',
        description: 'See what your users see. Identify friction points by watching real user sessions.',
        icon: PlayCircle,
        gradient: 'tool-accent',
        href: '/testing',
        comingSoon: true,
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

export function FeatureGrid() {
  return (
    <motion.section
      className="py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      <motion.div className="text-center mb-12" variants={itemVariants}>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="title-gradient">Experimentation &amp; Insights</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Run experiments, track performance, and understand users in one clean,
          developer-friendly platform.
        </p>
      </motion.div>

      {FEATURE_CATEGORIES.map((category) => (
        <motion.div key={category.id} className="mb-12" variants={itemVariants}>
          {/* Category Header */}
          <div className="section-header mb-6">
            <span className="section-emoji">{category.emoji}</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {category.title}
            </h3>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.features.map((feature, index) => (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                custom={index}
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  href={feature.href}
                  gradient={feature.gradient}
                  comingSoon={feature.comingSoon}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
}
