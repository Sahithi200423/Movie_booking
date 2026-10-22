import React from 'react';
import { Sparkles } from 'lucide-react';
import { IS_PORTFOLIO_DEMO_MODE, DEMO_NOTICE_TEXT } from '../config/demoMode';

/**
 * CineBook V3 — Luxury Portfolio Demonstration Banner
 * Elegant, non-intrusive notification informing visitors that CineBook V3
 * is running in safe portfolio demo mode with simulated checkout and zero real payments.
 */
export const DemoBanner: React.FC = () => {
  if (!IS_PORTFOLIO_DEMO_MODE) return null;

  return (
    <div
      role="region"
      aria-label="Portfolio Demo Announcement"
      className="relative z-40 bg-[#08090B] border-b border-[#C7A675]/25 text-[#DFC49D] text-[11px] sm:text-xs py-2 px-3 sm:px-4 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#C7A675]/20 text-[#C7A675] shrink-0">
            <Sparkles className="w-2.5 h-2.5" />
          </span>
          <span className="font-semibold tracking-wide text-[#F3F0E8]">
            {DEMO_NOTICE_TEXT}
          </span>
          <span className="hidden md:inline text-[#A8ADB4]">
            — Enjoy exploring 3D seat selection, luxury showtimes, and simulated M-ticket checkout.
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#08090B] font-bold bg-[#C7A675] px-2.5 py-0.5 rounded-full border border-[#DFC49D] shadow-sm shrink-0">
          <span>PORTFOLIO DEMO</span>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;
