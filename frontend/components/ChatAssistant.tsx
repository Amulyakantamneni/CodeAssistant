'use client';

import { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatAssistantProps {
  code: string;
  language: string;
}

export function ChatAssistant({ code, language }: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Ask me about your code. I can explain, optimize, or point out issues.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: trimmed },
    ];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.sync.chatAssistant({
        message: trimmed,
        code,
        language,
        history: nextMessages.slice(-6),
      });
      const reply =
        response?.data?.reply || response?.reply || 'I could not generate a reply.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error: any) {
      const fallback =
        error?.response?.data?.detail || error?.message || 'Chat failed. Please try again.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: fallback },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-3d rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Chat Assistant</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Code-focused help on demand
          </p>
        </div>
      </div>

      <div className="h-72 overflow-y-auto rounded-xl bg-gray-50 dark:bg-dark-900/40 border border-gray-200/60 dark:border-dark-700/60 p-3 space-y-3 text-sm">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn(
              'p-3 rounded-xl leading-relaxed',
              message.role === 'user'
                ? 'bg-blue-500 text-white ml-8'
                : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 mr-8 border border-gray-200/60 dark:border-dark-700/60'
            )}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="p-3 rounded-xl bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400 mr-8 border border-gray-200/60 dark:border-dark-700/60">
            Thinking...
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask about your code..."
          className="flex-1 rounded-xl border border-gray-200/60 dark:border-dark-700/60 bg-white dark:bg-dark-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-xl text-white transition-all',
            !input.trim() || isLoading
              ? 'bg-gray-300 dark:bg-dark-600 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          )}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
