'use client';

import { motion } from 'framer-motion';
import { User, Mail, Camera, Shield, LogOut } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/layouts/PageHeader';

export default function AccountPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Account"
        description="Manage your profile and account settings"
        icon={User}
        iconColor="from-purple-500 to-violet-600"
      />

      <div className="max-w-2xl">
        {/* Profile Section */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profile
          </h3>
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  JD
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white dark:bg-dark-700 shadow-lg border border-gray-200 dark:border-dark-600">
                  <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <motion.button
                className="cta-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save Changes
              </motion.button>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Security
          </h3>
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Password</h4>
                  <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl border border-gray-200 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                Change
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors">
                Enable
              </button>
            </div>
          </div>
        </section>

        {/* Plan Section */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Plan
          </h3>
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Free Plan</h4>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400">
                    Current
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  100 generations per month • Basic features
                </p>
              </div>
              <motion.button
                className="cta-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Upgrade
              </motion.button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
            Danger Zone
          </h3>
          <div className="border-2 border-red-200 dark:border-red-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Delete Account</h4>
                  <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
