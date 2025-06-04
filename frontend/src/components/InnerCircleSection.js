import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, ShieldCheckIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const InnerCircleSection = ({ onApplyToInvest }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-20"></div>
      
      {/* Exclusive Badge */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500/20 to-royal-500/20 border border-gold-400/30 rounded-full px-6 py-3 mb-8">
          <ShieldCheckIcon className="w-5 h-5 text-gold-400" />
          <span className="text-gold-400 font-semibold text-sm tracking-wide uppercase">Exclusive Membership</span>
        </div>
        
        <motion.h2 
          className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          variants={fadeInUp}
        >
          Join the <span className="gradient-text">Inner Circle</span>
        </motion.h2>
        
        <motion.div 
          className="max-w-4xl mx-auto space-y-6"
          variants={fadeInUp}
        >
          <p className="text-2xl md:text-3xl text-platinum-200 font-light leading-relaxed">
            Unlock early access to deals, exclusive investor insights, and private capital opportunities.
          </p>
          
          <motion.p 
            className="text-xl md:text-2xl font-bold text-gold-400 italic"
            animate={{ 
              textShadow: ["0 0 20px rgba(212, 175, 55, 0.5)", "0 0 40px rgba(212, 175, 55, 0.8)", "0 0 20px rgba(212, 175, 55, 0.5)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            This is legacy. Not lottery.
          </p>
        </motion.div>
      </motion.div>

      {/* Elite Features Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16"
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="glass-dark p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
          variants={fadeInUp}
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <TrophyIcon className="w-8 h-8 text-obsidian-900" />
          </div>
          <h3 className="text-xl font-bold mb-4">First Access to Deals</h3>
          <p className="text-platinum-300 leading-relaxed">
            Preview investment opportunities 48-72 hours before public release. Secure your position in premium ventures.
          </p>
        </motion.div>

        <motion.div 
          className="glass-dark p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
          variants={fadeInUp}
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-royal-400 to-royal-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <StarIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-4">Exclusive Insights</h3>
          <p className="text-platinum-300 leading-relaxed">
            Monthly market intelligence, deal analysis, and wealth-building strategies from our investment committee.
          </p>
        </motion.div>

        <motion.div 
          className="glass-dark p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
          variants={fadeInUp}
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-platinum-400 to-platinum-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <ShieldCheckIcon className="w-8 h-8 text-obsidian-900" />
          </div>
          <h3 className="text-xl font-bold mb-4">Private Opportunities</h3>
          <p className="text-platinum-300 leading-relaxed">
            Access to invitation-only investment rounds, pre-IPO positions, and private market allocations.
          </p>
        </motion.div>
      </motion.div>

      {/* Exclusive Stats */}
      <motion.div
        className="glass p-8 rounded-3xl max-w-4xl mx-auto mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gold-400 mb-2">< 100</div>
            <div className="text-sm text-platinum-400">Inner Circle Members</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-royal-400 mb-2">$50M+</div>
            <div className="text-sm text-platinum-400">Exclusive Deal Flow</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-platinum-300 mb-2">48hrs</div>
            <div className="text-sm text-platinum-400">Early Access Window</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400 mb-2">285%</div>
            <div className="text-sm text-platinum-400">Avg. Member Returns</div>
          </div>
        </div>
      </motion.div>

      {/* Elite Application CTA */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.button
          onClick={onApplyToInvest}
          className="group relative px-12 py-6 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-obsidian-900 rounded-2xl font-bold text-xl overflow-hidden shadow-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gold-300 to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{ 
              background: [
                "linear-gradient(45deg, #D4AF37, #facc15)",
                "linear-gradient(45deg, #facc15, #D4AF37)",
                "linear-gradient(45deg, #D4AF37, #facc15)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Button content */}
          <span className="relative flex items-center justify-center gap-3">
            Apply to Invest
            <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </span>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl blur-xl opacity-30"
            animate={{ 
              boxShadow: [
                "0 0 40px rgba(212, 175, 55, 0.5)",
                "0 0 80px rgba(212, 175, 55, 0.8)",
                "0 0 40px rgba(212, 175, 55, 0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>

        <p className="text-platinum-500 text-sm mt-6 max-w-2xl mx-auto">
          Membership is limited and by application only. Minimum investment requirements apply. 
          Past performance does not guarantee future results.
        </p>
      </motion.div>
    </section>
  );
};

export default InnerCircleSection;