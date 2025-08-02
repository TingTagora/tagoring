import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiFileText, 
  FiActivity, 
  FiLogOut, 
  FiShield,
  FiBarChart,
  FiBriefcase
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const DashboardLayout = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const navigationItems = [
    {
      name: 'Analytics',
      href: '/dashboard/stats',
      icon: FiBarChart,
      active: location.pathname === '/dashboard/stats'
    },
    {
      name: 'Users',
      href: '/dashboard/users',
      icon: FiUsers,
      active: location.pathname === '/dashboard/users'
    },
    {
      name: 'Applications',
      href: '/dashboard/applications',
      icon: FiFileText,
      active: location.pathname === '/dashboard/applications'
    },
    {
      name: 'Jobs',
      href: '/dashboard/jobs',
      icon: FiBriefcase,
      active: location.pathname === '/dashboard/jobs'
    },
    {
      name: 'System Logs',
      href: '/dashboard/logs',
      icon: FiActivity,
      active: location.pathname === '/dashboard/logs'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <motion.div 
        className="w-64 bg-slate-800 border-r border-slate-700"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiShield className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin Panel</h1>
              <p className="text-gray-400 text-sm">Secure Access</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 w-64 p-6 border-t border-slate-700">
          <div className="mb-4">
            <p className="text-white font-medium text-sm">
              {currentUser?.displayName || currentUser?.email || 'Admin User'}
            </p>
            <p className="text-gray-400 text-xs">Administrator</p>
          </div>
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiLogOut size={16} />
            <span className="text-sm">Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <motion.div 
          className="p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;