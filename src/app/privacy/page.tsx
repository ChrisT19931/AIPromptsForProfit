'use client';

import { motion } from 'framer-motion';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function PrivacyPolicy() {
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