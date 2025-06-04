import React, { useState, useEffect } from 'react';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminMFAGate from './AdminMFAGate';

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.is_admin) {
          setCurrentUser(userData);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
    setLoading(false);
  };

  const handleLogin = () => {
    checkAuthStatus();
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-platinum-300">Loading Mission Control...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && currentUser?.is_admin) {
    return (
      <AdminMFAGate user={currentUser}>
        <AdminDashboard onLogout={handleLogout} />
      </AdminMFAGate>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-900">
      <AdminLogin onLogin={handleLogin} />
    </div>
  );
};

export default AdminApp;