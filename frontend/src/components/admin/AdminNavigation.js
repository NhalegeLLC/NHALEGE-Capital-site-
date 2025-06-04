import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const AdminNavigation = ({ activeTab, onTabChange }) => {
  const navigationItems = [
    {
      id: 'overview',
      name: 'Overview',
      icon: HomeIcon,
      description: 'Dashboard summary'
    },
    {
      id: 'leads',
      name: 'Lead Intelligence',
      icon: UserGroupIcon,
      description: 'Investor applications'
    },
    {
      id: 'analytics',
      name: 'Conversion Analytics',
      icon: ChartBarIcon,
      description: 'ROI funnel tracking'
    },
    {
      id: 'workflow',
      name: 'Investor Workflow',
      icon: ClipboardDocumentListIcon,
      description: 'Application pipeline'
    },
    {
      id: 'performance',
      name: 'Performance Monitor',
      icon: CurrencyDollarIcon,
      description: 'Platform metrics'
    }
  ];

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
      
      {/* System Status */}
      <div className="mt-8 p-4 bg-obsidian-800/50 rounded-xl">
        <h4 className="font-semibold mb-3 text-sm">System Status</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span>Mailchimp</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400">Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Analytics</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400">Tracking</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Airtable</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;