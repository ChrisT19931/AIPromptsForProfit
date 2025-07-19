'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BuyButton from '../../../components/BuyButton';
import { samplePrompts } from '../../../data/prompts';

export default function Preview() {
  const previewStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Preview AI Prompts - Money-Making ChatGPT Prompts Sample",
    "description": "Preview 5 sample AI prompts from our collection of 30 proven money-making prompts for ChatGPT. Australian-designed AI tools for business success.",
    "url": "https://www.ventaroai.com/preview",
    "mainEntity": {
      "@type": "Product",
      "name": "30 AI Prompts Collection",
      "description": "Premium AI prompts for making money online with ChatGPT",
      "brand": {
        "@type": "Brand",
        "name": "Ventaro AI"
      },
      "offers": {
        "@type": "Offer",
        "price": "10.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.ventaroai.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Preview AI Prompts",
          "item": "https://www.ventaroai.com/preview"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(previewStructuredData),
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black to-gray-900 text-white py-16 px-6 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-10 right-10 w-40 h-40 bg-gray-400/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Preview Our <motion.span 
              className="text-gray-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Money-Making
            </motion.span> Prompts
          </motion.h1>
          <motion.p 
            className="text-xl mb-8 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            See exactly what you&apos;ll get. These 5 samples are just the beginning...
          </motion.p>
        </div>
      </section>

      {/* Preview Prompts */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {samplePrompts.map((prompt, index) => (
              <motion.div 
                key={prompt.id} 
                className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  rotateX: 2,
                  rotateY: 2,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                viewport={{ once: true }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <motion.h3 
                    className="text-2xl font-bold text-black group-hover:text-gray-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    {prompt.title}
                  </motion.h3>
                  <motion.span 
                    className="bg-gray-400 text-black px-3 py-1 rounded-full text-sm font-bold"
                    whileHover={{ 
                      scale: 1.1,
                      rotateZ: 5,
                      backgroundColor: "#9ca3af"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    #{prompt.id}
                  </motion.span>
                </div>
                <motion.p 
                  className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                >
                  {prompt.preview}
                </motion.p>
                
                {/* Blurred Full Prompt */}
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                >
                  <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-400 group-hover:bg-gray-100 transition-colors">
                    <p className="text-sm text-gray-500 mb-2 font-semibold">FULL PROMPT:</p>
                    <div className="relative">
                      <p className="text-gray-700 filter blur-sm select-none">
                        {prompt.fullPrompt}
                      </p>
                      <Link href="/buy" className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-white flex items-center justify-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div 
                            className="bg-black text-white px-6 py-3 rounded-lg font-semibold cursor-pointer"
                            whileHover={{ 
                              scale: 1.1,
                              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
                              rotateY: 5
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            🔒 Unlock to View Full Prompt
                          </motion.div>
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* What You'll Get Section */}
          <motion.div 
            className="mt-20 bg-gradient-to-br from-gray-50 to-white p-12 rounded-xl border-2 border-gray-200"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl font-bold text-center mb-12 text-gray-900"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              What You'll Get in the Full Collection
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "💰",
                  title: "Sales & Marketing Prompts",
                  description: "High-converting email sequences, product descriptions, and sales copy that turn prospects into customers",
                  examples: ["Email marketing campaigns", "Product launch sequences", "Sales page copy"]
                },
                {
                  icon: "🚀",
                  title: "Content Creation Arsenal",
                  description: "Viral social media content, YouTube scripts, and blog posts that engage and convert audiences",
                  examples: ["YouTube video scripts", "Instagram captions", "Blog post outlines"]
                },
                {
                  icon: "💼",
                  title: "Freelancing Success Kit",
                  description: "Winning proposals, client communication templates, and project delivery frameworks",
                  examples: ["Upwork proposals", "Client onboarding", "Project scopes"]
                },
                {
                  icon: "🎯",
                  title: "E-commerce Optimization",
                  description: "Product research, listing optimization, and customer service automation for online stores",
                  examples: ["Amazon listings", "Shopify descriptions", "Customer support"]
                },
                {
                  icon: "📊",
                  title: "Business Strategy Tools",
                  description: "Market analysis, competitor research, and business plan development prompts",
                  examples: ["Market research", "SWOT analysis", "Business plans"]
                },
                {
                  icon: "🔥",
                  title: "Lead Generation Machines",
                  description: "Cold outreach templates, networking scripts, and lead qualification frameworks",
                  examples: ["Cold emails", "LinkedIn outreach", "Lead magnets"]
                }
              ].map((category, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 group hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="text-4xl mb-4"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {category.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-gray-700 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">
                    {category.description}
                  </p>
                  <div className="space-y-2">
                    {category.examples.map((example, i) => (
                      <motion.div 
                        key={i}
                        className="flex items-center text-sm text-gray-500"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + i * 0.1 }}
                      >
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        {example}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Value Proposition */}
          <motion.div 
            className="mt-16 bg-gradient-to-r from-gray-100 to-gray-200 p-10 rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <motion.h3 
                className="text-3xl font-bold mb-6 text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Why These Prompts Are Different
              </motion.h3>
              
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                {[
                  {
                    icon: "⚡",
                    title: "Instant Results",
                    description: "Copy, paste, and start earning. No learning curve required."
                  },
                  {
                    icon: "🎯",
                    title: "Proven & Tested",
                    description: "Each prompt has been refined through real-world application."
                  },
                  {
                    icon: "🔄",
                    title: "Reusable Forever",
                    description: "Use them unlimited times across different projects and clients."
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      className="text-5xl mb-4"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      {benefit.icon}
                    </motion.div>
                    <h4 className="text-xl font-bold mb-2 text-gray-900">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div 
            className="text-center mt-16 bg-gradient-to-br from-black to-gray-900 text-white p-12 rounded-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 50, rotateX: -10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}
            viewport={{ once: true }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-400/10 via-transparent to-gray-400/10"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <motion.h2 
              className="text-3xl font-bold mb-4 relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Ready to Unlock All 30 Prompts?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 text-gray-300 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              These 5 samples are just 16% of what you&apos;ll get. Imagine having 30 proven prompts at your fingertips.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative z-10"
            >
              <BuyButton size="lg" />
            </motion.div>
            <motion.p 
              className="mt-4 text-gray-400 relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              ⚡ Instant access • Download immediately • Start making money today
            </motion.p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

