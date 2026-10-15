import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { resolveShowtime } from '../services/showtimeResolver.js';
import { seatReservationService } from '../services/seatReservationService.js';

const router = Router();

// POST /api/shows/resolve -> maps (movie, theatre, date, time) to a real DB showtime id
router.post('/resolve', async (req: Request, res: Response) => {
  try {
    const showtime = await resolveShowtime(req.body);
    return res.json({ success: true, showtimeId: showtime.id, showtime });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Failed to resolve showtime' });
  }
});

// GET /api/shows
router.get('/', (req: Request, res: Response) => {
  const { movieId, cinemaId, date } = req.query;
  let showtimes = db.getShowtimes(
    movieId as string,
    cinemaId as string,
    date as string
  );

  if (showtimes.length === 0) {
    if (cinemaId) {
      showtimes = db.getShowtimes(undefined, cinemaId as string, undefined);
    }
    if (showtimes.length === 0 && movieId) {
      showtimes = db.getShowtimes(movieId as string, undefined, undefined);
    }
    if (showtimes.length === 0) {
      showtimes = db.getShowtimes();
    }
  }

  return res.json({
    success: true,
    total: showtimes.length,
    showtimes
  });
});

// GET /api/shows/:id
router.get('/:id', (req: Request, res: Response) => {
  const show = db.getShowtimeById(req.params.id);
  if (!show) {
    return res.status(404).json({ success: false, message: 'Showtime not found' });
  }

  const movie = db.getMovieById(show.movieId);
  const cinemas = db.getCinemas();
  const cinema = cinemas.find(c => c.id === show.cinemaId);

  return res.json({
    success: true,
    show,
    movie,
    cinema
  });
});

// GET /api/shows/:id/seats (Live seat statuses with booked & hold conflict detection)
router.get('/:id/seats', async (req: Request, res: Response) => {
  const showId = req.params.id;
  const sessionId = req.query.sessionId as string;

  // Primary source of truth: Prisma (same store used by /api/seats/lock and /api/payment/verify)
  const liveSeats = await seatReservationService.getLiveSeats(showId, sessionId).catch(() => null);
  if (liveSeats) {
    const totalSeats = liveSeats.length;
    const bookedCount = liveSeats.filter(s => s.status === 'reserved').length;
    const heldCount = liveSeats.filter(s => s.status === 'held').length;
    const availableCount = Math.max(0, totalSeats - bookedCount - heldCount);

    return res.json({
      success: true,
      showtimeId: showId,
      source: 'database',
      totalSeats,
      availableCount,
      bookedCount,
      reservedCount: bookedCount,
      heldCount,
      seats: liveSeats
    });
  }

  const show = db.getShowtimeById(showId);

  if (!show) {
    return res.status(404).json({ success: false, message: 'Showtime not found' });
  }

  const seats = db.getSeatsForShow(showId, sessionId);
  const totalSeats = seats.length;
  const bookedCount = seats.filter(s => s.status === 'reserved').length;
  const heldCount = seats.filter(s => s.status === 'held').length;
  const availableCount = Math.max(0, totalSeats - bookedCount - heldCount);

  return res.json({
    success: true,
    showtimeId: showId,
    totalSeats,
    availableCount,
    bookedCount,
    reservedCount: bookedCount,
    heldCount,
    seats
  });
});

// POST /api/shows/:id/hold (Hold seats with timer countdown)
router.post('/:id/hold', (req: Request, res: Response) => {
  try {
    const showId = req.params.id;
    const { seatIds, sessionId, durationMinutes = 7 } = req.body;

    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ success: false, message: 'seatIds array is required.' });
    }

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required for seat hold tracking.' });
    }

    const result = db.holdSeats(showId, seatIds, sessionId, durationMinutes);
    return res.json({
      message: `${seatIds.length} seat(s) held successfully for ${durationMinutes} minutes.`,
      ...result
    });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to hold seats.'
    });
  }
});

// POST /api/shows/:id/release-hold
router.post('/:id/release-hold', (req: Request, res: Response) => {
  try {
    const showId = req.params.id;
    const { sessionId } = req.body;
    if (sessionId) {
      db.releaseHolds(sessionId, showId);
    }
    return res.json({ success: true, message: 'Seat holds released.' });
  } catch (err: unknown) {
    return res.status(500).json({ success: false, message: (err as Error).message });
  }
});

export default router;
