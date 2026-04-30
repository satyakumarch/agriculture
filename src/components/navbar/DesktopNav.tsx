import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface DesktopNavProps {
  isScrolled?: boolean;
}

const DesktopNav = ({ isScrolled = false }: DesktopNavProps) => {
  const { t } = useLanguage();

  const navGroups = [
    {
      label: '🌾 Farm Tools',
      items: [
        { to: '/seed-guide',  label: '🌱 ' + t.nav.seedGuide },
        { to: '/weather',     label: '🌤️ ' + t.nav.weather },
        { to: '/drone',       label: '🚁 Drone Intelligence' },
      ],
    },
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
      label: t.nav.community,
      items: [
        { to: '/community',          label: t.nav.farmerCommunity },
        { to: '/marketplace',        label: t.nav.marketplace },
        { to: '/government-schemes', label: t.nav.govtSchemes },
      ],
    },
  ];

  const linkClass = isScrolled
    ? 'text-white hover:text-green-200 hover:bg-green-700/60'
    : 'text-white hover:text-green-200 hover:bg-green-700/60';

  return (
    <nav className="hidden md:flex items-center gap-0.5">
      <Link
        to="/"
        className={`px-4 py-2 rounded-full text-[15px] font-semibold transition-all duration-200 ${linkClass}`}
      >
        {t.nav.home}
      </Link>

      {navGroups.map(group => (
        <div key={group.label} className="relative group">
          <button className={`flex items-center gap-1 px-4 py-2 rounded-full text-[15px] font-semibold transition-all duration-200 ${linkClass}`}>
            {group.label}
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180 opacity-70" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-56 rounded-2xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 overflow-hidden">
            <div className="py-2">
              {group.items.map(item => (
                <Link
                  key={item.to + item.label}
                  to={item.to}
                  className="block px-4 py-2.5 text-[14px] font-medium text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}

      <Link
        to="/contact"
        className={`px-4 py-2 rounded-full text-[15px] font-semibold transition-all duration-200 ${linkClass}`}
      >
        {t.nav.contact}
      </Link>
    </nav>
  );
};

export default DesktopNav;
