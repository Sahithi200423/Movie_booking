import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Film,
  MapPin,
  Search,
  Sun,
  Moon,
  User as UserIcon,
  Globe,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { SupportedLanguage } from '../types';
import { SupabaseConnectionBadge } from './SupabaseConnectionBadge';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenSearch: () => void;
}

const CITIES = ['Hyderabad', 'Mumbai', 'Bengaluru', 'Chennai', 'Delhi NCR', 'Kolkata'];

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenSearch }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, profile, signOut, isDemoUser } = useAuth();
  const { language, setLanguage, availableLanguages, t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsCityOpen(false);
  };

  const handleLangSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-[#0D0E12]/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                    Cine<span className="text-rose-500">Book</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    ₹5 Ticket
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                  Next-Gen Cinema Tickets
                </span>
              </div>
            </Link>

            {/* City Selector */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{selectedCity}</span>
              </button>

              {isCityOpen && (
                <div className="absolute left-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Select City
                  </div>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        selectedCity === city
                          ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Search Trigger */}
          <div className="flex-1 max-w-md hidden lg:block">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl border border-transparent dark:border-slate-700/50 transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('search.placeholder')}</span>
              </div>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
                /
              </kbd>
            </button>
          </div>

          {/* Nav Links & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/'
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t('nav.movies')}
              </Link>
              <Link
                to="/theatres"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/theatres'
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t('nav.theatres')}
              </Link>
              {user && (
                <Link
                  to="/tickets"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname === '/tickets'
                      ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t('nav.tickets')}
                </Link>
              )}
              {profile?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-2.5 py-1 rounded-lg text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Supabase Connection Status */}
            <div className="hidden sm:flex items-center">
              <SupabaseConnectionBadge />
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Change Language"
              >
                <Globe className="w-4 h-4" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    6 Languages
                  </div>
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangSelect(lang.code)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${
                        language === lang.code
                          ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-[10px] text-slate-400">{lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Search Icon on mobile */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Auth / Profile Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center text-xs font-bold">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold leading-tight text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                      {profile?.full_name || 'Customer'}
                    </span>
                    {isDemoUser && (
                      <span className="text-[9px] text-amber-500 font-semibold leading-none">
                        Demo Account
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-xs font-semibold px-2 py-1 text-slate-500 hover:text-rose-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t('nav.signin')}</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500">City</span>
            <div className="flex gap-1.5 flex-wrap">
              {CITIES.slice(0, 3).map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`text-xs px-2 py-1 rounded-lg ${
                    selectedCity === city
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-1 pb-2 flex sm:hidden items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Database:</span>
            <SupabaseConnectionBadge />
          </div>
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t('nav.movies')}
            </Link>
            <Link
              to="/theatres"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t('nav.theatres')}
            </Link>
            {user && (
              <Link
                to="/tickets"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t('nav.tickets')}
              </Link>
            )}
            {profile?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-amber-500 hover:bg-amber-500/10"
              >
                Admin Console
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
