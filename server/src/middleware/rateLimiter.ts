import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import type { Request, Response } from 'express';

/**
 * CineBook Production Rate Limiting & Anti-Bot Protection Middleware
 * Built specifically for Render reverse proxy environment.
 */

export const getClientIp = (req: Request): string => {
  // Rely on Express trusted proxy resolution (app.set('trust proxy', 1)).
  // Express securely extracts the authentic client IP from the trusted reverse proxy hop,
  // preventing client-side header spoofing via custom X-Forwarded-For prefixes or CF-Connecting-IP headers.
  const rawIp = req.ip || req.socket?.remoteAddress || '127.0.0.1';
  try {
    return ipKeyGenerator(rawIp);
  } catch {
    return rawIp;
  }
};

// 1. General API baseline rate limiter (300 requests per minute)
export const globalApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req: Request) => req.path === '/api/health' || req.path === '/health',
  keyGenerator: (req: Request) => getClientIp(req),
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests from this IP. Please try again in a minute.'
  },
  validate: { trustProxy: false, keyGeneratorIpFallback: false }
});

// 2. Auth endpoints rate limiter (15 attempts per 15 minutes per IP + userKey)
// Keyed per IP + normalized email (prevents one user or bad login from blocking other users on same NAT)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const clientIp = getClientIp(req);
    const email = req.body?.email ? String(req.body.email).trim().toLowerCase() : '';
    const role = req.body?.role ? `role_${req.body.role}` : '';
    const userKey = email || role;
    return userKey ? `${clientIp}_${userKey}` : clientIp;
  },
  message: {
    success: false,
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    message: 'Too many authentication attempts for this account. Please try again after 15 minutes.'
  },
  validate: { trustProxy: false, keyGeneratorIpFallback: false }
});

// 2b. Auth IP-level hard cap (50 total attempts per 15 minutes per IP across all emails)
// Prevents credential stuffing / dictionary attacks where an attacker rotates email addresses from the same IP
export const authIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req: Request) => getClientIp(req),
  message: {
    success: false,
    code: 'AUTH_IP_LIMIT_EXCEEDED',
    message: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.'
  },
  validate: { trustProxy: false, keyGeneratorIpFallback: false }
});

// 3. Seat-locking rate limiter (60 requests per minute per session)
// Keyed per session/tab + IP so individual users can pick up to 8 seats or deselect without blocking others
export const seatLockLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const clientIp = getClientIp(req);
    const sessionId = req.body?.sessionId || (req.headers['x-session-id'] as string) || '';
    return sessionId ? `${clientIp}_${sessionId}` : clientIp;
  },
  message: {
    success: false,
    code: 'SEAT_LOCK_RATE_LIMIT_EXCEEDED',
    message: 'Too many seat selection requests. Please wait a moment before trying again.'
  },
  validate: { trustProxy: false, keyGeneratorIpFallback: false }
});

// 3b. Seat-locking IP-level hard cap (120 requests per minute per IP across all sessions)
// Prevents bots from bypassing seat limits by generating new random session IDs
export const seatLockIpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req: Request) => getClientIp(req),
  message: {
    success: false,
    code: 'SEAT_LOCK_IP_LIMIT_EXCEEDED',
    message: 'Too many seat selection requests from this IP. Please wait a moment.'
  },
  validate: { trustProxy: false, keyGeneratorIpFallback: false }
});

// 4. Payment order creation rate limiter (20 orders per 10 minutes per session/email)
// Prevents bot spam creating thousands of dangling Razorpay orders
export const paymentOrderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const clientIp = getClientIp(req);
    const sessionId = req.body?.sessionId || (req.headers['x-session-id'] as string) || '';
    const email = req.body?.customerEmail || req.body?.customerDetails?.email || req.body?.email || '';
    const userOrSession = sessionId || (email ? String(email).trim().toLowerCase() : '');
    return userOrSession ? `${clientIp}_${userOrSession}` : clientIp;
  },
  message: {
    success: false,
    code: 'PAYMENT_ORDER_RATE_LIMIT_EXCEEDED',
    message: 'Payment order creation limit exceeded. Please wait a few minutes before trying again.'
  },
  validate: { trustProxy: false, keyGeneratorIpFallback: false }
});

// 4b. Payment order creation IP-level hard cap (40 orders per 10 minutes per IP across all sessions)
// Prevents attackers from rotating session IDs or emails to flood order generation
export const paymentOrderIpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 40,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req: Request) => getClientIp(req),
  message: {
    success: false,
    code: 'PAYMENT_ORDER_IP_LIMIT_EXCEEDED',
    message: 'Too many payment order creations from this IP. Please wait a few minutes.'
  },
  validate: { trustProxy: false, keyGeneratorIpFallback: false }
});

// 5. Payment verification rate limiter (15 attempts per 10 minutes per order)
export const paymentVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const clientIp = getClientIp(req);
    const orderId = req.body?.orderId || req.body?.razorpay_order_id || '';
    return orderId ? `${clientIp}_${orderId}` : clientIp;
  },
  message: {
    success: false,
    code: 'PAYMENT_VERIFY_RATE_LIMIT_EXCEEDED',
    message: 'Payment verification limit exceeded. Please wait a few minutes before trying again.'
  },
  validate: { trustProxy: false, keyGeneratorIpFallback: false }
});

// 5b. Payment verification IP-level hard cap (30 attempts per 10 minutes per IP)
export const paymentVerifyIpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req: Request) => getClientIp(req),
  message: {
    success: false,
    code: 'PAYMENT_VERIFY_IP_LIMIT_EXCEEDED',
    message: 'Too many payment verification attempts from this IP. Please wait a few minutes.'
  },
  validate: { trustProxy: false, keyGeneratorIpFallback: false }
});

