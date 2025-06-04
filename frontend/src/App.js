import React, { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import ThankYouPage from "./components/ThankYouPage";
import AdminApp from "./components/AdminApp";

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'auth', 'dashboard', 'thankyou', 'admin'
  const [calculatorData, setCalculatorData] = useState(null);

  const handleEnterDashboard = () => {
    setCurrentView('auth');
  };

  const handleAuthenticated = () => {
    setCurrentView('dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setCalculatorData(null);
  };

  const handleCalculationComplete = (amount, projectedReturn, term) => {
    setCalculatorData({ amount, projectedReturn, term });
    setCurrentView('thankyou');
  };

  const handleAdminAccess = () => {
    setCurrentView('admin');
  };

  const showNavigation = currentView === 'landing' || currentView === 'thankyou';

  // Check for admin access via URL
  React.useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setCurrentView('admin');
    }
  }, []);

  return (
    <div className="App">
      {showNavigation && <Navigation currentPage="capital" />}
      
      {currentView === 'landing' && (
        <LandingPage 
          onEnterDashboard={handleEnterDashboard} 
          onCalculationComplete={handleCalculationComplete}
          onAdminAccess={handleAdminAccess}
        />
      )}
      {currentView === 'auth' && (
        <AuthScreen onAuthenticated={handleAuthenticated} />
      )}
      {currentView === 'dashboard' && (
        <Dashboard onBackToLanding={handleBackToLanding} />
      )}
      {currentView === 'thankyou' && (
        <ThankYouPage 
          onBackToLanding={handleBackToLanding}
          investmentAmount={calculatorData?.amount}
          projectedReturn={calculatorData?.projectedReturn}
        />
      )}
      {currentView === 'admin' && (
        <AdminApp />
      )}
    </div>
  );
}

export default App;
