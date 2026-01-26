'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Paintbrush, Play, CheckCircle, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

const PRINCIPLES = [
  { id: 'solid', name: 'SOLID', description: 'Object-oriented design principles' },
  { id: 'dry', name: 'DRY', description: "Don't Repeat Yourself" },
  { id: 'kiss', name: 'KISS', description: 'Keep It Simple, Stupid' },
  { id: 'naming', name: 'Naming', description: 'Clear, descriptive names' },
];

export default function CleanCodePage() {
  const [code, setCode] = useState('');
  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>(['solid', 'dry']);
  const [cleanedCode, setCleanedCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const togglePrinciple = (id: string) => {
    setSelectedPrinciples((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleClean = async () => {
    if (!code.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setCleanedCode(`// Refactored following ${selectedPrinciples.join(', ')} principles

/**
 * Calculates the total price including tax and discount
 * @param items - Array of cart items
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @param discountCode - Optional discount code
 */
function calculateTotalPrice(
  items: CartItem[],
  taxRate: number,
  discountCode?: string
): number {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, discountCode);
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * taxRate;

  return taxableAmount + tax;
}

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateDiscount(subtotal: number, code?: string): number {
  if (!code) return 0;
  const discountRates: Record<string, number> = {
    'SAVE10': 0.10,
    'SAVE20': 0.20,
  };
  return subtotal * (discountRates[code] || 0);
}`);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Clean Code"
        description="Standardize naming conventions and remove redundant code"
        icon={Paintbrush}
        iconColor="from-pink-500 to-rose-600"
      />

      {/* Principles Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Apply Principles
        </label>
        <div className="flex flex-wrap gap-3">
          {PRINCIPLES.map((principle) => (
            <motion.button
              key={principle.id}
              onClick={() => togglePrinciple(principle.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                selectedPrinciples.includes(principle.id)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {selectedPrinciples.includes(principle.id) && <CheckCircle className="w-4 h-4" />}
              {principle.name}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Original Code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste messy code here..."
            className="w-full h-96 px-4 py-3 rounded-xl bg-gray-900 text-gray-300 font-mono text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
          <motion.button
            onClick={handleClean}
            disabled={!code.trim() || isProcessing}
            className="mt-4 hero-cta-primary flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Paintbrush className="w-5 h-5" />
            {isProcessing ? 'Cleaning...' : 'Clean Up Code'}
          </motion.button>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cleaned Code
            </label>
            {code && cleanedCode && (
              <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>Cleaned</span>
              </div>
            )}
          </div>
          <div className="bg-gray-900 rounded-xl p-4 h-96 overflow-y-auto">
            {cleanedCode ? (
              <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                {cleanedCode}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Cleaned code will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
