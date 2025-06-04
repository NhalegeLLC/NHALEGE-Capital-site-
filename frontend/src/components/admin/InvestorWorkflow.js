import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardDocumentListIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  ArrowRightIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const InvestorWorkflow = () => {
  const [applications, setApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    
    // Mock application data
    const mockApplications = [
      {
        id: 1,
        applicant: 'Marcus Thompson',
        email: 'marcus.thompson@example.com',
        investmentAmount: '$500K - $1M',
        status: 'new',
        priority: 'high',
        submittedAt: new Date('2024-01-15T10:30:00'),
        assignedTo: null,
        notes: [],
        documents: ['ID Verification', 'Income Statement'],
        nextAction: 'Initial Review',
        daysInStage: 1
      },
      {
        id: 2,
        applicant: 'Sarah Chen',
        email: 'sarah.chen@techstartup.com',
        investmentAmount: '$250K - $500K',
        status: 'reviewing',
        priority: 'medium',
        submittedAt: new Date('2024-01-14T09:15:00'),
        assignedTo: 'Admin',
        notes: ['CEO of tech startup', 'Previous investment experience'],
        documents: ['ID Verification', 'Bank Statement', 'Investment History'],
        nextAction: 'Schedule Call',
        daysInStage: 3
      },
      {
        id: 3,
        applicant: 'Jennifer Walsh',
        email: 'jennifer.walsh@investment.com',
        investmentAmount: '$1M+',
        status: 'approved',
        priority: 'urgent',
        submittedAt: new Date('2024-01-12T14:20:00'),
        assignedTo: 'Admin',
        notes: ['High net worth individual', 'Referral from existing client'],
        documents: ['All Documents Complete'],
        nextAction: 'Onboarding',
        daysInStage: 2
      },
      {
        id: 4,
        applicant: 'David Rodriguez',
        email: 'david.rodriguez@realestate.com',
        investmentAmount: '$100K - $250K',
        status: 'contacted',
        priority: 'medium',
        submittedAt: new Date('2024-01-10T16:45:00'),
        assignedTo: 'Admin',
        notes: ['Real estate professional', 'Interested in diversification'],
        documents: ['ID Verification', 'Asset Statement'],
        nextAction: 'Await Response',
        daysInStage: 5
      }
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  };

  const getStatusConfig = (status) => {
    const configs = {
      new: { 
        label: 'New Application', 
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: PlusIcon
      },
      reviewing: { 
        label: 'Under Review', 
        color: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
        icon: ClockIcon
      },
      contacted: { 
        label: 'Contacted', 
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        icon: ArrowRightIcon
      },
      approved: { 
        label: 'Approved', 
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: CheckCircleIcon
      },
      rejected: { 
        label: 'Not Qualified', 
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: ExclamationTriangleIcon
      }
    };
    return configs[status] || configs.new;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-400';
      case 'high': return 'text-gold-400';
      case 'medium': return 'text-royal-400';
      default: return 'text-platinum-400';
    }
  };

  const updateStatus = (applicationId, newStatus) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, daysInStage: 0 }
          : app
      )
    );
  };

  const filteredApplications = selectedStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedStatus);

  const statusCounts = {
    all: applications.length,
    new: applications.filter(app => app.status === 'new').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    contacted: applications.filter(app => app.status === 'contacted').length,
    approved: applications.filter(app => app.status === 'approved').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Investor Workflow Pipeline</h2>
          <p className="text-platinum-400">Application status management & follow-up tracking</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-gold-400">{applications.length}</div>
            <div className="text-sm text-platinum-400">Total Applications</div>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="glass-dark p-6 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Applications' },
            { key: 'new', label: 'New' },
            { key: 'reviewing', label: 'Reviewing' },
            { key: 'contacted', label: 'Contacted' },
            { key: 'approved', label: 'Approved' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                selectedStatus === tab.key
                  ? 'bg-gold-400/20 text-gold-400 border border-gold-400/30'
                  : 'bg-obsidian-800 text-platinum-300 hover:bg-obsidian-700'
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-1 rounded-full bg-obsidian-900 text-xs">
                {statusCounts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline Board */}
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
          filteredApplications.map((application, index) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onStatusUpdate={updateStatus}
              index={index}
            />
          ))
        )}
      </div>

      {filteredApplications.length === 0 && !loading && (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="w-16 h-16 text-platinum-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-platinum-300 mb-2">No Applications Found</h3>
          <p className="text-platinum-500">No applications match the selected filter.</p>
        </div>
      )}
    </div>
  );
};

