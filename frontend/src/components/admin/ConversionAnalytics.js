import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
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
  BarElement,
} from 'chart.js';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const ConversionAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    // Simulate API call to Google Analytics
    setTimeout(() => {
      const mockData = {
        conversionFunnel: {
          landingPageViews: 2847,
          roiCalculatorUses: 892,
          emailSubmissions: 267,
          innerCircleApplications: 47,
          approvedInvestors: 12
        },
        conversionRates: {
          landingToCalculator: 31.3,
          calculatorToEmail: 29.9,
          emailToApplication: 17.6,
          applicationToApproval: 25.5
        },
        trafficSources: [
          { source: 'Organic Search', visitors: 1247, conversions: 23, value: 1150000 },
          { source: 'Direct', visitors: 856, conversions: 18, value: 920000 },
          { source: 'Social Media', visitors: 498, conversions: 4, value: 180000 },
          { source: 'Referral', visitors: 246, conversions: 2, value: 600000 }
        ],
        dailyMetrics: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          visitors: [385, 425, 378, 462, 398, 289, 356],
          conversions: [8, 12, 7, 15, 11, 4, 9],
          roiCalculations: [125, 148, 132, 167, 145, 98, 134]
        }
      };
      
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  };

  const funnelData = {
    labels: ['Landing Page', 'ROI Calculator', 'Email Signup', 'Inner Circle App', 'Approved'],
    datasets: [
      {
        label: 'Conversion Funnel',
        data: analyticsData ? [
          analyticsData.conversionFunnel.landingPageViews,
          analyticsData.conversionFunnel.roiCalculatorUses,
          analyticsData.conversionFunnel.emailSubmissions,
          analyticsData.conversionFunnel.innerCircleApplications,
          analyticsData.conversionFunnel.approvedInvestors
        ] : [],
        backgroundColor: [
          'rgba(212, 175, 55, 0.8)',
          'rgba(37, 99, 235, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgba(212, 175, 55, 1)',
          'rgba(37, 99, 235, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const trafficSourceData = {
    labels: analyticsData ? analyticsData.trafficSources.map(s => s.source) : [],
    datasets: [
      {
        data: analyticsData ? analyticsData.trafficSources.map(s => s.visitors) : [],
        backgroundColor: [
          'rgba(212, 175, 55, 0.8)',
          'rgba(37, 99, 235, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderWidth: 2
      }
    ]
  };

  const dailyTrendsData = {
    labels: analyticsData ? analyticsData.dailyMetrics.labels : [],
    datasets: [
      {
        label: 'Visitors',
        data: analyticsData ? analyticsData.dailyMetrics.visitors : [],
        borderColor: 'rgba(212, 175, 55, 1)',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Conversions',
        data: analyticsData ? analyticsData.dailyMetrics.conversions : [],
        borderColor: 'rgba(37, 99, 235, 1)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
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
          color: '#94a3b8'
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-platinum-300">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Conversion Analytics</h2>
          <p className="text-platinum-400">ROI funnel tracking & performance insights</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-obsidian-800 border border-platinum-600 rounded-xl py-2 px-4 text-white focus:border-gold-400 focus:outline-none"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Conversion Rate"
          value={`${analyticsData.conversionRates.landingToCalculator}%`}
          icon={ArrowTrendingUpIcon}
          color="green"
          trend="+2.1%"
          subtitle="Landing to Calculator"
        />
        <MetricCard
          title="Email Capture Rate"
          value={`${analyticsData.conversionRates.calculatorToEmail}%`}
          icon={UserGroupIcon}
          color="royal"
          trend="+5.3%"
          subtitle="Calculator to Email"
        />
        <MetricCard
          title="Application Rate"
          value={`${analyticsData.conversionRates.emailToApplication}%`}
          icon={ChartBarIcon}
          color="gold"
          trend="+1.8%"
          subtitle="Email to Application"
        />
        <MetricCard
          title="Approval Rate"
          value={`${analyticsData.conversionRates.applicationToApproval}%`}
          icon={CurrencyDollarIcon}
          color="platinum"
          trend="+3.5%"
          subtitle="Application to Approval"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversion Funnel */}
        <motion.div
          className="glass-dark p-6 rounded-2xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-gold-400" />
            Conversion Funnel
          </h3>
          <div className="h-80">
            <Bar data={funnelData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          className="glass-dark p-6 rounded-2xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <UserGroupIcon className="w-6 h-6 text-royal-400" />
            Traffic Sources
          </h3>
          <div className="h-80">
            <Doughnut data={trafficSourceData} options={doughnutOptions} />
          </div>
        </motion.div>
      </div>

      {/* Daily Trends */}
      <motion.div
        className="glass-dark p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-platinum-400" />
          Daily Performance Trends
        </h3>
        <div className="h-80">
          <Line data={dailyTrendsData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Traffic Source Details */}
      <motion.div
        className="glass-dark p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-bold mb-6">Traffic Source Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-platinum-600/20">
                <th className="text-left py-3 px-4 text-platinum-400">Source</th>
                <th className="text-right py-3 px-4 text-platinum-400">Visitors</th>
                <th className="text-right py-3 px-4 text-platinum-400">Conversions</th>
                <th className="text-right py-3 px-4 text-platinum-400">Conv. Rate</th>
                <th className="text-right py-3 px-4 text-platinum-400">Value</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.trafficSources.map((source, index) => (
                <tr key={index} className="border-b border-platinum-600/10 hover:bg-obsidian-800/30">
                  <td className="py-3 px-4 font-semibold">{source.source}</td>
                  <td className="py-3 px-4 text-right">{source.visitors.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-gold-400">{source.conversions}</td>
                  <td className="py-3 px-4 text-right">
                    {((source.conversions / source.visitors) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right text-green-400">
                    ${source.value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
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
      
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-platinum-400 text-sm">{title}</div>
      {subtitle && <div className="text-platinum-500 text-xs mt-1">{subtitle}</div>}
    </motion.div>
  );
};

export default ConversionAnalytics;