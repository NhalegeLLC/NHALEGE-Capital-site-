import React, { useState } from 'react';
import { ShieldExclamationIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import MFAVerification from './MFAVerification';

const AdminMFAGate = ({ user, children, onAccessGranted }) => {
  const [showMFA, setShowMFA] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const handleMFAVerified = (verified) => {
    if (verified) {
      setAccessGranted(true);
      setShowMFA(false);
      if (onAccessGranted) {
        onAccessGranted();
      }
    }
  };

  if (showMFA) {
    return (
      <MFAVerification
        email={user.email}
        onVerified={handleMFAVerified}
        onBack={() => setShowMFA(false)}
        adminMode={true}
      />
    );
  }

  if (accessGranted) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-red-500/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <ShieldExclamationIcon className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Admin Access Required
          </h2>
          <p className="text-gray-300">
            Additional verification is required to access the admin panel
          </p>
        </div>

        {/* Admin Info */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <LockClosedIcon className="h-5 w-5 text-red-400" />
            <div>
              <div className="font-medium text-white">Secure Admin Area</div>
              <div className="text-sm text-gray-300">
                Logged in as: {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Options */}
        <div className="space-y-4">
          <button
            onClick={() => setShowMFA(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ShieldExclamationIcon className="h-5 w-5" />
            <span>Verify Admin Access</span>
          </button>

          <div className="text-center">
            <button
              onClick={() => window.history.back()}
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
          <div className="text-xs text-gray-400 text-center">
            <p className="mb-1">🔒 Enhanced Security</p>
            <p>
              Admin panel access requires additional verification to protect sensitive data and operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMFAGate;