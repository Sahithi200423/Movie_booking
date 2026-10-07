-- ====================================================================
-- CineBook Initial Seed Data Migration
-- Migration: 20261005000001_seed_initial_cinebook_data.sql
-- ====================================================================

-- 1. Insert Initial Theatres
INSERT INTO public.theatres (id, name, slug, chain, city, address, amenities)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'CineBook IMAX Grand', 'cinebook-imax-grand', 'CineBook Flagship', 'Hyderabad', 'Road No. 36, Jubilee Hills, Hyderabad, Telangana', ARRAY['IMAX with Laser', 'Dolby Atmos', 'Plush Recliners', 'Gourmet Lounge']),
  ('22222222-2222-2222-2222-222222222222', 'CineBook Pallasium Luxe', 'cinebook-pallasium-luxe', 'CineBook Luxe', 'Mumbai', 'Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra', ARRAY['Dolby Atmos', '4K RGB Laser', 'VIP Butler Service', 'Valet Parking']),
  ('33333333-3333-3333-3333-333333333333', 'CineBook Nexus Orion', 'cinebook-nexus-orion', 'CineBook Prime', 'Bengaluru', 'Dr. Rajkumar Road, Malleshwaram, Bengaluru, Karnataka', ARRAY['4DX Immersion', 'Dolby 7.1', 'Food Court Delivery']),
  ('44444444-4444-4444-4444-444444444444', 'CineBook Express Promenade', 'cinebook-express-promenade', 'CineBook Prime', 'Chennai', 'Velachery Main Road, Chennai, Tamil Nadu', ARRAY['Dolby Atmos', 'Laser 3D', 'Cafeteria'])
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Initial Screens
INSERT INTO public.screens (id, theatre_id, name, screen_number, format, sound_system, total_capacity)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Audi 1 - IMAX Laser 3D', 1, 'IMAX 3D', '12-Channel IMAX Sound', 64),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Audi 2 - Dolby Atmos', 2, '2D', 'Dolby Atmos 7.1', 64),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Audi 1 - Grand Luxe', 1, '2D', 'Dolby Atmos', 64)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Physical Seats for Audi 1 (Rows A-D, 16 seats each = 64 seats @ ₹5 base price)
DO $$
DECLARE
  v_row TEXT;
  v_num INT;
  v_tier TEXT;
BEGIN
  FOREACH v_row IN ARRAY ARRAY['A', 'B', 'C', 'D'] LOOP
    FOR v_num IN 1..16 LOOP
      IF v_row IN ('A', 'B') THEN
        v_tier := 'PREMIUM';
      ELSIF v_row = 'D' THEN
        v_tier := 'RECLINER';
      ELSE
        v_tier := 'STANDARD';
      END IF;

      INSERT INTO public.seats (screen_id, seat_row, seat_number, seat_code, seat_tier, base_price)
      VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', v_row, v_num, v_row || v_num, v_tier, 5.00)
      ON CONFLICT (screen_id, seat_row, seat_number) DO NOTHING;

      INSERT INTO public.seats (screen_id, seat_row, seat_number, seat_code, seat_tier, base_price)
      VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', v_row, v_num, v_row || v_num, v_tier, 5.00)
      ON CONFLICT (screen_id, seat_row, seat_number) DO NOTHING;

      INSERT INTO public.seats (screen_id, seat_row, seat_number, seat_code, seat_tier, base_price)
      VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', v_row, v_num, v_row || v_num, v_tier, 5.00)
      ON CONFLICT (screen_id, seat_row, seat_number) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- 4. Insert Featured Movies
