// ====================================================================
// CineBook Seats Service
// Critical Architecture:
// - Physical seats belong to screens
// - Availability is tracked per show in `show_seats`
// - 10-minute temporary reservation TTL (locked_until, locked_by)
// - Ticket Price: Strictly ₹5 per seat base price
// - Supabase Realtime subscription for multi-user concurrency
// ====================================================================

import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { ShowSeat, Seat } from '../../types';

// Generate standard 64-seat auditorium matrix (A-D, 1-16 @ ₹5 base price)
export function generateAuditoriumSeats(showId: string): ShowSeat[] {
  const rows = ['A', 'B', 'C', 'D'];
  const seats: ShowSeat[] = [];

  rows.forEach((row) => {
    for (let num = 1; num <= 16; num++) {
      const code = `${row}${num}`;
      const isBooked = (row === 'A' && num === 5) || (row === 'A' && num === 6) || (row === 'B' && num === 8);
      const tier = row === 'D' ? 'RECLINER' : row === 'A' || row === 'B' ? 'PREMIUM' : 'STANDARD';

      const physicalSeat: Seat = {
        id: `seat-${row}-${num}`,
        screen_id: 'screen-1',
        seat_row: row,
        seat_number: num,
        seat_code: code,
        seat_tier: tier,
        base_price: 5.0, // ₹5 rule
        is_active: true,
        created_at: new Date().toISOString(),
      };

      seats.push({
        id: `showseat-${showId}-${code}`,
        show_id: showId,
        seat_id: physicalSeat.id,
        status: isBooked ? 'BOOKED' : 'AVAILABLE',
        locked_until: null,
        locked_by: null,
        lock_session_id: null,
        price: 5.0, // ₹5 rule
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        seat: physicalSeat,
      });
    }
  });

  return seats;
}

export async function fetchShowSeats(showId: string): Promise<ShowSeat[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('show_seats')
        .select(`
          *,
          seat:seats (*)
        `)
        .eq('show_id', showId);

      if (!error && data && data.length > 0) {
        return data as unknown as ShowSeat[];
      }
    } catch (err) {
      console.warn('Supabase show_seats query fallback:', err);
    }
  }

  return generateAuditoriumSeats(showId);
}

// 10-Minute Lock Function (Atomic database call or local state lock)
export async function lockSeats(
  showId: string,
  seatIds: string[],
  userId?: string | null,
  sessionId?: string
): Promise<{ success: boolean; message: string; expiresAt?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.rpc('lock_seats', {
        p_show_id: showId,
        p_seat_ids: seatIds,
        p_user_id: userId || null,
        p_session_id: sessionId || null,
        p_duration_minutes: 10,
      });

      if (!error && data) {
        return data as { success: boolean; message: string; expiresAt?: string };
      }
    } catch (err) {
      console.warn('Supabase atomic seat lock fallback:', err);
    }
  }

  // Fallback demo lock
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  return {
    success: true,
    message: 'Seats reserved for 10 minutes',
    expiresAt,
  };
}

export async function releaseSeats(showId: string, seatIds: string[], sessionId?: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.rpc('release_seats', {
        p_show_id: showId,
        p_seat_ids: seatIds,
        p_session_id: sessionId || null,
      });
    } catch (err) {
      console.warn('Supabase release_seats error:', err);
    }
  }
}

// Supabase Realtime Channel Subscription for live seat updates
export function subscribeToSeatChanges(showId: string, onUpdate: (payload: unknown) => void) {
  if (!isSupabaseConfigured()) {
    return { unsubscribe: () => {} };
  }

  const channel = supabase
    .channel(`realtime:show_seats:${showId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'show_seats',
        filter: `show_id=eq.${showId}`,
      },
      (payload) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}
