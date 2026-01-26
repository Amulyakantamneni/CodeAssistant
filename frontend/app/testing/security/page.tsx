'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Play, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  remediation: string;
  line?: number;
}

export default function SecurityAuditPage() {
  const [code, setCode] = useState('');
  const [issues, setIssues] = useState<SecurityIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    if (!code.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      setIssues([
        {
          severity: 'critical',
          category: 'Secrets',
          title: 'Hardcoded API Key Detected',
          description: 'An API key appears to be hardcoded in the source code on line 12.',
          remediation: 'Move sensitive credentials to environment variables and use process.env.API_KEY',
          line: 12,
        },
        {
          severity: 'high',
          category: 'Injection',
          title: 'Potential SQL Injection',
          description: 'User input is concatenated directly into SQL query without parameterization.',
          remediation: 'Use parameterized queries or prepared statements instead of string concatenation.',
          line: 45,
        },
        {
          severity: 'medium',
          category: 'Dependencies',
          title: 'Vulnerable Dependency',
          description: 'Package "lodash" version 4.17.15 has known security vulnerabilities.',
          remediation: 'Update lodash to version 4.17.21 or later.',
        },
        {
          severity: 'low',
          category: 'Best Practices',
          title: 'Missing Input Validation',
          description: 'User input is not validated before processing.',
          remediation: 'Add input validation and sanitization for all user-provided data.',
          line: 78,
        },
      ]);
      setIsScanning(false);
    }, 2500);
  };

  const severityConfig = {
    critical: { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
    high: { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: AlertTriangle },
    medium: { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: AlertTriangle },
    low: { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: Info },
  };

  const issueCount = {
    critical: issues.filter((i) => i.severity === 'critical').length,
    high: issues.filter((i) => i.severity === 'high').length,
    medium: issues.filter((i) => i.severity === 'medium').length,
    low: issues.filter((i) => i.severity === 'low').length,
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Security Audit"
        description="Scan for vulnerabilities, exposed secrets, and security issues"
        icon={Shield}
        iconColor="from-cyan-500 to-blue-600"
      />

      {/* Summary Cards */}
      {issues.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {(['critical', 'high', 'medium', 'low'] as const).map((severity) => (
            <motion.div
              key={severity}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${severityConfig[severity].bg} rounded-xl p-4 text-center`}
            >
              <div className={`text-2xl font-bold ${severityConfig[severity].color}`}>
                {issueCount[severity]}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{severity}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Code to Audit
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here for security analysis..."
            className="w-full h-96 px-4 py-3 rounded-xl bg-gray-900 text-gray-300 font-mono text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
          <motion.button
            onClick={handleScan}
            disabled={!code.trim() || isScanning}
            className="mt-4 hero-cta-primary flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Shield className="w-5 h-5" />
            {isScanning ? 'Scanning...' : 'Run Security Audit'}
          </motion.button>
        </div>

        {/* Results */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Security Issues
          </label>
          <div className="space-y-3 h-96 overflow-y-auto pr-2">
            {issues.length > 0 ? (
              issues.map((issue, index) => {
                const config = severityConfig[issue.severity];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${config.bg} rounded-xl p-4 border border-transparent`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium uppercase ${config.color}`}>
                            {issue.severity}
                          </span>
                          <span className="text-xs text-gray-500">{issue.category}</span>
                          {issue.line && (
                            <span className="text-xs text-gray-500">Line {issue.line}</span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {issue.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {issue.description}
                        </p>
                        <div className="bg-white/50 dark:bg-dark-800/50 rounded-lg p-2">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Fix:</span> {issue.remediation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {isScanning ? 'Scanning for vulnerabilities...' : 'Run a security audit to find issues'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
