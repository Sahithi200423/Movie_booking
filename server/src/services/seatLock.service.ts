import Redis from 'ioredis';
import { EventEmitter } from 'events';

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

export interface SeatLockResult {
  success: boolean;
  seatId: string;
  heldBy?: string;
  expiresAt?: number;
  message?: string;
}

export interface BatchSeatLockResult {
  success: boolean;
  showtimeId: string;
  userId: string;
  lockedSeats: string[];
  failedSeats: string[];
  expiresAt: number;
  message: string;
}

export interface SeatLockState {
  seatId: string;
  status: 'AVAILABLE' | 'HELD' | 'BOOKED';
  heldByUserId?: string;
  ttlRemainingSeconds?: number;
  expiresAt?: number;
}

// ---------------------------------------------------------------------------
// Lua Scripts for Atomic Concurrency Execution in Redis
// ---------------------------------------------------------------------------

/**
 * Atomic Multi-Seat Lock Lua Script:
 * Evaluates all requested seats. If ANY seat is already locked by another user,
 * NO seats are acquired and the conflicting seats are returned.
 * If all are available or already held by the same user, all locks are acquired/renewed with TTL.
 */
const ATOMIC_BATCH_LOCK_SCRIPT = `
local showtimeId = ARGV[1]
local userId = ARGV[2]
local ttlSeconds = tonumber(ARGV[3])
local numKeys = #KEYS

-- Step 1: Check all keys for conflicts
for i = 1, numKeys do
    local currentHolder = redis.call('GET', KEYS[i])
    if currentHolder and currentHolder ~= userId then
        -- Conflict found: return 0 with the index of the conflicting seat
        return { 0, KEYS[i], currentHolder }
    end
end

-- Step 2: All seats are clear or owned by this user -> Acquire all locks
for i = 1, numKeys do
    redis.call('SET', KEYS[i], userId, 'EX', ttlSeconds)
end

return { 1, "OK" }
`;

/**
 * Atomic Safe Release Script:
 * Releases a lock ONLY if the current value matches the requesting userId.
 * Prevents a user from releasing someone else's newly acquired lock if their own TTL expired.
 */
const ATOMIC_SAFE_RELEASE_SCRIPT = `
if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1])
else
    return 0
end
`;

// ---------------------------------------------------------------------------
// In-Memory Fallback Simulator for Local Dev / Zero-Redis Environments
// ---------------------------------------------------------------------------
class MemoryRedisFallback {
  private store: Map<string, { value: string; expiresAt: number }> = new Map();

  constructor() {
    // Periodically clean up expired keys
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.store.entries()) {
        if (item.expiresAt <= now) {
          this.store.delete(key);
        }
      }
    }, 5000);
  }

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<'OK' | null> {
    const now = Date.now();
    const existing = await this.get(key);
    if (mode === 'NX' && existing) {
      return null;
    }
    const ttl = (duration || 600) * 1000;
    this.store.set(key, { value, expiresAt: now + ttl });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async ttl(key: string): Promise<number> {
    const item = this.store.get(key);
    if (!item) return -2;
    const remaining = Math.max(0, Math.round((item.expiresAt - Date.now()) / 1000));
    return remaining;
  }

  async keys(pattern: string): Promise<string[]> {
    const prefix = pattern.replace('*', '');
    const results: string[] = [];
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (item.expiresAt > now && key.startsWith(prefix)) {
        results.push(key);
      }
    }
    return results;
  }
}

// ---------------------------------------------------------------------------
// Distributed Seat Locking Service
// ---------------------------------------------------------------------------
export class SeatLockService extends EventEmitter {
  private redis: Redis | MemoryRedisFallback;
  private isUsingFallback = false;
  private defaultTTL = 600; // 10 minutes in seconds

