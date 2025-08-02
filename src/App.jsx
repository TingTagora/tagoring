import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import UsersPage from './pages/UsersPage';
import ApplicationsPage from './pages/ApplicationsPage';
import JobsPage from './pages/JobsPage';
import LogsPage from './pages/LogsPage';
import StatsPage from './pages/StatsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!currentUser ? <Login /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        } 
      >
        <Route index element={<Navigate to="/dashboard/stats" replace />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="logs" element={<LogsPage />} />
      </Route>
      <Route 
        path="/" 
        element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-900">
          <AppContent />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
