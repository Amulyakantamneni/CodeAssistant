'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Languages, ArrowRight, Copy, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin'
];

export default function LanguageConverterPage() {
  const [sourceCode, setSourceCode] = useState('');
  const [sourceLang, setSourceLang] = useState('JavaScript');
  const [targetLang, setTargetLang] = useState('Python');
  const [convertedCode, setConvertedCode] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async () => {
    if (!sourceCode.trim()) return;
    setIsConverting(true);
    setTimeout(() => {
      if (targetLang === 'Python') {
        setConvertedCode(`# Converted from ${sourceLang} to ${targetLang}

from typing import List, Optional
from dataclasses import dataclass


@dataclass
class User:
    id: str
    name: str
    email: str
    age: Optional[int] = None


def find_users_by_age(users: List[User], min_age: int) -> List[User]:
    """
    Filter users by minimum age.

    Args:
        users: List of user objects
        min_age: Minimum age threshold

    Returns:
        List of users who meet the age requirement
    """
    return [user for user in users if user.age and user.age >= min_age]


def get_user_emails(users: List[User]) -> List[str]:
    """Extract email addresses from user list."""
    return [user.email for user in users]`);
      } else {
        setConvertedCode(`// Converted from ${sourceLang} to ${targetLang}

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}

function findUsersByAge(users: User[], minAge: number): User[] {
  return users.filter(user => user.age && user.age >= minAge);
}

function getUserEmails(users: User[]): string[] {
  return users.map(user => user.email);
}`);
      }
      setIsConverting(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Language Converter"
        description="Convert code between programming languages"
        icon={Languages}
        iconColor="from-indigo-500 to-purple-600"
      />

      {/* Language Selection */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From
          </label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <ArrowRight className="w-6 h-6 text-gray-400 mt-6" />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To
          </label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            {LANGUAGES.filter((l) => l !== sourceLang).map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {sourceLang} Code
          </label>
          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            placeholder={`Paste your ${sourceLang} code here...`}
            className="w-full h-96 px-4 py-3 rounded-xl bg-gray-900 text-gray-300 font-mono text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
          <motion.button
            onClick={handleConvert}
            disabled={!sourceCode.trim() || isConverting}
            className="mt-4 hero-cta-primary flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Languages className="w-5 h-5" />
            {isConverting ? 'Converting...' : `Convert to ${targetLang}`}
          </motion.button>
        </div>

        {/* Target */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {targetLang} Code
            </label>
            {convertedCode && (
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-500">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-500">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="bg-gray-900 rounded-xl p-4 h-96 overflow-y-auto">
            {convertedCode ? (
              <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                {convertedCode}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Converted code will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
