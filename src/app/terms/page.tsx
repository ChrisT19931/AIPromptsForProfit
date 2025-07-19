'use client';

import { motion } from 'framer-motion';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function TermsOfService() {
  const termsStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service - Ventaro AI",
    "description": "Terms of service and conditions for purchasing and using Ventaro AI's digital AI prompts products. Includes no refunds policy and usage rights.",
    "url": "https://ventaroai.com/terms",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Ventaro AI",
      "url": "https://ventaroai.com"
    },
    "dateModified": "2025-01-01",
    "inLanguage": "en-AU",
    "about": {
      "@type": "Thing",
      "name": "Digital Product Terms and Conditions"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
              Terms of Service
            </motion.h1>
            
            <motion.div 
              className="prose max-w-none text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="mb-6"><strong>Last updated:</strong> January 2025</p>
              
              <h2 className="text-xl font-semibold mb-4">Acceptance of Terms</h2>
              <p className="mb-4">
                By purchasing and using our AI Prompts for Profit digital products, you agree to be bound 
                by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">Product Description</h2>
              <p className="mb-4">
                Ventaro AI - AI Prompts For Profit provides digital products consisting of AI prompts 
                designed to help users generate income. All products are delivered digitally via PDF download.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">Refund Policy</h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="font-semibold text-red-800">NO REFUNDS POLICY</p>
                <p className="text-red-700">
                  Due to the digital nature of our products, all sales are final. We do not offer refunds 
                  for any reason once the product has been delivered. Please review the preview content 
                  carefully before making your purchase.
                </p>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Support & Issues</h2>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <p className="font-semibold text-green-800">We&apos;re Here to Help!</p>
                <p className="text-green-700">
                  While we don&apos;t offer refunds, we are committed to supporting our customers. If you 
                  experience any technical issues with downloading your product or have questions about 
                  using the prompts, please contact us immediately at chris.t@ventarosales.com. 
                  We will work diligently to resolve any legitimate issues.
                </p>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">License & Usage Rights</h2>
              <p className="mb-4">
                Upon purchase, you receive a commercial use license for the AI prompts. You may:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Use the prompts for personal and commercial purposes</li>
                <li>Modify and adapt the prompts for your specific needs</li>
                <li>Generate content using these prompts for profit</li>
              </ul>
              <p className="mb-4">
                You may NOT:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Resell or redistribute the original prompt collection</li>
                <li>Share the PDF file with others</li>
                <li>Claim ownership of the original prompts</li>
              </ul>
              
              <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="mb-4">
                Ventaro AI - AI Prompts For Profit provides these prompts &quot;as is&quot; without any guarantees 
                of specific results or income. Your success depends on various factors including your effort, 
                market conditions, and implementation.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <p className="mb-4">
                For any questions regarding these terms or our products, please contact:
                <br />
                <strong>Email:</strong> chris.t@ventarosales.com
                <br />
                <strong>Response Time:</strong> Within 24 hours
              </p>
              
              <h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective 
                immediately upon posting on our website.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}