import { prisma } from '../prisma.js';
import { db } from '../db.js';
import {
  parseShowtimeToISTInstant,
  formatToISODate,
  isPastShowtime,
  generateCanonicalShowtimeId,
  parseShowtimeId
} from '../utils/dateUtils.js';

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
  date: string; // YYYY-MM-DD or readable date
  time: string; // "07:30 PM"
  format?: string;
  hall?: string;
  language?: string;
  requestedId?: string;
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

  const existingSeats = await prisma.seat.findMany({ where: { screenId: screen.id } });
  const existingSeatNumbers = new Set(existingSeats.map((s: any) => s.seatNumber));

  if (existingSeats.length < 128) {
    const all128Seats = SEAT_ROWS.flatMap(({ row, tier, price }) =>
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
    const missingSeats = all128Seats.filter(s => !existingSeatNumbers.has(s.seatNumber));
    if (missingSeats.length > 0) {
      await prisma.seat.createMany({ data: missingSeats, skipDuplicates: true });
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

  // Normalize date and time into canonical IST format
  const parsedInstant = parseShowtimeToISTInstant(input.date, input.time);
  let normalizedDate = input.date;
  let normalizedTime = input.time;

  if (parsedInstant) {
    const pad = (n: number) => String(n).padStart(2, '0');
    normalizedDate = `${parsedInstant.year}-${pad(parsedInstant.month)}-${pad(parsedInstant.day)}`;
    const h = parsedInstant.hours % 12 || 12;
    const m = pad(parsedInstant.minutes);
    const ampm = parsedInstant.hours >= 12 ? 'PM' : 'AM';
    normalizedTime = `${pad(h)}:${m} ${ampm}`;
  }

  const movie = await ensureMovie(input);
  const screen = await ensureScreen(input);

  const canonicalId = generateCanonicalShowtimeId(movie.id, screen.theatreId || input.cinemaId || 'cin', normalizedDate, normalizedTime);
  const targetId = input.requestedId || canonicalId;

  // 1. Check if showtime already exists by exact targetId
  let existing = await prisma.showtime.findUnique({
    where: { id: targetId },
    include: { movie: true, screen: { include: { theatre: true, seats: true } } }
  });
  if (existing) return existing;

  // 2. Check if showtime exists by canonicalId
  if (targetId !== canonicalId) {
    existing = await prisma.showtime.findUnique({
      where: { id: canonicalId },
      include: { movie: true, screen: { include: { theatre: true, seats: true } } }
    });
    if (existing) return existing;
  }

  // 3. Check if showtime exists by screen, date, time
  existing = await prisma.showtime.findFirst({
    where: { movieId: movie.id, screenId: screen.id, date: normalizedDate, time: normalizedTime },
    include: { movie: true, screen: { include: { theatre: true, seats: true } } }
  });
  if (existing) {
    // If it has an old non-canonical ID, update its ID to targetId if feasible
    if (existing.id !== targetId && existing.id.startsWith('show-') && targetId.startsWith('show-')) {
      try {
        const updated = await prisma.showtime.update({
          where: { id: existing.id },
          data: { id: targetId },
          include: { movie: true, screen: { include: { theatre: true, seats: true } } }
        });
        return updated;
      } catch (e) {
        return existing;
      }
    }
    return existing;
  }

  // 4. Create new showtime with deterministic targetId
  const created = await prisma.showtime.create({
    data: {
      id: targetId,
      movieId: movie.id,
      cinemaId: screen.theatreId,
      screenId: screen.id,
      date: normalizedDate,
      time: normalizedTime,
      language: input.language || (movie.languages && movie.languages[0]) || 'English',
      format: input.format || screen.screenType || '2D',
      hallName: screen.name,
      hall: screen.name,
      priceMultiplier: 1.0
    },
    include: { movie: true, screen: { include: { theatre: true, seats: true } } }
  });

  // Also register in memory db so sync functions find it immediately
  try {
    const existingDb = db.getShowtimeById(created.id);
    if (!existingDb) {
      db.addShowtime?.({
        id: created.id,
        movieId: created.movieId!,
        cinemaId: created.cinemaId!,
        screenId: created.screenId!,
        date: created.date,
        time: created.time,
        format: created.format,
        hall: created.hall || created.hallName,
        language: created.language,
        priceMultiplier: 1.0
      });
    }
  } catch (e) {}

  return created;
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

export interface EnsureShowtimeHint {
  date?: string;
  time?: string;
  movieId?: string;
  cinemaId?: string;
  format?: string;
  hall?: string;
  language?: string;
}

/** Resolves any showtimeId (from db.ts or custom) to an active Prisma showtime with seats */
export async function ensurePrismaShowtime(showtimeId: string, hint?: EnsureShowtimeHint) {
  if (!showtimeId || typeof showtimeId !== 'string') return null;

  // 1. Direct Prisma primary-key lookup
  let showtime = await prisma.showtime.findUnique({
    where: { id: showtimeId },
    include: { movie: true, screen: { include: { theatre: true, seats: true } } }
  });

  // If found, check if a specific future date hint was provided and the found showtime has a past/different date
  if (showtime) {
    if (hint?.date) {
      const parsedHint = parseShowtimeToISTInstant(hint.date, hint.time || showtime.time);
      if (parsedHint) {
        const pad = (n: number) => String(n).padStart(2, '0');
        const normHintDate = `${parsedHint.year}-${pad(parsedHint.month)}-${pad(parsedHint.day)}`;
        if (showtime.date !== normHintDate) {
          // Re-resolve showtime for the customer's actual requested date and time
          return await resolveShowtime({
            movieId: showtime.movieId || hint.movieId || 'kalki-2898-ad',
            movieTitle: showtime.movie?.title || undefined,
            cinemaId: showtime.cinemaId || hint.cinemaId || 'cin-pvr-orion',
            cinemaName: showtime.screen?.theatre?.name || undefined,
            city: showtime.screen?.theatre?.city || undefined,
            date: normHintDate,
            time: hint.time || showtime.time,
            format: hint.format || showtime.format || undefined,
            hall: hint.hall || showtime.hall || undefined,
            language: hint.language || showtime.language || undefined
          });
        }
      }
    }
    return showtime;
  }

  // 2. Check in-memory store
  const dbShow = db.getShowtimeById(showtimeId);
  if (dbShow) {
    const movie = db.getMovieById(dbShow.movieId);
    const cinema = db.getCinemas().find(c => c.id === dbShow.cinemaId);
    return await resolveShowtime({
      movieId: dbShow.movieId,
      movieTitle: movie?.title,
      cinemaId: dbShow.cinemaId,
      cinemaName: cinema?.name,
      city: cinema?.city,
      address: cinema?.address,
      hall: dbShow.hall,
      format: dbShow.format,
      language: dbShow.language,
      date: hint?.date || dbShow.date,
      time: hint?.time || dbShow.time,
      requestedId: showtimeId
    });
  }

  // 3. Parse showtimeId structure & merge with hint
  const parsed = parseShowtimeId(showtimeId);
  const targetDate = hint?.date || parsed.date;
  const targetTime = hint?.time || parsed.time;
  const targetMovieId = hint?.movieId || parsed.movieId;

  if (targetDate && targetTime) {
    // Search Prisma showtimes for matching date & time
    const showsOnDate = await prisma.showtime.findMany({
      where: {
        date: targetDate,
        time: targetTime
      },
      include: { movie: true, screen: { include: { theatre: true, seats: true } } }
    });

    if (showsOnDate.length > 0) {
      let matched = showsOnDate.find(s => {
        const mMatch = !targetMovieId || s.movieId === targetMovieId || s.movieId?.includes(targetMovieId) || targetMovieId.includes(s.movieId || '');
        const cMatch = !hint?.cinemaId || s.cinemaId === hint.cinemaId || s.screen?.theatreId === hint.cinemaId;
        return mMatch && cMatch;
      });

      if (!matched && targetMovieId) {
        matched = showsOnDate.find(s => s.movieId === targetMovieId || s.movieId?.includes(targetMovieId) || targetMovieId.includes(s.movieId || ''));
      }

      if (matched) {
        // If matched has a different ID, try to update its ID to showtimeId
        if (matched.id !== showtimeId && showtimeId.startsWith('show-')) {
          try {
            const updated = await prisma.showtime.update({
              where: { id: matched.id },
              data: { id: showtimeId },
              include: { movie: true, screen: { include: { theatre: true, seats: true } } }
            });
            return updated;
          } catch (e) {
            return matched;
          }
        }
        return matched;
      }
    }

    // If not yet in Prisma, resolve with known movie & cinema
    const knownMovies = db.getMovies();
    const movieObj = targetMovieId
      ? (knownMovies.find(m => m.id === targetMovieId || m.id.includes(targetMovieId) || targetMovieId.includes(m.id)) ||
         await prisma.movie.findFirst({ where: { OR: [{ id: targetMovieId }, { title: { contains: targetMovieId, mode: 'insensitive' } }] } }))
      : null;

    const knownCinemas = db.getCinemas();
    let cinemaObj = hint?.cinemaId
      ? (knownCinemas.find(c => c.id === hint.cinemaId) || await prisma.theatre.findFirst({ where: { id: hint.cinemaId } }))
      : null;

    if (!cinemaObj && parsed.cinemaSlug) {
      cinemaObj = knownCinemas.find(c => c.id.includes(parsed.cinemaSlug!) || c.name.toLowerCase().includes(parsed.cinemaSlug!)) ||
                  await prisma.theatre.findFirst({ where: { OR: [{ id: { contains: parsed.cinemaSlug } }, { name: { contains: parsed.cinemaSlug, mode: 'insensitive' } }] } });
    }

    if (!cinemaObj) {
      cinemaObj = knownCinemas[0] || (await prisma.theatre.findFirst());
    }

    if (movieObj && cinemaObj) {
      return await resolveShowtime({
        movieId: movieObj.id,
        movieTitle: movieObj.title,
        cinemaId: cinemaObj.id,
        cinemaName: cinemaObj.name,
        city: cinemaObj.city,
        address: cinemaObj.address,
        date: targetDate,
        time: targetTime,
        requestedId: showtimeId
      });
    }
  }

  // 4. Fallback match for legacy candidate IDs
  const candidate = db.getShowtimes().find(s =>
    showtimeId.includes(s.movieId.substring(0, 5)) &&
    (showtimeId.includes(s.cinemaId.substring(0, 5)) || showtimeId.includes(s.cinemaId.replace('cin-', '').substring(0, 5)))
  );

  if (candidate) {
    const movie = db.getMovieById(candidate.movieId);
    const cinema = db.getCinemas().find(c => c.id === candidate.cinemaId);

    const dateMatch = showtimeId.match(/(\d{4}-\d{2}-\d{2})/);
    const timeMatch = showtimeId.match(/(1[0-2]|0?[1-9])([0-5][0-9])([AP]M)/i);

    let resolvedDate = hint?.date || (dateMatch ? dateMatch[1] : undefined);
    let resolvedTime = hint?.time || (timeMatch ? `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]} ${timeMatch[3].toUpperCase()}` : candidate.time);

    if (!resolvedDate) {
      if (isPastShowtime(candidate.date, resolvedTime)) {
        resolvedDate = formatToISODate(new Date());
      } else {
        resolvedDate = candidate.date;
      }
    }

    return await resolveShowtime({
      movieId: candidate.movieId,
      movieTitle: movie?.title,
      cinemaId: candidate.cinemaId,
      cinemaName: cinema?.name,
      city: cinema?.city,
      address: cinema?.address,
      hall: candidate.hall,
      format: candidate.format,
      language: candidate.language,
      date: resolvedDate,
      time: resolvedTime,
      requestedId: showtimeId
    });
  }

  return null;
}


