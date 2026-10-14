// server/apply_supabase_schema_additions.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function apply() {
  console.log('🔍 Step 1: Checking local backups...');
  const sqliteBackupPath = path.join(__dirname, 'prisma', 'dev.db.backup');
  const jsonBackupPath = path.join(__dirname, 'cinebook_local_db.json.backup');

  if (!fs.existsSync(sqliteBackupPath) || fs.statSync(sqliteBackupPath).size === 0) {
    throw new Error('SQLite backup dev.db.backup is missing or empty!');
  }
  if (!fs.existsSync(jsonBackupPath) || fs.statSync(jsonBackupPath).size === 0) {
    throw new Error('JSON backup cinebook_local_db.json.backup is missing or empty!');
  }

  console.log(`✅ Backups verified intact:`);
  console.log(`   - dev.db.backup: ${fs.statSync(sqliteBackupPath).size} bytes`);
  console.log(`   - cinebook_local_db.json.backup: ${fs.statSync(jsonBackupPath).size} bytes`);

  console.log('\n🚀 Step 2: Connecting to Supabase and executing DDL within a transaction...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN;');

    const sqlPath = path.join(__dirname, 'supabase_schema_additions.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    await client.query(sql);

    await client.query('COMMIT;');
    console.log('✅ Transaction committed successfully!');
  } catch (err) {
    await client.query('ROLLBACK;').catch(() => {});
    console.error('❌ SQL execution failed. Transaction rolled back with 0 changes.');
    console.error('Error detail:', err.message);
    process.exitCode = 1;
    return;
  } finally {
    client.release();
  }

  console.log('\n📋 Step 3: Verifying all public tables in Supabase...');
  const verifyClient = await pool.connect();
  try {
    const res = await verifyClient.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const tableNames = res.rows.map(r => r.table_name);
    console.log(`Total public tables found: ${tableNames.length}`);
    console.log('Tables:', tableNames.join(', '));

    const expected15 = [
      'movies', 'cinemas', 'screens', 'seats', 'showtimes',
      'users', 'bookings', 'booking_seats', 'booking_addons',
      'movie_genres', 'movie_languages', 'movie_cast',
      'genres', 'languages', 'connection_test'
    ];

    const expectedNew4 = [
      'reviews', 'seat_reservations', 'payments', 'cancellation_audit_logs'
    ];

    const missing15 = expected15.filter(t => !tableNames.includes(t));
    const missingNew4 = expectedNew4.filter(t => !tableNames.includes(t));

    if (missing15.length > 0) {
      console.error('❌ Missing pre-existing tables:', missing15);
    } else {
      console.log('✅ All 15 pre-existing tables are preserved.');
    }

    if (missingNew4.length > 0) {
      console.error('❌ Missing new tables:', missingNew4);
    } else {
      console.log('✅ All 4 new tables (reviews, seat_reservations, payments, cancellation_audit_logs) verified present.');
    }

    // Step 4: Verify Section 7 column changes
    const colRes = await verifyClient.query(`
      SELECT table_name, column_name, data_type, character_maximum_length, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND ((table_name = 'users' AND column_name = 'id') OR (table_name = 'bookings' AND column_name = 'user_id'));
    `);
    console.log('\nColumn definitions for Section 7:');
    colRes.rows.forEach(c => {
      console.log(` - ${c.table_name}.${c.column_name}: ${c.data_type}(${c.character_maximum_length || ''}) default: ${c.column_default}`);
    });

  } finally {
    verifyClient.release();
    await pool.end();
  }
}

apply().catch(err => {
  console.error('Execution error:', err.message);
  process.exit(1);
});
