// ====================================================================
// CineBook Core TypeScript Type Definitions
// Corresponds directly with Supabase PostgreSQL schema
// ====================================================================

export type UserRole = 'customer' | 'theatre_manager' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type MovieStatus = 'now_showing' | 'coming_soon' | 'archived';

export interface Movie {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  duration_minutes: number;
  languages: string[];
  genres: string[];
  certification: string;
  rating: number;
  votes_count: number;
  poster_url: string;
  backdrop_url: string | null;
  trailer_url: string | null;
  release_date: string | null;
  status: MovieStatus;
  created_at: string;
  updated_at: string;
}

export interface Theatre {
  id: string;
  name: string;
  slug: string;
  chain: string;
  city: string;
  address: string;
  amenities: string[];
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface Screen {
  id: string;
  theatre_id: string;
  name: string;
  screen_number: number;
  format: '2D' | '3D' | 'IMAX 3D' | '4DX';
  sound_system: string;
  total_capacity: number;
  created_at: string;
  updated_at: string;
}

export type SeatTier = 'STANDARD' | 'PREMIUM' | 'RECLINER' | 'VIP';

export interface Seat {
  id: string;
  screen_id: string;
  seat_row: string;
  seat_number: number;
  seat_code: string;
  seat_tier: SeatTier;
  base_price: number; // ₹5 rule
  is_active: boolean;
  created_at: string;
}

export interface Show {
  id: string;
  movie_id: string;
  screen_id: string;
  start_time: string;
  end_time: string;
  show_date: string;
  show_time: string;
  language: string;
  format: string;
  base_price: number; // ₹5 rule
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  movie?: Movie;
  screen?: Screen & { theatre?: Theatre };
}

export type SeatStatus = 'AVAILABLE' | 'BLOCKED' | 'BOOKED';

export interface ShowSeat {
  id: string;
  show_id: string;
  seat_id: string;
  status: SeatStatus;
  locked_until: string | null;
  locked_by: string | null;
  lock_session_id: string | null;
  price: number; // ₹5
  created_at: string;
  updated_at: string;
  // Joined physical seat
  seat?: Seat;
}

export type DiscountType = 'FIXED' | 'PERCENTAGE';

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_subtotal: number;
  max_discount: number | null;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'CHECKED_IN' | 'EXPIRED';

export interface Booking {
  id: string;
  booking_ref: string;
  user_id: string;
  show_id: string;
  coupon_id: string | null;
  ticket_count: number;
  base_amount: number; // ticket_count * 5
  discount_amount: number;
  convenience_fee: number;
  tax_amount: number;
  total_amount: number; // Calculated: ticket_count * 5 - discount + charges
  status: BookingStatus;
  qr_payload: string | null;
  checked_in_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  show?: Show;
  items?: BookingItem[];
  payment?: Payment;
}

export interface BookingItem {
  id: string;
  booking_id: string;
  show_seat_id: string;
  seat_label: string;
  seat_tier: string;
  price: number;
  created_at: string;
}

export type PaymentGateway = 'SANDBOX' | 'RAZORPAY' | 'STRIPE' | 'UPI_MOCK';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  booking_id: string;
  payment_gateway: PaymentGateway;
  transaction_id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway_response: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  booking_id: string | null;
  title: string;
  message: string;
  type: 'BOOKING_CONFIRMATION' | 'SHOW_REMINDER' | 'CANCELLATION' | 'PROMOTION' | 'SYSTEM';
  is_read: boolean;
  created_at: string;
}

export type SupportedLanguage = 'en' | 'te' | 'ta' | 'ml' | 'kn' | 'hi';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}
