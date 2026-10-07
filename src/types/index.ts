export type SeatTier = 'VIP' | 'PREMIUM' | 'STANDARD';

export interface CastMember {
  name: string;
  role: string;
  avatar: string;
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  genre: string[];
  language: string; // Primary audio/original language
  languages: string[]; // All available audio dub languages
  duration: string;
  durationMinutes: number;
  rating: number;
  votesCount: string;
  ageRating: string;
  releaseDate: string;
  status: 'now_showing' | 'coming_soon';
  director: string;
  cast: CastMember[];
  formats: string[];
  featured?: boolean;
  trailerUrl?: string;
  recommendPercent?: number;
  recommendVotes?: string;
}

export interface Cinema {
  id: string;
  name: string;
  city?: string;
  location: string;
  address: string;
  facilities: string[];
  distance: string;
  timezone?: string;
}

export interface Showtime {
  id: string;
  cinemaId: string;
  movieId: string;
  date: string;
  time: string;
  format: string;
  hall: string;
  language?: string;
  priceMultiplier?: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  tier: SeatTier;
  price: number;
  status: 'available' | 'reserved' | 'held' | 'selected';
  holdExpiresAt?: number;
}

export interface SnackAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'combo' | 'popcorn' | 'snack' | 'beverage';
}

export interface BookingCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface BookingRecord {
  bookingId: string;
  id?: string;
  bookingRef?: string;
  userId?: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  movieDuration: string;
  movieAgeRating: string;
  cinemaId: string;
  cinemaName: string;
  cinemaAddress: string;
  hall: string;
  format: string;
  date: string;
  time: string;
  selectedLanguage?: string;
  deliveryPreference?: 'seat' | 'counter';
  seats: {
    id: string;
    row: string;
    number: number;
    tier: SeatTier;
    price: number;
  }[];
  seatIds?: string;
  addons: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  convenienceFee: number;
  tax: number;
  totalAmount: number;
  couponCode?: string;
  discountAmount?: number;
  customer: BookingCustomer;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod: string;
  bookedAt: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  cancelledAt?: string;
  refundAmount?: number;
  cancellationFee?: number;
  refundStatus?: 'NOT_REQUESTED' | 'REFUND_PENDING' | 'REFUND_PROCESSING' | 'REFUNDED' | 'REFUND_FAILED';
  refundId?: string;
  qrToken?: string;
  checkedIn?: boolean;
  checkedInAt?: string;
  checkedInBy?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token?: string;
  createdAt?: string;
}

export interface Review {
  id: string;
  movieId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSubtotal: number;
  calculatedDiscount?: number;
}

