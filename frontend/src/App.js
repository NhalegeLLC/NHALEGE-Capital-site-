import React, { useState } from "react";
import "./App.css";
import LandingPage from "./components/LandingPage";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'auth', 'dashboard'

  const handleEnterDashboard = () => {
    setCurrentView('auth');
  };

  const handleAuthenticated = () => {
    setCurrentView('dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <div className="App">
      {currentView === 'landing' && (
        <LandingPage onEnterDashboard={handleEnterDashboard} />
      )}
      {currentView === 'auth' && (
        <AuthScreen onAuthenticated={handleAuthenticated} />
      )}
      {currentView === 'dashboard' && (
        <Dashboard onBackToLanding={handleBackToLanding} />
      )}
    </div>
  );
}

export default App;
