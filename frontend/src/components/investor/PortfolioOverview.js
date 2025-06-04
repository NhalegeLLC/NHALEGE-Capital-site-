import React from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { 
  CurrencyDollarIcon,
  TrendingUpIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  StarIcon
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PortfolioOverview = ({ investor, portfolioData }) => {
  const { currentValue, totalGain, gainPercentage, loading } = portfolioData;

  // Generate historical performance data
  const generatePerformanceData = () => {
    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const baseAmount = investor.investmentAmount;
    const monthlyGrowthRate = getTierGrowthRate(investor.tier);
    
    const data = [baseAmount];
    for (let i = 1; i < months.length; i++) {
      data.push(data[i-1] * (1 + monthlyGrowthRate));
    }
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Portfolio Value ($)',
          data: data,
          borderColor: 'rgba(212, 175, 55, 1)',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        }
      ]
    };
  };

  const getTierGrowthRate = (tier) => {
    switch (tier) {
      case 'Legacy': return 0.078;
      case 'Sovereign': return 0.065;
      case 'Ascendant': return 0.055;
      default: return 0.055;
    }
  };

  // Portfolio allocation data
  const allocationData = {
    labels: ['Real Estate', 'Technology Startups', 'Digital Assets', 'Reserve Fund'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: [
          'rgba(212, 175, 55, 0.8)',
          'rgba(37, 99, 235, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(100, 116, 139, 0.8)'
        ],
        borderColor: [
          'rgba(212, 175, 55, 1)',
          'rgba(37, 99, 235, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(100, 116, 139, 1)'
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8'
        }
      }
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
        }
      },
      x: {
        grid: {
          color: 'rgba(100, 116, 139, 0.1)',
        },
        ticks: {
          color: '#94a3b8'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 20
        }
      }
    }
  };

  const milestones = [
    { date: 'June 2023', event: 'Initial Investment', amount: investor.investmentAmount },
    { date: 'September 2023', event: 'First Quarterly Return', amount: Math.round(investor.investmentAmount * 1.15) },
    { date: 'December 2023', event: 'Year-End Performance', amount: Math.round(investor.investmentAmount * 1.35) },
    { date: 'March 2024', event: 'Current Value', amount: currentValue }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <motion.div
        className="glass-dark p-6 rounded-2xl border border-gold-400/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              Welcome back, {investor.name}.
            </h2>
            <p className="text-platinum-300 text-lg">Your legacy grows stronger.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gold-400 mb-1">
              {investor.tier}
            </div>
            <div className="text-sm text-platinum-400">Investor Tier</div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Current Portfolio Value"
          value={loading ? "Loading..." : `$${currentValue.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          color="gold"
          trend={loading ? "" : `+${gainPercentage.toFixed(1)}%`}
          loading={loading}
        />
        <MetricCard
          title="Total Gains"
          value={loading ? "Loading..." : `$${totalGain.toLocaleString()}`}
          icon={TrendingUpIcon}
          color="green"
          trend={loading ? "" : "Since June 2023"}
          loading={loading}
        />
        <MetricCard
          title="Monthly Growth Rate"
          value={`${(getTierGrowthRate(investor.tier) * 100).toFixed(1)}%`}
          icon={ChartBarIcon}
          color="royal"
          trend="Average"
          loading={false}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <motion.div
          className="glass-dark p-6 rounded-2xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ArrowTrendingUpIcon className="w-6 h-6 text-gold-400" />
            Portfolio Performance
          </h3>
          <div className="h-80">
            <Line data={generatePerformanceData()} options={chartOptions} />
          </div>
        </motion.div>

        {/* Portfolio Allocation */}
        <motion.div
          className="glass-dark p-6 rounded-2xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-royal-400" />
            Asset Allocation
          </h3>
          <div className="h-80">
            <Doughnut data={allocationData} options={doughnutOptions} />
          </div>
        </motion.div>
      </div>

      {/* Investment Timeline */}
      <motion.div
        className="glass-dark p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-platinum-400" />
          Investment Milestones
        </h3>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-obsidian-800/50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-gold-400 rounded-full"></div>
                <div>
                  <div className="font-semibold">{milestone.event}</div>
                  <div className="text-sm text-platinum-400">{milestone.date}</div>
                </div>
              </div>
              <div className="text-lg font-bold text-gold-400">
                ${milestone.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <ActionCard
          title="View Documents"
          description="Access your investment agreements and statements"
          buttonText="Open Vault"
          color="gold"
        />
        <ActionCard
          title="New Opportunities"
          description="Explore exclusive deals available for your tier"
          buttonText="Browse Deals"
          color="royal"
        />
        <ActionCard
          title="Education Resources"
          description="Continue your wealth building education"
          buttonText="Learn More"
          color="platinum"
        />
      </motion.div>
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
        {trend && (
          <span className="text-green-400 text-sm font-semibold">{trend}</span>
        )}
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-platinum-600/20 rounded mb-2"></div>
          <div className="h-4 bg-platinum-600/20 rounded w-3/4"></div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold mb-2">{value}</div>
          <div className="text-platinum-400 text-sm">{title}</div>
        </>
      )}
    </motion.div>
  );
};

// Action Card Component
const ActionCard = ({ title, description, buttonText, color }) => {
  const colorClasses = {
    gold: 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30',
    royal: 'bg-royal-500/20 text-royal-400 hover:bg-royal-500/30',
    platinum: 'bg-platinum-500/20 text-platinum-400 hover:bg-platinum-500/30'
  };

  return (
    <div className="glass-dark p-6 rounded-2xl">
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <p className="text-platinum-400 text-sm mb-4">{description}</p>
      <button className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${colorClasses[color]}`}>
        {buttonText}
      </button>
    </div>
  );
};

export default PortfolioOverview;