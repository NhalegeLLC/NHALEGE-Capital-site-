import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  AcademicCapIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import MFASettings from './MFASettings';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Dashboard = ({ onBackToLanding }) => {
  const [portfolioValue] = useState(7350);
  const [initialInvestment] = useState(5000);
  const [monthlyGrowth] = useState(6.2);
  const [nextReturnDate] = useState('March 15, 2024');
  const [showSettings, setShowSettings] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${backendUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };
  
  // Mock allocation data
  const allocationData = {
    labels: ['Real Estate', 'eCommerce & Startups', 'Digital IP & Media', 'Reserve/Education'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ['#D4AF37', '#2563eb', '#3b82f6', '#64748b'],
        borderColor: ['#facc15', '#1d4ed8', '#1e40af', '#475569'],
        borderWidth: 2,
      },
    ],
  };

  const performanceData = {
    labels: ['July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'],
    datasets: [
      {
        label: 'Portfolio Value ($)',
        data: [5000, 5310, 5639, 5988, 6358, 6752, 7170, 7614, 7350],
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(100, 116, 139, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
      },
      x: {
        grid: {
          color: 'rgba(100, 116, 139, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const contributionHistory = [
    { date: 'July 2023', amount: 5000, type: 'Initial Investment' },
    { date: 'October 2023', amount: 500, type: 'Monthly Addition' },
    { date: 'January 2024', amount: 1000, type: 'Bonus Investment' },
  ];

  const educationModules = [
    { title: 'Real Estate Investment Fundamentals', progress: 100, unlocked: true },
    { title: 'Startup Evaluation Masterclass', progress: 75, unlocked: true },
    { title: 'Portfolio Diversification Strategies', progress: 45, unlocked: true },
    { title: 'Advanced Tax Optimization', progress: 0, unlocked: false },
  ];

  const totalGain = portfolioValue - initialInvestment;
  const totalGainPercentage = ((totalGain / initialInvestment) * 100);

  if (showSettings) {
    return (
      <div className="min-h-screen bg-obsidian-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setShowSettings(false)}
              className="flex items-center gap-2 text-platinum-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold gradient-text">Account Settings</h1>
          </div>
          
          {currentUser && (
            <MFASettings user={currentUser} onUpdate={handleUserUpdate} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToLanding}
              className="w-10 h-10 rounded-full bg-obsidian-800 flex items-center justify-center hover:bg-obsidian-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Nhalege Capital</h1>
              <p className="text-platinum-400">Contributors Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 rounded-full bg-obsidian-800 flex items-center justify-center hover:bg-obsidian-700 transition-colors"
              title="Account Settings"
            >
              <CogIcon className="w-5 h-5" />
            </button>
            <div className="text-right">
              <p className="text-sm text-platinum-400">Welcome back,</p>
              <p className="font-semibold">
                {currentUser?.email || 'Loading...'}
                {currentUser?.mfa_enabled && (
                  <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    MFA ✓
                  </span>
                )}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-obsidian-900 font-bold">
              {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </motion.div>

        {/* Overview Panel */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glass-dark p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <CurrencyDollarIcon className="w-8 h-8 text-gold-400" />
              <span className="text-xs text-platinum-400 bg-green-500/20 px-2 py-1 rounded-full">+{monthlyGrowth}%</span>
            </div>
            <div className="text-2xl font-bold text-gold-400">${portfolioValue.toLocaleString()}</div>
            <div className="text-sm text-platinum-400">Portfolio Value</div>
          </div>

          <div className="glass-dark p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <ArrowTrendingUpIcon className="w-8 h-8 text-green-400" />
              <span className="text-xs text-platinum-400">This Period</span>
            </div>
            <div className="text-2xl font-bold text-green-400">+${totalGain.toLocaleString()}</div>
            <div className="text-sm text-platinum-400">Total Gains ({totalGainPercentage.toFixed(1)}%)</div>
          </div>

          <div className="glass-dark p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="w-8 h-8 text-royal-400" />
              <span className="text-xs text-platinum-400">Monthly Avg</span>
            </div>
            <div className="text-2xl font-bold text-royal-400">{monthlyGrowth}%</div>
            <div className="text-sm text-platinum-400">Growth Rate</div>
          </div>

          <div className="glass-dark p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <CurrencyDollarIcon className="w-8 h-8 text-platinum-400" />
              <span className="text-xs text-platinum-400">Scheduled</span>
            </div>
            <div className="text-lg font-bold text-platinum-200">{nextReturnDate}</div>
            <div className="text-sm text-platinum-400">Next Return Date</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Chart */}
            <motion.div
              className="glass-dark p-6 rounded-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-6">Portfolio Performance</h3>
              <div className="h-64">
                <Line data={performanceData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="glass-dark p-6 rounded-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center justify-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors">
                  <ArrowDownTrayIcon className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-semibold">Request Withdrawal</span>
                </button>
                <button className="flex items-center justify-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-colors">
                  <PlusIcon className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Increase Contribution</span>
                </button>
                <button className="flex items-center justify-center gap-3 p-4 bg-gold-500/10 border border-gold-500/20 rounded-xl hover:bg-gold-500/20 transition-colors">
                  <ShareIcon className="w-5 h-5 text-gold-400" />
                  <span className="text-gold-400 font-semibold">Refer Partner</span>
                </button>
              </div>
            </motion.div>

            {/* Contribution History */}
            <motion.div
              className="glass-dark p-6 rounded-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h3 className="text-xl font-bold mb-6">Contribution History</h3>
              <div className="space-y-4">
                {contributionHistory.map((contribution, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-obsidian-800 rounded-xl">
                    <div>
                      <div className="font-semibold">{contribution.type}</div>
                      <div className="text-sm text-platinum-400">{contribution.date}</div>
                    </div>
                    <div className="text-lg font-bold text-gold-400">
                      +${contribution.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Portfolio Allocation */}
            <motion.div
              className="glass-dark p-6 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-6">Portfolio Allocation</h3>
              <div className="h-64 mb-4">
                <Doughnut data={allocationData} options={doughnutOptions} />
              </div>
              <div className="space-y-2">
                {allocationData.labels.map((label, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: allocationData.datasets[0].backgroundColor[index] }}
                      ></div>
                      <span>{label}</span>
                    </div>
                    <span className="font-semibold">{allocationData.datasets[0].data[index]}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Education Portal */}
            <motion.div
              className="glass-dark p-6 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <AcademicCapIcon className="w-6 h-6 text-royal-400" />
                <h3 className="text-xl font-bold">Education Portal</h3>
              </div>
              <div className="space-y-4">
                {educationModules.map((module, index) => (
                  <div key={index} className={`p-4 rounded-xl ${module.unlocked ? 'bg-obsidian-800' : 'bg-obsidian-800/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold text-sm ${module.unlocked ? 'text-white' : 'text-platinum-500'}`}>
                        {module.title}
                      </span>
                      {!module.unlocked && (
                        <span className="text-xs text-gold-400 bg-gold-400/20 px-2 py-1 rounded-full">
                          Locked
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-obsidian-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-gold-400 to-royal-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-platinum-400 mt-1">{module.progress}% Complete</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Referral Stats */}
            <motion.div
              className="glass-dark p-6 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h3 className="text-xl font-bold mb-6">Referral Dashboard</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400 mb-2">$1,250</div>
                <div className="text-sm text-platinum-400 mb-4">Earned from 3 successful referrals</div>
                <div className="flex items-center justify-between text-sm bg-obsidian-800 p-3 rounded-xl">
                  <span>Active Referrals:</span>
                  <span className="font-semibold">3</span>
                </div>
                <button className="w-full mt-4 btn-secondary py-3 rounded-xl font-semibold">
                  Share Referral Link
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;