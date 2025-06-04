import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ChartBarIcon, AcademicCapIcon, ShieldCheckIcon, TrophyIcon } from '@heroicons/react/24/outline';
import EnhancedROICalculator from './EnhancedROICalculator';
import TestimonialSection from './TestimonialSection';
import ProcessTimeline from './ProcessTimeline';
import InnerCircleSection from './InnerCircleSection';
import VaultModal from './VaultModal';
import useIntegrations from '../hooks/useIntegrations';

const LandingPage = ({ onEnterDashboard, onCalculationComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const { trackEvent, trackInvestmentApplication } = useIntegrations();

  useEffect(() => {
    setIsVisible(true);
    // Track page view
    trackEvent('page_view', { page_title: 'Nhalege Capital Landing Page' });
  }, []);

  const handleApplyToInvest = () => {
    setShowApplicationForm(true);
    trackEvent('inner_circle_application_started', { source: 'landing_page' });
  };

  const handleApplicationSubmit = async (applicationData) => {
    try {      
      // Track conversion
      trackInvestmentApplication(
        applicationData.investmentCapacity, 
        'inner-circle-application'
      );
      
      // Track high-value lead
      trackEvent('high_value_lead_generated', {
        lead_source: 'inner_circle_application',
        investment_capacity: applicationData.investmentCapacity,
        accredited_status: applicationData.accreditedStatus
      });

    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
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
    <div className="min-h-screen bg-obsidian-900 text-white pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-pattern">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1566873584369-a6f8bd659ea0')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-900/80 via-obsidian-900/90 to-obsidian-900 z-10" />
        
        <motion.div 
          className="relative z-20 text-center px-6 max-w-6xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div
            className="mb-8"
            variants={fadeInUp}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Build</span> Wealth.{' '}
              <span className="gradient-text">Back</span> Vision.{' '}
              <span className="gradient-text">Elevate</span> Legacy.
            </h1>
            <p className="text-xl md:text-2xl text-platinum-300 max-w-4xl mx-auto leading-relaxed">
              Join Nhalege Capital — where your contribution fuels ventures, 
              earns returns, and unlocks real knowledge.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            variants={fadeInUp}
          >
            <button 
              className="btn-primary px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 min-w-[200px]"
              onClick={() => document.getElementById('roi-calculator').scrollIntoView({ behavior: 'smooth' })}
            >
              Project My Returns
              <ChartBarIcon className="w-5 h-5" />
            </button>
            <button 
              className="btn-secondary px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 min-w-[200px]"
              onClick={onEnterDashboard}
            >
              Become a Private Contributor
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
            variants={fadeInUp}
          >
            <div className="glass p-6 rounded-2xl">
              <div className="text-3xl font-bold text-gold-500 mb-2">$2M+</div>
              <div className="text-platinum-300">Capital Deployed</div>
            </div>
            <div className="glass p-6 rounded-2xl">
              <div className="text-3xl font-bold text-gold-500 mb-2">150%</div>
              <div className="text-platinum-300">Average Returns</div>
            </div>
            <div className="glass p-6 rounded-2xl">
              <div className="text-3xl font-bold text-gold-500 mb-2">500+</div>
              <div className="text-platinum-300">Active Contributors</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ROI Calculator Section */}
      <section id="roi-calculator" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Calculate Your Wealth Potential
            </h2>
            <p className="text-xl text-platinum-300 max-w-2xl mx-auto mb-8">
              Enter your contribution to estimate your projected return. The future belongs to those who build it.
            </p>
            <div className="glass p-4 rounded-2xl inline-block mb-8">
              <div className="flex items-center gap-3 text-platinum-300">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-sm font-semibold">
                  🔒 Nhalege Capital uses secure, encrypted contribution processing. Your information is private and your capital is protected.
                </p>
              </div>
            </div>
          </motion.div>
          
          <EnhancedROICalculator onCalculationComplete={onCalculationComplete} />
        </div>
      </section>

      {/* Why Choose Nhalege Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-obsidian-900 to-obsidian-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="gradient-text">Nhalege Capital</span>
            </h2>
            <p className="text-xl text-platinum-300 max-w-3xl mx-auto">
              More than investment returns — we're building generational wealth through education and opportunity.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.div 
              className="glass-dark p-8 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                <ChartBarIcon className="w-8 h-8 text-obsidian-900" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Investment-Grade Diversification</h3>
              <p className="text-platinum-300">Real Estate, Startups, and Market Opportunities managed by experts.</p>
            </motion.div>

            <motion.div 
              className="glass-dark p-8 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-royal-400 to-royal-600 rounded-full flex items-center justify-center">
                <AcademicCapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Community-First Model</h3>
              <p className="text-platinum-300">Earn returns while gaining access to exclusive wealth education.</p>
            </motion.div>

            <motion.div 
              className="glass-dark p-8 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-platinum-400 to-platinum-600 rounded-full flex items-center justify-center">
                <ShieldCheckIcon className="w-8 h-8 text-obsidian-900" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Transparent Tracking</h3>
              <p className="text-platinum-300">Personal dashboards with real-time portfolio performance.</p>
            </motion.div>

            <motion.div 
              className="glass-dark p-8 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gold-400 to-royal-600 rounded-full flex items-center justify-center">
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Generational Vision</h3>
              <p className="text-platinum-300">Building long-term wealth and legacy for our community.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Inner Circle Section */}
      <InnerCircleSection onApplyToInvest={handleApplyToInvest} />

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-royal-900 via-obsidian-900 to-gold-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Ready to Build Your Legacy?
            </h2>
            <p className="text-xl text-platinum-300 mb-10 max-w-2xl mx-auto">
              Join the exclusive community of wealth builders who understand that true prosperity comes from knowledge and strategic investment.
            </p>
            <button 
              className="btn-primary px-10 py-5 rounded-xl text-xl font-semibold animate-glow"
              onClick={onEnterDashboard}
            >
              Start Your Journey Today
            </button>
          </motion.div>
        </div>
      </section>

      {/* Investment Application Form Modal */}
      {showApplicationForm && (
        <InvestmentApplicationForm
          onClose={() => setShowApplicationForm(false)}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </div>
  );
};

export default LandingPage;