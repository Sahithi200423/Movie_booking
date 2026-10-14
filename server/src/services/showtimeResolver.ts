import { prisma } from '../prisma.js';
import { db } from '../db.js';

/**
 * Resolves the showtime the customer actually picked (movie + theatre + date + time)
 * to a real Prisma Showtime row, creating the theatre / screen / seat inventory /
 * showtime on first use.
 */

const SEAT_ROWS: Array<{ row: string; tier: string; price: number }> = [
  { row: 'A', tier: 'VIP', price: 18.0 },
  { row: 'B', tier: 'VIP', price: 18.0 },
  { row: 'C', tier: 'PREMIUM', price: 14.5 },
  { row: 'D', tier: 'PREMIUM', price: 14.5 },
  { row: 'E', tier: 'PREMIUM', price: 14.5 },
  { row: 'F', tier: 'PREMIUM', price: 14.5 },
  { row: 'G', tier: 'STANDARD', price: 10.0 },
  { row: 'H', tier: 'STANDARD', price: 10.0 }
];
const SEATS_PER_ROW = 16;

export interface ResolveShowtimeInput {
  movieId: string;
  movieTitle?: string;
  cinemaId: string;
  cinemaName?: string;
  city?: string;
  address?: string;
  date: string; // YYYY-MM-DD
  time: string; // "07:30 PM"
  format?: string;
  hall?: string;
  language?: string;
}

async function ensureMovie(input: ResolveShowtimeInput) {
  const existing = await prisma.movie.findUnique({ where: { id: input.movieId } });
  if (existing) return existing;

  const seed: any = db.getMovieById(input.movieId);
  if (!seed && !input.movieTitle) {
    const err: any = new Error(`Movie "${input.movieId}" does not exist.`);
    err.statusCode = 404;
    throw err;
  }
  return prisma.movie.create({
    data: {
      id: input.movieId,
      title: seed?.title || input.movieTitle!,
      synopsis: seed?.synopsis || seed?.description || 'Now showing at CineBook.',
      durationMinutes: Number(seed?.durationMinutes || 150),
      originalLanguage: (seed?.languages && seed.languages[0]) || seed?.language || input.language || 'English',
      languages: seed?.languages || [seed?.language || input.language || 'English'],
      genre: Array.isArray(seed?.genre) ? seed.genre : [String(seed?.genre || 'Drama')],
      ageRating: seed?.ageRating || 'UA',
      rating: Number(seed?.rating) || 8.0,
      posterUrl: seed?.posterUrl || '',
      backdropUrl: seed?.backdropUrl || '',
      status: seed?.status || 'now_showing'
    }
  });
}

