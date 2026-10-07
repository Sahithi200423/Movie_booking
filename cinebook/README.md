# CineBook 🎬 — Next-Gen Movie Ticket Booking Platform

> **Every Ticket ₹5 • Instant Reservations • Supabase PostgreSQL Architecture**

CineBook is a production-style movie ticket booking platform built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth, Realtime)**.

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
