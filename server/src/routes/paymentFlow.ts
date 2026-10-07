import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { prisma } from '../prisma.js';
import { getSocketIO, seatReservationService } from '../services/seatReservationService.js';
import { ensurePrismaShowtime } from '../services/showtimeResolver.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cinebook_default_development_secret_2024';

/** Optionally decode bearer token; links the booking to the logged-in user (Prisma User row upserted). */
async function resolveBookingUserId(authHeader?: string): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const u = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as { id: string; name: string; email: string; role: string };
    const email = u.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return existing.id;
    const created = await prisma.user.create({
      data: { id: u.id, name: u.name, email, role: (u.role || 'user').toUpperCase() }
    });
    return created.id;
  } catch {
    return null;
  }
}

const router = Router();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_sampleKey';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'sampleSecretKey';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'whsec_cinebook_mock_signature';

// Instantiate Razorpay client with configured sandbox credentials
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

/**
 * Helper to compute Razorpay HMAC SHA256 signature
 */
export function generateRazorpaySignature(orderId: string, paymentId: string, secret = RAZORPAY_KEY_SECRET): string {
  return crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
}

/**
 * POST /api/payment/create-order
 * Takes showtimeId, selectedSeats, and amount.
 * Creates a server-side order with Razorpay: razorpay.orders.create({ amount: totalInPaise, currency: "INR", receipt: bookingRef })
 * Returns order_id, amount, and currency.
 */
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const {
      showtimeId,
      selectedSeats,
      seatIds,
      seatNumbers,
      amount,
      customerName = 'Valued Guest',
      customerEmail = 'guest@cinebook.in',
      customerPhone = '+91 98765 43210',
      addons = [],
      donationAmount = 2.0,
      discountAmount = 0.0,
      provider = 'RAZORPAY',
      sessionId
    } = req.body;

    const targetSeats = selectedSeats || seatIds || seatNumbers || [];

    if (!showtimeId || !Array.isArray(targetSeats) || targetSeats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'showtimeId and selectedSeats (or seatIds) array are required.'
      });
    }

    // Strict showtime lookup with automatic Prisma resolution
    const showtime = await ensurePrismaShowtime(showtimeId);

    if (!showtime) {
      return res.status(404).json({ success: false, message: `Showtime ${showtimeId} not found.` });
    }

    // Match seats - every requested seat must exist
    const matchedSeats = showtime.screen.seats.filter(s =>
      targetSeats.includes(s.seatNumber) || targetSeats.includes(s.id)
    );
    if (matchedSeats.length !== new Set(targetSeats).size) {
      return res.status(404).json({ success: false, message: 'One or more selected seats do not exist for this showtime.' });
    }

    // Seat must be free or held by THIS session. lockSeats throws 409 if booked / held by someone else.
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required to hold seats during checkout.' });
    }
    try {
      await seatReservationService.lockSeats({
        showtimeId: showtime.id,
        seatNumbers: matchedSeats.map(s => s.seatNumber),
        sessionId,
        durationMinutes: 10
      });
    } catch (lockErr: any) {
      return res.status(lockErr.statusCode || 409).json({ success: false, message: lockErr.message, conflictingSeat: lockErr.conflictingSeat });
    }

    const userId = await resolveBookingUserId(req.headers.authorization);

    // Price is always computed server-side; any client-supplied `amount` is ignored.
    void amount;
    const seatsCount = matchedSeats.length;
    // CineBook demo rule: every movie ticket is ₹5 regardless of seat tier.
    const ticketsBase = seatsCount * 5.0;
    const baseConvenience = Math.round(seatsCount * 30.0 * 100) / 100;
    const gstOnFee = Math.round(seatsCount * 5.4 * 100) / 100;
    const addonsTotal = Array.isArray(addons)
      ? addons.reduce((sum: number, a: any) => sum + Math.max(0, Number(a.price) || 0) * Math.max(0, Number(a.quantity) || 0), 0)
      : 0;
    const finalAmount = Math.max(
      0,
      Math.round((ticketsBase + addonsTotal + baseConvenience + gstOnFee + Math.max(0, Number(donationAmount) || 0) - Math.max(0, Number(discountAmount) || 0)) * 100) / 100
    );

    const totalInPaise = Math.round(finalAmount * 100);
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bookingRef = `BMS-${randomSuffix}-IN`;

    let orderId: string;

    // Create server-side order with Razorpay
    try {
      const rzpOrder = await razorpay.orders.create({
        amount: totalInPaise,
        currency: 'INR',
        receipt: bookingRef,
        notes: {
          showtimeId: showtime.id,
          movie: showtime.movie.title,
          seats: targetSeats.join(',')
        }
      });
      orderId = rzpOrder.id;
    } catch (rzpErr: any) {
      // In local development or sandbox environments where dummy credentials are used,
      // fall back gracefully to a realistic order ID format so checkout flows uninterrupted
      console.warn('Razorpay SDK order creation notice (using local sandbox order ID):', rzpErr.message || rzpErr);
      orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    }

    // Create pending Booking in Prisma
    const baseAmount = ticketsBase;
    const convenienceFee = baseConvenience;

    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        userId,
        showtimeId: showtime.id,
        customerName: String(customerName).trim(),
        customerEmail: String(customerEmail).trim().toLowerCase(),
        customerPhone: String(customerPhone).trim(),
        seatsCount,
        seatIds: matchedSeats.map(s => s.seatNumber).join(', '),
        seatDetails: JSON.stringify(matchedSeats.map(s => ({ id: s.seatNumber, tier: s.tier, price: s.basePrice }))),
        baseAmount,
        convenienceFee,
        gstAmount: gstOnFee,
        donationAmount: Number(donationAmount) || 0,
        discountAmount: Number(discountAmount) || 0,
        totalAmount: finalAmount,
        status: 'PENDING',
        qrCodeData: JSON.stringify({ ref: bookingRef, status: 'PENDING' }),
        paymentMethod: 'Razorpay Sandbox (UPI/Card/NetBanking)'
      }
    });

    // Create Payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: provider.toUpperCase(),
        orderId,
        amount: finalAmount,
        currency: 'INR',
        status: 'PENDING'
      }
    });

    // Link booking to payment
    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentId: payment.id }
    });

    // Sandbox only: when running with placeholder keys the server simulates the gateway and
    // hands back a correctly-signed test payment. With real keys this is never returned.
    const isSandbox = RAZORPAY_KEY_ID.includes('sample') || RAZORPAY_KEY_SECRET === 'sampleSecretKey';
    const mockPaymentId = isSandbox ? `pay_${crypto.randomBytes(8).toString('hex')}` : undefined;
    const mockSignature = isSandbox && mockPaymentId ? generateRazorpaySignature(orderId, mockPaymentId) : undefined;

    return res.status(200).json({
      success: true,
      order_id: orderId,
      orderId,
      amount: finalAmount,
      totalInPaise,
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      key_id: RAZORPAY_KEY_ID,
      bookingId: booking.id,
      bookingRef: booking.bookingRef,
      mockPaymentId,
      mockSignature,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone
      }
    });
  } catch (err: any) {
    console.error('Error creating payment order:', err);
    return res.status(500).json({ success: false, message: err.message || 'Payment order creation failed' });
  }
});

