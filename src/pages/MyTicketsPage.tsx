import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  XCircle,
  Sparkles,
  Printer,
  CheckCircle2,
  Share2,
  CalendarPlus,
  Search,
  ExternalLink,
  AlertCircle,
  RotateCcw,
  Loader2,
  History
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { HolographicTicket } from '../components/HolographicTicket';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { cancelBookingApi, fetchMyBookingsApi, getCancelQuoteApi, getBookingAuditTrailApi, type CancelQuoteResponse } from '../services/api';
import type { BookingRecord, CancellationAuditLog } from '../types';
import { isPastShowtime } from '../utils/dateUtils';

export const MyTicketsPage: React.FC = () => {
  const { myBookings, cancelBooking, syncBookings } = useBooking();
  const { user } = useAuth();
  const { t, formatPrice, formatTime, isRTL } = useTranslation();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [cancellationTarget, setCancellationTarget] = useState<string | null>(null);
  const [cancelQuote, setCancelQuote] = useState<CancelQuoteResponse | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [cancelStatus, setCancelStatus] = useState<{ loading: boolean; error?: string; success?: string }>({
    loading: false
  });
  const [auditLogs, setAuditLogs] = useState<CancellationAuditLog[]>([]);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  // Sync bookings from backend whenever component mounts or user email changes
  useEffect(() => {
    fetchMyBookingsApi(user?.email)
      .then(bookings => {
        if (bookings && Array.isArray(bookings)) {
          syncBookings(bookings);
        }
      })
      .catch(err => console.warn('Sync bookings notice:', err));
  }, [user?.email]);

  // Calendar .ics download
  const handleDownloadIcs = (b: BookingRecord) => {
    const title = `🎬 Movie: ${b.movieTitle}`;
    const location = `${b.cinemaName}, ${b.cinemaAddress || 'Cinema Auditorium'}`;
    const seats = (b.seats || []).map(s => (typeof s === 'string' ? s : s?.id || '')).join(', ');
    const description = `Booking Ref: #${b.bookingId}\\nFormat: ${b.format}\\nHall: ${b.hall}\\nSeats: ${seats}`;

    const now = new Date();
    const dateStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CineBook Cinema Booking//Tickets//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:cinebook-${b.bookingId}-${Date.now()}@cinebook.in`,
      `DTSTAMP:${dateStamp}`,
      `DTSTART:${dateStamp}`,
      `DTEND:${dateStamp}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `CineBook-Ticket-${b.bookingId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Google Calendar Link
  const getGoogleCalendarUrl = (b: BookingRecord) => {
    const title = encodeURIComponent(`🎬 ${b.movieTitle} - CineBook`);
    const seats = (b.seats || []).map(s => (typeof s === 'string' ? s : s?.id || '')).join(', ');
    const details = encodeURIComponent(
      `Booking Ref: #${b.bookingId}\nCinema: ${b.cinemaName} (${b.hall})\nShowtime: ${b.date} at ${b.time}\nSeats: ${seats}`
    );
    const location = encodeURIComponent(`${b.cinemaName}, ${b.cinemaAddress || ''}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  // WhatsApp Share URL
  const getWhatsAppShareUrl = (b: BookingRecord) => {
    const seats = (b.seats || []).map(s => (typeof s === 'string' ? s : s?.id || '')).join(', ');
    const text = encodeURIComponent(
      `🎟️ *CineBook Movie Pass*\n\n` +
      `*Movie:* ${b.movieTitle} (${b.format})\n` +
      `*Cinema:* ${b.cinemaName} - ${b.hall}\n` +
      `*Date & Time:* ${b.date} at ${b.time}\n` +
      `*Seats:* ${seats}\n` +
      `*Booking Ref:* #${b.bookingId}\n\n` +
      `Booked via CineBook Cinema Platform!`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  // Categorize bookings into tabs (Past showtimes automatically move to Completed)
  const upcomingBookings = useMemo(() => {
    return myBookings.filter(b => b.status === 'confirmed' && !b.checkedIn && !isPastShowtime(b.date, b.time));
  }, [myBookings]);

  const completedBookings = useMemo(() => {
    return myBookings.filter(b => b.status === 'confirmed' && (b.checkedIn || isPastShowtime(b.date, b.time)));
  }, [myBookings]);

  const cancelledBookings = useMemo(() => {
    return myBookings.filter(b => b.status === 'cancelled');
  }, [myBookings]);

  // Filter current tab by search query
  const displayedBookings = useMemo(() => {
    let list: BookingRecord[] = [];
    if (activeTab === 'upcoming') list = upcomingBookings;
    else if (activeTab === 'completed') list = completedBookings;
    else list = cancelledBookings;

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      b =>
        b.movieTitle.toLowerCase().includes(q) ||
        b.bookingId.toLowerCase().includes(q) ||
        b.cinemaName.toLowerCase().includes(q)
    );
  }, [activeTab, upcomingBookings, completedBookings, cancelledBookings, searchQuery]);

  // Selected Booking for right-column preview
  const selectedBooking = useMemo(() => {
    if (selectedTicketId) {
      const found = myBookings.find(b => b.bookingId === selectedTicketId);
      if (found) return found;
    }
    return displayedBookings[0] || myBookings[0] || null;
  }, [selectedTicketId, displayedBookings, myBookings]);

  // Fetch cancellation audit trail whenever a cancelled booking is selected
  useEffect(() => {
    const targetRef = selectedBooking?.bookingId || selectedBooking?.id;
    if (selectedBooking && selectedBooking.status === 'cancelled' && targetRef) {
      setIsLoadingAudit(true);
      getBookingAuditTrailApi(targetRef)
        .then(res => {
          if (res.success && Array.isArray(res.logs)) {
            setAuditLogs(res.logs);
          }
        })
        .catch(() => setAuditLogs([]))
        .finally(() => setIsLoadingAudit(false));
    } else {
      setAuditLogs([]);
    }
  }, [selectedBooking?.bookingId, selectedBooking?.id, selectedBooking?.status]);

  // Open cancellation modal with live refund quote
  const handleOpenCancelModal = async (bookingId: string) => {
    setCancellationTarget(bookingId);
    setCancelQuote(null);
    setIsQuoteLoading(true);
    setCancelStatus({ loading: false });

    // Pre-seed local estimate
    const local = myBookings.find(b => b.bookingId === bookingId || b.id === bookingId);
    if (local) {
      const orig = Number(local.totalAmount) || 0;
      const totalPaise = Math.round(orig * 100);
      const feePaise = Math.round(totalPaise * 0.1);
      const refundPaise = totalPaise - feePaise;
      const fee = feePaise / 100;
      const refAmt = refundPaise / 100;
      setCancelQuote({
        success: true,
        eligible: true,
        bookingId: local.bookingId,
        id: local.id || local.bookingId,
        movieTitle: local.movieTitle,
        cinemaName: local.cinemaName,
        screenName: local.hall,
        showDate: local.date,
        showTime: local.time,
        seats: (local.seats || []).map(s => (typeof s === 'string' ? s : s?.id || '')),
        seatsCount: (local.seats || []).length,
        originalAmount: orig,
        cancellationFee: fee,
        refundAmount: refAmt,
        refundPercentage: 90,
        policy: 'Standard Cinema Policy: 90% of booking amount is refundable. 10% processing fee applies.',
        paymentMethod: local.paymentMethod || 'Online Payment'
      });
    }

    try {
      const quote = await getCancelQuoteApi(bookingId);
      if (quote && quote.success) {
        setCancelQuote(quote);
      }
    } catch (err: any) {
      console.warn('Could not fetch server cancel quote, relying on client calculation:', err);
    } finally {
      setIsQuoteLoading(false);
    }
  };

  // Cancellation action with gateway refund tracking & error handling
  const handleConfirmCancel = async () => {
    if (!cancellationTarget) return;
    setCancelStatus({ loading: true, error: undefined });
    try {
      const res = await cancelBookingApi(cancellationTarget, user?.email);
      if (!res.success) {
        throw new Error(res.message || 'Failed to cancel booking.');
      }

      const refundInfo = res.refund || {
        refundStatus: 'REFUNDED' as const,
        refundAmount: cancelQuote?.refundAmount ?? Math.round((cancelQuote?.originalAmount || 0) * 0.9 * 100) / 100,
        cancellationFee: cancelQuote?.cancellationFee ?? Math.round((cancelQuote?.originalAmount || 0) * 0.1 * 100) / 100,
        refundId: undefined
      };

      cancelBooking(cancellationTarget, refundInfo);

      const refundDisplay = formatPrice(refundInfo.refundAmount || cancelQuote?.refundAmount || 0);
      const isFailed = refundInfo.refundStatus === 'REFUND_FAILED';
      const refIdNote = refundInfo.refundId ? ` (Ref: ${refundInfo.refundId})` : '';

      setCancelStatus({
        loading: false,
        success: isFailed
          ? `Booking #${cancellationTarget} cancelled. Gateway refund failed (${refundInfo.refundError || 'Gateway error'}). Support desk notified for manual processing.`
          : `Booking #${cancellationTarget} successfully cancelled. A 90% simulated refund of ${refundDisplay} has been recorded (Demo Sandbox)${refIdNote}. Reserved seats have been released!`
      });

      // Refresh audit logs for the cancelled ticket
      getBookingAuditTrailApi(cancellationTarget)
        .then(auditRes => {
          if (auditRes.success && Array.isArray(auditRes.logs)) {
            setAuditLogs(auditRes.logs);
          }
        })
        .catch(() => {});

      setTimeout(() => {
        setCancellationTarget(null);
        setCancelStatus({ loading: false });
      }, 2500);
    } catch (err: any) {
      setCancelStatus({
        loading: false,
        error: err.message || 'Cancellation failed. You may not have permission or this booking is already cancelled or expired.'
      });
    }
  };

  return (
    <main
      className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#08090B] text-[#F3F0E8] transition-colors duration-200 ${
        isRTL ? 'rtl' : 'ltr'
      }`}
    >
      {/* Breadcrumb & Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C7A675] hover:underline mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t.nav.movies}
          </Link>
          <h1 className="text-3xl font-bold font-display tracking-tight text-[#F3F0E8] flex items-center gap-3">
            <span>{t.tickets.title}</span>
          </h1>
          <p className="text-sm text-[#A8ADB4] mt-1">
            {t.tickets.subtitle}
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full border border-[#C7A675]/30 bg-[#15171B] text-xs font-bold text-[#C7A675] shadow-sm font-mono">
            {upcomingBookings.length} {t.tickets.activePasses}
          </div>
        </div>
      </div>

      {/* 3 Tabs + Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`min-h-[44px] px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'upcoming'
                ? 'bg-[#C7A675] text-[#08090B] shadow-md shadow-[#C7A675]/25'
                : 'bg-[#15171B] border border-white/10 text-[#A8ADB4] hover:text-[#F3F0E8]'
            }`}
          >
            <span>Upcoming</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'upcoming'
                  ? 'bg-[#08090B] text-[#C7A675]'
                  : 'bg-white/10 text-[#A8ADB4]'
              }`}
            >
              {upcomingBookings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`min-h-[44px] px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'completed'
                ? 'bg-[#C7A675] text-[#08090B] shadow-md shadow-[#C7A675]/25'
                : 'bg-[#15171B] border border-white/10 text-[#A8ADB4] hover:text-[#F3F0E8]'
            }`}
          >
            <span>Completed / Admitted</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'completed'
                  ? 'bg-[#08090B] text-[#C7A675]'
                  : 'bg-white/10 text-[#A8ADB4]'
              }`}
            >
              {completedBookings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cancelled')}
            className={`min-h-[44px] px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'cancelled'
                ? 'bg-[#C7A675] text-[#08090B] shadow-md shadow-[#C7A675]/25'
                : 'bg-[#15171B] border border-white/10 text-[#A8ADB4] hover:text-[#F3F0E8]'
            }`}
          >
            <span>Cancelled</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'cancelled'
                  ? 'bg-[#08090B] text-[#C7A675]'
                  : 'bg-white/10 text-[#A8ADB4]'
              }`}
            >
              {cancelledBookings.length}
            </span>
          </button>
        </div>

        {/* Search in tickets */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#A8ADB4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search movie or booking ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border border-white/10 bg-[#15171B] text-[#F3F0E8] placeholder-[#71767F] outline-none focus:border-[#C7A675]"
          />
        </div>
      </div>

      {myBookings.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 px-6 rounded-3xl border border-white/10 bg-[#0D0E12] max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#15171B] border border-[#C7A675]/30 flex items-center justify-center text-[#C7A675] mx-auto mb-4">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-display text-[#F3F0E8] tracking-tight">
            {t.tickets.noTicketsTitle}
          </h3>
          <p className="text-xs text-[#A8ADB4] mt-2 mb-6">
            {t.tickets.noTicketsDesc}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-[#C7A675] hover:bg-[#DFC49D] text-[#08090B] shadow-lg shadow-[#C7A675]/25 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" /> {t.nav.movies}
          </Link>
        </div>
      ) : (
        /* Ticket Split Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bookings List */}
          <div className="lg:col-span-7 space-y-4">
            {displayedBookings.length === 0 ? (
              <div className="p-8 rounded-2xl border border-white/10 bg-[#15171B] text-center text-xs text-[#A8ADB4]">
                No tickets found in this tab.
              </div>
            ) : (
              displayedBookings.map(b => {
                const isSelected = (selectedBooking?.bookingId || '') === b.bookingId;
                const seatList = (b.seats || [])
                  .map(s => (typeof s === 'string' ? s : s?.id || ''))
                  .join(', ');

                return (
                  <div
                    key={b.bookingId}
                    role="button"
                    tabIndex={0}
                    aria-label={`Booking ${b.bookingId} for ${b.movieTitle}. Click or tap to view ticket pass and QR code.`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedTicketId(b.bookingId);
                        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                          setTimeout(() => {
                            document.getElementById('digital-ticket-pass-print')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }
                      }
                    }}
                    onClick={() => {
                      setSelectedTicketId(b.bookingId);
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                        setTimeout(() => {
                          document.getElementById('digital-ticket-pass-print')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C7A675] bg-[#1B1E24] shadow-xl shadow-[#C7A675]/10 ring-1 ring-[#C7A675]/60'
                        : 'border-white/10 bg-[#15171B] hover:border-[#C7A675]/40 hover:bg-[#1B1E24]/60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <img
                          src={b.moviePoster}
                          alt={b.movieTitle}
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22150%22%20height%3D%22225%22%20viewBox%3D%220%200%20150%20225%22%3E%3Crect%20fill%3D%22%2315171B%22%20width%3D%22150%22%20height%3D%22225%22%2F%3E%3Ctext%20x%3D%2275%22%20y%3D%22115%22%20fill%3D%22%23C7A675%22%20font-size%3D%2212%22%20font-weight%3D%22bold%22%20text-anchor%3D%22middle%22%3ECINEBOOK%3C%2Ftext%3E%3C%2Fsvg%3E';
                          }}
                          className="w-16 h-22 object-cover rounded-xl shadow-md shrink-0 border border-white/10"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#C7A675]/15 text-[#DFC49D] border border-[#C7A675]/30 uppercase tracking-wider">
                              {b.format}
                            </span>
                            <span className="text-[11px] font-mono text-[#A8ADB4]">
                              #{b.bookingId}
                            </span>
                            {b.checkedIn && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Admitted
                              </span>
                            )}
                            {b.status === 'expired' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-[#A8ADB4] border border-white/10">
                                Expired
                              </span>
                            )}
                            {b.status === 'cancelled' && (
                              <>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                  Cancelled
                                </span>
                                {b.refundStatus === 'REFUNDED' && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                    <RotateCcw className="w-2.5 h-2.5" /> Refunded: {formatPrice(b.refundAmount ?? b.totalAmount * 0.9)}
                                  </span>
                                )}
                                {(b.refundStatus === 'REFUND_PENDING' || b.refundStatus === 'REFUND_PROCESSING') && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" /> {b.refundStatus === 'REFUND_PROCESSING' ? 'Processing Refund' : 'Refund Pending'}
                                  </span>
                                )}
                                {b.refundStatus === 'REFUND_FAILED' && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                                    <AlertCircle className="w-2.5 h-2.5" /> Refund Failed
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <h4 className="text-base font-bold text-white tracking-tight font-display">
                            {b.movieTitle}
                          </h4>
                          <p className="text-xs text-[#A8ADB4] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#C7A675] shrink-0" />
                            <span>
                              {b.cinemaName} ({b.hall})
                            </span>
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-[#A8ADB4]">
                            <span className="flex items-center gap-1 font-medium text-slate-300">
                              <Calendar className="w-3.5 h-3.5 text-[#C7A675]" /> {b.date}
                            </span>
                            <span className="text-white/20">•</span>
                            <span className="flex items-center gap-1 font-semibold text-[#DFC49D]">
                              <Clock className="w-3.5 h-3.5 text-[#C7A675]" /> {formatTime(b.time)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right summary and actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                        <div className="text-right">
                          <div className="text-xs text-[#A8ADB4]">
                            {(b.seats || []).length}{' '}
                            {(b.seats || []).length === 1 ? 'Seat' : 'Seats'} ({seatList || '-'})
                          </div>
                          <div className="text-base font-extrabold text-[#F3F0E8]">
                            {formatPrice(b.totalAmount)}
                          </div>
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex items-center gap-2 mt-2">
                          {b.status === 'confirmed' && !b.checkedIn && !isPastShowtime(b.date, b.time) && (
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                handleOpenCancelModal(b.bookingId);
                              }}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-full border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Cancel Ticket"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Cancel</span>
                            </button>
                          )}
                          {b.status === 'confirmed' && isPastShowtime(b.date, b.time) && (
                            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-white/5 text-[#A8ADB4] border border-white/10">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Digital Boarding Pass Ticket Preview */}
          <div className="lg:col-span-5 sticky top-24">
            {selectedBooking ? (
              <div
                id="digital-ticket-pass-print"
                className="space-y-4"
              >
                {/* Premium 3D Holographic Ticket with Flip & Scannable QR */}
                <HolographicTicket booking={selectedBooking} id="holographic-pass-card" />

                {/* Refund Status & Audit Log Card if Cancelled */}
                {selectedBooking.status === 'cancelled' && (
                  <div className="p-4 rounded-3xl bg-[#15171B] border border-rose-500/30 text-xs space-y-3 shadow-xl">
                    <div className="flex items-center justify-between font-bold text-rose-400">
                      <span className="flex items-center gap-1.5">
                        <RotateCcw className="w-4 h-4" />
                        <span>Ticket Cancelled</span>
                      </span>
                      {selectedBooking.refundStatus === 'REFUNDED' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Refund Credited
                        </span>
                      )}
                      {selectedBooking.refundStatus === 'REFUND_PENDING' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Refund Queued
                        </span>
                      )}
                      {selectedBooking.refundStatus === 'REFUND_PROCESSING' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#C7A675]/20 text-[#DFC49D] border border-[#C7A675]/30 font-semibold flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Processing Gateway
                        </span>
                      )}
                      {selectedBooking.refundStatus === 'REFUND_FAILED' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-rose-600 text-white font-bold flex items-center gap-1 shadow-sm">
                          <AlertCircle className="w-3 h-3" /> Refund Failed
                        </span>
                      )}
                      {(!selectedBooking.refundStatus || selectedBooking.refundStatus === 'NOT_REQUESTED') && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/5 text-[#A8ADB4] font-semibold border border-white/10">
                          Not Requested
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between text-[#A8ADB4] text-[11px] pt-1.5 border-t border-white/10">
                      <span>Refunded Amount (90%):</span>
                      <span className="font-bold text-emerald-400">
                        {formatPrice(selectedBooking.refundAmount ?? selectedBooking.totalAmount * 0.9)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#A8ADB4] text-[11px]">
                      <span>Cancellation Fee (10%):</span>
                      <span className="text-slate-400">{formatPrice(selectedBooking.cancellationFee ?? selectedBooking.totalAmount * 0.1)}</span>
                    </div>

                    {selectedBooking.refundId && (
                      <div className="text-[10px] text-[#A8ADB4] font-mono truncate pt-0.5 flex items-center justify-between">
                        <span>Gateway Refund ID:</span>
                        <span className="font-bold text-slate-200">{selectedBooking.refundId}</span>
                      </div>
                    )}

                    {selectedBooking.refundError && (
                      <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-[11px] leading-relaxed">
                        <span className="font-bold block mb-0.5">Gateway Refund Notice:</span>
                        {selectedBooking.refundError}
                      </div>
                    )}

                    {/* Audit Trail Timeline */}
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#F3F0E8] mb-2">
                        <History className="w-3.5 h-3.5 text-[#C7A675]" />
                        <span>Cancellation Audit History</span>
                        {isLoadingAudit && <Loader2 className="w-3 h-3 animate-spin text-[#C7A675]" />}
                      </div>

                      {auditLogs.length > 0 ? (
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {auditLogs.map((log) => (
                            <div
                              key={log.id}
                              className="p-2 rounded-lg bg-black/40 border border-white/5 text-[10px] flex items-start justify-between gap-2"
                            >
                              <div>
                                <span className="font-semibold text-slate-200 block">
                                  {log.action.replace(/_/g, ' ')}
                                </span>
                                <span className="text-[#A8ADB4] text-[9px]">
                                  By: {log.actorEmail} • {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-[#DFC49D] shrink-0 border border-white/10">
                                {log.refundStatus}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[10px] text-[#A8ADB4] italic">
                          Cancellation logged on {selectedBooking.cancelledAt ? new Date(selectedBooking.cancelledAt).toLocaleString() : 'system records'}.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Interactive Action Toolbar with prominent Cancel Ticket button */}
                <div className="p-5 rounded-3xl border border-white/10 bg-[#15171B] shadow-2xl space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    {/* 1. Download PDF Pass */}
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C7A675] to-[#B38F5B] text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#C7A675]/20 hover:brightness-110 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> Download PDF Pass
                    </button>

                    {/* 2. Add to Calendar (.ics) */}
                    <button
                      type="button"
                      onClick={() => handleDownloadIcs(selectedBooking)}
                      className="py-2.5 px-3 rounded-xl border border-white/10 bg-[#1B1E24] hover:bg-[#252938] hover:border-[#C7A675]/40 text-[#F3F0E8] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-[#C7A675]" /> Add to Calendar (.ics)
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* 3. Google Calendar */}
                    <a
                      href={getGoogleCalendarUrl(selectedBooking)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl border border-white/10 bg-[#1B1E24] hover:border-[#C7A675]/40 text-[#A8ADB4] hover:text-[#F3F0E8] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3 h-3 text-[#C7A675]" /> Google Calendar
                    </a>

                    {/* 4. WhatsApp Sharing */}
                    <a
                      href={getWhatsAppShareUrl(selectedBooking)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Share2 className="w-3 h-3 text-emerald-400" /> Share on WhatsApp
                    </a>
                  </div>

                  {/* 5. Prominent Cancel Ticket Button in Right Detail Panel */}
                  {selectedBooking.status === 'confirmed' && !selectedBooking.checkedIn && !isPastShowtime(selectedBooking.date, selectedBooking.time) && (
                    <button
                      type="button"
                      onClick={() => handleOpenCancelModal(selectedBooking.bookingId)}
                      className="w-full mt-2 py-3 px-4 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-rose-500/20"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Cancel Ticket & Request 90% Refund</span>
                    </button>
                  )}
                  {selectedBooking.status === 'confirmed' && isPastShowtime(selectedBooking.date, selectedBooking.time) && (
                    <div className="w-full mt-2 py-2.5 px-3 rounded-xl border border-white/10 bg-white/5 text-[#A8ADB4] text-xs font-semibold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Showtime Ended • Completed Session</span>
                    </div>
                  )}
                  {selectedBooking.status === 'cancelled' && (
                    <div className="w-full mt-2 py-2.5 px-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Ticket Cancelled • Seats Restored to Inventory</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Comprehensive Cancellation & Refund Modal */}
      {cancellationTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-lg w-full rounded-3xl border border-white/15 bg-[#15171B] p-6 space-y-5 shadow-2xl text-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg tracking-tight text-white font-display">
                  Cancel Ticket & Process Refund
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono font-semibold text-[#A8ADB4]">
                    Booking #{cancellationTarget}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C7A675]/15 text-[#DFC49D] border border-[#C7A675]/30">
                    90% Refund Eligible
                  </span>
                </div>
              </div>
            </div>

            {isQuoteLoading ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-2 text-[#A8ADB4] text-xs">
                <Loader2 className="w-7 h-7 animate-spin text-[#C7A675]" />
                <span>Calculating refund and checking seat status...</span>
              </div>
            ) : cancelQuote ? (
              <div className="space-y-4">
                {/* Show details card */}
                <div className="p-3.5 rounded-2xl bg-[#0D0E12] border border-white/10 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span className="font-display tracking-wide">{cancelQuote.movieTitle}</span>
                    <span className="text-[#DFC49D] font-mono">{cancelQuote.showTime}</span>
                  </div>
                  <div className="text-[#A8ADB4] text-[11px] flex justify-between">
                    <span>{cancelQuote.cinemaName} ({cancelQuote.screenName})</span>
                    <span>{cancelQuote.showDate}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[#A8ADB4] text-[11px]">Seats Being Cancelled:</span>
                    <div className="flex flex-wrap gap-1">
                      {cancelQuote.seats.map((seat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md font-mono font-bold text-[11px] bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Financial breakdown card */}
                <div className="p-4 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-[#A8ADB4]">
                    <span>Original Booking Total</span>
                    <span className="font-semibold text-white">
                      {formatPrice(cancelQuote.originalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>Cancellation Processing Fee (10%)</span>
                    <span className="font-semibold">
                      -{formatPrice(cancelQuote.cancellationFee)}
                    </span>
                  </div>
                  <div className="pt-2.5 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                    <span className="text-[#F3F0E8]">Simulated Demo Refund (90%)</span>
                    <span className="text-emerald-400 font-black text-base">
                      {formatPrice(cancelQuote.refundAmount)}
                    </span>
                  </div>
                </div>

                {/* Policy & Sandbox Disclaimer note */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-amber-400">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>DEMO / SIMULATED REFUND NOTICE</span>
                  </div>
                  <p className="text-slate-300">
                    In this CineBook demonstration environment, all bookings, payments, and cancellations are <strong>SIMULATED</strong>. No real money was charged or returned to a bank account. A 90% simulated credit of {formatPrice(cancelQuote.refundAmount)} will be recorded, and your seats will be released back to the seating inventory.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to cancel this booking? A 90% simulated refund will be processed in this demo environment, and 10% demo cancellation charges apply. The reserved seats will immediately be freed up for other moviegoers.
              </p>
            )}

            {cancelStatus.error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{cancelStatus.error}</span>
              </div>
            )}

            {cancelStatus.success && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-semibold">{cancelStatus.success}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                disabled={cancelStatus.loading}
                onClick={() => setCancellationTarget(null)}
                className="px-4 py-2.5 rounded-full border border-white/15 text-[#A8ADB4] text-xs font-semibold hover:text-white hover:bg-white/5 cursor-pointer disabled:opacity-50"
              >
                {t.tickets.keepBooking}
              </button>
              <button
                type="button"
                disabled={cancelStatus.loading || !!cancelStatus.success || isQuoteLoading}
                onClick={handleConfirmCancel}
                className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {cancelStatus.loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Refund...</span>
                  </>
                ) : (
                  <span>{t.tickets.confirmCancel}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
