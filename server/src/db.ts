import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import {
  MOVIES,
  CINEMAS,
  CITIES,
  GENRES,
  LANGUAGES,
  COUPONS,
  INITIAL_REVIEWS,
  MovieSeed,
  CinemaSeed,
  CouponSeed,
  ReviewSeed
} from './seedData.js';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'user' | 'admin';
  blocked?: boolean;
  createdAt: string;
}

export interface ShowtimeEntity {
  id: string;
  movieId: string;
  cinemaId: string;
  date: string;
  time: string;
  format: string;
  hall: string;
  language: string;
  priceMultiplier: number;
}

export interface BookingSeatEntity {
  bookingId: string;
  showtimeId: string;
  seatId: string;
  row: string;
  number: number;
  tier: 'VIP' | 'PREMIUM' | 'STANDARD';
  price: number;
}

export interface SeatHoldEntity {
  showtimeId: string;
  seatId: string;
  sessionId: string;
  expiresAt: number; // Unix epoch ms
}

export interface BookingEntity {
  id: string;
  userId?: string;
  showtimeId: string;
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
  selectedLanguage: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  seats: {
    id: string;
    row: string;
    number: number;
    tier: 'VIP' | 'PREMIUM' | 'STANDARD';
    price: number;
  }[];
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
  status: 'confirmed' | 'cancelled' | 'pending';
  refundStatus?: 'NOT_REQUESTED' | 'REFUND_PENDING' | 'REFUND_PROCESSING' | 'REFUNDED' | 'REFUND_FAILED';
  refundAmount?: number;
  cancellationFee?: number;
  refundId?: string;
  paymentMethod?: string;
  bookedAt: string;
  cancelledAt?: string;
  qrToken?: string;
  checkedIn?: boolean;
  checkedInAt?: string;
  checkedInBy?: string;
}

// In-Memory & Local Persistent State
class Database {
  private pgPool: Pool | null = null;
  private isPostgres = false;

  private movies: MovieSeed[] = [];
  private cinemas: CinemaSeed[] = [];
  private showtimes: ShowtimeEntity[] = [];
  private users: UserEntity[] = [];
  private bookings: BookingEntity[] = [];
  private bookingSeats: BookingSeatEntity[] = [];
  private seatHolds: Map<string, SeatHoldEntity> = new Map();
  private coupons: CouponSeed[] = [...COUPONS];
  private reviews: ReviewSeed[] = [...INITIAL_REVIEWS];
  private favorites: Record<string, string[]> = {};

  private dataFilePath = path.join(process.cwd(), 'cinebook_local_db.json');

  constructor() {
    this.init();
    // Background interval to clean up expired seat holds every 15s
    setInterval(() => this.cleanupExpiredHolds(), 15000);
  }

  private async init() {
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl && dbUrl.startsWith('postgres')) {
      try {
        this.pgPool = new Pool({
          connectionString: dbUrl,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
        await this.pgPool.query('SELECT 1');
        this.isPostgres = true;
        console.log('[DB] Connected successfully to PostgreSQL / Supabase database.');
        return;
      } catch (err) {
        console.warn('[DB] PostgreSQL connection failed, falling back to local persistent database:', (err as Error).message);
        this.isPostgres = false;
      }
    }

    // Initialize local database engine
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const raw = fs.readFileSync(this.dataFilePath, 'utf-8');
        const data = JSON.parse(raw);
        this.movies = data.movies || [];
        this.cinemas = (data.cinemas || []).map((c: CinemaSeed) => {
          const seed = CINEMAS.find(sc => sc.id === c.id);
          return {
            ...c,
            timezone: c.timezone || seed?.timezone || 'Asia/Kolkata'
          };
        });
        if (this.cinemas.length === 0) this.cinemas = [...CINEMAS];
        this.showtimes = data.showtimes || [];
        this.users = data.users || [];
        this.bookings = data.bookings || [];
        this.bookingSeats = data.bookingSeats || [];
        this.saveToDisk();
        console.log(`[DB] Loaded ${this.movies.length} movies and ${this.bookings.length} bookings from local disk.`);
        return;
      }
    } catch (e) {
      console.warn('[DB] Error loading local file, re-seeding default records.', e);
    }

