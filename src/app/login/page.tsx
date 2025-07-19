'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Admin login check
      if (email === 'chris.t@ventarosales.com') {
        setIsAdmin(true);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isAdmin', 'true');
        window.location.href = '/download';
        return;
      }

      // Regular user login - check if they have purchased
      const response = await fetch('/api/verify-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.hasPurchased) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isAdmin', 'false');
        window.location.href = '/download';
      } else {
        setMessage('No purchase found for this email. Please check your email or purchase first.');
      }
    } catch (error) {
      setMessage('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-20 px-6">
        <div className="max-w-md mx-auto">
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-3xl font-bold text-center mb-8 text-black"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Access Your Prompts
            </motion.h1>
            
            <motion.p 
              className="text-center text-black font-bold mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Enter the email you used for your purchase
            </motion.p>

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <label htmlFor="email" className="block text-sm font-bold text-black mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </motion.div>

              {message && (
                <motion.div
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-red-700 text-sm">{message}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Access Download'
                )}
              </motion.button>
            </form>

            <motion.div 
              className="mt-8 pt-6 border-t border-gray-200 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-sm text-gray-600 mb-4">
                Don't have the prompts yet?
              </p>
              <Link 
                href="/buy"
                className="inline-block bg-gray-400 text-black font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Purchase Now - $10
              </Link>
            </motion.div>

            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <p className="text-xs text-gray-500">
                Need help? Contact{' '}
                <a 
                  href="mailto:chris.t@ventarosales.com" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  chris.t@ventarosales.com
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}