// Application Card Component
const ApplicationCard = ({ application, onStatusUpdate, index }) => {
  const [showNotes, setShowNotes] = useState(false);
  const statusConfig = getStatusConfig(application.status);

  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      className="glass-dark p-6 rounded-2xl hover:scale-105 transition-transform duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-obsidian-900" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{application.applicant}</h3>
            <p className="text-platinum-400 text-sm">{application.email}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(application.priority)}`}>
          {application.priority.toUpperCase()}
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${statusConfig.color}`}>
          <StatusIcon className="w-4 h-4" />
          <span className="font-semibold text-sm">{statusConfig.label}</span>
        </div>
      </div>

      {/* Investment Amount */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-platinum-400 text-sm">Investment Interest:</span>
          <span className="font-semibold text-gold-400">{application.investmentAmount}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-platinum-400">Submitted:</span>
          <span>{application.submittedAt.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-platinum-400">Days in stage:</span>
          <span className={application.daysInStage > 5 ? 'text-red-400' : 'text-platinum-300'}>
            {application.daysInStage} days
          </span>
        </div>
        {application.assignedTo && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-platinum-400">Assigned to:</span>
            <span className="text-royal-400">{application.assignedTo}</span>
          </div>
        )}
      </div>

      {/* Next Action */}
      <div className="mb-4 p-3 bg-royal-500/10 rounded-xl border border-royal-500/20">
        <div className="font-semibold text-royal-400 text-sm mb-1">Next Action:</div>
        <div className="text-sm">{application.nextAction}</div>
      </div>

      {/* Documents */}
      <div className="mb-4">
        <div className="text-platinum-400 text-sm mb-2">Documents:</div>
        <div className="flex flex-wrap gap-1">
          {application.documents.map((doc, docIndex) => (
            <span
              key={docIndex}
              className="px-2 py-1 bg-obsidian-800 rounded text-xs text-platinum-300"
            >
              {doc}
            </span>
          ))}
        </div>
      </div>

      {/* Notes */}
      {application.notes.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-2 text-platinum-400 text-sm hover:text-white"
          >
            <PencilIcon className="w-4 h-4" />
            Notes ({application.notes.length})
          </button>
          {showNotes && (
            <div className="mt-2 space-y-1">
              {application.notes.map((note, noteIndex) => (
                <div key={noteIndex} className="text-sm text-platinum-300 italic">
                  "#{note}"
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {application.status === 'new' && (
          <button
            onClick={() => onStatusUpdate(application.id, 'reviewing')}
            className="w-full bg-gold-500/20 text-gold-400 py-2 px-4 rounded-xl text-sm font-semibold hover:bg-gold-500/30 transition-colors"
          >
            Start Review
          </button>
        )}
        {application.status === 'reviewing' && (
          <div className="flex gap-2">
            <button
              onClick={() => onStatusUpdate(application.id, 'contacted')}
              className="flex-1 bg-royal-500/20 text-royal-400 py-2 px-4 rounded-xl text-sm font-semibold hover:bg-royal-500/30 transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => onStatusUpdate(application.id, 'approved')}
              className="flex-1 bg-green-500/20 text-green-400 py-2 px-4 rounded-xl text-sm font-semibold hover:bg-green-500/30 transition-colors"
            >
              Approve
            </button>
          </div>
        )}
        {application.status === 'contacted' && (
          <button
            onClick={() => onStatusUpdate(application.id, 'approved')}
            className="w-full bg-green-500/20 text-green-400 py-2 px-4 rounded-xl text-sm font-semibold hover:bg-green-500/30 transition-colors"
          >
            Mark as Approved
          </button>
        )}
        {application.status === 'approved' && (
          <div className="w-full bg-green-500/10 text-green-400 py-2 px-4 rounded-xl text-sm font-semibold text-center">
            ✓ Approved - Ready for Onboarding
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Helper function (needs to be outside component)
const getStatusConfig = (status) => {
  const configs = {
    new: { 
      label: 'New Application', 
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      icon: PlusIcon
    },
    reviewing: { 
      label: 'Under Review', 
      color: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
      icon: ClockIcon
    },
    contacted: { 
      label: 'Contacted', 
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      icon: ArrowRightIcon
    },
    approved: { 
      label: 'Approved', 
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
      icon: CheckCircleIcon
    },
    rejected: { 
      label: 'Not Qualified', 
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: ExclamationTriangleIcon
    }
  };
  return configs[status] || configs.new;
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent': return 'text-red-400';
    case 'high': return 'text-gold-400';
    case 'medium': return 'text-royal-400';
    default: return 'text-platinum-400';
  }
};

export default InvestorWorkflow;