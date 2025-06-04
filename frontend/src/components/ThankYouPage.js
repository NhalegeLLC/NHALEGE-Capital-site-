import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, StarIcon, ChartBarIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import useIntegrations from '../hooks/useIntegrations';

const ThankYouPage = ({ onBackToLanding, investmentAmount, projectedReturn }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { trackEvent, trackEmailCollection } = useAnalytics();

  useEffect(() => {
    // Track thank you page view
    trackEvent('thank_you_page_view', {
      investment_amount: investmentAmount,
      projected_return: projectedReturn
    });
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add to Mailchimp with qualified lead data
      await addQualifiedInvestorLead({
        email,
        investmentAmount,
        projectedReturn,
        source: 'roi-calculator',
        timestamp: new Date().toISOString()
      });

      // Track email collection
      trackEmailCollection('thank_you_page', investmentAmount);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-900 text-white flex items-center justify-center px-6 hero-pattern">
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
        className="relative z-20 max-w-4xl mx-auto text-center"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div
          className="mb-8"
          variants={fadeInUp}
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to <span className="gradient-text">Nhalege Capital</span>
          </h1>
          <p className="text-xl md:text-2xl text-platinum-300 max-w-3xl mx-auto leading-relaxed">
            You've taken the first step toward building generational wealth. Your financial future starts here.
          </p>
        </motion.div>

        {investmentAmount && projectedReturn && (
          <motion.div
            className="glass-dark p-8 rounded-3xl mb-12 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            <h3 className="text-2xl font-bold mb-6 text-gold-400">Your Wealth Projection</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">${investmentAmount.toLocaleString()}</div>
                <div className="text-sm text-platinum-400">Your Investment</div>
              </div>
              <div className="flex items-center justify-center">
                <ChartBarIcon className="w-8 h-8 text-gold-400" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400">${projectedReturn.toLocaleString()}</div>
                <div className="text-sm text-platinum-400">Projected Return</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gold-500/10 rounded-xl border border-gold-500/20">
              <p className="text-sm text-platinum-300">
                <strong>Potential Profit:</strong> +${(projectedReturn - investmentAmount).toLocaleString()} 
                ({(((projectedReturn - investmentAmount) / investmentAmount) * 100).toFixed(1)}% return)
              </p>
            </div>
          </motion.div>
        )}

        {!isSubmitted ? (
          <motion.div
            className="glass-dark p-8 rounded-3xl mb-12 max-w-xl mx-auto"
            variants={fadeInUp}
          >
            <h3 className="text-2xl font-bold mb-6">Stay Connected to Your Wealth Journey</h3>
            <p className="text-platinum-300 mb-6">
              Get exclusive insights, market updates, and early access to investment opportunities.
            </p>
            
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-4 px-6 text-white placeholder-platinum-500 focus:border-gold-400 focus:outline-none transition-colors text-lg"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 rounded-xl font-semibold text-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin w-5 h-5 border-2 border-obsidian-900 border-t-transparent rounded-full"></div>
                    Securing Your Spot...
                  </div>
                ) : (
                  'Join the Elite Investor Network'
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-platinum-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>No Spam</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Exclusive Content</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Unsubscribe Anytime</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="glass-dark p-8 rounded-3xl mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-green-400">You're In!</h3>
            <p className="text-platinum-300 mb-6">
              Welcome to the Nhalege Capital elite investor network. Expect your first exclusive insight within 24 hours.
            </p>
            <div className="flex items-center justify-center gap-2 text-gold-400">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5" />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          variants={fadeInUp}
        >
          <div className="glass p-6 rounded-2xl text-center">
            <ChartBarIcon className="w-12 h-12 mx-auto mb-4 text-gold-400" />
            <h4 className="font-semibold mb-2">Exclusive Opportunities</h4>
            <p className="text-sm text-platinum-400">First access to high-yield investment opportunities</p>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <AcademicCapIcon className="w-12 h-12 mx-auto mb-4 text-royal-400" />
            <h4 className="font-semibold mb-2">Wealth Education</h4>
            <p className="text-sm text-platinum-400">Learn from successful investors and entrepreneurs</p>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <StarIcon className="w-12 h-12 mx-auto mb-4 text-platinum-400" />
            <h4 className="font-semibold mb-2">Elite Community</h4>
            <p className="text-sm text-platinum-400">Connect with like-minded wealth builders</p>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          variants={fadeInUp}
        >
          <button 
            onClick={onBackToLanding}
            className="btn-secondary px-8 py-4 rounded-xl text-lg font-semibold"
          >
            Explore More
          </button>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="btn-primary px-8 py-4 rounded-xl text-lg font-semibold"
          >
            Access Dashboard
          </button>
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          variants={fadeInUp}
        >
          <p className="text-sm text-platinum-500 mb-4">
            🔒 Your information is secured with bank-level encryption
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-platinum-600">
            <span>Privacy Protected</span>
            <span>•</span>
            <span>SSL Encrypted</span>
            <span>•</span>
            <span>No Spam Guarantee</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;