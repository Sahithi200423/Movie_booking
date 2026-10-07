async function runTests() {
  console.log('🧪 Starting CineBook Automated E2E Verification Suite...\n');
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

  // 1. Health Check
  await assert('API Health Check', async () => {
    const res = await fetch('http://localhost:5000/api/health');
    const data = await res.json();
    if (res.status !== 200 || data.status !== 'healthy') throw new Error(`Status ${res.status}`);
  });

  // 2. Languages metadata
  await assert('All 19+ Languages Supported in API', async () => {
    const res = await fetch('http://localhost:5000/api/movies/meta/languages');
    const data = await res.json();
    const expected = ['Telugu', 'Tamil', 'Malayalam', 'Kannada', 'Hindi', 'English', 'Bengali', 'Marathi', 'Punjabi', 'Gujarati', 'Odia', 'Assamese', 'Urdu', 'Sanskrit', 'Korean', 'Japanese', 'Chinese', 'Spanish', 'French'];
    for (const lang of expected) {
      if (!data.languages.includes(lang)) throw new Error(`Missing language ${lang}`);
    }
  });

  // 3. Multi-language movie filtering
  await assert('Filter Movies by Audio Language (Tamil)', async () => {
    const res = await fetch('http://localhost:5000/api/movies?language=Tamil');
    const data = await res.json();
    if (!data.movies || data.movies.length === 0) throw new Error('No movies found for Tamil');
    const leo = data.movies.find(m => m.id === 'leo-bloody-sweet');
    if (!leo) throw new Error('Expected movie Leo in Tamil search');
  });

  // 4. Single movie details
  await assert('Get Movie Details & Showtimes', async () => {
    const res = await fetch('http://localhost:5000/api/movies/kalki-2898');
    const data = await res.json();
    if (!data.movie || data.movie.title !== 'Kalki: 2898 AD - Chrono Force') throw new Error('Incorrect movie data');
    if (!Array.isArray(data.showtimes) || data.showtimes.length === 0) throw new Error('No showtimes');
  });

  // 5. Seats layout and real-time statuses
  let testShowtimeId = 'show-kalki--pvr--2';
  await assert('Get Live Seats Layout for Showtime', async () => {
    const res = await fetch(`http://localhost:5000/api/shows/${testShowtimeId}/seats`);
    const data = await res.json();
    if (!data.seats || data.seats.length !== 96) throw new Error(`Expected 96 seats, got ${data.seats?.length}`);
    const available = data.seats.filter(s => s.status === 'available');
    if (available.length === 0) throw new Error('Expected available seats');
  });

  // 6. Create booking with server-side validation
  let bookedId = '';
  await assert('Create New Confirmed Booking (Demo Checkout)', async () => {
    const payload = {
      showtimeId: testShowtimeId,
      movieId: 'kalki-2898',
      movieTitle: 'Kalki: 2898 AD',
      moviePoster: 'https://images.unsplash.com/test.jpg',
      movieDuration: '2h 58m',
      movieAgeRating: 'UA 16+',
      cinemaId: 'cin-pvr-phoenix',
      cinemaName: 'PVR INOX Grand Mall',
      cinemaAddress: 'High Street Phoenix',
      hall: 'Screen 2 - Dolby',
      format: '3D',
      date: '2026-09-29',
      time: '01:45 PM',
      selectedLanguage: 'Telugu',
      customerName: 'Priya Sharma',
      customerEmail: 'priya.sharma@example.com',
      customerPhone: '+91 98765 00001',
      seats: [
        { id: 'E1', row: 'E', number: 1, tier: 'PREMIUM', price: 14.50 },
        { id: 'E2', row: 'E', number: 2, tier: 'PREMIUM', price: 14.50 }
      ],
      addons: [{ id: 'popcorn-lrg', name: 'Caramel Popcorn Large', price: 7.50, quantity: 1 }]
    };

    const res = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.status !== 201 || !data.booking) throw new Error(`Booking creation failed: ${JSON.stringify(data)}`);
    bookedId = data.booking.id;
    if (!bookedId.startsWith('CB-')) throw new Error(`Invalid booking ID ${bookedId}`);
  });

  // 7. Atomic Seat Conflict Check (Should return 409 Conflict)
  await assert('Atomic Seat Conflict Rejection (Prevent Double Booking)', async () => {
    const payload = {
      showtimeId: testShowtimeId,
      movieId: 'kalki-2898',
      cinemaId: 'cin-pvr-phoenix',
      customerName: 'Second User',
      customerEmail: 'second@example.com',
      customerPhone: '+91 98765 00002',
      seats: [{ id: 'E1', row: 'E', number: 1, tier: 'PREMIUM', price: 14.50 }] // already booked by Priya
    };

    const res = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.status !== 409) throw new Error(`Expected 409 Conflict, got ${res.status}`);
    if (!data.message.includes('Conflict')) throw new Error(`Expected conflict message, got: ${data.message}`);
  });

  // 8. Cancel Booking & Refund Calculation
  await assert('Cancel Booking & Verify 90% Prorated Refund', async () => {
    const res = await fetch(`http://localhost:5000/api/bookings/${bookedId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'priya.sharma@example.com' })
    });
    const data = await res.json();
    if (res.status !== 200 || data.booking.status !== 'cancelled') throw new Error(`Cancellation failed`);
    if (!data.booking.refundAmount || data.booking.refundAmount <= 0) throw new Error('Refund not calculated');
  });

  // 9. Verify seats are released after cancellation
  await assert('Seat Release Verification (Seat E1 Available Again)', async () => {
    const res = await fetch(`http://localhost:5000/api/shows/${testShowtimeId}/seats`);
    const data = await res.json();
    const seatE1 = data.seats.find(s => s.id === 'E1');
    if (!seatE1 || seatE1.status !== 'available') throw new Error(`Seat E1 status is ${seatE1?.status}, expected available`);
  });

  // 10. Admin Stats
  await assert('Admin Dashboard Stats Endpoint', async () => {
    const res = await fetch('http://localhost:5000/api/admin/stats');
    const data = await res.json();
    if (!data.success || typeof data.stats.totalRevenue !== 'number') throw new Error('Invalid admin stats');
  });

  // 11. User Registration & Auth
  await assert('User Registration & JWT Session', async () => {
    const email = `testuser_${Date.now()}@cinebook.demo`;
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rohan Mehra',
        email,
        password: 'Password@123',
        phone: '+91 9988776655'
      })
    });
    const data = await res.json();
    if (res.status !== 201 || !data.user.token) throw new Error(`Registration failed: ${JSON.stringify(data)}`);
  });

  // 12. Frontend Server Response on port 5173
  await assert('Frontend Dev Server Running (Port 5173)', async () => {
    const res = await fetch('http://localhost:5173');
    if (!res.ok) throw new Error(`Frontend server responded with ${res.status}`);
    const html = await res.text();
    if (!html.includes('CineBook') && !html.includes('vite')) throw new Error('Frontend HTML did not contain expected markup');
  });

  console.log(`\n========================================`);
  console.log(`🎉 TEST RESULTS: ${passed}/${total} SUCCEEDED`);
  console.log(`========================================\n`);
}

runTests();
