import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const navGroups = [
  {
    label: 'AI Tools',
    items: [
      { to: '/ai-decision-engine', label: '🧠 AI Decision Engine' },
      { to: '/voice-assistant', label: '🎙️ Voice Assistant' },
      { to: '/profit-prediction', label: '📈 Profit Prediction' },
      { to: '/disease-scanner', label: '🔬 Disease Scanner' },
    ],
  },
  {
    label: 'Farm Management',
    items: [
      { to: '/expense-tracker', label: '💰 Expense Tracker' },
      { to: '/iot-monitoring', label: '📡 IoT Monitoring' },
      { to: '/labor-management', label: '👷 Labor Management' },
      { to: '/farm-digital-twin', label: '🗺️ Digital Twin' },
    ],
  },
  {
    label: 'Community',
    items: [
      { to: '/community', label: '💬 Farmer Community' },
      { to: '/marketplace', label: '🛒 Marketplace' },
      { to: '/government-schemes', label: '🏛️ Govt Schemes' },
      { to: '/learning-hub', label: '📚 Learning Hub' },
    ],
  },
];

const DesktopNav = () => {
  return (
    <nav className="hidden md:flex items-center gap-4">
      <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
        Home
      </Link>
      <Link to="/seed-guide" className="text-sm font-medium hover:text-primary transition-colors">
        Seed Guide
      </Link>
      <Link to="/weather" className="text-sm font-medium hover:text-primary transition-colors">
        Weather
      </Link>

      {navGroups.map(group => (
        <div key={group.label} className="relative group">
          <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
            {group.label} <ChevronDown className="h-4 w-4" />
          </button>
          <div className="absolute left-0 mt-2 w-52 rounded-xl shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black/5 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
            <div className="py-1.5">
              {group.items.map(item => (
                <Link key={item.to} to={item.to}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}

      <Link to="/emergency-sos" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-1">
        🚨 SOS
      </Link>
      <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
        Contact
      </Link>
    </nav>
  );
};

export default DesktopNav;
