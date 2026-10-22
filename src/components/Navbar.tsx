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
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [mobileCityOpen, setMobileCityOpen] = useState(false);

  const activeBookingsCount = myBookings.filter(b => b.status === 'confirmed').length;
  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const currencies: SupportedCurrency[] = ['USD', 'INR', 'EUR', 'GBP', 'JPY'];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#08090B]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#C7A675]/15 transition-colors duration-300">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-1.5 sm:gap-3">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A675] rounded-lg p-1 shrink-0"
            aria-label="CineBook Home"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#15171B] via-[#22262E] to-[#C7A675]/30 border border-[#C7A675]/40 flex items-center justify-center text-[#C7A675] shadow-lg shadow-black/50 group-hover:scale-105 group-hover:border-[#C7A675]/80 transition-all duration-300 shrink-0">
              <Film className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-12 duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-bold tracking-wider text-slate-900 dark:text-[#F3F0E8] font-display group-hover:opacity-90">
                CINE<span className="text-[#C7A675] font-serif font-black ml-0.5">BOOK</span>
              </span>
              <span className="hidden sm:flex text-[9px] uppercase tracking-[0.25em] text-slate-500 dark:text-[#A8ADB4] font-semibold -mt-1 items-center gap-1 font-mono">
                CINEMA EXPERIENCE <Sparkles className="w-2.5 h-2.5 text-[#C7A675]" />
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (xl+) */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 text-sm font-medium tracking-wide">
            <Link
              to="/"
              className="text-slate-600 dark:text-[#A8ADB4] hover:text-slate-900 dark:hover:text-[#C7A675] transition-colors"
            >
              {t.nav.movies}
            </Link>
            <a
              href="#now-showing"
              className="text-slate-600 dark:text-[#A8ADB4] hover:text-slate-900 dark:hover:text-[#C7A675] transition-colors"
            >
              {t.nav.nowShowing}
            </a>
            <a
              href="#coming-soon"
              className="text-slate-600 dark:text-[#A8ADB4] hover:text-slate-900 dark:hover:text-[#C7A675] transition-colors"
            >
              {t.nav.comingSoon}
            </a>
            <a
              href="#cinemas-section"
              className="text-slate-600 dark:text-[#A8ADB4] hover:text-slate-900 dark:hover:text-[#C7A675] transition-colors"
            >
              {t.nav.cinemas}
            </a>
            <Link
              to="/admin"
              className="hidden 2xl:flex text-slate-600 dark:text-[#A8ADB4] hover:text-[#C7A675] dark:hover:text-[#C7A675] transition-colors items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C7A675]" /> {t.nav.admin}
            </Link>
            <Link
              to="/scanner"
              className="hidden 2xl:flex text-slate-600 dark:text-[#A8ADB4] hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors items-center gap-1.5"
            >
              <Scan className="w-3.5 h-3.5 text-emerald-400" /> Scanner
            </Link>
          </nav>

          {/* Right Section Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
            {/* Supabase Connection Status (xl+) */}
            <div className="hidden xl:flex items-center">
              <SupabaseConnectionBadge compact={true} />
            </div>
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="min-w-[36px] sm:min-w-[40px] md:min-w-[44px] min-h-[36px] sm:min-h-[40px] md:min-h-[44px] flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-2 text-sm rounded-xl border border-slate-200 dark:border-[#C7A675]/20 bg-white dark:bg-[#15171B] text-slate-700 dark:text-[#F3F0E8] hover:border-[#C7A675]/60 hover:bg-slate-50 dark:hover:bg-[#1A1D24] shadow-sm dark:shadow-none transition-all duration-200 cursor-pointer shrink-0"
              aria-label={t.nav.searchPlaceholder}
              title={`${t.nav.searchPlaceholder} (Press /)`}
            >
              <Search className="w-4 h-4 text-[#C7A675]" />
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-[#08090B] text-slate-600 dark:text-[#A8ADB4] rounded border border-slate-200 dark:border-[#C7A675]/20">
                /
              </kbd>
            </button>

            {/* Language & Currency Selector (Visible on xl+) */}
            <div className="relative hidden xl:block">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#C7A675]/20 bg-white dark:bg-[#15171B] text-slate-700 dark:text-[#F3F0E8] hover:border-[#C7A675]/60 hover:bg-slate-50 dark:hover:bg-[#1A1D24] shadow-sm dark:shadow-none transition-colors cursor-pointer"
                aria-label={t.nav.language}
                title="Change Interface Language & Currency"
              >
                <Languages className="w-3.5 h-3.5 text-[#C7A675] shrink-0" />
                <span className="text-[11px] font-bold text-slate-900 dark:text-[#F3F0E8]">{currentLangInfo.nativeName}</span>
                <span className="hidden lg:inline px-1.5 py-0.5 rounded bg-[#C7A675]/15 border border-[#C7A675]/30 text-[#C7A675] text-[9px] font-mono font-bold">
                  {currency}
                </span>
                <ChevronDown className={`w-3 h-3 text-[#A8ADB4] transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setLangDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 max-h-[85vh] overflow-y-auto py-3 px-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-[#C7A675]/30 z-40 bg-white dark:bg-[#15171B] text-slate-900 dark:text-[#F3F0E8] space-y-3">
                    
                    {/* Currency & Time Format Header */}
                    <div className="pb-2 border-b border-slate-200 dark:border-white/10">
                      <div className="text-[10px] font-bold text-slate-500 dark:text-[#A8ADB4] uppercase tracking-wider mb-1.5 font-mono">
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
                                  ? 'bg-[#C7A675] text-[#08090B] border-[#C7A675] shadow-sm'
                                  : 'bg-slate-100 dark:bg-[#08090B] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A8ADB4] hover:border-[#C7A675]/40'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setTimeFormat(timeFormat === '12h' ? '24h' : '12h')}
                          className="px-2 py-1 text-[10px] font-semibold rounded-lg border border-slate-200 dark:border-[#C7A675]/30 bg-slate-100 dark:bg-[#08090B] text-[#C7A675] flex items-center gap-1 cursor-pointer hover:border-[#C7A675]/60"
                          title="Toggle 12h / 24h Clock"
                        >
                          <Clock className="w-3 h-3 text-[#C7A675]" />
                          <span>{timeFormat.toUpperCase()}</span>
                        </button>
                      </div>
                    </div>

                    {/* 18 Languages Grid */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-[#A8ADB4] uppercase tracking-wider mb-1.5 font-mono">
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
                                  ? 'bg-[#C7A675]/15 border-[#C7A675] text-[#C7A675] font-bold'
                                  : 'bg-slate-50 dark:bg-[#08090B] border-slate-200 dark:border-white/5 text-slate-700 dark:text-[#A8ADB4] hover:border-[#C7A675]/30 hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1D24]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span>{langItem.flag}</span>
                                <span className="truncate">{langItem.nativeName}</span>
                              </div>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#C7A675] shrink-0"></span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Location Selector (Visible on tablet/desktop md+) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-[#C7A675]/20 bg-white dark:bg-[#15171B] text-slate-700 dark:text-[#F3F0E8] hover:border-[#C7A675]/60 hover:bg-slate-50 dark:hover:bg-[#1A1D24] shadow-sm dark:shadow-none transition-colors cursor-pointer"
                aria-label={t.nav.selectCity}
              >
                <MapPin className="w-3.5 h-3.5 text-[#C7A675] shrink-0" />
                <span className="truncate max-w-[70px] sm:max-w-[100px] text-slate-900 dark:text-[#F3F0E8] font-semibold">{currentCity.split(',')[0]}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#A8ADB4] transition-transform duration-200 ${cityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {cityDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setCityDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 py-2 rounded-xl shadow-2xl border border-slate-200 dark:border-[#C7A675]/30 z-40 bg-white dark:bg-[#15171B] text-slate-900 dark:text-[#F3F0E8]">
                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-500 dark:text-[#A8ADB4] uppercase tracking-wider font-mono">
                      {t.nav.selectCity}
                    </div>
                    {CITIES.map(city => (
                      <button
                        key={city}
                        onClick={() => {
                          setCity(city);
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#C7A675]/10 hover:text-[#C7A675] transition-colors cursor-pointer ${
                          currentCity === city ? 'text-[#C7A675] font-semibold bg-[#C7A675]/15' : 'text-slate-700 dark:text-[#A8ADB4]'
                        }`}
                      >
                        <span>{city}</span>
                        {currentCity === city && <span className="w-1.5 h-1.5 rounded-full bg-[#C7A675]"></span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* My Tickets Button */}
            <Link
              to="/my-tickets"
              className="relative min-w-[36px] sm:min-w-[40px] md:min-w-[44px] min-h-[36px] sm:min-h-[40px] md:min-h-[44px] flex items-center justify-center gap-1.5 p-2 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full bg-[#C7A675] hover:bg-[#D4B585] text-[#08090B] active:scale-95 transition-all shadow-md shadow-[#C7A675]/20 cursor-pointer shrink-0"
              aria-label={t.nav.myTickets}
              title={t.nav.myTickets}
            >
              <Ticket className="w-4 h-4 fill-[#08090B]" />
              <span className="hidden sm:inline font-semibold">{t.nav.myTickets}</span>
              {activeBookingsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-black bg-[#08090B] text-[#C7A675] rounded-full border border-[#C7A675]/50">
                  {activeBookingsCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex min-w-[36px] sm:min-w-[40px] md:min-w-[44px] min-h-[36px] sm:min-h-[40px] md:min-h-[44px] items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-[#C7A675]/20 bg-white dark:bg-[#15171B] text-slate-700 dark:text-[#A8ADB4] hover:text-[#C7A675] hover:border-[#C7A675]/60 shadow-sm dark:shadow-none transition-all duration-200 cursor-pointer shrink-0"
              data-testid="theme-toggle"
              aria-label={`Switch theme to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch theme to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#C7A675] transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-[#15171B] transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Auth / Account Profile Dropdown (sm+) */}
            <div className="relative hidden sm:block shrink-0">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  data-testid="user-profile-button"
                  aria-label="User account menu"
                  className="min-h-[36px] sm:min-h-[40px] md:min-h-[44px] flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-[#C7A675]/40 bg-[#C7A675]/10 text-[#C7A675] hover:bg-[#C7A675]/20 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#C7A675]" />
                  <span className="hidden sm:inline max-w-[80px] truncate text-slate-900 dark:text-[#F3F0E8] font-semibold">{user?.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-[#C7A675]" />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  data-testid="sign-in-button"
                  aria-label={t.nav.signIn}
                  className="min-h-[36px] sm:min-h-[40px] md:min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-[#C7A675]/30 bg-white dark:bg-[#15171B] text-slate-700 dark:text-[#F3F0E8] hover:border-[#C7A675] hover:bg-slate-50 dark:hover:bg-[#1A1D24] shadow-sm dark:shadow-none transition-colors cursor-pointer shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#C7A675]" />
                  <span className="hidden sm:inline font-semibold">{t.nav.signIn}</span>
                </button>
              )}

              {userDropdownOpen && isAuthenticated && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 py-2 rounded-xl shadow-2xl border border-slate-200 dark:border-[#C7A675]/30 z-40 bg-white dark:bg-[#15171B] text-slate-900 dark:text-[#F3F0E8]">
                    <div className="px-3 py-2 border-b border-slate-200 dark:border-white/10">
                      <div className="text-xs font-bold text-slate-900 dark:text-[#F3F0E8]">{user?.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-[#A8ADB4] truncate">{user?.email}</div>
                      <span className={`inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        isAdmin ? 'bg-amber-500/10 text-amber-400 border border-amber-400/30' : 'bg-[#C7A675]/15 text-[#C7A675] border border-[#C7A675]/30'
                      }`}>
                        {isAdmin ? 'Cinema Administrator' : 'Moviegoer'}
                      </span>
                    </div>

                    <Link
                      to="/my-tickets"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#C7A675]/10 hover:text-[#C7A675] transition-colors text-slate-700 dark:text-[#A8ADB4]"
                    >
                      <Ticket className="w-3.5 h-3.5 text-[#C7A675]" /> {t.nav.myTickets}
                    </Link>

                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#C7A675]/10 hover:text-[#C7A675] transition-colors text-slate-700 dark:text-[#A8ADB4]"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C7A675]" /> {t.nav.admin}
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

            {/* Mobile / Tablet Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden min-w-[36px] sm:min-w-[40px] md:min-w-[44px] min-h-[36px] sm:min-h-[40px] md:min-h-[44px] flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1F2B] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm dark:shadow-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-b py-4 px-4 sm:px-6 space-y-3 bg-white/98 dark:bg-[#08090B]/98 border-slate-200 dark:border-[#C7A675]/20 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 text-slate-800 dark:text-[#F3F0E8] max-h-[85vh] overflow-y-auto">
            
            {/* Mobile City Selector */}
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#15171B] border border-slate-200 dark:border-[#C7A675]/20">
              <button
                onClick={() => setMobileCityOpen(!mobileCityOpen)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-[#F3F0E8]"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C7A675]" />
                  <span>City: <span className="text-[#C7A675] font-bold">{currentCity.split(',')[0]}</span></span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileCityOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileCityOpen && (
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                  {CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => {
                        setCity(city);
                        setMobileCityOpen(false);
                      }}
                      className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        currentCity === city
                          ? 'bg-[#C7A675] text-[#08090B] font-bold'
                          : 'bg-white dark:bg-[#08090B] text-slate-700 dark:text-[#A8ADB4] hover:bg-slate-200 dark:hover:bg-[#1A1D24]'
                      }`}
                    >
                      {city.split(',')[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Language & Currency Selector */}
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#15171B] border border-slate-200 dark:border-[#C7A675]/20">
              <button
                onClick={() => setMobileLangOpen(!mobileLangOpen)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-[#F3F0E8]"
              >
                <div className="flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-[#C7A675]" />
                  <span>{currentLangInfo.nativeName} ({currency})</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileLangOpen && (
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Currency:</span>
                    <div className="flex gap-1">
                      {currencies.map(c => (
                        <button
                          key={c}
                          onClick={() => setCurrency(c)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                            currency === c
                              ? 'bg-[#C7A675] text-[#08090B] border-[#C7A675]'
                              : 'bg-white dark:bg-[#08090B] text-slate-700 dark:text-[#A8ADB4] border-slate-200 dark:border-white/10'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto">
                    {SUPPORTED_LANGUAGES.map(langItem => (
                      <button
                        key={langItem.code}
                        onClick={() => {
                          setLanguage(langItem.code);
                          setMobileLangOpen(false);
                        }}
                        className={`text-left p-1.5 rounded text-xs truncate ${
                          language === langItem.code
                            ? 'bg-[#C7A675] text-[#08090B] font-bold'
                            : 'bg-white dark:bg-[#08090B] text-slate-700 dark:text-[#A8ADB4]'
                        }`}
                      >
                        {langItem.flag} {langItem.nativeName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-[#15171B] border border-slate-200 dark:border-[#C7A675]/20 text-xs font-semibold text-slate-700 dark:text-[#F3F0E8] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C7A675]" /> : <Moon className="w-4 h-4 text-[#15171B]" />}
                <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-[#C7A675]">Tap to toggle</span>
            </button>

            {/* Navigation Links */}
            <div className="space-y-1 pt-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-700 dark:text-[#F3F0E8] hover:text-[#C7A675] dark:hover:text-[#C7A675]"
              >
                {t.nav.movies}
              </Link>
              <a
                href="#now-showing"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-700 dark:text-[#F3F0E8] hover:text-[#C7A675] dark:hover:text-[#C7A675]"
              >
                {t.nav.nowShowing}
              </a>
              <a
                href="#coming-soon"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-700 dark:text-[#F3F0E8] hover:text-[#C7A675] dark:hover:text-[#C7A675]"
              >
                {t.nav.comingSoon}
              </a>
              <a
                href="#cinemas-section"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-700 dark:text-[#F3F0E8] hover:text-[#C7A675] dark:hover:text-[#C7A675]"
              >
                {t.nav.cinemas}
              </a>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-[#C7A675] flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" /> {t.nav.admin}
              </Link>
              <Link
                to="/scanner"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-emerald-400 flex items-center gap-1.5"
              >
                <Scan className="w-4 h-4" /> Scanner
              </Link>
            </div>

            {/* User Account / My Tickets Section */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
              <Link
                to="/my-tickets"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#C7A675] hover:bg-[#D4B585] text-[#08090B] text-sm font-bold flex items-center justify-between shadow-md shadow-[#C7A675]/20"
              >
                <span className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 fill-[#08090B]" />
                  <span>{t.nav.myTickets}</span>
                </span>
                {activeBookingsCount > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-[#08090B] text-[#C7A675] rounded-full font-black">
                    {activeBookingsCount}
                  </span>
                )}
              </Link>

              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  data-testid="drawer-sign-in-button"
                  className="w-full py-2.5 px-3 text-sm font-semibold rounded-xl border border-slate-200 dark:border-[#C7A675]/30 hover:bg-slate-100 dark:hover:bg-[#15171B] text-slate-800 dark:text-[#F3F0E8] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  aria-label={t.nav.signIn}
                >
                  <LogIn className="w-4 h-4 text-[#C7A675]" />
                  <span>{t.nav.signIn}</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#15171B] border border-slate-200 dark:border-[#C7A675]/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-[#F3F0E8]">{user?.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-[#A8ADB4]">{user?.email}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C7A675]/15 text-[#C7A675]">
                      {isAdmin ? 'Admin' : 'Moviegoer'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    data-testid="drawer-sign-out-button"
                    className="w-full py-2 px-3 text-center text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-rose-500/20"
                    aria-label={t.nav.signOut}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.nav.signOut}</span>
                  </button>
                </div>
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

