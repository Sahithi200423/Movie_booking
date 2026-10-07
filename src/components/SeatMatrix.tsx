import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Armchair,
  Clock,
  Lock,
  Tag,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Utensils,
  CreditCard,
  X,
  RefreshCw
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types & Domain Models
// ---------------------------------------------------------------------------

export type SeatTier = 'VIP_RECLINER' | 'GOLD' | 'SILVER';

export type SeatStatus = 'AVAILABLE' | 'SELECTED' | 'HELD' | 'BOOKED';

export interface SeatData {
  id: string; // e.g. "A1", "C12"
  row: string; // "A" - "J"
  number: number; // 1 - 20
  tier: SeatTier;
  price: number;
  status: SeatStatus;
  heldBy?: string;
  heldUntil?: number; // epoch ms
}

export interface FoodAddon {
  id: string;
  name: string;
  category: 'Popcorn' | 'Beverage' | 'Combo' | 'Snacks';
  price: number;
  image: string;
  quantity: number;
}

export interface SeatMatrixProps {
  showtimeId?: string;
  movieTitle?: string;
  cinemaName?: string;
  screenName?: string;
  showDate?: string;
  showTime?: string;
  currentUserId?: string;
  onProceedToCheckout?: (data: {
    selectedSeats: SeatData[];
    addons: FoodAddon[];
    breakdown: {
      subtotal: number;
      convenienceFee: number;
      gstTax: number;
      discount: number;
      total: number;
    };
    promocode?: string;
  }) => void;
}

// ---------------------------------------------------------------------------
// Seating Tiers & Pricing Configuration
// ---------------------------------------------------------------------------
const TIER_CONFIG: Record<
  SeatTier,
  { name: string; subtitle: string; price: number; badgeColor: string; rowCount: number }
> = {
  VIP_RECLINER: {
    name: 'Royal Recliners',
    subtitle: 'Plush automated recliners with food service',
    price: 380,
    badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    rowCount: 2 // Rows A, B
  },
  GOLD: {
    name: 'Prime Gold',
    subtitle: 'Optimal eye-level viewing with cushioned leather',
    price: 240,
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    rowCount: 4 // Rows C, D, E, F
  },
  SILVER: {
    name: 'Classic Silver',
    subtitle: 'Comfortable stadium seating layout',
    price: 160,
    badgeColor: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
    rowCount: 4 // Rows G, H, I, J
  }
};

const SEED_SNACKS: FoodAddon[] = [
  {
    id: 'fnb-1',
    name: 'Jumbo Butter Popcorn (Tub)',
    category: 'Popcorn',
    price: 260,
    image: '🍿',
    quantity: 0
  },
  {
    id: 'fnb-2',
    name: 'Chilled Pepsi 750ml',
    category: 'Beverage',
    price: 140,
    image: '🥤',
    quantity: 0
  },
  {
    id: 'fnb-3',
    name: 'Cheese Melt Nachos + Salsa',
    category: 'Snacks',
    price: 210,
    image: '🧀',
    quantity: 0
  },
  {
    id: 'fnb-4',
    name: 'Couple Combo (Popcorn + 2 Sodas)',
    category: 'Combo',
    price: 490,
    image: '🎟️',
    quantity: 0
  }
];

