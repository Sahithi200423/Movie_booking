import { Request, Response, NextFunction } from 'express';

/**
 * CineBook V3 — Environment-controlled Portfolio Demo Mode
 *
 * In Portfolio Demo Mode:
 * - Real payment order creation is strictly blocked.
 * - Payment signature verification & webhook mutations are blocked.
 * - Database booking creations and real refund requests are blocked.
 * - Production database records (Supabase PostgreSQL) cannot be created or altered.
 * - Fails closed: if PORTFOLIO_DEMO_MODE is not explicitly set to 'false' with legitimate
 *   non-sample credentials, Demo Mode is automatically enforced.
 */
export function isPortfolioDemoMode(): boolean {
  const envFlag = process.env.PORTFOLIO_DEMO_MODE;
  
  // If explicitly disabled with 'false' or '0', verify that real non-sample credentials exist
  if (envFlag === 'false' || envFlag === '0') {
    const key = process.env.RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (key && secret && key !== 'rzp_test_sampleKey' && secret !== 'sampleSecretKey') {
      return false;
    }
  }

  // Default to safe demo mode (fail-closed)
  return true;
}

/**
 * Express middleware to strictly block payment and booking mutation routes in Demo Mode.
 * Cannot be bypassed by query parameters, custom headers, or client-side flags.
 */
export function enforceDemoModeGuard(req: Request, res: Response, next: NextFunction) {
  if (isPortfolioDemoMode()) {
    return res.status(403).json({
      success: false,
      error: 'PORTFOLIO_DEMO_MODE_ACTIVE',
      message: 'Payment processing and database booking mutations are disabled in Portfolio Demo Mode. No real tickets, payments, or refunds are accepted.',
      isDemoMode: true
    });
  }
  next();
}
