// React Hook for Nhalege Capital Integrations
// Manages all third-party integrations and services

import { useState, useEffect, useCallback } from 'react';
import { INTEGRATION_CONFIG, validateIntegrations } from '../config/integrations';
import { analyticsService } from '../services/enhancedAnalytics';
import { mailchimpService, addQualifiedInvestorLead, addInnerCircleApplication } from '../services/mailchimpService';
import { airtableService } from '../services/airtableService';

export const useIntegrations = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState({
    analytics: false,
    mailchimp: false,
    airtable: false
  });
  const [errors, setErrors] = useState([]);

  // Initialize all integrations
  const initialize = useCallback(async () => {
    try {
      const validation = validateIntegrations();
      if (!validation.isValid) {
        setErrors(validation.issues);
        console.warn('Integration validation failed:', validation.issues);
      }

      // Initialize Analytics
      if (INTEGRATION_CONFIG.features.analyticsEnabled) {
        await analyticsService.initialize();
        setIntegrationStatus(prev => ({ ...prev, analytics: true }));
      }

      // Test Mailchimp connection
      if (INTEGRATION_CONFIG.features.emailCollectionEnabled) {
        try {
          // Test connection here if needed
          setIntegrationStatus(prev => ({ ...prev, mailchimp: true }));
        } catch (error) {
          console.warn('Mailchimp connection test failed:', error);
        }
      }

      // Test Airtable connection
      if (INTEGRATION_CONFIG.features.investmentApplicationEnabled) {
        try {
          // Test connection here if needed
          setIntegrationStatus(prev => ({ ...prev, airtable: true }));
        } catch (error) {
          console.warn('Airtable connection test failed:', error);
        }
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Integration initialization failed:', error);
      setErrors(prev => [...prev, error.message]);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Email Collection with Full Integration
  const collectEmail = useCallback(async (emailData) => {
    try {
      const { email, source, investmentAmount, projectedReturn, term } = emailData;

      // Add to Mailchimp
      if (integrationStatus.mailchimp) {
        await addQualifiedInvestorLead({
          email,
          investmentAmount,
          projectedReturn,
          source,
          timestamp: new Date().toISOString()
        });
      }

      // Track in Analytics
      if (integrationStatus.analytics) {
        analyticsService.trackEmailCollection({
          email,
          source,
          investmentAmount,
          leadType: investmentAmount >= 100000 ? 'high_value' : 'qualified'
        });
      }

      return { success: true, message: 'Email collected successfully' };
    } catch (error) {
      console.error('Email collection failed:', error);
      return { success: false, error: error.message };
    }
  }, [integrationStatus]);

  // Investment Application with Full Integration
  const submitApplication = useCallback(async (applicationData) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        investmentCapacity,
        accreditedStatus,
        investmentExperience,
        hearAboutUs,
        additionalInfo,
        source = 'inner-circle-application'
      } = applicationData;

      // Calculate lead score
      const leadScore = airtableService.calculateLeadScore(applicationData);
      const priority = airtableService.getPriority(applicationData);

      // Add to Airtable
      let airtableResult = null;
      if (integrationStatus.airtable) {
        airtableResult = await airtableService.addInvestorApplication({
          ...applicationData,
          source,
          leadScore,
          priority
        });
      }

      // Add to Mailchimp
      if (integrationStatus.mailchimp) {
        await addInnerCircleApplication({
          email,
          firstName,
          lastName,
          investmentCapacity,
          accreditedStatus,
          source
        });
      }

      // Track in Analytics
      if (integrationStatus.analytics) {
        analyticsService.trackInvestmentApplication({
          investmentCapacity,
          accreditedStatus,
          source,
          leadScore,
          priority
        });
      }

      return { 
        success: true, 
        message: 'Application submitted successfully',
        airtableRecord: airtableResult?.id,
        leadScore,
        priority
      };
    } catch (error) {
      console.error('Application submission failed:', error);
      return { success: false, error: error.message };
    }
  }, [integrationStatus]);

  // ROI Calculation Tracking
  const trackROICalculation = useCallback((calculationData) => {
    if (integrationStatus.analytics) {
      analyticsService.trackROICalculation(calculationData);
    }
  }, [integrationStatus]);

  // User Journey Tracking
  const trackUserJourney = useCallback((step, data = {}) => {
    if (integrationStatus.analytics) {
      analyticsService.trackUserJourney(step, data);
    }
  }, [integrationStatus]);

  // Event Tracking
  const trackEvent = useCallback((eventName, parameters = {}) => {
    if (integrationStatus.analytics) {
      analyticsService.trackEvent(eventName, parameters);
    }
  }, [integrationStatus]);

  // Conversion Tracking
  const trackConversion = useCallback((conversionType, data = {}) => {
    if (integrationStatus.analytics) {
      analyticsService.trackConversion(conversionType, data);
    }
  }, [integrationStatus]);

  // Get Integration Status
  const getStatus = useCallback(() => {
    return {
      isInitialized,
      integrationStatus,
      errors,
      config: INTEGRATION_CONFIG
    };
  }, [isInitialized, integrationStatus, errors]);

  // Admin Functions (for future admin dashboard)
  const adminFunctions = {
    getApplications: useCallback(async (filters = {}) => {
      if (integrationStatus.airtable) {
        return await airtableService.getApplications(filters);
      }
      return { records: [] };
    }, [integrationStatus]),

    updateApplicationStatus: useCallback(async (recordId, status, notes = '') => {
      if (integrationStatus.airtable) {
        return await airtableService.updateApplicationStatus(recordId, status, notes);
      }
      return null;
    }, [integrationStatus])
  };

  return {
    // Initialization
    isInitialized,
    initialize,
    getStatus,

    // Core Functions
    collectEmail,
    submitApplication,

    // Tracking Functions
    trackROICalculation,
    trackUserJourney,
    trackEvent,
    trackConversion,

    // Admin Functions
    ...adminFunctions,

    // Status
    integrationStatus,
    errors,
    config: INTEGRATION_CONFIG
  };
};

export default useIntegrations;