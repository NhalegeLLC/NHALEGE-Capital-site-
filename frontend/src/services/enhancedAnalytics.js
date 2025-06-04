// Enhanced Analytics Service for Nhalege Capital
// Comprehensive tracking for investor behavior and conversion optimization

import { INTEGRATION_CONFIG } from '../config/integrations';

class EnhancedAnalyticsService {
  constructor() {
    this.config = INTEGRATION_CONFIG.analytics;
    this.isInitialized = false;
    this.debugMode = process.env.NODE_ENV === 'development';
  }

  // Initialize all analytics services
  async initialize() {
    if (this.isInitialized || !this.config.enableTracking) return;

    try {
      // Initialize Google Analytics 4
      if (this.config.ga4MeasurementId && !this.config.ga4MeasurementId.includes('your-id')) {
        await this.initializeGA4();
      }

      // Initialize Google Tag Manager
      if (this.config.gtmContainerId && !this.config.gtmContainerId.includes('your-id')) {
        await this.initializeGTM();
      }

      // Initialize retargeting pixels
      if (this.config.enableRetargeting) {
        await this.initializeRetargeting();
      }

      this.isInitialized = true;
      this.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Analytics initialization failed:', error);
    }
  }

  // Google Analytics 4 Setup
  async initializeGA4() {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.ga4MeasurementId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.config.ga4MeasurementId, {
      page_title: 'Nhalege Capital - Elite Investment Platform',
      page_location: window.location.href,
      custom_map: {
        'custom_parameter_1': 'investment_amount',
        'custom_parameter_2': 'lead_score',
        'custom_parameter_3': 'investor_type'
      }
    });

