'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getStripe } from '../../../lib/stripe';

export default function Buy() {
  const [isLoading, setIsLoading] = useState(false);

  const buyPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "30 Proven AI Prompts for Making Money Online",
    "description": "Complete collection of 30 battle-tested AI prompts for ChatGPT to help you earn money through sales, marketing, freelancing, and e-commerce. Australian-designed digital product with instant download.",
    "brand": {
      "@type": "Brand",
      "name": "Ventaro AI",
      "url": "https://www.ventaroai.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "10.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31",
      "seller": {
        "@type": "Organization",
        "name": "Ventaro AI",
        "url": "https://www.ventaroai.com"
      },
      "acceptedPaymentMethod": [
        "https://schema.org/CreditCard",
        "https://schema.org/PaymentCard"
      ],
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
        "merchantReturnDays": 0
      }
    },
    "category": "AI Tools",
    "productID": "VENTARO-AI-PROMPTS-30",
    "sku": "VAI-30P-001",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Sarah M."
        },
        "reviewBody": "These AI prompts transformed my freelancing business. I'm earning 3x more with ChatGPT now!"
      }
    ]
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buyPageStructuredData),
        }}
      />
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
            <motion.div className="text-center mb-8">
              <motion.h1 
                className="text-4xl font-bold mb-4 text-gray-900"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Complete Your Purchase
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                You're one step away from unlocking 30 proven AI prompts
              </motion.p>
            </motion.div>
            
            {/* Order Summary */}
            <motion.div 
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl mb-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.15)"
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                <span className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm font-medium font-bold">Best Value</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🚀</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">30 AI Prompts Collection</h3>
                      <p className="text-sm text-gray-600">Instant PDF download</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">$10.00</div>
                    <div className="text-sm text-gray-500 line-through">$47.00</div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-800">$10.00</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">One-time payment • No subscriptions</p>
                </div>
              </div>
            </motion.div>

            {/* What's Included */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-900">What's Included:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: "🎯", title: "30 High-Converting AI Prompts", desc: "Battle-tested for maximum results" },
                  { icon: "⚡", title: "Instant PDF Download", desc: "Access immediately after purchase" },
                  { icon: "💼", title: "Commercial Use License", desc: "Use for your business legally" },
                  { icon: "♾️", title: "Lifetime Access", desc: "Download anytime, forever" },
                  { icon: "🤖", title: "Multi-AI Compatible", desc: "Works with ChatGPT, Claude & more" },
                  { icon: "📧", title: "Email Support", desc: "Get help when you need it" }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    whileHover={{ 
                      x: 5,
                      backgroundColor: "#f9fafb"
                    }}
                  >
                    <motion.span 
                      className="text-2xl"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.7 + index * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      {feature.icon}
                    </motion.span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

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

            <motion.button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white font-bold py-5 px-8 rounded-xl text-xl hover:from-gray-700 hover:to-gray-900 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px -10px rgba(75, 85, 99, 0.4)",
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🔒 Secure Checkout - $10.00</span>
                </div>
              )}
            </motion.button>

            <motion.p 
              className="text-center text-sm text-gray-500 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            >
              Powered by Stripe • Your payment information is secure and encrypted
            </motion.p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

