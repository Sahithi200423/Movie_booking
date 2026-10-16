import { prisma } from '../prisma.js';
import { Server as SocketIOServer } from 'socket.io';
import { ensurePrismaShowtime } from './showtimeResolver.js';

let ioInstance: SocketIOServer | null = null;

export function setSocketIO(io: SocketIOServer) {
  ioInstance = io;
}

export function getSocketIO(): SocketIOServer | null {
  return ioInstance;
}

export class SeatReservationService {
  /**
   * Place an atomic 10-minute hold on selected seats for a showtime
   */
  async lockSeats(params: {
    showtimeId: string;
    seatNumbers: string[];
    sessionId: string;
    userId?: string;
    durationMinutes?: number;
    preloadedShowtime?: any;
  }): Promise<any> {
    const { showtimeId, seatNumbers, sessionId, userId, durationMinutes = 10, preloadedShowtime } = params;

    if (!showtimeId || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      throw { statusCode: 400, message: 'Invalid showtimeId or seatNumbers array' };
    }

    const showtime = preloadedShowtime || (await ensurePrismaShowtime(showtimeId));

    // Strict: never fall back to another showtime (that previously caused cross-show double booking)
    if (!showtime) {
      throw { statusCode: 404, message: `Showtime ${showtimeId} not found` };
    }

    const now = new Date();
    const heldExpiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    // Map seatNumbers to Seat entities in screen
    const screenSeats: any[] = showtime.screen?.seats || [];
    const targetSeats = screenSeats.filter((s: any) =>
      seatNumbers.includes(s.seatNumber || '') || seatNumbers.includes(s.id)
    );

    if (targetSeats.length !== new Set(seatNumbers).size) {
      const found = new Set(targetSeats.map((s: any) => s.seatNumber || s.id));
      const missing = seatNumbers.filter(n => !found.has(n) && !targetSeats.some((s: any) => s.id === n));
      throw { statusCode: 404, message: `Seat(s) ${missing.join(', ')} do not exist in this screen layout.` };
    }

    // Check existing reservations and confirmed bookings for conflicts
    const targetSeatIds = targetSeats.map((s: any) => s.id);
    const targetSeatLabels = targetSeats.map((s: any) => s.seatNumber || `${s.row}${s.number}`);

    // Check confirmed bookings first
    const confirmedBookedSeats = await prisma.bookingSeat.findMany({
      where: {
        showtimeId: showtime.id,
        OR: [
          { seatId: { in: targetSeatIds } },
          { seatId: { in: targetSeatLabels } }
        ],
        booking: {
          status: { in: ['confirmed', 'CONFIRMED'] }
        }
      }
    });

    if (confirmedBookedSeats.length > 0) {
      const bs = confirmedBookedSeats[0];
      const seatLabel = bs.seatId || `${bs.seatRow}${bs.seatNumber}`;
      throw {
        statusCode: 409,
        message: `Seat ${seatLabel} has already been reserved and paid for.`,
        conflictingSeat: seatLabel
      };
    }

    // Acquire or refresh locks for all requested seats atomically via PostgreSQL ON CONFLICT conditional updates
    for (const seat of targetSeats) {
      const seatLabel = seat.seatNumber || `${seat.row}${seat.number}` || seat.id;
      const rowsAffected = await prisma.$executeRaw`
        INSERT INTO seat_reservations (id, showtime_id, seat_id, status, held_by, held_expires_at, created_at)
        VALUES ((gen_random_uuid())::text, ${showtime.id}, ${seat.id}, 'HELD', ${sessionId}, ${heldExpiresAt}, NOW())
        ON CONFLICT (showtime_id, seat_id)
        DO UPDATE SET status = 'HELD', held_by = ${sessionId}, held_expires_at = ${heldExpiresAt}
        WHERE seat_reservations.status != 'BOOKED'
          AND (seat_reservations.held_expires_at IS NULL OR seat_reservations.held_expires_at < NOW() OR seat_reservations.held_by = ${sessionId});
      `;

      if (rowsAffected === 0) {
        throw {
          statusCode: 409,
          message: `Seat ${seatLabel} is temporarily locked and held by another customer.`,
          conflictingSeat: seatLabel
        };
      }
    }

    // Broadcast real-time update via WebSockets
    if (ioInstance) {
      ioInstance.to(`showtime:${showtime.id}`).emit('seats:locked', {
        showtimeId: showtime.id,
        seatNumbers: targetSeats.map((s: any) => s.seatNumber),
        sessionId,
        expiresAt: heldExpiresAt.getTime(),
        lockedUntil: heldExpiresAt.toISOString(),
        heldExpiresAt: heldExpiresAt.toISOString()
      });

      ioInstance.to(`showtime:${showtime.id}`).emit('seats:updated', {
        showtimeId: showtime.id,
        timestamp: Date.now()
      });
    }

    return {
      success: true,
      showtimeId: showtime.id,
      lockedSeats: targetSeats.map((s: any) => s.seatNumber),
      heldSeats: targetSeats.map((s: any) => s.seatNumber),
      expiresAt: heldExpiresAt.getTime(),
      lockedUntil: heldExpiresAt.toISOString(),
      heldExpiresAt: heldExpiresAt.toISOString(),
      lockDurationMinutes: durationMinutes
    };
  }

