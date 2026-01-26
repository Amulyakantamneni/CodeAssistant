'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ArrowRight, Copy, Download, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const CONVERSIONS = [
  { id: 'py2-py3', from: 'Python 2', to: 'Python 3' },
  { id: 'jquery-vanilla', from: 'jQuery', to: 'Vanilla JS' },
  { id: 'class-hooks', from: 'React Class', to: 'React Hooks' },
  { id: 'callback-async', from: 'Callbacks', to: 'Async/Await' },
  { id: 'commonjs-esm', from: 'CommonJS', to: 'ES Modules' },
];

export default function LegacyConverterPage() {
  const [code, setCode] = useState('');
  const [conversionType, setConversionType] = useState('py2-py3');
  const [convertedCode, setConvertedCode] = useState('');
  const [changes, setChanges] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async () => {
    if (!code.trim()) return;
    setIsConverting(true);
    setTimeout(() => {
      if (conversionType === 'class-hooks') {
        setConvertedCode(`import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}`);
        setChanges([
          'Converted class component to functional component',
          'Replaced this.state with useState hooks',
          'Converted componentDidMount to useEffect',
          'Removed constructor and binding',
          'Updated render() to direct return',
        ]);
      } else {
        setConvertedCode(`# Python 3 version

from typing import List, Dict, Optional

def process_data(items: List[Dict]) -> Dict:
    """Process a list of items and return summary."""
    result = {}

    for item in items:
        key = item.get('name', 'unknown')
        value = item.get('value', 0)
        result[key] = value

    return result

def main():
    data = [
        {'name': 'item1', 'value': 10},
        {'name': 'item2', 'value': 20},
    ]

    result = process_data(data)
    print(f"Processed {len(result)} items")

if __name__ == '__main__':
    main()`);
        setChanges([
          'Updated print statements to print() function',
          'Added type hints for better code quality',
          'Replaced dict.has_key() with "in" operator',
          'Updated string formatting to f-strings',
          'Added if __name__ guard',
        ]);
      }
      setIsConverting(false);
    }, 2000);
  };

  const currentConversion = CONVERSIONS.find((c) => c.id === conversionType);

  return (
    <DashboardLayout>
      <PageHeader
        title="Legacy Converter"
        description="Modernize old code patterns and migrate to newer syntax"
        icon={RefreshCw}
        iconColor="from-teal-500 to-cyan-600"
      />

      {/* Conversion Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Conversion Type
        </label>
        <div className="flex flex-wrap gap-3">
          {CONVERSIONS.map((conv) => (
            <motion.button
              key={conv.id}
              onClick={() => setConversionType(conv.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                conversionType === conv.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {conv.from}
              <ArrowRight className="w-3 h-3" />
              {conv.to}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {currentConversion?.from} Code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Paste your ${currentConversion?.from} code here...`}
            className="w-full h-80 px-4 py-3 rounded-xl bg-gray-900 text-gray-300 font-mono text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
          <motion.button
            onClick={handleConvert}
            disabled={!code.trim() || isConverting}
            className="mt-4 hero-cta-primary flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-5 h-5" />
            {isConverting ? 'Converting...' : `Convert to ${currentConversion?.to}`}
          </motion.button>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentConversion?.to} Code
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
            <div className="bg-gray-900 rounded-xl p-4 h-60 overflow-y-auto">
              {convertedCode ? (
                <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                  {convertedCode}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Modernized code will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Changes Made */}
          {changes.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Changes Made</h4>
              <div className="glass-card rounded-xl p-4 space-y-2">
                {changes.map((change, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{change}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
