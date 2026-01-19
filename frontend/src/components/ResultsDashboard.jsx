import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Bug, Sparkles, Zap, TestTube, GitPullRequest,
  ChevronDown, ChevronUp, Copy, Check, AlertTriangle,
  AlertCircle, Info, CheckCircle, X, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TOOL_CONFIG = {
  debug: { icon: Bug, name: 'Debugger', color: 'text-red-500' },
  debugger: { icon: Bug, name: 'Debugger', color: 'text-red-500' },
  refactor: { icon: Sparkles, name: 'Refactorizer', color: 'text-purple-500' },
  refactorizer: { icon: Sparkles, name: 'Refactorizer', color: 'text-purple-500' },
  optimize: { icon: Zap, name: 'Optimizer', color: 'text-yellow-500' },
  optimizer: { icon: Zap, name: 'Optimizer', color: 'text-yellow-500' },
  test: { icon: TestTube, name: 'Tester', color: 'text-green-500' },
  tester: { icon: TestTube, name: 'Tester', color: 'text-green-500' },
  pr: { icon: GitPullRequest, name: 'PR Generator', color: 'text-blue-500' },
  'pr-generator': { icon: GitPullRequest, name: 'PR Generator', color: 'text-blue-500' },
};

const SEVERITY_CONFIG = {
  low: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  medium: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  high: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  critical: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
};

