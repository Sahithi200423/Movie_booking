import React, { useState } from 'react';
import { Film, ShieldCheck, Heart, Sparkles, X, HelpCircle, FileText, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);

  const openTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalContent({
      title: 'Terms of Service',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            Welcome to CineBook! By accessing our website and purchasing cinema tickets, you agree to comply with and be bound by the following terms.
          </p>
          <h4 className="font-bold text-slate-100 mt-2">1. Booking & Seat Selection</h4>
          <p>
            All seat selections are held temporarily during checkout. Tickets are confirmed only after transaction completion. A maximum of 8 seats can be booked per transaction.
          </p>
          <h4 className="font-bold text-slate-100 mt-2">2. Cancellation Policy</h4>
          <p>
            Confirmed tickets may be cancelled up to showtime for an eligible 90% refund. Past showtimes are strictly non-refundable.
          </p>
          <h4 className="font-bold text-slate-100 mt-2">3. Demo Environment Notice</h4>
          <p>
            CineBook operates in simulation demo mode. No genuine currency or bank instruments are processed or stored.
          </p>
        </div>
      )
    });
  };

  const openPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalContent({
      title: 'Privacy Policy',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            Your privacy is paramount at CineBook. We are committed to transparency and securing any personal data you share with us.
          </p>
          <h4 className="font-bold text-slate-100 mt-2">1. Information We Collect</h4>
          <p>
            We collect your name, email address, and phone number exclusively for issuing digital booking confirmations and customer support.
          </p>
          <h4 className="font-bold text-slate-100 mt-2">2. Zero Payment Storage</h4>
          <p>
            We never store, log, or transmit raw credit card numbers or CVV verification codes. All checkout actions occur in secured demo mode.
          </p>
          <h4 className="font-bold text-slate-100 mt-2">3. Data Retention & Cookies</h4>
          <p>
            Session cookies and local storage are utilized only to store your preferred city, theme preference (Dark/Light), and demo ticket passes.
          </p>
        </div>
      )
    });
  };

  const openFAQ = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalContent({
      title: 'Frequently Asked Questions (FAQ)',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <div>
            <h4 className="font-bold text-slate-100">Q: How do I access my booked ticket?</h4>
            <p className="text-slate-400 mt-0.5">
              Click the "My Tickets" button in the navigation bar at any time to view all your active cinema boarding passes, QR entry codes, and seat assignments.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-100">Q: How do I change audio languages?</h4>
            <p className="text-slate-400 mt-0.5">
              Use the Language dropdown filter on the home page or select your preferred audio dub track (Telugu, Tamil, Hindi, Malayalam, English, etc.) on the movie details page.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-100">Q: Can I cancel my booking?</h4>
            <p className="text-slate-400 mt-0.5">
              Yes! Navigate to My Tickets, locate your reservation, and click "Cancel Ticket". Your seats are immediately released and a 90% refund is processed in demo mode.
            </p>
          </div>
        </div>
      )
    });
  };

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#0C0D12] text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                CINE<span className="text-blue-600 dark:text-blue-500 font-extrabold">BOOK</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              The premier movie ticket booking experience. Discover blockbusters, reserve custom theater seats, and enjoy unmatched sound and visuals.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Cinema Booking</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Explore & Book
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#now-showing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Now Showing
                </a>
              </li>
              <li>
                <a href="#coming-soon" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Coming Soon
                </a>
              </li>
              <li>
                <a href="#cinemas-section" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Cinemas & Theatres
                </a>
              </li>
              <li>
                <Link to="/my-tickets" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  My Tickets & History
                </Link>
              </li>
            </ul>
          </div>

          {/* Premium Experiences */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Premium Formats
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-[#1C1F2B] border border-slate-300 dark:border-white/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">IMAX</span>
                <span className="text-slate-700 dark:text-slate-300">Laser 4K Projection</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-[#1C1F2B] border border-slate-300 dark:border-white/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">DOLBY</span>
                <span className="text-slate-700 dark:text-slate-300">Atmos Immersive Audio</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-[#1C1F2B] border border-slate-300 dark:border-white/10 text-purple-600 dark:text-purple-400 font-bold text-[10px]">4DX</span>
                <span className="text-slate-700 dark:text-slate-300">Motion & Environmental FX</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-[#1C1F2B] border border-slate-300 dark:border-white/10 text-amber-600 dark:text-amber-400 font-bold text-[10px]">VIP</span>
                <span className="text-slate-700 dark:text-slate-300">Heated Recliner Suites</span>
              </li>
            </ul>
          </div>

          {/* Legal & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>Policies & Support</span>
            </h4>
            <ul className="space-y-1 text-xs">
              <li>
                <button
                  onClick={openTerms}
                  className="py-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={openPrivacy}
                  className="py-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Privacy & Security
                </button>
              </li>
              <li>
                <button
                  onClick={openFAQ}
                  className="py-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> FAQ & Help Center
                </button>
              </li>
            </ul>
            <div className="p-3 rounded-xl bg-white dark:bg-[#14161F] border border-slate-200 dark:border-white/10 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 shadow-sm dark:shadow-none">
              Demo Checkout: Transactions and seats are safely simulated. No real cards charged.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} CineBook Cinema Group. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for moviegoers</span>
          </div>
        </div>
      </div>

      {/* Info Dialog Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-[#090A0F]/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161F] p-6 shadow-2xl relative text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{modalContent.title}</h3>
              <button
                onClick={() => setModalContent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {modalContent.content}
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer shadow-md shadow-blue-600/30"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
