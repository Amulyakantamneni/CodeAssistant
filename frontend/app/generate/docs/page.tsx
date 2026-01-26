'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Play, Copy, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const DOC_TYPES = [
  { id: 'readme', name: 'README.md', description: 'Project documentation' },
  { id: 'docstring', name: 'Docstrings', description: 'Function documentation' },
  { id: 'api', name: 'API Docs', description: 'OpenAPI/Swagger specs' },
  { id: 'comments', name: 'Code Comments', description: 'Inline explanations' },
];

export default function DocsGeneratorPage() {
  const [code, setCode] = useState('');
  const [docType, setDocType] = useState('readme');
  const [generatedDocs, setGeneratedDocs] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!code.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      if (docType === 'readme') {
        setGeneratedDocs(`# Project Name

## Overview
A brief description of what this project does.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`javascript
import { example } from './example';
example();
\`\`\`

## API Reference

### \`functionName(param1, param2)\`
Description of what the function does.

**Parameters:**
- \`param1\` (string): Description
- \`param2\` (number): Description

**Returns:** Description of return value

## License
MIT`);
      } else {
        setGeneratedDocs(`"""
Module documentation.

This module provides functionality for...

Example:
    >>> from module import function
    >>> function(arg1, arg2)
    'result'

Attributes:
    CONSTANT (str): Description of the constant.
"""

def function_name(param1: str, param2: int) -> str:
    """
    Brief description of the function.

    Args:
        param1: Description of param1.
        param2: Description of param2.

    Returns:
        Description of the return value.

    Raises:
        ValueError: Description of when this is raised.
    """
    pass`);
      }
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Documentation Generator"
        description="Auto-generate README files, docstrings, and API documentation"
        icon={FileText}
        iconColor="from-emerald-500 to-teal-600"
      />

      {/* Doc Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Documentation Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DOC_TYPES.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => setDocType(type.id)}
              className={`p-4 rounded-xl text-left transition-all ${
                docType === type.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                  : 'glass-card hover:border-primary-300 dark:hover:border-primary-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                {type.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {type.description}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paste your code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste the code you want to document..."
            className="w-full h-80 px-4 py-3 rounded-xl bg-gray-900 text-gray-300 font-mono text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
          <motion.button
            onClick={handleGenerate}
            disabled={!code.trim() || isGenerating}
            className="mt-4 hero-cta-primary flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'Generate Documentation'}
          </motion.button>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Documentation
            </label>
            {generatedDocs && (
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
          <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl p-4 h-80 overflow-y-auto">
            {generatedDocs ? (
              <pre className="font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {generatedDocs}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Generated documentation will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
