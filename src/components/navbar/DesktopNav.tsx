import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

const DesktopNav = () => {
  const { t } = useLanguage();

  const navGroups = [
    {
      label: t.nav.aiTools,
      items: [
        { to: '/ai-decision-engine', label: t.nav.aiDecisionEngine },
        { to: '/voice-assistant',    label: t.nav.voiceAssistant },
        { to: '/profit-prediction',  label: t.nav.profitPrediction },
        { to: '/disease-scanner',    label: t.nav.diseaseScanner },
      ],
    },
    {
      label: t.nav.farmManagement,
      items: [
        { to: '/expense-tracker', label: t.nav.expenseTracker },
        { to: '/iot-monitoring',  label: t.nav.iotMonitoring },
      ],
    },
    {
      label: t.nav.community,
      items: [
        { to: '/community',          label: t.nav.farmerCommunity },
        { to: '/marketplace',        label: t.nav.marketplace },
        { to: '/government-schemes', label: t.nav.govtSchemes },
      ],
    },
  ];

  return (
    <nav className="hidden md:flex items-center gap-4">
      <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">{t.nav.home}</Link>
      <Link to="/seed-guide" className="text-sm font-medium hover:text-primary transition-colors">{t.nav.seedGuide}</Link>
      <Link to="/weather" className="text-sm font-medium hover:text-primary transition-colors">{t.nav.weather}</Link>

      {navGroups.map(group => (
        <div key={group.label} className="relative group">
          <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
            {group.label} <ChevronDown className="h-4 w-4" />
          </button>
          <div className="absolute left-0 mt-2 w-52 rounded-xl shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black/5 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
            <div className="py-1.5">
              {group.items.map(item => (
                <Link key={item.to + item.label} to={item.to}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}

      <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">{t.nav.contact}</Link>
    </nav>
  );
};

export default DesktopNav;
