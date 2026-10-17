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

  // Generate real scannable QR Code using qrcode
  useEffect(() => {
    if (!booking) return;

    const payload =
      booking.qrCodeData ||
      booking.qrToken ||
      JSON.stringify({
        ref: bookingRef,
        id: booking.id || booking.bookingId,
        movie: movieTitle,
        seats: seatsList.join(', '),
        date: date,
        time: time,
      });

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
  }, [booking, bookingRef, movieTitle, seatsList, date, time]);

  /* --------------------------------------------------------------------------
     TICKET FRONT VIEW COMPONENT
     -------------------------------------------------------------------------- */
  const renderFrontFace = (isAbsolute: boolean = false) => (
    <div
      className={`w-full rounded-3xl border border-white/12 holographic-card text-slate-100 shadow-2xl overflow-hidden flex flex-col justify-between ${
        isAbsolute ? 'absolute inset-0' : 'relative'
      } ${isFlipped && !prefersReducedMotion ? 'pointer-events-none' : 'pointer-events-auto'}`}
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {/* Holographic Sheen Layer */}
      <div className="holographic-sheen absolute inset-0 pointer-events-none" />

      {/* Top Brand Banner with Metallic Foil Trim */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 border-b border-white/10 text-white flex flex-wrap items-center justify-between gap-3 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-lg backdrop-blur-md">
            <Film className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                CINEBOOK
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
                M-PASS
              </span>
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-blue-200">
              Verified Electronic Admission
            </div>
          </div>
        </div>

        {/* Status Pill Badge */}
        <div className="flex items-center gap-2">
          {isCheckedIn ? (
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
            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> CONFIRMED
            </span>
          )}
        </div>
      </div>

      {/* Ticket Front Body */}
      <div className="p-5 sm:p-7 space-y-4 sm:space-y-5 relative">
        {/* Movie Details Header */}
        <div className="flex gap-4 sm:gap-6 items-start">
          <img
            src={moviePoster}
            alt={movieTitle}
            className="w-20 sm:w-24 aspect-[2/3] rounded-2xl object-cover shadow-xl bg-black/50 shrink-0 border border-white/15"
          />

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-sm">
                {format}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1C202F] border border-white/10 text-slate-300">
                {movieAgeRating}
              </span>
              <span className="text-[11px] text-slate-400">{movieDuration}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white truncate">
              {movieTitle}
            </h3>

            <div className="text-xs text-slate-300 flex items-center gap-1.5 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="font-semibold text-white truncate">{cinemaName}</span>
            </div>
            {cinemaAddress && (
              <div className="text-[11px] text-slate-400 pl-5 truncate">
                {cinemaAddress}
              </div>
            )}
          </div>
        </div>

        {/* Realistic Ticket Perforation Tear-Line */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="ticket-notch-left" />
          <div className="border-t-2 border-dashed border-white/20 w-full" />
          <div className="ticket-notch-right" />
          <span className="absolute px-3 bg-[#131520] text-[9px] font-mono tracking-widest uppercase text-slate-500 font-bold">
            ★ OFFICIAL ELECTRONIC STUB ★
          </span>
        </div>

        {/* Session Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-[#161925] border border-white/8 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Date
            </span>
            <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> {date}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Showtime
            </span>
            <span className="text-xs sm:text-sm font-bold text-cyan-300 mt-0.5 block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> {formatTime(time)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Auditorium
            </span>
            <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block truncate">
              {hall}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Seats
            </span>
            <span className="text-xs sm:text-sm font-mono font-black text-emerald-400 mt-0.5 block truncate">
              {seatsList.length > 0 ? seatsList.join(', ') : 'Assigned at Gate'}
            </span>
          </div>
        </div>

        {/* Refreshments / F&B items if any */}
        {addonsList.length > 0 && (
          <div className="p-3 rounded-2xl bg-[#161925] border border-white/8 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-300 font-bold text-[11px]">
              <div className="flex items-center gap-1.5">
                <Popcorn className="w-3.5 h-3.5 text-amber-400" />
                <span>Concessions & Refreshments ({addonsList.length} items)</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {addonsList.map((item: any, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-[#0E1018] border border-white/5 text-[10px] text-slate-300"
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
            <div className="w-10 h-10 rounded-full holographic-seal flex items-center justify-center shadow-lg text-slate-950 font-black shrink-0">
              <Sparkles className="w-5 h-5 text-amber-950" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                Booking Reference
              </div>
              <div className="text-sm font-mono font-black text-white tracking-wider">
                #{bookingRef}
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Total Amount Paid
            </div>
            <div className="text-lg font-black text-blue-400">
              {formatPrice(totalAmount)}
            </div>
          </div>
        </div>

        {/* Front Action Bar: Flip to Back (QR Code) Button */}
        <div className="pt-2 no-print">
          <button
            type="button"
            onClick={() => handleFlip(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer active:scale-98"
          >
            <QrCode className="w-4 h-4" />
            <span>Flip to View Scannable Gate QR Pass ↻</span>
          </button>
        </div>
      </div>

      {/* Front Footer */}
      <div className="px-6 py-3 bg-[#0B0D14] border-t border-white/8 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Verified Cinema Pass • Tamper-Sealed</span>
        <span className="font-mono text-[10px]">
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
      className={`w-full rounded-3xl border border-white/12 holographic-card text-slate-100 shadow-2xl overflow-hidden flex flex-col justify-between ${
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
      }}
    >
      {/* Holographic Sheen Layer */}
      <div className="holographic-sheen absolute inset-0 pointer-events-none" />

      {/* Back Header Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 border-b border-white/10 text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block">
              OPTICAL GATEWAY PASS
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Ref: #{bookingRef}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleFlip(false)}
          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Show Front ↺</span>
        </button>
      </div>

      {/* Back Body */}
      <div className="p-5 sm:p-7 space-y-4 relative flex flex-col items-center text-center">
        {/* Real High-Contrast Scannable QR Code */}
        <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-white/30 shrink-0">
          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt={`Scannable QR Pass for Booking ${bookingRef}`}
              className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
            />
          ) : (
            <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center text-slate-900">
              <QrCode className="w-16 h-16 animate-pulse" />
            </div>
          )}
        </div>

        {/* Barcode Simulation & Reference */}
        <div className="space-y-1">
          <div className="flex items-end justify-center gap-1 h-7 px-3 bg-black/40 py-1 rounded-lg border border-white/10">
            {[4, 2, 5, 1, 3, 6, 2, 4, 1, 5, 3, 2, 6, 1, 4, 3, 5, 2].map((height, i) => (
              <div
                key={i}
                className="bg-cyan-300 w-1 rounded-sm"
                style={{ height: `${height * 3 + 4}px` }}
              />
            ))}
          </div>
          <div className="font-mono text-xs font-extrabold tracking-widest text-cyan-300">
            *{bookingRef}*
          </div>
        </div>

        {/* Admission Instructions Card */}
        <div className="w-full p-3.5 rounded-2xl bg-[#161925] border border-white/8 text-left space-y-1.5 text-xs">
          <div className="font-bold text-white flex items-center gap-1.5 text-[11px]">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Gate Admission Instructions</span>
          </div>
          <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside leading-relaxed">
            <li>Present this screen at full brightness to the optical turnstile reader.</li>
            <li>Reserved Seats: <strong className="text-emerald-400 font-mono">{seatsList.join(', ') || 'Assigned'}</strong> in {hall}.</li>
            <li>Replay-prevention encryption active: One valid scan per patron.</li>
          </ul>
        </div>

        {/* Cancellation Policy Summary */}
        <div className="w-full p-3 rounded-2xl bg-[#0F111A] border border-white/5 text-left text-[11px] text-slate-400">
          <span className="font-bold text-slate-300 block mb-0.5">Cancellation Policy:</span>
          Cancellations eligible up to showtime for a 90% simulated refund (10% demo processing fee).
        </div>

        {/* Scanner simulator button */}
        <div className="w-full flex items-center justify-between gap-3 pt-1 no-print">
          <Link
            to={`/scanner?ref=${bookingRef}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <span>Open Gate Scanner</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            type="button"
            onClick={() => handleFlip(false)}
            className="py-2.5 px-4 rounded-xl border border-white/10 bg-[#1C202F] hover:bg-[#252B3E] text-white text-xs font-bold transition-all cursor-pointer"
          >
            Flip to Front ↺
          </button>
        </div>
      </div>

      {/* Back Footer */}
      <div className="px-6 py-3 bg-[#0B0D14] border-t border-white/8 text-[11px] text-slate-400 flex items-center justify-between">
        <span>CineBook Gate Protocol 1.0</span>
        <span className="text-emerald-400 font-semibold">Active & Scannable</span>
      </div>
    </div>
  );

  return (
    <div className={`space-y-3 ${className} ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* View Switcher Controls (Header Pill) */}
      <div className="flex items-center justify-between px-1 no-print">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#141722] border border-white/10 text-xs shadow-inner">
          <button
            type="button"
            onClick={() => handleFlip(false)}
            className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              !isFlipped
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Front Pass</span>
          </button>
          <button
            type="button"
            onClick={() => handleFlip(true)}
            className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              isFlipped
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
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
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-white/5"
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
