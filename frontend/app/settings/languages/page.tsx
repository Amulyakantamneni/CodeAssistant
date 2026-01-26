'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Check, Star } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const LANGUAGES = [
  { id: 'typescript', name: 'TypeScript', category: 'JavaScript' },
  { id: 'javascript', name: 'JavaScript', category: 'JavaScript' },
  { id: 'python', name: 'Python', category: 'Backend' },
  { id: 'java', name: 'Java', category: 'Backend' },
  { id: 'go', name: 'Go', category: 'Backend' },
  { id: 'rust', name: 'Rust', category: 'Systems' },
  { id: 'csharp', name: 'C#', category: 'Backend' },
  { id: 'cpp', name: 'C++', category: 'Systems' },
  { id: 'ruby', name: 'Ruby', category: 'Backend' },
  { id: 'php', name: 'PHP', category: 'Backend' },
  { id: 'swift', name: 'Swift', category: 'Mobile' },
  { id: 'kotlin', name: 'Kotlin', category: 'Mobile' },
];

const FRAMEWORKS = [
  { id: 'react', name: 'React', language: 'TypeScript' },
  { id: 'nextjs', name: 'Next.js', language: 'TypeScript' },
  { id: 'vue', name: 'Vue.js', language: 'TypeScript' },
  { id: 'angular', name: 'Angular', language: 'TypeScript' },
  { id: 'express', name: 'Express', language: 'JavaScript' },
  { id: 'fastapi', name: 'FastAPI', language: 'Python' },
  { id: 'django', name: 'Django', language: 'Python' },
  { id: 'flask', name: 'Flask', language: 'Python' },
  { id: 'spring', name: 'Spring Boot', language: 'Java' },
  { id: 'rails', name: 'Ruby on Rails', language: 'Ruby' },
];

export default function LanguagesPage() {
  const [defaultLanguage, setDefaultLanguage] = useState('typescript');
  const [favoriteFrameworks, setFavoriteFrameworks] = useState(['react', 'nextjs', 'fastapi']);

  const toggleFramework = (id: string) => {
    setFavoriteFrameworks((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Language Preferences"
        description="Set your default coding languages and frameworks"
        icon={Code2}
        iconColor="from-green-500 to-emerald-600"
      />

      {/* Default Language */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Default Language
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {LANGUAGES.map((lang) => (
            <motion.button
              key={lang.id}
              onClick={() => setDefaultLanguage(lang.id)}
              className={`p-3 rounded-xl text-center transition-all ${
                defaultLanguage === lang.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                  : 'glass-card hover:border-primary-300 dark:hover:border-primary-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-medium text-gray-900 dark:text-white text-sm">
                {lang.name}
              </span>
              {defaultLanguage === lang.id && (
                <Check className="w-4 h-4 text-primary-500 mx-auto mt-1" />
              )}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Favorite Frameworks */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Favorite Frameworks
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Select frameworks to show them first in boilerplate generation
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {FRAMEWORKS.map((fw) => {
            const isFavorite = favoriteFrameworks.includes(fw.id);
            return (
              <motion.button
                key={fw.id}
                onClick={() => toggleFramework(fw.id)}
                className={`p-4 rounded-xl text-left transition-all ${
                  isFavorite
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500'
                    : 'glass-card hover:border-gray-300 dark:hover:border-dark-500'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {fw.name}
                  </span>
                  {isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                </div>
                <span className="text-xs text-gray-500">{fw.language}</span>
              </motion.button>
            );
          })}
        </div>
      </section>
    </DashboardLayout>
  );
}
