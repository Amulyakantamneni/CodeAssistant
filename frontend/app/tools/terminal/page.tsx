'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Send, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export default function TerminalPage() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to AI Code Assistant Terminal', timestamp: new Date() },
    { type: 'output', content: 'Type "help" for available commands', timestamp: new Date() },
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newHistory = [...history, { type: 'input' as const, content: `$ ${input}`, timestamp: new Date() }];

    // Simulate command execution
    const command = input.toLowerCase().trim();
    if (command === 'help') {
      newHistory.push({
        type: 'output',
        content: `Available commands:
  help     - Show this help message
  clear    - Clear terminal
  ls       - List files (sandbox)
  pwd      - Print working directory
  echo     - Print text
  version  - Show version info`,
        timestamp: new Date(),
      });
    } else if (command === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (command === 'pwd') {
      newHistory.push({ type: 'output', content: '/home/sandbox', timestamp: new Date() });
    } else if (command === 'version') {
      newHistory.push({ type: 'output', content: 'AI Code Assistant v1.0.0', timestamp: new Date() });
    } else if (command.startsWith('echo ')) {
      newHistory.push({ type: 'output', content: input.slice(5), timestamp: new Date() });
    } else if (command === 'ls') {
      newHistory.push({
        type: 'output',
        content: 'src/  node_modules/  package.json  README.md  tsconfig.json',
        timestamp: new Date(),
      });
    } else {
      newHistory.push({
        type: 'error',
        content: `Command not found: ${input}. Type "help" for available commands.`,
        timestamp: new Date(),
      });
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <DashboardLayout showBackground={false}>
      <PageHeader
        title="Terminal/CLI"
        description="Sandbox command-line interface"
        icon={Terminal}
        iconColor="from-green-500 to-emerald-600"
        actions={
          <motion.button
            onClick={() => setHistory([])}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </motion.button>
        }
      />

      <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
        {/* Terminal Header */}
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-gray-400 ml-2">sandbox — bash</span>
        </div>

        {/* Terminal Body */}
        <div
          ref={terminalRef}
          className="p-4 h-[500px] overflow-y-auto font-mono text-sm"
        >
          {history.map((line, index) => (
            <div
              key={index}
              className={`mb-1 ${
                line.type === 'input'
                  ? 'text-green-400'
                  : line.type === 'error'
                  ? 'text-red-400'
                  : 'text-gray-300'
              }`}
            >
              <pre className="whitespace-pre-wrap">{line.content}</pre>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-mono">$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-gray-300 font-mono focus:outline-none"
              placeholder="Type a command..."
              autoFocus
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