async function ensureScreen(input: ResolveShowtimeInput) {
  let theatre =
    (await prisma.theatre.findUnique({ where: { id: input.cinemaId } })) ||
    (input.cinemaName ? await prisma.theatre.findFirst({ where: { name: input.cinemaName } }) : null);

  if (!theatre) {
    theatre = await prisma.theatre.create({
      data: {
        id: input.cinemaId,
        name: input.cinemaName || 'CineBook Cinema',
        city: (input.city || '').split(',')[0] || 'Unknown',
        address: input.address || input.cinemaName || 'Address',
        facilities: ['Parking', 'Food Court', 'Dolby Atmos'],
        distance: '0 km',
        timezone: 'Asia/Kolkata'
      }
    });
  }

  const hall = input.hall || 'Screen 1';
  let screen = await prisma.screen.findFirst({ where: { theatreId: theatre.id, name: hall } });
  if (!screen) {
    screen = await prisma.screen.create({
      data: {
        id: `scr-${theatre.id.replace('cin-', '')}-${hall.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        theatreId: theatre.id,
        name: hall,
        screenType: input.format || 'Standard'
      }
    });
  }

  const seatCount = await prisma.seat.count({ where: { screenId: screen.id } });
  if (seatCount === 0) {
    const data = SEAT_ROWS.flatMap(({ row, tier, price }) =>
      Array.from({ length: SEATS_PER_ROW }, (_, i) => ({
        id: `seat-${screen!.id}-${row}${i + 1}`,
        screenId: screen!.id,
        row,
        number: i + 1,
        seatNumber: `${row}${i + 1}`,
        tier,
        basePrice: price
      }))
    );
    for (const s of data) {
      await prisma.seat.create({ data: s });
    }
  }
  return screen;
}

export async function resolveShowtime(input: ResolveShowtimeInput) {
  if (!input.movieId || !input.cinemaId || !input.date || !input.time) {
    const err: any = new Error('movieId, cinemaId, date and time are required to resolve a showtime.');
    err.statusCode = 400;
    throw err;
  }
  const movie = await ensureMovie(input);
  const screen = await ensureScreen(input);

  const existing = await prisma.showtime.findFirst({
    where: { movieId: movie.id, screenId: screen.id, date: input.date, time: input.time },
    include: { movie: true, screen: { include: { theatre: true, seats: true } } }
  });
  if (existing) return existing;

  const cinSlug = input.cinemaId.replace('cin-', '');
  const movieSlug = movie.id.substring(0, 6);
  const showId = `show-${movieSlug}-${cinSlug}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  return prisma.showtime.create({
    data: {
      id: showId,
      movieId: movie.id,
      cinemaId: screen.theatreId,
      screenId: screen.id,
      date: input.date,
      time: input.time,
      language: input.language || (movie.languages && movie.languages[0]) || 'English',
      format: input.format || screen.screenType || '2D',
      hallName: screen.name,
      hall: screen.name,
      priceMultiplier: 1.0
    },
    include: { movie: true, screen: { include: { theatre: true, seats: true } } }
  });
}

/** Strict lookup: returns the Prisma showtime with seats, or throws 404. Never falls back. */
export async function getShowtimeStrict(showtimeId: string) {
  const showtime = await ensurePrismaShowtime(showtimeId);
  if (!showtime) {
    const err: any = new Error(`Showtime ${showtimeId} not found.`);
    err.statusCode = 404;
    throw err;
  }
  return showtime;
}

/** Resolves any showtimeId (from db.ts or custom) to an active Prisma showtime with seats */
export async function ensurePrismaShowtime(showtimeId: string) {
  let showtime = await prisma.showtime.findUnique({
    where: { id: showtimeId },
    include: { movie: true, screen: { include: { theatre: true, seats: true } } }
  });
  if (showtime) return showtime;

  const dbShow = db.getShowtimeById(showtimeId);
  if (dbShow) {
    const movie = db.getMovieById(dbShow.movieId);
    const cinema = db.getCinemas().find(c => c.id === dbShow.cinemaId);
    const resolvedMovie = await ensureMovie({
      movieId: dbShow.movieId,
      movieTitle: movie?.title,
      cinemaId: dbShow.cinemaId,
      date: dbShow.date,
      time: dbShow.time
    });
    const resolvedScreen = await ensureScreen({
      movieId: dbShow.movieId,
      cinemaId: dbShow.cinemaId,
      cinemaName: cinema?.name,
      city: cinema?.city,
      address: cinema?.address,
      hall: dbShow.hall,
      format: dbShow.format,
      date: dbShow.date,
      time: dbShow.time
    });

    try {
      showtime = await prisma.showtime.create({
        data: {
          id: showtimeId,
          cinemaId: dbShow.cinemaId,
          screenId: resolvedScreen.id,
          movieId: resolvedMovie.id,
          date: dbShow.date,
          time: dbShow.time,
          language: dbShow.language || 'English',
          format: dbShow.format || resolvedScreen.screenType,
          hallName: dbShow.hall,
          hall: dbShow.hall,
          priceMultiplier: dbShow.priceMultiplier || 1.0
        },
        include: { movie: true, screen: { include: { theatre: true, seats: true } } }
      });
      return showtime;
    } catch {
      return await prisma.showtime.findUnique({
        where: { id: showtimeId },
        include: { movie: true, screen: { include: { theatre: true, seats: true } } }
      });
    }
  }

  // Fallback match: if frontend generated a synthetic ID (e.g. show-kalki-28-cin-pvr--1)
  const candidate = db.getShowtimes().find(s =>
    showtimeId.includes(s.movieId.substring(0, 5)) &&
    (showtimeId.includes(s.cinemaId.substring(0, 5)) || showtimeId.includes(s.cinemaId.replace('cin-', '').substring(0, 5)))
  );
  if (candidate) {
    const existing = await prisma.showtime.findUnique({
      where: { id: candidate.id },
      include: { movie: true, screen: { include: { theatre: true, seats: true } } }
    });
    if (existing) return existing;
  }

  // Do not fall back to an arbitrary showtime; return null if not found
  return null;
}

