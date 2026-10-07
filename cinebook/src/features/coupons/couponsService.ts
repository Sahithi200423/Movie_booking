// ====================================================================
// CineBook Coupons & Pricing Calculation Service
// Rules:
// - Ticket Price: Strictly ₹5 per ticket
// - Total = (ticket_count * 5.00) - discount + applicable_charges
// ====================================================================

import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Coupon } from '../../types';

export const TICKET_PRICE_INR = 5.0; // ₹5 base price rule

export const FALLBACK_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'CINEBOOK5',
    description: 'Flat ₹1 welcome discount on movie tickets',
    discount_type: 'FIXED',
    discount_value: 1.0,
    min_subtotal: 5.0,
    max_discount: null,
    is_active: true,
    valid_from: '2026-01-01T00:00:00Z',
    valid_until: '2027-12-31T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c2',
    code: 'PREMIERE10',
    description: '10% instant discount on orders of ₹10 or more',
    discount_type: 'PERCENTAGE',
    discount_value: 10.0,
    min_subtotal: 10.0,
    max_discount: 2.0,
    is_active: true,
    valid_from: '2026-01-01T00:00:00Z',
    valid_until: '2027-12-31T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
  },
];

export async function validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; coupon?: Coupon; discount: number; message: string }> {
  let coupon: Coupon | undefined;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (!error && data) {
        coupon = data as Coupon;
      }
    } catch (err) {
      console.warn('Coupon Supabase lookup fallback:', err);
    }
  }

  if (!coupon) {
    coupon = FALLBACK_COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
  }

  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid or expired coupon code' };
  }

  if (subtotal < coupon.min_subtotal) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order amount of ₹${coupon.min_subtotal} required for this coupon`,
    };
  }

  let discount = 0;
  if (coupon.discount_type === 'FIXED') {
    discount = Math.min(coupon.discount_value, subtotal);
  } else {
    discount = (subtotal * coupon.discount_value) / 100;
    if (coupon.max_discount) {
      discount = Math.min(discount, coupon.max_discount);
    }
  }

  discount = Math.round(discount * 100) / 100;

  return {
    valid: true,
    coupon,
    discount,
    message: `Coupon applied: Saved ₹${discount}`,
  };
}

export interface PriceBreakdown {
  ticketCount: number;
  pricePerTicket: number;
  baseAmount: number;
  discountAmount: number;
  convenienceFee: number;
  taxAmount: number;
  totalAmount: number;
}

export function calculateBookingPrice(ticketCount: number, discountAmount = 0): PriceBreakdown {
  const pricePerTicket = TICKET_PRICE_INR; // ₹5
  const baseAmount = ticketCount * pricePerTicket;
  const convenienceFee = 0.0; // Stage 1 baseline
  const taxAmount = 0.0; // Stage 1 baseline
  const totalAmount = Math.max(0, baseAmount - discountAmount + convenienceFee + taxAmount);

  return {
    ticketCount,
    pricePerTicket,
    baseAmount,
    discountAmount,
    convenienceFee,
    taxAmount,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}
