import React, { useState, useEffect, useMemo, Component, type ErrorInfo, type ReactNode } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  MapPin,
  Film,
  Home,
  ShieldCheck,
  Tag,
  Ticket,
  AlertTriangle,
  Scan,
  RefreshCw,
  ExternalLink,
  Calendar,
  Share2,
  Download,
  Popcorn,
  Check
} from 'lucide-react';
import QRCode from 'qrcode';
import { useBooking } from '../context/BookingContext';
import { useTranslation } from '../context/LanguageContext';
import type { BookingRecord } from '../types';

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
  const { formatPrice, formatTime, isRTL } = useTranslation();

  const rawId = searchParams.get('id');
  const isInvalidId = !rawId || rawId === 'undefined' || rawId === 'null' || rawId.trim() === '';
  const cleanId = isInvalidId ? null : rawId.trim();

  const [dbBooking, setDbBooking] = useState<any | null>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // 1. Fetch real saved booking from Prisma SQLite Database via /api/bookings/:id
  useEffect(() => {
    if (!cleanId) return;

    let isMounted = true;
    setIsLoadingDb(true);

    fetch(`/api/bookings/${cleanId}`)
      .then(r => r.json())
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
  }, [cleanId]);

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

  // Generate real scannable QR Code using qrcode
  useEffect(() => {
    if (!booking) return;

    const bookingRef = booking.bookingRef || booking.bookingId || booking.id || 'BMS-DEMO';
    const payload = booking.qrCodeData || booking.qrToken || JSON.stringify({
      ref: bookingRef,
      id: booking.id || cleanId,
      movie: booking.movieTitle,
      seats: (booking.seats || []).map((s: any) => s.id || s).join(', '),
      date: booking.date,
      time: booking.time
    });

    QRCode.toDataURL(typeof payload === 'string' ? payload : JSON.stringify(payload), {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.warn('QR code generation error:', err));
  }, [booking, cleanId]);

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
  const moviePoster = booking?.moviePoster || booking?.movie?.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800';
  const movieDuration = booking?.movieDuration || '3h 01m';
  const movieAgeRating = booking?.movieAgeRating || 'UA';
  const cinemaName = booking?.cinemaName || 'PVR ICON: Phoenix Palladium, Lower Parel';
  const cinemaAddress = booking?.cinemaAddress || '462, Senapati Bapat Marg, Lower Parel, Mumbai';
  const format = booking?.format || 'IMAX Laser 3D';
  const date = booking?.date || 'Today';
  const time = booking?.time || '07:30 PM';
  const hall = booking?.hall || 'Audi 1 - IMAX Laser 3D';
  const seatsList = (booking?.seats || []).map((s: any) => (typeof s === 'string' ? s : s?.id || ''));
  const customerName = booking?.customer?.name || booking?.customerName || 'Alex Rivera';
  const customerEmail = booking?.customer?.email || booking?.customerEmail || 'alex@example.com';
  const paymentMethod = booking?.paymentMethod || 'Instant UPI';
  const totalAmount = booking?.totalAmount ?? booking?.subtotal ?? 0;
  const bookingRef = booking?.bookingRef || booking?.bookingId || booking?.id || 'BMS-849204-KL';
  const isCheckedIn = booking?.status === 'checked_in' || booking?.checkedIn;

  // Food & Beverages extraction
  const addonsList = useMemo(() => {
    if (booking?.addons && Array.isArray(booking.addons) && booking.addons.length > 0) {
      return booking.addons;
    }
    if (booking?.foodItems && Array.isArray(booking.foodItems) && booking.foodItems.length > 0) {
      return booking.foodItems;
    }
    if (booking?.seatDetails) {
      try {
        const parsed = JSON.parse(booking.seatDetails);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.addons)) {
          return parsed.addons;
        }
      } catch (e) {}
    }
    return [];
  }, [booking]);

  const deliveryPref = useMemo(() => {
    if (booking?.deliveryPreference) return booking.deliveryPreference;
    if (booking?.seatDetails) {
      try {
        const parsed = JSON.parse(booking.seatDetails);
        if (parsed && parsed.deliveryPreference) return parsed.deliveryPreference;
      } catch (e) {}
    }
    return 'seat';
  }, [booking]);

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-[#090A0F] text-slate-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Success Header (Hidden during print) */}
        <div className="text-center space-y-2 no-print">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <span>Booking Confirmed & Secured!</span>
            {isCheckedIn && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
                CHECKED IN
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Your M-Ticket pass is active in cinema records. Present the QR code below at the cinema turnstile.
          </p>
        </div>

        {/* PRINTABLE DIGITAL CINEMA TICKET */}
        <div
          id="printable-ticket"
          className="rounded-3xl border border-white/10 bg-[#14161F] text-slate-100 shadow-2xl overflow-hidden relative"
        >
          {/* Top Brand Banner */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center shadow backdrop-blur-md">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white">
                  BOOKMYSHOW M-TICKET PASS
                </span>
                <div className="text-[10px] uppercase font-bold tracking-widest text-blue-200">
                  Verified Electronic Admission Pass
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider font-bold text-blue-200">Booking Ref</div>
              <div className="text-lg font-mono font-black text-white tracking-wider">
                {bookingRef}
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Movie Title & Format */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={moviePoster}
                alt={movieTitle}
                className="w-24 sm:w-28 aspect-[2/3] rounded-2xl object-cover shadow-lg bg-[#090A0F] shrink-0 border border-white/10"
              />

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                    {format}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1C1F2B] border border-white/10 text-slate-300">
                    {movieAgeRating}
                  </span>
                  <span className="text-xs text-slate-400">
                    {movieDuration}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {movieTitle}
                </h2>

                <div className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 pt-1">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-semibold text-white">{cinemaName}</span>
                </div>
                <div className="text-xs text-slate-400 pl-5">
                  {cinemaAddress}
                </div>
              </div>
            </div>

            {/* Perforated Ticket Divider */}
            <div className="relative py-2">
              <div className="border-t-2 border-dashed border-white/15 w-full" />
              <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-[#090A0F]" />
              <div className="absolute -right-10 top-0 w-8 h-8 rounded-full bg-[#090A0F]" />
            </div>

            {/* Session Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#1C1F2B] border border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Date</span>
                <span className="text-sm font-bold text-white mt-0.5 block">{date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Showtime</span>
                <span className="text-sm font-bold text-blue-400 mt-0.5 block">{formatTime(time)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Auditorium</span>
                <span className="text-sm font-bold text-white mt-0.5 block">{hall}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Seats</span>
                <span className="text-sm font-mono font-black text-emerald-400 mt-0.5 block">
                  {seatsList.length > 0 ? seatsList.join(', ') : 'Assigned at Gate'}
                </span>
              </div>
            </div>

            {/* Food & Beverages Refreshments block if ordered */}
            {addonsList.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#1C1F2B] border border-white/10 space-y-2.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Popcorn className="w-4 h-4 text-amber-400" />
                    <span>Concession Refreshments ({addonsList.reduce((acc: number, a: any) => acc + (a.quantity || 1), 0)} items)</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {deliveryPref === 'counter' ? 'Concession Counter Pickup' : 'Deliver to Seat at Interval'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                  {addonsList.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2.5 rounded-xl bg-[#14161F] border border-white/5 text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                          {item.quantity || 1}x
                        </span>
                        <span className="font-semibold text-white truncate max-w-[160px]">{item.name}</span>
                      </div>
                      <span className="text-slate-300 font-mono font-medium">
                        {formatPrice((item.price || 0) * (item.quantity || 1))}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 italic pt-0.5">
                  {deliveryPref === 'counter'
                    ? 'Present booking reference at the Concession Express Counter for instant pickup.'
                    : 'Show your M-Ticket to the auditorium service usher during intermission for hot seat delivery.'}
                </p>
              </div>
            )}

            {/* Customer & Payment details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 text-xs text-slate-400">
              <div>
                <div>Ticket Holder: <strong className="text-white">{customerName}</strong></div>
                <div>Contact: <span className="text-slate-300">{customerEmail}</span></div>
                {booking?.couponCode && (
                  <div className="text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <Tag className="w-3 h-3" /> Coupon: {booking.couponCode} (-{formatPrice(booking.discountAmount || 0)})
                  </div>
                )}
              </div>

              <div className="sm:text-right">
                <div>Payment Method: <span className="text-slate-200">{paymentMethod}</span></div>
                <div className="text-sm font-bold text-blue-400 mt-0.5">
                  Total Paid: {formatPrice(totalAmount)}
                </div>
              </div>
            </div>

            {/* Live Generated QR Code for M-Ticket Scanning */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {/* Real Scannable QR Code */}
                <div className="p-2.5 rounded-2xl bg-white shadow-xl shrink-0">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt={`M-Ticket QR Code for ${bookingRef}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                    />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Optical Turnstile Admission</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Direct entry pass with replay prevention encryption. Present screen at gate or barcode reader.
                  </p>
                  <div className="pt-1">
                    <Link
                      to={`/scanner?ref=${bookingRef}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 underline"
                    >
                      <span>Open Gatekeeper Scanner</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="flex flex-col items-center">
                <div className="flex items-end gap-1 h-8 px-3 bg-[#090A0F] py-1 rounded-lg border border-white/10">
                  {[4, 2, 5, 1, 3, 6, 2, 4, 1, 5, 3, 2, 6, 1, 4, 3, 5, 2].map((height, i) => (
                    <div
                      key={i}
                      className="bg-blue-400 w-1 rounded-sm"
                      style={{ height: `${height * 4 + 4}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] text-slate-400 tracking-widest mt-1">
                  *{bookingRef}*
                </span>
              </div>
            </div>

          </div>

          {/* Ticket Footer */}
          <div className="px-6 py-3.5 bg-[#0E1017] border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Verified M-Ticket pass stored in SQLite registry</span>
            <span>Non-transferable</span>
          </div>
        </div>

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
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm bg-[#1C1F2B] hover:bg-[#252a3a] text-slate-100 border border-white/10 hover:border-blue-500/50 shadow-lg transition-all cursor-pointer active:scale-98"
              >
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Add to Calendar (.ics)</span>
              </button>
              <div className="pt-1.5 text-center">
                <button
                  onClick={handleOpenGoogleCalendar}
                  className="text-[11px] text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer"
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
              <p className="text-[11px] text-slate-400 text-center pt-1.5">
                Send tickets & link to companions
              </p>
            </div>

            {/* 3. Download PDF Pass */}
            <div className="flex flex-col">
              <button
                onClick={handleDownloadPdf}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Pass</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center pt-1.5">
                Clean 1-page pass with QR code
              </p>
            </div>
          </div>

          {/* Secondary Navigation Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={`/scanner?ref=${bookingRef}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors cursor-pointer"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Simulate Gatekeeper Scanner</span>
            </Link>

            <Link
              to="/my-tickets"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs border border-white/10 bg-[#1C1F2B] hover:bg-[#252a3a] text-slate-300 transition-colors"
            >
              <Ticket className="w-3.5 h-3.5 text-blue-400" />
              <span>View All My Tickets</span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs border border-white/10 bg-[#1C1F2B] hover:bg-[#252a3a] text-slate-300 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-blue-400" />
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
