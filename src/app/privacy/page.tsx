'use client';

import { motion } from 'framer-motion';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Head from 'next/head';

export default function PrivacyPolicy() {
  const privacyStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - Ventaro AI",
    "description": "Privacy policy for Ventaro AI, explaining how we collect, use, and protect your personal information when you purchase our AI prompts and tools.",
    "url": "https://ventaroai.com/privacy",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Ventaro AI",
      "url": "https://ventaroai.com"
    },
    "dateModified": "2025-01-01",
    "inLanguage": "en-AU"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>Privacy Policy - Ventaro AI | Australian AI Tools Company</title>
        <meta name="description" content="Read Ventaro AI's privacy policy. Learn how we protect your data when you purchase our AI prompts and tools. Australian privacy standards." />
        <meta name="keywords" content="privacy policy, data protection, Australian privacy, AI tools privacy, Ventaro AI privacy, personal information protection, GDPR compliance" />
        <meta property="og:title" content="Privacy Policy - Ventaro AI" />
        <meta property="og:description" content="Our commitment to protecting your privacy and data security when using Ventaro AI products." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ventaroai.com/privacy" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Privacy Policy - Ventaro AI" />
        <meta name="twitter:description" content="Learn how Ventaro AI protects your personal information and privacy." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ventaroai.com/privacy" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(privacyStructuredData),
          }}
        />
      </Head>
      <Header />
      
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-3xl font-bold mb-8 text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Privacy Policy
            </motion.h1>
            
            <motion.div 
              className="prose max-w-none text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="mb-6"><strong>Last updated:</strong> January 2025</p>
              
              <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you make a purchase, 
                contact us for support, or sign up for our services. This may include your name, 
                email address, and payment information.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Process your purchases and deliver digital products</li>
                <li>Provide customer support</li>
                <li>Send you important updates about your purchase</li>
                <li>Improve our products and services</li>
              </ul>
              
              <h2 className="text-xl font-semibold mb-4">Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                except as described in this policy. We may share information with trusted service providers 
                who assist us in operating our website and conducting our business.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information. 
                All payment processing is handled securely through Stripe.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                <strong>Email:</strong> chris.t@ventarosales.com
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}