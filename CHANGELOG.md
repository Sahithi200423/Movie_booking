# Changelog

All notable changes to the CineBook platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.1] - 2026-10-16

### Fixed
- **React Hook Order & Direct Navigation (React Error #310)**: Hoisted `dashboardCounts` `useMemo` hook and seat selection calculations unconditionally above conditional returns in `SeatSelectionPage.tsx`, preventing hook count mismatches between unhydrated and hydrated render cycles.
- **Direct Route State Resilience**: Provided safe defaults (`activeBooking.seats || []`) preventing null dereferencing during direct navigation (`/seat-selection?showtimeId=...`) or page refresh while backend metadata rehydrates.

---

## [1.0.0] - 2026-10-16

### Added
- **21-Test Automated Pre-Deployment Regression Suite** (`server/test_suite.cjs`) covering database health, canonical showtime parsing, live seat counts, concurrency locks, and timezone formatting.
- **Timezone Utility** (`formatToISODate`) explicitly anchored to `Asia/Kolkata` via `Intl.DateTimeFormat` to prevent UTC midnight rollover.
- **Atomic Booking Dispatcher** (`setActiveMovieAndShowtime`) to eliminate split-state race conditions when switching between movies and cinemas.
- **Mermaid Architecture Diagram** and system integration documentation.
- **Live Deployment & Testing Badges** for Vercel, Render, and Supabase.

### Fixed
- **Showtime Selection & Discovery**: Resolved canonical showtime resolution for `show-stree-2-pvr-2026-10-19-0430PM`.
- **Seat Dashboard & Map Visibility**: Ensured live seat availability counters (Total: 128, Available: 128, Booked: 0, Held: 0) and seat grid load immediately without full-screen modal obstruction.
- **Session Rehydration**: Eliminated hardcoded `'2026-10-15'` fallback and stale `sessionStorage` overrides on page refresh or direct URL navigation.
- **Strict Date Querying**: Fixed backend `/api/shows` route to return empty arrays rather than leaking historical seed dates when an unseeded date is requested.
- **Ticket Pricing Integrity**: Enforced strict ₹5.00 base pricing across all seat tiers.

### Changed
- Live polling interval on the seat selection page optimized to 5 seconds for responsive multi-user updates.
- Refactored `MovieDetailsPage` date tabs to store canonical ISO date strings while displaying localized strings.

---

## [0.9.0] - 2026-10-05

### Added
- Initial Supabase PostgreSQL relational schema with 12 tables and Row-Level Security (RLS).
- Realtime seat synchronization using Supabase Realtime channel subscriptions.
- 18 regional and international interface languages with full RTL layout support for Urdu.
- Multi-currency converter supporting INR (₹), USD ($), EUR (€), GBP (£), and JPY (¥).
- QR code digital pass generation and gatekeeper scanner admin view with anti-replay protection.
- 7-minute temporary seat hold engine with automated release timer.
- Demo payment simulation and 90% cancellation refund calculator.
