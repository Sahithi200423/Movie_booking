import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { prisma } from '../prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { getSocketIO } from '../services/seatReservationService.js';
import { isPastShowtime } from '../utils/dateUtils.js';
import { ensurePrismaShowtime } from '../services/showtimeResolver.js';
import { paymentOrderLimiter } from '../middleware/rateLimiter.js';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_sampleKey';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'sampleSecretKey';
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

const router = Router();

// POST /api/bookings (Create booking with atomic conflict prevention - Rate limited: 20/10m)
router.post('/', paymentOrderLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const {
      showtimeId,
      movieId,
      movieTitle,
      moviePoster,
      movieDuration,
      movieAgeRating,
      cinemaId,
      cinemaName,
      cinemaAddress,
      hall,
      format,
      date,
      time,
      selectedLanguage,
      customerName,
      customerEmail,
      customerPhone,
      seats,
      addons = [],
      paymentMethod = 'Demo Card (Demo Checkout - No real charge)',
      couponCode,
      sessionId
    } = req.body;

    // 1. Basic validation
    if (!showtimeId || !movieId || !cinemaId) {
      return res.status(400).json({ success: false, message: 'Missing showtime, movie, or cinema information.' });
    }

    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ success: false, message: 'Please provide full contact details.' });
    }

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one seat must be selected.' });
    }

    if (seats.length > 8) {
      return res.status(400).json({ success: false, message: 'A maximum of 8 seats can be booked in a single transaction.' });
    }

    // Prevent bookings for past showtimes
    if (isPastShowtime(date, time)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book tickets for a showtime that has already passed.'
      });
    }

    // 2. Authoritative server-side price calculation (CineBook ₹5 Rule)
    // Every movie ticket costs exactly ₹5 per seat (500 paise) regardless of tier.
    // Zero convenience fees, zero platform fees, zero taxes.
    const seatsCount = seats.length;
    const ticketPaisePerSeat = 500;
    const totalInPaise = seatsCount * ticketPaisePerSeat;
    const totalAmount = totalInPaise / 100;
    const subtotal = totalAmount;
    const convenienceFee = 0.00;
    const tax = 0.00;

    // 3. Atomically attempt to book in database (will throw 409 if seats are already taken)
    const booking = db.createBooking({
      userId: req.user?.id,
      showtimeId,
      movieId,
      movieTitle,
      moviePoster,
      movieDuration,
      movieAgeRating,
      cinemaId,
      cinemaName,
      cinemaAddress,
      hall,
      format,
      date,
      time,
      selectedLanguage: selectedLanguage || 'English',
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      seats,
      addons,
      subtotal,
      convenienceFee,
      tax,
      totalAmount,
      couponCode: couponCode ? String(couponCode).trim() : undefined,
      discountAmount: 0,
      paymentMethod,
      sessionId
    });

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully in Demo Mode!',
      booking
    });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Unable to complete booking.'
    });
  }
});

