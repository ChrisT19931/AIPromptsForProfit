'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer 
      className="bg-gray-900 text-white py-12 px-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h3 
               className="text-xl font-bold text-gray-300 mb-4"
               whileHover={{ scale: 1.05 }}
             >
               Ventaro AI - AI Prompts For Profit
             </motion.h3>
            <p className="text-gray-300">
              Unlock the power of AI to generate income with our proven prompt collection.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { href: "/", text: "Home" },
                { href: "/preview", text: "Preview Prompts" },
                { href: "/buy", text: "Buy Now" }
              ].map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                >
                  <Link href={link.href} className="block text-gray-300 hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            id="contact"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4">Contact</h4>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.p 
                 className="text-gray-300 mb-2"
                 whileHover={{ color: "#ffffff" }}
               >
                 Questions? We're here to help!
               </motion.p>
               <motion.a 
                 href="mailto:chris.t@ventarosales.com" 
                 className="text-white hover:underline"
                 whileHover={{ scale: 1.05 }}
               >
                 chris.t@ventarosales.com
               </motion.a>
            </motion.div>
          </motion.div>
        </div>
        <motion.div 
          className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2025 Ventaro AI - AI Prompts For Profit. All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <motion.span whileHover={{ scale: 1.05 }}>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </motion.span>
            <motion.span whileHover={{ scale: 1.05 }}>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </motion.span>
          </div>
          <div className="mt-4 space-x-6 text-sm">
            <motion.span whileHover={{ scale: 1.05 }}>
              <a href="https://www.ventarosales.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                AI Sales Tools & Business Tools
              </a>
            </motion.span>
            <motion.span whileHover={{ scale: 1.05 }}>
              <a href="https://www.ventarowear.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Ventaro Wear - Hyped Clothing
              </a>
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

