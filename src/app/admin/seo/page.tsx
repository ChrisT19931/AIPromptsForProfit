'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SEOTools() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');

  const handleSitemapSubmission = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/submit-sitemap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        setLastSubmission(new Date().toLocaleString());
        alert('Sitemap successfully submitted to Google and Bing!');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Sitemap submission error:', error);
      alert('Failed to submit sitemap. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateVerificationCode = () => {
    const code = `<meta name="google-site-verification" content="${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}" />`;
    setVerificationCode(code);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const seoChecklist = [
    { item: 'Meta titles optimized', status: 'complete', description: 'All pages have unique, keyword-rich titles' },
    { item: 'Meta descriptions added', status: 'complete', description: 'Compelling descriptions under 160 characters' },
    { item: 'Open Graph tags', status: 'complete', description: 'Social media sharing optimized' },
    { item: 'Twitter Card tags', status: 'complete', description: 'Twitter sharing optimized' },
    { item: 'Structured data', status: 'complete', description: 'Schema.org markup implemented' },
    { item: 'Canonical URLs', status: 'pending', description: 'Prevent duplicate content issues' },
    { item: 'Image alt tags', status: 'pending', description: 'All images need descriptive alt text' },
    { item: 'Internal linking', status: 'pending', description: 'Strategic internal link structure' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SEO Tools</h1>
        <p className="text-gray-600 mt-2">Manage your search engine optimization and submissions</p>
      </div>

      {/* Google Submission */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Search Engine Submission</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Sitemap Submission</h3>
            <p className="text-gray-600 mb-4">Submit your sitemap to Google and Bing for faster indexing.</p>
            <button
              onClick={handleSitemapSubmission}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Sitemap'}
            </button>
            {lastSubmission && (
              <p className="text-sm text-green-600 mt-2">
                Last submitted: {lastSubmission}
              </p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick Links</h3>
            <div className="space-y-2">
              <a 
                href="/sitemap.xml" 
                target="_blank" 
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                📄 View Sitemap
              </a>
              <a 
                href="/robots.txt" 
                target="_blank" 
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                🤖 View Robots.txt
              </a>
              <a 
                href="https://search.google.com/search-console" 
                target="_blank" 
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                🔍 Google Search Console
              </a>
              <a 
                href="https://www.bing.com/webmasters" 
                target="_blank" 
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                🔍 Bing Webmaster Tools
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Verification Code Generator */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔐 Search Console Verification</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            Generate a verification meta tag for Google Search Console setup.
          </p>
          <button
            onClick={generateVerificationCode}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Generate Verification Code
          </button>
          {verificationCode && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Copy this meta tag to your site's &lt;head&gt; section:</p>
              <div className="bg-white border rounded p-3 font-mono text-sm break-all">
                {verificationCode}
              </div>
              <button
                onClick={() => copyToClipboard(verificationCode)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* SEO Checklist */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">📋 SEO Checklist</h2>
        <div className="space-y-4">
          {seoChecklist.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start space-x-3 p-4 border rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                item.status === 'complete' ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                {item.status === 'complete' ? '✓' : '⚠'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.item}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Schema.org Tools */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">🏗️ Structured Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Current Schema</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Organization Schema
              </li>
              <li className="flex items-center text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Product Schema
              </li>
              <li className="flex items-center text-yellow-600">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                FAQ Schema (Pending)
              </li>
              <li className="flex items-center text-yellow-600">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Review Schema (Pending)
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Testing Tools</h3>
            <div className="space-y-2">
              <a 
                href="https://search.google.com/test/rich-results" 
                target="_blank" 
                className="block text-blue-600 hover:text-blue-800 underline text-sm"
              >
                🔍 Google Rich Results Test
              </a>
              <a 
                href="https://validator.schema.org/" 
                target="_blank" 
                className="block text-blue-600 hover:text-blue-800 underline text-sm"
              >
                ✅ Schema.org Validator
              </a>
              <a 
                href="https://developers.google.com/search/docs/appearance/structured-data" 
                target="_blank" 
                className="block text-blue-600 hover:text-blue-800 underline text-sm"
              >
                📚 Google Structured Data Guide
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}