import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Film,
  Calendar,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Trash2,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Users,
  Tag,
  Star,
  UserX,
  UserCheck,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import {
  getAdminStatsApi,
  getAdminBookingsApi,
  createAdminMovieApi,
  deleteAdminMovieApi,
  getMovies,
  getCinemas,
  verifyTicketApi,
  getAdminShowtimesApi,
  createAdminShowtimeApi,
  deleteAdminShowtimeApi,
  getAdminUsersApi,
  toggleAdminUserBlockApi,
  getAdminCouponsApi,
  createAdminCouponApi,
  deleteAdminCouponApi,
  getAdminReviewsApi,
  deleteAdminReviewApi
} from '../services/api';
import type { BookingRecord, Movie, Cinema } from '../types';
import { LANGUAGES } from '../data/mockData';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, loginDemo } = useAuth();
  const { t, formatPrice, formatTime, isRTL } = useTranslation();
  const [tab, setTab] = useState<'overview' | 'movies' | 'showtimes' | 'bookings' | 'users' | 'coupons' | 'reviews' | 'scanner'>('overview');

  const [stats, setStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    confirmedCount: 0,
    cancelledCount: 0,
    totalRevenue: 0,
    ticketsSold: 0,
    availableSeats: 512,
    popularMovies: [] as Array<{ title: string; count: number; revenue: number }>,
    popularTheatres: [] as Array<{ name: string; count: number; revenue: number }>,
    showOccupancy: 25,
    activeMovies: 6,
    comingSoonMovies: 4,
    totalCinemas: 4,
    totalUsers: 3
  });

  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [cinemasList, setCinemasList] = useState<Cinema[]>([]);
  const [showtimesList, setShowtimesList] = useState<Array<{ id: string; movieId: string; cinemaId: string; date: string; time: string; format: string; hall: string }>>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Gatekeeper Scanner State
  const [scanQuery, setScanQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    valid: boolean;
    alreadyCheckedIn?: boolean;
    checkedInAt?: string;
    checkedInBy?: string;
    booking?: BookingRecord;
    message: string;
  } | null>(null);

  // New movie form state
  const [newMovie, setNewMovie] = useState({
    title: '',
    synopsis: '',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    genre: ['Action'],
    language: 'Telugu',
    languages: ['Telugu', 'Hindi', 'Tamil'],
    duration: '2h 15m',
    durationMinutes: 135,
    rating: 8.5,
    ageRating: 'UA 16+',
    releaseDate: '2026-12-01',
    status: 'now_showing' as 'now_showing' | 'coming_soon',
    director: '',
    formats: ['2D', 'IMAX']
  });

  // New showtime form state
  const [newShowtime, setNewShowtime] = useState({
    movieId: '',
    cinemaId: '',
    date: '2026-10-05',
    time: '04:30 PM',
    format: 'IMAX 3D',
    hall: 'Screen 1 IMAX'
  });

  // New coupon form state
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'fixed' as 'fixed' | 'percentage',
    discountValue: 50,
    minSubtotal: 200
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await getAdminStatsApi();
      if (statsRes.success) setStats(statsRes.stats);

      const allBookings = await getAdminBookingsApi();
      setBookings(allBookings);

      const allMovies = await getMovies();
      setMoviesList(allMovies);
      if (allMovies.length > 0 && !newShowtime.movieId) {
        setNewShowtime(prev => ({ ...prev, movieId: allMovies[0].id }));
      }

      const allCinemas = await getCinemas();
      setCinemasList(allCinemas);
      if (allCinemas.length > 0 && !newShowtime.cinemaId) {
        setNewShowtime(prev => ({ ...prev, cinemaId: allCinemas[0].id }));
      }

      const showsRes = await getAdminShowtimesApi();
      if (showsRes.success) {
        setShowtimesList(showsRes.showtimes);
      }

      const usersRes = await getAdminUsersApi();
      if (usersRes.success) {
        setUsersList(usersRes.users);
      }

      const couponsRes = await getAdminCouponsApi();
      if (couponsRes.success) {
        setCouponsList(couponsRes.coupons);
      }

      const reviewsRes = await getAdminReviewsApi();
      if (reviewsRes.success) {
        setReviewsList(reviewsRes.reviews);
      }
    } catch (err) {
      console.warn('Admin fetch notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAdmin]);

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovie.title || !newMovie.director) {
      setFeedback({ type: 'error', message: 'Title and director are required.' });
      return;
    }

    try {
      await createAdminMovieApi(newMovie);
      setFeedback({ type: 'success', message: `Movie "${newMovie.title}" added to catalogue successfully!` });
      loadData();
      setNewMovie({
        title: '',
        synopsis: '',
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
        genre: ['Action'],
        language: 'Telugu',
        languages: ['Telugu', 'Hindi', 'Tamil'],
        duration: '2h 15m',
        durationMinutes: 135,
        rating: 8.5,
        ageRating: 'UA 16+',
        releaseDate: '2026-12-01',
        status: 'now_showing',
        director: '',
        formats: ['2D', 'IMAX']
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to add movie.' });
    }
  };

  const handleDeleteMovie = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this movie from catalogue?')) return;
    try {
      await deleteAdminMovieApi(id);
      setFeedback({ type: 'success', message: 'Movie removed successfully.' });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to remove movie.' });
    }
  };

  const handleCreateShowtime = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminShowtimeApi(newShowtime);
      setFeedback({ type: 'success', message: 'Showtime scheduled successfully!' });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to create showtime.' });
    }
  };

  const handleDeleteShowtime = async (id: string) => {
    if (!window.confirm('Delete this showtime schedule?')) return;
    try {
      await deleteAdminShowtimeApi(id);
      setFeedback({ type: 'success', message: 'Showtime schedule deleted.' });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete showtime.' });
    }
  };

  const handleToggleUserBlock = async (userId: string) => {
    try {
      const res = await toggleAdminUserBlockApi(userId);
      setFeedback({ type: 'success', message: `User status updated to ${res.blocked ? 'BLOCKED' : 'ACTIVE'}.` });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update user status.' });
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    try {
      await createAdminCouponApi(newCoupon);
      setFeedback({ type: 'success', message: `Coupon code "${newCoupon.code}" created successfully!` });
      setNewCoupon({ code: '', description: '', discountType: 'fixed', discountValue: 50, minSubtotal: 200 });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to create coupon.' });
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await deleteAdminCouponApi(code);
      setFeedback({ type: 'success', message: `Coupon "${code}" deleted.` });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete coupon.' });
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Delete this user review?')) return;
    try {
      await deleteAdminReviewApi(id);
      setFeedback({ type: 'success', message: 'Review moderated and removed.' });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete review.' });
    }
  };

  const handleVerifyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanQuery.trim()) return;
    setIsScanning(true);
    setScanResult(null);
    try {
      const res = await verifyTicketApi(scanQuery.trim(), user?.name || 'Admin Officer');
      setScanResult(res);
      loadData();
    } catch (err: any) {
      setScanResult({
        success: false,
        valid: false,
        message: err.message || 'Ticket could not be validated.'
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <main
      className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50 dark:bg-[#0B0C0E] text-slate-900 dark:text-slate-100 transition-colors duration-200 ${
        isRTL ? 'rtl' : 'ltr'
      }`}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Cinema Management Control
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <span>{t.admin.title}</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {t.admin.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isAdmin && (
            <button
              onClick={() => loginDemo('admin')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" /> Switch to Admin Session
            </button>
          )}

          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-medium border animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-xs underline font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
          { id: 'scanner', label: t.admin.gatekeeper, icon: QrCode },
          { id: 'movies', label: `${t.admin.catalogue} (${moviesList.length})`, icon: Film },
          { id: 'showtimes', label: `Showtimes (${showtimesList.length})`, icon: Calendar },
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: DollarSign },
          { id: 'users', label: `Users (${usersList.length})`, icon: Users },
          { id: 'coupons', label: `Coupons (${couponsList.length})`, icon: Tag },
          { id: 'reviews', label: `Reviews (${reviewsList.length})`, icon: Star }
        ].map(item => {
          const Icon = item.icon;
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW DASHBOARD (Phase 14) */}
      {tab === 'overview' && (
        <div className="space-y-8">
          {/* Top Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">{t.admin.revenue}</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {formatPrice(stats.totalRevenue)}
              </div>
              <span className="text-[11px] text-slate-500 block">Verified transactions</span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">Total & Today Bookings</span>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-baseline gap-2">
                <span>{stats.totalBookings}</span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">({stats.todayBookings} today)</span>
              </div>
              <span className="text-[11px] text-indigo-500 dark:text-indigo-400 block">{stats.confirmedCount} active passes</span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">Tickets Sold & Occupancy</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 flex items-baseline gap-2">
                <span>{stats.ticketsSold}</span>
                <span className="text-xs font-bold text-slate-500">({stats.showOccupancy}% occ.)</span>
              </div>
              <span className="text-[11px] text-slate-500 block">{stats.availableSeats} available seats</span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">Affiliated Theatres & Users</span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 flex items-baseline gap-2">
                <span>{stats.totalCinemas}</span>
                <span className="text-xs font-bold text-slate-500">({stats.totalUsers} users)</span>
              </div>
              <span className="text-[11px] text-slate-500 block">Active cinema multiplexes</span>
            </div>
          </div>

          {/* Popular Movies & Theatres Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Movies */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <Film className="w-4 h-4 text-purple-500" /> Popular Movies by Ticket Volume
              </h3>
              {stats.popularMovies && stats.popularMovies.length > 0 ? (
                <div className="space-y-2">
                  {stats.popularMovies.map((pm, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{pm.title}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{pm.count} seats</span>
                        <span className="font-bold text-slate-800 dark:text-slate-300">{formatPrice(pm.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No movie transactions recorded yet.</p>
              )}
            </div>

            {/* Top Theatres */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" /> Top Theatres by Revenue
              </h3>
              {stats.popularTheatres && stats.popularTheatres.length > 0 ? (
                <div className="space-y-2">
                  {stats.popularTheatres.map((pt, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{pt.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">{pt.count} seats</span>
                        <span className="font-bold text-slate-800 dark:text-slate-300">{formatPrice(pt.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No theatre transactions recorded yet.</p>
              )}
            </div>
          </div>

          {/* Recent Reservations Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-200">Recent Customer Bookings</h3>
              <button onClick={() => setTab('bookings')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                View all ({bookings.length})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Movie</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Cinema / Hall</th>
                    <th className="p-3">Seats</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {bookings.slice(0, 5).map((b, idx) => (
                    <tr key={b.bookingId || (b as any).id || `recent-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-300">#{b.bookingId || (b as any).id}</td>
                      <td className="p-3 font-medium text-slate-900 dark:text-slate-200">{b.movieTitle}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{b.customer?.name || (b as any).customerName || 'Guest'}</td>
                      <td className="p-3 text-slate-500 dark:text-slate-400">{b.cinemaName} ({b.hall})</td>
                      <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                        {(b.seats || []).map(s => (typeof s === 'string' ? s : s?.id || (s as any)?.seatId || '')).join(', ') || '-'}
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-200">{formatPrice(b.totalAmount)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.checkedIn
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : b.status === 'confirmed'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                          {b.checkedIn ? 'Admitted' : b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. GATEKEEPER QR SCANNER TAB */}
      {tab === 'scanner' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{t.admin.gatekeeper}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Validate tickets at cinema turnstiles and prevent duplicate admissions.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyTicket} className="flex gap-2">
              <input
                type="text"
                value={scanQuery}
                onChange={e => setScanQuery(e.target.value.toUpperCase())}
                placeholder="Enter booking reference e.g. BMS-849204-KL..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-xs sm:text-sm font-mono focus:border-purple-500 outline-none"
              />
              <button
                type="submit"
                disabled={isScanning || !scanQuery.trim()}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
              >
                {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>{t.admin.verifyButton}</span>}
              </button>
            </form>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Quick tests:</span>
              <button
                type="button"
                onClick={() => setScanQuery('BMS-849204-KL')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-mono text-[11px] transition-colors cursor-pointer"
              >
                BMS-849204-KL
              </button>
            </div>
          </div>

          {/* Gatekeeper Result */}
          {scanResult && (
            <div
              className={`p-6 rounded-2xl border shadow-xl space-y-4 animate-fadeIn ${
                scanResult.valid && !scanResult.alreadyCheckedIn
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                  : scanResult.alreadyCheckedIn
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-800 dark:text-amber-200'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-800 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    scanResult.valid && !scanResult.alreadyCheckedIn
                      ? 'bg-emerald-600 text-white'
                      : scanResult.alreadyCheckedIn
                      ? 'bg-amber-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {scanResult.valid && !scanResult.alreadyCheckedIn ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : scanResult.alreadyCheckedIn ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <ShieldAlert className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{scanResult.message}</h4>
                  {scanResult.checkedInAt && (
                    <p className="text-[11px] opacity-75 mt-0.5">
                      Admittance verified at: {new Date(scanResult.checkedInAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>

              {scanResult.booking && (
                <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Movie</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{scanResult.booking.movieTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hall / Seats</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{scanResult.booking.hall} • {scanResult.booking.seatIds || (scanResult.booking.seats || []).map((s: any) => s.id || s).join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Showtime</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{scanResult.booking.date} at {scanResult.booking.time}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Customer</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{scanResult.booking.customerName || scanResult.booking.customer?.name}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. MOVIES CATALOGUE TAB */}
      {tab === 'movies' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* New Movie Form */}
          <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-purple-500" /> {t.admin.addMovie}
            </h3>

            <form onSubmit={handleCreateMovie} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  value={newMovie.title}
                  onChange={e => setNewMovie({ ...newMovie, title: e.target.value })}
                  placeholder="e.g. Devara: Part 1"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Director</label>
                <input
                  type="text"
                  required
                  value={newMovie.director}
                  onChange={e => setNewMovie({ ...newMovie, director: e.target.value })}
                  placeholder="e.g. Koratala Siva"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Language</label>
                  <select
                    value={newMovie.language}
                    onChange={e => setNewMovie({ ...newMovie, language: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                  >
                    {LANGUAGES.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Certification</label>
                  <select
                    value={newMovie.ageRating}
                    onChange={e => setNewMovie({ ...newMovie, ageRating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="U">U (Universal)</option>
                    <option value="UA">UA (Parental Guidance)</option>
                    <option value="UA 16+">UA 16+</option>
                    <option value="A">A (Adults Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Synopsis</label>
                <textarea
                  rows={2}
                  required
                  value={newMovie.synopsis}
                  onChange={e => setNewMovie({ ...newMovie, synopsis: e.target.value })}
                  placeholder="Plot summary..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Add Movie to Catalogue
              </button>
            </form>
          </div>

          {/* Movies List */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Live Movies ({moviesList.length})</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {moviesList.map(m => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.posterUrl}
                      alt={m.title}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2256%22%20viewBox%3D%220%200%2040%2056%22%3E%3Crect%20fill%3D%22%2315171B%22%20width%3D%2240%22%20height%3D%2256%22%2F%3E%3Ctext%20x%3D%2220%22%20y%3D%2232%22%20fill%3D%22%23C7A675%22%20font-size%3D%228%22%20text-anchor%3D%22middle%22%3ECB%3C%2Ftext%3E%3C%2Fsvg%3E';
                      }}
                      className="w-10 h-14 object-cover rounded-lg shadow"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{m.title}</h4>
                      <p className="text-[11px] text-slate-500">{m.language} • {m.duration} • {m.ageRating}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMovie(m.id)}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete Movie"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SHOWTIMES SCHEDULING TAB */}
      {tab === 'showtimes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-indigo-500" /> Schedule Showtime
            </h3>

            <form onSubmit={handleCreateShowtime} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Movie</label>
                <select
                  value={newShowtime.movieId}
                  onChange={e => setNewShowtime({ ...newShowtime, movieId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                >
                  {moviesList.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cinema Venue</label>
                <select
                  value={newShowtime.cinemaId}
                  onChange={e => setNewShowtime({ ...newShowtime, cinemaId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                >
                  {cinemasList.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newShowtime.date}
                    onChange={e => setNewShowtime({ ...newShowtime, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={newShowtime.time}
                    onChange={e => setNewShowtime({ ...newShowtime, time: e.target.value })}
                    placeholder="e.g. 07:45 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Format</label>
                  <select
                    value={newShowtime.format}
                    onChange={e => setNewShowtime({ ...newShowtime, format: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="IMAX 3D">IMAX 3D</option>
                    <option value="Dolby Atmos">Dolby Atmos</option>
                    <option value="Standard 2D">Standard 2D</option>
                    <option value="4DX">4DX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Hall</label>
                  <input
                    type="text"
                    required
                    value={newShowtime.hall}
                    onChange={e => setNewShowtime({ ...newShowtime, hall: e.target.value })}
                    placeholder="Screen 1"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Add Showtime Schedule
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Active Schedules ({showtimesList.length})</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {showtimesList.map(st => {
                const mov = moviesList.find(m => m.id === st.movieId);
                const cin = cinemasList.find(c => c.id === st.cinemaId);
                return (
                  <div
                    key={st.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{mov?.title || st.movieId}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                          {st.format}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {cin?.name || st.cinemaId} • {st.hall} • {st.date} at {formatTime(st.time)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteShowtime(st.id)}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Showtime"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. BOOKINGS AUDIT TAB */}
      {tab === 'bookings' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-200">Customer Bookings Ledger ({bookings.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">QR Token</th>
                  <th className="p-3">Movie</th>
                  <th className="p-3">Guest Contact</th>
                  <th className="p-3">Auditorium / Time</th>
                  <th className="p-3">Seats</th>
                  <th className="p-3">Total Paid</th>
                  <th className="p-3">Gate Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {bookings.map((b, idx) => (
                  <tr key={b.bookingId || (b as any).id || `ledger-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-300">#{b.bookingId || (b as any).id}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">{b.qrToken || b.bookingId || (b as any).id}</td>
                    <td className="p-3 font-medium text-slate-900 dark:text-slate-200">{b.movieTitle}</td>
                    <td className="p-3">
                      <div className="font-medium text-slate-900 dark:text-slate-200">{b.customer?.name || (b as any).customerName || 'Guest'}</div>
                      <div className="text-[11px] text-slate-500">{b.customer?.email || (b as any).customerEmail || ''}</div>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">
                      <div>{b.cinemaName}</div>
                      <div className="text-[11px] text-indigo-500 dark:text-indigo-400">{b.date} • {formatTime(b.time)}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-700 dark:text-slate-200">
                      {(b.seats || []).map(s => (typeof s === 'string' ? s : s?.id || (s as any)?.seatId || '')).join(', ') || '-'}
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{formatPrice(b.totalAmount)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.checkedIn
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : b.status === 'confirmed'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}>
                        {b.checkedIn ? 'Admitted' : b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. USERS MANAGEMENT TAB (Phase 13) */}
      {tab === 'users' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-200">Registered Accounts & Access Control ({usersList.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-mono">{u.email}</td>
                    <td className="p-3 text-slate-500">{u.phone || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.blocked
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {u.blocked ? 'BLOCKED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleToggleUserBlock(u.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ml-auto ${
                            u.blocked
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
                          }`}
                        >
                          {u.blocked ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          <span>{u.blocked ? 'Unblock' : 'Block'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. COUPONS MANAGEMENT TAB (Phase 13) */}
      {tab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-500" /> Create Promotional Offer
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. BLOCKBUSTER100"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={newCoupon.description}
                  onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  placeholder="e.g. ₹100 Flat Off on Weekend Movies"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="fixed">Fixed Flat Amount</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCoupon.discountValue}
                    onChange={e => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Minimum Subtotal (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={newCoupon.minSubtotal}
                  onChange={e => setNewCoupon({ ...newCoupon, minSubtotal: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Publish Coupon Offer
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Active Coupons ({couponsList.length})</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {couponsList.map(c => (
                <div
                  key={c.code}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        {c.code}
                      </span>
                      <span className="text-xs font-medium text-slate-900 dark:text-white">{c.description}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Discount: {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`} • Min Subtotal: ₹{c.minSubtotal || 0}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteCoupon(c.code)}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. REVIEWS MODERATION TAB (Phase 13) */}
      {tab === 'reviews' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-200">Moviegoer Feedback & Ratings ({reviewsList.length})</h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {reviewsList.map(r => (
              <div key={r.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{r.userName}</span>
                    <span className="flex items-center gap-0.5 text-amber-500 text-xs font-bold bg-amber-500/10 px-1.5 py-0.2 rounded">
                      <Star className="w-3 h-3 fill-amber-500" /> {r.rating}/10
                    </span>
                    <span className="text-[11px] text-slate-400">Movie ID: #{r.movieId}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{r.comment}</p>
                  <span className="text-[10px] text-slate-400 block">{new Date(r.createdAt).toLocaleString()}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteReview(r.id)}
                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Moderate / Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminPage;