  /**
   * Release previously held / locked seats
   */
  async unlockSeats(params: {
    showtimeId: string;
    seatNumbers?: string[];
    sessionId: string;
  }) {
    const { showtimeId, seatNumbers, sessionId } = params;

    const showtime = await ensurePrismaShowtime(showtimeId);
    const targetShowtimeId = showtime ? showtime.id : showtimeId;

    let whereClause: any = {
      showtimeId: { in: [targetShowtimeId, showtimeId] },
      heldBy: sessionId,
      status: { in: ['HELD', 'LOCKED'] }
    };

    if (seatNumbers && seatNumbers.length > 0 && showtime?.screen) {
      const seats = showtime.screen.seats.filter(s =>
        seatNumbers.includes(s.seatNumber || '') || seatNumbers.includes(s.id)
      );
      if (seats.length > 0) {
        whereClause.seatId = { in: seats.map(s => s.id) };
      }
    }

    const released = await prisma.seatReservation.deleteMany({
      where: whereClause
    });

    // Broadcast real-time update via WebSockets
    if (ioInstance) {
      ioInstance.to(`showtime:${targetShowtimeId}`).emit('seats:unlocked', {
        showtimeId: targetShowtimeId,
        seatNumbers: seatNumbers || [],
        sessionId,
        releasedCount: released.count
      });

      ioInstance.to(`showtime:${targetShowtimeId}`).emit('seats:updated', {
        showtimeId: targetShowtimeId,
        timestamp: Date.now()
      });
    }

    return {
      success: true,
      releasedCount: released.count,
      message: 'Seats released successfully'
    };
  }

  /**
   * Alias for unlockSeats matching requested endpoint semantics
   */
  async releaseSeats(params: {
    showtimeId: string;
    seatNumbers?: string[];
    sessionId: string;
  }) {
    return this.unlockSeats(params);
  }

  /**
   * Get live seat layout and statuses (available, held, reserved/booked)
   */
  async getLiveSeats(showtimeId: string, sessionId?: string) {
    const showtime = await ensurePrismaShowtime(showtimeId);

    if (!showtime || !showtime.screen) {
      return null;
    }

    const now = new Date();

    // 1. Confirmed bookings for this exact showtime
    const confirmedBookedSeats = await prisma.bookingSeat.findMany({
      where: {
        showtimeId: showtime.id,
        booking: {
          status: { in: ['confirmed', 'CONFIRMED'] }
        }
      }
    });

    const bookedSeatSet = new Set<string>();
    for (const bs of confirmedBookedSeats) {
      if (bs.seatId) bookedSeatSet.add(bs.seatId);
      if (bs.seatRow && bs.seatNumber) bookedSeatSet.add(`${bs.seatRow}${bs.seatNumber}`);
    }

    // 2. Active temporary holds and booked reservations
    const reservations = await prisma.seatReservation.findMany({
      where: { showtimeId: showtime.id }
    });

    const resMap = new Map(reservations.map(r => [r.seatId, r]));

    return showtime.screen.seats.map(seat => {
      const res = resMap.get(seat.id);
      let status: 'available' | 'held' | 'reserved' = 'available';
      let holdExpiresAt: number | undefined = undefined;
      let heldByMe = false;

      const seatLabel = `${seat.row}${seat.number}`;
      if (bookedSeatSet.has(seat.id) || bookedSeatSet.has(seatLabel) || bookedSeatSet.has(seat.seatNumber || '')) {
        status = 'reserved';
      } else if (res) {
        if (res.status === 'BOOKED') {
          status = 'reserved';
        } else if (res.status === 'HELD' || res.status === 'LOCKED') {
          const expiry = res.heldExpiresAt;
          if (expiry && expiry > now) {
            const holder = res.heldBy;
            if (sessionId && holder === sessionId) {
              heldByMe = true;
              status = 'available'; // Current user holds it, so they see it selectable/selected
              holdExpiresAt = expiry.getTime();
            } else {
              status = 'held';
              holdExpiresAt = expiry.getTime();
            }
          }
        }
      }

      return {
        id: seat.seatNumber || seat.id,
        dbId: seat.id,
        row: seat.row,
        number: seat.number,
        tier: seat.tier,
        price: 5.00,
        status,
        heldByMe,
        holdExpiresAt
      };
    });
  }

  /**
   * Sweeper to release expired holds periodically (runs every 30s)
   */
  async sweepExpiredHolds() {
    try {
      const now = new Date();
      const expired = await prisma.seatReservation.deleteMany({
        where: {
          status: { in: ['HELD', 'LOCKED'] },
          heldExpiresAt: { lte: now }
        }
      });

      if (expired.count > 0 && ioInstance) {
        ioInstance.emit('seats:expired_swept', { count: expired.count, timestamp: Date.now() });
      }
    } catch (e) {
      // silent sweep
    }
  }
}

export const seatReservationService = new SeatReservationService();

// Run background expiry cleaner every 30 seconds as requested
setInterval(() => {
  seatReservationService.sweepExpiredHolds();
}, 30000);