INSERT INTO public.movies (id, title, slug, synopsis, duration_minutes, languages, genres, certification, rating, votes_count, poster_url, backdrop_url, release_date, status)
VALUES
  (
    '10101010-1010-1010-1010-101010101010',
    'Kalki 2898 AD',
    'kalki-2898-ad',
    'Set in a post-apocalyptic dystopian world in the year 2898 AD, a modern avatar of Vishnu descends to protect humanity from the forces of darkness and supreme leader Yaskin.',
    180,
    ARRAY['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada', 'English'],
    ARRAY['Sci-Fi', 'Action', 'Mythology'],
    'UA',
    9.2,
    4520,
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    '2026-06-27',
    'now_showing'
  ),
  (
    '20202020-2020-2020-2020-202020202020',
    'Dune: Prophecy & Power',
    'dune-prophecy-and-power',
    'Set ten thousand years before the ascension of Paul Atreides, two Harkonnen sisters combat forces that threaten the future of humankind and establish the fabled sect known as the Bene Gesserit.',
    165,
    ARRAY['English', 'Hindi', 'Tamil', 'Telugu'],
    ARRAY['Sci-Fi', 'Adventure', 'Drama'],
    'UA',
    9.0,
    3890,
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    '2026-11-17',
    'now_showing'
  ),
  (
    '30303030-3030-3030-3030-303030303030',
    'Stree 2: Sarkate Ka Aatank',
    'stree-2',
    'The town of Chanderi faces a terrifying new headless monster called Sarkata. The beloved band of friends must team up with the mysterious protector spirit to save their community.',
    147,
    ARRAY['Hindi', 'Telugu', 'Tamil'],
    ARRAY['Comedy', 'Horror', 'Mystery'],
    'UA',
    8.6,
    2940,
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    '2026-08-15',
    'now_showing'
  ),
  (
    '40404040-4040-4040-4040-404040404040',
    'Interstellar: Beyond Event Horizon',
    'interstellar-re-release',
    'Christopher Nolan epic returns to IMAX screens. A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.',
    169,
    ARRAY['English', 'Hindi'],
    ARRAY['Sci-Fi', 'Drama'],
    'U',
    9.5,
    6200,
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80',
    '2026-10-10',
    'now_showing'
  ),
  (
    '50505050-5050-5050-5050-505050505050',
    'Avatar: Fire and Ash',
    'avatar-fire-and-ash',
    'Jake Sully and Neytiri face the Ash People, a volcanic clan of Na vi that reveals a darker side of Pandora previously unseen.',
    192,
    ARRAY['English', 'Telugu', 'Hindi', 'Tamil'],
    ARRAY['Sci-Fi', 'Action', 'Adventure'],
    'UA',
    9.4,
    1820,
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    '2026-12-19',
    'coming_soon'
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Shows for Today
INSERT INTO public.shows (id, movie_id, screen_id, start_time, end_time, show_date, show_time, language, format, base_price)
VALUES
  (
    's1111111-1111-1111-1111-111111111111',
    '10101010-1010-1010-1010-101010101010',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    CURRENT_DATE + TIME '10:30:00',
    CURRENT_DATE + TIME '13:30:00',
    CURRENT_DATE,
    '10:30:00',
    'Telugu',
    'IMAX 3D',
    5.00
  ),
  (
    's2222222-2222-2222-2222-222222222222',
    '10101010-1010-1010-1010-101010101010',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    CURRENT_DATE + TIME '14:30:00',
    CURRENT_DATE + TIME '17:30:00',
    CURRENT_DATE,
    '14:30:00',
    'Telugu',
    'IMAX 3D',
    5.00
  ),
  (
    's3333333-3333-3333-3333-333333333333',
    '20202020-2020-2020-2020-202020202020',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    CURRENT_DATE + TIME '18:45:00',
    CURRENT_DATE + TIME '21:30:00',
    CURRENT_DATE,
    '18:45:00',
    'English',
    '2D',
    5.00
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Link Physical Seats to Show Seats for initial show
INSERT INTO public.show_seats (show_id, seat_id, status, price)
SELECT
  's1111111-1111-1111-1111-111111111111',
  id,
  CASE
    WHEN seat_code IN ('A5', 'A6', 'B8') THEN 'BOOKED'
    ELSE 'AVAILABLE'
  END,
  5.00
FROM public.seats
WHERE screen_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
ON CONFLICT (show_id, seat_id) DO NOTHING;

-- 7. Insert Initial Coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_subtotal, is_active)
VALUES
  ('CINEBOOK5', 'Flat ₹1 welcome discount on all movie tickets', 'FIXED', 1.00, 5.00, true),
  ('PREMIERE10', '10% instant discount on orders above ₹10', 'PERCENTAGE', 10.00, 10.00, true),
  ('CINEMA50', 'Buy 2 Get ₹2 flat discount', 'FIXED', 2.00, 10.00, true)
ON CONFLICT (code) DO NOTHING;
