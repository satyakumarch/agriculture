
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
      "fixed top-0 w-full z-40 transition-all duration-200",
      isScrolled 
        ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-3" 
        : "bg-transparent py-5"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Logo />
        
        {/* Desktop Navigation */}
        <DesktopNav />
        
        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <LanguageSelector />
          {mounted && <ThemeToggle />}
          <AuthButtons 
            isAuthenticated={isAuthenticated} 
            user={user} 
            handleLogout={handleLogout} 
          />
        </div>
        
        {/* Mobile Menu */}
        <MobileNav 
          isAuthenticated={isAuthenticated}
          user={user}
          mounted={mounted}
          handleLogout={handleLogout}
        />
      </div>
    </header>
  );
};

export default Navbar;
