// server/check_users_constraints.js
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  const client = await pool.connect();
  await client.query('SET TRANSACTION READ ONLY;');

  // 1. Foreign keys referencing users or on users table
  const fkRes = await client.query(`
    SELECT
      tc.table_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name,
      tc.constraint_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND (ccu.table_name = 'users' OR tc.table_name = 'users');
  `);
  console.log('--- Foreign Keys involving users ---');
  console.log(JSON.stringify(fkRes.rows, null, 2));

  // 2. Indexes on users and bookings
  const idxRes = await client.query(`
    SELECT tablename, indexname, indexdef
    FROM pg_indexes
    WHERE tablename IN ('users', 'bookings')
    ORDER BY tablename, indexname;
  `);
  console.log('\n--- Indexes on users and bookings ---');
  console.log(JSON.stringify(idxRes.rows, null, 2));

  // 3. Check constraints on users
  const chkRes = await client.query(`
    SELECT conname, pg_get_constraintdef(c.oid) as def
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'users';
  `);
  console.log('\n--- Constraints on users table ---');
  console.log(JSON.stringify(chkRes.rows, null, 2));

  // 4. Default value of users.id
  const defRes = await client.query(`
    SELECT column_name, data_type, column_default, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'id';
  `);
  console.log('\n--- users.id column definition ---');
  console.log(JSON.stringify(defRes.rows, null, 2));

  client.release();
  await pool.end();
}

check().catch(err => {
  console.error('Error checking constraints:', err);
  process.exit(1);
});