// ---------------------------------------------------------------------------
// SeatMatrix Component
// ---------------------------------------------------------------------------
export const SeatMatrix: React.FC<SeatMatrixProps> = ({
  showtimeId: _showtimeId = 'show-kalki-phoenix-1',
  movieTitle = 'Kalki 2898 AD',
  cinemaName = 'PVR INOX Megaplex, Phoenix Palladium',
  screenName = 'Screen 4 (IMAX 3D Laser with Dolby Atmos)',
  showDate = 'Today, 24 Oct',
  showTime = '07:30 PM',
  currentUserId = 'user-local-session',
  onProceedToCheckout
}) => {
  // Generate default realistic seat grid
  const initialSeats = useMemo(() => {
    const list: SeatData[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    rows.forEach((row) => {
      let tier: SeatTier = 'SILVER';
      if (row === 'A' || row === 'B') tier = 'VIP_RECLINER';
      else if (['C', 'D', 'E', 'F'].includes(row)) tier = 'GOLD';

      const seatsInRow = tier === 'VIP_RECLINER' ? 14 : 18;

      for (let num = 1; num <= seatsInRow; num++) {
        const id = `${row}${num}`;

        // Seed some random booked / held seats for realism
        const isPreBooked = (row === 'D' && [6, 7, 8].includes(num)) || (row === 'B' && [4, 5].includes(num));
        const isPreHeld = row === 'F' && [10, 11].includes(num);

        list.push({
          id,
          row,
          number: num,
          tier,
          price: TIER_CONFIG[tier].price,
          status: isPreBooked ? 'BOOKED' : isPreHeld ? 'HELD' : 'AVAILABLE',
          heldBy: isPreHeld ? 'competing-user-99' : undefined,
          heldUntil: isPreHeld ? Date.now() + 380000 : undefined
        });
      }
    });

    return list;
  }, []);

  const [seats, setSeats] = useState<SeatData[]>(initialSeats);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 4500);
  };
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [holdTimerSeconds, setHoldTimerSeconds] = useState<number>(300); // 5 minutes TTL (300s)
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [addons, setAddons] = useState<FoodAddon[]>(SEED_SNACKS);
  const [showFnbModal, setShowFnbModal] = useState<boolean>(false);
  const [promocodeInput, setPromocodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // Real-Time Concurrency Seat Hold Timer Effect (5:00 Countdown)
  // -------------------------------------------------------------------------
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerActive && holdTimerSeconds > 0) {
      interval = setInterval(() => {
        setHoldTimerSeconds((prev) => {
          if (prev <= 1) {
            // Expire hold
            setIsTimerActive(false);
            setSelectedSeatIds([]);
            setSeats((curr) =>
              curr.map((s) => (s.status === 'SELECTED' ? { ...s, status: 'AVAILABLE', heldBy: undefined } : s))
            );

            // Send backend request to release seats back to Available
            fetch('/api/bookings/release', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ showtimeId: _showtimeId, sessionId: currentUserId })
            }).catch(() => {});

            showNotice('⚠️ Checkout Time-Out: Your 5-minute reservation hold has expired. Selected seats have been released back to Available.');
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, holdTimerSeconds, _showtimeId, currentUserId]);

  // Format timer into MM:SS
  const formattedTimer = useMemo(() => {
    const mins = Math.floor(holdTimerSeconds / 60);
    const secs = holdTimerSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [holdTimerSeconds]);

  // -------------------------------------------------------------------------
  // Seat Click Handler with Concurrency Guard
  // -------------------------------------------------------------------------
  const handleSeatClick = useCallback(
    (seat: SeatData) => {
      if (seat.status === 'BOOKED') return;
      if (seat.status === 'HELD' && seat.heldBy !== currentUserId) {
        // Seat locked by someone else
        return;
      }

      const isAlreadySelected = selectedSeatIds.includes(seat.id);

      if (isAlreadySelected) {
        // Deselect
        const nextSelected = selectedSeatIds.filter((id) => id !== seat.id);
        setSelectedSeatIds(nextSelected);
        setSeats((prev) =>
          prev.map((s) => (s.id === seat.id ? { ...s, status: 'AVAILABLE', heldBy: undefined } : s))
        );

        if (nextSelected.length === 0) {
          setIsTimerActive(false);
          setHoldTimerSeconds(600);
        }
      } else {
        // Limit max 8 tickets per transaction (Standard BookMyShow rule)
        if (selectedSeatIds.length >= 8) {
          showNotice('You can select a maximum of 8 seats per booking transaction.');
          return;
        }

        const nextSelected = [...selectedSeatIds, seat.id];
        setSelectedSeatIds(nextSelected);
        setSeats((prev) =>
          prev.map((s) =>
            s.id === seat.id
              ? { ...s, status: 'SELECTED', heldBy: currentUserId, heldUntil: Date.now() + 600000 }
              : s
          )
        );

        // Start 10-minute hold timer
        if (!isTimerActive) {
          setIsTimerActive(true);
          setHoldTimerSeconds(600);
        }
      }
    },
    [selectedSeatIds, currentUserId, isTimerActive]
  );

  // -------------------------------------------------------------------------
  // Promocode Application
  // -------------------------------------------------------------------------
  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promocodeInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME50' || code === 'BMS50') {
      setAppliedPromo({ code, discount: 100 });
      setPromocodeInput('');
    } else if (code === 'BLOCKBUSTER20') {
      setAppliedPromo({ code, discount: 50 });
      setPromocodeInput('');
    } else {
      setPromoError('Invalid coupon code. Try WELCOME50 or BLOCKBUSTER20.');
    }
  };

  // -------------------------------------------------------------------------
  // Financial Calculations (18% GST + Convenience Fee)
  // -------------------------------------------------------------------------
  const financials = useMemo(() => {
    const selectedSeatObjects = seats.filter((s) => selectedSeatIds.includes(s.id));
    const subtotal = selectedSeatObjects.reduce((sum, s) => sum + s.price, 0);

    const fnbTotal = addons.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const grossTotal = subtotal + fnbTotal;

    // Convenience fee: ₹30 per seat
    const convenienceFee = selectedSeatIds.length * 30;
    // GST: 18% on convenience fee + 5% on F&B
    const gstTax = Math.round((convenienceFee * 0.18 + fnbTotal * 0.05) * 100) / 100;

    const discount = appliedPromo ? Math.min(appliedPromo.discount, grossTotal) : 0;
    const total = Math.max(0, Math.round(grossTotal + convenienceFee + gstTax - discount));

    return {
      selectedSeatObjects,
      subtotal,
      fnbTotal,
      convenienceFee,
      gstTax,
      discount,
      total
    };
  }, [seats, selectedSeatIds, addons, appliedPromo]);

  // -------------------------------------------------------------------------
  // Simulated Live Sockets Sync
  // -------------------------------------------------------------------------
  const handleRefreshMatrix = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 text-slate-100 font-sans relative">
      {/* Toast Notice Banner */}
      {toastNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#1C1F2B]/95 border border-amber-500/40 text-amber-300 shadow-2xl backdrop-blur-md text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 1. MOVIE & SHOWTIME INFO HEADER BAR */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#14161F] border border-white/10 backdrop-blur-md shadow-xl mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-600/20 text-blue-300 border border-blue-500/30">
              Now Booking
            </span>
            <span className="text-xs text-slate-400 font-medium">• IMAX 3D Experience</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            {movieTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {cinemaName} • <span className="text-zinc-300 font-medium">{screenName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#1C1F2B] border border-white/10 text-left">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Showtime</div>
            <div className="text-xs sm:text-sm font-bold text-blue-400">
              {showDate}, {showTime}
            </div>
          </div>

          <button
            onClick={handleRefreshMatrix}
            disabled={isSyncing}
            className="p-2.5 rounded-xl border border-white/10 bg-[#1C1F2B] hover:bg-[#222634] text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Refresh seat availability"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 2. HOLD COUNTDOWN BANNER (ACTIVE WHEN SEATS ARE HELD) */}
      {/* ----------------------------------------------------------------- */}
      {isTimerActive && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Seats Temporarily Locked ({selectedSeatIds.length} Selected)
              </div>
              <div className="text-xs text-slate-300">
                Guaranteed lock across all concurrent sessions. Complete payment before timer expires.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#090A0F]/80 border border-amber-500/40">
            <span className="text-xs text-slate-400 font-mono">Expires in:</span>
            <span className="text-base sm:text-lg font-black font-mono text-amber-400 tracking-wider">
              {formattedTimer}
            </span>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 3. MAIN GRID: SEAT MAP (LEFT) & BOOKING SUMMARY SIDEBAR (RIGHT) */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SEAT MAP CONTAINER (8 COLS) */}
        <div className="lg:col-span-8 p-4 sm:p-6 rounded-3xl bg-[#14161F] border border-white/10 shadow-2xl relative overflow-hidden">
          {/* A. Realistic SVG Curved Cinema Screen */}
          <div className="w-full flex flex-col items-center mb-10 pt-2">
            <div className="relative w-full max-w-lg">
              <svg viewBox="0 0 500 60" className="w-full h-12 overflow-visible">
                <defs>
                  <linearGradient id="screenCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
                  </linearGradient>
                  <filter id="screenGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <path
                  d="M 20,45 Q 250,5 480,45"
                  fill="none"
                  stroke="url(#screenCurveGrad)"
                  strokeWidth="5"
                  filter="url(#screenGlow)"
                  strokeLinecap="round"
                />
              </svg>
              {/* Screen Ambient Projection Beam */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-blue-500/10 blur-xl rounded-full pointer-events-none" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1 flex items-center gap-1.5">
              <span>All Eyes This Way</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            </span>
          </div>

          {/* B. Seat Matrix Tiers */}
          <div className="space-y-8 overflow-x-auto pb-6 scrollbar-thin">
            {(['VIP_RECLINER', 'GOLD', 'SILVER'] as SeatTier[]).map((tierKey) => {
              const tierInfo = TIER_CONFIG[tierKey];
              const tierSeats = seats.filter((s) => s.tier === tierKey);
              const distinctRows = Array.from(new Set(tierSeats.map((s) => s.row)));

              return (
                <div key={tierKey} className="min-w-[620px]">
                  {/* Tier Separator Header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${tierInfo.badgeColor}`}>
                        {tierInfo.name}
                      </span>
                      <span className="text-xs text-slate-400">{tierInfo.subtitle}</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-300">
                      ₹{tierInfo.price}.00
                    </span>
                  </div>

                  {/* Rows inside Tier */}
                  <div className="space-y-2.5">
                    {distinctRows.map((rowLetter) => {
                      const rowSeats = tierSeats.filter((s) => s.row === rowLetter);
                      const midPoint = Math.ceil(rowSeats.length / 2);

                      return (
                        <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-3">
                          {/* Row Letter Label */}
                          <span className="w-5 text-xs font-bold font-mono text-slate-500 text-center shrink-0">
                            {rowLetter}
                          </span>

                          {/* Left Wing Seats */}
                          <div className="flex items-center gap-1.5">
                            {rowSeats.slice(0, midPoint).map((seat) => renderSeatButton(seat))}
                          </div>

                          {/* Center Aisle Gap */}
                          <div className="w-6 sm:w-10 text-center text-[10px] font-mono text-slate-700">
                            │
                          </div>

                          {/* Right Wing Seats */}
                          <div className="flex items-center gap-1.5">
                            {rowSeats.slice(midPoint).map((seat) => renderSeatButton(seat))}
                          </div>

                          {/* Mirror Row Letter Label */}
                          <span className="w-5 text-xs font-bold font-mono text-slate-500 text-center shrink-0">
                            {rowLetter}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* C. Seat State Legend */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-slate-800 border border-slate-600" />
              <span>Available (Tier Colors)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-emerald-500 border border-emerald-400 shadow-md shadow-emerald-500/30" />
              <span className="font-semibold text-emerald-400">Selected (Green)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-amber-500/10 border-2 border-amber-400 text-amber-400 flex items-center justify-center text-[8px] font-black animate-pulse">
                <Lock className="w-2.5 h-2.5 text-amber-400" />
              </div>
              <span className="text-amber-400 font-medium">Held ("Being booked by another user")</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-zinc-900 border border-zinc-800 opacity-40" />
              <span className="text-zinc-500">Booked (Permanently Greyed Out)</span>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* 4. REAL-TIME BOOKING SUMMARY & PRICING SIDEBAR (4 COLS) */}
        {/* --------------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#14161F] border border-white/10 shadow-xl backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Armchair className="w-5 h-5 text-blue-400" />
                <span>Booking Summary</span>
              </h3>
              <span className="text-xs font-mono font-bold text-slate-400">
                {selectedSeatIds.length} {selectedSeatIds.length === 1 ? 'Seat' : 'Seats'}
              </span>
            </div>

            {/* Selected Seat Badges */}
            {selectedSeatIds.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {financials.selectedSeatObjects.map((s) => (
                    <div
                      key={s.id}
                      className="px-2.5 py-1 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold flex items-center gap-1.5"
                    >
                      <span>{s.id}</span>
                      <span className="text-[10px] text-blue-400/80">({s.tier.split('_')[0]})</span>
                      <button
                        onClick={() => handleSeatClick(s)}
                        className="text-blue-300 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#1C1F2B] border border-white/5 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Armchair className="w-8 h-8 text-slate-600" />
                <span>Please select seats from the layout to proceed.</span>
              </div>
            )}

            {/* F&B Trigger Banner */}
            <div className="p-4 rounded-2xl bg-[#1C1F2B] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🍿</div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Grab Popcorn & Drinks</div>
                  <div className="text-[11px] text-slate-400">
                    {financials.fnbTotal > 0
                      ? `₹${financials.fnbTotal} snacks added`
                      : 'Save up to 20% on combos'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowFnbModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-600/20"
              >
                {financials.fnbTotal > 0 ? 'Edit' : 'Add Snacks'}
              </button>
            </div>

            {/* Promocode Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                <span>Promocode / Gift Card</span>
              </label>

              {appliedPromo ? (
                <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{appliedPromo.code} (-₹{appliedPromo.discount})</span>
                  </div>
                  <button
                    onClick={() => setAppliedPromo(null)}
                    className="p-1 hover:bg-emerald-500/20 rounded-md transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promocodeInput}
                    onChange={(e) => setPromocodeInput(e.target.value.toUpperCase())}
                    placeholder="E.g. WELCOME50"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#1C1F2B] border border-white/10 text-xs font-mono uppercase text-slate-200 outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promocodeInput.trim()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-bold text-white transition-all cursor-pointer shadow-sm shadow-blue-600/20"
                  >
                    Apply
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{promoError}</span>
                </p>
              )}
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Movie</span>
                <span className="font-semibold text-slate-200">{movieTitle}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Showtime</span>
                <span className="font-semibold text-slate-200">{showDate}, {showTime}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Selected Seats</span>
                <span className="font-mono text-blue-300 font-bold">
                  {selectedSeatIds.length > 0 ? selectedSeatIds.join(', ') : 'None'}
                </span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Tickets Subtotal</span>
                <span className="font-mono text-slate-200">₹{financials.subtotal.toFixed(2)}</span>
              </div>

              {financials.fnbTotal > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Food & Beverages</span>
                  <span className="font-mono text-blue-300">₹{financials.fnbTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1">
                  <span>Convenience Fee (18% GST)</span>
                  <span title="Includes GST and booking administration charges">
                    <Info className="w-3 h-3 text-slate-500 cursor-help" />
                  </span>
                </span>
                <span className="font-mono text-slate-200">
                  ₹{(financials.convenienceFee + financials.gstTax).toFixed(2)}
                </span>
              </div>

              {financials.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-₹{financials.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-black text-white">Amount Payable</span>
                  <div className="text-[10px] text-slate-400">Includes all applicable entertainment taxes</div>
                </div>
                <span className="text-xl font-black font-mono text-blue-400">
                  ₹{financials.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Action CTA Button */}
            <button
              onClick={() => {
                if (selectedSeatIds.length === 0) {
                  showNotice('Please select at least one seat to proceed to checkout.');
                  return;
                }
                if (onProceedToCheckout) {
                  onProceedToCheckout({
                    selectedSeats: financials.selectedSeatObjects,
                    addons: addons.filter((a) => a.quantity > 0),
                    breakdown: {
                      subtotal: financials.subtotal,
                      convenienceFee: financials.convenienceFee,
                      gstTax: financials.gstTax,
                      discount: financials.discount,
                      total: financials.total
                    },
                    promocode: appliedPromo?.code
                  });
                }
              }}
              disabled={selectedSeatIds.length === 0}
              className="w-full py-4 rounded-full font-black text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Pay (₹{financials.total})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 5. FOOD & BEVERAGE MODAL */}
      {/* ----------------------------------------------------------------- */}
      {showFnbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-lg text-white">Cinema Concessions & Combos</h3>
              </div>
              <button
                onClick={() => setShowFnbModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {addons.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.image}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{item.name}</div>
                      <div className="text-[11px] font-mono text-rose-400">₹{item.price}.00</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setAddons((curr) =>
                          curr.map((a) => (a.id === item.id ? { ...a, quantity: Math.max(0, a.quantity - 1) } : a))
                        )
                      }
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-xs">{item.quantity}</span>
                    <button
                      onClick={() =>
                        setAddons((curr) =>
                          curr.map((a) => (a.id === item.id ? { ...a, quantity: a.quantity + 1 } : a))
                        )
                      }
                      className="w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowFnbModal(false)}
              className="w-full py-3 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer"
            >
              Save & Return to Seats
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------------------
  // Helper: Render Individual Interactive Seat Button
  // -------------------------------------------------------------------------
  function renderSeatButton(seat: SeatData) {
    const isSelected = selectedSeatIds.includes(seat.id);
    const isHeldByOther = seat.status === 'HELD' && seat.heldBy !== currentUserId;
    const isBooked = seat.status === 'BOOKED';

    let btnClasses =
      'w-6 h-6 sm:w-7 sm:h-7 rounded-md text-[10px] font-mono font-bold flex items-center justify-center transition-all select-none';

    if (isBooked) {
      // Permanently greyed out and unclickable
      btnClasses += ' bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed opacity-40 line-through';
    } else if (isSelected) {
      // Selected by Current User
      btnClasses +=
        ' bg-emerald-500 text-white border border-emerald-400 shadow-md shadow-emerald-500/40 scale-105 ring-2 ring-emerald-400/50 cursor-pointer';
    } else if (isHeldByOther) {
      // Disabled with a yellow border / lock icon (shows "Being booked by another user")
      btnClasses +=
        ' bg-amber-500/10 text-amber-400 font-bold border-2 border-amber-400 animate-pulse cursor-not-allowed';
    } else {
      // Clickable with standard tier colors
      const tierStyles =
        seat.tier === 'VIP_RECLINER'
          ? 'border-amber-500/50 text-amber-200 bg-amber-950/20 hover:border-amber-400 hover:bg-amber-900/40 hover:scale-110 active:scale-95'
          : seat.tier === 'GOLD'
          ? 'border-purple-500/50 text-purple-200 bg-purple-950/20 hover:border-purple-400 hover:bg-purple-900/40 hover:scale-110 active:scale-95'
          : 'border-slate-600 text-slate-200 bg-slate-800/80 hover:border-slate-300 hover:bg-slate-700 hover:scale-110 active:scale-95';

      btnClasses += ` border cursor-pointer ${tierStyles}`;
    }

    const tooltip = isBooked
      ? `${seat.id} - Booked (Sold Out)`
      : isHeldByOther
      ? `${seat.id} - Being booked by another user`
      : isSelected
      ? `${seat.id} - Selected (₹${seat.price})`
      : `${seat.id} (${seat.tier.replace('_', ' ')}) - Available ₹${seat.price}`;

    return (
      <button
        key={seat.id}
        onClick={() => handleSeatClick(seat)}
        disabled={isBooked || isHeldByOther}
        className={btnClasses}
        title={tooltip}
        aria-label={tooltip}
      >
        {isBooked ? '×' : isHeldByOther ? <Lock className="w-2.5 h-2.5 text-amber-400" /> : seat.number}
      </button>
    );
  }
};

export default SeatMatrix;
