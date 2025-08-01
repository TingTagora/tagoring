import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiActivity, 
  FiSearch, 
  FiFilter, 
  FiRefreshCw,
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiClock
} from 'react-icons/fi';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    generateMockLogs();
  }, []);

  const generateMockLogs = () => {
    const logLevels = ['info', 'warning', 'error', 'success'];
    const actions = [
      'User login attempt',
      'Application submitted',
      'Profile updated',
      'Email sent',
      'Database backup completed'
    ];

    const mockLogs = [];
    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      mockLogs.push({
        id: i + 1,
        timestamp: timestamp.toISOString(),
        level: logLevels[Math.floor(Math.random() * logLevels.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        user: `user${i}@example.com`,
        ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        details: `Action completed with code 200`
      });
    }

    mockLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setLogs(mockLogs);
  };

  const refreshLogs = () => {
    setLoading(true);
    setTimeout(() => {
      generateMockLogs();
      setLoading(false);
    }, 1000);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const getLogIcon = (level) => {
    switch (level) {
      case 'error': return FiXCircle;
      case 'warning': return FiAlertCircle;
      case 'success': return FiCheckCircle;
      default: return FiInfo;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiActivity className="text-blue-500 text-2xl" />
          <div>
            <h1 className="text-2xl font-bold text-white">System Logs</h1>
            <p className="text-gray-400">Monitor system activities and events</p>
          </div>
        </div>
        <motion.button
          onClick={refreshLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </motion.button>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => {
                  const Icon = getLogIcon(log.level);
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-300">
                          <FiClock className="text-gray-400 text-sm" />
                          <span className="text-sm">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Icon className={`text-sm ${
                            log.level === 'error' ? 'text-red-500' :
                            log.level === 'warning' ? 'text-yellow-500' :
                            log.level === 'success' ? 'text-green-500' :
                            'text-blue-500'
                          }`} />
                          <span className="text-xs font-medium text-white">
                            {log.level.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white text-sm">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                        {log.user}
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length > 0 && (
        <div className="text-center text-gray-400 text-sm">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      )}
    </div>
  );
};

export default LogsPage;
