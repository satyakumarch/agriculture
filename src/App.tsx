
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AnimatedPage from '@/components/AnimatedPage';
import Index from '@/pages/Index';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import SeedGuide from '@/pages/SeedGuide';
import ExpenseTracker from '@/pages/ExpenseTracker';
import Weather from '@/pages/Weather';
import DiseaseScanner from '@/pages/DiseaseScanner';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import AIDecisionEngine from '@/pages/AIDecisionEngine';
import VoiceAssistant from '@/pages/VoiceAssistant';
import ProfitPrediction from '@/pages/ProfitPrediction';
import GovernmentSchemes from '@/pages/GovernmentSchemes';
import FarmerCommunity from '@/pages/FarmerCommunity';
import Marketplace from '@/pages/Marketplace';
import FarmDigitalTwin from '@/pages/FarmDigitalTwin';
import LearningHub from '@/pages/LearningHub';
import EmergencySOS from '@/pages/EmergencySOS';
import DroneIntelligence from '@/pages/DroneIntelligence';

// ── Protected Route ────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    // Save the page they tried to visit so we can redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
};

const App = () => {
  return (
    <AnimatedPage>
      <Routes>
        {/* Public routes — accessible without login */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected routes — require login */}
        <Route path="/seed-guide"         element={<ProtectedRoute><SeedGuide /></ProtectedRoute>} />
        <Route path="/expense-tracker"    element={<ProtectedRoute><ExpenseTracker /></ProtectedRoute>} />
        <Route path="/weather"            element={<ProtectedRoute><Weather /></ProtectedRoute>} />
        <Route path="/disease-scanner"    element={<ProtectedRoute><DiseaseScanner /></ProtectedRoute>} />
        <Route path="/ai-decision-engine" element={<ProtectedRoute><AIDecisionEngine /></ProtectedRoute>} />
        <Route path="/voice-assistant"    element={<ProtectedRoute><VoiceAssistant /></ProtectedRoute>} />
        <Route path="/profit-prediction"  element={<ProtectedRoute><ProfitPrediction /></ProtectedRoute>} />
        <Route path="/government-schemes" element={<ProtectedRoute><GovernmentSchemes /></ProtectedRoute>} />
        <Route path="/community"          element={<ProtectedRoute><FarmerCommunity /></ProtectedRoute>} />
        <Route path="/marketplace"        element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/farm-digital-twin"  element={<ProtectedRoute><FarmDigitalTwin /></ProtectedRoute>} />
        <Route path="/learning-hub"       element={<ProtectedRoute><LearningHub /></ProtectedRoute>} />
        <Route path="/emergency-sos"      element={<ProtectedRoute><EmergencySOS /></ProtectedRoute>} />
        <Route path="/drone"              element={<ProtectedRoute><DroneIntelligence /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatedPage>
  );
};

export default App;
