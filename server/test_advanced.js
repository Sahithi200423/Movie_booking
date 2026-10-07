async function runAdvancedTests() {
  console.log('🧪 Starting CineBook Advanced Backend Suite (Seat Holds, Coupons, Reviews, Ticket Validation, Timezones)...\n');
  let passed = 0;
  let total = 0;

  async function assert(desc, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } catch (e) {
      console.error(`❌ FAIL: ${desc} - ${e.message}`);
    }
  }

  // 1. Cinema IANA timezones
  await assert('Cinemas have IANA Timezone Data', async () => {
    const res = await fetch('http://localhost:5000/api/cinemas');
    const data = await res.json();
    if (!data.cinemas || data.cinemas.length === 0) throw new Error('No cinemas found');
    const nyCinema = data.cinemas.find(c => c.id === 'cin-amc-lincoln');
    if (!nyCinema || nyCinema.timezone !== 'America/New_York') throw new Error(`Expected America/New_York, got ${nyCinema?.timezone}`);
    const mumbaiCinema = data.cinemas.find(c => c.id === 'cin-pvr-phoenix');
    if (!mumbaiCinema || mumbaiCinema.timezone !== 'Asia/Kolkata') throw new Error(`Expected Asia/Kolkata, got ${mumbaiCinema?.timezone}`);
  });

  // 2. Coupon Validation API
  await assert('Coupon Validation (WELCOME50 & Invalid Codes)', async () => {
    // Valid coupon with sufficient subtotal
    const res1 = await fetch('http://localhost:5000/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'WELCOME50', subtotal: 29.0 })
    });
    const data1 = await res1.json();
    if (!data1.success || data1.coupon.calculatedDiscount !== 5.0) throw new Error(`Expected $5 discount, got ${data1.coupon?.calculatedDiscount}`);

    // Ineligible subtotal
    const res2 = await fetch('http://localhost:5000/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'WELCOME50', subtotal: 10.0 })
    });
    if (res2.status !== 400) throw new Error(`Expected 400 for subtotal below minimum, got ${res2.status}`);

    // Invalid code
    const res3 = await fetch('http://localhost:5000/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'FAKEDISCOUNT99', subtotal: 50.0 })
    });
    if (res3.status !== 400) throw new Error(`Expected 400 for fake code, got ${res3.status}`);
  });

  // 3. Seat Hold & Hold Expiration
  const testShowtime = 'show-kalki--pvr--1';
  const testSession = 'sess_user_alpha_' + Date.now();
  let holdSeat1 = '';
  let holdSeat2 = '';

  await assert('Hold Seats (Temporary Reservation)', async () => {
    // Find 2 available seats dynamically
    const initialSeatsRes = await fetch(`http://localhost:5000/api/shows/${testShowtime}/seats`);
    const initialSeatsData = await initialSeatsRes.json();
    const available = initialSeatsData.seats.filter(s => s.status === 'available');
    if (available.length < 2) throw new Error('Not enough available seats to run hold test');
    holdSeat1 = available[0].id;
    holdSeat2 = available[1].id;

    const res = await fetch(`http://localhost:5000/api/shows/${testShowtime}/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seatIds: [holdSeat1, holdSeat2],
        sessionId: testSession,
        durationMinutes: 5
      })
    });
    const data = await res.json();
    if (!data.success || !data.heldSeats.includes(holdSeat1)) throw new Error(`Seat hold failed: ${JSON.stringify(data)}`);
  });

  // 4. Another session seeing held seats
  await assert('Seat Status Shows Held for Competing Session', async () => {
    const res = await fetch(`http://localhost:5000/api/shows/${testShowtime}/seats?sessionId=sess_other_user`);
    const data = await res.json();
    const seatObj = data.seats.find(s => s.id === holdSeat1);
    if (!seatObj || seatObj.status !== 'held') throw new Error(`Expected seat ${holdSeat1} to be 'held', got ${seatObj?.status}`);
  });

  // 5. Competing session cannot hold the same seat
  await assert('Competing Session Rejected from Holding Held Seat', async () => {
    const res = await fetch(`http://localhost:5000/api/shows/${testShowtime}/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seatIds: [holdSeat1],
        sessionId: 'sess_other_user',
        durationMinutes: 5
      })
    });
    if (res.status !== 409) throw new Error(`Expected 409 conflict, got ${res.status}`);
  });

  // 6. Release Hold
  await assert('Release Seat Hold', async () => {
    const res = await fetch(`http://localhost:5000/api/shows/${testShowtime}/release-hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: testSession })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Failed to release hold');

    // Verify seat is available again
    const seatsRes = await fetch(`http://localhost:5000/api/shows/${testShowtime}/seats`);
    const seatsData = await seatsRes.json();
    const seatObj = seatsData.seats.find(s => s.id === holdSeat1);
    if (!seatObj || seatObj.status !== 'available') throw new Error(`Expected seat ${holdSeat1} to be available, got ${seatObj?.status}`);
  });

  // 7. Booking with Coupon Code & Server Discount Application
  let testBookingId = '';
  let testQrToken = '';
  await assert('Create Booking with Verified Coupon Discount', async () => {
    // Pick 2 available seats
    const seatsRes = await fetch(`http://localhost:5000/api/shows/${testShowtime}/seats`);
    const seatsData = await seatsRes.json();
    const availableSeats = seatsData.seats.filter(s => s.status === 'available');
    if (availableSeats.length < 2) throw new Error('Not enough available seats for test');
    const selected = [availableSeats[0], availableSeats[1]];

    const payload = {
      showtimeId: testShowtime,
      movieId: 'kalki-2898',
      movieTitle: 'Kalki: 2898 AD',
      moviePoster: 'https://images.unsplash.com/test.jpg',
      movieDuration: '2h 58m',
      movieAgeRating: 'UA 16+',
      cinemaId: 'cin-pvr-phoenix',
      cinemaName: 'PVR INOX Grand Mall',
      cinemaAddress: 'High Street Phoenix',
      hall: 'Screen 1',
      format: '2D',
      date: '2026-10-02',
      time: '10:30 AM',
      selectedLanguage: 'Telugu',
      customerName: 'Aarav Mehta',
      customerEmail: 'aarav.mehta@example.com',
      customerPhone: '+91 98989 12345',
      seats: selected.map(s => ({ id: s.id, row: s.row, number: s.number, tier: s.tier, price: s.price })),
      couponCode: 'WELCOME50' // $5.00 discount on subtotal >= $15
    };

    const res = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 201 || !data.booking) throw new Error(`Booking failed: ${JSON.stringify(data)}`);
    testBookingId = data.booking.id;
    testQrToken = data.booking.qrToken;
    if (data.booking.discountAmount !== 5.0) throw new Error(`Expected $5 discount, got ${data.booking.discountAmount}`);
    if (!testQrToken || !testQrToken.startsWith('TKT-')) throw new Error(`Expected secure QR token, got ${testQrToken}`);
  });

  // 8. Gatekeeper QR Ticket Validation
  await assert('Gatekeeper QR Ticket Admission Verification', async () => {
    const res = await fetch('http://localhost:5000/api/bookings/verify-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: testQrToken, staffName: 'Gate 3 - Security Officer Ramesh' })
    });
    const data = await res.json();
    if (!data.success || !data.valid) throw new Error(`Expected ticket admission, got: ${JSON.stringify(data)}`);
  });

  // 9. Ticket Replay / Reuse Prevention
  await assert('Prevent Ticket Replay / Duplicate Entry', async () => {
    const res = await fetch('http://localhost:5000/api/bookings/verify-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: testBookingId, staffName: 'Gate 1' })
    });
    const data = await res.json();
    if (data.valid !== false || !data.alreadyCheckedIn) {
      throw new Error(`Expected replay protection with alreadyCheckedIn: true, got: ${JSON.stringify(data)}`);
    }
  });

  // 10. Reviews & Ratings API
  await assert('Submit Movie Review & Update Average Rating', async () => {
    const res = await fetch('http://localhost:5000/api/movies/kalki-2898/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: 'Vikram Joshi',
        rating: 9.0,
        comment: 'Mindblowing sci-fi climax! The visual scale is unmatched in Indian cinema.'
      })
    });
    const data = await res.json();
    if (res.status !== 201 || !data.review) throw new Error(`Review submission failed: ${JSON.stringify(data)}`);

    // Verify review is in list
    const getRes = await fetch('http://localhost:5000/api/movies/kalki-2898/reviews');
    const getData = await getRes.json();
    const found = getData.reviews.find(r => r.id === data.review.id);
    if (!found) throw new Error('Expected review in movie reviews list');
  });

  // 11. Favorites / Watchlist API
  await assert('Toggle User Watchlist Favorites', async () => {
    const res1 = await fetch('http://localhost:5000/api/movies/user/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'test_user@example.com', movieId: 'kalki-2898' })
    });
    const data1 = await res1.json();
    if (!data1.isFavorite || !data1.favorites.includes('kalki-2898')) throw new Error('Failed to add to favorites');

    // Untoggle
    const res2 = await fetch('http://localhost:5000/api/movies/user/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'test_user@example.com', movieId: 'kalki-2898' })
    });
    const data2 = await res2.json();
    if (data2.isFavorite !== false || data2.favorites.includes('kalki-2898')) throw new Error('Failed to remove from favorites');
  });

  console.log(`\n======================================================`);
  console.log(`🎉 ADVANCED TEST RESULTS: ${passed}/${total} SUCCEEDED`);
  console.log(`======================================================\n`);
}

runAdvancedTests();
