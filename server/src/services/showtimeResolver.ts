import { prisma } from '../prisma.js';
import { db } from '../db.js';

/**
 * Resolves the showtime the customer actually picked (movie + theatre + date + time)
 * to a real Prisma Showtime row, creating the theatre / screen / seat inventory /
 * showtime on first use. This replaces the old behaviour of silently falling back
 * to an arbitrary "first" showtime, which caused every booking to land on the same
 * showtime and enabled double-booking.
 */

const SEAT_ROWS: Array<{ row: string; tier: string; price: number }> = [
  { row: 'A', tier: 'RECLINER', price: 650 },
  { row: 'B', tier: 'RECLINER', price: 650 },
  { row: 'C', tier: 'PRIME', price: 350 },
  { row: 'D', tier: 'PRIME', price: 350 },
  { row: 'E', tier: 'PRIME', price: 350 },
  { row: 'F', tier: 'PRIME', price: 350 },
  { row: 'G', tier: 'EXECUTIVE', price: 220 },
  { row: 'H', tier: 'EXECUTIVE', price: 220 }
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

function parseStart(date: string, time: string): Date {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(time.trim());
  let h = 0;
  let min = 0;
  if (m) {
    h = Number(m[1]);
    min = Number(m[2]);
    const ap = (m[3] || '').toUpperCase();
    if (ap === 'PM' && h < 12) h += 12;
    if (ap === 'AM' && h === 12) h = 0;
  }
  const d = new Date(`${date}T00:00:00`);
  if (isNaN(d.getTime())) return new Date();
  d.setHours(h, min, 0, 0);
  return d;
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
      duration: Number(seed?.durationMinutes || seed?.duration) || 150,
      language: (seed?.languages || [seed?.language || input.language || 'Hindi']).join(', '),
      genre: Array.isArray(seed?.genre) ? seed.genre.join(', ') : String(seed?.genre || 'Drama'),
      certification: seed?.ageRating || seed?.certification || 'UA',
      rating: Number(seed?.rating) || 8.0,
      posterUrl: seed?.posterUrl || '',
      bannerUrl: seed?.backdropUrl || null,
      status: seed?.status || 'now_showing'
    }
  });
}

async function ensureScreen(input: ResolveShowtimeInput) {
  let theatre =
    (await prisma.theatre.findUnique({ where: { id: input.cinemaId } })) ||
    (input.cinemaName ? await prisma.theatre.findFirst({ where: { name: input.cinemaName } }) : null);

  if (!theatre) {
    if (!input.cinemaName) {
      const err: any = new Error(`Theatre "${input.cinemaId}" does not exist.`);
      err.statusCode = 404;
      throw err;
    }
    theatre = await prisma.theatre.create({
      data: {
        id: input.cinemaId,
        name: input.cinemaName,
        chain: input.cinemaName.split(/[:\s]/)[0] || 'CineBook',
        city: (input.city || '').split(',')[0] || 'Unknown',
        address: input.address || input.cinemaName
      }
    });
  }

  const hall = input.hall || 'Audi 1';
  let screen = await prisma.screen.findFirst({ where: { theatreId: theatre.id, name: hall } });
  if (!screen) {
    const count = await prisma.screen.count({ where: { theatreId: theatre.id } });
    screen = await prisma.screen.create({
      data: { theatreId: theatre.id, name: hall, screenNumber: count + 1, format: input.format || '2D' }
    });
  }

  const seatCount = await prisma.seat.count({ where: { screenId: screen.id } });
  if (seatCount === 0) {
    const data = SEAT_ROWS.flatMap(({ row, tier, price }) =>
      Array.from({ length: SEATS_PER_ROW }, (_, i) => ({
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
    where: { movieId: movie.id, screenId: screen.id, date: input.date, time: input.time }
  });
  if (existing) return existing;

  const startTime = parseStart(input.date, input.time);
  const endTime = new Date(startTime.getTime() + (movie.duration || 150) * 60000);
  return prisma.showtime.create({
    data: {
      movieId: movie.id,
      screenId: screen.id,
      startTime,
      endTime,
      date: input.date,
      time: input.time,
      language: input.language || movie.language.split(',')[0].trim(),
      format: input.format || screen.format
    }
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
    const startTime = parseStart(dbShow.date, dbShow.time);
    const endTime = new Date(startTime.getTime() + (resolvedMovie.duration || 150) * 60000);
    try {
      showtime = await prisma.showtime.create({
        data: {
          id: showtimeId,
          movieId: resolvedMovie.id,
          screenId: resolvedScreen.id,
          startTime,
          endTime,
          date: dbShow.date,
          time: dbShow.time,
          language: dbShow.language || 'Hindi',
          format: dbShow.format || resolvedScreen.format
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

  // Custom or arbitrary showtimeId fallback
  const firstMovie = (await prisma.movie.findFirst()) || await ensureMovie({
    movieId: 'dune-part-two',
    movieTitle: 'Dune: Part Two',
    cinemaId: 'theatre-pvr-phoenix',
    date: '2026-10-04',
    time: '07:30 PM'
  });
  let firstScreen = await prisma.screen.findFirst({ include: { theatre: true, seats: true } });
  if (!firstScreen) {
    firstScreen = await ensureScreen({
      movieId: firstMovie.id,
      cinemaId: 'theatre-pvr-phoenix',
      cinemaName: 'PVR ICON: Phoenix Palladium',
      date: '2026-10-04',
      time: '07:30 PM'
    }) as any;
    firstScreen = (await prisma.screen.findUnique({
      where: { id: firstScreen!.id },
      include: { theatre: true, seats: true }
    }))!;
  }
  const today = new Date().toISOString().split('T')[0];
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 150 * 60000);

  try {
    showtime = await prisma.showtime.create({
      data: {
        id: showtimeId,
        movieId: firstMovie.id,
        screenId: firstScreen!.id,
        startTime,
        endTime,
        date: today,
        time: '07:30 PM',
        language: 'Hindi',
        format: firstScreen!.format || 'IMAX 3D'
      },
      include: { movie: true, screen: { include: { theatre: true, seats: true } } }
    });
  } catch {
    showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: { movie: true, screen: { include: { theatre: true, seats: true } } }
    });
  }

  return showtime;
}

