// ====================================================================
// CineBook Admin Feature Service (Protected management interface)
// ====================================================================

import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Movie, Theatre, Booking } from '../../types';

export interface AdminDashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeMovies: number;
  totalTheatres: number;
}

export async function fetchAdminStats(): Promise<AdminDashboardStats> {
  if (isSupabaseConfigured()) {
    try {
      const [moviesRes, theatresRes, bookingsRes] = await Promise.all([
        supabase.from('movies').select('id', { count: 'exact', head: true }),
        supabase.from('theatres').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('total_amount'),
      ]);

      const totalRevenue =
        bookingsRes.data?.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0) || 0;

      return {
        totalBookings: bookingsRes.data?.length || 0,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        activeMovies: moviesRes.count || 0,
        totalTheatres: theatresRes.count || 0,
      };
    } catch (err) {
      console.warn('Admin stats fetch error:', err);
    }
  }

  return {
    totalBookings: 124,
    totalRevenue: 620.0, // 124 * ₹5
    activeMovies: 5,
    totalTheatres: 4,
  };
}

export async function addMovie(movie: Partial<Movie>): Promise<{ success: boolean; data?: Movie; error?: string }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('movies').insert([movie]).select().single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Movie };
  }
  return { success: true, data: { ...movie, id: `mov-${Date.now()}` } as Movie };
}

export async function addTheatre(theatre: Partial<Theatre>): Promise<{ success: boolean; data?: Theatre; error?: string }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('theatres').insert([theatre]).select().single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Theatre };
  }
  return { success: true, data: { ...theatre, id: `theatre-${Date.now()}` } as Theatre };
}

export async function fetchAllBookings(): Promise<Booking[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        show:shows (
          show_date, show_time,
          movie:movies (title),
          screen:screens (name, theatre:theatres(name))
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) return data as unknown as Booking[];
  }
  return [];
}