// Helper to format Prisma Booking
function formatPrismaBooking(prismaBooking: any) {
  let parsedSeats: any[] = [];
  if (Array.isArray(prismaBooking.seats) && prismaBooking.seats.length > 0) {
    parsedSeats = prismaBooking.seats.map((s: any) => {
      const row = (s.seatRow || '').trim();
      const num = s.seatNumber ? Number(s.seatNumber) : null;
      const cleanId = (row && num) ? `${row}${num}` : (s.seatId ? s.seatId.replace(/^.*-([A-Z]\d+)$/, '$1') : 'A1');
      return {
        id: cleanId,
        row: row || cleanId.charAt(0) || 'A',
        number: num || parseInt(cleanId.slice(1)) || 1,
        tier: s.tier || 'STANDARD',
        price: Number(s.price) || 5.00
      };
    });
  } else if (prismaBooking.seatDetails) {
    try {
      parsedSeats = JSON.parse(prismaBooking.seatDetails);
    } catch (e) {}
  } else if (prismaBooking.seatIds) {
    parsedSeats = prismaBooking.seatIds.split(',').map((s: string) => {
      const clean = s.trim();
      return {
        id: clean,
        row: clean.charAt(0) || 'A',
        number: parseInt(clean.slice(1)) || 1,
        tier: 'STANDARD',
        price: 5.00
      };
    });
  } else {
    // Fallback to local DB record if available
    const allLocal = db.getAllBookings();
    const dbMatch = allLocal.find(b => b.id === prismaBooking.id || (b as any).bookingId === prismaBooking.id || (b as any).bookingRef === prismaBooking.bookingRef);
    if (dbMatch && Array.isArray(dbMatch.seats) && dbMatch.seats.length > 0) {
      parsedSeats = dbMatch.seats;
    }
  }

  const finalSeatsCount = parsedSeats.length || Number(prismaBooking.seatsCount) || 1;
  const originalTotal = Number(prismaBooking.totalAmount) || 0;
  const isCancelled = prismaBooking.status.toLowerCase() === 'cancelled';

  // Integer paise arithmetic for cancellation refund: 90% refund, 10% cancellation fee
  const totalPaise = Math.round(originalTotal * 100);
  const feePaise = Math.round(totalPaise * 0.1);
  const refundPaise = totalPaise - feePaise;
  const autoCancellationFee = feePaise / 100;
  const autoRefundAmount = refundPaise / 100;

  return {
    id: prismaBooking.id,
    bookingId: prismaBooking.bookingRef || prismaBooking.id,
    bookingRef: prismaBooking.bookingRef || prismaBooking.id,
    movieId: prismaBooking.showtime?.movieId || 'movie-1',
    movieTitle: prismaBooking.showtime?.movie?.title || 'Blockbuster Movie',
    moviePoster: prismaBooking.showtime?.movie?.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    movieDuration: prismaBooking.showtime?.movie?.durationMinutes
      ? `${Math.floor(prismaBooking.showtime.movie.durationMinutes / 60)}h ${prismaBooking.showtime.movie.durationMinutes % 60}m`
      : '2h 15m',
    movieAgeRating: prismaBooking.showtime?.movie?.ageRating || 'UA',
    cinemaId: prismaBooking.showtime?.screen?.theatreId || 'theatre-1',
    cinemaName: prismaBooking.showtime?.screen?.theatre?.name || 'PVR Cinema',
    cinemaAddress: prismaBooking.showtime?.screen?.theatre?.address || 'City Centre Cinema Complex',
    hall: prismaBooking.showtime?.screen?.name || 'Screen 1',
    format: prismaBooking.showtime?.format || 'IMAX 3D',
    date: prismaBooking.showtime?.date || 'Today',
    time: prismaBooking.showtime?.time || '07:30 PM',
    seats: parsedSeats,
    seatsCount: finalSeatsCount,
    addons: [],
    subtotal: Number(prismaBooking.subtotal) || originalTotal,
    convenienceFee: Number(prismaBooking.convenienceFee) || 0,
    tax: Number(prismaBooking.tax) || 0,
    totalAmount: originalTotal,
    status: prismaBooking.status.toLowerCase(),
    qrToken: prismaBooking.bookingRef || prismaBooking.id,
    qrCodeData: prismaBooking.bookingRef || prismaBooking.id,
    checkedIn: prismaBooking.status === 'CHECKED_IN' || prismaBooking.status === 'checked_in',
    checkedInAt: prismaBooking.checkedInAt ? new Date(prismaBooking.checkedInAt).toISOString() : undefined,
    customer: {
      name: prismaBooking.customerName,
      email: prismaBooking.customerEmail,
      phone: prismaBooking.customerPhone
    },
    paymentMethod: prismaBooking.paymentMethod,
    payment: prismaBooking.payment,
    bookedAt: prismaBooking.bookedAt ? new Date(prismaBooking.bookedAt).toISOString() : (prismaBooking.createdAt ? new Date(prismaBooking.createdAt).toISOString() : new Date().toISOString()),
    cancelledAt: (prismaBooking.cancelledAt || (isCancelled ? prismaBooking.updatedAt : null))
      ? new Date(prismaBooking.cancelledAt || prismaBooking.updatedAt).toISOString()
      : undefined,
    refundStatus: prismaBooking.refundStatus || (isCancelled ? 'REFUNDED' : 'NOT_REQUESTED'),
    refundAmount: prismaBooking.refundAmount !== undefined && prismaBooking.refundAmount !== null
      ? Number(prismaBooking.refundAmount)
      : (isCancelled ? autoRefundAmount : 0),
    cancellationFee: prismaBooking.cancellationFee !== undefined && prismaBooking.cancellationFee !== null
      ? Number(prismaBooking.cancellationFee)
      : (isCancelled ? autoCancellationFee : 0),
    refundId: prismaBooking.refundId || prismaBooking.payment?.refundId || undefined
  };
}

