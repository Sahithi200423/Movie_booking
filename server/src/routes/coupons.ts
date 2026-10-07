import { Router, Request, Response } from 'express';
import { db } from '../db.js';

const router = Router();

// GET /api/coupons - List active public promotions
router.get('/', (_req: Request, res: Response) => {
  const coupons = db.getCoupons();
  return res.json({
    success: true,
    total: coupons.length,
    coupons
  });
});

// POST /api/coupons/validate - Validate coupon code against subtotal
router.post('/validate', (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const numSubtotal = Number(subtotal) || 0;
    const result = db.validateCoupon(code, numSubtotal);

    return res.json({
      ...result
    });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Invalid coupon code.'
    });
  }
});

export default router;
