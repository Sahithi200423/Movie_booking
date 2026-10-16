const dotenv = require('dotenv');
dotenv.config();
const { prisma } = require('../dist/prisma.js');

async function migrate() {
  console.log('Widening ID and foreign key columns to VARCHAR(255) to prevent P2000 length errors...');
  const statements = [
    `ALTER TABLE showtimes ALTER COLUMN id TYPE VARCHAR(255);`,
    `ALTER TABLE showtimes ALTER COLUMN cinema_id TYPE VARCHAR(255);`,
    `ALTER TABLE showtimes ALTER COLUMN screen_id TYPE VARCHAR(255);`,
    `ALTER TABLE showtimes ALTER COLUMN movie_id TYPE VARCHAR(255);`,
    `ALTER TABLE screens ALTER COLUMN id TYPE VARCHAR(255);`,
    `ALTER TABLE screens ALTER COLUMN cinema_id TYPE VARCHAR(255);`,
    `ALTER TABLE seats ALTER COLUMN id TYPE VARCHAR(255);`,
    `ALTER TABLE seats ALTER COLUMN screen_id TYPE VARCHAR(255);`,
    `ALTER TABLE seat_reservations ALTER COLUMN id TYPE VARCHAR(255);`,
    `ALTER TABLE seat_reservations ALTER COLUMN showtime_id TYPE VARCHAR(255);`,
    `ALTER TABLE seat_reservations ALTER COLUMN seat_id TYPE VARCHAR(255);`,
    `ALTER TABLE booking_seats ALTER COLUMN showtime_id TYPE VARCHAR(255);`,
    `ALTER TABLE booking_seats ALTER COLUMN seat_id TYPE VARCHAR(255);`,
    `ALTER TABLE bookings ALTER COLUMN showtime_id TYPE VARCHAR(255);`,
    `ALTER TABLE cinemas ALTER COLUMN id TYPE VARCHAR(255);`
  ];

  for (const sql of statements) {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log(`[OK] ${sql}`);
    } catch (err) {
      console.warn(`[WARN] ${sql}:`, err.message);
    }
  }
  console.log('Migration completed successfully.');
}

migrate().finally(() => prisma.$disconnect());
