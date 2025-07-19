'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function DownloadContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyAccess = async () => {
      // Check for Stripe session ID (payment-based access)
      const sessionId = searchParams.get('session_id');
      
      if (sessionId) {
        try {
          const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
          const data = await response.json();
          
          if (data.valid) {
            setSessionValid(true);
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error verifying session:', error);
        }
      }
      
      setIsLoading(false);
    };
    
    verifyAccess();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div 
              className="bg-white rounded-xl shadow-xl p-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-3xl font-bold mb-6 text-gray-900"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Payment Required
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Purchase the AI Prompts pack to get instant access to your downloads. No account registration required!
              </motion.p>
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link 
                  href="/buy"
                  className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Purchase AI Prompts - $10
                </Link>
                <div className="text-sm text-gray-500">
                  After purchase, you&apos;ll be redirected here automatically
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-8"
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            whileHover={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              scale: 1.02
            }}
          >
            {/* Success Message */}
            <div className="mb-8">
              <motion.div 
                className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <span className="text-3xl text-white">✓</span>
              </motion.div>
              <motion.h1 
                className="text-3xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Payment Successful!
              </motion.h1>
              <motion.p 
                className="text-lg text-black font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Thank you for your purchase! Your AI prompts are ready to download.
              </motion.p>
            </div>

            {/* Download Section */}
            <motion.div 
              className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.h2 
                className="text-xl font-bold mb-4 text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                Download Your 30 AI Prompts
              </motion.h2>
              <motion.button 
                className="bg-blue-600 text-white font-bold py-4 px-12 rounded-lg text-xl hover:bg-blue-700 transition-colors shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.open('/api/generate-pdf', '_blank');
                }}
              >
                📥 Download Your AI Prompts (PDF)
              </motion.button>
              <motion.p 
                className="text-sm text-gray-600 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                File size: ~2MB • Format: PDF • Compatible with all devices
              </motion.p>
            </motion.div>

            {/* Instructions */}
            <motion.div 
              className="text-left mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <motion.h3 
                className="text-lg font-semibold mb-4 text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                How to Use Your AI Prompts:
              </motion.h3>
              <ol className="space-y-2 text-gray-600">
                {[
                  "Open the PDF and choose a prompt that matches your goal",
                  "Copy the prompt and paste it into ChatGPT, Claude, or your preferred AI",
                  "Customize the prompt with your specific details",
                  "Start generating income with AI-powered content!"
                ].map((instruction, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.span 
                      className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 1.3 + index * 0.1,
                        type: "spring",
                        stiffness: 300
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {index + 1}
                    </motion.span>
                    {instruction}
                  </motion.li>
                ))}
              </ol>
            </motion.div>

            {/* Contact */}
            <motion.div 
              className="bg-gray-50 rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              whileHover={{ 
                backgroundColor: "#f9fafb",
                scale: 1.02
              }}
            >
              <motion.h3 
                className="text-lg font-semibold mb-4 text-gray-900"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.7 }}
              >
                📧 Contact Support
              </motion.h3>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.8 }}
              >
                <a 
                  href="mailto:chris.t@ventarosales.com" 
                  className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  chris.t@ventarosales.com
                </a>
              </motion.div>
              <motion.p 
                className="text-xs text-gray-500 mt-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.9 }}
              >
                💡 Tip: Bookmark this page for easy re-download access
              </motion.p>
            </motion.div>

            {/* Bookmark Notice */}
            <motion.div 
              className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.p 
                className="text-sm text-blue-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 2.2 }}
              >
                💡 <strong>Pro Tip:</strong> Bookmark this page! You can return anytime to re-download your prompts.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function Download() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <DownloadContent />
    </Suspense>
  );
}

