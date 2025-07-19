'use client';

import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BuyButton from '../../components/BuyButton';
import Link from 'next/link';
import { faqs } from '../../data/faq';
import Head from 'next/head';

export default function Home() {
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "30 Proven AI Prompts for Making Money Online",
    "description": "Battle-tested AI prompts for ChatGPT to help you earn money through sales, marketing, freelancing, and e-commerce. Australian-designed digital product.",
    "brand": {
      "@type": "Brand",
      "name": "Ventaro AI"
    },
    "offers": {
      "@type": "Offer",
      "price": "10.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Ventaro AI"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "category": "AI Tools",
    "keywords": "AI prompts, ChatGPT, make money online, Australian AI tools"
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      </Head>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-24 px-6 relative overflow-hidden">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-10 w-40 h-40 bg-gray-400/10 rounded-full blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-32 h-32 bg-gray-500/10 rounded-full blur-xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-24 h-24 bg-gray-300/10 rounded-full blur-xl"
            animate={{
              x: [-50, 50, -50],
              y: [30, -30, 30],
              scale: [0.9, 1.1, 0.9],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute bottom-40 left-20 w-36 h-36 bg-gray-600/10 rounded-full blur-xl"
            animate={{
              x: [40, -40, 40],
              y: [-20, 20, -20],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div className="relative">
            {/* Top Brand Name */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 30px rgba(255,255,255,0.15)'
                }}
                whileHover={{
                  scale: 1.03,
                  textShadow: '0 0 40px rgba(255,255,255,0.25)'
                }}
              >
                VENTARO AI
              </motion.h1>
              <motion.div 
                className="w-32 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto mt-2 rounded-full"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 128, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ width: 160, background: 'linear-gradient(to right, #9CA3AF, #6B7280, #4B5563)' }}
              />
            </motion.div>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-300 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              At the forefront of AI innovation in 2025 • More coming soon
            </motion.p>
            
            {/* Main Title with Hover Animation */}
            <motion.h2 
              className="text-4xl md:text-7xl font-black mb-8 leading-tight relative z-10 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{
                scale: 1.05,
                rotateX: 5,
                rotateY: 5
              }}
              style={{
                background: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 50%, #4B5563 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2)',
                filter: 'drop-shadow(0 2px 4px rgba(107, 114, 128, 0.5))',
                transformStyle: 'preserve-3d'
              }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, rotateX: 15 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  transition: { duration: 2, repeat: Infinity }
                }}
              >
                AI PROMPTS FOR PROFIT
              </motion.span>
            </motion.h2>
            

            
            {/* 3D Background Elements */}
            <motion.div
              className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-gray-400/20 to-gray-600/20 rounded-lg blur-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              style={{ transform: 'translateZ(-10px)' }}
            />
          </motion.div>
          <motion.p 
            className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Transform ChatGPT, Claude, Gemini, Grok & more into your personal money-making machine with battle-tested prompts for sales, marketing, freelancing, and e-commerce.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link 
                href="/preview"
                className="bg-white text-black px-8 py-4 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 relative overflow-hidden group"
              >
                <span className="relative z-10">Preview Prompts</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.6 }}
                />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, rotateY: -5 }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <BuyButton size="lg" />
            </motion.div>
          </motion.div>
          <motion.p 
            className="mt-6 text-gray-300 bg-gray-800/50 px-6 py-2 rounded-full inline-block mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(31, 41, 55, 0.7)' }}
          >
            ⚡ Instant download • 30 proven prompts • $10 one-time
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Make Money with ChatGPT in Every Area
            <motion.div 
              className="w-48 h-1 bg-gradient-to-r from-gray-300 to-gray-500 mx-auto mt-4 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 192, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "💰",
                title: "Sales & Marketing",
                description: "Generate high-converting sales emails, product descriptions, and marketing copy that turns prospects into paying customers.",
                delay: 0
              },
              {
                icon: "🚀",
                title: "Content Creation",
                description: "Create viral social media content, YouTube scripts, and blog posts that engage audiences and drive traffic.",
                delay: 0.2
              },
              {
                icon: "💼",
                title: "Freelancing",
                description: "Win more clients with compelling proposals, deliver better work faster, and scale your freelance business.",
                delay: 0.4
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg group cursor-pointer"
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ 
                  y: -10, 
                  rotateX: 5,
                  rotateY: 5,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                viewport={{ once: true }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl flex items-center justify-center mb-6 group-hover:from-gray-200 group-hover:to-gray-400 transition-all shadow-lg"
                  whileHover={{ rotateY: 180, scale: 1.1, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-3xl">{feature.icon}</span>
                </motion.div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-gray-700 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}
          >
            🚀 Stay Ahead of the AI Revolution
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Subscribe to Ventaro AI for exclusive access to cutting-edge AI tools, prompts, and business strategies
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <input 
              type="email" 
              placeholder="Enter your email for AI updates"
              className="flex-1 px-6 py-4 rounded-lg text-black font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-lg border border-gray-200"
            />
            <motion.button 
              className="bg-gradient-to-r from-gray-300 to-gray-500 text-black font-bold px-8 py-4 rounded-lg hover:from-gray-200 hover:to-gray-400 transition-all shadow-lg relative overflow-hidden group"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Subscribe</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          </motion.div>
          <motion.p 
            className="text-sm text-gray-400 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            No spam, just AI gold 💎
          </motion.p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black text-white relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-400/5 via-transparent to-gray-400/5"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Stop Struggling with AI. Start Making Money.
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            These aren't just prompts - they're your shortcut to profitable AI automation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <BuyButton size="lg" className="mb-4" />
          </motion.div>
          <motion.p 
            className="text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Join thousands already making money with AI
          </motion.p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 text-gray-900"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  rotateX: 2
                }}
                viewport={{ once: true }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-gray-700 transition-colors">
                  {faq.question}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

