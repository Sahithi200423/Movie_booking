import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Show } from '../../types';

export const FALLBACK_SHOWS: Show[] = [
  {
    id: 's1111111-1111-1111-1111-111111111111',
    movie_id: '10101010-1010-1010-1010-101010101010',
    screen_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    start_time: '2026-10-05T10:30:00Z',
    end_time: '2026-10-05T13:30:00Z',
    show_date: '2026-10-05',
    show_time: '10:30:00',
    language: 'Telugu',
    format: 'IMAX 3D',
    base_price: 5.0, // ₹5 rule
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 's2222222-2222-2222-2222-222222222222',
    movie_id: '10101010-1010-1010-1010-101010101010',
    screen_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    start_time: '2026-10-05T14:30:00Z',
    end_time: '2026-10-05T17:30:00Z',
    show_date: '2026-10-05',
    show_time: '14:30:00',
    language: 'Hindi',
    format: 'IMAX 3D',
    base_price: 5.0,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 's3333333-3333-3333-3333-333333333333',
    movie_id: '20202020-2020-2020-2020-202020202020',
    screen_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    start_time: '2026-10-05T18:45:00Z',
    end_time: '2026-10-05T21:30:00Z',
    show_date: '2026-10-05',
    show_time: '18:45:00',
    language: 'English',
    format: '2D',
    base_price: 5.0,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export async function fetchShowsForMovie(movieId: string, date?: string): Promise<Show[]> {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('shows')
        .select(`
          *,
          screen:screens (
            id, name, screen_number, format, sound_system,
            theatre:theatres (id, name, city, address)
          )
        `)
        .eq('movie_id', movieId)
        .eq('is_active', true)
        .order('start_time');

      if (date) {
        query = query.eq('show_date', date);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as unknown as Show[];
      }
    } catch (err) {
      console.warn('Supabase shows fetch fallback:', err);
    }
  }

  return FALLBACK_SHOWS.filter((s) => s.movie_id === movieId);
}
