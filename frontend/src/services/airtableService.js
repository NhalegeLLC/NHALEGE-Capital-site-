// Airtable Integration Service for Nhalege Capital
// Handles investor application storage and management

import { INTEGRATION_CONFIG } from '../config/integrations';

class AirtableService {
  constructor() {
    this.baseId = INTEGRATION_CONFIG.airtable.baseId;
    this.tableName = INTEGRATION_CONFIG.airtable.tableName;
    this.apiKey = INTEGRATION_CONFIG.airtable.apiKey;
    this.baseUrl = `${INTEGRATION_CONFIG.airtable.baseUrl}/${this.baseId}/${this.tableName}`;
  }

  // Add investor application to Airtable
  async addInvestorApplication(applicationData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'First Name': applicationData.firstName,
            'Last Name': applicationData.lastName,
            'Email': applicationData.email,
            'Phone': applicationData.phone || '',
            'Investment Capacity': applicationData.investmentCapacity,
            'Accredited Status': applicationData.accreditedStatus,
            'Investment Experience': applicationData.investmentExperience || '',
            'How They Heard': applicationData.hearAboutUs || '',
            'Additional Info': applicationData.additionalInfo || '',
            'Application Source': applicationData.source || 'website',
            'Lead Score': this.calculateLeadScore(applicationData),
            'Application Date': new Date().toISOString(),
            'Status': 'New Application',
            'Follow Up Required': true,
            'Investment Interest Level': this.getInterestLevel(applicationData.investmentCapacity),
            'Priority': this.getPriority(applicationData)
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Send email notification to admin
      await this.sendAdminNotification(applicationData, result.id);
      
      return result;
    } catch (error) {
      console.error('Error adding to Airtable:', error);
      throw error;
    }
  }

  // Calculate lead score based on application data
  calculateLeadScore(data) {
    let score = 0;
    
    // Investment capacity scoring
    const capacity = data.investmentCapacity;
    if (capacity.includes('1000000+')) score += 100;
    else if (capacity.includes('500000-1000000')) score += 90;
    else if (capacity.includes('250000-500000')) score += 80;
    else if (capacity.includes('100000-250000')) score += 70;
    else if (capacity.includes('50000-100000')) score += 60;
    else if (capacity.includes('25000-50000')) score += 50;
    
    // Accredited investor bonus
    if (data.accreditedStatus === 'yes') score += 30;
    
    // Experience bonus
    if (data.investmentExperience === 'expert') score += 20;
    else if (data.investmentExperience === 'experienced') score += 15;
    else if (data.investmentExperience === 'intermediate') score += 10;
    
    // Source bonus
    if (data.source === 'inner-circle-application') score += 25;
    if (data.source === 'referral') score += 20;
    
    return Math.min(score, 200); // Cap at 200
  }

  // Get interest level based on investment capacity
  getInterestLevel(capacity) {
    if (capacity.includes('1000000+')) return 'Ultra High';
    if (capacity.includes('500000') || capacity.includes('250000')) return 'High';
    if (capacity.includes('100000')) return 'Medium-High';
    if (capacity.includes('50000')) return 'Medium';
    return 'Standard';
  }

  // Get priority level for follow-up
  getPriority(data) {
    const score = this.calculateLeadScore(data);
    if (score >= 150) return 'Immediate';
    if (score >= 120) return 'High';
    if (score >= 90) return 'Medium';
    return 'Standard';
  }

  // Send admin notification email
  async sendAdminNotification(applicationData, recordId) {
    try {
      // This would integrate with your email service
      // For now, we'll log the notification details
      console.log('📧 ADMIN NOTIFICATION TRIGGERED', {
        type: 'New Investor Application',
        name: `${applicationData.firstName} ${applicationData.lastName}`,
        email: applicationData.email,
        capacity: applicationData.investmentCapacity,
        score: this.calculateLeadScore(applicationData),
        priority: this.getPriority(applicationData),
        airtableRecord: recordId,
        timestamp: new Date().toISOString()
      });
      
      // In production, send actual email notification here
      return true;
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return false;
    }
  }

  // Get all applications (for admin dashboard)
  async getApplications(filterBy = {}) {
    try {
      let url = this.baseUrl;
      
      // Add filters if provided
      if (Object.keys(filterBy).length > 0) {
        const params = new URLSearchParams();
        if (filterBy.status) params.append('filterByFormula', `{Status} = "${filterBy.status}"`);
        if (filterBy.priority) params.append('filterByFormula', `{Priority} = "${filterBy.priority}"`);
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  // Update application status
  async updateApplicationStatus(recordId, status, notes = '') {
    try {
      const response = await fetch(`${this.baseUrl}/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Status': status,
            'Follow Up Notes': notes,
            'Last Updated': new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  }
}

export const airtableService = new AirtableService();
export default airtableService;