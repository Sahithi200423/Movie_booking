/**
 * CineBook V3 — Portfolio Demo Mode Configuration
 *
 * Explicit environment-controlled feature flag:
 * Defaults to TRUE (safe demo mode) unless explicitly configured as 'false' or '0'.
 * Ensures that portfolio deployments never initiate real payments or mutate production DB.
 */
export const IS_PORTFOLIO_DEMO_MODE: boolean =
  import.meta.env.VITE_PORTFOLIO_DEMO_MODE !== 'false' &&
  import.meta.env.VITE_PORTFOLIO_DEMO_MODE !== '0';

export const DEMO_NOTICE_TEXT = 'Portfolio Demo — No real tickets or payments are issued.';
export const DEMO_TICKET_WATERMARK = 'DEMO — NOT VALID FOR ENTRY';
export const DEMO_QR_LABEL = 'DEMO-PASS-NOT-FOR-ENTRY';
