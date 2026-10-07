-- ====================================================================
-- CineBook Full-Stack Database Schema
-- Target: PostgreSQL / Supabase
-- Description: Complete relational schema for users, movies, genres,
--              cinemas, screens, showtimes, seats, bookings, and payments.
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & ROLES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. GENRES
CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 4. LANGUAGES
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL
);

-- 5. MOVIES
CREATE TABLE IF NOT EXISTS movies (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    tagline TEXT,
    synopsis TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    backdrop_url TEXT NOT NULL,
    original_language VARCHAR(50) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 0.0,
    votes_count VARCHAR(20) DEFAULT '0',
    age_rating VARCHAR(10) NOT NULL,
    release_date VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('now_showing', 'coming_soon')),
    director VARCHAR(100) NOT NULL,
    formats TEXT[] NOT NULL DEFAULT ARRAY['2D'],
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. MOVIE GENRE MAPPING
CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id VARCHAR(50) REFERENCES movies(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

-- 7. MOVIE AUDIO LANGUAGES MAPPING
CREATE TABLE IF NOT EXISTS movie_languages (
    movie_id VARCHAR(50) REFERENCES movies(id) ON DELETE CASCADE,
    language_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (movie_id, language_name)
);

-- 8. MOVIE CAST MEMBERS
CREATE TABLE IF NOT EXISTS movie_cast (
    id SERIAL PRIMARY KEY,
    movie_id VARCHAR(50) REFERENCES movies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    avatar TEXT NOT NULL
);

-- 9. CITIES & THEATRES
CREATE TABLE IF NOT EXISTS cinemas (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    facilities TEXT[] DEFAULT ARRAY[]::TEXT[],
    distance VARCHAR(50) DEFAULT '0 km'
);

-- 10. SCREENS / AUDITORIUMS
CREATE TABLE IF NOT EXISTS screens (
    id VARCHAR(50) PRIMARY KEY,
    cinema_id VARCHAR(50) REFERENCES cinemas(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    screen_type VARCHAR(50) NOT NULL DEFAULT 'Standard' -- IMAX 3D, 4DX, Dolby Atmos, Standard
);

-- 11. SHOWTIMES
CREATE TABLE IF NOT EXISTS showtimes (
    id VARCHAR(50) PRIMARY KEY,
    cinema_id VARCHAR(50) REFERENCES cinemas(id) ON DELETE CASCADE,
    screen_id VARCHAR(50) REFERENCES screens(id) ON DELETE CASCADE,
    movie_id VARCHAR(50) REFERENCES movies(id) ON DELETE CASCADE,
    date VARCHAR(50) NOT NULL,
    time VARCHAR(20) NOT NULL,
    format VARCHAR(50) NOT NULL,
    hall_name VARCHAR(100) NOT NULL,
    language VARCHAR(50) DEFAULT 'English',
    price_multiplier NUMERIC(3, 2) DEFAULT 1.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. SEAT LAYOUT & INVENTORY
CREATE TABLE IF NOT EXISTS seats (
    id VARCHAR(50) PRIMARY KEY, -- e.g. screen_id + '-' + row + number
    screen_id VARCHAR(50) REFERENCES screens(id) ON DELETE CASCADE,
    row_label CHAR(2) NOT NULL,
    seat_number INTEGER NOT NULL,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('VIP', 'PREMIUM', 'STANDARD')),
    base_price NUMERIC(8, 2) NOT NULL
);

-- 13. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    showtime_id VARCHAR(50) REFERENCES showtimes(id) ON DELETE RESTRICT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    convenience_fee NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Demo Card',
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'refunded')),
    booked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    refund_amount NUMERIC(10, 2) DEFAULT 0.00
);

-- 14. BOOKING SEATS (PREVENTS DOUBLE-BOOKING CONFLICTS)
CREATE TABLE IF NOT EXISTS booking_seats (
    id SERIAL PRIMARY KEY,
    booking_id VARCHAR(50) REFERENCES bookings(id) ON DELETE CASCADE,
    showtime_id VARCHAR(50) REFERENCES showtimes(id) ON DELETE CASCADE,
    seat_id VARCHAR(50) NOT NULL,
    seat_row VARCHAR(5) NOT NULL,
    seat_number INTEGER NOT NULL,
    tier VARCHAR(20) NOT NULL,
    price NUMERIC(8, 2) NOT NULL,
    -- CRITICAL: Unique constraint guarantees atomic conflict prevention per showtime
    CONSTRAINT unique_seat_per_show UNIQUE (showtime_id, seat_id)
);

-- 15. BOOKING SNACK ADDONS
CREATE TABLE IF NOT EXISTS booking_addons (
    id SERIAL PRIMARY KEY,
    booking_id VARCHAR(50) REFERENCES bookings(id) ON DELETE CASCADE,
    addon_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(8, 2) NOT NULL,
    quantity INTEGER NOT NULL
);

-- 16. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_movies_status ON movies(status);
CREATE INDEX IF NOT EXISTS idx_showtimes_movie_cinema ON showtimes(movie_id, cinema_id);
CREATE INDEX IF NOT EXISTS idx_booking_seats_show ON booking_seats(showtime_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