// GET /api/bookings/my (Fetch user bookings from both Prisma and db.ts)
router.get('/my', async (req: Request, res: Response) => {
  try {
    const email = (req.query.email as string)?.trim().toLowerCase();
    const userId = req.query.userId as string;

    // 1. Fetch from Prisma with full relations including seats
    const prismaBookings = await prisma.booking.findMany({
      where: email ? { customerEmail: { equals: email } } : undefined,
      include: {
        seats: true,
        showtime: {
          include: {
            movie: true,
            screen: { include: { theatre: true } }
          }
        },
        payment: true
      },
      orderBy: { bookedAt: 'desc' }
    });

    const formattedPrisma = prismaBookings.map(formatPrismaBooking);

    // 2. Fetch from local JSON db
    let dbBookings = (!email && !userId)
      ? db.getAllBookings()
      : db.getBookingsForUser(email || userId);

    // 3. Deduplicate by bookingId or bookingRef
    const seenRefs = new Set<string>();
    const unified: any[] = [];

    for (const b of formattedPrisma) {
      const ref = (b.bookingRef || b.bookingId || b.id).toUpperCase();
      if (!seenRefs.has(ref)) {
        seenRefs.add(ref);
        unified.push(b);
      }
    }

    for (const b of dbBookings) {
      const ref = ((b as any).bookingRef || (b as any).bookingId || b.id).toUpperCase();
      if (!seenRefs.has(ref)) {
        seenRefs.add(ref);
        unified.push(b);
      }
    }

    // Sort descending by bookedAt
    unified.sort((a, b) => new Date(b.bookedAt || 0).getTime() - new Date(a.bookedAt || 0).getTime());

    return res.json({
      success: true,
      total: unified.length,
      bookings: unified
    });
  } catch (err: any) {
    console.error('Error fetching my bookings:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    // 1. Check Prisma SQLite database first
    const prismaBooking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: bookingId },
          { bookingRef: bookingId }
        ]
      },
      include: {
        seats: true,
        showtime: {
          include: {
            movie: true,
            screen: { include: { theatre: true } }
          }
        },
        payment: true
      }
    });

    if (prismaBooking) {
      return res.json({
        success: true,
        booking: formatPrismaBooking(prismaBooking)
      });
    }

    // 2. Fallback to existing memory database
    const all = db.getAllBookings();
    const booking = all.find(b => b.id === req.params.id || (b as any).bookingId === req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    return res.json({
      success: true,
      booking
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/:id/cancel-quote (Calculate cancellation fee & refundable amount prior to confirmation)
router.get('/:id/cancel-quote', async (req: Request, res: Response) => {
  try {
    const targetId = req.params.id;

    // 1. Check Prisma SQLite
    const prismaBooking = await prisma.booking.findFirst({
      where: {
        OR: [{ id: targetId }, { bookingRef: targetId }]
      },
      include: {
        seats: true,
        showtime: {
          include: {
            movie: true,
            screen: { include: { theatre: true } }
          }
        },
        payment: true
      }
    });

    if (prismaBooking) {
      if (prismaBooking.status.toLowerCase() === 'cancelled') {
        return res.status(400).json({
          success: false,
          eligible: false,
          message: `Booking #${prismaBooking.bookingRef} is already cancelled.`
        });
      }

      if (prismaBooking.status === 'CHECKED_IN' || prismaBooking.status === 'checked_in') {
        return res.status(400).json({
          success: false,
          eligible: false,
          message: `Booking #${prismaBooking.bookingRef} has already been checked in and used.`
        });
      }

      if (isPastShowtime(prismaBooking.showtime?.date, prismaBooking.showtime?.time)) {
        return res.status(400).json({
          success: false,
          eligible: false,
          message: `Showtime for booking #${prismaBooking.bookingRef} has already ended. Cancellation is not permitted.`
        });
      }

      const originalAmount = Number(prismaBooking.totalAmount);
      // Integer paise calculation: 90% refund, 10% cancellation fee
      const totalPaise = Math.round(originalAmount * 100);
      const feePaise = Math.round(totalPaise * 0.1);
      const refundPaise = totalPaise - feePaise;
      const cancellationFee = feePaise / 100;
      const refundAmount = refundPaise / 100;

      const seatList = Array.isArray(prismaBooking.seats) && prismaBooking.seats.length > 0
        ? prismaBooking.seats.map(s => `${(s.seatRow || '').trim()}${s.seatNumber}`)
        : (((prismaBooking as any).seatIds || '').split(',').map((s: string) => s.trim()).filter(Boolean));

      return res.json({
        success: true,
        eligible: true,
        bookingId: prismaBooking.bookingRef || prismaBooking.id,
        id: prismaBooking.id,
        movieTitle: prismaBooking.showtime?.movie?.title || 'Movie',
        cinemaName: prismaBooking.showtime?.screen?.theatre?.name || 'Cinema',
        screenName: prismaBooking.showtime?.screen?.name || 'Screen',
        showDate: prismaBooking.showtime?.date || 'Show Date',
        showTime: prismaBooking.showtime?.time || 'Show Time',
        seats: seatList,
        seatsCount: seatList.length || (prismaBooking as any).seatsCount || 1,
        originalAmount,
        cancellationFee,
        refundAmount,
        refundPercentage: 90,
        policy: 'Standard Cinema Policy: 90% of booking amount is refundable. 10% processing fee applies.',
        paymentMethod: prismaBooking.paymentMethod || 'Online Gateway'
      });
    }

    // 2. Check local db.ts fallback
    const all = db.getAllBookings();
    const dbBooking = all.find(b => b.id === targetId || (b as any).bookingId === targetId || (b as any).bookingRef === targetId);

    if (!dbBooking) {
      return res.status(404).json({ success: false, eligible: false, message: 'Booking not found.' });
    }

    if (dbBooking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        eligible: false,
        message: `Booking #${targetId} is already cancelled.`
      });
    }

    if (isPastShowtime(dbBooking.date, dbBooking.time)) {
      return res.status(400).json({
        success: false,
        eligible: false,
        message: `Showtime for booking #${targetId} has already ended. Cancellation is not permitted.`
      });
    }

    const originalAmount = dbBooking.totalAmount;
    const totalPaise = Math.round(originalAmount * 100);
    const feePaise = Math.round(totalPaise * 0.1);
    const refundPaise = totalPaise - feePaise;
    const cancellationFee = feePaise / 100;
    const refundAmount = refundPaise / 100;

    return res.json({
      success: true,
      eligible: true,
      bookingId: (dbBooking as any).bookingId || dbBooking.id,
      id: dbBooking.id,
      movieTitle: dbBooking.movieTitle,
      cinemaName: dbBooking.cinemaName,
      screenName: dbBooking.hall,
      showDate: dbBooking.date,
      showTime: dbBooking.time,
      seats: dbBooking.seats.map(s => s.id),
      seatsCount: dbBooking.seats.length,
      originalAmount,
      paidAmount: originalAmount,
      cancellationFee,
      refundAmount,
      refundPercentage: 90,
      policy: 'Standard Cinema Policy: 90% of booking amount is refundable. 10% processing fee applies.',
      paymentMethod: dbBooking.paymentMethod
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Failed to calculate cancellation quote.' });
  }
});

// POST /api/bookings/:id/cancel
router.post('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const { email, reason = 'Customer requested cancellation' } = req.body;
    const targetId = req.params.id;

    // Optional user token verification
    const authHeader = req.headers.authorization;
    let authUserEmail: string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cinebook_default_development_secret_2024') as any;
        authUserEmail = decoded.email ? String(decoded.email).toLowerCase() : undefined;
      } catch {}
    }

    // 1. Check Prisma SQLite first
    const prismaBooking = await prisma.booking.findFirst({
      where: {
        OR: [{ id: targetId }, { bookingRef: targetId }]
      },
      include: {
        seats: true,
        showtime: {
          include: {
            movie: true,
            screen: { include: { seats: true, theatre: true } }
          }
        },
        payment: true
      }
    });

    if (prismaBooking) {
      // Prevent double cancellation
      if (prismaBooking.status.toLowerCase() === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: `Booking #${prismaBooking.bookingRef} is already cancelled.`
        });
      }

      // Prevent cancellation of expired booking
      if (prismaBooking.status === 'EXPIRED') {
        return res.status(400).json({
          success: false,
          message: `Booking #${prismaBooking.bookingRef} has expired and cannot be cancelled.`
        });
      }

      // Prevent cancellation of checked-in / admitted booking
      if (prismaBooking.status === 'CHECKED_IN' || prismaBooking.status === 'checked_in') {
        return res.status(400).json({
          success: false,
          message: `Booking #${prismaBooking.bookingRef} was already admitted and checked in. Cancellation is not permitted.`
        });
      }

      // Prevent cancellation of past showtime
      if (isPastShowtime(prismaBooking.showtime?.date, prismaBooking.showtime?.time)) {
        return res.status(400).json({
          success: false,
          message: `Showtime for booking #${prismaBooking.bookingRef} has already ended. Cancellation is not permitted.`
        });
      }

      // Verify user authorization (prevent cancelling another user's booking)
      const bookingCustomerEmail = prismaBooking.customerEmail.toLowerCase();
      const requestEmail = email ? String(email).trim().toLowerCase() : authUserEmail;
      if (requestEmail && bookingCustomerEmail !== requestEmail) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to cancel this booking.'
        });
      }

      const originalAmount = Number(prismaBooking.totalAmount);
      // Integer paise calculation: 90% refund, 10% cancellation fee
      const totalPaise = Math.round(originalAmount * 100);
      const feePaise = Math.round(totalPaise * 0.1);
      const refundPaise = totalPaise - feePaise;
      const cancellationFee = feePaise / 100;
      const refundAmount = refundPaise / 100;

      // Execute official payment gateway refund
      let refundStatus: 'NOT_REQUESTED' | 'REFUND_PENDING' | 'REFUND_PROCESSING' | 'REFUNDED' | 'REFUND_FAILED' = 'REFUND_PENDING';
      let refundId: string | null = null;
      let refundErrorMsg: string | undefined = undefined;

      const isSandbox = RAZORPAY_KEY_ID.includes('sample') || RAZORPAY_KEY_SECRET === 'sampleSecretKey';
      const paymentId = prismaBooking.payment?.paymentId;

      if (paymentId && refundAmount > 0) {
        if (!isSandbox) {
          try {
            // Live Razorpay Gateway Call using backend keys (never exposed to frontend)
            const refundResult = await razorpay.payments.refund(paymentId, {
              amount: Math.round(refundAmount * 100), // amount in paise
              notes: {
                bookingRef: prismaBooking.bookingRef,
                reason: String(reason).slice(0, 100)
              }
            });
            refundId = refundResult.id;
            refundStatus = 'REFUNDED';
          } catch (rzpErr: any) {
            console.error('[Razorpay Refund Gateway Error]:', rzpErr?.message || rzpErr);
            // CRITICAL: Do NOT mark as REFUNDED on gateway failure
            refundStatus = 'REFUND_FAILED';
            refundErrorMsg = rzpErr?.error?.description || rzpErr?.message || 'Payment gateway refund request failed.';
          }
        } else {
          // In test/sandbox mode with dummy credentials:
          refundId = `rfnd_sim_${crypto.randomBytes(8).toString('hex')}`;
          refundStatus = 'REFUNDED';
        }
      } else {
        // Free ticket or demo payment
        refundId = `rfnd_demo_${crypto.randomBytes(6).toString('hex')}`;
        refundStatus = 'REFUNDED';
      }

      const cancelledAt = new Date();

      // Update Booking status and refund details in Prisma
      const updatedBooking = await prisma.booking.update({
        where: { id: prismaBooking.id },
        data: {
          status: 'cancelled',
          refundStatus,
          refundAmount,
          cancellationFee,
          refundId,
          cancelledAt
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

      // Update Payment status to REFUNDED or REFUND_FAILED
      if (prismaBooking.payment) {
        await prisma.payment.update({
          where: { id: prismaBooking.payment.id },
          data: {
            status: refundStatus === 'REFUNDED' ? 'REFUNDED' : 'REFUND_FAILED',
            refundId,
            refundAmount
          }
        });
      }

      // Atomically release seats in seatReservation
      await prisma.seatReservation.deleteMany({
        where: {
          OR: [
            { bookingId: prismaBooking.id },
            { bookingId: prismaBooking.bookingRef || prismaBooking.id }
          ]
        }
      }).catch(() => null);

      // Also release by showtime and seat IDs for this booking
      const bookedSeats = await prisma.bookingSeat.findMany({
        where: { bookingId: prismaBooking.id }
      });
      if (bookedSeats.length > 0) {
        await prisma.seatReservation.deleteMany({
          where: {
            showtimeId: prismaBooking.showtimeId,
            seatId: { in: bookedSeats.map(bs => bs.seatId) }
          }
        }).catch(() => null);
        // Release bookingSeat records so seats can be re-booked without unique constraint failure
        await prisma.bookingSeat.deleteMany({
          where: { bookingId: prismaBooking.id }
        }).catch(() => null);
      }

      // Broadcast real-time WebSocket update so seats immediately reflect as AVAILABLE to all users
      const io = getSocketIO();
      const seatNames = ((prismaBooking as any).seatIds || '').split(',').map((s: string) => s.trim()).filter(Boolean);
      if (io && prismaBooking.showtimeId) {
        io.to(`showtime:${prismaBooking.showtimeId}`).emit('seats:unlocked', {
          showtimeId: prismaBooking.showtimeId,
          seatNumbers: seatNames,
          reason: 'cancellation'
        });
        io.to(`showtime:${prismaBooking.showtimeId}`).emit('seats:updated', {
          showtimeId: prismaBooking.showtimeId,
          timestamp: Date.now()
        });
      }

      // Record Cancellation Audit Log in database
      const auditLog = await prisma.cancellationAuditLog.create({
        data: {
          bookingId: prismaBooking.id,
          bookingRef: prismaBooking.bookingRef || prismaBooking.id,
          action: refundStatus === 'REFUNDED' ? 'REFUND_SUCCESS' : (refundStatus === 'REFUND_FAILED' ? 'REFUND_FAILED' : 'CANCELLATION_REQUESTED'),
          actorEmail: requestEmail || prismaBooking.customerEmail,
          previousStatus: prismaBooking.status,
          newStatus: 'cancelled',
          refundStatus,
          refundAmount,
          cancellationFee,
          refundId,
          failureReason: refundErrorMsg,
          notes: String(reason).slice(0, 200)
        }
      });

      // Also sync cancel in local db.ts if present
      try {
        db.cancelBooking(targetId, requestEmail || prismaBooking.customerEmail, {
          refundAmount,
          cancellationFee,
          refundStatus,
          refundId: refundId || undefined
        });
      } catch (e) {}

      return res.json({
        success: true,
        message: refundStatus === 'REFUNDED'
          ? `Booking #${prismaBooking.bookingRef} has been successfully cancelled. A 90% refund of ₹${refundAmount.toFixed(2)} has been issued (Ref: ${refundId}).`
          : `Booking #${prismaBooking.bookingRef} has been cancelled. Gateway refund status: ${refundStatus}.`,
        booking: {
          ...formatPrismaBooking(updatedBooking),
          refundStatus,
          refundAmount,
          cancellationFee,
          refundId
        },
        refund: {
          originalAmount,
          cancellationFee,
          refundAmount,
          refundStatus,
          refundId,
          refundError: refundErrorMsg,
          cancelledAt: cancelledAt.toISOString()
        },
        auditLog
      });
    }

    // 2. Fallback to db.ts
    const cancelledBooking = db.cancelBooking(targetId, email, {
      refundStatus: 'REFUNDED',
      refundId: `rfnd_local_${crypto.randomBytes(6).toString('hex')}`
    });

    const localAuditLogs = db.getAuditLogsForBooking(targetId);

    return res.json({
      success: true,
      message: `Booking #${targetId} has been successfully cancelled. A 90% refund of ₹${(cancelledBooking.refundAmount || 0).toFixed(2)} has been credited.`,
      booking: cancelledBooking,
      refund: {
        originalAmount: cancelledBooking.totalAmount,
        cancellationFee: cancelledBooking.cancellationFee || Math.round(cancelledBooking.totalAmount * 0.1 * 100) / 100,
        refundAmount: cancelledBooking.refundAmount || Math.round(cancelledBooking.totalAmount * 0.9 * 100) / 100,
        refundStatus: 'REFUNDED',
        refundId: cancelledBooking.refundId,
        cancelledAt: cancelledBooking.cancelledAt
      },
      auditLog: localAuditLogs[0]
    });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to cancel booking.'
    });
  }
});

