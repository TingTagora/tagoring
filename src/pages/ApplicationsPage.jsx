import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiSearch, 
  FiRefreshCw, 
  FiUser, 
  FiMail, 
  FiCalendar,
  FiEye,
  FiDownload,
  FiCheck,
  FiX,
  FiClock,
  FiDatabase,
  FiFilter
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update application status');
      
      toast.success(`Application ${newStatus} successfully`);
      fetchApplications();
    } catch (err) {
      toast.error('Failed to update application: ' + err.message);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return FiCheck;
      case 'rejected': return FiX;
      case 'pending': return FiClock;
      default: return FiFileText;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-900 text-green-300 border-green-700';
      case 'rejected': return 'bg-red-900 text-red-300 border-red-700';
      case 'pending': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
      default: return 'bg-gray-900 text-gray-300 border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiFileText className="text-blue-500 text-2xl" />
          <div>
            <h1 className="text-2xl font-bold text-white">Job Applications</h1>
            <p className="text-gray-400">Review and manage job applications</p>
          </div>
        </div>
        <motion.button
          onClick={fetchApplications}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} size={16} />
          Refresh
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Applications</p>
              <p className="text-2xl font-bold text-white">{applications.length}</p>
            </div>
            <FiFileText className="text-blue-500 text-2xl" />
          </div>
        </motion.div>

        <motion.div 
          className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-500">
                {applications.filter(app => app.status === 'pending').length}
              </p>
            </div>
            <FiClock className="text-yellow-500 text-2xl" />
          </div>
        </motion.div>

        <motion.div 
          className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-2xl font-bold text-green-500">
                {applications.filter(app => app.status === 'approved').length}
              </p>
            </div>
            <FiCheck className="text-green-500 text-2xl" />
          </div>
        </motion.div>

        <motion.div 
          className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-red-500">
                {applications.filter(app => app.status === 'rejected').length}
              </p>
            </div>
            <FiX className="text-red-500 text-2xl" />
          </div>
        </motion.div>
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
            onClick={fetchApplications}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Search and Filter */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table or Empty State */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {filteredApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredApplications.map((application, index) => {
                  const StatusIcon = getStatusIcon(application.status);
                  return (
                    <motion.tr
                      key={application.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <FiUser className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{application.name || 'Unknown'}</p>
                            <p className="text-gray-400 text-sm flex items-center gap-1">
                              <FiMail size={12} />
                              {application.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {application.position || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <StatusIcon size={14} />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                            {application.status?.toUpperCase() || 'UNKNOWN'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <FiCalendar size={12} />
                          {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <motion.button
                            onClick={() => toast.info('View application details coming soon!')}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-slate-700 rounded transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiEye size={16} />
                          </motion.button>
                          {application.status === 'pending' && (
                            <>
                              <motion.button
                                onClick={() => updateApplicationStatus(application.id, 'approved')}
                                className="p-2 text-green-400 hover:text-green-300 hover:bg-slate-700 rounded transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiCheck size={16} />
                              </motion.button>
                              <motion.button
                                onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiX size={16} />
                              </motion.button>
                            </>
                          )}
                          <motion.button
                            onClick={() => toast.info('Download resume feature coming soon!')}
                            className="p-2 text-purple-400 hover:text-purple-300 hover:bg-slate-700 rounded transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiDownload size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FiDatabase className="mx-auto text-gray-500 text-6xl mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              {error ? 'Unable to load applications' : 'No applications found'}
            </h3>
            <p className="text-gray-400 mb-4">
              {error 
                ? 'There was an error connecting to the server.' 
                : searchTerm || statusFilter !== 'all'
                  ? 'No applications match your search criteria.' 
                  : 'No job applications have been submitted yet.'
              }
            </p>
          </div>
        )}
      </div>

      {filteredApplications.length > 0 && (
        <div className="text-center text-gray-400 text-sm">
          Showing {filteredApplications.length} of {applications.length} applications
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;