  constructor() {
    super();

    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        const client = new Redis(redisUrl, {
          maxRetriesPerRequest: 2,
          retryStrategy: (times) => (times > 3 ? null : Math.min(times * 100, 2000)),
          lazyConnect: true
        });

        client.connect().then(() => {
          console.log('⚡ [Redis] Distributed seat-lock cluster connected successfully.');
        }).catch((err) => {
          console.warn('⚠️ [Redis] Connection failed, switching to in-memory fallback:', err.message);
          this.redis = new MemoryRedisFallback();
          this.isUsingFallback = true;
        });

        this.redis = client;
      } catch (err) {
        console.warn('⚠️ [Redis] Error initializing ioredis, using in-memory store:', (err as Error).message);
        this.redis = new MemoryRedisFallback();
        this.isUsingFallback = true;
      }
    } else {
      console.log('ℹ️ [Redis] No REDIS_URL configured; using in-memory distributed lock simulator.');
      this.redis = new MemoryRedisFallback();
      this.isUsingFallback = true;
    }
  }

  /**
   * Constructs the Redis key for a specific showtime seat
   * Format: `showtime:{showtimeId}:seat:{seatId}`
   */
  private getSeatKey(showtimeId: string, seatId: string): string {
    return `showtime:${showtimeId}:seat:${seatId}`;
  }

  /**
   * Acquire a distributed lock on a single seat with 10-minute TTL
   * Command equivalent: `SET showtime:{id}:seat:{seatId} {userId} NX EX 600`
   */
  public async acquireSeatLock(
    showtimeId: string,
    seatId: string,
    userId: string,
    ttlSeconds: number = this.defaultTTL
  ): Promise<SeatLockResult> {
    const key = this.getSeatKey(showtimeId, seatId);

    if (!this.isUsingFallback && this.redis instanceof Redis) {
      // Native Redis atomic NX EX
      const result = await this.redis.set(key, userId, 'EX', ttlSeconds, 'NX');
      if (result === 'OK') {
        const expiresAt = Date.now() + ttlSeconds * 1000;
        this.broadcastSeatState(showtimeId, seatId, 'HELD', userId, expiresAt);
        return { success: true, seatId, heldBy: userId, expiresAt };
      }

      // Check if current user already holds it (idempotent re-lock)
      const currentHolder = await this.redis.get(key);
      if (currentHolder === userId) {
        await this.redis.expire(key, ttlSeconds);
        const expiresAt = Date.now() + ttlSeconds * 1000;
        return { success: true, seatId, heldBy: userId, expiresAt };
      }

      return {
        success: false,
        seatId,
        heldBy: currentHolder || 'ANOTHER_USER',
        message: `Seat ${seatId} is currently held by another user.`
      };
    } else {
      // In-Memory Fallback
      const current = await this.redis.get(key);
      if (!current || current === userId) {
        await this.redis.set(key, userId, 'EX', ttlSeconds);
        const expiresAt = Date.now() + ttlSeconds * 1000;
        this.broadcastSeatState(showtimeId, seatId, 'HELD', userId, expiresAt);
        return { success: true, seatId, heldBy: userId, expiresAt };
      }
      return {
        success: false,
        seatId,
        heldBy: current,
        message: `Seat ${seatId} is currently held by another user.`
      };
    }
  }

  /**
   * Atomically acquire distributed locks on multiple seats.
   * If any seat is unavailable, transaction rolls back so zero locks are held.
   */
  public async acquireMultipleSeatLocks(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    ttlSeconds: number = this.defaultTTL
  ): Promise<BatchSeatLockResult> {
    if (!seatIds || seatIds.length === 0) {
      return {
        success: false,
        showtimeId,
        userId,
        lockedSeats: [],
        failedSeats: [],
        expiresAt: 0,
        message: 'No seats provided to lock.'
      };
    }

    const keys = seatIds.map((id) => this.getSeatKey(showtimeId, id));
    const expiresAt = Date.now() + ttlSeconds * 1000;

    if (!this.isUsingFallback && this.redis instanceof Redis) {
      try {
        const result = (await this.redis.eval(
          ATOMIC_BATCH_LOCK_SCRIPT,
          keys.length,
          ...keys,
          showtimeId,
          userId,
          ttlSeconds.toString()
        )) as [number, string, string?];

        const [isSuccess, conflictKey, conflictUser] = result;

        if (isSuccess === 1) {
          // Broadcast to all connected clients
          for (const seatId of seatIds) {
            this.broadcastSeatState(showtimeId, seatId, 'HELD', userId, expiresAt);
          }
          return {
            success: true,
            showtimeId,
            userId,
            lockedSeats: seatIds,
            failedSeats: [],
            expiresAt,
            message: `Successfully held ${seatIds.length} seat(s) for 10 minutes.`
          };
        } else {
          const conflictingSeatId = conflictKey.split(':seat:')[1] || conflictKey;
          return {
            success: false,
            showtimeId,
            userId,
            lockedSeats: [],
            failedSeats: [conflictingSeatId],
            expiresAt: 0,
            message: `Seat ${conflictingSeatId} is already held by another user.`
          };
        }
      } catch (err) {
        console.error('Redis atomic batch script error:', err);
      }
    }

    // Fallback atomic check & acquire
    const failedSeats: string[] = [];
    for (const seatId of seatIds) {
      const key = this.getSeatKey(showtimeId, seatId);
      const holder = await this.redis.get(key);
      if (holder && holder !== userId) {
        failedSeats.push(seatId);
      }
    }

    if (failedSeats.length > 0) {
      return {
        success: false,
        showtimeId,
        userId,
        lockedSeats: [],
        failedSeats,
        expiresAt: 0,
        message: `Seats ${failedSeats.join(', ')} are already held by another customer.`
      };
    }

    // Lock all
    for (const seatId of seatIds) {
      const key = this.getSeatKey(showtimeId, seatId);
      await this.redis.set(key, userId, 'EX', ttlSeconds);
      this.broadcastSeatState(showtimeId, seatId, 'HELD', userId, expiresAt);
    }

    return {
      success: true,
      showtimeId,
      userId,
      lockedSeats: seatIds,
      failedSeats: [],
      expiresAt,
      message: `Successfully locked ${seatIds.length} seat(s).`
    };
  }

  /**
   * Release a distributed seat lock safely (only if owned by requesting user)
   */
  public async releaseSeatLock(showtimeId: string, seatId: string, userId: string): Promise<boolean> {
    const key = this.getSeatKey(showtimeId, seatId);

    let released = false;
    if (!this.isUsingFallback && this.redis instanceof Redis) {
      const result = await this.redis.eval(ATOMIC_SAFE_RELEASE_SCRIPT, 1, key, userId);
      released = result === 1;
    } else {
      const current = await this.redis.get(key);
      if (current === userId) {
        await this.redis.del(key);
        released = true;
      }
    }

    if (released) {
      this.broadcastSeatState(showtimeId, seatId, 'AVAILABLE');
    }
    return released;
  }

  /**
   * Release multiple seat locks for a user (e.g. checkout abandonment or modal close)
   */
  public async releaseMultipleSeatLocks(
    showtimeId: string,
    seatIds: string[],
    userId: string
  ): Promise<string[]> {
    const releasedSeats: string[] = [];
    for (const seatId of seatIds) {
      const ok = await this.releaseSeatLock(showtimeId, seatId, userId);
      if (ok) releasedSeats.push(seatId);
    }
    return releasedSeats;
  }

  /**
   * Retrieve all currently active seat locks for a showtime
   */
  public async getShowtimeLocks(showtimeId: string): Promise<Map<string, { heldBy: string; ttl: number }>> {
    const prefix = `showtime:${showtimeId}:seat:`;
    const lockMap = new Map<string, { heldBy: string; ttl: number }>();

    let keys: string[] = [];
    if (!this.isUsingFallback && this.redis instanceof Redis) {
      keys = await this.redis.keys(`${prefix}*`);
    } else {
      keys = await (this.redis as MemoryRedisFallback).keys(`${prefix}*`);
    }

    for (const key of keys) {
      const seatId = key.replace(prefix, '');
      const heldBy = await this.redis.get(key);
      if (heldBy) {
        const ttl = await this.redis.ttl(key);
        lockMap.set(seatId, { heldBy, ttl });
      }
    }

    return lockMap;
  }

  /**
   * Broadcast real-time WebSocket seat updates
   */
  private broadcastSeatState(
    showtimeId: string,
    seatId: string,
    status: 'AVAILABLE' | 'HELD' | 'BOOKED',
    heldBy?: string,
    expiresAt?: number
  ) {
    const payload = {
      showtimeId,
      seatId,
      status,
      heldBy,
      expiresAt,
      timestamp: new Date().toISOString()
    };

    // Emit via internal EventEmitter for WebSocket / SSE bridges
    this.emit('seatUpdate', payload);
  }
}

// Export singleton instance
export const seatLockService = new SeatLockService();