    this.log('GA4 initialized');
  }

  // Google Tag Manager Setup
  async initializeGTM() {
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${this.config.gtmContainerId}');
    `;
    document.head.appendChild(script);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${this.config.gtmContainerId}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;
    document.body.appendChild(noscript);

    this.log('GTM initialized');
  }

  // Retargeting Pixel Setup
  async initializeRetargeting() {
    // Facebook Pixel (placeholder)
    if (window.fbq) {
      window.fbq('track', 'PageView');
      window.fbq('track', 'ViewContent', {
        content_name: 'Nhalege Capital Landing Page',
        content_category: 'Investment Platform',
        value: 0,
        currency: 'USD'
      });
    }

    // LinkedIn Insight Tag (placeholder)
    if (window.lintrk) {
      window.lintrk('track', { conversion_id: 'your-linkedin-conversion-id' });
    }

    this.log('Retargeting pixels initialized');
  }

  // Core Event Tracking
  trackEvent(eventName, parameters = {}) {
    if (!this.config.enableTracking) return;

    const eventData = {
      event_category: parameters.category || 'engagement',
      event_label: parameters.label || eventName,
      value: parameters.value || 0,
      currency: parameters.currency || 'USD',
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      ...parameters
    };

    // Send to GA4
    if (window.gtag) {
      window.gtag('event', eventName, eventData);
    }

    // Send to GTM
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...eventData
      });
    }

    this.log(`Event tracked: ${eventName}`, eventData);
  }

  // ROI Calculator Tracking
  trackROICalculation(calculationData) {
    const { amount, term, projectedReturn, source = 'roi_calculator' } = calculationData;
    
    this.trackEvent('roi_calculation', {
      category: 'calculator',
      label: 'wealth_projection',
      investment_amount: amount,
      investment_term: term,
      projected_return: projectedReturn,
      profit_amount: projectedReturn - amount,
      profit_percentage: ((projectedReturn - amount) / amount * 100).toFixed(2),
      calculation_source: source,
      user_intent: 'high_interest',
      lead_quality: this.calculateLeadQuality(amount)
    });

    // Special tracking for high-value calculations
    if (amount >= 100000) {
      this.trackEvent('high_value_calculation', {
        category: 'high_intent',
        label: 'premium_investor',
        investment_amount: amount,
        lead_score: this.calculateLeadScore(amount, source)
      });
    }
  }

  // Email Collection Tracking
  trackEmailCollection(emailData) {
    const { email, source, investmentAmount, leadType = 'general' } = emailData;
    
    this.trackEvent('email_signup', {
      category: 'lead_generation',
      label: leadType,
      signup_source: source,
      investment_interest: investmentAmount,
      lead_score: this.calculateLeadScore(investmentAmount, source),
      email_domain: email.split('@')[1],
      conversion_path: this.getConversionPath()
    });

    // Conversion tracking
    this.trackConversion('email_collection', {
      value: this.getLeadValue(investmentAmount),
      currency: 'USD',
      source: source
    });
  }

  // Investment Application Tracking
  trackInvestmentApplication(applicationData) {
    const { 
      investmentCapacity, 
      accreditedStatus, 
      source,
      leadScore,
      priority 
    } = applicationData;

    this.trackEvent('investment_application', {
      category: 'conversion',
      label: 'inner_circle_application',
      investment_capacity: investmentCapacity,
      accredited_investor: accreditedStatus === 'yes',
      lead_score: leadScore,
      priority_level: priority,
      application_source: source,
      conversion_value: this.getApplicationValue(investmentCapacity)
    });

    // High-value conversion tracking
    this.trackConversion('investment_application', {
      value: this.getApplicationValue(investmentCapacity),
      currency: 'USD',
      transaction_id: `app_${Date.now()}`,
      items: [{
        item_id: 'inner_circle_application',
        item_name: 'Inner Circle Application',
        item_category: 'Investment Application',
        item_variant: investmentCapacity,
        price: this.getApplicationValue(investmentCapacity),
        quantity: 1
      }]
    });
  }

  // Conversion Tracking
  trackConversion(conversionType, conversionData = {}) {
    this.trackEvent('conversion', {
      category: 'conversion',
      label: conversionType,
      ...conversionData
    });

    // Send to GA4 as purchase event for better conversion tracking
    if (window.gtag && conversionData.value) {
      window.gtag('event', 'purchase', {
        transaction_id: conversionData.transaction_id || `conv_${Date.now()}`,
        value: conversionData.value,
        currency: conversionData.currency || 'USD',
        items: conversionData.items || [{
          item_id: conversionType,
          item_name: conversionType.replace('_', ' ').toUpperCase(),
          item_category: 'Conversion',
          price: conversionData.value,
          quantity: 1
        }]
      });
    }
  }

  // User Journey Tracking
  trackUserJourney(step, data = {}) {
    const journeyData = {
      journey_step: step,
      journey_timestamp: new Date().toISOString(),
      session_id: this.getSessionId(),
      user_path: this.getUserPath(),
      ...data
    };

    this.trackEvent('user_journey', {
      category: 'user_experience',
      label: step,
      ...journeyData
    });
  }

  // Page Performance Tracking
  trackPagePerformance() {
    if (window.performance) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      
      this.trackEvent('page_performance', {
        category: 'performance',
        label: 'page_load',
        load_time: loadTime,
        dom_content_loaded: domContentLoaded,
        page_url: window.location.href
      });
    }
  }

  // Scroll Depth Tracking
  trackScrollDepth() {
    let maxScroll = 0;
    const intervals = [25, 50, 75, 90, 100];
    const tracked = new Set();

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        intervals.forEach(interval => {
          if (scrollPercent >= interval && !tracked.has(interval)) {
            tracked.add(interval);
            this.trackEvent('scroll_depth', {
              category: 'engagement',
              label: `${interval}_percent`,
              scroll_depth: interval,
              page_url: window.location.href
            });
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Helper Methods
  calculateLeadScore(amount, source) {
    let score = 0;
    
    if (amount >= 1000000) score += 100;
    else if (amount >= 500000) score += 80;
    else if (amount >= 250000) score += 60;
    else if (amount >= 100000) score += 40;
    else if (amount >= 50000) score += 20;
    else if (amount >= 25000) score += 10;

    if (source === 'inner_circle') score += 30;
    if (source === 'roi_calculator') score += 20;
    if (source === 'referral') score += 25;

    return Math.min(score, 200);
  }

  calculateLeadQuality(amount) {
    if (amount >= 250000) return 'premium';
    if (amount >= 100000) return 'high';
    if (amount >= 50000) return 'medium';
    return 'standard';
  }

  getLeadValue(amount) {
    return Math.min(amount * 0.1, 10000); // 10% of investment amount, capped at $10k
  }

  getApplicationValue(capacity) {
    const values = {
      '1000000+': 10000,
      '500000-1000000': 7500,
      '250000-500000': 5000,
      '100000-250000': 2500,
      '50000-100000': 1000,
      '25000-50000': 500
    };
    return values[capacity] || 250;
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('nhalege_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('nhalege_session_id', sessionId);
    }
    return sessionId;
  }

  getUserPath() {
    let path = sessionStorage.getItem('nhalege_user_path') || '';
    const currentPage = window.location.pathname;
    if (!path.includes(currentPage)) {
      path += (path ? ' → ' : '') + currentPage;
      sessionStorage.setItem('nhalege_user_path', path);
    }
    return path;
  }

  getConversionPath() {
    return sessionStorage.getItem('nhalege_user_path') || window.location.pathname;
  }

  log(message, data = null) {
    if (this.debugMode) {
      console.log(`[Nhalege Analytics] ${message}`, data);
    }
  }
}

// Export singleton instance
export const analyticsService = new EnhancedAnalyticsService();

// React Hook for Analytics
export const useEnhancedAnalytics = () => {
  React.useEffect(() => {
    analyticsService.initialize();
    analyticsService.trackPagePerformance();
    analyticsService.trackScrollDepth();
  }, []);

  return {
    trackEvent: (name, params) => analyticsService.trackEvent(name, params),
    trackROICalculation: (data) => analyticsService.trackROICalculation(data),
    trackEmailCollection: (data) => analyticsService.trackEmailCollection(data),
    trackInvestmentApplication: (data) => analyticsService.trackInvestmentApplication(data),
    trackConversion: (type, data) => analyticsService.trackConversion(type, data),
    trackUserJourney: (step, data) => analyticsService.trackUserJourney(step, data)
  };
};

export default analyticsService;