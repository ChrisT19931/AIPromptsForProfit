'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: string;
  topPages: { page: string; views: number; }[];
  trafficSources: { source: string; percentage: number; color: string; }[];
  searchQueries: { query: string; impressions: number; clicks: number; ctr: number; position: number; }[];
  recentAlerts: { type: string; message: string; date: string; severity: 'info' | 'warning' | 'error'; }[];
}

const mockAnalyticsData: AnalyticsData = {
  pageViews: 15420,
  uniqueVisitors: 8930,
  bounceRate: 42.3,
  avgSessionDuration: '2:34',
  topPages: [
    { page: '/', views: 5420 },
    { page: '/buy', views: 3210 },
    { page: '/preview', views: 2890 },
    { page: '/download', views: 1650 },
    { page: '/login', views: 890 }
  ],
  trafficSources: [
    { source: 'Organic Search', percentage: 45.2, color: 'bg-green-500' },
    { source: 'Direct', percentage: 28.7, color: 'bg-blue-500' },
    { source: 'Social Media', percentage: 15.3, color: 'bg-purple-500' },
    { source: 'Referral', percentage: 8.1, color: 'bg-orange-500' },
    { source: 'Email', percentage: 2.7, color: 'bg-red-500' }
  ],
  searchQueries: [
    { query: 'ai prompts for money', impressions: 12450, clicks: 890, ctr: 7.1, position: 3.2 },
    { query: 'chatgpt prompts profit', impressions: 8920, clicks: 567, ctr: 6.4, position: 4.1 },
    { query: 'ai tools make money', impressions: 6780, clicks: 423, ctr: 6.2, position: 5.3 },
    { query: 'ventaro ai', impressions: 4560, clicks: 312, ctr: 6.8, position: 2.1 },
    { query: 'ai prompts download', impressions: 3890, clicks: 234, ctr: 6.0, position: 6.2 }
  ],
  recentAlerts: [
    { type: 'Traffic Spike', message: 'Traffic increased by 45% in the last 24 hours', date: '2024-01-15', severity: 'info' },
    { type: 'New Backlink', message: 'New high-quality backlink from techcrunch.com', date: '2024-01-15', severity: 'info' },
    { type: 'SEO Warning', message: 'Page load speed decreased on /buy page', date: '2024-01-14', severity: 'warning' },
    { type: 'Search Console', message: 'New search queries driving traffic', date: '2024-01-14', severity: 'info' },
    { type: 'Error', message: '404 errors increased by 15%', date: '2024-01-13', severity: 'error' }
  ]
};

export default function AnalyticsPage() {
  const [analyticsData] = useState<AnalyticsData>(mockAnalyticsData);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isConnected, setIsConnected] = useState({
    googleAnalytics: true,
    searchConsole: true,
    emailAlerts: false
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const handleConnectService = (service: string) => {
    setIsConnected(prev => ({ ...prev, [service]: !prev[service as keyof typeof prev] }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Tracking</h1>
          <p className="text-gray-600 mt-2">Monitor your website performance and SEO metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Connection Status */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔗 Service Connections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'googleAnalytics', name: 'Google Analytics', icon: '📊', description: 'Website traffic and user behavior' },
            { key: 'searchConsole', name: 'Google Search Console', icon: '🔍', description: 'Search performance and SEO data' },
            { key: 'emailAlerts', name: 'Email Alerts', icon: '📧', description: 'Automated notifications and reports' }
          ].map((service) => (
            <div key={service.key} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{service.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-xs text-gray-600">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                    isConnected[service.key as keyof typeof isConnected] ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className={`text-sm font-medium ${
                    isConnected[service.key as keyof typeof isConnected] ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isConnected[service.key as keyof typeof isConnected] ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleConnectService(service.key)}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  isConnected[service.key as keyof typeof isConnected]
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isConnected[service.key as keyof typeof isConnected] ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {[
          { label: 'Page Views', value: analyticsData.pageViews.toLocaleString(), icon: '👁️', color: 'bg-blue-500', change: '+12.5%' },
          { label: 'Unique Visitors', value: analyticsData.uniqueVisitors.toLocaleString(), icon: '👥', color: 'bg-green-500', change: '+8.3%' },
          { label: 'Bounce Rate', value: `${analyticsData.bounceRate}%`, icon: '⚡', color: 'bg-orange-500', change: '-2.1%' },
          { label: 'Avg Session', value: analyticsData.avgSessionDuration, icon: '⏱️', color: 'bg-purple-500', change: '+15.2%' }
        ].map((metric) => (
          <div key={metric.label} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className={`${metric.color} rounded-lg p-3 text-white text-xl`}>
                {metric.icon}
              </div>
              <span className={`text-sm font-medium ${
                metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-600">{metric.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <motion.div 
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">📄 Top Pages</h2>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-900 font-medium">{page.page}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(page.views / analyticsData.topPages[0].views) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-600 text-sm font-medium">{page.views.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div 
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 Traffic Sources</h2>
          <div className="space-y-3">
            {analyticsData.trafficSources.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 ${source.color} rounded-full mr-3`}></div>
                  <span className="text-gray-900 font-medium">{source.source}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className={`${source.color} h-2 rounded-full`} 
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-600 text-sm font-medium">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Search Console Data */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Search Console Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Query
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impressions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.searchQueries.map((query) => (
                <tr key={query.query} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {query.query}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {query.impressions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {query.clicks.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {query.ctr}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {query.position}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Alerts */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">🚨 Recent Alerts</h2>
        <div className="space-y-3">
          {analyticsData.recentAlerts.map((alert, index) => (
            <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start">
                <span className="text-xl mr-3">{getSeverityIcon(alert.severity)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{alert.type}</h3>
                    <span className="text-xs opacity-75">{new Date(alert.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm mt-1">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium">Export Report</div>
          </button>
          <button className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors">
            <div className="text-2xl mb-2">📧</div>
            <div className="text-sm font-medium">Setup Alerts</div>
          </button>
          <button className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors">
            <div className="text-2xl mb-2">🔍</div>
            <div className="text-sm font-medium">SEO Audit</div>
          </button>
          <button className="bg-orange-600 text-white p-4 rounded-lg text-center hover:bg-orange-700 transition-colors">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="text-sm font-medium">Settings</div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}