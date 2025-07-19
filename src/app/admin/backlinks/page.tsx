'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Backlink {
  id: string;
  referringDomain: string;
  referringUrl: string;
  anchorText: string;
  linkType: 'dofollow' | 'nofollow';
  discoveredDate: string;
  domainAuthority: number;
  status: 'active' | 'lost' | 'new';
  traffic?: number;
}

const mockBacklinks: Backlink[] = [
  {
    id: '1',
    referringDomain: 'techcrunch.com',
    referringUrl: 'https://techcrunch.com/2024/01/15/ai-tools-roundup',
    anchorText: 'Ventaro AI',
    linkType: 'dofollow',
    discoveredDate: '2024-01-15',
    domainAuthority: 95,
    status: 'new',
    traffic: 1250
  },
  {
    id: '2',
    referringDomain: 'producthunt.com',
    referringUrl: 'https://www.producthunt.com/posts/ventaro-ai',
    anchorText: 'AI Prompts for Profit',
    linkType: 'dofollow',
    discoveredDate: '2024-01-14',
    domainAuthority: 88,
    status: 'active',
    traffic: 890
  },
  {
    id: '3',
    referringDomain: 'indiehackers.com',
    referringUrl: 'https://www.indiehackers.com/product/ventaro-ai',
    anchorText: 'check out this AI tool',
    linkType: 'dofollow',
    discoveredDate: '2024-01-12',
    domainAuthority: 82,
    status: 'active',
    traffic: 456
  },
  {
    id: '4',
    referringDomain: 'reddit.com',
    referringUrl: 'https://www.reddit.com/r/entrepreneur/comments/ai-prompts',
    anchorText: 'ventaroai.com',
    linkType: 'nofollow',
    discoveredDate: '2024-01-10',
    domainAuthority: 91,
    status: 'active',
    traffic: 234
  },
  {
    id: '5',
    referringDomain: 'betalist.com',
    referringUrl: 'https://betalist.com/startups/ventaro-ai',
    anchorText: 'Ventaro AI - AI Prompts',
    linkType: 'dofollow',
    discoveredDate: '2024-01-08',
    domainAuthority: 75,
    status: 'active',
    traffic: 123
  },
  {
    id: '6',
    referringDomain: 'example-blog.com',
    referringUrl: 'https://example-blog.com/ai-tools-2024',
    anchorText: 'AI prompts tool',
    linkType: 'dofollow',
    discoveredDate: '2024-01-05',
    domainAuthority: 45,
    status: 'lost',
    traffic: 0
  }
];

export default function BacklinksPage() {
  const [backlinks, setBacklinks] = useState<Backlink[]>(mockBacklinks);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLinkType, setSelectedLinkType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const filteredBacklinks = backlinks.filter(backlink => {
    const matchesStatus = selectedStatus === 'all' || backlink.status === selectedStatus;
    const matchesLinkType = selectedLinkType === 'all' || backlink.linkType === selectedLinkType;
    const matchesSearch = backlink.referringDomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backlink.anchorText.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesLinkType && matchesSearch;
  });

  const stats = {
    total: backlinks.length,
    active: backlinks.filter(b => b.status === 'active').length,
    new: backlinks.filter(b => b.status === 'new').length,
    lost: backlinks.filter(b => b.status === 'lost').length,
    dofollow: backlinks.filter(b => b.linkType === 'dofollow').length,
    avgDA: Math.round(backlinks.reduce((sum, b) => sum + b.domainAuthority, 0) / backlinks.length),
    totalTraffic: backlinks.reduce((sum, b) => sum + (b.traffic || 0), 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'new': return '🆕';
      case 'lost': return '❌';
      default: return '❓';
    }
  };

  const getDomainAuthorityColor = (da: number) => {
    if (da >= 80) return 'text-green-600 font-bold';
    if (da >= 60) return 'text-blue-600 font-semibold';
    if (da >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleScanBacklinks = async () => {
    setIsScanning(true);
    try {
      // Simulate API call to scan for new backlinks
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add a mock new backlink
      const newBacklink: Backlink = {
        id: Date.now().toString(),
        referringDomain: 'ai-news-today.com',
        referringUrl: 'https://ai-news-today.com/featured-tools',
        anchorText: 'Ventaro AI prompts',
        linkType: 'dofollow',
        discoveredDate: new Date().toISOString().split('T')[0],
        domainAuthority: 67,
        status: 'new',
        traffic: 89
      };
      
      setBacklinks(prev => [newBacklink, ...prev]);
      alert('Backlink scan completed! Found 1 new backlink.');
    } catch {
      alert('Backlink scan failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Backlink Monitoring</h1>
          <p className="text-gray-600 mt-2">Track and analyze your website&apos;s backlink profile</p>
        </div>
        <button
          onClick={handleScanBacklinks}
          disabled={isScanning}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            isScanning
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isScanning ? 'Scanning...' : '🔍 Scan for New Backlinks'}
        </button>
      </div>

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {[
          { label: 'Total Backlinks', value: stats.total, icon: '🔗', color: 'bg-blue-500' },
          { label: 'Active', value: stats.active, icon: '✅', color: 'bg-green-500' },
          { label: 'New', value: stats.new, icon: '🆕', color: 'bg-blue-500' },
          { label: 'Lost', value: stats.lost, icon: '❌', color: 'bg-red-500' },
          { label: 'Dofollow', value: stats.dofollow, icon: '🎯', color: 'bg-purple-500' },
          { label: 'Avg DA', value: stats.avgDA, icon: '📊', color: 'bg-orange-500' },
          { label: 'Traffic', value: stats.totalTraffic, icon: '👥', color: 'bg-indigo-500' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-2 text-white text-lg mr-3`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
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
              placeholder="Search domains or anchor text..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="new">New</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link Type</label>
            <select
              value={selectedLinkType}
              onChange={(e) => setSelectedLinkType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="dofollow">Dofollow</option>
              <option value="nofollow">Nofollow</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Backlinks Table */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referring Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anchor Text
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Traffic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discovered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBacklinks.map((backlink, index) => (
                <motion.tr 
                  key={backlink.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{backlink.referringDomain}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{backlink.referringUrl}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{backlink.anchorText}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      backlink.linkType === 'dofollow' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {backlink.linkType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getDomainAuthorityColor(backlink.domainAuthority)}`}>
                      {backlink.domainAuthority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-2">{getStatusIcon(backlink.status)}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(backlink.status)}`}>
                        {backlink.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {backlink.traffic ? backlink.traffic.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(backlink.discoveredDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <a
                        href={backlink.referringUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Visit
                      </a>
                      <button className="text-gray-600 hover:text-gray-900">
                        Track
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {filteredBacklinks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔗</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No backlinks found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Tools */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">🛠️ Backlink Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium">Export Report</div>
          </button>
          <button className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors">
            <div className="text-2xl mb-2">📧</div>
            <div className="text-sm font-medium">Email Alerts</div>
          </button>
          <button className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors">
            <div className="text-2xl mb-2">🔍</div>
            <div className="text-sm font-medium">Competitor Analysis</div>
          </button>
          <button className="bg-orange-600 text-white p-4 rounded-lg text-center hover:bg-orange-700 transition-colors">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="text-sm font-medium">Monitor Settings</div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}