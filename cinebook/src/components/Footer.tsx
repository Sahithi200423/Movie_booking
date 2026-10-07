import React from 'react';
import { Film, ShieldCheck, Ticket, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0A0B0E] text-slate-600 dark:text-slate-400 text-xs transition-colors">
      {/* ₹5 Value Props Bar */}
      <div className="border-b border-slate-100 dark:border-slate-800/50 py-6 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 font-bold">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">₹5 Flat Ticket Guarantee</h4>
              <p className="text-[11px] text-slate-500">Every movie, every standard seat across India.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">10-Minute Seat Hold</h4>
              <p className="text-[11px] text-slate-500">Atomic real-time locks prevent double booking.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Supabase PostgreSQL Security</h4>
              <p className="text-[11px] text-slate-500">Row-Level Security & Encrypted Turnstile QR.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-rose-500 flex items-center justify-center text-white">
            <Film className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-white">CineBook</span>
          <span className="text-[11px] text-slate-400">© 2026 CineBook Media Inc.</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <Link to="/" className="hover:text-rose-500 transition-colors">
            Movies
          </Link>
          <Link to="/theatres" className="hover:text-rose-500 transition-colors">
            Theatres
          </Link>
          <Link to="/tickets" className="hover:text-rose-500 transition-colors">
            Digital Tickets
          </Link>
          <Link to="/admin" className="hover:text-amber-500 transition-colors">
            Admin Console
          </Link>
        </div>
      </div>
    </footer>
  );
};
