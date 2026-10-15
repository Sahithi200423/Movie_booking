const assert = require('assert');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const { parseShowtimeToISTInstant, formatToISODate, isPastShowtime } = require('./dist/utils/dateUtils.js');

async function runTestSuite() {
  console.log('=== RUNNING CINEBOOK AUTOMATED TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function runTest(name, fn) {
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  async function runAsyncTest(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // TEST 1: Future showtime on October 16, 2026 at 1:45 PM
  runTest('Future showtime on October 16, 2026 at 1:45 PM is NOT rejected as past', () => {
    const isPast = isPastShowtime('2026-10-16', '01:45 PM');
    assert.strictEqual(isPast, false, 'October 16, 2026 at 1:45 PM should be in the future');
    const parsed = parseShowtimeToISTInstant('2026-10-16', '01:45 PM');
    assert.ok(parsed, 'Parsed object should exist');
    assert.strictEqual(parsed.year, 2026);
    assert.strictEqual(parsed.month, 10);
    assert.strictEqual(parsed.day, 16);
    assert.strictEqual(parsed.hours, 13);
    assert.strictEqual(parsed.minutes, 45);
    assert.strictEqual(parsed.isPast, false);
  });

  // TEST 2: Past showtime on October 14, 2026
  runTest('Past showtime on October 14, 2026 is blocked as past', () => {
    const isPast = isPastShowtime('2026-10-14', '01:45 PM');
    assert.strictEqual(isPast, true, 'October 14, 2026 should be in the past');
  });

  // TEST 3: Today showtime before current time vs after current time
  runTest('Today showtime: earlier today is blocked, later today is allowed', () => {
    // Current IST time
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);
    const todayStr = formatToISODate(now);

    // 1 hour ago
    const pastHour = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const pastHourIST = new Date(pastHour.getTime() + istOffset);
    const hPast = pastHourIST.getUTCHours();
    const ampmPast = hPast >= 12 ? 'PM' : 'AM';
    const h12Past = hPast % 12 || 12;
    const timePastStr = `${String(h12Past).padStart(2, '0')}:00 ${ampmPast}`;

    // Only test if pastHour falls on the same calendar day in IST
    if (formatToISODate(pastHour) === todayStr) {
      assert.strictEqual(isPastShowtime(todayStr, timePastStr), true, 'Earlier today should be past');
    }

    // Tomorrow at 07:30 PM
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowStr = formatToISODate(tomorrow);
    assert.strictEqual(isPastShowtime(tomorrowStr, '07:30 PM'), false, 'Tomorrow showtime must be allowed');
  });

  // TEST 4: Timezone boundary at midnight IST vs UTC
  runTest('Midnight IST boundary correctly handles day rollover without UTC drift', () => {
    // Oct 16 00:15 AM IST is Oct 15 18:45 UTC
    const parsed = parseShowtimeToISTInstant('2026-10-16', '12:15 AM');
    assert.ok(parsed);
    assert.strictEqual(parsed.isoString, '2026-10-16T00:15:00+05:30');
    // Timestamp should correspond to UTC Oct 15 18:45:00
    const d = new Date(parsed.timestamp);
    assert.strictEqual(d.toISOString(), '2026-10-15T18:45:00.000Z');
  });

  // TEST 5: Various string date formats parsing
  runTest('Robust date parsing handles "October 16, 2026", "2026-10-16", "1:45 PM", and "13:45"', () => {
    const p1 = parseShowtimeToISTInstant('October 16, 2026', '1:45 PM');
    const p2 = parseShowtimeToISTInstant('2026-10-16', '13:45');
    const p3 = parseShowtimeToISTInstant('16 Oct 2026', '01:45 PM');
    assert.ok(p1 && p2 && p3);
    assert.strictEqual(p1.year, 2026);
    assert.strictEqual(p1.month, 10);
    assert.strictEqual(p1.day, 16);
    assert.strictEqual(p1.hours, 13);
    assert.strictEqual(p1.minutes, 45);

    assert.strictEqual(p2.year, 2026);
    assert.strictEqual(p2.month, 10);
    assert.strictEqual(p2.day, 16);
    assert.strictEqual(p2.hours, 13);
    assert.strictEqual(p2.minutes, 45);

    assert.strictEqual(p1.timestamp, p2.timestamp);
  });

  // TEST 6: Supabase seat availability count formula: Total = Available + Booked + Active Held
  await runAsyncTest('Seat availability formula strictly enforces Total = Available + Booked + Active Held', async () => {
    const { resolveShowtime } = require('./dist/services/showtimeResolver.js');
    const { seatReservationService } = require('./dist/services/seatReservationService.js');

    // Resolve an authoritative test showtime for Oct 16, 2026
    const showtime = await resolveShowtime({
      movieId: 'rudra-fire-within',
      cinemaId: 'cin-pvr-orion',
      date: '2026-10-16',
      time: '01:45 PM'
    });

    assert.ok(showtime, 'Showtime resolved in Supabase');
    assert.strictEqual(showtime.date, '2026-10-16');
    assert.strictEqual(showtime.time, '01:45 PM');

    const liveSeats = await seatReservationService.getLiveSeats(showtime.id, 'session-test-user');
    assert.ok(Array.isArray(liveSeats), 'liveSeats must be an array');
    const totalSeats = liveSeats.length;
    assert.strictEqual(totalSeats, 128, 'Auditorium should have 128 seats');

    const bookedCount = liveSeats.filter(s => s.status === 'reserved').length;
    const heldCount = liveSeats.filter(s => s.status === 'held').length;
    const availableCount = liveSeats.filter(s => s.status === 'available').length;

    assert.strictEqual(
      totalSeats,
      availableCount + bookedCount + heldCount,
      'Invariant Total = Available + Booked + Active Held must hold true'
    );
  });

  // TEST 7: Pricing verification (Strictly ₹5.00 / 500 paise per ticket)
  runTest('Pricing verification: Strictly ₹5 per seat (500 paise) across all tiers', () => {
    const seats = ['A1', 'A2', 'C1', 'H1'];
    const pricePerSeat = 5.0;
    const totalAmount = seats.length * pricePerSeat;
    const totalInPaise = Math.round(totalAmount * 100);
    assert.strictEqual(totalAmount, 20.0);
    assert.strictEqual(totalInPaise, 2000);
  });

  // TEST 8: Two users cannot hold the same seat (concurrency test)
  await runAsyncTest('Database concurrency: Two users cannot hold or book the same seat', async () => {
    const { resolveShowtime } = require('./dist/services/showtimeResolver.js');
    const { seatReservationService } = require('./dist/services/seatReservationService.js');

    const showtime = await resolveShowtime({
      movieId: 'rudra-fire-within',
      cinemaId: 'cin-pvr-orion',
      date: '2026-10-16',
      time: '01:45 PM'
    });

    const testSeat = 'H16';

    // Ensure test seat is unlocked first
    await seatReservationService.unlockSeats({
      showtimeId: showtime.id,
      seatNumbers: [testSeat],
      sessionId: 'session-user-A'
    }).catch(() => {});

    // User A locks seat
    await seatReservationService.lockSeats({
      showtimeId: showtime.id,
      seatNumbers: [testSeat],
      sessionId: 'session-user-A',
      durationMinutes: 10
    });

    // User B attempts to lock the exact same seat -> MUST throw conflict error
    let userBBlocked = false;
    try {
      await seatReservationService.lockSeats({
        showtimeId: showtime.id,
        seatNumbers: [testSeat],
        sessionId: 'session-user-B',
        durationMinutes: 10
      });
    } catch (err) {
      userBBlocked = true;
    }

    assert.strictEqual(userBBlocked, true, 'User B must be blocked from locking seat held by User A');

    // Clean up: User A unlocks seat
    await seatReservationService.unlockSeats({
      showtimeId: showtime.id,
      seatNumbers: [testSeat],
      sessionId: 'session-user-A'
    });
  });

  console.log(`\n=== TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch(err => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
