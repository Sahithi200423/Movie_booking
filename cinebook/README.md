# CineBook 🎬 — Next-Gen Movie Ticket Booking Platform

> **Every Ticket ₹5 • Instant Reservations • Supabase PostgreSQL Architecture**

CineBook is a production-style movie ticket booking platform built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth, Realtime)**.

> [!NOTE]
> **Engineering Demonstration & Simulation**: CineBook is built as an educational full-stack engineering demonstration and booking simulator. All showtimes, cinema layouts, seat inventories, payment orders, and 90% cancellation refunds are simulated in demo mode for evaluation purposes. No real monetary transactions or physical cinema tickets are issued.
>
> **Free-Tier Backend Wake-Up Notice**: The backend API is hosted on Render's free tier. If the service has been inactive, please allow approximately 30–45 seconds for the backend instance to spin up on your first visit. Once active, all subsequent requests respond with standard low latency.

---

## 🌟 Architecture & Core Principles

### 1. Critical Seat Design
A physical seat does **not** have a global booked/free flag. Instead:
- Physical seats belong to auditoriums (`screens → seats`).
- Availability is dynamically tracked per screening instance via `show_seats` (`shows → show_seats`).
- A seat can be **`AVAILABLE`** for Show 1, **`BOOKED`** for Show 2, and **`BLOCKED`** with an expiring 10-minute hold for Show 3.
- `show_seats.locked_until` manages automatic concurrency release.
- Supabase Realtime emits seat updates across concurrent browser sessions.

### 2. ₹5 Pricing Engine
Every movie ticket base price is strictly **₹5.00**.
The calculation formula is evaluated consistently:
```
Total = (ticket_count × ₹5.00) - discount_amount + applicable_charges
```
Amounts are validated server-side/database-side and never trusted solely from client state.

### 3. Row-Level Security (RLS)
PostgreSQL policies guarantee that:
- Customers can only inspect their own bookings and payment records.
- Customers cannot manipulate another user's reservation.
- Customers cannot mark payment records as successful.
- Administrative functions (movie CRUD, theatre configuration) are restricted to authenticated profiles with `role = 'admin'`.

---

## 📁 Clean Folder Structure

```
cinebook/
├── .env.example                     # Environment template (Supabase keys)
├── README.md                        # Architectural blueprint & guide
├── package.json
├── vite.config.ts                   # Tailwind CSS v4 & Vite 8 configuration
├── supabase/
│   └── migrations/
│       ├── 20261005000000_create_cinebook_schema.sql  # 12 Tables, RLS, functions
│       └── 20261005000001_seed_initial_cinebook_data.sql # Initial seed data
└── src/
    ├── types/                       # Full TypeScript entity definitions
    │   └── index.ts
    ├── lib/                         # Client initialization
    │   └── supabase.ts              # Supabase client & Realtime setup
    ├── contexts/                    # Global state providers
    │   ├── ThemeContext.tsx         # Dark / Light theme persistence
    │   ├── LanguageContext.tsx      # 6 Regional languages (EN, TE, TA, ML, KN, HI)
    │   └── AuthContext.tsx          # Supabase Auth & 1-click Demo sessions
    ├── components/                  # Reusable UI components
    │   ├── Navbar.tsx               # City, Language, Theme, Search, Auth
    │   ├── MovieCard.tsx            # Poster, Rating, ₹5 badge, Booking CTA
    │   ├── AuthModal.tsx            # Login, Registration, 1-Click Demo
    │   ├── SearchModal.tsx          # Instant keyboard shortcut '/' search
    │   └── Footer.tsx               # Value props & brand navigation
    ├── layouts/
    │   └── MainLayout.tsx           # Global shell
    ├── pages/
    │   ├── HomePage.tsx             # Hero, Now Showing, ₹5 guarantee
    │   ├── TheatresPage.tsx         # Multiplexes by city
    │   ├── MyTicketsPage.tsx        # Turnstile QR code boarding passes
    │   ├── AdminPage.tsx            # Metrics dashboard & catalogue management
    │   └── NotFoundPage.tsx         # 404 handler
    └── features/                    # Domain-driven architecture
        ├── movies/                  # Movie queries and filters
        ├── theatres/                # Theatre venues and screens
        ├── shows/                   # Screening slots and schedules
        ├── seats/                   # Seat matrix, 10m lock TTL, Realtime
        ├── bookings/                # Booking and item insertion
        ├── payments/                # Sandbox payment intent simulation
        ├── coupons/                 # Coupon validation & discount logic
        ├── tickets/                 # Digital pass generation & QR verification
        └── admin/                   # Administrative actions & KPI stats
```

