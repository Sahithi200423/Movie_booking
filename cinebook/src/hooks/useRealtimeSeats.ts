// ====================================================================
// CineBook Realtime Seats Hook
// Subscribes to Supabase Realtime changes for show seats
// ====================================================================

import { useState, useEffect } from 'react';
import type { ShowSeat } from '../types';
import { fetchShowSeats, subscribeToSeatChanges } from '../features/seats/seatsService';

export function useRealtimeSeats(showId?: string) {
  const [seats, setSeats] = useState<ShowSeat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!showId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchShowSeats(showId).then((data) => {
      setSeats(data);
      setLoading(false);
    });

    // Subscribe to live seat changes (atomic hold/release broadcasts)
    const subscription = subscribeToSeatChanges(showId, () => {
      fetchShowSeats(showId).then(setSeats);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [showId]);

  return { seats, setSeats, loading };
}

export * from './useRealtimeSeats';
