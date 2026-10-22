import { Router, Request, Response } from 'express';
import { seatReservationService } from '../services/seatReservationService.js';
import { seatLockLimiter, seatLockIpLimiter } from '../middleware/rateLimiter.js';
import { isPortfolioDemoMode } from '../middleware/demoMode.js';

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

// POST /api/seats/lock (Acquire 10-minute hold on seats - Two-tier rate limited: 120/min per IP + 60/min per session)
router.post('/lock', seatLockIpLimiter, seatLockLimiter, async (req: Request, res: Response) => {
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

    if (targetSeats.length > 8) {
      return res.status(400).json({
        success: false,
        message: 'A maximum of 8 seats can be locked in a single transaction.'
      });
    }

    // In Portfolio Demo Mode: simulate hold without altering production database records
    if (isPortfolioDemoMode()) {
      return res.status(200).json({
        success: true,
        isDemoMode: true,
        message: 'Seat hold simulated in portfolio demo mode. Production database records were not altered.',
        showtimeId,
        lockedSeats: targetSeats,
        heldSeats: targetSeats,
        expiresAt: Date.now() + Number(durationMinutes) * 60 * 1000,
        holdSecondsRemaining: Number(durationMinutes) * 60
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

    if (isPortfolioDemoMode()) {
      return res.status(200).json({
        success: true,
        isDemoMode: true,
        message: 'Seat release simulated in portfolio demo mode.',
        showtimeId,
        unlockedSeats: targetSeats || []
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

// POST /api/seats/release (Primary requested endpoint - Two-tier rate limited)
router.post('/release', seatLockIpLimiter, seatLockLimiter, handleReleaseSeats);

// POST /api/seats/unlock (Backward compatibility - Two-tier rate limited)
router.post('/unlock', seatLockIpLimiter, seatLockLimiter, handleReleaseSeats);

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