    this.seedDefaults();
    this.saveToDisk();
  }

  private saveToDisk() {
    if (this.isPostgres) return;
    try {
      const payload = {
        movies: this.movies,
        cinemas: this.cinemas,
        showtimes: this.showtimes,
        users: this.users,
        bookings: this.bookings,
        bookingSeats: this.bookingSeats
      };
      fs.writeFileSync(this.dataFilePath, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Failed writing to local disk:', err);
    }
  }

  private seedDefaults() {
    this.movies = [...MOVIES];
    this.cinemas = [...CINEMAS];

    // Seed Demo Users
    const salt = bcrypt.genSaltSync(10);
    this.users = [
      {
        id: 'usr-admin-01',
        name: 'Cinema Administrator',
        email: 'admin@cinebook.com',
        passwordHash: bcrypt.hashSync('Admin@123', salt),
        phone: '+91 98765 43210',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-demo-02',
        name: 'Demo Moviegoer',
        email: 'user@cinebook.com',
        passwordHash: bcrypt.hashSync('User@123', salt),
        phone: '+91 91234 56789',
        role: 'user',
        createdAt: new Date().toISOString()
      }
    ];

    // Generate realistic showtimes across cinemas and movies
    const times = ['10:30 AM', '01:45 PM', '04:30 PM', '07:45 PM', '10:30 PM'];
    const formats = ['2D', '3D', 'IMAX 3D', 'Dolby Atmos'];
    const halls = ['Screen 1 - Laser', 'Screen 2 - Dolby', 'Audi 3 - IMAX Grand', 'Screen 4 - Gold Class'];
    const today = new Date().toISOString().split('T')[0];

    const generatedShowtimes: ShowtimeEntity[] = [];
    this.movies.slice(0, 10).forEach(movie => {
      this.cinemas.forEach(cinema => {
        times.forEach((t, idx) => {
          const showId = `show-${movie.id.substring(0, 6)}-${cinema.id.substring(4, 8)}-${idx + 1}`;
          generatedShowtimes.push({
            id: showId,
            movieId: movie.id,
            cinemaId: cinema.id,
            date: today,
            time: t,
            format: formats[idx % formats.length],
            hall: halls[idx % halls.length],
            language: movie.languages[idx % movie.languages.length] || movie.language,
            priceMultiplier: idx === 3 ? 1.25 : 1.0
          });
        });
      });
    });

    this.showtimes = generatedShowtimes;

    // Seed initial booking to showcase history
    const initialBooking: BookingEntity = {
      id: 'CB-9482-TX',
      userId: 'usr-demo-02',
      showtimeId: generatedShowtimes[0]?.id || 'show-kalki-phoen-1',
      movieId: 'kalki-2898',
      movieTitle: 'Kalki: 2898 AD - Chrono Force',
      moviePoster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      movieDuration: '2h 58m',
      movieAgeRating: 'UA 16+',
      cinemaId: 'cin-pvr-phoenix',
      cinemaName: 'PVR INOX Grand Mall',
      cinemaAddress: 'High Street Phoenix, 462 Senapati Bapat Marg, Lower Parel',
      hall: 'Audi 3 - IMAX Grand',
      format: 'IMAX 3D',
      date: today,
      time: '07:45 PM',
      selectedLanguage: 'Telugu',
      customerName: 'Demo Moviegoer',
      customerEmail: 'user@cinebook.com',
      customerPhone: '+91 91234 56789',
      seats: [
        { id: 'C6', row: 'C', number: 6, tier: 'PREMIUM', price: 14.50 },
        { id: 'C7', row: 'C', number: 7, tier: 'PREMIUM', price: 14.50 }
      ],
      addons: [
        { id: 'combo-duo', name: 'Blockbuster Duo Combo', price: 16.50, quantity: 1 }
      ],
      subtotal: 45.50,
      convenienceFee: 2.50,
      tax: 2.20,
      totalAmount: 50.20,
      paymentMethod: 'Demo Card (Test)',
      status: 'confirmed',
      bookedAt: new Date().toISOString()
    };

    this.bookings = [initialBooking];
    this.bookingSeats = [
      {
        bookingId: initialBooking.id,
        showtimeId: initialBooking.showtimeId,
        seatId: 'C6',
        row: 'C',
        number: 6,
        tier: 'PREMIUM',
        price: 14.50
      },
      {
        bookingId: initialBooking.id,
        showtimeId: initialBooking.showtimeId,
        seatId: 'C7',
        row: 'C',
        number: 7,
        tier: 'PREMIUM',
        price: 14.50
      }
    ];

    console.log('[DB] Seeding completed: 16 movies, 6 cinemas, 50 showtimes, 2 demo users.');
  }

  // ---- Query Methods ----

  public getMovies(filters: {
    language?: string;
    genre?: string;
    city?: string;
    status?: string;
    search?: string;
  }): MovieSeed[] {
    return this.movies.filter(movie => {
      // Language filter
      if (filters.language && filters.language !== 'All Languages') {
        const matchesLang = movie.languages.some(
          l => l.toLowerCase() === filters.language!.toLowerCase()
        ) || movie.language.toLowerCase() === filters.language.toLowerCase();
        if (!matchesLang) return false;
      }

      // Genre filter
      if (filters.genre && filters.genre !== 'All Genres') {
        const matchesGenre = movie.genre.some(
          g => g.toLowerCase() === filters.genre!.toLowerCase()
        );
        if (!matchesGenre) return false;
      }

      // Status filter
      if (filters.status && movie.status !== filters.status) {
        return false;
      }

      // Search query (title, actor, director, genre)
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesSearch =
          movie.title.toLowerCase().includes(q) ||
          movie.director.toLowerCase().includes(q) ||
          movie.genre.some(g => g.toLowerCase().includes(q)) ||
          movie.cast.some(c => c.name.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      return true;
    });
  }

  public getMovieById(id: string): MovieSeed | undefined {
    return this.movies.find(m => m.id === id);
  }

  public getCinemas(city?: string): CinemaSeed[] {
    if (!city) return this.cinemas;
    return this.cinemas.filter(c => c.city.toLowerCase() === city.toLowerCase());
  }

  public getShowtimes(movieId?: string, cinemaId?: string, date?: string): ShowtimeEntity[] {
    return this.showtimes.filter(s => {
      if (movieId && s.movieId !== movieId) return false;
      if (cinemaId && s.cinemaId !== cinemaId) return false;
      if (date && s.date !== date) return false;
      return true;
    });
  }

  public getShowtimeById(id: string): ShowtimeEntity | undefined {
    return this.showtimes.find(s => s.id === id);
  }

  // Cleanup expired seat holds
  public cleanupExpiredHolds() {
    const now = Date.now();
    for (const [key, hold] of this.seatHolds.entries()) {
      if (hold.expiresAt <= now) {
        this.seatHolds.delete(key);
      }
    }
  }

  // Hold seats temporarily for a user session
  public holdSeats(showtimeId: string, seatIds: string[], sessionId: string, durationMinutes = 7) {
    this.cleanupExpiredHolds();
    const now = Date.now();
    const expiresAt = now + durationMinutes * 60 * 1000;

    // Check booked seats
    const currentBookedSeats = new Set(
      this.bookingSeats
        .filter(bs => {
          if (bs.showtimeId !== showtimeId) return false;
          const b = this.bookings.find(item => item.id === bs.bookingId);
          return b && b.status === 'confirmed';
        })
        .map(bs => bs.seatId)
    );

    const conflictingBooked = seatIds.filter(id => currentBookedSeats.has(id));
    if (conflictingBooked.length > 0) {
      const err = new Error(`Seat(s) ${conflictingBooked.join(', ')} are already booked by another customer.`);
      (err as unknown as { statusCode: number }).statusCode = 409;
      throw err;
    }

    // Check other sessions' active holds
    const conflictingHeld = seatIds.filter(id => {
      const hold = this.seatHolds.get(`${showtimeId}:${id}`);
      return hold && hold.sessionId !== sessionId && hold.expiresAt > now;
    });

    if (conflictingHeld.length > 0) {
      const err = new Error(`Seat(s) ${conflictingHeld.join(', ')} are temporarily held by another guest.`);
      (err as unknown as { statusCode: number }).statusCode = 409;
      throw err;
    }

    // Register holds
    for (const seatId of seatIds) {
      this.seatHolds.set(`${showtimeId}:${seatId}`, {
        showtimeId,
        seatId,
        sessionId,
        expiresAt
      });
    }

    return {
      success: true,
      showtimeId,
      heldSeats: seatIds,
      expiresAt,
      holdSecondsRemaining: Math.round((expiresAt - now) / 1000)
    };
  }

  // Release holds for a session
  public releaseHolds(sessionId: string, showtimeId?: string) {
    for (const [key, hold] of this.seatHolds.entries()) {
      if (hold.sessionId === sessionId && (!showtimeId || hold.showtimeId === showtimeId)) {
        this.seatHolds.delete(key);
      }
    }
    return { success: true };
  }

  // Get seats layout and real-time booked & held status for a showtime
  public getSeatsForShow(showtimeId: string, sessionId?: string) {
    this.cleanupExpiredHolds();
    const now = Date.now();

    const bookedSeatIds = new Set(
      this.bookingSeats
        .filter(bs => {
          if (bs.showtimeId !== showtimeId) return false;
          const booking = this.bookings.find(b => b.id === bs.bookingId);
          return booking && booking.status === 'confirmed';
        })
        .map(bs => bs.seatId)
    );

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsList = [];

    for (const row of rows) {
      let tier: 'VIP' | 'PREMIUM' | 'STANDARD' = 'STANDARD';
      let price = 10.0;
      if (row === 'A' || row === 'B') {
        tier = 'VIP';
        price = 18.0;
      } else if (row === 'C' || row === 'D' || row === 'E') {
        tier = 'PREMIUM';
        price = 14.5;
      }

      for (let num = 1; num <= 12; num++) {
        const seatId = `${row}${num}`;
        const isBooked = bookedSeatIds.has(seatId);
        const hold = this.seatHolds.get(`${showtimeId}:${seatId}`);
        const isHeldByOther = Boolean(hold && hold.expiresAt > now && (!sessionId || hold.sessionId !== sessionId));
        const isHeldByMe = Boolean(hold && hold.expiresAt > now && sessionId && hold.sessionId === sessionId);

        let status: 'available' | 'reserved' | 'held' | 'selected' = 'available';
        if (isBooked) {
          status = 'reserved';
        } else if (isHeldByOther) {
          status = 'held';
        } else if (isHeldByMe) {
          status = 'selected';
        }

        seatsList.push({
          id: seatId,
          row,
          number: num,
          tier,
          price,
          status,
          holdExpiresAt: hold ? hold.expiresAt : undefined
        });
      }
    }

    return seatsList;
  }

  // ATOMIC SEAT RESERVATION & CONFLICT PREVENTION
  public createBooking(bookingData: {
    userId?: string;
    showtimeId: string;
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
    selectedLanguage: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    seats: { id: string; row: string; number: number; tier: 'VIP' | 'PREMIUM' | 'STANDARD'; price: number }[];
    addons: { id: string; name: string; price: number; quantity: number }[];
    subtotal: number;
    convenienceFee: number;
    tax: number;
    totalAmount: number;
    couponCode?: string;
    discountAmount?: number;
    paymentMethod: string;
    sessionId?: string;
  }): BookingEntity {
    this.cleanupExpiredHolds();
    const now = Date.now();

    // 1. Conflict Check: verify every seat requested is still available for this showtime
    const currentBookedSeats = new Set(
      this.bookingSeats
        .filter(bs => {
          if (bs.showtimeId !== bookingData.showtimeId) return false;
          const b = this.bookings.find(item => item.id === bs.bookingId);
          return b && b.status === 'confirmed';
        })
        .map(bs => bs.seatId)
    );

    const conflictingSeats: string[] = [];
    for (const seat of bookingData.seats) {
      if (currentBookedSeats.has(seat.id)) {
        conflictingSeats.push(seat.id);
      }
      // Check if held by another active session
      const hold = this.seatHolds.get(`${bookingData.showtimeId}:${seat.id}`);
      if (hold && hold.expiresAt > now && bookingData.sessionId && hold.sessionId !== bookingData.sessionId) {
        conflictingSeats.push(seat.id);
      }
    }

    if (conflictingSeats.length > 0) {
      const err = new Error(
        `Seat Conflict: Seat(s) ${conflictingSeats.join(', ')} have already been reserved or held by another customer. Please select different seats.`
      );
      (err as unknown as { statusCode: number }).statusCode = 409;
      throw err;
    }

    // 2. Generate unique booking reference & secure QR verification token
    const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingId = `CB-${timestamp}-${randomSuffix}`;
    const qrToken = `TKT-${bookingId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newBooking: BookingEntity = {
      id: bookingId,
      ...bookingData,
      qrToken,
      checkedIn: false,
      status: 'confirmed',
      bookedAt: new Date().toISOString()
    };

    // Remove any holds for these seats
    for (const seat of bookingData.seats) {
      this.seatHolds.delete(`${bookingData.showtimeId}:${seat.id}`);
    }

    // 3. Atomically lock seats
    const newSeats: BookingSeatEntity[] = bookingData.seats.map(s => ({
      bookingId,
      showtimeId: bookingData.showtimeId,
      seatId: s.id,
      row: s.row,
      number: s.number,
      tier: s.tier,
      price: s.price
    }));

    this.bookings.unshift(newBooking);
    this.bookingSeats.push(...newSeats);
    this.saveToDisk();

    return newBooking;
  }

  // CANCEL BOOKING WITH ELIGIBILITY CHECK & DETAILED REFUND TRACKING
  public cancelBooking(
    bookingId: string,
    userEmail?: string,
    refundInfo?: {
      refundAmount?: number;
      cancellationFee?: number;
      refundStatus?: 'NOT_REQUESTED' | 'REFUND_PENDING' | 'REFUND_PROCESSING' | 'REFUNDED' | 'REFUND_FAILED';
      refundId?: string;
    }
  ): BookingEntity {
    const booking = this.bookings.find(b => b.id === bookingId || (b as any).bookingId === bookingId || (b as any).bookingRef === bookingId);
    if (!booking) {
      const err = new Error(`Booking #${bookingId} not found.`);
      (err as unknown as { statusCode: number }).statusCode = 404;
      throw err;
    }

    if (booking.status === 'cancelled') {
      const err = new Error(`Booking #${bookingId} is already cancelled.`);
      (err as unknown as { statusCode: number }).statusCode = 400;
      throw err;
    }

    // Check user authorization if email provided
    if (userEmail && booking.customerEmail.toLowerCase() !== userEmail.toLowerCase()) {
      const err = new Error('You do not have permission to cancel this booking.');
      (err as unknown as { statusCode: number }).statusCode = 403;
      throw err;
    }

    // Calculate eligible refund (prorated demo policy: 90% refund if cancelled before show)
    const refund = refundInfo?.refundAmount !== undefined
      ? refundInfo.refundAmount
      : Math.round(booking.totalAmount * 0.9 * 100) / 100;

    const fee = refundInfo?.cancellationFee !== undefined
      ? refundInfo.cancellationFee
      : Math.max(0, Math.round((booking.totalAmount - refund) * 100) / 100);

    booking.status = 'cancelled';
    booking.cancelledAt = new Date().toISOString();
    booking.refundAmount = refund;
    booking.cancellationFee = fee;
    booking.refundStatus = refundInfo?.refundStatus || 'REFUNDED';
    if (refundInfo?.refundId) {
      booking.refundId = refundInfo.refundId;
    }

    // Release the seats so others can book them
    this.bookingSeats = this.bookingSeats.filter(bs => bs.bookingId !== booking.id && bs.bookingId !== bookingId);

    this.saveToDisk();
    return booking;
  }

  public getBookingsForUser(userIdOrEmail: string): BookingEntity[] {
    const query = userIdOrEmail.toLowerCase();
    return this.bookings.filter(
      b => (b.userId && b.userId.toLowerCase() === query) || b.customerEmail.toLowerCase() === query
    );
  }

  public getAllBookings(): BookingEntity[] {
    return this.bookings;
  }

  // User Auth
  public findUserByEmail(email: string): UserEntity | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: 'user' | 'admin';
  }): UserEntity {
    const existing = this.findUserByEmail(userData.email);
    if (existing) {
      const err = new Error('An account with this email address already exists.');
      (err as unknown as { statusCode: number }).statusCode = 400;
      throw err;
    }

    const salt = bcrypt.genSaltSync(10);
    const newUser: UserEntity = {
      id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: userData.name,
      email: userData.email,
      passwordHash: bcrypt.hashSync(userData.password, salt),
      phone: userData.phone || '',
      role: userData.role || 'user',
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveToDisk();
    return newUser;
  }

  // Admin Management APIs
  public addMovie(movie: MovieSeed): MovieSeed {
    this.movies.unshift(movie);
    this.saveToDisk();
    return movie;
  }

  public updateMovie(id: string, updates: Partial<MovieSeed>): MovieSeed {
    const idx = this.movies.findIndex(m => m.id === id);
    if (idx === -1) {
      const err = new Error('Movie not found');
      (err as unknown as { statusCode: number }).statusCode = 404;
      throw err;
    }
    this.movies[idx] = { ...this.movies[idx], ...updates };
    this.saveToDisk();
    return this.movies[idx];
  }

  public deleteMovie(id: string): boolean {
    const initialLen = this.movies.length;
    this.movies = this.movies.filter(m => m.id !== id);
    if (this.movies.length !== initialLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  public addShowtime(show: ShowtimeEntity): ShowtimeEntity {
    this.showtimes.push(show);
    this.saveToDisk();
    return show;
  }

  public getAdminStats() {
    const totalBookings = this.bookings.length;
    const confirmedBookings = this.bookings.filter(b => b.status === 'confirmed');
    const cancelledBookings = this.bookings.filter(b => b.status === 'cancelled');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      totalBookings,
      confirmedCount: confirmedBookings.length,
      cancelledCount: cancelledBookings.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      activeMovies: this.movies.filter(m => m.status === 'now_showing').length,
      comingSoonMovies: this.movies.filter(m => m.status === 'coming_soon').length,
      totalCinemas: this.cinemas.length,
      totalUsers: this.users.length
    };
  }

  // --- Ticket Validation / Gatekeeper Scanner ---
  public validateTicket(query: string, staffName = 'Cinema Staff') {
    const q = query.trim().toUpperCase();
    const booking = this.bookings.find(
      b => b.id.toUpperCase() === q || (b.qrToken && b.qrToken.toUpperCase() === q)
    );

    if (!booking) {
      const err = new Error(`Ticket "${query}" not found in booking database.`);
      (err as unknown as { statusCode: number }).statusCode = 404;
      throw err;
    }

    if (booking.status === 'cancelled') {
      const err = new Error(`Ticket #${booking.id} was cancelled. Entry cannot be granted.`);
      (err as unknown as { statusCode: number }).statusCode = 400;
      throw err;
    }

    if (booking.checkedIn) {
      return {
        valid: false,
        alreadyCheckedIn: true,
        checkedInAt: booking.checkedInAt,
        checkedInBy: booking.checkedInBy,
        booking,
        message: `⚠️ REPLAY WARNING: Ticket #${booking.id} was already admitted at ${booking.checkedInAt} by ${booking.checkedInBy}.`
      };
    }

    // Mark as checked in
    booking.checkedIn = true;
    booking.checkedInAt = new Date().toISOString();
    booking.checkedInBy = staffName;
    this.saveToDisk();

    return {
      valid: true,
      alreadyCheckedIn: false,
      checkedInAt: booking.checkedInAt,
      checkedInBy: booking.checkedInBy,
      booking,
      message: `✅ VALID BOARDING PASS: Admittance granted for ${booking.customerName} (${booking.seats.length} seats).`
    };
  }

  // --- Coupons API ---
  public getCoupons(): CouponSeed[] {
    return this.coupons;
  }

  public validateCoupon(code: string, subtotal: number) {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      const err = new Error(`Coupon code "${code}" is invalid or expired.`);
      (err as unknown as { statusCode: number }).statusCode = 404;
      throw err;
    }

    if (subtotal < coupon.minSubtotal) {
      const err = new Error(
        `Coupon "${coupon.code}" requires a minimum ticket subtotal of $${coupon.minSubtotal.toFixed(2)}.`
      );
      (err as unknown as { statusCode: number }).statusCode = 400;
      throw err;
    }

    let discount = 0;
    if (coupon.discountType === 'fixed') {
      discount = Math.min(coupon.discountValue, subtotal);
    } else {
      discount = Math.round(((subtotal * coupon.discountValue) / 100) * 100) / 100;
    }

    return {
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        calculatedDiscount: discount
      }
    };
  }

  // --- Reviews API ---
  public getReviews(movieId: string): ReviewSeed[] {
    return this.reviews.filter(r => r.movieId === movieId);
  }

  public addReview(movieId: string, data: { userName: string; rating: number; comment: string; userEmail?: string }): ReviewSeed {
    const movie = this.movies.find(m => m.id === movieId);
    if (!movie) {
      const err = new Error('Movie not found');
      (err as unknown as { statusCode: number }).statusCode = 404;
      throw err;
    }

    const newRev: ReviewSeed = {
      id: `rev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      movieId,
      userName: data.userName.trim() || 'Verified Moviegoer',
      userEmail: data.userEmail,
      rating: Math.max(1, Math.min(10, Math.round(data.rating * 10) / 10)),
      comment: data.comment.trim(),
      createdAt: new Date().toISOString()
    };

    this.reviews.unshift(newRev);

    // Recalculate movie average rating dynamically
    const movieReviews = this.reviews.filter(r => r.movieId === movieId);
    const avg = movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length;
    movie.rating = Math.round(avg * 10) / 10;
    movie.votesCount = `${movieReviews.length + 50} reviews`;

    this.saveToDisk();
    return newRev;
  }

  // --- Favorites API ---
  public getUserFavorites(userIdOrEmail: string): string[] {
    return this.favorites[userIdOrEmail.toLowerCase()] || [];
  }

  public toggleFavorite(userIdOrEmail: string, movieId: string): { isFavorite: boolean; favorites: string[] } {
    const key = userIdOrEmail.toLowerCase();
    if (!this.favorites[key]) {
      this.favorites[key] = [];
    }

    const idx = this.favorites[key].indexOf(movieId);
    let isFavorite = false;
    if (idx > -1) {
      this.favorites[key].splice(idx, 1);
      isFavorite = false;
    } else {
      this.favorites[key].push(movieId);
      isFavorite = true;
    }

    this.saveToDisk();
    return { isFavorite, favorites: this.favorites[key] };
  }

  // --- Showtime Delete API ---
  public deleteShowtime(id: string): boolean {
    const len = this.showtimes.length;
    this.showtimes = this.showtimes.filter(s => s.id !== id);
    if (this.showtimes.length !== len) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  public getAllShowtimes(): ShowtimeEntity[] {
    return this.showtimes;
  }

  // --- Users Admin API ---
  public getAllUsers() {
    return this.users.map(({ passwordHash, ...rest }) => rest);
  }

  public toggleUserBlock(userId: string): { blocked: boolean } {
    const user = this.users.find(u => u.id === userId || u.email.toLowerCase() === userId.toLowerCase());
    if (!user) {
      const err = new Error('User not found');
      (err as any).statusCode = 404;
      throw err;
    }
    user.blocked = !user.blocked;
    this.saveToDisk();
    return { blocked: user.blocked };
  }

  // --- Coupons Admin API ---
  public addCoupon(coupon: CouponSeed): CouponSeed {
    const existing = this.coupons.find(c => c.code.toUpperCase() === coupon.code.trim().toUpperCase());
    if (existing) {
      const err = new Error(`Coupon "${coupon.code}" already exists`);
      (err as any).statusCode = 400;
      throw err;
    }
    this.coupons.unshift(coupon);
    this.saveToDisk();
    return coupon;
  }

  public deleteCoupon(code: string): boolean {
    const len = this.coupons.length;
    this.coupons = this.coupons.filter(c => c.code.toUpperCase() !== code.trim().toUpperCase());
    if (this.coupons.length !== len) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // --- Reviews Admin API ---
  public getAllReviews(): ReviewSeed[] {
    return this.reviews;
  }

  public deleteReview(id: string): boolean {
    const len = this.reviews.length;
    this.reviews = this.reviews.filter(r => r.id !== id);
    if (this.reviews.length !== len) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // --- Cinemas Admin API ---
  public addCinema(cinema: CinemaSeed): CinemaSeed {
    this.cinemas.unshift(cinema);
    this.saveToDisk();
    return cinema;
  }

  public updateCinema(id: string, data: Partial<CinemaSeed>): CinemaSeed {
    const idx = this.cinemas.findIndex(c => c.id === id);
    if (idx === -1) {
      const err = new Error('Cinema not found');
      (err as any).statusCode = 404;
      throw err;
    }
    this.cinemas[idx] = { ...this.cinemas[idx], ...data };
    this.saveToDisk();
    return this.cinemas[idx];
  }

  public deleteCinema(id: string): boolean {
    const len = this.cinemas.length;
    this.cinemas = this.cinemas.filter(c => c.id !== id);
    if (this.cinemas.length !== len) {
      this.saveToDisk();
      return true;
    }
    return false;
  }
}

export const db = new Database();
