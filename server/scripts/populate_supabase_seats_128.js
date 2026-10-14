// server/populate_supabase_seats_128.js
// Safely expands seat inventory in Supabase from 96 to 128 seats per screen
// to match the 16-seats-per-row cinema standard layout used by UI and seatReservationService.

const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function populateSeats() {
  const client = await pool.connect();
  console.log('🔄 Expanding Supabase seat inventory to 128 seats per screen (16 seats/row)...');

  try {
    await client.query('BEGIN;');

    const screensRes = await client.query('SELECT id FROM public.screens;');
    const screens = screensRes.rows.map(r => r.id);
    console.log(`Found ${screens.length} screens in Supabase.`);

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let added = 0;

    for (const screenId of screens) {
      const seatValues = [];
      const seatParams = [];
      let pIdx = 1;

      for (const row of rows) {
        let tier = 'STANDARD';
        let price = 10.0;
        if (row === 'A' || row === 'B') {
          tier = 'VIP';
          price = 18.0;
        } else if (row === 'C' || row === 'D' || row === 'E') {
          tier = 'PREMIUM';
          price = 14.5;
        }

        // Add seats 13 to 16 (or ensure 1 to 16 exist)
        for (let num = 1; num <= 16; num++) {
          const seatId = `${screenId}-${row}${num}`;
          seatValues.push(`($${pIdx}, $${pIdx + 1}, $${pIdx + 2}, $${pIdx + 3}, $${pIdx + 4}, $${pIdx + 5})`);
          seatParams.push(seatId, screenId, row, num, tier, price);
          pIdx += 6;
        }
      }

      const res = await client.query(`
        INSERT INTO public.seats (id, screen_id, row_label, seat_number, tier, base_price)
        VALUES ${seatValues.join(', ')}
        ON CONFLICT (id) DO NOTHING;
      `, seatParams);
      added += res.rowCount;
    }

    const totalSeatsRes = await client.query('SELECT COUNT(*) FROM public.seats;');
    console.log(`Total seats in Supabase: ${totalSeatsRes.rows[0].count} (Expected: 3,072 = 24 screens * 128 seats)`);
    console.log(`New seats added: ${added}`);

    await client.query('COMMIT;');
    console.log('✅ 128-seat inventory committed successfully to Supabase!');
  } catch (err) {
    await client.query('ROLLBACK;').catch(() => {});
    console.error('❌ Failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

populateSeats();
