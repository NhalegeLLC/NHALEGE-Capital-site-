import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

const DocumentVault = ({ investor }) => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Investment Agreement',
      type: 'contract',
      size: '245 KB',
      uploadDate: '2023-06-15',
      status: 'signed',
      category: 'Legal Documents',
      description: 'Primary investment contract and terms'
    },
    {
      id: 2,
      name: 'Q4 2023 Performance Report',
      type: 'report',
      size: '1.2 MB',
      uploadDate: '2024-01-15',
      status: 'available',
      category: 'Performance Reports',
      description: 'Quarterly portfolio performance and allocation update'
    },
    {
      id: 3,
      name: 'Tax Documentation (1099)',
      type: 'tax',
      size: '156 KB',
      uploadDate: '2024-02-01',
      status: 'available',
      category: 'Tax Documents',
      description: 'Annual tax reporting documentation'
    },
    {
      id: 4,
      name: 'KYC Verification',
      type: 'identity',
      size: '892 KB',
      uploadDate: '2023-06-10',
      status: 'verified',
      category: 'Identity Verification',
      description: 'Know Your Customer verification documents'
    },
    {
      id: 5,
      name: 'Banking Information',
      type: 'banking',
      size: '234 KB',
      uploadDate: '2023-06-12',
      status: 'verified',
      category: 'Financial Information',
      description: 'Verified banking and payment information'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const categories = [
    { key: 'all', label: 'All Documents' },
    { key: 'Legal Documents', label: 'Legal' },
    { key: 'Performance Reports', label: 'Reports' },
    { key: 'Tax Documents', label: 'Tax' },
    { key: 'Identity Verification', label: 'Identity' },
    { key: 'Financial Information', label: 'Financial' }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'signed':
        return { color: 'text-green-400 bg-green-400/20', icon: CheckCircleIcon, label: 'Signed' };
      case 'verified':
        return { color: 'text-green-400 bg-green-400/20', icon: CheckCircleIcon, label: 'Verified' };
      case 'available':
        return { color: 'text-blue-400 bg-blue-400/20', icon: EyeIcon, label: 'Available' };
      case 'pending':
        return { color: 'text-gold-400 bg-gold-400/20', icon: ClockIcon, label: 'Pending' };
      default:
        return { color: 'text-platinum-400 bg-platinum-400/20', icon: DocumentTextIcon, label: 'Document' };
    }
  };

  const getDocumentIcon = (type) => {
    // Return appropriate icon based on document type
    return DocumentTextIcon;
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const handleDownload = (document) => {
    // Simulate document download
    console.log(`Downloading ${document.name}`);
  };

  const handleView = (document) => {
    // Simulate document view
    console.log(`Viewing ${document.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Document Vault</h2>
          <p className="text-platinum-400">Secure access to your investment documents</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="btn-secondary px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <motion.div
        className="glass-dark p-6 rounded-2xl border border-green-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheckIcon className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-bold text-green-400">Vault Security Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>256-bit AES Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Multi-factor Authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Compliance Audit Trail</span>
          </div>
        </div>
      </motion.div>

      {/* Category Filters */}
      <div className="glass-dark p-6 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                selectedCategory === category.key
                  ? 'bg-gold-400/20 text-gold-400 border border-gold-400/30'
                  : 'bg-obsidian-800 text-platinum-300 hover:bg-obsidian-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDocuments.map((document, index) => (
          <DocumentCard
            key={document.id}
            document={document}
            index={index}
            onDownload={handleDownload}
            onView={handleView}
          />
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="w-16 h-16 text-platinum-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-platinum-300 mb-2">No Documents Found</h3>
          <p className="text-platinum-500">No documents match the selected category.</p>
        </div>
      )}
    </div>
  );
};

// Document Card Component
const DocumentCard = ({ document, index, onDownload, onView }) => {
  const statusConfig = getStatusConfig(document.status);
  const StatusIcon = statusConfig.icon;
  const DocumentIcon = getDocumentIcon(document.type);

  return (
    <motion.div
      className="glass-dark p-6 rounded-2xl hover:scale-105 transition-transform duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Document Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
            <DocumentIcon className="w-6 h-6 text-obsidian-900" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{document.name}</h3>
            <p className="text-platinum-400 text-sm">{document.category}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusConfig.color}`}>
          <StatusIcon className="w-3 h-3" />
          {statusConfig.label}
        </div>
      </div>

      {/* Document Details */}
      <div className="space-y-3 mb-4">
        <p className="text-platinum-300 text-sm">{document.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-platinum-400">
            <CalendarIcon className="w-4 h-4" />
            <span>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</span>
          </div>
          <span className="text-platinum-400">{document.size}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onView(document)}
          className="flex-1 bg-royal-500/20 text-royal-400 py-2 px-4 rounded-xl text-sm font-semibold hover:bg-royal-500/30 transition-colors flex items-center justify-center gap-2"
        >
          <EyeIcon className="w-4 h-4" />
          View
        </button>
        <button
          onClick={() => onDownload(document)}
          className="flex-1 bg-gold-500/20 text-gold-400 py-2 px-4 rounded-xl text-sm font-semibold hover:bg-gold-500/30 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          Download
        </button>
      </div>
    </motion.div>
  );
};

// Helper function moved outside component
const getStatusConfig = (status) => {
  switch (status) {
    case 'signed':
      return { color: 'text-green-400 bg-green-400/20', icon: CheckCircleIcon, label: 'Signed' };
    case 'verified':
      return { color: 'text-green-400 bg-green-400/20', icon: CheckCircleIcon, label: 'Verified' };
    case 'available':
      return { color: 'text-blue-400 bg-blue-400/20', icon: EyeIcon, label: 'Available' };
    case 'pending':
      return { color: 'text-gold-400 bg-gold-400/20', icon: ClockIcon, label: 'Pending' };
    default:
      return { color: 'text-platinum-400 bg-platinum-400/20', icon: DocumentTextIcon, label: 'Document' };
  }
};

const getDocumentIcon = (type) => {
  return DocumentTextIcon;
};

export default DocumentVault;