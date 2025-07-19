'use client';

import { motion } from 'framer-motion';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function Download() {
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
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
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
                className="text-lg text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Thank you for your purchase. Your AI prompts are ready to download.
              </motion.p>
            </motion.div>

            {/* Download Section */}
            <motion.div 
              className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.h2 
                className="text-xl font-semibold mb-4 text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                Download Your 30 AI Prompts
              </motion.h2>
              <motion.button 
                className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-300 transition-colors mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                📥 Download PDF (30 Prompts)
              </motion.button>
              <motion.p 
                className="text-sm text-gray-600"
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

            {/* Support */}
            <motion.div 
              className="bg-gray-50 rounded-lg p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              whileHover={{ 
                backgroundColor: "#f9fafb",
                scale: 1.02
              }}
            >
              <motion.h3 
                className="text-lg font-semibold mb-3 text-gray-900"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.7 }}
              >
                Need Help?
              </motion.h3>
              <motion.p 
                className="text-gray-600 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.8 }}
              >
                If you have any questions or need support, feel free to reach out:
              </motion.p>
              <motion.div 
                className="space-y-2 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.9 }}
              >
                <p><strong>Email:</strong> chris.t@ventarosales.com</p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
              </motion.div>
              <motion.p 
                className="text-xs text-gray-500 mt-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 2.0 }}
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