---

## 🗄️ Database Schema & Entities

The Supabase migration creates 12 relational tables:

| Table | Purpose | Relationships |
|---|---|---|
| **`profiles`** | Customer & admin accounts | Extends `auth.users` |
| **`movies`** | Title, synopsis, poster, rating, runtime | Linked to `shows` |
| **`theatres`** | Multiplex location, amenities, city | Linked to `screens` |
| **`screens`** | Auditoriums (IMAX 3D, Dolby Atmos) | Linked to `seats` & `shows` |
| **`seats`** | Physical auditorium chairs | Linked to `screens` |
| **`shows`** | Movie screening instances | Linked to `movies`, `screens`, `show_seats` |
| **`show_seats`** | **Seat state per show (AVAILABLE/BLOCKED/BOOKED)** | Linked to `shows` & `seats` |
| **`coupons`** | Promotional discount codes | Linked to `bookings` |
| **`bookings`** | Orders with total ₹5 calculation | Linked to `profiles`, `shows`, `payments` |
| **`booking_items`** | Individual ticket lines for seats | Linked to `bookings` & `show_seats` |
| **`payments`** | Sandbox/gateway transaction records | Linked to `bookings` |
| **`notifications`**| System updates and booking alerts | Linked to `profiles` |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd cinebook
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your Supabase URL and public anon key from the Supabase Project Dashboard:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
*(CineBook includes a built-in instant demo fallback if keys are left blank).*

### 3. Run Supabase Migrations
In the Supabase SQL Editor, run:
1. `supabase/migrations/20261005000000_create_cinebook_schema.sql`
2. `supabase/migrations/20261005000001_seed_initial_cinebook_data.sql`

### 4. Start Development Server
```bash
npm run dev
```
Open **`http://localhost:5174`** in your browser.

---

## 📈 Development History & Engineering Insights

CineBook represents an evolution from initial prototype to a production-grade, highly resilient booking platform. Key engineering challenges solved during pre-deployment optimization include:

### 1. Robust Asia/Kolkata Timezone Handling
- **Problem**: When users selected calendar dates, standard UTC string conversion (`toISOString().split('T')[0]`) occasionally caused date boundary drift (e.g. October 19 rolling backward to October 18 at UTC midnight).
- **Solution**: Implemented an authoritative timezone formatting utility using `Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' })` and explicit local noon anchoring (`12:00:00`), guaranteeing identical date representations across client devices.

### 2. Live Seat Synchronization & Race-Condition Prevention
- **Problem**: In-flight rehydration and rapid user navigation could cause stale session data in `sessionStorage` to overwrite active booking state.
- **Solution**: Designed an atomic state dispatcher (`setActiveMovieAndShowtime`) that synchronizes movie, cinema, date, time, and showtime ID in a single tick. URL query parameters (`?showtimeId=...`) serve as immediate source-of-truth fallbacks while asynchronous backend queries resolve.

### 3. Strict Date Filtering
- **Problem**: Queries for future unseeded dates previously fell back to historical seed records.
- **Solution**: Added strict date matching on the Express backend (`GET /api/shows`), ensuring exact calendar queries return only verified showtimes for that specific day.

### 4. Automated 21-Test Pre-Deployment Regression Suite
- A dedicated end-to-end regression suite (`server/test_suite.cjs`) validates 21 critical vectors prior to production deployment:
  - Database connectivity and health status.
  - Showtime identity resolution and canonical ID parsing.
  - Live seat count validation (128 total, 128 available, 0 booked, 0 held).
  - Seat collision rejection (preventing duplicate bookings).
  - Concurrency hold timeout and automatic inventory release.
  - Consistent ₹5 pricing enforcement.

