import React, { useState, useEffect, useMemo, Component, type ErrorInfo, type ReactNode } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Home,
  Ticket,
  AlertTriangle,
  Scan,
  Calendar,
  Share2,
  Download,
  Check
} from 'lucide-react';
import { HolographicTicket } from '../components/HolographicTicket';
import { useBooking } from '../context/BookingContext';
import { useTranslation } from '../context/LanguageContext';
import { getBookingByIdApi } from '../services/api';
import type { BookingRecord } from '../types';
import { IS_PORTFOLIO_DEMO_MODE, DEMO_NOTICE_TEXT } from '../config/demoMode';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ConfirmationErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Confirmation page rendering error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50 dark:bg-[#0B0C0E] text-slate-900 dark:text-slate-100">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-4">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Notice: Booking Display</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            Your booking was processed. You can verify your active pass directly inside My Tickets.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/my-tickets"
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-colors"
            >
              View My Tickets
            </Link>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1F2B] text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-[#252a3a] transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ConfirmationContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { myBookings } = useBooking();
  const { isRTL } = useTranslation();

  const rawId = searchParams.get('id');
  const isInvalidId = !rawId || rawId === 'undefined' || rawId === 'null' || rawId.trim() === '';
  const cleanId = isInvalidId ? null : rawId.trim();

  const [dbBooking, setDbBooking] = useState<any | null>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  // 1. Fetch real saved booking from Prisma SQLite/Postgres Database via /api/bookings/:id
  useEffect(() => {
    if (!cleanId) return;

    // In Portfolio Demo Mode or when booking is already in local session/store,
    // avoid sending an unnecessary HTTP request to Render that results in a 404
    const isDemoBooking = cleanId.startsWith('DEMO-') || IS_PORTFOLIO_DEMO_MODE;
    const isAlreadyInLocalState = myBookings?.some(
      b => b.bookingId === cleanId || (b as any).id === cleanId || (b as any).bookingRef === cleanId
    );

    if (isDemoBooking || isAlreadyInLocalState) {
      return;
    }

    let isMounted = true;
    setIsLoadingDb(true);

    getBookingByIdApi(cleanId)
      .then(data => {
        if (isMounted && data.success && data.booking) {
          setDbBooking(data.booking);
        }
      })
      .catch(err => {
        console.warn('Backend booking lookup fallback to local store:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingDb(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cleanId, myBookings]);

  // Combine DB booking with local fallback
  const booking = useMemo<BookingRecord | any>(() => {
    if (dbBooking) return dbBooking;

    // Try finding by matching ID in user's bookings
    if (cleanId && myBookings && myBookings.length > 0) {
      const match = myBookings.find(b => b.bookingId === cleanId || (b as any).id === cleanId || (b as any).bookingRef === cleanId);
      if (match) return match;
    }

    // Check localStorage fallback ('current_booking' and 'last_booking')
    try {
      const savedLast = localStorage.getItem('current_booking') || localStorage.getItem('last_booking');
      if (savedLast) {
        const parsed = JSON.parse(savedLast);
        if (parsed && typeof parsed === 'object') {
          if (!cleanId || parsed.bookingId === cleanId || parsed.id === cleanId || parsed.bookingRef === cleanId) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Could not parse booking from localStorage', e);
    }

    if (myBookings && myBookings.length > 0) {
      const confirmed = myBookings.filter(b => b.status === 'confirmed');
      if (confirmed.length > 0) return confirmed[0];
      return myBookings[0];
    }

    return null;
  }, [dbBooking, cleanId, myBookings]);

  const [calendarSyncFeedback, setCalendarSyncFeedback] = useState<string | null>(null);

  const handleDownloadIcs = () => {
    if (!booking) return;
    try {
      const seats = seatsList.length > 0 ? seatsList.join(', ') : 'Assigned at Gate';
      let hours = 19;
      let minutes = 30;
      const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
        const meridiem = timeMatch[3]?.toUpperCase();
        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
      }

      const eventDate = new Date();
      if (date && date.includes('-') && !isNaN(Date.parse(date))) {
        const p = new Date(date);
        eventDate.setFullYear(p.getFullYear(), p.getMonth(), p.getDate());
      }
      eventDate.setHours(hours, minutes, 0, 0);
      const endDate = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000);

      const formatIcs = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const startUtc = formatIcs(eventDate);
      const endUtc = formatIcs(endDate);
      const nowUtc = formatIcs(new Date());

      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//CineBook Cinema//Tickets//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:cinebook-${bookingRef}-${Date.now()}@cinebook.in`,
        `DTSTAMP:${nowUtc}`,
        `DTSTART:${startUtc}`,
        `DTEND:${endUtc}`,
        `SUMMARY:🎬 ${movieTitle} (${format})`,
        `DESCRIPTION:Confirmed Movie Booking\\nReference: ${bookingRef}\\nTheatre: ${cinemaName}\\nSeats: ${seats}\\nScreen: ${hall}\\nDate: ${date} at ${time}`,
        `LOCATION:${cinemaName}, ${cinemaAddress}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `CineBook-Ticket-${bookingRef}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setCalendarSyncFeedback('Calendar event (.ics) generated & downloaded! Open to add to Apple/Outlook/Google Calendar.');
      setTimeout(() => setCalendarSyncFeedback(null), 6000);
    } catch (e) {
      console.warn('ICS generation error:', e);
    }
  };

  const handleOpenGoogleCalendar = () => {
    if (!booking) return;
    try {
      const seats = seatsList.length > 0 ? seatsList.join(', ') : 'Assigned at Gate';
      let hours = 19;
      let minutes = 30;
      const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
        const meridiem = timeMatch[3]?.toUpperCase();
        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
      }

      const eventDate = new Date();
      if (date && date.includes('-') && !isNaN(Date.parse(date))) {
        const p = new Date(date);
        eventDate.setFullYear(p.getFullYear(), p.getMonth(), p.getDate());
      }
      eventDate.setHours(hours, minutes, 0, 0);
      const endDate = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000);

      const formatIcs = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const dates = `${formatIcs(eventDate)}/${formatIcs(endDate)}`;

      const title = encodeURIComponent(`🎬 Movie: ${movieTitle} (${format})`);
      const details = encodeURIComponent(
        `Booking Ref: ${bookingRef}\nTheatre: ${cinemaName}\nAuditorium: ${hall}\nSeats: ${seats}\nShowtime: ${date} at ${time}\n\nPresent digital M-Ticket QR at cinema turnstile.`
      );
      const location = encodeURIComponent(`${cinemaName}, ${cinemaAddress}`);

      window.open(
        `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`,
        '_blank',
        'noopener,noreferrer'
      );
    } catch (e) {}
  };

  const handleShareWhatsApp = () => {
    const seats = seatsList.length > 0 ? seatsList.join(', ') : 'Assigned at Gate';
    const directLink = `${window.location.origin}/confirmation?id=${cleanId || bookingRef}`;
    const text = `🍿 *Movie Tickets Confirmed!*\n\n*Movie:* ${movieTitle} (${format})\n*Cinema:* ${cinemaName}\n*Auditorium:* ${hall}\n*Date & Time:* ${date} at ${time}\n*Seats:* ${seats}\n*Booking Ref:* ${bookingRef}\n\n🎟️ *View & Scan M-Ticket Pass:*\n${directLink}\n\nSee you at the movies! 🎬`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  // Gracefully handle missing, undefined, or empty booking
  if (!booking && !isLoadingDb) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50 dark:bg-[#0B0C0E] text-slate-900 dark:text-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-[#1C1F2B] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 shadow-sm">
          <Ticket className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Booking Not Found</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md">
          {cleanId 
            ? `We couldn't locate a confirmed booking record for reference #${cleanId}.` 
            : "No active reservation parameter was provided."}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/my-tickets"
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-colors"
          >
            View My Tickets
          </Link>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1F2B] text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-[#252a3a] transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Safe data extraction
  const movieTitle = booking?.movieTitle || booking?.movie?.title || 'Kalki 2898 AD';
  const cinemaName = booking?.cinemaName || 'PVR ICON: Phoenix Palladium, Lower Parel';
  const cinemaAddress = booking?.cinemaAddress || '462, Senapati Bapat Marg, Lower Parel, Mumbai';
  const format = booking?.format || 'IMAX Laser 3D';
  const date = booking?.date || 'Today';
  const time = booking?.time || '07:30 PM';
  const hall = booking?.hall || 'Audi 1 - IMAX Laser 3D';
  const seatsList = (booking?.seats || []).map((s: any) => (typeof s === 'string' ? s : s?.id || ''));
  const bookingRef = booking?.bookingRef || booking?.bookingId || booking?.id || 'BMS-849204-KL';
  const isCheckedIn = booking?.status === 'checked_in' || booking?.checkedIn;
  const isDemoBooking = Boolean(
    IS_PORTFOLIO_DEMO_MODE ||
    booking?.isDemoBooking ||
    (typeof bookingRef === 'string' && bookingRef.startsWith('DEMO-'))
  );

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-[#08090B] text-[#F3F0E8] ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Success Header (Hidden during print) */}
        <div className="text-center space-y-2 no-print">
          <div className="inline-flex p-3 rounded-full bg-[#C7A675]/15 text-[#C7A675] border border-[#C7A675]/30 mb-2">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#F3F0E8] flex items-center justify-center gap-2">
            <span>{isDemoBooking ? 'Demo Booking Confirmed!' : 'Booking Confirmed & Secured!'}</span>
            {isCheckedIn ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white font-mono">
                CHECKED IN
              </span>
            ) : isDemoBooking ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C7A675]/20 text-[#DFC49D] border border-[#C7A675]/40 font-mono">
                PORTFOLIO DEMO
              </span>
            ) : null}
          </h1>
          <p className="text-sm text-[#A8ADB4] max-w-md mx-auto">
            {isDemoBooking
              ? 'Portfolio Demo — No real tickets or payments are issued. Your simulated VIP pass is rendered below with sample scannable M-ticket.'
              : 'Your M-Ticket pass is active in cinema records. Present the QR code below at the cinema turnstile.'}
          </p>
        </div>

        {/* Portfolio Demo Notice Card */}
        {isDemoBooking && (
          <div className="p-4 rounded-2xl bg-[#C7A675]/10 border border-[#C7A675]/30 text-center space-y-1 no-print shadow-lg shadow-[#C7A675]/5">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#DFC49D] font-mono uppercase tracking-wider">
              <span>★ PORTFOLIO DEMONSTRATION MODE ★</span>
            </div>
            <p className="text-xs text-[#A8ADB4] max-w-lg mx-auto">
              {DEMO_NOTICE_TEXT} This simulated booking is stored locally in your browser and did not mutate any real database seats or create real financial charges.
            </p>
          </div>
        )}

        {/* PREMIUM HOLOGRAPHIC DIGITAL TICKET */}
        <HolographicTicket booking={booking} id="printable-ticket" />

        {/* ACTION BUTTONS TOOLBAR (Hidden during print) */}
        <div className="space-y-4 no-print">
          {calendarSyncFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 text-center animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{calendarSyncFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Add to Calendar (ICS + Google Calendar) */}
            <div className="flex flex-col">
              <button
                onClick={handleDownloadIcs}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm bg-[#15171B] hover:bg-[#1B1E24] text-[#F3F0E8] border border-white/10 hover:border-[#C7A675]/50 shadow-lg transition-all cursor-pointer active:scale-98"
              >
                <Calendar className="w-4 h-4 text-[#C7A675]" />
                <span>Add to Calendar (.ics)</span>
              </button>
              <div className="pt-1.5 text-center">
                <button
                  onClick={handleOpenGoogleCalendar}
                  className="text-[11px] text-[#C7A675] hover:text-[#DFC49D] underline font-medium cursor-pointer"
                >
                  or sync via Google Calendar ↗
                </button>
              </div>
            </div>

            {/* 2. Share Tickets via WhatsApp */}
            <div className="flex flex-col">
              <button
                onClick={handleShareWhatsApp}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer active:scale-98"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </button>
              <p className="text-[11px] text-[#A8ADB4] text-center pt-1.5">
                Send tickets & link to companions
              </p>
            </div>

            {/* 3. Download PDF Pass */}
            <div className="flex flex-col">
              <button
                onClick={handleDownloadPdf}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm bg-[#C7A675] hover:bg-[#DFC49D] text-[#08090B] shadow-lg shadow-[#C7A675]/30 transition-all cursor-pointer active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Pass</span>
              </button>
              <p className="text-[11px] text-[#A8ADB4] text-center pt-1.5">
                Clean 1-page pass with QR code
              </p>
            </div>
          </div>

          {/* Secondary Navigation Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={`/scanner?ref=${bookingRef}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-[#C7A675]/15 text-[#DFC49D] border border-[#C7A675]/40 hover:bg-[#C7A675]/25 transition-colors cursor-pointer font-mono"
            >
              <Scan className="w-3.5 h-3.5 text-[#C7A675]" />
              <span>Simulate Gatekeeper Scanner</span>
            </Link>

            <Link
              to="/my-tickets"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs border border-white/10 bg-[#15171B] hover:bg-[#1B1E24] text-[#A8ADB4] hover:text-[#F3F0E8] transition-colors"
            >
              <Ticket className="w-3.5 h-3.5 text-[#C7A675]" />
              <span>View All My Tickets</span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs border border-white/10 bg-[#15171B] hover:bg-[#1B1E24] text-[#A8ADB4] hover:text-[#F3F0E8] transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[#C7A675]" />
              <span>Book Another Movie</span>
            </Link>
          </div>
        </div>

        {/* Dedicated Print Stylesheet for Pristine 1-Page PDF Pass */}
        <style>{`
          @media print {
            body, html {
              background: #FFFFFF !important;
              color: #000000 !important;
            }
            .no-print, header, nav, footer {
              display: none !important;
            }
            #printable-ticket {
              border: 1px solid #CBD5E1 !important;
              background: #FFFFFF !important;
              color: #0F172A !important;
              box-shadow: none !important;
              max-width: 100% !important;
              margin: 0 !important;
              page-break-inside: avoid;
            }
            #printable-ticket * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #printable-ticket .bg-\\[\\#14161F\\],
            #printable-ticket .bg-\\[\\#1C1F2B\\],
            #printable-ticket .bg-\\[\\#0E1017\\] {
              background-color: #F8FAFC !important;
              border-color: #E2E8F0 !important;
            }
            #printable-ticket .text-white {
              color: #0F172A !important;
            }
            #printable-ticket .text-slate-100,
            #printable-ticket .text-slate-200,
            #printable-ticket .text-slate-300,
            #printable-ticket .text-slate-400 {
              color: #475569 !important;
            }
          }
        `}</style>

      </div>
    </div>
  );
};

export const ConfirmationPage: React.FC = () => {
  return (
    <ConfirmationErrorBoundary>
      <ConfirmationContent />
    </ConfirmationErrorBoundary>
  );
};

export default ConfirmationPage;
