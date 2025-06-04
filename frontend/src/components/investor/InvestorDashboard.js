import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  BellIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import InvestorNavigation from './InvestorNavigation';
import PortfolioOverview from './PortfolioOverview';
import DocumentVault from './DocumentVault';
import DealFlow from './DealFlow';
import EducationCenter from './EducationCenter';

const InvestorDashboard = ({ investor, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [portfolioData, setPortfolioData] = useState({
    currentValue: 0,
    totalGain: 0,
    gainPercentage: 0,
    loading: true
  });

  useEffect(() => {
    // Load investor-specific data
    loadPortfolioData();
    loadNotifications();
  }, [investor]);

  const loadPortfolioData = () => {
    // Simulate portfolio data based on investor tier and amount
    const baseAmount = investor.investmentAmount;
    const monthsInvested = 8; // Simulate 8 months of investment
    const monthlyGrowthRate = getTierGrowthRate(investor.tier);
    
    const currentValue = baseAmount * Math.pow(1 + monthlyGrowthRate, monthsInvested);
    const totalGain = currentValue - baseAmount;
    const gainPercentage = (totalGain / baseAmount) * 100;

    setTimeout(() => {
      setPortfolioData({
        currentValue: Math.round(currentValue),
        totalGain: Math.round(totalGain),
        gainPercentage: gainPercentage,
        loading: false
      });
    }, 1000);
  };

  const getTierGrowthRate = (tier) => {
    // Different growth rates by tier (monthly)
    switch (tier) {
      case 'Legacy': return 0.078; // 7.8% monthly
      case 'Sovereign': return 0.065; // 6.5% monthly  
      case 'Ascendant': return 0.055; // 5.5% monthly
      default: return 0.055;
    }
  };

  const loadNotifications = () => {
    const mockNotifications = [
      {
        id: 1,
        type: 'investment_update',
        message: 'Q1 portfolio performance report available',
        timestamp: new Date(),
        priority: 'info'
      },
      {
        id: 2,
        type: 'new_opportunity',
        message: 'Exclusive PropTech deal now available for your tier',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        priority: 'high'
      }
    ];
    
    setNotifications(mockNotifications);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nhalege_investor_session');
    onLogout();
  };

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case 'Legacy': return 'from-gold-400 to-gold-600';
      case 'Sovereign': return 'from-platinum-400 to-platinum-600';
      case 'Ascendant': return 'from-royal-400 to-royal-600';
      default: return 'from-platinum-400 to-platinum-600';
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Legacy': return '👑';
      case 'Sovereign': return '💎';
      case 'Ascendant': return '⭐';
      default: return '⭐';
    }
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'documents':
        return <DocumentVault investor={investor} />;
      case 'deals':
        return <DealFlow investor={investor} />;
      case 'education':
        return <EducationCenter investor={investor} />;
      default:
        return <PortfolioOverview investor={investor} portfolioData={portfolioData} />;
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-900 text-white">
      {/* Header */}
      <header className="bg-obsidian-950 border-b border-platinum-700/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
              <span className="text-obsidian-900 font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Nhalege Capital</h1>
              <p className="text-sm text-platinum-400">Investor Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Investor Info */}
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">Welcome back, {investor.name.split(' ')[0]}.</span>
                <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getTierBadgeColor(investor.tier)} text-obsidian-900`}>
                  {getTierIcon(investor.tier)} {investor.tier}
                </div>
              </div>
              <p className="text-sm text-platinum-400">Your legacy grows stronger.</p>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button className="w-10 h-10 rounded-full bg-obsidian-800 flex items-center justify-center hover:bg-obsidian-700 transition-colors">
                <BellIcon className="w-5 h-5" />
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {notifications.length}
                  </div>
                )}
              </button>
            </div>
            
            {/* Settings */}
            <button className="w-10 h-10 rounded-full bg-obsidian-800 flex items-center justify-center hover:bg-obsidian-700 transition-colors">
              <CogIcon className="w-5 h-5" />
            </button>
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors text-red-400"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <InvestorNavigation activeTab={activeTab} onTabChange={setActiveTab} investor={investor} />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderActiveComponent()}
        </main>
      </div>

      {/* Security Status Bar */}
      <div className="fixed bottom-4 right-4 glass-dark p-3 rounded-xl border border-green-500/20">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircleIcon className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-semibold">Vault Secured</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;