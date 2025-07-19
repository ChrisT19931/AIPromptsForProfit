'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Link import removed as it's no longer used

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalSales: 0,
    backlinks: 0,
    outreachSent: 0,
    seoScore: 0,
  });

  const [recentActivity] = useState([
    { type: 'sale', message: 'New purchase completed', time: '2 hours ago' },
    { type: 'backlink', message: 'New backlink detected from example.com', time: '4 hours ago' },
    { type: 'outreach', message: 'Outreach campaign completed (15 sites)', time: '1 day ago' },
  ]);

  const quickActions = [
    {
      title: 'Submit to Google',
      description: 'Ping Google with updated sitemap',
      icon: '🔍',
      action: 'submitToGoogle',
      color: 'bg-green-500',
    },
    {
      title: 'Run Outreach',
      description: 'Start automated outreach campaign',
      icon: '📧',
      action: 'runOutreach',
      color: 'bg-blue-500',
    },
    {
      title: 'Check Backlinks',
      description: 'Scan for new backlinks',
      icon: '🔗',
      action: 'checkBacklinks',
      color: 'bg-purple-500',
    },
    {
      title: 'Generate Reports',
      description: 'Create SEO performance report',
      icon: '📊',
      action: 'generateReport',
      color: 'bg-orange-500',
    },
  ];

  const handleQuickAction = async (action: string) => {
    try {
      switch (action) {
        case 'submitToGoogle':
          await fetch('/api/admin/submit-sitemap', { method: 'POST' });
          alert('Sitemap submitted to Google successfully!');
          break;
        case 'runOutreach':
          window.location.href = '/admin/outreach';
          break;
        case 'checkBacklinks':
          await fetch('/api/admin/check-backlinks', { method: 'POST' });
          alert('Backlink check initiated!');
          break;
        case 'generateReport':
          window.location.href = '/admin/analytics';
          break;
      }
    } catch (error) {
      alert('Action failed. Please try again.');
    }
  };

  useEffect(() => {
    // Load dashboard stats
    const loadStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        // Failed to load stats
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your SEO, outreach, and growth automation</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Total Visits', value: stats.totalVisits.toLocaleString(), icon: '👥', color: 'bg-blue-500' },
          { label: 'Total Sales', value: stats.totalSales.toLocaleString(), icon: '💰', color: 'bg-green-500' },
          { label: 'Backlinks', value: stats.backlinks.toLocaleString(), icon: '🔗', color: 'bg-purple-500' },
          { label: 'Outreach Sent', value: stats.outreachSent.toLocaleString(), icon: '📧', color: 'bg-orange-500' },
          { label: 'SEO Score', value: `${stats.seoScore}/100`, icon: '📈', color: 'bg-indigo-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 text-white text-xl mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              onClick={() => handleQuickAction(action.action)}
              className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`${action.color} rounded-lg p-3 text-white text-2xl mb-4 w-fit`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              className={`p-4 ${index !== recentActivity.length - 1 ? 'border-b border-gray-200' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    activity.type === 'sale' ? 'bg-green-500' :
                    activity.type === 'backlink' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-gray-900">{activity.message}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SEO Health Check */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">SEO Health Check</h2>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-semibold text-gray-900">Meta Tags</h3>
              <p className="text-sm text-gray-600">All pages optimized</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-semibold text-gray-900">Sitemap</h3>
              <p className="text-sm text-gray-600">Auto-generated & submitted</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <h3 className="font-semibold text-gray-900">Page Speed</h3>
              <p className="text-sm text-gray-600">Needs optimization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}