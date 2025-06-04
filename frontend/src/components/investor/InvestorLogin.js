import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, UserIcon, KeyIcon } from '@heroicons/react/24/outline';

const InvestorLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    twoFactorCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  // Mock investor credentials for demo
  const INVESTOR_CREDENTIALS = [
    {
      email: 'marcus.thompson@example.com',
      password: 'InvestorSecure2024!',
      name: 'Marcus Thompson',
      tier: 'Legacy',
      investmentAmount: 750000
    },
    {
      email: 'sarah.chen@techstartup.com', 
      password: 'InvestorSecure2024!',
      name: 'Sarah Chen',
      tier: 'Sovereign',
      investmentAmount: 250000
    },
    {
      email: 'david.rodriguez@realestate.com',
      password: 'InvestorSecure2024!',
      name: 'David Rodriguez', 
      tier: 'Ascendant',
      investmentAmount: 75000
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLogging(true);
    setError('');

    // Simulate authentication delay
    setTimeout(() => {
      const investor = INVESTOR_CREDENTIALS.find(
        inv => inv.email === credentials.email && inv.password === credentials.password
      );

      if (investor) {
        if (!showTwoFactor) {
          // First step: email/password verification
          setShowTwoFactor(true);
          setIsLogging(false);
          return;
        }
        
        // Second step: 2FA verification (for demo, any 6-digit code works)
        if (credentials.twoFactorCode.length === 6) {
          // Store investor session
          sessionStorage.setItem('nhalege_investor_session', JSON.stringify({
            authenticated: true,
            investor: investor,
            loginTime: new Date().toISOString()
          }));
          onLogin(investor);
        } else {
          setError('Invalid verification code. Please try again.');
        }
      } else {
        setError('Invalid email or password. Please check your credentials.');
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

  const handleBackToStep1 = () => {
    setShowTwoFactor(false);
    setCredentials({ ...credentials, twoFactorCode: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-obsidian-900 flex items-center justify-center px-6 hero-pattern">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1566873584369-a6f8bd659ea0')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.08
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
          <h2 className="text-3xl font-bold gradient-text mb-2">
            {showTwoFactor ? 'Secure Access' : 'Investor Portal'}
          </h2>
          <p className="text-platinum-300">
            {showTwoFactor 
              ? 'Enter your verification code' 
              : 'Welcome to your private vault'
            }
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-platinum-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Bank-Level Security</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!showTwoFactor ? (
            // Step 1: Email and Password
            <>
              <div>
                <label className="block text-sm font-semibold text-platinum-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-platinum-500" />
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleInputChange}
                    className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
                    placeholder="investor@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-platinum-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-platinum-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 pl-10 pr-12 text-white focus:border-gold-400 focus:outline-none transition-colors"
                    placeholder="Enter your secure password"
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
            </>
          ) : (
            // Step 2: Two-Factor Authentication
            <div>
              <label className="block text-sm font-semibold text-platinum-300 mb-2">
                Verification Code
              </label>
              <p className="text-xs text-platinum-500 mb-4">
                Enter the 6-digit code from your authenticator app
              </p>
              <input
                type="text"
                name="twoFactorCode"
                value={credentials.twoFactorCode}
                onChange={handleInputChange}
                className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-4 px-4 text-white text-center text-2xl font-mono tracking-widest focus:border-gold-400 focus:outline-none transition-colors"
                placeholder="000000"
                maxLength="6"
                pattern="[0-9]{6}"
                required
              />
              <button
                type="button"
                onClick={handleBackToStep1}
                className="w-full mt-4 text-platinum-400 hover:text-white text-sm transition-colors"
              >
                ← Back to login
              </button>
            </div>
          )}

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
                {showTwoFactor ? 'Verifying Access...' : 'Authenticating...'}
              </div>
            ) : (
              showTwoFactor ? 'Access Vault' : 'Continue to Verification'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-platinum-500">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>2FA Protected</span>
            </div>
          </div>
          <p className="text-xs">Your investment data is secured with institutional-grade protection</p>
        </div>

        <div className="mt-6 text-center">
          <button className="text-gold-400 hover:text-gold-300 text-sm font-semibold">
            Need help accessing your account?
          </button>
        </div>

        {/* Demo Credentials Helper */}
        <div className="mt-8 p-4 bg-royal-500/10 border border-royal-500/20 rounded-xl">
          <div className="text-center text-xs text-platinum-500 mb-2">Demo Credentials:</div>
          <div className="text-xs text-platinum-400 space-y-1">
            <div>Email: marcus.thompson@example.com</div>
            <div>Password: InvestorSecure2024!</div>
            <div>2FA Code: Any 6 digits (e.g., 123456)</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InvestorLogin;