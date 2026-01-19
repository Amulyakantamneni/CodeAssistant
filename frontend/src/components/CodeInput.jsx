import React, { useState } from 'react';
import { Code, Link, Upload, X } from 'lucide-react';

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'SQL', 'HTML', 'CSS', 'Other'
];

export function CodeInput({ code, setCode, githubUrl, setGithubUrl, language, setLanguage }) {
  const [inputMode, setInputMode] = useState('code'); // 'code' or 'github'

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
        // Auto-detect language from file extension
        const ext = file.name.split('.').pop().toLowerCase();
        const langMap = {
          js: 'JavaScript', jsx: 'JavaScript', ts: 'TypeScript', tsx: 'TypeScript',
          py: 'Python', java: 'Java', cpp: 'C++', cc: 'C++', c: 'C++',
          cs: 'C#', go: 'Go', rs: 'Rust', rb: 'Ruby', php: 'PHP',
          swift: 'Swift', kt: 'Kotlin', scala: 'Scala', r: 'R', sql: 'SQL'
        };
        if (langMap[ext]) {
          setLanguage(langMap[ext]);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
      {/* Input Mode Toggle */}
      <div className="flex border-b border-gray-200 dark:border-dark-700">
        <button
          onClick={() => setInputMode('code')}
          className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 font-medium transition-colors ${
            inputMode === 'code'
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
              : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-700'
          }`}
        >
          <Code className="w-4 h-4" />
          Paste Code
        </button>
        <button
          onClick={() => setInputMode('github')}
          className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 font-medium transition-colors ${
            inputMode === 'github'
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
              : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-700'
          }`}
        >
          <Link className="w-4 h-4" />
          GitHub URL
        </button>
      </div>

      <div className="p-4">
        {/* Language Selector */}
        <div className="mb-4 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Language:
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="">Auto-detect</option>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          {/* File Upload */}
          <label className="ml-auto flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg cursor-pointer transition-colors">
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

        {inputMode === 'code' ? (
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-80 p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-xl border border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              spellCheck={false}
            />
            {code && (
              <button
                onClick={() => setCode('')}
                className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-300" />
              </button>
            )}
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {code.length} characters • {code.split('\n').length} lines
            </div>
          </div>
        ) : (
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
              Enter a direct link to a file on GitHub (e.g., https://github.com/user/repo/blob/main/src/file.js)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
