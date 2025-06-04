import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HomeIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const InvestorNavigation = ({ activeTab, onTabChange, investor }) => {
  const navigationItems = [
    {
      id: 'overview',
      name: 'Portfolio',
      icon: HomeIcon,
      description: 'Investment overview'
    },
    {
      id: 'documents',
      name: 'Document Vault',
      icon: DocumentTextIcon,
      description: 'Secure file storage'
    },
    {
      id: 'deals',
      name: 'Deal Flow',
      icon: BriefcaseIcon,
      description: 'Investment opportunities'
    },
    {
      id: 'education',
      name: 'Education Center',
      icon: AcademicCapIcon,
      description: 'Wealth building resources'
    }
  ];

  const getTierAccess = (tier) => {
    switch (tier) {
      case 'Legacy': return { deals: 'Premium Access', education: 'All Content', color: 'text-gold-400' };
      case 'Sovereign': return { deals: 'Priority Access', education: 'Advanced Content', color: 'text-platinum-400' };
      case 'Ascendant': return { deals: 'Standard Access', education: 'Core Content', color: 'text-royal-400' };
      default: return { deals: 'Standard Access', education: 'Core Content', color: 'text-royal-400' };
    }
  };

  const tierAccess = getTierAccess(investor.tier);

  return (
    <nav className="w-64 bg-obsidian-950 border-r border-platinum-700/20 p-6">
      <div className="space-y-2">
        {navigationItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-gold-400/20 to-gold-600/20 border border-gold-400/30 text-gold-400'
                : 'hover:bg-obsidian-800 text-platinum-300 hover:text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs opacity-70">{item.description}</div>
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Investor Tier Info */}
      <div className="mt-8 p-4 bg-obsidian-800/50 rounded-xl">
        <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
          <ShieldCheckIcon className="w-4 h-4" />
          Your Access Level
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span>Tier Status</span>
            <div className={`font-semibold ${tierAccess.color}`}>
              {investor.tier}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Deal Access</span>
            <div className={`font-semibold ${tierAccess.color}`}>
              {tierAccess.deals}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Education</span>
            <div className={`font-semibold ${tierAccess.color}`}>
              {tierAccess.education}
            </div>
          </div>
        </div>
      </div>

      {/* Investment Summary */}
      <div className="mt-4 p-4 bg-gradient-to-br from-gold-500/10 to-royal-500/10 rounded-xl border border-gold-400/20">
        <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
          <CurrencyDollarIcon className="w-4 h-4 text-gold-400" />
          Investment Summary
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-platinum-400">Initial Investment</span>
            <div className="font-semibold text-white">
              ${investor.investmentAmount.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-platinum-400">Status</span>
            <div className="font-semibold text-green-400">
              Active
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-platinum-400">Since</span>
            <div className="font-semibold text-platinum-300">
              June 2023
            </div>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="mt-4 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
        <div className="flex items-center gap-2 text-sm">
          <ShieldCheckIcon className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-semibold">Vault Protected</span>
        </div>
        <div className="text-xs text-platinum-500 mt-1">
          256-bit encryption active
        </div>
      </div>
    </nav>
  );
};

export default InvestorNavigation;