import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiSend, FiKey, FiShield, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [step, setStep] = useState('request'); // 'request' or 'token'
  const [token, setToken] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { loginWithCustomToken } = useAuth();

  const requestToken = async () => {
    setIsRequesting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin-auth/request-admin-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Token sent to Telegram! Check your messages.');
        setStep('token');
      } else {
        toast.error(data.message || 'Failed to request token');
      }
    } catch (error) {
      console.error('Error requesting token:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      toast.error('Please enter the token from Telegram');
      return;
    }

    setIsLoggingIn(true);
    try {
      await loginWithCustomToken(token);
      toast.success('Login successful! Welcome to the admin panel.');
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-custom-token') {
        toast.error('Invalid token. Please request a new one.');
      } else if (error.code === 'auth/custom-token-mismatch') {
        toast.error('Token expired or already used. Please request a new one.');
      } else {
        toast.error('Login failed. Please try again.');
      }
      setStep('request');
      setToken('');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div 
        className="bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <FiShield className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Secure Admin Access</h2>
          <p className="text-gray-400">Authentication via Telegram</p>
        </div>

        {step === 'request' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiLock className="text-blue-400" />
                <span className="text-blue-400 font-medium">Secure Token Required</span>
              </div>
              <p className="text-gray-300 text-sm">
                Click the button below to request a secure login token. 
                The token will be sent to your Telegram account and is valid for 2 minutes.
              </p>
            </div>

            <motion.button
              onClick={requestToken}
              disabled={isRequesting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isRequesting ? 1 : 1.02 }}
              whileTap={{ scale: isRequesting ? 1 : 0.98 }}
            >
              {isRequesting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending to Telegram...
                </>
              ) : (
                <>
                  <FiSend size={20} />
                  Request Login Token
                </>
              )}
            </motion.button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                <FiLock size={14} />
                <span>Secure token-based authentication</span>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'token' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiMessageSquare className="text-green-400" />
                <span className="text-green-400 font-medium">Token Sent!</span>
              </div>
              <p className="text-gray-300 text-sm">
                Check your Telegram messages for the login token. 
                Copy and paste it below to access the admin panel.
              </p>
            </div>

            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-medium">
                  Login Token
                </label>
                <div className="relative">
                  <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
                    placeholder="Paste your token from Telegram"
                    required
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isLoggingIn ? 1 : 1.02 }}
                whileTap={{ scale: isLoggingIn ? 1 : 0.98 }}
              >
                {isLoggingIn ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <FiShield size={20} />
                    Access Admin Panel
                  </>
                )}
              </motion.button>
            </form>

            <div className="text-center">
              <button
                onClick={() => {
                  setStep('request');
                  setToken('');
                }}
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Request new token
              </button>
            </div>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Secure Connection</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
