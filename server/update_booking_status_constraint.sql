BEGIN;

-- Safely update bookings_status_check constraint on public.bookings
-- This allows CineBook's full lifecycle ('pending', 'confirmed', 'cancelled', 'refunded', 'checked_in')
-- with case-insensitivity to prevent Postgres error 23514.

ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
  CHECK (LOWER(status) IN ('pending', 'confirmed', 'cancelled', 'refunded', 'checked_in'));

COMMIT;
