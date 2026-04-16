import React from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, LogOut, UserCog, User } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

interface MobileNavProps {
  isAuthenticated: boolean;
  user: { email: string; role: string } | null;
  mounted: boolean;
  handleLogout: () => void;
}

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

const MobileNav = ({ isAuthenticated, user, mounted, handleLogout }: MobileNavProps) => {
  const isAdmin = user?.role === 'admin';

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
            <Link to="/" className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">🏠 Home</Link>
            <Link to="/seed-guide" className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">🌱 Seed Guide</Link>
            <Link to="/weather" className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">🌤️ Weather</Link>

            {navGroups.map(group => (
              <details key={group.label} className="group w-full">
                <summary className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md list-none flex justify-between cursor-pointer">
                  {group.label} <ChevronDown className="h-4 w-4" />
                </summary>
                <div className="ml-4 border-l pl-2 mt-1">
                  {group.items.map(item => (
                    <Link key={item.to} to={item.to} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            ))}

            <Link to="/emergency-sos" className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md">🚨 Emergency SOS</Link>
            <Link to="/contact" className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">📞 Contact</Link>
          </nav>

          <div className="mt-auto p-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Switch Theme</span>
              {mounted && <ThemeToggle />}
            </div>

            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="flex items-center gap-1 mb-1">
                  {isAdmin ? <UserCog className="h-4 w-4 text-primary" /> : <User className="h-4 w-4" />}
                  <span className="text-sm font-medium">{user?.email}</span>
                </div>
                <Button className="w-full" variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" className="col-span-1">
                  <Button className="w-full" variant="outline">Login</Button>
                </Link>
                <Link to="/register" className="col-span-1">
                  <Button className="w-full">Sign Up</Button>
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
