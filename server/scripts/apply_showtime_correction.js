// server/apply_showtime_correction.js
// Safe, atomic showtime ID correction for Supabase PostgreSQL.

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runCorrection() {
  console.log('🚀 Step 1: Backing up current Supabase showtimes & booking relationships...');
  const client = await pool.connect();

  try {
    // 1. Export current showtimes & bookings as pre-correction backup
    const curShowtimes = await client.query('SELECT * FROM public.showtimes ORDER BY id;');
    const curBookings = await client.query('SELECT * FROM public.bookings ORDER BY id;');

    const backupData = {
      timestamp: new Date().toISOString(),
      totalShowtimes: curShowtimes.rows.length,
      showtimes: curShowtimes.rows,
      totalBookings: curBookings.rows.length,
      bookings: curBookings.rows
    };

    const backupPath = path.join(__dirname, 'supabase_showtimes_pre_correction.json');
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');
    console.log(`✅ Backed up ${curShowtimes.rows.length} showtimes and ${curBookings.rows.length} bookings to:`);
    console.log(`   ${backupPath} (${fs.statSync(backupPath).size} bytes)`);

    // 2. Pre-Verification of existing bookings
    console.log('\n🔍 Step 2: Verifying existing bookings before changes...');
    const bookingPreCheck = await client.query(`
      SELECT b.id, b.customer_name, b.showtime_id, s.movie_id, s.date, s.time
      FROM public.bookings b
      JOIN public.showtimes s ON b.showtime_id = s.id;
    `);
    console.log('Pre-check Bookings:', JSON.stringify(bookingPreCheck.rows, null, 2));
    if (bookingPreCheck.rows.length !== 2) {
      throw new Error(`Expected 2 active bookings, found ${bookingPreCheck.rows.length}`);
    }

    // 3. Begin Transaction
    console.log('\n🔒 Step 3: Executing showtime correction in a PostgreSQL transaction...');
    await client.query('BEGIN;');

    // Update existing show-*-pvr--* to assign to cin-pvr-phoenix (Mumbai)
    const updateResult = await client.query(`
      UPDATE public.showtimes
      SET cinema_id = 'cin-pvr-phoenix',
          screen_id = CASE
            WHEN hall_name LIKE '%Laser%' THEN 'scr-pvr-phoenix-1'
            WHEN hall_name LIKE '%Dolby%' THEN 'scr-pvr-phoenix-2'
            WHEN hall_name LIKE '%IMAX%' THEN 'scr-pvr-phoenix-3'
            ELSE 'scr-pvr-phoenix-4'
          END
      WHERE id LIKE 'show-%-pvr--%';
    `);
    console.log(`✅ Reassigned ${updateResult.rowCount} showtimes (show-*-pvr--*) to cin-pvr-phoenix (Mumbai).`);
    if (updateResult.rowCount !== 50) {
      throw new Error(`Expected exactly 50 Phoenix showtimes to be updated, but got ${updateResult.rowCount}`);
    }

    // Load source Orion showtimes
    const jsonPath = path.join(__dirname, 'cinebook_local_db.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const orionShowtimes = jsonData.showtimes.filter(s => s.cinemaId === 'cin-pvr-orion');

    let orionInserted = 0;
    for (const s of orionShowtimes) {
      const newId = s.id.replace('-pvr--', '-orion--');
      const screenId = s.hall.includes('Laser') ? 'scr-pvr-orion-1' :
                       s.hall.includes('Dolby') ? 'scr-pvr-orion-2' :
                       s.hall.includes('IMAX') ? 'scr-pvr-orion-3' : 'scr-pvr-orion-4';

      await client.query(`
        INSERT INTO public.showtimes (
          id, cinema_id, screen_id, movie_id, date, time, format, hall_name, language, price_multiplier, hall
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          cinema_id = EXCLUDED.cinema_id,
          screen_id = EXCLUDED.screen_id;
      `, [
        newId,
        'cin-pvr-orion',
        screenId,
        s.movieId,
        s.date,
        s.time,
        s.format,
        s.hall || 'Standard Screen',
        s.language || 'English',
        s.priceMultiplier || 1.0,
        s.hall || 'Standard Screen'
      ]);
      orionInserted++;
    }
    console.log(`✅ Inserted ${orionInserted} distinct showtimes for cin-pvr-orion (Bangalore).`);

    // Verify within transaction before commit
    const txTotalCount = await client.query('SELECT COUNT(*) FROM public.showtimes;');
    if (Number(txTotalCount.rows[0].count) !== 300) {
      throw new Error(`Transaction validation failed: expected 300 showtimes, found ${txTotalCount.rows[0].count}`);
    }

    // Commit transaction
    await client.query('COMMIT;');
    console.log('\n🎉 Step 4: Transaction committed successfully to Supabase!');

    // 4. Post-Commit Deep Verification
    console.log('\n========================================================');
    console.log('🔍 Step 5: Post-Commit Verification Suite');
    console.log('========================================================');

    // A. Total Showtimes
    const finalTotal = await client.query('SELECT COUNT(*) FROM public.showtimes;');
    console.log(`Total Showtimes in Supabase: ${finalTotal.rows[0].count} (Expected: 300)`);

    // B. Showtimes per Cinema
    const perCinema = await client.query(`
      SELECT s.cinema_id, c.name as cinema_name, COUNT(*) as count
      FROM public.showtimes s
      JOIN public.cinemas c ON s.cinema_id = c.id
      GROUP BY s.cinema_id, c.name
      ORDER BY s.cinema_id;
    `);
    console.log('\nShowtimes per Cinema:');
    perCinema.rows.forEach(r => {
      console.log(` - ${r.cinema_name} (${r.cinema_id}): ${r.count} showtimes`);
      if (Number(r.count) !== 50) {
        throw new Error(`Cinema ${r.cinema_id} has ${r.count} showtimes instead of 50!`);
      }
    });

    // C. Check Bookings resolve to Phoenix
    console.log('\nBooking Integrity:');
    const finalBookings = await client.query(`
      SELECT b.id, b.customer_name, b.showtime_id, s.movie_id, s.date, s.time, s.hall_name,
             c.id as cinema_id, c.name as cinema_name
      FROM public.bookings b
      JOIN public.showtimes s ON b.showtime_id = s.id
      JOIN public.cinemas c ON s.cinema_id = c.id;
    `);
    finalBookings.rows.forEach(b => {
      console.log(` - Booking ${b.id} (${b.customer_name}): ${b.cinema_name} [${b.cinema_id}] -> Movie: ${b.movie_id}, Time: ${b.date} ${b.time}, Hall: ${b.hall_name}`);
      if (b.cinema_id !== 'cin-pvr-phoenix') {
        throw new Error(`Booking ${b.id} is associated with ${b.cinema_id} instead of cin-pvr-phoenix!`);
      }
    });

    // D. Check for orphaned bookings
    const orphanBookings = await client.query(`
      SELECT b.id FROM public.bookings b
      LEFT JOIN public.showtimes s ON b.showtime_id = s.id
      WHERE s.id IS NULL;
    `);
    console.log(`\nOrphan Bookings: ${orphanBookings.rows.length}`);
    if (orphanBookings.rows.length > 0) throw new Error('Found orphaned bookings!');

    // E. Check for duplicate showtime IDs
    const dupShowtimes = await client.query(`
      SELECT id, COUNT(*) FROM public.showtimes GROUP BY id HAVING COUNT(*) > 1;
    `);
    console.log(`Duplicate Showtime IDs: ${dupShowtimes.rows.length}`);
    if (dupShowtimes.rows.length > 0) throw new Error('Found duplicate showtime IDs!');

    console.log('\n========================================================');
    console.log('✅ ALL VERIFICATIONS PASSED WITH 100% SUCCESS');
    console.log('========================================================');

  } catch (err) {
    await client.query('ROLLBACK;').catch(() => {});
    console.error('❌ Showtime correction failed. Changes rolled back.', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runCorrection();
