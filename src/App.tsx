
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AnimatedPage from '@/components/AnimatedPage';
import Index from '@/pages/Index';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import SeedGuide from '@/pages/SeedGuide';
import ExpenseTracker from '@/pages/ExpenseTracker';
import Weather from '@/pages/Weather';
import IoTMonitoring from '@/pages/IoTMonitoring';
import DiseaseScanner from '@/pages/DiseaseScanner';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import LaborManagement from '@/pages/LaborManagement';
import AIDecisionEngine from '@/pages/AIDecisionEngine';
import VoiceAssistant from '@/pages/VoiceAssistant';
import ProfitPrediction from '@/pages/ProfitPrediction';
import GovernmentSchemes from '@/pages/GovernmentSchemes';
import FarmerCommunity from '@/pages/FarmerCommunity';
import Marketplace from '@/pages/Marketplace';
import FarmDigitalTwin from '@/pages/FarmDigitalTwin';
import LearningHub from '@/pages/LearningHub';
import EmergencySOS from '@/pages/EmergencySOS';

const App = () => {
  return (
    <AnimatedPage>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seed-guide" element={<SeedGuide />} />
        <Route path="/expense-tracker" element={<ExpenseTracker />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/iot-monitoring" element={<IoTMonitoring />} />
        <Route path="/disease-scanner" element={<DiseaseScanner />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/labor-management" element={<LaborManagement />} />
        <Route path="/ai-decision-engine" element={<AIDecisionEngine />} />
        <Route path="/voice-assistant" element={<VoiceAssistant />} />
        <Route path="/profit-prediction" element={<ProfitPrediction />} />
        <Route path="/government-schemes" element={<GovernmentSchemes />} />
        <Route path="/community" element={<FarmerCommunity />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/farm-digital-twin" element={<FarmDigitalTwin />} />
        <Route path="/learning-hub" element={<LearningHub />} />
        <Route path="/emergency-sos" element={<EmergencySOS />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatedPage>
  );
};

export default App;

// we are creating a react app with vite and typescript and tailwindcss
// we are using react-router-dom for routing
// we are using framer-motion for animations
// we are using context api for state management
