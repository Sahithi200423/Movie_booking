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
  }): Promise<any> {
    const { showtimeId, seatNumbers, sessionId, userId, durationMinutes = 10 } = params;

    if (!showtimeId || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      throw { statusCode: 400, message: 'Invalid showtimeId or seatNumbers array' };
    }

    const showtime = await ensurePrismaShowtime(showtimeId);

    // Strict: never fall back to another showtime (that previously caused cross-show double booking)
    if (!showtime) {
      throw { statusCode: 404, message: `Showtime ${showtimeId} not found` };
    }

    const now = new Date();
    const heldExpiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    // Map seatNumbers to Seat entities in screen
    const screenSeats = showtime.screen.seats;
    const targetSeats = screenSeats.filter(s =>
      seatNumbers.includes(s.seatNumber) || seatNumbers.includes(s.id)
    );

    if (targetSeats.length !== new Set(seatNumbers).size) {
      const found = new Set(targetSeats.map(s => s.seatNumber));
      const missing = seatNumbers.filter(n => !found.has(n) && !targetSeats.some(s => s.id === n));
      throw { statusCode: 404, message: `Seat(s) ${missing.join(', ')} do not exist in this screen layout.` };
    }

    // Check existing reservations for conflicts
    const targetSeatIds = targetSeats.map(s => s.id);
    const existingReservations = await prisma.seatReservation.findMany({
      where: {
        showtimeId: showtime.id,
        seatId: { in: targetSeatIds }
      }
    });

    for (const res of existingReservations) {
      const seat = targetSeats.find(s => s.id === res.seatId);
      const seatLabel = seat ? seat.seatNumber : res.seatId;

      if (res.status === 'BOOKED') {
        throw {
          statusCode: 409,
          message: `Seat ${seatLabel} has already been reserved and paid for.`,
          conflictingSeat: seatLabel
        };
      }

      const activeExpiry = res.heldExpiresAt || res.lockedUntil;
      const isStillHeld = (res.status === 'HELD' || res.status === 'LOCKED') && activeExpiry && activeExpiry > now;

      if (isStillHeld) {
        const holderSession = res.heldBy || res.lockedBySessionId;
        if (holderSession !== sessionId) {
          throw {
            statusCode: 409,
            message: `Seat ${seatLabel} is temporarily locked and held by another customer.`,
            conflictingSeat: seatLabel
          };
        }
      }
    }

    // Acquire or refresh locks for all requested seats
    for (const seat of targetSeats) {
      await prisma.seatReservation.upsert({
        where: {
          showtimeId_seatId: {
            showtimeId: showtime.id,
            seatId: seat.id
          }
        },
        update: {
          status: 'HELD',
          heldBy: sessionId,
          heldExpiresAt,
          lockedBySessionId: sessionId,
          lockedByUserId: userId || null,
          lockedUntil: heldExpiresAt
        },
        create: {
          showtimeId: showtime.id,
          seatId: seat.id,
          status: 'HELD',
          heldBy: sessionId,
          heldExpiresAt,
          lockedBySessionId: sessionId,
          lockedByUserId: userId || null,
          lockedUntil: heldExpiresAt
        }
      });
    }

    // Broadcast real-time update via WebSockets
    if (ioInstance) {
      ioInstance.to(`showtime:${showtime.id}`).emit('seats:locked', {
        showtimeId: showtime.id,
        seatNumbers: targetSeats.map(s => s.seatNumber),
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
      lockedSeats: targetSeats.map(s => s.seatNumber),
      heldSeats: targetSeats.map(s => s.seatNumber),
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

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: { screen: { include: { seats: true } } }
    });

    const targetShowtimeId = showtimeId;

    let whereClause: any = {
      showtimeId: targetShowtimeId,
      OR: [
        { heldBy: sessionId },
        { lockedBySessionId: sessionId }
      ],
      status: { in: ['HELD', 'LOCKED'] }
    };

    if (seatNumbers && seatNumbers.length > 0 && showtime) {
      const seats = showtime.screen.seats.filter(s =>
        seatNumbers.includes(s.seatNumber) || seatNumbers.includes(s.id)
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

    if (!showtime) {
      return null;
    }

    const now = new Date();

    const reservations = await prisma.seatReservation.findMany({
      where: { showtimeId: showtime.id }
    });

    const resMap = new Map(reservations.map(r => [r.seatId, r]));

    return showtime.screen.seats.map(seat => {
      const res = resMap.get(seat.id);
      let status: 'available' | 'held' | 'reserved' = 'available';
      let holdExpiresAt: number | undefined = undefined;
      let heldByMe = false;

      if (res) {
        if (res.status === 'BOOKED') {
          status = 'reserved';
        } else if (res.status === 'HELD' || res.status === 'LOCKED') {
          const expiry = res.heldExpiresAt || res.lockedUntil;
          if (expiry && expiry > now) {
            const holder = res.heldBy || res.lockedBySessionId;
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
        id: seat.seatNumber,
        dbId: seat.id,
        row: seat.row,
        number: seat.number,
        tier: seat.tier,
        price: seat.basePrice,
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
          OR: [
            { heldExpiresAt: { lte: now } },
            { lockedUntil: { lte: now } }
          ]
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