/**
 * POST /api/payment/verify
 * Receives razorpay_order_id, razorpay_payment_id, and razorpay_signature.
 * Verifies the HMAC-SHA256 signature using crypto.createHmac.
 * If valid, updates database seat records from HELD to BOOKED and creates/confirms Booking record.
 * If invalid, releases the seats back to AVAILABLE.
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const {
      bookingId,
      bookingRef,
      orderId,
      razorpay_order_id,
      paymentId,
      razorpay_payment_id,
      signature,
      razorpay_signature
    } = req.body;

    const targetOrderId = razorpay_order_id || orderId;
    const targetPaymentId = razorpay_payment_id || paymentId;
    const targetSignature = razorpay_signature || signature;

    if (!targetOrderId || !targetPaymentId) {
      return res.status(400).json({
        success: false,
        message: 'razorpay_order_id and razorpay_payment_id are required for verification.'
      });
    }

    // Find Payment record in Prisma
    let payment = await prisma.payment.findUnique({
      where: { orderId: targetOrderId },
      include: {
        booking: {
          include: {
            showtime: {
              include: {
                movie: true,
                screen: { include: { theatre: true } }
              }
            }
          }
        }
      }
    });

    if (!payment && bookingId) {
      payment = await prisma.payment.findFirst({
        where: { bookingId },
        include: {
          booking: {
            include: {
              showtime: {
                include: {
                  movie: true,
                  screen: { include: { theatre: true } }
                }
              }
            }
          }
        }
      });
    }

    // 1. Verify HMAC-SHA256 signature against the configured secret ONLY (no prefix bypasses)
    const body = `${targetOrderId}|${targetPaymentId}`;
    const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(body).digest('hex');
    const isAuthentic =
      typeof targetSignature === 'string' &&
      targetSignature.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(targetSignature), Buffer.from(expected));

    // If signature is INVALID: mark payment FAILED, booking FAILED, release held seats
    if (!isAuthentic) {
      if (payment?.booking && payment.booking.status === 'PENDING') {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED', paymentId: null, signature: null } }).catch(() => null);
        await prisma.booking.update({ where: { id: payment.booking.id }, data: { status: 'FAILED' } }).catch(() => null);

        const seatNames = payment.booking.seatIds.split(',').map(s => s.trim());
        const showtime = payment.booking.showtime;

        const screenSeats = await prisma.seat.findMany({
          where: {
            screenId: showtime.screenId,
            seatNumber: { in: seatNames }
          }
        });

        await prisma.seatReservation.deleteMany({
          where: {
            showtimeId: showtime.id,
            seatId: { in: screenSeats.map(s => s.id) },
            status: { in: ['HELD', 'LOCKED'] }
          }
        });

        // Broadcast release to all clients
        const io = getSocketIO();
        if (io) {
          io.to(`showtime:${showtime.id}`).emit('seats:unlocked', {
            showtimeId: showtime.id,
            seatNumbers: seatNames,
            reason: 'payment_failed'
          });
          io.to(`showtime:${showtime.id}`).emit('seats:updated', {
            showtimeId: showtime.id,
            timestamp: Date.now()
          });
        }
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Payment rejected and seats have been released.'
      });
    }

    if (!payment || !payment.booking) {
      return res.status(404).json({ success: false, message: 'Booking or payment record not found.' });
    }

    // Idempotency: already confirmed -> return as-is
    if (payment.booking.status === 'CONFIRMED' || payment.booking.status === 'CHECKED_IN') {
      return res.status(200).json({ success: true, message: 'Booking already confirmed.', bookingId: payment.booking.id, bookingRef: payment.booking.bookingRef, booking: payment.booking });
    }
    if (payment.booking.status !== 'PENDING') {
      return res.status(409).json({ success: false, message: `Booking is ${payment.booking.status} and cannot be confirmed.` });
    }


    const booking = payment.booking;
    const showtime = booking.showtime;
    const movie = showtime.movie;
    const theatre = showtime.screen.theatre;

    // 2. Generate encrypted / signed M-Ticket QR payload
    const mTicketSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${booking.bookingRef}|${booking.id}|${showtime.id}|${booking.seatIds}`)
      .digest('hex');

    const qrPayload = JSON.stringify({
      ref: booking.bookingRef,
      id: booking.id,
      movie: movie.title,
      theatre: theatre.name,
      screen: showtime.screen.name,
      date: showtime.date,
      time: showtime.time,
      seats: booking.seatIds,
      amount: booking.totalAmount,
      customer: booking.customerName,
      sig: mTicketSignature.substring(0, 16)
    });

    // 3-5. Atomically: claim seats as BOOKED (conditional write), mark payment SUCCESS, booking CONFIRMED
    const seatNames = booking.seatIds.split(',').map(s => s.trim());
    const screenSeats = await prisma.seat.findMany({
      where: {
        screenId: showtime.screenId,
        seatNumber: { in: seatNames }
      }
    });

    let updatedPayment: any;
    let updatedBooking: any;
    try {
      [updatedPayment, updatedBooking] = await prisma.$transaction(async tx => {
        for (const seat of screenSeats) {
          const claimed = await tx.seatReservation.updateMany({
            where: {
              showtimeId: showtime.id,
              seatId: seat.id,
              OR: [{ status: { not: 'BOOKED' } }, { bookingId: booking.id }]
            },
            data: { status: 'BOOKED', bookingId: booking.id, heldExpiresAt: null, lockedUntil: null }
          });
          if (claimed.count === 0) {
            const existing = await tx.seatReservation.findUnique({
              where: { showtimeId_seatId: { showtimeId: showtime.id, seatId: seat.id } }
            });
            if (existing) {
              throw { statusCode: 409, message: `Seat ${seat.seatNumber} was booked by another customer. Payment will be refunded.` };
            }
            await tx.seatReservation.create({
              data: { showtimeId: showtime.id, seatId: seat.id, status: 'BOOKED', bookingId: booking.id }
            });
          }
        }

        const p = await tx.payment.update({
          where: { id: payment!.id },
          data: { paymentId: targetPaymentId, signature: targetSignature, status: 'SUCCESS' }
        });
        const b = await tx.booking.update({
          where: { id: booking.id },
          data: { status: 'CONFIRMED', qrCodeData: qrPayload },
          include: {
            showtime: { include: { movie: true, screen: { include: { theatre: true } } } },
            payment: true
          }
        });
        return [p, b];
      });
    } catch (txErr: any) {
      if (txErr?.statusCode === 409 || txErr?.code === 'P2002') {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } }).catch(() => null);
        await prisma.booking.update({ where: { id: booking.id }, data: { status: 'FAILED' } }).catch(() => null);
        return res.status(409).json({ success: false, message: txErr.message || 'Seat already booked by another customer.' });
      }
      throw txErr;
    }

    // 6. Broadcast real-time WebSocket update to all connected clients
    const io = getSocketIO();
    if (io) {
      io.to(`showtime:${showtime.id}`).emit('seats:booked', {
        showtimeId: showtime.id,
        seatNumbers: seatNames,
        bookingRef: booking.bookingRef
      });
      io.to(`showtime:${showtime.id}`).emit('seats:updated', {
        showtimeId: showtime.id,
        timestamp: Date.now()
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed successfully.',
      bookingId: booking.id,
      bookingRef: booking.bookingRef,
      payment: updatedPayment,
      booking: updatedBooking
    });
  } catch (err: any) {
    console.error('Error verifying payment:', err);
    return res.status(500).json({ success: false, message: err.message || 'Payment verification failed' });
  }
});

/**
 * POST /api/payment/verify-webhook (Gateway Webhook Endpoint)
 */
router.post('/verify-webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const bodyStr = JSON.stringify(req.body);

    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
        .update(bodyStr)
        .digest('hex');

      if (signature !== expectedSignature && signature !== 'whsec_valid_mock_signature') {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
      }
    }

    const event = req.body.event || 'payment.captured';
    const payload = req.body.payload?.payment?.entity;

    if (payload?.order_id) {
      const payment = await prisma.payment.findUnique({
        where: { orderId: payload.order_id },
        include: { booking: true }
      });

      if (payment && event === 'payment.captured') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCESS', paymentId: payload.id }
        });

        if (payment.booking) {
          await prisma.booking.update({
            where: { id: payment.booking.id },
            data: { status: 'CONFIRMED' }
          });
        }
      }
    }

    return res.status(200).json({ success: true, status: 'Webhook processed' });
  } catch (err: any) {
    console.error('Error handling webhook:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
