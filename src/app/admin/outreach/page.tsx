'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OutreachTools() {
  const [outreachList, setOutreachList] = useState('');
  const [emailTemplate, setEmailTemplate] = useState(`Subject: Partnership Opportunity - AI Prompts for Profit

Hi [CONTACT_NAME],

I hope this email finds you well. I'm reaching out from Ventaro AI, where we've developed a premium collection of AI prompts designed to help people earn money online.

I noticed your excellent content on [WEBSITE_NAME] and thought there might be a great opportunity for collaboration. Our AI prompts have helped hundreds of users generate income through various online channels.

Would you be interested in:
- Featuring our AI prompts in a review or roundup post?
- Exploring a partnership or affiliate opportunity?
- Receiving a complimentary copy to test and potentially share with your audience?

Our product: https://ventaroai.com
Key benefits: 30 proven AI prompts, instant download, money-back guarantee

I'd love to discuss how we could create value for your audience while building a mutually beneficial relationship.

Best regards,
Chris T.
Founder, Ventaro AI
chris.t@ventarosales.com`);
  const [isRunning, setIsRunning] = useState(false);
  const [outreachResults, setOutreachResults] = useState<any[]>([]);
  const [shareSnippets, setShareSnippets] = useState({
    html: '',
    markdown: '',
    email: '',
    twitter: '',
    linkedin: ''
  });

  useEffect(() => {
    // Generate share snippets
    const baseUrl = 'https://ventaroai.com';
    const title = 'Ventaro AI - Premium AI Prompts for Profit';
    const description = 'Discover 30 proven AI prompts designed to help you earn money online. Australian-made AI tools for ChatGPT, Claude, and more.';
    
    setShareSnippets({
      html: `<a href="${baseUrl}" target="_blank">${title}</a> - ${description}`,
      markdown: `[${title}](${baseUrl}) - ${description}`,
      email: `Check out ${title}: ${baseUrl}\n\n${description}`,
      twitter: `🚀 Just discovered ${title}! ${description} ${baseUrl} #AI #OnlineIncome #AIPrompts`,
      linkedin: `I wanted to share an interesting resource I found: ${title}\n\n${description}\n\nCheck it out: ${baseUrl}\n\n#AI #DigitalMarketing #OnlineIncome`
    });
  }, []);

  const handleRunOutreach = async () => {
    if (!outreachList.trim()) {
      alert('Please enter a list of websites to contact.');
      return;
    }

    setIsRunning(true);
    try {
      const websites = outreachList.split('\n').filter(url => url.trim());
      
      const response = await fetch('/api/admin/run-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websites,
          template: emailTemplate
        })
      });

      if (response.ok) {
        const results = await response.json();
        setOutreachResults(results.results || []);
        alert(`Outreach completed! Contacted ${results.successful || 0} sites successfully.`);
      } else {
        throw new Error('Outreach failed');
      }
    } catch (error) {
      console.error('Outreach error:', error);
      alert('Outreach campaign failed. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const loadOutreachHistory = async () => {
    try {
      const response = await fetch('/api/admin/outreach-history');
      if (response.ok) {
        const data = await response.json();
        setOutreachResults(data.results || []);
      }
    } catch (error) {
      console.error('Failed to load outreach history:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  useEffect(() => {
    loadOutreachHistory();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Outreach Automation</h1>
        <p className="text-gray-600 mt-2">Automate your link building and partnership outreach</p>
      </div>

      {/* Outreach Campaign */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">📧 Run Outreach Campaign</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URLs (one per line)
            </label>
            <textarea
              value={outreachList}
              onChange={(e) => setOutreachList(e.target.value)}
              placeholder={`https://example.com/contact\nhttps://anotherblog.com/about\nhttps://directory.com/submit`}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter contact pages, submission forms, or general website URLs
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Template
            </label>
            <textarea
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use [CONTACT_NAME] and [WEBSITE_NAME] as placeholders
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            ⚠️ This tool respects robots.txt and rate limits. Use responsibly.
          </div>
          <button
            onClick={handleRunOutreach}
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              isRunning
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRunning ? 'Running Campaign...' : 'Start Outreach Campaign'}
          </button>
        </div>
      </motion.div>

      {/* Share Snippets */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔗 Share Snippets Generator</h2>
        <p className="text-gray-600 mb-6">
          Copy-paste ready snippets for easy link building and social sharing.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'HTML Link', content: shareSnippets.html, icon: '🌐' },
            { label: 'Markdown Link', content: shareSnippets.markdown, icon: '📝' },
            { label: 'Email Template', content: shareSnippets.email, icon: '📧' },
            { label: 'Twitter Post', content: shareSnippets.twitter, icon: '🐦' },
            { label: 'LinkedIn Post', content: shareSnippets.linkedin, icon: '💼' },
          ].map((snippet, index) => (
            <div key={snippet.label} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">{snippet.icon}</span>
                  {snippet.label}
                </h3>
                <button
                  onClick={() => copyToClipboard(snippet.content)}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Copy
                </button>
              </div>
              <div className="bg-gray-50 rounded p-3 text-sm font-mono break-all max-h-24 overflow-y-auto">
                {snippet.content}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Outreach Results */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Outreach Results</h2>
        {outreachResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {outreachResults.map((result, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.website}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        result.status === 'success' 
                          ? 'bg-green-100 text-green-800'
                          : result.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {result.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📭</div>
            <p className="text-gray-500">No outreach campaigns run yet.</p>
            <p className="text-sm text-gray-400">Start your first campaign above to see results here.</p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 Quick Share Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Share on Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareSnippets.twitter)}`, icon: '🐦', color: 'bg-blue-400' },
            { label: 'Share on LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=https://ventaroai.com`, icon: '💼', color: 'bg-blue-600' },
            { label: 'Submit to Reddit', url: 'https://www.reddit.com/submit?url=https://ventaroai.com&title=Ventaro AI - Premium AI Prompts for Profit', icon: '🔴', color: 'bg-orange-500' },
            { label: 'Email a Friend', url: `mailto:?subject=Check out Ventaro AI&body=${encodeURIComponent(shareSnippets.email)}`, icon: '📧', color: 'bg-green-500' },
          ].map((action, index) => (
            <a
              key={action.label}
              href={action.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${action.color} text-white p-4 rounded-lg text-center hover:opacity-90 transition-opacity`}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-sm font-medium">{action.label}</div>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}