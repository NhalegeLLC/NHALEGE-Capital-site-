import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, DevicePhoneMobileIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const MFAVerification = ({ email, onVerified, onBack, adminMode = false }) => {
  const [selectedMethod, setSelectedMethod] = useState('email');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    let timer;
    if (timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeRemaining]);

  const sendCode = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const endpoint = adminMode ? '/api/mfa/send-admin-code' : '/api/mfa/send-code';
      const headers = {
        'Content-Type': 'application/json'
      };

      // Add auth header for admin mode
      if (adminMode) {
        const token = localStorage.getItem('auth_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: email,
          method: selectedMethod
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCodeSent(true);
        setTimeRemaining(600); // 10 minutes
        setMessage(data.message);
      } else {
        setMessage(data.detail || 'Failed to send verification code');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  const verifyCode = async () => {
    if (!code || code.length !== 6) {
      setMessage('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const endpoint = adminMode ? '/api/mfa/verify-admin-code' : '/api/mfa/verify-code';
      const headers = {
        'Content-Type': 'application/json'
      };

      // Add auth header for admin mode
      if (adminMode) {
        const token = localStorage.getItem('auth_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: email,
          code: code
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (adminMode) {
          onVerified(true);
        } else {
          // For regular login, we get a new token
          localStorage.setItem('auth_token', data.access_token);
          onVerified(data);
        }
      } else {
        setMessage(data.detail || 'Invalid verification code');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }

    setLoading(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {adminMode ? 'Admin Verification' : 'Multi-Factor Authentication'}
          </h2>
          <p className="text-gray-300">
            {adminMode 
              ? 'Additional verification required for admin access'
              : 'Secure your account with an additional verification step'
            }
          </p>
        </div>

        {!codeSent ? (
          /* Method Selection */
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Choose verification method:
              </label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('email')}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedMethod === 'email'
                      ? 'border-blue-400 bg-blue-500/20 text-white'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">Email Verification</div>
                      <div className="text-sm opacity-75">Send code to {email}</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('sms')}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedMethod === 'sms'
                      ? 'border-blue-400 bg-blue-500/20 text-white'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <DevicePhoneMobileIcon className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">SMS Verification</div>
                      <div className="text-sm opacity-75">Send code to your phone</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <button
              onClick={sendCode}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-colors duration-200"
            >
              {loading ? 'Sending Code...' : `Send ${selectedMethod === 'email' ? 'Email' : 'SMS'} Code`}
            </button>
          </div>
        ) : (
          /* Code Entry */
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter verification code:
              </label>
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white text-center text-2xl font-mono tracking-wider focus:border-blue-400 focus:outline-none"
                maxLength={6}
                autoComplete="off"
              />
            </div>

            {timeRemaining > 0 && (
              <div className="text-center text-gray-300">
                Code expires in: <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={verifyCode}
                disabled={loading || code.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-colors duration-200"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              <button
                onClick={() => {
                  setCodeSent(false);
                  setCode('');
                  setMessage('');
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-xl font-medium transition-colors duration-200"
              >
                Choose Different Method
              </button>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('sent') || message.includes('verified')
              ? 'bg-green-500/20 text-green-300 border border-green-500/50'
              : 'bg-red-500/20 text-red-300 border border-red-500/50'
          }`}>
            {message}
          </div>
        )}

        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="w-full mt-6 text-gray-400 hover:text-white transition-colors duration-200"
          >
            ← Back to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default MFAVerification;