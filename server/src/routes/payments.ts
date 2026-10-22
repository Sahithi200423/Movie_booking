import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { enforceDemoModeGuard } from '../middleware/demoMode.js';

const router = Router();

// POST /api/payments/create-order - Create Razorpay/Stripe order with idempotency & seat locks
router.post('/create-order', enforceDemoModeGuard, paymentController.createPaymentOrder);

// POST /api/payments/verify - Client redirect payment verification
router.post('/verify', enforceDemoModeGuard, paymentController.verifyPayment);

// POST /api/payments/webhook - Webhook listener with HMAC SHA256 verification
router.post('/webhook', enforceDemoModeGuard, paymentController.handleWebhook);

export default router;
