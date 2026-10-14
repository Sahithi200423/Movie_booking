// server/verify_supabase_migration.js
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verify() {
  const client = await pool.connect();

  console.log('=== Supabase Table Row Counts ===');
  const tables = [
    'movies', 'cinemas', 'screens', 'seats', 'genres', 'languages',
    'movie_genres', 'movie_languages', 'movie_cast', 'reviews',
    'showtimes', 'users', 'bookings', 'booking_seats', 'booking_addons',
    'payments', 'cancellation_audit_logs', 'seat_reservations', 'connection_test'
  ];

  const counts = {};
  for (const t of tables) {
    const res = await client.query(`SELECT COUNT(*) as count FROM public."${t}";`);
    counts[t] = Number(res.rows[0].count);
  }
  console.log(JSON.stringify(counts, null, 2));

  console.log('\n=== Foreign Key Integrity ===');
  // Check orphan bookings
  const orphanBookings = await client.query(`
    SELECT b.id, b.user_id, b.showtime_id FROM public.bookings b
    LEFT JOIN public.showtimes s ON b.showtime_id = s.id
    WHERE s.id IS NULL;
  `);
  console.log('Orphan bookings (invalid showtime):', orphanBookings.rows.length);

  // Check orphan booking seats
  const orphanSeats = await client.query(`
    SELECT bs.id FROM public.booking_seats bs
    LEFT JOIN public.bookings b ON bs.booking_id = b.id
    WHERE b.id IS NULL;
  `);
  console.log('Orphan booking seats (invalid booking):', orphanSeats.rows.length);

  // Check orphan reviews
  const orphanReviews = await client.query(`
    SELECT r.id FROM public.reviews r
    LEFT JOIN public.movies m ON r.movie_id = m.id
    WHERE m.id IS NULL;
  `);
  console.log('Orphan reviews (invalid movie):', orphanReviews.rows.length);

  // Check orphan showtimes
  const orphanShows = await client.query(`
    SELECT s.id FROM public.showtimes s
    LEFT JOIN public.movies m ON s.movie_id = m.id
    WHERE m.id IS NULL;
  `);
  console.log('Orphan showtimes (invalid movie):', orphanShows.rows.length);

  console.log('\n=== Users & Password Hashes ===');
  const userRes = await client.query(`SELECT id, email, role, password_hash FROM public.users ORDER BY email;`);
  console.log(`Total users found: ${userRes.rows.length}`);
  userRes.rows.forEach(u => {
    const hashValid = u.password_hash && u.password_hash.startsWith('$2');
    console.log(` - ${u.email} (${u.role}): hash valid = ${hashValid ? 'YES' : 'NO'}`);
  });

  console.log('\n=== Bookings & Payments ===');
  const bookingRes = await client.query(`
    SELECT b.id, b.customer_name, b.customer_email, b.total_amount, b.status, b.refund_status
    FROM public.bookings b;
  `);
  console.log('Bookings:', JSON.stringify(bookingRes.rows, null, 2));

  const paymentRes = await client.query(`
    SELECT p.id, p.booking_id, p.provider, p.order_id, p.amount, p.status
    FROM public.payments p;
  `);
  console.log('Payments:', JSON.stringify(paymentRes.rows, null, 2));

  console.log('\n=== Reviews ===');
  const reviewRes = await client.query(`
    SELECT r.id, r.movie_id, r.user_name, r.rating, r.comment
    FROM public.reviews r;
  `);
  console.log('Reviews:', JSON.stringify(reviewRes.rows, null, 2));

  console.log('\n=== Cancellation Audit Logs ===');
  const auditRes = await client.query(`
    SELECT a.id, a.booking_id, a.action, a.actor_email, a.refund_amount, a.refund_status
    FROM public.cancellation_audit_logs a;
  `);
  console.log('Audit Logs:', JSON.stringify(auditRes.rows, null, 2));

  client.release();
  await pool.end();
}

verify().catch(console.error);
