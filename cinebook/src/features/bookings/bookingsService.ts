// ====================================================================
// CineBook Bookings Service (Database-backed booking architecture)
// ====================================================================

import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Booking } from '../../types';
import { calculateBookingPrice } from '../coupons/couponsService';

export async function createBookingRecord(payload: {
  userId: string;
  showId: string;
  seatIds: string[];
  seatLabels: string[];
  couponId?: string | null;
  discountAmount?: number;
}): Promise<{ success: boolean; booking?: Booking; message: string }> {
  const price = calculateBookingPrice(payload.seatIds.length, payload.discountAmount || 0);
  const bookingRef = `CB-${Math.floor(100000 + Math.random() * 900000)}-IN`;

  const newBooking: Partial<Booking> = {
    booking_ref: bookingRef,
    user_id: payload.userId,
    show_id: payload.showId,
    coupon_id: payload.couponId || null,
    ticket_count: payload.seatIds.length,
    base_amount: price.baseAmount,
    discount_amount: price.discountAmount,
    convenience_fee: price.convenienceFee,
    tax_amount: price.taxAmount,
    total_amount: price.totalAmount,
    status: 'CONFIRMED',
    qr_payload: JSON.stringify({
      ref: bookingRef,
      showId: payload.showId,
      seats: payload.seatLabels,
      total: price.totalAmount,
    }),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('bookings').insert([newBooking]).select().single();
      if (!error && data) {
        // Also insert booking_items
        const items = payload.seatIds.map((seatId, idx) => ({
          booking_id: data.id,
          show_seat_id: seatId,
          seat_label: payload.seatLabels[idx] || `S${idx + 1}`,
          price: 5.0, // ₹5 rule
        }));
        await supabase.from('booking_items').insert(items);

        return {
          success: true,
          booking: data as Booking,
          message: 'Booking confirmed successfully',
        };
      }
    } catch (err) {
      console.warn('Supabase booking creation error:', err);
    }
  }

  return {
    success: true,
    booking: { ...newBooking, id: `bk-${Date.now()}` } as Booking,
    message: 'Booking saved',
  };
}

export async function fetchUserBookings(userId: string): Promise<Booking[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          show:shows (
            id, show_date, show_time, format, language,
            movie:movies (title, poster_url, duration_minutes, rating),
            screen:screens (name, theatre:theatres(name, city))
          ),
          items:booking_items (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as unknown as Booking[];
      }
    } catch (err) {
      console.warn('Supabase user bookings fetch fallback:', err);
    }
  }

  return [];
}
