'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  comingSoon?: boolean;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  gradient,
  comingSoon = false,
}: FeatureCardProps) {
  const CardContent = (
    <motion.div
      className={cn(
        'feature-card feature-card-glow group',
        comingSoon && 'cursor-default'
      )}
      style={{ '--card-glow-color': gradient } as React.CSSProperties}
      whileHover={comingSoon ? {} : { y: -8, scale: 1.02 }}
      whileTap={comingSoon ? {} : { scale: 0.98 }}
    >
      {/* Icon */}
      <div
        className={cn('feature-icon', gradient)}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>

      {/* Title with Coming Soon badge */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {comingSoon && (
          <span className="coming-soon-badge">Coming Soon</span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        {description}
      </p>

      {/* Learn More Link */}
      {!comingSoon && (
        <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:gap-2 transition-all">
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </motion.div>
  );

  if (comingSoon) {
    return CardContent;
  }

  return (
    <Link href={href}>
      {CardContent}
    </Link>
  );
}
