import crypto from 'crypto';

const API_BASE = 'http://localhost:5000/api';

async function runArchitectureTests() {
  console.log('🧪 Starting Production Architecture Verification Suite...\n');
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

  // 1. Health check
  await assert('API Server Health Check', async () => {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    if (res.status !== 200 || data.status !== 'healthy') {
      throw new Error(`Health check failed: ${JSON.stringify(data)}`);
    }
  });

  // 2. Concurrency Seat Locking (/api/seats/lock)
  const testSession1 = 'session-user-alpha-' + Date.now();
  const testSession2 = 'session-user-beta-' + Date.now();
  let sampleShowtimeId = 'show-1';

  // Get a valid showtime from API or seed
  const showRes = await fetch(`${API_BASE}/shows`);
  const showData = await showRes.json();
  if (showData.showtimes && showData.showtimes.length > 0) {
    sampleShowtimeId = showData.showtimes[0].id;
  }

  // Dynamic test seats to avoid conflicting with prior runs
  const liveRes = await fetch(`${API_BASE}/seats/live?showtimeId=${sampleShowtimeId}`);
  const liveData = await liveRes.json();
  const availableSeats = (liveData.seats || []).filter(s => s.status === 'available');
  const testSeat1 = availableSeats[0]?.id || `E${Math.floor(1 + Math.random() * 6)}`;
  const testSeat2 = availableSeats[1]?.id || `E${Math.floor(7 + Math.random() * 6)}`;

  await assert('Acquire 10-Minute Lock on Seats (/api/seats/lock)', async () => {
    const res = await fetch(`${API_BASE}/seats/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showtimeId: sampleShowtimeId,
        seatNumbers: [testSeat1, testSeat2],
        sessionId: testSession1,
        durationMinutes: 10
      })
    });

    const data = await res.json();
    if (res.status !== 200 || !data.success) {
      throw new Error(`Seat lock failed: ${JSON.stringify(data)}`);
    }
    if (!data.lockedSeats.includes(testSeat1) || !data.lockedSeats.includes(testSeat2)) {
      throw new Error(`Seats ${testSeat1}, ${testSeat2} not returned in lockedSeats`);
    }
  });

  // 3. Concurrency Conflict Prevention
  await assert('Reject Concurrent Lock Attempt on Same Seats (HTTP 409 Conflict)', async () => {
    const res = await fetch(`${API_BASE}/seats/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showtimeId: sampleShowtimeId,
        seatNumbers: [testSeat2], // testSeat2 already locked by session 1
        sessionId: testSession2,
        durationMinutes: 10
      })
    });

    const data = await res.json();
    if (res.status !== 409) {
      throw new Error(`Expected 409 conflict, got ${res.status}: ${JSON.stringify(data)}`);
    }
    if (!data.message.toLowerCase().includes('locked')) {
      throw new Error(`Expected lock conflict message, got: ${data.message}`);
    }
  });

  // 4. Seat Unlock (/api/seats/unlock)
  await assert('Release Seat Lock (/api/seats/unlock)', async () => {
    const res = await fetch(`${API_BASE}/seats/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showtimeId: sampleShowtimeId,
        seatNumbers: [testSeat1, testSeat2],
        sessionId: testSession1
      })
    });

    const data = await res.json();
    if (res.status !== 200 || !data.success) {
      throw new Error(`Unlock failed: ${JSON.stringify(data)}`);
    }

    // Now Session 2 should be able to lock testSeat2
    const res2 = await fetch(`${API_BASE}/seats/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showtimeId: sampleShowtimeId,
        seatNumbers: [testSeat2],
        sessionId: testSession2,
        durationMinutes: 10
      })
    });
    const data2 = await res2.json();
    if (res2.status !== 200 || !data2.success) {
      throw new Error(`Expected ${testSeat2} to be acquirable after unlock, got: ${JSON.stringify(data2)}`);
    }
  });

  // 5. Payment Gateway Create Order (/api/payment/create-order)
  let orderData = null;
  await assert('Create Payment Order with Razorpay Sandbox (/api/payment/create-order)', async () => {
    const res = await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showtimeId: sampleShowtimeId,
        seatIds: [testSeat2],
        customerName: 'Aarav Patel',
        customerEmail: 'aarav.patel@example.com',
        customerPhone: '+91 98200 12345',
        donationAmount: 2.0,
        provider: 'RAZORPAY',
        sessionId: testSession2
      })
    });

    orderData = await res.json();
    if (res.status !== 200 || !orderData.success) {
      throw new Error(`Order creation failed: ${JSON.stringify(orderData)}`);
    }
    if (!orderData.orderId || !orderData.bookingId || !orderData.bookingRef) {
      throw new Error(`Missing order or booking identifiers: ${JSON.stringify(orderData)}`);
    }
  });

  // 6. Payment Verification with HMAC Signature (/api/payment/verify)
  let verifiedBooking = null;
  await assert('Verify Payment with HMAC SHA256 Signature (/api/payment/verify)', async () => {
    // Generate valid HMAC signature
    const secret = 'cinebook_razorpay_mock_secret';
    const paymentId = orderData.mockPaymentId || 'pay_test_patel_123';
    const signature = crypto.createHmac('sha256', secret).update(`${orderData.orderId}|${paymentId}`).digest('hex');

    const res = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: orderData.orderId,
        paymentId,
        signature,
        bookingId: orderData.bookingId
      })
    });

    const data = await res.json();
    if (res.status !== 200 || !data.success) {
      throw new Error(`Payment verification failed: ${JSON.stringify(data)}`);
    }
    if (data.booking.status !== 'CONFIRMED') {
      throw new Error(`Expected booking status CONFIRMED, got ${data.booking.status}`);
    }
    verifiedBooking = data.booking;
  });

  // 7. Load Real Saved Booking from Database (/api/bookings/:id)
  await assert('Load Real Saved Booking from SQLite via Prisma (/api/bookings/:id)', async () => {
    const res = await fetch(`${API_BASE}/bookings/${orderData.bookingId}`);
    const data = await res.json();
    if (res.status !== 200 || !data.success || !data.booking) {
      throw new Error(`Failed to load booking: ${JSON.stringify(data)}`);
    }
    const b = data.booking;
    if (b.customer.email !== 'aarav.patel@example.com') {
      throw new Error(`Customer email mismatch: ${b.customer.email}`);
    }
    if (!b.qrToken || !b.qrCodeData) {
      throw new Error('Missing M-Ticket QR payload in saved booking');
    }
  });

  // 8. Webhook Verification with HMAC Signature (/api/payment/verify-webhook)
  await assert('Process Gateway Webhook with Signature Verification (/api/payment/verify-webhook)', async () => {
    const webhookPayload = {
      event: 'payment.captured',
      payload: {
        payment: { entity: { id: 'pay_rzp_webhook_evt_01', order_id: orderData.orderId } }
      }
    };
    const bodyStr = JSON.stringify(webhookPayload);
    const signature = crypto.createHmac('sha256', 'whsec_cinebook_mock_signature').update(bodyStr).digest('hex');

    const res = await fetch(`${API_BASE}/payment/verify-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': signature
      },
      body: bodyStr
    });

    const data = await res.json();
    if (res.status !== 200 || !data.success) {
      throw new Error(`Webhook handling failed: ${JSON.stringify(data)}`);
    }
  });

  // 9. M-Ticket Validation via Scanner Endpoint (/api/tickets/verify)
  await assert('Validate M-Ticket QR Code and Mark CHECKED_IN (/api/tickets/verify)', async () => {
    const res = await fetch(`${API_BASE}/tickets/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingRef: orderData.bookingRef,
        scannedBy: 'Gate Scanner Device #1'
      })
    });

    const data = await res.json();
    if (res.status !== 200 || !data.success || !data.valid) {
      throw new Error(`Ticket verification failed: ${JSON.stringify(data)}`);
    }
    if (data.booking.status !== 'CHECKED_IN') {
      throw new Error(`Expected status CHECKED_IN, got ${data.booking.status}`);
    }
  });

  // 10. Replay Prevention: Verify already checked in ticket
  await assert('Replay Prevention: Reject Already Used Ticket', async () => {
    const res = await fetch(`${API_BASE}/tickets/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingRef: orderData.bookingRef,
        scannedBy: 'Gate Scanner Device #1'
      })
    });

    const data = await res.json();
    if (!data.alreadyCheckedIn) {
      throw new Error('Expected alreadyCheckedIn to be true for second scan attempt');
    }
    if (data.valid === true) {
      throw new Error('Expected valid to be false on duplicate scan');
    }
  });

  console.log('\n========================================');
  console.log(`🎉 TEST RESULTS: ${passed}/${total} ARCHITECTURE TESTS SUCCEEDED`);
  console.log('========================================\n');
}

runArchitectureTests().catch(console.error);
