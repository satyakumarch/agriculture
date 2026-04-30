import React from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, LogOut, UserCog, User } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/hooks/use-language';

interface MobileNavProps {
  isAuthenticated: boolean;
  user: { email: string; role: string } | null;
  mounted: boolean;
  handleLogout: () => void;
}

const MobileNav = ({ isAuthenticated, user, mounted, handleLogout }: MobileNavProps) => {
  const { t } = useLanguage();
  const isAdmin = user?.role === 'admin';

  const navGroups = [
    {
      label: '🌾 Farm Tools',
      items: [
        { to: '/seed-guide', label: '🌱 ' + t.nav.seedGuide },
        { to: '/weather',    label: '🌤️ ' + t.nav.weather },
        { to: '/drone',      label: '🚁 Drone Intelligence' },
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

  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-4 border-b">
            <Logo />
          </div>

          <nav className="flex flex-col gap-1 py-4">
            <Link to="/" className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">🏠 {t.nav.home}</Link>

            {navGroups.map(group => (
              <details key={group.label} className="group w-full">
                <summary className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md list-none flex justify-between cursor-pointer">
                  {group.label} <ChevronDown className="h-4 w-4" />
                </summary>
                <div className="ml-4 border-l pl-2 mt-1">
                  {group.items.map(item => (
                    <Link key={item.to + item.label} to={item.to} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            ))}

            <Link to="/contact" className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">📞 {t.nav.contact}</Link>
          </nav>

          <div className="mt-auto p-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">{t.nav.switchTheme}</span>
              {mounted && <ThemeToggle />}
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Language</span>
              <LanguageSelector />
            </div>

            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="flex items-center gap-1 mb-1">
                  {isAdmin ? <UserCog className="h-4 w-4 text-primary" /> : <User className="h-4 w-4" />}
                  <span className="text-sm font-medium">{user?.email}</span>
                </div>
                <Button className="w-full" variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> {t.nav.logout}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" className="col-span-1">
                  <Button className="w-full" variant="outline">{t.nav.login}</Button>
                </Link>
                <Link to="/register" className="col-span-1">
                  <Button className="w-full">{t.nav.signup}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
