import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  RotateCw,
  QrCode,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Info,
  Popcorn
} from 'lucide-react';
import QRCode from 'qrcode';
import { useTranslation } from '../context/LanguageContext';
import { IS_PORTFOLIO_DEMO_MODE, DEMO_TICKET_WATERMARK } from '../config/demoMode';

export interface HolographicTicketProps {
  booking: any;
  moviePoster?: string;
  className?: string;
  id?: string;
  onFlipChange?: (isFlipped: boolean) => void;
}

export const HolographicTicket: React.FC<HolographicTicketProps> = ({
  booking,
  moviePoster: customPoster,
  className = '',
  id = 'printable-ticket',
  onFlipChange,
}) => {
  const { formatPrice, formatTime, isRTL } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleFlip = (nextFlipped: boolean) => {
    setIsFlipped(nextFlipped);
    if (onFlipChange) onFlipChange(nextFlipped);
  };

  // Safe data extraction
  const bookingRef = booking?.bookingRef || booking?.bookingId || booking?.id || 'BMS-849204-KL';
  const movieTitle = booking?.movieTitle || booking?.movie?.title || 'Featured Film';
  const moviePoster =
    customPoster ||
    booking?.moviePoster ||
    booking?.movie?.posterUrl ||
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800';
  const movieDuration = booking?.movieDuration || '2h 30m';
  const movieAgeRating = booking?.movieAgeRating || 'UA';
  const cinemaName = booking?.cinemaName || 'PVR INOX Grand Cinemas';
  const cinemaAddress = booking?.cinemaAddress || 'Central City Mall';
  const format = booking?.format || 'IMAX Laser 3D';
  const date = booking?.date || 'Today';
  const time = booking?.time || '07:30 PM';
  const hall = booking?.hall || 'Auditorium 1';
  const seatsList = (booking?.seats || []).map((s: any) => (typeof s === 'string' ? s : s?.id || ''));
  const customerName = booking?.customer?.name || booking?.customerName || 'Moviegoer';
  const customerEmail = booking?.customer?.email || booking?.customerEmail || '';
  const totalAmount = booking?.totalAmount ?? booking?.subtotal ?? 0;
  const isCheckedIn = booking?.status === 'checked_in' || booking?.checkedIn;
  const isCancelled = booking?.status === 'cancelled';
  const isExpired = booking?.status === 'expired';

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

  const isDemo = Boolean(
    IS_PORTFOLIO_DEMO_MODE ||
    booking?.isDemoBooking ||
    (typeof bookingRef === 'string' && bookingRef.startsWith('DEMO-'))
  );

  // Generate real scannable QR Code using qrcode (isolated demo payload in demo mode)
  useEffect(() => {
    if (!booking) return;

    const payload = isDemo
      ? JSON.stringify({
          type: 'CINEBOOK_PORTFOLIO_DEMO',
          notice: DEMO_TICKET_WATERMARK,
          ref: bookingRef,
          movie: movieTitle,
          seats: seatsList.join(', '),
          validForEntry: false,
          generatedAt: new Date().toISOString()
        })
      : (booking.qrCodeData ||
         booking.qrToken ||
         JSON.stringify({
           ref: bookingRef,
           id: booking.id || booking.bookingId,
           movie: movieTitle,
           seats: seatsList.join(', '),
           date: date,
           time: time,
         }));

    QRCode.toDataURL(typeof payload === 'string' ? payload : JSON.stringify(payload), {
      width: 240,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.warn('QR code generation error:', err));
  }, [booking, bookingRef, movieTitle, seatsList, date, time, isDemo]);

  /* --------------------------------------------------------------------------
     TICKET FRONT VIEW COMPONENT
     -------------------------------------------------------------------------- */
  const renderFrontFace = (isAbsolute: boolean = false) => (
    <div
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button, a, input')) return;
        handleFlip(!isFlipped);
      }}
      role="button"
      tabIndex={0}
      data-cursor="FLIP"
      title="Click or tap ticket to flip and view QR gatepass"
      aria-label="Movie admission ticket pass. Click or tap ticket to flip and view QR gatepass."
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if ((e.target as HTMLElement).closest('button, a, input')) return;
          e.preventDefault();
          handleFlip(!isFlipped);
        }
      }}
      className={`w-full rounded-3xl border border-[#C7A675]/30 holographic-card text-[#F3F0E8] shadow-2xl overflow-hidden flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A675] ${
        isAbsolute ? 'absolute inset-0' : 'relative'
      } ${isFlipped && !prefersReducedMotion ? 'pointer-events-none' : 'pointer-events-auto'}`}
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        touchAction: 'pan-y',
      }}
    >
      {/* Holographic Sheen Layer */}
      <div className="holographic-sheen absolute inset-0 pointer-events-none" />

      {/* Top Brand Banner with Metallic Foil Trim */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1B1E24] via-[#15171B] to-[#08090B] border-b border-[#C7A675]/30 text-[#F3F0E8] flex flex-wrap items-center justify-between gap-3 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#C7A675]/10 border border-[#C7A675]/30 text-[#C7A675] flex items-center justify-center shadow-lg backdrop-blur-md">
            <Film className="w-5 h-5 text-[#C7A675]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold font-display text-lg sm:text-xl tracking-widest text-[#F3F0E8]">
                CINEBOOK
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#C7A675]/20 text-[#DFC49D] border border-[#C7A675]/40 font-mono">
                M-PASS
              </span>
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#A8ADB4]">
              Verified Electronic Admission
            </div>
          </div>
        </div>

        {/* Status Pill Badge */}
        <div className="flex items-center gap-2">
          {isDemo ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#C7A675]/20 text-[#DFC49D] border border-[#C7A675]/50 flex items-center gap-1.5 shadow-sm font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C7A675]" /> DEMO PASS
            </span>
          ) : isCheckedIn ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/25">
              <CheckCircle2 className="w-3.5 h-3.5" /> ADMITTED
            </span>
          ) : isCancelled ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-rose-500 text-white flex items-center gap-1.5 shadow-md shadow-rose-500/25">
              <AlertCircle className="w-3.5 h-3.5" /> CANCELLED
            </span>
          ) : isExpired ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-slate-600 text-white">
              EXPIRED
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#C7A675]/15 text-[#C7A675] border border-[#C7A675]/40 flex items-center gap-1.5 shadow-sm font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C7A675]" /> CONFIRMED
            </span>
          )}
        </div>
      </div>

      {/* Ticket Front Body */}
      <div className="p-5 sm:p-7 space-y-4 sm:space-y-5 relative bg-[#0D0E12] overflow-hidden">
        {/* Luxury Watermark for Demo Mode */}
        {isDemo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 opacity-[0.07] rotate-[-22deg]">
            <div className="border-4 border-dashed border-[#C7A675] rounded-3xl px-8 py-3 text-center">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-[#DFC49D] uppercase block">
                PORTFOLIO DEMO
              </span>
              <span className="text-xs font-bold tracking-widest text-[#C7A675] uppercase block mt-1">
                NOT VALID FOR ENTRY
              </span>
            </div>
          </div>
        )}
        {/* Movie Details Header */}
        <div className="flex gap-4 sm:gap-6 items-start">
          <img
            src={moviePoster}
            alt={movieTitle}
            className="w-20 sm:w-24 aspect-[2/3] rounded-2xl object-cover shadow-xl bg-black/50 shrink-0 border border-[#C7A675]/30"
          />

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C7A675] text-[#08090B] shadow-sm font-mono">
                {format}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#15171B] border border-white/10 text-[#A8ADB4]">
                {movieAgeRating}
              </span>
              <span className="text-[11px] text-[#A8ADB4]">{movieDuration}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[#F3F0E8] truncate">
              {movieTitle}
            </h3>

            <div className="text-xs text-[#A8ADB4] flex items-center gap-1.5 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#C7A675] shrink-0" />
              <span className="font-semibold text-[#F3F0E8] truncate">{cinemaName}</span>
            </div>
            {cinemaAddress && (
              <div className="text-[11px] text-[#71767F] pl-5 truncate">
                {cinemaAddress}
              </div>
            )}
          </div>
        </div>

        {/* Realistic Ticket Perforation Tear-Line */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="ticket-notch-left" />
          <div className="border-t-2 border-dashed border-[#C7A675]/30 w-full" />
          <div className="ticket-notch-right" />
          <span className="absolute px-3 bg-[#08090B] text-[9px] font-mono tracking-widest uppercase text-[#DFC49D] font-bold border border-[#C7A675]/30 rounded-full">
            ★ OFFICIAL ELECTRONIC STUB ★
          </span>
        </div>

        {/* Session Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-[#15171B] border border-white/10 text-xs">
          <div>
            <span className="text-[#A8ADB4] block text-[10px] uppercase font-bold tracking-wider font-mono">
              Date
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#F3F0E8] mt-0.5 block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C7A675]" /> {date}
            </span>
          </div>
          <div>
            <span className="text-[#A8ADB4] block text-[10px] uppercase font-bold tracking-wider font-mono">
              Showtime
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#DFC49D] font-mono mt-0.5 block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C7A675]" /> {formatTime(time)}
            </span>
          </div>
          <div>
            <span className="text-[#A8ADB4] block text-[10px] uppercase font-bold tracking-wider font-mono">
              Auditorium
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#F3F0E8] mt-0.5 block truncate">
              {hall}
            </span>
          </div>
          <div>
            <span className="text-[#A8ADB4] block text-[10px] uppercase font-bold tracking-wider font-mono">
              Seats
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-[#C7A675] mt-0.5 block truncate">
              {seatsList.length > 0 ? seatsList.join(', ') : 'Assigned at Gate'}
            </span>
          </div>
        </div>

        {/* Refreshments / F&B items if any */}
        {addonsList.length > 0 && (
          <div className="p-3 rounded-2xl bg-[#15171B] border border-white/10 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[#F3F0E8] font-bold text-[11px]">
              <div className="flex items-center gap-1.5">
                <Popcorn className="w-3.5 h-3.5 text-[#C7A675]" />
                <span>Concessions & Refreshments ({addonsList.length} items)</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {addonsList.map((item: any, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-[#08090B] border border-white/5 text-[10px] text-[#A8ADB4]"
                >
                  {item.quantity || 1}x {item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Holographic Verification Seal & Reference Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C7A675] via-[#DFC49D] to-[#C7A675] flex items-center justify-center shadow-lg text-[#08090B] font-bold shrink-0">
              <Sparkles className="w-5 h-5 text-[#08090B]" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#A8ADB4]">
                Booking Reference
              </div>
              <div className="text-sm font-mono font-bold text-[#C7A675] tracking-wider">
                #{bookingRef}
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#A8ADB4]">
              Total Amount Paid
            </div>
            <div className="text-lg font-bold font-mono text-[#C7A675]">
              {formatPrice(totalAmount)}
            </div>
          </div>
        </div>

        {/* Front Action Bar: Flip to Back (QR Code) Button */}
        <div className="pt-2 no-print">
          <button
            type="button"
            data-cursor="QR PASS"
            onClick={() => handleFlip(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#C7A675] hover:bg-[#DFC49D] text-[#08090B] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C7A675]/25 transition-all cursor-pointer active:scale-98 btn-tactile"
          >
            <QrCode className="w-4 h-4" />
            <span>Flip to View Scannable Gate QR Pass ↻</span>
          </button>
        </div>
      </div>

      {/* Front Footer */}
      <div className="px-6 py-3 bg-[#08090B] border-t border-[#C7A675]/20 text-[11px] text-[#A8ADB4] flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[#C7A675] font-semibold font-mono text-[10px]">
          <RotateCw className="w-3 h-3 animate-pulse" />
          <span>Tap pass to view QR gatepass ↺</span>
        </span>
        <span className="font-mono text-[10px] text-[#71767F]">
          Holder: {customerName}{customerEmail ? ` (${customerEmail})` : ''}
        </span>
      </div>
    </div>
  );

  /* --------------------------------------------------------------------------
     TICKET BACK VIEW COMPONENT (QR Code & Gatepass)
     -------------------------------------------------------------------------- */
  const renderBackFace = (isAbsolute: boolean = false) => (
    <div
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button, a, input')) return;
        handleFlip(false);
      }}
      role="button"
      tabIndex={0}
      data-cursor="FLIP"
      title="Click or tap to flip back to ticket front"
      aria-label="QR Code gatepass. Click or tap to flip back to ticket front."
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if ((e.target as HTMLElement).closest('button, a, input')) return;
          e.preventDefault();
          handleFlip(false);
        }
      }}
      className={`w-full rounded-3xl border border-[#C7A675]/30 holographic-card text-[#F3F0E8] shadow-2xl overflow-hidden flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A675] ${
        !isFlipped && !prefersReducedMotion ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{
        position: isAbsolute ? 'absolute' : 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: isAbsolute ? 'rotateY(180deg)' : 'none',
        touchAction: 'pan-y',
      }}
    >
      {/* Holographic Sheen Layer */}
      <div className="holographic-sheen absolute inset-0 pointer-events-none" />

      {/* Back Header Banner */}
      <div className="p-5 bg-gradient-to-r from-[#1B1E24] via-[#15171B] to-[#08090B] border-b border-[#C7A675]/30 text-[#F3F0E8] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#C7A675]" />
          <div>
            <span className="font-bold font-display text-base tracking-widest text-[#F3F0E8] block">
              OPTICAL GATEWAY PASS
            </span>
            <span className="text-[10px] text-[#DFC49D] font-mono">
              Ref: #{bookingRef}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleFlip(false)}
          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#F3F0E8] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Show Front ↺</span>
        </button>
      </div>

      {/* Back Body */}
      <div className="p-5 sm:p-7 space-y-4 relative flex flex-col items-center text-center bg-[#0D0E12]">
        {/* Portfolio Demo Notice Banner */}
        {isDemo && (
          <div className="w-full p-2.5 rounded-xl bg-[#C7A675]/15 border border-[#C7A675]/40 text-center space-y-0.5">
            <span className="text-[11px] font-mono font-bold text-[#DFC49D] uppercase tracking-wider block">
              DEMO — NOT VALID FOR ENTRY
            </span>
            <span className="text-[10px] text-[#A8ADB4] block">
              Sample QR pass for portfolio demonstration only. No real admission granted.
            </span>
          </div>
        )}

        {/* Real High-Contrast Scannable QR Code */}
        <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-[#C7A675]/30 shrink-0">
          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt={`Scannable QR Pass for Booking ${bookingRef}`}
              className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
            />
          ) : (
            <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center text-slate-900">
              <QrCode className="w-16 h-16 animate-pulse text-[#C7A675]" />
            </div>
          )}
        </div>

        {/* Barcode Simulation & Reference */}
        <div className="space-y-1">
          <div className="flex items-end justify-center gap-1 h-7 px-3 bg-black/60 py-1 rounded-lg border border-[#C7A675]/30">
            {[4, 2, 5, 1, 3, 6, 2, 4, 1, 5, 3, 2, 6, 1, 4, 3, 5, 2].map((height, i) => (
              <div
                key={i}
                className="bg-[#C7A675] w-1 rounded-sm"
                style={{ height: `${height * 3 + 4}px` }}
              />
            ))}
          </div>
          <div className="font-mono text-xs font-bold tracking-widest text-[#DFC49D]">
            *{bookingRef}*
          </div>
        </div>

        {/* Admission Instructions Card */}
        <div className="w-full p-3.5 rounded-2xl bg-[#15171B] border border-white/10 text-left space-y-1.5 text-xs">
          <div className="font-bold text-[#F3F0E8] flex items-center gap-1.5 text-[11px]">
            <Info className="w-3.5 h-3.5 text-[#C7A675] shrink-0" />
            <span>Gate Admission Instructions</span>
          </div>
          <ul className="text-[11px] text-[#A8ADB4] space-y-1 list-disc list-inside leading-relaxed">
            <li>Present this screen at full brightness to the optical turnstile reader.</li>
            <li>Reserved Seats: <strong className="text-[#C7A675] font-mono">{seatsList.join(', ') || 'Assigned'}</strong> in {hall}.</li>
            <li>Replay-prevention encryption active: One valid scan per patron.</li>
          </ul>
        </div>

        {/* Cancellation Policy Summary */}
        <div className="w-full p-3 rounded-2xl bg-[#08090B] border border-white/5 text-left text-[11px] text-[#A8ADB4]">
          <span className="font-bold text-[#F3F0E8] block mb-0.5">Cancellation Policy:</span>
          Cancellations eligible up to showtime for a 90% simulated refund (10% demo processing fee).
        </div>

        {/* Scanner simulator button */}
        <div className="w-full flex items-center justify-between gap-3 pt-1 no-print">
          <Link
            to={`/scanner?ref=${bookingRef}`}
            data-cursor="SCAN"
            className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-[#C7A675]/15 hover:bg-[#C7A675]/25 border border-[#C7A675]/40 text-[#DFC49D] text-xs font-bold transition-all flex items-center justify-center gap-1.5 font-mono btn-tactile"
          >
            <span>Open Gate Scanner</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            type="button"
            data-cursor="FRONT"
            onClick={() => handleFlip(false)}
            className="min-h-[44px] py-2.5 px-4 rounded-xl border border-white/10 bg-[#15171B] hover:bg-[#1B1E24] text-[#F3F0E8] text-xs font-bold transition-all cursor-pointer flex items-center justify-center btn-tactile"
          >
            Flip to Front ↺
          </button>
        </div>
      </div>

      {/* Back Footer */}
      <div className="px-6 py-3 bg-[#08090B] border-t border-[#C7A675]/20 text-[11px] text-[#A8ADB4] flex items-center justify-between">
        <span>{isDemo ? 'CineBook Portfolio Demo Protocol' : 'CineBook Gate Protocol 1.0'}</span>
        <span className="text-[#C7A675] font-semibold font-mono">
          {isDemo ? 'DEMO PASS (SAMPLE)' : 'Active & Scannable'}
        </span>
      </div>
    </div>
  );

  return (
    <div className={`space-y-3 ${className} ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* View Switcher Controls (Header Pill) */}
      <div className="flex items-center justify-between px-1 no-print">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#15171B] border border-white/10 text-xs shadow-inner">
          <button
            type="button"
            onClick={() => handleFlip(false)}
            className={`min-h-[44px] px-3.5 py-2 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              !isFlipped
                ? 'bg-[#C7A675] text-[#08090B] shadow-md shadow-[#C7A675]/30'
                : 'text-[#A8ADB4] hover:text-[#F3F0E8]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Front Pass</span>
          </button>
          <button
            type="button"
            onClick={() => handleFlip(true)}
            className={`min-h-[44px] px-3.5 py-2 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              isFlipped
                ? 'bg-[#C7A675] text-[#08090B] shadow-md shadow-[#C7A675]/30'
                : 'text-[#A8ADB4] hover:text-[#F3F0E8]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Back (QR Gatepass)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleFlip(!isFlipped)}
          aria-label={isFlipped ? 'Flip back to movie details' : 'Flip to view QR code gatepass'}
          className="min-h-[44px] flex items-center gap-1.5 text-xs font-semibold text-[#C7A675] hover:text-[#DFC49D] transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-white/5"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isFlipped ? 'Show Front' : 'Flip Ticket ↻'}</span>
        </button>
      </div>

      {/* Ticket Container */}
      <div id={id} className="w-full">
        {prefersReducedMotion ? (
          /* Non-animated alternative for reduced motion users */
          <div className="w-full">
            {isFlipped ? renderBackFace(false) : renderFrontFace(false)}
          </div>
        ) : (
          /* Lightweight Hardware-Accelerated 3D Flip Card */
          <div className="w-full [perspective:1200px]">
            <div
              className="w-full relative [transform-style:preserve-3d] transition-transform duration-600 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front Face sits in normal flow to drive container height */}
              {renderFrontFace(false)}

              {/* Back Face is positioned absolute and rotated 180deg */}
              {renderBackFace(true)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolographicTicket;
