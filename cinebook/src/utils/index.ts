// ====================================================================
// CineBook Utility Functions
// ====================================================================

/**
 * Format currency in Indian Rupees (INR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate standard ₹5 ticket total
 */
export function calculateTicketsTotal(count: number, discount = 0): number {
  return Math.max(0, count * 5.0 - discount);
}

/**
 * Generate turnstile booking reference code
 */
export function generateBookingRef(): string {
  const code = Math.floor(100000 + Math.random() * 900000);
  return `CB-${code}-IN`;
}
