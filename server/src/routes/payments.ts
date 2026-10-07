import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';

const router = Router();

// POST /api/payments/create-order - Create Razorpay/Stripe order with idempotency & seat locks
router.post('/create-order', paymentController.createPaymentOrder);

// POST /api/payments/verify - Client redirect payment verification
router.post('/verify', paymentController.verifyPayment);

// POST /api/payments/webhook - Webhook listener with HMAC SHA256 verification
router.post('/webhook', paymentController.handleWebhook);

export default router;
