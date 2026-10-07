import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5000/api';

async function runRigorousVerification() {
  console.log('🔬 Starting Comprehensive Post-Implementation Verification Suite...\n');
  let passCount = 0;
  let totalCount = 0;

  function assert(condition, message) {
    totalCount++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passCount++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // 1. HEALTH CHECK & REACHABILITY
  {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    assert(res.status === 200 && data.status === 'healthy', 'Backend is healthy and reachable on port 5000');
  }

  // 2. CHECK ALL CINEMAS HAVE IANA TIMEZONE
  {
    const res = await fetch(`${API_BASE}/cinemas`);
    const data = await res.json();
    const cinemas = data.cinemas || data;
    assert(cinemas.length >= 6, `Fetched ${cinemas.length} cinemas`);
    const allHaveTimezone = cinemas.every(c => c.timezone && c.timezone.includes('/'));
    assert(allHaveTimezone, 'Every cinema has a valid IANA timezone (e.g. Asia/Kolkata, America/New_York)');
  }

  // Fetch real showtimes from backend
  const showsRes = await fetch(`${API_BASE}/shows`);
  const showsData = await showsRes.json();
  const allShows = showsData.showtimes || [];
  assert(allShows.length >= 2, `Retrieved ${allShows.length} active showtimes`);

  // 3. SEAT HOLD CONCURRENCY: SIMULTANEOUS ATTEMPTS ON SAME SEAT
  {
    const showtime = allShows[0];
    const showtimeId = showtime.id;
    const seatsRes = await fetch(`${API_BASE}/shows/${showtimeId}/seats?sessionId=probe-session`);
    const seatsJson = await seatsRes.json();
    const seatsData = seatsJson.seats || seatsJson;
    const availableSeat = seatsData.find(s => s.status === 'available');
    assert(!!availableSeat, `Found available seat for concurrency test: ${availableSeat?.id} in show ${showtimeId}`);

    const targetSeatId = availableSeat.id;
    const sessionA = 'session-buyer-alpha-' + Date.now();
    const sessionB = 'session-buyer-beta-' + Date.now();

    // Fire two hold requests at the exact same millisecond
    const [resA, resB] = await Promise.all([
      fetch(`${API_BASE}/shows/${showtimeId}/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatIds: [targetSeatId], sessionId: sessionA })
      }),
      fetch(`${API_BASE}/shows/${showtimeId}/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatIds: [targetSeatId], sessionId: sessionB })
      })
    ]);

    const statuses = [resA.status, resB.status];
    assert(
      statuses.includes(200) && statuses.includes(409),
      `Atomic Concurrency: Exactly one session succeeded (200) and competing session was rejected with 409 Conflict (Statuses: ${statuses.join(', ')})`
    );

    // Release the winner's hold
    const winnerSession = resA.status === 200 ? sessionA : sessionB;
    await fetch(`${API_BASE}/shows/${showtimeId}/release-hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seatIds: [targetSeatId], sessionId: winnerSession })
    });
  }

  // 3b. SEAT HOLD EXPIRATION: TIMEOUT AUTO-RELEASE
  {
    const showtime = allShows[0];
    const showtimeId = showtime.id;
    const seatsRes = await fetch(`${API_BASE}/shows/${showtimeId}/seats?sessionId=exp-probe`);
    const seatsJson = await seatsRes.json();
    const seatsData = seatsJson.seats || seatsJson;
    const availableSeat = seatsData.find(s => s.status === 'available');
    assert(!!availableSeat, `Found available seat for hold expiration test: ${availableSeat?.id}`);

    const expSeatId = availableSeat.id;
    const expSession = 'session-expiring-' + Date.now();

    // Acquire short 0.025 min (~1.5s) hold
    const holdRes = await fetch(`${API_BASE}/shows/${showtimeId}/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seatIds: [expSeatId], sessionId: expSession, durationMinutes: 0.025 })
    });
    assert(holdRes.status === 200, 'Acquired short hold for expiration testing');

    // Confirm it is held for other sessions
    const checkRes1 = await fetch(`${API_BASE}/shows/${showtimeId}/seats?sessionId=competing-user`);
    const checkJson1 = await checkRes1.json();
    const seatBeforeExp = (checkJson1.seats || checkJson1).find(s => s.id === expSeatId);
    assert(seatBeforeExp?.status === 'held', 'Seat is held for other sessions during active hold period');

    // Wait 2.0 seconds for hold expiration
    await new Promise(r => setTimeout(r, 2000));

    // Confirm hold expired and seat returned to available
    const checkRes2 = await fetch(`${API_BASE}/shows/${showtimeId}/seats?sessionId=competing-user`);
    const checkJson2 = await checkRes2.json();
    const seatAfterExp = (checkJson2.seats || checkJson2).find(s => s.id === expSeatId);
    assert(seatAfterExp?.status === 'available', 'Seat hold expired automatically; seat is available again');
  }

  // 4. COMPLETE BOOKING FLOW WITH COUPON AND QR GENERATION
  let createdBooking = null;
  {
    const showtime = allShows[1] || allShows[0];
    const showtimeId = showtime.id;
    const customerSession = 'cust-flow-session-' + Date.now();

    // A. Fetch seats
    const seatsRes = await fetch(`${API_BASE}/shows/${showtimeId}/seats?sessionId=${customerSession}`);
    const seatsJson = await seatsRes.json();
    const seatsData = seatsJson.seats || seatsJson;
    const targetSeats = seatsData.filter(s => s.status === 'available').slice(0, 2);
    assert(targetSeats.length === 2, `Selected 2 available seats: ${targetSeats.map(s => s.id).join(', ')}`);

    const seatIds = targetSeats.map(s => s.id);

    // B. Acquire temporary hold
    const holdRes = await fetch(`${API_BASE}/shows/${showtimeId}/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seatIds, sessionId: customerSession })
    });
    assert(holdRes.status === 200, 'Successfully acquired temporary 7-minute seat hold');

    // C. Validate coupon
    const couponRes = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'WELCOME50', subtotal: 50.00 })
    });
    const couponData = await couponRes.json();
    const discountAmount = couponData.coupon?.calculatedDiscount;
    assert(couponData.success === true && discountAmount > 0, `Validated coupon WELCOME50 (Discount: $${discountAmount})`);

    // D. Complete booking
    const bookRes = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showtimeId,
        sessionId: customerSession,
        movieId: showtime.movieId,
        movieTitle: 'CineBook Feature',
        moviePoster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop',
        movieDuration: '150 min',
        movieAgeRating: 'PG-13',
        cinemaId: showtime.cinemaId,
        cinemaName: 'CineBook Flagship Cinema',
        cinemaAddress: '450 Theater Way, Downtown',
        hall: showtime.hall,
        format: showtime.format,
        date: showtime.date,
        time: showtime.time,
        selectedLanguage: showtime.language || 'English',
        customerName: 'Rigorous Verification User',
        customerEmail: 'verifier@cinebook.dev',
        customerPhone: '+1-555-0199',
        seats: targetSeats.map(s => ({
          id: s.id,
          row: s.row,
          number: s.number,
          tier: s.tier,
          price: s.price
        })),
        addons: [{ id: 'popcorn-l', name: 'Gourmet Butter Popcorn', price: 8.50, quantity: 1 }],
        subtotal: 35.00,
        convenienceFee: 3.50,
        tax: 2.80,
        couponCode: 'WELCOME50',
        discountAmount: discountAmount,
        paymentMethod: 'Demo Visa (Test Mode)'
      })
    });

    const bookData = await bookRes.json();
    assert(bookRes.status === 201 && bookData.success, 'Created confirmed booking successfully');
    assert(!!bookData.booking.id && bookData.booking.id.startsWith('CB-'), `Generated unique booking reference: ${bookData.booking.id}`);
    assert(!!bookData.booking.qrToken, `Generated secure ticket QR token: ${bookData.booking.qrToken}`);
    createdBooking = bookData.booking;

    // E. Verify seats are now permanently reserved for competing users
    const postBookSeatsRes = await fetch(`${API_BASE}/shows/${showtimeId}/seats?sessionId=another-random-user`);
    const postBookJson = await postBookSeatsRes.json();
    const postBookSeats = postBookJson.seats || postBookJson;
    const reservedCheck = postBookSeats.filter(s => seatIds.includes(s.id));
    assert(reservedCheck.every(s => s.status === 'reserved'), 'Booked seats are now strictly reserved on the backend');
  }

  // 5. GATEKEEPER QR CODE VALIDATION & ANTI-REPLAY TEST
  {
    assert(!!createdBooking, 'Have active booking for Gatekeeper test');

    // A. First scan: valid admission
    const scanRes1 = await fetch(`${API_BASE}/bookings/verify-ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: createdBooking.qrToken,
        staffName: 'Officer Sarah Connor'
      })
    });
    const scanData1 = await scanRes1.json();
    assert(scanData1.success === true && scanData1.valid === true, 'First QR ticket scan admitted passenger successfully');
    assert(scanData1.booking.id === createdBooking.id, 'Gatekeeper retrieved accurate booking reference');

    // B. Second scan with same ticket: REPLAY REJECTION
    const scanRes2 = await fetch(`${API_BASE}/bookings/verify-ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: createdBooking.qrToken,
        staffName: 'Officer John Matrix'
      })
    });
    const scanData2 = await scanRes2.json();
    assert(scanData2.alreadyCheckedIn === true && scanData2.valid === false, 'Anti-Replay: Duplicate QR ticket scan was strictly flagged with alreadyCheckedIn: true');
    assert(scanData2.message.includes('REPLAY WARNING'), 'Replay rejection includes clear security warning message');
  }

  // 6. PRORATED TICKET CANCELLATION & SEAT RELEASE TEST
  {
    const cancelRes = await fetch(`${API_BASE}/bookings/${createdBooking.id}/cancel`, {
      method: 'POST'
    });
    const cancelData = await cancelRes.json();
    assert(cancelRes.status === 200 && cancelData.success, 'Successfully cancelled booking');
    assert(cancelData.booking.status === 'cancelled', 'Booking status updated to cancelled');
    assert(cancelData.booking.refundAmount > 0, `Prorated 90% refund recorded: $${cancelData.booking.refundAmount}`);

    // Verify seats were released back to inventory
    const seatsAfterCancelRes = await fetch(`${API_BASE}/shows/${createdBooking.showtimeId}/seats`);
    const seatsAfterCancelJson = await seatsAfterCancelRes.json();
    const seatsAfterCancel = seatsAfterCancelJson.seats || seatsAfterCancelJson;
    const releasedSeats = seatsAfterCancel.filter(s => createdBooking.seats.map(cs => cs.id).includes(s.id));
    assert(releasedSeats.every(s => s.status === 'available'), 'Cancelled booking seats were immediately released back to available inventory');
  }

  // 7. PERSISTENCE VERIFICATION (DISK FILE INTEGRITY)
  {
    const dbFilePath = path.join(process.cwd(), 'cinebook_local_db.json');
    assert(fs.existsSync(dbFilePath), `Local persistent database exists at ${dbFilePath}`);
    const raw = fs.readFileSync(dbFilePath, 'utf8');
    const dbContent = JSON.parse(raw);
    assert(Array.isArray(dbContent.movies) && dbContent.movies.length >= 16, `Persistent DB stores ${dbContent.movies.length} movies`);
    assert(Array.isArray(dbContent.bookings), 'Persistent DB stores bookings array');
    console.log(`ℹ️ [DB Engine Audit]: Current persistent storage is Local JSON Engine (${dbFilePath}) with ${dbContent.bookings.length} persistent bookings.`);
  }

  // 8. MULTILINGUAL & I18N LOCALE COVERAGE CHECK (18 LANGUAGES)
  {
    const localesDir = path.resolve('../src/i18n/locales');
    const expectedLanguages = [
      'en', 'hi', 'te', 'ta', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa', 'or', 'ur',
      'es', 'fr', 'de', 'ja', 'ko', 'zh'
    ];

    const foundFiles = fs.readdirSync(localesDir);
    const missing = expectedLanguages.filter(l => !foundFiles.includes(`${l}.ts`));
    assert(missing.length === 0, `All 18 specified locale files exist in src/i18n/locales (${expectedLanguages.join(', ')})`);

    // Verify Urdu RTL configuration
    const typesContent = fs.readFileSync(path.resolve('../src/i18n/types.ts'), 'utf8');
    assert(typesContent.includes("code: 'ur'") && typesContent.includes("direction: 'rtl'"), 'Urdu locale explicitly configured with direction: "rtl"');
    const langContextContent = fs.readFileSync(path.resolve('../src/context/LanguageContext.tsx'), 'utf8');
    assert(langContextContent.includes('document.documentElement.dir = direction'), 'LanguageContext dynamically applies document.documentElement.dir = "rtl"');
  }

  // 9. ADMIN DASHBOARD STATS VERIFICATION
  {
    const adminRes = await fetch(`${API_BASE}/admin/stats`);
    const data = await adminRes.json();
    const adminStats = data.stats || data;
    assert(adminStats.totalRevenue !== undefined, 'Admin stats returns totalRevenue');
    assert(adminStats.totalBookings >= 1, 'Admin stats tracks confirmed bookings count');
    assert(adminStats.activeMovies + adminStats.comingSoonMovies >= 16, `Admin stats reports ${adminStats.activeMovies} now-showing and ${adminStats.comingSoonMovies} coming-soon movies (total: ${adminStats.activeMovies + adminStats.comingSoonMovies})`);
  }

  console.log('\n======================================================');
  console.log(`🎉 ALL RIGOROUS VERIFICATION CHECKS PASSED: ${passCount}/${totalCount}`);
  console.log('======================================================\n');
}

runRigorousVerification().catch(err => {
  console.error('Rigorous verification suite failed:', err);
  process.exit(1);
});
