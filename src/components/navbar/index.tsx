
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import ThemeToggle from './ThemeToggle';
import AuthButtons from './AuthButtons';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication on mount
  useEffect(() => {
    setMounted(true);
    
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else if (authStatus) {
      // If authenticated but no user data, set default role as client
      const defaultUser = { email: 'user@example.com', role: 'client' };
      setUser(defaultUser);
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <header className={cn(
      "fixed w-full z-40 transition-all duration-300",
      "top-[36px]", // sits below the 36px marquee
      isScrolled
        ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-md border-b border-gray-200/60 dark:border-gray-800/60 py-2"
        : "bg-transparent py-3"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between gap-4">

        {/* Logo */}
        <Logo />

        {/* Desktop Navigation — clean pill */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className={cn(
            "flex items-center rounded-full transition-all duration-300",
            isScrolled
              ? "bg-green-800 dark:bg-green-900 px-2 py-1 shadow-lg"
              : "bg-green-800/90 backdrop-blur-sm border border-green-600/40 px-2 py-1 shadow-xl"
          )}>
            <DesktopNav isScrolled={isScrolled} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSelector />
          <AuthButtons isAuthenticated={isAuthenticated} user={user} handleLogout={handleLogout} />
        </div>

        {/* Mobile Menu */}
        <MobileNav isAuthenticated={isAuthenticated} user={user} mounted={mounted} handleLogout={handleLogout} />
      </div>
    </header>
  );
};

export default Navbar;
