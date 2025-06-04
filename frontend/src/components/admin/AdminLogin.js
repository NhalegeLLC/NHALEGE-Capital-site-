import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState('');

  // Admin credentials (in production, this would be secure backend auth)
  const ADMIN_CREDENTIALS = {
    username: 'nhalege_admin',
    password: 'NhalegeCapital2024!'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLogging(true);
    setError('');

    // Simulate authentication delay
    setTimeout(() => {
      if (
        credentials.username === ADMIN_CREDENTIALS.username &&
        credentials.password === ADMIN_CREDENTIALS.password
      ) {
        // Store admin session
        sessionStorage.setItem('nhalege_admin_session', 'authenticated');
        onLogin(true);
      } else {
        setError('Invalid credentials. Access denied.');
      }
      setIsLogging(false);
    }, 1500);
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-obsidian-900 flex items-center justify-center px-6 hero-pattern">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1566873584369-a6f8bd659ea0')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.05
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-900/95 via-obsidian-900/98 to-obsidian-900 z-10" />
      
      <motion.div
        className="relative z-20 glass-dark p-8 rounded-3xl max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
            <ShieldCheckIcon className="w-10 h-10 text-obsidian-900" />
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Mission Control</h2>
          <p className="text-platinum-300">Nhalege Capital Admin Dashboard</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-platinum-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Secure Access Required</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-platinum-300 mb-2">
              Admin Username
            </label>
            <div className="relative">
              <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-platinum-500" />
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
                placeholder="Enter admin username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-platinum-300 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <ShieldCheckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-platinum-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 pl-10 pr-12 text-white focus:border-gold-400 focus:outline-none transition-colors"
                placeholder="Enter secure password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-platinum-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLogging}
            className="w-full btn-primary py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLogging ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-obsidian-900 border-t-transparent rounded-full"></div>
                Accessing Mission Control...
              </div>
            ) : (
              'Access Admin Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-platinum-500">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Encrypted Access</span>
            </div>
          </div>
          <p className="mt-4 text-xs">Unauthorized access attempts are logged and monitored</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;