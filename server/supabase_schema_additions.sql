-- ====================================================================
-- CineBook Supabase Additions & Compatibility Patch
-- Safe & Non-Destructive (Preserves all 15 existing tables & 0 data loss)
-- Target: PostgreSQL 17 / Supabase
-- ====================================================================

-- 1. REVIEWS TABLE (for Audience Reviews & Ratings)
CREATE TABLE IF NOT EXISTS public.reviews (
    id VARCHAR(50) PRIMARY KEY,
    movie_id VARCHAR(50) NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255),
    rating NUMERIC(3, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 10.0),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON public.reviews(movie_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- 2. SEAT RESERVATIONS TABLE (for Concurrency & 10-Minute Seat Locks)
CREATE TABLE IF NOT EXISTS public.seat_reservations (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    showtime_id VARCHAR(50) NOT NULL REFERENCES public.showtimes(id) ON DELETE CASCADE,
    seat_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    held_by VARCHAR(100),
    held_expires_at TIMESTAMP WITH TIME ZONE,
    booking_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_seat_reservation UNIQUE (showtime_id, seat_id)
);
CREATE INDEX IF NOT EXISTS idx_seat_reservations_showtime ON public.seat_reservations(showtime_id);

-- 3. PAYMENTS TABLE (for Gateway Order Tracking & Refunds)
CREATE TABLE IF NOT EXISTS public.payments (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_id VARCHAR(50) REFERENCES public.bookings(id) ON DELETE SET NULL,
    provider VARCHAR(20) DEFAULT 'RAZORPAY',
    order_id VARCHAR(100) UNIQUE NOT NULL,
    payment_id VARCHAR(100),
    signature VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'PENDING',
    refund_id VARCHAR(100),
    refund_amount NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);

-- 4. CANCELLATION AUDIT LOGS TABLE (for Tracking Ticket Cancellations)
CREATE TABLE IF NOT EXISTS public.cancellation_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id VARCHAR(50) REFERENCES public.bookings(id) ON DELETE CASCADE,
    booking_ref VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    actor_email VARCHAR(255) NOT NULL,
    previous_status VARCHAR(20) NOT NULL,
    new_status VARCHAR(20) NOT NULL,
    refund_status VARCHAR(30) NOT NULL,
    refund_amount NUMERIC(10, 2) DEFAULT 0.00,
    cancellation_fee NUMERIC(10, 2) DEFAULT 0.00,
    refund_id VARCHAR(100),
    failure_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_cancellation_audit_booking ON public.cancellation_audit_logs(booking_id);

-- 5. EXTEND BOOKINGS TABLE COLUMNS (Non-Destructive)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS refund_status VARCHAR(30) DEFAULT 'NOT_REQUESTED';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancellation_fee NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS refund_id VARCHAR(100);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_ref VARCHAR(50);

-- 6. EXTEND APPLICATION COMPATIBILITY COLUMNS (Non-Destructive)
ALTER TABLE public.cinemas ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'Asia/Kolkata';
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS genre TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.showtimes ADD COLUMN IF NOT EXISTS hall VARCHAR(100);

-- 7. FLEXIBLE USER ID SUPPORT (Allows both UUIDs and string IDs like 'usr-admin-01')
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE public.users ALTER COLUMN id TYPE VARCHAR(50);
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE public.bookings ALTER COLUMN user_id TYPE VARCHAR(50);
ALTER TABLE public.bookings ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;
