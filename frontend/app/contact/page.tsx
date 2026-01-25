'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  MessageSquare,
  Send,
  Check,
  MapPin,
  Clock,
} from 'lucide-react';
import { Header } from '@/components/Header';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const CONTACT_INFO = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Our team typically responds within 24 hours.',
    value: 'hello@codeassistant.ai',
    href: 'mailto:hello@codeassistant.ai',
  },
  {
    icon: MapPin,
    title: 'Location',
    description: 'Based in San Francisco, serving globally.',
    value: 'San Francisco, CA',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    description: 'Available Monday through Friday.',
    value: '9AM - 6PM PST',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div className="cosmic-bg morph-bg overflow-hidden min-h-screen">
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      <div className="relative z-10">
        <Header />

        <motion.main
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.section className="text-center mb-16" variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <MessageSquare className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Get in Touch
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="title-gradient neon-glow">Contact Us</span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions, feedback, or need help? We&apos;d love to hear from you.
              Our team is here to help.
            </p>
          </motion.section>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <motion.div className="space-y-6" variants={itemVariants}>
              {CONTACT_INFO.map((info, index) => (
                <motion.div
                  key={index}
                  className="glass-card rounded-2xl p-6"
                  whileHover={{ y: -4 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
                    {info.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {info.description}
                  </p>

                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <span className="text-gray-900 dark:text-white font-medium">
                      {info.value}
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <div className="glass-card rounded-3xl p-8">
                {isSubmitted ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="company" className="form-label">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Acme Inc."
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="form-label">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full cta-button flex items-center justify-center gap-2 py-4"
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="spinner" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </motion.main>

        {/* Footer */}
        <footer className="border-t border-gray-200/50 dark:border-dark-700/50 mt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              AI Code Assistant - AI-Powered Development Tools
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
