import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
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
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  Box,
  LayoutGrid
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useTranslation } from '../context/LanguageContext';
import { useMovieBackdropColor } from '../hooks/useMovieBackdropColor';
import { generateSeatLayout, SEAT_PRICING, SEAT_TIER_LABELS, MOVIES, CINEMAS } from '../data/mockData';
import type { Seat } from '../types';
import { getSeatsWithCountsForShow, holdSeatsApi, releaseSeatsHoldApi, getSocketBaseUrl, getShowtimeByIdApi } from '../services/api';
import { generateCanonicalShowtimeId, parseShowtimeId, formatToISODate } from '../utils/dateUtils';
import { io } from 'socket.io-client';
import { FnBUpsellModal } from '../components/FnBUpsellModal';
import { IS_PORTFOLIO_DEMO_MODE } from '../config/demoMode';

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
  const [searchParams] = useSearchParams();
  const { activeBooking, toggleSeat, setSeats, sessionId, setActiveMovieAndShowtime } = useBooking();
  const { t, formatPrice, formatTime, isRTL } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [seatFetchError, setSeatFetchError] = useState<string | null>(null);
  const [backendSeats, setBackendSeats] = useState<Record<string, Seat>>({});
  const [serverAvailability, setServerAvailability] = useState<{
    totalSeats: number;
    availableCount: number;
    bookedCount: number;
    heldCount: number;
  } | null>(null);
  const [isLoadingSeats, setIsLoadingSeats] = useState(true);
  const [isHolding, setIsHolding] = useState(false);
  const isHoldingRef = useRef(false);
  const [holdExpiresAt, setHoldExpiresAt] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [showFnbModal, setShowFnbModal] = useState<boolean>(false);

  // 2D / 3D Auditorium View Mode State
  // Default to 2D on narrow mobile screens (<768px) or when prefers-reduced-motion is active
  const [viewMode, setViewMode] = useState<'3d' | '2d'>(() => {
    if (typeof window === 'undefined') return '2d';
    const isMobile = window.innerWidth < 768 || !window.matchMedia('(hover: hover)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return (isMobile || prefersReduced) ? '2d' : '3d';
  });

  // Automatically adapt viewMode when resizing between desktop and mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('2d');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Movie-adaptive ambient lighting for auditorium projector beam
  const { colors } = useMovieBackdropColor(activeBooking.movie);

  // Party Size State & Popover Modal - default closed so user immediately sees live seat dashboard
  const [partySize, setPartySize] = useState<number>(() => {
    return activeBooking.seats.length > 0 ? activeBooking.seats.length : 2;
  });
  const [showPartyModal, setShowPartyModal] = useState<boolean>(false);

  // Extract query parameter if present
  const queryShowtimeId = searchParams.get('showtimeId') || '';

  const parsedShowtime = useMemo(() => {
    return queryShowtimeId ? parseShowtimeId(queryShowtimeId) : null;
  }, [queryShowtimeId]);

  // Rehydration state if activeBooking does not match queryShowtimeId
  const needsRehydration = useMemo(() => {
    if (!queryShowtimeId) return false;
    return (
      !activeBooking.movie ||
      !activeBooking.cinema ||
      activeBooking.showtimeId !== queryShowtimeId
    );
  }, [queryShowtimeId, activeBooking.movie, activeBooking.cinema, activeBooking.showtimeId]);

  const [isRehydrating, setIsRehydrating] = useState<boolean>(needsRehydration);

  useEffect(() => {
    if (!queryShowtimeId) return;

    if (!activeBooking.movie || !activeBooking.cinema || activeBooking.showtimeId !== queryShowtimeId) {
      let isMounted = true;
      setIsRehydrating(true);

      // 1. Immediately sync known data from parsed canonical showtime ID if available
      const parsed = parseShowtimeId(queryShowtimeId);
      const immediateMovie = parsed.movieId ? MOVIES.find(m => m.id === parsed.movieId) : null;
      const immediateCinema = parsed.cinemaSlug ? CINEMAS.find(c => c.id.toLowerCase().includes(parsed.cinemaSlug!)) : null;

      if (immediateMovie && immediateCinema && (!activeBooking.movie || activeBooking.showtimeId !== queryShowtimeId)) {
        setActiveMovieAndShowtime(immediateMovie, {
          cinema: immediateCinema,
          date: parsed.date || formatToISODate(new Date()),
          time: parsed.time || '04:30 PM',
          format: 'Standard',
          hall: 'Screen 1',
          showtimeId: queryShowtimeId
        });
      }

      // 2. Fetch authoritative showtime details from backend
      getShowtimeByIdApi(queryShowtimeId)
        .then(res => {
          if (!isMounted) return;
          const st = res.show || res.showtime;
          if (res.success && st) {
            const mv = res.movie || st.movie || immediateMovie || MOVIES.find(m => m.id === st.movieId);
            const cin = res.cinema || st.theatre || st.cinema || immediateCinema || {
              id: st.cinemaId || 'cin-pvr-01',
              name: st.cinemaName || 'PVR INOX Cinemas',
              city: st.city || 'Mumbai',
              address: st.address || 'Central Mall'
            };
            if (mv) {
              setActiveMovieAndShowtime(mv, {
                cinema: cin,
                date: st.date || parsed.date || formatToISODate(new Date()),
                time: st.time || parsed.time || '04:30 PM',
                format: st.format || 'Standard',
                hall: st.hall || st.hallName || 'Screen 1',
                language: st.language || mv.language || 'Hindi',
                showtimeId: st.id || queryShowtimeId
              });
            }
          }
        })
        .catch(err => {
          console.warn('Authoritative rehydration from backend showtime API notice:', err);
        })
        .finally(() => {
          if (isMounted) setIsRehydrating(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [queryShowtimeId, activeBooking.showtimeId, activeBooking.movie, activeBooking.cinema, setActiveMovieAndShowtime]);

  // Derive stable authoritative showtimeId
  const showtimeId = useMemo(() => {
    if (queryShowtimeId) return queryShowtimeId;
    if (activeBooking.showtimeId) return activeBooking.showtimeId;
    if (activeBooking.movie && activeBooking.cinema) {
      return generateCanonicalShowtimeId(
        activeBooking.movie.id,
        activeBooking.cinema.id,
        activeBooking.date || formatToISODate(new Date()),
        activeBooking.time || '04:30 PM'
      );
    }

    return 'show-stree-2-pvr-2026-10-19-0430PM';
  }, [queryShowtimeId, activeBooking.showtimeId, activeBooking.movie?.id, activeBooking.cinema?.id, activeBooking.date, activeBooking.time]);

  // Load seats from backend & connect to real-time WebSockets with polling fallback
  useEffect(() => {
    let isMounted = true;
    async function loadSeats() {
      try {
        setSeatFetchError(null);
        const result = await getSeatsWithCountsForShow(showtimeId, sessionId);
        if (isMounted) {
          const map: Record<string, Seat> = {};
          result.seats.forEach(s => {
            map[s.id] = s;
          });
          setBackendSeats(map);
          setServerAvailability({
            totalSeats: result.totalSeats,
            availableCount: result.availableCount,
            bookedCount: result.bookedCount,
            heldCount: result.heldCount
          });

          // Reconcile user's previously selected seats against live database status
          const currentlySelected = activeBooking.seats;
          if (currentlySelected.length > 0) {
            const invalidSeats = currentlySelected.filter(s => {
              const live = map[s.id];
              return live && (live.status === 'reserved' || (live.status === 'held' && !live.heldByMe));
            });
            if (invalidSeats.length > 0) {
              const validSeats = currentlySelected.filter(s => !invalidSeats.some(inv => inv.id === s.id));
              setSeats(validSeats);
              setErrorMessage(`Seat(s) ${invalidSeats.map(s => s.id).join(', ')} are no longer available and were removed from your selection.`);
            }
          }
        }
      } catch (err: any) {
        console.warn('Backend seats fetch error:', err);
        if (isMounted) {
          setSeatFetchError(err?.message || 'Failed to sync live seat counts with database.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingSeats(false);
        }
      }
    }

    loadSeats();

    // 5s polling fallback to ensure live counts remain accurate even if socket drops
    const pollInterval = setInterval(() => {
      if (isMounted) {
        loadSeats();
      }
    }, 5000);

    // Setup Socket.io real-time connection
    let socket: any = null;
    try {
      const socketTarget = getSocketBaseUrl();
      socket = io(socketTarget, { path: '/socket.io', transports: ['websocket', 'polling'] });
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
      clearInterval(pollInterval);
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
        setSeats([]);
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
    const movie = activeBooking.movie;
    const cinema = activeBooking.cinema;
    const parsed = queryShowtimeId ? parseShowtimeId(queryShowtimeId) : null;
    const movieId = movie?.id || parsed?.movieId || 'stree-2';
    const cinemaId = cinema?.id || parsed?.cinemaSlug || 'pvr';
    const time = activeBooking.time || parsed?.time || '04:30 PM';
    const seed = `${movieId}-${cinemaId}-${time}`;
    return generateSeatLayout(seed);
  }, [activeBooking.movie?.id, activeBooking.cinema?.id, activeBooking.time, queryShowtimeId]);

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

  const selectedSeats = activeBooking.seats || [];
  const subtotal = useMemo(() => selectedSeats.reduce((sum, s) => sum + (s.price || 5), 0), [selectedSeats]);

  // Accurate seat availability counts for live dashboard
  const dashboardCounts = useMemo(() => {
    const allSeats: Seat[] = [];
    seatLayout.forEach(row => {
      row.seats.forEach(s => allSeats.push(s));
    });

    const total = serverAvailability?.totalSeats ?? (allSeats.length || 128);
    const selected = selectedSeats.length;

    let booked = 0;
    let held = 0;

    allSeats.forEach(s => {
      if (s.status === 'reserved') {
        booked++;
      } else if (s.status === 'held') {
        // Active hold in database
        held++;
      }
    });

    // If server provided authoritative counts from Supabase, prioritize them
    if (serverAvailability) {
      booked = serverAvailability.bookedCount;
      held = serverAvailability.heldCount;
    }

    // Ensure Total = Available + Booked + Active Held
    const available = Math.max(0, total - booked - held);

    return {
      total,
      available,
      booked,
      held,
      selected
    };
  }, [seatLayout, selectedSeats, serverAvailability]);

  // If user navigated directly without selecting a movie or cinema
  if (!activeBooking.movie || !activeBooking.cinema) {
    if (queryShowtimeId || isRehydrating) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50 dark:bg-[#090A0F] text-slate-900 dark:text-slate-100 transition-colors">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Restoring Your Showtime...</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading movie, cinema, and auditorium details from database.</p>
        </div>
      );
    }
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50 dark:bg-[#090A0F] text-slate-900 dark:text-slate-100 transition-colors">
        <Ticket className="w-16 h-16 text-slate-400 dark:text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.seats.sessionEmptyTitle}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
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

  const handleSeatClick = async (seat: Seat) => {
    // 1. Initial Availability Check: Notify user instead of freezing or selecting blindly
    if (isLoadingSeats) {
      setErrorMessage('Checking real-time seat availability with the cinema. Please wait a moment...');
      return;
    }

    if (seat.status === 'reserved') return;
    if (seat.status === 'held') {
      setErrorMessage('This seat is temporarily locked by another customer. Please choose an adjacent seat.');
      return;
    }

    setErrorMessage(null);
    const isAlreadySelected = selectedSeats.some(s => s.id === seat.id);

    // 1. DESELECTION: Optimistic instant removal (always permitted without waiting for hold lock)
    if (isAlreadySelected) {
      toggleSeat(seat);
      const remaining = selectedSeats.filter(s => s.id !== seat.id);
      if (remaining.length === 0) {
        setHoldExpiresAt(null);
        setIsHolding(false);
        isHoldingRef.current = false;
        releaseSeatsHoldApi(showtimeId, sessionId).catch(() => {});
      } else {
        holdSeatsApi(showtimeId, remaining.map(s => s.id), sessionId).catch(() => {});
      }
      return;
    }

    // 2. Concurrency Guard: Prevent rapid spam clicks from sending duplicate or conflicting hold requests for new seats
    if (isHoldingRef.current) {
      return;
    }

    // 2. CONTIGUOUS AUTO-SELECTION (when starting fresh with partySize > 1)
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
            // Optimistic immediate UI selection
            setSeats(candidateSeats);
            setIsHolding(true);
            isHoldingRef.current = true;
            try {
              const res = await holdSeatsApi(showtimeId, candidateSeats.map(s => s.id), sessionId, 10);
              if (res && res.expiresAt) {
                setHoldExpiresAt(res.expiresAt);
              } else {
                setSeats([]);
                setErrorMessage(res?.message || 'Selected seats could not be held. Please choose different seats.');
              }
            } catch (err: unknown) {
              setSeats([]);
              const msg = (err as Error).message || 'Unable to hold selected seats. Please choose different seats.';
              setErrorMessage(msg);
            } finally {
              setIsHolding(false);
              isHoldingRef.current = false;
            }
            return;
          }
        }
      }
    }

    // 3. SINGLE SEAT SELECTION
    if (selectedSeats.length >= 8) {
      setErrorMessage(t.seats.maxSeatsNotice);
      return;
    }

    // If user clicks beyond previous partySize, seamlessly expand partySize up to 8
    if (selectedSeats.length >= partySize) {
      setPartySize(prev => Math.min(8, prev + 1));
    }

    // Optimistic immediate UI selection
    toggleSeat(seat);
    setIsHolding(true);
    isHoldingRef.current = true;
    try {
      const nextSeatIds = [...selectedSeats.map(s => s.id), seat.id];
      const res = await holdSeatsApi(showtimeId, nextSeatIds, sessionId, 10);
      if (res && res.expiresAt) {
        setHoldExpiresAt(res.expiresAt);
      } else {
        toggleSeat(seat); // Immediately undo optimistic selection if hold was rejected
        setErrorMessage(res?.message || 'Could not lock this seat. It may have just been booked by another customer.');
      }
    } catch (err: unknown) {
      toggleSeat(seat); // Immediately undo optimistic selection on network/API failure
      const msg = (err as Error).message || 'Unable to hold this seat. Please choose another seat.';
      setErrorMessage(msg);
    } finally {
      setIsHolding(false);
      isHoldingRef.current = false;
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      setErrorMessage('Please select at least one seat to continue.');
      return;
    }

    if (isHolding) {
      setErrorMessage('Securing your seats with the cinema... Please wait a moment.');
      return;
    }

    if (!holdExpiresAt) {
      setHoldExpiresAt(Date.now() + 10 * 60 * 1000);
    }

    // Verify none of the selected seats became reserved or held by another session
    const conflicting = selectedSeats.filter(s => {
      const live = backendSeats[s.id];
      return live && (live.status === 'reserved' || (live.status === 'held' && !live.heldByMe));
    });

    if (conflicting.length > 0) {
      setErrorMessage(`Seat(s) ${conflicting.map(s => s.id).join(', ')} are no longer available. Please select different seats.`);
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
    <div className={`min-h-screen pb-64 sm:pb-40 bg-[#08090B] text-slate-100 transition-colors duration-200 ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* 1. TOP SESSION BAR */}
      <div className="border-b border-white/10 bg-[#08090B]/95 backdrop-blur-md sticky top-16 sm:top-18 z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to={`/movie/${activeBooking.movie.id}`}
              className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-[#15171B] text-[#A8ADB4] hover:text-[#F3F0E8] hover:border-[#C7A675]/40 transition-colors shrink-0"
              title="Back to showtimes"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#C7A675]" />
            </Link>
            <div>
              <h1 className="text-sm sm:text-lg font-display font-black text-[#F3F0E8] flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="truncate max-w-[170px] sm:max-w-none">{activeBooking.movie?.title || 'Stree 2'}</span>
                <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-[#C7A675]/10 text-[#C7A675] border border-[#C7A675]/25 shrink-0">
                  {activeBooking.format || 'Standard'}
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-xs text-[#A8ADB4] mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C7A675]" />
                  <span className="truncate max-w-[120px] sm:max-w-none">{activeBooking.cinema?.name || 'PVR ICON: Phoenix Palladium, Lower Parel'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C7A675]" />
                  {activeBooking.date || parsedShowtime?.date || '2026-10-19'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-[#F3F0E8]">
                  <Clock className="w-3 h-3 text-[#C7A675]" />
                  {formatTime(activeBooking.time || parsedShowtime?.time || '04:30 PM')}
                </span>
              </div>
            </div>
          </div>

          {/* View Mode, Party Size & Live Hold Timer Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
            {/* Accessible 2D / 3D Auditorium View Toggle */}
            <div
              className="flex items-center p-0.5 sm:p-1 rounded-xl bg-[#15171B] border border-white/10 text-xs shadow-sm"
              role="radiogroup"
              aria-label="Auditorium View Mode"
            >
              <button
                type="button"
                role="radio"
                aria-checked={viewMode === '3d'}
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C7A675] focus-visible:outline-none ${
                  viewMode === '3d'
                    ? 'bg-[#C7A675] text-[#08090B] font-extrabold shadow-md shadow-[#C7A675]/20'
                    : 'text-[#A8ADB4] hover:text-[#F3F0E8] hover:bg-white/5'
                }`}
                title="Switch to 3D Cinematic Auditorium view"
              >
                <Box className="w-3.5 h-3.5 text-current" />
                <span>3D View</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={viewMode === '2d'}
                onClick={() => setViewMode('2d')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C7A675] focus-visible:outline-none ${
                  viewMode === '2d'
                    ? 'bg-[#C7A675] text-[#08090B] font-extrabold shadow-md shadow-[#C7A675]/20'
                    : 'text-[#A8ADB4] hover:text-[#F3F0E8] hover:bg-white/5'
                }`}
                title="Switch to 2D Classic Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-current" />
                <span>2D Grid</span>
              </button>
            </div>

            {/* Party Size Selector Trigger */}
            <button
              type="button"
              onClick={() => setShowPartyModal(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/10 bg-[#15171B] hover:bg-[#1B1E24] hover:border-[#C7A675]/30 text-xs font-semibold text-[#F3F0E8] transition-colors cursor-pointer"
            >
              <span className="text-sm sm:text-base">{currentPartyOption.icon}</span>
              <span>{partySize} {partySize === 1 ? 'Ticket' : 'Tickets'}</span>
              <span className="text-[#C7A675] text-[10px] sm:text-[11px] underline">Change</span>
            </button>

            {isHolding && (
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#C7A675]/40 bg-[#C7A675]/10 text-[#C7A675] text-xs font-semibold animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C7A675]" />
                <span className="hidden sm:inline">Holding...</span>
              </div>
            )}

            {secondsRemaining !== null && secondsRemaining > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-semibold animate-pulse">
                <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>{formatTimerDisplay(secondsRemaining)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. PARTY SIZE SELECTOR MODAL / POPOVER */}
      {showPartyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#15171B] border border-[#C7A675]/30 rounded-3xl p-6 shadow-2xl text-center space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="text-left">
                <h3 className="text-lg font-display font-bold text-[#F3F0E8] tracking-tight">How Many Seats?</h3>
                <p className="text-xs text-[#A8ADB4]">Select number of tickets to book</p>
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
              <div className="text-sm font-bold text-[#F3F0E8]">{currentPartyOption.label}</div>
              <div className="text-xs text-[#A8ADB4]">{partySize} {partySize === 1 ? 'Seat' : 'Seats'}</div>
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
                      ? 'bg-[#C7A675] text-[#08090B] font-extrabold shadow-lg shadow-[#C7A675]/40 scale-110 ring-2 ring-[#C7A675]'
                      : 'bg-[#1B1E24] text-slate-300 border border-white/10 hover:border-[#C7A675] hover:text-[#C7A675]'
                  }`}
                >
                  {opt.count}
                </button>
              ))}
            </div>

            {/* Tier Pricing Guide */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 text-left">
              <div className="p-2.5 rounded-xl border border-white/10 bg-[#1B1E24]">
                <div className="text-[10px] uppercase font-bold text-[#C7A675]">Royal Recliner</div>
                <div className="text-xs font-black text-white mt-0.5">{formatPrice(SEAT_PRICING.VIP)}</div>
                <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">Available</div>
              </div>
              <div className="p-2.5 rounded-xl border border-white/10 bg-[#1B1E24]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Club / Prime</div>
                <div className="text-xs font-black text-white mt-0.5">{formatPrice(SEAT_PRICING.PREMIUM)}</div>
                <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">Available</div>
              </div>
              <div className="p-2.5 rounded-xl border border-white/10 bg-[#1B1E24]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Executive</div>
                <div className="text-xs font-black text-white mt-0.5">{formatPrice(SEAT_PRICING.STANDARD)}</div>
                <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">Available</div>
              </div>
            </div>

            {/* Select Seats CTA */}
            <button
              type="button"
              onClick={() => setShowPartyModal(false)}
              className="w-full py-3.5 rounded-full bg-[#C7A675] hover:bg-[#DFC49D] text-[#08090B] font-extrabold text-sm shadow-xl shadow-[#C7A675]/30 transition-all cursor-pointer"
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
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Seat API Sync Error & Retry Banner */}
        {seatFetchError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <div className="font-bold text-white">Live Seat Data Synchronization Error</div>
                <div className="text-xs text-rose-300 mt-0.5">{seatFetchError}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsLoadingSeats(true);
                setSeatFetchError(null);
                getSeatsWithCountsForShow(showtimeId, sessionId)
                  .then(result => {
                    const map: Record<string, Seat> = {};
                    result.seats.forEach(s => {
                      map[s.id] = s;
                    });
                    setBackendSeats(map);
                    setServerAvailability({
                      totalSeats: result.totalSeats,
                      availableCount: result.availableCount,
                      bookedCount: result.bookedCount,
                      heldCount: result.heldCount
                    });
                  })
                  .catch(err => {
                    setSeatFetchError(err?.message || 'Failed to sync live seat counts with database.');
                  })
                  .finally(() => {
                    setIsLoadingSeats(false);
                  });
              }}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer transition-all shadow-md active:scale-95 shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Live Loading State */}
        {isLoadingSeats && (
          <div className="mb-4 py-2.5 px-4 rounded-xl border border-[#C7A675]/30 bg-[#C7A675]/10 text-[#C7A675] text-xs flex items-center justify-center gap-2.5 animate-pulse shadow-md">
            <div className="w-3.5 h-3.5 border-2 border-[#C7A675] border-t-transparent rounded-full animate-spin" />
            <span className="font-medium tracking-wide">Syncing live seat availability with cinema database...</span>
          </div>
        )}

        {/* Portfolio Demo Illustrative Disclaimer */}
        {IS_PORTFOLIO_DEMO_MODE && (
          <div className="mb-4 py-2 px-3.5 rounded-xl border border-[#C7A675]/30 bg-[#C7A675]/10 text-xs text-[#DFC49D] flex items-center justify-between gap-2 shadow-sm font-sans">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#C7A675]" />
              <strong>Portfolio Demo Mode:</strong> Displayed seat availability and selections are illustrative for demonstration.
            </span>
            <span className="text-[10px] font-mono font-bold bg-[#C7A675]/20 text-[#DFC49D] px-2 py-0.5 rounded-md border border-[#C7A675]/40 hidden sm:inline">
              ISOLATED SIMULATION
            </span>
          </div>
        )}

        {/* 1. SEAT AVAILABILITY DASHBOARD */}
        <div className="mb-4 sm:mb-6 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3" aria-label="Seat availability summary">
          {/* TOTAL SEATS */}
          <div className="p-2.5 sm:p-3.5 rounded-2xl border border-white/10 bg-[#15171B] flex flex-col items-center justify-center text-center shadow-md">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Armchair className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
              <span>Total Seats</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#F3F0E8] mt-0.5 sm:mt-1 flex items-center justify-center min-h-[28px] sm:min-h-[32px]">
              {isLoadingSeats && !serverAvailability ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-slate-400" />
              ) : (
                dashboardCounts.total
              )}
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Hall Capacity</div>
          </div>

          {/* AVAILABLE SEATS */}
          <div className="p-2.5 sm:p-3.5 rounded-2xl border border-[#C7A675]/40 bg-[#C7A675]/10 flex flex-col items-center justify-center text-center shadow-md shadow-[#C7A675]/10">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#C7A675] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C7A675] animate-pulse" />
              <span>Available Seats</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#C7A675] mt-0.5 sm:mt-1 flex items-center justify-center min-h-[28px] sm:min-h-[32px]">
              {isLoadingSeats && !serverAvailability ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#C7A675]" />
              ) : (
                dashboardCounts.available
              )}
            </div>
            <div className="text-[9px] sm:text-[10px] text-[#C7A675]/80 font-medium">Ready to Book</div>
          </div>

          {/* MY SELECTED SEATS */}
          <div className="p-2.5 sm:p-3.5 rounded-2xl border border-[#C7A675]/70 bg-[#C7A675]/25 flex flex-col items-center justify-center text-center shadow-md shadow-[#C7A675]/20">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#C7A675] uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C7A675]" />
              <span>My Selected Seats</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#F3F0E8] mt-0.5 sm:mt-1 flex items-center justify-center min-h-[28px] sm:min-h-[32px]">
              {dashboardCounts.selected}
            </div>
            <div className="text-[9px] sm:text-[10px] text-[#C7A675] font-semibold">In Your Order</div>
          </div>

          {/* TEMPORARILY HELD */}
          <div className="p-2.5 sm:p-3.5 rounded-2xl border border-amber-500/50 bg-amber-950/30 flex flex-col items-center justify-center text-center shadow-md shadow-amber-950/20">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span>Temporarily Held</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5 sm:mt-1 flex items-center justify-center min-h-[28px] sm:min-h-[32px]">
              {isLoadingSeats && !serverAvailability ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-amber-400" />
              ) : (
                dashboardCounts.held
              )}
            </div>
            <div className="text-[9px] sm:text-[10px] text-amber-400/80 font-medium">Other Guests</div>
          </div>

          {/* BOOKED SEATS */}
          <div className="col-span-2 sm:col-span-1 p-2.5 sm:p-3.5 rounded-2xl border border-rose-500/50 bg-rose-950/30 flex flex-col items-center justify-center text-center shadow-md shadow-rose-950/20">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-rose-400 uppercase tracking-wider">
              <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />
              <span>Booked Seats</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-400 mt-0.5 sm:mt-1 flex items-center justify-center min-h-[28px] sm:min-h-[32px]">
              {isLoadingSeats && !serverAvailability ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-rose-400" />
              ) : (
                dashboardCounts.booked
              )}
            </div>
            <div className="text-[9px] sm:text-[10px] text-rose-400/80 font-medium">Sold Out</div>
          </div>
        </div>

        {/* 2. VISIBLE COLOR LEGEND BAR */}
        <div className="mb-4 sm:mb-6 p-2.5 sm:p-3.5 rounded-2xl border border-white/10 bg-[#15171B] flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs shadow-md">
          {/* Available */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#1B1E24] border border-white/20 flex items-center justify-center text-[10px] text-[#A8ADB4] font-bold" />
            <span className="text-[#A8ADB4] font-semibold">{t.seats.available}</span>
          </div>
          {/* Selected */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#C7A675] text-[#08090B] font-extrabold border border-[#DFC49D] shadow-md shadow-[#C7A675]/40 flex items-center justify-center text-[10px]">
              ✓
            </div>
            <span className="text-[#C7A675] font-bold">{t.seats.selected}</span>
          </div>
          {/* Temporarily Held */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-amber-950/60 border border-amber-500/70 text-amber-300 flex items-center justify-center text-[10px]">
              <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
            </div>
            <span className="text-amber-400 font-medium">{t.seats.held}</span>
          </div>
          {/* Booked / Sold */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-rose-950/60 border border-rose-700/70 text-rose-300 flex items-center justify-center text-[10px] font-bold">
              ✕
            </div>
            <span className="text-rose-400 font-medium">Booked / Sold</span>
          </div>
        </div>

        {/* Mobile Swipe Cue */}
        <div className="md:hidden flex items-center justify-center gap-1.5 py-1.5 px-3 mb-3 rounded-full bg-[#C7A675]/10 border border-[#C7A675]/25 text-[#C7A675] text-xs font-semibold animate-pulse">
          <span>⇄ Swipe sideways to view all 16 seats in each row</span>
        </div>

        {/* 3. CURVED CINEMA SCREEN WITH PROJECTOR BEAM & ATMOSPHERIC DEPTH */}
        <div className="relative w-full max-w-2xl mx-auto my-6 sm:my-8 text-center select-none">
          {/* Movie-Adaptive Projector Light Beam Fan */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-xl h-24 sm:h-32 opacity-35 pointer-events-none blur-2xl transition-all duration-700"
            style={{
              background: `radial-gradient(ellipse 65% 55% at 50% 0%, ${colors.primary || '#C7A675'} 0%, ${colors.glow || 'rgba(199,166,117,0.3)'} 40%, transparent 80%)`,
            }}
            aria-hidden="true"
          />

          {/* Curved Screen Architectural Arc */}
          <div className="relative px-4">
            <svg
              viewBox="0 0 500 50"
              className="w-full max-w-lg mx-auto h-8 sm:h-12 overflow-visible drop-shadow-[0_4px_16px_rgba(199,166,117,0.35)]"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="screenCurvedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(199,166,117,0.2)" />
                  <stop offset="20%" stopColor="rgba(223,196,157,0.85)" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="80%" stopColor="rgba(223,196,157,0.85)" />
                  <stop offset="100%" stopColor="rgba(199,166,117,0.2)" />
                </linearGradient>
                <filter id="screenGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M 15,40 Q 250,5 485,40"
                fill="none"
                stroke="url(#screenCurvedGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#screenGlow)"
              />
            </svg>

            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-[10px] sm:text-[11px] font-display font-black tracking-[0.25em] uppercase text-[#F3F0E8] drop-shadow-sm">
                CINEMA SCREEN
              </span>
              <span className="text-[9px] text-[#A8ADB4] font-semibold tracking-wider uppercase hidden sm:inline">
                • Front of Auditorium
              </span>
            </div>
          </div>
        </div>

        {/* 4. CINEMA AUDITORIUM SEATING GRID (3D CINEMATIC OR 2D CLASSIC) */}
        <div className="overflow-x-auto touch-pan-x no-scrollbar pb-8 overscroll-x-contain">
          <div
            className={`w-max min-w-full mx-auto px-4 flex flex-col items-center transition-all duration-500 ease-out ${
              viewMode === '3d' ? 'perspective-1000' : ''
            }`}
          >
            <div
              className={`min-w-[620px] sm:min-w-[680px] flex flex-col items-center space-y-2.5 sm:space-y-3.5 transition-all duration-500 ease-out ${
                viewMode === '3d' ? 'origin-top preserve-3d' : ''
              }`}
              style={
                viewMode === '3d'
                  ? {
                      transform: 'rotateX(14deg) scale(0.97)',
                      transformStyle: 'preserve-3d',
                    }
                  : undefined
              }
              role="grid"
              aria-label={`Cinema auditorium seating arrangement (${viewMode === '3d' ? '3D Cinematic View' : '2D Classic Grid'})`}
            >
              {seatLayout.map((row, rowIndex) => {
                const prevRow = rowIndex > 0 ? seatLayout[rowIndex - 1] : null;
                const isFirstOfTier = !prevRow || prevRow.tier !== row.tier;
                const tierLabel = SEAT_TIER_LABELS[row.tier] || row.tier;
                const tierPrice = SEAT_PRICING[row.tier] || 5;
                const isVIP = row.tier === 'VIP';

                return (
                  <React.Fragment key={row.rowLetter}>
                    {/* Tier Separator Header */}
                    {isFirstOfTier && (
                      <div className="w-full max-w-2xl flex items-center justify-between pt-5 pb-2 border-b border-white/10 text-xs">
                        <span className="font-bold text-[#F3F0E8] tracking-widest uppercase flex items-center gap-2">
                          {isVIP && <Armchair className="w-3.5 h-3.5 text-[#C7A675]" />}
                          {tierLabel}
                        </span>
                        <span className="font-bold text-[#C7A675] font-mono">
                          {formatPrice(tierPrice)}
                        </span>
                      </div>
                    )}

                    {/* Seat Row */}
                    <div className="flex items-center gap-3 scroll-mb-36" style={viewMode === '3d' ? { transformStyle: 'preserve-3d' } : undefined} role="row">
                      {/* Left Row Letter */}
                      <span className="w-5 text-center font-bold text-xs text-[#A8ADB4] select-none font-mono">
                        {row.rowLetter}
                      </span>

                      {/* Seats with central aisle gap */}
                      <div className="flex items-center gap-1.5 sm:gap-2" style={viewMode === '3d' ? { transformStyle: 'preserve-3d' } : undefined}>
                        {row.seats.map(seat => {
                          const isSelected = selectedSeats.some(s => s.id === seat.id);
                          const isReserved = seat.status === 'reserved';
                          const isHeld = seat.status === 'held' && !isSelected;

                          let seatClass = '';
                          if (isSelected) {
                            // Champagne luxury selected with glowing halo
                            seatClass =
                              'bg-[#C7A675] text-[#08090B] font-extrabold border-[#DFC49D] shadow-[0_0_18px_rgba(199,166,117,0.7)] scale-105 ring-2 ring-[#C7A675]/80';
                          } else if (isReserved) {
                            // Booked / Sold: Red/ruby, disabled
                            seatClass =
                              'bg-rose-950/60 text-rose-300 border-rose-700/60 cursor-not-allowed opacity-90 shadow-sm shadow-rose-950/40';
                          } else if (isHeld) {
                            // Temporarily Held: Amber / yellow with lock icon, disabled
                            seatClass =
                              'bg-amber-950/60 text-amber-300 border-amber-500/70 cursor-not-allowed opacity-90 shadow-sm shadow-amber-950/40';
                          } else {
                            // Available: Obsidian/Charcoal with subtle champagne metallic border highlights
                            if (seat.tier === 'VIP') {
                              seatClass =
                                'bg-[#15171B] text-[#C7A675] border-[#C7A675]/40 hover:border-[#C7A675] hover:bg-[#C7A675]/15 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#C7A675] shadow-sm';
                            } else if (seat.tier === 'PREMIUM') {
                              seatClass =
                                'bg-[#15171B] text-[#F3F0E8] border-white/15 hover:border-[#C7A675] hover:bg-[#C7A675]/10 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#C7A675] shadow-sm';
                            } else {
                              seatClass =
                                'bg-[#111317] text-[#A8ADB4] border-white/10 hover:border-[#C7A675] hover:bg-[#C7A675]/10 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#C7A675] shadow-sm';
                            }
                          }

                          return (
                            <React.Fragment key={seat.id}>
                              {/* Realistic Central Walking Aisle gap between seat 8 and 9 */}
                              {seat.number === 9 && (
                                <div className="w-6 sm:w-10 text-center select-none" aria-hidden="true">
                                  <span className="text-[9px] text-[#71767F] font-mono tracking-widest hidden sm:inline">AISLE</span>
                                </div>
                              )}

                              <button
                                type="button"
                                role="gridcell"
                                disabled={isReserved || isHeld}
                                onClick={() => handleSeatClick(seat)}
                                data-cursor={isSelected ? 'DESELECT' : isReserved ? 'BOOKED' : isHeld ? 'HELD' : 'SELECT'}
                                className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg text-[11px] border transition-all duration-150 flex items-center justify-center select-none cursor-pointer focus:outline-none hover:scale-105 active:scale-95 pointer-events-auto relative z-10 btn-tactile ${seatClass}`}
                                style={
                                  viewMode === '3d'
                                    ? {
                                        transform: isSelected ? 'translateZ(14px)' : 'translateZ(3px)',
                                        transformStyle: 'preserve-3d',
                                      }
                                    : undefined
                                }
                                aria-label={`Row ${seat.row} Seat ${seat.number}, ${seat.tier} tier, ${formatPrice(seat.price)}, ${isReserved ? 'Booked/Sold' : isHeld ? 'Temporarily Held' : isSelected ? 'Selected' : 'Available'}`}
                                aria-selected={isSelected}
                                title={`${seat.id} (${tierLabel}) - ${formatPrice(seat.price)} [${isReserved ? 'Booked/Sold' : isHeld ? 'Temporarily Held' : isSelected ? 'Selected' : 'Available'}]`}
                              >
                                {isSelected ? (
                                  '✓'
                                ) : isReserved ? (
                                  <span className="text-[10px] text-rose-300 font-black">✕</span>
                                ) : isHeld ? (
                                  <Lock className="w-2.5 h-2.5 text-amber-300" />
                                ) : (
                                  seat.number
                                )}
                              </button>
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* Right Row Letter */}
                      <span className="w-5 text-center font-bold text-xs text-[#A8ADB4] select-none font-mono">
                        {row.rowLetter}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rear Auditorium Floor Ambient Guide */}
        <div className="mt-8 mb-6 text-center">
          <div className="w-3/4 max-w-lg mx-auto h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#C7A675]/25 to-transparent" />
        </div>

      </main>

      {/* 4. STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#C7A675]/20 bg-[#08090B]/95 backdrop-blur-xl p-3 sm:p-5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-10px_35px_rgba(0,0,0,0.8)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Seats & Subtotal info */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="max-w-[65%] sm:max-w-none">
              <div className="text-[11px] sm:text-xs text-[#A8ADB4]">
                {t.seats.selected} ({selectedSeats.length}):
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#F3F0E8] flex items-center gap-1 sm:gap-1.5 flex-wrap max-h-12 overflow-y-auto no-scrollbar">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map(s => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded-md bg-[#15171B] text-[#C7A675] border border-[#C7A675]/30 text-[11px] sm:text-xs font-mono font-bold"
                    >
                      {s.id}
                    </span>
                  ))
                ) : (
                  <span className="text-[#71767F] italic text-xs">No seats selected yet</span>
                )}
              </div>
            </div>

            <div className="sm:border-l sm:border-white/10 sm:pl-4 text-right sm:text-left shrink-0">
              <div className="text-[11px] sm:text-xs text-[#A8ADB4]">{t.seats.subtotal}</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-[#C7A675]">
                {formatPrice(subtotal)}
              </div>
            </div>
          </div>

          {/* Checkout Proceed Action */}
          <button
            onClick={handleProceedToCheckout}
            disabled={selectedSeats.length === 0 || isHolding}
            data-cursor={selectedSeats.length > 0 ? 'CHECKOUT' : undefined}
            className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer shrink-0 btn-tactile ${
              selectedSeats.length > 0 && !isHolding
                ? 'bg-[#C7A675] hover:bg-[#DFC49D] text-[#08090B] shadow-[#C7A675]/30 active:scale-95'
                : 'bg-[#15171B] text-[#71767F] border border-white/5 cursor-not-allowed opacity-60'
            }`}
          >
            {isHolding ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#08090B]" />
            ) : (
              <Ticket className="w-4 h-4 fill-current" />
            )}
            <span>
              {isHolding
                ? 'Securing Seats...'
                : selectedSeats.length === 0
                ? 'Select Seats to Proceed'
                : `${t.seats.continueToCheckout} (${selectedSeats.length} ${selectedSeats.length === 1 ? 'ticket' : 'tickets'})`}
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
