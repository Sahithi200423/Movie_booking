import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { prisma } from '../prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/admin/check-auth (Role-based access control check)
router.get('/check-auth', authenticate, requireAdmin, (req: Request, res: Response) => {
  return res.json({ success: true, authorized: true, user: (req as any).user });
});

// GET /api/admin/stats (Real dynamic stats across database)
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    // 1. Fetch Prisma bookings
    const prismaBookings = await prisma.booking.findMany({
      include: {
        showtime: {
          include: {
            movie: true,
            screen: { include: { theatre: true } }
          }
        },
        payment: true
      }
    });

    // 2. Fetch db.ts bookings
    const dbBookings = db.getAllBookings();

    // 3. Unify bookings
    const seenRefs = new Set<string>();
    const unifiedBookings: any[] = [];

    for (const pb of prismaBookings) {
      const ref = (pb.bookingRef || pb.id).toUpperCase();
      if (!seenRefs.has(ref)) {
        seenRefs.add(ref);
        unifiedBookings.push({
          id: pb.id,
          bookingRef: pb.bookingRef,
          movieTitle: pb.showtime?.movie?.title || 'Cinema Screening',
          theatreName: pb.showtime?.screen?.theatre?.name || 'PVR Cinema',
          seatsCount: pb.seatsCount || 1,
          totalAmount: pb.totalAmount,
          status: pb.status.toLowerCase(),
          bookedAt: pb.createdAt ? new Date(pb.createdAt).toISOString() : new Date().toISOString()
        });
      }
    }

    for (const dbb of dbBookings) {
      const ref = ((dbb as any).bookingRef || (dbb as any).bookingId || dbb.id).toUpperCase();
      if (!seenRefs.has(ref)) {
        seenRefs.add(ref);
        unifiedBookings.push({
          id: dbb.id,
          bookingRef: (dbb as any).bookingId || dbb.id,
          movieTitle: dbb.movieTitle,
          theatreName: dbb.cinemaName,
          seatsCount: (dbb.seats || []).length || 1,
          totalAmount: dbb.totalAmount,
          status: dbb.status,
          bookedAt: dbb.bookedAt
        });
      }
    }

    // Calculations
    const totalBookings = unifiedBookings.length;
    const confirmedBookings = unifiedBookings.filter(b => b.status === 'confirmed');
    const cancelledBookings = unifiedBookings.filter(b => b.status === 'cancelled');

    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookings = unifiedBookings.filter(b => b.bookedAt && b.bookedAt.startsWith(todayStr)).length;

    const totalRevenue = Math.round(confirmedBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0) * 100) / 100;
    const ticketsSold = confirmedBookings.reduce((sum, b) => sum + (Number(b.seatsCount) || 1), 0);

    // Compute popular movies
    const movieMap: Record<string, { title: string; count: number; revenue: number }> = {};
    for (const b of confirmedBookings) {
      const title = b.movieTitle || 'Unknown';
      if (!movieMap[title]) movieMap[title] = { title, count: 0, revenue: 0 };
      movieMap[title].count += b.seatsCount;
      movieMap[title].revenue += b.totalAmount;
    }
    const popularMovies = Object.values(movieMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Compute popular theatres
    const theatreMap: Record<string, { name: string; count: number; revenue: number }> = {};
    for (const b of confirmedBookings) {
      const name = b.theatreName || 'Unknown';
      if (!theatreMap[name]) theatreMap[name] = { name, count: 0, revenue: 0 };
      theatreMap[name].count += b.seatsCount;
      theatreMap[name].revenue += b.totalAmount;
    }
    const popularTheatres = Object.values(theatreMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Total available seats calculation
    const totalPrismaSeats = await prisma.seat.count().catch(() => 512);
    const bookedPrismaSeats = await prisma.seatReservation.count({ where: { status: 'BOOKED' } }).catch(() => 0);
    const availableSeats = Math.max(0, totalPrismaSeats - bookedPrismaSeats);
    const showOccupancy = totalPrismaSeats > 0 ? Math.round((bookedPrismaSeats / totalPrismaSeats) * 100) : 15;

    const baseStats = db.getAdminStats();

    return res.json({
      success: true,
      stats: {
        totalBookings,
        todayBookings,
        confirmedCount: confirmedBookings.length,
        cancelledCount: cancelledBookings.length,
        totalRevenue,
        ticketsSold,
        availableSeats,
        popularMovies,
        popularTheatres,
        showOccupancy: Math.min(100, Math.max(8, showOccupancy)),
        activeMovies: baseStats.activeMovies,
        comingSoonMovies: baseStats.comingSoonMovies,
        totalCinemas: baseStats.totalCinemas,
        totalUsers: (await prisma.user.count().catch(() => 0)) + baseStats.totalUsers
      }
    });
  } catch (err: any) {
    console.error('Error calculating admin stats:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to calculate stats' });
  }
});

