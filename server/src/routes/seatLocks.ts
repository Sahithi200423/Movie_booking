import { Router, Request, Response } from 'express';
import { seatReservationService } from '../services/seatReservationService.js';

const router = Router();

// Helper to extract session identifier
function getSessionIdentifier(req: Request): string {
  return (
    req.body.sessionId ||
    req.body.heldBy ||
    req.headers['x-session-id'] ||
    req.ip ||
    'session_default'
  );
}

// POST /api/seats/lock (Acquire 10-minute hold on seats)
router.post('/lock', async (req: Request, res: Response) => {
  try {
    const { showtimeId, seatNumbers, selectedSeats, seatIds, userId, durationMinutes = 10 } = req.body;
    const targetSeats = seatNumbers || selectedSeats || seatIds || [];
    const sessionId = getSessionIdentifier(req);

    if (!showtimeId || !Array.isArray(targetSeats) || targetSeats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'showtimeId and selectedSeats (or seatNumbers) array are required.'
      });
    }

    const result = await seatReservationService.lockSeats({
      showtimeId,
      seatNumbers: targetSeats,
      sessionId,
      userId,
      durationMinutes: Number(durationMinutes) || 10
    });

    return res.status(200).json(result);
  } catch (err: any) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: err.message || 'Failed to lock seats',
      conflictingSeat: err.conflictingSeat
    });
  }
});

// Handler for releasing seats
async function handleReleaseSeats(req: Request, res: Response) {
  try {
    const { showtimeId, seatNumbers, selectedSeats, seatIds } = req.body;
    const targetSeats = seatNumbers || selectedSeats || seatIds;
    const sessionId = getSessionIdentifier(req);

    if (!showtimeId) {
      return res.status(400).json({
        success: false,
        message: 'showtimeId is required.'
      });
    }

    const result = await seatReservationService.unlockSeats({
      showtimeId,
      seatNumbers: targetSeats,
      sessionId
    });

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to release seats'
    });
  }
}

// POST /api/seats/release (Primary requested endpoint)
router.post('/release', handleReleaseSeats);

// POST /api/seats/unlock (Backward compatibility)
router.post('/unlock', handleReleaseSeats);

// GET /api/seats/live (Live seat status map)
router.get('/live', async (req: Request, res: Response) => {
  try {
    const showtimeId = req.query.showtimeId as string;
    const sessionId = (req.query.sessionId as string) || (req.headers['x-session-id'] as string);

    if (!showtimeId) {
      return res.status(400).json({ success: false, message: 'showtimeId query param required' });
    }

    const seats = await seatReservationService.getLiveSeats(showtimeId, sessionId);
    if (!seats) {
      return res.status(404).json({ success: false, message: `Showtime ${showtimeId} not found` });
    }
    return res.json({ success: true, showtimeId, seats });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/seats/showtimes/:id (Matrix layout with availability & lock state)
router.get('/showtimes/:id', async (req: Request, res: Response) => {
  try {
    const showtimeId = req.params.id;
    const sessionId = (req.query.sessionId as string) || (req.headers['x-session-id'] as string);

    const seats = await seatReservationService.getLiveSeats(showtimeId, sessionId);
    if (!seats) {
      return res.status(404).json({ success: false, message: `Showtime ${showtimeId} not found` });
    }

    const formatted = seats.map(s => ({
      ...s,
      seatNumber: s.id,
      isBooked: s.status === 'reserved',
      isHeld: s.status === 'held'
    }));

    return res.json({ success: true, showtimeId, seats: formatted });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
