import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { db } from '../db.js';

const router = Router();

/**
 * POST /api/tickets/verify
 * Validates M-Ticket QR payload or bookingRef and updates status to CHECKED_IN
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { qrData, bookingRef, scannedBy = 'Cinema Gatekeeper' } = req.body;

    let targetRef = bookingRef;
    let targetId = '';

    if (qrData) {
      try {
        const parsed = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
        if (parsed.ref) targetRef = parsed.ref;
        if (parsed.id) targetId = parsed.id;
      } catch {
        // Raw string fallback
        targetRef = qrData.trim();
      }
    }

    if (!targetRef && !targetId) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'No QR code payload or booking reference provided.'
      });
    }

    // Query Booking in Prisma
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          ...(targetRef ? [{ bookingRef: targetRef }] : []),
          ...(targetId ? [{ id: targetId }] : [])
        ]
      },
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

    if (!booking) {
      try {
        const dbResult = db.validateTicket(targetRef || targetId, scannedBy);
        return res.json({
          success: true,
          ...dbResult
        });
      } catch (dbErr: any) {
        return res.status(dbErr.statusCode || 404).json({
          success: false,
          valid: false,
          message: dbErr.message || `Invalid Ticket: Booking "${targetRef || targetId}" does not exist in cinema records.`
        });
      }
    }

    // Check status
    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Ticket ${booking.bookingRef} has been CANCELLED and refunded.`,
        booking
      });
    }

    if (booking.status === 'CHECKED_IN') {
      return res.status(200).json({
        success: true,
        valid: false,
        alreadyCheckedIn: true,
        checkedInAt: booking.checkedInAt,
        booking,
        message: `Ticket ${booking.bookingRef} was ALREADY CHECKED IN on ${booking.checkedInAt ? new Date(booking.checkedInAt).toLocaleTimeString() : 'earlier'}.`
      });
    }

    // Approve check-in and update to CHECKED_IN
    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'CHECKED_IN',
        checkedInAt: new Date()
      },
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

    return res.status(200).json({
      success: true,
      valid: true,
      alreadyCheckedIn: false,
      checkedInAt: updated.checkedInAt,
      scannedBy,
      booking: updated,
      message: `Verified! Welcome to ${booking.showtime.screen.theatre.name}. Guest check-in approved for ${booking.customerName}.`
    });
  } catch (err: any) {
    console.error('Ticket verification error:', err);
    return res.status(500).json({ success: false, valid: false, message: err.message || 'Ticket verification failed' });
  }
});

/**
 * GET /api/tickets/recent-scans
 * Returns recent check-ins for gatekeeper activity log
 */
router.get('/recent-scans', async (_req: Request, res: Response) => {
  try {
    const recent = await prisma.booking.findMany({
      where: { status: 'CHECKED_IN' },
      orderBy: { checkedInAt: 'desc' },
      take: 10,
      include: {
        showtime: {
          include: {
            movie: true,
            screen: { include: { theatre: true } }
          }
        }
      }
    });

    return res.json({ success: true, scans: recent });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
