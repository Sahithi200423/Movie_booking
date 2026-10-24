import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { CustomCursor } from './components/CustomCursor';
import { DemoBanner } from './components/DemoBanner';
import { HomePage } from './pages/HomePage';

// Lazy-loaded routes for code-splitting
const MovieDetailsPage = React.lazy(() => import('./pages/MovieDetailsPage').then(m => ({ default: m.MovieDetailsPage })));
const SeatSelectionPage = React.lazy(() => import('./pages/SeatSelectionPage').then(m => ({ default: m.SeatSelectionPage })));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const ConfirmationPage = React.lazy(() => import('./pages/ConfirmationPage').then(m => ({ default: m.ConfirmationPage })));
const MyTicketsPage = React.lazy(() => import('./pages/MyTicketsPage').then(m => ({ default: m.MyTicketsPage })));
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const TicketScannerPage = React.lazy(() => import('./pages/TicketScannerPage').then(m => ({ default: m.TicketScannerPage })));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Champagne Luxury Fallback Spinner
const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 rounded-full border-2 border-[#C7A675] border-t-transparent animate-spin" />
    <span className="text-xs uppercase tracking-widest text-[#C7A675] font-mono">Loading Experience...</span>
  </div>
);

// Scroll to top upon route transition
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global key listener for '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BookingProvider>
            <Router>
              <ScrollToTop />
              <CustomCursor />
              <div className="min-h-screen flex flex-col overflow-x-hidden bg-slate-50 dark:bg-[#08090B] text-slate-900 dark:text-[#F3F0E8] selection:bg-[#C7A675] selection:text-[#08090B] transition-colors duration-300">
                {/* Global Demo Announcement */}
                <DemoBanner />

                {/* Global Navigation Bar */}
                <Navbar
                  onOpenSearch={() => setIsSearchOpen(true)}
                />

                {/* Main Application Pages */}
                <div className="flex-1">
                  <React.Suspense fallback={<RouteLoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/movie/:id" element={<MovieDetailsPage />} />
                      <Route path="/seat-selection" element={<SeatSelectionPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/confirmation" element={<ConfirmationPage />} />
                      <Route path="/my-tickets" element={<MyTicketsPage />} />
                      <Route path="/admin" element={<AdminPage />} />
                      <Route path="/scanner" element={<TicketScannerPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </React.Suspense>
                </div>

                {/* Global Footer with interactive dialogs */}
                <Footer />

                {/* Overlays / Modals */}
                <SearchModal
                  isOpen={isSearchOpen}
                  onClose={() => setIsSearchOpen(false)}
                />
              </div>
            </Router>
          </BookingProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