// GET /api/admin/bookings
router.get('/bookings', async (_req: Request, res: Response) => {
  try {
    const prismaBookings = await prisma.booking.findMany({
      include: {
        showtime: {
          include: {
            movie: true,
            screen: { include: { theatre: true } }
          }
        },
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const dbBookings = db.getAllBookings();

    const seenRefs = new Set<string>();
    const unified: any[] = [];

    for (const b of prismaBookings) {
      const ref = (b.bookingRef || b.id).toUpperCase();
      if (!seenRefs.has(ref)) {
        seenRefs.add(ref);
        let parsedSeats = [];
        try {
          if (b.seatDetails) parsedSeats = JSON.parse(b.seatDetails);
        } catch {}

        unified.push({
          id: b.id,
          bookingId: b.bookingRef,
          bookingRef: b.bookingRef,
          movieTitle: b.showtime?.movie?.title || 'Blockbuster Movie',
          moviePoster: b.showtime?.movie?.posterUrl,
          cinemaName: b.showtime?.screen?.theatre?.name || 'PVR Cinema',
          hall: b.showtime?.screen?.name || 'Screen 1',
          format: b.showtime?.format || 'IMAX',
          date: b.showtime?.date || 'Today',
          time: b.showtime?.time || '07:30 PM',
          seats: parsedSeats.length > 0 ? parsedSeats : b.seatIds.split(',').map((s: string) => ({ id: s.trim() })),
          totalAmount: b.totalAmount,
          status: b.status.toLowerCase(),
          qrToken: b.qrCodeData,
          checkedIn: b.status === 'CHECKED_IN',
          checkedInAt: b.checkedInAt ? new Date(b.checkedInAt).toISOString() : undefined,
          customer: {
            name: b.customerName,
            email: b.customerEmail,
            phone: b.customerPhone
          },
          bookedAt: b.createdAt ? new Date(b.createdAt).toISOString() : new Date().toISOString()
        });
      }
    }

    for (const b of dbBookings) {
      const ref = ((b as any).bookingRef || (b as any).bookingId || b.id).toUpperCase();
      if (!seenRefs.has(ref)) {
        seenRefs.add(ref);
        unified.push(b);
      }
    }

    unified.sort((a, b) => new Date(b.bookedAt || 0).getTime() - new Date(a.bookedAt || 0).getTime());

    return res.json({
      success: true,
      total: unified.length,
      bookings: unified
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (_req: Request, res: Response) => {
  try {
    const dbUsers = db.getAllUsers();
    const prismaUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    }).catch(() => []);

    const userMap = new Map<string, any>();
    for (const u of dbUsers) userMap.set(u.email.toLowerCase(), u);
    for (const pu of prismaUsers) {
      if (!userMap.has(pu.email.toLowerCase())) {
        userMap.set(pu.email.toLowerCase(), {
          ...pu,
          createdAt: pu.createdAt ? pu.createdAt.toISOString() : new Date().toISOString()
        });
      }
    }

    const users = Array.from(userMap.values());
    return res.json({ success: true, total: users.length, users });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/users/:id/toggle-block
router.post('/users/:id/toggle-block', (req: Request, res: Response) => {
  try {
    const result = db.toggleUserBlock(req.params.id);
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/coupons
router.get('/coupons', (_req: Request, res: Response) => {
  const coupons = db.getCoupons();
  return res.json({ success: true, coupons });
});

// POST /api/admin/coupons
router.post('/coupons', (req: Request, res: Response) => {
  try {
    const { code, description, discountType, discountValue, minSubtotal } = req.body;
    if (!code || !discountValue) {
      return res.status(400).json({ success: false, message: 'Coupon code and discountValue are required.' });
    }

    const newCoupon = db.addCoupon({
      code: code.trim().toUpperCase(),
      description: description || 'Special Promotional Offer',
      discountType: discountType || 'fixed',
      discountValue: Number(discountValue),
      minSubtotal: Number(minSubtotal) || 0,
      expiresAt: req.body.expiresAt || '2028-12-31'
    });

    return res.status(201).json({ success: true, coupon: newCoupon });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/coupons/:code
router.delete('/coupons/:code', (req: Request, res: Response) => {
  const deleted = db.deleteCoupon(req.params.code);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Coupon not found.' });
  }
  return res.json({ success: true, message: `Coupon ${req.params.code} removed.` });
});

// GET /api/admin/reviews
router.get('/reviews', (_req: Request, res: Response) => {
  const reviews = db.getAllReviews();
  return res.json({ success: true, total: reviews.length, reviews });
});

// DELETE /api/admin/reviews/:id
router.delete('/reviews/:id', (req: Request, res: Response) => {
  const deleted = db.deleteReview(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Review not found.' });
  }
  return res.json({ success: true, message: 'Review moderated and removed.' });
});

// POST /api/admin/movies
router.post('/movies', (req: Request, res: Response) => {
  try {
    const movieData = req.body;
    if (!movieData.title || !movieData.synopsis) {
      return res.status(400).json({ success: false, message: 'Movie title and synopsis are required.' });
    }

    const id = movieData.id || movieData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newMovie = db.addMovie({
      ...movieData,
      id,
      languages: Array.isArray(movieData.languages) && movieData.languages.length > 0
        ? movieData.languages
        : [movieData.language || 'English'],
      durationMinutes: Number(movieData.durationMinutes) || 120,
      rating: Number(movieData.rating) || 8.0,
      votesCount: movieData.votesCount || '1.0K',
      formats: Array.isArray(movieData.formats) ? movieData.formats : ['2D', 'IMAX']
    });

    return res.status(201).json({
      success: true,
      message: 'Movie added successfully.',
      movie: newMovie
    });
  } catch (err: unknown) {
    const error = err as Error;
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/admin/movies/:id
router.put('/movies/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateMovie(req.params.id, req.body);
    return res.json({
      success: true,
      message: 'Movie updated successfully.',
      movie: updated
    });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/movies/:id
router.delete('/movies/:id', (req: Request, res: Response) => {
  const deleted = db.deleteMovie(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Movie not found.' });
  }
  return res.json({
    success: true,
    message: 'Movie removed successfully.'
  });
});

// POST /api/admin/showtimes
router.post('/showtimes', (req: Request, res: Response) => {
  try {
    const { movieId, cinemaId, date, time, format, hall, language } = req.body;
    if (!movieId || !cinemaId || !date || !time) {
      return res.status(400).json({ success: false, message: 'movieId, cinemaId, date, and time are required.' });
    }

    const showId = `show-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
    const newShow = db.addShowtime({
      id: showId,
      movieId,
      cinemaId,
      date,
      time,
      format: format || '2D',
      hall: hall || 'Screen 1',
      language: language || 'English',
      priceMultiplier: 1.0
    });

    return res.status(201).json({
      success: true,
      message: 'Showtime scheduled successfully.',
      show: newShow
    });
  } catch (err: unknown) {
    const error = err as Error;
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/showtimes
router.get('/showtimes', (_req: Request, res: Response) => {
  const showtimes = db.getAllShowtimes();
  return res.json({
    success: true,
    total: showtimes.length,
    showtimes
  });
});

// DELETE /api/admin/showtimes/:id
router.delete('/showtimes/:id', (req: Request, res: Response) => {
  const deleted = db.deleteShowtime(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Showtime not found.' });
  }
  return res.json({
    success: true,
    message: 'Showtime deleted successfully.'
  });
});

// --- THEATRE / CINEMA CRUD ---
// GET /api/admin/cinemas
router.get('/cinemas', (_req: Request, res: Response) => {
  const cinemas = db.getCinemas();
  return res.json({ success: true, total: cinemas.length, cinemas });
});

// POST /api/admin/cinemas
router.post('/cinemas', async (req: Request, res: Response) => {
  try {
    const { name, chain, city, address } = req.body;
    if (!name || !city) {
      return res.status(400).json({ success: false, message: 'Name and city are required' });
    }
    const id = req.body.id || `cin-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
    const newCinema = db.addCinema({
      id,
      name,
      chain: chain || 'PVR',
      city,
      location: req.body.location || `${name}, ${city}`,
      address: address || `${name}, ${city}`,
      facilities: req.body.facilities || ['Dolby Atmos', 'Recliner Seats', 'Gourmet Bar'],
      distance: req.body.distance || '2.5 km',
      timezone: req.body.timezone || 'Asia/Kolkata',
      screensCount: Number(req.body.screensCount) || 4,
      amenities: req.body.amenities || ['Dolby Atmos', 'Recliner Seats', 'Gourmet Bar']
    });

    // Also persist to Prisma if possible
    await prisma.theatre.create({
      data: {
        id,
        name,
        chain: chain || 'PVR',
        city,
        address: address || `${name}, ${city}`
      }
    }).catch(() => null);

    return res.status(201).json({ success: true, cinema: newCinema });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/cinemas/:id
router.put('/cinemas/:id', async (req: Request, res: Response) => {
  try {
    const updated = db.updateCinema(req.params.id, req.body);
    await prisma.theatre.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
        chain: req.body.chain,
        city: req.body.city,
        address: req.body.address
      }
    }).catch(() => null);

    return res.json({ success: true, cinema: updated });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/cinemas/:id
router.delete('/cinemas/:id', async (req: Request, res: Response) => {
  const deleted = db.deleteCinema(req.params.id);
  await prisma.theatre.delete({ where: { id: req.params.id } }).catch(() => null);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Cinema not found' });
  }
  return res.json({ success: true, message: 'Cinema deleted successfully' });
});

// --- SCREEN CRUD ---
// GET /api/admin/screens
router.get('/screens', async (req: Request, res: Response) => {
  try {
    const { theatreId } = req.query;
    const where = theatreId ? { theatreId: String(theatreId) } : {};
    const screens = await prisma.screen.findMany({
      where,
      include: { theatre: true, seats: true }
    });
    return res.json({ success: true, total: screens.length, screens });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/screens
router.post('/screens', async (req: Request, res: Response) => {
  try {
    const { theatreId, name, screenNumber, format } = req.body;
    if (!theatreId || !name) {
      return res.status(400).json({ success: false, message: 'theatreId and name are required' });
    }

    let targetTheatreId = theatreId;
    const existingTheatre = await prisma.theatre.findUnique({ where: { id: theatreId } });
    if (!existingTheatre) {
      const createdTheatre = await prisma.theatre.create({
        data: {
          id: theatreId,
          name: 'Multiplex Grand',
          chain: 'PVR',
          city: 'Hyderabad',
          address: 'Main Boulevard'
        }
      });
      targetTheatreId = createdTheatre.id;
    }

    const screen = await prisma.screen.create({
      data: {
        theatreId: targetTheatreId,
        name,
        screenNumber: Number(screenNumber) || 1,
        format: format || '2D'
      }
    });
    return res.status(201).json({ success: true, screen });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/screens/:id
router.put('/screens/:id', async (req: Request, res: Response) => {
  try {
    const screen = await prisma.screen.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
        format: req.body.format,
        screenNumber: req.body.screenNumber ? Number(req.body.screenNumber) : undefined
      }
    });
    return res.json({ success: true, screen });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/screens/:id
router.delete('/screens/:id', async (req: Request, res: Response) => {
  try {
    await prisma.screen.delete({ where: { id: req.params.id } });
    return res.json({ success: true, message: 'Screen deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// --- SEAT CRUD ---
// GET /api/admin/screens/:screenId/seats
router.get('/screens/:screenId/seats', async (req: Request, res: Response) => {
  try {
    const seats = await prisma.seat.findMany({
      where: { screenId: req.params.screenId },
      orderBy: [{ row: 'asc' }, { number: 'asc' }]
    });
    return res.json({ success: true, total: seats.length, seats });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/screens/:screenId/seats
router.post('/screens/:screenId/seats', async (req: Request, res: Response) => {
  try {
    const { row, number, tier, basePrice } = req.body;
    if (!row || !number) {
      return res.status(400).json({ success: false, message: 'Row and seat number are required' });
    }
    const seatNumber = `${row.toUpperCase()}${number}`;
    const seat = await prisma.seat.create({
      data: {
        screenId: req.params.screenId,
        row: row.toUpperCase(),
        number: Number(number),
        seatNumber,
        tier: tier || 'EXECUTIVE',
        basePrice: Number(basePrice) || 220.0
      }
    });
    return res.status(201).json({ success: true, seat });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/seats/:id
router.put('/seats/:id', async (req: Request, res: Response) => {
  try {
    const seat = await prisma.seat.update({
      where: { id: req.params.id },
      data: {
        tier: req.body.tier,
        basePrice: req.body.basePrice ? Number(req.body.basePrice) : undefined
      }
    });
    return res.json({ success: true, seat });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/seats/:id
router.delete('/seats/:id', async (req: Request, res: Response) => {
  try {
    await prisma.seat.delete({ where: { id: req.params.id } });
    return res.json({ success: true, message: 'Seat deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// --- BOOKING MANAGEMENT ---
// PUT /api/admin/bookings/:id/status
router.put('/bookings/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const normStatus = status.toUpperCase();

    // Check Prisma booking
    const prismaBooking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: req.params.id },
          { bookingRef: req.params.id }
        ]
      }
    });

    if (prismaBooking) {
      const updated = await prisma.booking.update({
        where: { id: prismaBooking.id },
        data: {
          status: normStatus,
          checkedInAt: normStatus === 'CHECKED_IN' ? new Date() : undefined
        }
      });

      if (normStatus === 'CANCELLED') {
        await prisma.seatReservation.deleteMany({
          where: { bookingId: prismaBooking.id }
        }).catch(() => null);

        if (prismaBooking.paymentId) {
          await prisma.payment.update({
            where: { id: prismaBooking.paymentId },
            data: { status: 'REFUNDED' }
          }).catch(() => null);
        }
      }

      return res.json({ success: true, message: 'Booking status updated in Prisma', booking: updated });
    }

    // Check local db booking
    const dbBooking = db.getAllBookings().find(b => b.id === req.params.id || (b as any).bookingId === req.params.id);
    if (dbBooking) {
      dbBooking.status = status.toLowerCase();
      return res.json({ success: true, message: 'Booking status updated in database', booking: dbBooking });
    }

    return res.status(404).json({ success: false, message: 'Booking not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
