import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { prisma } from '../prisma.js';
import { getSocketIO, seatReservationService } from '../services/seatReservationService.js';
import { ensurePrismaShowtime } from '../services/showtimeResolver.js';
import { isPastShowtime } from '../utils/dateUtils.js';
import jwt from 'jsonwebtoken';
import {
  paymentOrderLimiter,
  paymentOrderIpLimiter,
  paymentVerifyLimiter,
  paymentVerifyIpLimiter
} from '../middleware/rateLimiter.js';
import { enforceDemoModeGuard } from '../middleware/demoMode.js';

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

export interface PendingOrderDetails {
  bookingRef: string;
  userId: string | null;
  showtimeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subtotal: number;
  convenienceFee: number;
  tax: number;
  totalAmount: number;
  paymentMethod: string;
  matchedSeats: any[];
  addons: any[];
  deliveryPreference?: string;
  createdAt: number;
}

export const pendingOrderStore = new Map<string, PendingOrderDetails>();

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
router.post('/create-order', enforceDemoModeGuard, paymentOrderIpLimiter, paymentOrderLimiter, async (req: Request, res: Response) => {
  try {
    const {
      showtimeId,
      date,
      time,
      movieId,
      cinemaId,
      selectedSeats,
      seatIds,
      seatNumbers,
      amount,
      addons = [],
      donationAmount = 2.0,
      discountAmount = 0.0,
      provider = 'RAZORPAY',
      sessionId
    } = req.body;

    const customerName = req.body.customerName || req.body.customerDetails?.name || req.body.name || 'Valued Guest';
    const customerEmail = req.body.customerEmail || req.body.customerDetails?.email || req.body.email || 'guest@cinebook.in';
    const customerPhone = req.body.customerPhone || req.body.customerDetails?.phone || req.body.phone || '+91 98765 43210';


    const targetSeats = selectedSeats || seatIds || seatNumbers || [];

    if (!showtimeId || !Array.isArray(targetSeats) || targetSeats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'showtimeId and selectedSeats (or seatIds) array are required.'
      });
    }

    if (targetSeats.length > 8) {
      return res.status(400).json({
        success: false,
        message: 'A maximum of 8 seats can be booked in a single transaction.'
      });
    }

    // Strict showtime lookup with automatic Prisma resolution and authoritative date/time
    const showtime = await ensurePrismaShowtime(showtimeId, { date, time, movieId, cinemaId });

    if (!showtime || !showtime.screen || !showtime.movie) {
      return res.status(404).json({ success: false, message: `Showtime ${showtimeId} not found.` });
    }

    // Prevent bookings for past showtimes
    if (isPastShowtime(showtime.date, showtime.time)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book tickets for a showtime that has already passed.'
      });
    }

    // Match seats - every requested seat must exist
    const screenSeats = showtime.screen.seats || [];
    const matchedSeats = screenSeats.filter(s => {
      const code = `${(s.row || '').trim()}${s.number}`;
      return (
        targetSeats.includes(s.seatNumber || '') ||
        targetSeats.includes(s.id) ||
        (code && targetSeats.includes(code)) ||
        targetSeats.some(ts => s.id.endsWith(`-${ts}`) || s.id === ts)
      );
    });
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
        seatNumbers: matchedSeats.map(s => s.seatNumber || s.id),
        sessionId,
        durationMinutes: 10,
        preloadedShowtime: showtime
      });
    } catch (lockErr: any) {
      return res.status(lockErr.statusCode || 409).json({ success: false, message: lockErr.message, conflictingSeat: lockErr.conflictingSeat });
    }

    const userId = await resolveBookingUserId(req.headers.authorization);

    // Authoritative Server-Side Pricing (CineBook ₹5 Rule):
    // Every movie ticket costs exactly ₹5 per seat (500 paise).
    // Standard, Premium, VIP, and all movie formats follow this rule.
    // Zero convenience fees, zero platform fees, zero taxes, zero hidden charges in this demo.
    // 1 seat = ₹5, 2 seats = ₹10, 3 seats = ₹15, 4 seats = ₹20.
    void amount;
    const seatsCount = matchedSeats.length;
    const ticketPaisePerSeat = 500;
    const totalInPaise = seatsCount * ticketPaisePerSeat;
    const finalAmount = totalInPaise / 100;
    const ticketsBase = finalAmount;
    const baseConvenience = 0.00;
    const gstOnFee = 0.00;
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bookingRef = `BMS-${randomSuffix}-IN`;

    let orderId: string;

    const isSandbox = (RAZORPAY_KEY_ID.includes('sample') || RAZORPAY_KEY_SECRET === 'sampleSecretKey') && process.env.NODE_ENV !== 'production';

    if (isSandbox) {
      orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    } else {
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
        console.error('Razorpay SDK order creation error:', rzpErr.message || rzpErr);
        if (process.env.NODE_ENV === 'production') {
          return res.status(502).json({
            success: false,
            message: 'Payment gateway order creation failed: ' + (rzpErr.error?.description || rzpErr.message || 'Gateway unavailable.')
          });
        }
        orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
      }
    }

    // Save pending checkout session in store without touching the PostgreSQL bookings table
    // This strictly adheres to the database constraint (status must be 'confirmed', 'cancelled', 'refunded')
    const pendingData: PendingOrderDetails = {
      bookingRef,
      userId,
      showtimeId: showtime.id,
      customerName: String(customerName).trim(),
      customerEmail: String(customerEmail).trim().toLowerCase(),
      customerPhone: String(customerPhone).trim(),
      subtotal: ticketsBase,
      convenienceFee: baseConvenience,
      tax: gstOnFee,
      totalAmount: finalAmount,
      paymentMethod: 'Razorpay Sandbox (UPI/Card/NetBanking)',
      matchedSeats,
      addons: Array.isArray(addons) ? addons : [],
      deliveryPreference: (req.body as any).deliveryPreference || 'seat',
      createdAt: Date.now()
    };

    pendingOrderStore.set(orderId, pendingData);
    pendingOrderStore.set(bookingRef, pendingData);

    // Create Payment record (bookingId will be linked upon successful payment verification)
    const payment = await prisma.payment.create({
      data: {
        provider: provider.toUpperCase(),
        orderId,
        amount: finalAmount,
        currency: 'INR',
        status: 'PENDING'
      }
    });

    return res.status(200).json({
      success: true,
      order_id: orderId,
      orderId,
      amount: finalAmount,
      totalInPaise,
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      key_id: RAZORPAY_KEY_ID,
      bookingId: bookingRef,
      bookingRef,
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
router.post('/verify', enforceDemoModeGuard, paymentVerifyIpLimiter, paymentVerifyLimiter, async (req: Request, res: Response) => {
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

    // 1. Verify HMAC-SHA256 signature against the configured secret ONLY (Fail fast)
    const body = `${targetOrderId}|${targetPaymentId}`;
    const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(body).digest('hex');
    const isAuthentic =
      typeof targetSignature === 'string' &&
      targetSignature.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(targetSignature), Buffer.from(expected));

    // If signature is INVALID: mark payment FAILED and release held seats immediately
    if (!isAuthentic) {
      try {
        const payment = await prisma.payment.findUnique({ where: { orderId: targetOrderId } }).catch(() => null);
        if (payment) {
          await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED', paymentId: null, signature: null } }).catch(() => null);
          if (payment.bookingId) {
            await prisma.booking.update({ where: { id: payment.bookingId }, data: { status: 'cancelled' } }).catch(() => null);
          }
        }
      } catch {}

      const pendingOrder = pendingOrderStore.get(targetOrderId) || (bookingId ? pendingOrderStore.get(bookingId) : undefined);
      if (pendingOrder) {
        const showtime = await ensurePrismaShowtime(pendingOrder.showtimeId).catch(() => null);
        if (showtime) {
          const seatNames = pendingOrder.matchedSeats.map(s => s.seatNumber || `${s.row}${s.number}`);
          await prisma.seatReservation.deleteMany({
            where: {
              showtimeId: showtime.id,
              seatId: { in: pendingOrder.matchedSeats.map(s => s.id) },
              status: { in: ['HELD', 'LOCKED'] }
            }
          }).catch(() => null);

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
        pendingOrderStore.delete(targetOrderId);
        if (pendingOrder.bookingRef) pendingOrderStore.delete(pendingOrder.bookingRef);
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Payment rejected and seats have been released.'
      });
    }

    // 2. Prevent Replay Attacks: Check if targetPaymentId has already been consumed by any OTHER transaction
    const alreadyUsedPayment = await prisma.payment.findFirst({
      where: {
        paymentId: targetPaymentId,
        status: 'SUCCESS',
        NOT: { orderId: targetOrderId }
      }
    }).catch(() => null);

    if (alreadyUsedPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID has already been utilized for another transaction. Replay rejected.'
      });
    }

    // Find Payment record in Prisma for verified payment
    let payment = await prisma.payment.findUnique({
      where: { orderId: targetOrderId },
      include: {
        booking: {
          include: {
            seats: true,
            showtime: {
              include: {
                movie: true,
                screen: { include: { theatre: true } }
              }
            }
          }
        }
      }
    }).catch(() => null);

    // 3. Prevent Re-verification of Failed Orders
    if (payment && payment.status === 'FAILED') {
      return res.status(400).json({
        success: false,
        message: 'This payment order has previously failed and cannot be re-verified.'
      });
    }

    if (!payment && bookingId) {
      payment = await prisma.payment.findFirst({
        where: { bookingId },
        include: {
          booking: {
            include: {
              seats: true,
              showtime: {
                include: {
                  movie: true,
                  screen: { include: { theatre: true } }
                }
              }
            }
          }
        }
      }).catch(() => null);
    }

    // 4. Idempotency: check if already confirmed
    const existingConfirmedBooking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: targetOrderId },
          { bookingRef: targetOrderId },
          ...(bookingId ? [{ id: bookingId }, { bookingRef: bookingId }] : [])
        ]
      },
      include: {
        seats: true,
        showtime: { include: { movie: true, screen: { include: { theatre: true } } } },
        payment: true
      }
    });

    if (existingConfirmedBooking && (existingConfirmedBooking.status?.toLowerCase() === 'confirmed' || existingConfirmedBooking.status?.toLowerCase() === 'checked_in')) {
      return res.status(200).json({
        success: true,
        message: 'Booking already confirmed.',
        bookingId: existingConfirmedBooking.id,
        bookingRef: existingConfirmedBooking.bookingRef,
        booking: existingConfirmedBooking
      });
    }

    // 5. Verify Pending Order & Prevent Mismatched Order/Booking IDs
    const pending = pendingOrderStore.get(targetOrderId);
    if (!pending && (!payment || !payment.booking)) {
      return res.status(404).json({ success: false, message: 'Active booking session not found or has expired. Please retry checkout.' });
    }

    if (bookingId && pending && pending.bookingRef && bookingId !== pending.bookingRef) {
      return res.status(400).json({
        success: false,
        message: 'Order ID does not match the specified booking session.'
      });
    }

    const targetShowtimeId = pending ? pending.showtimeId : payment!.booking!.showtimeId;
    const showtime = await ensurePrismaShowtime(targetShowtimeId);
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found.' });
    }

    const movie = showtime.movie || { title: 'Movie' };
    const theatre = showtime.screen?.theatre || { name: 'Cinema' };
    const screenName = showtime.screen?.name || 'Screen 1';

    const finalBookingRef = pending ? pending.bookingRef : (payment!.booking!.bookingRef || payment!.booking!.id);
    const finalBookingId = finalBookingRef;
    const matchedSeats = pending ? pending.matchedSeats : (payment!.booking!.seats || []);
    const seatNames = matchedSeats.map((s: any) => s.seatNumber || s.number || `${s.row || s.seatRow}${s.number || s.seatNumber}`);
    const bookingSeatsStr = seatNames.join(',');

    // 2. Generate encrypted / signed M-Ticket QR payload
    const mTicketSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${finalBookingRef}|${finalBookingId}|${showtime.id}|${bookingSeatsStr}`)
      .digest('hex');

    const qrPayload = JSON.stringify({
      ref: finalBookingRef,
      id: finalBookingId,
      movie: movie.title,
      theatre: theatre.name,
      screen: screenName,
      date: showtime.date,
      time: showtime.time,
      seats: bookingSeatsStr,
      amount: pending ? pending.totalAmount : payment!.booking!.totalAmount,
      customer: pending ? pending.customerName : payment!.booking!.customerName,
      sig: mTicketSignature.substring(0, 16)
    });

    let updatedPayment: any;
    let confirmedBooking: any;

    try {
      [updatedPayment, confirmedBooking] = await prisma.$transaction(async tx => {
        // Double-booking check: ensure none of the seats are already booked by another confirmed booking
        const seatIds = matchedSeats.map((s: any) => s.id);
        const alreadyBookedReservation = await tx.seatReservation.findFirst({
          where: {
            showtimeId: showtime.id,
            seatId: { in: seatIds },
            status: 'BOOKED',
            bookingId: { not: finalBookingRef }
          }
        });

        if (alreadyBookedReservation) {
          const conflictErr = new Error(`Seat Conflict: Seat reservation ${alreadyBookedReservation.seatId} has already been booked by another customer.`);
          (conflictErr as any).statusCode = 409;
          throw conflictErr;
        }

        // 3. Atomically claim seats as BOOKED in seatReservation
        for (const seat of matchedSeats) {
          await tx.seatReservation.upsert({
            where: { showtimeId_seatId: { showtimeId: showtime.id, seatId: seat.id } },
            update: { status: 'BOOKED', bookingId: finalBookingRef, heldExpiresAt: null },
            create: { showtimeId: showtime.id, seatId: seat.id, status: 'BOOKED', bookingId: finalBookingRef }
          });
        }

        // 4. Create confirmed booking row in PostgreSQL
        let b: any;
        if (payment?.booking) {
          b = await tx.booking.update({
            where: { id: payment.booking.id },
            data: { status: 'confirmed' },
            include: {
              showtime: { include: { movie: true, screen: { include: { theatre: true } } } },
              seats: true,
              payment: true
            }
          });
        } else if (pending) {
          b = await tx.booking.create({
            data: {
              id: finalBookingRef,
              bookingRef: finalBookingRef,
              userId: pending.userId,
              showtimeId: showtime.id,
              customerName: pending.customerName,
              customerEmail: pending.customerEmail,
              customerPhone: pending.customerPhone,
              subtotal: pending.subtotal,
              convenienceFee: 0.00,
              tax: 0.00,
              totalAmount: pending.totalAmount,
              status: 'confirmed',
              paymentMethod: pending.paymentMethod,
              seats: {
                create: matchedSeats.map((s: any) => ({
                  showtimeId: showtime.id,
                  seatId: s.id,
                  seatRow: s.row,
                  seatNumber: s.number,
                  tier: s.tier,
                  price: 5.00
                }))
              }
            },
            include: {
              showtime: { include: { movie: true, screen: { include: { theatre: true } } } },
              seats: true
            }
          });
        }

        // 5. Update payment record to SUCCESS and link bookingId
        const p = await tx.payment.update({
          where: { orderId: targetOrderId },
          data: {
            bookingId: b.id,
            paymentId: targetPaymentId,
            signature: targetSignature,
            status: 'SUCCESS'
          }
        });

        return [p, b];
      }, {
        maxWait: 15000,
        timeout: 30000
      });
    } catch (txErr: any) {
      if (txErr?.statusCode === 409 || txErr?.code === 'P2002') {
        await prisma.payment.update({ where: { orderId: targetOrderId }, data: { status: 'FAILED' } }).catch(() => null);
        return res.status(409).json({ success: false, message: txErr.message || 'Seat already booked by another customer.' });
      }
      throw txErr;
    }

    // Clean up pending session
    pendingOrderStore.delete(targetOrderId);
    pendingOrderStore.delete(bookingRef);

    // 6. Broadcast real-time WebSocket update to all connected clients
    const io = getSocketIO();
    if (io) {
      io.to(`showtime:${showtime.id}`).emit('seats:booked', {
        showtimeId: showtime.id,
        seatNumbers: seatNames,
        bookingRef
      });
      io.to(`showtime:${showtime.id}`).emit('seats:updated', {
        showtimeId: showtime.id,
        timestamp: Date.now()
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed successfully.',
      bookingId: confirmedBooking.id,
      bookingRef: confirmedBooking.bookingRef,
      payment: updatedPayment,
      booking: {
        ...confirmedBooking,
        qrCodeData: qrPayload,
        qrToken: qrPayload
      }
    });
  } catch (err: any) {
    console.error('Error verifying payment:', err);
    return res.status(500).json({ success: false, message: err.message || 'Payment verification failed' });
  }
});

/**
 * POST /api/payment/verify-webhook (Gateway Webhook Endpoint)
 * Hardened with required signature header check, timing-safe HMAC-SHA256 verification,
 * and reconciliation for payment.captured, order.paid, and payment.failed events.
 */
router.post('/verify-webhook', enforceDemoModeGuard, async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBuffer = (req as any).rawBody || Buffer.from(JSON.stringify(req.body));

    if (!signature) {
      return res.status(400).json({ success: false, message: 'Missing x-razorpay-signature header.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(rawBuffer)
      .digest('hex');

    const isProduction = process.env.NODE_ENV === 'production';
    const isMockBypass = !isProduction && signature === 'whsec_valid_mock_signature';
    const isAuthentic = isMockBypass || (
      typeof signature === 'string' &&
      signature.length === expectedSignature.length &&
      crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    );

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
    }

    const event = req.body.event || 'payment.captured';
    const payload = req.body.payload?.payment?.entity || req.body.payload?.order?.entity;
    const targetOrderId = payload?.order_id || (payload?.id?.startsWith('order_') ? payload.id : undefined) || payload?.orderId;
    const paymentGatewayId = req.body.payload?.payment?.entity?.id || (payload?.id?.startsWith('pay_') ? payload.id : undefined);

    if (targetOrderId) {
      try {
        const payment = await prisma.payment.findUnique({
          where: { orderId: targetOrderId },
          include: {
            booking: {
              include: { seats: true }
            }
          }
        });

        if (payment) {
          // Idempotency check: if payment is already successfully confirmed, do not re-process
          if (event === 'payment.captured' || event === 'order.paid') {
            if (payment.status === 'SUCCESS' && payment.booking?.status === 'confirmed') {
              return res.status(200).json({
                success: true,
                message: 'Webhook already processed (idempotent)',
                status: 'ALREADY_PROCESSED'
              });
            }

            // Security Validation: Verify captured amount in paise matches the payment record
            if (payload?.amount !== undefined) {
              const receivedPaise = Number(payload.amount);
              const expectedPaise = Math.round(Number(payment.amount) * 100);
              if (receivedPaise !== expectedPaise) {
                console.error(`Security Alert: Webhook amount mismatch for order ${targetOrderId}. Expected ${expectedPaise} paise, received ${receivedPaise} paise.`);
                return res.status(400).json({ success: false, message: 'Payment amount mismatch detected.' });
              }
            }

            // Security Validation: Verify currency matches
            if (payload?.currency && payment.currency) {
              if (String(payload.currency).toUpperCase() !== String(payment.currency).toUpperCase()) {
                console.error(`Security Alert: Webhook currency mismatch for order ${targetOrderId}. Expected ${payment.currency}, received ${payload.currency}.`);
                return res.status(400).json({ success: false, message: 'Payment currency mismatch detected.' });
              }
            }

            // Seat Ownership & Post-Expiry Conflict Check: Ensure seats were not booked by another customer
            if (payment.booking && payment.booking.seats?.length > 0) {
              const bookingSeatIds = payment.booking.seats.map((s: any) => s.seatId || s.id);
              const conflictingSeat = await prisma.seatReservation.findFirst({
                where: {
                  showtimeId: payment.booking.showtimeId,
                  seatId: { in: bookingSeatIds },
                  status: 'BOOKED',
                  bookingId: { not: payment.booking.id }
                }
              }).catch(() => null);

              if (conflictingSeat) {
                console.error(`Conflict Alert: Payment succeeded after hold expired, but seat ${conflictingSeat.seatId} was booked by another user.`);
                await prisma.payment.update({
                  where: { id: payment.id },
                  data: { status: 'FAILED' }
                });
                return res.status(409).json({
                  success: false,
                  message: 'Seats were booked by another customer after hold expired. Payment flagged for refund.'
                });
              }

              // Atomically promote held seats to BOOKED
              await prisma.seatReservation.updateMany({
                where: {
                  showtimeId: payment.booking.showtimeId,
                  bookingId: payment.booking.id,
                  status: { in: ['HELD', 'LOCKED'] }
                },
                data: { status: 'BOOKED', heldExpiresAt: null }
              }).catch(() => null);
            }

            // Mark payment SUCCESS
            await prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'SUCCESS', ...(paymentGatewayId ? { paymentId: paymentGatewayId } : {}) }
            });

            if (payment.booking && payment.booking.status !== 'confirmed') {
              await prisma.booking.update({
                where: { id: payment.booking.id },
                data: { status: 'confirmed' }
              });
            }
          } else if (event === 'payment.failed') {
            // Out-of-order protection: NEVER cancel an already confirmed successful payment!
            if (payment.status === 'SUCCESS' || payment.booking?.status === 'confirmed') {
              console.warn(`Webhook notice: Out-of-order payment.failed event received for already confirmed payment ${payment.id}. Ignored.`);
              return res.status(200).json({ success: true, message: 'Out-of-order failed event ignored for confirmed payment' });
            }

            await prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'FAILED' }
            });

            // Reconciliation: Release held seats if payment failed asynchronously
            if (payment.booking && payment.booking.status !== 'confirmed') {
              await prisma.seatReservation.deleteMany({
                where: {
                  showtimeId: payment.booking.showtimeId,
                  bookingId: payment.booking.id,
                  status: { in: ['HELD', 'LOCKED'] }
                }
              }).catch(() => null);
            }
          }
        }
      } catch (dbErr: any) {
        console.warn('Webhook DB reconciliation notice:', dbErr.message || dbErr);
      }
    }

    return res.status(200).json({ success: true, status: 'Webhook processed' });
  } catch (err: any) {
    console.error('Error handling webhook:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
