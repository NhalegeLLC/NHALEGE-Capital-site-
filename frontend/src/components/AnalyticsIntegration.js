import { useEffect } from 'react';

// Google Analytics 4 Integration
export const initializeGA4 = (measurementId) => {
  if (typeof window !== 'undefined' && measurementId) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', measurementId);
  }
};

// Google Tag Manager Integration
export const initializeGTM = (gtmId) => {
  if (typeof window !== 'undefined' && gtmId) {
    // GTM Script
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(script);

    // GTM NoScript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;
    document.body.appendChild(noscript);
  }
};

// Event tracking functions
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Conversion tracking
export const trackConversion = (conversionType, value = 0) => {
  trackEvent('conversion', {
    event_category: 'investment',
    event_label: conversionType,
    value: value,
    currency: 'USD'
  });
};

// Lead tracking
export const trackLead = (leadType, source = 'organic') => {
  trackEvent('generate_lead', {
    event_category: 'lead_generation',
    event_label: leadType,
    lead_source: source
  });
};

// ROI Calculator usage
export const trackROICalculation = (amount, term, projectedReturn) => {
  trackEvent('roi_calculation', {
    event_category: 'engagement',
    investment_amount: amount,
    investment_term: term,
    projected_return: projectedReturn,
    custom_parameters: {
      user_engagement: 'high_intent'
    }
  });
};

// Email collection
export const trackEmailCollection = (source, amount = null) => {
  trackEvent('email_signup', {
    event_category: 'lead_generation',
    signup_source: source,
    investment_interest: amount,
    lead_quality: 'qualified'
  });
};

// Investment application
export const trackInvestmentApplication = (amount, source) => {
  trackEvent('investment_application', {
    event_category: 'conversion',
    application_amount: amount,
    application_source: source,
    lead_quality: 'high_value'
  });
  
  // Also track as conversion
  trackConversion('investment_application', amount);
};

// Analytics hook for React components
export const useAnalytics = () => {
  useEffect(() => {
    // Initialize analytics when component mounts
    const GA4_ID = process.env.REACT_APP_GA4_MEASUREMENT_ID;
    const GTM_ID = process.env.REACT_APP_GTM_ID;
    
    if (GA4_ID) initializeGA4(GA4_ID);
    if (GTM_ID) initializeGTM(GTM_ID);
  }, []);

  return {
    trackEvent,
    trackConversion,
    trackLead,
    trackROICalculation,
    trackEmailCollection,
    trackInvestmentApplication
  };
};