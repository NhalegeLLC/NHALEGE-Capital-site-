import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline';

const AuthScreen = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'passphrase'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      onAuthenticated();
    }, 1500);
  };

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
            <KeyIcon className="w-8 h-8 text-obsidian-900" />
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h2>
          <p className="text-platinum-300">Access your private capital dashboard</p>
        </div>

        {/* Auth Method Selector */}
        <div className="flex bg-obsidian-800 rounded-xl p-1 mb-6">
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
              authMethod === 'email'
                ? 'bg-gold-400 text-obsidian-900'
                : 'text-platinum-400 hover:text-white'
            }`}
            onClick={() => setAuthMethod('email')}
          >
            Email Login
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
              authMethod === 'passphrase'
                ? 'bg-gold-400 text-obsidian-900'
                : 'text-platinum-400 hover:text-white'
            }`}
            onClick={() => setAuthMethod('passphrase')}
          >
            Passphrase
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {authMethod === 'email' ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-platinum-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
                  placeholder="contributor@nhalege.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-platinum-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassphrase ? 'text' : 'password'}
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 pr-12 text-white focus:border-gold-400 focus:outline-none transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassphrase(!showPassphrase)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-platinum-400 hover:text-white"
                  >
                    {showPassphrase ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-platinum-300 mb-2">
                Private Access Passphrase
              </label>
              <div className="relative">
                <input
                  type={showPassphrase ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 pr-12 text-white focus:border-gold-400 focus:outline-none transition-colors"
                  placeholder="Enter your unique passphrase"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-platinum-400 hover:text-white"
                >
                  {showPassphrase ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-platinum-500 mt-2">
                Use the secure passphrase provided in your welcome email
              </p>
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
                Authenticating...
              </div>
            ) : (
              'Access Dashboard'
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
              <span>Encrypted</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="text-gold-400 hover:text-gold-300 text-sm font-semibold">
            Forgot your credentials?
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;