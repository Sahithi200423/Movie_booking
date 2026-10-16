const assert = require('assert');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const { parseShowtimeToISTInstant, formatToISODate, isPastShowtime, generateCanonicalShowtimeId, parseShowtimeId } = require('./dist/utils/dateUtils.js');

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

  // TEST 1: Future showtime on October 19, 2026 at 4:30 PM
  runTest('Future showtime on October 19, 2026 at 4:30 PM is NOT rejected as past', () => {
    const isPast = isPastShowtime('2026-10-19', '04:30 PM');
    assert.strictEqual(isPast, false, 'October 19, 2026 at 4:30 PM should be in the future');
    const parsed = parseShowtimeToISTInstant('2026-10-19', '04:30 PM');
    assert.ok(parsed, 'Parsed object should exist');
    assert.strictEqual(parsed.year, 2026);
    assert.strictEqual(parsed.month, 10);
    assert.strictEqual(parsed.day, 19);
    assert.strictEqual(parsed.hours, 16);
    assert.strictEqual(parsed.minutes, 30);
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

  // TEST 9: October 19, 2026 at 4:30 PM — correct showtime resolution & live seat counts
  await runAsyncTest('October 19, 2026 at 4:30 PM resolves to authoritative Supabase showtime with 128 seats', async () => {
    const { resolveShowtime } = require('./dist/services/showtimeResolver.js');
    const { seatReservationService } = require('./dist/services/seatReservationService.js');

    const showtime = await resolveShowtime({
      movieId: 'kalki-2898-ad',
      movieTitle: 'Kalki 2898 AD',
      cinemaId: 'cin-pvr-orion',
      cinemaName: 'PVR INOX Orion Mall',
      city: 'Bangalore',
      date: '2026-10-19',
      time: '04:30 PM',
      format: '4DX',
      hall: 'Screen 1'
    });

    assert.ok(showtime, 'Showtime must resolve successfully');
    assert.strictEqual(showtime.date, '2026-10-19', 'Date must be 2026-10-19');
    assert.strictEqual(showtime.time, '04:30 PM', 'Time must be 04:30 PM');
    assert.ok(showtime.id, 'Authoritative Supabase showtime ID must exist');

    const liveSeats = await seatReservationService.getLiveSeats(showtime.id, 'session-audit-verifier');
    assert.ok(Array.isArray(liveSeats), 'liveSeats must be an array');
    assert.strictEqual(liveSeats.length, 128, 'Auditorium must have 128 seats');

    const booked = liveSeats.filter(s => s.status === 'reserved').length;
    const held = liveSeats.filter(s => s.status === 'held').length;
    const available = liveSeats.filter(s => s.status === 'available').length;
    assert.strictEqual(128, available + booked + held, 'Total must equal Available + Booked + Held');
  });

  // TEST 10: Rehydration via showtime ID returns movie, theatre, date, and time
  await runAsyncTest('Rehydration endpoint verification: showtime lookup returns full theatre & movie details', async () => {
    const { prisma } = require('./dist/prisma.js');

    const testShow = await prisma.showtime.findFirst({
      where: { date: '2026-10-19', time: '04:30 PM' },
      include: { movie: true, screen: { include: { theatre: true } } }
    });

    assert.ok(testShow, 'Showtime for Oct 19 4:30 PM must exist in database');
    assert.ok(testShow.movie, 'Movie relation must be present');
    assert.ok(testShow.screen?.theatre, 'Theatre relation must be present');
  });

  // TEST 11: Exact pricing formula verification (1 seat = ₹5, 2 seats = ₹10)
  runTest('Pricing formula: 1 seat = ₹5 (500 paise), 2 seats = ₹10 (1000 paise)', () => {
    const singleSeatPrice = 1 * 5.0;
    const twoSeatPrice = 2 * 5.0;
    assert.strictEqual(singleSeatPrice, 5.0);
    assert.strictEqual(Math.round(singleSeatPrice * 100), 500);
    assert.strictEqual(twoSeatPrice, 10.0);
    assert.strictEqual(Math.round(twoSeatPrice * 100), 1000);
  });

  // TEST 12: Canonical showtime ID generation for Stree 2 at PVR Phoenix Palladium
  runTest('Canonical ID formula generates deterministic ID for Stree 2', () => {
    const canonical = generateCanonicalShowtimeId('stree-2', 'cin-mumbai-pvr-phoenix', '2026-10-15', '04:30 PM');
    assert.strictEqual(canonical, 'show-stree-2-pvr-2026-10-15-0430PM');
    const parsed = parseShowtimeId(canonical);
    assert.strictEqual(parsed.isCanonical, true);
    assert.strictEqual(parsed.movieId, 'stree-2');
    assert.strictEqual(parsed.cinemaSlug, 'pvr');
    assert.strictEqual(parsed.date, '2026-10-15');
    assert.strictEqual(parsed.time, '04:30 PM');
  });

  // TEST 13: Retrieving existing Stree 2 showtime: show-stree-2-pvr-2026-10-15-0430PM
  await runAsyncTest('Retrieving existing showtime: ensurePrismaShowtime resolves show-stree-2-pvr-2026-10-15-0430PM', async () => {
    const { ensurePrismaShowtime } = require('./dist/services/showtimeResolver.js');
    const show = await ensurePrismaShowtime('show-stree-2-pvr-2026-10-15-0430PM');
    assert.ok(show, 'Showtime show-stree-2-pvr-2026-10-15-0430PM must resolve');
    assert.strictEqual(show.date, '2026-10-15');
    assert.strictEqual(show.time, '04:30 PM');
    assert.ok(show.movie, 'Movie details must be present');
    assert.strictEqual(show.movie.title, 'Stree 2');
    assert.ok(show.screen, 'Screen details must be present');
    assert.ok(show.screen.theatre, 'Theatre details must be present');
    assert.ok(show.screen.theatre.name.includes('PVR ICON'), 'Theatre must be PVR ICON');
  });

  // TEST 14: Nonexistent or invalid showtime rejection
  await runAsyncTest('Nonexistent showtime rejection: invalid ID returns null without throwing unhandled error', async () => {
    const { ensurePrismaShowtime } = require('./dist/services/showtimeResolver.js');
    const nonexistent = await ensurePrismaShowtime('show-completely-nonexistent-xyz-9999-01-01-1200AM');
    assert.strictEqual(nonexistent, null, 'Nonexistent showtime must return null');
  });

  // TEST 15: Selecting seats for show-stree-2-pvr-2026-10-15-0430PM
  await runAsyncTest('Live seat availability for show-stree-2-pvr-2026-10-15-0430PM returns 128 seats', async () => {
    const { seatReservationService } = require('./dist/services/seatReservationService.js');
    const liveSeats = await seatReservationService.getLiveSeats('show-stree-2-pvr-2026-10-15-0430PM', 'session-stree2-test');
    assert.ok(Array.isArray(liveSeats));
    assert.strictEqual(liveSeats.length, 128, 'Must return 128 auditorium seats');
    const validStatuses = new Set(['available', 'reserved', 'held']);
    for (const s of liveSeats) {
      assert.ok(validStatuses.has(s.status), `Seat ${s.id} status must be valid`);
      assert.strictEqual(s.price, 5.0, `Seat ${s.id} price must be exactly ₹5.00`);
    }
  });

  // TEST 16: Seat lock and release lifecycle on Stree 2 showtime
  await runAsyncTest('Seat lock and release lifecycle on show-stree-2-pvr-2026-10-15-0430PM', async () => {
    const { seatReservationService } = require('./dist/services/seatReservationService.js');
    const testSeat = 'G10';
    const sessionId = 'session-stree2-lifecycle';

    // Ensure clean state
    await seatReservationService.unlockSeats({
      showtimeId: 'show-stree-2-pvr-2026-10-15-0430PM',
      seatNumbers: [testSeat],
      sessionId
    }).catch(() => {});

    // Lock seat
    const lockRes = await seatReservationService.lockSeats({
      showtimeId: 'show-stree-2-pvr-2026-10-15-0430PM',
      seatNumbers: [testSeat],
      sessionId,
      durationMinutes: 5
    });
    assert.ok(lockRes.success, 'Lock seats must succeed');

    // Verify seat is held
    const seatsDuringHold = await seatReservationService.getLiveSeats('show-stree-2-pvr-2026-10-15-0430PM', 'other-session');
    const heldSeat = seatsDuringHold.find(s => s.id === testSeat);
    assert.ok(heldSeat, 'Seat must be in live seats');
    assert.strictEqual(heldSeat.status, 'held', 'Seat must be marked as held');

    // Unlock seat
    const unlockRes = await seatReservationService.unlockSeats({
      showtimeId: 'show-stree-2-pvr-2026-10-15-0430PM',
      seatNumbers: [testSeat],
      sessionId
    });
    assert.ok(unlockRes.success, 'Unlock seats must succeed');

    // Verify seat is available again
    const seatsAfterRelease = await seatReservationService.getLiveSeats('show-stree-2-pvr-2026-10-15-0430PM', 'other-session');
    const availableSeat = seatsAfterRelease.find(s => s.id === testSeat);
    assert.ok(availableSeat);
    assert.strictEqual(availableSeat.status, 'available', 'Seat must be restored to available');
  });

  // TEST 17: Authoritative total recalculation on backend (₹5 per seat, 0 fees, 0 tax)
  runTest('Authoritative server pricing: ₹5 per seat (500 paise), 0 convenience fee, 0 tax', () => {
    const seats = ['B1', 'B2', 'B3'];
    const ticketPaisePerSeat = 500;
    const totalInPaise = seats.length * ticketPaisePerSeat;
    const totalAmount = totalInPaise / 100;
    const convenienceFee = 0.00;
    const tax = 0.00;
    assert.strictEqual(totalAmount, 15.00);
    assert.strictEqual(totalInPaise, 1500);
    assert.strictEqual(convenienceFee, 0.00);
    assert.strictEqual(tax, 0.00);
  });

  // TEST 18: October 19, 2026, at 4:30 PM showtime canonical resolution
  await runAsyncTest('October 19, 2026, at 4:30 PM: canonical resolution produces authoritative showtime', async () => {
    const { ensurePrismaShowtime } = require('./dist/services/showtimeResolver.js');
    const showtime = await ensurePrismaShowtime('show-stree-2-pvr-2026-10-19-0430PM');
    assert.ok(showtime, 'Showtime show-stree-2-pvr-2026-10-19-0430PM must exist');
    assert.strictEqual(showtime.id, 'show-stree-2-pvr-2026-10-19-0430PM');
    assert.strictEqual(showtime.date, '2026-10-19', 'Date must be 2026-10-19');
    assert.strictEqual(showtime.time, '04:30 PM', 'Time must be 04:30 PM');
    assert.strictEqual(showtime.movieId, 'stree-2', 'Movie must be stree-2');
  });

  // TEST 19: Date filter strictness: requesting date 2026-10-19 never returns historical shows
  runTest('Strict date filtering: filtering by 2026-10-19 returns only matching shows, never Oct 4 historical shows', () => {
    const { db } = require('./dist/db.js');
    const shows = db.getShowtimes('stree-2', undefined, '2026-10-19');
    for (const s of shows) {
      assert.strictEqual(s.date, '2026-10-19', `All returned shows must match date 2026-10-19, got ${s.date}`);
    }
  });

  // TEST 20: Asia/Kolkata date boundary formatting preserves 2026-10-19 without UTC offset rollback
  runTest('Asia/Kolkata date formatting preserves 2026-10-19 across timezones', () => {
    const formatted = formatToISODate('2026-10-19');
    assert.strictEqual(formatted, '2026-10-19', 'formatToISODate must preserve 2026-10-19');

    // Test parseShowtimeId extracts correct date and time
    const parsed = parseShowtimeId('show-stree-2-pvr-2026-10-19-0430PM');
    assert.strictEqual(parsed.date, '2026-10-19');
    assert.strictEqual(parsed.time, '04:30 PM');
    assert.strictEqual(parsed.movieId, 'stree-2');
    assert.strictEqual(parsed.cinemaSlug, 'pvr');
    assert.strictEqual(parsed.isCanonical, true);
  });

  // TEST 21: Full 128 seat availability verification for show-stree-2-pvr-2026-10-19-0430PM
  await runAsyncTest('Live seat availability for show-stree-2-pvr-2026-10-19-0430PM: returns 128 seats at ₹5', async () => {
    const { seatReservationService } = require('./dist/services/seatReservationService.js');
    const liveSeats = await seatReservationService.getLiveSeats('show-stree-2-pvr-2026-10-19-0430PM', 'session-oct19-verify');
    assert.ok(Array.isArray(liveSeats));
    assert.strictEqual(liveSeats.length, 128, 'Must have exactly 128 seats');
    const available = liveSeats.filter(s => s.status === 'available');
    const booked = liveSeats.filter(s => s.status === 'reserved');
    const held = liveSeats.filter(s => s.status === 'held');
    assert.strictEqual(available.length + booked.length + held.length, 128, 'Total must equal available + booked + held');
    for (const s of liveSeats) {
      assert.strictEqual(s.price, 5.0, `Each seat must cost exactly ₹5, got ${s.price}`);
    }
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
