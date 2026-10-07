// DB inspection helper for QA audit. Run from server/: npx tsx ../<path>/db_inspect.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const counts = {
    users: await prisma.user.count(),
    movies: await prisma.movie.count(),
    theatres: await prisma.theatre.count(),
    screens: await prisma.screen.count(),
    seats: await prisma.seat.count(),
    showtimes: await prisma.showtime.count(),
    bookings: await prisma.booking.count(),
    bookingsWithUser: await prisma.booking.count({ where: { userId: { not: null } } }),
    payments: await prisma.payment.count(),
    reservations: await prisma.seatReservation.count()
  };
  console.log('COUNTS', JSON.stringify(counts));
  const shows = await prisma.showtime.findMany({ take: 5, include: { movie: true, screen: { include: { theatre: true } } } });
  console.log('SAMPLE_SHOWTIMES', JSON.stringify(shows.map(s => ({ id: s.id, movie: s.movie.title, theatre: s.screen.theatre.name, screenId: s.screenId, theatreId: s.screen.theatreId }))));
  const theatres = await prisma.theatre.findMany({ take: 5 });
  console.log('SAMPLE_THEATRES', JSON.stringify(theatres.map(t => ({ id: t.id, name: t.name }))));
  const movies = await prisma.movie.findMany({ take: 5 });
  console.log('SAMPLE_MOVIES', JSON.stringify(movies.map(m => ({ id: m.id, title: m.title }))));
  // Detect double-booked seats: >1 non-cancelled booking claiming same seat on same showtime
  const bookings = await prisma.booking.findMany({ where: { status: { in: ['CONFIRMED', 'CHECKED_IN'] } } });
  const claim = new Map<string, string[]>();
  for (const b of bookings) {
    for (const s of b.seatIds.split(',').map(x => x.trim())) {
      const k = `${b.showtimeId}|${s}`;
      claim.set(k, [...(claim.get(k) || []), b.bookingRef]);
    }
  }
  const dupes = [...claim.entries()].filter(([, v]) => v.length > 1);
  console.log('DOUBLE_BOOKED_SEATS', dupes.length, JSON.stringify(dupes.slice(0, 10)));
}
main().finally(() => prisma.$disconnect());
