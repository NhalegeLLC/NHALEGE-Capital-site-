import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import AdminNavigation from './AdminNavigation';
import LeadIntelligence from './LeadIntelligence';
import ConversionAnalytics from './ConversionAnalytics';
import InvestorWorkflow from './InvestorWorkflow';
import PerformanceMonitoring from './PerformanceMonitoring';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalLeads: 0,
    conversionRate: 0,
    totalInvestment: 0,
    activeApplications: 0,
    loading: true
  });

  useEffect(() => {
    // Load dashboard data
    loadDashboardData();
    
    // Load notifications
    loadNotifications();
    
    // Set up real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      loadDashboardData();
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API call - in production, this would call your integrated APIs
      setTimeout(() => {
        setDashboardData({
          totalLeads: 47,
          conversionRate: 23.4,
          totalInvestment: 2850000,
          activeApplications: 12,
          loading: false
        });
      }, 1000);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      // Simulate notifications from integrations
      const mockNotifications = [
        {
          id: 1,
          type: 'high_value_lead',
          message: 'New $500K+ application from Marcus Thompson',
          timestamp: new Date(),
          priority: 'urgent'
        },
        {
          id: 2,
          type: 'conversion',
          message: 'ROI Calculator: 15% conversion rate increase today',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          priority: 'info'
        },
        {
          id: 3,
          type: 'follow_up',
          message: '3 high-priority leads require follow-up',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          priority: 'medium'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nhalege_admin_session');
    onLogout();
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'leads':
        return <LeadIntelligence />;
      case 'analytics':
        return <ConversionAnalytics />;
      case 'workflow':
        return <InvestorWorkflow />;
      case 'performance':
        return <PerformanceMonitoring />;
      default:
        return <OverviewDashboard data={dashboardData} notifications={notifications} />;
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
              <p className="text-sm text-platinum-400">Mission Control Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
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
        <AdminNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
};

// Overview Dashboard Component
const OverviewDashboard = ({ data, notifications }) => {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={data.totalLeads}
          icon={UserGroupIcon}
          color="gold"
          trend="+12%"
          loading={data.loading}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.conversionRate}%`}
          icon={TrendingUpIcon}
          color="green"
          trend="+3.2%"
          loading={data.loading}
        />
        <MetricCard
          title="Total Investment Interest"
          value={`$${(data.totalInvestment / 1000000).toFixed(1)}M`}
          icon={CurrencyDollarIcon}
          color="royal"
          trend="+25%"
          loading={data.loading}
        />
        <MetricCard
          title="Active Applications"
          value={data.activeApplications}
          icon={ChartBarIcon}
          color="platinum"
          trend="+8"
          loading={data.loading}
        />
      </div>

      {/* Recent Activity & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity />
        <NotificationCenter notifications={notifications} />
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, trend, loading }) => {
  const colorClasses = {
    gold: 'from-gold-400 to-gold-600',
    green: 'from-green-400 to-green-600',
    royal: 'from-royal-400 to-royal-600',
    platinum: 'from-platinum-400 to-platinum-600'
  };

  return (
    <motion.div
      className="glass-dark p-6 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-full flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-green-400 text-sm font-semibold">{trend}</span>
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-platinum-600/20 rounded mb-2"></div>
          <div className="h-4 bg-platinum-600/20 rounded w-3/4"></div>
        </div>
      ) : (
        <>
          <div className="text-3xl font-bold mb-2">{value}</div>
          <div className="text-platinum-400 text-sm">{title}</div>
        </>
      )}
    </motion.div>
  );
};

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    { action: 'New application', user: 'Marcus Thompson', amount: '$500K', time: '2 min ago' },
    { action: 'ROI calculation', user: 'Sarah Chen', amount: '$100K', time: '15 min ago' },
    { action: 'Email opened', user: 'David Rodriguez', amount: '$250K', time: '32 min ago' },
    { action: 'Inner Circle signup', user: 'Jennifer Walsh', amount: '$1M+', time: '1 hour ago' }
  ];

  return (
    <motion.div
      className="glass-dark p-6 rounded-2xl"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-obsidian-800/50 rounded-xl">
            <div>
              <div className="font-semibold">{activity.action}</div>
              <div className="text-sm text-platinum-400">{activity.user} • {activity.amount}</div>
            </div>
            <div className="text-xs text-platinum-500">{activity.time}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Notification Center Component
const NotificationCenter = ({ notifications }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-gold-500 bg-gold-500/10';
      default: return 'border-royal-500 bg-royal-500/10';
    }
  };

  return (
    <motion.div
      className="glass-dark p-6 rounded-2xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-bold mb-6">Notifications</h3>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className={`p-4 rounded-xl border ${getPriorityColor(notification.priority)}`}>
            <div className="font-semibold mb-1">{notification.message}</div>
            <div className="text-xs text-platinum-400">
              {notification.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;