import type { Movie, Cinema, Seat, BookingRecord, User, CancellationAuditLog } from '../types';
import { MOVIES, CINEMAS } from '../data/mockData';

const DEFAULT_RENDER_API = 'https://cinebook-backend-as00.onrender.com/api';
const envApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const rawApiUrl = envApiUrl || (import.meta.env.PROD ? DEFAULT_RENDER_API : '/api');

// Normalize API_BASE:
// Automatically handles full URLs with or without /api, trailing slashes, or relative paths
export const getNormalizedApiBase = (url: string): string => {
  if (!url || url === '/api' || url === '/api/') return '/api';
  let clean = url.replace(/\/+$/, '');
  if (!clean.startsWith('http://') && !clean.startsWith('https://') && !clean.startsWith('/')) {
    clean = `https://${clean}`;
  }
  if (!clean.endsWith('/api')) {
    clean = `${clean}/api`;
  }
  return clean;
};

export const API_BASE = getNormalizedApiBase(rawApiUrl);

// Get root origin for WebSocket (Socket.io)
export const getSocketBaseUrl = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  if (!API_BASE.startsWith('http')) return undefined; // relative path uses current window origin
  try {
    return new URL(API_BASE).origin;
  } catch {
    return undefined;
  }
};

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'error';
  ok: boolean;
  database?: string;
  service?: string;
  version?: string;
  timestamp?: string;
}

export async function checkHealthApi(): Promise<HealthStatus> {
  return apiRequest<HealthStatus>('/health');
}

// Helper for resilient fetch
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('cinebook_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const text = await res.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON response payload
    }
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return (data || {}) as T;
}

