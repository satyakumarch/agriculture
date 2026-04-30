
import React from 'react';
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserPlus, LogOut, ChevronDown, Tractor } from 'lucide-react';

interface AuthButtonsProps {
  isAuthenticated: boolean;
  user: { email: string; role: string } | null;
  handleLogout: () => void;
}

const AuthButtons = ({ isAuthenticated, user, handleLogout }: AuthButtonsProps) => {
  // Get initials from email
  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.slice(0, 2).toUpperCase();
  };

  // Get display name from email
  const getDisplayName = (email: string) => {
    return email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 rounded-full pl-1 pr-3 py-1 transition-all">
            {/* Avatar circle */}
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
              {getInitials(user.email)}
            </div>
            <span className="text-sm font-semibold text-white max-w-[100px] truncate hidden sm:block">
              {getDisplayName(user.email)}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-white/80 hidden sm:block" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60 rounded-2xl shadow-2xl p-2 mt-2">
          {/* Profile header */}
          <div className="flex items-center gap-3 px-3 py-3 mb-1 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white text-lg font-bold shadow">
              {getInitials(user.email)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                {getDisplayName(user.email)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full mt-1">
                <Tractor className="h-3 w-3" /> Farmer
              </span>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer mt-1"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/login">
        <Button variant="ghost" className="text-white hover:bg-white/20 font-semibold">
          Login
        </Button>
      </Link>
      <Link to="/register">
        <Button className="bg-white text-green-700 hover:bg-green-50 font-semibold shadow-sm">
          <UserPlus className="h-4 w-4 mr-1" /> Sign Up
        </Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
