'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Diamond, Link, Upload, X, MessageSquare } from 'lucide-react';
import { cn, LANGUAGES, detectLanguageFromExtension } from '@/lib/utils';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  githubUrl: string;
  setGithubUrl: (url: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  onGeneratePrompt?: () => void;
  isGenerating?: boolean;
}

export function CodeInput({
  code,
  setCode,
  githubUrl,
  setGithubUrl,
  language,
  setLanguage,
  onGeneratePrompt,
  isGenerating = false,
}: CodeInputProps) {
  const [inputMode, setInputMode] = useState<'prompt' | 'code' | 'github' | 'upload'>('prompt');

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCode(event.target?.result as string);
          const detectedLang = detectLanguageFromExtension(file.name);
          if (detectedLang) {
            setLanguage(detectedLang);
          }
          setInputMode('code');
        };
        reader.readAsText(file);
      }
    },
    [setCode, setLanguage]
  );

  return (
    <div className="glass-card card-shine rounded-2xl overflow-hidden soft-glow">
      {/* Input Mode Toggle */}
      <div className="flex border-b border-gray-200 dark:border-dark-700">
        <button
          onClick={() => setInputMode('prompt')}
          className={cn(
            'flex-1 px-4 py-3 flex items-center justify-center gap-2 font-medium transition-colors relative',
            inputMode === 'prompt'
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <MessageSquare className="w-4 h-4" />
          Describe
          {inputMode === 'prompt' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          )}
        </button>
        <button
          onClick={() => setInputMode('code')}
          className={cn(
            'flex-1 px-4 py-3 flex items-center justify-center gap-2 font-medium transition-colors relative',
            inputMode === 'code'
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <Diamond className="w-4 h-4" />
          Code
          {inputMode === 'code' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          )}
        </button>
        <button
          onClick={() => setInputMode('github')}
          className={cn(
            'flex-1 px-4 py-3 flex items-center justify-center gap-2 font-medium transition-colors relative',
            inputMode === 'github'
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <Link className="w-4 h-4" />
          GitHub URL
          {inputMode === 'github' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          )}
        </button>
        <button
          onClick={() => setInputMode('upload')}
          className={cn(
            'flex-1 px-4 py-3 flex items-center justify-center gap-2 font-medium transition-colors relative',
            inputMode === 'upload'
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <Upload className="w-4 h-4" />
          Upload File
          {inputMode === 'upload' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          )}
        </button>
      </div>

      <div className="p-4">
        {/* Language Selector & Upload Button Row */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Language:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="">Auto-detect</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Button */}
          <label className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg cursor-pointer transition-colors border border-gray-300 dark:border-dark-600">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Upload File</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.cc,.c,.cs,.go,.rs,.rb,.php,.swift,.kt,.scala,.r,.sql,.html,.css,.json,.xml,.yaml,.yml,.md,.txt"
            />
          </label>
        </div>

        <AnimatePresence mode="wait">
          {inputMode === 'prompt' && (
            <motion.div
              key="prompt"
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Describe what you want to build. Example: Create a Next.js landing page with a pricing table and FAQ."
                className="w-full h-64 p-4 text-sm text-gray-700 dark:text-gray-200 rounded-xl border border-gray-200 dark:border-dark-700 focus:ring-2 focus:ring-primary-500 outline-none resize-none bg-white/80 dark:bg-dark-800/80"
                spellCheck={false}
              />
              {code && (
                <motion.button
                  onClick={() => setCode('')}
                  className="absolute top-2 right-2 p-1.5 bg-gray-200/60 dark:bg-dark-700/70 hover:bg-gray-300/80 dark:hover:bg-dark-600 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </motion.button>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Use plain English. We will use your prompt as the starting point for generation.
              </p>
              <div className="mt-4 flex justify-end">
                <motion.button
                  onClick={onGeneratePrompt}
                  disabled={!onGeneratePrompt || !code.trim() || isGenerating}
                  className={cn(
                    'tool-button',
                    (!onGeneratePrompt || !code.trim() || isGenerating) &&
                      'opacity-60 cursor-not-allowed'
                  )}
                  whileHover={
                    onGeneratePrompt && !isGenerating && code.trim() ? { scale: 1.02, y: -2 } : {}
                  }
                  whileTap={onGeneratePrompt && !isGenerating && code.trim() ? { scale: 0.98 } : {}}
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {inputMode === 'code' && (
            <motion.div
              key="code"
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full h-64 p-4 font-mono text-sm text-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 outline-none resize-none code-editor-bg"
                spellCheck={false}
              />
              {code && (
                <motion.button
                  onClick={() => setCode('')}
                  className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-gray-300" />
                </motion.button>
              )}
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {code.length} characters – {code.split('\n').length} lines
              </div>
            </motion.div>
          )}

          {inputMode === 'github' && (
            <motion.div
              key="github"
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/user/repo/blob/main/file.js"
                className="w-full px-4 py-4 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              {githubUrl && (
                <motion.button
                  onClick={() => setGithubUrl('')}
                  className="absolute top-1/2 -translate-y-1/2 right-3 p-1 bg-gray-200 dark:bg-dark-600 hover:bg-gray-300 dark:hover:bg-dark-500 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Enter a direct link to a file on GitHub (e.g.,
                https://github.com/user/repo/blob/main/src/file.js)
              </p>
            </motion.div>
          )}

          {inputMode === 'upload' && (
            <motion.div
              key="upload"
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-dark-700/50 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supported: .js, .ts, .py, .java, .cpp, .go, .rs, .rb, .php, and more
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.cc,.c,.cs,.go,.rs,.rb,.php,.swift,.kt,.scala,.r,.sql,.html,.css,.json,.xml,.yaml,.yml,.md,.txt"
                />
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
