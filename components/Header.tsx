'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      className="bg-white shadow-md border-b sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center">
              <motion.img 
                src="/assets/vai-logo.svg"
                alt="VAI Logo"
                className="w-12 h-12 mr-3"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
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
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Home
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }}>
                <Link href="/preview" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Preview
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/buy" className="bg-gradient-to-r from-gray-300 to-gray-500 text-black font-bold px-4 py-2 rounded-lg hover:from-gray-200 hover:to-gray-400 transition-all shadow-md relative overflow-hidden group">
                  <span className="relative z-10">Buy Now</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                  />
                </Link>
              </motion.div>
            </motion.nav>

          </div>
        </div>
      </div>
    </motion.header>
  );
}

