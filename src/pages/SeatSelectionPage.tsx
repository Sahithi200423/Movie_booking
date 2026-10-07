import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Ticket,
  AlertCircle,
  Armchair,
  Calendar,
  Clock,
  MapPin,
  Timer,
  Lock,
  X
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useTranslation } from '../context/LanguageContext';
import { generateSeatLayout, SEAT_PRICING, SEAT_TIER_LABELS } from '../data/mockData';
import type { Seat } from '../types';
import { getSeatsForShow, holdSeatsApi, releaseSeatsHoldApi } from '../services/api';
import { io } from 'socket.io-client';
import { FnBUpsellModal } from '../components/FnBUpsellModal';

const PARTY_OPTIONS = [
  { count: 1, label: 'Cycle', icon: '🚲' },
  { count: 2, label: 'Scooter', icon: '🛵' },
  { count: 3, label: 'Auto', icon: '🛺' },
  { count: 4, label: 'Mini', icon: '🚗' },
  { count: 5, label: 'Sedan', icon: '🚙' },
  { count: 6, label: 'SUV', icon: '🚐' },
  { count: 7, label: 'Van', icon: '🚌' },
  { count: 8, label: 'Bus', icon: '🚍' },
];

export const SeatSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBooking, toggleSeat, sessionId } = useBooking();
  const { t, formatPrice, formatTime, isRTL } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [backendSeats, setBackendSeats] = useState<Record<string, Seat>>({});
  const [isHolding, setIsHolding] = useState(false);
  const [holdExpiresAt, setHoldExpiresAt] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [showFnbModal, setShowFnbModal] = useState<boolean>(false);

  // Party Size State & Popover Modal
  const [partySize, setPartySize] = useState<number>(() => {
    return activeBooking.seats.length > 0 ? activeBooking.seats.length : 2;
  });
  const [showPartyModal, setShowPartyModal] = useState<boolean>(() => {
    return activeBooking.seats.length === 0;
  });

  // Derive stable showtimeId
  const showtimeId = useMemo(() => {
    if (activeBooking.showtimeId) return activeBooking.showtimeId;
    if (activeBooking.movie && activeBooking.cinema) {
      return `show-${activeBooking.movie.id.substring(0, 8)}-${activeBooking.cinema.id.substring(0, 8)}-1`;
    }
    return 'show-1';
  }, [activeBooking.showtimeId, activeBooking.movie?.id, activeBooking.cinema?.id]);

  // Load seats from backend & connect to real-time WebSockets
  useEffect(() => {
    let isMounted = true;
    async function loadSeats() {
      try {
        const seats = await getSeatsForShow(showtimeId, sessionId);
        if (isMounted) {
          const map: Record<string, Seat> = {};
          seats.forEach(s => {
            map[s.id] = s;
          });
          setBackendSeats(map);
        }
      } catch (err) {
        console.warn('Backend seats fetch fallback:', err);
      }
    }

    loadSeats();

    // Setup Socket.io real-time connection
    let socket: any = null;
    try {
      socket = io({ path: '/socket.io', transports: ['websocket', 'polling'] });
      socket.emit('join:showtime', showtimeId);

      const handleLiveSeatSync = () => {
        if (isMounted) {
          loadSeats();
        }
      };

      socket.on('seats:updated', handleLiveSeatSync);
      socket.on('seats:locked', handleLiveSeatSync);
      socket.on('seats:unlocked', handleLiveSeatSync);
      socket.on('seats:booked', handleLiveSeatSync);
    } catch (e) {
      console.warn('WebSocket connection fallback:', e);
    }

    return () => {
      isMounted = false;
      if (socket) {
        socket.emit('leave:showtime', showtimeId);
        socket.disconnect();
      }
    };
  }, [showtimeId, sessionId]);

  // Hold Countdown Timer
  useEffect(() => {
    if (!holdExpiresAt) {
      setSecondsRemaining(null);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((holdExpiresAt - now) / 1000));
      setSecondsRemaining(diff);

      if (diff <= 0) {
        setHoldExpiresAt(null);
        setErrorMessage(t.seats.holdExpiredNotice);
        releaseSeatsHoldApi(showtimeId, sessionId).catch(() => {});
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [holdExpiresAt, showtimeId, sessionId, t.seats.holdExpiredNotice]);

  // Generate deterministic seat rows based on movie & cinema & time
  const baseLayout = useMemo(() => {
    if (!activeBooking.movie || !activeBooking.cinema) return [];
    const seed = `${activeBooking.movie?.id}-${activeBooking.cinema?.id}-${activeBooking.time}`;
    return generateSeatLayout(seed);
  }, [activeBooking.movie?.id, activeBooking.cinema?.id, activeBooking.time]);

  // Merge with dynamic backend seat status
  const seatLayout = useMemo(() => {
    return baseLayout.map(row => ({
      ...row,
      seats: row.seats.map(seat => {
        const remote = backendSeats[seat.id];
        if (remote) {
          return {
            ...seat,
            status: remote.status,
            holdExpiresAt: remote.holdExpiresAt
          };
        }
        return seat;
      })
    }));
  }, [baseLayout, backendSeats]);

  // If user navigated directly without selecting a movie or cinema
  if (!activeBooking.movie || !activeBooking.cinema) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#090A0F] text-slate-100">
        <Ticket className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{t.seats.sessionEmptyTitle}</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-md">
          {t.seats.sessionEmptyDesc}
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-colors"
        >
          {t.nav.movies}
        </Link>
      </div>
    );
  }

  const selectedSeats = activeBooking.seats;
  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleSeatClick = async (seat: Seat) => {
    if (seat.status === 'reserved') return;
    if (seat.status === 'held') {
      setErrorMessage('This seat is temporarily locked by another customer. Please choose an adjacent seat.');
      return;
    }

    setErrorMessage(null);
    const isAlreadySelected = selectedSeats.some(s => s.id === seat.id);

    if (isAlreadySelected) {
      toggleSeat(seat);
      const remaining = selectedSeats.filter(s => s.id !== seat.id);
      if (remaining.length === 0) {
        setHoldExpiresAt(null);
        releaseSeatsHoldApi(showtimeId, sessionId).catch(() => {});
      } else {
        holdSeatsApi(showtimeId, remaining.map(s => s.id), sessionId).catch(() => {});
      }
      return;
    }

    // If starting fresh and partySize > 1, try contiguous auto-selection
    if (selectedSeats.length === 0 && partySize > 1) {
      const currentRow = seatLayout.find(r => r.rowLetter === seat.row);
      if (currentRow) {
        const startIndex = currentRow.seats.findIndex(s => s.id === seat.id);
        if (startIndex !== -1) {
          const candidateSeats: Seat[] = [];
          for (let i = startIndex; i < currentRow.seats.length && candidateSeats.length < partySize; i++) {
            const nextSeat = currentRow.seats[i];
            if (nextSeat.status === 'available') {
              candidateSeats.push(nextSeat);
            } else {
              break;
            }
          }

          if (candidateSeats.length === partySize) {
            setIsHolding(true);
            try {
              const res = await holdSeatsApi(showtimeId, candidateSeats.map(s => s.id), sessionId, 7);
              if (res.success) {
                candidateSeats.forEach(s => toggleSeat(s));
                setHoldExpiresAt(res.expiresAt);
                return;
              }
            } catch (err: unknown) {
              console.warn('Contiguous batch hold failed, falling back to single seat:', err);
            } finally {
              setIsHolding(false);
            }
          }
        }
      }
    }

    // Standard single seat selection with partySize limit check
    if (selectedSeats.length >= 8) {
      setErrorMessage(t.seats.maxSeatsNotice);
      return;
    }

    if (selectedSeats.length >= partySize) {
      setErrorMessage(`You previously selected ${partySize} seat(s). Tap "Change" above if you'd like to book more tickets.`);
      return;
    }

    setIsHolding(true);
    try {
      const nextSeatIds = [...selectedSeats.map(s => s.id), seat.id];
      const res = await holdSeatsApi(showtimeId, nextSeatIds, sessionId, 7);
      if (res.success) {
        toggleSeat(seat);
        setHoldExpiresAt(res.expiresAt);
      }
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Unable to hold this seat.';
      setErrorMessage(msg);
    } finally {
      setIsHolding(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      setErrorMessage('Please select at least one seat to continue.');
      return;
    }
    // Open interstitial F&B concession upsell modal before proceeding to payment
    setShowFnbModal(true);
  };

  const formatTimerDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPartyOption = PARTY_OPTIONS.find(p => p.count === partySize) || PARTY_OPTIONS[1];

  return (
    <div className={`min-h-screen pb-32 bg-[#090A0F] text-slate-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* 1. TOP SESSION BAR */}
      <div className="border-b border-white/10 bg-[#0E1017]/95 backdrop-blur-md sticky top-18 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link
              to={`/movie/${activeBooking.movie.id}`}
              className="p-2.5 rounded-xl border border-white/10 bg-[#1C1F2B] text-slate-200 hover:text-white hover:bg-[#222634] transition-colors"
              title="Back to showtimes"
            >
              <ChevronLeft className="w-5 h-5 text-blue-400" />
            </Link>
            <div>
              <h1 className="text-lg font-black text-white flex items-center gap-2">
                <span>{activeBooking.movie.title}</span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#1C1F2B] text-blue-300 border border-white/10">
                  {activeBooking.format}
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  {activeBooking.cinema.name} ({activeBooking.hall})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  {activeBooking.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {formatTime(activeBooking.time)}
                </span>
              </div>
            </div>
          </div>

          {/* Party Size & Live Hold Timer Controls */}
          <div className="flex items-center gap-3">
            {/* Party Size Selector Trigger */}
            <button
              type="button"
              onClick={() => setShowPartyModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-[#1C1F2B] hover:bg-[#222634] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <span className="text-base">{currentPartyOption.icon}</span>
              <span>{partySize} {partySize === 1 ? 'Ticket' : 'Tickets'}</span>
              <span className="text-blue-400 text-[11px] underline">Change</span>
            </button>

            {secondsRemaining !== null && secondsRemaining > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold animate-pulse">
                <Timer className="w-4 h-4 text-amber-400" />
                <span>{t.seats.holdExpiresIn}: {formatTimerDisplay(secondsRemaining)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. PARTY SIZE SELECTOR MODAL / POPOVER */}
      {showPartyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#14161F] border border-white/10 rounded-3xl p-6 shadow-2xl text-center space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="text-left">
                <h3 className="text-lg font-bold text-white tracking-tight">How Many Seats?</h3>
                <p className="text-xs text-slate-400">Select number of tickets to book</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPartyModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vehicle Graphic Preview */}
            <div className="py-2">
              <div className="text-5xl mb-2 animate-bounce">{currentPartyOption.icon}</div>
              <div className="text-sm font-bold text-white">{currentPartyOption.label}</div>
              <div className="text-xs text-slate-400">{partySize} {partySize === 1 ? 'Seat' : 'Seats'}</div>
            </div>

            {/* Party Size Numbers (1 to 8) */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {PARTY_OPTIONS.map(opt => (
                <button
                  key={opt.count}
                  type="button"
                  onClick={() => setPartySize(opt.count)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-150 flex items-center justify-center cursor-pointer ${
                    partySize === opt.count
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 scale-110 ring-2 ring-blue-400'
                      : 'bg-[#1C1F2B] text-slate-300 border border-white/10 hover:border-blue-400 hover:text-white'
                  }`}
                >
                  {opt.count}
                </button>
              ))}
            </div>

            {/* Tier Pricing Guide */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 text-left">
              <div className="p-2.5 rounded-xl border border-white/10 bg-[#1C1F2B]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Royal Recliner</div>
                <div className="text-xs font-black text-white mt-0.5">{formatPrice(SEAT_PRICING.VIP)}</div>
                <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">Available</div>
              </div>
              <div className="p-2.5 rounded-xl border border-white/10 bg-[#1C1F2B]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Club / Prime</div>
                <div className="text-xs font-black text-white mt-0.5">{formatPrice(SEAT_PRICING.PREMIUM)}</div>
                <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">Available</div>
              </div>
              <div className="p-2.5 rounded-xl border border-white/10 bg-[#1C1F2B]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Executive</div>
                <div className="text-xs font-black text-white mt-0.5">{formatPrice(SEAT_PRICING.STANDARD)}</div>
                <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">Available</div>
              </div>
            </div>

            {/* Select Seats CTA */}
            <button
              type="button"
              onClick={() => setShowPartyModal(false)}
              className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
            >
              Select {partySize} {partySize === 1 ? 'Seat' : 'Seats'}
            </button>
          </div>
        </div>
      )}

      {/* 3. CINEMA AUDITORIUM SEATING ARENA */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 pt-6">
        
        {/* Error notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Legend Bar */}
        <div className="mb-8 p-3.5 rounded-2xl border border-white/10 bg-[#14161F] flex flex-wrap items-center justify-center gap-6 text-xs shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#1C1F2B] border border-white/10" />
            <span className="text-slate-300 font-medium">{t.seats.available}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600 text-white font-bold border border-blue-400 shadow-md shadow-blue-500/30 flex items-center justify-center text-[10px]">
              ✓
            </div>
            <span className="text-blue-400 font-bold">{t.seats.selected}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-[10px]">
              <Lock className="w-3 h-3" />
            </div>
            <span className="text-amber-400 font-medium">{t.seats.held}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#090A0F] border border-white/5 opacity-40 cursor-not-allowed" />
            <span className="text-slate-500 font-medium">{t.seats.reserved}</span>
          </div>
        </div>

        {/* Seat Layout Grid by Cinema Tiers */}
        <div className="overflow-x-auto pb-4">
          <div
            className="min-w-[680px] flex flex-col items-center space-y-3"
            role="grid"
            aria-label="Cinema auditorium seating arrangement"
          >
            {seatLayout.map((row, rowIndex) => {
              const prevRow = rowIndex > 0 ? seatLayout[rowIndex - 1] : null;
              const isFirstOfTier = !prevRow || prevRow.tier !== row.tier;
              const tierLabel = SEAT_TIER_LABELS[row.tier] || row.tier;
              const tierPrice = SEAT_PRICING[row.tier] || 220;
              const isVIP = row.tier === 'VIP';
              const isPremium = row.tier === 'PREMIUM';

              return (
                <React.Fragment key={row.rowLetter}>
                  {/* Tier Separator Header */}
                  {isFirstOfTier && (
                    <div className="w-full max-w-2xl flex items-center justify-between pt-5 pb-2 border-b border-white/10 text-xs">
                      <span className="font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                        {isVIP && <Armchair className="w-3.5 h-3.5 text-blue-400" />}
                        {tierLabel}
                      </span>
                      <span className="font-semibold text-blue-400">
                        {formatPrice(tierPrice)}
                      </span>
                    </div>
                  )}

                  {/* Seat Row */}
                  <div className="flex items-center gap-3" role="row">
                    {/* Left Row Letter */}
                    <span className="w-5 text-center font-bold text-xs text-slate-400 select-none">
                      {row.rowLetter}
                    </span>

                    {/* Seats with central aisle gap */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {row.seats.map(seat => {
                        const isSelected = selectedSeats.some(s => s.id === seat.id);
                        const isReserved = seat.status === 'reserved';
                        const isHeld = seat.status === 'held' && !isSelected;

                        let seatClass = '';
                        if (isSelected) {
                          seatClass =
                            'bg-blue-600 text-white font-bold border-blue-400 shadow-md shadow-blue-500/40 scale-105 ring-2 ring-blue-400/50';
                        } else if (isReserved) {
                          seatClass =
                            'bg-[#090A0F] text-slate-700 border-white/5 cursor-not-allowed opacity-30';
                        } else if (isHeld) {
                          seatClass =
                            'bg-amber-950/40 text-amber-400 border-amber-600/50 cursor-not-allowed opacity-60';
                        } else if (isVIP) {
                          seatClass =
                            'bg-blue-950/30 text-blue-200 border-blue-800/50 hover:border-blue-400 hover:bg-blue-900/50 focus:ring-2 focus:ring-blue-400';
                        } else if (isPremium) {
                          seatClass =
                            'bg-[#1C1F2B] text-slate-200 border-white/10 hover:border-blue-400 hover:bg-[#222634] focus:ring-2 focus:ring-blue-400';
                        } else {
                          seatClass =
                            'bg-[#14161F] text-slate-300 border-white/10 hover:border-blue-400 hover:bg-[#1C1F2B] focus:ring-2 focus:ring-blue-400';
                        }

                        return (
                          <React.Fragment key={seat.id}>
                            {/* Realistic Central Walking Aisle gap between seat 8 and 9 */}
                            {seat.number === 9 && (
                              <div className="w-6 sm:w-10 text-center select-none" aria-hidden="true">
                                <span className="text-[9px] text-slate-600 font-mono tracking-widest hidden sm:inline">AISLE</span>
                              </div>
                            )}

                            <button
                              type="button"
                              role="gridcell"
                              disabled={isReserved || isHeld || isHolding}
                              onClick={() => handleSeatClick(seat)}
                              className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg text-[11px] border transition-all duration-150 flex items-center justify-center select-none cursor-pointer focus:outline-none hover:scale-105 active:scale-95 ${seatClass}`}
                              aria-label={`Row ${seat.row} Seat ${seat.number}, ${seat.tier} tier, ${formatPrice(seat.price)}, ${isReserved ? 'Reserved' : isHeld ? 'Temporarily Held' : isSelected ? 'Selected' : 'Available'}`}
                              aria-selected={isSelected}
                              title={`${seat.id} (${tierLabel}) - ${formatPrice(seat.price)}`}
                            >
                              {isSelected ? '✓' : isHeld ? <Lock className="w-2.5 h-2.5" /> : seat.number}
                            </button>
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Right Row Letter */}
                    <span className="w-5 text-center font-bold text-xs text-slate-400 select-none">
                      {row.rowLetter}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Authentic Screen Indicator */}
        <div className="mt-14 mb-8 text-center">
          <div className="w-3/4 max-w-lg mx-auto h-1.5 rounded-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent border-t border-blue-400/30 shadow-[0_-4px_16px_rgba(59,130,246,0.15)]" />
          <p className="text-[11px] font-medium tracking-[0.25em] text-slate-400 uppercase mt-3">
            All eyes this way please
          </p>
        </div>

      </main>

      {/* 4. STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0E1017]/95 backdrop-blur-xl p-4 sm:p-5 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Seats & Subtotal info */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <div className="text-xs text-slate-400">
                {t.seats.selected} ({selectedSeats.length}):
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map(s => (
                    <span
                      key={s.id}
                      className="px-2.5 py-0.5 rounded-lg bg-[#1C1F2B] text-blue-400 border border-blue-500/30 text-xs font-mono font-bold"
                    >
                      {s.id}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic text-xs">No seats selected yet</span>
                )}
              </div>
            </div>

            <div className="sm:border-l sm:border-white/10 sm:pl-4 text-right sm:text-left">
              <div className="text-xs text-slate-400">{t.seats.subtotal}</div>
              <div className="text-xl font-black text-blue-400">
                {formatPrice(subtotal)}
              </div>
            </div>
          </div>

          {/* Checkout Proceed Action */}
          <button
            onClick={handleProceedToCheckout}
            disabled={selectedSeats.length === 0}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
              selectedSeats.length > 0
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-95'
                : 'bg-[#1C1F2B] text-slate-500 border border-white/5 cursor-not-allowed opacity-60'
            }`}
          >
            <Ticket className="w-4 h-4 fill-current" />
            <span>
              {t.seats.continueToCheckout} ({selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'})
            </span>
          </button>
        </div>
      </div>

      {/* 5. INTERSTITIAL F&B CONCESSION UPSELL MODAL */}
      <FnBUpsellModal
        isOpen={showFnbModal}
        onClose={() => setShowFnbModal(false)}
        onProceed={() => {
          setShowFnbModal(false);
          navigate('/checkout');
        }}
      />

    </div>
  );
};
