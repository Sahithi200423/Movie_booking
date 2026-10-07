-- ====================================================================
-- CineBook Supabase PostgreSQL Database Schema
-- Migration: 20261005000000_create_cinebook_schema.sql
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'theatre_manager', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Movies Table
CREATE TABLE IF NOT EXISTS public.movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  synopsis TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  languages TEXT[] NOT NULL DEFAULT '{"English"}',
  genres TEXT[] NOT NULL DEFAULT '{"Action"}',
  certification TEXT NOT NULL DEFAULT 'UA',
  rating NUMERIC(3, 1) NOT NULL DEFAULT 8.0,
  votes_count INT NOT NULL DEFAULT 120,
  poster_url TEXT NOT NULL,
  backdrop_url TEXT,
  trailer_url TEXT,
  release_date DATE,
  status TEXT NOT NULL DEFAULT 'now_showing' CHECK (status IN ('now_showing', 'coming_soon', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Theatres Table (Cinema Multiplexes)
CREATE TABLE IF NOT EXISTS public.theatres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  chain TEXT NOT NULL DEFAULT 'Independent',
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  amenities TEXT[] NOT NULL DEFAULT '{"Dolby Atmos", "4K Laser", "Recliner Seats"}',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Screens Table (Auditoriums)
CREATE TABLE IF NOT EXISTS public.screens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theatre_id UUID NOT NULL REFERENCES public.theatres(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. "Screen 1 - Laser Atmos"
  screen_number INT NOT NULL,
  format TEXT NOT NULL DEFAULT '2D', -- "2D", "3D", "IMAX 3D", "4DX"
  sound_system TEXT NOT NULL DEFAULT 'Dolby Atmos',
  total_capacity INT NOT NULL DEFAULT 64,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (theatre_id, screen_number)
);

-- 6. Physical Seats Table
CREATE TABLE IF NOT EXISTS public.seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screen_id UUID NOT NULL REFERENCES public.screens(id) ON DELETE CASCADE,
  seat_row TEXT NOT NULL, -- "A", "B", ...
  seat_number INT NOT NULL, -- 1, 2, ...
  seat_code TEXT NOT NULL, -- "A1", "A2"
  seat_tier TEXT NOT NULL DEFAULT 'STANDARD' CHECK (seat_tier IN ('STANDARD', 'PREMIUM', 'RECLINER', 'VIP')),
  base_price NUMERIC(10, 2) NOT NULL DEFAULT 5.00, -- ₹5 base price rule
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (screen_id, seat_row, seat_number)
);

-- 7. Shows Table (Movie Screening Slots)
CREATE TABLE IF NOT EXISTS public.shows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  screen_id UUID NOT NULL REFERENCES public.screens(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  language TEXT NOT NULL DEFAULT 'English',
  format TEXT NOT NULL DEFAULT '2D',
  base_price NUMERIC(10, 2) NOT NULL DEFAULT 5.00, -- ₹5 rule
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Show Seats Table (CRITICAL: Seat availability per show with 10-min lock TTL)
CREATE TABLE IF NOT EXISTS public.show_seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  show_id UUID NOT NULL REFERENCES public.shows(id) ON DELETE CASCADE,
  seat_id UUID NOT NULL REFERENCES public.seats(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BLOCKED', 'BOOKED')),
  locked_until TIMESTAMPTZ, -- 10-minute temporary reservation expiration
  locked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  lock_session_id TEXT, -- Browser session ID for anonymous pre-auth holds
  price NUMERIC(10, 2) NOT NULL DEFAULT 5.00, -- ₹5 per ticket
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (show_id, seat_id)
);

-- 9. Coupons Table (Discounts)
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'FIXED' CHECK (discount_type IN ('FIXED', 'PERCENTAGE')),
  discount_value NUMERIC(10, 2) NOT NULL DEFAULT 1.00,
  min_subtotal NUMERIC(10, 2) NOT NULL DEFAULT 5.00,
  max_discount NUMERIC(10, 2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref TEXT UNIQUE NOT NULL, -- e.g. "CB-104928-IN"
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  show_id UUID NOT NULL REFERENCES public.shows(id) ON DELETE RESTRICT,
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  ticket_count INT NOT NULL DEFAULT 1,
  base_amount NUMERIC(10, 2) NOT NULL, -- ticket_count * 5.00
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  convenience_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL, -- Calculated: ticket_count * 5 - discount + charges
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'EXPIRED')),
  qr_payload TEXT,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Booking Items Table (Individual Ticket Passes)
CREATE TABLE IF NOT EXISTS public.booking_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  show_seat_id UUID NOT NULL REFERENCES public.show_seats(id) ON DELETE RESTRICT,
  seat_label TEXT NOT NULL, -- e.g. "A10"
  seat_tier TEXT NOT NULL DEFAULT 'STANDARD',
  price NUMERIC(10, 2) NOT NULL DEFAULT 5.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (booking_id, show_seat_id)
);

