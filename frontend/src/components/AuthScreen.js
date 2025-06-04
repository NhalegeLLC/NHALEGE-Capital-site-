import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, KeyIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import MFAVerification from './MFAVerification';

const AuthScreen = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [message, setMessage] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (authMode === 'register' && password !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = authMode === 'register' 
        ? { email, password, phone_number: phoneNumber }
        : { email, password };

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requires_mfa) {
          // Store temporary token and show MFA verification
          localStorage.setItem('temp_auth_token', data.access_token);
          setRequiresMFA(true);
        } else {
          // Complete authentication
          localStorage.setItem('auth_token', data.access_token);
          onAuthenticated();
        }
      } else {
        setMessage(data.detail || `${authMode === 'register' ? 'Registration' : 'Login'} failed`);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }

    setIsLoading(false);
  };

  const handleMFAVerified = (tokenData) => {
    // Store the new token and complete authentication
    localStorage.setItem('auth_token', tokenData.access_token);
    localStorage.removeItem('temp_auth_token');
    onAuthenticated();
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length >= 3) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    return cleaned;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  if (requiresMFA) {
    return (
      <MFAVerification
        email={email}
        onVerified={handleMFAVerified}
        onBack={() => {
          setRequiresMFA(false);
          localStorage.removeItem('temp_auth_token');
        }}
      />
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-obsidian-900 flex items-center justify-center px-6 hero-pattern">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1566873584369-a6f8bd659ea0')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-900/90 via-obsidian-900/95 to-obsidian-900 z-10" />
      
      <motion.div
        className="relative z-20 glass-dark p-8 rounded-3xl max-w-md w-full"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
            {authMode === 'register' ? (
              <UserPlusIcon className="w-8 h-8 text-obsidian-900" />
            ) : (
              <KeyIcon className="w-8 h-8 text-obsidian-900" />
            )}
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">
            {authMode === 'register' ? 'Join Nhalege Capital' : 'Welcome Back'}
          </h2>
          <p className="text-platinum-300">
            {authMode === 'register' 
              ? 'Create your secure investor account'
              : 'Access your private capital dashboard'
            }
          </p>
        </div>

        {/* Auth Mode Selector */}
        <div className="flex bg-obsidian-800 rounded-xl p-1 mb-6">
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
              authMode === 'login'
                ? 'bg-gold-400 text-obsidian-900'
                : 'text-platinum-400 hover:text-white'
            }`}
            onClick={() => {
              setAuthMode('login');
              setMessage('');
            }}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
              authMode === 'register'
                ? 'bg-gold-400 text-obsidian-900'
                : 'text-platinum-400 hover:text-white'
            }`}
            onClick={() => {
              setAuthMode('register');
              setMessage('');
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-platinum-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
              placeholder="investor@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-platinum-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 pr-12 text-white focus:border-gold-400 focus:outline-none transition-colors"
                placeholder="Enter your password"
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

          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-platinum-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-platinum-300 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
                  placeholder="(555) 123-4567"
                />
                <p className="text-xs text-platinum-500 mt-1">
                  Required for SMS-based multi-factor authentication
                </p>
              </div>
            </>
          )}

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('success') || message.includes('sent')
                ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                : 'bg-red-500/20 text-red-300 border border-red-500/50'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-obsidian-900 border-t-transparent rounded-full"></div>
                {authMode === 'register' ? 'Creating Account...' : 'Authenticating...'}
              </div>
            ) : (
              authMode === 'register' ? 'Create Account' : 'Access Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-platinum-500">
          <p>Protected by bank-level security</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>MFA Protected</span>
            </div>
          </div>
        </div>

        {authMode === 'login' && (
          <div className="mt-6 text-center">
            <button className="text-gold-400 hover:text-gold-300 text-sm font-semibold">
              Forgot your credentials?
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthScreen;