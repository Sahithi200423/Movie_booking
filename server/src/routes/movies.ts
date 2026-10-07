import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { LANGUAGES, GENRES } from '../seedData.js';

const router = Router();

// GET /api/movies
router.get('/', (req: Request, res: Response) => {
  const { language, genre, city, status, search } = req.query;

  const movies = db.getMovies({
    language: language as string,
    genre: genre as string,
    city: city as string,
    status: status as string,
    search: search as string
  });

  return res.json({
    success: true,
    total: movies.length,
    movies,
    meta: {
      availableLanguages: LANGUAGES,
      availableGenres: GENRES
    }
  });
});

// GET /api/movies/meta/languages
router.get('/meta/languages', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    languages: LANGUAGES
  });
});

// GET /api/movies/meta/genres
router.get('/meta/genres', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    genres: GENRES
  });
});

// GET /api/movies/:id/reviews
router.get('/:id/reviews', (req: Request, res: Response) => {
  const reviews = db.getReviews(req.params.id);
  return res.json({
    success: true,
    total: reviews.length,
    reviews
  });
});

// POST /api/movies/:id/reviews (Submit movie review & rating)
router.post('/:id/reviews', (req: Request, res: Response) => {
  try {
    const { userName, rating, comment, userEmail } = req.body;
    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Review comment cannot be empty.' });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 10) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 10.' });
    }

    const review = db.addReview(req.params.id, {
      userName: userName || 'Verified Moviegoer',
      rating: numRating,
      comment,
      userEmail
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published.',
      review
    });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to submit review.'
    });
  }
});

// GET /api/movies/user/favorites
router.get('/user/favorites', (req: Request, res: Response) => {
  const user = req.query.user as string;
  if (!user) {
    return res.json({ success: true, favorites: [] });
  }
  const favorites = db.getUserFavorites(user);
  return res.json({ success: true, favorites });
});

// POST /api/movies/user/favorites (Toggle watchlist item)
router.post('/user/favorites', (req: Request, res: Response) => {
  const { user, movieId } = req.body;
  if (!user || !movieId) {
    return res.status(400).json({ success: false, message: 'user and movieId are required.' });
  }

  const result = db.toggleFavorite(user, movieId);
  return res.json({ success: true, ...result });
});

// GET /api/movies/:id
router.get('/:id', (req: Request, res: Response) => {
  const movie = db.getMovieById(req.params.id);
  if (!movie) {
    return res.status(404).json({ success: false, message: 'Movie not found' });
  }

  // Also include available showtimes and reviews for this movie
  const showtimes = db.getShowtimes(movie.id);
  const reviews = db.getReviews(movie.id);

  return res.json({
    success: true,
    movie,
    showtimes,
    reviews
  });
});

export default router;
