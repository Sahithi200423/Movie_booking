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
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { SeatSelectionPage } from './pages/SeatSelectionPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { AdminPage } from './pages/AdminPage';
import { TicketScannerPage } from './pages/TicketScannerPage';
import { NotFoundPage } from './pages/NotFoundPage';

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
