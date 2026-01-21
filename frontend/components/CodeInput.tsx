'use client';

import { useState, useCallback } from 'react';
import { Diamond, Link, Upload, X } from 'lucide-react';
import { cn, LANGUAGES, detectLanguageFromExtension } from '@/lib/utils';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  githubUrl: string;
  setGithubUrl: (url: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export function CodeInput({
  code,
  setCode,
  githubUrl,
  setGithubUrl,
  language,
  setLanguage,
}: CodeInputProps) {
  const [inputMode, setInputMode] = useState<'code' | 'github' | 'upload'>('code');

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
    <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-dark-700/50 overflow-hidden">
      {/* Input Mode Toggle */}
      <div className="flex border-b border-gray-200 dark:border-dark-700">
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
          Paste Code
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

        {inputMode === 'code' && (
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-64 p-4 font-mono text-sm text-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 outline-none resize-none code-editor-bg"
              spellCheck={false}
            />
            {code && (
              <button
                onClick={() => setCode('')}
                className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-300" />
              </button>
            )}
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {code.length} characters – {code.split('\n').length} lines
            </div>
          </div>
        )}

        {inputMode === 'github' && (
          <div className="relative">
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/user/repo/blob/main/file.js"
              className="w-full px-4 py-4 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            {githubUrl && (
              <button
                onClick={() => setGithubUrl('')}
                className="absolute top-1/2 -translate-y-1/2 right-3 p-1 bg-gray-200 dark:bg-dark-600 hover:bg-gray-300 dark:hover:bg-dark-500 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Enter a direct link to a file on GitHub (e.g.,
              https://github.com/user/repo/blob/main/src/file.js)
            </p>
          </div>
        )}

        {inputMode === 'upload' && (
          <div className="relative">
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
          </div>
        )}
      </div>
    </div>
  );
}
