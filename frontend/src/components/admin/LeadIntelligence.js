import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { airtableService } from '../../services/airtableService';

const LeadIntelligence = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('leadScore');

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterAndSortLeads();
  }, [leads, searchTerm, filterStatus, sortBy]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      
      // Mock lead data for demonstration
      const mockLeads = [
        {
          id: 1,
          firstName: 'Marcus',
          lastName: 'Thompson',
          email: 'marcus.thompson@example.com',
          phone: '+1 (555) 123-4567',
          investmentCapacity: '500000-1000000',
          accreditedStatus: 'yes',
          leadScore: 185,
          priority: 'Immediate',
          status: 'New Application',
          source: 'inner-circle-application',
          timestamp: new Date('2024-01-15T10:30:00'),
          followUpRequired: true,
          interestLevel: 'Ultra High',
          additionalInfo: 'Interested in PropTech and renewable energy investments. Has previous VC experience.'
        },
        {
          id: 2,
          firstName: 'Sarah',
          lastName: 'Chen',
          email: 'sarah.chen@techstartup.com',
          phone: '+1 (555) 234-5678',
          investmentCapacity: '250000-500000',
          accreditedStatus: 'yes',
          leadScore: 165,
          priority: 'High',
          status: 'Reviewing',
          source: 'roi-calculator',
          timestamp: new Date('2024-01-15T09:15:00'),
          followUpRequired: true,
          interestLevel: 'High',
          additionalInfo: 'CEO of tech startup, looking for diversification opportunities.'
        },
        {
          id: 3,
          firstName: 'David',
          lastName: 'Rodriguez',
          email: 'david.rodriguez@realestate.com',
          phone: '+1 (555) 345-6789',
          investmentCapacity: '100000-250000',
          accreditedStatus: 'no',
          leadScore: 140,
          priority: 'Medium',
          status: 'Contacted',
          source: 'website',
          timestamp: new Date('2024-01-14T16:45:00'),
          followUpRequired: false,
          interestLevel: 'Medium-High',
          additionalInfo: 'Real estate professional interested in portfolio expansion.'
        },
        {
          id: 4,
          firstName: 'Jennifer',
          lastName: 'Walsh',
          email: 'jennifer.walsh@investment.com',
          phone: '+1 (555) 456-7890',
          investmentCapacity: '1000000+',
          accreditedStatus: 'yes',
          leadScore: 195,
          priority: 'Immediate',
          status: 'Approved',
          source: 'referral',
          timestamp: new Date('2024-01-14T14:20:00'),
          followUpRequired: false,
          interestLevel: 'Ultra High',
          additionalInfo: 'High-net-worth individual with $5M+ investment portfolio.'
        },
        {
          id: 5,
          firstName: 'Michael',
          lastName: 'Foster',
          email: 'michael.foster@consulting.com',
          phone: '+1 (555) 567-8901',
          investmentCapacity: '50000-100000',
          accreditedStatus: 'no',
          leadScore: 95,
          priority: 'Standard',
          status: 'New Application',
          source: 'roi-calculator',
          timestamp: new Date('2024-01-14T11:10:00'),
          followUpRequired: true,
          interestLevel: 'Medium',
          additionalInfo: 'Management consultant exploring investment opportunities.'
        }
      ];
      
      setLeads(mockLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortLeads = () => {
    let filtered = [...leads];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.investmentCapacity.includes(searchTerm)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => 
        filterStatus === 'followup' ? lead.followUpRequired : lead.status === filterStatus
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'leadScore':
          return b.leadScore - a.leadScore;
        case 'timestamp':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'investment':
          return getInvestmentValue(b.investmentCapacity) - getInvestmentValue(a.investmentCapacity);
        default:
          return 0;
      }
    });

    setFilteredLeads(filtered);
  };

  const getInvestmentValue = (capacity) => {
    const values = {
      '1000000+': 1000000,
      '500000-1000000': 750000,
      '250000-500000': 375000,
      '100000-250000': 175000,
      '50000-100000': 75000,
      '25000-50000': 37500
    };
    return values[capacity] || 0;
  };

  const getScoreColor = (score) => {
    if (score >= 180) return 'text-green-400 bg-green-400/20';
    if (score >= 150) return 'text-gold-400 bg-gold-400/20';
    if (score >= 120) return 'text-royal-400 bg-royal-400/20';
    return 'text-platinum-400 bg-platinum-400/20';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Immediate': return 'text-red-400 bg-red-400/20';
      case 'High': return 'text-gold-400 bg-gold-400/20';
      case 'Medium': return 'text-royal-400 bg-royal-400/20';
      default: return 'text-platinum-400 bg-platinum-400/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'text-green-400 bg-green-400/20';
      case 'Reviewing': return 'text-gold-400 bg-gold-400/20';
      case 'Contacted': return 'text-royal-400 bg-royal-400/20';
      default: return 'text-platinum-400 bg-platinum-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Lead Intelligence Center</h2>
          <p className="text-platinum-400">Real-time investor application monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-gold-400">{filteredLeads.length}</div>
            <div className="text-sm text-platinum-400">Active Leads</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-dark p-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-platinum-500" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
          >
            <option value="all">All Status</option>
            <option value="New Application">New Applications</option>
            <option value="Reviewing">Under Review</option>
            <option value="Contacted">Contacted</option>
            <option value="Approved">Approved</option>
            <option value="followup">Needs Follow-up</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-obsidian-800 border border-platinum-600 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none transition-colors"
          >
            <option value="leadScore">Lead Score</option>
            <option value="timestamp">Most Recent</option>
            <option value="investment">Investment Amount</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={loadLeads}
            className="btn-secondary py-3 px-6 rounded-xl font-semibold"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Lead Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          [...Array(6)].map((_, index) => (
            <div key={index} className="glass-dark p-6 rounded-2xl animate-pulse">
              <div className="h-4 bg-platinum-600/20 rounded mb-4"></div>
              <div className="h-8 bg-platinum-600/20 rounded mb-2"></div>
              <div className="h-4 bg-platinum-600/20 rounded w-3/4"></div>
            </div>
          ))
        ) : (
          filteredLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              className="glass-dark p-6 rounded-2xl hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Lead Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-obsidian-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{lead.firstName} {lead.lastName}</h3>
                    <p className="text-platinum-400 text-sm">{lead.interestLevel} Interest</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreColor(lead.leadScore)}`}>
                  Score: {lead.leadScore}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <EnvelopeIcon className="w-4 h-4 text-platinum-500" />
                  <span className="text-platinum-300">{lead.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <PhoneIcon className="w-4 h-4 text-platinum-500" />
                  <span className="text-platinum-300">{lead.phone}</span>
                </div>
              </div>

              {/* Investment Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-platinum-400 text-sm">Investment Capacity:</span>
                  <span className="font-semibold text-gold-400">
                    ${lead.investmentCapacity.replace('-', ' - ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-platinum-400 text-sm">Accredited:</span>
                  <span className={`font-semibold ${lead.accreditedStatus === 'yes' ? 'text-green-400' : 'text-platinum-400'}`}>
                    {lead.accreditedStatus === 'yes' ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-platinum-400 text-sm">Source:</span>
                  <span className="font-semibold">{lead.source.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Status & Priority */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(lead.priority)}`}>
                  {lead.priority}
                </span>
              </div>

              {/* Additional Info */}
              {lead.additionalInfo && (
                <div className="mb-4">
                  <p className="text-platinum-400 text-sm italic">"{lead.additionalInfo}"</p>
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-xs text-platinum-500 mb-4">
                <ClockIcon className="w-4 h-4" />
                <span>{lead.timestamp.toLocaleString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-gold-500/20 text-gold-400 py-2 px-4 rounded-xl text-sm font-semibold hover:bg-gold-500/30 transition-colors">
                  Contact
                </button>
                <button className="flex-1 bg-royal-500/20 text-royal-400 py-2 px-4 rounded-xl text-sm font-semibold hover:bg-royal-500/30 transition-colors">
                  Update Status
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeadIntelligence;