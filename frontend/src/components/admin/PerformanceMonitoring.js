import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  CpuChipIcon,
  ClockIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  SignalIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceMonitoring = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    loadPerformanceData();
    loadSystemHealth();
  }, [timeRange]);

  const loadPerformanceData = async () => {
    setLoading(true);
    
    // Simulate performance monitoring data
    setTimeout(() => {
      const mockData = {
        pageLoadTimes: {
          labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
          landingPage: [2.1, 1.9, 2.3, 2.0, 2.4, 2.1],
          calculator: [1.8, 1.7, 2.0, 1.9, 2.1, 1.8],
          dashboard: [3.2, 3.0, 3.5, 3.1, 3.4, 3.2]
        },
        userEngagement: {
          averageSessionDuration: 4.2,
          bounceRate: 23.5,
          pagesPerSession: 3.8,
          calculatorCompletionRate: 78.3
        },
        deviceBreakdown: {
          desktop: 52,
          mobile: 41,
          tablet: 7
        },
        geographicData: [
          { region: 'North America', users: 1456, percentage: 62.3 },
          { region: 'Europe', users: 523, percentage: 22.4 },
          { region: 'Asia Pacific', users: 287, percentage: 12.3 },
          { region: 'Other', users: 71, percentage: 3.0 }
        ],
        conversionMetrics: {
          calculatorToEmail: 29.8,
          emailToApplication: 17.2,
          applicationToApproval: 25.5,
          overallConversion: 3.2
        }
      };
      
      setPerformanceData(mockData);
      setLoading(false);
    }, 1000);
  };

  const loadSystemHealth = async () => {
    // Simulate system health monitoring
    const healthData = {
      integrations: [
        { name: 'Mailchimp API', status: 'healthy', responseTime: 145, uptime: 99.9 },
        { name: 'Google Analytics', status: 'healthy', responseTime: 89, uptime: 100.0 },
        { name: 'Airtable API', status: 'healthy', responseTime: 167, uptime: 99.8 },
        { name: 'Website CDN', status: 'healthy', responseTime: 52, uptime: 99.95 }
      ],
      errors: [
        { type: 'JavaScript Error', count: 3, lastOccurred: '2 hours ago' },
        { type: 'Network Timeout', count: 1, lastOccurred: '6 hours ago' }
      ],
      performance: {
        serverResponseTime: 89,
        databaseQueries: 156,
        cacheHitRate: 94.2,
        memoryUsage: 68.5
      }
    };
    
    setSystemHealth(healthData);
  };

  const pageLoadData = {
    labels: performanceData ? performanceData.pageLoadTimes.labels : [],
    datasets: [
      {
        label: 'Landing Page (s)',
        data: performanceData ? performanceData.pageLoadTimes.landingPage : [],
        borderColor: 'rgba(212, 175, 55, 1)',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      },
      {
        label: 'ROI Calculator (s)',
        data: performanceData ? performanceData.pageLoadTimes.calculator : [],
        borderColor: 'rgba(37, 99, 235, 1)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Admin Dashboard (s)',
        data: performanceData ? performanceData.pageLoadTimes.dashboard : [],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: performanceData ? [
          performanceData.deviceBreakdown.desktop,
          performanceData.deviceBreakdown.mobile,
          performanceData.deviceBreakdown.tablet
        ] : [],
        backgroundColor: [
          'rgba(212, 175, 55, 0.8)',
          'rgba(37, 99, 235, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderWidth: 2
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-platinum-300">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Performance Monitoring</h2>
          <p className="text-platinum-400">Platform metrics & system health tracking</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-obsidian-800 border border-platinum-600 rounded-xl py-2 px-4 text-white focus:border-gold-400 focus:outline-none"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PerformanceCard
          title="Avg Load Time"
          value="2.1s"
          icon={ClockIcon}
          color="green"
          trend="-0.3s"
          subtitle="Landing Page"
        />
        <PerformanceCard
          title="Session Duration"
          value={`${performanceData.userEngagement.averageSessionDuration}m`}
          icon={CpuChipIcon}
          color="royal"
          trend="+0.8m"
          subtitle="Average Time"
        />
        <PerformanceCard
          title="Bounce Rate"
          value={`${performanceData.userEngagement.bounceRate}%`}
          icon={SignalIcon}
          color="gold"
          trend="-2.1%"
          subtitle="Page Exits"
        />
        <PerformanceCard
          title="Completion Rate"
          value={`${performanceData.userEngagement.calculatorCompletionRate}%`}
          icon={CheckCircleIcon}
          color="platinum"
          trend="+5.2%"
          subtitle="ROI Calculator"
        />
      </div>

      {/* System Health Status */}
      <motion.div
        className="glass-dark p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <CpuChipIcon className="w-6 h-6 text-green-400" />
          System Health Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemHealth && systemHealth.integrations.map((integration, index) => (
            <div key={index} className="bg-obsidian-800/50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{integration.name}</span>
                <div className={`w-3 h-3 rounded-full ${
                  integration.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
              </div>
              <div className="text-xs text-platinum-400 space-y-1">
                <div>Response: {integration.responseTime}ms</div>
                <div>Uptime: {integration.uptime}%</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Page Load Performance */}
        <motion.div
          className="glass-dark p-6 rounded-2xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ClockIcon className="w-6 h-6 text-gold-400" />
            Page Load Performance
          </h3>
          <div className="h-80">
            <Line data={pageLoadData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          className="glass-dark p-6 rounded-2xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <DevicePhoneMobileIcon className="w-6 h-6 text-royal-400" />
            Device Breakdown
          </h3>
          <div className="h-80">
            <Bar data={deviceData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Geographic Distribution */}
      <motion.div
        className="glass-dark p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <GlobeAltIcon className="w-6 h-6 text-platinum-400" />
          Geographic Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceData.geographicData.map((region, index) => (
            <div key={index} className="bg-obsidian-800/50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{region.region}</span>
                <span className="text-gold-400 font-bold">{region.percentage}%</span>
              </div>
              <div className="text-platinum-400 text-sm">{region.users.toLocaleString()} users</div>
              <div className="w-full bg-obsidian-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-gold-400 to-royal-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${region.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Error Monitoring */}
      {systemHealth && systemHealth.errors.length > 0 && (
        <motion.div
          className="glass-dark p-6 rounded-2xl border border-red-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-400">
            <ExclamationCircleIcon className="w-6 h-6" />
            Recent Errors
          </h3>
          <div className="space-y-3">
            {systemHealth.errors.map((error, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl">
                <div>
                  <div className="font-semibold text-red-400">{error.type}</div>
                  <div className="text-sm text-platinum-400">Last occurred: {error.lastOccurred}</div>
                </div>
                <div className="text-red-400 font-bold">
                  {error.count} {error.count === 1 ? 'occurrence' : 'occurrences'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Performance Summary */}
      <motion.div
        className="glass-dark p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-xl font-bold mb-6">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {systemHealth.performance.serverResponseTime}ms
            </div>
            <div className="text-platinum-400 text-sm">Server Response</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-royal-400 mb-2">
              {systemHealth.performance.databaseQueries}
            </div>
            <div className="text-platinum-400 text-sm">DB Queries/min</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gold-400 mb-2">
              {systemHealth.performance.cacheHitRate}%
            </div>
            <div className="text-platinum-400 text-sm">Cache Hit Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-platinum-400 mb-2">
              {systemHealth.performance.memoryUsage}%
            </div>
            <div className="text-platinum-400 text-sm">Memory Usage</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Performance Card Component
const PerformanceCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  const colorClasses = {
    gold: 'from-gold-400 to-gold-600',
    green: 'from-green-400 to-green-600',
    royal: 'from-royal-400 to-royal-600',
    platinum: 'from-platinum-400 to-platinum-600'
  };

  const trendColor = trend.startsWith('+') ? 'text-green-400' : 'text-red-400';

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
        <span className={`text-sm font-semibold ${trendColor}`}>{trend}</span>
      </div>
      
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-platinum-400 text-sm">{title}</div>
      {subtitle && <div className="text-platinum-500 text-xs mt-1">{subtitle}</div>}
    </motion.div>
  );
};

export default PerformanceMonitoring;