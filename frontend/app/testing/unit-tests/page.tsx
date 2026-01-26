'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Play, Copy, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const TEST_FRAMEWORKS = [
  { id: 'jest', name: 'Jest', lang: 'JavaScript/TypeScript' },
  { id: 'pytest', name: 'PyTest', lang: 'Python' },
  { id: 'vitest', name: 'Vitest', lang: 'JavaScript/TypeScript' },
  { id: 'mocha', name: 'Mocha', lang: 'JavaScript' },
  { id: 'go-test', name: 'Go Test', lang: 'Go' },
  { id: 'rspec', name: 'RSpec', lang: 'Ruby' },
];

export default function UnitTestsPage() {
  const [code, setCode] = useState('');
  const [framework, setFramework] = useState('jest');
  const [generatedTests, setGeneratedTests] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!code.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedTests(`import { describe, it, expect, beforeEach } from 'jest';
import { UserService } from './user-service';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      const userData = { name: 'John', email: 'john@example.com' };
      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.name).toBe('John');
      expect(user.email).toBe('john@example.com');
    });

    it('should throw error for invalid email', async () => {
      const userData = { name: 'John', email: 'invalid-email' };

      await expect(userService.createUser(userData))
        .rejects.toThrow('Invalid email format');
    });
  });

  describe('getUser', () => {
    it('should return user by id', async () => {
      const user = await userService.getUser('123');
      expect(user.id).toBe('123');
    });

    it('should return null for non-existent user', async () => {
      const user = await userService.getUser('999');
      expect(user).toBeNull();
    });
  });
});`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Unit Test Generator"
        description="Generate comprehensive unit tests for your code"
        icon={FlaskConical}
        iconColor="from-green-500 to-emerald-600"
      />

      {/* Framework Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Test Framework
        </label>
        <div className="flex flex-wrap gap-2">
          {TEST_FRAMEWORKS.map((fw) => (
            <button
              key={fw.id}
              onClick={() => setFramework(fw.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                framework === fw.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
              }`}
            >
              {fw.name}
              <span className="ml-1 text-xs opacity-70">({fw.lang})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Code to Test
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste the code you want to generate tests for..."
            className="w-full h-96 px-4 py-3 rounded-xl bg-gray-900 text-gray-300 font-mono text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
          <motion.button
            onClick={handleGenerate}
            disabled={!code.trim() || isGenerating}
            className="mt-4 hero-cta-primary flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5" />
            {isGenerating ? 'Generating Tests...' : 'Generate Unit Tests'}
          </motion.button>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Tests
            </label>
            {generatedTests && (
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
            {generatedTests ? (
              <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                {generatedTests}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Generated tests will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
