import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { CITIES } from '../seedData.js';

const router = Router();

// GET /api/cinemas
router.get('/', (req: Request, res: Response) => {
  const { city } = req.query;
  const cinemas = db.getCinemas(city as string);

  return res.json({
    success: true,
    total: cinemas.length,
    cinemas
  });
});

// GET /api/cinemas/cities
router.get('/meta/cities', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    cities: CITIES
  });
});

// GET /api/cinemas/:id
router.get('/:id', (req: Request, res: Response) => {
  const cinemas = db.getCinemas();
  const cinema = cinemas.find(c => c.id === req.params.id);

  if (!cinema) {
    return res.status(404).json({ success: false, message: 'Cinema not found' });
  }

  const showtimes = db.getShowtimes(undefined, cinema.id);

  return res.json({
    success: true,
    cinema,
    showtimes
  });
});

export default router;
