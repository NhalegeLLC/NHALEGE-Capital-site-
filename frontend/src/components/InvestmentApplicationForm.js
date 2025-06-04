import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  EnvelopeIcon, 
  CurrencyDollarIcon, 
  ShieldCheckIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const InvestmentApplicationForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    investmentCapacity: '',
    accreditedStatus: '',
    investmentExperience: '',
    hearAboutUs: '',
    additionalInfo: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const investmentRanges = [
    { value: '25000-50000', label: '$25,000 - $50,000' },
    { value: '50000-100000', label: '$50,000 - $100,000' },
    { value: '100000-250000', label: '$100,000 - $250,000' },
    { value: '250000-500000', label: '$250,000 - $500,000' },
    { value: '500000-1000000', label: '$500,000 - $1,000,000' },
    { value: '1000000+', label: '$1,000,000+' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add to Mailchimp with high-value lead tags
      await onSubmit({
        ...formData,
        source: 'inner-circle-application',
        timestamp: new Date().toISOString(),
        leadType: 'inner-circle'
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-obsidian-900/95 backdrop-blur-md z-50 flex items-center justify-center p-6">
        <motion.div
          className="glass-dark p-8 rounded-3xl max-w-md w-full text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4 gradient-text">Application Received</h3>
          <p className="text-platinum-300 mb-6">
            Thank you for your interest in joining the Nhalege Capital Inner Circle. 
            Our investment team will review your application and contact you within 48 hours.
          </p>
          <button
            onClick={onClose}
            className="btn-primary px-6 py-3 rounded-xl font-semibold"
          >
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-obsidian-900/95 backdrop-blur-md z-50 flex items-center justify-center p-6 overflow-y-auto">
      <motion.div
        className="glass-dark p-8 rounded-3xl max-w-2xl w-full my-8"
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold gradient-text">Inner Circle Application</h2>
            <p className="text-platinum-400">Exclusive investment opportunities await</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-obsidian-800 hover:bg-obsidian-700 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-platinum-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-platinum-300 mb-2">
                First Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-platinum-500" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-platinum-300 mb-2">
                Last Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-platinum-500" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <label className="block text-sm font-semibold text-platinum-300 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-platinum-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-platinum-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Investment Capacity */}
          <div>
            <label className="block text-sm font-semibold text-platinum-300 mb-2">
              Investment Capacity *
            </label>
            <select
              name="investmentCapacity"
              value={formData.investmentCapacity}
              onChange={handleInputChange}
              className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
              required
            >
              <option value="">Select investment range</option>
              {investmentRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Accredited Investor Status */}
          <div>
            <label className="block text-sm font-semibold text-platinum-300 mb-2">
              Are you an accredited investor? *
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="accreditedStatus"
                  value="yes"
                  checked={formData.accreditedStatus === 'yes'}
                  onChange={handleInputChange}
                  className="mr-3 text-gold-400 focus:ring-gold-400"
                />
                <span className="text-white">Yes, I am an accredited investor</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="accreditedStatus"
                  value="no"
                  checked={formData.accreditedStatus === 'no'}
                  onChange={handleInputChange}
                  className="mr-3 text-gold-400 focus:ring-gold-400"
                />
                <span className="text-white">No, I am not an accredited investor</span>
              </label>
            </div>
          </div>

          {/* Investment Experience */}
          <div>
            <label className="block text-sm font-semibold text-platinum-300 mb-2">
              Investment Experience
            </label>
            <select
              name="investmentExperience"
              value={formData.investmentExperience}
              onChange={handleInputChange}
              className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
            >
              <option value="">Select experience level</option>
              <option value="beginner">Beginner (0-2 years)</option>
              <option value="intermediate">Intermediate (3-7 years)</option>
              <option value="experienced">Experienced (8-15 years)</option>
              <option value="expert">Expert (15+ years)</option>
            </select>
          </div>

          {/* How they heard about us */}
          <div>
            <label className="block text-sm font-semibold text-platinum-300 mb-2">
              How did you hear about Nhalege Capital?
            </label>
            <select
              name="hearAboutUs"
              value={formData.hearAboutUs}
              onChange={handleInputChange}
              className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
            >
              <option value="">Select source</option>
              <option value="google">Google Search</option>
              <option value="social-media">Social Media</option>
              <option value="referral">Referral</option>
              <option value="linkedin">LinkedIn</option>
              <option value="podcast">Podcast</option>
              <option value="event">Event/Conference</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-semibold text-platinum-300 mb-2">
              Additional Information
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none transition-colors resize-none"
              placeholder="Tell us about your investment goals, interests, or any questions you have..."
            />
          </div>

          {/* Security Notice */}
          <div className="bg-royal-500/10 border border-royal-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3 text-royal-300">
              <ShieldCheckIcon className="w-5 h-5" />
              <p className="text-sm">
                Your information is encrypted and secure. We will never share your details with third parties.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-obsidian-900 border-t-transparent rounded-full"></div>
                Submitting Application...
              </div>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default InvestmentApplicationForm;