import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, DevicePhoneMobileIcon, EnvelopeIcon, CogIcon } from '@heroicons/react/24/outline';
import { ShieldCheckIcon as ShieldCheckSolid } from '@heroicons/react/24/solid';

const MFASettings = ({ user, onUpdate }) => {
  const [mfaEnabled, setMfaEnabled] = useState(user?.mfa_enabled || false);
  const [mfaMethod, setMfaMethod] = useState(user?.mfa_method || 'email');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const saveSettings = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${backendUrl}/api/user/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mfa_enabled: mfaEnabled,
          mfa_method: mfaMethod,
          phone_number: phoneNumber
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Settings updated successfully');
        setIsEditing(false);
        if (onUpdate) {
          onUpdate({
            ...user,
            mfa_enabled: mfaEnabled,
            mfa_method: mfaMethod,
            phone_number: phoneNumber
          });
        }
      } else {
        setMessage(data.detail || 'Failed to update settings');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }

    setLoading(false);
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Multi-Factor Authentication</h3>
            <p className="text-sm text-gray-600">Secure your account with additional verification</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <CogIcon className="h-5 w-5" />
        </button>
      </div>

      {/* MFA Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {mfaEnabled ? (
              <ShieldCheckSolid className="h-6 w-6 text-green-500" />
            ) : (
              <ShieldCheckIcon className="h-6 w-6 text-gray-400" />
            )}
            <div>
              <div className="font-medium text-gray-900">
                MFA Status: {mfaEnabled ? 'Enabled' : 'Disabled'}
              </div>
              <div className="text-sm text-gray-600">
                {mfaEnabled 
                  ? `Verification method: ${mfaMethod === 'email' ? 'Email' : mfaMethod === 'sms' ? 'SMS' : 'Both'}`
                  : 'Enable MFA for enhanced security'
                }
              </div>
            </div>
          </div>
          {!isEditing && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              mfaEnabled 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {mfaEnabled ? 'Active' : 'Inactive'}
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={mfaEnabled}
                onChange={(e) => setMfaEnabled(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="font-medium text-gray-900">Enable Multi-Factor Authentication</span>
            </label>
          </div>

          {mfaEnabled && (
            <>
              {/* Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Verification Method:
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      value="email"
                      checked={mfaMethod === 'email'}
                      onChange={(e) => setMfaMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">Email verification</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      value="sms"
                      checked={mfaMethod === 'sms'}
                      onChange={(e) => setMfaMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">SMS verification</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      value="both"
                      checked={mfaMethod === 'both'}
                      onChange={(e) => setMfaMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex space-x-1">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-gray-900">Both email and SMS</span>
                  </label>
                </div>
              </div>

              {/* Phone Number */}
              {(mfaMethod === 'sms' || mfaMethod === 'both') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number:
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="(555) 123-4567"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required for SMS verification
                  </p>
                </div>
              )}
            </>
          )}

          {/* Save Button */}
          <div className="flex space-x-3">
            <button
              onClick={saveSettings}
              disabled={loading || (mfaEnabled && (mfaMethod === 'sms' || mfaMethod === 'both') && !phoneNumber)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                // Reset to original values
                setMfaEnabled(user?.mfa_enabled || false);
                setMfaMethod(user?.mfa_method || 'email');
                setPhoneNumber(user?.phone_number || '');
                setMessage('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.includes('successfully')
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Security Recommendation</p>
            <p>
              Enable MFA to add an extra layer of protection to your investor account. 
              This helps prevent unauthorized access even if your password is compromised.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MFASettings;