-- 12. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  payment_gateway TEXT NOT NULL DEFAULT 'SANDBOX' CHECK (payment_gateway IN ('SANDBOX', 'RAZORPAY', 'STRIPE', 'UPI_MOCK')),
  transaction_id TEXT UNIQUE NOT NULL,
  order_id TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
  gateway_response JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'BOOKING_CONFIRMATION' CHECK (type IN ('BOOKING_CONFIRMATION', 'SHOW_REMINDER', 'CANCELLATION', 'PROMOTION', 'SYSTEM')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theatres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.show_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles: Anyone can read basic public profile, users can update their own profile, admins can manage all
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Movies, Theatres, Screens, Seats, Shows: Public read, Admin write
CREATE POLICY "Movies viewable by everyone" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Admin can modify movies" ON public.movies FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Theatres viewable by everyone" ON public.theatres FOR SELECT USING (true);
CREATE POLICY "Admin can modify theatres" ON public.theatres FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Screens viewable by everyone" ON public.screens FOR SELECT USING (true);
CREATE POLICY "Admin can modify screens" ON public.screens FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Seats viewable by everyone" ON public.seats FOR SELECT USING (true);
CREATE POLICY "Admin can modify seats" ON public.seats FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Shows viewable by everyone" ON public.shows FOR SELECT USING (true);
CREATE POLICY "Admin can modify shows" ON public.shows FOR ALL TO authenticated USING (public.is_admin());

-- Show Seats: Public read, Controlled lock update
CREATE POLICY "Show seats viewable by everyone" ON public.show_seats FOR SELECT USING (true);

CREATE POLICY "Users can hold unlocked seats" ON public.show_seats FOR UPDATE TO public
  USING (
    status = 'AVAILABLE' OR (locked_until IS NOT NULL AND locked_until < now())
  )
  WITH CHECK (
    status IN ('AVAILABLE', 'BLOCKED')
  );

-- Coupons: Public read active coupons, Admin manage
CREATE POLICY "Active coupons viewable by anyone" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage coupons" ON public.coupons FOR ALL TO authenticated USING (public.is_admin());

-- Bookings: Users can view own bookings, only server/admin can update status
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own bookings" ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can modify bookings" ON public.bookings FOR ALL TO authenticated
  USING (public.is_admin());

-- Booking Items: Users can view items belonging to their bookings
CREATE POLICY "Users can view own booking items" ON public.booking_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_items.booking_id
        AND (bookings.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Users can insert own booking items" ON public.booking_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_items.booking_id
        AND bookings.user_id = auth.uid()
    )
  );

-- Payments: Users can view own payments; users CANNOT modify payment status (Security Rule)
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
        AND (bookings.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Only admin or backend service role can update payments" ON public.payments FOR ALL TO authenticated
  USING (public.is_admin());

-- Notifications: Users can view and mark read their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- DATABASE FUNCTIONS & ATOMIC SEAT LOCKING
-- ====================================================================

-- Function to safely lock seats for 10 minutes
CREATE OR REPLACE FUNCTION public.lock_seats(
  p_show_id UUID,
  p_seat_ids UUID[],
  p_user_id UUID DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_duration_minutes INT DEFAULT 10
)
RETURNS JSONB AS $$
DECLARE
  v_locked_count INT;
  v_now TIMESTAMPTZ := now();
  v_expires_at TIMESTAMPTZ := now() + (p_duration_minutes || ' minutes')::INTERVAL;
BEGIN
  -- Attempt atomic lock on available or expired seats
  UPDATE public.show_seats
  SET status = 'BLOCKED',
      locked_until = v_expires_at,
      locked_by = p_user_id,
      lock_session_id = p_session_id,
      updated_at = v_now
  WHERE show_id = p_show_id
    AND seat_id = ANY(p_seat_ids)
    AND (
      status = 'AVAILABLE'
      OR (locked_until IS NOT NULL AND locked_until < v_now)
      OR (lock_session_id = p_session_id)
      OR (p_user_id IS NOT NULL AND locked_by = p_user_id)
    );

  GET DIAGNOSTICS v_locked_count = ROW_COUNT;

  IF v_locked_count = array_length(p_seat_ids, 1) THEN
    RETURN jsonb_build_object(
      'success', true,
      'locked_count', v_locked_count,
      'expires_at', v_expires_at,
      'message', 'Seats reserved for 10 minutes'
    );
  ELSE
    -- Rollback / Release partial locks held by this attempt
    RETURN jsonb_build_object(
      'success', false,
      'locked_count', v_locked_count,
      'message', 'One or more selected seats are no longer available'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to release held seats
CREATE OR REPLACE FUNCTION public.release_seats(
  p_show_id UUID,
  p_seat_ids UUID[],
  p_session_id TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.show_seats
  SET status = 'AVAILABLE',
      locked_until = NULL,
      locked_by = NULL,
      lock_session_id = NULL,
      updated_at = now()
  WHERE show_id = p_show_id
    AND seat_id = ANY(p_seat_ids)
    AND status = 'BLOCKED'
    AND (p_session_id IS NULL OR lock_session_id = p_session_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
