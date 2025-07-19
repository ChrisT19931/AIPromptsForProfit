'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getStripe } from '../../../lib/stripe';

export default function Buy() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-8"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              scale: 1.02
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.h1 
              className="text-3xl font-bold text-center mb-8 text-gray-900"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Complete Your Purchase
            </motion.h1>
            
            {/* Product Summary */}
            <motion.div 
              className="bg-gray-50 p-6 rounded-lg mb-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ 
                backgroundColor: "#f9fafb",
                scale: 1.02,
                rotateY: 2
              }}
            >
              <h2 className="text-xl font-semibold mb-4">What You're Getting:</h2>
              <div className="space-y-3">
                <motion.div 
                  className="flex justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <span>30 Proven AI Prompts for Making Money</span>
                  <span className="font-semibold">$10.00</span>
                </motion.div>
                <motion.div 
                  className="border-t pt-3"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>$10.00</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Features List */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="font-semibold mb-4">Included in your purchase:</h3>
              <ul className="space-y-2 text-gray-600">
                {[
                  "30 High-Converting AI Prompts",
                  "Instant PDF Download",
                  "Commercial Use License",
                  "Lifetime Access",
                  "Works with ChatGPT, Claude & More"
                ].map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    whileHover={{ 
                      x: 5,
                      color: "#059669"
                    }}
                  >
                    <motion.span 
                      className="text-green-500 mr-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.7 + index * 0.1,
                        type: "spring",
                        stiffness: 300
                      }}
                    >
                      ✓
                    </motion.span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Security Badges */}
            <motion.div 
              className="flex justify-center items-center space-x-4 mb-8 text-sm text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[
                { icon: "🔒", text: "Secure Payment" },
                { icon: "⚡", text: "Instant Download" },
                { icon: "💳", text: "Stripe Protected" }
              ].map((badge, index) => (
                <motion.span 
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.9 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    color: "#374151"
                  }}
                >
                  <span className="mr-1">{badge.icon}</span>
                  {badge.text}
                </motion.span>
              ))}
            </motion.div>

            {/* Checkout Button */}
            <motion.button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-yellow-400 text-black font-bold py-4 px-6 rounded-lg text-lg hover:bg-yellow-300 transition-colors disabled:opacity-50"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(251, 191, 36, 0.5)",
                rotateX: -2
              }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Processing...' : 'Complete Purchase - $10'}
            </motion.button>

            <motion.p 
              className="text-center text-sm text-gray-500 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            >
              Powered by Stripe • Your payment information is secure and encrypted
            </motion.p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