// ----------------- MOVIES API -----------------
export async function getMovies(filters?: {
  language?: string;
  genre?: string;
  city?: string;
  status?: string;
  search?: string;
}): Promise<Movie[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.language && filters.language !== 'All Languages') params.append('language', filters.language);
    if (filters?.genre && filters.genre !== 'All Genres') params.append('genre', filters.genre);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest<{ success: boolean; movies: Movie[] }>(`/movies${query}`);
    return res.movies;
  } catch (err) {
    console.warn('[API] Fallback to local movie dataset:', (err as Error).message);
    // Offline / fallback filter
    return MOVIES.filter(movie => {
      if (filters?.language && filters.language !== 'All Languages') {
        const hasLang = movie.languages.some(l => l.toLowerCase() === filters.language!.toLowerCase()) ||
          movie.language.toLowerCase() === filters.language!.toLowerCase();
        if (!hasLang) return false;
      }
      if (filters?.genre && filters.genre !== 'All Genres') {
        if (!movie.genre.some(g => g.toLowerCase() === filters.genre!.toLowerCase())) return false;
      }
      if (filters?.status && movie.status !== filters.status) {
        return false;
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        return (
          movie.title.toLowerCase().includes(q) ||
          movie.director.toLowerCase().includes(q) ||
          movie.genre.some(g => g.toLowerCase().includes(q)) ||
          movie.cast.some(c => c.name.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }
}

export async function getMovieById(id: string): Promise<Movie | null> {
  try {
    const res = await apiRequest<{ success: boolean; movie: Movie }>(`/movies/${id}`);
    return res.movie;
  } catch (err) {
    console.warn('[API] Fallback to local movie item:', (err as Error).message);
    return MOVIES.find(m => m.id === id) || null;
  }
}

// ----------------- CINEMAS API -----------------
export async function getCinemas(city?: string): Promise<Cinema[]> {
  try {
    const query = city ? `?city=${encodeURIComponent(city)}` : '';
    const res = await apiRequest<{ success: boolean; cinemas: Cinema[] }>(`/cinemas${query}`);
    return res.cinemas;
  } catch (err) {
    return CINEMAS.filter(c => !city || (c.city && c.city.toLowerCase() === city.toLowerCase()));
  }
}

// ----------------- SHOWTIMES RESOLVER API -----------------
export async function resolveShowtimeApi(payload: {
  movieId: string;
  movieTitle?: string;
  cinemaId: string;
  cinemaName?: string;
  city?: string;
  address?: string;
  date: string;
  time: string;
  format?: string;
  hall?: string;
  language?: string;
}) {
  return await apiRequest<{
    success: boolean;
    showtimeId: string;
    showtime: any;
  }>('/shows/resolve', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// ----------------- SEATS API -----------------
export interface SeatAvailabilityResult {
  seats: Seat[];
  totalSeats: number;
  availableCount: number;
  bookedCount: number;
  heldCount: number;
}

export async function getSeatsForShow(showtimeId: string, sessionId?: string): Promise<Seat[]> {
  const res = await getSeatsWithCountsForShow(showtimeId, sessionId);
  return res.seats;
}

export async function getSeatsWithCountsForShow(showtimeId: string, sessionId?: string): Promise<SeatAvailabilityResult> {
  try {
    const q = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : '';
    const res = await apiRequest<{
      success: boolean;
      totalSeats?: number;
      availableCount?: number;
      bookedCount?: number;
      reservedCount?: number;
      heldCount?: number;
      seats: Seat[];
    }>(`/shows/${showtimeId}/seats${q}`);

    const seats = res.seats || [];
    const totalSeats = res.totalSeats ?? seats.length;
    const bookedCount = res.bookedCount ?? res.reservedCount ?? seats.filter(s => s.status === 'reserved').length;
    const heldCount = res.heldCount ?? seats.filter(s => s.status === 'held').length;
    const availableCount = res.availableCount ?? Math.max(0, totalSeats - bookedCount - heldCount);

    return {
      seats,
      totalSeats,
      availableCount,
      bookedCount,
      heldCount
    };
  } catch (err) {
    // Generate fallback layout (128 seats strictly priced at ₹5 in demo)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seats: Seat[] = [];
    for (const row of rows) {
      let tier: 'VIP' | 'PREMIUM' | 'STANDARD' = 'STANDARD';
      const price = 5.0; // CineBook ₹5 demo rule
      if (row === 'A' || row === 'B') {
        tier = 'VIP';
      } else if (row === 'C' || row === 'D' || row === 'E' || row === 'F') {
        tier = 'PREMIUM';
      }

      for (let num = 1; num <= 16; num++) {
        seats.push({
          id: `${row}${num}`,
          row,
          number: num,
          tier,
          price,
          status: 'available'
        });
      }
    }
    return {
      seats,
      totalSeats: seats.length,
      availableCount: seats.length,
      bookedCount: 0,
      heldCount: 0
    };
  }
}

export async function holdSeatsApi(showtimeId: string, seatIds: string[], sessionId: string, durationMinutes = 10) {
  try {
    const res = await apiRequest<{
      success: boolean;
      message?: string;
      showtimeId: string;
      lockedSeats?: string[];
      heldSeats?: string[];
      expiresAt: number;
    }>('/seats/lock', {
      method: 'POST',
      body: JSON.stringify({ showtimeId, seatNumbers: seatIds, sessionId, durationMinutes })
    });
    return {
      success: res.success,
      message: res.message || 'Seats locked for 10 minutes',
      showtimeId: res.showtimeId,
      heldSeats: res.lockedSeats || res.heldSeats || seatIds,
      expiresAt: res.expiresAt,
      holdSecondsRemaining: Math.max(0, Math.floor((res.expiresAt - Date.now()) / 1000))
    };
  } catch (err: any) {
    // Fallback to legacy endpoint if available
    try {
      return await apiRequest<{
        success: boolean;
        message: string;
        showtimeId: string;
        heldSeats: string[];
        expiresAt: number;
        holdSecondsRemaining: number;
      }>(`/shows/${showtimeId}/hold`, {
        method: 'POST',
        body: JSON.stringify({ seatIds, sessionId, durationMinutes })
      });
    } catch {
      throw err;
    }
  }
}

export async function releaseSeatsHoldApi(showtimeId: string, sessionId: string, seatIds?: string[]) {
  try {
    return await apiRequest<{ success: boolean }>('/seats/unlock', {
      method: 'POST',
      body: JSON.stringify({ showtimeId, sessionId, seatNumbers: seatIds })
    });
  } catch {
    try {
      return await apiRequest<{ success: boolean }>(`/shows/${showtimeId}/release-hold`, {
        method: 'POST',
        body: JSON.stringify({ sessionId })
      });
    } catch {
      return { success: true };
    }
  }
}

// ----------------- PAYMENT GATEWAY API -----------------
export async function createPaymentOrderApi(payload: {
  showtimeId: string;
  date?: string;
  time?: string;
  movieId?: string;
  cinemaId?: string;
  seatIds: string[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  addons?: any[];
  deliveryPreference?: string;
  donationAmount?: number;
  discountAmount?: number;
  provider?: 'RAZORPAY' | 'STRIPE';
  sessionId: string;
}) {
  return await apiRequest<{
    success: boolean;
    bookingId: string;
    bookingRef: string;
    orderId: string;
    amount: number;
    currency: string;
    key: string;
    mockPaymentId?: string;
    mockSignature?: string;
    customer: { name: string; email: string; phone: string };
  }>('/payment/create-order', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function verifyPaymentApi(payload: {
  orderId: string;
  paymentId: string;
  signature: string;
  bookingId: string;
}) {
  return await apiRequest<{
    success: boolean;
    booking: BookingRecord;
    bookingId: string;
    bookingRef: string;
    message: string;
  }>('/payment/verify', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// ----------------- BOOKING API -----------------
export async function createBookingApi(payload: unknown): Promise<{ success: boolean; booking: BookingRecord; message: string }> {
  return await apiRequest<{ success: boolean; booking: BookingRecord; message: string }>('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function fetchMyBookingsApi(emailOrUserId?: string): Promise<BookingRecord[]> {
  try {
    const query = emailOrUserId ? `?email=${encodeURIComponent(emailOrUserId)}` : '';
    const res = await apiRequest<{ success: boolean; bookings: BookingRecord[] }>(`/bookings/my${query}`);
    return res.bookings;
  } catch (err) {
    const local = localStorage.getItem('cinebook_my_bookings');
    return local ? JSON.parse(local) : [];
  }
}

export async function getBookingByIdApi(bookingId: string): Promise<{ success: boolean; booking: BookingRecord }> {
  return await apiRequest<{ success: boolean; booking: BookingRecord }>(`/bookings/${bookingId}`);
}

export interface CancelQuoteResponse {
  success: boolean;
  eligible: boolean;
  message?: string;
  bookingId: string;
  id: string;
  movieTitle: string;
  cinemaName: string;
  screenName?: string;
  showDate: string;
  showTime: string;
  seats: string[];
  seatsCount: number;
  originalAmount: number;
  cancellationFee: number;
  refundAmount: number;
  refundPercentage: number;
  policy: string;
  paymentMethod?: string;
}

export async function getCancelQuoteApi(bookingId: string): Promise<CancelQuoteResponse> {
  return await apiRequest<CancelQuoteResponse>(`/bookings/${bookingId}/cancel-quote`);
}

export async function cancelBookingApi(
  bookingId: string,
  email?: string,
  reason?: string
): Promise<{
  success: boolean;
  message: string;
  booking: BookingRecord;
  refund?: {
    originalAmount: number;
    cancellationFee: number;
    refundAmount: number;
    refundStatus: 'NOT_REQUESTED' | 'REFUND_PENDING' | 'REFUND_PROCESSING' | 'REFUNDED' | 'REFUND_FAILED';
    refundId?: string;
    refundError?: string;
    cancelledAt: string;
  };
  auditLog?: CancellationAuditLog;
}> {
  return await apiRequest(`/bookings/${bookingId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ email, reason })
  });
}

export async function getBookingAuditTrailApi(bookingId: string): Promise<{
  success: boolean;
  bookingRef: string;
  logs: CancellationAuditLog[];
}> {
  return await apiRequest<{
    success: boolean;
    bookingRef: string;
    logs: CancellationAuditLog[];
  }>(`/bookings/${bookingId}/audit-trail`);
}

// ----------------- AUTH API -----------------
export async function loginApi(email: string, password: string): Promise<{ success: boolean; user: User; message: string }> {
  return await apiRequest<{ success: boolean; user: User; message: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function registerApi(name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; user: User; message: string }> {
  return await apiRequest<{ success: boolean; user: User; message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone })
  });
}

export async function demoLoginApi(role: 'user' | 'admin'): Promise<{ success: boolean; user: User; message: string }> {
  return await apiRequest<{ success: boolean; user: User; message: string }>('/auth/demo', {
    method: 'POST',
    body: JSON.stringify({ role })
  });
}

export async function getCurrentUserApi(): Promise<{ success: boolean; user: User }> {
  return await apiRequest<{ success: boolean; user: User }>('/auth/me');
}

// ----------------- ADMIN API -----------------
export async function getAdminStatsApi() {
  return await apiRequest<{
    success: boolean;
    stats: {
      totalBookings: number;
      todayBookings: number;
      confirmedCount: number;
      cancelledCount: number;
      totalRevenue: number;
      ticketsSold: number;
      availableSeats: number;
      popularMovies: Array<{ title: string; count: number; revenue: number }>;
      popularTheatres: Array<{ name: string; count: number; revenue: number }>;
      showOccupancy: number;
      activeMovies: number;
      comingSoonMovies: number;
      totalCinemas: number;
      totalUsers: number;
    };
  }>('/admin/stats');
}

export async function getAdminBookingsApi(): Promise<BookingRecord[]> {
  const res = await apiRequest<{ success: boolean; bookings: BookingRecord[] }>('/admin/bookings');
  return res.bookings;
}

export async function createAdminMovieApi(movie: Partial<Movie>) {
  return await apiRequest<{ success: boolean; message: string; movie: Movie }>('/admin/movies', {
    method: 'POST',
    body: JSON.stringify(movie)
  });
}

export async function deleteAdminMovieApi(id: string) {
  return await apiRequest<{ success: boolean; message: string }>(`/admin/movies/${id}`, {
    method: 'DELETE'
  });
}

// ----------------- COUPONS API -----------------
export async function getCouponsApi() {
  return await apiRequest<{
    success: boolean;
    total: number;
    coupons: {
      code: string;
      description: string;
      discountType: 'percentage' | 'fixed';
      discountValue: number;
      minSubtotal: number;
    }[];
  }>('/coupons');
}

export async function validateCouponApi(code: string, subtotal: number) {
  return await apiRequest<{
    success: boolean;
    coupon: {
      code: string;
      description: string;
      discountType: 'percentage' | 'fixed';
      discountValue: number;
      calculatedDiscount: number;
    };
  }>('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal })
  });
}

// ----------------- GATEKEEPER QR VALIDATION -----------------
export async function verifyTicketApi(query: string, staffName = 'Cinema Staff') {
  return await apiRequest<{
    success: boolean;
    valid: boolean;
    alreadyCheckedIn: boolean;
    checkedInAt?: string;
    checkedInBy?: string;
    booking: BookingRecord;
    message: string;
  }>('/bookings/verify-ticket', {
    method: 'POST',
    body: JSON.stringify({ query, staffName })
  });
}

export async function verifyTicketGateApi(queryPayload: { qrData?: string; bookingRef?: string; scannedBy?: string }) {
  return await apiRequest<{
    success: boolean;
    valid: boolean;
    alreadyCheckedIn: boolean;
    checkedInAt?: string;
    checkedInBy?: string;
    booking?: BookingRecord;
    message?: string;
  }>('/tickets/verify', {
    method: 'POST',
    body: JSON.stringify(queryPayload)
  });
}

export async function getRecentTicketScansApi() {
  return await apiRequest<{ success: boolean; scans: BookingRecord[] }>('/tickets/recent-scans');
}

// ----------------- REVIEWS & RATINGS API -----------------
export async function getMovieReviewsApi(movieId: string) {
  return await apiRequest<{
    success: boolean;
    total: number;
    movieRating?: number;
    averageRating?: number;
    votesCount?: string;
    reviews: {
      id: string;
      movieId: string;
      userName: string;
      rating: number;
      comment: string;
      createdAt: string;
    }[];
  }>(`/movies/${movieId}/reviews`);
}

export async function submitMovieReviewApi(movieId: string, review: { userName: string; rating: number; comment: string; userEmail?: string }) {
  return await apiRequest<{
    success: boolean;
    message: string;
    movieRating?: number;
    votesCount?: string;
    review: {
      id: string;
      movieId: string;
      userName: string;
      rating: number;
      comment: string;
      createdAt: string;
    };
  }>(`/movies/${movieId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(review)
  });
}

// ----------------- WATCHLIST / FAVORITES API -----------------
export async function getFavoritesApi(user: string) {
  return await apiRequest<{ success: boolean; favorites: string[] }>(`/movies/user/favorites?user=${encodeURIComponent(user)}`);
}

export async function toggleFavoriteApi(user: string, movieId: string) {
  return await apiRequest<{ success: boolean; isFavorite: boolean; favorites: string[] }>('/movies/user/favorites', {
    method: 'POST',
    body: JSON.stringify({ user, movieId })
  });
}

// ----------------- SHOWTIMES MANAGEMENT API -----------------
export async function getAdminShowtimesApi() {
  return await apiRequest<{
    success: boolean;
    total: number;
    showtimes: Array<{
      id: string;
      movieId: string;
      cinemaId: string;
      date: string;
      time: string;
      format: string;
      hall: string;
      language?: string;
    }>;
  }>('/admin/showtimes');
}

export async function createAdminShowtimeApi(showtime: {
  movieId: string;
  cinemaId: string;
  date: string;
  time: string;
  format?: string;
  hall?: string;
  language?: string;
}) {
  return await apiRequest<{ success: boolean; message: string; show: unknown }>('/admin/showtimes', {
    method: 'POST',
    body: JSON.stringify(showtime)
  });
}

export async function deleteAdminShowtimeApi(id: string) {
  return await apiRequest<{ success: boolean; message: string }>(`/admin/showtimes/${id}`, {
    method: 'DELETE'
  });
}

// ----------------- ADMIN USERS, COUPONS & REVIEWS -----------------
export async function getAdminUsersApi() {
  return await apiRequest<{ success: boolean; total: number; users: any[] }>('/admin/users');
}

export async function toggleAdminUserBlockApi(id: string) {
  return await apiRequest<{ success: boolean; blocked: boolean }>(`/admin/users/${id}/toggle-block`, {
    method: 'POST'
  });
}

export async function getAdminCouponsApi() {
  return await apiRequest<{ success: boolean; coupons: any[] }>('/admin/coupons');
}

export async function createAdminCouponApi(coupon: {
  code: string;
  description: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minSubtotal?: number;
}) {
  return await apiRequest<{ success: boolean; coupon: any }>('/admin/coupons', {
    method: 'POST',
    body: JSON.stringify(coupon)
  });
}

export async function deleteAdminCouponApi(code: string) {
  return await apiRequest<{ success: boolean; message: string }>(`/admin/coupons/${encodeURIComponent(code)}`, {
    method: 'DELETE'
  });
}

export async function getAdminReviewsApi() {
  return await apiRequest<{ success: boolean; total: number; reviews: any[] }>('/admin/reviews');
}

export async function deleteAdminReviewApi(id: string) {
  return await apiRequest<{ success: boolean; message: string }>(`/admin/reviews/${id}`, {
    method: 'DELETE'
  });
}