function CodeBlock({ code, language = 'javascript', darkMode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-gray-700/80 hover:bg-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-300" />
        )}
      </button>
      <SyntaxHighlighter
        language={language.toLowerCase()}
        style={darkMode ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function ResultCard({ tool, data, darkMode, onExport }) {
  const [expanded, setExpanded] = useState(true);
  const config = TOOL_CONFIG[tool] || TOOL_CONFIG.debug;
  const Icon = config.icon;

  const renderDebugResults = (data) => (
    <div className="space-y-4">
      {data.severity && (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${SEVERITY_CONFIG[data.severity]?.bg} ${SEVERITY_CONFIG[data.severity]?.color}`}>
          {React.createElement(SEVERITY_CONFIG[data.severity]?.icon || Info, { className: 'w-4 h-4' })}
          {data.severity.charAt(0).toUpperCase() + data.severity.slice(1)} Severity
        </div>
      )}

      {data.summary && (
        <p className="text-gray-600 dark:text-gray-300">{data.summary}</p>
      )}

      {data.syntaxErrors?.length > 0 && (
        <div>
          <h4 className="font-semibold text-red-500 mb-2">Syntax Errors ({data.syntaxErrors.length})</h4>
          {data.syntaxErrors.map((err, i) => (
            <div key={i} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg mb-2">
              <p className="text-sm"><span className="font-medium">Line {err.line}:</span> {err.error}</p>
              {err.suggestion && <p className="text-sm text-green-600 dark:text-green-400 mt-1">Fix: {err.suggestion}</p>}
            </div>
          ))}
        </div>
      )}

      {data.logicErrors?.length > 0 && (
        <div>
          <h4 className="font-semibold text-orange-500 mb-2">Logic Errors ({data.logicErrors.length})</h4>
          {data.logicErrors.map((err, i) => (
            <div key={i} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg mb-2">
              <p className="text-sm"><span className="font-medium">Line {err.line}:</span> {err.error}</p>
              {err.suggestion && <p className="text-sm text-green-600 dark:text-green-400 mt-1">Fix: {err.suggestion}</p>}
            </div>
          ))}
        </div>
      )}

      {data.fixedCode && (
        <div>
          <h4 className="font-semibold mb-2">Fixed Code</h4>
          <CodeBlock code={data.fixedCode} darkMode={darkMode} />
        </div>
      )}
    </div>
  );

  const renderRefactorResults = (data) => (
    <div className="space-y-4">
      {data.summary && (
        <p className="text-gray-600 dark:text-gray-300">{data.summary}</p>
      )}

      {data.readabilityScore && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Before:</span>
            <span className="font-semibold text-orange-500">{data.readabilityScore.before}/10</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">After:</span>
            <span className="font-semibold text-green-500">{data.readabilityScore.after}/10</span>
          </div>
        </div>
      )}

      {data.principlesApplied?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Principles Applied</h4>
          <div className="flex flex-wrap gap-2">
            {data.principlesApplied.map((p, i) => (
              <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                {p.principle}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.refactoredCode && (
        <div>
          <h4 className="font-semibold mb-2">Refactored Code</h4>
          <CodeBlock code={data.refactoredCode} darkMode={darkMode} />
        </div>
      )}
    </div>
  );

  const renderOptimizeResults = (data) => (
    <div className="space-y-4">
      {data.summary && (
        <p className="text-gray-600 dark:text-gray-300">{data.summary}</p>
      )}

      {data.performanceAnalysis && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-dark-700 rounded-xl">
            <h5 className="text-sm font-medium text-gray-500 mb-2">Original</h5>
            <p className="text-sm">Time: <span className="font-mono font-semibold">{data.performanceAnalysis.original?.timeComplexity}</span></p>
            <p className="text-sm">Space: <span className="font-mono font-semibold">{data.performanceAnalysis.original?.spaceComplexity}</span></p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Optimized</h5>
            <p className="text-sm">Time: <span className="font-mono font-semibold">{data.performanceAnalysis.optimized?.timeComplexity}</span></p>
            <p className="text-sm">Space: <span className="font-mono font-semibold">{data.performanceAnalysis.optimized?.spaceComplexity}</span></p>
          </div>
        </div>
      )}

      {data.optimizedCode && (
        <div>
          <h4 className="font-semibold mb-2">Optimized Code</h4>
          <CodeBlock code={data.optimizedCode} darkMode={darkMode} />
        </div>
      )}
    </div>
  );

  const renderTestResults = (data) => (
    <div className="space-y-4">
      {data.summary && (
        <p className="text-gray-600 dark:text-gray-300">{data.summary}</p>
      )}

      {data.testCases?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Test Cases ({data.testCases.length})</h4>
          {data.testCases.slice(0, 5).map((test, i) => (
            <div key={i} className="p-3 bg-gray-100 dark:bg-dark-700 rounded-lg mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{test.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  test.type === 'unit' ? 'bg-blue-100 text-blue-600' :
                  test.type === 'edge' ? 'bg-orange-100 text-orange-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {test.type}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{test.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.testCode && (
        <div>
          <h4 className="font-semibold mb-2">Generated Tests</h4>
          <CodeBlock code={data.testCode} darkMode={darkMode} />
        </div>
      )}
    </div>
  );

  const renderPRResults = (data) => (
    <div className="space-y-4">
      {data.title && (
        <h3 className="text-xl font-bold">{data.title}</h3>
      )}

      {data.summary && (
        <p className="text-gray-600 dark:text-gray-300">{data.summary}</p>
      )}

      {data.labels?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.labels.map((label, i) => (
            <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
              {label}
            </span>
          ))}
        </div>
      )}

      {data.fullMarkdown && (
        <div className="p-4 bg-gray-100 dark:bg-dark-700 rounded-xl">
          <pre className="text-sm whitespace-pre-wrap font-mono">{data.fullMarkdown}</pre>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (data.raw) {
      return <pre className="text-sm whitespace-pre-wrap">{data.raw}</pre>;
    }

    switch (tool) {
      case 'debug':
      case 'debugger':
        return renderDebugResults(data);
      case 'refactor':
      case 'refactorizer':
        return renderRefactorResults(data);
      case 'optimize':
      case 'optimizer':
        return renderOptimizeResults(data);
      case 'test':
      case 'tester':
        return renderTestResults(data);
      case 'pr':
      case 'pr-generator':
        return renderPRResults(data);
      default:
        return <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${config.color}`} />
          <span className="font-semibold">{config.name} Results</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExport(tool, data);
            }}
            className="p-2 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-6 pb-6"
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ResultsDashboard({ results, darkMode, onClear }) {
  const handleExport = (tool, data) => {
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool}-results.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!results || Object.keys(results).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Results Dashboard</h2>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          Clear Results
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(results).map(([tool, result]) => (
          <ResultCard
            key={tool}
            tool={result?.tool || tool}
            data={result?.data || result}
            darkMode={darkMode}
            onExport={handleExport}
          />
        ))}
      </div>
    </div>
  );
}
