import crypto from 'crypto';

const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

function computeSignature(orderId, paymentId, secret = 'sampleSecretKey') {
  return crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
}

async function runTests() {
  console.log('🧪 Starting Razorpay Sandbox & Persistent Seat-Locking Engine Test Suite...\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      process.exitCode = 1;
    }
  }

  try {
    // 1. Health check
    const health = await request('/health');
    assert(health.ok && (health.data.status === 'ok' || health.data.status === 'healthy'), 'API Health Check returns 200 OK');

    // Fetch live seats to pick available ones
    const liveRes = await request('/seats/live?showtimeId=show-1');
    const availableSeats = (liveRes.data?.seats || []).filter(s => s.status === 'available');
    
    // Pick two available seats for testing
    const seat1 = availableSeats[0]?.id || 'C1';
    const seat2 = availableSeats[1]?.id || 'C2';
    const testSeats = [seat1, seat2];

    // 2. Lock Seats with 10-Minute Hold
    const testSessionId = `test_session_${Date.now()}`;
    const lockRes = await request('/seats/lock', {
      method: 'POST',
      body: JSON.stringify({
        showtimeId: 'show-1',
        selectedSeats: testSeats,
        sessionId: testSessionId,
        durationMinutes: 10
      })
    });
    assert(
      lockRes.ok && lockRes.data.success && lockRes.data.expiresAt > Date.now(),
      `POST /api/seats/lock atomically holds seats ${seat1}, ${seat2} for 10 minutes with heldExpiresAt`
    );

    // 3. Concurrency check: Reject another user attempting to lock the same held seats
    const competingSessionId = `competing_user_${Date.now()}`;
    const conflictRes = await request('/seats/lock', {
      method: 'POST',
      body: JSON.stringify({
        showtimeId: 'show-1',
        selectedSeats: [seat1],
        sessionId: competingSessionId,
        durationMinutes: 10
      })
    });
    assert(
      conflictRes.status === 409 && conflictRes.data.success === false,
      'Concurrent lock attempt on held seat is rejected with HTTP 409 Conflict'
    );

    // 4. Release Held Seats via /api/seats/release
    const releaseRes = await request('/seats/release', {
      method: 'POST',
      body: JSON.stringify({
        showtimeId: 'show-1',
        selectedSeats: testSeats,
        sessionId: testSessionId
      })
    });
    assert(
      releaseRes.ok && releaseRes.data.success,
      'POST /api/seats/release frees up held seats when user cancels'
    );

    // 5. Verify the released seat can now be locked by another user
    const reLockRes = await request('/seats/lock', {
      method: 'POST',
      body: JSON.stringify({
        showtimeId: 'show-1',
        selectedSeats: testSeats,
        sessionId: competingSessionId,
        durationMinutes: 10
      })
    });
    assert(
      reLockRes.ok && reLockRes.data.success,
      'Released seats can now be locked by competing session without conflict'
    );

    // 6. Create Razorpay Payment Order
    const orderRes = await request('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({
        showtimeId: 'show-1',
        selectedSeats: testSeats,
        amount: 540,
        customerName: 'Rahul Sharma',
        customerEmail: 'rahul.sharma@example.com',
        customerPhone: '+91 98765 43210',
        sessionId: competingSessionId
      })
    });
    assert(
      orderRes.ok &&
        orderRes.data.success &&
        Boolean(orderRes.data.order_id || orderRes.data.orderId) &&
        orderRes.data.currency === 'INR',
      'POST /api/payment/create-order returns order_id, amount, and currency'
    );

    const orderId = orderRes.data.order_id || orderRes.data.orderId;
    const bookingId = orderRes.data.bookingId;

    // 7. Verify Payment with INVALID signature -> Must release seats back to AVAILABLE
    const badPaymentId = `pay_bad_${Date.now()}`;
    const badSig = 'invalid_tampered_signature_hex';
    const badVerifyRes = await request('/payment/verify', {
      method: 'POST',
      body: JSON.stringify({
        orderId,
        razorpay_order_id: orderId,
        paymentId: badPaymentId,
        razorpay_payment_id: badPaymentId,
        signature: badSig,
        razorpay_signature: badSig,
        bookingId
      })
    });
    assert(
      badVerifyRes.status === 400 &&
        badVerifyRes.data.success === false &&
        badVerifyRes.data.message.includes('released'),
      'POST /api/payment/verify rejects invalid HMAC signature and releases seats back to AVAILABLE'
    );

    // 8. Re-lock seats and create a fresh order for SUCCESS verification
    const checkoutSession = `pay_session_${Date.now()}`;
    const rehold = await request('/seats/lock', {
      method: 'POST',
      body: JSON.stringify({
        showtimeId: 'show-1',
        selectedSeats: testSeats,
        sessionId: checkoutSession,
        durationMinutes: 10
      })
    });
    assert(rehold.ok && rehold.data.success, `Re-locked seats ${seat1}, ${seat2} for successful payment verification`);

    const freshOrder = await request('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({
        showtimeId: 'show-1',
        selectedSeats: testSeats,
        amount: 540,
        customerName: 'Rahul Sharma',
        customerEmail: 'rahul.sharma@example.com',
        sessionId: checkoutSession
      })
    });
    assert(freshOrder.ok && freshOrder.data.success, 'Created fresh order for HMAC verification');

    const freshOrderId = freshOrder.data.order_id || freshOrder.data.orderId;
    const freshBookingId = freshOrder.data.bookingId;
    const validPaymentId = `pay_rzp_${Date.now()}`;
    const validSignature = computeSignature(freshOrderId, validPaymentId, 'sampleSecretKey');

    // 9. Verify Payment with VALID HMAC-SHA256 signature
    const verifyRes = await request('/payment/verify', {
      method: 'POST',
      body: JSON.stringify({
        orderId: freshOrderId,
        razorpay_order_id: freshOrderId,
        paymentId: validPaymentId,
        razorpay_payment_id: validPaymentId,
        signature: validSignature,
        razorpay_signature: validSignature,
        bookingId: freshBookingId
      })
    });
    assert(
      verifyRes.ok &&
        verifyRes.data.success &&
        verifyRes.data.booking.status === 'CONFIRMED',
      'POST /api/payment/verify validates HMAC-SHA256 signature and confirms booking with status CONFIRMED'
    );

    // 10. Check that seats are now BOOKED in DB and cannot be locked
    const postBookLock = await request('/seats/lock', {
      method: 'POST',
      body: JSON.stringify({
        showtimeId: 'show-1',
        selectedSeats: [seat1],
        sessionId: `someone_else_${Date.now()}`
      })
    });
    assert(
      postBookLock.status === 409 &&
        postBookLock.data.message.includes('already been reserved'),
      'Confirmed seats are permanently marked BOOKED in database and reject future lock attempts'
    );

    console.log(`\n========================================`);
    console.log(`🎉 TEST RESULTS: ${passed}/${total} TESTS SUCCEEDED`);
    console.log(`========================================\n`);
  } catch (e) {
    console.error('Test execution error:', e);
    process.exitCode = 1;
  }
}

runTests();
