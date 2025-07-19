'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      className="bg-white shadow-sm border-b"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="text-2xl font-bold text-gray-900">
               Ventaro AI - AI Prompts For Profit
             </Link>
          </motion.div>
          
          <div className="flex items-center space-x-6">
            <motion.nav 
              className="hidden md:flex space-x-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div whileHover={{ y: -2 }}>
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }}>
                <Link href="/preview" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Preview
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/buy" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Buy Now
                </Link>
              </motion.div>
            </motion.nav>
            
            {/* Login Button - Top Right */}
            <motion.div 
              className="ml-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/login" 
                  className="bg-gradient-to-r from-gray-300 to-gray-400 text-black font-bold px-6 py-2 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all shadow-lg"
                >
                  🔐 Login
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

