'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Bug,
  Sparkles,
  Zap,
  TestTube,
  GitPullRequest,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  Download,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

const TOOL_CONFIG: Record<string, { icon: any; name: string; color: string }> = {
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

const SEVERITY_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  low: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  medium: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  high: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  critical: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
};

function CodeBlock({ code, language = 'javascript' }: { code: string; language?: string }) {
  const { theme } = useTheme();
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
        style={theme === 'dark' ? oneDark : oneLight}
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

interface ResultCardProps {
  tool: string;
  data: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  onExport: (tool: string, data: any) => void;
}

function ResultCard({ tool, data, status, onExport }: ResultCardProps) {
  const [expanded, setExpanded] = useState(true);
  const config = TOOL_CONFIG[tool] || TOOL_CONFIG.debug;
  const Icon = config.icon;

  const renderDebugResults = (data: any) => (
    <div className="space-y-4">
      {data.severity && (
        <div
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
            SEVERITY_CONFIG[data.severity]?.bg,
            SEVERITY_CONFIG[data.severity]?.color
          )}
        >
          {SEVERITY_CONFIG[data.severity]?.icon && (
            <span>
              {(() => {
                const SeverityIcon = SEVERITY_CONFIG[data.severity]?.icon || Info;
                return <SeverityIcon className="w-4 h-4" />;
              })()}
            </span>
          )}
          {data.severity.charAt(0).toUpperCase() + data.severity.slice(1)} Severity
        </div>
      )}

      {data.summary && <p className="text-gray-600 dark:text-gray-300">{data.summary}</p>}

      {data.issues?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Issues ({data.issues.length})</h4>
          <div className="space-y-2">
            {data.issues.map((issue: any, i: number) => (
              <div key={i} className="p-3 bg-gray-100 dark:bg-dark-700 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">
                    {issue.category ? `${issue.category.toUpperCase()}` : 'Issue'}
                    {issue.line ? ` • Line ${issue.line}` : ''}
                    :
                  </span>{' '}
                  {issue.issue}
                </p>
                {issue.suggestion && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Fix: {issue.suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.syntaxErrors?.length > 0 && (
        <div>
          <h4 className="font-semibold text-red-500 mb-2">
            Syntax Errors ({data.syntaxErrors.length})
          </h4>
          {data.syntaxErrors.map((err: any, i: number) => (
            <div key={i} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg mb-2">
              <p className="text-sm">
                <span className="font-medium">Line {err.line}:</span> {err.error}
              </p>
              {err.suggestion && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Fix: {err.suggestion}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {data.logicErrors?.length > 0 && (
        <div>
          <h4 className="font-semibold text-orange-500 mb-2">
            Logic Errors ({data.logicErrors.length})
          </h4>
          {data.logicErrors.map((err: any, i: number) => (
            <div key={i} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg mb-2">
              <p className="text-sm">
                <span className="font-medium">Line {err.line}:</span> {err.error}
              </p>
              {err.suggestion && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Fix: {err.suggestion}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {data.fixedCode && (
        <div>
          <h4 className="font-semibold mb-2">Fixed Code</h4>
          <CodeBlock code={data.fixedCode} />
        </div>
      )}
    </div>
  );

  const renderRefactorResults = (data: any) => (
    <div className="space-y-4">
      {data.summary && <p className="text-gray-600 dark:text-gray-300">{data.summary}</p>}

      {data.readabilityScore && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Before:</span>
            <span className="font-semibold text-orange-500">
              {data.readabilityScore.before}/10
            </span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">After:</span>
            <span className="font-semibold text-green-500">
              {data.readabilityScore.after}/10
            </span>
          </div>
        </div>
      )}

      {(() => {
        const keyChanges =
          data.keyChanges ??
          data.improvements ??
          (Array.isArray(data.changes)
            ? data.changes
                .map((change: any) => {
                  if (!change) return null;
                  if (change.description && change.type) {
                    return `${change.type}: ${change.description}`;
                  }
                  if (change.description) return change.description;
                  return null;
                })
                .filter(Boolean)
            : []);

        return keyChanges?.length > 0 ? (
          <div>
            <h4 className="font-semibold mb-2">Key Changes</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
              {keyChanges.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null;
      })()}

      {data.principlesApplied?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Principles Applied</h4>
          <div className="space-y-2">
            {data.principlesApplied.map((p: any, i: number) => (
              <div
                key={i}
                className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm"
              >
                <span className="font-semibold text-purple-700 dark:text-purple-300">
                  {p.principle}
                </span>
                {p.why || p.explanation ? (
                  <span className="text-gray-600 dark:text-gray-300">
                    {' '}
                    — {p.why || p.explanation}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {(() => {
        const beforeAfter =
          data.beforeAfter ??
          (Array.isArray(data.changes)
            ? data.changes.filter((change: any) => change?.before || change?.after)
            : []);

        if (!beforeAfter?.length) return null;

        return (
          <div>
            <h4 className="font-semibold mb-2">Before / After</h4>
            <div className="space-y-4">
              {beforeAfter.slice(0, 3).map((item: any, i: number) => (
                <div key={i} className="p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                  {item.title && <p className="font-medium mb-3">{item.title}</p>}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {item.before && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Before</p>
                        <CodeBlock code={item.before} />
                      </div>
                    )}
                    {item.after && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">After</p>
                        <CodeBlock code={item.after} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {data.refactoredCode && (
        <div>
          <h4 className="font-semibold mb-2">Refactored Code</h4>
          <CodeBlock code={data.refactoredCode} />
        </div>
      )}
    </div>
  );

  const renderOptimizeResults = (data: any) => (
    <div className="space-y-4">
      {data.summary && <p className="text-gray-600 dark:text-gray-300">{data.summary}</p>}

      {(data.performanceAnalysis || data.complexity) && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-dark-700 rounded-xl">
            <h5 className="text-sm font-medium text-gray-500 mb-2">Original</h5>
            <p className="text-sm">
              Time:{' '}
              <span className="font-mono font-semibold">
                {data.performanceAnalysis?.original?.timeComplexity || data.complexity?.original?.time}
              </span>
            </p>
            <p className="text-sm">
              Space:{' '}
              <span className="font-mono font-semibold">
                {data.performanceAnalysis?.original?.spaceComplexity || data.complexity?.original?.space}
              </span>
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
              Optimized
            </h5>
            <p className="text-sm">
              Time:{' '}
              <span className="font-mono font-semibold">
                {data.performanceAnalysis?.optimized?.timeComplexity || data.complexity?.optimized?.time}
              </span>
            </p>
            <p className="text-sm">
              Space:{' '}
              <span className="font-mono font-semibold">
                {data.performanceAnalysis?.optimized?.spaceComplexity || data.complexity?.optimized?.space}
              </span>
            </p>
          </div>
        </div>
      )}

      {data.keyChanges?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Key Changes</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {data.keyChanges.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {data.optimizedCode && (
        <div>
          <h4 className="font-semibold mb-2">Optimized Code</h4>
          <CodeBlock code={data.optimizedCode} />
        </div>
      )}
    </div>
  );

  const renderTestResults = (data: any) => (
    <div className="space-y-4">
      {data.summary && <p className="text-gray-600 dark:text-gray-300">{data.summary}</p>}

      {data.keyTests?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Key Tests ({data.keyTests.length})</h4>
          {data.keyTests.slice(0, 5).map((test: any, i: number) => (
            <div key={i} className="p-3 bg-gray-100 dark:bg-dark-700 rounded-lg mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{test.name}</span>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    test.type === 'unit'
                      ? 'bg-blue-100 text-blue-600'
                      : test.type === 'edge'
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-green-100 text-green-600'
                  )}
                >
                  {test.type}
                </span>
              </div>
              {test.why && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{test.why}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {data.testCases?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Test Cases ({data.testCases.length})</h4>
          {data.testCases.slice(0, 5).map((test: any, i: number) => (
            <div key={i} className="p-3 bg-gray-100 dark:bg-dark-700 rounded-lg mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{test.name}</span>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    test.type === 'unit'
                      ? 'bg-blue-100 text-blue-600'
                      : test.type === 'edge'
                      ? 'bg-orange-100 text-orange-600'
                      : test.type === 'integration'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-purple-100 text-purple-600'
                  )}
                >
                  {test.type}
                </span>
              </div>
              {test.inputs && (
                <p className="text-xs text-gray-500 dark:text-gray-400">Inputs: {test.inputs}</p>
              )}
              {test.expected && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Expected: {test.expected}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {data.coverageAnalysis && (
        <div>
          <h4 className="font-semibold mb-2">Coverage Analysis</h4>
          {data.coverageAnalysis.untested?.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-gray-500 mb-1">Untested</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {data.coverageAnalysis.untested.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {data.coverageAnalysis.recommendations?.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Recommendations</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {data.coverageAnalysis.recommendations.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {data.executionPlan && (
        <div>
          <h4 className="font-semibold mb-2">Execution Plan</h4>
          {data.executionPlan.frameworks?.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Frameworks: {data.executionPlan.frameworks.join(', ')}
            </p>
          )}
          {data.executionPlan.commands?.length > 0 && (
            <div className="mt-2 space-y-1">
              {data.executionPlan.commands.map((cmd: string, i: number) => (
                <pre key={i} className="text-xs bg-gray-100 dark:bg-dark-700 rounded p-2">
                  {cmd}
                </pre>
              ))}
            </div>
          )}
          {data.executionPlan.notes?.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1 mt-2">
              {data.executionPlan.notes.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {data.bugDetection?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Bug Detection</h4>
          <div className="space-y-2">
            {data.bugDetection.map((item: any, i: number) => (
              <div key={i} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm">
                <p className="font-medium">{item.test}</p>
                {item.likelyCause && (
                  <p className="text-gray-600 dark:text-gray-300">
                    Cause: {item.likelyCause}
                  </p>
                )}
                {item.location && (
                  <p className="text-gray-500 dark:text-gray-400">Location: {item.location}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.testingSuggestions?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Testing Suggestions</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {data.testingSuggestions.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {data.edgeCases?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Edge Cases</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {data.edgeCases.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {data.mocks?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Mocks</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {data.mocks.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {data.fixtures?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Fixtures</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {data.fixtures.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {data.testCode && (
        <div>
          <h4 className="font-semibold mb-2">Generated Tests</h4>
          <CodeBlock code={data.testCode} />
        </div>
      )}
    </div>
  );

  const renderPRResults = (data: any) => (
    <div className="space-y-4">
      {data.title && <h3 className="text-xl font-bold">{data.title}</h3>}

      {data.summary && <p className="text-gray-600 dark:text-gray-300">{data.summary}</p>}

      {data.changes?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Changes</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {data.changes.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {data.testing?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Testing</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {data.testing.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {data.labels?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.labels.map((label: string, i: number) => (
            <span
              key={i}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
            >
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
    if (status === 'pending' || status === 'running') {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          <span className="ml-3 text-gray-500">
            {status === 'pending' ? 'Queued...' : 'Processing...'}
          </span>
        </div>
      );
    }

    if (status === 'failed') {
      const errorMessage = data?.error;
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
          {errorMessage ? `Analysis failed: ${errorMessage}` : 'Analysis failed. Please try again.'}
        </div>
      );
    }

    if (!data) return null;

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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="card-3d rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className={cn('w-5 h-5', config.color)} />
          <span className="font-semibold">{config.name} Results</span>
          {(status === 'pending' || status === 'running') && (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {status === 'completed' && data && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExport(tool, data);
              }}
              className="p-2 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
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

interface ResultsDashboardProps {
  results: Record<string, { status: string; data?: any }>;
  onClear: () => void;
}

export function ResultsDashboard({ results, onClear }: ResultsDashboardProps) {
  const handleExport = (tool: string, data: any) => {
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
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
    >
      <motion.div
        className="flex items-center justify-between"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <h2 className="text-2xl font-bold">Results Dashboard</h2>
        <motion.button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <X className="w-4 h-4" />
          Clear Results
        </motion.button>
      </motion.div>

      <div className="space-y-4">
        {Object.entries(results).map(([tool, result], index) => (
          <motion.div
            key={tool}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
          >
            <ResultCard
              tool={tool}
              data={result?.data}
              status={result?.status as any}
              onExport={handleExport}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
