import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBarChart, 
  FiTrendingUp, 
  FiUsers, 
  FiFileText, 
  FiCalendar, 
  FiRefreshCw,
  FiDatabase,
  FiActivity,
  FiClock,
  FiEye
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stats?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Default empty stats if no data
  const defaultStats = {
    totalUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    newUsersThisMonth: 0,
    applicationsThisMonth: 0,
    systemLoad: 0,
    uptime: '0 days',
    recentActivity: []
  };

  const currentStats = stats || defaultStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiBarChart className="text-blue-500 text-2xl" />
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics & Statistics</h1>
            <p className="text-gray-400">System performance and usage metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <motion.button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={16} />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <motion.div 
          className="bg-red-900/20 border border-red-700 p-4 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-red-400">Error: {error}</p>
          <button 
            onClick={fetchStats}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{currentStats.totalUsers}</p>
              <p className="text-green-400 text-sm flex items-center gap-1 mt-1">
                <FiTrendingUp size={12} />
                +{currentStats.newUsersThisMonth} this month
              </p>
            </div>
            <FiUsers className="text-blue-500 text-3xl" />
          </div>
        </motion.div>

        <motion.div 
          className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Applications</p>
              <p className="text-2xl font-bold text-white">{currentStats.totalApplications}</p>
              <p className="text-blue-400 text-sm flex items-center gap-1 mt-1">
                <FiTrendingUp size={12} />
                +{currentStats.applicationsThisMonth} this month
              </p>
            </div>
            <FiFileText className="text-green-500 text-3xl" />
          </div>
        </motion.div>

        <motion.div 
          className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-500">{currentStats.pendingApplications}</p>
              <p className="text-gray-400 text-sm mt-1">Requires attention</p>
            </div>
            <FiClock className="text-yellow-500 text-3xl" />
          </div>
        </motion.div>

        <motion.div 
          className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">System Load</p>
              <p className="text-2xl font-bold text-purple-500">{currentStats.systemLoad}%</p>
              <p className="text-gray-400 text-sm mt-1">Server performance</p>
            </div>
            <FiActivity className="text-purple-500 text-3xl" />
          </div>
        </motion.div>
      </div>

      {/* Application Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FiFileText className="text-blue-500" />
            Application Status Overview
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Approved</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: currentStats.totalApplications > 0 
                        ? `${(currentStats.approvedApplications / currentStats.totalApplications) * 100}%` 
                        : '0%' 
                    }}
                  ></div>
                </div>
                <span className="text-green-400 font-medium w-8">{currentStats.approvedApplications}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Pending</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ 
                      width: currentStats.totalApplications > 0 
                        ? `${(currentStats.pendingApplications / currentStats.totalApplications) * 100}%` 
                        : '0%' 
                    }}
                  ></div>
                </div>
                <span className="text-yellow-400 font-medium w-8">{currentStats.pendingApplications}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Rejected</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ 
                      width: currentStats.totalApplications > 0 
                        ? `${(currentStats.rejectedApplications / currentStats.totalApplications) * 100}%` 
                        : '0%' 
                    }}
                  ></div>
                </div>
                <span className="text-red-400 font-medium w-8">{currentStats.rejectedApplications}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FiActivity className="text-purple-500" />
            System Information
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Server Uptime</span>
              <span className="text-green-400 font-medium">{currentStats.uptime}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Database Status</span>
              <span className="text-green-400 font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Connected
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Last Backup</span>
              <span className="text-gray-400 font-medium">2 hours ago</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">API Requests (24h)</span>
              <span className="text-blue-400 font-medium">1,247</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div 
        className="bg-slate-800 p-6 rounded-lg border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FiEye className="text-green-500" />
          Recent Activity
        </h3>
        
        {currentStats.recentActivity && currentStats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {currentStats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">{activity.description}</span>
                <span className="text-gray-500 text-sm ml-auto">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiDatabase className="mx-auto text-gray-500 text-4xl mb-2" />
            <p className="text-gray-400">
              {error ? 'Unable to load recent activity' : 'No recent activity available'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="bg-slate-800 p-6 rounded-lg border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            onClick={() => toast.info('Export data feature coming soon!')}
            className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg hover:bg-blue-600/20 transition-colors text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <FiBarChart className="text-blue-500 text-xl" />
              <div>
                <p className="text-white font-medium">Export Analytics</p>
                <p className="text-gray-400 text-sm">Download detailed reports</p>
              </div>
            </div>
          </motion.button>
          
          <motion.button
            onClick={() => toast.info('System backup feature coming soon!')}
            className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg hover:bg-green-600/20 transition-colors text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <FiDatabase className="text-green-500 text-xl" />
              <div>
                <p className="text-white font-medium">System Backup</p>
                <p className="text-gray-400 text-sm">Create data backup</p>
              </div>
            </div>
          </motion.button>
          
          <motion.button
            onClick={() => toast.info('Performance optimization coming soon!')}
            className="p-4 bg-purple-600/10 border border-purple-600/20 rounded-lg hover:bg-purple-600/20 transition-colors text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <FiActivity className="text-purple-500 text-xl" />
              <div>
                <p className="text-white font-medium">Optimize Performance</p>
                <p className="text-gray-400 text-sm">Clean cache & optimize</p>
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsPage;