// GET /api/bookings/:id/audit-trail (Retrieve full cancellation & refund audit log history)
router.get('/:id/audit-trail', async (req: Request, res: Response) => {
  try {
    const targetId = req.params.id;

    // 1. Check Prisma SQLite
    const prismaBooking = await prisma.booking.findFirst({
      where: {
        OR: [{ id: targetId }, { bookingRef: targetId }]
      }
    });

    if (prismaBooking) {
      const logs = await prisma.cancellationAuditLog.findMany({
        where: { bookingId: prismaBooking.id },
        orderBy: { createdAt: 'desc' }
      });
      return res.json({
        success: true,
        bookingRef: prismaBooking.bookingRef,
        logs
      });
    }

    // 2. Check local db.ts fallback
    const localLogs = db.getAuditLogsForBooking(targetId);
    return res.json({
      success: true,
      bookingRef: targetId,
      logs: localLogs
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to retrieve audit trail'
    });
  }
});

// POST /api/bookings/verify-ticket (Cinema gatekeeper admission verification & replay prevention)
router.post('/verify-ticket', async (req: Request, res: Response) => {
  try {
    const target = (req.body.query || req.body.bookingRef || req.body.id || req.body.code || req.body.qrData || '') as string;
    const { staffName = 'Cinema Gatekeeper' } = req.body;
    if (!target) {
      return res.status(400).json({ success: false, message: 'Ticket reference code or QR token is required.' });
    }

    const q = String(target).trim().toUpperCase();

    // 1. Check Prisma SQLite
    const prismaBooking = await prisma.booking.findFirst({
      where: {
        OR: [
          { bookingRef: q },
          { id: q }
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

    if (prismaBooking) {
      if (prismaBooking.status.toLowerCase() === 'cancelled') {
        return res.status(400).json({
          success: false,
          valid: false,
          message: `Ticket #${prismaBooking.bookingRef} was CANCELLED and refunded. Admittance denied.`,
          booking: formatPrismaBooking(prismaBooking)
        });
      }

      if (prismaBooking.status === 'CHECKED_IN') {
        const checkedInAt = (prismaBooking as any).checkedInAt ? new Date((prismaBooking as any).checkedInAt).toISOString() : new Date().toISOString();
        return res.status(200).json({
          success: true,
          valid: false,
          alreadyCheckedIn: true,
          checkedInAt,
          checkedInBy: staffName,
          booking: formatPrismaBooking(prismaBooking),
          message: `⚠️ REPLAY WARNING: Ticket #${prismaBooking.bookingRef} was already admitted earlier.`
        });
      }

      // Mark as CHECKED_IN
      const updated: any = await prisma.booking.update({
        where: { id: prismaBooking.id },
        data: {
          status: 'CHECKED_IN'
        },
        include: {
          showtime: {
            include: {
              movie: true,
              screen: { include: { theatre: true } }
            }
          },
          payment: true,
          seats: true
        }
      });

      const seatsCount = updated.seats?.length || (updated as any).seatsCount || 1;
      return res.json({
        success: true,
        valid: true,
        alreadyCheckedIn: false,
        checkedInAt: new Date().toISOString(),
        checkedInBy: staffName,
        booking: formatPrismaBooking(updated),
        message: `✅ VALID BOARDING PASS: Admittance granted for ${updated.customerName} (${seatsCount} seats).`
      });
    }

    // 2. Fallback to db.ts
    const result = db.validateTicket(q, staffName);
    return res.json({
      success: true,
      ...result
    });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Ticket validation failed.'
    });
  }
});

// POST /api/bookings/lock (Temporarily lock selected seats for 5 minutes)
router.post('/lock', (req: Request, res: Response) => {
  try {
    const { showtimeId, seatIds, userId, sessionId } = req.body;
    const sessionToken = sessionId || userId;
    if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0 || !sessionToken) {
      return res.status(400).json({
        success: false,
        message: 'showtimeId, seatIds array, and sessionId/userId are required.'
      });
    }

    // 5-minute TTL lock
    const holdResult = db.holdSeats(showtimeId, seatIds, sessionToken, 5);
    return res.status(200).json({
      success: true,
      message: `${seatIds.length} seat(s) successfully locked for 5 minutes.`,
      showtimeId,
      lockedSeats: seatIds,
      expiresAt: holdResult.expiresAt,
      ttlSeconds: 300
    });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    return res.status(error.statusCode || 409).json({
      success: false,
      message: error.message || 'Seat lock failed due to concurrent reservation.'
    });
  }
});

// POST /api/bookings/confirm (Confirm payment and finalize the booking)
router.post('/confirm', async (req: Request, res: Response) => {
  try {
    const {
      showtimeId,
      seatIds,
      userId,
      sessionId,
      customerName = 'Moviegoer',
      customerEmail = 'customer@cinebook.dev',
      customerPhone = '+1-555-0100',
      paymentId = `pay_${Date.now()}`,
      paymentMethod = 'Online Gateway (Confirmed)',
      couponCode,
      addons = []
    } = req.body;

    const sessionToken = sessionId || userId;
    if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0 || !sessionToken) {
      return res.status(400).json({
        success: false,
        message: 'showtimeId, seatIds array, and sessionId/userId are required.'
      });
    }

    let show: any = db.getShowtimeById(showtimeId);
    let movie: any = null;
    let cinema: any = null;

    if (show) {
      movie = db.getMovieById(show.movieId);
      cinema = db.getCinemas().find(c => c.id === show.cinemaId);
    } else {
      const prismaShow = await ensurePrismaShowtime(showtimeId);
      if (prismaShow) {
        show = {
          id: prismaShow.id,
          movieId: prismaShow.movieId,
          cinemaId: prismaShow.cinemaId,
          date: prismaShow.date,
          time: prismaShow.time,
          format: prismaShow.format,
          hall: prismaShow.hall || (prismaShow as any).hallName,
          language: prismaShow.language,
          priceMultiplier: Number(prismaShow.priceMultiplier) || 1.0
        };
        movie = prismaShow.movie || db.getMovieById(show.movieId);
        cinema = prismaShow.screen?.theatre || db.getCinemas().find(c => c.id === show.cinemaId);
      }
    }

    if (!show) {
      return res.status(404).json({ success: false, message: 'Showtime not found.' });
    }

    movie = movie || {
      title: 'Movie',
      posterUrl: '',
      durationMinutes: 120,
      certification: 'UA'
    };
    cinema = cinema || {
      name: 'Cinema Multiplex',
      address: 'Downtown'
    };

    // Construct seats entities
    const seatsObj = seatIds.map(id => {
      const row = id.charAt(0);
      const num = parseInt(id.slice(1)) || 1;
      let tier: 'VIP' | 'PREMIUM' | 'STANDARD' = 'STANDARD';
      let price = 10.0;
      if (row === 'A' || row === 'B') {
        tier = 'VIP';
        price = 18.0;
      } else if (['C', 'D', 'E'].includes(row)) {
        tier = 'PREMIUM';
        price = 14.5;
      }
      return { id, row, number: num, tier, price };
    });

    const subtotal = seatsObj.reduce((sum, s) => sum + s.price, 0);
    const convenienceFee = Math.round(seatIds.length * 1.5 * 100) / 100;
    const tax = Math.round((subtotal + convenienceFee) * 0.08 * 100) / 100;

    const newBooking = db.createBooking({
      showtimeId,
      sessionId: sessionToken,
      userId,
      movieId: show.movieId,
      movieTitle: movie.title,
      moviePoster: (movie as any).posterUrl || (movie as any).poster || '',
      movieDuration: `${movie.durationMinutes || 120} min`,
      movieAgeRating: (movie as any).certification || 'UA',
      cinemaId: show.cinemaId,
      cinemaName: cinema.name,
      cinemaAddress: cinema.address,
      hall: show.hall,
      format: show.format,
      date: show.date,
      time: show.time,
      selectedLanguage: show.language,
      customerName,
      customerEmail,
      customerPhone,
      seats: seatsObj,
      addons,
      subtotal,
      convenienceFee,
      tax,
      totalAmount: subtotal + convenienceFee + tax,
      couponCode,
      paymentMethod
    });

    return res.status(200).json({
      success: true,
      message: 'Booking finalized and confirmed successfully.',
      booking: newBooking
    });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    return res.status(error.statusCode || 409).json({
      success: false,
      message: error.message || 'Booking confirmation failed.'
    });
  }
});

// POST /api/bookings/release (Release locks on timeout or abandonment)
router.post('/release', (req: Request, res: Response) => {
  try {
    const { showtimeId, sessionId, userId } = req.body;
    const sessionToken = sessionId || userId;
    if (sessionToken) {
      db.releaseHolds(sessionToken, showtimeId);
    }
    return res.status(200).json({ success: true, message: 'Seat locks released back to available.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: (err as Error).message });
  }
});

export default router;
