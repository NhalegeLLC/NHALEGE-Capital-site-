// Mailchimp Integration Service for Nhalege Capital
// This service handles email collection and investor lead management

class MailchimpService {
  constructor() {
    this.apiKey = process.env.REACT_APP_MAILCHIMP_API_KEY;
    this.server = process.env.REACT_APP_MAILCHIMP_SERVER; // e.g., 'us1', 'us2', etc.
    this.audienceId = process.env.REACT_APP_MAILCHIMP_AUDIENCE_ID;
    this.baseUrl = `https://${this.server}.api.mailchimp.com/3.0`;
  }

  // Add email to main investor list
  async addToInvestorList(email, firstName = '', lastName = '', tags = [], mergeFields = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/lists/${this.audienceId}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
            ...mergeFields
          },
          tags: tags
        })
      });

      if (!response.ok) {
        throw new Error(`Mailchimp API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding to Mailchimp:', error);
      throw error;
    }
  }

  // Add high-value investor lead with detailed tracking
  async addQualifiedLead(leadData) {
    const {
      email,
      firstName,
      lastName,
      investmentAmount,
      investmentTerm,
      projectedReturn,
      source,
      timestamp
    } = leadData;

    const tags = [
      'qualified-lead',
      'roi-calculator-user',
      `investment-${investmentAmount}`,
      `term-${investmentTerm}-months`,
      source || 'website'
    ];

    const mergeFields = {
      FNAME: firstName,
      LNAME: lastName,
      INVAMOUNT: investmentAmount,
      INVTERM: investmentTerm,
      PROJRET: projectedReturn,
      LEADSCORE: this.calculateLeadScore(investmentAmount, source),
      SIGNUP_SRC: source,
      SIGNUP_DATE: timestamp || new Date().toISOString()
    };

    return this.addToInvestorList(email, firstName, lastName, tags, mergeFields);
  }

  // Add Inner Circle application
  async addInnerCircleApplication(applicationData) {
    const {
      email,
      firstName,
      lastName,
      investmentCapacity,
      accreditedStatus,
      source
    } = applicationData;

    const tags = [
      'inner-circle-application',
      'high-value-lead',
      accreditedStatus ? 'accredited-investor' : 'non-accredited',
      `capacity-${investmentCapacity}`,
      'priority-follow-up'
    ];

    const mergeFields = {
      FNAME: firstName,
      LNAME: lastName,
      INVCAPACITY: investmentCapacity,
      ACCREDITED: accreditedStatus,
      LEADSCORE: this.calculateLeadScore(investmentCapacity, source, true),
      APP_TYPE: 'inner-circle',
      SIGNUP_SRC: source,
      SIGNUP_DATE: new Date().toISOString()
    };

    return this.addToInvestorList(email, firstName, lastName, tags, mergeFields);
  }

  // Calculate lead score based on investment amount and source
  calculateLeadScore(amount, source, isInnerCircle = false) {
    let score = 0;
    
    // Investment amount scoring
    if (amount >= 100000) score += 100;
    else if (amount >= 50000) score += 80;
    else if (amount >= 25000) score += 60;
    else if (amount >= 10000) score += 40;
    else if (amount >= 5000) score += 20;
    else score += 10;

    // Source scoring
    if (source === 'roi-calculator') score += 30;
    if (source === 'inner-circle') score += 50;
    if (source === 'referral') score += 40;

    // Inner Circle bonus
    if (isInnerCircle) score += 50;

    return Math.min(score, 200); // Cap at 200
  }

  // Update subscriber with additional data
  async updateSubscriber(email, updateData) {
    try {
      const subscriberHash = this.getSubscriberHash(email);
      
      const response = await fetch(`${this.baseUrl}/lists/${this.audienceId}/members/${subscriberHash}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Mailchimp API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating subscriber:', error);
      throw error;
    }
  }

  // Get subscriber hash for Mailchimp API
  getSubscriberHash(email) {
    // Mailchimp requires MD5 hash of lowercase email
    // Note: In production, you'd want to use a proper MD5 library
    // For now, this is a placeholder - implement proper hashing
    return email.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // Add tags to existing subscriber
  async addTags(email, tags) {
    try {
      const subscriberHash = this.getSubscriberHash(email);
      
      const response = await fetch(`${this.baseUrl}/lists/${this.audienceId}/members/${subscriberHash}/tags`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: tags.map(tag => ({ name: tag, status: 'active' }))
        })
      });

      if (!response.ok) {
        throw new Error(`Mailchimp API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding tags:', error);
      throw error;
    }
  }

  // Trigger automation based on lead type
  async triggerWelcomeSequence(email, sequenceType = 'standard') {
    const automationTags = {
      'standard': ['welcome-sequence'],
      'qualified-lead': ['qualified-welcome', 'priority-nurture'],
      'inner-circle': ['inner-circle-welcome', 'vip-sequence'],
      'high-value': ['high-value-welcome', 'personal-outreach']
    };

    const tags = automationTags[sequenceType] || automationTags['standard'];
    return this.addTags(email, tags);
  }
}

// Utility functions for easy integration
export const mailchimpService = new MailchimpService();

// Quick functions for common operations
export const addQualifiedInvestorLead = async (leadData) => {
  return mailchimpService.addQualifiedLead(leadData);
};

export const addInnerCircleApplication = async (applicationData) => {
  return mailchimpService.addInnerCircleApplication(applicationData);
};

export const addEmailSubscriber = async (email, firstName, lastName, source) => {
  return mailchimpService.addToInvestorList(email, firstName, lastName, [source]);
};

export default mailchimpService;