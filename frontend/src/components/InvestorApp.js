import React, { useState, useEffect } from 'react';
import InvestorLogin from './investor/InvestorLogin';
import InvestorDashboard from './investor/InvestorDashboard';

const InvestorApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing investor session
    const session = sessionStorage.getItem('nhalege_investor_session');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        if (sessionData.authenticated && sessionData.investor) {
          setIsAuthenticated(true);
          setInvestor(sessionData.investor);
        }
      } catch (error) {
        console.error('Invalid session data:', error);
        sessionStorage.removeItem('nhalege_investor_session');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (investorData) => {
    setIsAuthenticated(true);
    setInvestor(investorData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setInvestor(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-platinum-300">Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-900">
      {isAuthenticated && investor ? (
        <InvestorDashboard investor={investor} onLogout={handleLogout} />
      ) : (
        <InvestorLogin onLogin={handleLogin} />
      )}
    </div>
  );
};

export default InvestorApp;