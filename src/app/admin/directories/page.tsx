'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Directory {
  name: string;
  url: string;
  category: string;
  description: string;
  requirements: string;
  status: 'not_submitted' | 'submitted' | 'approved' | 'rejected';
  submissionDate?: string;
  notes?: string;
}

const directories: Directory[] = [
  {
    name: 'Product Hunt',
    url: 'https://www.producthunt.com/posts/new',
    category: 'Product Launch',
    description: 'The best new products in tech',
    requirements: 'Product images, description, maker profile',
    status: 'submitted',
    submissionDate: '2024-01-15',
    notes: 'Scheduled for launch on Jan 20th'
  },
  {
    name: 'Indie Hackers',
    url: 'https://www.indiehackers.com/products/new',
    category: 'Startup Community',
    description: 'Community of indie entrepreneurs',
    requirements: 'Revenue data, story, metrics',
    status: 'approved',
    submissionDate: '2024-01-10',
    notes: 'Featured in newsletter'
  },
  {
    name: 'BetaList',
    url: 'https://betalist.com/submit',
    category: 'Beta Products',
    description: 'Discover and get early access to tomorrow\'s startups',
    requirements: 'Beta access, screenshots, description',
    status: 'submitted',
    submissionDate: '2024-01-12'
  },
  {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com/submit',
    category: 'Tech News',
    description: 'Social news website focusing on computer science',
    requirements: 'Interesting story, good timing',
    status: 'not_submitted'
  },
  {
    name: 'AngelList',
    url: 'https://angel.co/company/new',
    category: 'Startup Directory',
    description: 'Platform for startups and investors',
    requirements: 'Company profile, team info, funding status',
    status: 'approved',
    submissionDate: '2024-01-08'
  },
  {
    name: 'Crunchbase',
    url: 'https://www.crunchbase.com/organization/new',
    category: 'Business Directory',
    description: 'Platform for finding business information',
    requirements: 'Company details, funding info, team',
    status: 'submitted',
    submissionDate: '2024-01-14'
  },
  {
    name: 'G2',
    url: 'https://www.g2.com/products/new',
    category: 'Software Reviews',
    description: 'Business software reviews and ratings',
    requirements: 'Product demo, pricing, features',
    status: 'not_submitted'
  },
  {
    name: 'Capterra',
    url: 'https://www.capterra.com/vendors/sign-up',
    category: 'Software Directory',
    description: 'Software discovery platform',
    requirements: 'Software details, pricing, screenshots',
    status: 'not_submitted'
  },
  {
    name: 'AlternativeTo',
    url: 'https://alternativeto.net/software/new/',
    category: 'Software Alternatives',
    description: 'Find alternatives to software',
    requirements: 'Software description, alternatives, features',
    status: 'not_submitted'
  },
  {
    name: 'Startup Stash',
    url: 'https://startupstash.com/submit-a-resource/',
    category: 'Startup Resources',
    description: 'Curated resources for startups',
    requirements: 'Resource description, category, usefulness',
    status: 'not_submitted'
  },
  {
    name: 'SaaS Hub',
    url: 'https://www.saashub.com/submit-software',
    category: 'SaaS Directory',
    description: 'Software as a Service directory',
    requirements: 'SaaS details, pricing, features',
    status: 'not_submitted'
  },
  {
    name: 'Startup Buffer',
    url: 'https://startupbuffer.com/submit',
    category: 'Startup Showcase',
    description: 'Showcase for new startups',
    requirements: 'Startup story, screenshots, team info',
    status: 'not_submitted'
  },
  {
    name: 'Launching Next',
    url: 'https://www.launchingnext.com/submit/',
    category: 'Product Launch',
    description: 'Upcoming product launches',
    requirements: 'Launch date, product details, images',
    status: 'not_submitted'
  },
  {
    name: 'Startup Ranking',
    url: 'https://www.startupranking.com/submit',
    category: 'Startup Directory',
    description: 'Global startup ranking platform',
    requirements: 'Company info, website, social media',
    status: 'not_submitted'
  },
  {
    name: 'Beta Bound',
    url: 'https://www.betabound.com/announce/',
    category: 'Beta Testing',
    description: 'Beta testing community',
    requirements: 'Beta program details, testing requirements',
    status: 'not_submitted'
  }
];

export default function DirectoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', ...Array.from(new Set(directories.map(d => d.category)))];
  const statuses = ['all', 'not_submitted', 'submitted', 'approved', 'rejected'];

  const filteredDirectories = directories.filter(directory => {
    const matchesCategory = selectedCategory === 'all' || directory.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || directory.status === selectedStatus;
    const matchesSearch = directory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         directory.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅';
      case 'submitted': return '⏳';
      case 'rejected': return '❌';
      default: return '📝';
    }
  };

  const stats = {
    total: directories.length,
    submitted: directories.filter(d => d.status === 'submitted').length,
    approved: directories.filter(d => d.status === 'approved').length,
    pending: directories.filter(d => d.status === 'not_submitted').length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Press & Directory Submissions</h1>
        <p className="text-gray-600 mt-2">Manage submissions to high-quality directories and platforms</p>
      </div>

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {[
          { label: 'Total Directories', value: stats.total, icon: '📁', color: 'bg-blue-500' },
          { label: 'Approved', value: stats.approved, icon: '✅', color: 'bg-green-500' },
          { label: 'Submitted', value: stats.submitted, icon: '⏳', color: 'bg-yellow-500' },
          { label: 'Pending', value: stats.pending, icon: '📝', color: 'bg-gray-500' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 text-white text-xl mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search directories..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Directories Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredDirectories.map((directory, index) => (
          <motion.div
            key={directory.name}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{directory.name}</h3>
                <p className="text-sm text-gray-600">{directory.category}</p>
              </div>
              <div className="flex items-center">
                <span className="mr-2">{getStatusIcon(directory.status)}</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(directory.status)}`}>
                  {directory.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-4">{directory.description}</p>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
              <p className="text-xs text-gray-600">{directory.requirements}</p>
            </div>
            
            {directory.submissionDate && (
              <div className="mb-4">
                <p className="text-xs text-gray-500">
                  Submitted: {new Date(directory.submissionDate).toLocaleDateString()}
                </p>
                {directory.notes && (
                  <p className="text-xs text-gray-600 mt-1">{directory.notes}</p>
                )}
              </div>
            )}
            
            <div className="flex space-x-2">
              <a
                href={directory.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Visit Site
              </a>
              {directory.status === 'not_submitted' && (
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  Mark Submitted
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredDirectories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No directories found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Bulk Actions */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium">Export Report</div>
          </button>
          <button className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors">
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm font-medium">Bulk Update</div>
          </button>
          <button className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors">
            <div className="text-2xl mb-2">📧</div>
            <div className="text-sm font-medium">Email Templates</div>
          </button>
          <button className="bg-orange-600 text-white p-4 rounded-lg text-center hover:bg-orange-700 transition-colors">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-sm font-medium">Schedule Submissions</div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}