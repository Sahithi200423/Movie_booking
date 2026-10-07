import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  MapPin,
  Search,
  Sun,
  Moon,
  Ticket,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  User,
  ShieldCheck,
  LogOut,
  LogIn,
  Languages,
  Clock,
  Scan
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES, type SupportedCurrency } from '../i18n/types';
import { CITIES } from '../data/mockData';
import { AuthModal } from './AuthModal';
import { SupabaseConnectionBadge } from './SupabaseConnectionBadge';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenMyBookings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentCity, setCity, myBookings } = useBooking();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const {
    t,
    language,
    setLanguage,
    currency,
    setCurrency,
    timeFormat,
    setTimeFormat
  } = useTranslation();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const activeBookingsCount = myBookings.filter(b => b.status === 'confirmed').length;
  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const currencies: SupportedCurrency[] = ['USD', 'INR', 'EUR', 'GBP', 'JPY'];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#0E1017]/85 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 shrink-0"
            aria-label="CineBook Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300">
              <Film className="w-5 h-5 transition-transform group-hover:rotate-12 duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:opacity-90">
                CINE<span className="text-blue-500 font-extrabold">BOOK</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold -mt-1 flex items-center gap-1">
                Cinema Experience <Sparkles className="w-2.5 h-2.5 text-blue-500 dark:text-blue-400" />
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t.nav.movies}
            </Link>
            <a
              href="#now-showing"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t.nav.nowShowing}
            </a>
            <a
              href="#coming-soon"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t.nav.comingSoon}
            </a>
            <a
              href="#cinemas-section"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t.nav.cinemas}
            </a>
            <Link
              to="/admin"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" /> {t.nav.admin}
            </Link>
            <Link
              to="/scanner"
              className="text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Scan className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Scanner
            </Link>
          </nav>

          {/* Right Section Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Supabase Connection Status */}
            <div className="hidden sm:flex items-center">
              <SupabaseConnectionBadge />
            </div>
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1F2B] text-slate-700 dark:text-slate-200 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-[#222634] shadow-sm dark:shadow-none transition-all duration-200 cursor-pointer"
              aria-label={t.nav.searchPlaceholder}
              title={`${t.nav.searchPlaceholder} (Press /)`}
            >
              <Search className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-300 truncate max-w-[100px]">{t.nav.searchPlaceholder.slice(0, 15)}...</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-[#14161F] text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/10">
                /
              </kbd>
            </button>

            {/* Language & Currency Selector (18 Languages + 5 Currencies + 12h/24h) */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1F2B] text-slate-700 dark:text-slate-200 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-[#222634] shadow-sm dark:shadow-none transition-colors cursor-pointer"
                aria-label={t.nav.language}
                title="Change Interface Language & Currency"
              >
                <Languages className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                <span className="text-[11px] font-bold text-slate-900 dark:text-white">{currentLangInfo.nativeName}</span>
                <span className="hidden md:inline px-1.5 py-0.5 rounded bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-[9px] font-mono font-bold">
                  {currency}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setLangDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 max-h-[85vh] overflow-y-auto py-3 px-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 z-40 bg-white dark:bg-[#14161F] text-slate-900 dark:text-slate-200 space-y-3">
                    
                    {/* Currency & Time Format Header */}
                    <div className="pb-2 border-b border-slate-200 dark:border-white/10">
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        {t.nav.currency} & {t.nav.timeFormat}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-1">
                          {currencies.map(c => (
                            <button
                              key={c}
                              onClick={() => setCurrency(c)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                currency === c
                                  ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                                  : 'bg-slate-100 dark:bg-[#1C1F2B] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setTimeFormat(timeFormat === '12h' ? '24h' : '12h')}
                          className="px-2 py-1 text-[10px] font-semibold rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#1C1F2B] text-blue-600 dark:text-blue-300 flex items-center gap-1 cursor-pointer hover:border-blue-500/50"
                          title="Toggle 12h / 24h Clock"
                        >
                          <Clock className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                          <span>{timeFormat.toUpperCase()}</span>
                        </button>
                      </div>
                    </div>

                    {/* 18 Languages Grid */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        {t.nav.language} (18 Available)
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
                        {SUPPORTED_LANGUAGES.map(langItem => {
                          const isSelected = language === langItem.code;
                          return (
                            <button
                              key={langItem.code}
                              onClick={() => {
                                setLanguage(langItem.code);
                                setLangDropdownOpen(false);
                              }}
                              className={`text-left p-2 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600/10 dark:bg-blue-600/20 border-blue-500 text-blue-600 dark:text-white font-bold'
                                  : 'bg-slate-50 dark:bg-[#1C1F2B] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/15 hover:bg-slate-100 dark:hover:bg-[#222634]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span>{langItem.flag}</span>
                                <span className="truncate">{langItem.nativeName}</span>
                              </div>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Location Selector */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1F2B] text-slate-700 dark:text-slate-200 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-[#222634] shadow-sm dark:shadow-none transition-colors cursor-pointer"
                aria-label={t.nav.selectCity}
              >
                <MapPin className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                <span className="truncate max-w-[70px] sm:max-w-[100px] text-slate-900 dark:text-white font-semibold">{currentCity.split(',')[0]}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${cityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {cityDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setCityDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 py-2 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 z-40 bg-white dark:bg-[#14161F] text-slate-900 dark:text-slate-200">
                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {t.nav.selectCity}
                    </div>
                    {CITIES.map(city => (
                      <button
                        key={city}
                        onClick={() => {
                          setCity(city);
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-500/10 hover:text-blue-600 dark:hover:bg-blue-600/15 dark:hover:text-white transition-colors cursor-pointer ${
                          currentCity === city ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-500/10 dark:bg-blue-600/15' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{city}</span>
                        {currentCity === city && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* My Tickets Button */}
            <Link
              to="/my-tickets"
              className="relative flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-full bg-blue-600 hover:bg-blue-500 text-white active:scale-95 transition-all shadow-md shadow-blue-600/25 cursor-pointer shrink-0"
              aria-label={t.nav.myTickets}
            >
              <Ticket className="w-4 h-4 fill-white" />
              <span className="hidden md:inline font-bold">{t.nav.myTickets}</span>
              {activeBookingsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-black bg-white dark:bg-[#090A0F] text-blue-600 dark:text-blue-400 rounded-full border border-blue-400/40">
                  {activeBookingsCount}
                </span>
              )}
            </Link>

            {/* Auth / Account Profile Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300 hover:bg-blue-500/20 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  <span className="hidden sm:inline max-w-[80px] truncate text-slate-900 dark:text-white font-semibold">{user?.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1F2B] text-slate-700 dark:text-slate-200 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-[#222634] shadow-sm dark:shadow-none transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  <span className="hidden sm:inline font-semibold">{t.nav.signIn}</span>
                </button>
              )}

              {userDropdownOpen && isAuthenticated && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 py-2 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 z-40 bg-white dark:bg-[#14161F] text-slate-900 dark:text-slate-200">
                    <div className="px-3 py-2 border-b border-slate-200 dark:border-white/10">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</div>
                      <span className={`inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        isAdmin ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300' : 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300'
                      }`}>
                        {isAdmin ? 'Cinema Administrator' : 'Moviegoer'}
                      </span>
                    </div>

                    <Link
                      to="/my-tickets"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-blue-500/10 dark:hover:bg-blue-600/15 hover:text-blue-600 dark:hover:text-white transition-colors text-slate-700 dark:text-slate-300"
                    >
                      <Ticket className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" /> {t.nav.myTickets}
                    </Link>

                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-blue-500/10 dark:hover:bg-blue-600/15 hover:text-blue-600 dark:hover:text-white transition-colors text-slate-700 dark:text-slate-300"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" /> {t.nav.admin}
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-slate-200 dark:border-white/10 mt-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> {t.nav.signOut}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1F2B] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/50 shadow-sm dark:shadow-none transition-all duration-200 cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1F2B] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm dark:shadow-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b py-4 px-6 space-y-3 bg-white/95 dark:bg-[#0E1017]/95 border-slate-200 dark:border-white/10 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 text-slate-800 dark:text-slate-200">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {t.nav.movies}
            </Link>
            <a
              href="#now-showing"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {t.nav.nowShowing}
            </a>
            <a
              href="#coming-soon"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {t.nav.comingSoon}
            </a>
            <a
              href="#cinemas-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {t.nav.cinemas}
            </a>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              {t.nav.admin}
            </Link>
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
              <Link
                to="/my-tickets"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left py-2 text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center justify-between"
              >
                <span>{t.nav.myTickets}</span>
                <span className="px-2 py-0.5 text-xs bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full font-bold">
                  {activeBookingsCount}
                </span>
              </Link>
              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  {t.nav.signIn}
                </button>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-sm font-medium text-rose-500 dark:text-rose-400"
                >
                  {t.nav.signOut} ({user?.name})
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

