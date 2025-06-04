// Nhalege Capital Integration Configuration
// Production-ready integration setup for capital.nhalege.com

export const INTEGRATION_CONFIG = {
  // Mailchimp Configuration
  mailchimp: {
    apiKey: process.env.REACT_APP_MAILCHIMP_API_KEY || 'your-api-key-here',
    audienceId: process.env.REACT_APP_MAILCHIMP_AUDIENCE_ID || 'your-list-id-here',
    server: process.env.REACT_APP_MAILCHIMP_SERVER || 'us1',
    baseUrl: process.env.REACT_APP_MAILCHIMP_SERVER ? 
      `https://${process.env.REACT_APP_MAILCHIMP_SERVER}.api.mailchimp.com/3.0` : 
      'https://us1.api.mailchimp.com/3.0'
  },

  // Google Analytics 4 Configuration
  analytics: {
    ga4MeasurementId: process.env.REACT_APP_GA4_MEASUREMENT_ID || 'G-your-id-here',
    gtmContainerId: process.env.REACT_APP_GTM_CONTAINER_ID || 'GTM-your-id-here',
    enableTracking: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enableRetargeting: process.env.REACT_APP_ENABLE_RETARGETING === 'true'
  },

  // Airtable Configuration
  airtable: {
    baseId: process.env.REACT_APP_AIRTABLE_BASE_ID || 'your-base-id-here',
    tableName: process.env.REACT_APP_AIRTABLE_TABLE_NAME || 'Investor_Applications',
    apiKey: process.env.REACT_APP_AIRTABLE_API_KEY || 'your-airtable-key-here',
    baseUrl: 'https://api.airtable.com/v0'
  },

  // Email Notifications
  notifications: {
    adminEmail: process.env.REACT_APP_ADMIN_EMAIL || 'your-inbox@email.com',
    enableEmailAlerts: process.env.REACT_APP_ENABLE_EMAIL_ALERTS === 'true'
  },

  // Feature Flags
  features: {
    innerCircleEnabled: true,
    roiCalculatorEnabled: true,
    investmentApplicationEnabled: true,
    emailCollectionEnabled: true,
    analyticsEnabled: true
  }
};

// Validation function to check if integrations are properly configured
export const validateIntegrations = () => {
  const issues = [];
  
  if (INTEGRATION_CONFIG.mailchimp.apiKey.includes('your-api-key')) {
    issues.push('Mailchimp API key not configured');
  }
  
  if (INTEGRATION_CONFIG.analytics.ga4MeasurementId.includes('your-id')) {
    issues.push('GA4 Measurement ID not configured');
  }
  
  if (INTEGRATION_CONFIG.airtable.baseId.includes('your-base')) {
    issues.push('Airtable Base ID not configured');
  }
  
  return {
    isValid: issues.length === 0,
    issues: issues
  };
};

export default INTEGRATION_CONFIG;